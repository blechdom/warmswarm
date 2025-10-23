'use client';

import Link from 'next/link';
import styled from 'styled-components';
import { useState } from 'react';
import AppNav from '@/components/AppNav';

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
  padding-top: 20px;
  z-index: 5;
  position: relative;
`;

const Title = styled.h1`
  font-size: 3rem;
  color: white;
  margin: 0 0 10px 0;
  font-weight: 700;
  text-shadow: 0 2px 10px rgba(0,0,0,0.3);
  
  @media (max-width: 480px) {
    font-size: 2rem;
  }
`;

const Subtitle = styled.p`
  font-size: 1.2rem;
  color: rgba(255, 255, 255, 0.9);
  margin: 0;
  text-shadow: 0 1px 5px rgba(0,0,0,0.2);
  max-width: 700px;
  margin-left: auto;
  margin-right: auto;
`;

const Main = styled.main`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 1400px;
  margin: 0 auto;
  width: 100%;
  z-index: 5;
  position: relative;
`;

const ConstellationsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
  gap: 24px;
  width: 100%;
  margin-top: 30px;
  
  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

const ConstellationCard = styled.div<{ $selected: boolean }>`
  background: ${props => props.$selected 
    ? 'rgba(255, 255, 255, 0.3)' 
    : 'rgba(255, 255, 255, 0.15)'};
  backdrop-filter: blur(10px);
  border: 2px solid ${props => props.$selected 
    ? 'rgba(255, 255, 255, 0.6)' 
    : 'rgba(255, 255, 255, 0.2)'};
  border-radius: 20px;
  padding: 30px;
  text-decoration: none;
  transition: all 0.225s ease;
  display: flex;
  flex-direction: column;
  gap: 15px;
  cursor: pointer;
  position: relative;
  
  &:hover {
    background: rgba(255, 255, 255, 0.25);
    transform: translateY(-5px);
    box-shadow: 0 15px 40px rgba(0,0,0,0.3);
  }
`;

const SelectedBadge = styled.div`
  position: absolute;
  top: 15px;
  right: 15px;
  background: rgba(0, 255, 0, 0.3);
  color: white;
  padding: 6px 14px;
  border-radius: 15px;
  font-size: 0.75rem;
  font-weight: 700;
  border: 1px solid rgba(0, 255, 0, 0.5);
  text-transform: uppercase;
`;

const VisualDiagram = styled.div`
  font-size: 4rem;
  text-align: center;
  margin: 20px 0;
  line-height: 1.3;
  min-height: 140px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ConstellationTitle = styled.h2`
  color: white;
  margin: 0;
  font-size: 1.8rem;
  font-weight: 700;
  text-shadow: 0 2px 10px rgba(0,0,0,0.2);
`;

const ConstellationDescription = styled.p`
  color: rgba(255, 255, 255, 0.9);
  margin: 0;
  font-size: 1rem;
  line-height: 1.6;
`;

const UseCases = styled.div`
  margin-top: 10px;
`;

const UseCaseTitle = styled.h4`
  color: rgba(255, 255, 255, 0.8);
  margin: 0 0 8px 0;
  font-size: 0.85rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const UseCaseList = styled.ul`
  color: rgba(255, 255, 255, 0.85);
  margin: 0;
  padding-left: 20px;
  font-size: 0.9rem;
  line-height: 1.5;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 15px;
  margin-top: 40px;
  justify-content: center;
  flex-wrap: wrap;
`;

const PrimaryButton = styled(Link)`
  background: rgba(255, 255, 255, 0.3);
  border: 2px solid rgba(255, 255, 255, 0.5);
  color: white;
  padding: 15px 40px;
  border-radius: 30px;
  text-decoration: none;
  font-weight: 700;
  font-size: 1.1rem;
  transition: all 0.225s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.4);
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(0,0,0,0.3);
  }
`;

const SecondaryButton = styled(Link)`
  background: rgba(255, 255, 255, 0.15);
  border: 2px solid rgba(255, 255, 255, 0.3);
  color: white;
  padding: 15px 40px;
  border-radius: 30px;
  text-decoration: none;
  font-weight: 600;
  font-size: 1.1rem;
  transition: all 0.225s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.25);
    transform: translateY(-2px);
  }
`;

export default function Constellation() {
  const [selectedPattern, setSelectedPattern] = useState<string | null>(null);

  const patterns = [
    {
      id: 'unison',
      title: 'Unison',
      icon: '🎼',
      visual: '   👤\n   ↓\n👥👥👥',
      description: 'One sender coordinates one unified group. Everyone receives the same message and acts together in harmony.',
      useCases: [
        'Choir singing together',
        'Synchronized dance',
        'Group exercise class',
        'Unified chanting or movement'
      ]
    },
    {
      id: 'layers',
      title: 'Layers',
      icon: '🎭',
      visual: '     👤\n  ↙  ↓  ↘\n🔴🔴 🔵🔵 🟢🟢',
      description: 'One sender coordinates multiple distinct groups (layers). Each layer receives different instructions - like left/right, colors, adults/kids, or instruments.',
      useCases: [
        'Split harmonies or instruments',
        'Left side vs right side activities',
        'Age-based group activities',
        'Color-coded team coordination'
      ]
    },
    {
      id: 'hub-spoke',
      title: 'Hub & Spoke',
      icon: '🎡',
      visual: '   👥\n    ↗ \n👥 ← 👤 → 👥\n    ↘\n   👥',
      description: 'Central hub coordinates separate groups. The hub sends different content to each spoke, managing multiple channels from one control point.',
      useCases: [
        'Multi-room coordination',
        'Department-specific messaging',
        'Role-based instruction sets',
        'Breakout group management'
      ]
    },
    {
      id: 'distributed',
      title: 'Distributed',
      icon: '🌐',
      visual: '👥 ↔ 👥\n ↕   ↕\n👥 ↔ 👥',
      description: 'No leader - everyone can send and receive. Participants can form their own groups or act independently. Pure peer-to-peer coordination.',
      useCases: [
        'Open jam sessions',
        'Self-organizing activities',
        'Emergent group dynamics',
        'Collaborative exploration'
      ]
    },
    {
      id: 'star',
      title: 'Star',
      icon: '⭐',
      visual: '   👤\n↙  ↓  ↘\n👥 👥 👥',
      description: 'One leader coordinates everyone else. Perfect when one person needs to guide or conduct the group with feedback.',
      useCases: [
        'Orchestra conductor',
        'Teacher leading a class',
        'Presenter with Q&A',
        'Interactive workshop leader'
      ]
    },
    {
      id: 'circle',
      title: 'Circle',
      icon: '🔄',
      visual: '👥 → 👥\n↑     ↓\n👥 ← 👥',
      description: 'Everyone connects in a loop. Each person passes to the next. Great for sequential activities.',
      useCases: [
        'Round-robin discussions',
        'Relay performances',
        'Story circles',
        'Turn-based activities'
      ]
    },
    {
      id: 'line',
      title: 'Line',
      icon: '📏',
      visual: '👥 → 👥 → 👥 → 👥',
      description: 'One after another in sequence. Information or action flows in a single direction.',
      useCases: [
        'Assembly line',
        'Sequential presentations',
        'Recipe steps',
        'Story progression'
      ]
    },
    {
      id: 'tree',
      title: 'Tree',
      icon: '🌳',
      visual: '      👤\n   ↙   ↘\n  👥    👥\n ↙ ↘  ↙ ↘\n👥 👥 👥 👥',
      description: 'Hierarchical branching. Leaders coordinate sub-groups, creating layers of coordination.',
      useCases: [
        'Large events with team leads',
        'Organizational activities',
        'Multi-level performances',
        'Department coordination'
      ]
    },
    {
      id: 'pairs',
      title: 'Pairs',
      icon: '👥',
      visual: '👥↔👥  👥↔👥\n\n👥↔👥  👥↔👥',
      description: 'People work in partner pairs. Each pair coordinates independently or together.',
      useCases: [
        'Dance partners',
        'Pair programming',
        'Buddy system',
        'Duets and dialogues'
      ]
    },
    {
      id: 'broadcast',
      title: 'Broadcast',
      icon: '📡',
      visual: '   📢\n↙  ↓  ↘\n👥 👥 👥\n(one-way)',
      description: 'One sender, many receivers. Information flows one direction only, no feedback loop.',
      useCases: [
        'Announcements',
        'Guided meditation',
        'Lecture or talk',
        'Performance viewing'
      ]
    },
  ];

  return (
    <Container>
      <AppNav currentPage="create" />
      
      <Header>
        <Title>🌟 Choose Your Constellation</Title>
        <Subtitle>
          How should your swarm connect? Pick a pattern that matches how you want people to coordinate.
        </Subtitle>
      </Header>
      
      <Main>
        <ConstellationsGrid>
          {patterns.map((pattern) => (
            <ConstellationCard 
              key={pattern.id}
              $selected={selectedPattern === pattern.id}
              onClick={() => setSelectedPattern(pattern.id)}
            >
              {selectedPattern === pattern.id && <SelectedBadge>Selected</SelectedBadge>}
              
              <ConstellationTitle>
                {pattern.icon} {pattern.title}
              </ConstellationTitle>
              
              <VisualDiagram>
                {pattern.visual.split('\n').map((line, i) => (
                  <div key={i}>{line}</div>
                ))}
              </VisualDiagram>
              
              <ConstellationDescription>
                {pattern.description}
              </ConstellationDescription>
              
              <UseCases>
                <UseCaseTitle>Perfect for:</UseCaseTitle>
                <UseCaseList>
                  {pattern.useCases.map((useCase, i) => (
                    <li key={i}>{useCase}</li>
                  ))}
                </UseCaseList>
              </UseCases>
            </ConstellationCard>
          ))}
        </ConstellationsGrid>

        {selectedPattern && (
          <ActionButtons>
            <PrimaryButton href="/create">
              Continue with {patterns.find(p => p.id === selectedPattern)?.title} →
            </PrimaryButton>
            <SecondaryButton href="/templates">
              Browse Templates
            </SecondaryButton>
          </ActionButtons>
        )}
      </Main>
    </Container>
  );
}


