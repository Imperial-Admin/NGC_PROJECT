"use client";
import React, { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation'; 
import { ArrowLeft, Crown, ShieldCheck, Gem, Landmark } from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';
import confetti from 'canvas-confetti';

interface Sovereign {
  id: number;
  name: string;
  image_url: string;
  price_paid: number;
}

interface Tribute {
  id: number;
  name: string;
  location?: string;
  message?: string;
}

function HistoryContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [sovereigns, setSovereigns] = useState<Sovereign[]>([]);
  const [tributes, setTributes] = useState<Tribute[]>([]);
  const [loading, setLoading] = useState(true);

  // הזהב המלכותי שלך - ללא שינוי
  const imperialGold = `linear-gradient(110deg, #2a1a05 0%, #7a5210 25%, #b38f4a 45%, #e6c68b 50%, #b38f4a 55%, #7a5210 75%, #2a1a05 100%)`;

  // --- אפקט הניצחון: ללא שינוי לוגי ---
  useEffect(() => {
    if (searchParams.get('success') === 'true') {
      const audio = new Audio('/victory.mp3'); 
      audio.volume = 0.6;
      audio.play().catch(() => console.log("User interaction required for audio"));

      const end = Date.now() + 5 * 1000;
      const colors = ['#b38f4a', '#e6c68b', '#ffffff', '#7a5210'];

      (function frame() {
        confetti({
          particleCount: 4,
          angle: 60,
          spread: 60,
          origin: { x: 0, y: 0.6 },
          colors: colors
        });
        confetti({
          particleCount: 4,
          angle: 120,
          spread: 60,
          origin: { x: 1, y: 0.6 },
          colors: colors
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      }());
    }
  }, [searchParams]);

  // --- שליפת נתונים: ללא שינוי לוגי ---
  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const { data: sovData } = await supabase.from('sovereigns').select('*').order('created_at', { ascending: false });
        const { data: tribData } = await supabase.from('tributes').select('*').order('created_at', { ascending: false });
        if (sovData) setSovereigns(sovData);
        if (tribData) setTributes(tribData);
      } catch (err) {
        console.error("Archive Access Error:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  return (
    <main className="min-h-screen w-full bg-[#050505] text-white font-serif p-8 md:px-24 md:py-16 relative overflow-hidden">
      
      {/* רקע שכבות עמוק */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-gradient-to-b from-[#b38f4a]/10 to-transparent blur-[120px] pointer-events-none opacity-40" />
      <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: "url('/bg.jpg')", backgroundSize: 'cover', backgroundPosition: 'center', filter: 'grayscale(100%)' }}></div>

      {/* כפתור חזרה מעוצב */}
      <button 
        onClick={() => router.push('/')}
        className="group fixed top-10 left-10 flex items-center gap-4 text-[#b38f4a] z-50 px-6 py-3 border border-[#b38f4a]/20 bg-black/60 backdrop-blur-xl hover:border-[#b38f4a] transition-all duration-500 shadow-2xl"
      >
        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
        <span className="text-[9px] tracking-[0.5em] uppercase font-black">Return to Throne</span>
      </button>

      {/* כותרת מוקטנת ויוקרתית */}
      <header className="relative mb-32 text-center pt-12">
        <div className="flex justify-center mb-8">
          <div className="p-4 border border-[#b38f4a]/20 rounded-full">
            <Crown size={32} strokeWidth={1} className="text-[#e6c68b] animate-pulse" />
          </div>
        </div>
        <h1 className="text-3xl md:text-5xl font-black italic tracking-[0.4em] bg-clip-text text-transparent uppercase py-2 leading-tight" style={{ backgroundImage: imperialGold }}>
          The Imperial Archives
        </h1>
        <div className="flex items-center justify-center gap-6 mt-10 opacity-60">
          <div className="h-[1px] w-16 bg-gradient-to-r from-transparent to-[#b38f4a]"></div>
          <span className="text-[8px] tracking-[0.8em] uppercase text-[#e6c68b] font-bold">Chronicles of Succession</span>
          <div className="h-[1px] w-16 bg-gradient-to-l from-transparent to-[#b38f4a]"></div>
        </div>
      </header>

      {/* סקשן השליטים - עיצוב גלריה */}
      <section className="max-w-7xl mx-auto mb-48">
        <div className="flex items-center justify-center gap-6 mb-20">
          <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-[#b38f4a]/20 to-[#b38f4a]/40"></div>
          <div className="flex items-center gap-4 px-6">
            <ShieldCheck className="text-[#b38f4a]" size={18} strokeWidth={1.5} />
            <h2 className="text-[12px] tracking-[0.7em] uppercase text-[#e6c68b] font-bold pl-[0.7em]">The Sovereign Lineage</h2>
          </div>
          <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent via-[#b38f4a]/20 to-[#b38f4a]/40"></div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 md:gap-16">
          {loading ? (
             [...Array(3)].map((_, i) => <div key={i} className="aspect-[4/5] bg-white/5 animate-pulse border border-[#b38f4a]/10" />)
          ) : sovereigns.map((sov, index) => (
            <div key={sov.id} className={`group relative bg-[#080808] border border-[#b38f4a]/30 p-6 transition-all duration-700 hover:border-[#e6c68b]/60 ${index === 0 ? 'ring-1 ring-[#b38f4a]/50 shadow-[0_0_60px_rgba(179,143,74,0.1)]' : ''}`}>
              <div className="relative overflow-hidden aspect-[4/5] mb-8 shadow-2xl">
                <img src={sov.image_url} alt={sov.name} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#080808] via-transparent to-transparent opacity-80" />
                {index === 0 && (
                  <div className="absolute top-0 left-0 w-full py-2 bg-[#b38f4a] text-black text-center text-[8px] font-black tracking-[0.4em] uppercase shadow-xl">
                    Current Ruler
                  </div>
                )}
              </div>
              <div className="text-center">
                <h3 className="text-lg tracking-[0.4em] uppercase mb-3 font-black text-white group-hover:text-[#e6c68b] transition-colors">{sov.name}</h3>
                <div className="h-[1px] w-8 bg-[#b38f4a]/40 mx-auto mb-4" />
                <p className="text-[9px] text-[#b38f4a] tracking-[0.3em] uppercase opacity-80 font-bold">Contribution: {sov.price_paid} Gold</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* סקשן התומכים - עיצוב לוחיות זיכרון */}
      <section className="max-w-5xl mx-auto pb-24">
        <div className="flex items-center justify-center gap-6 mb-20">
          <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-[#b38f4a]/10 to-[#b38f4a]/30"></div>
          <div className="flex items-center gap-4 px-6">
            <Landmark className="text-[#b38f4a]" size={18} strokeWidth={1.5} />
            <h2 className="text-[12px] tracking-[0.7em] uppercase text-[#e6c68b] font-bold pl-[0.7em]">Wall of Allegiance</h2>
          </div>
          <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent via-[#b38f4a]/10 to-[#b38f4a]/30"></div>
        </div>
        
        <div className="flex flex-wrap justify-center gap-6">
          {!loading && tributes.map((trib) => (
            <div key={trib.id} className="relative group overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-b from-[#b38f4a]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative border border-[#b38f4a]/20 bg-black/40 px-10 py-5 backdrop-blur-md group-hover:border-[#e6c68b]/40 transition-all duration-500 text-center min-w-[200px]">
                <p className="text-[10px] tracking-[0.5em] uppercase text-[#e6c68b] mb-2 font-black">{trib.name}</p>
                <p className="text-[7px] tracking-[0.3em] uppercase text-white/40 italic font-medium">{trib.location || "Imperial Territory"}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* חתימה תחתונה */}
      <footer className="text-center mt-24 opacity-20">
         <p className="text-[7px] tracking-[1em] uppercase font-bold text-[#b38f4a]">Immutable Ledger Records</p>
      </footer>
    </main>
  );
}

export default function HistoryPage() {
  return (
    <Suspense fallback={<div className="h-screen bg-black flex items-center justify-center text-[#b38f4a] tracking-[1em] text-[10px] font-black uppercase">Accessing Archives...</div>}>
      <HistoryContent />
    </Suspense>
  );
}