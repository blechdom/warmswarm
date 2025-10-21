/**
 * Synced Audio Recorder Component
 * 
 * Records audio and sends it to all devices in the swarm
 * with synchronized playback timing.
 */

'use client';

import React, { useState, useRef, useCallback } from 'react';
import styled from 'styled-components';
import { useSyncedAudio } from '@/hooks/useSyncedAudio';
import { Socket } from 'socket.io-client';

const Container = styled.div`
  background: rgba(255, 255, 255, 0.95);
  border-radius: 15px;
  padding: 20px;
  margin: 20px 0;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h3`
  margin: 0 0 15px 0;
  color: #333;
  font-size: 1.1rem;
  display: flex;
  align-items: center;
  gap: 10px;
`;

const Controls = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 15px;
`;

const Button = styled.button<{ $variant?: 'primary' | 'danger' | 'success' }>`
  padding: 12px 24px;
  border: none;
  border-radius: 25px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 0.95rem;
  
  background: ${props => {
    switch(props.$variant) {
      case 'danger': return '#e74c3c';
      case 'success': return '#2ecc71';
      default: return '#667eea';
    }
  }};
  color: white;
  
  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const Status = styled.div<{ $type?: 'info' | 'warning' | 'success' }>`
  padding: 10px 15px;
  border-radius: 10px;
  font-size: 0.9rem;
  background: ${props => {
    switch(props.$type) {
      case 'warning': return 'rgba(241, 196, 15, 0.1)';
      case 'success': return 'rgba(46, 204, 113, 0.1)';
      default: return 'rgba(102, 126, 234, 0.1)';
    }
  }};
  color: ${props => {
    switch(props.$type) {
      case 'warning': return '#f1c40f';
      case 'success': return '#2ecc71';
      default: return '#667eea';
    }
  }};
  margin-top: 10px;
`;

const SyncInfo = styled.div`
  display: flex;
  gap: 15px;
  margin-top: 10px;
  font-size: 0.85rem;
  color: #666;
`;

const SyncBadge = styled.span<{ $good?: boolean }>`
  background: ${props => props.$good ? 'rgba(46, 204, 113, 0.1)' : 'rgba(241, 196, 15, 0.1)'};
  color: ${props => props.$good ? '#2ecc71' : '#f1c40f'};
  padding: 4px 10px;
  border-radius: 12px;
  font-weight: 500;
`;

interface Props {
  socket: Socket | null;
  swarmId: string;
}

export default function SyncedAudioRecorder({ socket, swarmId }: Props) {
  const { sendSyncedAudio, timeSync, isReady } = useSyncedAudio(socket, swarmId);
  const [isRecording, setIsRecording] = useState(false);
  const [status, setStatus] = useState('');
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  
  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        } 
      });
      
      // Use webm with opus codec for best quality/size
      const mimeType = MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
        ? 'audio/webm;codecs=opus'
        : 'audio/webm';
      
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType,
        audioBitsPerSecond: 128000,
      });
      
      chunksRef.current = [];
      
      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };
      
      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(chunksRef.current, { type: mimeType });
        setStatus(`Sending ${(audioBlob.size / 1024).toFixed(1)}KB audio...`);
        
        // Send with 1 second buffer for network propagation
        await sendSyncedAudio(audioBlob, 1000);
        
        setStatus('Audio sent! Playing on all devices simultaneously.');
        setTimeout(() => setStatus(''), 3000);
        
        // Stop all tracks
        stream.getTracks().forEach(track => track.stop());
      };
      
      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start();
      setIsRecording(true);
      setStatus('Recording... (max 10 seconds)');
      
      // Auto-stop after 10 seconds
      setTimeout(() => {
        if (mediaRecorderRef.current?.state === 'recording') {
          stopRecording();
        }
      }, 10000);
      
    } catch (error) {
      console.error('Error starting recording:', error);
      setStatus('Error: Could not access microphone');
    }
  }, [sendSyncedAudio]);
  
  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  }, []);
  
  const syncQuality = timeSync.rtt < 50 ? 'good' : timeSync.rtt < 100 ? 'ok' : 'poor';
  
  return (
    <Container>
      <Title>
        🎙️ Synchronized Audio
      </Title>
      
      <Controls>
        {!isRecording ? (
          <Button 
            onClick={startRecording} 
            disabled={!isReady || !socket}
            $variant="primary"
          >
            Record & Send
          </Button>
        ) : (
          <Button 
            onClick={stopRecording}
            $variant="danger"
          >
            Stop Recording
          </Button>
        )}
      </Controls>
      
      {status && (
        <Status $type={status.includes('Error') ? 'warning' : status.includes('sent') ? 'success' : 'info'}>
          {status}
        </Status>
      )}
      
      {isReady && (
        <SyncInfo>
          <div>
            <strong>Time Sync:</strong>{' '}
            <SyncBadge $good={syncQuality === 'good'}>
              {timeSync.offset > 0 ? '+' : ''}{timeSync.offset}ms offset
            </SyncBadge>
          </div>
          <div>
            <strong>Latency:</strong>{' '}
            <SyncBadge $good={timeSync.rtt < 50}>
              {timeSync.rtt}ms RTT
            </SyncBadge>
          </div>
        </SyncInfo>
      )}
      
      {!isReady && (
        <Status $type="warning">
          Initializing audio system...
        </Status>
      )}
    </Container>
  );
}

