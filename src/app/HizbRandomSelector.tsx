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

const HizbRandomSelector = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [thumnRange, setThumnRange] = useState<ThumnRange | null>(null);
  const [verses, setVerses] = useState<Verse[]>([]);
  const [suraNames, setSuraNames] = useState<{ [key: number]: string }>({});
  const [randomHizb, setRandomHizb] = useState<number>(0);
  const [randomThumn, setRandomThumn] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);

  const categories = [
    { name: "الحزب ١-١٠", minHizb: 1, maxHizb: 10 },
    { name: "الحزب ١١-٢٠", minHizb: 11, maxHizb: 20 },
    { name: "الحزب ٢١-٤٠", minHizb: 21, maxHizb: 40 },
    { name: "الحزب ٤١-٦٠", minHizb: 41, maxHizb: 60 },
  ];

  const getPageByVerseKey = async (verseKey: string): Promise<number> => {
    try {
      const response = await axios.get(
        `https://api.quran.com/api/v4/verses/by_key/${verseKey}?fields=page_number`
      );
      return response.data.verse.page_number;
    } catch (error) {
      console.error("Error fetching page:", error);
      return 1;
    }
  };

  const getThumnPages = async (hizb: number, thumn: number): Promise<ThumnRange> => {
    const thumnIndex = (hizb - 1) * 8 + (thumn - 1);
    if (thumnIndex >= AthmanList.length - 1) {
      throw new Error("Invalid thumn selection");
    }
    const startPage = await getPageByVerseKey(AthmanList[thumnIndex].toString());
    const endPage = await getPageByVerseKey((AthmanList[thumnIndex + 1] - 1).toString());
    return {
      hizb,
      thumn,
      startPage: Math.max(1, Math.min(startPage, 604)),
      endPage: Math.max(1, Math.min(endPage, 604)),
      currentPage: startPage,
    };
  };

  const handleRandomSelection = async (minHizb: number, maxHizb: number) => {
    try {
      setLoading(true);
      const hizb = Math.floor(Math.random() * (maxHizb - minHizb + 1)) + minHizb;
      const thumn = Math.floor(Math.random() * 8) + 1;
      const range = await getThumnPages(hizb, thumn);
      setRandomHizb(hizb);
      setRandomThumn(thumn);
      setThumnRange(range);
      await fetchPageVerses(range.currentPage);
      setSelectedCategory(`${minHizb}-${maxHizb}`);
    } catch (error) {
      console.error("Error in selection:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPageVerses = async (page: number) => {
    try {
      setLoading(true);
      const response = await axios.get(
        `https://api.quran.com/api/v4/verses/by_page/${page}?fields=text_uthmani,page_number`
      );
      setVerses(response.data.verses);
    } catch (error) {
      console.error("Error fetching verses:", error);
    } finally {
      setLoading(false);
    }
  };

  // Add the missing handlePageChange function
  const handlePageChange = async (newPage: number) => {
    if (!thumnRange) return;
    
    // Ensure page is within valid range
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