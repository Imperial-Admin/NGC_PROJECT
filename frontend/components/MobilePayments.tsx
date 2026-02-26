// @ts-nocheck
"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { CreditCard, Bitcoin, ShieldCheck, Crown } from 'lucide-react';

export default function MobilePayments() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const imperialGold = `linear-gradient(110deg, #2a1a05 0%, #7a5210 25%, #b38f4a 45%, #e6c68b 50%, #b38f4a 55%, #7a5210 75%, #2a1a05 100%)`;

  useEffect(() => { setMounted(true); }, []);
  if (!mounted) return null;

  return (
    <main className="h-screen w-full bg-[#050505] text-white font-serif flex flex-col items-center overflow-hidden relative p-6 pt-16">
      
      {/* Header - Scaled for Mobile */}
      <div className="shrink-0 mb-10 flex flex-col items-center animate-in fade-in slide-in-from-top duration-1000">
        <Crown className="w-5 h-5 text-[#b38f4a] mb-3 opacity-40" strokeWidth={1} />
        <h2 className="text-[9px] tracking-[0.8em] uppercase text-[#b38f4a] font-bold opacity-80 pl-[0.8em]">
          Treasury Selection
        </h2>
      </div>

      {/* Payment Options - Vertical Stack with flex-1 to fill space */}
      <div className="flex-1 w-full flex flex-col gap-4 relative z-10 max-w-sm mb-20">
        
        {/* Card Button */}
        <button 
          onClick={() => router.push('/payment/card')} 
          className="flex-1 group relative bg-black/40 border border-[#b38f4a]/20 active:border-[#b38f4a]/60 transition-all duration-500 flex flex-col items-center justify-center backdrop-blur-xl shadow-2xl rounded-sm overflow-hidden"
        >
          <div className="relative z-10 flex flex-col items-center">
            <CreditCard size={40} strokeWidth={1} className="mb-4 text-[#e6c68b] active:scale-110 transition-transform duration-500" />
            <span className="text-sm font-light tracking-[0.4em] uppercase text-white/90">
              Imperial Card
            </span>
            <div className="mt-2 h-[1px] w-12 bg-[#b38f4a]/30"></div>
          </div>
        </button>

        {/* Crypto Button */}
        <button 
          onClick={() => router.push('/payment/crypto')} 
          className="flex-1 group relative bg-black/40 border border-[#b38f4a]/20 active:border-[#b38f4a]/60 transition-all duration-500 flex flex-col items-center justify-center backdrop-blur-xl shadow-2xl rounded-sm overflow-hidden"
        >
          <div className="relative z-10 flex flex-col items-center">
            <Bitcoin size={40} strokeWidth={1} className="mb-4 text-[#e6c68b] active:scale-110 transition-transform duration-500 rotate-12" />
            <span className="text-sm font-light tracking-[0.4em] uppercase text-white/90">
              Crypto Vault
            </span>
            <div className="mt-2 h-[1px] w-12 bg-[#b38f4a]/30"></div>
          </div>
        </button>

      </div>

      {/* Decorative BG */}
      <div className="absolute inset-0 z-0 opacity-10 pointer-events-none" 
           style={{ backgroundImage: "url('/bg.jpg')", backgroundSize: 'cover', backgroundPosition: 'center', filter: 'grayscale(100%) brightness(0.2)' }}></div>
      
      {/* Footer - Pinned to bottom */}
      <div className="shrink-0 pb-10 flex items-center gap-3 opacity-30 z-10">
        <ShieldCheck size={12} className="text-[#b38f4a]" />
        <span className="text-[7px] tracking-[0.3em] uppercase font-bold text-[#b38f4a]">Sovereign Encryption Active</span>
      </div>

    </main>
  );
}