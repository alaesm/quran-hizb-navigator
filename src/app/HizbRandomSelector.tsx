"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { AthmanList } from "@/types/listtest";

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
}

interface ThumnBounds {
  startVerse: number;
  endVerse: number;
  hizb: number;
  thumn: number;
}

const HizbRandomSelector = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [thumnRange, setThumnRange] = useState<ThumnRange | null>(null);
  const [verses, setVerses] = useState<Verse[]>([]);
  const [suraNames, setSuraNames] = useState<{ [key: number]: string }>({});
  const [randomHizb, setRandomHizb] = useState<number>(0);
  const [randomThumn, setRandomThumn] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [quarters, setQuarters] = useState<Quarter[]>([]);
  const [quartersLoading, setQuartersLoading] = useState(true);
  const [quartersError, setQuartersError] = useState<string | null>(null);
  const categories = [
    { name: "الحزب ١-١٠", minHizb: 1, maxHizb: 10 },
    { name: "الحزب ١١-٢٠", minHizb: 11, maxHizb: 20 },
    { name: "الحزب ٢١-٤٠", minHizb: 21, maxHizb: 40 },
    { name: "الحزب ٤١-٦٠", minHizb: 41, maxHizb: 60 },
  ];


  useEffect(() => {
    const fetchQuarters = async () => {
      try {
        setQuartersLoading(true);
        const quartersList = [];
        
      
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

    
    setVerses(thumnVerses);

    return {
      hizb,
      thumn,
      startPage,
      endPage,
      currentPage: startPage,
    };
  } catch (error) {
    console.error("Error in getThumnPages:", error);
    throw new Error("فشل في الحصول على صفحات الثمن");
  }
};

const handleRandomSelection = async (minHizb: number, maxHizb: number) => {
    try {
     
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
      alert(error instanceof Error ? error.message : "حدث خطأ في اختيار الثمن. الرجاء المحاولة مرة أخرى.");
    } finally {
      setLoading(false);
    }
};

 const fetchPageVerses = async (page: number) => {
  try {
    setLoading(true);
    
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
          newVerse => !prevVerses.some(v => v.verse_key === newVerse.verse_key)
        );
        return [...prevVerses, ...newVerses];
      });
    }
  } catch (error) {
    console.error("Error fetching verses:", error);
  } finally {
    setLoading(false);
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

  useEffect(() => {
    axios.get("https://api.quran.com/api/v4/chapters").then((response) => {
      const suraData: { [key: number]: string } = {};
      response.data.chapters.forEach((sura: Sura) => {
        suraData[sura.id] = sura.name_arabic;
      });
      setSuraNames(suraData);
    });
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-6 text-right">
      <h2 className="text-3xl font-bold text-center mb-8">الاختيار العشوائي للقراءة</h2>
      {quartersLoading && (
        <div className="text-center py-4">
          <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-solid border-emerald-600 border-r-transparent"></div>
          <p className="mt-2 text-gray-600">جاري تحميل بيانات الأثمان...</p>
        </div>
      )}

      {quartersError && (
        <div className="bg-red-100 p-4 rounded-lg mb-4 text-red-700">
          {quartersError}
        </div>
      )}
      <div className="grid grid-cols-2 gap-4 mb-8">
        {categories.map((category) => (
          <button
            key={category.name}
            onClick={() => handleRandomSelection(category.minHizb, category.maxHizb)}
            disabled={loading}
            className={`p-4 rounded-lg text-xl ${
              selectedCategory === `${category.minHizb}-${category.maxHizb}`
                ? "bg-emerald-600 text-white"
                : "bg-gray-200 hover:bg-gray-300"
            } ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            {category.name}
          </button>
        ))}
      </div>

      {loading && !thumnRange && (
        <div className="text-center py-8">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-emerald-600 border-r-transparent"></div>
          <p className="mt-2 text-gray-600">جاري التحميل...</p>
        </div>
      )}

      {thumnRange && (
        <div className="bg-white p-6 rounded-lg shadow mb-8">
          <div className="text-center mb-6">
            <h3 className="text-2xl font-bold text-emerald-600">
              الحزب {randomHizb} - الثمن {randomThumn}
            </h3>
            <p className="text-gray-600 mt-2">
              الصفحات من {thumnRange.startPage} إلى {thumnRange.endPage}
            </p>
          </div>

          {loading ? (
            <div className="text-center py-8" style={{ minHeight: '70vh' }}>
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-emerald-600 border-r-transparent"></div>
              <p className="mt-2 text-gray-600">جاري تحميل الصفحة...</p>
            </div>
          ) : (
            <div className="quran-page" style={{
              minHeight: '70vh',
              fontFamily: 'Warsh, "Noto Naskh Arabic", serif',
              fontSize: '28px',
              lineHeight: '2.5',
              textAlign: 'justify',
              direction: 'rtl',
              padding: '20px',
              background: '#fef8e7'
            }}>
              {verses
                .filter(v => v.page_number === thumnRange.currentPage)
                .map((verse) => (
                  <span key={verse.id} className="inline">
                    {verse.text_uthmani}
                    <span className="text-green-600 mx-1">
                      {String.fromCharCode(0x06dd)}
                      {new Intl.NumberFormat("ar-EG").format(
                        parseInt(verse.verse_key.split(":")[1])
                      )}
                    </span>
                  </span>
                ))}
            </div>
          )}

          <div className="flex justify-center gap-4 mt-6">
            <button
              onClick={() => handlePageChange(thumnRange.currentPage - 1)}
              disabled={loading || thumnRange.currentPage <= thumnRange.startPage}
              className="px-6 py-2 bg-emerald-600 text-white rounded disabled:opacity-50"
            >
              الصفحة السابقة
            </button>
            <span className="px-4 py-2 text-gray-700">
              الصفحة {thumnRange.currentPage}
            </span>
            <button
              onClick={() => handlePageChange(thumnRange.currentPage + 1)}
              disabled={loading || thumnRange.currentPage >= thumnRange.endPage}
              className="px-6 py-2 bg-emerald-600 text-white rounded disabled:opacity-50"
            >
              الصفحة التالية
            </button>
          </div>
        </div>
      )}

      <div className="text-center">
        <button
          onClick={() => {
            setThumnRange(null);
            setRandomHizb(0);
            setRandomThumn(0);
            setVerses([]);
            setSelectedCategory("");
          }}
          disabled={loading}
          className={`px-6 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          اختيار جديد
        </button>
      </div>
    </div>
  );
};

export default HizbRandomSelector;