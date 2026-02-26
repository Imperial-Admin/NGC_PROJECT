"use client";
import DesktopHistory from '@/components/DesktopHistory';
import MobileHistory from '@/components/MobileHistory';

export default function HistoryPage() {
  return (
    <>
      <div className="hidden md:block w-full h-full">
        <DesktopHistory />
      </div>
      <div className="block md:hidden w-full h-full">
        <MobileHistory />
      </div>
    </>
  );
}