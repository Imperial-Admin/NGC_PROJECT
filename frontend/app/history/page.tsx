"use client";

import React, { useEffect, useState, Suspense, useCallback, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation'; 
import { ArrowLeft, Crown } from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';
import confetti from 'canvas-confetti';

// --- Interfaces ---
interface Sovereign {
  id: number;
  name: string;
  image_url: string | null;
  price_paid: number;
  subtitle?: string; 
}

interface Tribute {
  id: number;
  name: string;
  location?: string;
}

/**
 * HistoryContent Component
 * מנהל את תצוגת הארכיון המלכותי וקיר הלבבות
 */
function HistoryContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [view, setView] = useState<'sovereigns' | 'tributes'>('sovereigns');
  const [mounted, setMounted] = useState(false);

  // State עבור נתונים מה-Database
  const [sovereigns, setSovereigns] = useState<Sovereign[]>([]);
  const [tributes, setTributes] = useState<Tribute[]>([]);
  
  // מגן מפני רינדורים כפולים שגורמים לשגיאות Hooks
  const isInitialMount = useRef(true);

  /**
   * שליפת נתונים מלאה מה-Database
   * משתמש ב-select('*') כדי להבטיח משיכה מלאה של כל העמודות
   */
  const fetchData = useCallback(async () => {
    try {
      console.log("--- 📥 Accessing Imperial Vault ---");
      
      // שליפת קיסרים - ללא הגבלה כי מחקנו את התמונות הכבדות
      const { data: sovData, error: sovErr } = await supabase
        .from('sovereigns')
        .select('*')
        .order('id', { ascending: false });
      
      if (sovErr) throw sovErr;
      if (sovData) {
        setSovereigns(sovData);
        console.log("✅ Sovereigns Loaded:", sovData.length);
      }
      
      // שליפת נתוני קיר הלבבות
      const { data: tribData, error: tribErr } = await supabase
        .from('heart_wall')
        .select('*')
        .order('id', { ascending: false });

      if (tribErr) throw tribErr;
      if (tribData) setTributes(tribData);

    } catch (err: any) { 
      console.error("Vault Update Error:", err.message || err); 
    }
  }, []);

  /**
   * אפקט לניהול הצלחת תשלום, קונפטי וסאונד
   */
  useEffect(() => {
    setMounted(true);
    if (typeof window === 'undefined') return;
    
    const isSuccess = searchParams?.get('success') === 'true';
    
    if (isSuccess) {
      if (sessionStorage.getItem('imp_type') === 'tribute') {
        setView('tributes');
      }

      const url = new URL(window.location.href);
      url.searchParams.delete('success');
      window.history.replaceState({}, '', url.pathname);

      // הפעלת סאונד ניצחון
      const audio = new Audio('/victory.mp3'); 
      audio.volume = 0.6;
      audio.play().catch(() => {});

      // חגיגת קונפטי מלכותית
      const end = Date.now() + 5 * 1000;
      const colors = ['#b38f4a', '#e6c68b', '#ffffff'];

      (function frame() {
        confetti({ particleCount: 4, angle: 60, spread: 60, origin: { x: 0, y: 0.6 }, colors });
        confetti({ particleCount: 4, angle: 120, spread: 60, origin: { x: 1, y: 0.6 }, colors });
        if (Date.now() < end) requestAnimationFrame(frame);
      }());
    }
  }, [searchParams]);

  /**
   * אפקט לטעינה ראשונית וסנכרון Realtime מלא
   */
  useEffect(() => {
    if (!mounted) return;
    
    if (isInitialMount.current) {
      fetchData();
      isInitialMount.current = false;
    }

    const channel = supabase.channel('history-live-sync')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'sovereigns' }, () => fetchData())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'heart_wall' }, () => fetchData())
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [mounted, fetchData]);

  if (!mounted) return null;

  return (
    <main className="min-h-screen w-full bg-[#000000] text-white font-serif p-4 md:px-12 md:py-5 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[300px] bg-gradient-to-b from-[#b38f4a]/10 to-transparent blur-[120px] pointer-events-none opacity-40" />

      {/* Navigation Layer */}
      <nav className="fixed top-10 left-10 right-10 flex justify-between items-center z-50">
        <button onClick={() => router.push('/')} className="flex items-center gap-2 text-[#b38f4a]/40 hover:text-[#e6c68b] transition-all duration-700">
          <ArrowLeft size={12} strokeWidth={1} />
          <span className="text-[8px] tracking-[0.5em] uppercase font-bold">Back</span>
        </button>
        <div className="flex gap-8">
          <button onClick={() => setView('sovereigns')} className={`text-[8px] tracking-[0.4em] uppercase font-bold transition-all ${view === 'sovereigns' ? 'text-[#e6c68b] border-b border-[#e6c68b] pb-1' : 'text-[#b38f4a]/40'}`}>Sovereigns</button>
          <button onClick={() => setView('tributes')} className={`text-[8px] tracking-[0.4em] uppercase font-bold transition-all ${view === 'tributes' ? 'text-[#e6c68b] border-b border-[#e6c68b] pb-1' : 'text-[#b38f4a]/40'}`}>HEART WALL</button>
        </div>
      </nav>

      {/* Main Header */}
      <header className="relative mt-8 mb-10 text-center">
        <Crown size={22} className="text-[#e6c68b] mx-auto mb-5 opacity-40" />
        <h1 className="flex flex-col items-center justify-center leading-tight">
          <span className="text-3xl md:text-5xl tracking-[0.6em] uppercase font-black text-transparent bg-clip-text bg-gradient-to-b from-[#f3e3ad] to-[#b38f4a] pl-[0.6em]">THE IMPERIAL</span>
          <span className="text-lg md:text-xl tracking-[1em] font-light text-[#b38f4a]/60 uppercase mt-3 pl-[1em]">
            {view === 'sovereigns' ? 'ARCHIVES' : <><span style={{ color: '#FF0000' }}>HEART</span> WALL</>}
          </span>
        </h1>
      </header>

      {/* Content Section: Sovereigns */}
      {view === 'sovereigns' ? (
        <section className="max-w-[95rem] mx-auto px-6 mb-16 mt-20">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 md:gap-8 items-end">
            {sovereigns.map((sov, index) => (
              <div key={sov.id} className="group relative">
                {index === 0 && (
                  <div className="absolute -top-[68px] left-0 right-0 z-20">
                    <div className="relative h-12 bg-[#4a0404] border-[3px] border-[#b38f4a] shadow-[0_15px_40px_rgba(0,0,0,0.9)] flex items-center justify-center overflow-hidden rounded-[2px]">
                      <div className="absolute inset-1 border border-[#e6c68b]/30"></div>
                      <span className="relative text-[#e6c68b] text-[9px] tracking-[0.45em] uppercase font-black text-center px-4 drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]">IMPERIAL SOVEREIGN</span>
                    </div>
                  </div>
                )}
                <div className="relative aspect-[4/5] overflow-hidden border-2 border-[#b38f4a]/50 bg-[#050505] rounded-[12px] shadow-2xl transition-all duration-1000 group-hover:border-[#e6c68b]">
                  <div className="absolute top-3 right-3 z-30 px-5 py-1.5 backdrop-blur-md bg-black/40 border border-[#b38f4a]/40 rounded-sm flex items-center justify-center min-w-[100px]">
                    <span className="text-[#e6c68b] text-[10px] md:text-[11px] font-mono font-black tracking-widest">${(sov.price_paid || 0).toLocaleString('en-US')}</span>
                  </div>
                  {sov.image_url ? (
                    <img src={sov.image_url} alt={sov.name} className="w-full h-full object-cover transition-all duration-1000 grayscale-[0.2] group-hover:grayscale-0 group-hover:scale-105" />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-[#1a1a1a] to-[#000] flex items-center justify-center">
                      <Crown size={40} className="text-[#b38f4a]/20" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-transparent to-transparent opacity-90" />
                  <div className="absolute bottom-0 left-0 w-full p-5 flex flex-col justify-end min-h-[90px]">
                    <p className="text-[7px] tracking-[0.4em] uppercase text-[#b38f4a] mb-1 font-black">ENTRY</p>
                    <h3 className="text-[11px] md:text-[13px] tracking-[0.1em] uppercase font-black text-white leading-tight break-words">{sov.name}</h3>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      ) : (
        /* Content Section: Heart Wall */
        <section className="w-full max-w-[100rem] mx-auto px-4 mb-20 mt-6 animate-in fade-in duration-1000">
          <div className="grid grid-cols-2 sm:grid-cols-5 lg:grid-cols-10 gap-3 md:gap-4">
            {tributes.map((trib) => (
                <div key={trib.id} className="relative group">
                  <div className="relative aspect-[3/5.2] bg-[#050505] border-2 border-[#b38f4a]/50 rounded-[12px] flex flex-col items-center justify-start p-3 pt-14 transition-all duration-700 group-hover:border-[#e6c68b] overflow-hidden">
                    <div className="absolute top-3 left-3 z-20"><img src="/heart.png" alt="Heart" className="w-[31px] h-[31px] object-contain transition-transform group-hover:scale-110" /></div>
                    <div className="absolute -bottom-2 -right-2 opacity-10 rotate-12"><Crown size={50} className="text-[#b38f4a]" /></div>
                    <div className="text-center w-full z-10 px-1 mt-2">
                      <h3 className="text-[7px] md:text-[8px] tracking-[0.15em] uppercase font-black text-white leading-tight break-words">{trib.name.split(' ')[0]}</h3>
                      <h4 className="text-[6.5px] md:text-[7px] tracking-[0.1em] uppercase font-medium text-white/80 mt-0.5 break-words">{trib.name.split(' ').slice(1).join(' ')}</h4>
                    </div>
                    <div className="absolute bottom-4 left-0 w-full text-center z-10 px-2"><div className="w-8 h-[1px] bg-[#b38f4a]/30 mx-auto mb-1"></div><p className="text-[6.5px] tracking-[0.15em] uppercase text-[#b38f4a]/70 font-bold break-words">{trib.location || "HEART LEDGER"}</p></div>
                  </div>
                </div>
            ))}
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="text-center opacity-10 py-12"><p className="text-[6px] tracking-[2em] uppercase font-bold text-[#b38f4a] pl-[2em]">IMMUTABLE LEDGER</p></footer>
      <style jsx global>{` @keyframes shimmer { 100% { transform: translateX(100%); } } `}</style>
    </main>
  );
}

export default function HistoryPage() {
  return (
    <Suspense fallback={<div className="h-screen bg-black flex items-center justify-center text-[#b38f4a]/40 tracking-[2em] text-[10px] uppercase">Loading Archives...</div>}>
      <HistoryContent />
    </Suspense>
  );
}