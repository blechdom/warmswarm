'use client';

import Link from 'next/link';
import styled from 'styled-components';

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
  box-sizing: border-box;
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

export default function Home() {
  return (
    <Container>
      <Header>
        <Logo>{`              ╦ ╦  ╔═╗  ╦═╗  ╔╦╗
              ║║║  ╠═╣  ╠╦╝  ║║║
              ╚╩╝  ╩ ╩  ╩╚═  ╩ ╩

            ╔═╗  ╦ ╦  ╔═╗  ╦═╗  ╔╦╗
            ╚═╗  ║║║  ╠═╣  ╠╦╝  ║║║
            ╚═╝  ╚╩╝  ╩ ╩  ╩╚═  ╩ ╩

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
           .`}</Logo>
        <Tagline>Connect and coordinate</Tagline>
      </Header>
      
      <Main>
        <Description>
          <DescriptionTitle>Simple coordination</DescriptionTitle>
          <DescriptionText>
            Create groups to coordinate activities and stay connected.
          </DescriptionText>
        </Description>
        
        <ButtonContainer>
          <CreateButton href="/create">
            Create New Swarm
          </CreateButton>
          
          <JoinButton href="/join">
            Join Existing Swarm
          </JoinButton>
        </ButtonContainer>
      </Main>
      
      <Footer>
        <p>WarmSwarm.org</p>
      </Footer>
    </Container>
  );
}
