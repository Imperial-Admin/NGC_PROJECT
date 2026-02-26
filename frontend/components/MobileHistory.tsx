// @ts-nocheck
"use client";
import React, { useEffect, useState, Suspense, useCallback, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation'; 
import { ArrowLeft, Crown, Share2, MessageCircle, X } from 'lucide-react';
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
    } catch (err: any) { console.error("Vault Error:", err); }
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
        confetti({ particleCount: 3, angle: 60, spread: 55, origin: { x: 0, y: 0.8 }, colors });
        confetti({ particleCount: 3, angle: 120, spread: 55, origin: { x: 1, y: 0.8 }, colors });
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
    const channel = supabase.channel('mobile-history-sync')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'sovereigns' }, () => fetchData())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'heart_wall' }, () => fetchData())
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [mounted, fetchData]);

  if (!mounted) return null;

  return (
    <main className="min-h-screen w-full bg-black text-white font-serif relative overflow-x-hidden">
      <div className="fixed top-0 left-0 w-full h-[200px] bg-gradient-to-b from-[#b38f4a]/20 to-transparent pointer-events-none z-0" />
      <nav className="sticky top-0 z-[60] bg-black/80 backdrop-blur-md border-b border-[#b38f4a]/10 p-4 flex flex-col gap-4">
        <div className="flex justify-between items-center w-full">
            <button onClick={() => router.push('/')} className="text-[#b38f4a] p-1"><ArrowLeft size={18} /></button>
            <h2 className="text-[10px] tracking-[0.4em] uppercase font-black text-[#e6c68b]">Archives</h2>
            <div className="w-6" />
        </div>
        <div className="flex justify-center gap-6">
          <button onClick={() => setView('sovereigns')} className={`text-[9px] tracking-[0.2em] uppercase font-bold transition-all ${view === 'sovereigns' ? 'text-[#e6c68b] border-b-2 border-[#e6c68b] pb-1' : 'text-[#b38f4a]/40'}`}>Sovereigns</button>
          <button onClick={() => setView('tributes')} className={`text-[9px] tracking-[0.2em] uppercase font-bold transition-all ${view === 'tributes' ? 'text-[#e6c68b] border-b-2 border-[#e6c68b] pb-1' : 'text-[#b38f4a]/40'}`}>HEART WALL</button>
        </div>
      </nav>

      <div className="p-4 relative z-10">
        <header className="py-6 text-center">
            <h1 className="text-2xl tracking-[0.3em] uppercase font-black text-transparent bg-clip-text bg-gradient-to-b from-[#f3e3ad] to-[#b38f4a]">
                {view === 'sovereigns' ? 'THE ARCHIVES' : <><span style={{ color: '#FF0000' }}>HEART</span> WALL</>}
            </h1>
        </header>

        {view === 'sovereigns' ? (
          <div className="grid grid-cols-2 gap-3 mt-4">
            {sovereigns.map((sov, index) => (
              <React.Fragment key={sov.id}>
                {index === 0 && (
                  <div className="col-span-2 mb-4">
                    <div className="relative h-10 bg-[#4a0404] border border-[#b38f4a] shadow-[0_0_20px_rgba(74,4,4,0.5)] flex items-center justify-center overflow-hidden rounded-[2px]">
                      <div className="absolute inset-0.5 border border-[#e6c68b]/20"></div>
                      <span className="relative text-[#e6c68b] text-[9px] tracking-[0.4em] uppercase font-black drop-shadow-md">IMPERIAL SOVEREIGN</span>
                    </div>
                  </div>
                )}
                <div className="relative">
                    <div className="relative aspect-[4/5] border border-[#b38f4a]/30 bg-[#050505] rounded-[8px] overflow-hidden shadow-xl">
                        <div className="absolute top-2 right-2 z-30 px-2 py-1 bg-black/60 border border-[#b38f4a]/30 rounded-sm">
                            <span className="text-[#e6c68b] text-[8px] font-mono font-black tracking-tighter">${(sov.price_paid || 0).toLocaleString()}</span>
                        </div>
                        {sov.image_url ? <img src={getImageUrl(sov.image_url)} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center"><Crown size={20} className="text-[#b38f4a]/20" /></div>}
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />
                        <div className="absolute bottom-2 left-2 right-2">
                            <h3 className="text-[9px] uppercase font-black text-white truncate">{sov.name}</h3>
                        </div>
                    </div>
                </div>
              </React.Fragment>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-2 mt-2">
            {tributes.map((trib) => (
                <div key={trib.id} id={`tribute-${trib.id}`} className={`relative aspect-[3/4] bg-[#050505] border rounded-[8px] flex flex-col items-center p-2 pt-10 transition-all ${searchParams.get('tributeId') === trib.id.toString() ? 'royal-glow-mobile border-[#e6c68b] z-40' : 'border-[#b38f4a]/30'}`}>
                    <div className="absolute top-2 left-2"><img src="/heart.png" className="w-[18px] h-[18px] object-contain" /></div>
                    <h3 className="text-[11px] tracking-widest uppercase font-black text-white text-center break-words w-full px-1 leading-tight">{trib.name}</h3>
                    <div className="absolute bottom-2 w-full text-center"><p className="text-[11px] tracking-widest uppercase text-[#b38f4a]/60 font-bold truncate px-2">{trib.location || "LEDGER"}</p></div>
                </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

export default function MobileHistory() {
  return (
    <Suspense fallback={null}>
      <HistoryContent />
    </Suspense>
  );
}