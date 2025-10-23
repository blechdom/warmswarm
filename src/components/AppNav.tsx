'use client';

import Link from 'next/link';
import { useState } from 'react';
import styled from 'styled-components';

const NavContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  background: rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
`;

const NavContent = styled.nav`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 24px;
  max-width: 1800px;
  margin: 0 auto;
`;

const LogoSection = styled(Link)`
  display: flex;
  align-items: center;
  gap: 10px;
  text-decoration: none;
  transition: all 0.2s ease;
  
  &:hover {
    transform: translateY(-1px);
  }
`;

const LogoImage = styled.img`
  height: 40px;
  width: auto;
  filter: drop-shadow(0 2px 5px rgba(0,0,0,0.3));
`;

const LogoText = styled.span`
  font-size: 1.5rem;
  color: white;
  font-weight: 700;
  text-shadow: 0 2px 10px rgba(0,0,0,0.3);
  font-family: 'Quantico', Arial, Helvetica, sans-serif;
  
  @media (max-width: 480px) {
    display: none;
  }
`;

const NavLinks = styled.div<{ $isOpen: boolean }>`
  display: flex;
  align-items: center;
  gap: 8px;
  
  @media (max-width: 768px) {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    flex-direction: column;
    background: rgba(0, 0, 0, 0.95);
    backdrop-filter: blur(10px);
    padding: ${props => props.$isOpen ? '20px' : '0'};
    max-height: ${props => props.$isOpen ? '400px' : '0'};
    overflow: hidden;
    transition: all 0.3s ease;
    border-bottom: ${props => props.$isOpen ? '1px solid rgba(255, 255, 255, 0.1)' : 'none'};
    gap: 0;
  }
`;

const NavLink = styled(Link)`
  color: rgba(255, 255, 255, 0.9);
  text-decoration: none;
  padding: 8px 16px;
  border-radius: 20px;
  font-weight: 500;
  font-size: 0.95rem;
  transition: all 0.2s ease;
  white-space: nowrap;
  
  &:hover {
    background: rgba(255, 255, 255, 0.15);
    color: white;
  }
  
  @media (max-width: 768px) {
    width: 100%;
    text-align: center;
    padding: 12px 16px;
    border-radius: 0;
    
    &:hover {
      background: rgba(255, 255, 255, 0.1);
    }
  }
`;

const MenuButton = styled.button`
  display: none;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 1.2rem;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.2);
  }
  
  @media (max-width: 768px) {
    display: block;
  }
`;

const Spacer = styled.div`
  height: 65px;
  
  @media (max-width: 768px) {
    height: 64px;
  }
`;

interface AppNavProps {
  currentPage?: string;
}

export default function AppNav({ currentPage }: AppNavProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <>
      <NavContainer>
        <NavContent>
          <LogoSection href="/" onClick={closeMenu}>
            <LogoImage 
              src="/warmswarm-logo-transparent.png" 
              alt="WarmSwarm Logo"
            />
            <LogoText>warmswarm</LogoText>
          </LogoSection>
          
          <MenuButton onClick={toggleMenu}>
            {isMenuOpen ? '✕' : '☰'}
          </MenuButton>
          
          <NavLinks $isOpen={isMenuOpen}>
            <NavLink href="/" onClick={closeMenu}>🏠 Home</NavLink>
            <NavLink href="/swarm" onClick={closeMenu}>🐝 Swarm</NavLink>
            <NavLink href="/create" onClick={closeMenu}>✨ Create</NavLink>
            <NavLink href="/templates" onClick={closeMenu}>📝 Templates</NavLink>
            <NavLink href="/examples" onClick={closeMenu}>🚀 Examples</NavLink>
            <NavLink href="/wtf" onClick={closeMenu}>❓ WTF</NavLink>
            <NavLink href="/about" onClick={closeMenu}>💡 About</NavLink>
          </NavLinks>
        </NavContent>
      </NavContainer>
      <Spacer />
    </>
  );
}

