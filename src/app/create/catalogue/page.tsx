'use client';

import styled from 'styled-components';
import MainMenu from '@/components/MainMenu';

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: linear-gradient(135deg, #bf360c 0%, #d84315 50%, #c62828 100%);
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

const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 30px;
  max-width: 1200px;
  width: 100%;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    max-width: 400px;
  }
`;

const ContentCard = styled.a`
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 20px;
  padding: 40px 30px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  text-decoration: none;
  display: flex;
  flex-direction: column;
  align-items: center;
  
  &:hover {
    background: rgba(255, 255, 255, 0.25);
    transform: translateY(-5px);
    box-shadow: 0 15px 40px rgba(0,0,0,0.2);
  }
`;

const ContentIcon = styled.div`
  font-size: 3.5rem;
  margin-bottom: 15px;
`;

const ContentTitle = styled.h3`
  font-size: 1.5rem;
  color: white;
  margin: 0 0 10px 0;
  font-weight: 700;
  text-shadow: 0 2px 10px rgba(0,0,0,0.2);
`;

const ContentDescription = styled.p`
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.9);
  margin: 0;
  line-height: 1.4;
`;

export default function Catalogue() {
  return (
    <Container>
      <MainMenu />
      
      <Header>
        <Logo>📚 Catalogue</Logo>
        <Tagline>Browse and manage your components</Tagline>
      </Header>
      
      <Main>
        <ContentGrid>
          <ContentCard href="/create/catalogue/audio">
            <ContentIcon>🎵</ContentIcon>
            <ContentTitle>Audio</ContentTitle>
            <ContentDescription>
              Browse and manage all audio content
            </ContentDescription>
          </ContentCard>

          <ContentCard href="/create/catalogue/image">
            <ContentIcon>🖼️</ContentIcon>
            <ContentTitle>Images</ContentTitle>
            <ContentDescription>
              Browse and manage all image content
            </ContentDescription>
          </ContentCard>

          <ContentCard href="/create/catalogue/video">
            <ContentIcon>🎬</ContentIcon>
            <ContentTitle>Video</ContentTitle>
            <ContentDescription>
              Browse and manage all video content
            </ContentDescription>
          </ContentCard>

          <ContentCard href="/create/catalogue/sequences">
            <ContentIcon>📊</ContentIcon>
            <ContentTitle>Sequences</ContentTitle>
            <ContentDescription>
              Browse and manage all sequences
            </ContentDescription>
          </ContentCard>

          <ContentCard href="/create/catalogue/layers">
            <ContentIcon>📐</ContentIcon>
            <ContentTitle>Layers</ContentTitle>
            <ContentDescription>
              Browse and manage all layers
            </ContentDescription>
          </ContentCard>

          <ContentCard href="/create/catalogue/swarms">
            <ContentIcon>🐝</ContentIcon>
            <ContentTitle>Swarms</ContentTitle>
            <ContentDescription>
              Browse and manage all swarm configs
            </ContentDescription>
          </ContentCard>
        </ContentGrid>
      </Main>
    </Container>
  );
}

