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
  padding: 40px 20px 20px;
`;

const Logo = styled.h1`
  font-size: 2.5rem;
  color: white;
  margin: 0 0 10px 0;
  font-weight: 700;
  text-shadow: 0 2px 20px rgba(0,0,0,0.3);
  
  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const Tagline = styled.p`
  font-size: 1.1rem;
  color: rgba(255, 255, 255, 0.9);
  margin: 0;
  font-weight: 300;
`;

const Main = styled.main`
  flex: 1;
  display: flex;
  justify-content: center;
  padding: 20px;
  padding-bottom: 40px;
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
  height: 650px;
  overflow: hidden;
  
  @media (max-width: 768px) {
    height: 550px;
  }
`;

const TabBar = styled.div`
  display: flex;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  background: rgba(0, 0, 0, 0.1);
`;

const Tab = styled.button<{ $active: boolean }>`
  flex: 1;
  padding: 20px;
  background: ${props => props.$active ? 'rgba(255, 255, 255, 0.2)' : 'transparent'};
  color: white;
  border: none;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: inherit;
  border-bottom: 3px solid ${props => props.$active ? 'white' : 'transparent'};
  
  &:hover {
    background: rgba(255, 255, 255, 0.15);
  }
  
  @media (max-width: 768px) {
    padding: 15px;
    font-size: 1rem;
  }
`;

const TabContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 30px;
  overflow: hidden;
  
  @media (max-width: 768px) {
    padding: 20px;
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
  margin-bottom: 20px;
  padding: 15px;
  background: rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  
  &::-webkit-scrollbar {
    width: 8px;
  }
  
  &::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 10px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.3);
    border-radius: 10px;
    
    &:hover {
      background: rgba(255, 255, 255, 0.4);
    }
  }
`;

const Message = styled.div<{ $isOwn?: boolean }>`
  margin-bottom: 15px;
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
  padding: 10px 15px;
  border-radius: 15px;
  max-width: 70%;
  word-wrap: break-word;
  font-size: 1rem;
`;

const MessageTime = styled.div`
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.5);
  margin-top: 5px;
`;

const InputArea = styled.form`
  display: flex;
  gap: 10px;
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
  padding: 12px 30px;
  border-radius: 25px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: inherit;
  
  &:hover {
    background: rgba(255, 255, 255, 0.4);
    transform: translateY(-2px);
  }
  
  &:active {
    transform: translateY(0);
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
  background: rgba(255, 255, 255, 0.95);
  padding: 40px;
  border-radius: 20px;
  max-width: 400px;
  width: 90%;
`;

const ModalTitle = styled.h2`
  color: #333;
  margin: 0 0 20px 0;
  font-size: 1.5rem;
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
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 10px;
  color: white;
  font-size: 1rem;
  font-family: inherit;
  cursor: pointer;
  
  &:focus {
    outline: none;
    border-color: #667eea;
  }
  
  option {
    background: #2c2c2c;
    color: white;
  }
`;

const LiveMessagesArea = styled.div`
  flex: 1;
  overflow-y: auto;
  margin-top: 20px;
  padding-right: 10px;
  
  &::-webkit-scrollbar {
    width: 8px;
  }
  
  &::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 4px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.3);
    border-radius: 4px;
  }
  
  &::-webkit-scrollbar-thumb:hover {
    background: rgba(255, 255, 255, 0.5);
  }
`;

const LiveMessage = styled.div`
  background: rgba(255, 255, 255, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  padding: 15px 20px;
  margin-bottom: 15px;
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
  padding: 4px 10px;
  border-radius: 8px;
  font-size: 0.85rem;
  font-weight: 600;
  color: white;
  text-transform: uppercase;
`;

const LiveMessageTime = styled.span`
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.85rem;
`;

const LiveMessageContent = styled.div`
  color: white;
  font-size: 1.1rem;
  line-height: 1.5;
`;

interface ChatMessage {
  nickname: string;
  message: string;
  timestamp: string;
  socketId: string;
  role?: string;
}

export default function SwarmPage() {
  const [activeTab, setActiveTab] = useState<'control' | 'live'>('control');
  const [nickname, setNickname] = useState('');
  const [selectedRole, setSelectedRole] = useState('receiver-1');
  const [targetAudience, setTargetAudience] = useState('all');
  const [showNicknameModal, setShowNicknameModal] = useState(true);
  const [nicknameInput, setNicknameInput] = useState('');
  const [roleInput, setRoleInput] = useState('receiver-1');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [liveMessages, setLiveMessages] = useState<ChatMessage[]>([]);
  const [messageInput, setMessageInput] = useState('');
  const [liveMessageInput, setLiveMessageInput] = useState('');
  const [socket, setSocket] = useState<Socket | null>(null);
  const [currentSocketId, setCurrentSocketId] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const liveMessagesEndRef = useRef<HTMLDivElement>(null);
  
  const swarmId = 'default-swarm'; // For now, use a default swarm
  
  // Available roles - hardcoded for sender/receiver pattern
  const availableRoles = ['sender', 'receiver-1', 'receiver-2', 'receiver-3', 'receiver-4'];
  const targetOptions = ['all', 'even', 'odd', '1', '2', '3', '4'];

  useEffect(() => {
    // Check for stored nickname
    const storedNickname = localStorage.getItem('swarm-nickname');
    if (storedNickname) {
      setNickname(storedNickname);
      setShowNicknameModal(false);
      connectToSwarm(storedNickname);
    }
  }, []);

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
      
      // Add a system message to live messages
      const roleDisplay = newRole.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase());
      setLiveMessages(prev => [...prev, {
        nickname: 'System',
        message: `Switched to ${roleDisplay} role`,
        timestamp: new Date().toISOString(),
        socketId: 'system',
        role: 'system'
      }]);
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

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollLiveToBottom = () => {
    liveMessagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    scrollLiveToBottom();
  }, [liveMessages]);

  const handleNicknameSubmit = () => {
    if (nicknameInput.trim()) {
      localStorage.setItem('swarm-nickname', nicknameInput);
      setNickname(nicknameInput);
      setSelectedRole(roleInput);
      setShowNicknameModal(false);
      connectToSwarm(nicknameInput, roleInput);
    }
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (messageInput.trim() && socket) {
      socket.emit('chat-message', {
        swarmId: swarmId,
        message: messageInput.trim()
      });
      setMessageInput('');
    }
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
          <TabBar>
            <Tab 
              $active={activeTab === 'control'} 
              onClick={() => setActiveTab('control')}
            >
              💬 Control Room
            </Tab>
            <Tab 
              $active={activeTab === 'live'} 
              onClick={() => setActiveTab('live')}
            >
              🎭 Live Swarm
            </Tab>
          </TabBar>
          
          <TabContent>
            {activeTab === 'control' && (
              <ChatContainer>
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
            
            {activeTab === 'live' && (
              <ChatContainer>
                <RoleSelectorBar>
                  <RoleLabel>Your Role:</RoleLabel>
                  <RoleSelect
                    value={selectedRole}
                    onChange={(e) => handleRoleChange(e.target.value)}
                    disabled={!socket}
                  >
                    <option value="sender">Sender</option>
                    <option value="receiver-1">Receiver 1</option>
                    <option value="receiver-2">Receiver 2</option>
                    <option value="receiver-3">Receiver 3</option>
                    <option value="receiver-4">Receiver 4</option>
                  </RoleSelect>
                  
                  {selectedRole === 'sender' && (
                    <>
                      <RoleLabel style={{ marginLeft: '15px' }}>Send to:</RoleLabel>
                      <RoleSelect
                        value={targetAudience}
                        onChange={(e) => setTargetAudience(e.target.value)}
                        disabled={!socket}
                      >
                        <option value="all">All</option>
                        <option value="even">Even (2, 4)</option>
                        <option value="odd">Odd (1, 3)</option>
                        <option value="1">Receiver 1</option>
                        <option value="2">Receiver 2</option>
                        <option value="3">Receiver 3</option>
                        <option value="4">Receiver 4</option>
                      </RoleSelect>
                    </>
                  )}
                </RoleSelectorBar>

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
                            <LiveMessageHeader>
                              <LiveMessageRole>{msg.role || selectedRole}</LiveMessageRole>
                              <LiveMessageTime>{formatTime(msg.timestamp)}</LiveMessageTime>
                            </LiveMessageHeader>
                            <LiveMessageContent>{msg.message}</LiveMessageContent>
                          </LiveMessage>
                        )
                      ))}
                      <div ref={liveMessagesEndRef} />
                    </>
                  )}
                </LiveMessagesArea>
                
                {selectedRole === 'sender' && (
                  <InputArea onSubmit={handleSendLiveMessage}>
                    <MessageInput
                      type="text"
                      value={liveMessageInput}
                      onChange={(e) => setLiveMessageInput(e.target.value)}
                      placeholder={`Broadcast to ${targetAudience}...`}
                      disabled={!socket}
                    />
                    <SendButton type="submit" disabled={!socket || !liveMessageInput.trim()}>
                      Broadcast
                    </SendButton>
                  </InputArea>
                )}
              </ChatContainer>
            )}
          </TabContent>
        </ContentContainer>
      </Main>

      {showNicknameModal && (
        <NicknameModal>
          <ModalContent>
            <ModalTitle>Join the Swarm</ModalTitle>
            <ModalInput
              type="text"
              value={nicknameInput}
              onChange={(e) => setNicknameInput(e.target.value)}
              placeholder="Enter your nickname"
              onKeyPress={(e) => e.key === 'Enter' && handleNicknameSubmit()}
              autoFocus
            />
            <ModalSelect
              value={roleInput}
              onChange={(e) => setRoleInput(e.target.value)}
            >
              <option value="receiver-1">Receiver 1 (default)</option>
              <option value="receiver-2">Receiver 2</option>
              <option value="receiver-3">Receiver 3</option>
              <option value="receiver-4">Receiver 4</option>
              <option value="sender">Sender</option>
            </ModalSelect>
            <ModalButton onClick={handleNicknameSubmit} disabled={!nicknameInput.trim()}>
              Join
            </ModalButton>
          </ModalContent>
        </NicknameModal>
      )}
    </Container>
  );
}

