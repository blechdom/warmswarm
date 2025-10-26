'use client';

import Link from 'next/link';
import styled from 'styled-components';

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #8b5cf6 100%);
  padding: 20px;
  box-sizing: border-box;
  position: relative;
  overflow: hidden;
  font-family: 'Quantico', Arial, Helvetica, sans-serif;
`;

const Header = styled.header`
  text-align: center;
  margin-bottom: 40px;
  padding-top: 40px;
  z-index: 5;
  position: relative;
`;

const Logo = styled.h1`
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
`;

const LogoImage = styled.img`
  height: 7rem;
  width: auto;
  filter: drop-shadow(0 2px 10px rgba(0,0,0,0.3));
  margin: 0 10px;
  
  @media (max-width: 480px) {
    height: 5rem;
    margin: 0 5px;
  }
`;

const Tagline = styled.p`
  font-size: 1.2rem;
  color: rgba(255, 255, 255, 0.9);
  margin: 0;
  text-shadow: 0 1px 5px rgba(0,0,0,0.2);
`;

const HelpLink = styled(Link)`
  position: absolute;
  top: 20px;
  right: 20px;
  color: rgba(255, 255, 255, 0.95);
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 700;
  font-size: 1.1rem;
  padding: 10px 20px;
  border-radius: 12px;
  background: rgba(0, 0, 0, 0.25);
  border: 2px solid rgba(255, 255, 255, 0.3);
  transition: all 0.2s ease;
  z-index: 10;
  text-shadow: 0 2px 4px rgba(0,0,0,0.4);
  
  &:hover {
    background: rgba(0, 0, 0, 0.35);
    border-color: white;
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(0,0,0,0.3);
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
  gap: 20px;
`;

const ActionGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  width: 100%;
  max-width: 900px;
  
  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

const LinkCard = styled(Link)`
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
`;

const ActionIcon = styled.div`
  font-size: 4rem;
  margin-bottom: 20px;
`;

const ActionTitle = styled.h2`
  color: white;
  margin: 0 0 10px 0;
  font-size: 2rem;
  font-weight: 700;
  text-shadow: 0 2px 10px rgba(0,0,0,0.2);
`;

const ActionDescription = styled.p`
  color: rgba(255, 255, 255, 0.85);
  margin: 10px 0 20px 0;
  font-size: 1rem;
  line-height: 1.5;
`;

const DemoSection = styled.div`
  text-align: center;
  margin-top: 40px;
  padding-bottom: 40px;
`;

const DemoButton = styled(Link)`
  color: white;
  text-decoration: none;
  font-weight: 600;
  font-size: 1.1rem;
  padding: 15px 30px;
  border-radius: 25px;
  background: rgba(255, 255, 255, 0.1);
  border: 2px solid rgba(255, 255, 255, 0.3);
  display: inline-flex;
  align-items: center;
  gap: 10px;
  transition: all 0.2s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(0,0,0,0.2);
  }
`;

export default function Home() {
  return (
    <Container>
      <HelpLink href="/wtf">
        ❓ WTF?
      </HelpLink>

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
      
      <Main>
        <ActionGrid>
          <LinkCard href="/swarm">
            <ActionIcon>🐝</ActionIcon>
            <ActionTitle>join a swarm</ActionTitle>
            <ActionDescription>
              🎯 coordinate chaos
            </ActionDescription>
          </LinkCard>
          
          <LinkCard href="/draw">
            <ActionIcon>🎨</ActionIcon>
            <ActionTitle>draw a swarm</ActionTitle>
            <ActionDescription>
              ✏️ collaborative drawing
            </ActionDescription>
          </LinkCard>
          
          <LinkCard href="/templates">
            <ActionIcon>📋</ActionIcon>
            <ActionTitle>organize a swarm</ActionTitle>
            <ActionDescription>
              🧩 make it your own
            </ActionDescription>
          </LinkCard>
          
          <LinkCard href="/create/constellation">
            <ActionIcon>🔧</ActionIcon>
            <ActionTitle>advanced builder</ActionTitle>
            <ActionDescription>
              🚀 full control
            </ActionDescription>
          </LinkCard>
        </ActionGrid>
        
        <DemoSection>
          <DemoButton href="/demos">
            🎮 Demo Gallery
          </DemoButton>
        </DemoSection>
      </Main>
    </Container>
  );
}

