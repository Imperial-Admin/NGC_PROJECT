"use client";
import DesktopCrypto from '@/components/DesktopCrypto';
import MobileCrypto from '@/components/MobileCrypto';

export default function CryptoPaymentPage() {
  return (
    <>
      <div className="hidden md:block w-full h-full">
        <DesktopCrypto />
      </div>
      <div className="block md:hidden w-full h-full">
        <MobileCrypto />
      </div>
    </>
  );
}