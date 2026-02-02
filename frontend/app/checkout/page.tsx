'use client';
import { ChevronLeft, Lock, Shield } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function CheckoutPage() {
  const router = useRouter();
  
  // זהב המלוכה המדויק (#b38f4a) והגרדיאנט לקווים
  const goldGradient = `linear-gradient(to right, rgba(179, 143, 74, 0.2), rgba(247, 239, 138, 0.5), rgba(179, 143, 74, 0.2))`;

  return (
    <main className="fixed inset-0 w-full h-full bg-[#050505] text-white flex items-center justify-center font-serif overflow-hidden p-6">
      {/* רקע טקסטורה מלכותי עדין */}
      <div className="absolute inset-0 opacity-20 pointer-events-none" 
           style={{ backgroundImage: `radial-gradient(circle at 50% 50%, #1a1103 0%, #050505 100%)` }}></div>

      {/* מיכל מלבני רחב (600px) */}
      <div className="relative z-10 w-full max-w-[600px]">
        
        {/* כפתור חזרה - מיושר למרכז גובה המסגרת בצד שמאל */}
        <button 
          onClick={() => router.back()} 
          className="absolute -left-44 top-1/2 -translate-y-1/2 hidden xl:flex items-center text-[#f1e4d1] text-[10px] tracking-[0.5em] uppercase hover:text-[#b38f4a] transition-all font-black whitespace-nowrap"
        >
          <ChevronLeft className="w-5 h-5 mr-2" strokeWidth={3} /> Return
        </button>

        {/* כפתור חזרה למובייל */}
        <button 
          onClick={() => router.back()} 
          className="xl:hidden absolute -top-12 left-0 flex items-center text-[#f1e4d1] text-[10px] tracking-[0.4em] uppercase font-black"
        >
          <ChevronLeft className="w-4 h-4 mr-1" /> Back
        </button>

        {/* כרטיס הסיכום המלבני */}
        <div className="w-full bg-white/[0.02] border border-[#b38f4a]/30 p-12 backdrop-blur-xl shadow-[0_0_80px_-20px_rgba(0,0,0,1)] relative rounded-sm">
            {/* פסי זהב עליון ותחתון ברורים */}
            <div className="absolute top-0 left-0 w-full h-[1px]" style={{ background: goldGradient }}></div>
            <div className="absolute bottom-0 left-0 w-full h-[1px]" style={{ background: goldGradient }}></div>
            
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-10">
                
                {/* פרטי המוצר בזהב המדויק (#b38f4a) */}
                <div className="space-y-4 flex-1">
                    <Shield className="w-7 h-7 text-[#b38f4a]" strokeWidth={1.5} />
                    <div>
                        <h1 className="text-xl tracking-[0.5em] uppercase font-medium text-white mb-1">Imperial Tribute</h1>
                        <p className="text-[10px] tracking-[0.3em] text-[#b38f4a] uppercase font-black">Permanent Sovereignty Status</p>
                    </div>
                </div>

                {/* מחיר בלבן בוהק וחד */}
                <div className="text-right">
                    <span className="block text-[10px] tracking-[0.4em] text-[#b38f4a] uppercase font-black mb-1">Offering Amount</span>
                    <span className="text-5xl font-light text-white tracking-tighter">$10.00</span>
                </div>
            </div>

            {/* קו מפריד בזהב המלכותי */}
            <div className="h-[1px] w-full bg-[#b38f4a]/20 my-12"></div>

            {/* כפתור תשלום מאובטח עם הקישור שמוביל חזרה לחגיגה */}
            <button 
              onClick={() => router.push('/upload?payment=success')}
              className="group relative w-full overflow-hidden bg-[#b38f4a] py-6 transition-all hover:bg-[#c5a35d] active:scale-[0.99] shadow-[0_20px_50px_-10px_rgba(179,143,74,0.4)]"
            >
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" 
                     style={{ background: `linear-gradient(110deg, transparent 30%, rgba(255,255,255,0.5) 45%, rgba(255,255,255,0.1) 50%, transparent 60%)`, backgroundSize: '200% 100%', animation: 'shimmer 2.5s infinite linear' }}></div>
                
                <span className="relative flex items-center justify-center gap-4 text-[#1a0f00] text-[11px] font-black uppercase tracking-[0.6em]">
                    Secure Payment
                </span>
            </button>

            {/* שורת אמון מעודכנת */}
            <div className="mt-10 flex flex-col items-center gap-6">
                <div className="flex flex-wrap justify-center items-center gap-x-8 gap-y-3 text-[9px] tracking-[0.3em] font-black text-[#f1e4d1]">
                    <span className="hover:text-white transition-colors cursor-default">MASTERCARD</span>
                    <span className="hover:text-white transition-colors cursor-default">VISA</span>
                    <span className="hover:text-white transition-colors cursor-default">DINERS</span>
                    <span className="hover:text-white transition-colors cursor-default">AMEX</span>
                    <div className="h-3 w-[1px] bg-[#b38f4a]/40 hidden md:block"></div>
                    <span className="text-[#b38f4a]">BITCOIN</span>
                    <span className="text-[#b38f4a]">ETH</span>
                    <span className="text-[#b38f4a]">USDT</span>
                </div>
                
                <div className="flex items-center gap-3">
                    <Lock className="w-3.5 h-3.5 text-[#b38f4a]" strokeWidth={2} />
                    <p className="text-[8px] tracking-[0.4em] uppercase text-white font-bold">
                        Secure Encrypted Imperial Transaction
                    </p>
                </div>
            </div>
        </div>

        {/* הצהרה משפטית */}
        <p className="mt-10 text-[8px] tracking-[0.2em] text-[#b38f4a] uppercase text-center leading-relaxed max-w-md mx-auto font-bold">
            Your legacy is protected by the imperial archives. All transactions are final and secured by global standards.
        </p>
      </div>

      <style jsx>{`
        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
    </main>
  );
}