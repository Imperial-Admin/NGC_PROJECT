"use client";
import DesktopUpload from '@/components/DesktopUpload';
import MobileUpload from '@/components/MobileUpload';

export default function UploadPage() {
  return (
    <>
      <div className="hidden md:block w-full h-full">
        <DesktopUpload />
      </div>
      <div className="block md:hidden w-full h-full">
        <MobileUpload />
      </div>
    </>
  );
}