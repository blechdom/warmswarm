/**
 * Example Chat Component with Text-to-Speech Integration
 * 
 * This component demonstrates how to add TTS to any chat interface
 */

'use client';

import { useState } from 'react';
import { useTextToSpeech } from '@/hooks/useTextToSpeech';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

interface ChatWithTTSProps {
  messages: Message[];
  onSendMessage?: (text: string) => void;
  autoSpeak?: boolean; // Auto-speak bot messages
  showVoiceSelector?: boolean;
}

export default function ChatWithTTS({ 
  messages, 
  onSendMessage,
  autoSpeak = false,
  showVoiceSelector = true 
}: ChatWithTTSProps) {
  const [inputText, setInputText] = useState('');
  const [selectedVoice, setSelectedVoice] = useState<string>('');
  const [speakingMessageId, setSpeakingMessageId] = useState<string | null>(null);
  
  const { 
    speak, 
    stop, 
    voices, 
    isSpeaking, 
    currentWord,
    isSupported 
  } = useTextToSpeech();

  // Handle speaking a message
  const speakMessage = async (message: Message) => {
    if (isSpeaking) {
      stop();
      setSpeakingMessageId(null);
      return;
    }

    setSpeakingMessageId(message.id);

    try {
      const voice = voices.find(v => v.name === selectedVoice);
      
      await speak(message.text, {
        voice: voice,
        rate: 1.0,
        onEnd: () => {
          setSpeakingMessageId(null);
        }
      });
    } catch (error) {
      console.error('TTS error:', error);
      setSpeakingMessageId(null);
    }
  };

  // Handle sending message
  const handleSend = () => {
    if (inputText.trim() && onSendMessage) {
      onSendMessage(inputText);
      setInputText('');
    }
  };

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      height: '100%',
      maxWidth: '800px',
      margin: '0 auto'
    }}>
      {/* Voice Selector */}
      {showVoiceSelector && isSupported && voices.length > 0 && (
        <div style={{
          padding: '15px',
          background: '#f5f5f5',
          borderBottom: '1px solid #e0e0e0'
        }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontWeight: '600' }}>🎤 Voice:</span>
            <select
              value={selectedVoice}
              onChange={(e) => setSelectedVoice(e.target.value)}
              style={{
                flex: 1,
                padding: '8px',
                borderRadius: '6px',
                border: '1px solid #ccc'
              }}
            >
              <option value="">Default Voice</option>
              {voices.map((voice, index) => (
                <option key={index} value={voice.name}>
                  {voice.name} ({voice.lang})
                </option>
              ))}
            </select>
          </label>
        </div>
      )}

      {/* Messages */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '15px'
      }}>
        {messages.map((message) => (
          <div
            key={message.id}
            style={{
              display: 'flex',
              flexDirection: message.sender === 'user' ? 'row-reverse' : 'row',
              gap: '10px',
              alignItems: 'flex-start'
            }}
          >
            {/* Message Bubble */}
            <div
              style={{
                maxWidth: '70%',
                padding: '12px 16px',
                borderRadius: '12px',
                background: message.sender === 'user' ? '#2196F3' : '#f0f0f0',
                color: message.sender === 'user' ? 'white' : '#333',
                position: 'relative',
                boxShadow: speakingMessageId === message.id 
                  ? '0 0 0 3px rgba(76, 175, 80, 0.3)' 
                  : 'none'
              }}
            >
              {message.text}
              
              {/* Speaking indicator */}
              {speakingMessageId === message.id && currentWord && (
                <div style={{
                  position: 'absolute',
                  bottom: '-25px',
                  left: '0',
                  fontSize: '0.75rem',
                  color: '#4CAF50',
                  fontWeight: '600'
                }}>
                  Speaking: {currentWord}
                </div>
              )}
            </div>

            {/* TTS Button */}
            {isSupported && (
              <button
                onClick={() => speakMessage(message)}
                style={{
                  padding: '8px',
                  borderRadius: '50%',
                  border: 'none',
                  background: speakingMessageId === message.id ? '#f44336' : '#4CAF50',
                  color: 'white',
                  cursor: 'pointer',
                  fontSize: '1.2rem',
                  width: '40px',
                  height: '40px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.2s'
                }}
                title={speakingMessageId === message.id ? 'Stop' : 'Speak'}
              >
                {speakingMessageId === message.id ? '⏹️' : '🔊'}
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Input Area */}
      <div style={{
        padding: '20px',
        borderTop: '1px solid #e0e0e0',
        background: 'white'
      }}>
        <div style={{ display: 'flex', gap: '10px' }}>
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Type a message..."
            style={{
              flex: 1,
              padding: '12px',
              borderRadius: '8px',
              border: '1px solid #ccc',
              fontSize: '1rem'
            }}
          />
          <button
            onClick={handleSend}
            disabled={!inputText.trim()}
            style={{
              padding: '12px 24px',
              borderRadius: '8px',
              border: 'none',
              background: inputText.trim() ? '#2196F3' : '#ccc',
              color: 'white',
              cursor: inputText.trim() ? 'pointer' : 'not-allowed',
              fontWeight: '600'
            }}
          >
            Send
          </button>
        </div>
      </div>

      {/* TTS Not Supported Warning */}
      {!isSupported && (
        <div style={{
          padding: '10px',
          background: '#fff3cd',
          color: '#856404',
          textAlign: 'center',
          fontSize: '0.9rem'
        }}>
          ⚠️ Text-to-speech is not supported in this browser
        </div>
      )}
    </div>
  );
}

