"use client";
import { motion } from "framer-motion";

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export default function Sidebar({ isOpen, setIsOpen }: SidebarProps) {
  return (
    <motion.div
      initial={{ x: "-100%" }}
      animate={{ x: isOpen ? "0%" : "-100%" }}
      transition={{ duration: 0.3 }}
      className={`fixed top-0 left-0 h-full w-64 bg-[#005C3C] text-white shadow-lg z-50`}
    >
     
      {/* قائمة الروابط */}
      <nav className="mt-16 px-6 space-y-4">
        <a href="#" className="block p-3 bg-gray-700 rounded-lg hover:bg-gray-600">🏠 الرئيسية</a>
        <a href="#hizb-display" className="block p-3 bg-gray-700 rounded-lg hover:bg-gray-600">📖 المصحف</a>
        <a href="#hizb-random-selector" className="block p-3 bg-gray-700 rounded-lg hover:bg-gray-600">🔍 اختيار عشوائي</a>
        <a
          href="#"
          className="block p-3 bg-gray-700 rounded-lg hover:bg-gray-600"
          onClick={() => setIsOpen(false)}
        >
          ✖ اغلاق نافدة
        </a>
      </nav>
    </motion.div>
  );
}
