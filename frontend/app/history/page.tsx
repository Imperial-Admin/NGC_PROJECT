"use client";
import React, { useEffect, useState } from 'react';
// עדכון ייבוא: הוספנו את useSearchParams
import { useRouter, useSearchParams } from 'next/navigation'; 
import { ArrowLeft, Crown, ShieldCheck, Gem } from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';
// ייבוא ספריית הזיקוקים
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

export default function HistoryPage() {
  const router = useRouter();
  // הפעלת החיישן שבודק את כתובת ה-URL
  const searchParams = useSearchParams();
  const [sovereigns, setSovereigns] = useState<Sovereign[]>([]);
  const [tributes, setTributes] = useState<Tribute[]>([]);
  const [loading, setLoading] = useState(true);

  const imperialGold = `linear-gradient(110deg, #2a1a05 0%, #7a5210 25%, #b38f4a 45%, #e6c68b 50%, #b38f4a 55%, #7a5210 75%, #2a1a05 100%)`;

  // אפקט להפעלת הזיקוקים ברגע שהדף נטען עם הפרמטר הנכון
  useEffect(() => {
    if (searchParams.get('success') === 'true') {
      const end = Date.now() + 5 * 1000; // חגיגה של 5 שניות
      const colors = ['#b38f4a', '#e6c68b', '#ffffff', '#7a5210'];

      (function frame() {
        confetti({
          particleCount: 3,
          angle: 60,
          spread: 55,
          origin: { x: 0, y: 0.6 },
          colors: colors
        });
        confetti({
          particleCount: 3,
          angle: 120,
          spread: 55,
          origin: { x: 1, y: 0.6 },
          colors: colors
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      }());
    }
  }, [searchParams]);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const { data: sovData } = await supabase.from('sovereigns').select('*').order('created_at', { ascending: false });
        const { data: tribData } = await supabase.from('tributes').select('*').order('created_at', { ascending: false });
        if (sovData) setSovereigns(sovData);
        if (tribData) setTributes(tribData);
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  return (
    <main className="min-h-screen w-full bg-[#050505] text-white font-serif p-8 md:p-24 relative overflow-hidden">
      {/* אלמנטים עיצוביים ברקע */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-[#b38f4a]/5 blur-[120px] pointer-events-none" />
      
      {/* כפתור חזרה מעוצב */}
      <button 
        onClick={() => router.push('/')}
        className="group fixed top-12 left-12 flex items-center gap-3 text-[#b38f4a]/60 hover:text-[#e6c68b] transition-all z-50 px-4 py-2 border border-[#b38f4a]/10 hover:border-[#b38f4a]/40 bg-black/40 backdrop-blur-md"
      >
        <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
        <span className="text-[10px] tracking-[0.5em] uppercase font-bold">Return to Throne</span>
      </button>

      {/* כותרת ענקית */}
      <header className="relative mb-32 text-center">
        <div className="flex justify-center mb-6 text-[#b38f4a]">
          <Crown size={40} strokeWidth={1} className="animate-pulse" />
        </div>
        <h1 className="text-5xl md:text-8xl font-black italic tracking-[0.2em] bg-clip-text text-transparent uppercase py-2" style={{ backgroundImage: imperialGold }}>
          The Imperial Archives
        </h1>
        <div className="flex items-center justify-center gap-4 mt-8 opacity-40">
          <div className="h-[1px] w-24 bg-gradient-to-r from-transparent to-[#b38f4a]"></div>
          <span className="text-[10px] tracking-[0.6em] uppercase text-[#b38f4a]">Established 2026</span>
          <div className="h-[1px] w-24 bg-gradient-to-l from-transparent to-[#b38f4a]"></div>
        </div>
      </header>

      {/* סקשן הריבונים - עיצוב כרטיסיות */}
      <section className="max-w-7xl mx-auto mb-40">
        <div className="flex items-center gap-4 mb-16 border-b border-[#b38f4a]/10 pb-6">
          <ShieldCheck className="text-[#b38f4a]" size={20} />
          <h2 className="text-[14px] tracking-[0.8em] uppercase text-white/80 font-bold">The Sovereign Lineage</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16">
          {loading ? (
             [...Array(3)].map((_, i) => <div key={i} className="h-96 bg-white/5 animate-pulse border border-[#b38f4a]/10" />)
          ) : sovereigns.map((sov, index) => (
            <div key={sov.id} className={`group relative bg-black border border-[#b38f4a]/20 p-4 transition-all duration-700 hover:border-[#b38f4a]/60 ${index === 0 ? 'scale-105 shadow-[0_0_50px_rgba(179,143,74,0.15)]' : ''}`}>
              <div className="relative overflow-hidden aspect-[4/5] mb-6">
                <img src={sov.image_url} alt={sov.name} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60" />
                {index === 0 && (
                  <div className="absolute top-4 right-4 bg-[#b38f4a] text-black px-3 py-1 text-[8px] font-black tracking-widest uppercase">Current Ruler</div>
                )}
              </div>
              <h3 className="text-xl tracking-[0.3em] uppercase mb-2 font-bold text-white group-hover:text-[#e6c68b] transition-colors">{sov.name}</h3>
              <p className="text-[10px] text-[#b38f4a] tracking-[0.4em] uppercase opacity-70 italic font-medium">Sacrificed {sov.price_paid} Gold</p>
            </div>
          ))}
        </div>
      </section>

      {/* סקשן קיר הנאמנות - עיצוב הלבבות */}
      <section className="max-w-7xl mx-auto">
        <div className="flex items-center gap-4 mb-16 border-b border-[#b38f4a]/10 pb-6">
          <Gem className="text-[#b38f4a]" size={20} />
          <h2 className="text-[14px] tracking-[0.8em] uppercase text-white/80 font-bold">The Wall of Allegiance</h2>
        </div>
        
        <div className="flex flex-wrap justify-center gap-8">
          {!loading && tributes.map((trib) => (
            <div key={trib.id} className="relative group cursor-default">
              <div className="absolute inset-0 bg-[#b38f4a]/10 blur-md opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative border border-[#b38f4a]/30 bg-black/40 px-8 py-4 backdrop-blur-sm group-hover:border-[#b38f4a] transition-all">
                <p className="text-[11px] tracking-[0.4em] uppercase text-[#e6c68b] mb-1 font-bold">{trib.name}</p>
                <div className="h-[1px] w-full bg-[#b38f4a]/20 mb-2" />
                <p className="text-[8px] tracking-[0.2em] uppercase text-white/40 italic">{trib.location || "Imperial Territory"}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}