'use client';

import Link from 'next/link';
import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import styled from 'styled-components';
import MainMenu from '@/components/MainMenu';

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: linear-gradient(135deg, #d63384 0%, #d946ef 50%, #dc2626 100%);
  padding: 20px;
  box-sizing: border-box;
  position: relative;
  overflow: hidden;
`;

// BackButton removed - now using MainMenu component

const Header = styled.header`
  text-align: center;
  margin-bottom: 40px;
  margin-top: 20px;
  z-index: 5;
  position: relative;
`;

const Logo = styled.h1`
  font-size: 2.5rem;
  color: white;
  margin: 0;
  font-weight: 700;
  text-shadow: 0 2px 10px rgba(0,0,0,0.3);
  
  @media (max-width: 480px) {
    font-size: 2rem;
  }
`;

const FilterTabs = styled.div`
  display: flex;
  gap: 10px;
  justify-content: center;
  margin-bottom: 30px;
`;

const FilterTab = styled.button<{ active: boolean }>`
  padding: 12px 24px;
  border: none;
  border-radius: 25px;
  background: ${props => props.active ? 'rgba(255, 255, 255, 0.9)' : 'rgba(255, 255, 255, 0.2)'};
  color: ${props => props.active ? '#333' : 'white'};
  font-weight: 600;
  cursor: pointer;
  transition: all 0.225s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.3);
  }
`;

const Main = styled.main`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 800px;
  margin: 0 auto;
  width: 100%;
  z-index: 5;
  position: relative;
`;

const SwarmGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  width: 100%;
`;

const SwarmCard = styled.div`
  background: rgba(255, 255, 255, 0.95);
  border-radius: 20px;
  padding: 25px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.2);
  transition: all 0.225s ease;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 15px 40px rgba(0,0,0,0.3);
  }
`;

const SwarmName = styled.h3`
  color: #333;
  margin: 0 0 10px 0;
  font-size: 1.3rem;
  font-weight: 600;
`;

const SwarmDescription = styled.p`
  color: #666;
  margin: 0 0 15px 0;
  font-size: 0.95rem;
  line-height: 1.4;
`;

const SwarmMeta = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  font-size: 0.85rem;
`;

const SwarmCategory = styled.span`
  background: rgba(102, 126, 234, 0.1);
  color: #667eea;
  padding: 4px 12px;
  border-radius: 15px;
  font-weight: 500;
`;

const SwarmPrivacy = styled.span<{ privacy: string }>`
  background: ${props => {
    switch(props.privacy) {
      case 'public': return 'rgba(46, 204, 113, 0.1)';
      case 'private': return 'rgba(241, 196, 15, 0.1)';
      case 'hidden': return 'rgba(155, 89, 182, 0.1)';
      default: return 'rgba(0,0,0,0.1)';
    }
  }};
  color: ${props => {
    switch(props.privacy) {
      case 'public': return '#2ecc71';
      case 'private': return '#f1c40f';
      case 'hidden': return '#9b59b6';
      default: return '#666';
    }
  }};
  padding: 4px 12px;
  border-radius: 15px;
  font-weight: 500;
  text-transform: capitalize;
`;

const SwarmActions = styled.div`
  display: flex;
  gap: 10px;
`;

const JoinButton = styled.button`
  flex: 1;
  background: #ff6b6b;
  color: white;
  border: none;
  padding: 12px 20px;
  border-radius: 25px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.225s ease;
  
  &:hover {
    background: #ff5252;
    transform: translateY(-1px);
  }
  
  &:disabled {
    background: #ccc;
    cursor: not-allowed;
    transform: none;
  }
`;

const ViewButton = styled.button`
  background: rgba(102, 126, 234, 0.1);
  color: #667eea;
  border: 1px solid #667eea;
  padding: 12px 20px;
  border-radius: 25px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.225s ease;
  
  &:hover {
    background: #667eea;
    color: white;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 60px 20px;
  color: rgba(255, 255, 255, 0.9);
`;

const LoadingState = styled.div`
  text-align: center;
  padding: 60px 20px;
  color: rgba(255, 255, 255, 0.9);
`;

const Message = styled.div<{ type: 'error' | 'success' }>`
  background: ${props => props.type === 'error' ? 'rgba(231, 76, 60, 0.1)' : 'rgba(46, 204, 113, 0.1)'};
  color: ${props => props.type === 'error' ? '#e74c3c' : '#2ecc71'};
  padding: 15px;
  border-radius: 10px;
  margin-bottom: 20px;
  font-weight: 500;
`;

const CreateSwarmPrompt = styled.div`
  text-align: center;
  padding: 40px 20px;
`;

const CreateSwarmButton = styled(Link)`
  display: inline-block;
  background: rgba(255, 255, 255, 0.9);
  color: #333;
  padding: 15px 30px;
  border-radius: 25px;
  text-decoration: none;
  font-weight: 600;
  font-size: 1.1rem;
  transition: all 0.225s ease;
  
  &:hover {
    background: white;
    transform: translateY(-2px);
  }
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

function SwarmsContent() {
  const searchParams = useSearchParams();
  const filter = searchParams.get('filter') || 'public';
  const [swarms, setSwarms] = useState<Swarm[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchSwarms();
  }, [filter]);

  const fetchSwarms = async () => {
    setLoading(true);
    setError('');
    
    try {
      let endpoint = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4444'}/api/swarms`;
      
      if (filter === 'my') {
        // Get swarm IDs from localStorage
        const mySwarmIds = localStorage.getItem('my-swarms') || '';
        endpoint = `${endpoint}?filter=my&swarmIds=${encodeURIComponent(mySwarmIds)}`;
      }
        
      const response = await fetch(endpoint);
      
      if (response.ok) {
        const data = await response.json();
        setSwarms(data);
      } else {
        setError('Failed to fetch swarms');
      }
    } catch (err) {
      setError('Network error. Please try again.');
      console.error('Error fetching swarms:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleJoinSwarm = async (swarm: Swarm) => {
    const nickname = prompt(`Enter your nickname for "${swarm.name}":`);
    if (!nickname) return;

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4444'}/api/swarms/${swarm.invite_code}/join`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nickname }),
      });

      if (response.ok) {
        const result = await response.json();
        localStorage.setItem('swarm-nickname', result.nickname);
        
        // Add to my swarms
        const mySwarms = localStorage.getItem('my-swarms') || '';
        const swarmIds = mySwarms ? mySwarms.split(',') : [];
        if (!swarmIds.includes(result.swarm_id)) {
          swarmIds.push(result.swarm_id);
          localStorage.setItem('my-swarms', swarmIds.join(','));
        }
        
        setSuccess(`Successfully joined "${result.swarm_name}" as ${result.nickname}!`);
        
        setTimeout(() => {
          window.location.href = `/live?swarmId=${result.swarm_id}&swarmName=${encodeURIComponent(result.swarm_name)}`;
        }, 1500);
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to join swarm');
      }
    } catch (err) {
      setError('Network error. Please try again.');
      console.error('Error joining swarm:', err);
    }
  };

  const handleViewSwarm = (swarm: Swarm) => {
    window.location.href = `/live?swarmId=${swarm.id}&swarmName=${encodeURIComponent(swarm.name)}`;
  };

  const getPageTitle = () => {
    switch(filter) {
      case 'public': return 'Public Swarms';
      case 'my': return 'My Swarms';
      case 'private': return 'Private Swarms';
      default: return 'Browse Swarms';
    }
  };

  const getEmptyMessage = () => {
    switch(filter) {
      case 'public': return 'No public swarms found. Be the first to create one!';
      case 'my': return 'You haven\'t created any swarms yet.';
      case 'private': return 'No private swarms found.';
      default: return 'No swarms found.';
    }
  };

  return (
    <Container>
      <MainMenu />
      
      <Header>
        <Logo>{getPageTitle()}</Logo>
      </Header>

      <Main>
        <FilterTabs>
          <FilterTab active={filter === 'public'} onClick={() => window.location.href = '/swarms?filter=public'}>
            Public
          </FilterTab>
          <FilterTab active={filter === 'my'} onClick={() => window.location.href = '/swarms?filter=my'}>
            My Swarms
          </FilterTab>
        </FilterTabs>

        {error && <Message type="error">{error}</Message>}
        {success && <Message type="success">{success}</Message>}

        {loading ? (
          <LoadingState>Loading swarms...</LoadingState>
        ) : swarms.length === 0 ? (
          <EmptyState>
            <h3>{getEmptyMessage()}</h3>
            {filter === 'public' && (
              <CreateSwarmPrompt>
                <CreateSwarmButton href="/create">
                  Create Your First Swarm
                </CreateSwarmButton>
              </CreateSwarmPrompt>
            )}
          </EmptyState>
        ) : (
          <SwarmGrid>
            {swarms.map((swarm) => (
              <SwarmCard key={swarm.id}>
                <SwarmName>{swarm.name}</SwarmName>
                <SwarmDescription>
                  {swarm.description || 'No description provided.'}
                </SwarmDescription>
                <SwarmMeta>
                  <SwarmCategory>{swarm.category}</SwarmCategory>
                  <SwarmPrivacy privacy={swarm.privacy}>{swarm.privacy}</SwarmPrivacy>
                </SwarmMeta>
                <SwarmActions>
                  <JoinButton onClick={() => handleJoinSwarm(swarm)}>
                    Join Swarm
                  </JoinButton>
                  <ViewButton onClick={() => handleViewSwarm(swarm)}>
                    View
                  </ViewButton>
                </SwarmActions>
              </SwarmCard>
            ))}
          </SwarmGrid>
        )}
      </Main>
    </Container>
  );
}

export default function SwarmsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SwarmsContent />
    </Suspense>
  );
}