// @ts-nocheck
"use client";
import React, { useState, useEffect, useRef, Suspense, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../lib/supabaseClient';
import { Crown, Menu, X } from 'lucide-react';

function HomeContent() {

const router = useRouter();
const [buyers, setBuyers] = useState(0);
const LIKES_BASE = 756567;
const [likes, setLikes] = useState(LIKES_BASE);
const [userCountry, setUserCountry] = useState("Monaco");
const [isShaking, setIsShaking] = useState(false);
const [isHeartBeating, setIsHeartBeating] = useState(false);
const [isCoronating, setIsCoronating] = useState(false);
const [mounted, setMounted] = useState(false);
const [isMenuOpen, setIsMenuOpen] = useState(false);
const [isRulesOpen, setIsRulesOpen] = useState(false);

const MIN_VIEWERS = 123452; 
const TARGET_BASE = 124500; 
const [onlineViewers, setOnlineViewers] = useState(TARGET_BASE); 
const canvasRef = useRef<HTMLCanvasElement>(null);

const [currentSovereign, setCurrentSovereign] = useState<any>({
  name: "ALEXANDER VON BERG",
  image_url: "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7",
  subtitle: "Success is a choice"
});

const [allSovereigns, setAllSovereigns] = useState([]);

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
  { name: "Liam o'Connor", msg: "The throne awaits", loc: "Dublin", code: "ie" },
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

const [realTributes, setRealTributes] = useState(tributes);
const [latestTribute, setLatestTribute] = useState(tributes[0]);
const [activities, setActivities] = useState([
  { id: 1, text: "Sovereign presence detected: Zurich", isNew: false },
  { id: 2, text: "Legacy valuation oscillating: Dubai", isNew: false },
  { id: 3, text: "Imperial link established: London", isNew: false },
  { id: 4, text: "Throne connectivity active: Tokyo", isNew: false },
  { id: 5, text: "Wealth frequency stabilized: Singapore", isNew: false }
]);

const currentPrice = useMemo(() => {
  return Math.round(10 * Math.pow(1.1, buyers)).toLocaleString('en-US', {
    style: 'currency', currency: 'USD', maximumFractionDigits: 0
  });
}, [buyers]);

const imperialGold = `linear-gradient(110deg, #2a1a05 0%, #7a5210 25%, #b38f4a 45%, #e6c68b 50%, #b38f4a 55%, #7a5210 75%, #2a1a05 100%)`;

const fetchSovereignWall = async () => {
  const { data } = await supabase.from('sovereigns').select('name, image_url, subtitle').order('id', { ascending: false }).limit(20);
  if (data) setAllSovereigns(data);
};

const fetchHeartWall = async () => {
  const { data: hwData } = await supabase.from('heart_wall').select('name, country_code').order('id', { ascending: false }).limit(15);
  if (hwData && hwData.length > 0) {
    const mapped = hwData.map(h => ({ 
        ...tributes[0], 
        name: h.name || "Anonymous",
        loc: "Global", 
        code: h.country_code || "un"
    }));
    setRealTributes(mapped.length < 3 ? [...mapped, ...tributes.slice(0, 3 - mapped.length)] : mapped);
    setLatestTribute(mapped[0]);
  }
};

useEffect(() => {
  setMounted(true);
  let channel;

  const fetchData = async () => {
    try {
      const { count: sovCount } = await supabase.from('sovereigns').select('*', { count: 'exact', head: true });
      if (sovCount !== null) setBuyers(sovCount);
      
      const { data: sovData } = await supabase.from('sovereigns').select('name, image_url, subtitle').order('id', { ascending: false }).limit(1);
      if (sovData && sovData.length > 0) setCurrentSovereign(sovData[0]);
      
      const { count: likesCount } = await supabase.from('likes').select('*', { count: 'exact', head: true });
      if (likesCount !== null) setLikes(LIKES_BASE + likesCount);

      await fetchHeartWall();
      await fetchSovereignWall();

    } catch (e) { console.log("Init sync error:", e); }
  };

  fetchData();

  channel = supabase.channel('home-live-sync')
    .on('postgres_changes', { event: '*', table: 'sovereigns' }, async (payload) => {
      // 1. עדכון כמות קונים מיידי מה-DB כדי לסנכרן מחיר בכל הדפים
      const { count } = await supabase.from('sovereigns').select('*', { count: 'exact', head: true });
      if (count !== null) setBuyers(count);

      // 2. עדכון הריבון החדש והפעלת הכתר
      if (payload.new && payload.new.image_url) {
          setCurrentSovereign(payload.new);
      } else {
          const { data } = await supabase.from('sovereigns').select('name, image_url, subtitle').order('id', { ascending: false }).limit(1);
          if (data && data[0]) setCurrentSovereign(data[0]);
      }
      
      await fetchSovereignWall();
      setIsCoronating(true);
      setTimeout(() => setIsCoronating(false), 5000);
    })
    .on('postgres_changes', { event: 'INSERT', table: 'likes' }, () => {
      supabase.from('likes').select('*', { count: 'exact', head: true }).then(({ count }) => {
        if (count !== null) setLikes(LIKES_BASE + count);
      });
    })
    .on('postgres_changes', { event: 'INSERT', table: 'heart_wall' }, () => {
      fetchHeartWall();
    })
    .subscribe();

  fetch('https://ipapi.co/json/').then(res => res.json()).then(data => { if(data.country_name) setUserCountry(data.country_name); }).catch(() => {});

  const viewerInterval = setInterval(() => {
    setOnlineViewers(prev => {
      const fluctuation = Math.floor(Math.random() * 500) - 200;
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

  return () => { 
      clearInterval(viewerInterval); 
      clearInterval(activityInterval); 
      if (channel) supabase.removeChannel(channel);
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
  window.createFirework = (x, y) => {
    const colors = ['#D4AF37', '#FBF5B7', '#FFD700', '#E6C68B', '#FFFFFF'];
    for (let i = 0; i < 120; i++) particles.push(new Particle(x, y, colors[Math.floor(Math.random() * colors.length)]));
  };
  return () => { cancelAnimationFrame(animationFrame); window.removeEventListener('resize', resize); };
}, [mounted]);

const handleClaim = () => router.push('/upload');
const triggerTribute = () => router.push('/seal');
const triggerGift = () => router.push('/upload?mode=gift');
const handleLike = () => {
  supabase.from('likes').insert([{ created_at: new Date() }]).then(() => {});
  setIsHeartBeating(true);
  setTimeout(() => setIsHeartBeating(false), 600);
  const newEntry = { id: Date.now(), text: `Imperial Allegiance Sworn: ${userCountry}`, isNew: true };
  setActivities(prev => [...prev.slice(-9), newEntry]);
  if (window.createFirework) { window.createFirework(window.innerWidth * 0.15, window.innerHeight * 0.7); }
};

if (!mounted) return null;

return (
  <main className={`h-screen w-full bg-black text-white flex flex-col items-center justify-start overflow-hidden font-serif relative select-none caret-transparent outline-none transition-transform duration-100 ${isShaking ? 'animate-screen-shake' : ''}`}>
    <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-[100]" style={{ mixBlendMode: 'screen' }} />
    
    <div className="hidden md:block w-full h-full relative">
        <div className="absolute inset-0 z-0 pointer-events-none" style={{ backgroundImage: "url('/bg.jpg')", backgroundSize: 'cover', backgroundPosition: 'center', filter: 'brightness(0.4) contrast(110%)' }}></div>
        <div className="absolute inset-0 z-[1] pointer-events-none overflow-hidden">
          {goldParticles.map((p, i) => (
            <div key={i} className="absolute rounded-full animate-gold-float" style={{ width: p.width, height: p.height, top: p.top, left: p.left, backgroundColor: '#D4AF37', opacity: p.opacity, animationDuration: p.duration }} />
          ))}
        </div>

        <header className="absolute top-10 left-10 z-20 flex flex-col items-start">
          <h1 className="text-5xl font-serif font-black italic tracking-[0.3em] bg-clip-text text-transparent" style={{ backgroundImage: imperialGold }}>NGC</h1>
          <div className="flex items-center mt-2 space-x-3 opacity-90 text-left">
              <div className="h-[1px] w-6" style={{ backgroundImage: `linear-gradient(to right, #b38f4a, transparent)` }}></div>
              <p className="text-[10px] tracking-[0.4em] uppercase font-medium" style={{ color: '#b38f4a' }}>The Sovereign Asset</p>
          </div>
        </header>

        <div className="absolute top-10 right-10 z-20 flex flex-col items-center text-right">
           <div className="flex items-center space-x-2 bg-black/60 px-4 py-1.5 rounded-full border border-[#b38f4a]/30 backdrop-blur-2xl">
              <div className="w-2.5 h-2.5 rounded-full bg-red-600 animate-pulse shadow-[0_0_12px_red]"></div>
              <span className="text-[10px] tracking-[0.4em] uppercase font-black text-white">Live</span>
           </div>
           <p className="mt-2 text-xl font-mono font-black text-white tracking-tighter transition-all duration-1000 ease-in-out text-right">
              {onlineViewers.toLocaleString()}
           </p>
           <p className="text-[8px] uppercase tracking-[0.4em] text-[#b38f4a] font-bold opacity-80 text-right">LIVE GLOBAL AUDIENCE</p>
        </div>

        <div className="absolute top-[72px] left-0 right-0 z-20 flex flex-col items-center pointer-events-none opacity-40 text-center">
              <p className="text-[10px] tracking-[0.6em] uppercase font-light italic leading-[2] text-white">To take the throne, <br/> outvalue the current Sovereign by 10%. <br/> Your legacy remains until a greater tribute is paid.</p>
        </div>

        {isCoronating && (
          <div className="fixed inset-0 z-[1000] flex flex-col items-center justify-center pointer-events-none text-center">
              <div className="absolute inset-0 bg-black/95 animate-fade-in"></div>
              <p className="z-[1001] text-2xl tracking-[0.8em] uppercase text-white font-light italic animate-proclamation">A New Sovereign Ascends</p>
              <img src="/crown.png" alt="Crown" className="absolute top-0 z-[1002] animate-crown-drop w-1/3 filter drop-shadow-[0_0_50px_#D4AF37] brightness-125 contrast-110" />
          </div>
        )}

        <div className={`w-full h-full flex flex-col items-center justify-start z-10 pt-36 transition-opacity duration-1000 ${isCoronating ? 'opacity-10' : 'opacity-100'}`}>
          <div className="flex items-start justify-center gap-10 w-[98vw] max-w-[1750px] relative h-[50vh]">
            
            <div className="hidden xl:flex flex-col w-64 h-full relative overflow-visible text-left">
               <div className="flex flex-col h-full rounded-sm border border-[#b38f4a]/30 relative overflow-hidden shadow-2xl" style={{ backgroundImage: `linear-gradient(110deg, #2a1a05, #1a1103, #2a1a05)`, padding: '2px' }}>
                  <div className="bg-black/90 h-full w-full p-4 flex flex-col border border-[#b38f4a]/10 text-left">
                      <h4 className="text-[10px] tracking-[0.3em] uppercase text-[#e6c68b] border-b border-[#b38f4a]/20 pb-2 mb-2 font-bold text-left">Global Pulse</h4>
                      <div className="mb-4 py-2 border-b border-[#b38f4a]/10 flex flex-col items-start text-left">
                          <p className="text-[8px] uppercase tracking-widest text-[#b38f4a] opacity-70 text-left">The Royal Pulse</p>
                          <p className="text-lg font-mono font-black text-white tracking-tighter text-left">{likes.toLocaleString()}</p>
                      </div>
                      <div className="flex-1 overflow-hidden relative flex flex-col justify-end text-left">
                          <div className="flex flex-col gap-2 text-left">
                             {activities.map((item) => (
                               <p key={item.id} className={`text-[9px] h-6 tracking-widest opacity-90 italic flex items-center animate-slide-up-gold ${item.isNew ? 'text-[#D4AF37] font-bold' : 'text-white'} text-left`}>{item.text}</p>
                             ))}
                          </div>
                      </div>
                  </div>
               </div>
               <div className="absolute -bottom-[132px] left-0 w-64 h-32 pointer-events-auto">
                  <div className="flex flex-col text-left absolute left-0 top-0">
                      <span className="text-[10px] uppercase tracking-[0.2em] text-[#b38f4a] font-bold text-left">Endorse the</span>
                      <span className="text-[12px] uppercase tracking-[0.3em] text-white font-black leading-none text-left">Imperial Asset</span>
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
                  <h3 className="text-xl md:text-2xl font-black tracking-wider text-[#1a1103] drop-shadow-[0_1px_1px_rgba(255,255,255,0.3)] text-center">{currentPrice}</h3>
              </div>
              <div className="h-full w-full rounded-sm overflow-hidden relative border-[1px] border-[#D4AF37]/20 pb-14" style={{ backgroundColor: '#000000' }}>
                {currentSovereign?.image_url && currentSovereign.image_url !== "" ? (
                  <img src={currentSovereign.image_url} alt="NGC" className="w-full h-full object-contain relative z-10 contrast-115 brightness-95" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-center"><Crown size={60} className="text-[#b38f4a] opacity-20" /></div>
                )}
                <div className="absolute bottom-0 left-0 right-0 h-16 z-30 flex items-center justify-center text-center">
                  <div className="w-full h-full backdrop-blur-md bg-black/70 border-t-2 border-[#FBF5B7]/50 shadow-[inset_0_5px_15px_rgba(212,175,55,0.2)] flex flex-col items-center justify-center overflow-hidden">
                      <h2 className="text-sm tracking-[0.3em] uppercase font-black text-[#FBF5B7]">{currentSovereign.name || "The Sovereign"}</h2>
                      <div className="h-[1px] w-8 bg-[#D4AF37] my-1 opacity-50"></div>
                      <div className="relative flex w-full overflow-hidden text-center">
                        <div className="flex animate-marquee-seamless whitespace-nowrap min-w-full">
                            <p className="text-[#D4AF37] text-[9px] md:text-[10px] tracking-[0.4em] italic uppercase font-medium opacity-80 px-4 text-center">
                              {currentSovereign.subtitle} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; {currentSovereign.subtitle} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; {currentSovereign.subtitle}
                            </p>
                        </div>
                      </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="hidden xl:flex flex-col w-64 h-full rounded-sm border border-[#b38f4a]/30 relative overflow-visible shadow-2xl text-left" style={{ backgroundImage: `linear-gradient(110deg, #2a1a05, #1a1103, #2a1a05)`, padding: '2px' }}>
               <div className="bg-black/90 h-full w-full p-4 flex flex-col border border-[#b38f4a]/10 text-left">
                  <h4 className="text-[10px] tracking-[0.3em] uppercase text-[#e6c68b] border-b border-[#b38f4a]/20 pb-2 mb-2 font-bold text-left">HEART WALL</h4>
                  <div className="mb-4 py-2 border-b border-[#b38f4a]/10 flex flex-col items-start text-left">
                      <p className="text-[8px] uppercase tracking-widest text-[#b38f4a] opacity-70 text-left">The Reigning Sovereign</p>
                      <div className="flex items-center space-x-2 mt-1 w-full overflow-hidden text-left">
                         <p className="text-lg font-mono font-black text-[#D4AF37] tracking-tighter truncate text-left">{latestTribute.name}</p>
                         <img src={`https://flagcdn.com/w40/${latestTribute.code}.png`} alt="flag" className="w-6 h-4 object-cover rounded-sm border border-white/10 shrink-0" />
                      </div>
                  </div>
                  <div className="flex-1 overflow-hidden relative">
                      <div className="absolute inset-0 flex flex-col animate-marquee-smooth will-change-transform text-left">
                        {[...realTributes, ...realTributes].map((item, i) => (
                           <div key={i} className="flex flex-col space-y-1 mb-8 shrink-0 text-left">
                             <div className="flex items-center justify-between w-full text-left">
                               <p className="text-[10px] text-white/80 font-bold tracking-widest uppercase truncate max-w-[80%] text-left">✦ {item.name}</p>
                               <img src={`https://flagcdn.com/w40/${item.code}.png`} alt={item.loc} className="w-8 h-5 object-cover rounded-sm border border-white/10 text-right" />
                             </div>
                             <p className="text-[8px] text-[#b38f4a] opacity-50 uppercase tracking-tighter text-left">{item.loc}</p>
                           </div>
                        ))}
                      </div>
                  </div>
               </div>
               <div className="absolute -bottom-[110px] left-0 w-full px-[2px] flex flex-col gap-3 pointer-events-auto z-50">
                  <button onClick={triggerTribute} className="relative group w-full active:scale-[0.98] transition-all duration-300 rounded-sm overflow-hidden shadow-lg outline-none">
                      <div className="absolute -inset-1 bg-[#b38f4a] opacity-20 group-hover:opacity-40 blur-sm transition duration-500"></div>
                      <div className="relative py-3 text-[#1a1103] font-bold uppercase tracking-[0.3em] text-[10px] flex items-center justify-center border border-[#b38f4a]/30 shadow-[inset_0_1px_2px_rgba(255,255,255,0.4)]" style={{ backgroundImage: imperialGold }}>Seal Influence - $25</div>
                  </button>
                  <button onClick={triggerGift} className="relative group w-full active:scale-[0.98] transition-all duration-300 rounded-sm overflow-hidden shadow-lg outline-none">
                      <div className="absolute -inset-1 bg-[#b38f4a] opacity-20 group-hover:opacity-40 blur-sm transition duration-500"></div>
                      <div className="relative py-3 text-[#1a1103] font-bold uppercase tracking-[0.3em] text-[10px] flex items-center justify-center border border-[#b38f4a]/30 shadow-[inset_0_1px_2px_rgba(255,255,255,0.4)]" style={{ backgroundImage: imperialGold }}>Crown a Loved One - $25</div>
                  </button>
               </div>
            </div>
          </div>

          <div className="mt-24 flex flex-col items-center w-full relative transform -translate-y-[20px]">
             <div className="absolute -top-[45px] left-0 right-0 flex justify-center items-center pointer-events-none text-center">
                <p className="text-[10px] md:text-xs tracking-[0.5em] uppercase font-medium text-[#b38f4a] opacity-70 italic whitespace-nowrap text-center">
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

        <div className="absolute bottom-10 left-10 flex flex-col gap-3 z-20">
           <div className="flex items-center gap-6">
              <button onClick={() => router.push('/share')} className="text-[9px] tracking-[0.5em] uppercase text-[#b38f4a]/50 hover:text-white transition-all font-bold">Share</button>
              <button onClick={() => router.push('/live')} className="text-[9px] tracking-[0.5em] uppercase text-[#b38f4a]/50 hover:text-white transition-all font-bold">Live Stream</button>
              <button onClick={() => router.push('/history')} className="text-[9px] tracking-[0.5em] uppercase text-[#b38f4a]/50 hover:text-white transition-all font-bold">History</button>
           </div>
           <div className="flex items-center gap-4">
              <button onClick={() => router.push('/terms')} className="text-[7px] tracking-[0.4em] uppercase text-white/30 hover:text-white transition-all">Terms</button>
              <button onClick={() => router.push('/privacy')} className="text-[7px] tracking-[0.4em] uppercase text-white/30 hover:text-white transition-all">Privacy</button>
              <button onClick={() => router.push('/accessibility')} className="text-[7px] tracking-[0.4em] uppercase text-white/30 hover:text-white transition-all">Accessibility</button>
           </div>
        </div>
        <div className="absolute bottom-4 right-10 flex items-center z-20">
           <button onClick={() => router.push('/broadcast')} className="text-[9px] tracking-[0.5em] uppercase text-[#b38f4a] hover:text-white transition-all font-black">Imperial Live</button>
        </div>
    </div>

    <div className="block md:hidden w-full h-full relative overflow-hidden bg-black text-left font-serif">
        <div className="fixed top-0 left-0 right-0 z-[1100] bg-black/80 backdrop-blur-xl border-b border-[#b38f4a]/10 px-4 py-4 flex justify-between items-center text-left">
            <div className="flex flex-col text-left">
              <h1 className="text-3xl font-serif font-black italic tracking-[0.1em] bg-clip-text text-transparent" style={{ backgroundImage: imperialGold }}>NGC</h1>
              <p className="text-[7px] tracking-[0.2em] uppercase text-[#b38f4a] text-left">Sovereign Asset</p>
            </div>
            <button onClick={() => setIsMenuOpen(true)} className="p-2 text-[#b38f4a] outline-none active:scale-90 transition-transform">
               <Menu size={28} />
            </button>
        </div>

        {isMenuOpen && (
          <div className="fixed inset-0 z-[2000] bg-black/95 backdrop-blur-2xl flex flex-col items-center justify-center animate-fade-in text-white text-center">
              <button onClick={() => setIsMenuOpen(false)} className="absolute top-10 right-10 text-[#b38f4a] text-right"><X size={32} /></button>
              <nav className="flex flex-col gap-10 text-center">
                  <button onClick={() => { setIsRulesOpen(true); setIsMenuOpen(false); }} className="text-lg tracking-[0.4em] uppercase text-[#b38f4a] font-black italic">CLAIM THE THRONE</button>
                  <button onClick={() => { router.push('/history'); setIsMenuOpen(false); }} className="text-lg tracking-[0.4em] uppercase text-white font-light">History</button>
                  <button onClick={() => { router.push('/live'); setIsMenuOpen(false); }} className="text-lg tracking-[0.4em] uppercase text-white font-light">Live Stream</button>
                  <button onClick={() => { router.push('/share'); setIsMenuOpen(false); }} className="text-lg tracking-[0.4em] uppercase text-white font-light">Share</button>
                  <button onClick={() => { router.push('/broadcast'); setIsMenuOpen(false); }} className="text-lg tracking-[0.4em] uppercase text-white font-light">Imperial Live</button>
              </nav>
          </div>
        )}

        {isRulesOpen && (
          <div className="fixed inset-0 z-[3000] bg-black/98 backdrop-blur-3xl flex flex-col items-center justify-center p-8 animate-fade-in text-center">
              <button onClick={() => setIsRulesOpen(false)} className="absolute top-10 right-10 text-[#b38f4a] text-right"><X size={32} /></button>
              <div className="flex flex-col items-center gap-6 w-full max-w-[280px]">
                  <Crown size={50} className="text-[#b38f4a] animate-pulse" />
                  <h2 className="text-xl font-serif font-black italic tracking-[0.15em] text-white uppercase text-center">TO TAKE THE THRONE</h2>
                  <p className="text-sm tracking-[0.25em] uppercase text-white font-light italic leading-relaxed text-center">OUTVALUE THE CURRENT SOVEREIGN BY 10%.</p>
                  <button onClick={() => setIsRulesOpen(false)} className="mt-6 py-2.5 px-8 text-[#1a1103] font-black uppercase tracking-widest text-[10px] rounded-sm text-center" style={{ backgroundImage: imperialGold }}>Understood</button>
              </div>
          </div>
        )}

        <div className="absolute inset-0 pt-20 pb-44 flex flex-col items-center overflow-y-auto">
            <div className="relative w-full aspect-square border-y border-[#b38f4a]/20 shrink-0">
                <div className="h-full w-full bg-black relative flex flex-col">
                    <div className="absolute top-4 left-4 z-50 flex flex-col items-start opacity-90 scale-90 text-left">
                        <div className="flex items-center space-x-1.5 bg-black/40 px-2 py-0.5 rounded-full border border-[#b38f4a]/20 text-left">
                            <div className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse text-left"></div>
                            <span className="text-[8px] tracking-[0.1em] uppercase font-medium text-white text-left">Live</span>
                        </div>
                        <p className="text-sm font-mono text-white mt-0.5 ml-1 text-left">{onlineViewers.toLocaleString()}</p>
                    </div>
                    {currentSovereign?.image_url ? (
                      <img src={currentSovereign.image_url} alt="NGC" className="w-full h-full object-contain" />
                    ) : <div className="flex-1 flex items-center justify-center text-left"><Crown size={40} className="text-[#b38f4a]/20 text-left" /></div>}
                    <div className="absolute top-4 right-4 z-40 px-12 py-2 min-w-[140px] text-center rounded-sm" style={{ backgroundImage: imperialGold }}>
                        <span className="text-base font-black text-[#1a1103] whitespace-nowrap text-center">{currentPrice}</span>
                    </div>
                    <div className="absolute bottom-28 right-4 z-50 flex flex-col items-end gap-1.5 max-w-[160px] text-right pointer-events-none">
                        {realTributes.slice(0, 3).map((item, i) => (
                          <div key={`${item.name}-${i}`} className="border-r-2 border-[#b38f4a] px-3 py-0.5 w-full animate-slide-up-gold text-right">
                              <p className="text-[8px] text-white font-bold tracking-wider truncate uppercase drop-shadow-[0_2px_4px_rgba(0,0,0,1)] text-right">{item.name}</p>
                          </div>
                        ))}
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black via-black/90 to-transparent flex justify-between items-end text-left">
                        <div className="flex flex-col text-left flex-1 mr-4 overflow-hidden text-left">
                            <h2 className="text-sm tracking-[0.3em] uppercase font-black text-[#FBF5B7] text-left">{currentSovereign.name}</h2>
                            <div className="relative flex w-full overflow-hidden mt-2 text-left">
                              <div className="flex animate-marquee-seamless whitespace-nowrap min-w-full text-left">
                                  <p className="text-[#D4AF37] text-[9px] tracking-[0.4em] italic uppercase font-medium opacity-90 text-left text-center">
                                    {currentSovereign.subtitle} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; {currentSovereign.subtitle} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; {currentSovereign.subtitle}
                                  </p>
                              </div>
                            </div>
                        </div>
                        <div className="flex flex-col items-center shrink-0 text-right">
                            <button onClick={handleLike} className={`text-3xl transition-transform duration-300 ${isHeartBeating ? 'scale-125' : 'scale-100'} text-right`}>
                              <span className="drop-shadow-[0_0_15px_rgba(255,0,0,0.6)] text-right" style={{ color: '#FF0000' }}>❤</span>
                            </button>
                            <span className="text-[10px] font-mono text-white/60 mt-1 text-right">{likes.toLocaleString()}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="w-full p-4 space-y-12 pb-24 bg-black text-left">
                <section>
                    <h3 className="text-[10px] tracking-[0.4em] uppercase text-[#e6c68b] border-b border-[#b38f4a]/20 pb-2 mb-4 font-bold text-left">Past Sovereigns</h3>
                    <div className="grid grid-cols-2 gap-3 text-center">
                      {allSovereigns.map((sov, i) => (
                        <div key={i} className="relative aspect-square rounded-sm overflow-hidden border border-[#b38f4a]/30 bg-[#0a0a0a] shadow-lg">
                          <img src={sov.image_url} alt={sov.name} className="w-full h-full object-cover opacity-70" />
                          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80"></div>
                          <div className="absolute bottom-1.5 left-1.5 right-1.5 text-center">
                              <p className="text-[7px] font-bold uppercase truncate text-white/90 text-center">{sov.name}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                </section>
            </div>
        </div>
        <div className="fixed bottom-0 left-0 right-0 z-[1000] p-4 bg-black/90 backdrop-blur-xl border-t border-[#b38f4a]/20 flex flex-col gap-3 text-center">
            <button onClick={handleClaim} className="w-full py-5 text-[#1a1103] font-black uppercase tracking-[0.3em] text-[12px] border border-[#b38f4a]/40 rounded-sm shadow-[0_0_15px_rgba(179,143,74,0.3)] text-center" style={{ backgroundImage: imperialGold }}>Claim The Throne</button>
            <div className="grid grid-cols-2 gap-3 text-center">
                <button onClick={triggerTribute} className="py-4 text-[#b38f4a] border border-[#b38f4a]/30 text-[9px] uppercase tracking-widest font-bold bg-black shadow-lg text-center">Seal Influence</button>
                <button onClick={triggerGift} className="py-4 text-[#b38f4a] border border-[#b38f4a]/30 text-[9px] uppercase tracking-widest font-bold bg-black shadow-lg text-center">Crown Loved One</button>
            </div>
        </div>
    </div>

    <style jsx global>{`
      @keyframes slideUpGold { from { transform: translateY(15px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
      .animate-slide-up-gold { animation: slideUpGold 0.6s cubic-bezier(0.23, 1, 0.32, 1) forwards; }
      @keyframes marqueeSeamless { 0% { transform: translate3d(100%, 0, 0); } 100% { transform: translate3d(-100%, 0, 0); } }
      .animate-marquee-seamless { display: flex; animation: marqueeSeamless 30s linear infinite; will-change: transform; }
      @keyframes marqueeSmooth { 0% { transform: translateY(0); } 100% { transform: translateY(-50%); } }
      .animate-marquee-smooth { animation: marqueeSmooth 60s linear infinite; }
      @keyframes flashEffect { 0%, 100% { filter: brightness(1); } 50% { filter: brightness(1.5); } }
      .animate-price-pulse { animation: flashEffect 2s ease-in-out infinite; }
      @keyframes crownDrop { 0% { transform: translateY(-500px); opacity: 0; } 60% { transform: translateY(0); opacity: 1; } 100% { transform: translateY(150px) scale(1.5); opacity: 0; } }
      .animate-crown-drop { animation: crownDrop 5s cubic-bezier(0.4, 0, 0.2, 1) forwards; }
      @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
      .animate-fade-in { animation: fadeIn 0.3s ease-out forwards; }
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