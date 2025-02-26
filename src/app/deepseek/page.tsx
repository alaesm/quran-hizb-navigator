"use client"
import { useState } from 'react';
import QuranViewer from './QuranViewer';
import { getVerseKeyFromIndex } from '../utils/athma';

const categories = [
  { name: "الحزب ١-١٠", minHizb: 1, maxHizb: 10 },
  { name: "الحزب ١١-٢٠", minHizb: 11, maxHizb: 20 },
  { name: "الحزب ٢١-٤٠", minHizb: 21, maxHizb: 40 },
  { name: "الحزب ٤١-٦٠", minHizb: 41, maxHizb: 60 },
];

export default function Home() {
  const [selectedVerses, setSelectedVerses] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);

  const handleCategorySelect = async (min: number, max: number) => {
    // حساب نطاق الأثمن بناء على الحدود
    const startIdx = (min - 1) * 8;
    const endIdx = max * 8 - 1;
    
    // اختيار ثمن عشوائي
    const randomIdx = Math.floor(Math.random() * (endIdx - startIdx + 1)) + startIdx;
    const verseKey = getVerseKeyFromIndex(randomIdx);
    
    // جلب الآيات باستخدام API
    const res = await fetch(`https://api.quran.com/api/v4/verses/by_key/${verseKey}?words=true`);
    const data = await res.json();
    
    setSelectedVerses([data.verse]);
    setCurrentPage(1);
  };

  return (
    <div className="container">
      <h1>مسابقة قرآنية</h1>
      
      <div className="categories">
        {categories.map((cat) => (
          <button 
            key={cat.name}
            onClick={() => handleCategorySelect(cat.minHizb, cat.maxHizb)}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {selectedVerses.length > 0 && (
        <QuranViewer 
          verses={selectedVerses}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
        />
      )}
    </div>
  );
}

