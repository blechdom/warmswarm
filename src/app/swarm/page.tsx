'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import styled from 'styled-components';
import { io, Socket } from 'socket.io-client';

const Container = styled.div`
  min-height: 100vh;
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
  font-family: 'Quantico', Arial, Helvetica, sans-serif;
  padding: 0;
  margin: 0;
  box-sizing: border-box;
  overflow: hidden;
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
  padding: 0;
  width: 100%;
  height: 100%;
`;

const ContentContainer = styled.div`
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  border: none;
  border-radius: 0;
  padding: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
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
  gap: 12px;
  padding: 15px 20px;
  background: rgba(0, 0, 0, 0.15);
  border-top: 1px solid rgba(255, 255, 255, 0.2);
  
  @media (max-width: 768px) {
    padding: 12px 15px;
    gap: 10px;
  }
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
  gap: 15px;
  padding: 15px 20px;
  background: rgba(102, 126, 234, 0.3);
  border-bottom: 1px solid rgba(255, 255, 255, 0.3);
  
  @media (max-width: 768px) {
    padding: 12px 15px;
    flex-wrap: wrap;
    gap: 10px;
  }
`;

const HomeLink = styled(Link)`
  display: flex;
  align-items: center;
  gap: 5px;
  color: white;
  text-decoration: none;
  font-weight: 700;
  font-size: 1.2rem;
  transition: all 0.2s ease;
  
  &:hover {
    opacity: 0.8;
    transform: translateY(-1px);
  }
`;

const LogoImage = styled.img`
  height: 2rem;
  width: auto;
  filter: drop-shadow(0 2px 4px rgba(0,0,0,0.2));
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

const CenteredRoleSelector = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  gap: 30px;
  padding: 40px;
`;

const RoleSelectorTitle = styled.h2`
  color: white;
  font-size: 2rem;
  font-weight: 700;
  margin: 0;
  text-align: center;
  text-shadow: 0 2px 10px rgba(0,0,0,0.3);
`;

const RoleButtonGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  width: 100%;
  max-width: 600px;
`;

const RoleButton = styled.button`
  padding: 30px 20px;
  background: rgba(255, 255, 255, 0.2);
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 15px;
  color: white;
  font-size: 1.2rem;
  font-weight: 600;
  font-family: inherit;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.3);
    border-color: rgba(255, 255, 255, 0.5);
    transform: translateY(-3px);
    box-shadow: 0 10px 25px rgba(0,0,0,0.2);
  }
  
  &:active {
    transform: translateY(-1px);
  }
`;

const InfoIcon = styled.button`
  background: none;
  border: none;
  color: white;
  font-size: 1.3rem;
  cursor: pointer;
  padding: 5px;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.2);
  }
`;

const InfoPopup = styled.div`
  position: absolute;
  top: 60px;
  right: 20px;
  background: rgba(30, 30, 50, 0.98);
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 15px;
  padding: 20px;
  max-width: 300px;
  z-index: 1000;
  color: white;
  box-shadow: 0 10px 40px rgba(0,0,0,0.4);
  
  h3 {
    margin: 0 0 10px 0;
    font-size: 1.1rem;
  }
  
  p {
    margin: 8px 0;
    font-size: 0.9rem;
    line-height: 1.4;
    color: rgba(255, 255, 255, 0.9);
  }
  
  ul {
    margin: 10px 0;
    padding-left: 20px;
    font-size: 0.9rem;
    
    li {
      margin: 5px 0;
    }
  }
`;

const InfoPopupOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 999;
`;

const GroupCountBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
  padding: 10px 20px;
  background: rgba(0, 0, 0, 0.2);
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  font-size: 0.9rem;
  color: white;
  font-weight: 600;
  
  @media (max-width: 768px) {
    gap: 12px;
    padding: 8px 15px;
    font-size: 0.8rem;
  }
`;

const GroupCount = styled.span`
  color: rgba(255, 255, 255, 0.9);
  
  .count {
    color: #4ade80;
    font-weight: 700;
  }
`;

const MediaControlBar = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 20px;
  background: rgba(0, 0, 0, 0.15);
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  
  @media (max-width: 768px) {
    padding: 10px 15px;
    gap: 8px;
  }
`;

const MediaTypeSelect = styled.select`
  padding: 8px 12px;
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 8px;
  color: white;
  font-size: 0.95rem;
  font-family: inherit;
  cursor: pointer;
  transition: all 0.2s ease;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='white' d='M6 9L1 4h10z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 8px center;
  padding-right: 30px;
  min-width: 120px;
  
  &:hover {
    background-color: rgba(255, 255, 255, 0.25);
  }
  
  &:focus {
    outline: none;
    border-color: rgba(255, 255, 255, 0.5);
  }
  
  option {
    background: #2c2c2c;
    color: white;
  }
  
  @media (max-width: 768px) {
    min-width: 100px;
    font-size: 0.85rem;
  }
`;

const FullscreenMessage = styled.div<{ $bgColor: string }>`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${props => props.$bgColor};
  padding: 40px;
  z-index: 100;
`;

const FullscreenText = styled.div`
  color: white;
  font-size: 4rem;
  font-weight: 900;
  text-align: center;
  text-shadow: 0 4px 20px rgba(0,0,0,0.5);
  text-transform: uppercase;
  letter-spacing: 0.1em;
  
  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

const RoleSelect = styled.select`
  padding: 8px 12px;
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 8px;
  color: white;
  font-size: 0.95rem;
  font-family: inherit;
  cursor: pointer;
  transition: all 0.2s ease;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='white' d='M6 9L1 4h10z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 8px center;
  padding-right: 30px;
  
  &:hover {
    background-color: rgba(255, 255, 255, 0.25);
  }
  
  &:focus {
    outline: none;
    border-color: rgba(255, 255, 255, 0.5);
    background-color: rgba(255, 255, 255, 0.3);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  
  option {
    background: #2c2c2c;
    color: white;
  }
  
  /* Responsive width for sender target audience dropdown */
  &.target-audience {
    width: 140px;
    min-width: 140px;
    max-width: 140px;
    flex-shrink: 0;
    flex-grow: 0;
    
    @media (max-width: 768px) {
      width: 90px;
      min-width: 90px;
      max-width: 90px;
      font-size: 0.85rem;
      padding: 8px 8px;
      padding-right: 26px;
    }
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
  // Auto-generate a simple nickname for participants
  const [nickname, setNickname] = useState(() => `Bee${Math.floor(Math.random() * 1000)}`);
  const [selectedRole, setSelectedRole] = useState('');
  const [roleInput, setRoleInput] = useState('group-1');
  const [targetAudience, setTargetAudience] = useState('all');
  const [showNicknameModal, setShowNicknameModal] = useState(false);
  const [showInfoPopup, setShowInfoPopup] = useState(false);
  const [liveMessages, setLiveMessages] = useState<ChatMessage[]>([]);
  const [liveMessageInput, setLiveMessageInput] = useState('');
  const [socket, setSocket] = useState<Socket | null>(null);
  const [currentSocketId, setCurrentSocketId] = useState('');
  const [groupCounts, setGroupCounts] = useState({ 'group-1': 0, 'group-2': 0, 'group-3': 0, 'group-4': 0 });
  const [mediaType, setMediaType] = useState('text');
  const [mediaPreset, setMediaPreset] = useState('');
  const [currentFullscreenMessage, setCurrentFullscreenMessage] = useState<{text: string, color: string} | null>(null);
  const liveMessagesEndRef = useRef<HTMLDivElement>(null);
  
  const swarmId = 'default-swarm';
  
  const availableRoles = ['sender', 'group-1', 'group-2', 'group-3', 'group-4'];
  const targetOptions = ['all', 'even', 'odd', '1', '2', '3', '4'];
  
  const mediaPresets = {
    text: ['Jump', 'Scream', 'Run', 'Sit'],
    image: ['Preset 1', 'Preset 2', 'Preset 3'],
    video: ['Loop 1', 'Loop 2', 'Loop 3'],
    tts: ['Voice 1', 'Voice 2', 'Voice 3']
  };
  
  const backgroundColors = [
    '#d63384', // pink
    '#dc2626', // red
    '#f59e0b', // orange
    '#10b981', // green
    '#3b82f6', // blue
    '#8b5cf6', // purple (but lighter than main)
    '#ec4899', // hot pink
  ];

  // Removed localStorage check - popup will show on every page load for easier testing

  const connectToSwarm = (nick: string, role: string = 'all') => {
    const newSocket = io(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4444', {
      transports: ['polling', 'websocket'],
      path: '/socket.io/',
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
    });
    
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
      // Add to live messages instead
      setLiveMessages(prev => [...prev, {
        nickname: 'System',
        message: `${data.nickname} joined the swarm`,
        timestamp: new Date().toISOString(),
        socketId: 'system'
      }]);
    });

    newSocket.on('user-left', (data) => {
      // Add to live messages instead
      setLiveMessages(prev => [...prev, {
        nickname: 'System',
        message: `${data.nickname} left the swarm`,
        timestamp: new Date().toISOString(),
        socketId: 'system'
      }]);
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
      
      // Add a system message to live chat
      const roleDisplay = newRole.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase());
      const systemMessage = {
        nickname: 'System',
        message: `Switched to ${roleDisplay} role`,
        timestamp: new Date().toISOString(),
        socketId: 'system',
        role: 'system'
      };
      
      setLiveMessages(prev => [...prev, systemMessage]);
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

  // Cleanup socket on unmount
  useEffect(() => {
    return () => {
      if (socket) {
        socket.close();
      }
    };
  }, [socket]);

  const handleRoleSelection = (role: string) => {
    setSelectedRole(role);
    connectToSwarm(nickname, role);
  };

  const handleNicknameSubmit = () => {
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
      <Main>
        <ContentContainer>
          {!selectedRole ? (
            // Show centered role selector when no role selected
            <CenteredRoleSelector>
              <RoleSelectorTitle>Select a Role/Group</RoleSelectorTitle>
              <RoleButtonGrid>
                <RoleButton onClick={() => handleRoleSelection('sender')}>
                  📡 Sender
                </RoleButton>
                <RoleButton onClick={() => handleRoleSelection('group-1')}>
                  👥 Group 1
                </RoleButton>
                <RoleButton onClick={() => handleRoleSelection('group-2')}>
                  👥 Group 2
                </RoleButton>
                <RoleButton onClick={() => handleRoleSelection('group-3')}>
                  👥 Group 3
                </RoleButton>
                <RoleButton onClick={() => handleRoleSelection('group-4')}>
                  👥 Group 4
                </RoleButton>
              </RoleButtonGrid>
            </CenteredRoleSelector>
          ) : (
            // Show chat after role is selected
            <TabContent style={{ padding: 0 }}>
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
                  <HomeLink href="/">
                    warm
                    <LogoImage 
                      src="/warmswarm-logo-transparent.png" 
                      alt="WarmSwarm Logo"
                    />
                    swarm
                  </HomeLink>
                  <RoleDisplayText>
                    Test Swarm
                  </RoleDisplayText>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', position: 'relative' }}>
                    <RoleSelect
                      value={selectedRole}
                      onChange={(e) => handleRoleChange(e.target.value)}
                      disabled={!socket}
                    >
                      <option value="sender">Sender</option>
                      <option value="group-1">Group 1</option>
                      <option value="group-2">Group 2</option>
                      <option value="group-3">Group 3</option>
                      <option value="group-4">Group 4</option>
                    </RoleSelect>
                    <InfoIcon onClick={() => setShowInfoPopup(!showInfoPopup)}>
                      ℹ️
                    </InfoIcon>
                    {showInfoPopup && (
                      <>
                        <InfoPopupOverlay onClick={() => setShowInfoPopup(false)} />
                        <InfoPopup>
                          <h3>About Roles</h3>
                          <p><strong>Sender:</strong> Send media to specific groups</p>
                          <p><strong>Groups:</strong> Receive and view messages from the sender</p>
                          <ul>
                            <li>Group 1-4: Individual channels</li>
                            <li>Sender can broadcast to all, even/odd, or specific groups</li>
                          </ul>
                        </InfoPopup>
                      </>
                    )}
                  </div>
                </RoleDisplayBar>

                {/* Group Count Bar - shows how many people in each group */}
                {selectedRole === 'sender' && (
                  <GroupCountBar>
                    <GroupCount>Group1: <span className="count">({groupCounts['group-1']})</span></GroupCount>
                    <GroupCount>Group2: <span className="count">({groupCounts['group-2']})</span></GroupCount>
                    <GroupCount>Group3: <span className="count">({groupCounts['group-3']})</span></GroupCount>
                    <GroupCount>Group4: <span className="count">({groupCounts['group-4']})</span></GroupCount>
                  </GroupCountBar>
                )}

                {/* Fullscreen message display for groups */}
                {selectedRole !== 'sender' && currentFullscreenMessage && (
                  <FullscreenMessage $bgColor={currentFullscreenMessage.color}>
                    <FullscreenText>{currentFullscreenMessage.text}</FullscreenText>
                  </FullscreenMessage>
                )}

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
                  <>
                    <MediaControlBar>
                      <MediaTypeSelect
                        value={mediaType}
                        onChange={(e) => {
                          setMediaType(e.target.value);
                          setMediaPreset(''); // Reset preset when changing type
                        }}
                      >
                        <option value="text">📝 Text</option>
                        <option value="image">🖼️ Image</option>
                        <option value="video">🎬 Video</option>
                        <option value="tts">🗣️ TTS</option>
                      </MediaTypeSelect>
                      <MediaTypeSelect
                        value={mediaPreset}
                        onChange={(e) => setMediaPreset(e.target.value)}
                      >
                        <option value="">Select preset...</option>
                        {mediaPresets[mediaType as keyof typeof mediaPresets].map((preset) => (
                          <option key={preset} value={preset}>{preset}</option>
                        ))}
                      </MediaTypeSelect>
                    </MediaControlBar>
                    <InputArea onSubmit={handleSendLiveMessage}>
                    <RoleSelect
                      className="target-audience"
                      value={targetAudience}
                      onChange={(e) => setTargetAudience(e.target.value)}
                      disabled={!socket}
                    >
                      <option value="all">All</option>
                      <option value="even">Even</option>
                      <option value="odd">Odd</option>
                      <option value="1">R1</option>
                      <option value="2">R2</option>
                      <option value="3">R3</option>
                      <option value="4">R4</option>
                    </RoleSelect>
                    <MessageInput
                      type="text"
                      value={liveMessageInput}
                      onChange={(e) => setLiveMessageInput(e.target.value)}
                      placeholder="Type message to send..."
                      disabled={!socket}
                      style={{ flex: 1 }}
                    />
                    <SendButton type="submit" disabled={!socket || !liveMessageInput.trim()}>
                      ✈️
                    </SendButton>
                  </InputArea>
                  </>
                )}
              </ChatContainer>
            </TabContent>
          )}
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
              <option value="group-1">Group 1</option>
              <option value="group-2">Group 2</option>
              <option value="group-3">Group 3</option>
              <option value="group-4">Group 4</option>
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

