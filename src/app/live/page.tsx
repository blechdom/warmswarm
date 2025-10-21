'use client';

import { useState, useEffect, useRef, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import styled from 'styled-components';
import { useWebRTC } from '@/hooks/useWebRTC';

const Container = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #d63384 0%, #d946ef 50%, #dc2626 100%);
  display: flex;
  flex-direction: column;
  padding: 20px;
`;

const Header = styled.header`
  background: rgba(255, 255, 255, 0.1);
  padding: 20px;
  border-radius: 15px;
  margin-bottom: 20px;
  backdrop-filter: blur(10px);
`;

const SwarmTitle = styled.h1`
  color: white;
  margin: 0 0 10px 0;
  font-size: 2rem;
  font-weight: 700;
`;

const SwarmInfo = styled.div`
  color: rgba(255, 255, 255, 0.9);
  font-size: 1rem;
`;

const ConnectionStatus = styled.div<{ connected: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  margin-top: 10px;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 0.9rem;
  background: ${props => props.connected ? 'rgba(46, 204, 113, 0.2)' : 'rgba(231, 76, 60, 0.2)'};
  color: ${props => props.connected ? '#2ecc71' : '#e74c3c'};
`;

const StatusDot = styled.div<{ connected: boolean }>`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${props => props.connected ? '#2ecc71' : '#e74c3c'};
  animation: ${props => props.connected ? 'pulse 1.5s infinite' : 'none'};
  
  @keyframes pulse {
    0% { opacity: 1; }
    50% { opacity: 0.5; }
    100% { opacity: 1; }
  }
`;

const MainContent = styled.main`
  flex: 1;
  display: flex;
  gap: 20px;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
`;

const ChatSection = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 15px;
  overflow: hidden;
`;

const ParticipantsPanel = styled.div`
  width: 300px;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 15px;
  padding: 20px;
  
  @media (max-width: 768px) {
    width: 250px;
  }
`;

const ParticipantsTitle = styled.h3`
  margin: 0 0 15px 0;
  color: #333;
  font-size: 1.2rem;
`;

const ParticipantsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const Participant = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: rgba(255, 255, 255, 0.7);
  border-radius: 10px;
  border: 1px solid rgba(0, 0, 0, 0.1);
`;

const ParticipantAvatar = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: linear-gradient(45deg, #667eea, #764ba2);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  font-size: 0.9rem;
`;

const ParticipantName = styled.div`
  font-weight: 500;
  color: #333;
`;

const MessagesArea = styled.div`
  flex: 1;
  padding: 20px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const Message = styled.div<{ isOwn: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: ${props => props.isOwn ? 'flex-end' : 'flex-start'};
`;

const MessageBubble = styled.div<{ isOwn: boolean }>`
  max-width: 70%;
  padding: 12px 16px;
  border-radius: 18px;
  background: ${props => props.isOwn ? '#667eea' : '#f1f1f1'};
  color: ${props => props.isOwn ? 'white' : '#333'};
  word-wrap: break-word;
`;

const MessageMeta = styled.div`
  font-size: 0.8rem;
  color: #666;
  margin-top: 4px;
`;

const MessageInput = styled.div`
  padding: 20px;
  border-top: 1px solid rgba(0, 0, 0, 0.1);
  background: white;
`;

const InputContainer = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
`;

const TextInput = styled.input`
  flex: 1;
  padding: 12px 16px;
  border: 1px solid #ddd;
  border-radius: 25px;
  font-size: 1rem;
  outline: none;
  
  &:focus {
    border-color: #667eea;
    box-shadow: 0 0 0 2px rgba(102, 126, 234, 0.2);
  }
`;

const SendButton = styled.button`
  padding: 12px 24px;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 25px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.225s ease;
  
  &:hover {
    background: #5a6fd8;
    transform: translateY(-1px);
  }
  
  &:disabled {
    background: #ccc;
    cursor: not-allowed;
    transform: none;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  color: #666;
  font-style: italic;
  padding: 40px;
`;

function LiveSwarmContent() {
  const searchParams = useSearchParams();
  const swarmId = searchParams.get('swarmId');
  const swarmName = searchParams.get('swarmName');
  const [nickname, setNickname] = useState('');
  const [message, setMessage] = useState('');
  const [joined, setJoined] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const {
    connected,
    connecting,
    participants,
    messages,
    sendMessage
  } = useWebRTC(joined ? swarmId || '' : '', nickname);

  useEffect(() => {
    // Get nickname from localStorage or prompt
    const storedNickname = localStorage.getItem('swarm-nickname');
    if (storedNickname) {
      setNickname(storedNickname);
      setJoined(true);
    } else {
      const promptNickname = prompt('Enter your nickname:');
      if (promptNickname) {
        setNickname(promptNickname);
        localStorage.setItem('swarm-nickname', promptNickname);
        setJoined(true);
      }
    }
  }, []);

  useEffect(() => {
    // Auto-scroll to bottom when new messages arrive
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = () => {
    if (message.trim()) {
      sendMessage(message);
      setMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  if (!joined || !swarmId) {
    return (
      <Container>
        <div style={{ textAlign: 'center', color: 'white', marginTop: '100px' }}>
          <h2>Joining swarm...</h2>
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <Header>
        <SwarmTitle>{swarmName || 'Live Swarm'}</SwarmTitle>
        <SwarmInfo>
          Real-time coordination • {participants.length + 1} participants
        </SwarmInfo>
        <ConnectionStatus connected={connected}>
          <StatusDot connected={connected} />
          {connecting ? 'Connecting...' : connected ? 'Connected' : 'Disconnected'}
        </ConnectionStatus>
      </Header>

      <MainContent>
        <ChatSection>
          <MessagesArea>
            {messages.length === 0 ? (
              <EmptyState>
                No messages yet. Start the conversation!
              </EmptyState>
            ) : (
              messages.map((msg, index) => (
                <Message key={index} isOwn={msg.nickname === nickname}>
                  <MessageBubble isOwn={msg.nickname === nickname}>
                    {msg.message}
                  </MessageBubble>
                  <MessageMeta>
                    {msg.nickname} • {formatTime(msg.timestamp)}
                  </MessageMeta>
                </Message>
              ))
            )}
            <div ref={messagesEndRef} />
          </MessagesArea>

          <MessageInput>
            <InputContainer>
              <TextInput
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type a message..."
                disabled={!connected}
              />
              <SendButton 
                onClick={handleSendMessage}
                disabled={!connected || !message.trim()}
              >
                Send
              </SendButton>
            </InputContainer>
          </MessageInput>
        </ChatSection>

        <ParticipantsPanel>
          <ParticipantsTitle>Participants</ParticipantsTitle>
          <ParticipantsList>
            {/* Current user */}
            <Participant>
              <ParticipantAvatar>
                {nickname.charAt(0).toUpperCase()}
              </ParticipantAvatar>
              <ParticipantName>{nickname} (you)</ParticipantName>
            </Participant>
            
            {/* Other participants */}
            {participants.map((participant) => (
              <Participant key={participant.socketId}>
                <ParticipantAvatar>
                  {participant.nickname.charAt(0).toUpperCase()}
                </ParticipantAvatar>
                <ParticipantName>{participant.nickname}</ParticipantName>
              </Participant>
            ))}
          </ParticipantsList>
        </ParticipantsPanel>
      </MainContent>
    </Container>
  );
}

export default function LiveSwarmPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LiveSwarmContent />
    </Suspense>
  );
}