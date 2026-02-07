"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
// שימוש באייקונים מעודנים למראה יוקרתי
import { CreditCard, Bitcoin, ShieldCheck, Crown } from 'lucide-react';

export default function PaymentMethodPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  
  // הגדרת הזהב המלכותי המדויק שלך - ללא שינוי
  const imperialGold = `linear-gradient(110deg, #2a1a05 0%, #7a5210 25%, #b38f4a 45%, #e6c68b 50%, #b38f4a 55%, #7a5210 75%, #2a1a05 100%)`;

  useEffect(() => {
    setMounted(true);
  }, []);

  // מניעת שגיאות Hydration ושיפור מהירות הטעינה
  if (!mounted) return null;

  return (
    <main className="h-screen w-full bg-[#050505] text-white font-serif flex flex-col items-center justify-center p-4 relative overflow-hidden">
      
      {/* אלמנט עיצובי עליון - כתר קטן ועדין */}
      <div className="mb-16 flex flex-col items-center animate-in fade-in slide-in-from-top duration-1000">
        <Crown className="w-6 h-6 text-[#b38f4a] mb-4 opacity-40" strokeWidth={1} />
        <h2 className="text-[10px] tracking-[1em] uppercase text-[#b38f4a] font-bold opacity-80 pl-[1em]">
          Treasury Selection
        </h2>
      </div>

      {/* מיכל הכפתורים - ללא גלילה */}
      <div className="flex flex-col md:flex-row gap-10 w-full max-w-5xl relative z-10">
        
        {/* כפתור אשראי - ללא שינוי */}
        <button 
          onClick={() => router.push('/payment/card')} 
          className="flex-1 group relative p-16 bg-black/40 border border-[#b38f4a]/20 hover:border-[#b38f4a]/60 transition-all duration-700 flex flex-col items-center justify-center backdrop-blur-xl shadow-[0_0_50px_rgba(0,0,0,1)] overflow-hidden"
        >
          {/* אפקט הילה פנימי במעבר עכבר */}
          <div className="absolute inset-0 bg-[#b38f4a]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
          
          <div className="relative z-10 flex flex-col items-center">
            <CreditCard size={56} strokeWidth={1} className="mb-10 text-[#e6c68b] group-hover:scale-110 group-hover:text-white transition-all duration-700" />
            <span className="text-lg font-light tracking-[0.6em] uppercase text-white/90 group-hover:text-white transition-colors mb-2">
              Imperial Card
            </span>
            <div className="h-[1px] w-0 group-hover:w-full bg-[#b38f4a]/40 transition-all duration-700"></div>
          </div>
        </button>

        {/* כפתור קריפטו - אייקון ביטקוין נטוי */}
        <button 
          onClick={() => router.push('/payment/crypto')} 
          className="flex-1 group relative p-16 bg-black/40 border border-[#b38f4a]/20 hover:border-[#b38f4a]/60 transition-all duration-700 flex flex-col items-center justify-center backdrop-blur-xl shadow-[0_0_50px_rgba(0,0,0,1)] overflow-hidden"
        >
          <div className="absolute inset-0 bg-[#b38f4a]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
          
          <div className="relative z-10 flex flex-col items-center">
            {/* השינוי היחיד: הוספת rotate-12 לאייקון */}
            <Bitcoin size={56} strokeWidth={1} className="mb-10 text-[#e6c68b] group-hover:scale-110 group-hover:text-white transition-all duration-700 rotate-12" />
            <span className="text-lg font-light tracking-[0.6em] uppercase text-white/90 group-hover:text-white transition-colors mb-2">
              Crypto Vault
            </span>
            <div className="h-[1px] w-0 group-hover:w-full bg-[#b38f4a]/40 transition-all duration-700"></div>
          </div>
        </button>

      </div>

      {/* רקע דקורטיבי עמוק */}
      <div className="absolute inset-0 z-0 opacity-10 pointer-events-none" 
           style={{ backgroundImage: "url('/bg.jpg')", backgroundSize: 'cover', backgroundPosition: 'center', filter: 'grayscale(100%) brightness(0.3)' }}></div>
      
      {/* תאורת אווירה בפינות */}
      <div className="absolute top-0 left-0 w-full h-full bg-radial-gradient from-transparent via-transparent to-black pointer-events-none"></div>
      <div className="absolute -bottom-24 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[#b38f4a]/10 rounded-full blur-[100px] pointer-events-none"></div>

      {/* תגית אבטחה קטנה למטה */}
      <div className="absolute bottom-10 flex items-center gap-3 opacity-30">
        <ShieldCheck size={14} className="text-[#b38f4a]" />
        <span className="text-[8px] tracking-[0.4em] uppercase font-bold text-[#b38f4a]">Sovereign Encryption Active</span>
      </div>

    </main>
  );
}