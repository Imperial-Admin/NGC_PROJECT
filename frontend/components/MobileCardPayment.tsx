// @ts-nocheck
"use client";
import React, { useState } from 'react';
import { Shield, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { supabase } from '../lib/supabaseClient';

export default function MobileCardPayment() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const imperialGold = `linear-gradient(110deg, #2a1a05 0%, #7a5210 25%, #b38f4a 45%, #e6c68b 50%, #b38f4a 55%, #7a5210 75%, #2a1a05 100%)`;

  const handlePay = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    
    try {
      const dynamicPrice = Number(sessionStorage.getItem('imp_price')) || 10;
      const sovName = sessionStorage.getItem('imp_name') || "Sovereign";
      const sovImg = sessionStorage.getItem('imp_img') || '';
      const sovMsg = sessionStorage.getItem('imp_msg') || "";
      const purchaseType = sessionStorage.getItem('imp_type') || "sovereign";

      if (purchaseType === 'tribute') {
        const { data, error } = await supabase.from('heart_wall').insert([{ 
          name: sovName, 
          location: sovMsg || "HEART WALL",
          country_code: sessionStorage.getItem('imp_country') || 'un'
        }]).select();
        if (data && data[0]) sessionStorage.setItem('imp_last_id', data[0].id.toString());
      } else {
        const { data, error } = await supabase.from('sovereigns').insert([{ 
          name: sovName, 
          price_paid: dynamicPrice, 
          image_url: sovImg,
          subtitle: sovMsg
        }]).select();
        if (data && data[0]) sessionStorage.setItem('imp_last_id', data[0].id.toString());
      }
      window.location.href = "/history?success=true"; 
    } catch (err) { 
      setLoading(false); 
      window.location.href = "/history?success=true";
    }
  };

  return (
    <main className="h-screen w-full bg-[#050505] text-white font-serif flex flex-col relative overflow-hidden">
      <div className="absolute inset-0 opacity-20 pointer-events-none" 
           style={{ backgroundImage: "url('/bg.jpg')", backgroundSize: 'cover', filter: 'brightness(0.15)' }}></div>

      {/* Nav */}
      <nav className="shrink-0 p-6 flex items-center justify-between z-50">
        <button onClick={() => router.push('/payments')} className="text-[#b38f4a] active:scale-90 transition-transform">
          <ArrowLeft size={20} />
        </button>
        <h2 className="text-[10px] tracking-[0.4em] uppercase font-black text-[#e6c68b]">Treasury Deposit</h2>
        <div className="w-6"></div>
      </nav>

      <form onSubmit={handlePay} className="flex-1 flex flex-col justify-between items-center p-8 z-10 min-h-0">
        
        <header className="flex flex-col items-center">
            <div className="w-10 h-10 border border-[#b38f4a]/30 rounded-full flex items-center justify-center mb-4">
                <Shield className="text-[#b38f4a]" size={18} strokeWidth={1} />
            </div>
            <p className="text-[8px] tracking-[0.6em] uppercase text-[#b38f4a]/60 font-bold">Secure Gateway Active</p>
        </header>

        {/* Inputs Section */}
        <div className="w-full space-y-12">
            <div className="flex flex-col items-center">
                <label className="text-[7px] tracking-[0.4em] uppercase text-[#b38f4a]/40 mb-3">Asset ID</label>
                <input 
                    type="tel"
                    className="w-full bg-transparent border-b border-[#b38f4a]/20 py-3 text-center text-xl tracking-[0.2em] text-white outline-none focus:border-[#b38f4a] transition-all" 
                    placeholder="XXXX XXXX XXXX XXXX" 
                    required 
                />
            </div>

            <div className="flex gap-8 w-full">
                <div className="flex-1 flex flex-col items-center">
                    <label className="text-[7px] tracking-[0.4em] uppercase text-[#b38f4a]/40 mb-3">Expiry</label>
                    <input 
                        type="tel"
                        className="w-full bg-transparent border-b border-[#b38f4a]/20 py-3 text-center text-lg text-white outline-none focus:border-[#b38f4a] transition-all" 
                        placeholder="MM / YY" 
                        required 
                    />
                </div>
                <div className="flex-1 flex flex-col items-center">
                    <label className="text-[7px] tracking-[0.4em] uppercase text-[#b38f4a]/40 mb-3">Security</label>
                    <input 
                        type="tel"
                        className="w-full bg-transparent border-b border-[#b38f4a]/20 py-3 text-center text-lg text-white outline-none focus:border-[#b38f4a] transition-all" 
                        placeholder="CVC" 
                        required 
                        maxLength={4} 
                    />
                </div>
            </div>
        </div>

        {/* Action Button */}
        <footer className="w-full space-y-8 flex flex-col items-center">
            <div className="opacity-20 text-center">
                <p className="text-[6px] tracking-[0.8em] uppercase font-bold text-[#b38f4a]">Sovereign Grade Encryption</p>
            </div>
            <button 
              disabled={loading} 
              className="w-full py-5 text-[#1a1103] font-black uppercase tracking-[0.5em] text-[11px] shadow-2xl active:scale-[0.98] transition-all border border-[#e6c68b]/40 relative overflow-hidden" 
              style={{ backgroundImage: imperialGold }}
            >
              <span className="relative z-10">
                {loading ? "TRANSMITTING..." : "CONFIRM DEPOSIT"}
              </span>
            </button>
        </footer>
      </form>
    </main>
  );
}