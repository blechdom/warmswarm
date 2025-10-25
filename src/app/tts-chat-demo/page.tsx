'use client';

import ChatWithTTS from '@/components/ChatWithTTS';
import { useState } from 'react';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

export default function TTSChatDemo() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hello! I can speak any message. Click the speaker button next to any message to hear it!',
      sender: 'bot',
      timestamp: new Date()
    },
    {
      id: '2',
      text: 'You can also select a different voice from the dropdown above.',
      sender: 'bot',
      timestamp: new Date()
    },
    {
      id: '3',
      text: 'Try it out with different voices and see how they sound!',
      sender: 'user',
      timestamp: new Date()
    }
  ]);

  const handleSendMessage = (text: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      text,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);

    // Simulate bot response
    setTimeout(() => {
      const botResponses = [
        "That's interesting! Let me think about that.",
        "I understand what you mean. Would you like to hear this in a different voice?",
        "Great question! The Web Speech API is completely free and works offline.",
        "All the voices you hear are native to your device - no API costs!",
        "Try changing the voice in the dropdown to hear different options."
      ];

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: botResponses[Math.floor(Math.random() * botResponses.length)],
        sender: 'bot',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
    }, 1000);
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '20px',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{
          textAlign: 'center',
          marginBottom: '30px',
          color: 'white'
        }}>
          <h1 style={{
            fontSize: '2.5rem',
            fontWeight: '800',
            marginBottom: '10px',
            textShadow: '0 2px 10px rgba(0,0,0,0.3)'
          }}>
            💬 Chat with Text-to-Speech
          </h1>
          <p style={{
            fontSize: '1.2rem',
            opacity: 0.95,
            marginBottom: '15px'
          }}>
            Interactive demo showing TTS integration in a chat interface
          </p>
          <div style={{
            display: 'flex',
            gap: '10px',
            justifyContent: 'center',
            flexWrap: 'wrap'
          }}>
            <a
              href="/tts-demo"
              style={{
                padding: '8px 16px',
                background: 'rgba(255,255,255,0.2)',
                color: 'white',
                borderRadius: '6px',
                textDecoration: 'none',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255,255,255,0.3)',
                fontWeight: '600'
              }}
            >
              Voice Demo
            </a>
            <a
              href="/demos"
              style={{
                padding: '8px 16px',
                background: 'rgba(255,255,255,0.2)',
                color: 'white',
                borderRadius: '6px',
                textDecoration: 'none',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255,255,255,0.3)',
                fontWeight: '600'
              }}
            >
              All Demos
            </a>
          </div>
        </div>

        {/* Chat Component */}
        <div style={{
          background: 'white',
          borderRadius: '16px',
          boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
          overflow: 'hidden',
          height: '600px'
        }}>
          <ChatWithTTS
            messages={messages}
            onSendMessage={handleSendMessage}
            showVoiceSelector={true}
          />
        </div>

        {/* Info Section */}
        <div style={{
          marginTop: '30px',
          background: 'rgba(255,255,255,0.95)',
          borderRadius: '16px',
          padding: '25px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.2)'
        }}>
          <h3 style={{ marginTop: 0, color: '#333' }}>🎯 How to Use</h3>
          <ul style={{ lineHeight: '1.8', color: '#666' }}>
            <li><strong>🔊 Speak Button:</strong> Click the speaker icon next to any message to hear it</li>
            <li><strong>🎤 Voice Selection:</strong> Choose from 40+ voices in the dropdown above</li>
            <li><strong>⏹️ Stop:</strong> Click the red stop button to interrupt speech</li>
            <li><strong>💬 Try It:</strong> Type your own messages and hear them spoken!</li>
          </ul>

          <h3 style={{ color: '#333', marginBottom: '10px' }}>💡 Integration Code</h3>
          <pre style={{
            background: '#f5f5f5',
            padding: '15px',
            borderRadius: '8px',
            overflow: 'auto',
            fontSize: '0.85rem'
          }}>
{`import { useTextToSpeech } from '@/hooks/useTextToSpeech';

function ChatMessage({ message }) {
  const { speak, stop, isSpeaking } = useTextToSpeech();

  return (
    <div>
      <p>{message.text}</p>
      <button onClick={() => speak(message.text)}>
        {isSpeaking ? '⏹️ Stop' : '🔊 Speak'}
      </button>
    </div>
  );
}`}
          </pre>

          <div style={{ marginTop: '20px', padding: '15px', background: '#e3f2fd', borderRadius: '8px' }}>
            <strong style={{ color: '#1976d2' }}>📚 Full Integration Guide:</strong>
            <p style={{ margin: '5px 0 0 0', color: '#666' }}>
              See <code>TTS-INTEGRATION-GUIDE.md</code> for complete examples and patterns
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

