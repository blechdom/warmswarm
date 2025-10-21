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
  display: flex;
  justify-content: center;
  padding: 20px;
  padding-bottom: 40px;
`;

const ActionGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 30px;
  max-width: 1000px;
  width: 100%;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    max-width: 400px;
  }
`;

const ActionCard = styled.a`
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

const ActionIcon = styled.div`
  font-size: 3.5rem;
  margin-bottom: 15px;
`;

const ActionTitle = styled.h3`
  font-size: 1.5rem;
  color: white;
  margin: 0 0 10px 0;
  font-weight: 700;
  text-shadow: 0 2px 10px rgba(0,0,0,0.2);
`;

const ActionDescription = styled.p`
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.9);
  margin: 0;
  line-height: 1.4;
`;

export default function Coordinate() {
  return (
    <Container>
      <MainMenu />
      
      <Header>
        <Logo>🎯 Coordinate</Logo>
        <Tagline>Plan and organize your performance</Tagline>
      </Header>
      
      <Main>
        <ActionGrid>
          <ActionCard href="/create/coordinate/sequences">
            <ActionIcon>📊</ActionIcon>
            <ActionTitle>Sequences</ActionTitle>
            <ActionDescription>
              Create timeline-based performance plans with content scheduling
            </ActionDescription>
          </ActionCard>

          <ActionCard href="/create/coordinate/layers">
            <ActionIcon>📐</ActionIcon>
            <ActionTitle>Layers</ActionTitle>
            <ActionDescription>
              Organize and arrange content in spatial layers
            </ActionDescription>
          </ActionCard>

          <ActionCard href="/create/coordinate/swarms">
            <ActionIcon>🐝</ActionIcon>
            <ActionTitle>Swarms</ActionTitle>
            <ActionDescription>
              Configure swarm templates with roles and network topologies
            </ActionDescription>
          </ActionCard>
        </ActionGrid>
      </Main>
    </Container>
  );
}

