'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';
import { Shield, Activity, TrendingUp, Globe, Heart } from 'lucide-react';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function Home() {
  const router = useRouter();
  const [ledgers, setLedgers] = useState<any[]>([]);
  const [likes, setLikes] = useState(756567);
  const [isHeartBeating, setIsHeartBeating] = useState(false);

  useEffect(() => {
    const fetchLedgers = async () => {
      const { data } = await supabase.from('tribute_ledger').select('*').order('amount', { ascending: false });
      if (data) setLedgers(data);
    };
    fetchLedgers();
  }, []);

  const imperialGold = `linear-gradient(110deg, #2a1a05 0%, #7a5210 25%, #b38f4a 45%, #e6c68b 50%, #b38f4a 55%, #7a5210 75%, #2a1a05 100%)`;

  return (
    <main className="h-screen w-full bg-black text-white font-serif overflow-hidden relative select-none">
      {/* רקע ותפאורה */}
      <div className="absolute inset-0 bg-[url('/bg.jpg')] bg-cover opacity-30 brightness-[0.3]"></div>
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/40 to-black"></div>

      {/* Header */}
      <header className="absolute top-0 left-0 w-full p-8 z-50 flex justify-between items-start">
        <div className="space-y-1">
          <h1 className="text-4xl font-black tracking-tighter italic" style={{ background: imperialGold, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>NGC</h1>
          <p className="text-[7px] tracking-[0.6em] uppercase text-[#b38f4a] opacity-80">— THE SOVEREIGN ASSET —</p>
        </div>
        <div className="text-right">
          <div className="flex items-center gap-2 text-red-500 animate-pulse">
            <div className="w-1.5 h-1.5 rounded-full bg-red-500"></div>
            <span className="text-[8px] tracking-[0.3em] font-bold uppercase">Live</span>
          </div>
          <p className="text-2xl font-light tracking-tighter mt-1">124,500</p>
          <p className="text-[7px] tracking-[0.2em] uppercase text-gray-500">Live Global Presence</p>
        </div>
      </header>

      {/* Main Dashboard Grid */}
      <div className="relative h-full w-full grid grid-cols-12 gap-4 p-8 pt-32 z-10">
        
        {/* Left Sidebar: Global Pulse */}
        <aside className="col-span-3 space-y-4 h-full">
          <div className="bg-black/60 border border-[#b38f4a]/20 backdrop-blur-md p-6 h-full flex flex-col">
            <div className="flex items-center gap-3 mb-8 border-b border-[#b38f4a]/10 pb-4">
              <Globe className="w-4 h-4 text-[#b38f4a]" />
              <h2 className="text-[9px] tracking-[0.4em] uppercase font-bold text-[#f1e4d1]">Global Pulse</h2>
            </div>
            <div className="space-y-10 flex-1">
              <div className="space-y-2">
                <p className="text-3xl font-light tracking-tighter">{likes.toLocaleString()}</p>
                <p className="text-[7px] tracking-[0.3em] uppercase text-[#b38f4a]/60">Sovereign Allegiances Detected</p>
              </div>
              <div className="space-y-6 opacity-40 text-[8px] tracking-[0.2em] uppercase leading-relaxed italic">
                <p>"Legacy sequence detected: Zurich"</p>
                <p>"Imperial Tier validation active"</p>
                <p>"Global sovereignty protocol initiated"</p>
              </div>
            </div>
            <div className="mt-auto pt-6 flex items-center gap-4">
              <Heart 
                onClick={() => { setLikes(prev => prev + 1); setIsHeartBeating(true); setTimeout(() => setIsHeartBeating(false), 300); }}
                className={`w-6 h-6 cursor-pointer transition-all ${isHeartBeating ? 'scale-125 text-red-600' : 'text-[#b38f4a] hover:scale-110'}`} 
                fill={isHeartBeating ? 'currentColor' : 'none'}
              />
              <span className="text-[8px] tracking-[0.3em] uppercase text-white/40">Affirm Allegiance</span>
            </div>
          </div>
        </aside>

        {/* Center: The Sovereign Frame */}
        <section className="col-span-6 flex flex-col items-center justify-center space-y-8">
            <div className="relative w-full max-w-2xl aspect-[4/5] rounded-lg p-1 shadow-2xl" style={{ backgroundImage: imperialGold }}>
                <div className="h-full w-full bg-black rounded-md overflow-hidden relative group">
                    <img src="/sovereign.jpg" alt="The Sovereign" className="w-full h-full object-cover opacity-90 transition-transform duration-1000 group-hover:scale-105" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
                    
                    <div className="absolute bottom-0 left-0 right-0 p-10 text-center space-y-6">
                        <div className="space-y-1">
                            <h2 className="text-[10px] tracking-[0.6em] uppercase text-[#b38f4a]">The Current Sovereign</h2>
                            <p className="text-sm tracking-[0.4em] uppercase font-black text-white">Alexander Von Berg</p>
                        </div>
                        <button 
                            onClick={() => router.push('/upload')}
                            className="px-12 py-4 bg-transparent border border-[#b38f4a]/40 text-[#b38f4a] text-[9px] tracking-[0.5em] uppercase font-bold hover:bg-[#b38f4a] hover:text-[#1a1103] transition-all"
                        >
                            Claim The Throne
                        </button>
                    </div>
                    
                    {/* תגית מחיר צפה */}
                    <div className="absolute bottom-12 right-0 w-24 h-10 flex items-center justify-center" style={{ backgroundImage: imperialGold }}>
                        <span className="text-[#1a1103] font-black text-lg tracking-tighter">$10</span>
                    </div>
                </div>
            </div>
            {/* כפתור ה-Tribute המרכזי */}
            <button 
                onClick={() => router.push('/checkout?source=tribute')}
                className="w-full max-w-sm py-5 text-[#1a1103] font-black uppercase tracking-[0.6em] text-[10px] shadow-2xl active:scale-95 transition-all" 
                style={{ backgroundImage: imperialGold }}
            >
                Pay Tribute - $10
            </button>
        </section>

        {/* Right Sidebar: Tribute Ledger */}
        <aside className="col-span-3 space-y-4 h-full">
          <div className="bg-black/60 border border-[#b38f4a]/20 backdrop-blur-md p-6 h-full flex flex-col overflow-hidden">
            <div className="flex items-center gap-3 mb-8 border-b border-[#b38f4a]/10 pb-4">
              <Shield className="w-4 h-4 text-[#b38f4a]" />
              <h2 className="text-[9px] tracking-[0.4em] uppercase font-bold text-[#f1e4d1]">Tribute Ledger</h2>
            </div>
            <div className="flex-1 overflow-y-auto custom-scrollbar pr-2">
              <div className="space-y-6">
                {ledgers.map((entry, i) => (
                  <div key={i} className="flex justify-between items-end border-b border-[#b38f4a]/5 pb-3">
                    <div className="space-y-1">
                      <p className="text-[8px] text-[#b38f4a]/40 font-mono">RANK 0{i+1}</p>
                      <p className="text-[11px] tracking-[0.2em] font-bold uppercase">{entry.name}</p>
                    </div>
                    <p className="text-[#b38f4a] text-xs font-mono">${entry.amount.toLocaleString()}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </aside>
      </div>

      {/* Bottom Ticker */}
      <footer className="absolute bottom-0 left-0 w-full h-12 border-t border-[#b38f4a]/10 bg-black flex items-center overflow-hidden">
        <div className="flex whitespace-nowrap animate-marquee">
            {[...Array(10)].map((_, i) => (
                <span key={i} className="mx-12 text-[8px] tracking-[0.5em] uppercase text-[#b38f4a]/40 font-bold">
                    Success is a choice. Sovereignty is a destiny.
                </span>
            ))}
        </div>
      </footer>

      <style jsx>{`
        @keyframes marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        .animate-marquee { animation: marquee 30s linear infinite; }
        .custom-scrollbar::-webkit-scrollbar { width: 2px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #b38f4a33; }
      `}</style>
    </main>
  );
}