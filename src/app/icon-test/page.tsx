'use client';

import styled from 'styled-components';
// Material Design Icons
import { MdDirectionsRun, MdEventSeat, MdRecordVoiceOver } from 'react-icons/md';
// Font Awesome Icons
import { FaRunning, FaChair } from 'react-icons/fa';
// Game Icons
import { GiJumpAcross, GiScreaming } from 'react-icons/gi';
// Bootstrap Icons
import { BsPersonWalking, BsPersonArmsUp } from 'react-icons/bs';
// Ionicons
import { IoPersonSharp } from 'react-icons/io5';

const Container = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 40px;
  color: white;
  font-family: 'Quantico', Arial, Helvetica, sans-serif;
`;

const Title = styled.h1`
  text-align: center;
  margin-bottom: 40px;
  font-size: 2.5rem;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 30px;
  max-width: 1200px;
  margin: 0 auto;
`;

const IconCard = styled.div`
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 20px;
  padding: 30px;
  text-align: center;
`;

const ActionTitle = styled.h2`
  font-size: 1.5rem;
  margin-bottom: 30px;
  text-transform: uppercase;
`;

const IconRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const IconDisplay = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: rgba(0, 0, 0, 0.2);
  padding: 15px;
  border-radius: 10px;
`;

const IconName = styled.span`
  font-size: 0.9rem;
  opacity: 0.8;
`;

const IconWrapper = styled.div`
  font-size: 3rem;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export default function IconTest() {
  return (
    <Container>
      <Title>Action Icons Preview</Title>
      
      <Grid>
        {/* RUN */}
        <IconCard>
          <ActionTitle>🏃 Run</ActionTitle>
          <IconRow>
            <IconDisplay>
              <IconName>MdDirectionsRun</IconName>
              <IconWrapper><MdDirectionsRun /></IconWrapper>
            </IconDisplay>
            <IconDisplay>
              <IconName>FaRunning</IconName>
              <IconWrapper><FaRunning /></IconWrapper>
            </IconDisplay>
            <IconDisplay>
              <IconName>BsPersonWalking</IconName>
              <IconWrapper><BsPersonWalking /></IconWrapper>
            </IconDisplay>
          </IconRow>
        </IconCard>

        {/* JUMP */}
        <IconCard>
          <ActionTitle>🦘 Jump</ActionTitle>
          <IconRow>
            <IconDisplay>
              <IconName>GiJumpAcross</IconName>
              <IconWrapper><GiJumpAcross /></IconWrapper>
            </IconDisplay>
            <IconDisplay>
              <IconName>BsPersonArmsUp</IconName>
              <IconWrapper><BsPersonArmsUp /></IconWrapper>
            </IconDisplay>
            <IconDisplay>
              <IconName>IoPersonSharp</IconName>
              <IconWrapper><IoPersonSharp /></IconWrapper>
            </IconDisplay>
          </IconRow>
        </IconCard>

        {/* SCREAM */}
        <IconCard>
          <ActionTitle>😱 Scream</ActionTitle>
          <IconRow>
            <IconDisplay>
              <IconName>GiScreaming</IconName>
              <IconWrapper><GiScreaming /></IconWrapper>
            </IconDisplay>
            <IconDisplay>
              <IconName>MdRecordVoiceOver</IconName>
              <IconWrapper><MdRecordVoiceOver /></IconWrapper>
            </IconDisplay>
            <IconDisplay>
              <IconName>BsPersonArmsUp</IconName>
              <IconWrapper><BsPersonArmsUp /></IconWrapper>
            </IconDisplay>
          </IconRow>
        </IconCard>

        {/* SIT */}
        <IconCard>
          <ActionTitle>🪑 Sit</ActionTitle>
          <IconRow>
            <IconDisplay>
              <IconName>MdEventSeat</IconName>
              <IconWrapper><MdEventSeat /></IconWrapper>
            </IconDisplay>
            <IconDisplay>
              <IconName>FaChair</IconName>
              <IconWrapper><FaChair /></IconWrapper>
            </IconDisplay>
            <IconDisplay>
              <IconName>IoPersonSharp</IconName>
              <IconWrapper><IoPersonSharp /></IconWrapper>
            </IconDisplay>
          </IconRow>
        </IconCard>
      </Grid>
    </Container>
  );
}

