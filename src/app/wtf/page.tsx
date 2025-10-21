'use client';

import styled from 'styled-components';
import MainMenu from '@/components/MainMenu';

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
  font-family: 'Quantico', Arial, Helvetica, sans-serif;
  padding: 20px;
  box-sizing: border-box;
`;

const Header = styled.header`
  text-align: center;
  padding: 60px 20px 40px;
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
  justify-content: center;
  padding: 20px;
`;

const ContentCard = styled.div`
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 25px;
  padding: 50px 40px;
  max-width: 800px;
  width: 100%;
  
  @media (max-width: 768px) {
    padding: 30px 25px;
  }
`;

const SectionTitle = styled.h2`
  font-size: 2rem;
  color: white;
  margin: 0 0 20px 0;
  font-weight: 700;
  text-shadow: 0 2px 10px rgba(0,0,0,0.2);
  
  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
`;

const SectionText = styled.p`
  font-size: 1.1rem;
  color: rgba(255, 255, 255, 0.9);
  line-height: 1.8;
  margin: 0 0 30px 0;
  
  @media (max-width: 768px) {
    font-size: 1rem;
  }
`;

const StepList = styled.ol`
  font-size: 1.1rem;
  color: rgba(255, 255, 255, 0.9);
  line-height: 1.8;
  padding-left: 25px;
  margin: 20px 0;
  
  @media (max-width: 768px) {
    font-size: 1rem;
    padding-left: 20px;
  }
`;

const StepItem = styled.li`
  margin-bottom: 15px;
  
  strong {
    color: white;
    font-weight: 700;
  }
`;

export default function WTFPage() {
  return (
    <Container>
      <MainMenu />
      
      <Header>
        <Logo>❓ wtf?</Logo>
        <Tagline>Getting started with warmswarm</Tagline>
      </Header>
      
      <Main>
        <ContentCard>
          <SectionTitle>What is warmswarm?</SectionTitle>
          <SectionText>
            warmswarm is a platform for coordinated group performances. 
            Think of it as a way to create synchronized experiences where multiple people 
            can participate together, each playing a different role with different content.
          </SectionText>

          <SectionTitle>How does it work?</SectionTitle>
          <StepList>
            <StepItem>
              <strong>Collect</strong> – Gather your content (audio, images, video)
            </StepItem>
            <StepItem>
              <strong>Cast</strong> – Define roles for different participants with unique permissions
            </StepItem>
            <StepItem>
              <strong>Coordinate</strong> – Arrange content into sequences, layers, and swarm configurations
            </StepItem>
            <StepItem>
              <strong>Catalogue</strong> – Browse and manage all your components in one place
            </StepItem>
            <StepItem>
              <strong>Connect</strong> – Share invitations, schedule sessions, and go live
            </StepItem>
          </StepList>

          <SectionTitle>What can I create?</SectionTitle>
          <SectionText>
            <strong>Performances:</strong> Coordinated audio/visual experiences<br/>
            <strong>Events:</strong> Guided group activities with timed content<br/>
            <strong>Installations:</strong> Interactive art pieces with multiple participants<br/>
            <strong>Games:</strong> Multi-player experiences with role-based interactions<br/>
            <strong>Rituals:</strong> Synchronized group activities with shared timing
          </SectionText>

          <SectionTitle>Ready to start?</SectionTitle>
          <SectionText>
            Click <strong>create</strong> on the homepage to begin building your first swarm experience!
          </SectionText>
        </ContentCard>
      </Main>
    </Container>
  );
}

