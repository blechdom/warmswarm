'use client';

import Link from 'next/link';
import { useState } from 'react';
import styled from 'styled-components';

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


const BackButton = styled(Link)`
  position: absolute;
  top: 20px;
  left: 20px;
  background: rgba(255, 255, 255, 0.2);
  color: white;
  padding: 10px 20px;
  border-radius: 25px;
  text-decoration: none;
  font-weight: 500;
  transition: all 0.225s ease;
  z-index: 10;
  
  &:hover {
    background: rgba(255, 255, 255, 0.3);
  }
`;

const Header = styled.header`
  text-align: center;
  margin-bottom: 40px;
  padding-top: 60px;
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

const Main = styled.main`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 350px;
  margin: 0 auto;
  width: 100%;
  z-index: 5;
  position: relative;
`;

const Card = styled.div`
  background: rgba(255, 255, 255, 0.95);
  border-radius: 20px;
  padding: 30px;
  text-align: center;
  box-shadow: 0 10px 30px rgba(0,0,0,0.2);
`;

const Title = styled.h2`
  color: #333;
  margin: 0 0 25px 0;
  font-size: 1.4rem;
  font-weight: 600;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
  text-align: left;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Label = styled.label`
  color: #333;
  font-weight: 500;
  font-size: 0.9rem;
`;

const Input = styled.input`
  padding: 12px;
  border: 2px solid #e0e0e0;
  border-radius: 10px;
  font-size: 1rem;
  transition: border-color 0.225s ease;
  
  &:focus {
    outline: none;
    border-color: #667eea;
  }
`;

const SubmitButton = styled.button`
  background: #4CAF50;
  color: white;
  padding: 15px;
  border: none;
  border-radius: 25px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.225s ease;
  margin-top: 10px;
  
  &:disabled {
    background: #ccc;
    cursor: not-allowed;
    transform: none;
  }
  
  &:hover:not(:disabled) {
    background: #45a049;
    transform: translateY(-1px);
  }
  
  &:active:not(:disabled) {
    transform: translateY(0);
  }
`;

const OrDivider = styled.div`
  display: flex;
  align-items: center;
  margin: 20px 0;
  
  &::before,
  &::after {
    content: '';
    flex: 1;
    height: 1px;
    background: #e0e0e0;
  }
  
  span {
    padding: 0 15px;
    color: #888;
    font-size: 0.9rem;
  }
`;

const BrowseButton = styled.button`
  background: rgba(255, 255, 255, 0.1);
  color: #667eea;
  border: 2px solid #667eea;
  padding: 12px;
  border-radius: 25px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.225s ease;
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  
  &:hover:not(:disabled) {
    background: #667eea;
    color: white;
  }
`;

const Message = styled.div<{ type: 'error' | 'success' }>`
  padding: 12px;
  border-radius: 8px;
  margin-bottom: 15px;
  font-size: 0.9rem;
  background: ${props => props.type === 'error' ? '#ffebee' : '#e8f5e8'};
  color: ${props => props.type === 'error' ? '#c62828' : '#2e7d32'};
  border: 1px solid ${props => props.type === 'error' ? '#ffcdd2' : '#c8e6c9'};
`;

const Footer = styled.footer`
  text-align: center;
  margin-top: 40px;
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.9rem;
  z-index: 5;
  position: relative;
`;

const ModalOverlay = styled.div`
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
  padding: 20px;
`;

const ModalContent = styled.div`
  background: white;
  border-radius: 20px;
  padding: 30px;
  max-width: 500px;
  width: 100%;
  max-height: 80vh;
  overflow-y: auto;
  position: relative;
  box-shadow: 0 20px 60px rgba(0,0,0,0.3);
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const ModalTitle = styled.h3`
  color: #333;
  margin: 0;
  font-size: 1.4rem;
  font-weight: 600;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 1.5rem;
  color: #999;
  cursor: pointer;
  padding: 5px;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    background: #f0f0f0;
    color: #333;
  }
`;

const SwarmList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const SwarmItem = styled.div`
  border: 2px solid #e0e0e0;
  border-radius: 15px;
  padding: 20px;
  transition: all 0.225s ease;
  
  &:hover {
    border-color: #667eea;
    box-shadow: 0 4px 15px rgba(102, 126, 234, 0.15);
  }
`;

const SwarmName = styled.h4`
  color: #333;
  margin: 0 0 8px 0;
  font-size: 1.1rem;
  font-weight: 600;
`;

const SwarmCategory = styled.p`
  color: #666;
  margin: 0 0 15px 0;
  font-size: 0.9rem;
`;

const SwarmActions = styled.div`
  display: flex;
  gap: 10px;
`;

const JoinSwarmButton = styled.button`
  background: #4CAF50;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.225s ease;
  
  &:hover {
    background: #45a049;
    transform: translateY(-1px);
  }
  
  &:disabled {
    background: #ccc;
    cursor: not-allowed;
    transform: none;
  }
`;

const ViewSwarmButton = styled.button`
  background: rgba(102, 126, 234, 0.1);
  color: #667eea;
  border: 1px solid #667eea;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.225s ease;
  
  &:hover {
    background: #667eea;
    color: white;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 40px 20px;
  color: #666;
`;

const LoadingState = styled.div`
  text-align: center;
  padding: 40px 20px;
  color: #666;
`;

interface Swarm {
  id: string;
  name: string;
  category: string;
  invite_code: string;
}

export default function JoinSwarm() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [swarms, setSwarms] = useState<Swarm[]>([]);
  const [modalLoading, setModalLoading] = useState(false);


  const handleJoinSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');
    
    const formData = new FormData(e.target as HTMLFormElement);
    const inviteCode = formData.get('inviteCode') as string;
    const nickname = formData.get('nickname') as string;

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4444'}/api/swarms/${inviteCode}/join`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nickname }),
      });

      if (response.ok) {
        const result = await response.json();
        setSuccess(`Successfully joined "${result.swarm_name}" as ${result.nickname}!`);
        
        // Store nickname for live session
        localStorage.setItem('swarm-nickname', result.nickname);
        
        // Redirect to live session after a short delay
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
    } finally {
      setIsLoading(false);
    }
  };

  const handleBrowseClick = async () => {
    setShowModal(true);
    setModalLoading(true);
    setError('');
    
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4444'}/api/swarms`);
      
      if (response.ok) {
        const swarmsData = await response.json();
        setSwarms(swarmsData);
      } else {
        setError('Failed to fetch public swarms');
      }
    } catch (err) {
      setError('Network error. Please try again.');
      console.error('Error fetching swarms:', err);
    } finally {
      setModalLoading(false);
    }
  };

  const handleJoinSwarm = async (swarm: Swarm) => {
    const nickname = prompt(`Enter your nickname for "${swarm.name}":`);
    if (!nickname) return;

    setModalLoading(true);
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
        setShowModal(false);
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
    } finally {
      setModalLoading(false);
    }
  };

  const handleViewSwarm = (swarm: Swarm) => {
    window.location.href = `/live?swarmId=${swarm.id}&swarmName=${encodeURIComponent(swarm.name)}`;
  };

  const closeModal = () => {
    setShowModal(false);
    setSwarms([]);
    setError('');
  };

  return (
    <Container>
      <BackButton href="/">← Back</BackButton>
      
      <Header>
        <Logo>Join a Swarm</Logo>
      </Header>
      
      <Main>
        <Card>
          <Title>🐝 Join Existing Swarm</Title>
          
          {error && <Message type="error">{error}</Message>}
          {success && <Message type="success">{success}</Message>}
          
          <Form onSubmit={handleJoinSubmit}>
            <FormGroup>
              <Label htmlFor="inviteCode">Invite Code</Label>
              <Input 
                id="inviteCode"
                name="inviteCode"
                type="text" 
                placeholder="Enter your invite code"
                required
                disabled={isLoading}
              />
            </FormGroup>
            
            <FormGroup>
              <Label htmlFor="nickname">Your Nickname</Label>
              <Input 
                id="nickname"
                name="nickname"
                type="text" 
                placeholder="How should others know you?"
                required
                disabled={isLoading}
              />
            </FormGroup>
            
            <SubmitButton type="submit" disabled={isLoading}>
              {isLoading ? 'Joining...' : 'Join Swarm'}
            </SubmitButton>
          </Form>
          
          <OrDivider>
            <span>or</span>
          </OrDivider>
          
          <BrowseButton as={Link} href="/swarms?filter=public">
            Browse Public Swarms
          </BrowseButton>
        </Card>
      </Main>
      
      <Footer>
        <p>WarmSwarm.org</p>
      </Footer>

      {showModal && (
        <ModalOverlay onClick={closeModal}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <ModalHeader>
              <ModalTitle>🌐 Browse Public Swarms</ModalTitle>
              <CloseButton onClick={closeModal}>×</CloseButton>
            </ModalHeader>

            {modalLoading ? (
              <LoadingState>Loading swarms...</LoadingState>
            ) : swarms.length === 0 ? (
              <EmptyState>
                <p>No public swarms found</p>
                <p>Create a new swarm to get started!</p>
              </EmptyState>
            ) : (
              <SwarmList>
                {swarms.map((swarm) => (
                  <SwarmItem key={swarm.id}>
                    <SwarmName>{swarm.name}</SwarmName>
                    <SwarmCategory>Category: {swarm.category}</SwarmCategory>
                    <SwarmActions>
                      <JoinSwarmButton 
                        onClick={() => handleJoinSwarm(swarm)}
                        disabled={modalLoading}
                      >
                        Join Swarm
                      </JoinSwarmButton>
                      <ViewSwarmButton 
                        onClick={() => handleViewSwarm(swarm)}
                      >
                        View Details
                      </ViewSwarmButton>
                    </SwarmActions>
                  </SwarmItem>
                ))}
              </SwarmList>
            )}
          </ModalContent>
        </ModalOverlay>
      )}
    </Container>
  );
}