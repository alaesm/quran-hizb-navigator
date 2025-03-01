"use client";

import React, { useRef, useState, useEffect, useMemo } from "react";
import HTMLFlipBook from "react-pageflip";


const images = Array.from({ length: 604 }, (_, i) => 
  `/images/__02.01.05.Masahif-Qira'at-Nafe_removed-${i + 1}.jpg`
);

interface ShowInBookStyleProps {
    pageNumbers: number[]; // يجب أن يكون pageNumbers
  }

const ShowInBookStyle: React.FC<ShowInBookStyleProps> = ({ pageNumbers }) => {
  const flipBookRef = useRef<HTMLFlipBook>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [loadedImagesCount, setLoadedImagesCount] = useState(0);
  const [pageNumber, setPageNumber] = useState(1); // تعريف pageNumber

  // تصفية الصور بناءً على أرقام الصفحات المطلوبة
  const filteredImages = useMemo(() => {
    return images.filter((_, index) => pageNumbers.includes(index + 1));
  }, [pageNumbers]); // يعتمد على pageNumbers
  const reversedFilteredImages = [...filteredImages].reverse();

  useEffect(() => {
    if (filteredImages.length === 0) return; // إذا كانت filteredImages فارغة، لا تفعل شيئًا
  
    let isMounted = true; // لتجنب تحديث الحالة بعد إلغاء التثبيت
  
    filteredImages.forEach((imgSrc) => {
      const img = new Image();
      img.src = imgSrc;
      img.onload = () => {
        if (isMounted) {
          setLoadedImagesCount(prev => prev + 1);
        }
      };
    });
  
    return () => {
      isMounted = false; // تنظيف عند إلغاء التثبيت
    };
  }, [filteredImages]);// يعتمد على filteredImages

  useEffect(() => {
    if (loadedImagesCount === filteredImages.length) {
      setIsLoading(false);
    }
  }, [loadedImagesCount, filteredImages.length]);// يعتمد على loadedImagesCount و filteredImages.length


  // الانتقال لصفحة محددة
  const goToPage = (page: number) => {
    if (page >= 1 && page <= filteredImages.length) {
      setPageNumber(page); // تحديث pageNumber
      const flipToIndex = filteredImages.length - page;
      flipBookRef.current?.pageFlip().flip(flipToIndex);
    }
  };

  // وضع ملء الشاشة
  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen();
      setIsFullScreen(true);
    } else {
      document.exitFullscreen();
      setIsFullScreen(false);
    }
  };

  const handlePageFlip = (e: any) => {
    const currentPage = filteredImages.length - e.data + 1;
    setPageNumber(currentPage); // تحديث pageNumber عند تغيير الصفحة
  };

  return (
    <div ref={containerRef} dir="rtl" className="flex flex-col items-center p-4 bg-gray-100 min-h-screen">
      {isLoading && (
        <div className="fixed inset-0 bg-white bg-opacity-90 flex justify-center items-center z-50">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-emerald-600 mx-auto"></div>
            <p className="mt-4 text-xl text-emerald-800 font-arabic">
              جاري تحميل الصفحات المحددة...
            </p>
            <p className="text-gray-600 mt-2">
              {Math.round((loadedImagesCount / filteredImages.length) * 100)}% اكتمال
            </p>
          </div>
        </div>
      )}

      <div className="flipbook-container" style={{ direction: "rtl" }}>
        <HTMLFlipBook
          ref={flipBookRef}
          width={400}
          height={800}
          className="quran-flipbook shadow-lg"
          showCover={true}
          startPage={filteredImages.length - 1}
          direction="rtl"
          onFlip={handlePageFlip}
          flippingTime={500}
          usePortrait={false}
          maxShadowOpacity={0.5}
        >
          {reversedFilteredImages.map((image, index) => {
            const actualPageNumber = filteredImages.length - index;
            return (
              <div 
                key={index} 
                className="quran-page bg-cream" 
                data-page-number={actualPageNumber}
              >
                <img 
                  src={image} 
                  alt={`صفحة ${actualPageNumber}`} 
                  className="w-full h-full object-contain"
                />
              </div>
            );
          })}
        </HTMLFlipBook>
      </div>

      {/* لوحة التحكم */}
      <div className="control-panel mt-6 w-full max-w-2xl bg-white p-4 rounded-lg shadow-md">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
          {/* تنقل بالصفحات */}
          <div className="page-navigation flex items-center gap-2">
            <input
              type="number"
              min={1}
              max={filteredImages.length}
              value={pageNumber} // استخدام pageNumber
              onChange={(e) => setPageNumber(Number(e.target.value))} // تحديث pageNumber
              className="border rounded p-2 text-center w-24"
            />
            <button 
              onClick={() => goToPage(pageNumber)} // استخدام pageNumber
              className="px-4 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-700"
            >
              انتقل للصفحة
            </button>
          </div>

          {/* زر ملء الشاشة */}
          <div className="text-center">
            <button
              onClick={toggleFullScreen}
              className="px-6 py-2 bg-gray-800 text-white rounded hover:bg-gray-900"
            >
              {isFullScreen ? "الخروج من الوضع الكامل" : "ملء الشاشة"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShowInBookStyle;