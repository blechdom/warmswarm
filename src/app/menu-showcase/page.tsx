'use client';

import MainMenu from '@/components/MainMenu';
import styled from 'styled-components';

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: linear-gradient(135deg, #d63384 0%, #d946ef 50%, #dc2626 100%);
  padding: 20px;
  box-sizing: border-box;
  position: relative;
  overflow: hidden;
`;

const ContentCard = styled.div`
  background: rgba(255, 255, 255, 0.95);
  border-radius: 20px;
  padding: 40px;
  max-width: 1000px;
  margin: 40px auto 0;
  width: 100%;
  box-shadow: 0 10px 30px rgba(0,0,0,0.2);
`;

const Title = styled.h1`
  color: #333;
  font-size: 2.5rem;
  margin: 0 0 20px 0;
  font-weight: 700;
`;

const Section = styled.div`
  margin-bottom: 30px;
`;

const SectionTitle = styled.h2`
  color: #333;
  font-size: 1.5rem;
  margin: 0 0 15px 0;
  font-weight: 600;
`;

const Description = styled.p`
  color: #666;
  font-size: 1rem;
  line-height: 1.6;
  margin: 0 0 15px 0;
`;

const FeatureList = styled.ul`
  color: #666;
  line-height: 1.8;
  padding-left: 20px;
`;

const FeatureItem = styled.li`
  margin-bottom: 8px;
`;

const CodeBlock = styled.pre`
  background: #f5f5f5;
  border: 1px solid #ddd;
  border-radius: 10px;
  padding: 15px;
  overflow-x: auto;
  font-size: 0.9rem;
  color: #333;
`;

const Badge = styled.span<{ color: string }>`
  background: ${props => {
    switch(props.color) {
      case 'green': return 'rgba(46, 204, 113, 0.1)';
      case 'blue': return 'rgba(102, 126, 234, 0.1)';
      case 'orange': return 'rgba(255, 193, 7, 0.2)';
      default: return 'rgba(0,0,0,0.1)';
    }
  }};
  color: ${props => {
    switch(props.color) {
      case 'green': return '#2ecc71';
      case 'blue': return '#667eea';
      case 'orange': return '#f57c00';
      default: return '#666';
    }
  }};
  padding: 5px 12px;
  border-radius: 15px;
  font-size: 0.85rem;
  font-weight: 600;
  display: inline-block;
  margin-right: 8px;
  margin-bottom: 8px;
`;

const TestSection = styled.div`
  background: rgba(102, 126, 234, 0.05);
  border: 2px solid rgba(102, 126, 234, 0.2);
  border-radius: 15px;
  padding: 20px;
  margin: 20px 0;
`;

const TestTitle = styled.h3`
  color: #667eea;
  font-size: 1.2rem;
  margin: 0 0 15px 0;
  font-weight: 600;
`;

const TestInstruction = styled.p`
  color: #666;
  font-size: 0.95rem;
  margin: 0 0 10px 0;
  line-height: 1.5;
`;

export default function MenuShowcase() {
  return (
    <Container>
      {/* The MainMenu Component Being Showcased */}
      <MainMenu />

      {/* Documentation Card */}
      <ContentCard>
        <Title>🧭 MainMenu Component Showcase</Title>
        
        <Section>
          <Description>
            This page demonstrates the <strong>MainMenu</strong> component that you see at the top of this page.
            The menu is designed to match the original WarmSwarm aesthetic with semi-transparent pill-shaped buttons.
          </Description>
        </Section>

        <TestSection>
          <TestTitle>🧪 Interactive Testing</TestTitle>
          <TestInstruction>
            <strong>Try these interactions:</strong>
          </TestInstruction>
          <FeatureList>
            <FeatureItem><strong>Desktop:</strong> Hover over menu items to see the opacity change</FeatureItem>
            <FeatureItem><strong>Desktop:</strong> Click the "warmswarm" logo to go home</FeatureItem>
            <FeatureItem><strong>Desktop:</strong> Notice the "Live" button has a stronger background</FeatureItem>
            <FeatureItem><strong>Mobile:</strong> Click the hamburger (☰) button to open the dropdown menu</FeatureItem>
            <FeatureItem><strong>Mobile:</strong> See emoji icons in the mobile menu for better navigation</FeatureItem>
            <FeatureItem><strong>Resize:</strong> Resize your browser window to see responsive behavior</FeatureItem>
          </FeatureList>
        </TestSection>

        <Section>
          <SectionTitle>✨ Design Features</SectionTitle>
          <div>
            <Badge color="green">Semi-transparent white</Badge>
            <Badge color="green">Pill-shaped buttons</Badge>
            <Badge color="green">Smooth hover effects</Badge>
            <Badge color="blue">Responsive</Badge>
            <Badge color="blue">Mobile hamburger menu</Badge>
            <Badge color="orange">Matches swarms page style</Badge>
          </div>
        </Section>

        <Section>
          <SectionTitle>📐 Style Specifications</SectionTitle>
          <CodeBlock>{`// Button Styling
background: rgba(255, 255, 255, 0.2)
hover: rgba(255, 255, 255, 0.3)
border-radius: 25px
padding: 10px 20px
color: white
transition: all 0.225s ease

// Logo/Primary Buttons
background: rgba(255, 255, 255, 0.3)
font-weight: 700`}</CodeBlock>
        </Section>

        <Section>
          <SectionTitle>🎯 Menu Links</SectionTitle>
          <FeatureList>
            <FeatureItem><strong>warmswarm</strong> - Logo/brand (links to home)</FeatureItem>
            <FeatureItem><strong>Home</strong> - Main landing page</FeatureItem>
            <FeatureItem><strong>All Views</strong> - Browse all Telebrain views</FeatureItem>
            <FeatureItem><strong>Create</strong> - Create new swarm</FeatureItem>
            <FeatureItem><strong>Join</strong> - Join existing swarm</FeatureItem>
            <FeatureItem><strong>My Swarms</strong> - Browse your swarms</FeatureItem>
            <FeatureItem><strong>Live</strong> - Join live session (highlighted)</FeatureItem>
          </FeatureList>
        </Section>

        <Section>
          <SectionTitle>📱 Responsive Behavior</SectionTitle>
          <Description>
            <strong>Desktop (≥ 768px):</strong>
          </Description>
          <FeatureList>
            <FeatureItem>Horizontal menu with all links visible</FeatureItem>
            <FeatureItem>Logo on the left, links on the right</FeatureItem>
            <FeatureItem>Hamburger menu hidden</FeatureItem>
          </FeatureList>
          
          <Description style={{ marginTop: '15px' }}>
            <strong>Mobile (&lt; 768px):</strong>
          </Description>
          <FeatureList>
            <FeatureItem>Logo on the left, hamburger (☰) on the right</FeatureItem>
            <FeatureItem>All navigation links hidden by default</FeatureItem>
            <FeatureItem>Click hamburger to reveal dropdown menu</FeatureItem>
            <FeatureItem>White background dropdown with dark text</FeatureItem>
            <FeatureItem>Emoji icons for better visual navigation</FeatureItem>
          </FeatureList>
        </Section>

        <Section>
          <SectionTitle>💻 Usage Example</SectionTitle>
          <CodeBlock>{`import MainMenu from '@/components/MainMenu';

export default function MyPage() {
  return (
    <div style={{
      background: 'linear-gradient(135deg, #d63384...)',
      padding: '20px',
      minHeight: '100vh'
    }}>
      <MainMenu />
      
      {/* Your page content */}
    </div>
  );
}`}</CodeBlock>
        </Section>

        <Section>
          <SectionTitle>🔧 To Modify the Menu</SectionTitle>
          <Description>
            Edit the component at: <code style={{ background: '#f5f5f5', padding: '2px 8px', borderRadius: '4px' }}>src/components/MainMenu.tsx</code>
          </Description>
          <FeatureList>
            <FeatureItem>Add/remove links in the <code>DesktopNav</code> section</FeatureItem>
            <FeatureItem>Add/remove links in the <code>MobileMenu</code> section</FeatureItem>
            <FeatureItem>Change styling in the styled-components definitions</FeatureItem>
            <FeatureItem>Adjust colors, sizes, hover effects, etc.</FeatureItem>
          </FeatureList>
        </Section>

        <Section>
          <SectionTitle>✅ Next Steps</SectionTitle>
          <TestSection>
            <TestInstruction>
              Once you're happy with the menu design:
            </TestInstruction>
            <FeatureList>
              <FeatureItem>It's already integrated into <code>ColorfulLayout</code></FeatureItem>
              <FeatureItem>All pages using ColorfulLayout will automatically get this menu</FeatureItem>
              <FeatureItem>The swarms page has been updated to use it</FeatureItem>
              <FeatureItem>Test on different screen sizes and devices</FeatureItem>
            </FeatureList>
          </TestSection>
        </Section>

        <Section>
          <SectionTitle>🎨 Design Philosophy</SectionTitle>
          <Description>
            The menu design is inspired by the "← Back" button from the swarms page, 
            maintaining visual consistency with the original WarmSwarm aesthetic:
          </Description>
          <FeatureList>
            <FeatureItem>Semi-transparent white overlays on vibrant gradient</FeatureItem>
            <FeatureItem>Rounded pill shapes for modern, friendly appearance</FeatureItem>
            <FeatureItem>Subtle hover effects that don't overwhelm</FeatureItem>
            <FeatureItem>Clean, minimal design that doesn't compete with content</FeatureItem>
            <FeatureItem>Professional yet playful to match the brand</FeatureItem>
          </FeatureList>
        </Section>

        <TestSection>
          <TestTitle>📋 Quick Reference</TestTitle>
          <TestInstruction>
            <strong>Access this showcase page:</strong> <code style={{ background: 'rgba(255,255,255,0.8)', padding: '2px 8px', borderRadius: '4px' }}>http://localhost:3333/menu-showcase</code>
          </TestInstruction>
          <TestInstruction style={{ marginTop: '10px' }}>
            <strong>Component location:</strong> <code style={{ background: 'rgba(255,255,255,0.8)', padding: '2px 8px', borderRadius: '4px' }}>src/components/MainMenu.tsx</code>
          </TestInstruction>
          <TestInstruction style={{ marginTop: '10px' }}>
            <strong>Documentation:</strong> <code style={{ background: 'rgba(255,255,255,0.8)', padding: '2px 8px', borderRadius: '4px' }}>MAIN-MENU-COMPONENT.md</code>
          </TestInstruction>
        </TestSection>
      </ContentCard>
    </Container>
  );
}

