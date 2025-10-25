'use client';

import Image from 'next/image';
import { useState } from 'react';

export default function GIFsDemo() {
  const [selectedGIF, setSelectedGIF] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [playbackSpeed, setPlaybackSpeed] = useState<'normal' | 'slow' | 'fast'>('normal');

  // All GIF assets in the project
  const gifs = [
    { name: 'Conductor', path: '/pics/conductor.gif', category: 'Music', description: 'Animated conductor waving baton' },
    { name: 'Lead Singer', path: '/pics/lead.gif', category: 'Music', description: 'Lead performer animation' },
    { name: 'Metronome', path: '/pics/metronome_ani.gif', category: 'Music', description: 'Animated metronome ticking' },
  ];

  const filteredGIFs = gifs.filter(gif => 
    gif.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    gif.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    gif.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const categories = Array.from(new Set(gifs.map(gif => gif.category)));

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
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
                ✨ Animated GIFs Showcase
              </h1>
              <p style={{ color: '#666', fontSize: '1.1rem' }}>
                {gifs.length} animated assets available
              </p>
            </div>
            <a
              href="/demos"
              style={{
                padding: '12px 24px',
                background: '#FF9800',
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
              placeholder="Search animated GIFs by name, category, or description..."
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
              onFocus={(e) => e.target.style.borderColor = '#FF9800'}
              onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
            />
          </div>
        </div>

        {/* Categories */}
        <div style={{
          background: 'white',
          borderRadius: '16px',
          padding: '20px',
          marginBottom: '30px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.2)'
        }}>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <button
              onClick={() => setSearchTerm('')}
              style={{
                padding: '8px 16px',
                background: searchTerm === '' ? '#FF9800' : '#f5f5f5',
                color: searchTerm === '' ? 'white' : '#333',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: '600'
              }}
            >
              All ({gifs.length})
            </button>
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSearchTerm(category)}
                style={{
                  padding: '8px 16px',
                  background: searchTerm === category ? '#FF9800' : '#f5f5f5',
                  color: searchTerm === category ? 'white' : '#333',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontWeight: '600'
                }}
              >
                {category} ({gifs.filter(g => g.category === category).length})
              </button>
            ))}
          </div>
        </div>

        {/* GIF Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: '25px',
          marginBottom: '30px'
        }}>
          {filteredGIFs.map((gif, index) => (
            <div
              key={index}
              onClick={() => setSelectedGIF(gif.path)}
              style={{
                background: 'white',
                borderRadius: '12px',
                padding: '20px',
                boxShadow: selectedGIF === gif.path 
                  ? '0 8px 25px rgba(255,152,0,0.4)' 
                  : '0 4px 15px rgba(0,0,0,0.1)',
                cursor: 'pointer',
                transition: 'all 0.3s',
                border: selectedGIF === gif.path ? '3px solid #FF9800' : '3px solid transparent'
              }}
              onMouseEnter={(e) => {
                if (selectedGIF !== gif.path) {
                  e.currentTarget.style.transform = 'translateY(-5px)';
                  e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.2)';
                }
              }}
              onMouseLeave={(e) => {
                if (selectedGIF !== gif.path) {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.1)';
                }
              }}
            >
              {/* GIF Display */}
              <div style={{
                width: '100%',
                height: '200px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '15px',
                background: '#000',
                borderRadius: '8px',
                overflow: 'hidden',
                position: 'relative'
              }}>
                <Image
                  src={gif.path}
                  alt={gif.name}
                  width={260}
                  height={200}
                  style={{ 
                    maxWidth: '100%', 
                    maxHeight: '100%', 
                    objectFit: 'contain'
                  }}
                  unoptimized // GIFs need to be unoptimized to animate
                />
                <div style={{
                  position: 'absolute',
                  top: '10px',
                  right: '10px',
                  background: 'rgba(255,152,0,0.9)',
                  color: 'white',
                  padding: '4px 8px',
                  borderRadius: '4px',
                  fontSize: '0.75rem',
                  fontWeight: '600'
                }}>
                  GIF
                </div>
              </div>

              {/* Info */}
              <h3 style={{ fontSize: '1.2rem', fontWeight: '600', marginBottom: '8px', color: '#333' }}>
                {gif.name}
              </h3>
              <p style={{ fontSize: '0.9rem', color: '#666', marginBottom: '10px', lineHeight: '1.5' }}>
                {gif.description}
              </p>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingTop: '10px',
                borderTop: '1px solid #f0f0f0'
              }}>
                <span style={{ fontSize: '0.85rem', color: '#FF9800', fontWeight: '600' }}>
                  {gif.category}
                </span>
                <span style={{ fontSize: '0.75rem', color: '#999', fontFamily: 'monospace' }}>
                  {gif.path.split('/').pop()}
                </span>
              </div>
            </div>
          ))}
        </div>

        {filteredGIFs.length === 0 && (
          <div style={{
            background: 'white',
            borderRadius: '16px',
            padding: '60px',
            textAlign: 'center',
            boxShadow: '0 10px 30px rgba(0,0,0,0.2)'
          }}>
            <div style={{ fontSize: '4rem', marginBottom: '20px' }}>🔍</div>
            <h3 style={{ fontSize: '1.5rem', color: '#666', marginBottom: '10px' }}>
              No GIFs found
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
            📝 How to Use Animated GIFs
          </h3>

          <div style={{ marginBottom: '25px' }}>
            <h4 style={{ color: '#FF9800', marginBottom: '10px' }}>Next.js Image Component (Important!):</h4>
            <pre style={{
              background: '#f5f5f5',
              padding: '15px',
              borderRadius: '8px',
              overflow: 'auto',
              fontSize: '0.9rem'
            }}>
{`import Image from 'next/image';

<Image 
  src="/pics/conductor.gif" 
  alt="Conductor animation"
  width={200}
  height={200}
  unoptimized  // Required for GIF animation!
/>`}
            </pre>
            <p style={{ marginTop: '10px', color: '#666', fontSize: '0.9rem' }}>
              ⚠️ <strong>Important:</strong> Add <code>unoptimized</code> prop to preserve GIF animation
            </p>
          </div>

          <div style={{ marginBottom: '25px' }}>
            <h4 style={{ color: '#FF9800', marginBottom: '10px' }}>Standard HTML img tag:</h4>
            <pre style={{
              background: '#f5f5f5',
              padding: '15px',
              borderRadius: '8px',
              overflow: 'auto',
              fontSize: '0.9rem'
            }}>
{`<img src="/pics/metronome_ani.gif" alt="Metronome animation" />`}
            </pre>
          </div>

          <div>
            <h4 style={{ color: '#FF9800', marginBottom: '10px' }}>CSS Background:</h4>
            <pre style={{
              background: '#f5f5f5',
              padding: '15px',
              borderRadius: '8px',
              overflow: 'auto',
              fontSize: '0.9rem'
            }}>
{`.animated-bg {
  background-image: url('/pics/lead.gif');
  background-size: cover;
  background-repeat: no-repeat;
}`}
            </pre>
          </div>
        </div>

        {/* Info Box */}
        <div style={{
          background: 'rgba(255,255,255,0.95)',
          borderRadius: '16px',
          padding: '25px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
          borderLeft: '4px solid #FF9800'
        }}>
          <h4 style={{ color: '#FF9800', marginBottom: '15px', fontSize: '1.2rem' }}>
            ℹ️ About GIF Format
          </h4>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '15px' }}>
            <div>
              <strong style={{ color: '#333' }}>✅ Pros:</strong>
              <ul style={{ lineHeight: '1.8', color: '#666', marginTop: '5px' }}>
                <li>Universal browser support</li>
                <li>No JavaScript required</li>
                <li>Auto-loops by default</li>
                <li>Supports transparency</li>
              </ul>
            </div>
            <div>
              <strong style={{ color: '#333' }}>⚠️ Considerations:</strong>
              <ul style={{ lineHeight: '1.8', color: '#666', marginTop: '5px' }}>
                <li>Larger file sizes than video</li>
                <li>Limited to 256 colors</li>
                <li>No audio support</li>
                <li>Cannot pause/play easily</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

