// @ts-nocheck
"use client";
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../lib/supabaseClient';
import { Crown, Menu, Heart, X } from 'lucide-react';

export default function MobileHome() {
  const router = useRouter();
  
  const LIKES_BASE = 756567;
  const MIN_VIEWERS = 123452; 
  const TARGET_BASE = 124500;

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [buyers, setBuyers] = useState(0);
  const [likes, setLikes] = useState(LIKES_BASE);
  const [onlineViewers, setOnlineViewers] = useState(TARGET_BASE);
  const [recentHearts, setRecentHearts] = useState([]);
  const [currentSovereign, setCurrentSovereign] = useState({ name: "Loading...", image_url: "", subtitle: "" });
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [mounted, setMounted] = useState(false);

  const currentPrice = useMemo(() => {
    return Math.round(10 * Math.pow(1.1, buyers)).toLocaleString('en-US', {
      style: 'currency', currency: 'USD', maximumFractionDigits: 0
    });
  }, [buyers]);

  const imperialGold = `linear-gradient(110deg, #2a1a05 0%, #7a5210 25%, #b38f4a 45%, #e6c68b 50%, #b38f4a 55%, #7a5210 75%, #2a1a05 100%)`;

  const fetchHeartWall = async () => {
    const { data } = await supabase.from('heart_wall').select('name, country_code').order('id', { ascending: false }).limit(3);
    if (data) setRecentHearts(data);
  };

  useEffect(() => {
    setMounted(true);
    const fetchData = async () => {
      const { count: sovCount } = await supabase.from('sovereigns').select('*', { count: 'exact', head: true });
      if (sovCount !== null) setBuyers(sovCount);
      const { data: sovData } = await supabase.from('sovereigns').select('name, image_url, subtitle').order('id', { ascending: false }).limit(1);
      if (sovData && sovData[0]) setCurrentSovereign(sovData[0]);
      const { count: likesCount } = await supabase.from('likes').select('*', { count: 'exact', head: true });
      if (likesCount !== null) setLikes(LIKES_BASE + likesCount);
      
      await fetchHeartWall();
    };
    fetchData();

    const viewerInterval = setInterval(() => {
        setOnlineViewers(prev => {
          const fluctuation = Math.floor(Math.random() * 500) - 200;
          const newVal = prev + fluctuation;
          return newVal < MIN_VIEWERS ? MIN_VIEWERS + 100 : newVal;
        });
    }, 3000);

    const channel = supabase.channel('mobile-global-sync')
    .on('postgres_changes', { event: 'INSERT', table: 'likes' }, () => {
        supabase.from('likes').select('*', { count: 'exact', head: true }).then(({ count }) => {
          if (count !== null) setLikes(LIKES_BASE + count);
        });
    })
    .on('postgres_changes', { event: 'INSERT', table: 'heart_wall' }, fetchHeartWall)
    .on('postgres_changes', { event: '*', table: 'sovereigns' }, fetchData)
    .subscribe();

    return () => { 
        supabase.removeChannel(channel);
        clearInterval(viewerInterval);
    };
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true }); if (!ctx) return;
    let particles: any[] = []; let animationFrame: number;
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    window.addEventListener('resize', resize); resize();
    class Particle {
      constructor(x, y, color) {
        this.x = x; this.y = y; const angle = Math.random() * Math.PI * 2; const velocity = Math.random() * 8 + 4;
        this.vx = Math.cos(angle) * velocity; this.vy = Math.sin(angle) * velocity;
        this.alpha = 1; this.color = color; this.gravity = 0.12; this.friction = 0.94;
        this.size = Math.random() * 2 + 0.5; this.decay = Math.random() * 0.02 + 0.015;
      }
      draw() {
        if (!ctx) return; ctx.beginPath(); ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        const rgb = this.color.match(/\d+/g);
        ctx.fillStyle = `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, ${this.alpha})`; ctx.fill();
      }
      update() { this.vx *= this.friction; this.vy *= this.friction; this.vy += this.gravity; this.x += this.vx; this.y += this.vy; this.alpha -= this.decay; }
    }
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles = particles.filter(p => p.alpha > 0); particles.forEach(p => { p.update(); p.draw(); });
      animationFrame = requestAnimationFrame(animate);
    };
    animate();
    window.createFirework = (x, y) => {
      const colors = ['rgb(212, 175, 55)', 'rgb(251, 245, 183)', 'rgb(255, 215, 0)', 'rgb(230, 198, 139)', 'rgb(255, 255, 255)'];
      for (let i = 0; i < 80; i++) particles.push(new Particle(x, y, colors[Math.floor(Math.random() * colors.length)]));
    };
    return () => { cancelAnimationFrame(animationFrame); window.removeEventListener('resize', resize); };
  }, [mounted]);

  const handleLikeMobile = async () => {
    await supabase.from('likes').insert([{ created_at: new Date() }]);
    if (window.createFirework) {
        window.createFirework(window.innerWidth * 0.85, window.innerHeight * 0.8);
    }
  };

  return (
    <main className="h-screen w-full bg-black text-white font-serif flex flex-col overflow-hidden relative">
      <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-[30]" style={{ mixBlendMode: 'screen' }} />

      {isMenuOpen && (
        <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-2xl flex flex-col items-center justify-center p-10 animate-fade-in text-center">
          <button onClick={() => setIsMenuOpen(false)} className="absolute top-10 right-10 text-[#b38f4a]">
            <X size={35} />
          </button>
          <nav className="flex flex-col items-center gap-8 text-center">
             <h2 className="text-[10px] tracking-[0.5em] uppercase text-[#b38f4a] mb-4 opacity-50">Imperial Navigation</h2>
             <button onClick={() => { router.push('/share'); setIsMenuOpen(false); }} className="text-xl tracking-[0.2em] uppercase font-light text-white hover:text-[#b38f4a]">Share</button>
             <button onClick={() => { router.push('/live'); setIsMenuOpen(false); }} className="text-xl tracking-[0.2em] uppercase font-light text-white hover:text-[#b38f4a]">Live Stream</button>
             <button onClick={() => { router.push('/history'); setIsMenuOpen(false); }} className="text-xl tracking-[0.2em] uppercase font-light text-white hover:text-[#b38f4a]">History</button>
             <button onClick={() => { router.push('/broadcast'); setIsMenuOpen(false); }} className="text-xl tracking-[0.2em] uppercase font-black italic text-[#b38f4a]">Imperial Live</button>
             <div className="h-[1px] w-20 bg-[#b38f4a]/20 my-4"></div>
             <div className="flex flex-col gap-4 opacity-40">
                <button onClick={() => { router.push('/terms'); setIsMenuOpen(false); }} className="text-[10px] tracking-[0.3em] uppercase">Terms</button>
                <button onClick={() => { router.push('/privacy'); setIsMenuOpen(false); }} className="text-[10px] tracking-[0.3em] uppercase">Privacy</button>
                <button onClick={() => { router.push('/accessibility'); setIsMenuOpen(false); }} className="text-[10px] tracking-[0.3em] uppercase">Accessibility</button>
             </div>
          </nav>
        </div>
      )}

      <header className="shrink-0 p-5 flex justify-between items-center border-b border-[#b38f4a]/10 bg-black/80 z-50 relative">
        <div>
          <h1 className="text-2xl font-black italic tracking-tighter bg-clip-text text-transparent" style={{ backgroundImage: imperialGold }}>NGC</h1>
          <p className="text-[7px] tracking-[0.3em] uppercase text-[#b38f4a]">The Sovereign Asset</p>
        </div>
        <button onClick={() => setIsMenuOpen(true)} className="text-[#b38f4a] p-1.5 border border-[#b38f4a]/20 rounded-full outline-none">
          <Menu size={20} />
        </button>
      </header>

      <section className="flex-1 min-h-0 flex flex-col items-center justify-start relative z-40">
        <div className="shrink-0 w-full py-2 px-2 text-center">
            <p className="text-[8px] tracking-tight uppercase font-light italic leading-tight text-[#D4AF37] opacity-80 max-w-[90%] mx-auto text-center">
                To take the throne, outvalue the current Sovereign by 10%. <br/>
                Your legacy remains until a greater tribute is paid.
            </p>
        </div>

        <div className="flex-1 relative w-screen min-h-0 overflow-hidden bg-[#050505]">
          {currentSovereign.image_url ? (
            <img src={currentSovereign.image_url} className="w-full h-full object-cover brightness-90 contrast-110" alt="Sovereign" />
          ) : (
            <div className="w-full h-full flex items-center justify-center"><Crown size={40} className="text-[#b38f4a]/20" /></div>
          )}
          
          <div className="absolute top-0 right-0 px-3 py-1.5 min-w-[120px] flex justify-center rounded-bl-md shadow-2xl z-10" style={{ backgroundImage: imperialGold }}>
            <span className="text-black font-black text-base tracking-tighter">{currentPrice}</span>
          </div>

          {/* מד הלבבות הצף - מעודכן: קטן יותר וצמוד למטה ולימין */}
          <div className="absolute bottom-2 right-2 z-50 flex flex-col items-end gap-1.5 max-w-[140px] pointer-events-none">
            {recentHearts.map((heart, i) => (
                <div key={`${heart.name}-${i}`} className="border-r-2 border-[#b38f4a] px-2 py-0.5 w-full animate-slide-up-gold flex items-center justify-end gap-1.5">
                    <p className="text-[7px] text-white font-bold tracking-wider truncate uppercase drop-shadow-[0_1px_2px_rgba(0,0,0,1)] leading-tight">{heart.name}</p>
                    <img src={`https://flagcdn.com/w40/${heart.country_code?.toLowerCase() || 'un'}.png`} alt="flag" className="w-3 h-2 object-cover rounded-sm border border-white/20" />
                </div>
            ))}
          </div>
        </div>

        <div className="shrink-0 mt-3 text-center px-6 w-full overflow-hidden">
          <h2 className="text-xl tracking-[0.15em] uppercase font-black text-[#FBF5B7] truncate text-center">{currentSovereign.name}</h2>
          <div className="relative flex w-full overflow-hidden mt-2 justify-center">
            <div className="flex animate-marquee-seamless whitespace-nowrap min-w-full text-center">
                <p className="text-[#D4AF37] text-[10px] tracking-[0.4em] italic uppercase font-medium opacity-90 px-4 text-center">
                    {currentSovereign.subtitle} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; {currentSovereign.subtitle} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; {currentSovereign.subtitle}
                </p>
            </div>
          </div>
        </div>
      </section>

      <footer className="shrink-0 p-5 flex flex-col gap-3 bg-gradient-to-t from-black to-transparent relative z-50">
        <div className="flex justify-end items-center gap-2 w-full">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#b38f4a]/20 bg-black/40 backdrop-blur-sm">
                <div className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse shadow-[0_0_8px_red]"></div>
                <span className="text-[9px] font-mono tracking-tighter text-[#b38f4a] opacity-90">
                    LIVE: {onlineViewers.toLocaleString()}
                </span>
            </div>
            <button onClick={handleLikeMobile} className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#b38f4a]/20 bg-black/40 backdrop-blur-sm active:scale-95 transition-transform outline-none">
                <Heart size={12} className="text-red-600 animate-pulse" />
                <span className="text-[9px] font-mono tracking-tighter text-[#b38f4a] opacity-90">
                    PULSE: {likes.toLocaleString()}
                </span>
            </button>
        </div>
        <button onClick={() => router.push('/upload')} className="w-full py-4 rounded-sm font-black uppercase tracking-[0.3em] text-[10px] shadow-lg active:scale-95 transition-transform outline-none text-center" style={{ backgroundImage: imperialGold, color: '#1a1103' }}>Claim The Throne</button>
        <div className="grid grid-cols-2 gap-2 text-center">
          <button onClick={() => router.push('/seal')} className="py-3 border border-[#b38f4a]/30 text-[8px] uppercase tracking-widest font-bold bg-black/40 text-[#b38f4a] outline-none text-center">Seal Influence</button>
          <button onClick={() => router.push('/upload?mode=gift')} className="py-3 border border-[#b38f4a]/30 text-[8px] uppercase tracking-widest font-bold bg-black/40 text-[#b38f4a] outline-none text-center">Crown Loved One</button>
        </div>
      </footer>

      <style jsx>{`
        @keyframes marqueeSeamless { 0% { transform: translateX(100%); } 100% { transform: translateX(-100%); } }
        .animate-marquee-seamless { animation: marqueeSeamless 15s linear infinite; }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        .animate-fade-in { animation: fadeIn 0.3s ease-out forwards; }
        @keyframes slideUpGold { from { transform: translateY(15px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        .animate-slide-up-gold { animation: slideUpGold 0.6s cubic-bezier(0.23, 1, 0.32, 1) forwards; }
      `}</style>
    </main>
  );
}