'use client';

import { useState, useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import DrawingCanvas from '@/components/DrawingCanvas';
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
  overflow: hidden;
  
  @media (max-width: 768px) {
    flex-direction: column;
    overflow-y: auto;
    overflow-x: hidden;
  }
`;

const CanvasSection = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  overflow: hidden;
  max-height: 100%;
  
  @media (max-width: 768px) {
    flex: none;
    min-height: 0;
    height: auto;
    padding-bottom: 20px;
  }
  
  .canvas-wrapper {
    @media (max-width: 768px) {
      min-height: 400px;
      height: auto;
    }
  }
`;

const MultiviewSection = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #000;
  padding: 10px;
  
  @media (max-width: 768px) {
    flex: none;
    min-height: 0;
    padding: 20px;
  }
`;

const MultiviewGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr 1fr;
  gap: 4px;
  width: min(100%, 100vh - 200px);
  height: min(100%, 100vh - 200px);
  aspect-ratio: 1 / 1;
  
  @media (max-width: 768px) {
    width: 100%;
    height: auto;
    max-width: min(100%, 600px);
  }
`;

const MultiviewCell = styled.div<{ $bgColor: string }>`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${props => props.$bgColor};
  overflow: hidden;
  border-radius: 8px;
  width: 100%;
  aspect-ratio: 1 / 1;
`;

const MultiviewLabel = styled.div`
  position: absolute;
  top: 10px;
  left: 10px;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 5px 12px;
  border-radius: 6px;
  font-size: 0.9rem;
  font-weight: 700;
  z-index: 10;
`;

const MultiviewImage = styled.img`
  max-width: 100%;
  max-height: 100%;
  width: auto;
  height: auto;
  object-fit: contain;
  aspect-ratio: 1 / 1;
`;

const PlaceholderText = styled.div`
  color: rgba(255, 255, 255, 0.5);
  font-size: 1rem;
  text-align: center;
`;

const RoleSelector = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  gap: 30px;
  padding: 20px;
`;

const RoleButton = styled.button`
  padding: 30px 60px;
  background: rgba(255, 255, 255, 0.2);
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 15px;
  color: white;
  font-size: 1.5rem;
  font-weight: 600;
  font-family: inherit;
  cursor: pointer;
  transition: all 0.3s;
  
  &:hover {
    background: rgba(255, 255, 255, 0.3);
    transform: translateY(-3px);
    box-shadow: 0 10px 30px rgba(0,0,0,0.3);
  }
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

export default function DrawPage() {
  const [selectedGroup, setSelectedGroup] = useState('');
  const [socket, setSocket] = useState<Socket | null>(null);
  const [receivedDrawings, setReceivedDrawings] = useState<{
    'group-1': string | null,
    'group-2': string | null,
    'group-3': string | null,
    'group-4': string | null
  }>({
    'group-1': null,
    'group-2': null,
    'group-3': null,
    'group-4': null
  });
  const [canvasStatus, setCanvasStatus] = useState('✏️ Start drawing on the canvas');
  const clearTimeoutIdsRef = useRef<Record<string, NodeJS.Timeout>>({});

  const swarmId = 'default-swarm';

  const groupColors = {
    'group-1': '#d63384', // pink
    'group-2': '#dc2626', // red
    'group-3': '#f59e0b', // orange
    'group-4': '#10b981'  // green
  };

  const connectToSwarm = (group: string) => {
    const newSocket = io(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4444', {
      transports: ['polling', 'websocket'],
      path: '/socket.io/',
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
    });

    newSocket.on('connect', () => {
      console.log('✅ Connected to collaborative drawing');
      console.log('📡 Socket ID:', newSocket.id);
      console.log('🎨 Joining as:', group);
      newSocket.emit('join-swarm', {
        swarmId: swarmId,
        nickname: `Artist-${group}`,
        role: group
      });
    });

    newSocket.on('disconnect', () => {
      console.log('❌ Disconnected from server');
    });

    newSocket.on('connect_error', (error) => {
      console.error('❌ Connection error:', error);
    });

    // Listen for incoming drawings
    newSocket.on('receive-drawing', (data: { imageData: string, timestamp: number, fromGroup: string }) => {
      console.log('🎨 Drawing received from', data.fromGroup);
      
      // Clear any existing timeout for this group
      if (clearTimeoutIdsRef.current[data.fromGroup]) {
        clearTimeout(clearTimeoutIdsRef.current[data.fromGroup]);
      }
      
      // Update drawing for the specific group
      setReceivedDrawings(prev => ({
        ...prev,
        [data.fromGroup]: data.imageData
      }));
      
      // Set new timeout to clear after 30 seconds
      const newTimeoutId = setTimeout(() => {
        console.log('⏰ Clearing drawing from', data.fromGroup);
        setReceivedDrawings(prev => ({
          ...prev,
          [data.fromGroup]: null
        }));
        delete clearTimeoutIdsRef.current[data.fromGroup];
      }, 30000); // 30 seconds
      
      clearTimeoutIdsRef.current[data.fromGroup] = newTimeoutId;
    });

    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  };

  const handleGroupSelection = (group: string) => {
    setSelectedGroup(group);
    connectToSwarm(group);
  };

  useEffect(() => {
    return () => {
      if (socket) {
        socket.close();
      }
      // Clear all timeouts
      Object.values(clearTimeoutIdsRef.current).forEach(timeoutId => {
        clearTimeout(timeoutId);
      });
    };
  }, [socket]);

  if (!selectedGroup) {
    return (
      <RoleSelector>
        <Title style={{ fontSize: '2.5rem', textAlign: 'center' }}>🎨 Collaborative Drawing</Title>
        <PlaceholderText style={{ fontSize: '1.2rem', color: 'rgba(255,255,255,0.9)' }}>
          Select your group (4 participants max)
        </PlaceholderText>
        <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', justifyContent: 'center' }}>
          <RoleButton onClick={() => handleGroupSelection('group-1')}>
            Group 1
          </RoleButton>
          <RoleButton onClick={() => handleGroupSelection('group-2')}>
            Group 2
          </RoleButton>
          <RoleButton onClick={() => handleGroupSelection('group-3')}>
            Group 3
          </RoleButton>
          <RoleButton onClick={() => handleGroupSelection('group-4')}>
            Group 4
          </RoleButton>
        </div>
        <BackButton onClick={() => window.location.href = '/demos'}>
          ← Back to Demos
        </BackButton>
      </RoleSelector>
    );
  }

  return (
    <Container>
      <Header>
        <Title>
          🎨 Collaborative Drawing - You are {selectedGroup.replace('-', ' ').toUpperCase()}
        </Title>
        <BackButton onClick={() => window.location.href = '/demos'}>
          ← Back
        </BackButton>
      </Header>

      <Main>
        {/* Left Half: Your Drawing Canvas */}
        <CanvasSection>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            marginBottom: '15px',
            flexShrink: 0,
            flexWrap: 'wrap',
            gap: '10px'
          }}>
            <h2 style={{ color: 'white', margin: 0, fontSize: '1.3rem' }}>
              ✏️ Your Canvas {socket ? '🟢' : '🔴'}
            </h2>
            <div style={{
              color: 'rgba(255, 255, 255, 0.8)',
              fontSize: '0.9rem',
              padding: '6px 12px',
              background: 'rgba(0, 0, 0, 0.2)',
              borderRadius: '6px',
              border: '1px solid rgba(255, 255, 255, 0.2)'
            }}>
              {canvasStatus}
            </div>
          </div>
          {!socket && (
            <div style={{ padding: '10px', background: 'rgba(255,0,0,0.3)', borderRadius: '6px', marginBottom: '10px', color: 'white', flexShrink: 0 }}>
              ⚠️ Socket not connected. Waiting for connection...
            </div>
          )}
          <div style={{ 
            flex: 1, 
            display: 'flex', 
            minHeight: 0,
          }} className="canvas-wrapper">
            <DrawingCanvas
              socket={socket}
              targetAudience="all"
              swarmId={swarmId}
              onSend={() => console.log('✅ Drawing sent callback triggered!')}
              onStatusChange={setCanvasStatus}
            />
          </div>
        </CanvasSection>

        {/* Right Half: Multiview of Others' Drawings */}
        <MultiviewSection>
          <MultiviewGrid>
            {(['group-1', 'group-2', 'group-3', 'group-4'] as const).map((group) => {
              const hasDrawing = receivedDrawings[group];
              const isMe = group === selectedGroup;
              
              return (
                <MultiviewCell 
                  key={group}
                  $bgColor={isMe ? 'rgba(102, 126, 234, 0.3)' : groupColors[group]}
                >
                  <MultiviewLabel>
                    {group.replace('-', ' ').toUpperCase()}
                    {isMe && ' (You)'}
                  </MultiviewLabel>
                  
                  {hasDrawing ? (
                    <>
                      <MultiviewImage 
                        src={hasDrawing} 
                        alt={`Drawing from ${group}`}
                        key={`${group}-${hasDrawing.substring(0, 20)}`}
                        style={{ 
                          border: isMe ? '3px solid #4CAF50' : '2px solid rgba(255,255,255,0.3)',
                          opacity: isMe ? 0.8 : 1
                        }}
                      />
                      {isMe && (
                        <div style={{
                          position: 'absolute',
                          bottom: '8px',
                          right: '8px',
                          background: '#4CAF50',
                          color: 'white',
                          padding: '5px 10px',
                          borderRadius: '6px',
                          fontSize: '0.75rem',
                          fontWeight: 'bold',
                          boxShadow: '0 2px 8px rgba(0,0,0,0.3)'
                        }}>
                          ✓ Your Drawing
                        </div>
                      )}
                    </>
                  ) : (
                    <PlaceholderText>
                      {isMe ? 'Draw and send to see your drawing here' : `Waiting for ${group}...`}
                    </PlaceholderText>
                  )}
                </MultiviewCell>
              );
            })}
          </MultiviewGrid>
        </MultiviewSection>
      </Main>
    </Container>
  );
}
