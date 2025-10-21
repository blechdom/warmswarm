'use client';

import Link from 'next/link';
import ColorfulLayout from '@/components/ColorfulLayout';

const views = [
  {
    category: "🏠 Core Pages",
    items: [
      { name: "Home", path: "/", icon: "🏠" },
      { name: "Login", path: "/telebrain/login", icon: "🔐" },
      { name: "About", path: "/telebrain/about", icon: "📋" },
      { name: "Instructions", path: "/telebrain/instructions", icon: "📖" },
      { name: "Tutorial", path: "/telebrain/tutorial", icon: "🎓" },
    ]
  },
  {
    category: "🎭 Performance",
    items: [
      { name: "Performance Setup", path: "/telebrain/performance", icon: "📢" },
      { name: "Live Performance", path: "/telebrain/perform", icon: "🎪" },
    ]
  },
  {
    category: "🎵 Audio Content",
    items: [
      { name: "Audio URLs", path: "/telebrain/audio-urls", icon: "🔗" },
      { name: "Audio Uploads", path: "/telebrain/audio-uploads", icon: "⬆️" },
      { name: "Text-to-Speech", path: "/telebrain/tts", icon: "🗣️" },
    ]
  },
  {
    category: "🖼️ Visual Content",
    items: [
      { name: "Image URLs", path: "/telebrain/image-urls", icon: "🔗" },
      { name: "Image Uploads", path: "/telebrain/image-uploads", icon: "⬆️" },
      { name: "Teleprompts", path: "/telebrain/teleprompts", icon: "📝" },
    ]
  },
  {
    category: "📦 Collections",
    items: [
      { name: "Audio-Image Pairs", path: "/telebrain/audio-image-pairs", icon: "🎵🖼️" },
      { name: "Image Phrases", path: "/telebrain/image-phrases", icon: "🖼️📝" },
      { name: "Audio Sentences", path: "/telebrain/audio-sentences", icon: "🎵📝" },
      { name: "Content Collections", path: "/telebrain/collections", icon: "📚" },
    ]
  },
  {
    category: "🎼 Programs",
    items: [
      { name: "Programs", path: "/telebrain/programs", icon: "🎼" },
      { name: "Interfaces", path: "/telebrain/interfaces", icon: "🖥️" },
      { name: "Multi-roles", path: "/telebrain/multiroles", icon: "👥" },
      { name: "Fragments", path: "/telebrain/fragments", icon: "🧩" },
    ]
  },
  {
    category: "⏱️ Timing & Algorithms",
    items: [
      { name: "Timers", path: "/telebrain/timers", icon: "⏱️" },
      { name: "Metronomes", path: "/telebrain/metronomes", icon: "🥁" },
      { name: "Timed Organization", path: "/telebrain/timed-org", icon: "📅" },
      { name: "Scheduler", path: "/telebrain/scheduler", icon: "🗓️" },
    ]
  },
  {
    category: "👥 User Management",
    items: [
      { name: "My Brains", path: "/telebrain/my-brains", icon: "🧠" },
      { name: "Roles", path: "/telebrain/roles", icon: "🎭" },
      { name: "Networks", path: "/telebrain/networks", icon: "🕸️" },
    ]
  },
  {
    category: "🧪 Development",
    items: [
      { name: "OSC Tester", path: "/telebrain/osc-test", icon: "🔬" },
      { name: "Database", path: "/telebrain/database", icon: "💾" },
    ]
  }
];

export default function TelebrainIndex() {
  return (
    <ColorfulLayout>
      <div className="flex flex-col items-center max-w-7xl mx-auto w-full">
        {/* Header Card */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.95)',
          borderRadius: '20px',
          padding: '30px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
          width: '100%',
          marginBottom: '20px',
          textAlign: 'center'
        }}>
          <h1 className="text-5xl font-bold mb-3" style={{ color: '#333' }}>
            All Views
          </h1>
          <p className="text-lg" style={{ color: '#666' }}>
            Complete implementation of all Telebrain page views
          </p>
        </div>

        {/* Views Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 w-full">
          {views.map((section, idx) => (
            <div key={idx} style={{
              background: 'rgba(255, 255, 255, 0.95)',
              borderRadius: '20px',
              padding: '25px',
              boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
              transition: 'all 0.225s ease'
            }}
            className="hover:shadow-[0_15px_40px_rgba(0,0,0,0.3)] hover:-translate-y-1">
              <h2 className="text-xl font-bold mb-4" style={{ color: '#333' }}>
                {section.category}
              </h2>
              <div className="space-y-2">
                {section.items.map((item, itemIdx) => (
                  <Link
                    key={itemIdx}
                    href={item.path}
                    style={{
                      display: 'block',
                      padding: '10px 12px',
                      borderRadius: '10px',
                      transition: 'all 0.225s ease',
                      textDecoration: 'none',
                      color: '#333'
                    }}
                    className="hover:bg-gray-100"
                  >
                    <span className="text-xl mr-2">{item.icon}</span>
                    <span style={{ fontSize: '0.95rem' }}>{item.name}</span>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Back Button */}
        <div className="mt-6">
          <Link 
            href="/"
            style={{
              display: 'inline-block',
              padding: '12px 30px',
              background: '#ff6b6b',
              color: 'white',
              borderRadius: '25px',
              textDecoration: 'none',
              fontWeight: '600',
              transition: 'all 0.225s ease',
              boxShadow: '0 5px 15px rgba(0,0,0,0.2)'
            }}
            className="hover:bg-[#ff5252] hover:-translate-y-1"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </ColorfulLayout>
  );
}

