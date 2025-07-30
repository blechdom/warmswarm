'use client';

import Link from 'next/link';
import styled from 'styled-components';
import { useState, useEffect } from 'react';

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: linear-gradient(135deg, #f8a5c2 0%, #f093fb 50%, #f5576c 100%);
  background-size: 400% 400%;
  animation: backgroundFlow 20s ease-in-out infinite;
  padding: 20px;
  box-sizing: border-box;
  
  @keyframes backgroundFlow {
    0% {
      background: linear-gradient(135deg, #f8a5c2 0%, #f093fb 50%, #f5576c 100%);
    }
    12.5% {
      background: linear-gradient(135deg, #f093fb 0%, #e879f9 50%, #ec4899 100%);
    }
    25% {
      background: linear-gradient(135deg, #e879f9 0%, #d946ef 50%, #c026d3 100%);
    }
    37.5% {
      background: linear-gradient(135deg, #d946ef 0%, #c026d3 50%, #a855f7 100%);
    }
    50% {
      background: linear-gradient(135deg, #c026d3 0%, #9333ea 50%, #7c3aed 100%);
    }
    62.5% {
      background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 50%, #6366f1 100%);
    }
    75% {
      background: linear-gradient(135deg, #6366f1 0%, #3b82f6 50%, #0ea5e9 100%);
    }
    87.5% {
      background: linear-gradient(135deg, #0ea5e9 0%, #06b6d4 50%, #14b8a6 100%);
    }
    100% {
      background: linear-gradient(135deg, #f8a5c2 0%, #f093fb 50%, #f5576c 100%);
    }
  }
`;

const Header = styled.header`
  text-align: center;
  margin-bottom: 40px;
  padding-top: 60px;
`;

const Logo = styled.pre`
  font-family: 'Courier New', monospace;
  font-size: 0.8rem;
  color: white;
  margin: 0;
  line-height: 1.2;
  text-shadow: 0 2px 10px rgba(0,0,0,0.3);
  
  @media (max-width: 768px) {
    font-size: 0.6rem;
  }
  
  @media (max-width: 480px) {
    font-size: 0.5rem;
  }
`;

const Tagline = styled.p`
  color: rgba(255, 255, 255, 0.9);
  font-size: 1.2rem;
  margin: 10px 0 0 0;
  font-weight: 300;
  
  @media (max-width: 480px) {
    font-size: 1rem;
  }
`;

const Main = styled.main`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 400px;
  margin: 0 auto;
  width: 100%;
`;

const Description = styled.div`
  background: rgba(255, 255, 255, 0.95);
  border-radius: 20px;
  padding: 30px;
  margin-bottom: 40px;
  text-align: center;
  box-shadow: 0 10px 30px rgba(0,0,0,0.2);
`;

const DescriptionTitle = styled.h2`
  color: #333;
  margin: 0 0 15px 0;
  font-size: 1.5rem;
  font-weight: 600;
`;

const DescriptionText = styled.p`
  color: #666;
  line-height: 1.6;
  margin: 0;
  font-size: 1rem;
`;

const ButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
  width: 100%;
  max-width: 300px;
`;

const ActionButton = styled(Link)`
  display: block;
  padding: 18px 30px;
  border-radius: 50px;
  text-decoration: none;
  font-weight: 600;
  font-size: 1.1rem;
  text-align: center;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(0,0,0,0.2);
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(0,0,0,0.25);
  }
  
  &:active {
    transform: translateY(0);
  }
`;

const CreateButton = styled(ActionButton)`
  background: #ff6b6b;
  color: white;
  
  &:hover {
    background: #ff5252;
  }
`;

const JoinButton = styled(ActionButton)`
  background: rgba(255, 255, 255, 0.95);
  color: #333;
  
  &:hover {
    background: white;
  }
`;

const Footer = styled.footer`
  text-align: center;
  margin-top: 40px;
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.9rem;
`;

const AnimatedChar = styled.span.attrs<{ $index: number }>(props => ({
  style: {
    animationName: `swarmChar${props.$index % 6}`,
    animationDuration: '5s',
    animationDelay: `${props.$index * 0.05}s`,
  }
}))<{ $index: number }>`
  display: inline-block;
  animation-timing-function: ease-in-out;
  animation-iteration-count: infinite;

  @keyframes swarmChar0 {
    0%, 100% { transform: translateX(0px) translateY(0px) rotate(0deg); }
    10% { transform: translateX(2px) translateY(-1px) rotate(0.5deg); }
    20% { transform: translateX(5px) translateY(-2px) rotate(1.5deg); }
    30% { transform: translateX(6px) translateY(-3px) rotate(2deg); }
    40% { transform: translateX(5px) translateY(-2px) rotate(1.5deg); }
    50% { transform: translateX(2px) translateY(-1px) rotate(0.5deg); }
    60% { transform: translateX(-1px) translateY(1px) rotate(-0.5deg); }
    70% { transform: translateX(-4px) translateY(4px) rotate(-1.5deg); }
    80% { transform: translateX(-2px) translateY(2px) rotate(-1deg); }
    90% { transform: translateX(-1px) translateY(1px) rotate(-0.3deg); }
  }
  
  @keyframes swarmChar1 {
    0%, 100% { transform: translateX(0px) translateY(0px) rotate(0deg); }
    10% { transform: translateX(-2px) translateY(-2px) rotate(-1deg); }
    20% { transform: translateX(-4px) translateY(-3px) rotate(-1.5deg); }
    30% { transform: translateX(-5px) translateY(-4px) rotate(-2deg); }
    40% { transform: translateX(-4px) translateY(-3px) rotate(-1.5deg); }
    50% { transform: translateX(-2px) translateY(-2px) rotate(-1deg); }
    60% { transform: translateX(2px) translateY(1px) rotate(0.5deg); }
    70% { transform: translateX(6px) translateY(2px) rotate(1.5deg); }
    80% { transform: translateX(4px) translateY(1px) rotate(1deg); }
    90% { transform: translateX(1px) translateY(0px) rotate(0.3deg); }
  }
  
  @keyframes swarmChar2 {
    0%, 100% { transform: translateX(0px) translateY(0px) rotate(0deg); }
    10% { transform: translateX(2px) translateY(3px) rotate(0.8deg); }
    20% { transform: translateX(3px) translateY(4px) rotate(1.2deg); }
    30% { transform: translateX(4px) translateY(5px) rotate(1.5deg); }
    40% { transform: translateX(3px) translateY(4px) rotate(1.2deg); }
    50% { transform: translateX(2px) translateY(3px) rotate(0.8deg); }
    60% { transform: translateX(-2px) translateY(-1px) rotate(-0.5deg); }
    70% { transform: translateX(-6px) translateY(-2px) rotate(-2deg); }
    80% { transform: translateX(-3px) translateY(-1px) rotate(-1deg); }
    90% { transform: translateX(-1px) translateY(0px) rotate(-0.3deg); }
  }
  
  @keyframes swarmChar3 {
    0%, 100% { transform: translateX(0px) translateY(0px) rotate(0deg); }
    10% { transform: translateX(-2px) translateY(2px) rotate(-0.8deg); }
    20% { transform: translateX(-3px) translateY(2px) rotate(-1.2deg); }
    30% { transform: translateX(-4px) translateY(3px) rotate(-1.5deg); }
    40% { transform: translateX(-3px) translateY(2px) rotate(-1.2deg); }
    50% { transform: translateX(-2px) translateY(2px) rotate(-0.8deg); }
    60% { transform: translateX(2px) translateY(-2px) rotate(0.8deg); }
    70% { transform: translateX(5px) translateY(-4px) rotate(2deg); }
    80% { transform: translateX(3px) translateY(-2px) rotate(1deg); }
    90% { transform: translateX(1px) translateY(-1px) rotate(0.3deg); }
  }
  
  @keyframes swarmChar4 {
    0%, 100% { transform: translateX(0px) translateY(0px) rotate(0deg); }
    10% { transform: translateX(1px) translateY(-3px) rotate(1deg); }
    20% { transform: translateX(2px) translateY(-4px) rotate(1.5deg); }
    30% { transform: translateX(3px) translateY(-5px) rotate(2deg); }
    40% { transform: translateX(2px) translateY(-4px) rotate(1.5deg); }
    50% { transform: translateX(1px) translateY(-3px) rotate(1deg); }
    60% { transform: translateX(-2px) translateY(2px) rotate(-0.8deg); }
    70% { transform: translateX(-5px) translateY(4px) rotate(-1.5deg); }
    80% { transform: translateX(-3px) translateY(2px) rotate(-1deg); }
    90% { transform: translateX(-1px) translateY(1px) rotate(-0.3deg); }
  }
  
  @keyframes swarmChar5 {
    0%, 100% { transform: translateX(0px) translateY(0px) rotate(0deg); }
    10% { transform: translateX(-1px) translateY(-2px) rotate(-0.8deg); }
    20% { transform: translateX(-2px) translateY(-2px) rotate(-1.5deg); }
    30% { transform: translateX(-3px) translateY(-3px) rotate(-2deg); }
    40% { transform: translateX(-2px) translateY(-2px) rotate(-1.5deg); }
    50% { transform: translateX(-1px) translateY(-2px) rotate(-0.8deg); }
    60% { transform: translateX(2px) translateY(3px) rotate(0.8deg); }
    70% { transform: translateX(4px) translateY(5px) rotate(1.5deg); }
    80% { transform: translateX(3px) translateY(3px) rotate(1deg); }
    90% { transform: translateX(1px) translateY(1px) rotate(0.3deg); }
  }
`;

const AnimatedLetter = styled.span.attrs<{ $index: number }>(props => ({
  style: {
    animationName: `warmSwarmLetter${props.$index % 8}`,
    animationDuration: `${1.5 + (props.$index % 4) * 0.3}s`,
    animationDelay: `${props.$index * 0.15}s`,
  }
}))<{ $index: number }>`
  display: inline-block;
  animation-timing-function: ease-in-out;
  animation-iteration-count: infinite;

  @keyframes warmSwarmLetter0 {
    0%, 100% { transform: translateX(0px) translateY(0px) rotate(0deg); }
    20% { transform: translateX(4px) translateY(-2px) rotate(2deg); }
    40% { transform: translateX(-3px) translateY(3px) rotate(-1.5deg); }
    60% { transform: translateX(5px) translateY(-1px) rotate(1deg); }
    80% { transform: translateX(-2px) translateY(2px) rotate(-0.5deg); }
  }
  
  @keyframes warmSwarmLetter1 {
    0%, 100% { transform: translateX(0px) translateY(0px) rotate(0deg); }
    20% { transform: translateX(-3px) translateY(-4px) rotate(-2deg); }
    40% { transform: translateX(5px) translateY(1px) rotate(2deg); }
    60% { transform: translateX(-2px) translateY(3px) rotate(-1deg); }
    80% { transform: translateX(4px) translateY(-1px) rotate(1.5deg); }
  }
  
  @keyframes warmSwarmLetter2 {
    0%, 100% { transform: translateX(0px) translateY(0px) rotate(0deg); }
    20% { transform: translateX(2px) translateY(4px) rotate(1deg); }
    40% { transform: translateX(-4px) translateY(-2px) rotate(-2deg); }
    60% { transform: translateX(3px) translateY(1px) rotate(1.5deg); }
    80% { transform: translateX(-1px) translateY(-3px) rotate(-0.5deg); }
  }
  
  @keyframes warmSwarmLetter3 {
    0%, 100% { transform: translateX(0px) translateY(0px) rotate(0deg); }
    20% { transform: translateX(-4px) translateY(2px) rotate(-1deg); }
    40% { transform: translateX(2px) translateY(-3px) rotate(2deg); }
    60% { transform: translateX(-1px) translateY(4px) rotate(-1.5deg); }
    80% { transform: translateX(3px) translateY(-1px) rotate(1deg); }
  }
  
  @keyframes warmSwarmLetter4 {
    0%, 100% { transform: translateX(0px) translateY(0px) rotate(0deg); }
    20% { transform: translateX(5px) translateY(-3px) rotate(2.5deg); }
    40% { transform: translateX(-2px) translateY(4px) rotate(-1deg); }
    60% { transform: translateX(4px) translateY(-2px) rotate(1.5deg); }
    80% { transform: translateX(-3px) translateY(1px) rotate(-2deg); }
  }
  
  @keyframes warmSwarmLetter5 {
    0%, 100% { transform: translateX(0px) translateY(0px) rotate(0deg); }
    20% { transform: translateX(-2px) translateY(-3px) rotate(-1.5deg); }
    40% { transform: translateX(4px) translateY(2px) rotate(2deg); }
    60% { transform: translateX(-3px) translateY(-1px) rotate(-1deg); }
    80% { transform: translateX(1px) translateY(3px) rotate(0.5deg); }
  }
  
  @keyframes warmSwarmLetter6 {
    0%, 100% { transform: translateX(0px) translateY(0px) rotate(0deg); }
    20% { transform: translateX(3px) translateY(3px) rotate(1.5deg); }
    40% { transform: translateX(-4px) translateY(-1px) rotate(-2deg); }
    60% { transform: translateX(1px) translateY(2px) rotate(1deg); }
    80% { transform: translateX(-2px) translateY(-4px) rotate(-1.5deg); }
  }
  
  @keyframes warmSwarmLetter7 {
    0%, 100% { transform: translateX(0px) translateY(0px) rotate(0deg); }
    20% { transform: translateX(-1px) translateY(4px) rotate(-1deg); }
    40% { transform: translateX(3px) translateY(-2px) rotate(2deg); }
    60% { transform: translateX(-4px) translateY(1px) rotate(-2deg); }
    80% { transform: translateX(2px) translateY(-3px) rotate(1deg); }
  }
`;

function AnimatedSwarm({ text }: { text: string }) {
  return (
    <span>
      {text.split('').map((char: string, index: number) => {
        if (char === '\n') {
          return <br key={index} />;
        }
        // Don't animate spaces - just render them normally
        if (char === ' ') {
          return <span key={index}>{char}</span>;
        }
        return (
          <AnimatedChar key={index} $index={index}>
            {char}
          </AnimatedChar>
        );
      })}
    </span>
  );
}

function AnimatedTitle({ text }: { text: string }) {
  return (
    <span>
      {text.split('').map((char: string, index: number) => {
        if (char === '\n') {
          return <br key={index} />;
        }
        // Don't animate spaces - just render them normally
        if (char === ' ') {
          return <span key={index}>{char}</span>;
        }
        return (
          <AnimatedLetter key={index} $index={index}>
            {char}
          </AnimatedLetter>
        );
      })}
    </span>
  );
}

export default function Home() {
  return (
    <Container>
      <Header>
        <Logo>
          <AnimatedTitle text={`
          
              ╦ ╦  ╔═╗  ╦═╗  ╔╦╗
              ║║║  ╠═╣  ╠╦╝  ║║║
              ╚╩╝  ╩ ╩  ╩╚═  ╩ ╩

            ╔═╗  ╦ ╦  ╔═╗  ╦═╗  ╔╦╗
            ╚═╗  ║║║  ╠═╣  ╠╦╝  ║║║
            ╚═╝  ╚╩╝  ╩ ╩  ╩╚═  ╩ ╩

`} />
          <AnimatedSwarm text={`
          
         .  ^ ,                           . ^
       .,  ~.  ,                      , ~  . >
     .> ,  . ~, .                > .~   ,  .~ >
   , .~    . ~  ,             _  ,~  .    ~  >
  ~ .   ., ~   . ~       ~ >~>~. ~  ,   .>  >
  .~ , >  . ,~ .  .,>~.^,>~. ~ .   ,~  . ~ .
   ~ .  ,~  . ~ , .~>.,^~> ~  ,  .>  ,  ~ .
    .~  , ~ .  .~,>^.~,>. ~  .~  , ~ >~.~
     ~ ,  .>~.^,>~. ~ ,  .~   , ~>~. .
      .>~.^,>~. ~  .~   ,  > .  ~
       >~.^ ~ .~   , ~  .  ~               
        ~ .~   ,  ~ .                      
         .~  , ~                           
          ~ .
           .`
          } />
        </Logo>
        <Tagline>Create  Connect  Organize  </Tagline>
      </Header>
      
      <Main>
        <ButtonContainer>
          <JoinButton href="/join">
            Join a Swarm
          </JoinButton>

          <CreateButton href="/create">
            Start a Swarm
          </CreateButton>

          <JoinButton href="/swarms?filter=my" style={{ background: 'rgba(46, 204, 113, 0.9)' }}>
            My Swarms
          </JoinButton>
        </ButtonContainer>
      </Main>
      
      <Footer>
        <p>WarmSwarm.org</p>
      </Footer>
    </Container>
  );
}
