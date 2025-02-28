"use client";

import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import React from "react";

interface Verse {
  id: number;
  verse_key: string;
  text_uthmani: string;
  page_number: number;
}

interface Quarter {
  id: number;
  hizb_number: number;
  thumn_number: number;
  rub_number: number;
}

interface Sura {
  id: number;
  name_arabic: string;
}

interface ThumnRange {
  hizb: number;
  thumn: number;
  startPage: number;
  endPage: number;
  currentPage: number;
  surahName?: string;
}

const HizbRandomTest = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [thumnRange, setThumnRange] = useState<ThumnRange | null>(null);
  const [verses, setVerses] = useState<Verse[]>([]);
  const [suraNames, setSuraNames] = useState<{ [key: number]: string }>({});
  const [randomHizb, setRandomHizb] = useState<number>(0);
  const [randomThumn, setRandomThumn] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [pageLoading, setPageLoading] = useState<boolean>(false);
  const [quarters, setQuarters] = useState<Quarter[]>([]);
  const [quartersLoading, setQuartersLoading] = useState(true);
  const [quartersError, setQuartersError] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const categories = [
    { name: "الحزب ١-١٠", minHizb: 1, maxHizb: 10 },
    { name: "الحزب ١١-٢٠", minHizb: 11, maxHizb: 20 },
    { name: "الحزب ٢١-٤٠", minHizb: 21, maxHizb: 40 },
    { name: "الحزب ٤١-٦٠", minHizb: 41, maxHizb: 60 },
  ];

  // Initialize quarters data
  useEffect(() => {
    const fetchQuarters = async () => {
      try {
        setQuartersLoading(true);
        const quartersList: Quarter[] = [];
        
        for (let hizbNumber = 1; hizbNumber <= 60; hizbNumber++) {
          for (let thumnNumber = 1; thumnNumber <= 8; thumnNumber++) {
            const rubNumber = ((hizbNumber - 1) * 4) + Math.ceil(thumnNumber / 2);
            quartersList.push({
              id: ((hizbNumber - 1) * 8) + thumnNumber,
              hizb_number: hizbNumber,
              thumn_number: thumnNumber,
              rub_number: rubNumber
            });
          }
        }
        
        setQuarters(quartersList);
        setQuartersError(null);
      } catch (error) {
        console.error("Error initializing quarters:", error);
        setQuartersError("فشل تهيئة بيانات الأثمان. يرجى المحاولة مرة أخرى.");
      } finally {
        setQuartersLoading(false);
      }
    };
  
    fetchQuarters();
  }, []);

  useEffect(() => {
    const fetchSuraNames = async () => {
      try {
        const response = await axios.get("https://api.quran.com/api/v4/chapters");
        const suraData: { [key: number]: string } = {};
        response.data.chapters.forEach((sura: Sura) => {
          suraData[sura.id] = sura.name_arabic;
        });
        setSuraNames(suraData);
      } catch (error) {
        console.error("Error fetching surah names:", error);
        setError("فشل في تحميل أسماء السور");
      }
    };
    
    fetchSuraNames();
  }, []);

  const getPageByVerseId = async (verseId: number): Promise<number> => {
    try {
      const response = await axios.get(
        `https://api.quran.com/api/v4/verses/by_key/${verseId}?fields=page_number`
      );
      return response.data.verse.page_number;
    } catch (error) {
      console.error("Error fetching verse page:", error);
      throw new Error("فشل في الحصول على رقم الصفحة");
    }
  };

  const getSurahNameFromVerseKey = (verseKey: string): string => {
    const surahId = parseInt(verseKey.split(':')[0]);
    return suraNames[surahId] || '';
  };

  const getThumnPages = async (hizb: number, thumn: number) => {
    try {
      const rubNumber = ((hizb - 1) * 4) + Math.ceil(thumn / 2);
      const isSecondThumnInRub = thumn % 2 === 0;
      
      const response = await axios.get(
        `https://api.quran.com/api/v4/verses/by_rub/${rubNumber}`,
        {
          params: {
            fields: 'verse_key,page_number,text_uthmani'
          }
        }
      );

      if (!response.data || !response.data.verses || response.data.verses.length === 0) {
        throw new Error(`لم يتم العثور على بيانات للثمن ${thumn} من الحزب ${hizb}`);
      }

      const verses = response.data.verses;
      const middleIndex = Math.floor(verses.length / 2);
      
      const thumnVerses = isSecondThumnInRub 
        ? verses.slice(middleIndex) 
        : verses.slice(0, middleIndex);

      const startPage = thumnVerses[0].page_number;
      const endPage = thumnVerses[thumnVerses.length - 1].page_number;
      const surahName = getSurahNameFromVerseKey(thumnVerses[0].verse_key);
      
      setVerses(thumnVerses);

      return {
        hizb,
        thumn,
        startPage,
        endPage,
        currentPage: startPage,
        surahName
      };
    } catch (error) {
      console.error("Error in getThumnPages:", error);
      throw new Error("فشل في الحصول على صفحات الثمن");
    }
  };

  const handleRandomSelection = useCallback(async (minHizb: number, maxHizb: number) => {
    try {
      setError(null);
      if (quartersLoading || quarters.length === 0) {
        throw new Error("يرجى الانتظار حتى يتم تحميل البيانات");
      }

      setLoading(true);
      setSelectedCategory(`${minHizb}-${maxHizb}`);

      const randomHizbNumber = Math.floor(Math.random() * (maxHizb - minHizb + 1)) + minHizb;
      const randomThumnNumber = Math.floor(Math.random() * 8) + 1;

      setRandomHizb(randomHizbNumber);
      setRandomThumn(randomThumnNumber);

      const range = await getThumnPages(randomHizbNumber, randomThumnNumber);
      setThumnRange(range);

      if (range) {
        await fetchPageVerses(range.startPage);
      }
    } catch (error) {
      console.error("Error in selection:", error);
      setError(error instanceof Error ? error.message : "حدث خطأ في اختيار الثمن. الرجاء المحاولة مرة أخرى.");
    } finally {
      setLoading(false);
    }
  }, [quarters, quartersLoading]);

  const fetchPageVerses = async (page: number) => {
    try {
      setPageLoading(true);
      
      const pageVerses = verses.filter(verse => verse.page_number === page);
      if (pageVerses.length === 0) {
        const response = await axios.get(
          `https://api.quran.com/api/v4/verses/by_page/${page}`,
          {
            params: {
              fields: 'text_uthmani,verse_key,page_number'
            }
          }
        );
        setVerses(prevVerses => {
          const newVerses = response.data.verses.filter(
            (newVerse: any) => !prevVerses.some(v => v.verse_key === newVerse.verse_key)
          );
          return [...prevVerses, ...newVerses];
        });
      }
    } catch (error) {
      console.error("Error fetching verses:", error);
      setError("فشل في تحميل الآيات");
    } finally {
      setPageLoading(false);
    }
  };

  const handlePageChange = async (newPage: number) => {
    if (!thumnRange) return;
    
    if (newPage < thumnRange.startPage || newPage > thumnRange.endPage) {
      return;
    }
    
    await fetchPageVerses(newPage);
    setThumnRange({
      ...thumnRange,
      currentPage: newPage
    });
  };

  const resetSelection = () => {
    setThumnRange(null);
    setRandomHizb(0);
    setRandomThumn(0);
    setVerses([]);
    setSelectedCategory("");
    setError(null);
  };

  return (
    <div className="mx-auto p-4 md:p-6 pb-16 bg-amber-50 rounded-lg shadow-lg my-8">
      <header className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-emerald-800 mb-4 font-arabic">
          المسابقة القرآنية
        </h1>
        <h2 className="text-2xl md:text-3xl font-semibold text-emerald-700 mb-6 font-arabic">
          الاختيار العشوائي للقراءة
        </h2>
        <div className="w-24 h-1 bg-emerald-600 mx-auto"></div>
      </header>

      {error && (
        <div className="bg-red-100 p-4 rounded-lg mb-6 text-red-700 text-right animate-fade-in">
          <p className="font-bold">خطأ: </p>
          <p>{error}</p>
        </div>
      )}

      {quartersLoading ? (
        <div className="text-center py-8">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-emerald-600 border-r-transparent"></div>
          <p className="mt-4 text-lg text-gray-700 font-arabic">جاري تحميل بيانات الأثمان...</p>
        </div>
      ) : (
        <div className="mb-10">
          <h3 className="text-xl md:text-2xl font-semibold mb-6 text-right text-emerald-800 font-arabic">
            اختر الفئة:
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            {categories.map((category) => (
              <button
                key={category.name}
                onClick={() => handleRandomSelection(category.minHizb, category.maxHizb)}
                disabled={loading}
                className={`p-5 rounded-lg text-xl transition-all duration-300 shadow-md hover:shadow-lg font-arabic
                  ${selectedCategory === `${category.minHizb}-${category.maxHizb}`
                    ? "bg-gradient-to-r from-emerald-600 to-emerald-700 text-white"
                    : "bg-white hover:bg-emerald-50 text-emerald-900 border-2 border-emerald-200"
                  } ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {loading && !thumnRange && (
        <div className="text-center py-16 my-8">
          <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-emerald-600 border-r-transparent"></div>
          <p className="mt-4 text-lg text-gray-700 font-arabic">جاري اختيار الحزب والثمن...</p>
        </div>
      )}

      {thumnRange && (
        <div className="bg-white rounded-lg shadow-xl overflow-hidden mb-8 transition-all duration-500 animate-fade-in">
          <div className="bg-gradient-to-r from-emerald-700 to-emerald-800 p-4 text-center">
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-2 font-arabic">
              الحزب {randomHizb} - الثمن {randomThumn}
            </h3>
            {thumnRange.surahName && (
              <h4 className="text-xl text-emerald-100 mb-2 font-arabic">
                سورة {thumnRange.surahName}
              </h4>
            )}
            <p className="text-emerald-100 font-arabic">
              الصفحات من {thumnRange.startPage} إلى {thumnRange.endPage}
            </p>
          </div>

          {pageLoading ? (
            <div className="text-center py-16" style={{ minHeight: '60vh' }}>
              <div className="inline-block h-10 w-10 animate-spin rounded-full border-4 border-solid border-emerald-600 border-r-transparent"></div>
              <p className="mt-4 text-lg text-gray-700 font-arabic">جاري تحميل الآيات...</p>
            </div>
          ) : (
            <div 
              className="quran-page p-8 md:p-10" 
              style={{
                minHeight: '60vh',
                fontFamily: 'Uthmanic, "Amiri Quran", "Noto Naskh Arabic", serif',
                fontSize: '28px',
                lineHeight: '2.8',
                textAlign: 'justify',
                direction: 'rtl',
                background: '#fef8e7',
                backgroundImage: 'linear-gradient(rgba(250, 240, 230, 0.5) 1px, transparent 1px)',
                backgroundSize: '100% 45px'
              }}
            >
              <div className="mb-4 text-center">
                <span className="inline-block text-lg px-4 py-1 bg-emerald-100 text-emerald-800 rounded-full font-arabic">
                  صفحة {thumnRange.currentPage}
                </span>
              </div>

              <div className="quran-text">
                {verses
                  .filter(v => v.page_number === thumnRange.currentPage)
                  .map((verse, index, filteredVerses) => {
                    // Get current verse surah and verse number
                    const [surahNum, verseNum] = verse.verse_key.split(":");
                    
                    // Check if this is the start of a new surah
                    const isNewSurah = index === 0 || 
                      filteredVerses[index - 1].verse_key.split(":")[0] !== surahNum;
                    
                    return (
                      <React.Fragment key={verse.id}>
                        {isNewSurah && (
                          <div className="surah-header text-center mb-6 mt-4">
                            <h3 className="text-2xl font-bold mb-2 text-emerald-800">
                              {suraNames[parseInt(surahNum)]}
                            </h3>
                            <div className="bismillah text-center mb-4">
                              ﷽
                            </div>
                          </div>
                        )}
                        <span className="verse">
                          {verse.text_uthmani}{" "}
                          <span className="verse-number inline-flex justify-center items-center text-emerald-700 mx-1" 
                            style={{ fontSize: '22px' }}>
                            {String.fromCharCode(0x06dd)}
                            {new Intl.NumberFormat("ar-EG").format(
                              parseInt(verseNum)
                            )}
                          </span>
                        </span>
                      </React.Fragment>
                    );
                  })}
              </div>
            </div>
          )}

          <div className="flex justify-center gap-4 py-4 bg-emerald-50 border-t border-emerald-100">
            <button
              onClick={() => handlePageChange(thumnRange.currentPage - 1)}
              disabled={pageLoading || thumnRange.currentPage <= thumnRange.startPage}
              className="px-6 py-3 bg-emerald-700 text-white rounded-lg disabled:opacity-50 transition-all hover:bg-emerald-800 shadow font-arabic"
            >
              الصفحة السابقة
            </button>
            <span className="px-4 py-3 text-gray-700 font-bold text-lg font-arabic">
              الصفحة {thumnRange.currentPage}
            </span>
            <button
              onClick={() => handlePageChange(thumnRange.currentPage + 1)}
              disabled={pageLoading || thumnRange.currentPage >= thumnRange.endPage}
              className="px-6 py-3 bg-emerald-700 text-white rounded-lg disabled:opacity-50 transition-all hover:bg-emerald-800 shadow font-arabic"
            >
              الصفحة التالية
            </button>
          </div>
        </div>
      )}

      <div className="text-center mt-8">
        <button
          onClick={resetSelection}
          disabled={loading || pageLoading}
          className={`px-8 py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-lg transition-all
            hover:from-amber-600 hover:to-amber-700 shadow-md hover:shadow-lg text-lg font-arabic
            ${(loading || pageLoading) ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          اختيار مقطع جديد
        </button>
      </div>
    </div>
  );
};

export default HizbRandomTest;