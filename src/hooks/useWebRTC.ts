'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';

interface SwarmParticipant {
  socketId: string;
  nickname: string;
}

interface SwarmMessage {
  message: string;
  nickname: string;
  timestamp: string;
}

interface WebRTCConnection {
  peerConnection: RTCPeerConnection;
  dataChannel?: RTCDataChannel;
  nickname: string;
}

const ICE_SERVERS = [
  { urls: 'stun:stun.l.google.com:19302' },
  { urls: 'stun:stun1.l.google.com:19302' },
];

export const useWebRTC = (swarmId: string, nickname: string) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [participants, setParticipants] = useState<SwarmParticipant[]>([]);
  const [messages, setMessages] = useState<SwarmMessage[]>([]);
  const [connected, setConnected] = useState(false);
  const [connecting, setConnecting] = useState(false);
  
  const connectionsRef = useRef<Map<string, WebRTCConnection>>(new Map());
  const localStreamRef = useRef<MediaStream | null>(null);

  // Initialize socket connection
  useEffect(() => {
    if (!swarmId || !nickname) return;

    setConnecting(true);
    const newSocket = io(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4444');
    
    newSocket.on('connect', () => {
      console.log('Connected to server');
      setConnected(true);
      setConnecting(false);
      newSocket.emit('join-swarm', { swarmId, nickname });
    });

    newSocket.on('disconnect', () => {
      console.log('Disconnected from server');
      setConnected(false);
    });

    // Handle swarm events
    newSocket.on('swarm-participants', (participantList: SwarmParticipant[]) => {
      console.log('Current participants:', participantList);
      setParticipants(participantList);
      
      // Create WebRTC connections for existing participants
      participantList.forEach(participant => {
        createPeerConnection(participant.socketId, participant.nickname, true);
      });
    });

    newSocket.on('user-joined', ({ nickname: newUserNickname, socketId }: { nickname: string; socketId: string }) => {
      console.log(`${newUserNickname} joined the swarm`);
      setParticipants(prev => [...prev, { socketId, nickname: newUserNickname }]);
    });

    newSocket.on('user-left', ({ nickname: leftUserNickname, socketId }: { nickname: string; socketId: string }) => {
      console.log(`${leftUserNickname} left the swarm`);
      setParticipants(prev => prev.filter(p => p.socketId !== socketId));
      
      // Clean up WebRTC connection
      const connection = connectionsRef.current.get(socketId);
      if (connection) {
        connection.peerConnection.close();
        connectionsRef.current.delete(socketId);
      }
    });

    newSocket.on('swarm-message', (msg: SwarmMessage) => {
      setMessages(prev => [...prev, msg]);
    });

    // WebRTC signaling events
    newSocket.on('webrtc-offer', async ({ fromSocketId, fromNickname, offer }) => {
      console.log(`Received offer from ${fromNickname}`);
      const connection = await createPeerConnection(fromSocketId, fromNickname, false);
      
      await connection.peerConnection.setRemoteDescription(offer);
      const answer = await connection.peerConnection.createAnswer();
      await connection.peerConnection.setLocalDescription(answer);
      
      newSocket.emit('webrtc-answer', { targetSocketId: fromSocketId, answer });
    });

    newSocket.on('webrtc-answer', async ({ fromSocketId, answer }) => {
      console.log(`Received answer from socket ${fromSocketId}`);
      const connection = connectionsRef.current.get(fromSocketId);
      if (connection) {
        await connection.peerConnection.setRemoteDescription(answer);
      }
    });

    newSocket.on('webrtc-ice-candidate', async ({ fromSocketId, candidate }) => {
      console.log(`Received ICE candidate from socket ${fromSocketId}`);
      const connection = connectionsRef.current.get(fromSocketId);
      if (connection && candidate) {
        await connection.peerConnection.addIceCandidate(candidate);
      }
    });

    setSocket(newSocket);

    return () => {
      // Clean up all peer connections
      connectionsRef.current.forEach(connection => {
        connection.peerConnection.close();
      });
      connectionsRef.current.clear();
      
      // Clean up local stream
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach(track => track.stop());
      }
      
      newSocket.close();
    };
  }, [swarmId, nickname]);

  const createPeerConnection = async (socketId: string, peerNickname: string, initiator: boolean): Promise<WebRTCConnection> => {
    console.log(`Creating peer connection with ${peerNickname} (initiator: ${initiator})`);
    
    const peerConnection = new RTCPeerConnection({ iceServers: ICE_SERVERS });
    let dataChannel: RTCDataChannel | undefined;

    // Create data channel for direct messaging (initiator only)
    if (initiator) {
      dataChannel = peerConnection.createDataChannel('messages', {
        ordered: true
      });
      
      dataChannel.onopen = () => {
        console.log(`Data channel opened with ${peerNickname}`);
      };
      
      dataChannel.onmessage = (event) => {
        const msg: SwarmMessage = JSON.parse(event.data);
        setMessages(prev => [...prev, msg]);
      };
    } else {
      // Listen for incoming data channel
      peerConnection.ondatachannel = (event) => {
        dataChannel = event.channel;
        dataChannel.onmessage = (event) => {
          const msg: SwarmMessage = JSON.parse(event.data);
          setMessages(prev => [...prev, msg]);
        };
      };
    }

    // Handle ICE candidates
    peerConnection.onicecandidate = (event) => {
      if (event.candidate && socket) {
        socket.emit('webrtc-ice-candidate', {
          targetSocketId: socketId,
          candidate: event.candidate
        });
      }
    };

    // Handle connection state changes
    peerConnection.onconnectionstatechange = () => {
      console.log(`Connection state with ${peerNickname}: ${peerConnection.connectionState}`);
    };

    const connection: WebRTCConnection = {
      peerConnection,
      dataChannel,
      nickname: peerNickname
    };

    connectionsRef.current.set(socketId, connection);

    // If initiator, create and send offer
    if (initiator && socket) {
      const offer = await peerConnection.createOffer();
      await peerConnection.setLocalDescription(offer);
      
      socket.emit('webrtc-offer', { targetSocketId: socketId, offer });
    }

    return connection;
  };

  const sendMessage = useCallback((message: string) => {
    if (!socket || !message.trim()) return;

    const msg: SwarmMessage = {
      message: message.trim(),
      nickname,
      timestamp: new Date().toISOString()
    };

    // Add to local messages immediately
    setMessages(prev => [...prev, msg]);

    // Send via WebSocket (fallback and to non-WebRTC users)
    socket.emit('swarm-message', { message: message.trim() });

    // Send via WebRTC data channels for lower latency
    connectionsRef.current.forEach(connection => {
      if (connection.dataChannel && connection.dataChannel.readyState === 'open') {
        connection.dataChannel.send(JSON.stringify(msg));
      }
    });
  }, [socket, nickname]);

  return {
    connected,
    connecting,
    participants,
    messages,
    sendMessage
  };
};