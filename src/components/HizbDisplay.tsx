"use client";

import { useState, useEffect } from "react";
import axios from "axios";

interface Verse {
  id: number;
  verse_key: string; // e.g., "2:24"
  text_uthmani: string; // نص الآية بالرسم العثماني
}

interface Sura {
  id: number;
  name_arabic: string;
}

interface HizbDisplayProps {
  hizbNumber: number; // رقم الحزب الذي سيتم عرضه
}

const HizbDisplay: React.FC<HizbDisplayProps> = ({ hizbNumber }) => {
  const [verses, setVerses] = useState<Verse[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [suraNames, setSuraNames] = useState<{ [key: number]: string }>({});

  useEffect(() => {
    const fetchHizb = async () => {
      try {
        setLoading(true);

        // جلب الآيات الخاصة بالحزب المحدد
        const response = await axios.get(
          `https://api.quran.com/api/v4/verses/by_hizb/${hizbNumber}?per_page=1000&fields=text_uthmani`
        );
        setVerses(response.data.verses);

        // جلب أسماء السور
        const suraResponse = await axios.get(
          "https://api.quran.com/api/v4/chapters"
        );
        const suraData: { [key: number]: string } = {};

        (suraResponse.data.chapters as Sura[]).forEach((sura) => {
          suraData[sura.id] = sura.name_arabic;
        });

        setSuraNames(suraData);
      } catch (error) {
        console.error("خطأ في جلب البيانات:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHizb();
  }, [hizbNumber]); // تحديث عند تغيير `hizbNumber`


  

  // تجميع الآيات حسب السور
  const groupedVerses: { [key: number]: Verse[] } = {};
  verses.forEach((verse) => {
    const suraNumber = parseInt(verse.verse_key.split(":")[0], 10);
    if (!groupedVerses[suraNumber]) {
      groupedVerses[suraNumber] = [];
    }
    groupedVerses[suraNumber].push(verse);
  });


  const AyahNumber = ({ number }: { number: number }) => {
    const arabicNumbers = new Intl.NumberFormat("ar-EG").format(number);
  
    return (
      <span
        data-font-scale="3"
        data-font="code_v1"
        className="GlyphWord_styledWord"
        style={{
          fontFamily: "p1-v1",
          display: "inline-flex",
          alignItems: "center",
        }}
      >
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
        <div className="bg-white p-6 rounded-lg shadow space-y-6">
          {Object.keys(groupedVerses).map((suraNumber) => (
            <div key={suraNumber}>
              <h3 className="surah-title">
                {suraNames[Number(suraNumber)] || `سورة ${suraNumber}`}
              </h3>
              <div
                className="arabic-text"
                style={{
                  fontSize: "32px",
                  lineHeight: "2.8",
                  direction: "rtl",
                  fontFamily: "Warsh, 'Noto Naskh Arabic', serif",
                  textAlign: "justify",
                  textAlignLast: "center",
                  wordSpacing: "0.1rem", // تقليل الفراغ بين الكلمات
                  display: "inline", // عرض الآيات بجانب بعضها البعض
                }}
              >
                {groupedVerses[Number(suraNumber)].map((verse) => (
                  <span key={verse.id} className="inline">
                    {verse.text_uthmani}
                    <AyahNumber number={Number(verse.verse_key.split(":")[1])} />{" "}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default HizbDisplay;
