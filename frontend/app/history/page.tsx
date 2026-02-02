"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { supabase } from '../../lib/supabaseClient'; // שיניתי לנתיב יחסי בטוח

// הגדרת ה"צורה" של הנתונים עבור TypeScript
interface Sovereign {
  id: number;
  name: string;
  image_url: string;
  price_paid: number;
}

interface Tribute {
  id: number;
  name: string;
  location?: string;
}

export default function HistoryPage() {
  const router = useRouter();
  // הגדרת ה-State עם הסוגים הנכונים
  const [sovereigns, setSovereigns] = useState<Sovereign[]>([]);
  const [tributes, setTributes] = useState<Tribute[]>([]);
  const [loading, setLoading] = useState(true);

  const imperialGold = `linear-gradient(110deg, #2a1a05 0%, #7a5210 25%, #b38f4a 45%, #e6c68b 50%, #b38f4a 55%, #7a5210 75%, #2a1a05 100%)`;

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const { data: sovData } = await supabase.from('sovereigns').select('*').order('created_at', { ascending: false });
        const { data: tribData } = await supabase.from('tributes').select('*').order('created_at', { ascending: false });
        
        if (sovData) setSovereigns(sovData as Sovereign[]);
        if (tribData) setTributes(tribData as Tribute[]);
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  return (
    <main className="min-h-screen w-full bg-black text-white font-serif p-8 md:p-20 relative overflow-hidden">
      <button 
        onClick={() => router.push('/')}
        className="absolute top-10 left-10 flex items-center gap-2 text-[#b38f4a] hover:text-white transition-all uppercase text-[10px] tracking-[0.4em] font-bold z-50"
      >
        <ArrowLeft size={16} /> Return to Throne
      </button>

      <header className="mt-20 mb-16 text-center">
        <h1 className="text-4xl md:text-6xl font-black italic tracking-[0.3em] bg-clip-text text-transparent uppercase mb-4" style={{ backgroundImage: imperialGold }}>
          The Imperial Archives
        </h1>
        <div className="h-[1px] w-24 bg-[#b38f4a] mx-auto opacity-50"></div>
      </header>

      <section className="max-w-6xl mx-auto mb-24">
        <h2 className="text-[12px] tracking-[0.6em] uppercase text-white/40 mb-10 border-b border-[#b38f4a]/10 pb-4 font-bold">The Sovereign Lineage</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {loading ? (
            <div className="text-[#b38f4a] animate-pulse">Consulting the scrolls...</div>
          ) : sovereigns.map((sov) => (
            <div key={sov.id} className="border border-[#b38f4a]/30 p-6 bg-white/5">
              <img src={sov.image_url} alt={sov.name} className="w-full h-48 object-cover mb-4 grayscale" />
              <h3 className="text-[#b38f4a] tracking-widest uppercase font-bold">{sov.name}</h3>
              <p className="text-[10px] text-white/40 mt-2 italic">Price: {sov.price_paid} Gold</p>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-6xl mx-auto">
        <h2 className="text-[12px] tracking-[0.6em] uppercase text-white/40 mb-10 border-b border-[#b38f4a]/10 pb-4 font-bold">The Wall of Allegiance</h2>
        <div className="flex flex-wrap gap-4">
          {!loading && tributes.map((trib) => (
            <div key={trib.id} className="bg-white/5 border border-[#b38f4a]/10 px-4 py-2 text-[10px] tracking-widest uppercase text-[#b38f4a]">
              {trib.name} {trib.location ? `• ${trib.location}` : ''}
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}