import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

// התיקון שמעיף את ה-localhost ושם את הכתובת האמיתית
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
  twitter: {
    card: 'summary_large_image',
    title: 'The Imperial Archives | Legacy Sealed',
    images: ['https://ngc-project.vercel.app/og-image.png'],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-black`}>
        {children}
      </body>
    </html>
  );
}