// @ts-nocheck
'use client';
import { useState, useRef, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '../lib/supabaseClient'; 
import ReactCrop, { type Crop, centerCrop, makeAspectCrop, PixelCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css'; 
import { Upload, CheckCircle2, Shield, Minus, Plus, Crown, ArrowLeft } from 'lucide-react';

function MobileUploadContent() {
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
    let ignore = false; setMounted(true);
    const fetchCurrentPrice = async () => {
      if (isTribute || isGift) { setDynamicPrice(25); return; }
      const { count } = await supabase.from('sovereigns').select('*', { count: 'exact', head: true });
      if (count !== null && !ignore) { setDynamicPrice(Math.round(10 * Math.pow(1.1, count))); }
    };
    fetchCurrentPrice();
    const paymentStatus = searchParams.get('payment');
    if (paymentStatus === 'success' && !ignore) {
      setStatus('success'); setIsShaking(true); setIsCoronating(true);
      window.history.replaceState({}, '', window.location.pathname);
      const audio = new Audio('/victory.mp3'); audio.volume = 0.6; audio.play().catch(e => {});
      setTimeout(() => setIsShaking(false), 1000);
      setTimeout(() => setIsCoronating(false), 8000);
    }
    return () => { ignore = true; };
  }, [searchParams]);

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
        this.x = x; this.y = y; const angle = Math.random() * Math.PI * 2; const velocity = Math.random() * 8 + 4;
        this.vx = Math.cos(angle) * velocity; this.vy = Math.sin(angle) * velocity;
        this.alpha = 1; this.color = color; this.gravity = 0.12; this.friction = 0.95;
        this.size = Math.random() * 2 + 1; this.decay = Math.random() * 0.02 + 0.01;
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
    const cX = window.innerWidth / 2; const cY = window.innerHeight / 3;
    for (let i = 0; i < 10; i++) { setTimeout(() => { for (let j=0; j<50; j++) particles.push(new Particle(cX, cY, '#D4AF37')) }, i * 400); }
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
    const initialCrop = centerCrop(makeAspectCrop({ unit: '%', width: 90 }, 1.7, width, height), width, height);
    setCrop(initialCrop);
  }

  async function generateCroppedImg() {
    if (isGift) { setStatus('preview'); return; }
    if (!completedCrop || !imgRef.current) return;
    const image = imgRef.current; const canvas = document.createElement('canvas'); const ctx = canvas.getContext('2d'); if (!ctx) return;
    const scaleX = image.naturalWidth / image.width; const scaleY = image.naturalHeight / image.height;
    canvas.width = completedCrop.width * scaleX; canvas.height = completedCrop.height * scaleY;
    ctx.imageSmoothingQuality = 'high'; ctx.save();
    ctx.translate(-completedCrop.x * scaleX, -completedCrop.y * scaleY);
    const cX = (image.width * scaleX) / 2; const cY = (image.height * scaleY) / 2;
    ctx.translate(cX, cY); ctx.scale(zoom, zoom); ctx.translate(-cX, -cY);
    ctx.drawImage(image, 0, 0, image.naturalWidth, image.naturalHeight); ctx.restore();
    setCroppedImage(canvas.toDataURL('image/jpeg', 1.0)); setStatus('preview');
  }

  const handleUpload = async () => {
    sessionStorage.setItem('imp_img', isGift ? '/heart.png' : (croppedImage || ''));
    sessionStorage.setItem('imp_name', title); sessionStorage.setItem('imp_msg', subtitle);
    sessionStorage.setItem('imp_price', dynamicPrice.toString());
    sessionStorage.setItem('imp_type', (isTribute || isGift) ? 'tribute' : 'sovereign'); 
    router.push('/checkout'); 
  };

  if (!mounted) return null;

  return (
    <main className={`h-screen w-full bg-black text-white flex flex-col overflow-hidden font-serif relative ${isShaking ? 'animate-screen-shake' : ''}`}>
      <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-[2000]" style={{ mixBlendMode: 'screen' }} />
      <div className="fixed inset-0 z-0 bg-[#050505] opacity-40" style={{ backgroundImage: "url('/bg.jpg')", backgroundSize: 'cover' }}></div>
      
      {/* Header - Fixed Height */}
      <nav className="shrink-0 p-4 flex items-center justify-between z-50 bg-black/60 backdrop-blur-sm border-b border-[#b38f4a]/10">
        <button onClick={() => router.push('/')} className="text-[#b38f4a] p-1"><ArrowLeft size={18} /></button>
        <p className="text-[10px] tracking-[0.4em] uppercase font-black text-[#e6c68b]">Ascension</p>
        <div className="w-6"></div>
      </nav>

      {/* Main Content Area - Full Flex */}
      <div className="flex-1 w-full flex flex-col justify-between items-center p-4 z-10 min-h-0">
        
        {status === 'idle' && (
          <div className="w-full flex-1 flex flex-col items-center justify-center gap-6 overflow-hidden">
            {isGift ? (
                <div className="relative w-[180px] aspect-[3/4] bg-[#050505] border-2 border-[#b38f4a]/50 rounded-[8px] flex flex-col items-center justify-center p-4 shadow-2xl">
                    <div className="absolute top-0 right-0 z-50 bg-[#b38f4a] px-2 py-0.5 rounded-bl-md"><span className="text-black text-[9px] font-black">$25</span></div>
                    <img src="/heart.png" className="w-[30px] mb-3" />
                    <h3 className="text-sm tracking-tight uppercase font-black text-white text-center leading-tight">{title || "RECIPIENT"}</h3>
                    <p className="absolute bottom-4 text-[6px] tracking-widest uppercase text-[#b38f4a] font-bold px-2 text-center truncate w-full">{subtitle || "MESSAGE"}</p>
                </div>
            ) : (
                <label className="w-full max-h-[250px] aspect-[4/3] border border-[#b38f4a]/30 bg-black/40 flex flex-col items-center justify-center rounded-sm">
                    <Upload className="w-8 h-8 mb-2 text-[#b38f4a]/40" />
                    <span className="text-[9px] tracking-[0.3em] uppercase text-gray-500 font-bold">Select Portrait</span>
                    <input type="file" className="hidden" onChange={onSelectFile} accept="image/*" />
                </label>
            )}
            
            <div className="w-full space-y-4 shrink-0">
                <input type="text" placeholder="FULL NAME" value={title} maxLength={15} onChange={e => setTitle(e.target.value)} className="w-full bg-transparent border-b border-[#b38f4a]/20 py-2 text-center focus:outline-none text-xs tracking-[0.3em] uppercase text-white font-bold" />
                <input type="text" placeholder="MESSAGE" value={subtitle} maxLength={45} onChange={e => setSubtitle(e.target.value)} className="w-full bg-transparent border-b border-[#b38f4a]/20 py-2 text-center focus:outline-none text-[10px] tracking-[0.2em] uppercase text-white italic" />
            </div>

            {isGift && <button onClick={generateCroppedImg} disabled={!title} className="w-full py-4 text-black font-black uppercase tracking-[0.4em] text-[10px] shrink-0" style={{ backgroundImage: imperialGold }}>Review Gift</button>}
          </div>
        )}

        {status === 'details' && imageSrc && (
          <div className="w-full flex-1 flex flex-col justify-between items-center min-h-0">
             {/* CROP BOX - Flexible height */}
             <div className="relative flex-1 w-full border-2 border-[#b38f4a] rounded-sm overflow-hidden bg-black flex items-center justify-center min-h-0 my-2">
                <ReactCrop crop={crop} onChange={c => setCrop(c)} onComplete={c => setCompletedCrop(c)} className="max-h-full">
                    <img ref={imgRef} src={imageSrc} onLoad={onImageLoad} style={{ transform: `scale(${zoom})`, transformOrigin: 'center' }} className="max-h-full object-contain" />
                </ReactCrop>
                <div className="absolute top-2 right-2 z-50 bg-[#b38f4a] px-2 py-0.5 rounded-sm shadow-xl"><span className="text-black text-[10px] font-black">${dynamicPrice}</span></div>
             </div>

             {/* CONTROLS - Fixed height bottom */}
             <div className="w-full space-y-4 pt-2 shrink-0">
                <div className="flex items-center gap-4 px-4 py-1.5 bg-black/40 border border-[#b38f4a]/20 rounded-full">
                    <Minus size={14} /><input type="range" min={1} max={3} step={0.1} value={zoom} onChange={(e) => setZoom(Number(e.target.value))} className="flex-1 h-1 accent-[#b38f4a]" /><Plus size={14} />
                </div>
                <div className="space-y-2">
                    <input type="text" placeholder="NAME" value={title} maxLength={15} onChange={e => setTitle(e.target.value)} className="w-full bg-transparent border-b border-[#b38f4a]/20 py-2 text-center focus:outline-none text-xs tracking-[0.3em] uppercase text-white font-bold" />
                    <input type="text" placeholder="MESSAGE" value={subtitle} maxLength={45} onChange={e => setSubtitle(e.target.value)} className="w-full bg-transparent border-b border-[#b38f4a]/20 py-2 text-center focus:outline-none text-[10px] tracking-[0.1em] uppercase text-white italic" />
                </div>
                <button onClick={generateCroppedImg} disabled={!title} className="w-full py-4 text-black font-black uppercase tracking-[0.4em] text-[10px] shadow-2xl" style={{ backgroundImage: imperialGold }}>Review Portrait</button>
             </div>
          </div>
        )}

        {status === 'preview' && (
            <div className="w-full flex-1 flex flex-col justify-between items-center min-h-0">
                <div className="relative flex-1 w-full border-2 border-[#b38f4a] rounded-sm overflow-hidden bg-[#050505] flex items-center justify-center my-4 min-h-0">
                    {isGift ? <img src="/heart.png" className="w-20" /> : <img src={croppedImage!} className="w-full h-full object-contain" />}
                    <div className="absolute bottom-0 left-0 right-0 py-4 bg-black/80 backdrop-blur-md border-t border-[#b38f4a]/30 text-center">
                        <h2 className="text-sm tracking-widest uppercase font-black text-white">{title}</h2>
                        <p className="text-[7px] tracking-[0.1em] text-[#b38f4a] mt-0.5 italic">"{subtitle}"</p>
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-4 w-full pt-2 shrink-0">
                    <button onClick={() => setStatus('details')} className="py-4 border border-[#b38f4a]/40 text-[#b38f4a] uppercase text-[9px] font-bold">Edit</button>
                    <button onClick={handleUpload} className="py-4 bg-[#b38f4a] text-black font-black uppercase tracking-widest text-[9px] flex items-center justify-center gap-2 shadow-xl" style={{ backgroundImage: imperialGold }}><Shield size={12}/> Confirm</button>
                </div>
            </div>
        )}

        {status === 'success' && (
            <div className="flex-1 flex flex-col items-center justify-center text-center animate-in zoom-in">
                <CheckCircle2 size={50} className="text-green-500 mb-4" />
                <h2 className="text-xl font-black tracking-widest text-white uppercase italic">Legacy Secured</h2>
                <button onClick={() => router.push('/')} className="mt-8 text-[#b38f4a] border-b border-[#b38f4a]/30 text-[9px] tracking-widest uppercase">Return Home</button>
            </div>
        )}
      </div>

      <style jsx global>{`
        @keyframes crownDrop { 0% { transform: translateY(-500px); opacity: 0; } 60% { transform: translateY(0); opacity: 1; } 100% { transform: translateY(150px) scale(1.5); opacity: 0; } }
        .animate-crown-drop { animation: crownDrop 5s cubic-bezier(0.4, 0, 0.2, 1) forwards; }
        @keyframes proclamation { 0% { opacity: 0; transform: scale(0.9); } 20% { opacity: 1; transform: scale(1); } 80% { opacity: 1; } 100% { opacity: 0; } }
        .animate-proclamation { animation: proclamation 4s ease-in-out forwards; }
        @keyframes screenShake { 0%, 100% { transform: translate3d(0, 0, 0); } 25% { transform: translate3d(-4px, -4px, 0); } 75% { transform: translate3d(4px, 4px, 0); } }
        .animate-screen-shake { animation: screenShake 0.5s ease-out both; }
        .ReactCrop__crop-selection { border: 1px solid rgba(212, 175, 55, 0.8) !important; box-shadow: 0 0 0 9999em rgba(0, 0, 0, 0.8) !important; }
      `}</style>
    </main>
  );
}

export default function MobileUpload() {
  return (
    <Suspense fallback={null}>
      <MobileUploadContent />
    </Suspense>
  );
}