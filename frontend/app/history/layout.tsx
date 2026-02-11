import { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
  // הכותרת שתופיע בראש הטאב ובשיתוף
  title: 'The Imperial Archives | Legacy Sealed',
  description: 'A legacy of allegiance and gold. See the names etched in the eternal Heart Wall.',
  
  // הגדרות עבור וואטסאפ, אינסטגרם ופייסבוק
  openGraph: {
    title: 'The Imperial Archives | Legacy Sealed',
    description: 'My name is now part of the Imperial Legacy. View the Heart Wall.',
    url: 'https://the-imperial.vercel.app/history', 
    siteName: 'Imperial Legacy',
    images: [
      {
        url: '/og-image.png', // מושך את התמונה ששמת בתיקיית public
        width: 1200,
        height: 630,
        alt: 'The Imperial Heart Wall',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  
  // הגדרות עבור טוויטר (X)
  twitter: {
    card: 'summary_large_image',
    title: 'The Imperial Archives | Legacy Sealed',
    images: ['/og-image.png'],
  },
};

export default function HistoryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}