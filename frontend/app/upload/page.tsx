// @ts-nocheck
'use client';
import { useState, useRef, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '../../lib/supabaseClient'; // שימוש בלקוח המשותף
import ReactCrop, { type Crop, centerCrop, makeAspectCrop, PixelCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css'; 
import { Upload, CheckCircle2, Shield, Minus, Plus, Crown } from 'lucide-react';

function ImperialUploadContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isTribute = searchParams.get('type') === 'tribute';
  const isGift = searchParams.get('mode') === 'gift';
  
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState<Crop>();
  const [zoom, setZoom] = useState(1);
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const [croppedImage, setCroppedImage] = useState<string | null>(null);
  const [status, setStatus] = useState<'idle' | 'details' | 'preview' | 'success'>('idle');
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [isShaking, setIsShaking] = useState(false);
  const [isCoronating, setIsCoronating] = useState(false);
  const [dynamicPrice, setDynamicPrice] = useState(25);
  const [mounted, setMounted] = useState(false); 
  
  const imgRef = useRef<HTMLImageElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const imperialGold = `linear-gradient(110deg, #2a1a05 0%, #7a5210 25%, #b38f4a 45%, #e6c68b 50%, #b38f4a 55%, #7a5210 75%, #2a1a05 100%)`;

  useEffect(() => {
    let ignore = false;
    setMounted(true);
    
    const fetchCurrentPrice = async () => {
      if (isTribute || isGift) {
        setDynamicPrice(25);
        return;
      }
      const { count } = await supabase.from('sovereigns').select('*', { count: 'exact', head: true });
      if (count !== null && !ignore) {
        setDynamicPrice(Math.round(10 * Math.pow(1.1, count)));
      }
    };
    fetchCurrentPrice();

    const paymentStatus = searchParams.get('payment');
    if (paymentStatus === 'success' && !ignore) {
      setStatus('success');
      setIsShaking(true);
      setIsCoronating(true);
      window.history.replaceState({}, '', window.location.pathname);

      const audio = new Audio('/victory.mp3');
      audio.volume = 0.6;
      audio.play().catch(e => console.log("Audio interaction wait"));

      setTimeout(() => setIsShaking(false), 1000);
      setTimeout(() => setIsCoronating(false), 8000);
    }

    return () => { ignore = true; };
  }, [searchParams, isTribute, isGift]);

  useEffect(() => {
    if (status !== 'success' || !mounted) return;
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true }); if (!ctx) return;
    let particles: any[] = []; let animationFrame: number;
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    window.addEventListener('resize', resize); resize();

    class Particle {
      x: number; y: number; vx: number; vy: number; alpha: number; color: string; gravity: number; friction: number; size: number; decay: number;
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

    const createFirework = (x: number, y: number) => {
      const colors = ['#D4AF37', '#FBF5B7', '#FFD700', '#E6C68B', '#FFFFFF'];
      for (let i = 0; i < 120; i++) particles.push(new Particle(x, y, colors[Math.floor(Math.random() * colors.length)]));
    };

    const centerX = window.innerWidth / 2; const centerY = window.innerHeight / 2.5;
    for (let i = 0; i < 15; i++) { setTimeout(() => createFirework(centerX + (Math.random() - 0.5) * 400, centerY + (Math.random() - 0.5) * 300), i * 300); }
    return () => { cancelAnimationFrame(animationFrame); window.removeEventListener('resize', resize); };
  }, [status, mounted]);

  function onSelectFile(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files?.[0]) {
      const reader = new FileReader();
      reader.onload = () => { setImageSrc(reader.result?.toString() || null); setStatus('details'); setCrop(undefined); setZoom(1); };
      reader.readAsDataURL(e.target.files[0]);
    }
  }

  function onImageLoad(e: React.SyntheticEvent<HTMLImageElement>) {
    const { width, height } = e.currentTarget;
    if (!crop) {
      const initialCrop = centerCrop(makeAspectCrop({ unit: '%', width: 90 }, 1.7, width, height), width, height);
      setCrop(initialCrop);
    }
  }

  async function generateCroppedImg() {
    if (isGift) { setStatus('preview'); return; }
    if (!completedCrop || !imgRef.current) return;
    const image = imgRef.current;
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    canvas.width = completedCrop.width * scaleX;
    canvas.height = completedCrop.height * scaleY;
    ctx.imageSmoothingQuality = 'high';
    ctx.save();
    ctx.translate(-completedCrop.x * scaleX, -completedCrop.y * scaleY);
    const centerX = (image.width * scaleX) / 2;
    const centerY = (image.height * scaleY) / 2;
    ctx.translate(centerX, centerY);
    ctx.scale(zoom, zoom);
    ctx.translate(-centerX, -centerY);
    ctx.drawImage(image, 0, 0, image.naturalWidth, image.naturalHeight);
    ctx.restore();
    setCroppedImage(canvas.toDataURL('image/jpeg', 1.0));
    setStatus('preview');
  }

  const handleUpload = async () => {
    sessionStorage.setItem('imp_img', isGift ? '/heart.png' : (croppedImage || ''));
    sessionStorage.setItem('imp_name', title); 
    sessionStorage.setItem('imp_msg', subtitle);
    sessionStorage.setItem('imp_price', dynamicPrice.toString());
    sessionStorage.setItem('imp_type', (isTribute || isGift) ? 'tribute' : 'sovereign'); 
    
    router.push('/checkout'); 
  };

  if (!mounted) return null;

  return (
    <main className={`h-screen w-full bg-black text-white flex flex-col items-center justify-center overflow-hidden font-serif relative select-none ${isShaking ? 'animate-screen-shake' : ''}`}>
      <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-[2000]" style={{ mixBlendMode: 'screen' }} />
      <div className="absolute inset-0 z-0" style={{ backgroundImage: "url('/bg.jpg')", backgroundSize: 'cover', filter: status === 'success' ? 'brightness(0.5)' : 'brightness(0.2)', transition: 'filter 2s ease-in-out' }}></div>      
      
      {status === 'idle' && ( <div className="absolute inset-0 z-5 leather-dosage animate-in fade-in duration-1000"></div> )}

      {isCoronating && (
        <div className="fixed inset-0 z-[1000] flex flex-col items-center justify-center pointer-events-none">
            <div className="absolute inset-0 bg-black/95 animate-fade-in"></div>
            <p className="z-[1001] text-lg md:text-2xl tracking-[0.8em] uppercase text-white font-light italic animate-proclamation">A New Sovereign Ascends</p>
            <img src="/crown.png" alt="Crown" className="absolute top-0 z-[1002] animate-crown-drop w-1/2 md:w-1/3 max-w-lg filter drop-shadow-[0_0_50px_#D4AF37]" />
        </div>
      )}

      <div className="w-full max-w-[1750px] px-6 relative z-10 flex flex-col items-center h-full justify-center">
        {status === 'idle' && (
          isGift ? (
            <div className="w-full flex flex-col items-center gap-10 animate-in zoom-in-95 duration-500">
               <div className="relative w-[210px] aspect-[3/4] bg-[#050505] border-2 border-[#b38f4a]/50 rounded-[12px] flex flex-col items-center justify-center p-4 shadow-2xl overflow-hidden group">
                  <div className="absolute -top-0.5 -right-0.5 z-50 w-16 h-6 rounded-bl-md flex items-center justify-center border-l border-b border-[#b38f4a]/30" style={{ backgroundImage: imperialGold }}>
                    <h3 className="text-[10px] font-black text-[#1a1103] tracking-tighter">$25</h3>
                  </div>
                  <div className="absolute top-4 left-4 z-20"><img src="/heart.png" alt="Heart" className="w-[28px] h-[28px] object-contain" /></div>
                  <div className="absolute -bottom-2 -right-2 opacity-10 blur-[1px] rotate-12 pointer-events-none"><Crown size={80} className="text-[#b38f4a]" /></div>
                  <div className="text-center w-full z-10 px-2 mt-4">
                    <h3 className="text-lg md:text-xl tracking-[0.1em] uppercase font-black text-white leading-tight break-words">{title.split(' ')[0] || "THEIR"}</h3>
                    <h4 className="text-xs md:text-sm tracking-[0.1em] uppercase font-medium text-white/80 mt-0.5 break-words">{title.split(' ').slice(1).join(' ') || "NAME"}</h4>
                  </div>
                  <div className="absolute bottom-6 left-0 w-full text-center z-10">
                    <div className="w-12 h-[1px] bg-gradient-to-r from-transparent via-[#b38f4a]/30 to-transparent mx-auto mb-2"></div>
                    <p className="text-[7px] tracking-[0.2em] uppercase text-[#b38f4a]/70 font-bold px-3 truncate">{subtitle || "GIFT LEDGER"}</p>
                  </div>
               </div>
               <div className="w-full max-w-md space-y-6">
                 <div className="relative"><input type="text" placeholder="RECIPIENT NAME" value={title} maxLength={15} onChange={e => setTitle(e.target.value)} className="w-full bg-transparent border-b border-[#b38f4a]/20 py-2 text-center focus:outline-none focus:border-[#b38f4a] text-xs tracking-[0.4em] uppercase text-white font-bold" /></div>
                 <div className="relative"><input type="text" placeholder="GIFT MESSAGE" value={subtitle} maxLength={45} onChange={e => setSubtitle(e.target.value)} className="w-full bg-transparent border-b border-[#b38f4a]/20 py-2 text-center focus:outline-none focus:border-[#b38f4a] text-[10px] tracking-[0.3em] uppercase text-white italic" /></div>
               </div>
               <button onClick={generateCroppedImg} disabled={!title} className="w-[320px] py-4 text-[#1a1103] font-black uppercase tracking-[0.4em] text-xs shadow-2xl active:scale-95" style={{ backgroundImage: imperialGold }}>Review Gift</button>
            </div>
          ) : (
            <label className="group relative flex flex-col items-center justify-center w-[400px] h-[250px] border border-[#b38f4a]/30 bg-black/40 cursor-pointer hover:bg-[#b38f4a]/10 transition-all shadow-2xl backdrop-blur-sm">
              <Upload className="w-10 h-10 mb-4 text-[#b38f4a]/40" />
              <span className="text-[10px] tracking-[0.4em] uppercase text-gray-500 font-bold">{isTribute ? "Upload Tribute Portrait" : "Upload Portrait"}</span>
              <input type="file" className="hidden" onChange={onSelectFile} accept="image/*" />
            </label>
          )
        )}

        {status === 'details' && imageSrc && !isGift && (
          <div className="w-full flex flex-col items-center gap-6 animate-in zoom-in-95 duration-500">
            <div className="relative w-[50vw] max-w-[850px] h-[50vh] rounded-lg shadow-2xl shrink-0" style={{ padding: '4px', backgroundImage: imperialGold, boxShadow: `0 30px 60px -15px rgba(0,0,0,1), inset 1px 1px 1px rgba(255, 255, 255, 0.6)` }}>
                <div className="absolute bottom-12 -right-4 z-50 w-52 h-14 rounded-sm overflow-hidden flex items-center justify-center animate-price-pulse" style={{ backgroundImage: imperialGold }}>
                    {[...Array(4)].map((_, i) => (<div key={i} className={`absolute w-1.5 h-1.5 rounded-full bg-[#2a1a05] ${i===0?'top-1 left-1':i===1?'top-1 right-1':i===2?'bottom-1 left-1':'bottom-1 right-1'}`}></div>))}
                    <h3 className="text-2xl font-black text-[#1a1103] tracking-tighter">${dynamicPrice}</h3>
                </div>
                <div className="h-full w-full rounded-sm overflow-hidden relative border-[1px] border-[#D4AF37]/20 pb-16 bg-black flex items-center justify-center pt-2">
                  <ReactCrop crop={crop} onChange={c => setCrop(c)} onComplete={c => setCompletedCrop(c)} className="flex items-center justify-center">
                    <img ref={imgRef} src={imageSrc} onLoad={onImageLoad} style={{ transform: `scale(${zoom})`, transition: 'transform 0.1s linear', transformOrigin: 'center' }} className="max-h-[42vh] object-contain" />
                  </ReactCrop>
                  <div className="absolute bottom-0 left-0 right-0 h-14 z-30 flex items-center justify-center pointer-events-none">
                    <div className="w-full h-full backdrop-blur-md bg-black/70 border-t-2 border-[#FBF5B7]/50 shadow-[inset_0_5px_15px_rgba(212,175,55,0.2)] flex flex-col items-center justify-center overflow-hidden">
                        <h2 className="text-[10px] tracking-[0.3em] uppercase font-black text-[#FBF5B7]">{isTribute ? "Adjust Heart Frame" : "Adjust Legacy Frame"}</h2>
                        <div className="h-[1px] w-8 bg-[#D4AF37] my-1 opacity-50"></div>
                        <div className="relative flex w-full overflow-hidden marquee-seamless"><p className="text-[#D4AF37] text-[8px] tracking-[0.4em] italic uppercase px-4">{isTribute ? '"Seal Your Love in Gold"' : '"Live Forever in Gold"'}</p></div>
                    </div>
                  </div>
                </div>
            </div>
            <div className="w-full flex flex-col items-center gap-2">
              <div className="w-full max-w-md flex items-center gap-4 px-4 py-2 bg-black/40 border border-[#b38f4a]/20 rounded-full backdrop-blur-sm">
                <Minus className="w-4 h-4 text-[#b38f4a]/60" /><input type="range" min={1} max={3} step={0.1} value={zoom} onChange={(e) => setZoom(Number(e.target.value))} className="flex-1 h-1 bg-[#2a1a05] rounded-lg appearance-none cursor-pointer accent-[#b38f4a]" /><Plus className="w-4 h-4 text-[#b38f4a]/60" />
              </div>
              <label className="text-[9px] tracking-[0.3em] uppercase text-[#b38f4a]/60 font-bold italic cursor-pointer">Change Portrait<input type="file" className="hidden" onChange={onSelectFile} accept="image/*" /></label>
            </div>
            <div className="w-full max-w-md space-y-4">
              <div className="relative"><input type="text" placeholder={isTribute ? "NAME FOR THE HEART WALL" : "NAME OF THE SOVEREIGN"} value={title} maxLength={15} onChange={e => setTitle(e.target.value)} className="w-full bg-transparent border-b border-[#b38f4a]/20 py-2 pr-10 text-center focus:outline-none focus:border-[#b38f4a] text-xs tracking-[0.4em] uppercase text-white font-bold" /><span className="absolute right-0 bottom-2 text-[7px] text-[#b38f4a]/40 italic">{title.length}/15</span></div>
              <div className="relative"><input type="text" placeholder={isTribute ? "YOUR HEART MESSAGE" : "YOUR LEGACY MESSAGE"} value={subtitle} maxLength={45} onChange={e => setSubtitle(e.target.value)} className="w-full bg-transparent border-b border-[#b38f4a]/20 py-2 pr-12 text-center focus:outline-none focus:border-[#b38f4a] text-[10px] tracking-[0.3em] uppercase text-white italic" /><span className="absolute right-0 bottom-2 text-[7px] text-[#b38f4a]/40 italic">{subtitle.length}/45</span></div>
            </div>
            <button onClick={generateCroppedImg} disabled={!title} className="w-[320px] py-4 text-[#1a1103] font-black uppercase tracking-[0.4em] text-xs shadow-2xl active:scale-95" style={{ backgroundImage: imperialGold }}>{isTribute ? "Review Tribute" : "Review Ascension"}</button>
          </div>
        )}

        {status === 'preview' && (
          <div className="flex flex-col items-center animate-in fade-in zoom-in-95 duration-700 w-full">
            <div className="relative w-[50vw] max-w-[850px] h-[50vh] rounded-lg shadow-2xl select-none shrink-0" style={{ padding: '4px', backgroundImage: imperialGold, boxShadow: `0 30px 60px -15px rgba(0,0,0,1), inset 1px 1px 1px rgba(255, 255, 255, 0.6)` }}>
                <div className="absolute bottom-12 -right-4 z-50 w-52 h-14 rounded-sm overflow-hidden flex items-center justify-center animate-price-pulse" style={{ backgroundImage: imperialGold }}>
                    {[...Array(4)].map((_, i) => (<div key={i} className={`absolute w-1.5 h-1.5 rounded-full bg-[#2a1a05] ${i===0?'top-1 left-1':i===1?'top-1 right-1':i===2?'bottom-1 left-1':'bottom-1 right-1'}`}></div>))}
                    <h3 className="text-2xl font-black text-[#1a1103] tracking-tighter">${dynamicPrice}</h3>
                </div>
                <div className="h-full w-full rounded-sm overflow-hidden relative border-[1px] border-[#D4AF37]/20 pb-14 bg-black">
                  {isGift ? ( <div className="flex flex-col items-center justify-center h-full"><img src="/heart.png" className="w-32 h-32 animate-pulse" /></div> ) : ( <img src={croppedImage!} className="w-full h-full object-contain contrast-115 brightness-95" /> )}
                  <div className="absolute bottom-0 left-0 right-0 h-14 z-30 flex flex-col items-center justify-center backdrop-blur-md bg-black/70 border-t-2 border-[#FBF5B7]/50 shadow-[inset_0_5px_15px_rgba(212,175,55,0.2)]">
                        <h2 className="text-sm tracking-[0.4em] uppercase font-black text-[#FBF5B7]">{title}</h2>
                        <div className="h-[1px] w-8 bg-[#D4AF37] my-1 opacity-50"></div><div className="marquee-seamless"><p className="text-[#D4AF37] text-[10px] tracking-[0.4em] italic uppercase px-4">"{subtitle}"</p></div>
                  </div>
                </div>
            </div>
            <div className="flex gap-6 w-[400px] mt-12">
              <button onClick={() => setStatus('idle')} className="flex-1 py-4 border border-[#b38f4a]/30 text-[#b38f4a] uppercase text-[10px] font-bold">Edit</button>
              <button onClick={handleUpload} className="flex-[2] py-4 text-[#1a1103] font-black uppercase tracking-[0.4em] text-xs shadow-2xl active:scale-95 transition-all" style={{ backgroundImage: imperialGold }}>
                <Shield className="mr-2 inline w-4 h-4" /> {isTribute ? "Seal Influence" : (isGift ? "Crown Them" : "Claim Throne")}
              </button>
            </div>
          </div>
        )}

        {status === 'success' && (
          <div className="text-center flex flex-col items-center animate-in zoom-in duration-700">
            <CheckCircle2 className="w-16 h-16 text-green-500 mb-8" />
            <h2 className="text-4xl font-black tracking-[0.3em] text-white uppercase italic">{isTribute ? "Influence Sealed" : (isGift ? "Gift Delivered" : "Legacy Secured")}</h2>
            <button onClick={() => window.location.reload()} className="mt-8 text-[#b38f4a] border-b border-[#b38f4a]/30 pb-1 text-[10px] tracking-[0.4em] uppercase hover:text-white transition-colors">Return</button>
          </div>
        )}
      </div>

      <style>{`
        @keyframes marqueeSeamless { 0% { transform: translate3d(50%, 0, 0); } 100% { transform: translate3d(-100%, 0, 0); } }
        .marquee-seamless { display: flex; animation: marqueeSeamless 20s linear infinite; }
        .ReactCrop__drag-handle::after { background-color: #D4AF37 !important; border: 1px solid #1a1103 !important; }
        .ReactCrop__crop-selection { border: 1px solid rgba(212, 175, 55, 0.8) !important; box-shadow: 0 0 0 9999em rgba(0, 0, 0, 0.7) !important; }
        @keyframes flashEffect { 0%, 100% { filter: brightness(1); } 50% { filter: brightness(1.4); } }
        .animate-price-pulse { animation: flashEffect 2s ease-in-out infinite; }
        @keyframes crownDrop { 0% { transform: translateY(-500px); opacity: 0; } 60% { transform: translateY(0); opacity: 1; } 100% { transform: translateY(150px) scale(1.5); opacity: 0; } }
        .animate-crown-drop { animation: crownDrop 5s cubic-bezier(0.4, 0, 0.2, 1) forwards; }
        @keyframes screenShake { 0%, 100% { transform: translate3d(0, 0, 0); } 25% { transform: translate3d(-4px, -4px, 0); } 75% { transform: translate3d(4px, 4px, 0); } }
        .animate-screen-shake { animation: screenShake 0.5s ease-out both; }
        @keyframes proclamation { 0% { opacity: 0; transform: scale(0.9); } 20% { opacity: 1; transform: scale(1); } 80% { opacity: 1; } 100% { opacity: 0; } }
        .animate-proclamation { animation: proclamation 4s ease-in-out forwards; }
        .leather-dosage {
          background-color: #050505;
          background-image: radial-gradient(circle at center, transparent 0%, #000000 90%), url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
          filter: contrast(250%) brightness(25%); opacity: 0.8; mix-blend-mode: overlay;
        }
      `}</style>
    </main>
  );
}

export default function ImperialUploadPage() {
  return (
    <Suspense fallback={<div className="h-screen w-full bg-black flex items-center justify-center text-[#D4AF37] italic tracking-[0.5em] uppercase text-[10px]">Loading Imperial Assets...</div>}>
      <ImperialUploadContent />
    </Suspense>
  );
}