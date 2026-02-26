"use client";
import DesktopCardPayment from '@/components/DesktopCardPayment';
import MobileCardPayment from '@/components/MobileCardPayment';

export default function CardPaymentPage() {
  return (
    <>
      <div className="hidden md:block w-full h-full">
        <DesktopCardPayment />
      </div>
      <div className="block md:hidden w-full h-full">
        <MobileCardPayment />
      </div>
    </>
  );
}