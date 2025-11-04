'use client';

import { useState, useEffect } from 'react';
import { io, Socket } from 'socket.io-client';
import DrawingCanvasShared from '@/components/DrawingCanvasShared';
import styled from 'styled-components';

const Container = styled.div`
  min-height: 100vh;
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: #000;
  font-family: 'Quantico', Arial, Helvetica, sans-serif;
  overflow: hidden;
`;

const Header = styled.div`
  padding: 15px 20px;
  background: rgba(102, 126, 234, 0.9);
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 15px;
`;

const Title = styled.h1`
  color: white;
  font-size: 1.5rem;
  margin: 0;
  font-weight: 700;
`;

const Main = styled.main`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  padding: 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
`;

const CanvasContainer = styled.div`
  width: 100%;
  max-width: 1200px;
  height: 100%;
  display: flex;
  flex-direction: column;
`;

const BackButton = styled.button`
  color: white;
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.3);
  padding: 10px 20px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background: rgba(0, 0, 0, 0.5);
  }
`;

const StatusIndicator = styled.div`
  color: rgba(255, 255, 255, 0.9);
  font-size: 0.9rem;
  padding: 8px 16px;
  background: rgba(0, 0, 0, 0.3);
  borderRadius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  gap: 8px;
`;

export default function DrawSharedPage() {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [canvasStatus, setCanvasStatus] = useState('✏️ Draw on the shared canvas');
  const [participantCount, setParticipantCount] = useState(0);

  const swarmId = 'shared-canvas-swarm';

  useEffect(() => {
    const newSocket = io(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4444', {
      transports: ['polling', 'websocket'],
      path: '/socket.io/',
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
    });

    newSocket.on('connect', () => {
      console.log('✅ Connected to shared canvas');
      console.log('📡 Socket ID:', newSocket.id);
      console.log('🎨 Swarm ID:', swarmId);
      newSocket.emit('join-swarm', {
        swarmId: swarmId,
        nickname: `Artist-${newSocket.id?.substring(0, 6)}`,
        role: 'shared'
      });
      console.log('📨 Sent join-swarm event');
      
      // Request participant count after joining
      setTimeout(() => {
        console.log('🔍 Requesting participant count...');
        newSocket.emit('request-participant-count', { swarmId, role: 'shared' });
      }, 500);
    });

    newSocket.on('disconnect', () => {
      console.log('❌ Disconnected from server');
    });

    newSocket.on('connect_error', (error) => {
      console.error('❌ Connection error:', error);
    });

    // Listen for participant count updates
    newSocket.on('participant-count', (count: number) => {
      console.log('👥 Received participant count update:', count, 'previous:', participantCount);
      setParticipantCount(count);
    });
    
    // Debug: log all socket events
    newSocket.onAny((eventName, ...args) => {
      console.log('🔔 Socket event:', eventName, args);
    });

    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, []);

  return (
    <Container>
      <Header>
        <Title>
          🖼️ Shared Canvas {socket ? '🟢' : '🔴'}
        </Title>
        <StatusIndicator>
          👥 {participantCount} {participantCount === 1 ? 'person' : 'people'} drawing
        </StatusIndicator>
        <BackButton onClick={() => window.location.href = '/'}>
          ← Back to Home
        </BackButton>
      </Header>

      <Main>
        <CanvasContainer>
          
          {!socket && (
            <div style={{ 
              padding: '15px', 
              background: 'rgba(255,0,0,0.3)', 
              borderRadius: '8px', 
              color: 'white',
              flexShrink: 0
            }}>
              ⚠️ Connecting to shared canvas...
            </div>
          )}
          
          <div style={{ 
            flex: 1, 
            display: 'flex', 
            minHeight: 0,
          }}>
            <DrawingCanvasShared
              socket={socket}
              swarmId={swarmId}
              onStatusChange={setCanvasStatus}
            />
          </div>
        </CanvasContainer>
      </Main>
    </Container>
  );
}

