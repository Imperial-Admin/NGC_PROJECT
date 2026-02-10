// @ts-nocheck
'use client';
import React, { useState, useEffect, useRef, Suspense } from 'react';
import { supabase } from '../../lib/supabaseClient';

function BroadcastContent() {
  const [currentSovereign, setCurrentSovereign] = useState(null);
  const [heartWall, setHeartWall] = useState([
    { name: 'JULIAN DRAKE' },
    { name: 'VALERIA VOSS' },
    { name: 'CASSIAN THORNE' },
    { name: 'ELARA VANCE' },
    { name: 'MAXIMUS REED' }
  ]);
  const [buyersCount, setBuyersCount] = useState(0);
  const [onlineViewers, setOnlineViewers] = useState(125836);
  const LIKES_BASE = 756567;
  const [likes, setLikes] = useState(LIKES_BASE); 
  const [isCoronating, setIsCoronating] = useState(false);
  const canvasRef = useRef(null);
  const fireworkTrigger = useRef(null);
  
  const imperialGold = `linear-gradient(110deg, #2a1a05 0%, #7a5210 25%, #b38f4a 45%, #e6c68b 50%, #b38f4a 55%, #7a5210 75%, #2a1a05 100%)`;

  const nextPrice = Math.round(10 * Math.pow(1.1, buyersCount)).toLocaleString('en-US', {
    style: 'currency', currency: 'USD', maximumFractionDigits: 0
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setOnlineViewers(prev => prev + Math.floor(Math.random() * 101) - 50);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = `
      @keyframes crownDrop { 0% { transform: translateY(-500px); opacity: 0; } 60% { transform: translateY(0); opacity: 1; } 100% { transform: translateY(200px) scale(1.5); opacity: 0; } }
      .animate-crown-drop { animation: crownDrop 5s cubic-bezier(0.4, 0, 0.2, 1) forwards; }
      @keyframes tickerMove { 0% { transform: translateX(100%); } 100% { transform: translateX(-100%); } }
      .animate-ticker { animation: tickerMove 35s linear infinite; }
      @keyframes badgePulse { 0%, 100% { opacity: 0.9; transform: scale(1); } 50% { opacity: 1; transform: scale(1.01); } }
      .animate-badge { animation: badgePulse 4s ease-in-out infinite; }
      @keyframes fadeInRight { from { opacity: 0; transform: translateX(20px); } to { opacity: 1; transform: translateX(0); } }
      .animate-entry { animation: fadeInRight 0.8s ease-out forwards; }
    `;
    document.head.appendChild(style);
    
    const fetchData = async () => {
      const { data: sov } = await supabase.from('sovereigns').select('*').order('id', { ascending: false }).limit(1);
      if (sov && sov.length > 0) setCurrentSovereign(sov[0]);

      const { count: sovCount } = await supabase.from('sovereigns').select('*', { count: 'exact', head: true });
      if (sovCount !== null) setBuyersCount(sovCount);

      const { count: likesCount } = await supabase.from('likes').select('*', { count: 'exact', head: true });
      if (likesCount !== null) setLikes(LIKES_BASE + likesCount);

      const { data: hw } = await supabase.from('heart_wall').select('name').order('id', { ascending: false }).limit(15);
      if (hw && hw.length > 0) setHeartWall(hw);
    };
    fetchData();

    const channel = supabase.channel('broadcast-live-sync')
      .on('postgres_changes', { event: 'INSERT', table: 'sovereigns' }, (payload) => {
        setCurrentSovereign(payload.new);
        setBuyersCount(prev => prev + 1);
        setIsCoronating(true);
        if (fireworkTrigger.current) {
          fireworkTrigger.current(window.innerWidth * 0.3, window.innerHeight * 0.5);
          fireworkTrigger.current(window.innerWidth * 0.7, window.innerHeight * 0.5);
        }
        setTimeout(() => setIsCoronating(false), 6000);
      })
      .on('postgres_changes', { event: 'INSERT', table: 'heart_wall' }, (payload) => {
        setHeartWall(prev => [payload.new, ...prev.slice(0, 14)]);
        if (fireworkTrigger.current) {
          fireworkTrigger.current(window.innerWidth * 0.8, window.innerHeight * 0.7);
        }
      })
      .on('postgres_changes', { event: 'INSERT', table: 'likes' }, () => {
        setLikes(prev => prev + 1);
      })
      .subscribe();

    return () => { 
        supabase.removeChannel(channel);
        if (document.head.contains(style)) document.head.removeChild(style);
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext('2d'); if (!ctx) return;
    let particles = []; let animationFrame;
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    window.addEventListener('resize', resize); resize();
    const animate = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.2)'; ctx.fillRect(0, 0, canvas.width, canvas.height);
      particles = particles.filter(p => p.alpha > 0);
      particles.forEach((p) => {
        p.vx *= p.friction; p.vy *= p.friction; p.vy += p.gravity; p.x += p.vx; p.y += p.vy; p.alpha -= p.decay;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(212, 175, 55, ${p.alpha})`; ctx.fill();
      });
      animationFrame = requestAnimationFrame(animate);
    };
    animate();
    fireworkTrigger.current = (x, y) => {
      for (let i = 0; i < 150; i++) {
        const angle = Math.random() * Math.PI * 2; const velocity = Math.random() * 12 + 6;
        particles.push({ x, y, vx: Math.cos(angle) * velocity, vy: Math.sin(angle) * velocity, alpha: 1, gravity: 0.15, friction: 0.96, size: Math.random() * 3 + 1, decay: Math.random() * 0.01 + 0.005 });
      }
    };
    return () => { cancelAnimationFrame(animationFrame); window.removeEventListener('resize', resize); };
  }, []);

  if (!currentSovereign) return <div className="h-screen bg-black flex items-center justify-center text-[#b38f4a] tracking-[1em] uppercase text-[10px]">Imperial Signal Syncing...</div>;

  // פונקציית עזר לתיקון נתיב התמונה בזמן אמת - מבטיח שכל תמונה תעלה בחדות בשידור
  const getImageUrl = (url) => {
    if (!url) return "";
    if (url.startsWith('data:') || url.startsWith('http')) return url;
    return url.startsWith('/') ? url : '/' + url;
  };

  return (
    <main className="h-screen w-full bg-black flex flex-col items-center justify-center overflow-hidden font-serif relative">
      <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-[200]" />
      
      <div className="absolute top-10 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center opacity-70">
          <p className="text-[7px] tracking-[1em] uppercase font-black text-[#b38f4a] mb-2">Imperial Digital Gateway</p>
          <p className="text-xl tracking-[0.4em] uppercase font-black bg-clip-text text-transparent bg-gradient-to-b from-[#fbf5b7] to-[#b38f4a]">WWW.YOURDOMAIN.COM</p>
      </div>

      <div className="relative flex items-center justify-center">
        <div className="absolute -left-64 z-30 flex flex-col items-center animate-badge">
            <div className="w-[1px] h-24 bg-gradient-to-t from-[#b38f4a] to-transparent mb-4"></div>
            <p className="text-[7px] tracking-[0.5em] uppercase text-[#b38f4a] font-bold vertical-text [writing-mode:vertical-lr] rotate-180 opacity-60 mb-4">TO TAKE THE THRONE</p>
            <div className="px-6 py-6 backdrop-blur-2xl border border-[#b38f4a]/30 bg-black/40 shadow-[0_0_50px_rgba(0,0,0,1)] min-w-[200px] flex items-center justify-center">
                <span className="text-2xl font-black tracking-tighter drop-shadow-[0_2px_10px_rgba(212,175,55,0.3)] bg-clip-text text-transparent" style={{ backgroundImage: imperialGold }}>{nextPrice}</span>
            </div>
            <div className="w-[1px] h-12 bg-gradient-to-b from-[#b38f4a] to-transparent mt-4 opacity-40"></div>
        </div>

        <div className="relative w-[112.5vh] aspect-[6/5] shadow-[0_0_150px_rgba(0,0,0,1)]" style={{ padding: '2px', backgroundImage: imperialGold }}>
           <div className="h-full w-full bg-black relative overflow-hidden flex flex-col items-center justify-center">
              {/* שימוש בפונקציית התיקון המלכותית - מעלים את ה-Broken Image אחת ולתמיד */}
              <img 
                src={getImageUrl(currentSovereign.image_url)} 
                alt="Live" 
                className="w-full h-full object-contain brightness-90 contrast-110" 
              />
              <div className="absolute bottom-6 left-0 right-0 z-20 flex flex-col items-center">
                  <div className="px-12 py-4 backdrop-blur-md bg-black/60 border-y border-[#b38f4a]/30 shadow-2xl relative min-w-[400px] flex items-center justify-center">
                      <h2 className="text-2xl tracking-[0.6em] uppercase font-black text-white drop-shadow-lg text-center w-full">{currentSovereign.name}</h2>
                      <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-[1px] bg-[#b38f4a]"></div>
                      <div className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-[1px] bg-[#b38f4a]"></div>
                  </div>
                  <div className="w-full max-w-[400px] mt-2 h-6 overflow-hidden relative">
                      <div className="flex whitespace-nowrap animate-ticker">
                          <span className="text-[#D4AF37] text-[10px] tracking-[0.4em] italic uppercase font-bold mx-10">"{currentSovereign.subtitle}"</span>
                          <span className="text-[#D4AF37] text-[10px] tracking-[0.4em] italic uppercase font-bold mx-10">"{currentSovereign.subtitle}"</span>
                      </div>
                  </div>
              </div>
           </div>
        </div>
      </div>

      <div className="absolute top-10 right-12 flex flex-col items-end gap-8">
          <div className="flex flex-col items-end gap-2">
              <div className="flex items-center gap-3 bg-black/40 px-4 py-2 border border-[#b38f4a]/20 backdrop-blur-sm">
                 <div className="w-2 h-2 rounded-full bg-red-600 animate-pulse shadow-[0_0_15px_red]"></div>
                 <span className="text-[10px] tracking-[0.4em] uppercase font-black text-white">Live Broadcast</span>
              </div>
              <div className="flex flex-col items-end">
                  <span className="text-xl font-mono font-bold text-white tracking-tighter">{onlineViewers.toLocaleString()}</span>
                  <span className="text-[7px] tracking-[0.3em] uppercase text-[#b38f4a] font-bold">Global Transmission Audience</span>
              </div>
          </div>

          <div className="flex flex-col items-end">
              <div className="flex items-center gap-2">
                  <span className="text-red-600 text-sm animate-pulse">❤</span>
                  <span className="text-xl font-mono font-bold text-white tracking-tighter">{likes.toLocaleString()}</span>
              </div>
              <span className="text-[7px] tracking-[0.3em] uppercase text-[#b38f4a] font-bold">Imperial Pulse</span>
          </div>

          <div className="flex flex-col items-end w-64 pt-4 border-t border-[#b38f4a]/20">
              <span className="text-[7px] tracking-[0.4em] uppercase text-[#b38f4a] font-black mb-4 opacity-60">Recent Allegiances</span>
              <div className="flex flex-col items-end gap-3 w-full">
                  {heartWall.length > 0 ? heartWall.slice(0, 5).map((item, i) => (
                      <div key={i} className="flex items-center gap-3 animate-entry" style={{ animationDelay: `${i * 0.1}s` }}>
                          <span className="text-white text-[10px] tracking-[0.2em] uppercase font-bold">{item.name}</span>
                          <span className="text-[#b38f4a] text-xs">💛</span>
                      </div>
                  )) : (
                      <span className="text-[8px] tracking-[0.2em] uppercase text-white/20 italic">Awaiting loyalists...</span>
                  )}
              </div>
          </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-10 bg-black border-t border-[#b38f4a]/20 overflow-hidden flex items-center">
          <div className="absolute left-0 top-0 bottom-0 bg-[#b38f4a] text-[#1a1103] text-[9px] font-black uppercase tracking-widest flex items-center px-8 z-10 shadow-[8px_0_15px_rgba(0,0,0,0.8)]">Latest Allegiances</div>
          <div className="flex whitespace-nowrap animate-ticker">
              {heartWall.length > 0 ? heartWall.map((item, i) => (
                  <span key={i} className="text-[9px] tracking-[0.4em] uppercase text-white/60 mx-12 flex items-center">
                      <span className="text-[#b38f4a] mr-3">✦</span> {item.name}
                  </span>
              )) : <span className="text-[10px] tracking-[0.4em] uppercase text-white/20 mx-12">ONLY ONE SHALL SURVIVE TO CLAIM THE ETERNAL THRONE...</span>}
          </div>
      </div>

      {isCoronating && (
        <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center pointer-events-none">
            <div className="absolute inset-0 bg-black/70 backdrop-blur-md" />
            <p className="z-[101] text-3xl tracking-[1.2em] uppercase text-white font-light italic animate-pulse">A New Sovereign Ascends</p>
            <img src="/crown.png" alt="Crown" className="absolute top-0 z-[102] animate-crown-drop w-1/4 filter drop-shadow-[0_0_80px_#D4AF37]" />
        </div>
      )}
    </main>
  );
}

export default function BroadcastPage() {
  return (
    <Suspense fallback={null}>
      <BroadcastContent />
    </Suspense>
  );
}