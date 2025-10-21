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
  flex-direction: column;
  align-items: center;
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
`;

const WorkflowGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  width: 100%;
  max-width: 1200px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    max-width: 400px;
  }
`;

const WorkflowCard = styled.a`
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 20px;
  padding: 30px 25px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  text-decoration: none;
  
  &:hover {
    background: rgba(255, 255, 255, 0.25);
    transform: translateY(-5px);
    box-shadow: 0 10px 30px rgba(0,0,0,0.2);
  }
`;

const CardNumber = styled.div`
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.6);
  font-weight: 700;
  margin-bottom: 10px;
`;

const CardIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 15px;
`;

const CardTitle = styled.h3`
  font-size: 1.4rem;
  color: white;
  margin: 0 0 10px 0;
  font-weight: 700;
`;

const CardDescription = styled.p`
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.8);
  margin: 0;
  line-height: 1.4;
`;

export default function Create() {
  return (
    <Container>
      <MainMenu />
      
      <Header>
        <Logo>⚙️ Create</Logo>
        <Tagline>Build your swarm performance</Tagline>
      </Header>
      
      <Main>
        <WorkflowGrid>
          <WorkflowCard href="/create/collect">
            <CardIcon>📦</CardIcon>
            <CardTitle>Collect</CardTitle>
            <CardDescription>Gather audio, images, and video content</CardDescription>
          </WorkflowCard>
          
          <WorkflowCard href="/create/cast">
            <CardIcon>🎭</CardIcon>
            <CardTitle>Cast</CardTitle>
            <CardDescription>Define roles and qualities for participants</CardDescription>
          </WorkflowCard>
          
          <WorkflowCard href="/create/coordinate">
            <CardIcon>🎯</CardIcon>
            <CardTitle>Coordinate</CardTitle>
            <CardDescription>Arrange sequences, layers, and swarms</CardDescription>
          </WorkflowCard>
          
          <WorkflowCard href="/create/catalogue">
            <CardIcon>📚</CardIcon>
            <CardTitle>Catalogue</CardTitle>
            <CardDescription>Browse and manage all components</CardDescription>
          </WorkflowCard>
          
          <WorkflowCard href="/create/connect">
            <CardIcon>🔗</CardIcon>
            <CardTitle>Connect</CardTitle>
            <CardDescription>Plan, invite, and go live</CardDescription>
          </WorkflowCard>
        </WorkflowGrid>
      </Main>
    </Container>
  );
}
