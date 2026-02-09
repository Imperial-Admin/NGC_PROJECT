"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Copy, Check, ArrowLeft, MessageCircle, Twitter, Send, 
  Facebook, Linkedin, Mail 
} from 'lucide-react';

export default function ImperialSharePage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [copied, setCopied] = useState(false);
  const [siteUrl, setSiteUrl] = useState("https://ngc-project.vercel.app"); 
  
  const imperialGold = `linear-gradient(110deg, #2a1a05 0%, #7a5210 25%, #b38f4a 45%, #e6c68b 50%, #b38f4a 55%, #7a5210 75%, #2a1a05 100%)`;
  
  // טקסט יוקרתי שיופיע מעל הלינק בשיתוף
  const shareText = "Behold the Sovereign Asset. A new era of digital legacy begins.";

  useEffect(() => { 
    setMounted(true); 
    if (typeof window !== 'undefined') {
      setSiteUrl(window.location.origin);
    }
  }, []);

  const copyLink = () => {
    navigator.clipboard.writeText(siteUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareAction = (url: string) => {
    window.open(url, '_blank');
  };

  if (!mounted) return null;

  return (
    <main className="h-screen w-full bg-black text-white font-serif flex flex-col items-center justify-center p-6 relative overflow-hidden select-none">
      
      <div className="absolute inset-0 z-0 opacity-10 pointer-events-none" 
           style={{ backgroundImage: "url('/bg.jpg')", backgroundSize: 'cover', backgroundPosition: 'center', filter: 'brightness(0.3)' }}></div>

      <button 
        onClick={() => router.push('/')} 
        className="absolute top-10 left-10 z-20 flex items-center gap-3 text-[8px] tracking-[0.6em] uppercase text-[#b38f4a]/40 hover:text-white transition-all duration-500"
      >
        <ArrowLeft size={12} strokeWidth={1.5} />
        Return
      </button>

      <div className="relative z-10 w-full max-w-[450px]" style={{ padding: '3px', backgroundImage: imperialGold }}>
        <div className="bg-[#050505] p-10 flex flex-col items-center relative">
          
          {[...Array(4)].map((_, i) => (
            <div key={i} className={`absolute w-1.5 h-1.5 rounded-full bg-[#2a1a05] ${i===0?'top-2 left-2':i===1?'top-2 right-2':i===2?'bottom-2 left-2':'bottom-2 right-2'}`}></div>
          ))}

          <header className="mb-10 text-center">
            <h1 className="text-[10px] tracking-[1.4em] uppercase text-[#e6c68b] font-black pl-[1.4em] mb-2">
              Share Asset
            </h1>
            <div className="h-[1px] w-8 bg-[#b38f4a]/30 mx-auto"></div>
          </header>

          <div className="mb-10 p-4 border border-[#b38f4a]/10 bg-black/40">
             <div className="w-24 h-24 opacity-80 mix-blend-screen" 
                  style={{ backgroundImage: `url('https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${siteUrl}&color=D4AF37&bgcolor=000')`, backgroundSize: 'cover' }}>
             </div>
          </div>

          <div className="w-full text-center space-y-6">
            <p className="text-[10px] tracking-[0.2em] text-white/40 font-light italic truncate px-4">
              {siteUrl}
            </p>
            
            <button 
              onClick={copyLink}
              className="text-[8px] tracking-[0.5em] uppercase text-[#e6c68b] font-bold hover:text-white transition-all flex items-center gap-3 mx-auto"
            >
              {copied ? <Check size={12} className="text-green-500" /> : <Copy size={12} strokeWidth={1.5} />}
              {copied ? "Legacy Copied" : "Copy Access URL"}
            </button>
          </div>

          <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-[#b38f4a]/20 to-transparent my-10"></div>

          <div className="flex gap-8 items-center justify-center mb-10 w-full px-4">
            <button onClick={() => shareAction(`https://wa.me/?text=${encodeURIComponent(shareText + " " + siteUrl)}`)} className="text-[#b38f4a]/40 hover:text-white transition-all group">
              <MessageCircle size={20} strokeWidth={1.5} />
            </button>
            <button onClick={() => shareAction(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(siteUrl)}`)} className="text-[#b38f4a]/40 hover:text-white transition-all group">
              <Twitter size={20} strokeWidth={1.5} />
            </button>
            <button onClick={() => shareAction(`https://t.me/share/url?url=${encodeURIComponent(siteUrl)}&text=${encodeURIComponent(shareText)}`)} className="text-[#b38f4a]/40 hover:text-white transition-all group">
              <Send size={20} strokeWidth={1.5} />
            </button>
            <button onClick={() => shareAction(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(siteUrl)}`)} className="text-[#b38f4a]/40 hover:text-white transition-all group">
              <Facebook size={20} strokeWidth={1.5} />
            </button>
            <button onClick={() => shareAction(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(siteUrl)}`)} className="text-[#b38f4a]/40 hover:text-white transition-all group">
              <Linkedin size={20} strokeWidth={1.5} />
            </button>
            <button onClick={() => shareAction(`mailto:?subject=Imperial Invitation&body=${encodeURIComponent(shareText + " " + siteUrl)}`)} className="text-[#b38f4a]/40 hover:text-white transition-all group">
              <Mail size={20} strokeWidth={1.5} />
            </button>
          </div>

          <button 
            onClick={() => router.push('/')}
            className="w-full py-4 text-[#1a1103] text-[9px] tracking-[0.6em] uppercase font-black shadow-2xl active:scale-[0.98] transition-all duration-500 border border-[#e6c68b]/30"
            style={{ backgroundImage: imperialGold }}
          >
            Confirm Succession
          </button>

        </div>
      </div>
    </main>
  );
}