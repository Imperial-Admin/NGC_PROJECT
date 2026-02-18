// @ts-nocheck
"use client";
import React from 'react';
import { useRouter } from 'next/navigation';
import { X, Accessibility, CheckCircle } from 'lucide-react';

export default function AccessibilityPage() {
  const router = useRouter();

  return (
    <main className="min-h-screen w-full bg-black text-white p-6 md:p-20 font-serif relative overflow-y-auto">
      <button onClick={() => router.back()} className="fixed top-6 right-6 text-[#b38f4a] hover:text-white transition-all z-50 p-2 bg-black/50 rounded-full border border-[#b38f4a]/20">
        <X size={28} />
      </button>

      <div className="max-w-4xl mx-auto border border-[#b38f4a]/20 p-8 md:p-16 bg-[#050505] shadow-2xl">
        <header className="mb-12 border-b border-[#b38f4a]/30 pb-8 text-center">
          <Accessibility className="mx-auto mb-4 text-[#D4AF37]" size={48} />
          <h1 className="text-4xl font-black tracking-[0.2em] uppercase text-[#D4AF37] mb-4">Accessibility Statement</h1>
          <p className="text-[#b38f4a] text-xs uppercase tracking-widest opacity-60">Commitment to Universal Design</p>
        </header>
        
        <div className="space-y-12 text-left leading-relaxed text-sm md:text-base text-gray-300">
          <p>NGC is dedicated to ensuring a high-end digital experience that is accessible to all users, regardless of their physical abilities. We are committed to maintaining a platform that adheres to the Web Content Accessibility Guidelines (WCAG) 2.1 Level AA standards.</p>

          <section>
            <h2 className="text-xl font-bold text-[#FBF5B7] mb-6 uppercase tracking-wider">Technical Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="flex items-start gap-3">
                <CheckCircle className="text-[#D4AF37] shrink-0" size={20} />
                <p><strong>Visual Clarity:</strong> High-contrast black and gold color palette for maximum legibility.</p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="text-[#D4AF37] shrink-0" size={20} />
                <p><strong>Input Support:</strong> Fully navigable interface via keyboard for users unable to use traditional pointing devices.</p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="text-[#D4AF37] shrink-0" size={20} />
                <p><strong>Semantic Integrity:</strong> Structured HTML and ARIA tags to ensure screen reader compatibility.</p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="text-[#D4AF37] shrink-0" size={20} />
                <p><strong>Responsive Scaling:</strong> Support for system-level and browser-level zoom without loss of interface functionality.</p>
              </div>
            </div>
          </section>

          <section className="pt-8 border-t border-[#b38f4a]/10">
            <h2 className="text-xl font-bold text-[#FBF5B7] mb-4 uppercase tracking-wider">Feedback & Assistance</h2>
            <p>We are constantly refining our interface. If you encounter any barriers while navigating NGC, please contact our administrative support with the specific page URL and details of the issue. We aim to respond to and address accessibility feedback within 72 business hours.</p>
          </section>
        </div>
      </div>
    </main>
  );
}