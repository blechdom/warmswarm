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
  margin: 0 0 15px 0;
  font-size: 1.1rem;
  line-height: 1.4;
`;

const ActionCTA = styled.div`
  color: white;
  font-size: 1rem;
  font-weight: 600;
  margin-top: 10px;
  display: inline-block;
  padding: 8px 20px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 25px;
  border: 1px solid rgba(255, 255, 255, 0.4);
`;

const FeatureList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 20px 0 0 0;
  color: rgba(255, 255, 255, 0.85);
  font-size: 0.95rem;
  text-align: left;
  
  li {
    margin: 8px 0;
    padding-left: 20px;
    position: relative;
    
    &:before {
      content: "•";
      position: absolute;
      left: 0;
      color: rgba(255, 255, 255, 0.6);
    }
  }
`;

const SecondaryAction = styled.div`
  text-align: center;
  margin-top: 30px;
  color: rgba(255, 255, 255, 0.85);
  font-size: 0.95rem;
`;

const SecondaryLink = styled(Link)`
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
`;

export default function Home() {
  return (
    <Container>
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
          <ActionCard href="/join">
            <ActionIcon>🐝</ActionIcon>
            <ActionTitle>JOIN</ActionTitle>
            <ActionDescription>Have an invite code?</ActionDescription>
            <ActionCTA>Enter Code →</ActionCTA>
            <FeatureList>
              <li>Join instantly</li>
              <li>No account needed</li>
              <li>Experience live</li>
            </FeatureList>
          </ActionCard>
          
          <ActionCard href="/create/catalogue">
            <ActionIcon>🎨</ActionIcon>
            <ActionTitle>ORGANIZE</ActionTitle>
            <ActionDescription>Start a new swarm</ActionDescription>
            <ActionCTA>Get Started →</ActionCTA>
            <FeatureList>
              <li>Choose template</li>
              <li>Get invite code</li>
              <li>Share with group</li>
            </FeatureList>
          </ActionCard>
        </ActionGrid>
        
        {/* Advanced Builder Link */}
        <SecondaryAction>
          Need more control?
          <br />
          <SecondaryLink href="/create/constellation">
            🔧 Advanced Builder →
          </SecondaryLink>
        </SecondaryAction>
      </Main>
    </Container>
  );
}
