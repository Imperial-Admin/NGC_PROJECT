// @ts-nocheck
"use client";
import React from 'react';
import { useRouter } from 'next/navigation';
import { X, ShieldCheck, Scale, AlertTriangle, Image as ImageIcon, Crown } from 'lucide-react';

export default function TermsPage() {
  const router = useRouter();

  return (
    <main className="min-h-screen w-full bg-black text-white p-6 md:p-20 font-serif relative overflow-y-auto">
      <button onClick={() => router.back()} className="fixed top-6 right-6 text-[#b38f4a] hover:text-white transition-all z-50 p-2 bg-black/50 rounded-full border border-[#b38f4a]/20">
        <X size={28} />
      </button>

      <div className="max-w-4xl mx-auto border border-[#b38f4a]/20 p-8 md:p-16 bg-[#050505] shadow-[0_0_100px_rgba(179,143,74,0.1)]">
        <header className="mb-12 border-b border-[#b38f4a]/30 pb-8 text-center">
          <ShieldCheck className="mx-auto mb-4 text-[#D4AF37]" size={48} />
          <h1 className="text-4xl font-black tracking-[0.2em] uppercase text-[#D4AF37] mb-4">Terms of Service</h1>
          <p className="text-[#b38f4a] text-xs uppercase tracking-widest opacity-60">Legal Framework & Sovereignty Protocol</p>
        </header>
        
        <div className="space-y-12 text-left leading-relaxed text-sm md:text-base text-gray-300">
          <section>
            <div className="flex items-center gap-3 mb-4">
              <Scale className="text-[#FBF5B7]" size={24} />
              <h2 className="text-xl font-bold text-[#FBF5B7] uppercase tracking-wider">1. Acceptance of Agreement</h2>
            </div>
            <p>By accessing or interacting with NGC (the "Platform"), you acknowledge that you have read, understood, and agreed to be legally bound by these Terms. This Platform is an interactive digital exhibition. If you do not agree with any part of these terms, you are prohibited from using the service and must exit the Platform immediately.</p>
          </section>

          <section>
            <div className="flex items-center gap-3 mb-4">
              <Crown className="text-[#FBF5B7]" size={24} />
              <h2 className="text-xl font-bold text-[#FBF5B7] uppercase tracking-wider">2. The "Sovereignty" Mechanism</h2>
            </div>
            <p>The core interactive element of the Platform involves a competitive display model known as "Claiming the Throne". You explicitly agree that:</p>
            <ul className="list-disc list-inside mt-4 space-y-3 pl-4 border-l border-[#b38f4a]/20">
              <li>Acquiring the "Sovereign" status grants a <strong>strictly temporary</strong> right to display a name, image, and subtitle on the main interface.</li>
              <li>The price for acquisition increases automatically by exactly 10% with every successful claim.</li>
              <li>Your display remains active only until the next user pays the calculated tribute. <strong>No minimum display time is guaranteed.</strong></li>
              <li>Transactions are for digital participation only and do not grant any equity, permanent rights, or intellectual property ownership over the Platform.</li>
            </ul>
          </section>

          <section>
            <div className="flex items-center gap-3 mb-4">
              <ImageIcon className="text-[#FBF5B7]" size={24} />
              <h2 className="text-xl font-bold text-[#FBF5B7] uppercase tracking-wider">3. Content Moderation & Licensing</h2>
            </div>
            <p>By uploading content, you represent and warrant that you own all copyrights or have obtained sufficient licenses for the media provided. You grant NGC a worldwide, royalty-free, perpetual license to display this content.</p>
            <div className="mt-4 p-4 border border-red-900/30 bg-red-950/10 text-red-200">
              <strong>Strict Prohibition:</strong> Content featuring nudity, violence, hate speech, discriminatory language, or any illegal material is strictly forbidden. NGC reserves the absolute right to remove any content deemed inappropriate at its sole discretion <strong>without prior notice and without refund</strong>.
            </div>
          </section>

          <section>
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle className="text-[#FBF5B7]" size={24} />
              <h2 className="text-xl font-bold text-[#FBF5B7] uppercase tracking-wider">4. Financial Finality</h2>
            </div>
            <p>Due to the immediate digital nature of the service, the automated price-escalation algorithm, and the real-time delivery of display rights, <strong>all payments are final and non-refundable</strong>. Refunds will not be issued for displacement by other users, dissatisfaction with display duration, or removal due to Terms of Service violations.</p>
          </section>

          <section>
            <div className="flex items-center gap-3 mb-4">
              <ShieldCheck className="text-[#FBF5B7]" size={24} />
              <h2 className="text-xl font-bold text-[#FBF5B7] uppercase tracking-wider">5. Limitation of Liability</h2>
            </div>
            <p>The service is provided on an "AS IS" and "AS AVAILABLE" basis. NGC, its administrators, and its providers are not liable for direct or indirect damages, technical interruptions, database synchronization delays, or server downtimes that may affect the display or operation of the Platform.</p>
          </section>
        </div>
      </div>
    </main>
  );
}