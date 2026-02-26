// @ts-nocheck
'use client';
import React, { useState, useEffect, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Youtube, Facebook, Instagram, Twitter, MessageCircle } from 'lucide-react';

function LiveContent() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  
  const imperialGold = `linear-gradient(110deg, #2a1a05 0%, #7a5210 25%, #b38f4a 45%, #e6c68b 50%, #b38f4a 55%, #7a5210 75%, #2a1a05 100%)`;

  useEffect(() => {
    setMounted(true);
  }, []);

  const socialLinks = [
    { name: 'YouTube', icon: <Youtube size={24} />, url: 'https://youtube.com/@yourchannel' },
    { name: 'TikTok', icon: <MessageCircle size={24} />, url: 'https://tiktok.com/@yourprofile' },
    { name: 'Instagram', icon: <Instagram size={24} />, url: 'https://instagram.com/yourprofile' },
    { name: 'Facebook', icon: <Facebook size={24} />, url: 'https://facebook.com/yourpage' },
    { name: 'X / Twitter', icon: <Twitter size={24} />, url: 'https://x.com/yourhandle' },
  ];

  if (!mounted) return null;

  return (
    <main className="h-screen w-full bg-black text-white flex flex-col items-center justify-center overflow-hidden font-serif relative select-none">
      <div className="absolute inset-0 z-0" style={{ backgroundImage: "url('/bg.jpg')", backgroundSize: 'cover', filter: 'brightness(0.15) grayscale(100%)' }}></div>
      
      <nav className="absolute top-10 left-10 z-50">
        <button onClick={() => router.push('/')} className="flex items-center gap-2 text-[#b38f4a]/40 hover:text-[#e6c68b] transition-all duration-700">
          <ArrowLeft size={12} strokeWidth={1} />
          <span className="text-[8px] tracking-[0.5em] uppercase font-bold">Back</span>
        </button>
      </nav>

      <div className="relative z-10 flex flex-col items-center max-w-5xl w-full px-6 text-center">
        <header className="mb-12">
          <h1 className="text-3xl md:text-5xl tracking-[0.4em] uppercase font-black bg-clip-text text-transparent" style={{ backgroundImage: imperialGold }}>
            Live Broadcasts
          </h1>
          <p className="text-[9px] tracking-[0.6em] uppercase text-[#b38f4a] mt-4 font-light italic">Select your preferred imperial transmission</p>
        </header>

        <div className="grid grid-cols-5 gap-4 w-full max-w-4xl mx-auto">
          {socialLinks.map((link) => (
            <a 
              key={link.name}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative flex flex-col items-center justify-center aspect-square border border-[#b38f4a]/20 bg-black/40 backdrop-blur-md rounded-sm transition-all duration-500 hover:border-[#b38f4a] hover:bg-[#b38f4a]/5 p-2"
            >
              <div className="text-[#b38f4a] group-hover:text-[#e6c68b] transition-colors duration-500 mb-3 transform group-hover:scale-110 transition-transform">
                {link.icon}
              </div>
              <span className="text-[7px] tracking-[0.2em] uppercase font-bold text-[#b38f4a]/60 group-hover:text-white transition-colors">
                {link.name}
              </span>
              <div className="absolute top-0 right-0 w-1.5 h-1.5 border-t border-r border-[#b38f4a]/30"></div>
              <div className="absolute bottom-0 left-0 w-1.5 h-1.5 border-b border-l border-[#b38f4a]/30"></div>
            </a>
          ))}
        </div>

        <footer className="mt-16 opacity-20">
            <p className="text-[6px] tracking-[1.5em] uppercase font-bold text-[#b38f4a]">Global Signal Synchronized</p>
        </footer>
      </div>
    </main>
  );
}

export default function DesktopLive() {
  return (
    <Suspense fallback={null}>
      <LiveContent />
    </Suspense>
  );
}