// @ts-nocheck
'use client';
import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Crown, Heart } from 'lucide-react';

export default function MobileBroadcast() {
  const [currentSovereign, setCurrentSovereign] = useState(null);
  const [heartWall, setHeartWall] = useState([]);
  const [buyersCount, setBuyersCount] = useState(0);
  const [onlineViewers, setOnlineViewers] = useState(125836);
  const [likes, setLikes] = useState(756567); 
  const canvasRef = useRef(null);
  
  const imperialGold = `linear-gradient(110deg, #2a1a05 0%, #7a5210 25%, #b38f4a 45%, #e6c68b 50%, #b38f4a 55%, #7a5210 75%, #2a1a05 100%)`;
  const nextPrice = Math.round(10 * Math.pow(1.1, buyersCount)).toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });

  useEffect(() => {
    const fetchData = async () => {
      const { data: sov } = await supabase.from('sovereigns').select('*').order('id', { ascending: false }).limit(1);
      if (sov && sov[0]) setCurrentSovereign(sov[0]);
      const { count } = await supabase.from('sovereigns').select('*', { count: 'exact', head: true });
      if (count !== null) setBuyersCount(count);
      const { count: lCount } = await supabase.from('likes').select('*', { count: 'exact', head: true });
      if (lCount !== null) setLikes(756567 + lCount);
      const { data: hw } = await supabase.from('heart_wall').select('name').order('id', { ascending: false }).limit(10);
      if (hw) setHeartWall(hw);
    };
    fetchData();

    const interval = setInterval(() => {
        setOnlineViewers(prev => prev + Math.floor(Math.random() * 21) - 10);
    }, 4000);

    const channel = supabase.channel('mobile-br-sync-cinematic').on('postgres_changes', { event: '*', schema: 'public', table: 'sovereigns' }, fetchData).subscribe();
    return () => { supabase.removeChannel(channel); clearInterval(interval); };
  }, []);

  if (!currentSovereign) return <div className="h-screen bg-black flex items-center justify-center text-[#b38f4a] tracking-widest text-[10px] font-serif animate-pulse">INITIALIZING IMPERIAL SIGNAL...</div>;

  return (
    <main className="h-screen w-full bg-[#050505] text-white font-serif relative overflow-hidden">
      
      {/* 1. Full Screen Background Image & Gradients */}
      <div className="absolute inset-0 z-0">
          <img 
            src={currentSovereign.image_url} 
            className="w-full h-full object-cover brightness-[0.85] contrast-[1.15]" 
            alt="Imperial Stream"
          />
          {/* גרדיאנטים עדינים לשיפור קריאות טקסט */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-transparent to-black/90" />
      </div>

      {/* 2. Top Header (Floating) */}
      <header className="absolute top-0 left-0 w-full z-50 p-6 flex justify-between items-start leading-tight">
        <div>
            <h1 className="text-2xl font-black italic tracking-tighter bg-clip-text text-transparent drop-shadow-sm" style={{ backgroundImage: imperialGold }}>NGC LIVE</h1>
            <p className="text-[7px] tracking-[0.3em] uppercase text-[#b38f4a] opacity-80 font-bold">Imperial Transmission</p>
        </div>
        
        {/* Live Stats Pill */}
        <div className="flex flex-col items-end gap-2">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-black/40 backdrop-blur-md border border-[#b38f4a]/20 rounded-full">
                <div className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse shadow-[0_0_10px_red]"></div>
                <span className="text-[9px] font-black text-white/90 uppercase tracking-widest font-mono">{onlineViewers.toLocaleString()} VIEWERS</span>
            </div>
            <div className="flex items-center gap-1.5 pr-2 opacity-80">
                <Heart size={10} className="text-red-500 animate-pulse" />
                <span className="text-[9px] font-mono font-bold text-white">{likes.toLocaleString()}</span>
            </div>
        </div>
      </header>

      {/* 3. Middle Floating Elements */}
      
      {/* Price Box (Left side, floating bottom) */}
      <div className="absolute left-6 bottom-36 z-40 animate-pulse-slow pointer-events-none">
          <div className="bg-black/50 backdrop-blur-lg border-l-2 border-[#b38f4a] pl-4 pr-6 py-3 rounded-r-sm shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
              <p className="text-[7px] tracking-[0.4em] uppercase text-[#b38f4a] mb-1 font-bold opacity-90">To Take The Throne</p>
              <p className="text-2xl font-black text-white font-mono tracking-tighter drop-shadow-md">{nextPrice}</p>
          </div>
      </div>

      {/* Recent Hearts (Right side, floating top) */}
      <div className="absolute right-6 top-28 z-40 flex flex-col items-end gap-3 pointer-events-none">
          <p className="text-[6px] tracking-[0.3em] uppercase text-[#b38f4a] font-black opacity-60 mb-1">Recent Allegiances</p>
          {heartWall.slice(0, 3).map((item, i) => (
              <div key={i} className="flex items-center gap-2 bg-black/40 backdrop-blur-md border border-[#b38f4a]/10 px-3 py-1.5 rounded-sm animate-fade-in-right shadow-lg" style={{ animationDelay: `${i * 0.2}s` }}>
                  <span className="text-[8px] font-bold text-white tracking-widest uppercase">{item.name}</span>
                  <Crown size={10} className="text-[#b38f4a] opacity-80" />
              </div>
          ))}
      </div>

      {/* 4. Bottom Footer (Floating Nameplate) */}
      <footer className="absolute bottom-0 left-0 w-full z-50 p-6 pb-10 flex flex-col items-center text-center">
          {/* Sovereign Name */}
          <h2 className="text-3xl md:text-4xl tracking-[0.2em] uppercase font-black text-white drop-shadow-[0_5px_15px_rgba(0,0,0,0.8)] leading-none mb-3">
              {currentSovereign.name}
          </h2>
          
          {/* Subtle Ticker */}
          <div className="w-full max-w-xs overflow-hidden relative h-5 opacity-70">
                <div className="flex whitespace-nowrap animate-ticker-slow items-center">
                    <span className="text-[#b38f4a] text-[8px] tracking-[0.3em] italic uppercase font-bold mx-4">"{currentSovereign.subtitle}"</span>
                    <span className="text-white/40 text-[6px] mx-2">✦</span>
                    <span className="text-[#b38f4a] text-[8px] tracking-[0.3em] italic uppercase font-bold mx-4">Only The Strongest Rule</span>
                    <span className="text-white/40 text-[6px] mx-2">✦</span>
                </div>
          </div>
      </footer>

      <style jsx>{`
        @keyframes tickerSlow { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        .animate-ticker-slow { animation: tickerSlow 25s linear infinite; }
        @keyframes fadeInR { from { opacity: 0; transform: translateX(20px); } to { opacity: 1; transform: translateX(0); } }
        .animate-fade-in-right { animation: fadeInR 0.8s ease-out forwards; }
        @keyframes pulseSlow { 0%, 100% { opacity: 0.9; transform: scale(1); } 50% { opacity: 1; transform: scale(1.02); } }
        .animate-pulse-slow { animation: pulseSlow 4s ease-in-out infinite; }
      `}</style>
    </main>
  );
}