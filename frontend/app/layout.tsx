import type { Metadata } from "next";
import "./globals.css";

// המטא-דאטה שסוף סוף יתעדכן בוואטסאפ ברגע שהבנייה תצליח
export const metadata: Metadata = {
  title: 'The Imperial Archives | Legacy Sealed',
  description: 'A legacy of allegiance and gold. See the names etched in the eternal Heart Wall.',
  openGraph: {
    title: 'The Imperial Archives | Legacy Sealed',
    description: 'My name is now part of the Imperial Legacy. View the Heart Wall.',
    url: 'https://ngc-project.vercel.app/',
    siteName: 'Imperial Legacy',
    images: [
      {
        url: 'https://ngc-project.vercel.app/og-image.png',
        width: 1200,
        height: 630,
        alt: 'The Imperial Heart Wall',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased bg-black text-white">
        {children}
      </body>
    </html>
  );
}