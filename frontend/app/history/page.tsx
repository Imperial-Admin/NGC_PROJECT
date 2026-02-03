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

  const imperialGold = `linear-gradient(110deg, #2a1a05 0%, #7a5210 25%, #b38f4a 45%, #e6c68b 50%, #b38f4a 55%, #7a5210 75%, #2a1a05 100%)`;

  // --- לוגיקה מקורית וזיקוקים: ללא שום שינוי ---
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
    fetch()
    fetchData();
  }, []);

  return (
    <main className="min-h-screen w-full bg-[#000] text-white font-serif p-8 md:px-24 md:py-12 relative overflow-hidden">
      
      {/* רקע שכבות עמוק וסימטרי */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[300px] bg-[#b38f4a]/5 blur-[120px] pointer-events-none opacity-30" />

      {/* כפתור חזרה - יישור מהודק */}
      <button 
        onClick={() => router.push('/')}
        className="group fixed top-10 left-10 flex items-center gap-3 text-[#b38f4a]/50 z-50 hover:text-[#e6c68b] transition-all duration-500"
      >
        <ArrowLeft size={16} strokeWidth={1} />
        <span className="text-[9px] tracking-[0.6em] uppercase font-bold">The Throne</span>
      </button>

      {/* כותרת מוגדלת ורווחים מצומצמים */}
      <header className="relative mb-24 text-center pt-16">
        <Crown size={24} strokeWidth={1} className="text-[#b38f4a]/40 mx-auto mb-6" />
        <h1 className="text-xl md:text-2xl tracking-[1.2em] uppercase font-black pl-[1.2em] text-[#e6c68b] drop-shadow-sm">
          The Imperial Archives
        </h1>
        <div className="h-[1px] w-16 bg-gradient-to-r from-transparent via-[#b38f4a]/30 to-transparent mx-auto mt-8"></div>
      </header>

      {/* סקשן השליטים - מרווחים מהודקים */}
      <section className="max-w-6xl mx-auto mb-32">
        <div className="flex flex-col items-center mb-16">
          <h2 className="text-[11px] tracking-[0.8em] uppercase text-[#b38f4a]/70 font-bold mb-3 pl-[0.8em]">The Sovereign Lineage</h2>
          <div className="h-[1px] w-24 bg-[#b38f4a]/10"></div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">
          {loading ? (
             [...Array(3)].map((_, i) => <div key={i} className="aspect-[4/5] bg-white/[0.02] border border-[#b38f4a]/5 animate-pulse" />)
          ) : sovereigns.map((sov, index) => (
            <div key={sov.id} className="group relative flex flex-col items-center">
              <div className="relative overflow-hidden aspect-[4/5] w-full border border-[#b38f4a]/20 group-hover:border-[#b38f4a]/60 transition-all duration-1000 bg-[#050505] shadow-2xl">
                <img src={sov.image_url} alt={sov.name} className="w-full h-full object-cover grayscale opacity-50 group-hover:opacity-100 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-1000" />
                {index === 0 && (
                  <div className="absolute top-0 right-0 px-4 py-1.5 bg-[#b38f4a] text-[#000] text-[7px] tracking-[0.3em] uppercase font-black shadow-lg">
                    Current
                  </div>
                )}
              </div>
              <div className="mt-6 text-center">
                <h3 className="text-[12px] tracking-[0.4em] uppercase font-black text-white mb-2 group-hover:text-[#e6c68b] transition-colors">{sov.name}</h3>
                <p className="text-[8px] text-[#b38f4a]/60 tracking-[0.2em] uppercase font-bold italic">{sov.price_paid} Gold Contribution</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* סקשן התומכים - לוחיות סימטריות מהודקות */}
      <section className="max-w-5xl mx-auto pb-24 border-t border-[#b38f4a]/5 pt-20">
        <div className="flex flex-col items-center mb-16">
          <h2 className="text-[11px] tracking-[0.8em] uppercase text-[#b38f4a]/70 font-bold mb-3 pl-[0.8em]">The Wall of Allegiance</h2>
        </div>
        
        <div className="flex flex-wrap justify-center gap-x-12 gap-y-8">
          {!loading && tributes.map((trib) => (
            <div key={trib.id} className="text-center group min-w-[140px]">
              <p className="text-[11px] tracking-[0.5em] uppercase text-[#e6c68b]/80 group-hover:text-[#e6c68b] transition-all duration-500 font-black mb-1.5">{trib.name}</p>
              <p className="text-[7px] tracking-[0.3em] uppercase text-white/20 italic font-medium">{trib.location || "Imperial Territory"}</p>
            </div>
          ))}
        </div>
      </section>

      {/* חתימה סופית */}
      <footer className="text-center opacity-20 py-16">
         <p className="text-[7px] tracking-[1.2em] uppercase font-bold text-[#b38f4a] pl-[1.2em]">Immutable Ledger</p>
      </footer>
    </main>
  );
}

export default function HistoryPage() {
  return (
    <Suspense fallback={<div className="h-screen bg-black flex items-center justify-center text-[#b38f4a] tracking-[1.5em] text-[10px] font-black uppercase">Syncing...</div>}>
      <HistoryContent />
    </Suspense>
  );
}