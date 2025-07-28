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

const SwarmDot = styled.div<{ size: number; left: number; delay: number; opacity: number }>`
  position: absolute;
  width: ${props => props.size}px;
  height: ${props => props.size}px;
  background: rgba(255, 255, 255, ${props => props.opacity});
  border-radius: 50%;
  left: ${props => props.left}%;
  bottom: ${props => Math.random() * 150}px;
  animation: float ${props => 3 + Math.random() * 4}s ease-in-out infinite ${props => props.delay}s;
  
  @keyframes float {
    0%, 100% { transform: translateY(0px) translateX(0px); }
    25% { transform: translateY(-${props => 10 + Math.random() * 20}px) translateX(${props => -5 + Math.random() * 10}px); }
    50% { transform: translateY(-${props => 20 + Math.random() * 30}px) translateX(${props => -10 + Math.random() * 20}px); }
    75% { transform: translateY(-${props => 10 + Math.random() * 15}px) translateX(${props => -2 + Math.random() * 8}px); }
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

const TextArea = styled.textarea`
  padding: 12px;
  border: 2px solid #e0e0e0;
  border-radius: 10px;
  font-size: 1rem;
  min-height: 80px;
  resize: vertical;
  font-family: inherit;
  transition: border-color 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: #667eea;
  }
`;

const Select = styled.select`
  padding: 12px;
  border: 2px solid #e0e0e0;
  border-radius: 10px;
  font-size: 1rem;
  background: white;
  transition: border-color 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: #667eea;
  }
`;

const SubmitButton = styled.button`
  background: #ff6b6b;
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
    background: #ff5252;
    transform: translateY(-1px);
  }
  
  &:active:not(:disabled) {
    transform: translateY(0);
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

export default function CreateSwarm() {
  const generateSwarmDots = () => {
    const dots = [];
    for (let i = 0; i < 25; i++) {
      dots.push(
        <SwarmDot
          key={i}
          size={3 + Math.random() * 8}
          left={Math.random() * 100}
          delay={Math.random() * 3}
          opacity={0.3 + Math.random() * 0.4}
        />
      );
    }
    return dots;
  };

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');
    
    const formData = new FormData(e.target as HTMLFormElement);
    const data = {
      name: formData.get('swarmName') as string,
      description: formData.get('description') as string,
      privacy: formData.get('privacy') as string,
      category: formData.get('category') as string,
    };

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/swarms`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const result = await response.json();
        setSuccess(`Swarm created successfully! Invite code: ${result.invite_code}`);
        (e.target as HTMLFormElement).reset();
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to create swarm');
      }
    } catch (err) {
      setError('Network error. Please try again.');
      console.error('Error creating swarm:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container>
      <BackButton href="/">← Back</BackButton>
      
      <Header>
        <Logo>Create Swarm</Logo>
      </Header>
      
      <Main>
        <Card>
          <Title>🐝 Create New Swarm</Title>
          
          {error && <Message type="error">{error}</Message>}
          {success && <Message type="success">{success}</Message>}
          
          <Form onSubmit={handleSubmit}>
            <FormGroup>
              <Label htmlFor="swarmName">Swarm Name</Label>
              <Input 
                id="swarmName"
                name="swarmName"
                type="text" 
                placeholder="Enter your swarm name"
                required
                disabled={isLoading}
              />
            </FormGroup>
            
            <FormGroup>
              <Label htmlFor="description">Description</Label>
              <TextArea 
                id="description"
                name="description"
                placeholder="What's your swarm about?"
                required
                disabled={isLoading}
              />
            </FormGroup>
            
            <FormGroup>
              <Label htmlFor="privacy">Privacy Setting</Label>
              <Select id="privacy" name="privacy" required disabled={isLoading}>
                <option value="">Select privacy level</option>
                <option value="public">Public - Anyone can join</option>
                <option value="private">Private - Invite only</option>
                <option value="hidden">Hidden - Not searchable</option>
              </Select>
            </FormGroup>
            
            <FormGroup>
              <Label htmlFor="category">Category</Label>
              <Select id="category" name="category" required disabled={isLoading}>
                <option value="">Select category</option>
                <option value="event">Event</option>
                <option value="project">Project</option>
                <option value="social">Social</option>
                <option value="work">Work</option>
                <option value="other">Other</option>
              </Select>
            </FormGroup>
            
            <SubmitButton type="submit" disabled={isLoading}>
              {isLoading ? 'Creating...' : 'Create Swarm'}
            </SubmitButton>
          </Form>
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