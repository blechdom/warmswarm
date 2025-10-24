'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { TimelineEffect, TimelineRow } from '@xzdarcy/react-timeline-editor';
import styled from 'styled-components';

// Import Timeline only on client side to avoid hydration errors
const Timeline = dynamic(
  () => import('@xzdarcy/react-timeline-editor').then((mod) => mod.Timeline),
  { ssr: false }
);

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
  font-family: 'Quantico', Arial, Helvetica, sans-serif;
  padding: 20px;
  box-sizing: border-box;
`;

const Header = styled.header`
  text-align: center;
  padding: 20px;
  margin-bottom: 20px;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  color: white;
  margin: 0 0 10px 0;
  font-weight: 700;
  text-shadow: 0 2px 10px rgba(0,0,0,0.3);
`;

const Subtitle = styled.p`
  font-size: 1.1rem;
  color: rgba(255, 255, 255, 0.9);
  margin: 0;
`;

const TimelineContainer = styled.div`
  background: white;
  border-radius: 20px;
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
  box-shadow: 0 10px 40px rgba(0,0,0,0.3);
`;

const Controls = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
  flex-wrap: wrap;
`;

const ControlsSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin-bottom: 20px;
`;

const ControlsRow = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
  flex-wrap: wrap;
`;

const ControlsLabel = styled.span`
  font-weight: 600;
  color: #333;
  min-width: 100px;
`;

const Button = styled.button<{ $variant?: 'primary' | 'secondary'; $color?: string }>`
  background: ${props => 
    props.$variant === 'primary' 
      ? (props.$color || '#667eea')
      : 'rgba(102, 126, 234, 0.1)'
  };
  color: ${props => props.$variant === 'primary' ? 'white' : '#667eea'};
  border: ${props => props.$variant === 'primary' ? 'none' : '2px solid #667eea'};
  padding: 10px 20px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 0.9rem;
  
  &:hover {
    background: ${props => 
      props.$variant === 'primary' 
        ? (props.$color ? `${props.$color}dd` : '#5568d3')
        : 'rgba(102, 126, 234, 0.2)'
    };
    transform: translateY(-1px);
  }
  
  &:active {
    transform: translateY(0);
  }
`;

interface TimelineAction {
  id: string;
  start: number;
  end: number;
  effectId: string;
  data: {
    content: string;
    color: string;
  };
}

const trackConfig = [
  { id: 'row0', name: 'Receiver 1', color: '#667eea' },
  { id: 'row1', name: 'Receiver 2', color: '#f093fb' },
  { id: 'row2', name: 'Receiver 3', color: '#764ba2' },
  { id: 'row3', name: 'Receiver 4', color: '#2ecc71' },
];

const eventTypes = [
  { type: 'audio', icon: '🎵', label: 'Audio', color: '#667eea' },
  { type: 'text', icon: '📝', label: 'Text', color: '#f093fb' },
  { type: 'video', icon: '🎬', label: 'Video', color: '#764ba2' },
  { type: 'tts', icon: '🗣️', label: 'TTS', color: '#2ecc71' },
];

export default function TimelineDemo() {
  const [mounted, setMounted] = useState(false);
  const [selectedTrack, setSelectedTrack] = useState(0); // Track which row is selected
  const [data, setData] = useState<TimelineRow[]>([
    {
      id: 'row0',
      actions: [
        {
          id: 'action0-0',
          start: 0,
          end: 3,
          effectId: 'audio',
          data: {
            content: '🎵 Audio',
            color: '#667eea',
          },
        },
        {
          id: 'action0-1',
          start: 5,
          end: 8,
          effectId: 'audio',
          data: {
            content: '🎵 Music',
            color: '#667eea',
          },
        },
      ],
    },
    {
      id: 'row1',
      actions: [
        {
          id: 'action1-0',
          start: 1,
          end: 4,
          effectId: 'text',
          data: {
            content: '📝 Text',
            color: '#f093fb',
          },
        },
        {
          id: 'action1-1',
          start: 6,
          end: 7,
          effectId: 'text',
          data: {
            content: '📝 Instruction',
            color: '#f093fb',
          },
        },
      ],
    },
    {
      id: 'row2',
      actions: [
        {
          id: 'action2-0',
          start: 2,
          end: 5,
          effectId: 'video',
          data: {
            content: '🎬 Video',
            color: '#764ba2',
          },
        },
      ],
    },
    {
      id: 'row3',
      actions: [
        {
          id: 'action3-0',
          start: 4,
          end: 9,
          effectId: 'tts',
          data: {
            content: '🗣️ TTS',
            color: '#2ecc71',
          },
        },
      ],
    },
  ]);

  useEffect(() => {
    setMounted(true);
  }, []);

  const effects: Record<string, TimelineEffect> = {
    audio: { id: 'audio', name: '🎵 Audio' },
    text: { id: 'text', name: '📝 Text' },
    video: { id: 'video', name: '🎬 Video' },
    tts: { id: 'tts', name: '🗣️ TTS' },
  };

  const handleAddEvent = (eventType: typeof eventTypes[0]) => {
    const newAction = {
      id: `action-${Date.now()}`,
      start: 10,
      end: 12,
      effectId: eventType.type,
      data: {
        content: `${eventType.icon} ${eventType.label}`,
        color: eventType.color,
      },
    };

    const updatedData = [...data];
    updatedData[selectedTrack] = {
      ...updatedData[selectedTrack],
      actions: [...updatedData[selectedTrack].actions, newAction],
    };
    setData(updatedData);
  };

  const handleClearAll = () => {
    setData([
      { id: 'row0', actions: [] },
      { id: 'row1', actions: [] },
      { id: 'row2', actions: [] },
      { id: 'row3', actions: [] },
    ]);
  };

  return (
    <Container>
      <Header>
        <Title>⏱️ Timeline Editor Demo</Title>
        <Subtitle>Four-track timeline with draggable events</Subtitle>
      </Header>

      <TimelineContainer>
        <ControlsSection>
          <ControlsRow>
            <ControlsLabel>Target Track:</ControlsLabel>
            <select 
              value={selectedTrack} 
              onChange={(e) => setSelectedTrack(Number(e.target.value))}
              style={{
                padding: '8px 12px',
                fontSize: '0.9rem',
                fontWeight: '600',
                border: `2px solid ${trackConfig[selectedTrack].color}`,
                borderRadius: '6px',
                background: 'white',
                color: trackConfig[selectedTrack].color,
                cursor: 'pointer',
                marginRight: '20px',
                outline: 'none',
              }}
            >
              {trackConfig.map((track, index) => (
                <option key={track.id} value={index}>
                  {track.name}
                </option>
              ))}
            </select>
            
            <ControlsLabel>Add Event:</ControlsLabel>
            {eventTypes.map((eventType) => (
              <Button
                key={eventType.type}
                $variant="primary"
                $color={eventType.color}
                onClick={() => handleAddEvent(eventType)}
              >
                {eventType.icon} {eventType.label}
              </Button>
            ))}
            <Button $variant="secondary" onClick={handleClearAll} style={{ marginLeft: '20px' }}>
              Clear All
            </Button>
            <Button $variant="secondary" onClick={() => console.log('Timeline data:', data)}>
              Log Data
            </Button>
          </ControlsRow>
        </ControlsSection>

        {mounted ? (
          <div style={{ position: 'relative' }}>
            <Timeline
              scale={30}
              scaleWidth={160}
              startLeft={20}
              autoScroll={true}
              onChange={setData}
              editorData={data}
              effects={effects}
              dragLine={true}
              minScaleCount={20}
              maxScaleCount={100}
              getScaleRender={(scale) => <div style={{ color: '#666' }}>{scale}s</div>}
              getActionRender={(action) => (
                <div
                  style={{
                    background: action.data.color,
                    color: 'white',
                    padding: '6px 10px',
                    borderRadius: '6px',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    fontSize: '0.9rem',
                    fontWeight: '600',
                    overflow: 'hidden',
                    whiteSpace: 'nowrap',
                    textOverflow: 'ellipsis',
                    cursor: 'move',
                    userSelect: 'none',
                  }}
                >
                  {action.data.content}
                </div>
              )}
              rowHeight={60}
              style={{
                width: '100%',
                height: '280px',
                touchAction: 'pan-y pinch-zoom', // Allow vertical panning and zoom
                cursor: 'default',
              }}
            />
            <style jsx global>{`
              .timeline-editor-edit-row:nth-child(1) {
                background: ${selectedTrack === 0 ? 'rgba(102, 126, 234, 0.25)' : 'rgba(102, 126, 234, 0.08)'} !important;
                border: ${selectedTrack === 0 ? '2px solid #667eea' : 'none'} !important;
              }
              .timeline-editor-edit-row:nth-child(2) {
                background: ${selectedTrack === 1 ? 'rgba(240, 147, 251, 0.25)' : 'rgba(240, 147, 251, 0.08)'} !important;
                border: ${selectedTrack === 1 ? '2px solid #f093fb' : 'none'} !important;
              }
              .timeline-editor-edit-row:nth-child(3) {
                background: ${selectedTrack === 2 ? 'rgba(118, 75, 162, 0.25)' : 'rgba(118, 75, 162, 0.08)'} !important;
                border: ${selectedTrack === 2 ? '2px solid #764ba2' : 'none'} !important;
              }
              .timeline-editor-edit-row:nth-child(4) {
                background: ${selectedTrack === 3 ? 'rgba(46, 204, 113, 0.25)' : 'rgba(46, 204, 113, 0.08)'} !important;
                border: ${selectedTrack === 3 ? '2px solid #2ecc71' : 'none'} !important;
              }
              .timeline-editor-edit-row {
                border-bottom: 1px solid rgba(0,0,0,0.05);
                transition: all 0.2s ease;
              }
            `}</style>
          </div>
        ) : (
          <div style={{ 
            width: '100%', 
            height: '280px', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            background: '#f5f5f5',
            borderRadius: '8px'
          }}>
            Loading timeline editor...
          </div>
        )}

        <div style={{ marginTop: '20px', padding: '20px', background: 'white', border: '2px solid #667eea', borderRadius: '12px' }}>
          <strong style={{ fontSize: '1.1rem', color: '#333' }}>🖱️ How to Use:</strong>
          <ul style={{ marginTop: '12px', paddingLeft: '20px', lineHeight: '1.6', color: '#333' }}>
            <li><strong style={{ color: '#667eea' }}>Select track:</strong> Use the "Target Track" dropdown to choose which receiver (Receiver 1-4) to add events to. The selected track will be highlighted in the timeline.</li>
            <li><strong style={{ color: '#f093fb' }}>Add events:</strong> Click any event type button (🎵 Audio, 📝 Text, 🎬 Video, 🗣️ TTS) to add it to the currently selected track</li>
            <li><strong style={{ color: '#2ecc71' }}>Move timing:</strong> Drag events left/right to adjust when they happen</li>
            <li><strong style={{ color: '#9b59b6' }}>Resize:</strong> Drag the edges to make events longer/shorter</li>
            <li><strong style={{ color: '#3498db' }}>Visual feedback:</strong> The selected track has a colored border and darker background. Events snap to a guide line when dragging.</li>
          </ul>
        </div>
      </TimelineContainer>
    </Container>
  );
}

