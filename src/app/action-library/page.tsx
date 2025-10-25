'use client';

import { useState } from 'react';
import styled from 'styled-components';
import ActionPicker from '@/components/ActionPicker';
import { Action } from '@/lib/actionLibrary';

const Container = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 40px 20px;
  font-family: 'Quantico', Arial, Helvetica, sans-serif;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 40px;
`;

const Title = styled.h1`
  color: white;
  font-size: 2.5rem;
  margin: 0 0 10px 0;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
`;

const Subtitle = styled.p`
  color: rgba(255, 255, 255, 0.9);
  font-size: 1.1rem;
  margin: 0;
`;

const Content = styled.div`
  max-width: 600px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 30px;
`;

const Card = styled.div`
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 20px;
  padding: 30px;
  text-align: center;
`;

const OpenButton = styled.button`
  background: rgba(255, 255, 255, 0.2);
  border: 2px solid rgba(255, 255, 255, 0.5);
  color: white;
  padding: 15px 40px;
  font-size: 1.2rem;
  font-weight: 700;
  border-radius: 15px;
  cursor: pointer;
  font-family: inherit;
  transition: all 0.2s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.3);
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
  }
  
  &:active {
    transform: translateY(0);
  }
`;

const SelectedCard = styled(Card)`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
`;

const SelectedIconWrapper = styled.div`
  font-size: 5rem;
  color: white;
`;

const SelectedTitle = styled.h2`
  color: white;
  font-size: 2rem;
  margin: 0;
`;

const SelectedDescription = styled.p`
  color: rgba(255, 255, 255, 0.8);
  font-size: 1.1rem;
  margin: 0;
`;

const CategoryBadge = styled.span`
  background: rgba(255, 255, 255, 0.2);
  padding: 5px 15px;
  border-radius: 20px;
  font-size: 0.9rem;
  color: white;
  text-transform: uppercase;
  font-weight: 600;
`;

const InfoText = styled.p`
  color: rgba(255, 255, 255, 0.9);
  font-size: 1rem;
  line-height: 1.6;
  margin: 20px 0 0 0;
`;

export default function ActionLibraryDemo() {
  const [showPicker, setShowPicker] = useState(false);
  const [selectedAction, setSelectedAction] = useState<Action | null>(null);

  const handleActionSelect = (action: Action) => {
    setSelectedAction(action);
  };

  return (
    <Container>
      <Header>
        <Title>🎭 Action Library</Title>
        <Subtitle>Browse 20+ pre-loaded actions for your swarms</Subtitle>
      </Header>
      
      <Content>
        <Card>
          <OpenButton onClick={() => setShowPicker(true)}>
            Browse Action Library
          </OpenButton>
          <InfoText>
            Click to explore actions organized by Movement, Position, Gestures, Voice, and Emotions. 
            Use the search bar or category tabs to find what you need.
          </InfoText>
        </Card>
        
        {selectedAction && (
          <SelectedCard>
            <SelectedIconWrapper>
              <selectedAction.icon />
            </SelectedIconWrapper>
            <SelectedTitle>{selectedAction.name}</SelectedTitle>
            <CategoryBadge>{selectedAction.category}</CategoryBadge>
            <SelectedDescription>{selectedAction.description}</SelectedDescription>
            {selectedAction.gifPath && (
              <InfoText style={{ fontSize: '0.9rem', opacity: 0.7 }}>
                GIF ready: {selectedAction.gifPath}
              </InfoText>
            )}
          </SelectedCard>
        )}
      </Content>
      
      {showPicker && (
        <ActionPicker
          onSelect={handleActionSelect}
          onClose={() => setShowPicker(false)}
        />
      )}
    </Container>
  );
}

