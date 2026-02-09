"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function CheckoutPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [price, setPrice] = useState("10"); 
  const [purchaseType, setPurchaseType] = useState("sovereign");

  // סנכרון נתונים מהדף הקודם (Upload) מבלי לשנות את העיצוב
  useEffect(() => {
    const savedName = sessionStorage.getItem('imp_name');
    const savedPrice = sessionStorage.getItem('imp_price');
    const savedType = sessionStorage.getItem('imp_type');
    if (savedName) setName(savedName);
    if (savedPrice) setPrice(savedPrice);
    if (savedType) setPurchaseType(savedType);
  }, []);

  // הגדרת הזהב המלכותי המדויק שלך
  const imperialGold = `linear-gradient(110deg, #2a1a05 0%, #7a5210 25%, #b38f4a 45%, #e6c68b 50%, #b38f4a 55%, #7a5210 75%, #2a1a05 100%)`;

  const handleProceedToPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;

    // שמירת השם בזיכרון - ללא שינוי
    sessionStorage.setItem('imp_name', name);

    // העברה לדף הבא - ללא שינוי
    router.push('/payment'); 
  };

  return (
    <main className="h-screen w-full bg-[#050505] text-white font-serif flex flex-col items-center justify-center p-4 relative overflow-hidden">
      
      {/* הטופס המעוצב - הכותרת הוסרה, הכל ממורכז */}
      <div className="w-full max-w-xl bg-black/80 border border-[#b38f4a]/30 p-10 md:p-14 shadow-[0_0_80px_rgba(0,0,0,1),0_0_30px_rgba(179,143,74,0.1)] relative z-10 backdrop-blur-md">
        <form onSubmit={handleProceedToPayment} className="space-y-12">
          <div className="flex flex-col items-center">
            <label className="block text-[9px] tracking-[0.6em] uppercase text-[#b38f4a] mb-8 font-bold text-center opacity-80">
              {purchaseType === 'tribute' ? 'SEAL YOUR HEART MESSAGE' : 'ESTABLISH YOUR ROYAL IDENTITY'}
            </label>
            <input 
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={purchaseType === 'tribute' ? 'YOUR NAME ON THE WALL...' : 'WHO SHALL RULE NEXT?...'}
              className="w-full bg-transparent border-b border-[#b38f4a]/20 py-4 text-center text-2xl italic text-[#e6c68b] placeholder:text-[#b38f4a]/20 outline-none focus:border-[#b38f4a] transition-all duration-700 uppercase"
              required
            />
          </div>

          <button 
            type="submit"
            className="w-full py-6 text-black font-black uppercase tracking-[0.5em] text-xs shadow-[0_10px_40px_rgba(0,0,0,0.5)] hover:brightness-125 active:scale-[0.97] transition-all duration-300 border border-[#e6c68b]/20"
            style={{ backgroundImage: imperialGold }}
          >
            PAY ${price} & {purchaseType === 'tribute' ? 'SEAL' : 'RULE'}
          </button>
        </form>
      </div>

      {/* רקע מלכותי מעומעם - ללא שינוי */}
      <div className="absolute inset-0 z-0 opacity-10 pointer-events-none scale-110" 
           style={{ backgroundImage: "url('/bg.jpg')", backgroundSize: 'cover', backgroundPosition: 'center', filter: 'grayscale(100%)' }}></div>
      
      {/* הילה דקורטיבית - ללא שינוי */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#b38f4a]/5 rounded-full blur-[120px] pointer-events-none"></div>
    </main>
  );
}