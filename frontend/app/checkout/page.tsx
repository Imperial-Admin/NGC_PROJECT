'use client';
import { useState, Suspense } from 'react';
import { ChevronLeft, Lock, Shield, CreditCard, Bitcoin, Check } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';

function CheckoutContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // זיהוי המקור: האם זו תרומה לטבלה או העלאת תמונה
  const source = searchParams.get('source');
  const isTribute = source === 'tribute';

  // ניהול מצב התשלום: 'selection' (בחירה), 'card' (אשראי), 'crypto' (קריפטו)
  const [method, setMethod] = useState<'selection' | 'card' | 'crypto'>('selection');

  const goldGradient = `linear-gradient(to right, rgba(179, 143, 74, 0.2), rgba(247, 239, 138, 0.5), rgba(179, 143, 74, 0.2))`;
  const imperialGold = `linear-gradient(110deg, #2a1a05 0%, #7a5210 25%, #b38f4a 45%, #e6c68b 50%, #b38f4a 55%, #7a5210 75%, #2a1a05 100%)`;

  return (
    <main className="fixed inset-0 w-full h-full bg-[#050505] text-white flex items-center justify-center font-serif overflow-hidden p-6">
      <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: `radial-gradient(circle at 50% 50%, #1a1103 0%, #050505 100%)` }}></div>

      <div className="relative z-10 w-full max-w-[650px]">
        {/* כפתור חזרה חכם */}
        <button 
          onClick={() => method === 'selection' ? router.back() : setMethod('selection')} 
          className="absolute -left-44 top-1/2 -translate-y-1/2 hidden xl:flex items-center text-[#f1e4d1] text-[10px] tracking-[0.5em] uppercase hover:text-[#b38f4a] transition-all font-black whitespace-nowrap"
        >
          <ChevronLeft className="w-5 h-5 mr-2" strokeWidth={3} /> {method === 'selection' ? 'Return' : 'Back to Selection'}
        </button>

        <div className="w-full bg-white/[0.02] border border-[#b38f4a]/30 p-12 backdrop-blur-xl shadow-[0_0_80px_-20px_rgba(0,0,0,1)] relative rounded-sm animate-in fade-in zoom-in-95 duration-700">
            <div className="absolute top-0 left-0 w-full h-[1px]" style={{ background: goldGradient }}></div>
            <div className="absolute bottom-0 left-0 w-full h-[1px]" style={{ background: goldGradient }}></div>
            
            {/* כותרת משתנה לפי המקור */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-10">
                <div className="space-y-4 flex-1">
                    <Shield className="w-7 h-7 text-[#b38f4a]" strokeWidth={1.5} />
                    <div>
                        <h1 className="text-xl tracking-[0.5em] uppercase font-medium text-white mb-1">
                          {isTribute ? 'Imperial Tribute' : 'Ascension Fee'}
                        </h1>
                        <p className="text-[10px] tracking-[0.3em] text-[#b38f4a] uppercase font-black">
                          {isTribute ? 'Rank Advancement Status' : 'Permanent Sovereignty Status'}
                        </p>
                    </div>
                </div>
                <div className="text-right">
                    <span className="block text-[10px] tracking-[0.4em] text-[#b38f4a] uppercase font-black mb-1">Offering</span>
                    <span className="text-5xl font-light text-white tracking-tighter">$10.00</span>
                </div>
            </div>

            <div className="h-[1px] w-full bg-[#b38f4a]/20 my-10"></div>

            {/* --- שלב א: בחירת אמצעי תשלום --- */}
            {method === 'selection' && (
              <div className="space-y-6 animate-in fade-in duration-500">
                <p className="text-center text-[10px] tracking-[0.5em] uppercase text-[#f1e4d1]/60 mb-8">Select Payment Method</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <button 
                    onClick={() => setMethod('card')}
                    className="flex flex-col items-center justify-center gap-4 p-8 border border-[#b38f4a]/20 bg-black/40 hover:bg-[#b38f4a]/10 transition-all group"
                  >
                    <CreditCard className="w-8 h-8 text-[#b38f4a] group-hover:scale-110 transition-transform" />
                    <span className="text-[10px] tracking-[0.3em] uppercase font-bold text-white">Credit Card</span>
                  </button>
                  <button 
                    onClick={() => setMethod('crypto')}
                    className="flex flex-col items-center justify-center gap-4 p-8 border border-[#b38f4a]/20 bg-black/40 hover:bg-[#b38f4a]/10 transition-all group"
                  >
                    <Bitcoin className="w-8 h-8 text-[#b38f4a] group-hover:scale-110 transition-transform" />
                    <span className="text-[10px] tracking-[0.3em] uppercase font-bold text-white">Cryptocurrency</span>
                  </button>
                </div>
              </div>
            )}

            {/* --- שלב ב: טופס אשראי --- */}
            {method === 'card' && (
              <div className="space-y-6 animate-in slide-in-from-right-4 duration-500">
                <div className="grid grid-cols-1 gap-6">
                  <input type="text" placeholder="CARDHOLDER NAME" className="w-full bg-transparent border-b border-[#b38f4a]/30 py-3 text-[10px] tracking-[0.3em] uppercase focus:outline-none focus:border-[#b38f4a] text-white" />
                  <input type="text" placeholder="CARD NUMBER" className="w-full bg-transparent border-b border-[#b38f4a]/30 py-3 text-[10px] tracking-[0.3em] uppercase focus:outline-none focus:border-[#b38f4a] text-white" />
                  <div className="grid grid-cols-2 gap-6">
                    <input type="text" placeholder="EXPIRY (MM/YY)" className="w-full bg-transparent border-b border-[#b38f4a]/30 py-3 text-[10px] tracking-[0.3em] uppercase focus:outline-none focus:border-[#b38f4a] text-white" />
                    <input type="text" placeholder="CVV" className="w-full bg-transparent border-b border-[#b38f4a]/30 py-3 text-[10px] tracking-[0.3em] uppercase focus:outline-none focus:border-[#b38f4a] text-white" />
                  </div>
                </div>
                <button 
                  onClick={() => router.push('/upload?payment=success')}
                  className="w-full py-5 text-[#1a0f00] text-[11px] font-black uppercase tracking-[0.6em] shadow-2xl mt-4" 
                  style={{ backgroundImage: imperialGold }}
                >
                  Confirm Offering
                </button>
              </div>
            )}

            {/* --- שלב ג: פרטי קריפטו --- */}
            {method === 'crypto' && (
              <div className="text-center space-y-8 animate-in slide-in-from-right-4 duration-500">
                <div className="p-6 border border-[#b38f4a]/20 bg-black/60 rounded-sm">
                  <p className="text-[9px] tracking-[0.3em] uppercase text-[#b38f4a] mb-4">Sovereign Wallet Address (BTC/ETH)</p>
                  <p className="text-xs text-white font-mono break-all select-all cursor-pointer hover:text-[#b38f4a] transition-colors">
                    0x71C7656EC7ab88b098defB751B7401B5f6d8976F
                  </p>
                  <p className="text-[8px] tracking-[0.2em] uppercase text-gray-500 mt-4 italic">Send exactly $10.00 equivalent</p>
                </div>
                <button 
                  onClick={() => router.push('/upload?payment=success')}
                  className="w-full py-5 text-[#1a0f00] text-[11px] font-black uppercase tracking-[0.6em]" 
                  style={{ backgroundImage: imperialGold }}
                >
                  I Have Sent the Offering
                </button>
              </div>
            )}

            <div className="mt-10 flex items-center justify-center gap-3">
                <Lock className="w-3.5 h-3.5 text-[#b38f4a]" strokeWidth={2} />
                <p className="text-[8px] tracking-[0.4em] uppercase text-white font-bold opacity-60">Secure Encrypted Imperial Transaction</p>
            </div>
        </div>
      </div>
    </main>
  );
}

// מעטפת Suspense חובה לורסל
export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="h-screen w-full bg-black flex items-center justify-center text-[#D4AF37] italic tracking-[0.5em] uppercase text-[10px]">Preparing Secure Gateway...</div>}>
      <CheckoutContent />
    </Suspense>
  );
}