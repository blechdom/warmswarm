'use client';

export default function DemosIndex() {
  const demos = [
    {
      title: '🔊 Text-to-Speech Demo',
      description: 'Test browser-based text-to-speech with different voices, rates, pitch, and volume controls. Includes 40+ voices across multiple languages.',
      path: '/tts-demo',
      color: '#4CAF50',
      icon: '🎤'
    },
    {
      title: '💬 TTS Chat Demo',
      description: 'See TTS in action! Interactive chat interface with voice selection and read-aloud functionality. Shows how to integrate TTS into your chat app.',
      path: '/tts-chat-demo',
      color: '#8BC34A',
      icon: '💬'
    },
    {
      title: '📦 Media Browser',
      description: 'Browse thousands of React icons from 8 icon libraries (Font Awesome, Material Design, Ionicons, etc.) plus animated Lottie files. Search and copy code instantly.',
      path: '/media-browser',
      color: '#9C27B0',
      icon: '📦'
    },
    {
      title: '🎯 Icon Browser',
      description: 'Comprehensive React icon library browser with real-time search across Font Awesome, Material Design, Bootstrap, Heroicons, and more.',
      path: '/icon-browser',
      color: '#00BCD4',
      icon: '🎯'
    },
    {
      title: '🎨 SVG Assets Gallery',
      description: 'Browse all SVG images available in the project. Includes icons, logos, and vector graphics.',
      path: '/demos/svgs',
      color: '#2196F3',
      icon: '🖼️'
    },
    {
      title: '✨ Animated GIFs Showcase',
      description: 'View all animated GIF assets including metronomes, conductors, and action animations.',
      path: '/demos/gifs',
      color: '#FF9800',
      icon: '🎬'
    },
    {
      title: '😊 Emoji Showcase',
      description: 'Comprehensive emoji catalog organized by category. Perfect for adding expressive elements to your UI.',
      path: '/demos/emojis',
      color: '#E91E63',
      icon: '🎭'
    }
  ];

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '40px 20px',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        {/* Header */}
        <div style={{
          textAlign: 'center',
          marginBottom: '60px',
          color: 'white'
        }}>
          <h1 style={{
            fontSize: '3.5rem',
            fontWeight: '800',
            marginBottom: '15px',
            textShadow: '0 2px 10px rgba(0,0,0,0.2)'
          }}>
            🚀 WarmSwarm Demos
          </h1>
          <p style={{
            fontSize: '1.3rem',
            opacity: 0.95,
            maxWidth: '700px',
            margin: '0 auto'
          }}>
            {demos.length} interactive demonstrations of browser APIs, assets, and features
          </p>
        </div>

        {/* Demo Cards Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '30px',
          marginBottom: '50px'
        }}>
          {demos.map((demo, index) => (
            <a
              key={index}
              href={demo.path}
              style={{
                textDecoration: 'none',
                display: 'block',
                background: 'white',
                borderRadius: '16px',
                padding: '30px',
                boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                cursor: 'pointer',
                position: 'relative',
                overflow: 'hidden'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-8px)';
                e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.2)';
              }}
            >
              {/* Color accent bar */}
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '4px',
                background: demo.color
              }} />

              {/* Icon */}
              <div style={{
                fontSize: '4rem',
                marginBottom: '20px',
                textAlign: 'center'
              }}>
                {demo.icon}
              </div>

              {/* Content */}
              <h2 style={{
                fontSize: '1.5rem',
                fontWeight: '700',
                marginBottom: '15px',
                color: '#333'
              }}>
                {demo.title}
              </h2>
              <p style={{
                fontSize: '1rem',
                lineHeight: '1.6',
                color: '#666',
                marginBottom: '20px'
              }}>
                {demo.description}
              </p>

              {/* CTA */}
              <div style={{
                display: 'inline-block',
                padding: '10px 20px',
                background: demo.color,
                color: 'white',
                borderRadius: '8px',
                fontWeight: '600',
                fontSize: '0.95rem'
              }}>
                Explore Demo →
              </div>
            </a>
          ))}
        </div>

        {/* Info Section */}
        <div style={{
          background: 'rgba(255,255,255,0.95)',
          borderRadius: '16px',
          padding: '40px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.2)'
        }}>
          <h3 style={{
            fontSize: '1.8rem',
            fontWeight: '700',
            marginBottom: '20px',
            color: '#333'
          }}>
            ℹ️ About These Demos
          </h3>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '30px',
            marginTop: '30px'
          }}>
            <div>
              <h4 style={{ color: '#4CAF50', marginBottom: '10px', fontSize: '1.2rem' }}>
                🌐 Browser APIs
              </h4>
              <p style={{ color: '#666', lineHeight: '1.6' }}>
                Explore powerful browser features like text-to-speech, geolocation, 
                and WebRTC that work across desktop and mobile devices.
              </p>
            </div>
            <div>
              <h4 style={{ color: '#2196F3', marginBottom: '10px', fontSize: '1.2rem' }}>
                🎨 Asset Library
              </h4>
              <p style={{ color: '#666', lineHeight: '1.6' }}>
                Browse the complete collection of visual assets including thousands of React icons, 
                SVGs, animated GIFs, Lottie animations, and emojis.
              </p>
            </div>
            <div>
              <h4 style={{ color: '#FF9800', marginBottom: '10px', fontSize: '1.2rem' }}>
                📱 Mobile-First
              </h4>
              <p style={{ color: '#666', lineHeight: '1.6' }}>
                All demos are responsive and optimized for mobile devices, 
                tablets, and desktop browsers.
              </p>
            </div>
            <div>
              <h4 style={{ color: '#E91E63', marginBottom: '10px', fontSize: '1.2rem' }}>
                🚀 Interactive
              </h4>
              <p style={{ color: '#666', lineHeight: '1.6' }}>
                Each demo is fully interactive, allowing you to test features 
                in real-time with various settings and configurations.
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div style={{
          textAlign: 'center',
          marginTop: '50px'
        }}>
          <a
            href="/"
            style={{
              color: 'white',
              fontSize: '1.1rem',
              textDecoration: 'none',
              padding: '12px 30px',
              background: 'rgba(255,255,255,0.2)',
              borderRadius: '8px',
              display: 'inline-block',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,255,255,0.3)',
              fontWeight: '600'
            }}
          >
            ← Back to Home
          </a>
        </div>

        {/* Footer */}
        <div style={{
          textAlign: 'center',
          marginTop: '40px',
          color: 'rgba(255,255,255,0.8)',
          fontSize: '0.9rem'
        }}>
          <p>Built with Next.js • WarmSwarm Project</p>
        </div>
      </div>
    </div>
  );
}

