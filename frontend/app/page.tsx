"use client";
import React, { useState, useEffect, useRef, Suspense, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../lib/supabaseClient';

function HomeContent() {
  const router = useRouter();
  const [buyers, setBuyers] = useState(0);
  const [likes, setLikes] = useState(756567);
  const [userCountry, setUserCountry] = useState("Monaco");
  const [isShaking, setIsShaking] = useState(false);
  const [isHeartBeating, setIsHeartBeating] = useState(false);
  const [isCoronating, setIsCoronating] = useState(false);
  const [mounted, setMounted] = useState(false);
  
  // לוגיקת צופים ריאליסטית
  const MIN_VIEWERS = 123452; 
  const TARGET_BASE = 124500; 
  const [onlineViewers, setOnlineViewers] = useState(TARGET_BASE); 

  const canvasRef = useRef<HTMLCanvasElement>(null);

  // State לניהול הנתונים הדינמיים מה-Database - נוקה מהתמונה הישנה בזהירות
  const [currentSovereign, setCurrentSovereign] = useState<any>({
    name: "ALEXANDER VON BERG",
    image_url: "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7",
    subtitle: "Success is a choice"
  });

  // אופטימיזציה קריטית: קיבוע חלקיקי הזהב למניעת איטיות ("בקושי זז")
  const goldParticles = useMemo(() => {
    return [...Array(200)].map(() => ({
      width: `${Math.random() * 2}px`,
      height: `${Math.random() * 2}px`,
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      opacity: Math.random(),
      duration: `${Math.random() * 20 + 10}s`
    }));
  }, []);

  const tributes = [
    { name: "Alexander Von Berg", msg: "Legacy secured now", loc: "Berlin", code: "de" },
    { name: "Isabella d'Este", msg: "History in making", loc: "Florence", code: "it" },
    { name: "Sultan Al-Saud", msg: "Future is gold", loc: "Riyadh", code: "sa" },
    { name: "Jameson Blackwood", msg: "Sovereign spirit always", loc: "Aspen", code: "us" },
    { name: "Catherine de Valois", msg: "Power of choice", loc: "Monaco", code: "mc" },
    { name: "Hiroshi Tanaka", msg: "Gold is eternal", loc: "Osaka", code: "jp" },
    { name: "Maximilian Steiner", msg: "Tribute from Vienna", loc: "Vienna", code: "at" },
    { name: "Sofia Loren", msg: "Excellence redefined", loc: "Milan", code: "it" },
    { name: "Liam O'Connor", msg: "The throne awaits", loc: "Dublin", code: "ie" },
    { name: "Fatima Al-Zahra", msg: "Elegance and power", loc: "Abu Dhabi", code: "ae" },
    { name: "Oliver Montgomery", msg: "A new era begins", loc: "Sydney", code: "au" },
    { name: "Nadia Petrova", msg: "Imperial signal locked", loc: "Moscow", code: "ru" },
    { name: "Elias Ben-Zvi", msg: "Tribute from Zion", loc: "Jerusalem", code: "il" },
    { name: "Lars Sundstrom", msg: "Purity of asset", loc: "Stockholm", code: "se" },
    { name: "Carlos Santana", msg: "Vibrant legacy", loc: "Madrid", code: "es" },
    { name: "Zhang Wei", msg: "Sovereign frequency", loc: "Shanghai", code: "cn" },
    { name: "Julian Rothchild", msg: "Wealth stabilized", loc: "Zurich", code: "ch" },
    { name: "Arthur Pendragon", msg: "Imperial link live", loc: "London", code: "gb" },
    { name: "Elena Petrovna", msg: "Presence detected", loc: "Paris", code: "fr" },
    { name: "Avi Ben-Haim", msg: "Securing the future", loc: "Tel Aviv", code: "il" }
  ];

  const [latestTribute, setLatestTribute] = useState(tributes[0]);
  const [activities, setActivities] = useState([
    { id: 1, text: "Sovereign presence detected: Zurich", isNew: false },
    { id: 2, text: "Legacy valuation oscillating: Dubai", isNew: false },
    { id: 3, text: "Imperial link established: London", isNew: false },
    { id: 4, text: "Throne connectivity active: Tokyo", isNew: false },
    { id: 5, text: "Wealth frequency stabilized: Singapore", isNew: false }
  ]);

  // נוסחת האחוזים - קופצת ב-10% בכל קנייה (buyers)
  const currentPrice = Math.round(10 * Math.pow(1.1, buyers)).toLocaleString('en-US', {
    style: 'currency', currency: 'USD', maximumFractionDigits: 0
  });

  const imperialGold = `linear-gradient(110deg, #2a1a05 0%, #7a5210 25%, #b38f4a 45%, #e6c68b 50%, #b38f4a 55%, #7a5210 75%, #2a1a05 100%)`;

  useEffect(() => {
    setMounted(true);
    
    // משיכת הנתונים וספירת כמות הקונים (לעדכון האחוזים והשם המרכזי)
    const fetchSovereign = async () => {
      // 1. ספירת קונים בנפרד (כדי שהמחיר יתעדכן גם אם יש שגיאת 400 בנתונים אחרים)
      const { count } = await supabase.from('sovereigns').select('*', { count: 'exact', head: true });
      if (count !== null) setBuyers(count);

      // 2. משיכת נתוני הקיסר האחרון
      const { data } = await supabase.from('sovereigns').select('*').order('id', { ascending: false }).limit(1);
      if (data && data.length > 0) setCurrentSovereign(data[0]);
    };
    
    fetchSovereign();

    fetch('https://ipapi.co/json/').then(res => res.json()).then(data => { if(data.country_name) setUserCountry(data.country_name); }).catch(() => {});
    
    const viewerInterval = setInterval(() => {
      setOnlineViewers(prev => {
        const surgeProb = prev > TARGET_BASE + 2000 ? 0.3 : 0.6;
        const isSurge = Math.random() < surgeProb;
        let fluctuation = isSurge ? (Math.floor(Math.random() * 1500) + 100) : -(Math.floor(Math.random() * 1200) + 100);
        const newVal = prev + fluctuation;
        if (newVal < MIN_VIEWERS) return MIN_VIEWERS + Math.floor(Math.random() * 500);
        return newVal;
      });
    }, 3000);

    const activityInterval = setInterval(() => {
      const cities = ["Geneva", "Paris", "New York", "Hong Kong", "Milan", "Dubai", "Singapore", "London", "Tokyo", "Riyadh", "Monaco", "Zurich", "Los Angeles", "Seoul", "Shanghai"];
      const actions = ["presence detected", "legacy valuation oscillating", "imperial link established", "throne connectivity active", "wealth frequency stabilized", "sovereign signal locked"];
      const newEntry = { id: Date.now(), text: `Sovereign ${actions[Math.floor(Math.random() * actions.length)]}: ${cities[Math.floor(Math.random() * cities.length)]}`, isNew: false };
      setActivities(prev => [...prev.slice(-9), newEntry]);
    }, 4000);
    return () => { clearInterval(viewerInterval); clearInterval(activityInterval); };
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true }); if (!ctx) return;
    let particles: any[] = []; let animationFrame: number;
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    window.addEventListener('resize', resize); resize();
    class Particle {
      x: number; y: number; vx: number; vy: number; alpha: number; color: string; 
      gravity: number; friction: number; size: number; decay: number;
      constructor(x: number, y: number, color: string) {
        this.x = x; this.y = y; const angle = Math.random() * Math.PI * 2; const velocity = Math.random() * 10 + 5;
        this.vx = Math.cos(angle) * velocity; this.vy = Math.sin(angle) * velocity;
        this.alpha = 1; this.color = color; this.gravity = 0.12; this.friction = 0.95;
        this.size = Math.random() * 2 + 1; this.decay = Math.random() * 0.015 + 0.01;
      }
      draw() {
        if (!ctx) return; ctx.beginPath(); ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        const res = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(this.color);
        const rgb = res ? `${parseInt(res[1], 16)}, ${parseInt(res[2], 16)}, ${parseInt(res[3], 16)}` : '212, 175, 55';
        ctx.fillStyle = `rgba(${rgb}, ${this.alpha})`; ctx.fill();
      }
      update() { this.vx *= this.friction; this.vy *= this.friction; this.vy += this.gravity; this.x += this.vx; this.y += this.vy; this.alpha -= this.decay; }
    }
    const animate = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.15)'; ctx.fillRect(0, 0, canvas.width, canvas.height);
      particles = particles.filter(p => p.alpha > 0); particles.forEach(p => { p.update(); p.draw(); });
      animationFrame = requestAnimationFrame(animate);
    };
    animate();
    (window as any).createFirework = (x: number, y: number) => {
      const colors = ['#D4AF37', '#FBF5B7', '#FFD700', '#E6C68B', '#FFFFFF'];
      for (let i = 0; i < 120; i++) particles.push(new Particle(x, y, colors[Math.floor(Math.random() * colors.length)]));
    };
    return () => { cancelAnimationFrame(animationFrame); window.removeEventListener('resize', resize); };
  }, [mounted]);

  const handleClaim = () => router.push('/upload');
  const triggerTribute = () => router.push('/upload');

  const handleLike = () => {
    setLikes(prev => prev + 1); setIsHeartBeating(true);
    setTimeout(() => setIsHeartBeating(false), 600);
    const newEntry = { id: Date.now(), text: `Imperial Allegiance Sworn: ${userCountry}`, isNew: true };
    setActivities(prev => [...prev.slice(-9), newEntry]);
    if ((window as any).createFirework) { (window as any).createFirework(window.innerWidth * 0.15, window.innerHeight * 0.7); }
  };

  if (!mounted) return null;

  return (
    <main className={`h-screen w-full bg-black text-white flex flex-col items-center justify-start overflow-hidden font-serif relative select-none caret-transparent outline-none transition-transform duration-100 ${isShaking ? 'animate-screen-shake' : ''}`}>
      <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-[100]" style={{ mixBlendMode: 'screen' }} />
      <div className="absolute inset-0 z-0 pointer-events-none" style={{ backgroundImage: "url('/bg.jpg')", backgroundSize: 'cover', backgroundPosition: 'center', filter: 'brightness(0.4) contrast(110%)' }}></div>
      <div className="absolute inset-0 z-[1] pointer-events-none overflow-hidden">
        {goldParticles.map((p, i) => (
          <div key={i} className="absolute rounded-full animate-gold-float" style={{ width: p.width, height: p.height, top: p.top, left: p.left, backgroundColor: '#D4AF37', opacity: p.opacity, animationDuration: p.duration }} />
        ))}
      </div>

      <header className="absolute top-10 left-10 z-20 flex flex-col items-start">
        <h1 className="text-4xl md:text-5xl font-serif font-black italic tracking-[0.3em] bg-clip-text text-transparent" style={{ backgroundImage: imperialGold }}>NGC</h1>
        <div className="flex items-center mt-2 space-x-3 opacity-90">
            <div className="h-[1px] w-6" style={{ backgroundImage: `linear-gradient(to right, #b38f4a, transparent)` }}></div>
            <p className="text-[9px] md:text-[10px] tracking-[0.4em] uppercase font-medium" style={{ color: '#b38f4a' }}>The Sovereign Asset</p>
        </div>
      </header>

      <div className="absolute top-10 right-10 z-20 flex flex-col items-center">
         <div className="flex items-center space-x-2 bg-black/60 px-4 py-1.5 rounded-full border border-[#b38f4a]/30 backdrop-blur-2xl shadow-[0_0_20px_rgba(0,0,0,0.6)]">
            <div className="w-2.5 h-2.5 rounded-full bg-red-600 animate-pulse shadow-[0_0_12px_red]"></div>
            <span className="text-[10px] tracking-[0.4em] uppercase font-black text-white">Live</span>
         </div>
         <p className="mt-2 text-lg md:text-xl font-mono font-black text-white tracking-tighter drop-shadow-[0_2px_8px_rgba(0,0,0,1)] transition-all duration-1000 ease-in-out">
            {onlineViewers.toLocaleString()}
         </p>
         <p className="text-[8px] uppercase tracking-[0.4em] text-[#b38f4a] font-bold opacity-80">LIVE GLOBAL AUDIENCE</p>
      </div>

      <div className="absolute top-[72px] left-0 right-0 z-20 flex flex-col items-center pointer-events-none opacity-40">
         <div className="text-center">
            <p className="text-[9px] md:text-[10px] tracking-[0.6em] uppercase font-light italic leading-[2] text-white">To take the throne, <br/> outvalue the current Sovereign by 10%. <br/> Your legacy remains until a greater tribute is paid.</p>
         </div>
      </div>

      {isCoronating && (
        <div className="fixed inset-0 z-[1000] flex flex-col items-center justify-center pointer-events-none">
            <div className="absolute inset-0 bg-black/95 animate-fade-in"></div>
            <p className="z-[1001] text-lg md:text-2xl tracking-[0.8em] uppercase text-white font-light italic animate-proclamation">A New Sovereign Ascends</p>
            <img src="/crown.png" alt="Crown" className="absolute top-0 z-[1002] animate-crown-drop w-1/2 md:w-1/3 max-lg filter drop-shadow-[0_0_50px_#D4AF37] brightness-125 contrast-110" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full animate-imperial-pulse opacity-0" style={{ background: 'radial-gradient(circle, rgba(212,175,55,1) 0%, rgba(212,175,55,0) 70%)', width: '20px', height: '20px' }}></div>
        </div>
      )}

      <div className={`w-full h-full flex flex-col items-center justify-start z-10 pt-36 transition-opacity duration-1000 ${isCoronating ? 'opacity-10' : 'opacity-100'}`}>
        <div className="flex items-start justify-center gap-10 w-[98vw] max-w-[1750px] relative h-[50vh]">
          
          <div className="hidden xl:flex flex-col w-64 h-full relative overflow-visible">
             <div className="flex flex-col h-full rounded-sm border border-[#b38f4a]/30 relative overflow-hidden shadow-2xl" style={{ backgroundImage: `linear-gradient(110deg, #2a1a05, #1a1103, #2a1a05)`, padding: '2px' }}>
                <div className="bg-black/90 h-full w-full p-4 flex flex-col border border-[#b38f4a]/10">
                    <h4 className="text-[10px] tracking-[0.3em] uppercase text-[#e6c68b] border-b border-[#b38f4a]/20 pb-2 mb-2 font-bold">Global Pulse</h4>
                    <div className="mb-4 py-2 border-b border-[#b38f4a]/10 flex flex-col items-start">
                        <p className="text-[8px] uppercase tracking-widest text-[#b38f4a] opacity-70">The Royal Pulse</p>
                        <p className="text-lg font-mono font-black text-white tracking-tighter">{likes.toLocaleString()}</p>
                    </div>
                    <div className="flex-1 overflow-hidden relative flex flex-col justify-end">
                       <div className="flex flex-col gap-2">
                          {activities.map((item) => (
                            <p key={item.id} className={`text-[9px] h-6 tracking-widest opacity-90 italic flex items-center animate-slide-up-gold ${item.isNew ? 'text-[#D4AF37] font-bold' : 'text-white'}`}>{item.text}</p>
                          ))}
                       </div>
                    </div>
                </div>
             </div>
             <div className="absolute -bottom-[132px] left-0 w-64 h-32 pointer-events-auto">
                <div className="flex flex-col text-left absolute left-0 top-0">
                    <span className="text-[10px] uppercase tracking-[0.2em] text-[#b38f4a] font-bold">Endorse the</span>
                    <span className="text-[12px] uppercase tracking-[0.3em] text-white font-black leading-none">Imperial Asset</span>
                </div>
                <button onClick={handleLike} className={`absolute right-0 top-0 transform transition-transform duration-300 active:scale-90 outline-none ${isHeartBeating ? 'scale-125' : 'hover:scale-110'}`}>
                    <span className="text-4xl drop-shadow-[0_0_15px_rgba(255,0,0,0.6)]" style={{ color: '#FF0000' }}>❤</span>
                </button>
             </div>
          </div>

          <div className="relative w-[50vw] max-w-[850px] h-full shrink-0 rounded-lg shadow-2xl select-none" style={{ padding: '4px', backgroundImage: imperialGold, boxShadow: `0 30px 60px -15px rgba(0,0,0,1), inset 1px 1px 1px rgba(255, 255, 255, 0.6), inset -2px -2px 4px rgba(0, 0, 0, 0.8)` }}>
            <div className="absolute bottom-12 -right-4 z-50 w-52 h-14 rounded-sm overflow-hidden flex items-center justify-center animate-price-pulse" style={{ backgroundImage: imperialGold, boxShadow: `0 10px 20px -5px rgba(0,0,0,0.8), inset 0 2px 3px rgba(255,255,255,0.6), inset 0 -2px 3px rgba(0,0,0,0.8)` }}>
                {[...Array(4)].map((_, i) => (
                  <div key={i} className={`absolute w-1.5 h-1.5 rounded-full bg-[#2a1a05] ${i===0?'top-1 left-1':i===1?'top-1 right-1':i===2?'bottom-1 left-1':'bottom-1 right-1'}`}></div>
                ))}
                <h3 className="text-xl md:text-2xl font-black tracking-wider text-[#1a1103] drop-shadow-[0_1px_1px_rgba(255,255,255,0.3)]">{currentPrice}</h3>
            </div>
            <div className="h-full w-full rounded-sm overflow-hidden relative border-[1px] border-[#D4AF37]/20 pb-14" style={{ backgroundColor: '#000000' }}>
              <img src={currentSovereign.image_url} alt="NGC" className="w-full h-full object-contain relative z-10 contrast-115 brightness-95" />
              <div className="absolute bottom-0 left-0 right-0 h-16 z-30 flex items-center justify-center">
                <div className="w-full h-full backdrop-blur-md bg-black/70 border-t-2 border-[#FBF5B7]/50 shadow-[inset_0_5px_15px_rgba(212,175,55,0.2)] flex flex-col items-center justify-center overflow-hidden">
                    <h2 className="text-sm tracking-[0.3em] uppercase font-black text-[#FBF5B7]">{currentSovereign.name || "The Sovereign"}</h2>
                    <div className="h-[1px] w-8 bg-[#D4AF37] my-1 opacity-50"></div>
                    <div className="relative flex w-full overflow-hidden">
                      <div className="flex animate-marquee-seamless whitespace-nowrap min-w-full">
                          <p className="text-[#D4AF37] text-[9px] md:text-[10px] tracking-[0.4em] italic uppercase font-medium opacity-80 px-4">
                            "{currentSovereign.subtitle || "Success is a choice"}" &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; "{currentSovereign.subtitle || "Success is a choice"}"
                          </p>
                      </div>
                    </div>
                </div>
              </div>
            </div>
          </div>

          <div className="hidden xl:flex flex-col w-64 h-full rounded-sm border border-[#b38f4a]/30 relative overflow-visible shadow-2xl" style={{ backgroundImage: `linear-gradient(110deg, #2a1a05, #1a1103, #2a1a05)`, padding: '2px' }}>
             <div className="bg-black/90 h-full w-full p-4 flex flex-col border border-[#b38f4a]/10">
                <h4 className="text-[10px] tracking-[0.3em] uppercase text-[#e6c68b] border-b border-[#b38f4a]/20 pb-2 mb-2 font-bold">HEART WALL</h4>
                <div className="mb-4 py-2 border-b border-[#b38f4a]/10 flex flex-col items-start">
                    <p className="text-[8px] uppercase tracking-widest text-[#b38f4a] opacity-70">The Reigning Sovereign</p>
                    <div className="flex items-center space-x-2 mt-1 w-full overflow-hidden">
                       <p className="text-lg font-mono font-black text-[#D4AF37] tracking-tighter truncate">{latestTribute.name}</p>
                       <img src={`https://flagcdn.com/w40/${latestTribute.code}.png`} alt="flag" className="w-6 h-4 object-cover rounded-sm border border-white/10 shrink-0" />
                    </div>
                </div>
                <div className="flex-1 overflow-hidden relative">
                    <div className="absolute inset-0 flex flex-col animate-marquee-smooth will-change-transform">
                      {[...tributes, ...tributes].map((item, i) => (
                         <div key={i} className="flex flex-col space-y-1 mb-8 shrink-0">
                           <div className="flex items-center justify-between w-full">
                             <p className="text-[10px] text-white/80 font-bold tracking-widest uppercase truncate max-w-[80%]">✦ {item.name}</p>
                             <img src={`https://flagcdn.com/w40/${item.code}.png`} alt={item.loc} className="w-8 h-5 object-cover rounded-sm border border-white/10" />
                           </div>
                           <p className="text-[8px] text-[#b38f4a] opacity-50 uppercase tracking-tighter">{item.loc}</p>
                         </div>
                      ))}
                    </div>
                </div>
             </div>
             <div className="absolute -bottom-16 left-0 w-full px-[2px]">
                <button onClick={triggerTribute} className="relative group w-full active:scale-[0.98] transition-all duration-300 rounded-sm overflow-hidden shadow-lg outline-none">
                    <div className="absolute -inset-1 bg-[#b38f4a] opacity-20 group-hover:opacity-40 blur-sm transition duration-500"></div>
                    <div className="relative py-3 text-[#1a1103] font-bold uppercase tracking-[0.3em] text-[10px] flex items-center justify-center border border-[#b38f4a]/30 shadow-[inset_0_1px_2px_rgba(255,255,255,0.4)]" style={{ backgroundImage: imperialGold }}>Seal Influence - $10</div>
                </button>
             </div>
          </div>
        </div>

        <div className="mt-24 flex flex-col items-center w-full relative transform -translate-y-[20px]">
           <div className="absolute -top-[45px] left-0 right-0 flex justify-center items-center pointer-events-none">
              <p className="text-[10px] md:text-xs tracking-[0.5em] uppercase font-medium text-[#b38f4a] opacity-70 italic whitespace-nowrap">
                 The Most Expensive Button in History
              </p>
           </div>
           <button onClick={handleClaim} className="relative group w-full max-w-sm active:scale-[0.98] transition-all duration-500 rounded-sm overflow-hidden shadow-2xl outline-none">
             <div className="absolute -inset-1 bg-gradient-to-r from-[#7a5210] via-[#b38f4a] to-[#7a5210] opacity-50 group-hover:opacity-100 blur-md transition duration-700"></div>
             <div className="relative py-4 text-[#1a1103] font-black uppercase tracking-[0.4em] text-xs flex items-center justify-center h-full border border-[#b38f4a]/30 shadow-[0_5px_15px_rgba(0,0,0,0.5),inset_0_2px_3px_rgba(255,255,255,0.6),inset_0_-2px_3px_rgba(0,0,0,0.8)]" style={{ backgroundImage: imperialGold }}>
                 Claim The Throne
             </div>
           </button>
        </div>
      </div>

      <div className="absolute bottom-4 left-10 flex items-center gap-6 z-20">
         <button onClick={() => router.push('/share')} className="text-[9px] tracking-[0.5em] uppercase text-[#b38f4a]/50 hover:text-white transition-all font-bold">Share</button>
         <div className="h-2 w-[1px] bg-[#b38f4a]/20"></div>
         <button className="text-[9px] tracking-[0.5em] uppercase text-[#b38f4a]/50 hover:text-white transition-all font-bold">Live Stream</button>
         <div className="h-2 w-[1px] bg-[#b38f4a]/20"></div>
         <button onClick={() => router.push('/history')} className="text-[9px] tracking-[0.5em] uppercase text-[#b38f4a]/50 hover:text-white transition-all font-bold">History</button>
      </div>

      <style jsx global>{`
        @keyframes slideUpGold { from { transform: translateY(15px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        .animate-slide-up-gold { animation: slideUpGold 0.6s cubic-bezier(0.23, 1, 0.32, 1) forwards; }
        @keyframes marqueeSmooth { 0% { transform: translateY(0); } 100% { transform: translateY(-50%); } }
        .animate-marquee-smooth { animation: marqueeSmooth 60s linear infinite; }
        @keyframes marqueeSeamless { 0% { transform: translate3d(100%, 0, 0); } 100% { transform: translate3d(-100%, 0, 0); } }
        .animate-marquee-seamless { display: flex; animation: marqueeSeamless 35s linear infinite; will-change: transform; }
        @keyframes flashEffect { 0%, 100% { filter: brightness(1); } 50% { filter: brightness(1.5); } }
        .animate-price-pulse { animation: flashEffect 2s ease-in-out infinite; }
        @keyframes crownDrop { 0% { transform: translateY(-500px); opacity: 0; } 60% { transform: translateY(0); opacity: 1; } 100% { transform: translateY(150px) scale(1.5); opacity: 0; } }
        .animate-crown-drop { animation: crownDrop 5s cubic-bezier(0.4, 0, 0.2, 1) forwards; }
        @keyframes imperialPulse { 0% { transform: translate(-50%, -50%) scale(0); opacity: 1; } 100% { transform: translate(-50%, -50%) scale(80); opacity: 0; } }
        .animate-imperial-pulse { animation: imperialPulse 1.2s ease-out 4.9s forwards; }
        @keyframes screenShake { 0%, 100% { transform: translate3d(0, 0, 0); } 5%, 15%, 25%, 35%, 45% { transform: translate3d(-10px, -10px, 0); } 10%, 20%, 30%, 40%, 50% { transform: translate3d(10px, 10px, 0); } }
        .animate-screen-shake { animation: screenShake 0.6s cubic-bezier(.36,.07,.19,.97) both; }
        @keyframes goldFloat { 0% { transform: translateY(0); opacity: 0; } 50% { opacity: 0.8; } 100% { transform: translateY(-100px); opacity: 0; } }
        .animate-gold-float { animation: goldFloat linear infinite; }
        @keyframes proclamation { 0% { opacity: 0; transform: scale(0.9); } 20% { opacity: 1; transform: scale(1); } 80% { opacity: 1; } 100% { opacity: 0; } }
        .animate-proclamation { animation: proclamation 4s ease-in-out forwards; }
      `}</style>
    </main>
  );
}

export default function Home() {
  return (
    <Suspense fallback={null}>
      <HomeContent />
    </Suspense>
  );
}