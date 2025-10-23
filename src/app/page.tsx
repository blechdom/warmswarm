'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
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
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  width: 100%;
  
  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

const ActionCard = styled(Link)`
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 20px;
  padding: 50px 30px;
  text-align: center;
  box-shadow: 0 10px 30px rgba(0,0,0,0.2);
  text-decoration: none;
  transition: all 0.225s ease;
  
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
  color: rgba(255, 255, 255, 0.9);
  margin: 0;
  font-size: 1rem;
  margin-bottom: 20px;
`;

const PillsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  justify-content: center;
  margin-top: 20px;
`;

const Pill = styled.span`
  background: rgba(255, 255, 255, 0.2);
  color: white;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 500;
  border: 1px solid rgba(255, 255, 255, 0.3);
  transition: all 0.2s ease;
  text-decoration: none;
  display: inline-block;
  
  &:hover {
    background: rgba(255, 255, 255, 0.3);
    transform: translateY(-2px);
  }
`;

const ClickablePill = styled.span`
  background: rgba(255, 255, 255, 0.2);
  color: white;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 500;
  border: 1px solid rgba(255, 255, 255, 0.3);
  transition: all 0.2s ease;
  text-decoration: none;
  display: inline-block;
  cursor: pointer;
  
  &:hover {
    background: rgba(255, 255, 255, 0.3);
    transform: translateY(-2px);
  }
`;

export default function Home() {
  const router = useRouter();
  
  const handlePillClick = (e: React.MouseEvent, href: string) => {
    e.preventDefault();
    e.stopPropagation();
    router.push(href);
  };
  
  return (
    <Container>
      {/* Element 1: Header with Logo */}
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
      
      {/* Element 3: Action Cards */}
      <Main>
        <ActionGrid>
          <ActionCard href="/swarm">
            <ActionIcon>🐝</ActionIcon>
            <ActionTitle>swarm</ActionTitle>
            <ActionDescription>Join a live swarm</ActionDescription>
            <PillsContainer>
              <ClickablePill onClick={(e) => handlePillClick(e, '/examples')}>
                🚀 Try an example swarm
              </ClickablePill>
              <ClickablePill onClick={(e) => handlePillClick(e, '/create/catalogue/swarms')}>
                ⚡ Start a swarm
              </ClickablePill>
              <ClickablePill onClick={(e) => handlePillClick(e, '/swarms')}>
                👥 Join a swarm
              </ClickablePill>
            </PillsContainer>
          </ActionCard>
          
          <ActionCard href="/create">
            <ActionIcon>✨</ActionIcon>
            <ActionTitle>create</ActionTitle>
            <ActionDescription>Build and organize content</ActionDescription>
            <PillsContainer>
              <ClickablePill onClick={(e) => handlePillClick(e, '/templates')}>
                📝 Get started with a template
              </ClickablePill>
              <Pill>📦 Collect</Pill>
              <Pill>🎭 Cast</Pill>
              <ClickablePill onClick={(e) => handlePillClick(e, '/create/constellation')}>
                🌟 Constellation
              </ClickablePill>
              <Pill>🎯 Coordinate</Pill>
              <Pill>📚 Catalogue</Pill>
              <Pill>🔗 Connect</Pill>
            </PillsContainer>
          </ActionCard>
          
          <ActionCard href="/wtf">
            <ActionIcon>❓</ActionIcon>
            <ActionTitle>wtf?</ActionTitle>
            <ActionDescription>How do I get started?</ActionDescription>
          </ActionCard>
          
          <ActionCard href="/about">
            <ActionIcon>💡</ActionIcon>
            <ActionTitle>about</ActionTitle>
            <ActionDescription>Who made this and why?</ActionDescription>
          </ActionCard>
        </ActionGrid>
      </Main>
    </Container>
  );
}
