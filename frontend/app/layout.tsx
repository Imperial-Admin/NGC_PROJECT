import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// הגדרות שיתוף מותאמות ל-Local - ללא "use client"
export const metadata: Metadata = {
  title: "THE SOVEREIGN ASSET",
  description: "Claim your legacy. Live forever in gold. Experience the ultimate digital sovereignty.",
  metadataBase: new URL("http://localhost:3000"), 
  openGraph: {
    title: "THE SOVEREIGN ASSET | Secure Your Legacy",
    description: "The world's most exclusive digital throne. Witness the ascension or claim the power yourself.",
    url: "http://localhost:3000", 
    siteName: "NGC Sovereign",
    images: [
      {
        url: "/model.jpg", 
        width: 1200,
        height: 630,
        alt: "NGC Sovereign Asset",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "THE SOVEREIGN ASSET",
    description: "Claim the throne. Secure the future.",
    images: ["/model.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-black`}
      >
        {children}
      </body>
    </html>
  );
}