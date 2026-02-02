"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../lib/supabaseClient';

export default function CheckoutPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAscension = async () => {
    // אם אין שם, פשוט לא עושים כלום (מונע את ההודעה הלבנה)
    if (!name) return; 
    setLoading(true);

    // עדכון ה-Database
    const { error } = await supabase
      .from('sovereigns')
      .insert([{ 
        name: name, 
        price_paid: 20, 
        image_url: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=800' 
      }]);

    if (!error) {
      // מעבר ישיר לדף ההיסטוריה עם פרמטר הזיקוקים (?success=true)
      // מחליף את ה-alert שהיה כאן
      router.push('/history?success=true'); 
    } else {
      // במקרה של שגיאה, נדפיס אותה רק ב-Console כדי לא להרוס את העיצוב
      console.error("Error during ascension:", error.message);
    }
    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-black text-white font-serif flex flex-col items-center justify-center p-8">
      <h1 className="text-4xl md:text-6xl font-black italic tracking-widest text-[#b38f4a] mb-12 uppercase text-center">
        Claim The Throne
      </h1>
      
      <div className="w-full max-w-md bg-white/5 border border-[#b38f4a]/20 p-10 backdrop-blur-sm">
        <label className="block text-[10px] tracking-[0.5em] uppercase text-[#b38f4a] mb-6">Enter Royal Name</label>
        <input 
          type="text" 
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Who shall rule next?..."
          className="w-full bg-black border-b border-[#b38f4a]/30 p-4 text-white outline-none focus:border-[#b38f4a] transition-all mb-10 text-xl italic"
        />
        
        <button 
          onClick={handleAscension}
          disabled={loading}
          className="w-full bg-[#b38f4a] text-black font-black py-6 px-4 hover:bg-white transition-all uppercase tracking-[0.4em] text-xs shadow-[0_0_20px_rgba(179,143,74,0.2)]"
        >
          {loading ? "COMMENCING ASCENSION..." : "PAY 20 GOLD & RULE"}
        </button>
      </div>
    </main>
  );
}