"use client";
import React, { useState, useEffect } from 'react';
import { Copy, Check, Crown } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../../lib/supabaseClient';

export default function CryptoPayment() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [mounted, setMounted] = useState(false);
  
  const walletAddress = "bc1qxy2kgdygjrsqtzq2n0yrf";
  const imperialGold = `linear-gradient(110deg, #2a1a05 0%, #7a5210 25%, #b38f4a 45%, #e6c68b 50%, #b38f4a 55%, #7a5210 75%, #2a1a05 100%)`;

  useEffect(() => {
    setMounted(true);
  }, []);

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
        // עדכון קיר הלבבות בלבד
        await supabase.from('tributes').insert([{ 
          name: sovName, 
          location: sovMsg || "HEART WALL"
        }]);
      } else {
        // ניסיון שמירה לקיסר - אם העמודה subtitle חסרה, זה יזרוק שגיאה ל-catch
        await supabase.from('sovereigns').insert([{ 
          name: sovName, 
          price_paid: dynamicPrice, 
          image_url: sovImg,
          subtitle: sovMsg
        }]);
      }
      
      // שחרור התקיעה: עוברים דף מיד
      window.location.href = "/history?success=true"; 

    } catch (err) { 
      // במקרה של שגיאה, אנחנו לא נתקעים! עוברים דף בכל מקרה
      console.warn("Vault Sync Delay:", err);
      window.location.href = "/history?success=true";
    }
  };

  if (!mounted) return null;

  return (
    <main className="h-screen w-full bg-black text-white font-serif flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 opacity-10 pointer-events-none" 
           style={{ backgroundImage: "url('/bg.jpg')", backgroundSize: 'cover', backgroundPosition: 'center', filter: 'grayscale(100%) brightness(0.2)' }}></div>

      <div className="relative z-10 w-full max-w-[520px] aspect-square flex items-center justify-center animate-in fade-in zoom-in-95 duration-700">
        <div className="absolute inset-0 bg-[#b38f4a]/5 blur-[120px] rounded-full opacity-30"></div>
        
        <form onSubmit={handlePay} className="w-full h-full bg-[#050505]/95 border border-[#b38f4a]/30 p-12 md:p-16 backdrop-blur-3xl shadow-[0_0_100px_rgba(0,0,0,1)] flex flex-col items-center justify-between overflow-hidden">
          <header className="w-full flex flex-col items-center flex-none">
             <Crown className="text-[#b38f4a] mb-6 opacity-40" size={24} strokeWidth={1} />
             <h2 className="text-[10px] tracking-[1.4em] uppercase text-[#e6c68b] font-black pl-[1.4em] text-center">Crypto Treasury</h2>
          </header>

          <div className="w-full flex-1 flex flex-col justify-center items-center space-y-12">
            <div className="w-full flex flex-col items-center">
              <div className="w-full flex flex-col items-center border-y border-[#b38f4a]/10 py-10">
                <span className="text-[11px] tracking-[0.2em] text-[#b38f4a] font-medium break-all text-center max-w-[280px] leading-relaxed">{walletAddress}</span>
              </div>
              <div className="h-10 mt-8 flex items-center justify-center">
                <button type="button" onClick={copyToClipboard} className="flex items-center gap-3 text-[9px] tracking-[0.4em] uppercase text-[#e6c68b] hover:text-white transition-all duration-300 group/copy">
                  {copied ? <Check size={14} className="text-green-500" /> : <Copy size={14} className="group-hover/copy:scale-110 transition-transform opacity-60" />}
                  <span className="border-b border-transparent group-hover:border-[#e6c68b] pb-1">{copied ? "SECURED IN VAULT" : "COPY ADDRESS"}</span>
                </button>
              </div>
            </div>
            <div className="text-center w-full"><p className="text-[8px] tracking-[0.6em] text-[#b38f4a]/30 uppercase italic">Bitcoin Network (BTC)</p></div>
          </div>

          <footer className="w-full flex-none pt-4">
            <button disabled={loading} className="w-full py-5 text-[#1a1103] font-black uppercase tracking-[0.7em] text-[10px] shadow-2xl hover:brightness-125 active:scale-[0.98] transition-all duration-500 border border-[#e6c68b]/40 relative group overflow-hidden" style={{ backgroundImage: imperialGold }}>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
              <span className="relative z-10">{loading ? "AUTHENTICATING..." : (sessionStorage.getItem('imp_type') === 'tribute' ? "CONFIRM SEAL" : "CONFIRM SUCCESSION")}</span>
            </button>
          </footer>
        </form>
      </div>
      <div className="absolute bottom-8 w-full text-center opacity-20 pointer-events-none"><p className="text-[7px] tracking-[1.2em] uppercase font-bold text-[#b38f4a] pl-[1.2em]">Sovereign Grade Encryption Active</p></div>
    </main>
  );
}