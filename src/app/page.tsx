'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import styled from 'styled-components';

const Container = styled.div\`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: linear-gradient(135deg, #d63384 0%, #d946ef 50%, #dc2626 100%);
  padding: 20px;
  box-sizing: border-box;
  position: relative;
  overflow: hidden;
  font-family: 'Quantico', Arial, Helvetica, sans-serif;
\`;

const Header = styled.header\`
  text-align: center;
  margin-bottom: 40px;
  padding-top: 40px;
  z-index: 5;
  position: relative;
\`;

const Logo = styled.h1\`
  font-size: 3.5rem;
  color: white;
  margin: 0 0 20px 0;
  font-weight: 700;
  text-shadow: 0 2px 10px rgba(0,0,0,0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0;
  
  @media (max-width: 480px) {
    font-size: 2.5rem;
  }
\`;

const LogoImage = styled.img\`
  height: 7rem;
  width: auto;
  filter: drop-shadow(0 2px 10px rgba(0,0,0,0.3));
  margin: 0 10px;
  
  @media (max-width: 480px) {
    height: 5rem;
    margin: 0 5px;
  }
\`;

const Tagline = styled.p\`
  font-size: 1.2rem;
  color: rgba(255, 255, 255, 0.9);
  margin: 0;
  text-shadow: 0 1px 5px rgba(0,0,0,0.2);
\`;

const HelpLink = styled(Link)\`
  position: absolute;
  top: 20px;
  right: 20px;
  color: white;
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 700;
  font-size: 1.1rem;
  padding: 10px 20px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.15);
  border: 2px solid rgba(255, 255, 255, 0.3);
  transition: all 0.2s ease;
  z-index: 10;
  
  &:hover {
    background: rgba(255, 255, 255, 0.25);
    border-color: white;
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(0,0,0,0.2);
  }
\`;

const Main = styled.main\`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 800px;
  margin: 0 auto;
  width: 100%;
  z-index: 5;
  position: relative;
  gap: 20px;
\`;

const ActionGrid = styled.div\`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  width: 100%;
  
  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
\`;

const ActionCard = styled.div\`
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 20px;
  padding: 50px 30px;
  text-align: center;
  box-shadow: 0 10px 30px rgba(0,0,0,0.2);
  transition: all 0.225s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.25);
    transform: translateY(-5px);
    box-shadow: 0 15px 40px rgba(0,0,0,0.3);
  }
\`;

const LinkCard = styled(Link)\`
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 20px;
  padding: 50px 30px;
  text-align: center;
  box-shadow: 0 10px 30px rgba(0,0,0,0.2);
  text-decoration: none;
  transition: all 0.225s ease;
  display: block;
  
  &:hover {
    background: rgba(255, 255, 255, 0.25);
    transform: translateY(-5px);
    box-shadow: 0 15px 40px rgba(0,0,0,0.3);
  }
\`;

const ActionIcon = styled.div\`
  font-size: 4rem;
  margin-bottom: 20px;
\`;

const ActionTitle = styled.h2\`
  color: white;
  margin: 0 0 10px 0;
  font-size: 2rem;
  font-weight: 700;
  text-shadow: 0 2px 10px rgba(0,0,0,0.2);
\`;

const ActionDescription = styled.p\`
  color: rgba(255, 255, 255, 0.85);
  margin: 10px 0 20px 0;
  font-size: 1rem;
  line-height: 1.5;
\`;

const CodeInput = styled.input\`
  width: 200px;
  padding: 15px 20px;
  font-size: 2rem;
  text-align: center;
  text-transform: uppercase;
  letter-spacing: 0.5rem;
  border: 2px solid rgba(255, 255, 255, 0.5);
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.9);
  color: #333;
  font-weight: 700;
  outline: none;
  transition: all 0.2s ease;
  
  &:focus {
    border-color: white;
    background: white;
    box-shadow: 0 0 20px rgba(255, 255, 255, 0.5);
  }
  
  &::placeholder {
    color: rgba(0, 0, 0, 0.3);
    letter-spacing: 0.3rem;
  }
\`;

const JoinButton = styled.button\`
  margin-top: 15px;
  padding: 12px 30px;
  font-size: 1.1rem;
  font-weight: 700;
  color: white;
  background: rgba(255, 255, 255, 0.2);
  border: 2px solid white;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover:not(:disabled) {
    background: white;
    color: #d946ef;
    transform: translateY(-2px);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
\`;

const SecondaryAction = styled.div\`
  text-align: center;
  margin-top: 40px;
\`;

const SecondaryLink = styled(Link)\`
  color: white;
  text-decoration: none;
  font-weight: 600;
  padding: 10px 20px;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.3);
  display: inline-block;
  transition: all 0.2s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: translateY(-2px);
  }
\`;

export default function Home() {
  const router = useRouter();
  const [inviteCode, setInviteCode] = useState('');

  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
    if (value.length <= 4) {
      setInviteCode(value);
    }
  };

  const handleJoinClick = () => {
    if (inviteCode.length === 4) {
      router.push(\`/join?code=\${inviteCode}\`);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && inviteCode.length === 4) {
      handleJoinClick();
    }
  };

  return (
    <Container>
      {/* WTF Help Link */}
      <HelpLink href="/wtf">
        ❓ WTF?
      </HelpLink>

      {/* Header with Logo */}
      <Header>
        <Logo>
          warm
          <LogoImage 
            src="/warmswarm-logo-transparent.png" 
            alt="WarmSwarm Logo"
          />
          swarm
        </Logo>
        <Tagline>synchronize action · coordinate chaos</Tagline>
      </Header>
      
      {/* Two Main Action Cards */}
      <Main>
        <ActionGrid>
          <ActionCard>
            <ActionIcon>🐝</ActionIcon>
            <ActionTitle>JOIN Swarm</ActionTitle>
            <ActionDescription>
              Have an invite code?<br/>
              Enter and experience live
            </ActionDescription>
            <CodeInput
              type="text"
              value={inviteCode}
              onChange={handleCodeChange}
              onKeyPress={handleKeyPress}
              placeholder="ABCD"
              maxLength={4}
              autoComplete="off"
            />
            <JoinButton 
              onClick={handleJoinClick}
              disabled={inviteCode.length !== 4}
            >
              Join Now →
            </JoinButton>
          </ActionCard>
          
          <LinkCard href="/create/catalogue">
            <ActionIcon>🎨</ActionIcon>
            <ActionTitle>ORGANIZE a Swarm</ActionTitle>
            <ActionDescription>
              Start a new swarm<br/>
              Choose template & share
            </ActionDescription>
          </LinkCard>
        </ActionGrid>
        
        {/* Advanced Builder Link */}
        <SecondaryAction>
          <SecondaryLink href="/create/constellation">
            🔧 Advanced Builder →
          </SecondaryLink>
        </SecondaryAction>
      </Main>
    </Container>
  );
}
