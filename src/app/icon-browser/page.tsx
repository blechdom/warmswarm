'use client';

import { useState } from 'react';
import styled from 'styled-components';
import * as FaIcons from 'react-icons/fa';
import * as MdIcons from 'react-icons/md';
import * as IoIcons from 'react-icons/io5';
import * as BsIcons from 'react-icons/bs';
import * as HiIcons from 'react-icons/hi2';
import * as GiIcons from 'react-icons/gi';
import * as AiIcons from 'react-icons/ai';
import * as RiIcons from 'react-icons/ri';

const iconSets = {
  'Font Awesome': FaIcons,
  'Material Design': MdIcons,
  'Ionicons': IoIcons,
  'Bootstrap': BsIcons,
  'Heroicons': HiIcons,
  'Game Icons': GiIcons,
  'Ant Design': AiIcons,
  'Remix Icons': RiIcons,
};

const Container = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
  font-family: 'Quantico', Arial, Helvetica, sans-serif;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 30px;
  position: sticky;
  top: 0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px 0;
  z-index: 100;
`;

const Title = styled.h1`
  color: white;
  font-size: 2rem;
  margin: 0 0 10px 0;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
  
  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
`;

const Subtitle = styled.p`
  color: rgba(255, 255, 255, 0.9);
  font-size: 1rem;
  margin: 0 0 20px 0;
  
  @media (max-width: 768px) {
    font-size: 0.9rem;
  }
`;

const Controls = styled.div`
  display: flex;
  gap: 10px;
  max-width: 1200px;
  margin: 0 auto;
  flex-wrap: wrap;
  justify-content: center;
`;

const SearchBar = styled.input`
  flex: 1;
  min-width: 200px;
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

const LibrarySelect = styled.select`
  padding: 12px 20px;
  font-size: 1rem;
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.15);
  color: white;
  outline: none;
  font-family: inherit;
  cursor: pointer;
  
  &:focus {
    background: rgba(255, 255, 255, 0.25);
    border-color: rgba(255, 255, 255, 0.5);
  }
  
  option {
    background: #764ba2;
    color: white;
  }
`;

const Stats = styled.div`
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.9rem;
  text-align: center;
  margin-top: 10px;
`;

const Content = styled.div`
  max-width: 1400px;
  margin: 0 auto;
`;

const IconGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 15px;
  
  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(90px, 1fr));
    gap: 10px;
  }
`;

const IconCard = styled.button`
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-radius: 15px;
  padding: 15px 10px;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
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

const IconWrapper = styled.div`
  font-size: 2.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  
  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const IconName = styled.div`
  font-size: 0.7rem;
  font-weight: 600;
  text-align: center;
  word-break: break-word;
  opacity: 0.8;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 60px 20px;
  color: rgba(255, 255, 255, 0.7);
  font-size: 1.1rem;
`;

const Modal = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 30px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
  z-index: 1000;
  min-width: 300px;
  text-align: center;
`;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  z-index: 999;
`;

const ModalIcon = styled.div`
  font-size: 5rem;
  color: #764ba2;
  margin-bottom: 20px;
`;

const ModalTitle = styled.h2`
  color: #333;
  margin: 0 0 10px 0;
  font-size: 1.5rem;
`;

const ModalCode = styled.code`
  background: #f0f0f0;
  padding: 10px 15px;
  border-radius: 8px;
  display: block;
  margin: 15px 0;
  color: #764ba2;
  font-size: 0.9rem;
  word-break: break-all;
`;

const CloseButton = styled.button`
  background: #764ba2;
  border: none;
  color: white;
  padding: 10px 30px;
  font-size: 1rem;
  font-weight: 600;
  border-radius: 10px;
  cursor: pointer;
  font-family: inherit;
  transition: all 0.2s ease;
  margin-top: 10px;
  
  &:hover {
    background: #667eea;
    transform: translateY(-2px);
  }
`;

export default function IconBrowser() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLibrary, setSelectedLibrary] = useState<string>('all');
  const [selectedIcon, setSelectedIcon] = useState<{ name: string; component: any; library: string } | null>(null);

  const getFilteredIcons = () => {
    const allIcons: { name: string; component: any; library: string }[] = [];
    
    Object.entries(iconSets).forEach(([libraryName, icons]) => {
      if (selectedLibrary === 'all' || selectedLibrary === libraryName) {
        Object.entries(icons).forEach(([iconName, IconComponent]) => {
          if (typeof IconComponent === 'function') {
            const matchesSearch = searchQuery === '' || 
              iconName.toLowerCase().includes(searchQuery.toLowerCase());
            
            if (matchesSearch) {
              allIcons.push({
                name: iconName,
                component: IconComponent,
                library: libraryName,
              });
            }
          }
        });
      }
    });
    
    return allIcons.slice(0, 500); // Limit to 500 for performance
  };

  const filteredIcons = getFilteredIcons();

  const handleIconClick = (icon: { name: string; component: any; library: string }) => {
    setSelectedIcon(icon);
  };

  const getImportStatement = () => {
    if (!selectedIcon) return '';
    const libraryMap: Record<string, string> = {
      'Font Awesome': 'fa',
      'Material Design': 'md',
      'Ionicons': 'io5',
      'Bootstrap': 'bs',
      'Heroicons': 'hi2',
      'Game Icons': 'gi',
      'Ant Design': 'ai',
      'Remix Icons': 'ri',
    };
    const lib = libraryMap[selectedIcon.library];
    return `import { ${selectedIcon.name} } from 'react-icons/${lib}';`;
  };

  return (
    <Container>
      <Header>
        <Title>🎨 Icon Browser</Title>
        <Subtitle>Browse thousands of icons from react-icons</Subtitle>
        <Controls>
          <SearchBar
            type="text"
            placeholder="Search icons... (e.g., 'heart', 'run', 'music')"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            autoFocus
          />
          <LibrarySelect
            value={selectedLibrary}
            onChange={(e) => setSelectedLibrary(e.target.value)}
          >
            <option value="all">All Libraries</option>
            {Object.keys(iconSets).map((library) => (
              <option key={library} value={library}>
                {library}
              </option>
            ))}
          </LibrarySelect>
        </Controls>
        <Stats>
          Showing {filteredIcons.length} icons
          {filteredIcons.length === 500 && ' (limited to 500, try searching to narrow down)'}
        </Stats>
      </Header>
      
      <Content>
        {filteredIcons.length > 0 ? (
          <IconGrid>
            {filteredIcons.map((icon) => {
              const IconComponent = icon.component;
              return (
                <IconCard
                  key={`${icon.library}-${icon.name}`}
                  onClick={() => handleIconClick(icon)}
                  title={`${icon.name} (${icon.library})`}
                >
                  <IconWrapper>
                    <IconComponent />
                  </IconWrapper>
                  <IconName>{icon.name}</IconName>
                </IconCard>
              );
            })}
          </IconGrid>
        ) : (
          <EmptyState>
            No icons found. Try a different search term or library.
          </EmptyState>
        )}
      </Content>
      
      {selectedIcon && (
        <>
          <Overlay onClick={() => setSelectedIcon(null)} />
          <Modal>
            <ModalIcon>
              <selectedIcon.component />
            </ModalIcon>
            <ModalTitle>{selectedIcon.name}</ModalTitle>
            <div style={{ color: '#666', fontSize: '0.9rem' }}>{selectedIcon.library}</div>
            <ModalCode>{getImportStatement()}</ModalCode>
            <CloseButton onClick={() => setSelectedIcon(null)}>
              Close
            </CloseButton>
          </Modal>
        </>
      )}
    </Container>
  );
}

