'use client';

import styled from 'styled-components';
import MainMenu from '@/components/MainMenu';

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 50%, #d63384 100%);
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

const Quote = styled.blockquote`
  font-size: 1.2rem;
  color: white;
  font-style: italic;
  line-height: 1.6;
  margin: 30px 0;
  padding: 20px 30px;
  border-left: 4px solid rgba(255, 255, 255, 0.5);
  background: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  
  @media (max-width: 768px) {
    font-size: 1rem;
    padding: 15px 20px;
  }
`;

export default function AboutPage() {
  return (
    <Container>
      <MainMenu />
      
      <Header>
        <Logo>💡 about</Logo>
        <Tagline>Who made this and why?</Tagline>
      </Header>
      
      <Main>
        <ContentCard>
          <SectionTitle>The Vision</SectionTitle>
          <SectionText>
            warmswarm was created to enable new forms of collective experience. 
            We believe that technology can help people create synchronized, 
            coordinated performances that wouldn't be possible otherwise.
          </SectionText>

          <Quote>
            "What if a group of people could become a single, distributed instrument?"
          </Quote>

          <SectionTitle>The Inspiration</SectionTitle>
          <SectionText>
            This project builds on ideas from networked music performance, 
            participatory art installations, flash mobs, and collaborative rituals. 
            It's inspired by the way orchestras coordinate complex performances, 
            the way swarms of birds move together, and the way groups of people 
            can create something greater than the sum of their parts.
          </SectionText>

          <SectionTitle>The Name</SectionTitle>
          <SectionText>
            "warm" suggests connection, community, and the feeling of being part of something.<br/>
            "swarm" evokes coordinated group behavior, emergence, and collective intelligence.<br/>
            Together, they represent the human side of collective action.
          </SectionText>

          <SectionTitle>The Technology</SectionTitle>
          <SectionText>
            Built with modern web technologies (Next.js, Node.js, PostgreSQL, WebRTC), 
            warmswarm is designed to be accessible from any device with a browser. 
            No apps to download, no accounts required – just create, share, and perform.
          </SectionText>

          <SectionTitle>The Future</SectionTitle>
          <SectionText>
            This is just the beginning. We're exploring ideas around spatial audio, 
            augmented reality, generative content, AI-assisted choreography, and more. 
            The goal is to continually expand what's possible for groups to create together.
          </SectionText>

          <SectionTitle>Get Involved</SectionTitle>
          <SectionText>
            warmswarm is an evolving platform. If you have ideas, feedback, or want to 
            contribute, we'd love to hear from you. Create something amazing and share it!
          </SectionText>
        </ContentCard>
      </Main>
    </Container>
  );
}

