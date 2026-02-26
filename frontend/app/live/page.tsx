"use client";
import DesktopLive from '@/components/DesktopLive';
import MobileLive from '@/components/MobileLive';

export default function LivePage() {
  return (
    <>
      <div className="hidden md:block h-full w-full">
        <DesktopLive />
      </div>
      <div className="block md:hidden h-full w-full">
        <MobileLive />
      </div>
    </>
  );
}