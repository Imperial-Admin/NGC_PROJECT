'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function Home() {
  const router = useRouter();
  const [ledgers, setLedgers] = useState<any[]>([]);
  const [likes, setLikes] = useState(0);
  const [isHeartBeating, setIsHeartBeating] = useState(false);
  const [activities, setActivities] = useState<any[]>([]);

  // טעינת הטבלה מה-Database
  useEffect(() => {
    const fetchLedgers = async () => {
      const { data } = await supabase
        .from('tribute_ledger')
        .select('*')
        .order('amount', { ascending: false });
      if (data) setLedgers(data);
    };
    fetchLedgers();
  }, []);

  const imperialGold = `linear-gradient(110deg, #2a1a05 0%, #7a5210 25%, #b38f4a 45%, #e6c68b 50%, #b38f4a 55%, #7a5210 75%, #2a1a05 100%)`;

  // פונקציית העלאת תמונה
  const handleClaim = () => {
    router.push('/upload');
  };

  // פונקציית הלייק (הלב הפועם)
  const handleLike = () => {
    setLikes(prev => prev + 1);
    setIsHeartBeating(true);
    setTimeout(() => setIsHeartBeating(false), 600);
    const newEntry = { id: Date.now(), text: `Imperial Allegiance Sworn` };
    setActivities(prev => [...prev.slice(-9), newEntry]);
    if ((window as any).createFirework) {
      (window as any).createFirework(window.innerWidth / 2, window.innerHeight / 2);
    }
  };

  // --- הפונקציה המעודכנת: שולחת לדף התשלום עם תיוג tribute ---
  const triggerTribute = () => {
    router.push('/checkout?source=tribute');
  };

  return (
    <main className="min-h-screen bg-black text-white font-serif selection:bg-[#b38f4a]/30 overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative h-screen flex flex-col items-center justify-center">
        <div className="absolute inset-0 bg-[url('/bg.jpg')] bg-cover bg-center opacity-20"></div>
        
        <div className="relative z-10 text-center space-y-12 max-w-5xl px-6">
          <div className="space-y-4">
            <h1 className="text-8xl md:text-[12rem] font-black tracking-tighter italic animate-pulse" style={{ background: imperialGold, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              NGC
            </h1>
            <p className="text-[10px] tracking-[1em] uppercase text-[#b38f4a] font-light">The Sovereign Digital Asset</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-2xl mx-auto">
            <button 
              onClick={handleClaim}
              className="group relative py-6 border border-[#b38f4a]/30 text-[#b38f4a] uppercase tracking-[0.5em] text-[10px] font-bold hover:bg-[#b38f4a]/10 transition-all overflow-hidden"
            >
              <span className="relative z-10">Claim The Throne</span>
              <div className="absolute inset-0 bg-[#b38f4a]/5 translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
            </button>

            <button 
              onClick={triggerTribute}
              className="py-6 text-[#1a1103] font-black uppercase tracking-[0.5em] text-[10px] shadow-[0_20px_50px_-15px_rgba(179,143,74,0.5)] active:scale-95 transition-all hover:brightness-110" 
              style={{ backgroundImage: imperialGold }}
            >
              Pay Tribute - $10
            </button>
          </div>
        </div>

        {/* Heartbeat Logic */}
        <div className="absolute bottom-12 flex flex-col items-center gap-4 animate-bounce">
            <button onClick={handleLike} className={`text-3xl transition-transform duration-300 ${isHeartBeating ? 'scale-150 text-red-600' : 'text-[#b38f4a] hover:scale-110'}`}>
                {isHeartBeating ? '❤️' : '🤍'}
            </button>
            <span className="text-[10px] tracking-[0.4em] uppercase text-[#b38f4a]/60 font-bold">{likes.toLocaleString()} Allegiances</span>
        </div>
      </section>

      {/* Table Section */}
      <section className="max-w-6xl mx-auto py-40 px-6">
        <div className="flex flex-col items-center mb-20 space-y-4">
            <Shield className="w-8 h-8 text-[#b38f4a] opacity-50" />
            <h2 className="text-[10px] tracking-[0.8em] uppercase text-[#b38f4a] italic">The Imperial Ledger</h2>
        </div>
        
        <div className="border border-[#b38f4a]/20 bg-white/[0.02] backdrop-blur-md shadow-2xl">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#b38f4a]/20 text-[9px] tracking-[0.5em] uppercase text-[#b38f4a]/50">
                <th className="p-10 font-light">Ranked Sovereign</th>
                <th className="p-10 text-right font-light">Tribute</th>
              </tr>
            </thead>
            <tbody>
              {ledgers.map((entry, i) => (
                <tr key={i} className="border-b border-[#b38f4a]/10 group hover:bg-[#b38f4a]/5 transition-all">
                  <td className="p-10">
                    <div className="flex items-center gap-6">
                        <span className="text-[10px] text-[#b38f4a]/40 font-mono">0{i+1}</span>
                        <span className="text-sm tracking-[0.2em] font-bold uppercase group-hover:text-[#FBF5B7] transition-colors">{entry.name}</span>
                    </div>
                  </td>
                  <td className="p-10 text-right font-mono text-[#b38f4a] text-lg">${entry.amount.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}

// פונקציית עזר לאייקון (למקרה שאינו מיובא)
function Shield({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
    </svg>
  );
}