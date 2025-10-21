'use client';

import Link from 'next/link';
import ColorfulLayout from './ColorfulLayout';

interface PlaceholderViewProps {
  title: string;
  description: string;
  icon: string;
  features?: string[];
  parentId?: string;
  originalRoute?: string;
}

export default function PlaceholderView({
  title,
  description,
  icon,
  features = [],
  parentId,
  originalRoute
}: PlaceholderViewProps) {
  return (
    <ColorfulLayout>
      <div className="flex flex-col items-center max-w-4xl mx-auto w-full">
        {/* Main Card */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.95)',
          borderRadius: '20px',
          padding: '40px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
          transition: 'all 0.225s ease',
          width: '100%'
        }}>
          <div className="text-center mb-8">
            <div className="text-8xl mb-6">{icon}</div>
            <h1 className="text-5xl font-bold mb-4 text-gray-800">
              {title}
            </h1>
            <p className="text-xl text-gray-600 mb-6">
              {description}
            </p>
            <div style={{
              display: 'inline-block',
              padding: '10px 20px',
              background: 'rgba(255, 193, 7, 0.2)',
              border: '2px solid #ffc107',
              borderRadius: '10px',
              fontWeight: 'bold',
              color: '#f57c00'
            }}>
              🚧 Coming Soon
            </div>
          </div>

          {features.length > 0 && (
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-4 text-gray-800">Planned Features</h2>
              <div className="grid md:grid-cols-2 gap-4">
                {features.map((feature, idx) => (
                  <div key={idx} style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '12px',
                    padding: '15px',
                    borderRadius: '10px',
                    background: 'rgba(46, 204, 113, 0.1)',
                    border: '1px solid rgba(46, 204, 113, 0.3)'
                  }}>
                    <span style={{ color: '#2ecc71', fontWeight: 'bold' }}>✓</span>
                    <span style={{ color: '#333' }}>{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {originalRoute && (
            <div style={{
              marginBottom: '30px',
              padding: '15px',
              borderRadius: '10px',
              background: 'rgba(102, 126, 234, 0.1)',
              border: '1px solid rgba(102, 126, 234, 0.3)'
            }}>
              <h3 className="text-sm font-bold mb-2" style={{ color: '#667eea' }}>
                Original Telebrain Route
              </h3>
              <code style={{
                fontSize: '0.9rem',
                color: '#333',
                fontFamily: 'monospace',
                wordBreak: 'break-all'
              }}>
                {originalRoute}
              </code>
              {parentId && (
                <p style={{ fontSize: '0.8rem', color: '#666', marginTop: '8px' }}>
                  Parent ID: {parentId}
                </p>
              )}
            </div>
          )}

          <div className="flex gap-4 justify-center flex-wrap">
            <Link
              href="/telebrain"
              style={{
                padding: '12px 24px',
                background: 'rgba(102, 126, 234, 0.1)',
                border: '1px solid #667eea',
                borderRadius: '25px',
                color: '#667eea',
                fontWeight: '600',
                textDecoration: 'none',
                transition: 'all 0.225s ease'
              }}
              className="hover:bg-[#667eea] hover:text-white"
            >
              ← All Views
            </Link>
            <Link
              href="/"
              style={{
                padding: '12px 24px',
                background: '#ff6b6b',
                border: 'none',
                borderRadius: '25px',
                color: 'white',
                fontWeight: '600',
                textDecoration: 'none',
                transition: 'all 0.225s ease'
              }}
              className="hover:bg-[#ff5252]"
            >
              Home
            </Link>
          </div>
        </div>
      </div>
    </ColorfulLayout>
  );
}

