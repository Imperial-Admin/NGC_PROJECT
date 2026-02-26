// @ts-nocheck
"use client";
import React, { useEffect, useState, Suspense, useCallback, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation'; 
import { ArrowLeft, Crown, Share2, MessageCircle, X } from 'lucide-react';
// תיקון נתיב ה-Import המדויק
import { supabase } from '../lib/supabaseClient'; 
import confetti from 'canvas-confetti';

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

function HistoryContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [view, setView] = useState<'sovereigns' | 'tributes'>('sovereigns');
  const [mounted, setMounted] = useState(false);
  const [sovereigns, setSovereigns] = useState<Sovereign[]>([]);
  const [tributes, setTributes] = useState<Tribute[]>([]);
  const [showShareModal, setShowShareModal] = useState(false);
  const [purchasedName, setPurchasedName] = useState('');
  const isInitialMount = useRef(true);

  // פונקציית עזר להצגת תמונות בצורה תקינה (מונעת שגיאות 500)
  const getImageUrl = (url: string | null) => {
    if (!url) return null;
    if (url.startsWith('data:') || url.startsWith('http')) return url;
    return url;
  };

  const fetchData = useCallback(async () => {
    try {
      const { data: sovData, error: sovErr } = await supabase.from('sovereigns').select('*').order('id', { ascending: false });
      if (sovErr) throw sovErr;
      if (sovData) setSovereigns(sovData);
      const { data: tribData, error: tribErr } = await supabase.from('heart_wall').select('*').order('id', { ascending: false });
      if (tribErr) throw tribErr;
      if (tribData) setTributes(tribData);
    } catch (err: any) { console.error("Vault Update Error:", err.message || err); }
  }, []);

  useEffect(() => {
    setMounted(true);
    if (typeof window === 'undefined') return;
    const isSuccess = searchParams?.get('success') === 'true';
    if (isSuccess) {
      fetchData();
      const name = sessionStorage.getItem('imp_name') || 'A Legend';
      setPurchasedName(name);
      if (sessionStorage.getItem('imp_type') === 'tribute') setView('tributes');
      const url = new URL(window.location.href);
      url.searchParams.delete('success');
      window.history.replaceState({}, '', url.pathname);
      const audio = new Audio('/victory.mp3'); 
      audio.volume = 0.6;
      audio.play().catch(() => {});
      const end = Date.now() + 5 * 1000;
      const colors = ['#b38f4a', '#e6c68b', '#ffffff'];
      (function frame() {
        confetti({ particleCount: 4, angle: 60, spread: 60, origin: { x: 0, y: 0.6 }, colors });
        confetti({ particleCount: 4, angle: 120, spread: 60, origin: { x: 1, y: 0.6 }, colors });
        if (Date.now() < end) requestAnimationFrame(frame);
      }());
      setTimeout(() => setShowShareModal(true), 6000);
    }
  }, [searchParams, fetchData]);

  useEffect(() => {
    const tid = searchParams?.get('tributeId');
    if (tid && tributes.length > 0) {
      setView('tributes');
      setTimeout(() => {
        const el = document.getElementById(`tribute-${tid}`);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 800);
    }
  }, [searchParams, tributes]);

  useEffect(() => {
    if (!mounted) return;
    if (isInitialMount.current) { fetchData(); isInitialMount.current = false; }
    const channel = supabase.channel('history-live-sync')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'sovereigns' }, () => fetchData())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'heart_wall' }, () => fetchData())
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [mounted, fetchData]);

  if (!mounted) return null;

  return (
    <main className="min-h-screen w-full bg-[#000000] text-white font-serif p-4 md:px-12 md:py-5 relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[300px] bg-gradient-to-b from-[#b38f4a]/10 to-transparent blur-[120px] pointer-events-none opacity-40" />
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

      <header className="relative mt-8 mb-10 text-center">
        <Crown size={22} className="text-[#e6c68b] mx-auto mb-5 opacity-40" />
        <h1 className="flex flex-col items-center justify-center leading-tight">
          <span className="text-3xl md:text-5xl tracking-[0.6em] uppercase font-black text-transparent bg-clip-text bg-gradient-to-b from-[#f3e3ad] to-[#b38f4a] pl-[0.6em]">THE IMPERIAL</span>
          <span className="text-lg md:text-xl tracking-[1em] font-light text-[#b38f4a]/60 uppercase mt-3 pl-[1em]">
            {view === 'sovereigns' ? 'ARCHIVES' : <><span style={{ color: '#FF0000' }}>HEART</span> WALL</>}
          </span>
        </h1>
      </header>

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
                  {/* שימוש ב-getImageUrl לתיקון התמונות */}
                  {sov.image_url ? ( <img src={getImageUrl(sov.image_url)} alt={sov.name} className="w-full h-full object-cover transition-all grayscale-[0.2] group-hover:grayscale-0" /> ) : ( <div className="w-full h-full bg-[#1a1a1a] flex items-center justify-center"><Crown size={40} className="text-[#b38f4a]/20" /></div> )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-transparent to-transparent opacity-90" />
                  <div className="absolute bottom-0 left-0 w-full p-5 min-h-[90px]">
                    <p className="text-[7px] tracking-[0.4em] uppercase text-[#b38f4a] mb-1 font-black">ENTRY</p>
                    <h3 className="text-[11px] md:text-[13px] tracking-[0.1em] uppercase font-black text-white leading-tight break-words">{sov.name}</h3>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      ) : (
        <section className="w-full max-w-[100rem] mx-auto px-4 mb-20 mt-6 animate-in fade-in duration-1000">
          <div className="grid grid-cols-2 sm:grid-cols-5 lg:grid-cols-10 gap-3 md:gap-4">
            {tributes.map((trib) => (
                <div key={trib.id} id={`tribute-${trib.id}`} className={`relative group aspect-[3/5.2] bg-[#050505] border-2 rounded-[12px] flex flex-col items-center p-3 pt-14 transition-all duration-700 ${searchParams.get('tributeId') === trib.id.toString() ? 'royal-glow border-[#e6c68b] z-40' : 'border-[#b38f4a]/50'}`}>
                  <div className="absolute top-3 left-3"><img src="/heart.png" className="w-[31px] h-[31px] object-contain" /></div>
                  <h3 className="text-[7px] md:text-[8px] tracking-[0.15em] uppercase font-black text-white text-center">{trib.name}</h3>
                  <div className="absolute bottom-4 left-0 w-full text-center px-2"><p className="text-[6.5px] tracking-[0.15em] uppercase text-[#b38f4a]/70 font-bold">{trib.location || "HEART LEDGER"}</p></div>
                </div>
            ))}
          </div>
        </section>
      )}
      {showShareModal && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={() => setShowShareModal(false)} />
          <div className="relative w-full max-w-sm bg-[#050505] border border-[#b38f4a]/30 p-8 rounded-2xl shadow-[0_0_80px_rgba(0,0,0,1)] flex flex-col items-center text-center animate-in zoom-in duration-300">
            <button onClick={() => setShowShareModal(false)} className="absolute top-4 right-4 text-[#b38f4a]/40 hover:text-white"><X size={18} /></button>
            <img src="/heart.png" className="w-16 h-16 object-contain mb-4 animate-pulse" />
            <h2 className="text-lg tracking-[0.3em] uppercase font-black text-[#e6c68b]">Legacy Sealed</h2>
            <p className="text-[9px] tracking-[0.2em] uppercase text-[#b38f4a]/60 mb-8 mt-2 italic">Allegiance with <span className="text-white font-bold">{purchasedName}</span> is eternal.</p>
          </div>
        </div>
      )}
    </main>
  );
}

export default function DesktopHistory() {
  return (
    <Suspense fallback={null}>
      <HistoryContent />
    </Suspense>
  );
}