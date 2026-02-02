"use client";
import React from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';

export default function HistoryPage() {
  const router = useRouter();

  // צבע הזהב הקיסרי ששומר על הקו העיצובי של דף הבית
  const imperialGold = `linear-gradient(110deg, #2a1a05 0%, #7a5210 25%, #b38f4a 45%, #e6c68b 50%, #b38f4a 55%, #7a5210 75%, #2a1a05 100%)`;

  return (
    <main className="min-h-screen w-full bg-black text-white font-serif p-8 md:p-20 relative overflow-hidden">
      {/* כפתור חזרה לכס המלוכה */}
      <button 
        onClick={() => router.push('/')}
        className="absolute top-10 left-10 flex items-center gap-2 text-[#b38f4a] hover:text-white transition-all uppercase text-[10px] tracking-[0.4em] font-bold z-50"
      >
        <ArrowLeft size={16} /> Return to Throne
      </button>

      {/* כותרת הדף */}
      <header className="mt-20 mb-16 text-center">
        <h1 className="text-4xl md:text-6xl font-black italic tracking-[0.3em] bg-clip-text text-transparent uppercase mb-4" style={{ backgroundImage: imperialGold }}>
          The Imperial Archives
        </h1>
        <div className="h-[1px] w-24 bg-[#b38f4a] mx-auto opacity-50"></div>
        <p className="mt-6 text-[10px] md:text-xs tracking-[0.5em] uppercase text-[#b38f4a] opacity-70 italic">
          Every ascension, every allegiance. Secured for eternity.
        </p>
      </header>

      {/* אזור הריבונים - ההיסטוריה של CLAIM THE THRONE */}
      <section className="max-w-6xl mx-auto mb-24">
        <h2 className="text-[12px] tracking-[0.6em] uppercase text-white/40 mb-10 border-b border-[#b38f4a]/10 pb-4 font-bold">The Sovereign Lineage</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* מקום לתמונות מה-Database שיוצגו כאן בהמשך */}
          <div className="border border-[#b38f4a]/20 p-8 text-center bg-white/5 opacity-30 italic text-[10px] tracking-widest uppercase">
            Awaiting records...
          </div>
        </div>
      </section>

      {/* קיר הלבבות - ההיסטוריה של TRIBUTES */}
      <section className="max-w-6xl mx-auto">
        <h2 className="text-[12px] tracking-[0.6em] uppercase text-white/40 mb-10 border-b border-[#b38f4a]/10 pb-4 font-bold">The Wall of Allegiance</h2>
        <div className="flex flex-wrap gap-6 opacity-30 italic text-[10px] tracking-widest uppercase">
          Awaiting tributes...
        </div>
      </section>
    </main>
  );
}