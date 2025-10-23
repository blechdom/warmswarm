'use client';

import Link from 'next/link';
import { useState } from 'react';
import styled from 'styled-components';

const MenuContainer = styled.nav`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
  z-index: 50;
`;

const Logo = styled(Link)`
  background: rgba(255, 255, 255, 0.2);
  color: white;
  padding: 10px 20px;
  border-radius: 25px;
  text-decoration: none;
  font-weight: 700;
  font-size: 1.25rem;
  transition: all 0.225s ease;
  display: flex;
  align-items: center;
  gap: 5px;
  
  &:hover {
    background: rgba(255, 255, 255, 0.3);
  }
`;

const LogoImage = styled.img`
  height: 1.875rem;
  width: auto;
  filter: drop-shadow(0 1px 3px rgba(0,0,0,0.2));
`;

const DesktopNav = styled.div`
  display: none;
  gap: 10px;
  
  @media (min-width: 768px) {
    display: flex;
  }
`;

const NavLink = styled(Link)<{ $isPrimary?: boolean }>`
  background: ${props => props.$isPrimary ? 'rgba(255, 255, 255, 0.3)' : 'rgba(255, 255, 255, 0.2)'};
  color: white;
  padding: 10px 20px;
  border-radius: 25px;
  text-decoration: none;
  font-weight: ${props => props.$isPrimary ? '600' : '500'};
  transition: all 0.225s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.35);
  }
`;

const HamburgerButton = styled.button`
  display: flex;
  background: rgba(255, 255, 255, 0.2);
  color: white;
  padding: 10px 15px;
  border-radius: 25px;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  transition: all 0.225s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.3);
  }
  
  @media (min-width: 768px) {
    display: none;
  }
`;

const MobileMenu = styled.div<{ $isOpen: boolean }>`
  display: ${props => props.$isOpen ? 'flex' : 'none'};
  flex-direction: column;
  position: absolute;
  top: 60px;
  right: 0;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 20px;
  padding: 15px;
  gap: 10px;
  min-width: 200px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.2);
  
  @media (min-width: 768px) {
    display: none;
  }
`;

const MobileNavLink = styled(Link)<{ $isPrimary?: boolean }>`
  color: ${props => props.$isPrimary ? '#ff6b6b' : '#333'};
  padding: 12px 16px;
  border-radius: 10px;
  text-decoration: none;
  font-weight: ${props => props.$isPrimary ? '600' : '500'};
  transition: all 0.225s ease;
  background: ${props => props.$isPrimary ? 'rgba(255, 107, 107, 0.1)' : 'transparent'};
  
  &:hover {
    background: ${props => props.$isPrimary ? 'rgba(255, 107, 107, 0.2)' : 'rgba(0,0,0,0.05)'};
  }
`;

interface MainMenuProps {
  currentPath?: string;
}

export default function MainMenu({ currentPath = '/' }: MainMenuProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const closeMenu = () => setMobileMenuOpen(false);

  return (
    <MenuContainer>
      <Logo href="/">
        warm
        <LogoImage src="/warmswarm-logo-transparent.png" alt="" />
        swarm
      </Logo>
      
      <DesktopNav>
        <NavLink href="/create/collect">Collect</NavLink>
        <NavLink href="/create/cast">Cast</NavLink>
        <NavLink href="/create/constellation">Constellation</NavLink>
        <NavLink href="/create/coordinate">Coordinate</NavLink>
        <NavLink href="/create/catalogue">Catalogue</NavLink>
        <NavLink href="/create/connect">Connect</NavLink>
      </DesktopNav>

      <HamburgerButton 
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        aria-label="Toggle menu"
      >
        ☰
      </HamburgerButton>

      <MobileMenu $isOpen={mobileMenuOpen}>
        <MobileNavLink href="/create/collect" onClick={closeMenu}>
          📦 Collect
        </MobileNavLink>
        <MobileNavLink href="/create/cast" onClick={closeMenu}>
          🎭 Cast
        </MobileNavLink>
        <MobileNavLink href="/create/constellation" onClick={closeMenu}>
          🌟 Constellation
        </MobileNavLink>
        <MobileNavLink href="/create/coordinate" onClick={closeMenu}>
          🎯 Coordinate
        </MobileNavLink>
        <MobileNavLink href="/create/catalogue" onClick={closeMenu}>
          📚 Catalogue
        </MobileNavLink>
        <MobileNavLink href="/create/connect" onClick={closeMenu}>
          🔗 Connect
        </MobileNavLink>
      </MobileMenu>
    </MenuContainer>
  );
}

