"use client";
import DesktopHome from '@/components/DesktopHome';
import MobileHome from '@/components/MobileHome';

export default function Page() {
  return (
    <>
      {/* שכבת הדסקטופ - תוצג רק ממסכים בינוניים ומעלה */}
      <div className="hidden md:block">
        <DesktopHome />
      </div>

      {/* שכבת המובייל - תוצג רק במסכים קטנים */}
      <div className="block md:hidden">
        <MobileHome />
      </div>
    </>
  );
}