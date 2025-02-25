"use client";
import { useState } from "react";
import Sidebar from "@/components/ui/Sidebar";

export default function HeaderWithSidebar() {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <>
      <header className="bg-[#005C3C] text-white p-6 shadow-md flex justify-between items-center">
        <div className="text-xl font-bold text-yellow-400 mx-auto">
          منصة المسابقة القرآنية
        </div>

        <div>
          <button onClick={() => setIsOpen(true)} className="text-white">
            ☰
          </button>
          <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />
        </div>
      </header>
    </>
  );
}
