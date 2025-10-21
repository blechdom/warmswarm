'use client';

import Link from 'next/link';
import styled from 'styled-components';
import MainMenu from '@/components/MainMenu';

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: linear-gradient(135deg, #1b5e20 0%, #2e7d32 50%, #388e3c 100%);
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
  font-size: 3rem;
  color: white;
  margin: 0 0 15px 0;
  font-weight: 700;
  text-shadow: 0 2px 10px rgba(0,0,0,0.3);
  
  @media (max-width: 480px) {
    font-size: 2rem;
  }
`;

const Tagline = styled.p`
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.9);
  margin: 0;
  text-shadow: 0 1px 5px rgba(0,0,0,0.2);
`;

const Main = styled.main`
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 900px;
  margin: 0 auto;
  width: 100%;
  z-index: 5;
  position: relative;
  gap: 20px;
  padding-bottom: 40px;
`;

const FeatureGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  width: 100%;
  
  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

const FeatureCard = styled.button`
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 20px;
  padding: 40px 30px;
  text-align: center;
  box-shadow: 0 10px 30px rgba(0,0,0,0.2);
  cursor: pointer;
  transition: all 0.225s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.25);
    transform: translateY(-5px);
    box-shadow: 0 15px 40px rgba(0,0,0,0.3);
  }
`;

const FeatureIcon = styled.div`
  font-size: 3.5rem;
  margin-bottom: 15px;
`;

const FeatureTitle = styled.h2`
  color: white;
  margin: 0 0 10px 0;
  font-size: 1.5rem;
  font-weight: 700;
  text-shadow: 0 2px 10px rgba(0,0,0,0.2);
`;

const FeatureDescription = styled.p`
  color: rgba(255, 255, 255, 0.9);
  margin: 0;
  font-size: 0.9rem;
  line-height: 1.4;
`;

export default function Connect() {
  return (
    <Container>
      {/* Element 1: Navigation Header */}
      <MainMenu />
      
      {/* Element 2: Header with Title */}
      <Header>
        <Logo>🔗 Connect</Logo>
        <Tagline>Share, invite, and schedule swarms</Tagline>
      </Header>
      
      {/* Element 3: Feature Options */}
      <Main>
        <FeatureGrid>
          <FeatureCard onClick={() => alert('QR Code feature coming soon!')}>
            <FeatureIcon>📱</FeatureIcon>
            <FeatureTitle>Share QR Code</FeatureTitle>
            <FeatureDescription>
              Generate QR codes to easily share swarm invitations
            </FeatureDescription>
          </FeatureCard>
          
          <FeatureCard onClick={() => alert('Invite feature coming soon!')}>
            <FeatureIcon>✉️</FeatureIcon>
            <FeatureTitle>Send Invites</FeatureTitle>
            <FeatureDescription>
              Invite people to join your swarm via email or link
            </FeatureDescription>
          </FeatureCard>
          
          <FeatureCard onClick={() => alert('Schedule feature coming soon!')}>
            <FeatureIcon>📅</FeatureIcon>
            <FeatureTitle>Schedule Swarms</FeatureTitle>
            <FeatureDescription>
              Plan and schedule upcoming swarms in advance
            </FeatureDescription>
          </FeatureCard>
        </FeatureGrid>
      </Main>
    </Container>
  );
}

