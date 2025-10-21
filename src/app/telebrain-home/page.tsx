'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import TelebrainLayout from '@/components/TelebrainLayout';

export default function TelebrainHome() {
  const [nickname, setNickname] = useState<string | null>(null);

  useEffect(() => {
    const storedNickname = localStorage.getItem('nickname');
    if (storedNickname) {
      setNickname(storedNickname);
    }
  }, []);

  return (
    <TelebrainLayout>
      <div className="hero-bg min-h-[calc(100vh-8rem)] flex items-center justify-center">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <div className="mb-8">
              {/* Logo/Brain icon area */}
              <div className="inline-block p-8 glass-panel rounded-full mb-6">
                <span className="text-8xl">🧠</span>
              </div>
            </div>
            
            <h1 className="text-6xl font-bold mb-4 bg-gradient-to-r from-[#ded5e1] to-white bg-clip-text text-transparent">
              WARMSWARM
            </h1>
            
            {nickname && (
              <p className="text-xl text-[#a0a0a0] mb-8">
                Welcome back, <span className="text-[#ded5e1] font-bold">{nickname}</span>
              </p>
            )}
          </div>

          {/* Two-button layout inspired by Telebrain */}
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* PERFORM Button */}
            <Link href="/live">
              <div className="glass-panel p-12 rounded-2xl hover:scale-105 transition-all duration-300 cursor-pointer group">
                <div className="text-center">
                  <div className="text-6xl mb-6 group-hover:scale-110 transition-transform">
                    📢
                  </div>
                  <h2 className="text-4xl font-bold mb-4 group-hover:text-[#ded5e1] transition-colors">
                    PERFORM
                  </h2>
                  <p className="text-[#a0a0a0]">
                    Join a live performance session
                  </p>
                </div>
              </div>
            </Link>

            {/* PROGRAM Button */}
            <Link href="/create">
              <div className="glass-panel p-12 rounded-2xl hover:scale-105 transition-all duration-300 cursor-pointer group">
                <div className="text-center">
                  <div className="text-6xl mb-6 group-hover:scale-110 transition-transform">
                    ⚙️
                  </div>
                  <h2 className="text-4xl font-bold mb-4 group-hover:text-[#ded5e1] transition-colors">
                    PROGRAM
                  </h2>
                  <p className="text-[#a0a0a0]">
                    Create and organize content
                  </p>
                </div>
              </div>
            </Link>
          </div>

          {/* Quick access links */}
          <div className="flex justify-center gap-6 mt-12">
            <Link 
              href="/join" 
              className="px-6 py-3 glass-panel rounded-lg hover:bg-white/10 transition-all"
            >
              Join with Code
            </Link>
            <Link 
              href="/swarms" 
              className="px-6 py-3 glass-panel rounded-lg hover:bg-white/10 transition-all"
            >
              My Swarms
            </Link>
          </div>

          {/* NTP Offset indicator (like Telebrain) */}
          <div className="text-center mt-12 text-sm text-[#606060]">
            <div id="ntp-status" className="inline-flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full icon-pulse"></span>
              <span>System Synchronized</span>
            </div>
          </div>
        </div>
      </div>
    </TelebrainLayout>
  );
}

