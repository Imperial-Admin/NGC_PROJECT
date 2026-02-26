// @ts-nocheck
"use client";
import React, { useState } from 'react';
import { CreditCard, Calendar, Lock, Shield } from 'lucide-react';
import { supabase } from '../lib/supabaseClient'; // וודא שהנתיב תקין אצלך

export default function DesktopCardPayment() {
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
    <main className="h-screen w-full bg-black text-white font-serif flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 opacity-20 pointer-events-none" 
           style={{ backgroundImage: "url('/bg.jpg')", backgroundSize: 'cover', backgroundPosition: 'center', filter: 'brightness(0.2) contrast(1.3)' }}></div>

      <div className="relative z-10 w-full max-w-[500px] aspect-square flex items-center justify-center">
        <div className="absolute inset-0 bg-[#b38f4a]/5 blur-[100px] rounded-full opacity-30"></div>
        <form onSubmit={handlePay} className="w-full h-full bg-[#050505]/95 border border-[#b38f4a]/30 p-12 md:p-16 backdrop-blur-3xl shadow-[0_0_80px_rgba(0,0,0,1)] flex flex-col items-center justify-between overflow-hidden">
          <header className="w-full flex flex-col items-center flex-none">
             <div className="w-12 h-12 border border-[#b38f4a]/20 rounded-full flex items-center justify-center mb-4">
                <Shield className="text-[#b38f4a]" size={20} strokeWidth={1} />
             </div>
             <h2 className="text-[9px] tracking-[1.2em] uppercase text-[#e6c68b] font-black pl-[1.2em]">Secure Treasury</h2>
          </header>

          <div className="w-full flex-1 flex flex-col justify-center space-y-12">
            <div className="w-full flex flex-col items-center">
              <label className="text-[7px] tracking-[0.6em] uppercase text-[#b38f4a]/50 mb-3 font-bold">Imperial Asset ID</label>
              <input className="w-full bg-transparent border-b border-[#b38f4a]/10 py-2 text-center text-xl tracking-[0.4em] text-[#b38f4a] outline-none placeholder:text-[#b38f4a]/30" placeholder="XXXX XXXX XXXX XXXX" required />
            </div>
            <div className="flex gap-10 w-full items-center justify-center">
              <div className="w-1/2 flex flex-col items-center">
                <label className="text-[7px] tracking-[0.6em] uppercase text-[#b38f4a]/50 mb-3 font-bold">Expiry</label>
                <input className="w-full bg-transparent border-b border-[#b38f4a]/10 py-2 text-center text-lg text-[#b38f4a] outline-none placeholder:text-[#b38f4a]/30" placeholder="MM / YY" required />
              </div>
              <div className="w-1/2 flex flex-col items-center">
                <label className="text-[7px] tracking-[0.6em] uppercase text-[#b38f4a]/50 mb-3 font-bold">Security</label>
                <input className="w-full bg-transparent border-b border-[#b38f4a]/10 py-2 text-center text-lg text-[#b38f4a] outline-none placeholder:text-[#b38f4a]/30" placeholder="CVC" required maxLength={4} />
              </div>
            </div>
          </div>

          <footer className="w-full flex-none">
            <button disabled={loading} className="w-full py-5 text-[#1a1103] font-black uppercase tracking-[0.6em] text-[10px] shadow-2xl border border-[#e6c68b]/40 relative group overflow-hidden" style={{ backgroundImage: imperialGold }}>
              <span className="relative z-10">{loading ? "TRANSMITTING..." : "CONFIRM TRANSACTION"}</span>
            </button>
          </footer>
        </form>
      </div>
      <div className="absolute bottom-8 w-full text-center opacity-20">
          <p className="text-[7px] tracking-[0.8em] uppercase font-bold text-[#b38f4a]">Sovereign Grade Encryption</p>
      </div>
    </main>
  );
}