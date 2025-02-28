"use client";

import React, { useRef, useState,useEffect } from "react";
import HTMLFlipBook from "react-pageflip";

const images = Array.from({ length: 604 }, (_, i) => 
  `/images/__02.01.05.Masahif-Qira'at-Nafe_removed-${i + 1}.jpg`
);

const hizbData = [
    { hizb: 1, startPage: 1 }, { hizb: 2, startPage: 11 }, { hizb: 3, startPage: 21 }, 
    { hizb: 4, startPage: 31 }, { hizb: 5, startPage: 41 }, { hizb: 6, startPage: 51 }, 
    { hizb: 7, startPage: 61 }, { hizb: 8, startPage: 71 }, { hizb: 9, startPage: 81 }, 
    { hizb: 10, startPage: 91 }, { hizb: 11, startPage: 101 }, { hizb: 12, startPage: 111 }, 
    { hizb: 13, startPage: 121 }, { hizb: 14, startPage: 131 }, { hizb: 15, startPage: 141 }, 
    { hizb: 16, startPage: 151 }, { hizb: 17, startPage: 161 }, { hizb: 18, startPage: 171 }, 
    { hizb: 19, startPage: 181 }, { hizb: 20, startPage: 191 }, { hizb: 21, startPage: 201 }, 
    { hizb: 22, startPage: 212 }, { hizb: 23, startPage: 221 }, { hizb: 24, startPage: 231 }, 
    { hizb: 25, startPage: 241 }, { hizb: 26, startPage: 251 }, { hizb: 27, startPage: 261 }, 
    { hizb: 28, startPage: 271 }, { hizb: 29, startPage: 281 }, { hizb: 30, startPage: 291 }, 
    { hizb: 31, startPage: 301 }, { hizb: 32, startPage: 311 }, { hizb: 33, startPage: 321 }, 
    { hizb: 34, startPage: 331 }, { hizb: 35, startPage: 341 }, { hizb: 36, startPage: 351 }, 
    { hizb: 37, startPage: 361 }, { hizb: 38, startPage: 371 }, { hizb: 39, startPage: 381 }, 
    { hizb: 40, startPage: 391 }, { hizb: 41, startPage: 401 }, { hizb: 42, startPage: 411 }, 
    { hizb: 43, startPage: 421 }, { hizb: 44, startPage: 431 }, { hizb: 45, startPage: 441 }, 
    { hizb: 46, startPage: 451 }, { hizb: 47, startPage: 461 }, { hizb: 48, startPage: 471 }, 
    { hizb: 49, startPage: 481 }, { hizb: 50, startPage: 491 }, { hizb: 51, startPage: 501 }, 
    { hizb: 52, startPage: 511 }, { hizb: 53, startPage: 521 }, { hizb: 54, startPage: 531 }, 
    { hizb: 55, startPage: 541 }, { hizb: 56, startPage: 551 }, { hizb: 57, startPage: 561 }, 
    { hizb: 58, startPage: 571 }, { hizb: 59, startPage: 581 }, { hizb: 60, startPage: 591 }
  ];
  
  const FlipBook = () => {
    const flipBookRef = useRef<HTMLFlipBook>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [pageNumber, setPageNumber] = useState<number>(1);
    const [selectedHizb, setSelectedHizb] = useState<number>(1);
    const [isFullScreen, setIsFullScreen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [loadedImagesCount, setLoadedImagesCount] = useState(0);

    useEffect(() => {
        images.forEach((imgSrc) => {
          const img = new Image();
          img.src = imgSrc;
          img.onload = () => {
            setLoadedImagesCount(prev => prev + 1);
          };
        });
      }, []);

      useEffect(() => {
        if (loadedImagesCount === images.length) {
          setIsLoading(false);
        }
      }, [loadedImagesCount]);
  
    
    // تنقل بين الصفحات
    const goToPrevPage = () => flipBookRef.current?.pageFlip().flipPrev();
    const goToNextPage  = () => flipBookRef.current?.pageFlip().flipNext();
  
    // الانتقال لصفحة محددة
    const goToPage = (page: number) => {
      if (page >= 1 && page <= images.length) {
        setPageNumber(page);
        flipBookRef.current?.pageFlip().flip(page - 1);
      }
    };
  
    // الانتقال لبداية الحزب
    const goToHizb = (hizbNumber: number) => {
      const hizb = hizbData.find(h => h.hizb === hizbNumber);
      if (hizb) {
        setSelectedHizb(hizbNumber);
        goToPage(hizb.startPage);
       
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
  
    return (
      <div ref={containerRef} className="flex flex-col items-center p-4 bg-gray-100 min-h-screen">
         {isLoading && (
        <div className="fixed inset-0 bg-white bg-opacity-90 flex justify-center items-center z-50">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-emerald-600 mx-auto"></div>
            <p className="mt-4 text-xl text-emerald-800 font-arabic">
              جاري تحميل المصحف الكريم...
            </p>
            <p className="text-gray-600 mt-2">
              {Math.round((loadedImagesCount / images.length) * 100)}% اكتمال
            </p>
          </div>
        </div>
      )}

        <HTMLFlipBook
          ref={flipBookRef}
          width={600}
          height={800}
          className="quran-flipbook shadow-lg"
          showCover={true}
          startPage={0}
          style={{ direction: "ltr" }}
        >
          {images.map((image, index) => (
            <div 
              key={index} 
              className="quran-page bg-cream" 
              data-page-number={index + 1}
              style={{ direction: "rtl" }}
            >
              <img 
                src={image} 
                alt={`صفحة ${index + 1}`} 
                className="w-full h-full object-contain"
              />
            </div>
          ))}
        </HTMLFlipBook>
  
        {/* لوحة التحكم */}
        <div className="control-panel mt-6 w-full max-w-2xl bg-white p-4 rounded-lg shadow-md">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
            
            {/* تنقل بالأحزاب */}
            <div className="hizb-selector">
              <select
                value={selectedHizb}
                onChange={(e) => goToHizb(Number(e.target.value))}
                className="w-full p-2 border rounded bg-white"
              >
                {hizbData.map((hizb) => (
                  <option key={hizb.hizb} value={hizb.hizb}>
                    الحزب {hizb.hizb} - ص {hizb.startPage}
                  </option>
                ))}
              </select>
            </div>
  
            {/* تنقل بالصفحات */}
            <div className="page-navigation flex items-center gap-2">
              <input
                type="number"
                value={pageNumber}
                onChange={(e) => setPageNumber(Number(e.target.value))}
                className="border rounded p-2 text-center w-24"
              />
              <button 
                onClick={() => goToPage(pageNumber)}
                className="px-4 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-700"
              >
                انتقل للصفحة
              </button>
            </div>
  
            {/* أزرار التنقل */}
            <div className="flex gap-2 justify-center">
              <button
                onClick={goToPrevPage}
                className="px-4 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-700"
              >
                ← السابق
              </button>
              <button
                onClick={goToNextPage}
                className="px-4 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-700"
              >
                التالي →
              </button>
            </div>
          </div>
  
          {/* زر ملء الشاشة */}
          <div className="mt-4 text-center">
            <button
              onClick={toggleFullScreen}
              className="px-6 py-2 bg-gray-800 text-white rounded hover:bg-gray-900"
            >
              {isFullScreen ? "الخروج من الوضع الكامل" : "ملء الشاشة"}
            </button>
          </div>
        </div>
      </div>
    );
  };
  
  export default FlipBook;