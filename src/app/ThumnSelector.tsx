"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Book } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getQuarterPages } from "@/types/quran_hizb_pages";

import Image from "next/image";
import ShowInBookStyle from "@/components/ShowInBookStyle";

export const ThumnSelector = () => {
  const router = useRouter();
  const [selectedHizbRange, setSelectedHizbRange] = useState<[number, number]>([
    1, 60,
  ]);
  const [currentThumn, setCurrentThumn] = useState<number | null>(null);
  const [startHizb, setStartHizb] = useState<number>(1);
  const [endHizb, setEndHizb] = useState<number>(60);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showThumnImage, setShowThumnImage] = useState<boolean>(false);
  const [showTajweedImage, setShowTajweedImage] = useState<boolean>(false);
  const [randomHizb, setRandomHizb] = useState<number>(0);
  const [randomThumn, setRandomThumn] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("");

  const categories = [
    { name: "الحزب ١-١٠", minHizb: 1, maxHizb: 10 },
    { name: "الحزب ١١-٢٠", minHizb: 11, maxHizb: 20 },
    { name: "الحزب ٢١-٤٠", minHizb: 21, maxHizb: 40 },
    { name: "الحزب ٤١-٦٠", minHizb: 41, maxHizb: 60 },
  ];

  // تحديث نطاق الحزب عند تغيير القيم
  const handleRangeChange = (start: number, end: number) => {
    if (start > 0 && end <= 60 && start <= end) {
      setSelectedHizbRange([start, end]);
      setStartHizb(start);
      setEndHizb(end);
    }
  };

  // اختيار ثمن عشوائي من فئة محددة
  const handleRandomSelection = async (minHizb: number, maxHizb: number) => {
    try {
      setLoading(true);
      setSelectedCategory(`${minHizb}-${maxHizb}`);
      
      // اختيار حزب عشوائي ضمن النطاق المحدد
      const randomHizbNumber =
        Math.floor(Math.random() * (maxHizb - minHizb + 1)) + minHizb;
      
      // اختيار ثمن عشوائي (1-8)
      const randomThumnNumber = Math.floor(Math.random() * 8) + 1;
      
      setRandomHizb(randomHizbNumber);
      setRandomThumn(randomThumnNumber);
      
      // حساب رقم الثمن الكلي (من 1 إلى 480)
      const thumnNumber = (randomHizbNumber - 1) * 8 + randomThumnNumber;
      setCurrentThumn(thumnNumber);
      
      // إعادة ضبط حالة عرض الصور
      setShowThumnImage(false);
      setShowTajweedImage(false);
    } catch (error) {
      console.error("Error in selection:", error);
      alert(
        error instanceof Error
          ? error.message
          : "حدث خطأ في اختيار الثمن. الرجاء المحاولة مرة أخرى."
      );
    } finally {
      setLoading(false);
    }
  };

  // استخدام useEffect لتحديث النطاق عند تغيير الفئة
  useEffect(() => {
    if (randomHizb && randomThumn) {
      // إظهار معلومات الثمن المختار في الواجهة
      const thumnNumber = (randomHizb - 1) * 8 + randomThumn;
      setCurrentThumn(thumnNumber);
    }
  }, [randomHizb, randomThumn]);

  // الدالة الأصلية لاختيار ثمن عشوائي من النطاق المحدد يدويًا
  const selectRandomThumn = useCallback(() => {
    setIsLoading(true);
    setShowThumnImage(false);
    setShowTajweedImage(false);
    setTimeout(() => {
      const [start, end] = selectedHizbRange;
      const randomHizb = Math.floor(Math.random() * (end - start + 1)) + start;
      const randomThumn = Math.floor(Math.random() * 8) + 1;
      const thumnNumber = (randomHizb - 1) * 8 + randomThumn;

      setCurrentThumn(thumnNumber);
      setIsLoading(false);
    }, 700);
  }, [selectedHizbRange]);

  const handleViewVerses = useCallback(() => {
    if (currentThumn) {
      setShowThumnImage((prev) => !prev);
    }
  }, [currentThumn]);

  const handleViewTajweed = useCallback(() => {
    if (currentThumn) {
      setShowTajweedImage((prev) => !prev);
    }
  }, [currentThumn]);

  const getThumnImageName = (thumnNumber: number) => {
    return thumnNumber.toString().padStart(3, "0"); // تحويل الرقم إلى تنسيق 3 أرقام
  };

  return (
    <div className="flex flex-col p-6 md:p-20 items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-full h-full bg-white shadow-lg">
        <CardHeader>
          <CardTitle className="text-center text-gray-800 text-2xl font-semibold">
            اختيار الأثمان العشوائي
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 overflow-auto">
          {/* قسم اختيار النطاق يدويًا */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col items-center">
              <Label htmlFor="startHizb" className="text-gray-700">من الحزب</Label>
              <Input
                id="startHizb"
                type="number"
                min={1}
                max={60}
                value={startHizb}
                onChange={(e) => handleRangeChange(parseInt(e.target.value), endHizb)}
                className="w-24 text-center border-gray-300"
              />
            </div>
            <div className="flex flex-col items-center">
              <Label htmlFor="endHizb" className="text-gray-700">إلى الحزب</Label>
              <Input
                id="endHizb"
                type="number"
                min={1}
                max={60}
                value={endHizb}
                onChange={(e) => handleRangeChange(startHizb, parseInt(e.target.value))}
                className="w-24 text-center border-gray-300"
              />
            </div>
          </div>

          {/* زر الاختيار العشوائي */}
          <Button
            onClick={selectRandomThumn}
            className="w-full bg-green-500 hover:bg-green-700 text-white py-3 rounded-lg shadow-md transition duration-300"
            size="lg"
            disabled={isLoading}
          >
            {isLoading ? "جاري الاختيار..." : "اختيار ثُمن عشوائي"}
          </Button>

          {/* قسم الفئات */}
          <div className="mt-8">
            <h3 className="text-lg font-medium text-gray-800 mb-4 text-center">
              أو اختر من الفئات
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {categories.map((category) => (
                <button
                  key={category.name}
                  onClick={() =>
                    handleRandomSelection(category.minHizb, category.maxHizb)
                  }
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
          </div>

          {/* عرض نتيجة الاختيار */}
          {currentThumn && (
            <div className="text-center p-6 border w-full rounded-lg shadow-sm bg-gray-50 mt-8">
              <h3 className="text-xl font-medium text-gray-800">
                الثمن المختار:
              </h3>
              <p className="text-3xl font-bold text-blue-600">
                الحزب {Math.ceil(currentThumn / 8)} - الثمن{" "}
                {currentThumn % 8 || 8}
              </p>
              <div className="flex flex-wrap justify-center gap-4 mt-4">
                <Button
                  className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg transition duration-300 flex items-center"
                  onClick={handleViewVerses}
                >
                  <Book className="h-4 w-4 ml-2" /> {showThumnImage ? "إخفاء" : "عرض"} آيات الثمن
                </Button>
                <Button
                  className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg transition duration-300 flex items-center"
                  onClick={handleViewTajweed}
                >
                  <Book className="h-4 w-4 ml-2" /> {showTajweedImage ? "إخفاء" : "عرض"} آيات الثمن مع تجويد
                </Button>
              </div>
              
              {/* عرض صورة الثمن */}
              {showThumnImage && (
                <div className="mt-6 flex justify-center items-center">
                  <Image
                    src={`/thumns/thumn-${getThumnImageName(
                      currentThumn + 1
                    )}.png`}
                    alt={`ثمن ${currentThumn}`}
                    width={500}
                    height={400}
                    className="rounded-lg shadow-lg border border-gray-300"
                    priority
                  />
                </div>
              )}
              
              {/* عرض صور التجويد */}
              {showTajweedImage && (
                <div className="mt-6 flex flex-wrap justify-center items-center gap-4">
                  <ShowInBookStyle
                    pageNumbers={
                      getQuarterPages(
                        Math.ceil(currentThumn / 8),
                        currentThumn % 8 || 8
                      )?.pages || []
                    }
                  />
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};