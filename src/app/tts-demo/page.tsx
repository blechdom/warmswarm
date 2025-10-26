'use client';

import { useState, useEffect, useRef } from 'react';

interface VoiceOption {
  voice: SpeechSynthesisVoice;
  index: number;
}

export default function TTSDemo() {
  const [text, setText] = useState("Hello! This is a text-to-speech demo. Try different voices and settings to hear how they sound.");
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<number>(0);
  const [rate, setRate] = useState(1.0);
  const [pitch, setPitch] = useState(1.0);
  const [volume, setVolume] = useState(1.0);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentWord, setCurrentWord] = useState<string>('');
  const [supportsAPI, setSupportsAPI] = useState(true);
  
  const synthRef = useRef<SpeechSynthesis | null>(null);

  // Load voices
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    if (!('speechSynthesis' in window)) {
      setSupportsAPI(false);
      return;
    }

    synthRef.current = window.speechSynthesis;

    const loadVoices = () => {
      const availableVoices = synthRef.current?.getVoices() || [];
      console.log('Loaded voices:', availableVoices.length);
      setVoices(availableVoices);
      
      // Try to find a good default voice
      const defaultIndex = availableVoices.findIndex(v => 
        v.lang.startsWith('en-') && v.localService
      );
      if (defaultIndex >= 0) {
        setSelectedVoice(defaultIndex);
      }
    };

    loadVoices();

    // Voices load asynchronously on some browsers
    if (synthRef.current) {
      synthRef.current.addEventListener('voiceschanged', loadVoices);
    }

    return () => {
      if (synthRef.current) {
        synthRef.current.removeEventListener('voiceschanged', loadVoices);
      }
    };
  }, []);

  const speak = () => {
    if (!synthRef.current || !text.trim()) return;

    // Cancel any ongoing speech
    synthRef.current.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    
    // Set voice
    if (voices[selectedVoice]) {
      utterance.voice = voices[selectedVoice];
    }
    
    utterance.rate = rate;
    utterance.pitch = pitch;
    utterance.volume = volume;

    // Event handlers
    utterance.onstart = () => {
      setIsSpeaking(true);
      setIsPaused(false);
    };

    utterance.onend = () => {
      setIsSpeaking(false);
      setIsPaused(false);
      setCurrentWord('');
    };

    utterance.onerror = (event) => {
      console.error('Speech error:', event);
      setIsSpeaking(false);
      setIsPaused(false);
    };

    utterance.onpause = () => {
      setIsPaused(true);
    };

    utterance.onresume = () => {
      setIsPaused(false);
    };

    // Word boundary tracking (shows which word is being spoken)
    utterance.onboundary = (event) => {
      if (event.name === 'word') {
        const word = text.substring(event.charIndex, event.charIndex + event.charLength);
        setCurrentWord(word);
      }
    };

    synthRef.current.speak(utterance);
  };

  const pause = () => {
    if (synthRef.current && isSpeaking) {
      synthRef.current.pause();
    }
  };

  const resume = () => {
    if (synthRef.current && isPaused) {
      synthRef.current.resume();
    }
  };

  const stop = () => {
    if (synthRef.current) {
      synthRef.current.cancel();
      setIsSpeaking(false);
      setIsPaused(false);
      setCurrentWord('');
    }
  };

  const testQuickPhrases = (phrase: string) => {
    setText(phrase);
    setTimeout(() => speak(), 100);
  };

  if (!supportsAPI) {
    return (
      <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
        <h1>❌ Text-to-Speech Not Supported</h1>
        <p>Your browser doesn't support the Web Speech API.</p>
        <p>Try using:</p>
        <ul>
          <li>Chrome (desktop or Android)</li>
          <li>Safari (macOS or iOS)</li>
          <li>Edge (desktop)</li>
          <li>Firefox (desktop)</li>
        </ul>
      </div>
    );
  }

  return (
    <div style={{
      padding: '20px',
      maxWidth: '1000px',
      margin: '0 auto',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      <h1 style={{ marginBottom: '10px' }}>🔊 Text-to-Speech Demo</h1>
      <p style={{ color: '#666', marginBottom: '30px' }}>
        Test browser-based text-to-speech with different voices and settings
      </p>

      {/* Status Bar */}
      <div style={{
        padding: '15px',
        background: isSpeaking ? '#4CAF50' : '#f5f5f5',
        color: isSpeaking ? 'white' : '#333',
        borderRadius: '8px',
        marginBottom: '20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div>
          <strong>Status:</strong> {
            isSpeaking ? (isPaused ? '⏸️ Paused' : '🔊 Speaking') : '⏹️ Idle'
          }
          {currentWord && (
            <span style={{ marginLeft: '20px' }}>
              Current word: <strong>{currentWord}</strong>
            </span>
          )}
        </div>
        <div style={{ fontSize: '12px' }}>
          {voices.length} voices available
        </div>
      </div>

      {/* Text Input */}
      <div style={{ marginBottom: '20px' }}>
        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
          Text to Speak:
        </label>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          style={{
            width: '100%',
            minHeight: '100px',
            padding: '10px',
            fontSize: '16px',
            borderRadius: '4px',
            border: '1px solid #ccc',
            fontFamily: 'inherit'
          }}
          placeholder="Enter text to convert to speech..."
        />
        
        {/* Quick Test Phrases */}
        <div style={{ marginTop: '10px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <button
            onClick={() => testQuickPhrases("Hello! How are you today?")}
            style={quickButtonStyle}
          >
            Test Greeting
          </button>
          <button
            onClick={() => testQuickPhrases("The quick brown fox jumps over the lazy dog.")}
            style={quickButtonStyle}
          >
            Test Pangram
          </button>
          <button
            onClick={() => testQuickPhrases("One, two, three, four, five. Testing numbers and punctuation!")}
            style={quickButtonStyle}
          >
            Test Numbers
          </button>
        </div>
      </div>

      {/* Controls */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '20px',
        marginBottom: '20px'
      }}>
        {/* Rate Control */}
        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
            Rate: {rate.toFixed(1)}x
          </label>
          <input
            type="range"
            min="0.1"
            max="3"
            step="0.1"
            value={rate}
            onChange={(e) => setRate(parseFloat(e.target.value))}
            style={{ width: '100%' }}
          />
          <div style={{ fontSize: '12px', color: '#666' }}>
            Slower ← → Faster
          </div>
        </div>

        {/* Pitch Control */}
        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
            Pitch: {pitch.toFixed(1)}
          </label>
          <input
            type="range"
            min="0"
            max="2"
            step="0.1"
            value={pitch}
            onChange={(e) => setPitch(parseFloat(e.target.value))}
            style={{ width: '100%' }}
          />
          <div style={{ fontSize: '12px', color: '#666' }}>
            Lower ← → Higher
          </div>
        </div>

        {/* Volume Control */}
        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
            Volume: {Math.round(volume * 100)}%
          </label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={volume}
            onChange={(e) => setVolume(parseFloat(e.target.value))}
            style={{ width: '100%' }}
          />
          <div style={{ fontSize: '12px', color: '#666' }}>
            Quiet ← → Loud
          </div>
        </div>
      </div>

      {/* Playback Controls */}
      <div style={{
        display: 'flex',
        gap: '10px',
        marginBottom: '30px',
        flexWrap: 'wrap'
      }}>
        <button
          onClick={speak}
          disabled={isSpeaking && !isPaused}
          style={{
            ...buttonStyle,
            background: isSpeaking && !isPaused ? '#ccc' : '#4CAF50'
          }}
        >
          ▶️ Speak
        </button>
        <button
          onClick={pause}
          disabled={!isSpeaking || isPaused}
          style={{
            ...buttonStyle,
            background: !isSpeaking || isPaused ? '#ccc' : '#FF9800'
          }}
        >
          ⏸️ Pause
        </button>
        <button
          onClick={resume}
          disabled={!isPaused}
          style={{
            ...buttonStyle,
            background: !isPaused ? '#ccc' : '#2196F3'
          }}
        >
          ▶️ Resume
        </button>
        <button
          onClick={stop}
          disabled={!isSpeaking}
          style={{
            ...buttonStyle,
            background: !isSpeaking ? '#ccc' : '#f44336'
          }}
        >
          ⏹️ Stop
        </button>
      </div>

      {/* Voice Selection */}
      <div style={{ marginBottom: '20px' }}>
        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
          Select Voice ({voices.length} available):
        </label>
        <select
          value={selectedVoice}
          onChange={(e) => setSelectedVoice(parseInt(e.target.value))}
          style={{
            width: '100%',
            padding: '10px',
            fontSize: '16px',
            borderRadius: '4px',
            border: '1px solid #ccc'
          }}
        >
          {voices.map((voice, index) => (
            <option key={index} value={index}>
              {voice.name} ({voice.lang}) {voice.localService ? '🔒 Local' : '☁️ Network'}
            </option>
          ))}
        </select>
        
        {voices[selectedVoice] && (
          <div style={{
            marginTop: '10px',
            padding: '10px',
            background: '#f5f5f5',
            borderRadius: '4px',
            fontSize: '14px'
          }}>
            <strong>Selected Voice Info:</strong>
            <ul style={{ margin: '8px 0', paddingLeft: '20px' }}>
              <li>Name: {voices[selectedVoice].name}</li>
              <li>Language: {voices[selectedVoice].lang}</li>
              <li>Type: {voices[selectedVoice].localService ? 'Local (Offline)' : 'Network (Requires Internet)'}</li>
              <li>Default: {voices[selectedVoice].default ? 'Yes' : 'No'}</li>
            </ul>
            <button
              onClick={speak}
              style={{
                ...buttonStyle,
                background: '#2196F3',
                fontSize: '14px',
                padding: '6px 12px'
              }}
            >
              Test This Voice
            </button>
          </div>
        )}
      </div>

      {/* Voice Categories */}
      <div style={{ marginBottom: '30px' }}>
        <h3 style={{ marginBottom: '15px' }}>Quick Voice Selection:</h3>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
          gap: '10px'
        }}>
          {getVoicesByCategory(voices).map(category => (
            <div
              key={category.name}
              style={{
                padding: '10px',
                background: '#f9f9f9',
                borderRadius: '4px',
                border: '1px solid #e0e0e0'
              }}
            >
              <div style={{ fontWeight: 'bold', marginBottom: '8px' }}>
                {category.emoji} {category.name}
              </div>
              {category.voices.map((v, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setSelectedVoice(v.index);
                    setTimeout(() => speak(), 100);
                  }}
                  style={{
                    ...smallButtonStyle,
                    width: '100%',
                    marginBottom: '4px'
                  }}
                  title={`${v.voice.name} (${v.voice.lang})`}
                >
                  {v.voice.name.substring(0, 25)}
                  {v.voice.name.length > 25 ? '...' : ''}
                </button>
              ))}
              {category.voices.length === 0 && (
                <div style={{ fontSize: '12px', color: '#999' }}>
                  No voices available
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Information */}
      <div style={{
        marginTop: '40px',
        padding: '20px',
        background: '#e3f2fd',
        borderRadius: '8px',
        borderLeft: '4px solid #2196F3'
      }}>
        <h3 style={{ marginTop: 0 }}>ℹ️ About Web Speech API</h3>
        <ul style={{ lineHeight: '1.8' }}>
          <li><strong>Free:</strong> No API costs, works completely in the browser</li>
          <li><strong>Offline:</strong> Local voices work without internet connection</li>
          <li><strong>Cross-platform:</strong> Works on iOS, Android, and desktop browsers</li>
          <li><strong>Privacy:</strong> Text never leaves your device (for local voices)</li>
          <li><strong>Instant:</strong> Very low latency compared to cloud APIs</li>
        </ul>
        
        <h4 style={{ marginTop: '20px', marginBottom: '10px' }}>Platform-Specific Notes:</h4>
        <ul style={{ lineHeight: '1.8', fontSize: '14px' }}>
          <li><strong>iOS/Safari:</strong> Uses Siri voices, must be initiated by user interaction</li>
          <li><strong>Android/Chrome:</strong> Uses Google TTS voices from system</li>
          <li><strong>Desktop:</strong> Varies by OS (Windows, macOS, Linux each have different voices)</li>
        </ul>
      </div>

      {/* Back Link */}
      <div style={{ marginTop: '30px', textAlign: 'center' }}>
        <a href="/" style={{ color: '#2196F3', textDecoration: 'none' }}>
          ← Back to Home
        </a>
      </div>
    </div>
  );
}

// Helper function to categorize voices
function getVoicesByCategory(voices: SpeechSynthesisVoice[]) {
  const categories = [
    {
      name: 'English (US)',
      emoji: '🇺🇸',
      voices: voices
        .map((voice, index) => ({ voice, index }))
        .filter(v => v.voice.lang.startsWith('en-US'))
        .slice(0, 5)
    },
    {
      name: 'English (UK)',
      emoji: '🇬🇧',
      voices: voices
        .map((voice, index) => ({ voice, index }))
        .filter(v => v.voice.lang.startsWith('en-GB'))
        .slice(0, 5)
    },
    {
      name: 'Spanish',
      emoji: '🇪🇸',
      voices: voices
        .map((voice, index) => ({ voice, index }))
        .filter(v => v.voice.lang.startsWith('es'))
        .slice(0, 5)
    },
    {
      name: 'French',
      emoji: '🇫🇷',
      voices: voices
        .map((voice, index) => ({ voice, index }))
        .filter(v => v.voice.lang.startsWith('fr'))
        .slice(0, 5)
    },
    {
      name: 'German',
      emoji: '🇩🇪',
      voices: voices
        .map((voice, index) => ({ voice, index }))
        .filter(v => v.voice.lang.startsWith('de'))
        .slice(0, 5)
    },
    {
      name: 'Other Languages',
      emoji: '🌍',
      voices: voices
        .map((voice, index) => ({ voice, index }))
        .filter(v => !v.voice.lang.startsWith('en') && 
                     !v.voice.lang.startsWith('es') && 
                     !v.voice.lang.startsWith('fr') && 
                     !v.voice.lang.startsWith('de'))
        .slice(0, 5)
    }
  ];

  return categories;
}

// Styles
const buttonStyle = {
  padding: '12px 24px',
  fontSize: '16px',
  border: 'none',
  borderRadius: '4px',
  color: 'white',
  cursor: 'pointer',
  fontWeight: 'bold' as const,
  transition: 'opacity 0.2s'
};

const smallButtonStyle = {
  padding: '6px 12px',
  fontSize: '13px',
  border: '1px solid #ddd',
  borderRadius: '3px',
  background: 'white',
  cursor: 'pointer',
  transition: 'all 0.2s',
  textAlign: 'left' as const
};

const quickButtonStyle = {
  padding: '6px 12px',
  fontSize: '13px',
  border: '1px solid #2196F3',
  borderRadius: '4px',
  background: 'white',
  color: '#2196F3',
  cursor: 'pointer',
  transition: 'all 0.2s'
};


