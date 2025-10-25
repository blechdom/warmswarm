'use client';

import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { GiphyFetch } from '@giphy/js-fetch-api';
import * as FaIcons from 'react-icons/fa';
import * as MdIcons from 'react-icons/md';
import * as IoIcons from 'react-icons/io5';
import * as BsIcons from 'react-icons/bs';
import * as HiIcons from 'react-icons/hi2';
import * as GiIcons from 'react-icons/gi';
import * as AiIcons from 'react-icons/ai';
import * as RiIcons from 'react-icons/ri';

// GIPHY API - using demo key (get your own at developers.giphy.com)
const gf = new GiphyFetch('GlVGYHkr3WSBnllca54iNt0yFbjz7L65');

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

// GIF Interface
interface GifItem {
  id: string;
  title: string;
  url: string;
  previewUrl: string;
}

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

const TabBar = styled.div`
  display: flex;
  gap: 10px;
  justify-content: center;
  margin-bottom: 20px;
  flex-wrap: wrap;
`;

const Tab = styled.button<{ $active: boolean }>`
  background: ${props => props.$active ? 'rgba(255, 255, 255, 0.3)' : 'rgba(255, 255, 255, 0.1)'};
  border: 2px solid ${props => props.$active ? 'rgba(255, 255, 255, 0.6)' : 'rgba(255, 255, 255, 0.2)'};
  color: white;
  padding: 12px 24px;
  font-size: 1rem;
  font-weight: 600;
  border-radius: 12px;
  cursor: pointer;
  font-family: inherit;
  transition: all 0.2s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.25);
    transform: translateY(-2px);
  }
`;

const Controls = styled.div`
  display: flex;
  gap: 10px;
  max-width: 1200px;
  margin: 0 auto 10px;
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

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: 15px;
  
  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(110px, 1fr));
    gap: 10px;
  }
`;

const Card = styled.button`
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-radius: 15px;
  padding: 15px 10px;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  transition: all 0.2s ease;
  color: white;
  font-family: inherit;
  min-height: 140px;
  
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
  flex: 1;
  
  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const ItemName = styled.div`
  font-size: 0.75rem;
  font-weight: 600;
  text-align: center;
  word-break: break-word;
  opacity: 0.9;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 60px 20px;
  color: rgba(255, 255, 255, 0.7);
  font-size: 1.1rem;
`;

const InfoBox = styled.div`
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 15px;
  padding: 20px;
  margin-bottom: 20px;
  color: white;
  text-align: center;
  
  h3 {
    margin: 0 0 10px 0;
    font-size: 1.2rem;
  }
  
  p {
    margin: 5px 0;
    font-size: 0.9rem;
    opacity: 0.9;
  }
`;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  z-index: 999;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
`;

const Modal = styled.div`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 40px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
  max-width: 500px;
  width: 100%;
  text-align: center;
`;

const ModalIconDisplay = styled.div`
  font-size: 8rem;
  color: #764ba2;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  
  @media (max-width: 768px) {
    font-size: 6rem;
  }
`;

const ModalGifDisplay = styled.div`
  width: 300px;
  height: 300px;
  margin: 0 auto 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  
  @media (max-width: 768px) {
    width: 250px;
    height: 250px;
  }
`;

const ModalTitle = styled.h2`
  color: #333;
  margin: 0 0 10px 0;
  font-size: 1.8rem;
  word-break: break-word;
`;

const ModalSubtitle = styled.div`
  color: #666;
  font-size: 1rem;
  margin-bottom: 20px;
`;

const ModalCode = styled.code`
  background: #f0f0f0;
  padding: 10px 15px;
  border-radius: 8px;
  display: block;
  margin: 15px 0 25px;
  color: #764ba2;
  font-size: 0.85rem;
  word-break: break-all;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 10px;
  justify-content: center;
  flex-wrap: wrap;
`;

const Button = styled.button<{ $primary?: boolean; $disabled?: boolean }>`
  background: ${props => props.$disabled ? '#ccc' : props.$primary ? '#764ba2' : '#999'};
  border: none;
  color: white;
  padding: 12px 30px;
  font-size: 1rem;
  font-weight: 600;
  border-radius: 10px;
  cursor: ${props => props.$disabled ? 'not-allowed' : 'pointer'};
  font-family: inherit;
  transition: all 0.2s ease;
  opacity: ${props => props.$disabled ? 0.6 : 1};
  
  &:hover {
    ${props => !props.$disabled && `
      background: ${props.$primary ? '#667eea' : '#777'};
      transform: translateY(-2px);
    `}
  }
  
  &:active {
    ${props => !props.$disabled && `
      transform: translateY(0);
    `}
  }
`;

const DisabledNote = styled.div`
  color: #999;
  font-size: 0.85rem;
  margin-top: 10px;
  font-style: italic;
`;

type TabType = 'icons' | 'gifs';

interface SelectedItem {
  type: 'icon' | 'gif';
  name: string;
  component?: any;
  library?: string;
  url?: string;
  previewUrl?: string;
}

export default function MediaBrowser() {
  const [activeTab, setActiveTab] = useState<TabType>('gifs');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLibrary, setSelectedLibrary] = useState<string>('all');
  const [selectedItem, setSelectedItem] = useState<SelectedItem | null>(null);
  const [gifs, setGifs] = useState<GifItem[]>([]);
  const [gifsLoading, setGifsLoading] = useState(false);

  // Fetch GIFs from GIPHY
  useEffect(() => {
    if (activeTab === 'gifs') {
      setGifsLoading(true);
      const fetchGifs = async () => {
        try {
          let result;
          if (searchQuery.trim()) {
            result = await gf.search(searchQuery, { limit: 50 });
          } else {
            result = await gf.trending({ limit: 50 });
          }
          
          const gifItems: GifItem[] = result.data.map((gif: any) => ({
            id: gif.id,
            title: gif.title || 'Untitled GIF',
            url: gif.images.original.url,
            previewUrl: gif.images.fixed_width.url,
          }));
          
          setGifs(gifItems);
        } catch (error) {
          console.error('Error fetching GIFs:', error);
          setGifs([]);
        } finally {
          setGifsLoading(false);
        }
      };
      
      const debounceTimer = setTimeout(fetchGifs, 300);
      return () => clearTimeout(debounceTimer);
    }
  }, [activeTab, searchQuery]);

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
    
    return allIcons; // Show all icons, no limit
  };

  const filteredIcons = activeTab === 'icons' ? getFilteredIcons() : [];

  const getImportStatement = () => {
    if (!selectedItem || selectedItem.type !== 'icon') return '';
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
    const lib = libraryMap[selectedItem.library || ''];
    return `import { ${selectedItem.name} } from 'react-icons/${lib}';`;
  };

  return (
    <Container>
      <Header>
        <Title>🎨 Media Browser</Title>
        <Subtitle>Browse millions of GIFs, memes, and icons instantly</Subtitle>
        
        <TabBar>
          <Tab 
            $active={activeTab === 'gifs'} 
            onClick={() => setActiveTab('gifs')}
          >
            🎬 GIFs & Memes (Millions!)
          </Tab>
          <Tab 
            $active={activeTab === 'icons'} 
            onClick={() => setActiveTab('icons')}
          >
            🎨 SVG Icons (10,000+)
          </Tab>
        </TabBar>
        
        <Controls>
          <SearchBar
            type="text"
            placeholder={activeTab === 'gifs' ? 'Search GIFs & memes...' : 'Search icons...'}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {activeTab === 'icons' && (
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
          )}
        </Controls>
        
        <Stats>
          {activeTab === 'gifs' && (gifsLoading ? 'Loading GIFs...' : `Showing ${gifs.length} GIFs`)}
          {activeTab === 'icons' && `Showing ${filteredIcons.length} icons`}
        </Stats>
      </Header>
      
      <Content>
        {activeTab === 'gifs' && (
          <InfoBox>
            <h3>🎬 Animated GIFs & Memes</h3>
            <p>Millions of GIFs powered by GIPHY</p>
            <p>Search for actions, reactions, memes, and more!</p>
            <p style={{ fontSize: '0.85rem', opacity: 0.8, marginTop: '10px' }}>Powered by GIPHY API</p>
          </InfoBox>
        )}
        
        {activeTab === 'icons' && (
          <InfoBox>
            <h3>🎨 SVG Icons</h3>
            <p>Over 1000+ icons from 8 popular icon libraries</p>
            <p>Crisp, scalable, and customizable colors</p>
          </InfoBox>
        )}
        
        {activeTab === 'gifs' && (
          <>
            {gifsLoading ? (
              <EmptyState>
                <div style={{ fontSize: '3rem', marginBottom: '20px' }}>⏳</div>
                <p>Loading GIFs...</p>
              </EmptyState>
            ) : gifs.length > 0 ? (
              <Grid>
                {gifs.map((gif) => (
                  <Card
                    key={gif.id}
                    onClick={() => {
                      setSelectedItem({
                        type: 'gif',
                        name: gif.title,
                        url: gif.url,
                        previewUrl: gif.previewUrl,
                      });
                    }}
                  >
                    <IconWrapper>
                      <img 
                        src={gif.previewUrl} 
                        alt={gif.title}
                        style={{ 
                          maxWidth: '100%', 
                          maxHeight: '100%',
                          objectFit: 'contain',
                          borderRadius: '8px'
                        }}
                      />
                    </IconWrapper>
                    <ItemName>{gif.title.substring(0, 30)}{gif.title.length > 30 ? '...' : ''}</ItemName>
                  </Card>
                ))}
              </Grid>
            ) : (
              <EmptyState>
                <div style={{ fontSize: '3rem', marginBottom: '20px' }}>🎬</div>
                <p>No GIFs found. Try searching for something else!</p>
              </EmptyState>
            )}
          </>
        )}
        
        {activeTab === 'icons' && (
          <>
            {filteredIcons.length > 0 ? (
              <Grid>
                {filteredIcons.map((icon) => {
                  const IconComponent = icon.component;
                  return (
                    <Card
                      key={`${icon.library}-${icon.name}`}
                      onClick={() => {
                        setSelectedItem({
                          type: 'icon',
                          name: icon.name,
                          component: icon.component,
                          library: icon.library,
                        });
                      }}
                      title={`${icon.name} (${icon.library})`}
                    >
                      <IconWrapper>
                        <IconComponent />
                      </IconWrapper>
                      <ItemName>{icon.name}</ItemName>
                    </Card>
                  );
                })}
              </Grid>
            ) : (
              <EmptyState>
                No icons found. Try a different search term or library.
              </EmptyState>
            )}
          </>
        )}
      </Content>
      
      {selectedItem && (
        <Overlay onClick={() => setSelectedItem(null)}>
          <Modal onClick={(e) => e.stopPropagation()}>
            {selectedItem.type === 'icon' && selectedItem.component && (
              <>
                <ModalIconDisplay>
                  <selectedItem.component />
                </ModalIconDisplay>
                <ModalTitle>{selectedItem.name}</ModalTitle>
                <ModalSubtitle>{selectedItem.library}</ModalSubtitle>
                <ModalCode>{getImportStatement()}</ModalCode>
              </>
            )}
            
            {selectedItem.type === 'gif' && selectedItem.url && (
              <>
                <ModalGifDisplay>
                  <img 
                    src={selectedItem.url} 
                    alt={selectedItem.name}
                    style={{ 
                      maxWidth: '100%', 
                      maxHeight: '100%',
                      objectFit: 'contain',
                      borderRadius: '12px'
                    }}
                  />
                </ModalGifDisplay>
                <ModalTitle>{selectedItem.name}</ModalTitle>
                <ModalSubtitle>Animated GIF from GIPHY</ModalSubtitle>
                <ModalCode>{selectedItem.url}</ModalCode>
              </>
            )}
            
            <ButtonGroup>
              <Button 
                $primary 
                $disabled 
                title="Coming soon: Add this media to your swarm"
              >
                🐝 Add to Swarm
              </Button>
              <Button onClick={() => setSelectedItem(null)}>
                Close
              </Button>
            </ButtonGroup>
            
            <DisabledNote>
              Add to Swarm feature coming soon
            </DisabledNote>
          </Modal>
        </Overlay>
      )}
    </Container>
  );
}

