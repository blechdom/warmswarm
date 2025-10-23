'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styled from 'styled-components';
import AppNav from '@/components/AppNav';

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: linear-gradient(135deg, #bf360c 0%, #d84315 50%, #c62828 100%);
  font-family: 'Quantico', Arial, Helvetica, sans-serif;
  padding: 20px;
  box-sizing: border-box;
`;

const Header = styled.header`
  text-align: center;
  padding: 20px 20px 40px;
`;

const Logo = styled.h1`
  font-size: 3rem;
  color: white;
  margin: 0 0 20px 0;
  font-weight: 700;
  text-shadow: 0 2px 20px rgba(0,0,0,0.3);
  
  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

const Tagline = styled.p`
  font-size: 1.3rem;
  color: rgba(255, 255, 255, 0.9);
  margin: 0;
  font-weight: 300;
  
  @media (max-width: 768px) {
    font-size: 1.1rem;
  }
`;

const Main = styled.main`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
`;

const CreateButton = styled.button`
  background: rgba(255, 255, 255, 0.95);
  color: #bf360c;
  border: none;
  padding: 15px 30px;
  border-radius: 25px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  margin-bottom: 30px;
  transition: all 0.3s ease;
  
  &:hover {
    background: white;
    transform: translateY(-2px);
    box-shadow: 0 5px 20px rgba(0,0,0,0.2);
  }
`;

const SwarmsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 25px;
  width: 100%;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const SwarmCard = styled.div`
  background: rgba(255, 255, 255, 0.95);
  border-radius: 20px;
  padding: 25px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.2);
  transition: all 0.3s ease;
  position: relative;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 15px 40px rgba(0,0,0,0.3);
  }
`;

const LiveIndicator = styled.div<{ isLive: boolean }>`
  position: absolute;
  top: 20px;
  right: 20px;
  display: flex;
  align-items: center;
  gap: 6px;
  background: ${props => props.isLive ? 'rgba(46, 204, 113, 0.15)' : 'rgba(189, 189, 189, 0.15)'};
  color: ${props => props.isLive ? '#27ae60' : '#777'};
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 600;
`;

const LiveDot = styled.span<{ isLive: boolean }>`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${props => props.isLive ? '#27ae60' : '#999'};
  animation: ${props => props.isLive ? 'pulse 2s infinite' : 'none'};
  
  @keyframes pulse {
    0%, 100% {
      opacity: 1;
    }
    50% {
      opacity: 0.5;
    }
  }
`;

const SwarmHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 15px;
  padding-right: 80px; // Space for live indicator
`;

const SwarmTitle = styled.h3`
  color: #333;
  margin: 0;
  font-size: 1.5rem;
  font-weight: 600;
`;

const SwarmDescription = styled.p`
  color: #666;
  margin: 0 0 15px 0;
  font-size: 0.95rem;
  line-height: 1.5;
  min-height: 45px;
`;

const SwarmMeta = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
  flex-wrap: wrap;
`;

const MetaBadge = styled.span<{ variant?: string }>`
  background: ${props => {
    switch(props.variant) {
      case 'category': return 'rgba(102, 126, 234, 0.1)';
      case 'privacy': return 'rgba(241, 196, 15, 0.1)';
      default: return 'rgba(0,0,0,0.05)';
    }
  }};
  color: ${props => {
    switch(props.variant) {
      case 'category': return '#667eea';
      case 'privacy': return '#f39c12';
      default: return '#666';
    }
  }};
  padding: 5px 12px;
  border-radius: 15px;
  font-size: 0.85rem;
  font-weight: 500;
  text-transform: capitalize;
`;

const SwarmActions = styled.div`
  display: flex;
  gap: 10px;
`;

const EditButton = styled.button`
  flex: 1;
  background: rgba(102, 126, 234, 0.1);
  color: #667eea;
  border: 1px solid #667eea;
  padding: 12px 20px;
  border-radius: 25px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: #667eea;
    color: white;
  }
`;

const StartButton = styled.button`
  flex: 1;
  background: #ff6b6b;
  color: white;
  border: none;
  padding: 12px 20px;
  border-radius: 25px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: #ff5252;
    transform: translateY(-1px);
  }
`;

const LoadingState = styled.div`
  text-align: center;
  padding: 60px 20px;
  color: rgba(255, 255, 255, 0.9);
  font-size: 1.2rem;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 60px 20px;
  color: rgba(255, 255, 255, 0.9);
`;

const EmptyMessage = styled.p`
  font-size: 1.2rem;
  margin-bottom: 20px;
`;

interface Swarm {
  id: string;
  name: string;
  description: string;
  category: string;
  privacy: string;
  invite_code: string;
  created_at: string;
  member_count?: number;
}

export default function SwarmsLibrary() {
  const router = useRouter();
  const [swarms, setSwarms] = useState<Swarm[]>([]);
  const [loading, setLoading] = useState(true);
  const [liveSwarms, setLiveSwarms] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchSwarms();
    checkLiveSwarms();
    
    // Check live status every 30 seconds
    const interval = setInterval(checkLiveSwarms, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchSwarms = async () => {
    setLoading(true);
    try {
      // Get user's swarms from localStorage
      const mySwarmIds = localStorage.getItem('my-swarms') || '';
      
      let endpoint = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4444'}/api/swarms`;
      
      if (mySwarmIds) {
        endpoint = `${endpoint}?filter=my&swarmIds=${encodeURIComponent(mySwarmIds)}`;
      }
      
      const response = await fetch(endpoint);
      
      if (response.ok) {
        const data = await response.json();
        setSwarms(data);
      } else {
        console.error('Failed to fetch swarms');
      }
    } catch (err) {
      console.error('Error fetching swarms:', err);
    } finally {
      setLoading(false);
    }
  };

  const checkLiveSwarms = async () => {
    try {
      // Check which swarms have active members
      const mySwarmIds = localStorage.getItem('my-swarms') || '';
      if (!mySwarmIds) return;

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4444'}/api/swarms?filter=my&swarmIds=${encodeURIComponent(mySwarmIds)}`
      );
      
      if (response.ok) {
        const data = await response.json();
        const live = new Set<string>();
        
        // Consider a swarm "live" if it has 1 or more members
        data.forEach((swarm: Swarm) => {
          if (swarm.member_count && swarm.member_count > 0) {
            live.add(swarm.id);
          }
        });
        
        setLiveSwarms(live);
      }
    } catch (err) {
      console.error('Error checking live swarms:', err);
    }
  };

  const handleCreateSwarm = () => {
    router.push('/create/coordinate');
  };

  const handleEdit = (swarm: Swarm) => {
    // Navigate to edit page (to be implemented)
    router.push(`/create/coordinate?edit=${swarm.id}`);
  };

  const handleStart = async (swarm: Swarm) => {
    // Get or prompt for nickname
    let nickname = localStorage.getItem('swarm-nickname');
    
    if (!nickname) {
      nickname = prompt('Enter your nickname:');
      if (!nickname) return;
      localStorage.setItem('swarm-nickname', nickname);
    }

    try {
      // Join the swarm
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4444'}/api/swarms/${swarm.invite_code}/join`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ nickname }),
        }
      );

      if (response.ok) {
        // Navigate to the live swarm page
        router.push(`/swarm?swarmId=${swarm.id}&swarmName=${encodeURIComponent(swarm.name)}`);
      } else {
        const errorData = await response.json();
        alert(errorData.error || 'Failed to start swarm');
      }
    } catch (err) {
      console.error('Error starting swarm:', err);
      alert('Network error. Please try again.');
    }
  };

  return (
    <Container>
      <AppNav currentPage="create" />
      
      <Header>
        <Logo>🐝 Your Swarms</Logo>
        <Tagline>Manage and start your swarm configurations</Tagline>
      </Header>
      
      <Main>
        <CreateButton onClick={handleCreateSwarm}>
          ➕ Create New Swarm
        </CreateButton>

        {loading ? (
          <LoadingState>Loading your swarms...</LoadingState>
        ) : swarms.length === 0 ? (
          <EmptyState>
            <EmptyMessage>You haven't created any swarms yet.</EmptyMessage>
            <p>Click the button above to create your first swarm!</p>
          </EmptyState>
        ) : (
          <SwarmsGrid>
            {swarms.map((swarm) => (
              <SwarmCard key={swarm.id}>
                <LiveIndicator isLive={liveSwarms.has(swarm.id)}>
                  <LiveDot isLive={liveSwarms.has(swarm.id)} />
                  {liveSwarms.has(swarm.id) ? 'LIVE' : 'Offline'}
                </LiveIndicator>
                
                <SwarmHeader>
                  <SwarmTitle>{swarm.name}</SwarmTitle>
                </SwarmHeader>
                
                <SwarmDescription>
                  {swarm.description || 'No description provided.'}
                </SwarmDescription>
                
                <SwarmMeta>
                  <MetaBadge variant="category">{swarm.category}</MetaBadge>
                  <MetaBadge variant="privacy">{swarm.privacy}</MetaBadge>
                  {swarm.member_count !== undefined && (
                    <MetaBadge>👥 {swarm.member_count} member{swarm.member_count !== 1 ? 's' : ''}</MetaBadge>
                  )}
                </SwarmMeta>
                
                <SwarmActions>
                  <EditButton onClick={() => handleEdit(swarm)}>
                    ✏️ Edit
                  </EditButton>
                  <StartButton onClick={() => handleStart(swarm)}>
                    ▶️ Start
                  </StartButton>
                </SwarmActions>
              </SwarmCard>
            ))}
          </SwarmsGrid>
        )}
      </Main>
    </Container>
  );
}

