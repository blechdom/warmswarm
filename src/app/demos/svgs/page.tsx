'use client';

import Image from 'next/image';
import { useState } from 'react';

export default function SVGsDemo() {
  const [selectedSVG, setSelectedSVG] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showCode, setShowCode] = useState(false);

  // All SVG assets in the project
  const svgs = [
    { name: 'File Icon', path: '/file.svg', category: 'Icons' },
    { name: 'Globe Icon', path: '/globe.svg', category: 'Icons' },
    { name: 'Window Icon', path: '/window.svg', category: 'Icons' },
    { name: 'Next.js Logo', path: '/next.svg', category: 'Logos' },
    { name: 'Vercel Logo', path: '/vercel.svg', category: 'Logos' },
    { name: 'Favicon', path: '/favicon.svg', category: 'Branding' },
  ];

  const filteredSVGs = svgs.filter(svg => 
    svg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    svg.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const categories = Array.from(new Set(svgs.map(svg => svg.category)));

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
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
                🎨 SVG Assets Gallery
              </h1>
              <p style={{ color: '#666', fontSize: '1.1rem' }}>
                {svgs.length} vector graphics available
              </p>
            </div>
            <a
              href="/demos"
              style={{
                padding: '12px 24px',
                background: '#2196F3',
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
              placeholder="Search SVGs by name or category..."
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
              onFocus={(e) => e.target.style.borderColor = '#2196F3'}
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
                background: searchTerm === '' ? '#2196F3' : '#f5f5f5',
                color: searchTerm === '' ? 'white' : '#333',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: '600'
              }}
            >
              All ({svgs.length})
            </button>
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSearchTerm(category)}
                style={{
                  padding: '8px 16px',
                  background: searchTerm === category ? '#2196F3' : '#f5f5f5',
                  color: searchTerm === category ? 'white' : '#333',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontWeight: '600'
                }}
              >
                {category} ({svgs.filter(s => s.category === category).length})
              </button>
            ))}
          </div>
        </div>

        {/* SVG Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
          gap: '20px',
          marginBottom: '30px'
        }}>
          {filteredSVGs.map((svg, index) => (
            <div
              key={index}
              onClick={() => setSelectedSVG(svg.path)}
              style={{
                background: 'white',
                borderRadius: '12px',
                padding: '30px',
                boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                cursor: 'pointer',
                transition: 'all 0.3s',
                textAlign: 'center'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-5px)';
                e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.2)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.1)';
              }}
            >
              {/* SVG Display */}
              <div style={{
                width: '100%',
                height: '120px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '15px',
                background: '#f5f5f5',
                borderRadius: '8px',
                padding: '20px'
              }}>
                <Image
                  src={svg.path}
                  alt={svg.name}
                  width={80}
                  height={80}
                  style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                />
              </div>

              {/* Info */}
              <h3 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '5px', color: '#333' }}>
                {svg.name}
              </h3>
              <p style={{ fontSize: '0.9rem', color: '#2196F3', fontWeight: '500' }}>
                {svg.category}
              </p>
              <p style={{ fontSize: '0.85rem', color: '#999', marginTop: '8px', fontFamily: 'monospace' }}>
                {svg.path}
              </p>
            </div>
          ))}
        </div>

        {filteredSVGs.length === 0 && (
          <div style={{
            background: 'white',
            borderRadius: '16px',
            padding: '60px',
            textAlign: 'center',
            boxShadow: '0 10px 30px rgba(0,0,0,0.2)'
          }}>
            <div style={{ fontSize: '4rem', marginBottom: '20px' }}>🔍</div>
            <h3 style={{ fontSize: '1.5rem', color: '#666', marginBottom: '10px' }}>
              No SVGs found
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
          boxShadow: '0 10px 30px rgba(0,0,0,0.2)'
        }}>
          <h3 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '20px', color: '#333' }}>
            📝 How to Use These SVGs
          </h3>

          <div style={{ marginBottom: '25px' }}>
            <h4 style={{ color: '#2196F3', marginBottom: '10px' }}>Next.js Image Component:</h4>
            <pre style={{
              background: '#f5f5f5',
              padding: '15px',
              borderRadius: '8px',
              overflow: 'auto',
              fontSize: '0.9rem'
            }}>
{`import Image from 'next/image';

<Image 
  src="/globe.svg" 
  alt="Globe icon"
  width={24}
  height={24}
/>`}
            </pre>
          </div>

          <div style={{ marginBottom: '25px' }}>
            <h4 style={{ color: '#2196F3', marginBottom: '10px' }}>Standard HTML img tag:</h4>
            <pre style={{
              background: '#f5f5f5',
              padding: '15px',
              borderRadius: '8px',
              overflow: 'auto',
              fontSize: '0.9rem'
            }}>
{`<img src="/file.svg" alt="File icon" />`}
            </pre>
          </div>

          <div>
            <h4 style={{ color: '#2196F3', marginBottom: '10px' }}>CSS Background:</h4>
            <pre style={{
              background: '#f5f5f5',
              padding: '15px',
              borderRadius: '8px',
              overflow: 'auto',
              fontSize: '0.9rem'
            }}>
{`.icon {
  background-image: url('/window.svg');
  background-size: contain;
  background-repeat: no-repeat;
}`}
            </pre>
          </div>
        </div>

        {/* Info Box */}
        <div style={{
          marginTop: '30px',
          background: 'rgba(255,255,255,0.95)',
          borderRadius: '16px',
          padding: '25px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
          borderLeft: '4px solid #2196F3'
        }}>
          <h4 style={{ color: '#2196F3', marginBottom: '10px', fontSize: '1.2rem' }}>
            ℹ️ About SVG Format
          </h4>
          <ul style={{ lineHeight: '1.8', color: '#666' }}>
            <li><strong>Scalable:</strong> Looks crisp at any size, perfect for responsive design</li>
            <li><strong>Small file size:</strong> Typically smaller than PNG/JPG equivalents</li>
            <li><strong>CSS customizable:</strong> Can change colors, filters, and transforms</li>
            <li><strong>Accessibility:</strong> Can include semantic information for screen readers</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

