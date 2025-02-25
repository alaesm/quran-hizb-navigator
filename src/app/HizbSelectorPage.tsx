"use client";

import { useState } from "react";
import HizbDisplay from "@/components/HizbDisplay";

export default function HizbSelectorPage() {
  const [hizbNumber, setHizbNumber] = useState<number>(1); // الحزب الافتراضي 1

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#F3F8F1] p-6">
      {/* عنوان الموقع */}
      <h1 className="text-4xl text-[#D4A017] font-extrabold mb-8 drop-shadow-lg">📖 منصة مسار الأثمان</h1>
      
      {/* اختيار الحزب */}
      <div className="bg-white p-6 rounded-lg shadow-lg flex flex-col items-center text-gray-800 w-80">
        <label className="text-lg font-bold mb-2">اختر الحزب:</label>
        <input
          type="number"
          value={hizbNumber}
          onChange={(e) => {
            const value = parseInt(e.target.value, 10);
            if (value >= 1 && value <= 60) setHizbNumber(value);
          }}
          min={1}
          max={60}
          className="border border-gray-300 rounded px-3 py-2 text-lg text-center w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      
      {/* عرض الحزب */}
      <div className="mt-6 w-full max-w-4xl">
        <HizbDisplay hizbNumber={hizbNumber} />
      </div>
    </div>
  );
}
