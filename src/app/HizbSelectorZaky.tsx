"use client";

import { useState, useEffect } from "react";
import axios from "axios";

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

interface HizbDisplayProps {
    hizbNumber: number;
    showNavigation?: boolean;
  }

const HizbDisplayZaky: React.FC<HizbDisplayProps> = ({ hizbNumber,showNavigation=true }) => {
  const [verses, setVerses] = useState<Verse[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [suraNames, setSuraNames] = useState<{ [key: number]: string }>({});
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [pages, setPages] = useState<{ [key: number]: { [suraNumber: number]: Verse[] } }>({});
  const [sortedPageNumbers, setSortedPageNumbers] = useState<number[]>([]);

  useEffect(() => {
    const fetchHizb = async () => {
      try {
        setLoading(true);
        
        const response = await axios.get(
          `https://api.quran.com/api/v4/verses/by_hizb/${hizbNumber}?per_page=1000&fields=text_uthmani,page_number`
        );
        
        const suraResponse = await axios.get("https://api.quran.com/api/v4/chapters");
        const suraData: { [key: number]: string } = {};
        (suraResponse.data.chapters as Sura[]).forEach((sura) => {
          suraData[sura.id] = sura.name_arabic;
        });

        const pagesData: { [key: number]: { [suraNumber: number]: Verse[] } } = {};
        response.data.verses.forEach((verse: Verse) => {
          const page = verse.page_number;
          const suraNumber = parseInt(verse.verse_key.split(":")[0], 10);
          
          if (!pagesData[page]) pagesData[page] = {};
          if (!pagesData[page][suraNumber]) pagesData[page][suraNumber] = [];
          
          pagesData[page][suraNumber].push(verse);
        });

        const pageNumbers = Object.keys(pagesData).map(Number).sort((a, b) => a - b);
        
        setSuraNames(suraData);
        setPages(pagesData);
        setSortedPageNumbers(pageNumbers);
        setCurrentPage(pageNumbers[0]);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHizb();
  }, [hizbNumber]);

  const handlePreviousPage = () => {
    const currentIndex = sortedPageNumbers.indexOf(currentPage);
    if (currentIndex > 0) {
      setCurrentPage(sortedPageNumbers[currentIndex - 1]);
    }
  };

  const handleNextPage = () => {
    const currentIndex = sortedPageNumbers.indexOf(currentPage);
    if (currentIndex < sortedPageNumbers.length - 1) {
      setCurrentPage(sortedPageNumbers[currentIndex + 1]);
    }
  };

  const AyahNumber = ({ number }: { number: number }) => {
    const arabicNumbers = new Intl.NumberFormat("ar-EG").format(number);
    return (
      <span className="inline-flex items-center text-green-600 mx-1">
        {String.fromCharCode(0x06dd)}
        {arabicNumbers}
      </span>
    );
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-100 rounded-lg shadow-lg text-right">
      <h2 className="text-3xl font-bold text-center mb-6">
        📖 الحزب {hizbNumber}
      </h2>

      {loading ? (
        <p className="text-center text-lg">جاري التحميل...</p>
      ) : (
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="text-center text-xl mb-4 font-medium text-gray-600">
            الصفحة {new Intl.NumberFormat('ar-SA').format(currentPage)}
          </div>

          <div className="quran-page" style={{
            minHeight: '70vh',
            fontFamily: 'Warsh, "Noto Naskh Arabic", serif',
            fontSize: '28px',
            lineHeight: '2.5',
            textAlign: 'justify',
            textAlignLast: 'center',
            direction: 'rtl',
            padding: '20px',
            background: '#fef8e7',
            borderRadius: '8px',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
          }}>
            {pages[currentPage] && Object.entries(pages[currentPage]).map(([suraNumber, verses]) => (
              <div key={suraNumber}>
                <h3 className="surah-title text-2xl font-bold text-emerald-800 my-4">
                  {suraNames[Number(suraNumber)]}
                </h3>
                <div className="verses">
                  {verses.map((verse) => (
                    <span key={verse.id} className="inline">
                      {verse.text_uthmani}
                      <AyahNumber number={Number(verse.verse_key.split(":")[1])} />
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>

         {showNavigation && ( <div className="flex justify-center gap-4 mt-6">
            <button
              onClick={handlePreviousPage}
              disabled={sortedPageNumbers.indexOf(currentPage) === 0}
              className="px-6 py-2 bg-emerald-600 text-white rounded disabled:opacity-50 hover:bg-emerald-700 transition-colors"
            >
              السابق
            </button>
            <button
              onClick={handleNextPage}
              disabled={sortedPageNumbers.indexOf(currentPage) === sortedPageNumbers.length - 1}
              className="px-6 py-2 bg-emerald-600 text-white rounded disabled:opacity-50 hover:bg-emerald-700 transition-colors"
            >
              التالي
            </button>
          </div>)}
        </div>
      )}
    </div>
  );
};

export default HizbDisplayZaky;