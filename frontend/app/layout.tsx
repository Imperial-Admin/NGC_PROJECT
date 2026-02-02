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

// --- כאן קורה הקסם של השיתוף ---
export const metadata: Metadata = {
  title: "NGC — The Sovereign Asset",
  description: "Experience the ultimate digital sovereignty. Claim the throne and secure your legacy in the Imperial Ledger.",
  openGraph: {
    title: "NGC — The Sovereign Asset",
    description: "The world's most exclusive digital throne. Will you claim your legacy?",
    url: "https://your-site-url.vercel.app", // כאן תדביק את הלינק של האתר שלך בורסל בהמשך
    siteName: "NGC Imperial",
    images: [
      {
        url: "/sovereign.jpg", // משתמש בתמונת הריבון הקיימת שלך לשיתוף
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
    title: "NGC — The Sovereign Asset",
    description: "The world's most exclusive digital throne.",
    images: ["/sovereign.jpg"],
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