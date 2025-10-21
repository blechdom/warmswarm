'use client';

import Link from 'next/link';
import styled from 'styled-components';
import MainMenu from '@/components/MainMenu';

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

const Header = styled.header`
  text-align: center;
  margin-bottom: 40px;
  padding-top: 40px;
  z-index: 5;
  position: relative;
`;

const Logo = styled.h1`
  font-size: 2.5rem;
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
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 900px;
  margin: 0 auto;
  width: 100%;
  z-index: 5;
  position: relative;
  gap: 20px;
`;

const TypeGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  width: 100%;
  
  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

const TypeCard = styled.button`
  background: rgba(255, 255, 255, 0.95);
  border-radius: 20px;
  padding: 40px 30px;
  text-align: center;
  box-shadow: 0 10px 30px rgba(0,0,0,0.2);
  border: none;
  cursor: pointer;
  transition: all 0.225s ease;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 15px 40px rgba(0,0,0,0.3);
  }
`;

const TypeIcon = styled.div`
  font-size: 3.5rem;
  margin-bottom: 15px;
`;

const TypeTitle = styled.h2`
  color: #333;
  margin: 0 0 10px 0;
  font-size: 1.5rem;
  font-weight: 700;
`;

const TypeDescription = styled.p`
  color: #666;
  margin: 0;
  font-size: 0.9rem;
  line-height: 1.4;
`;

const BackLink = styled(Link)`
  background: rgba(255, 255, 255, 0.2);
  color: white;
  padding: 10px 20px;
  border-radius: 25px;
  text-decoration: none;
  font-weight: 500;
  transition: all 0.225s ease;
  align-self: flex-start;
  margin-bottom: 20px;
  
  &:hover {
    background: rgba(255, 255, 255, 0.3);
  }
`;

export default function SequencesHub() {
  return (
    <Container>
      {/* Element 1: Navigation Header */}
      <MainMenu />
      
      {/* Element 2: Header with Title */}
      <Header>
        <Logo>🎬 Sequences Hub</Logo>
        <Tagline>Choose what type of sequence to create</Tagline>
      </Header>
      
      {/* Element 3: Sequence Type Options */}
      <Main>
        <BackLink href="/program">← Back to Program Hub</BackLink>
        
        <TypeGrid>
          <TypeCard onClick={() => alert('Audio-Image Pairs feature coming soon!')}>
            <TypeIcon>🎵🖼️</TypeIcon>
            <TypeTitle>Audio + Image</TypeTitle>
            <TypeDescription>
              Pair audio clips with images for synchronized playback
            </TypeDescription>
          </TypeCard>
          
          <TypeCard onClick={() => alert('Image Series feature coming soon!')}>
            <TypeIcon>📸📸</TypeIcon>
            <TypeTitle>Image Series</TypeTitle>
            <TypeDescription>
              Create timed sequences of multiple images (phrases)
            </TypeDescription>
          </TypeCard>
          
          <TypeCard onClick={() => alert('Audio Series feature coming soon!')}>
            <TypeIcon>🎵🎵</TypeIcon>
            <TypeTitle>Audio Series</TypeTitle>
            <TypeDescription>
              Build sequences of audio clips with timing controls
            </TypeDescription>
          </TypeCard>
        </TypeGrid>
      </Main>
    </Container>
  );
}

