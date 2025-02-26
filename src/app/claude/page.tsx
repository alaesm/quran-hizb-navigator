"use client"
// pages/index.tsx
import { useState, useEffect } from 'react';
import Head from 'next/head';
import { AthmanList } from '../utils/athma';
import { Verse } from '../../types/index';
import CategorySelector from '@/components/CategorySelector';
import QuranViewerCl from '@/components/QuranViewerCl';

const categories = [
  { name: "الحزب ١-١٠", minHizb: 1, maxHizb: 10 },
  { name: "الحزب ١١-٢٠", minHizb: 11, maxHizb: 20 },
  { name: "الحزب ٢١-٤٠", minHizb: 21, maxHizb: 40 },
  { name: "الحزب ٤١-٦٠", minHizb: 41, maxHizb: 60 },
];

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState<null | typeof categories[0]>(null);
  const [selectedThumn, setSelectedThumn] = useState<null | number>(null);
  const [verses, setVerses] = useState<Verse[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (selectedThumn !== null) {
      fetchThumnVerses(selectedThumn);
    }
  }, [selectedThumn]);

  const selectRandomThumn = (category: typeof categories[0]) => {
    setSelectedCategory(category);
    setLoading(true);
    
    // Calculate the range of Athman indices based on Hizb range
    // Each Hizb has 4 Athman (eighths)
    const startIndex = (category.minHizb - 1) * 4;
    const endIndex = category.maxHizb * 4 - 1;
    
    // Get a random Thumn index within the range
    const randomThumnIndex = Math.floor(Math.random() * (endIndex - startIndex + 1)) + startIndex;
    setSelectedThumn(randomThumnIndex);
  };

  const fetchThumnVerses = async (thumnIndex: number) => {
    try {
      setLoading(true);
      setError(null);
      
      // Get the start verse key for this Thumn
      const startVerseIndex = AthmanList[thumnIndex];
      
      // Get the Hizb and Thumn number for display
      const hizbNumber = Math.floor(thumnIndex / 4) + 1;
      const thumnNumber = (thumnIndex % 4) + 1;
      
      // Calculate the verse key from the AthmanList index
      const surahAyah = getVerseKeyFromIndex(thumnIndex);
      const [surah, ayah] = surahAyah.split(':').map(Number);
      
      // Fetch verses starting from this point
      const response = await fetch(`https://api.quran.com/api/v4/verses/by_key/${surahAyah}?translations=131&language=ar`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch verses');
      }
      
      const data = await response.json();
      
      // Get the page number from the response
      const pageNumber = data.verse.page_number;
      
      // Fetch all verses for this page
      const pageResponse = await fetch(`https://api.quran.com/api/v4/verses/by_page/${pageNumber}?translations=131&language=ar`);
      
      if (!pageResponse.ok) {
        throw new Error('Failed to fetch page verses');
      }
      
      const pageData = await pageResponse.json();
      setVerses(pageData.verses);
      
    } catch (err) {
      console.error('Error fetching verses:', err);
      setError('حدث خطأ أثناء تحميل الآيات. يرجى المحاولة مرة أخرى.');
    } finally {
      setLoading(false);
    }
  };

  // Helper function to get verse key from index
  const getVerseKeyFromIndex = (index: number): string => {
    if (index < 0 || index >= AthmanList.length) {
      throw new Error("Invalid index");
    }
    const ayahId = AthmanList[index];
    
    // This is a simplified calculation - for a production app
    // you would need a more accurate mapping from ayahId to surah:ayah
    const surah = Math.floor(ayahId / 286) + 1;
    const ayah = (ayahId % 286) + 1;
    return `${surah}:${ayah}`;
  };

  // Calculate which Thumn (eighth) this is within which Hizb
  const getThumnInfo = () => {
    if (selectedThumn === null) return null;
    
    const hizbNumber = Math.floor(selectedThumn / 4) + 1;
    const thumnNumber = (selectedThumn % 4) + 1;
    
    return {
      hizb: hizbNumber,
      thumn: thumnNumber
    };
  };

  const thumnInfo = getThumnInfo();

  return (
    <div className="min-h-screen bg-amber-50">
      <Head>
        <title>مسابقة القرآن الكريم</title>
        <meta name="description" content="مسابقة القرآن الكريم - اختر فئة وابدأ التحدي" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold text-center mb-8 text-emerald-800">مسابقة القرآن الكريم</h1>
        
        {!selectedCategory ? (
          <div className="max-w-md mx-auto">
            <h2 className="text-xl text-center mb-6 text-emerald-700">اختر الفئة للبدء</h2>
            <CategorySelector 
              categories={categories} 
              onSelectCategory={selectRandomThumn} 
            />
          </div>
        ) : (
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
              <div className="flex justify-between items-center mb-4">
                <button 
                  onClick={() => setSelectedCategory(null)}
                  className="bg-emerald-600 text-white px-4 py-2 rounded hover:bg-emerald-700 transition"
                >
                  العودة للفئات
                </button>
                <div className="text-center">
                  <h2 className="text-xl font-bold text-emerald-800">{selectedCategory.name}</h2>
                  {thumnInfo && (
                    <p className="text-emerald-700">
                      الثمن {thumnInfo.thumn} من الحزب {thumnInfo.hizb}
                    </p>
                  )}
                </div>
                <button 
                  onClick={() => selectRandomThumn(selectedCategory)}
                  className="bg-amber-500 text-white px-4 py-2 rounded hover:bg-amber-600 transition"
                >
                  ثمن آخر
                </button>
              </div>
              
              {loading ? (
                <div className="text-center py-12">
                  <div className="inline-block w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                  <p className="mt-4 text-emerald-800">جاري تحميل الآيات...</p>
                </div>
              ) : error ? (
                <div className="text-center py-12 text-red-600">
                  <p>{error}</p>
                  <button 
                    onClick={() => selectRandomThumn(selectedCategory)}
                    className="mt-4 bg-emerald-600 text-white px-4 py-2 rounded hover:bg-emerald-700 transition"
                  >
                    المحاولة مرة أخرى
                  </button>
                </div>
              ) : (
                <QuranViewerCl verses={verses} />
              )}
            </div>
          </div>
        )}
      </main>
      
      <footer className="text-center py-6 text-emerald-800">
        <p>© {new Date().getFullYear()} مسابقة القرآن الكريم - جميع الحقوق محفوظة</p>
      </footer>
    </div>
  );
}