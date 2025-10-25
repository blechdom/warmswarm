'use client';

import { useState } from 'react';

interface Emoji {
  emoji: string;
  name: string;
  keywords: string[];
}

export default function EmojisDemo() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEmoji, setSelectedEmoji] = useState<string | null>(null);
  const [copiedEmoji, setCopiedEmoji] = useState<string | null>(null);

  // Comprehensive emoji collection organized by category
  const emojiCategories = [
    {
      category: '😀 Smileys & Emotions',
      emojis: [
        { emoji: '😀', name: 'Grinning Face', keywords: ['happy', 'smile', 'joy'] },
        { emoji: '😃', name: 'Grinning Face with Big Eyes', keywords: ['happy', 'joy'] },
        { emoji: '😄', name: 'Grinning Face with Smiling Eyes', keywords: ['happy', 'smile'] },
        { emoji: '😁', name: 'Beaming Face', keywords: ['happy', 'smile'] },
        { emoji: '😊', name: 'Smiling Face with Smiling Eyes', keywords: ['happy', 'blush'] },
        { emoji: '😍', name: 'Heart Eyes', keywords: ['love', 'heart', 'crush'] },
        { emoji: '🥰', name: 'Smiling Face with Hearts', keywords: ['love', 'hearts'] },
        { emoji: '😘', name: 'Face Blowing Kiss', keywords: ['kiss', 'love'] },
        { emoji: '😂', name: 'Face with Tears of Joy', keywords: ['laugh', 'funny', 'lol'] },
        { emoji: '🤣', name: 'Rolling on Floor Laughing', keywords: ['laugh', 'rofl'] },
        { emoji: '😎', name: 'Smiling Face with Sunglasses', keywords: ['cool', 'awesome'] },
        { emoji: '🤔', name: 'Thinking Face', keywords: ['think', 'hmm', 'consider'] },
        { emoji: '😐', name: 'Neutral Face', keywords: ['meh', 'neutral'] },
        { emoji: '😢', name: 'Crying Face', keywords: ['sad', 'cry', 'tear'] },
        { emoji: '😭', name: 'Loudly Crying', keywords: ['sob', 'sad', 'cry'] },
        { emoji: '😡', name: 'Angry Face', keywords: ['angry', 'mad', 'rage'] },
        { emoji: '🤯', name: 'Exploding Head', keywords: ['mind blown', 'wow'] },
        { emoji: '😱', name: 'Face Screaming in Fear', keywords: ['scared', 'shock'] },
      ]
    },
    {
      category: '👋 People & Body',
      emojis: [
        { emoji: '👋', name: 'Waving Hand', keywords: ['wave', 'hello', 'hi'] },
        { emoji: '🤚', name: 'Raised Back of Hand', keywords: ['hand', 'stop'] },
        { emoji: '✋', name: 'Raised Hand', keywords: ['hand', 'stop'] },
        { emoji: '👌', name: 'OK Hand', keywords: ['ok', 'okay', 'good'] },
        { emoji: '✌️', name: 'Victory Hand', keywords: ['peace', 'victory'] },
        { emoji: '🤞', name: 'Crossed Fingers', keywords: ['luck', 'hope'] },
        { emoji: '👍', name: 'Thumbs Up', keywords: ['like', 'approve', 'yes'] },
        { emoji: '👎', name: 'Thumbs Down', keywords: ['dislike', 'no'] },
        { emoji: '👊', name: 'Fist Bump', keywords: ['fist', 'bump'] },
        { emoji: '✊', name: 'Raised Fist', keywords: ['fist', 'power'] },
        { emoji: '🙏', name: 'Folded Hands', keywords: ['pray', 'thanks', 'please'] },
        { emoji: '💪', name: 'Flexed Biceps', keywords: ['strong', 'muscle'] },
        { emoji: '👏', name: 'Clapping Hands', keywords: ['clap', 'applause'] },
      ]
    },
    {
      category: '🎵 Music & Performance',
      emojis: [
        { emoji: '🎵', name: 'Musical Note', keywords: ['music', 'note'] },
        { emoji: '🎶', name: 'Musical Notes', keywords: ['music', 'notes'] },
        { emoji: '🎤', name: 'Microphone', keywords: ['sing', 'mic', 'karaoke'] },
        { emoji: '🎧', name: 'Headphone', keywords: ['music', 'headphones'] },
        { emoji: '🎸', name: 'Guitar', keywords: ['music', 'guitar', 'rock'] },
        { emoji: '🎹', name: 'Musical Keyboard', keywords: ['piano', 'music'] },
        { emoji: '🎺', name: 'Trumpet', keywords: ['music', 'trumpet'] },
        { emoji: '🎻', name: 'Violin', keywords: ['music', 'violin'] },
        { emoji: '🥁', name: 'Drum', keywords: ['music', 'drum', 'percussion'] },
        { emoji: '🎼', name: 'Musical Score', keywords: ['music', 'sheet', 'notes'] },
        { emoji: '🎭', name: 'Performing Arts', keywords: ['theater', 'drama'] },
      ]
    },
    {
      category: '🚀 Objects & Symbols',
      emojis: [
        { emoji: '🚀', name: 'Rocket', keywords: ['rocket', 'space', 'launch'] },
        { emoji: '⭐', name: 'Star', keywords: ['star', 'favorite'] },
        { emoji: '✨', name: 'Sparkles', keywords: ['sparkle', 'shine'] },
        { emoji: '🔥', name: 'Fire', keywords: ['fire', 'hot', 'flame'] },
        { emoji: '💡', name: 'Light Bulb', keywords: ['idea', 'light'] },
        { emoji: '⚡', name: 'High Voltage', keywords: ['lightning', 'electric'] },
        { emoji: '🎯', name: 'Direct Hit', keywords: ['target', 'goal'] },
        { emoji: '💎', name: 'Gem Stone', keywords: ['diamond', 'gem'] },
        { emoji: '🏆', name: 'Trophy', keywords: ['win', 'award', 'champion'] },
        { emoji: '🎁', name: 'Wrapped Gift', keywords: ['gift', 'present'] },
        { emoji: '📱', name: 'Mobile Phone', keywords: ['phone', 'mobile'] },
        { emoji: '💻', name: 'Laptop', keywords: ['computer', 'laptop'] },
        { emoji: '⌚', name: 'Watch', keywords: ['watch', 'time'] },
        { emoji: '📊', name: 'Bar Chart', keywords: ['chart', 'graph', 'stats'] },
        { emoji: '📈', name: 'Chart Increasing', keywords: ['chart', 'growth', 'up'] },
      ]
    },
    {
      category: '❤️ Hearts & Love',
      emojis: [
        { emoji: '❤️', name: 'Red Heart', keywords: ['love', 'heart', 'red'] },
        { emoji: '🧡', name: 'Orange Heart', keywords: ['love', 'heart', 'orange'] },
        { emoji: '💛', name: 'Yellow Heart', keywords: ['love', 'heart', 'yellow'] },
        { emoji: '💚', name: 'Green Heart', keywords: ['love', 'heart', 'green'] },
        { emoji: '💙', name: 'Blue Heart', keywords: ['love', 'heart', 'blue'] },
        { emoji: '💜', name: 'Purple Heart', keywords: ['love', 'heart', 'purple'] },
        { emoji: '🖤', name: 'Black Heart', keywords: ['love', 'heart', 'black'] },
        { emoji: '🤍', name: 'White Heart', keywords: ['love', 'heart', 'white'] },
        { emoji: '💕', name: 'Two Hearts', keywords: ['love', 'hearts'] },
        { emoji: '💞', name: 'Revolving Hearts', keywords: ['love', 'hearts'] },
        { emoji: '💓', name: 'Beating Heart', keywords: ['love', 'heartbeat'] },
        { emoji: '💗', name: 'Growing Heart', keywords: ['love', 'heart', 'growing'] },
        { emoji: '💖', name: 'Sparkling Heart', keywords: ['love', 'heart', 'sparkle'] },
      ]
    },
    {
      category: '🌟 Nature & Weather',
      emojis: [
        { emoji: '🌟', name: 'Glowing Star', keywords: ['star', 'glow'] },
        { emoji: '🌙', name: 'Crescent Moon', keywords: ['moon', 'night'] },
        { emoji: '☀️', name: 'Sun', keywords: ['sun', 'sunny', 'day'] },
        { emoji: '⛅', name: 'Sun Behind Cloud', keywords: ['cloud', 'sun'] },
        { emoji: '🌈', name: 'Rainbow', keywords: ['rainbow', 'colorful'] },
        { emoji: '⚡', name: 'Lightning', keywords: ['lightning', 'storm'] },
        { emoji: '🌊', name: 'Water Wave', keywords: ['wave', 'water', 'ocean'] },
        { emoji: '🔥', name: 'Fire', keywords: ['fire', 'flame'] },
        { emoji: '🌸', name: 'Cherry Blossom', keywords: ['flower', 'spring'] },
        { emoji: '🌺', name: 'Hibiscus', keywords: ['flower', 'tropical'] },
        { emoji: '🌻', name: 'Sunflower', keywords: ['flower', 'sun'] },
        { emoji: '🌹', name: 'Rose', keywords: ['flower', 'rose'] },
      ]
    },
    {
      category: '✅ UI & Navigation',
      emojis: [
        { emoji: '✅', name: 'Check Mark', keywords: ['check', 'done', 'yes'] },
        { emoji: '❌', name: 'Cross Mark', keywords: ['x', 'no', 'cancel'] },
        { emoji: '⚠️', name: 'Warning', keywords: ['warning', 'caution'] },
        { emoji: '❗', name: 'Exclamation Mark', keywords: ['important', 'alert'] },
        { emoji: '❓', name: 'Question Mark', keywords: ['question', 'help'] },
        { emoji: '➕', name: 'Plus', keywords: ['add', 'plus', 'more'] },
        { emoji: '➖', name: 'Minus', keywords: ['subtract', 'minus', 'less'] },
        { emoji: '▶️', name: 'Play Button', keywords: ['play', 'start'] },
        { emoji: '⏸️', name: 'Pause Button', keywords: ['pause', 'stop'] },
        { emoji: '⏹️', name: 'Stop Button', keywords: ['stop', 'end'] },
        { emoji: '⏭️', name: 'Next Track', keywords: ['next', 'skip'] },
        { emoji: '⏮️', name: 'Previous Track', keywords: ['previous', 'back'] },
        { emoji: '🔄', name: 'Counterclockwise Arrows', keywords: ['refresh', 'reload'] },
        { emoji: '🔃', name: 'Clockwise Arrows', keywords: ['reload', 'sync'] },
      ]
    }
  ];

  const allEmojis = emojiCategories.flatMap(cat => 
    cat.emojis.map(e => ({ ...e, category: cat.category }))
  );

  const filteredCategories = emojiCategories.map(cat => ({
    ...cat,
    emojis: cat.emojis.filter(emoji => 
      emoji.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emoji.keywords.some(k => k.toLowerCase().includes(searchTerm.toLowerCase())) ||
      emoji.emoji.includes(searchTerm)
    )
  })).filter(cat => cat.emojis.length > 0);

  const copyEmoji = (emoji: string) => {
    navigator.clipboard.writeText(emoji);
    setCopiedEmoji(emoji);
    setTimeout(() => setCopiedEmoji(null), 2000);
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
      padding: '40px 20px',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{
          background: 'white',
          borderRadius: '16px',
          padding: '30px',
          marginBottom: '30px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.2)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
            <div>
              <h1 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '10px', color: '#333' }}>
                😊 Emoji Showcase
              </h1>
              <p style={{ color: '#666', fontSize: '1.1rem' }}>
                {allEmojis.length} emojis across {emojiCategories.length} categories
              </p>
            </div>
            <a
              href="/demos"
              style={{
                padding: '12px 24px',
                background: '#E91E63',
                color: 'white',
                borderRadius: '8px',
                textDecoration: 'none',
                fontWeight: '600'
              }}
            >
              ← All Demos
            </a>
          </div>

          {/* Search Bar */}
          <div style={{ marginTop: '20px' }}>
            <input
              type="text"
              placeholder="Search emojis by name or keyword (e.g., 'happy', 'music', 'heart')..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '15px',
                fontSize: '1rem',
                border: '2px solid #e0e0e0',
                borderRadius: '8px',
                outline: 'none'
              }}
              onFocus={(e) => e.target.style.borderColor = '#E91E63'}
              onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
            />
          </div>

          {copiedEmoji && (
            <div style={{
              marginTop: '15px',
              padding: '12px',
              background: '#4CAF50',
              color: 'white',
              borderRadius: '8px',
              textAlign: 'center',
              fontWeight: '600'
            }}>
              Copied {copiedEmoji} to clipboard!
            </div>
          )}
        </div>

        {/* Emoji Categories */}
        {filteredCategories.map((category, catIndex) => (
          <div key={catIndex} style={{
            background: 'white',
            borderRadius: '16px',
            padding: '30px',
            marginBottom: '25px',
            boxShadow: '0 10px 30px rgba(0,0,0,0.2)'
          }}>
            <h2 style={{ fontSize: '1.8rem', fontWeight: '700', marginBottom: '20px', color: '#333' }}>
              {category.category}
            </h2>
            
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
              gap: '15px'
            }}>
              {category.emojis.map((emoji, index) => (
                <div
                  key={index}
                  onClick={() => {
                    setSelectedEmoji(emoji.emoji);
                    copyEmoji(emoji.emoji);
                  }}
                  style={{
                    background: selectedEmoji === emoji.emoji ? '#E91E63' : '#f5f5f5',
                    borderRadius: '12px',
                    padding: '20px',
                    textAlign: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    border: selectedEmoji === emoji.emoji ? '2px solid #E91E63' : '2px solid transparent'
                  }}
                  onMouseEnter={(e) => {
                    if (selectedEmoji !== emoji.emoji) {
                      e.currentTarget.style.background = '#e0e0e0';
                      e.currentTarget.style.transform = 'scale(1.05)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (selectedEmoji !== emoji.emoji) {
                      e.currentTarget.style.background = '#f5f5f5';
                      e.currentTarget.style.transform = 'scale(1)';
                    }
                  }}
                  title={`Click to copy ${emoji.name}`}
                >
                  <div style={{ 
                    fontSize: '3rem', 
                    marginBottom: '8px',
                    filter: selectedEmoji === emoji.emoji ? 'brightness(1.2)' : 'none'
                  }}>
                    {emoji.emoji}
                  </div>
                  <div style={{ 
                    fontSize: '0.75rem', 
                    color: selectedEmoji === emoji.emoji ? 'white' : '#666',
                    fontWeight: '500',
                    lineHeight: '1.3'
                  }}>
                    {emoji.name}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        {filteredCategories.length === 0 && (
          <div style={{
            background: 'white',
            borderRadius: '16px',
            padding: '60px',
            textAlign: 'center',
            boxShadow: '0 10px 30px rgba(0,0,0,0.2)'
          }}>
            <div style={{ fontSize: '4rem', marginBottom: '20px' }}>🔍</div>
            <h3 style={{ fontSize: '1.5rem', color: '#666', marginBottom: '10px' }}>
              No emojis found
            </h3>
            <p style={{ color: '#999' }}>
              Try a different search term
            </p>
          </div>
        )}

        {/* Usage Guide */}
        <div style={{
          background: 'white',
          borderRadius: '16px',
          padding: '30px',
          marginBottom: '30px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.2)'
        }}>
          <h3 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '20px', color: '#333' }}>
            📝 How to Use Emojis in Your Code
          </h3>

          <div style={{ marginBottom: '25px' }}>
            <h4 style={{ color: '#E91E63', marginBottom: '10px' }}>React/JSX:</h4>
            <pre style={{
              background: '#f5f5f5',
              padding: '15px',
              borderRadius: '8px',
              overflow: 'auto',
              fontSize: '0.9rem'
            }}>
{`// Direct emoji in JSX
<button>Click me! 🚀</button>

// As a variable
const rocketEmoji = '🚀';
<div>{rocketEmoji}</div>

// In strings
const message = "Let's go! 🎉";`}
            </pre>
          </div>

          <div style={{ marginBottom: '25px' }}>
            <h4 style={{ color: '#E91E63', marginBottom: '10px' }}>CSS Content:</h4>
            <pre style={{
              background: '#f5f5f5',
              padding: '15px',
              borderRadius: '8px',
              overflow: 'auto',
              fontSize: '0.9rem'
            }}>
{`.icon::before {
  content: "🎵";
  margin-right: 8px;
}`}
            </pre>
          </div>

          <div>
            <h4 style={{ color: '#E91E63', marginBottom: '10px' }}>HTML Entities (Alternative):</h4>
            <pre style={{
              background: '#f5f5f5',
              padding: '15px',
              borderRadius: '8px',
              overflow: 'auto',
              fontSize: '0.9rem'
            }}>
{`<!-- Using Unicode -->
<p>&#128512;</p>  <!-- 😀 -->
<p>&#128525;</p>  <!-- 😍 -->
<p>&#127881;</p>  <!-- 🎉 -->`}
            </pre>
          </div>
        </div>

        {/* Info Box */}
        <div style={{
          background: 'rgba(255,255,255,0.95)',
          borderRadius: '16px',
          padding: '25px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
          borderLeft: '4px solid #E91E63'
        }}>
          <h4 style={{ color: '#E91E63', marginBottom: '15px', fontSize: '1.2rem' }}>
            ℹ️ Emoji Best Practices
          </h4>
          <ul style={{ lineHeight: '1.8', color: '#666' }}>
            <li><strong>Universal:</strong> Emojis work across all modern browsers and devices</li>
            <li><strong>Accessibility:</strong> Use aria-label for screen readers when emoji conveys meaning</li>
            <li><strong>File size:</strong> Emojis are just Unicode characters, so zero file size!</li>
            <li><strong>Rendering:</strong> Appearance varies slightly between iOS, Android, and desktop</li>
            <li><strong>Click to copy:</strong> Click any emoji above to copy it to your clipboard</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

