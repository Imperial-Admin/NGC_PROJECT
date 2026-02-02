"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
// ייבוא של ה-Client שיוצר את החיבור
import { supabase } from '@/lib/supabaseClient'; 

export default function HistoryPage() {
  const router = useRouter();
  const [sovereigns, setSovereigns] = useState([]);
  const [tributes, setTributes] = useState([]);
  const [loading, setLoading] = useState(true);

  const imperialGold = `linear-gradient(110deg, #2a1a05 0%, #7a5210 25%, #b38f4a 45%, #e6c68b 50%, #b38f4a 55%, #7a5210 75%, #2a1a05 100%)`;

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        // משיכת נתונים מטבלת הריבונים
        const { data: sovData, error: sovError } = await supabase
          .from('sovereigns')
          .select('*')
          .order('created_at', { ascending: false });

        // משיכת נתונים מטבלת התרומות
        const { data: tribData, error: tribError } = await supabase
          .from('tributes')
          .select('*')
          .order('created_at', { ascending: false });

        if (sovError) console.error("Sovereign Error:", sovError);
        if (tribError) console.error("Tribute Error:", tribError);

        if (sovData) setSovereigns(sovData);
        if (tribData) setTributes(tribData);
      } catch (err) {
        console.error("Fetch Error:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  return (
    <main className="min-h-screen w-full bg-black text-white font-serif p-8 md:p-20 relative overflow-hidden">
      {/* כפתור חזרה */}
      <button 
        onClick={() => router.push('/')}
        className="absolute top-10 left-10 flex items-center gap-2 text-[#b38f4a] hover:text-white transition-all uppercase text-[10px] tracking-[0.4em] font-bold z-50"
      >
        <ArrowLeft size={16} /> Return to Throne
      </button>

      {/* כותרת הדף */}
      <header className="mt-20 mb-16 text-center">
        <h1 className="text-4xl md:text-6xl font-black italic tracking-[0.3em] bg-clip-text text-transparent uppercase mb-4" style={{ backgroundImage: imperialGold }}>
          The Imperial Archives
        </h1>
        <div className="h-[1px] w-24 bg-[#b38f4a] mx-auto opacity-50"></div>
        <p className="mt-6 text-[10px] md:text-xs tracking-[0.5em] uppercase text-[#b38f4a] opacity-70 italic">
          Every ascension, every allegiance. Secured for eternity.
        </p>
      </header>

      {/* רשימת הריבונים */}
      <section className="max-w-6xl mx-auto mb-24">
        <h2 className="text-[12px] tracking-[0.6em] uppercase text-white/40 mb-10 border-b border-[#b38f4a]/10 pb-4 font-bold">The Sovereign Lineage</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {loading ? (
            <div className="text-[#b38f4a] animate-pulse uppercase tracking-widest text-xs">Consulting the scrolls...</div>
          ) : sovereigns.length > 0 ? (
            sovereigns.map((sov) => (
              <div key={sov.id} className="border border-[#b38f4a]/30 p-6 bg-white/5 group hover:border-[#b38f4a] transition-all">
                <img src={sov.image_url} alt={sov.name} className="w-full h-48 object-cover mb-4 grayscale group-hover:grayscale-0 transition-all border border-[#b38f4a]/10" />
                <h3 className="text-[#b38f4a] tracking-widest uppercase font-bold text-sm">{sov.name}</h3>
                <p className="text-[9px] text-white/40 mt-2 italic tracking-widest">Ascended with {sov.price_paid} Gold</p>
              </div>
            ))
          ) : (
            <div className="border border-[#b38f4a]/20 p-8 text-center bg-white/5 opacity-30 italic text-[10px] tracking-widest uppercase">
              Awaiting records...
            </div>
          )}
        </div>
      </section>

      {/* רשימת התרומות */}
      <section className="max-w-6xl mx-auto">
        <h2 className="text-[12px] tracking-[0.6em] uppercase text-white/40 mb-10 border-b border-[#b38f4a]/10 pb-4 font-bold">The Wall of Allegiance</h2>
        <div className="flex flex-wrap gap-4">
          {!loading && tributes.length > 0 ? (
            tributes.map((trib) => (
              <div key={trib.id} className="bg-white/5 border border-[#b38f4a]/10 px-4 py-2 text-[10px] tracking-[0.3em] uppercase text-[#b38f4a] hover:bg-[#b38f4a]/10 transition-colors">
                {trib.name} {trib.location ? `• ${trib.location}` : ''}
              </div>
            ))
          ) : (
            !loading && <div className="opacity-30 italic text-[10px] tracking-widest uppercase">Awaiting tributes...</div>
          )}
        </div>
      </section>
    </main>
  );
}