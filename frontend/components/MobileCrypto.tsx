// @ts-nocheck
"use client";
import React, { useState, useEffect } from 'react';
import { Copy, Check, Crown, Shield } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { supabase } from '../lib/supabaseClient';

export default function MobileCrypto() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [mounted, setMounted] = useState(false);
  
  const walletAddress = "bc1qxy2kgdygjrsqtzq2n0yrf";
  const imperialGold = `linear-gradient(110deg, #2a1a05 0%, #7a5210 25%, #b38f4a 45%, #e6c68b 50%, #b38f4a 55%, #7a5210 75%, #2a1a05 100%)`;

  useEffect(() => { setMounted(true); }, []);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(walletAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePay = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    
    const dynamicPrice = Number(sessionStorage.getItem('imp_price')) || 10;
    const sovName = sessionStorage.getItem('imp_name') || "Sovereign";
    const sovImg = sessionStorage.getItem('imp_img') || '';
    const sovMsg = sessionStorage.getItem('imp_msg') || "";
    const purchaseType = sessionStorage.getItem('imp_type') || "sovereign";

    try {
      if (purchaseType === 'tribute') {
        await supabase.from('heart_wall').insert([{ 
          name: sovName, location: sovMsg || "HEART WALL", country_code: sessionStorage.getItem('imp_country') || 'un'
        }]);
      } else {
        await supabase.from('sovereigns').insert([{ 
          name: sovName, price_paid: dynamicPrice, image_url: sovImg, subtitle: sovMsg
        }]);
      }
      window.location.href = "/history?success=true"; 
    } catch (err) { 
      window.location.href = "/history?success=true";
    }
  };

  if (!mounted) return null;

  return (
    <main className="h-screen w-full bg-[#050505] text-white font-serif flex flex-col relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: "url('/bg.jpg')", backgroundSize: 'cover', filter: 'grayscale(100%)' }}></div>
      <div className="absolute top-0 left-0 w-full h-[300px] bg-gradient-to-b from-[#b38f4a]/10 to-transparent blur-[100px] pointer-events-none"></div>

      {/* Main Content Container */}
      <form onSubmit={handlePay} className="relative z-10 flex-1 flex flex-col justify-between items-center p-8 pt-16">
        
        {/* Header Section */}
        <header className="flex flex-col items-center">
           <Crown className="text-[#b38f4a] mb-4 opacity-40" size={24} strokeWidth={1} />
           <h2 className="text-[10px] tracking-[1.2em] uppercase text-[#e6c68b] font-black pl-[1.2em] text-center">Crypto Treasury</h2>
        </header>

        {/* Address Section - Center of Screen */}
        <div className="w-full flex flex-col items-center space-y-10">
          <div className="w-full border-y border-[#b38f4a]/20 py-12 flex flex-col items-center">
            <span className="text-[12px] tracking-widest text-[#b38f4a] font-bold break-all text-center leading-relaxed">
                {walletAddress}
            </span>
          </div>

          <button type="button" onClick={copyToClipboard} className="flex items-center gap-3 px-8 py-3 border border-[#b38f4a]/20 bg-black/40 rounded-full active:scale-95 transition-all">
            {copied ? <Check size={14} className="text-green-500" /> : <Copy size={14} className="text-[#e6c68b] opacity-60" />}
            <span className="text-[9px] tracking-[0.3em] uppercase text-[#e6c68b] font-bold">
                {copied ? "ADDRESS COPIED" : "COPY ADDRESS"}
            </span>
          </button>

          <p className="text-[8px] tracking-[0.5em] text-[#b38f4a]/40 uppercase italic">Network: Bitcoin (BTC)</p>
        </div>

        {/* Footer Section - Action Button pinned to bottom */}
        <footer className="w-full space-y-6 flex flex-col items-center">
            <div className="flex items-center gap-2 opacity-20">
                <Shield size={10} className="text-[#b38f4a]" />
                <span className="text-[6px] tracking-[0.3em] uppercase font-bold text-[#b38f4a]">Immutable Ledger Encryption</span>
            </div>
            
            <button disabled={loading} className="w-full py-5 text-[#1a1103] font-black uppercase tracking-[0.5em] text-[11px] shadow-2xl active:scale-[0.98] transition-all border border-[#e6c68b]/40 relative overflow-hidden" style={{ backgroundImage: imperialGold }}>
              <span className="relative z-10">
                  {loading ? "SYNCING VAULT..." : (sessionStorage.getItem('imp_type') === 'tribute' ? "CONFIRM SEAL" : "CONFIRM SUCCESSION")}
              </span>
            </button>
        </footer>
      </form>
    </main>
  );
}