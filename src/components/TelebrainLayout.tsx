'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

export default function TelebrainLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Telebrain-style header */}
      <header className="bg-[#1a1a1a] border-b border-[#404040] sticky top-0 z-50">
        <nav className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Brand/Logo */}
            <div className="relative">
              <button 
                onClick={() => setMenuOpen(!menuOpen)}
                className="text-xl font-bold hover:text-[#ded5e1] transition-colors"
              >
                warmswarm
              </button>
              
              {menuOpen && (
                <div className="absolute top-full left-0 mt-2 w-64 glass-panel rounded-lg shadow-xl max-h-[80vh] overflow-y-auto">
                  <Link href="/" className="block px-4 py-3 hover:bg-white/10 transition-colors border-b border-[#404040]">
                    <span className="mr-2">🏠</span> Home
                  </Link>
                  <Link href="/telebrain" className="block px-4 py-3 hover:bg-white/10 transition-colors border-b border-[#404040] bg-[#ded5e1]/10">
                    <span className="mr-2">📋</span> <strong>All Views</strong>
                  </Link>
                  <Link href="/create" className="block px-4 py-3 hover:bg-white/10 transition-colors border-b border-[#404040]">
                    <span className="mr-2">⚙️</span> Program
                  </Link>
                  <Link href="/live" className="block px-4 py-3 hover:bg-white/10 transition-colors border-b border-[#404040]">
                    <span className="mr-2">📢</span> Perform
                  </Link>
                  <Link href="/swarms" className="block px-4 py-3 hover:bg-white/10 transition-colors">
                    <span className="mr-2">🕸️</span> My Swarms
                  </Link>
                </div>
              )}
            </div>

            {/* Center navigation icons */}
            <div className="flex items-center space-x-6">
              <Link 
                href="/create" 
                className="nav-link text-2xl"
                title="Program"
              >
                ⚙️
              </Link>
              <Link 
                href="/live" 
                className="nav-link text-2xl"
                title="Perform"
              >
                📢
              </Link>
            </div>

            {/* Right side controls */}
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => setAudioEnabled(!audioEnabled)}
                className="text-2xl hover:text-red-500 transition-colors"
                title={audioEnabled ? 'Mute Audio' : 'Unmute Audio'}
              >
                {audioEnabled ? '🔊' : '🔇'}
              </button>
              <button 
                className="text-2xl nav-link"
                title="Information"
              >
                ℹ️
              </button>
            </div>
          </div>
        </nav>
      </header>

      {/* Main content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-[#1a1a1a] border-t border-[#404040] py-4">
        <div className="container mx-auto px-4 text-center text-sm text-[#a0a0a0]">
          <p>WarmSwarm · Multi-Player Performance Platform</p>
        </div>
      </footer>
    </div>
  );
}

