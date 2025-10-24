'use client';

import { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { io, Socket } from 'socket.io-client';
import MainMenu from '@/components/MainMenu';

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
  font-family: 'Quantico', Arial, Helvetica, sans-serif;
  padding: 20px;
  box-sizing: border-box;
`;

const Header = styled.header`
  text-align: center;
  padding: 20px 20px 10px;
`;

const Logo = styled.h1`
  font-size: 2rem;
  color: white;
  margin: 0 0 5px 0;
  font-weight: 700;
  text-shadow: 0 2px 20px rgba(0,0,0,0.3);
  
  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
`;

const Tagline = styled.p`
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.9);
  margin: 0;
  font-weight: 300;
`;

const Main = styled.main`
  flex: 1;
  display: flex;
  justify-content: center;
  padding: 10px;
  padding-bottom: 20px;
`;

const ContentContainer = styled.div`
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 20px;
  padding: 0;
  max-width: 1000px;
  width: 100%;
  display: flex;
  flex-direction: column;
  height: calc(100vh - 180px);
  max-height: 700px;
  overflow: hidden;
  
  @media (max-width: 768px) {
    height: calc(100vh - 150px);
  }
`;

const TabBar = styled.div`
  display: flex;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  background: rgba(0, 0, 0, 0.1);
`;

const Tab = styled.button<{ $active: boolean }>`
  flex: 1;
  padding: 12px;
  background: ${props => props.$active ? 'rgba(255, 255, 255, 0.2)' : 'transparent'};
  color: white;
  border: none;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: inherit;
  border-bottom: 3px solid ${props => props.$active ? 'white' : 'transparent'};
  
  &:hover {
    background: rgba(255, 255, 255, 0.15);
  }
  
  @media (max-width: 768px) {
    padding: 10px;
    font-size: 0.9rem;
  }
`;

const TabContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 15px;
  overflow: hidden;
  
  @media (max-width: 768px) {
    padding: 12px;
  }
`;

const ChatContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`;

const MessagesArea = styled.div`
  flex: 1;
  overflow-y: auto;
  margin-bottom: 12px;
  padding: 10px;
  background: rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 3px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.3);
    border-radius: 3px;
    
    &:hover {
      background: rgba(255, 255, 255, 0.4);
    }
  }
`;

const Message = styled.div<{ $isOwn?: boolean }>`
  margin-bottom: 10px;
  text-align: ${props => props.$isOwn ? 'right' : 'left'};
`;

const MessageNickname = styled.div`
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 5px;
  font-weight: 600;
`;

const MessageBubble = styled.div<{ $isOwn?: boolean }>`
  display: inline-block;
  background: ${props => props.$isOwn ? 'rgba(255, 255, 255, 0.3)' : 'rgba(255, 255, 255, 0.2)'};
  color: white;
  padding: 8px 12px;
  border-radius: 12px;
  max-width: 70%;
  word-wrap: break-word;
  font-size: 0.95rem;
`;

const MessageTime = styled.div`
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.5);
  margin-top: 5px;
`;

const InputArea = styled.form`
  display: flex;
  gap: 8px;
`;

const MessageInput = styled.input`
  flex: 1;
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 25px;
  padding: 12px 20px;
  color: white;
  font-size: 1rem;
  font-family: inherit;
  
  &::placeholder {
    color: rgba(255, 255, 255, 0.6);
  }
  
  &:focus {
    outline: none;
    background: rgba(255, 255, 255, 0.25);
    border-color: rgba(255, 255, 255, 0.5);
  }
`;

const SendButton = styled.button`
  background: rgba(255, 255, 255, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.4);
  color: white;
  padding: 12px 24px;
  border-radius: 25px;
  font-size: 1.2rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: inherit;
  white-space: nowrap;
  flex-shrink: 0;
  
  &:hover {
    background: rgba(255, 255, 255, 0.4);
    transform: translateY(-2px);
  }
  
  &:active {
    transform: translateY(0);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
`;

const SystemMessage = styled.div`
  text-align: center;
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.9rem;
  margin: 10px 0;
  font-style: italic;
`;

const NicknameModal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: rgba(100, 100, 100, 0.95);
  backdrop-filter: blur(10px);
  padding: 40px;
  border-radius: 20px;
  max-width: 400px;
  width: 90%;
  border: 1px solid rgba(255, 255, 255, 0.3);
`;

const ModalTitle = styled.h2`
  color: white;
  margin: 0 0 20px 0;
  font-size: 1.5rem;
  text-align: center;
`;

const ModalInput = styled.input`
  width: 100%;
  padding: 12px;
  border: 2px solid #e0e0e0;
  border-radius: 10px;
  font-size: 1rem;
  margin-bottom: 20px;
  box-sizing: border-box;
  
  &:focus {
    outline: none;
    border-color: #667eea;
  }
`;

const ModalButton = styled.button`
  width: 100%;
  background: #667eea;
  color: white;
  padding: 12px;
  border: none;
  border-radius: 10px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: #5568d3;
  }
  
  &:disabled {
    background: #ccc;
    cursor: not-allowed;
  }
`;

const LiveSwarmContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  align-items: center;
  justify-content: center;
`;

const PlaceholderText = styled.div`
  color: rgba(255, 255, 255, 0.7);
  font-size: 1.2rem;
  text-align: center;
  line-height: 1.8;
  
  strong {
    color: white;
    font-size: 1.5rem;
    display: block;
    margin-bottom: 20px;
  }
`;

const ParticipantsBadge = styled.div`
  margin-top: 30px;
  background: rgba(255, 255, 255, 0.2);
  padding: 15px 30px;
  border-radius: 20px;
  color: white;
  font-size: 1rem;
  font-weight: 600;
`;

const RoleSelectorBar = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 15px 20px;
  background: rgba(0, 0, 0, 0.3);
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  margin: -30px -30px 20px -30px;
  
  @media (max-width: 768px) {
    margin: -20px -20px 20px -20px;
    padding: 12px 15px;
  }
`;

const RoleDisplayBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  padding: 8px 15px;
  background: rgba(102, 126, 234, 0.3);
  border-bottom: 1px solid rgba(255, 255, 255, 0.3);
  margin: -15px -15px 12px -15px;
  
  @media (max-width: 768px) {
    margin: -12px -12px 10px -12px;
    padding: 6px 12px;
    flex-wrap: wrap;
  }
`;

const RoleDisplayText = styled.div`
  color: white;
  font-weight: 700;
  font-size: 1rem;
  text-transform: capitalize;
  display: flex;
  align-items: center;
  gap: 8px;
  white-space: nowrap;
  justify-content: center;
`;

const RoleLabel = styled.label`
  color: white;
  font-weight: 600;
  font-size: 1rem;
  white-space: nowrap;
`;

const RoleSelect = styled.select`
  flex: 1;
  padding: 10px 15px;
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 10px;
  color: white;
  font-size: 1rem;
  font-family: inherit;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.25);
  }
  
  &:focus {
    outline: none;
    border-color: rgba(255, 255, 255, 0.5);
  }
  
  option {
    background: #2c2c2c;
    color: white;
  }
`;

const ModalSelect = styled.select`
  width: 100%;
  padding: 12px;
  margin-bottom: 15px;
  background: rgba(50, 50, 70, 0.9);
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 10px;
  color: white;
  font-size: 1.1rem;
  font-family: inherit;
  cursor: pointer;
  font-weight: 500;
  
  &:focus {
    outline: none;
    border-color: #667eea;
    background: rgba(70, 70, 90, 0.95);
  }
  
  option {
    background: #2c2c2c;
    color: white;
    padding: 8px;
  }
`;

const LiveMessagesArea = styled.div`
  flex: 1;
  overflow-y: auto;
  margin-top: 10px;
  padding-right: 8px;
  
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 3px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.3);
    border-radius: 3px;
  }
  
  &::-webkit-scrollbar-thumb:hover {
    background: rgba(255, 255, 255, 0.5);
  }
`;

const LiveMessage = styled.div`
  background: rgba(255, 255, 255, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  padding: 8px 12px;
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  gap: 12px;
  animation: fadeIn 0.3s ease;
  
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const LiveMessageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
`;

const LiveMessageRole = styled.span`
  background: rgba(102, 126, 234, 0.5);
  padding: 3px 8px;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 600;
  color: white;
  text-transform: uppercase;
  white-space: nowrap;
  flex-shrink: 0;
`;

const LiveMessageTime = styled.span`
  color: rgba(255, 255, 255, 0.5);
  font-size: 0.75rem;
  white-space: nowrap;
  flex-shrink: 0;
  margin-left: auto;
`;

const LiveMessageContent = styled.div`
  color: white;
  font-size: 0.95rem;
  line-height: 1.4;
  flex: 1;
`;

interface ChatMessage {
  nickname: string;
  message: string;
  timestamp: string;
  socketId: string;
  role?: string;
}

export default function SwarmPage() {
  // Removed Control Room - only using Live Swarm chat now
  const [nickname, setNickname] = useState('');
  const [selectedRole, setSelectedRole] = useState('receiver-1');
  const [roleInput, setRoleInput] = useState('receiver-1'); // Needed for join modal
  const [targetAudience, setTargetAudience] = useState('all'); // For sender broadcasting
  const [showNicknameModal, setShowNicknameModal] = useState(true);
  const [liveMessages, setLiveMessages] = useState<ChatMessage[]>([]);
  const [liveMessageInput, setLiveMessageInput] = useState('');
  const [socket, setSocket] = useState<Socket | null>(null);
  const [currentSocketId, setCurrentSocketId] = useState('');
  const liveMessagesEndRef = useRef<HTMLDivElement>(null);
  
  const swarmId = 'default-swarm'; // For now, use a default swarm
  
  // Available roles - hardcoded for sender/receiver pattern
  const availableRoles = ['sender', 'receiver-1', 'receiver-2', 'receiver-3', 'receiver-4'];
  const targetOptions = ['all', 'even', 'odd', '1', '2', '3', '4'];

  // Removed localStorage check - popup will show on every page load for easier testing

  const connectToSwarm = (nick: string, role: string = 'all') => {
    const newSocket = io(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4444');
    
    newSocket.on('connect', () => {
      console.log('Connected to socket');
      setCurrentSocketId(newSocket.id || '');
      
      // Join the swarm with role information
      newSocket.emit('join-swarm', {
        swarmId: swarmId,
        nickname: nick,
        role: role
      });
    });

    newSocket.on('user-joined', (data) => {
      setMessages(prev => [...prev, {
        nickname: 'System',
        message: `${data.nickname} joined the swarm`,
        timestamp: new Date().toISOString(),
        socketId: 'system'
      }]);
    });

    newSocket.on('user-left', (data) => {
      setMessages(prev => [...prev, {
        nickname: 'System',
        message: `${data.nickname} left the swarm`,
        timestamp: new Date().toISOString(),
        socketId: 'system'
      }]);
    });

    newSocket.on('chat-message', (data: ChatMessage) => {
      setMessages(prev => [...prev, data]);
    });

    // Listen for live swarm messages (role-based content)
    newSocket.on('live-message', (data: ChatMessage) => {
      setLiveMessages(prev => [...prev, data]);
    });

    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  };

  const handleRoleChange = (newRole: string) => {
    setSelectedRole(newRole);
    if (socket) {
      // Notify server of role change
      socket.emit('change-role', {
        swarmId: swarmId,
        role: newRole
      });
      
      // Add a system message to both chat areas
      const roleDisplay = newRole.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase());
      const systemMessage = {
        nickname: 'System',
        message: `Switched to ${roleDisplay} role`,
        timestamp: new Date().toISOString(),
        socketId: 'system',
        role: 'system'
      };
      
      setLiveMessages(prev => [...prev, systemMessage]);
      setMessages(prev => [...prev, systemMessage]);
    }
  };

  const handleSendLiveMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (liveMessageInput.trim() && socket && selectedRole === 'sender') {
      socket.emit('broadcast-live-message', {
        swarmId: swarmId,
        target: targetAudience,
        message: liveMessageInput.trim()
      });
      
      // Add to local messages as confirmation
      const targetDisplay = targetAudience === 'all' ? 'All' : 
                           targetAudience === 'even' ? 'Even (2,4)' :
                           targetAudience === 'odd' ? 'Odd (1,3)' :
                           `Receiver ${targetAudience}`;
      
      setLiveMessages(prev => [...prev, {
        nickname: 'You',
        message: liveMessageInput.trim(),
        timestamp: new Date().toISOString(),
        socketId: currentSocketId,
        role: `→ ${targetDisplay}`
      }]);
      
      setLiveMessageInput('');
    }
  };

  const scrollLiveToBottom = () => {
    liveMessagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollLiveToBottom();
  }, [liveMessages]);

  const handleNicknameSubmit = () => {
    // Use role as the nickname (no localStorage)
    setNickname(roleInput);
    setSelectedRole(roleInput);
    setShowNicknameModal(false);
    connectToSwarm(roleInput, roleInput);
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <Container>
      <MainMenu />
      
      <Header>
        <Logo>🐝 Swarm</Logo>
        <Tagline>Live coordination space</Tagline>
      </Header>
      
      <Main>
        <ContentContainer>
          <TabContent>
            {/* Control Room removed - only showing Live Swarm chat */}
            {false && (
              <ChatContainer>
                <RoleDisplayBar>
                  <RoleDisplayText style={{ flex: 1, justifyContent: 'center' }}>
                    {selectedRole === 'sender' ? '📡' : '📺'} {selectedRole.replace('-', ' ')}
                  </RoleDisplayText>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <RoleLabel>Change Role:</RoleLabel>
                    <RoleSelect
                      value={selectedRole}
                      onChange={(e) => handleRoleChange(e.target.value)}
                      disabled={!socket}
                      style={{ minWidth: '130px' }}
                    >
                      <option value="sender">Sender</option>
                      <option value="receiver-1">Receiver 1</option>
                      <option value="receiver-2">Receiver 2</option>
                      <option value="receiver-3">Receiver 3</option>
                      <option value="receiver-4">Receiver 4</option>
                    </RoleSelect>
                  </div>
                </RoleDisplayBar>

                <MessagesArea>
                  {messages.map((msg, index) => (
                    msg.socketId === 'system' ? (
                      <SystemMessage key={index}>{msg.message}</SystemMessage>
                    ) : (
                      <Message key={index} $isOwn={msg.socketId === currentSocketId}>
                        <MessageNickname>{msg.nickname}</MessageNickname>
                        <MessageBubble $isOwn={msg.socketId === currentSocketId}>
                          {msg.message}
                        </MessageBubble>
                        <MessageTime>{formatTime(msg.timestamp)}</MessageTime>
                      </Message>
                    )
                  ))}
                  <div ref={messagesEndRef} />
                </MessagesArea>
                
                <InputArea onSubmit={handleSendMessage}>
                  <MessageInput
                    type="text"
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    placeholder="Type a message..."
                    disabled={!socket}
                  />
                  <SendButton type="submit" disabled={!socket || !messageInput.trim()}>
                    Send
                  </SendButton>
                </InputArea>
              </ChatContainer>
            )}
            
            {/* Only showing Live Swarm chat now */}
            <ChatContainer>
                <RoleDisplayBar>
                  <RoleDisplayText style={{ flex: 1, justifyContent: 'center' }}>
                    {selectedRole === 'sender' ? '📡' : '📺'} {selectedRole.replace('-', ' ')}
                  </RoleDisplayText>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <RoleLabel>Change Role:</RoleLabel>
                    <RoleSelect
                      value={selectedRole}
                      onChange={(e) => handleRoleChange(e.target.value)}
                      disabled={!socket}
                      style={{ minWidth: '130px' }}
                    >
                      <option value="sender">Sender</option>
                      <option value="receiver-1">Receiver 1</option>
                      <option value="receiver-2">Receiver 2</option>
                      <option value="receiver-3">Receiver 3</option>
                      <option value="receiver-4">Receiver 4</option>
                    </RoleSelect>
                  </div>
                </RoleDisplayBar>

                <LiveMessagesArea>
                  {liveMessages.length === 0 ? (
                    <PlaceholderText>
                      <strong>
                        {selectedRole === 'sender' ? '📡 Sender Console' : '📺 Receiver Viewer'}
                      </strong>
                      {selectedRole === 'sender' ? (
                        <>
                          Use the controls below to broadcast messages to specific receivers.
                          <br /><br />
                          • Select target audience (All, Even, Odd, or specific receiver)
                          <br />• Type your message and press Send
                          <br />• Messages will appear here as confirmation
                        </>
                      ) : (
                        <>
                          Waiting for messages from the sender...
                          <br /><br />
                          You will receive:
                          <br />• Messages sent to All
                          <br />• Messages sent to your specific receiver number
                          <br />• Messages sent to Even/Odd groups (if applicable)
                        </>
                      )}
                    </PlaceholderText>
                  ) : (
                    <>
                      {liveMessages.map((msg, index) => (
                        msg.socketId === 'system' ? (
                          <SystemMessage key={index}>{msg.message}</SystemMessage>
                        ) : (
                          <LiveMessage key={index}>
                            <LiveMessageRole>{msg.role || selectedRole}</LiveMessageRole>
                            <LiveMessageContent>{msg.message}</LiveMessageContent>
                            <LiveMessageTime>{formatTime(msg.timestamp)}</LiveMessageTime>
                          </LiveMessage>
                        )
                      ))}
                      <div ref={liveMessagesEndRef} />
                    </>
                  )}
                </LiveMessagesArea>
                
                {selectedRole === 'sender' && (
                  <InputArea onSubmit={handleSendLiveMessage}>
                    <RoleSelect
                      value={targetAudience}
                      onChange={(e) => setTargetAudience(e.target.value)}
                      disabled={!socket}
                      style={{ width: '140px', flexShrink: 0 }}
                    >
                      <option value="all">All</option>
                      <option value="even">Even (2, 4)</option>
                      <option value="odd">Odd (1, 3)</option>
                      <option value="1">Receiver 1</option>
                      <option value="2">Receiver 2</option>
                      <option value="3">Receiver 3</option>
                      <option value="4">Receiver 4</option>
                    </RoleSelect>
                    <MessageInput
                      type="text"
                      value={liveMessageInput}
                      onChange={(e) => setLiveMessageInput(e.target.value)}
                      placeholder="Type message to send..."
                      disabled={!socket}
                    />
                    <SendButton type="submit" disabled={!socket || !liveMessageInput.trim()}>
                      ✈️
                    </SendButton>
                  </InputArea>
                )}
              </ChatContainer>
          </TabContent>
        </ContentContainer>
      </Main>

      {showNicknameModal && (
        <NicknameModal>
          <ModalContent>
            <ModalTitle>Join the Swarm</ModalTitle>
            <ModalSelect
              value={roleInput}
              onChange={(e) => setRoleInput(e.target.value)}
              autoFocus
            >
              <option value="receiver-1">Receiver 1</option>
              <option value="receiver-2">Receiver 2</option>
              <option value="receiver-3">Receiver 3</option>
              <option value="receiver-4">Receiver 4</option>
              <option value="sender">Sender</option>
            </ModalSelect>
            <ModalButton onClick={handleNicknameSubmit}>
              Join as {roleInput}
            </ModalButton>
          </ModalContent>
        </NicknameModal>
      )}
    </Container>
  );
}

