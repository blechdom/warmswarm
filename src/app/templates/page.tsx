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

const TemplatesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 24px;
  width: 100%;
  margin-top: 30px;
  
  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

const TemplateCard = styled(Link)`
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

const TemplateIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 10px;
`;

const TemplateTitle = styled.h2`
  color: white;
  margin: 0;
  font-size: 1.5rem;
  font-weight: 700;
  text-shadow: 0 2px 10px rgba(0,0,0,0.2);
`;

const TemplateDescription = styled.p`
  color: rgba(255, 255, 255, 0.9);
  margin: 0;
  font-size: 1rem;
  line-height: 1.5;
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

const ComingSoonBadge = styled.span`
  background: rgba(255, 215, 0, 0.3);
  color: white;
  padding: 5px 12px;
  border-radius: 15px;
  font-size: 0.75rem;
  font-weight: 600;
  border: 1px solid rgba(255, 215, 0, 0.5);
  text-transform: uppercase;
`;

export default function Templates() {
  const templates = [
    // Live Direction Templates
    {
      id: 'live-director',
      icon: '🎼',
      title: 'Live Director',
      description: 'Real-time direction using Unison pattern. One leader sends live cues to everyone simultaneously - perfect for conducting, teaching, or live guidance.',
      tags: ['Unison', 'Real-time', 'Audio+Text'],
      href: '/create',
      comingSoon: true,
    },
    {
      id: 'live-groups',
      icon: '🎯',
      title: 'Live Groups',
      description: 'Real-time coordination using Hub & Spoke pattern. Direct multiple independent groups separately, each receiving their own live instructions.',
      tags: ['Hub & Spoke', 'Real-time', 'Multi-Group'],
      href: '/create',
      comingSoon: true,
    },
    {
      id: 'live-layers',
      icon: '🎭',
      title: 'Live Layers',
      description: 'Real-time direction using Layers pattern. Direct different groups separately (left/right, colors, instruments) with live audio and visual cues.',
      tags: ['Layers', 'Real-time', 'Multi-Group'],
      href: '/create',
      comingSoon: true,
    },
    {
      id: 'live-open-interactive',
      icon: '🌐',
      title: 'Live, Open, and Interactive',
      description: 'Real-time peer collaboration using Distributed pattern. Everyone can send and receive - perfect for jam sessions and emergent coordination.',
      tags: ['Distributed', 'Real-time', 'P2P'],
      href: '/create',
      comingSoon: true,
    },
    
    // Timed Direction Templates
    {
      id: 'timed-sequences',
      icon: '⏱️',
      title: 'Timed Sequences',
      description: 'Pre-programmed timing with Unison pattern. Schedule text, images, and audio to play at specific times for everyone together.',
      tags: ['Unison', 'Timed', 'Sequences'],
      href: '/create',
      comingSoon: true,
    },
    {
      id: 'timed-groups',
      icon: '🎯',
      title: 'Timed Groups',
      description: 'Pre-programmed timing with Hub & Spoke pattern. Multiple independent groups receive different timed sequences.',
      tags: ['Hub & Spoke', 'Timed', 'Multi-Group'],
      href: '/create',
      comingSoon: true,
    },
    {
      id: 'timed-layers',
      icon: '💃',
      title: 'Timed Layers',
      description: 'Pre-programmed timing with Layers pattern. Different groups receive different timed cues - perfect for complex choreography and split performances.',
      tags: ['Layers', 'Timed', 'Choreography'],
      href: '/create',
      comingSoon: true,
    },
    {
      id: 'relay-chains',
      icon: '🔄',
      title: 'Relay Chains',
      description: 'Timed sequences using Circle or Line patterns. Content flows sequentially from person to person at scheduled intervals.',
      tags: ['Circle', 'Timed', 'Sequential'],
      href: '/create',
      comingSoon: true,
    },
    
    // Start from Scratch
    {
      id: 'custom-blank',
      icon: '✨',
      title: 'Start from Scratch',
      description: 'Build your own custom coordination from the ground up. Choose your constellation, define roles, and create your content.',
      tags: ['Custom', 'Flexible', 'Advanced'],
      href: '/create',
      comingSoon: false,
    },
  ];

  return (
    <Container>
      <AppNav currentPage="templates" />
      
      <Header>
        <Title>📝 Templates</Title>
        <Subtitle>Get started quickly with pre-built coordination templates</Subtitle>
      </Header>
      
      <Main>
        <TemplatesGrid>
          {templates.map((template) => (
            <TemplateCard key={template.id} href={template.href}>
              <TemplateIcon>{template.icon}</TemplateIcon>
              <div>
                <TemplateTitle>{template.title}</TemplateTitle>
                {template.comingSoon && <ComingSoonBadge style={{ marginLeft: '10px' }}>Coming Soon</ComingSoonBadge>}
              </div>
              <TemplateDescription>{template.description}</TemplateDescription>
              <TagsContainer>
                {template.tags.map((tag) => (
                  <Tag key={tag}>{tag}</Tag>
                ))}
              </TagsContainer>
            </TemplateCard>
          ))}
        </TemplatesGrid>
      </Main>
    </Container>
  );
}


