'use client';

import { useState } from 'react';
import styled from 'styled-components';
import { actionLibrary, categories, getActionsByCategory, searchActions, Action } from '@/lib/actionLibrary';

interface ActionPickerProps {
  onSelect: (action: Action) => void;
  onClose: () => void;
}

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
`;

const Modal = styled.div`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 20px;
  width: 100%;
  max-width: 800px;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
`;

const Header = styled.div`
  padding: 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Title = styled.h2`
  color: white;
  margin: 0;
  font-size: 1.5rem;
  font-weight: 700;
`;

const CloseButton = styled.button`
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: white;
  font-size: 1.5rem;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.3);
    transform: scale(1.1);
  }
`;

const SearchBar = styled.input`
  width: 100%;
  padding: 12px 20px;
  font-size: 1rem;
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.15);
  color: white;
  outline: none;
  font-family: inherit;
  
  &::placeholder {
    color: rgba(255, 255, 255, 0.6);
  }
  
  &:focus {
    background: rgba(255, 255, 255, 0.25);
    border-color: rgba(255, 255, 255, 0.5);
  }
`;

const SearchContainer = styled.div`
  padding: 15px 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
`;

const CategoryTabs = styled.div`
  display: flex;
  gap: 10px;
  padding: 15px 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  overflow-x: auto;
  
  &::-webkit-scrollbar {
    height: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: rgba(0, 0, 0, 0.1);
  }
  
  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.3);
    border-radius: 3px;
  }
`;

const CategoryTab = styled.button<{ $active: boolean }>`
  background: ${props => props.$active ? 'rgba(255, 255, 255, 0.3)' : 'rgba(255, 255, 255, 0.1)'};
  border: 1px solid ${props => props.$active ? 'rgba(255, 255, 255, 0.5)' : 'rgba(255, 255, 255, 0.2)'};
  color: white;
  padding: 8px 16px;
  border-radius: 20px;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 600;
  white-space: nowrap;
  transition: all 0.2s ease;
  font-family: inherit;
  
  &:hover {
    background: rgba(255, 255, 255, 0.25);
  }
`;

const ActionGrid = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 15px;
  
  &::-webkit-scrollbar {
    width: 8px;
  }
  
  &::-webkit-scrollbar-track {
    background: rgba(0, 0, 0, 0.1);
  }
  
  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.3);
    border-radius: 4px;
  }
`;

const ActionCard = styled.button`
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-radius: 15px;
  padding: 20px 10px;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  transition: all 0.2s ease;
  color: white;
  font-family: inherit;
  
  &:hover {
    background: rgba(255, 255, 255, 0.25);
    border-color: rgba(255, 255, 255, 0.5);
    transform: translateY(-3px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
  }
  
  &:active {
    transform: translateY(-1px);
  }
`;

const ActionIconWrapper = styled.div`
  font-size: 3rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
`;

const ActionName = styled.div`
  font-size: 0.9rem;
  font-weight: 600;
  text-align: center;
`;

const EmptyState = styled.div`
  grid-column: 1 / -1;
  text-align: center;
  padding: 40px;
  color: rgba(255, 255, 255, 0.7);
  font-size: 1.1rem;
`;

export default function ActionPicker({ onSelect, onClose }: ActionPickerProps) {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const getFilteredActions = (): Action[] => {
    if (searchQuery.trim()) {
      return searchActions(searchQuery);
    }
    return getActionsByCategory(selectedCategory);
  };

  const filteredActions = getFilteredActions();

  const handleActionClick = (action: Action) => {
    onSelect(action);
    onClose();
  };

  return (
    <Overlay onClick={onClose}>
      <Modal onClick={(e) => e.stopPropagation()}>
        <Header>
          <Title>🎭 Choose an Action</Title>
          <CloseButton onClick={onClose}>×</CloseButton>
        </Header>
        
        <SearchContainer>
          <SearchBar
            type="text"
            placeholder="Search actions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            autoFocus
          />
        </SearchContainer>
        
        <CategoryTabs>
          {categories.map((category) => (
            <CategoryTab
              key={category.id}
              $active={selectedCategory === category.id}
              onClick={() => {
                setSelectedCategory(category.id);
                setSearchQuery('');
              }}
            >
              {category.icon} {category.name}
            </CategoryTab>
          ))}
        </CategoryTabs>
        
        <ActionGrid>
          {filteredActions.length > 0 ? (
            filteredActions.map((action) => {
              const IconComponent = action.icon;
              return (
                <ActionCard
                  key={action.id}
                  onClick={() => handleActionClick(action)}
                  title={action.description}
                >
                  <ActionIconWrapper>
                    <IconComponent />
                  </ActionIconWrapper>
                  <ActionName>{action.name}</ActionName>
                </ActionCard>
              );
            })
          ) : (
            <EmptyState>
              No actions found. Try a different search or category.
            </EmptyState>
          )}
        </ActionGrid>
      </Modal>
    </Overlay>
  );
}

