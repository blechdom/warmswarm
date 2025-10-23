'use client';

import Link from 'next/link';
import styled from 'styled-components';
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
`;

const Main = styled.main`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
  z-index: 5;
  position: relative;
`;

const ExamplesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 24px;
  width: 100%;
  margin-top: 30px;
  
  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

const ExampleCard = styled.div`
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 20px;
  padding: 30px;
  text-decoration: none;
  transition: all 0.225s ease;
  display: flex;
  flex-direction: column;
  gap: 15px;
  
  &:hover {
    background: rgba(255, 255, 255, 0.25);
    transform: translateY(-5px);
    box-shadow: 0 15px 40px rgba(0,0,0,0.3);
  }
`;

const ExampleIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 10px;
`;

const ExampleTitle = styled.h2`
  color: white;
  margin: 0;
  font-size: 1.5rem;
  font-weight: 700;
  text-shadow: 0 2px 10px rgba(0,0,0,0.2);
`;

const ExampleDescription = styled.p`
  color: rgba(255, 255, 255, 0.9);
  margin: 0;
  font-size: 1rem;
  line-height: 1.5;
`;

const ButtonsContainer = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 15px;
  flex-wrap: wrap;
`;

const ActionButton = styled(Link)`
  flex: 1;
  min-width: 120px;
  background: rgba(255, 255, 255, 0.2);
  color: white;
  padding: 10px 20px;
  border-radius: 20px;
  text-decoration: none;
  font-weight: 600;
  text-align: center;
  border: 1px solid rgba(255, 255, 255, 0.3);
  transition: all 0.2s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.35);
    transform: translateY(-2px);
  }
`;

const LiveBadge = styled.span`
  background: rgba(0, 255, 0, 0.3);
  color: white;
  padding: 5px 12px;
  border-radius: 15px;
  font-size: 0.75rem;
  font-weight: 600;
  border: 1px solid rgba(0, 255, 0, 0.5);
  text-transform: uppercase;
  display: inline-block;
  margin-left: 10px;
`;

const DemoBadge = styled.span`
  background: rgba(100, 150, 255, 0.3);
  color: white;
  padding: 5px 12px;
  border-radius: 15px;
  font-size: 0.75rem;
  font-weight: 600;
  border: 1px solid rgba(100, 150, 255, 0.5);
  text-transform: uppercase;
  display: inline-block;
  margin-left: 10px;
`;

const TagsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 10px;
`;

const Tag = styled.span`
  background: rgba(255, 255, 255, 0.2);
  color: white;
  padding: 5px 12px;
  border-radius: 15px;
  font-size: 0.75rem;
  font-weight: 500;
  border: 1px solid rgba(255, 255, 255, 0.3);
`;

export default function Examples() {
  const examples = [
    // Basic Examples
    {
      id: 'basic-text',
      icon: '📝',
      title: 'Basic Text',
      description: 'Simple text prompts sent to everyone. Learn the fundamentals of coordinating a group with text messages.',
      tags: ['Beginner', 'Text', 'Unison'],
      isLive: false,
      isDemoOnly: true,
      viewHref: '/swarm/demo/basic-text',
      joinHref: null,
    },
    {
      id: 'basic-image',
      icon: '🖼️',
      title: 'Basic Image',
      description: 'Display synchronized images to the group. Perfect for visual coordination and shared viewing experiences.',
      tags: ['Beginner', 'Images', 'Unison'],
      isLive: false,
      isDemoOnly: true,
      viewHref: '/swarm/demo/basic-image',
      joinHref: null,
    },
    {
      id: 'basic-tts',
      icon: '🗣️',
      title: 'Basic TTS',
      description: 'Text-to-speech audio coordination. Type messages that are spoken aloud to everyone at the same time.',
      tags: ['Beginner', 'Audio', 'TTS'],
      isLive: false,
      isDemoOnly: true,
      viewHref: '/swarm/demo/basic-tts',
      joinHref: null,
    },
    {
      id: 'basic-mixed',
      icon: '🎨',
      title: 'Basic Mixed',
      description: 'Combine text, images, and audio together. See how multimodal content creates richer experiences.',
      tags: ['Beginner', 'Mixed', 'Unison'],
      isLive: false,
      isDemoOnly: true,
      viewHref: '/swarm/demo/basic-mixed',
      joinHref: null,
    },
    
    // Group Coordination
    {
      id: '4-groups-live',
      icon: '🎭',
      title: '4 Groups with Live Direction',
      description: 'Real-time coordination of 4 separate groups. Leader sends different live instructions to each group (like conducting different instrument sections).',
      tags: ['Layers', 'Live', '4 Groups'],
      isLive: false,
      isDemoOnly: true,
      viewHref: '/swarm/demo/4-groups-live',
      joinHref: null,
    },
    {
      id: '4-groups-timed',
      icon: '⏱️',
      title: '4 Groups with Timed Direction',
      description: 'Pre-programmed sequences for 4 groups. Each group receives different timed cues for choreographed coordination.',
      tags: ['Layers', 'Timed', '4 Groups'],
      isLive: false,
      isDemoOnly: true,
      viewHref: '/swarm/demo/4-groups-timed',
      joinHref: null,
    },
    
    // Performance Examples
    {
      id: 'theatrical-karaoke',
      icon: '🎤',
      title: 'Theatrical Karaoke',
      description: 'Synchronized karaoke with lyrics, timing, and performance cues. Perfect for group singing and theatrical performances.',
      tags: ['Performance', 'Music', 'Timed'],
      isLive: false,
      isDemoOnly: true,
      viewHref: '/swarm/demo/theatrical-karaoke',
      joinHref: null,
    },
    {
      id: 'acappella-sing',
      icon: '🎵',
      title: 'Acappella Sing-what-you-hear',
      description: 'Listen and repeat vocal patterns. Each person hears their part and sings it back, creating live harmonies.',
      tags: ['Music', 'Audio', 'Layers'],
      isLive: false,
      isDemoOnly: true,
      viewHref: '/swarm/demo/acappella-sing',
      joinHref: null,
    },
    {
      id: 'exercise-class',
      icon: '💪',
      title: 'Exercise Class',
      description: 'Lead a synchronized workout with exercise prompts, timers, and rest periods. Everyone moves together.',
      tags: ['Fitness', 'Timed', 'Unison'],
      isLive: false,
      isDemoOnly: true,
      viewHref: '/swarm/demo/exercise-class',
      joinHref: null,
    },
    
    // Advanced Examples
    {
      id: 'free-for-all',
      icon: '🌐',
      title: 'Free For All: Everyone\'s in Charge',
      description: 'No leader - everyone can send and receive. Pure peer-to-peer coordination where anyone can contribute.',
      tags: ['Distributed', 'P2P', 'Advanced'],
      isLive: false,
      isDemoOnly: true,
      viewHref: '/swarm/demo/free-for-all',
      joinHref: null,
    },
    {
      id: 'flash-mob',
      icon: '⚡',
      title: 'Flash Mob',
      description: 'Coordinated surprise performance with timed reveals. Everyone receives secret instructions that activate at the same moment.',
      tags: ['Performance', 'Timed', 'Surprise'],
      isLive: false,
      isDemoOnly: true,
      viewHref: '/swarm/demo/flash-mob',
      joinHref: null,
    },
  ];

  return (
    <Container>
      <AppNav currentPage="examples" />
      
      <Header>
        <Title>🚀 Example Swarms</Title>
        <Subtitle>Try these interactive demos to see WarmSwarm in action</Subtitle>
      </Header>
      
      <Main>
        <ExamplesGrid>
          {examples.map((example) => (
            <ExampleCard key={example.id}>
              <ExampleIcon>{example.icon}</ExampleIcon>
              <div>
                <ExampleTitle>
                  {example.title}
                  {example.isLive && <LiveBadge>Live</LiveBadge>}
                  {example.isDemoOnly && <DemoBadge>Demo</DemoBadge>}
                </ExampleTitle>
              </div>
              <ExampleDescription>{example.description}</ExampleDescription>
              <TagsContainer>
                {example.tags.map((tag) => (
                  <Tag key={tag}>{tag}</Tag>
                ))}
              </TagsContainer>
              <ButtonsContainer>
                <ActionButton href={example.viewHref}>
                  👁️ View Demo
                </ActionButton>
                {example.joinHref && (
                  <ActionButton href={example.joinHref}>
                    🐝 Join Live
                  </ActionButton>
                )}
              </ButtonsContainer>
            </ExampleCard>
          ))}
        </ExamplesGrid>
      </Main>
    </Container>
  );
}


