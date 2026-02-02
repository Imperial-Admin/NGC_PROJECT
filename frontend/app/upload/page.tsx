'use client';
import { useState, useRef, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';
import ReactCrop, { type Crop, centerCrop, makeAspectCrop, PixelCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css'; 
import { Upload, CheckCircle2, Shield, Minus, Plus } from 'lucide-react';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

export default function ImperialUploadPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<'idle' | 'details' | 'preview' | 'success'>('idle');
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState<Crop>();
  const [zoom, setZoom] = useState(1);
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const [croppedImage, setCroppedImage] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [isShaking, setIsShaking] = useState(false);
  const [isCoronating, setIsCoronating] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  const imperialGold = `linear-gradient(110deg, #2a1a05 0%, #7a5210 25%, #b38f4a 45%, #e6c68b 50%, #b38f4a 55%, #7a5210 75%, #2a1a05 100%)`;

  // --- לוגיקת חזרה מהתשלום + ניקוי כתובת אוטומטי ---
  useEffect(() => {
    const paymentStatus = searchParams.get('payment');
    if (paymentStatus === 'success') {
      const savedImg = sessionStorage.getItem('imp_img');
      if (savedImg) {
        setStatus('success');
        setIsCoronating(true);
        // השורה הזו מנקה את הכתובת למעלה כדי שהזיקוקים לא יקפצו סתם בטסט הבא!
        window.history.replaceState({}, '', window.location.pathname);
        const audio = new Audio('/victory.mp3'); audio.play().catch(() => {});
        setTimeout(() => setIsCoronating(false), 8000);
        sessionStorage.clear();
      }
    }
  }, [searchParams]);

  // לוגיקת הזיקוקים
  useEffect(() => {
    if (status !== 'success') return;
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
    const createFirework = (x: number, y: number) => {
      const colors = ['#D4AF37', '#FBF5B7', '#FFD700', '#E6C68B', '#FFFFFF'];
      for (let i = 0; i < 120; i++) particles.push(new Particle(x, y, colors[Math.floor(Math.random() * colors.length)]));
    };
    const centerX = window.innerWidth / 2; const centerY = window.innerHeight / 2.5;
    for (let i = 0; i < 15; i++) { setTimeout(() => createFirework(centerX + (Math.random() - 0.5) * 400, centerY + (Math.random() - 0.5) * 300), i * 300); }
    return () => { cancelAnimationFrame(animationFrame); window.removeEventListener('resize', resize); };
  }, [status]);

  // הכפתור ששולח לתשלום
  const handleUpload = async () => {
    if (!croppedImage) return;
    sessionStorage.setItem('imp_img', croppedImage);
    sessionStorage.setItem('imp_title', title);
    sessionStorage.setItem('imp_subtitle', subtitle);
    router.push('/checkout'); // מעבר לדף התשלום
  };

  function onSelectFile(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files?.[0]) {
      const reader = new FileReader();
      reader.onload = () => { setImageSrc(reader.result?.toString() || null); setStatus('details'); setCrop(undefined); setZoom(1); };
      reader.readAsDataURL(e.target.files[0]);
    }
  }

  async function generateCroppedImg() {
    if (!completedCrop || !imgRef.current) return;
    const image = imgRef.current; const canvas = document.createElement('canvas'); const ctx = canvas.getContext('2d'); if (!ctx) return;
    const scaleX = image.naturalWidth / image.width; const scaleY = image.naturalHeight / image.height;
    canvas.width = completedCrop.width * scaleX; canvas.height = completedCrop.height * scaleY;
    ctx.imageSmoothingQuality = 'high'; ctx.save();
    ctx.translate(-completedCrop.x * scaleX, -completedCrop.y * scaleY);
    const centerX = (image.width * scaleX) / 2; const centerY = (image.height * scaleY) / 2;
    ctx.translate(centerX, centerY); ctx.scale(zoom, zoom); ctx.translate(-centerX, -centerY);
    ctx.drawImage(image, 0, 0, image.naturalWidth, image.naturalHeight); ctx.restore();
    setCroppedImage(canvas.toDataURL('image/jpeg', 1.0)); setStatus('preview');
  }

  function onImageLoad(e: React.SyntheticEvent<HTMLImageElement>) {
    const { width, height } = e.currentTarget;
    if (!crop) {
      const initialCrop = centerCrop(makeAspectCrop({ unit: '%', width: 90 }, 1.7, width, height), width, height);
      setCrop(initialCrop);
    }
  }

  return (
    <main className={`h-screen w-full bg-black text-white flex flex-col items-center justify-center overflow-hidden font-serif relative select-none ${isShaking ? 'animate-screen-shake' : ''}`}>
      <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-[2000]" style={{ mixBlendMode: 'screen' }} />
      <div className="absolute inset-0 z-0" style={{ backgroundImage: "url('/bg.jpg')", backgroundSize: 'cover', filter: status === 'success' ? 'brightness(0.5)' : 'brightness(0.2)', transition: 'filter 2s ease-in-out' }}></div>      
      {status === 'idle' && <div className="absolute inset-0 z-5 leather-dosage animate-in fade-in duration-1000"></div>}
      {isCoronating && (
        <div className="fixed inset-0 z-[1000] flex flex-col items-center justify-center pointer-events-none">
           <div className="absolute inset-0 bg-black/95 animate-fade-in"></div>
           <p className="z-[1001] text-lg md:text-2xl tracking-[0.8em] uppercase text-white font-light italic animate-proclamation">A New Sovereign Ascends</p>
           <img src="/crown.png" alt="Crown" className="absolute top-0 z-[1002] animate-crown-drop w-1/2 md:w-1/3 max-w-lg filter drop-shadow-[0_0_50px_#D4AF37]" />
        </div>
      )}
      <div className="w-full max-w-[1750px] px-6 relative z-10 flex flex-col items-center h-full justify-center">
        {status === 'idle' && (
          <label className="group relative flex flex-col items-center justify-center w-[400px] h-[250px] border border-[#b38f4a]/30 bg-black/40 cursor-pointer hover:bg-[#b38f4a]/10 transition-all shadow-2xl backdrop-blur-sm">
            <Upload className="w-10 h-10 mb-4 text-[#b38f4a]/40" />
            <span className="text-[10px] tracking-[0.4em] uppercase text-gray-500 font-bold">Upload Portrait</span>
            <input type="file" className="hidden" onChange={onSelectFile} accept="image/*" />
          </label>
        )}
        {status === 'details' && imageSrc && (
          <div className="w-full flex flex-col items-center gap-6 animate-in zoom-in-95 duration-500">
            <div className="relative w-[50vw] max-w-[850px] h-[50vh] rounded-lg shadow-2xl shrink-0" style={{ padding: '4px', backgroundImage: imperialGold, boxShadow: `0 30px 60px -15px rgba(0,0,0,1)` }}>
                <div className="absolute bottom-12 -right-4 z-50 w-52 h-14 rounded-sm overflow-hidden flex items-center justify-center animate-price-pulse" style={{ backgroundImage: imperialGold }}>
                    <h3 className="text-2xl font-black text-[#1a1103] tracking-tighter">$10</h3>
                </div>
                <div className="h-full w-full rounded-sm overflow-hidden relative border-[1px] border-[#D4AF37]/20 pb-16 bg-black flex items-center justify-center pt-2">
                  <ReactCrop crop={crop} onChange={c => setCrop(c)} onComplete={c => setCompletedCrop(c)} className="flex items-center justify-center">
                    <img ref={imgRef} src={imageSrc} onLoad={onImageLoad} style={{ transform: `scale(${zoom})` }} className="max-h-[42vh] object-contain" />
                  </ReactCrop>
                </div>
            </div>
            <div className="w-full max-w-md space-y-4">
              <input type="text" placeholder="NAME" value={title} onChange={e => setTitle(e.target.value)} className="w-full bg-transparent border-b border-[#b38f4a]/20 py-2 text-center text-xs tracking-[0.4em] uppercase text-white font-bold" />
              <input type="text" placeholder="MESSAGE" value={subtitle} onChange={e => setSubtitle(e.target.value)} className="w-full bg-transparent border-b border-[#b38f4a]/20 py-2 text-center text-[10px] tracking-[0.3em] uppercase text-white italic" />
            </div>
            <button onClick={generateCroppedImg} disabled={!title} className="w-[320px] py-4 text-[#1a1103] font-black uppercase tracking-[0.4em] text-xs shadow-2xl" style={{ backgroundImage: imperialGold }}>Review Ascension</button>
          </div>
        )}
        {status === 'preview' && (
          <div className="flex flex-col items-center animate-in fade-in zoom-in-95 duration-700 w-full">
            <div className="relative w-[50vw] max-w-[850px] h-[50vh] rounded-lg shadow-2xl shrink-0" style={{ padding: '4px', backgroundImage: imperialGold }}>
                <div className="h-full w-full rounded-sm overflow-hidden relative border-[1px] border-[#D4AF37]/20 pb-14 bg-black">
                  <img src={croppedImage!} className="w-full h-full object-contain contrast-115 brightness-95" />
                  <div className="absolute bottom-0 left-0 right-0 h-14 z-30 flex flex-col items-center justify-center backdrop-blur-md bg-black/70 border-t-2 border-[#FBF5B7]/50 shadow-[inset_0_5px_15px_rgba(212,175,55,0.2)]">
                        <h2 className="text-sm tracking-[0.4em] uppercase font-black text-[#FBF5B7]">{title}</h2>
                        <div className="h-[1px] w-8 bg-[#D4AF37] my-1 opacity-50"></div>
                        <p className="text-[#D4AF37] text-[10px] tracking-[0.4em] italic uppercase px-4">"{subtitle}"</p>
                  </div>
                </div>
            </div>
            <div className="flex gap-6 w-[400px] mt-12">
              <button onClick={() => setStatus('details')} className="flex-1 py-4 border border-[#b38f4a]/30 text-[#b38f4a] uppercase text-[10px] font-bold">Edit</button>
              <button onClick={handleUpload} className="flex-[2] py-4 text-[#1a1103] font-black uppercase tracking-[0.4em] text-xs shadow-2xl" style={{ backgroundImage: imperialGold }}>
                <Shield className="mr-2 inline w-4 h-4" /> Claim Throne
              </button>
            </div>
          </div>
        )}
        {status === 'success' && (
          <div className="text-center flex flex-col items-center animate-in zoom-in duration-700">
            <CheckCircle2 className="w-16 h-16 text-green-500 mb-8" />
            <h2 className="text-4xl font-black tracking-[0.3em] text-white uppercase italic">Legacy Secured</h2>
            <button onClick={() => window.location.reload()} className="mt-8 text-[#b38f4a] border-b border-[#b38f4a]/30 pb-1 text-[10px] tracking-[0.4em] uppercase hover:text-white">Return</button>
          </div>
        )}
      </div>
      <style>{`
        @keyframes marqueeSeamless { 0% { transform: translate3d(50%, 0, 0); } 100% { transform: translate3d(-100%, 0, 0); } }
        .animate-screen-shake { animation: screenShake 0.5s ease-out both; }
        .leather-dosage { background-color: #050505; opacity: 0.8; mix-blend-mode: overlay; }
      `}</style>
    </main>
  );
}