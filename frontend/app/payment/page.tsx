"use client";
import DesktopPayments from '@/components/DesktopPayments';
import MobilePayments from '@/components/MobilePayments';

export default function PaymentMethodPage() {
  return (
    <>
      <div className="hidden md:block w-full h-full">
        <DesktopPayments />
      </div>
      <div className="block md:hidden w-full h-full">
        <MobilePayments />
      </div>
    </>
  );
}