// @ts-nocheck
"use client";
import React from 'react';
import { useRouter } from 'next/navigation';
import { X, Lock, Eye, Server, ShieldCheck } from 'lucide-react';

export default function PrivacyPage() {
  const router = useRouter();

  return (
    <main className="min-h-screen w-full bg-black text-white p-6 md:p-20 font-serif relative overflow-y-auto">
      <button onClick={() => router.back()} className="fixed top-6 right-6 text-[#b38f4a] hover:text-white transition-all z-50 p-2 bg-black/50 rounded-full border border-[#b38f4a]/20">
        <X size={28} />
      </button>

      <div className="max-w-4xl mx-auto border border-[#b38f4a]/20 p-8 md:p-16 bg-[#050505] shadow-2xl">
        <header className="mb-12 border-b border-[#b38f4a]/30 pb-8 text-center">
          <Lock className="mx-auto mb-4 text-[#D4AF37]" size={48} />
          <h1 className="text-4xl font-black tracking-[0.2em] uppercase text-[#D4AF37] mb-4">Privacy Policy</h1>
          <p className="text-[#b38f4a] text-xs uppercase tracking-widest opacity-60">Digital Data Protection Protocol</p>
        </header>
        
        <div className="space-y-12 text-left leading-relaxed text-sm md:text-base text-gray-300">
          <section>
            <div className="flex items-center gap-3 mb-4">
              <Eye className="text-[#FBF5B7]" size={24} />
              <h2 className="text-xl font-bold text-[#FBF5B7] uppercase tracking-wider">1. Information Collection</h2>
            </div>
            <p>We collect information required to operate the Platform's core prestige mechanisms:</p>
            <ul className="list-disc list-inside mt-4 space-y-3">
              <li><strong>User Provided Content:</strong> Name, subtitle, and image file provided during the "Claim the Throne" process.</li>
              <li><strong>Technical Indicators:</strong> IP addresses (used solely for real-time region detection to display the "Global Pulse"), browser metadata, and device identifiers.</li>
              <li><strong>Transactional Data:</strong> History of tributes, acquisition timestamps, and "Heart Wall" interactions.</li>
            </ul>
          </section>

          <section>
            <div className="flex items-center gap-3 mb-4">
              <Server className="text-[#FBF5B7]" size={24} />
              <h2 className="text-xl font-bold text-[#FBF5B7] uppercase tracking-wider">2. Data Processing & Infrastructure</h2>
            </div>
            <p>Your data is processed and stored using industry-standard secure infrastructures:</p>
            <ul className="list-disc list-inside mt-2 space-y-2 pl-4">
              <li><strong>Supabase:</strong> For cloud-based database management and secure image storage.</li>
              <li><strong>Vercel:</strong> For platform hosting and real-time synchronization.</li>
              <li><strong>Financial Gateways:</strong> Payment data is handled directly by encrypted third-party processors. NGC never stores or views raw credit card information.</li>
            </ul>
          </section>

          <section>
            <div className="flex items-center gap-3 mb-4">
              <ShieldCheck className="text-[#FBF5B7]" size={24} />
              <h2 className="text-xl font-bold text-[#FBF5B7] uppercase tracking-wider">3. Sharing & Security</h2>
            </div>
            <p>NGC does not trade or sell user data to advertising conglomerates. Your information is shared only with service providers essential to the Platform’s operation or when required by judicial mandate. We apply multi-layered encryption to protect all stored media and profile data.</p>
          </section>
        </div>
      </div>
    </main>
  );
}