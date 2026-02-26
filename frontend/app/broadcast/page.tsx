"use client";
import DesktopBroadcast from '@/components/DesktopBroadcast';
import MobileBroadcast from '@/components/MobileBroadcast';

export default function BroadcastPage() {
  return (
    <>
      <div className="hidden md:block w-full h-full">
        <DesktopBroadcast />
      </div>
      <div className="block md:hidden w-full h-full">
        <MobileBroadcast />
      </div>
    </>
  );
}