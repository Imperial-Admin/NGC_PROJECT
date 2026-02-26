// @ts-nocheck
'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Youtube, Facebook, Instagram, Twitter, MessageCircle } from 'lucide-react';

export default function MobileLive() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const imperialGold = `linear-gradient(110deg, #2a1a05 0%, #7a5210 25%, #b38f4a 45%, #e6c68b 50%, #b38f4a 55%, #7a5210 75%, #2a1a05 100%)`;

  useEffect(() => { setMounted(true); }, []);

  const socialLinks = [
    { name: 'YouTube', icon: <Youtube size={18} />, url: 'https://youtube.com/@yourchannel' },
    { name: 'TikTok', icon: <MessageCircle size={18} />, url: 'https://tiktok.com/@yourprofile' },
    { name: 'Instagram', icon: <Instagram size={18} />, url: 'https://instagram.com/yourprofile' },
    { name: 'Facebook', icon: <Facebook size={18} />, url: 'https://facebook.com/yourpage' },
    { name: 'X / Twitter', icon: <Twitter size={18} />, url: 'https://x.com/yourhandle' },
  ];

  if (!mounted) return null;

  return (
    <main className="h-screen w-full bg-black text-white flex flex-col items-center overflow-hidden font-serif relative p-6 pt-10 pb-6">
      {/* רקע */}
      <div className="absolute inset-0 z-0" style={{ backgroundImage: "url('/bg.jpg')", backgroundSize: 'cover', filter: 'brightness(0.12) grayscale(100%)' }}></div>
      
      {/* כפתור חזרה */}
      <nav className="w-full z-50 flex justify-start mb-4">
        <button onClick={() => router.push('/')} className="flex items-center gap-2 text-[#b38f4a]/60 active:scale-90 transition-transform outline-none">
          <ArrowLeft size={14} />
          <span className="text-[9px] tracking-[0.3em] uppercase font-bold">Back</span>
        </button>
      </nav>

      <div className="relative z-10 flex-1 flex flex-col items-center justify-between w-full max-w-sm">
        
        {/* כותרת */}
        <header className="text-center">
          <h1 className="text-3xl tracking-[0.2em] uppercase font-black bg-clip-text text-transparent" style={{ backgroundImage: imperialGold }}>
            Live Broadcasts
          </h1>
          <p className="text-[8px] tracking-[0.4em] uppercase text-[#b38f4a] mt-2 font-light italic leading-relaxed">
            Select your preferred <br/> imperial transmission
          </p>
        </header>

        {/* רשימת כפתורים לרוחב הדף - ללא גלילה */}
        <div className="flex flex-col gap-3 w-full px-2 my-auto">
          {socialLinks.map((link) => (
            <a 
              key={link.name}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="relative flex items-center justify-between w-full py-4 px-6 border border-[#b38f4a]/20 bg-black/60 backdrop-blur-xl rounded-sm active:bg-[#b38f4a]/10 transition-all group"
            >
              <div className="flex items-center gap-4">
                <div className="text-[#b38f4a] group-active:text-[#e6c68b] transition-colors duration-300">
                  {link.icon}
                </div>
                <span className="text-[9px] tracking-[0.2em] uppercase font-bold text-[#b38f4a]/80 group-active:text-white transition-colors">
                  {link.name}
                </span>
              </div>
              
              {/* מסגרת דקורטיבית בפינות של כל כפתור */}
              <div className="absolute top-0 right-0 w-1.5 h-1.5 border-t border-r border-[#b38f4a]/40"></div>
              <div className="absolute bottom-0 left-0 w-1.5 h-1.5 border-b border-l border-[#b38f4a]/40"></div>
              
              {/* חץ קטן בצד ימין */}
              <div className="text-[#b38f4a]/20 group-active:text-[#b38f4a] transition-colors">
                 <ArrowLeft size={10} className="rotate-180" />
              </div>
            </a>
          ))}
        </div>

        {/* פוטר */}
        <footer className="opacity-30 text-center">
            <p className="text-[6px] tracking-[1em] uppercase font-bold text-[#b38f4a]">Global Signal Synchronized</p>
        </footer>
      </div>
    </main>
  );
}