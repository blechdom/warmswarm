'use client';

import { usePathname } from 'next/navigation';
import MainMenu from './MainMenu';

export default function ColorfulLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden" style={{
      background: 'linear-gradient(135deg, #d63384 0%, #d946ef 50%, #dc2626 100%)',
      padding: '20px',
      boxSizing: 'border-box'
    }}>
      {/* Main Navigation Menu */}
      <MainMenu currentPath={pathname} />

      {/* Main Content */}
      <main className="flex-1 relative z-10">
        {children}
      </main>
    </div>
  );
}
