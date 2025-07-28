'use client';

import Link from 'next/link';
import { useState } from 'react';
import styled from 'styled-components';

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
  box-sizing: border-box;
  position: relative;
  overflow: hidden;
`;

const SwarmGraphic = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 200px;
  pointer-events: none;
  z-index: 1;
`;

const SwarmDot = styled.div<{ size: number; left: number; delay: number; opacity: number; speed: number }>`
  position: absolute;
  width: ${props => props.size}px;
  height: ${props => props.size}px;
  background: rgba(255, 255, 255, ${props => props.opacity});
  border-radius: 50%;
  left: ${props => props.left}%;
  bottom: ${props => Math.random() * 180}px;
  animation: swarm ${props => props.speed}s ease-in-out infinite ${props => props.delay}s;
  
  @keyframes swarm {
    0% { transform: translateY(0px) translateX(0px) scale(1); }
    15% { transform: translateY(-${props => 15 + Math.random() * 25}px) translateX(${props => -8 + Math.random() * 16}px) scale(${props => 0.8 + Math.random() * 0.4}); }
    35% { transform: translateY(-${props => 25 + Math.random() * 35}px) translateX(${props => -12 + Math.random() * 24}px) scale(${props => 0.6 + Math.random() * 0.8}); }
    50% { transform: translateY(-${props => 30 + Math.random() * 40}px) translateX(${props => -15 + Math.random() * 30}px) scale(${props => 0.9 + Math.random() * 0.3}); }
    65% { transform: translateY(-${props => 20 + Math.random() * 25}px) translateX(${props => -6 + Math.random() * 18}px) scale(${props => 1.1 + Math.random() * 0.2}); }
    80% { transform: translateY(-${props => 8 + Math.random() * 15}px) translateX(${props => -3 + Math.random() * 12}px) scale(${props => 0.85 + Math.random() * 0.3}); }
    100% { transform: translateY(0px) translateX(0px) scale(1); }
  }
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
  transition: all 0.3s ease;
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
  transition: border-color 0.3s ease;
  
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
  transition: all 0.3s ease;
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
  transition: all 0.3s ease;
  
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

export default function JoinSwarm() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const generateSwarmDots = () => {
    const dots = [];
    for (let i = 0; i < 30; i++) {
      dots.push(
        <SwarmDot
          key={i}
          size={2 + Math.random() * 10}
          left={Math.random() * 100}
          delay={Math.random() * 4}
          opacity={0.2 + Math.random() * 0.5}
          speed={2.5 + Math.random() * 3.5}
        />
      );
    }
    return dots;
  };

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
        (e.target as HTMLFormElement).reset();
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
    setIsLoading(true);
    setError('');
    
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4444'}/api/swarms`);
      
      if (response.ok) {
        const swarms = await response.json();
        // For now, just show an alert with the swarms
        // In a real app, you'd navigate to a browse page
        if (swarms.length > 0) {
          const swarmsList = swarms.map((s: any) => `${s.name} (${s.category})`).join('\n');
          alert(`Public Swarms:\n${swarmsList}`);
        } else {
          alert('No public swarms found');
        }
      } else {
        setError('Failed to fetch public swarms');
      }
    } catch (err) {
      setError('Network error. Please try again.');
      console.error('Error fetching swarms:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container>
      <BackButton href="/">← Back</BackButton>
      
      <Header>
        <Logo>Join Swarm</Logo>
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
          
          <BrowseButton type="button" onClick={handleBrowseClick} disabled={isLoading}>
            Browse Public Swarms
          </BrowseButton>
        </Card>
      </Main>
      
      <SwarmGraphic>
        {generateSwarmDots()}
      </SwarmGraphic>
      
      <Footer>
        <p>WarmSwarm.org</p>
      </Footer>
    </Container>
  );
}