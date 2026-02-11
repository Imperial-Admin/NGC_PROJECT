import { Metadata } from 'next';
import { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'The Imperial Archives | Legacy Sealed',
  description: 'A legacy of allegiance and gold. See the names etched in the eternal Heart Wall.',
  
  openGraph: {
    title: 'The Imperial Archives | Legacy Sealed',
    description: 'My name is now part of the Imperial Legacy. View the Heart Wall.',
    url: 'https://ngc-project.vercel.app/history', // עודכן לכתובת הנכונה שלך
    siteName: 'Imperial Legacy',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'The Imperial Heart Wall',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  
  twitter: {
    card: 'summary_large_image',
    title: 'The Imperial Archives | Legacy Sealed',
    images: ['/og-image.png'],
  },
};

export default function HistoryLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}