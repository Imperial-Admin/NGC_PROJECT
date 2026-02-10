// @ts-nocheck
'use client';
import { useState, useEffect, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { Crown } from 'lucide-react';
import { supabase } from '../../lib/supabaseClient'; // תיקון הנתיב: עולים 2 קומות למעלה

function SealContent() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [countryCode, setCountryCode] = useState('un'); // סטייט חדש לשמירת קוד המדינה
  const [mounted, setMounted] = useState(false);
  
  const imperialGold = `linear-gradient(110deg, #2a1a05 0%, #7a5210 25%, #b38f4a 45%, #e6c68b 50%, #b38f4a 55%, #7a5210 75%, #2a1a05 100%)`;

  useEffect(() => {
    setMounted(true);
    // זיהוי אוטומטי של המדינה של המשתמש
    fetch('https://ipapi.co/json/')
      .then(res => res.json())
      .then(data => { 
        if(data.country) setCountryCode(data.country.toLowerCase()); 
      })
      .catch(() => {});
  }, []);

  // לוגיקת חלוקת השם כפי שמופיעה ב-History
  const nameParts = title.split(' ');
  const firstName = nameParts[0] || "YOUR";
  const lastName = nameParts.slice(1).join(' ') || "NAME";

  const handleProceed = () => {
    if (!title) return;

    // הזרמת הנתון לשידור החי - מעכשיו כולל את קוד המדינה לסנכרון הדגל
    supabase.from('heart_wall').insert([{ name: title, country_code: countryCode }]).then(() => {
      sessionStorage.setItem('imp_name', title); 
      sessionStorage.setItem('imp_msg', subtitle);
      sessionStorage.setItem('imp_price', "10");
      sessionStorage.setItem('imp_type', 'tribute'); 
      router.push('/checkout'); 
    });
  };

  if (!mounted) return null;

  return (
    <main className="h-screen w-full bg-black text-white flex flex-col items-center justify-center overflow-hidden font-serif relative select-none">
      <div className="absolute inset-0 z-0" style={{ backgroundImage: "url('/bg.jpg')", backgroundSize: 'cover', filter: 'brightness(0.2)' }}></div>      
      
      <div className="w-full max-w-[1200px] px-6 relative z-10 flex flex-col items-center justify-center gap-6">
          
            {/* כרטיס HEART WALL מוקטן למניעת גלילה */}
            <div className="relative w-[210px] aspect-[3/4] bg-[#050505] border-2 border-[#b38f4a]/50 rounded-[12px] flex flex-col items-center justify-center p-4 shadow-2xl overflow-hidden group">
                
                {/* תגית המחיר מוקטנת */}
                <div className="absolute -top-0.5 -right-0.5 z-50 w-16 h-6 rounded-bl-md flex items-center justify-center border-l border-b border-[#b38f4a]/30" style={{ backgroundImage: imperialGold }}>
                    <h3 className="text-[10px] font-black text-[#1a1103] tracking-tighter">$10</h3>
                </div>

                {/* הלב המקורי בפינה - מוקטן */}
                <div className="absolute top-4 left-4 z-20">
                    <img src="/heart.png" alt="Heart" className="w-[28px] h-[28px] object-contain" />
                </div>

                {/* הכתר המוטה ברקע - מוקטן */}
                <div className="absolute -bottom-2 -right-2 opacity-10 blur-[1px] rotate-12 pointer-events-none">
                    <Crown size={80} className="text-[#b38f4a]" />
                </div>

                {/* תצוגת השם המפוצל - פונטים מותאמים */}
                <div className="text-center w-full z-10 px-2 mt-4">
                    <h3 className="text-lg md:text-xl tracking-[0.1em] uppercase font-black text-white leading-tight break-words">
                        {firstName}
                    </h3>
                    <h4 className="text-xs md:text-sm tracking-[0.1em] uppercase font-medium text-white/80 mt-0.5 break-words">
                        {lastName}
                    </h4>
                </div>

                {/* חלק תחתון */}
                <div className="absolute bottom-6 left-0 w-full text-center z-10">
                    <div className="w-12 h-[1px] bg-gradient-to-r from-transparent via-[#b38f4a]/30 to-transparent mx-auto mb-2"></div>
                    <p className="text-[7px] tracking-[0.2em] uppercase text-[#b38f4a]/70 font-bold px-3 truncate">
                        {subtitle || "HEART LEDGER"}
                    </p>
                </div>
            </div>

            {/* שדות קלט צפופים יותר */}
            <div className="w-full max-w-sm space-y-4">
              <div className="relative">
                <input 
                  type="text" 
                  placeholder="NAME FOR THE HEART WALL" 
                  value={title} 
                  maxLength={15} 
                  onChange={e => setTitle(e.target.value)} 
                  className="w-full bg-transparent border-b border-[#b38f4a]/20 py-2 text-center focus:outline-none focus:border-[#b38f4a] text-[10px] tracking-[0.4em] uppercase text-white font-bold transition-all" 
                />
              </div>
              <div className="relative">
                <input 
                  type="text" 
                  placeholder="YOUR HEART MESSAGE" 
                  value={subtitle} 
                  maxLength={100} 
                  onChange={e => setSubtitle(e.target.value)} 
                  className="w-full bg-transparent border-b border-[#b38f4a]/20 py-2 text-center focus:outline-none focus:border-[#b38f4a] text-[9px] tracking-[0.3em] uppercase text-white italic transition-all" 
                />
              </div>
            </div>

            <button onClick={handleProceed} disabled={!title} className="w-[280px] py-4 text-[#1a1103] font-black uppercase tracking-[0.5em] text-[10px] shadow-2xl active:scale-95 transition-all disabled:opacity-30" style={{ backgroundImage: imperialGold }}>
              Review Tribute
            </button>
      </div>
    </main>
  );
}

export default function SealPage() {
  return (
    <Suspense fallback={<div className="h-screen w-full bg-black flex items-center justify-center text-[#D4AF37] italic tracking-[0.5em] uppercase text-[10px]">Loading Heart Wall Assets...</div>}>
      <SealContent />
    </Suspense>
  );
}