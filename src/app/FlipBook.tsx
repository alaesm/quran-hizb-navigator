"use client";

import React, { useRef, useState,useEffect } from "react";
import HTMLFlipBook from "react-pageflip";

const images = Array.from({ length: 604 }, (_, i) => 
  `/images/__02.01.05.Masahif-Qira'at-Nafe_removed-${i + 1}.jpg`
);

const hizbData = [
    { hizb: 1, startPage: 1 }, { hizb: 2, startPage: 11 }, { hizb: 3, startPage: 22 }, 
    { hizb: 4, startPage: 32 }, { hizb: 5, startPage: 42 }, { hizb: 6, startPage: 51 }, 
    { hizb: 7, startPage: 62 }, { hizb: 8, startPage: 71 }, { hizb: 9, startPage: 82 }, 
    { hizb: 10, startPage: 92 }, { hizb: 11, startPage: 102 }, { hizb: 12, startPage: 111 }, 
    { hizb: 13, startPage: 121 }, { hizb: 14, startPage: 132 }, { hizb: 15, startPage: 142 }, 
    { hizb: 16, startPage: 151 }, { hizb: 17, startPage: 162 }, { hizb: 18, startPage: 173 }, 
    { hizb: 19, startPage: 182 }, { hizb: 20, startPage: 192 }, { hizb: 21, startPage: 201 }, 
    { hizb: 22, startPage: 212 }, { hizb: 23, startPage: 222 }, { hizb: 24, startPage: 231 }, 
    { hizb: 25, startPage: 242 }, { hizb: 26, startPage: 252 }, { hizb: 27, startPage: 262 }, 
    { hizb: 28, startPage: 272 }, { hizb: 29, startPage: 282 }, { hizb: 30, startPage: 292 }, 
    { hizb: 31, startPage: 302 }, { hizb: 32, startPage: 312 }, { hizb: 33, startPage: 322 }, 
    { hizb: 34, startPage: 332 }, { hizb: 35, startPage: 342 }, { hizb: 36, startPage: 352 }, 
    { hizb: 37, startPage: 362 }, { hizb: 38, startPage: 371 }, { hizb: 39, startPage: 382 }, 
    { hizb: 40, startPage: 392 }, { hizb: 41, startPage: 402 }, { hizb: 42, startPage: 413 }, 
    { hizb: 43, startPage: 422 }, { hizb: 44, startPage: 431 }, { hizb: 45, startPage: 442 }, 
    { hizb: 46, startPage: 451 }, { hizb: 47, startPage: 462 }, { hizb: 48, startPage: 472 }, 
    { hizb: 49, startPage: 482 }, { hizb: 50, startPage: 491 }, { hizb: 51, startPage: 502 }, 
    { hizb: 52, startPage: 513 }, { hizb: 53, startPage: 522 }, { hizb: 54, startPage: 531 }, 
    { hizb: 55, startPage: 542 }, { hizb: 56, startPage: 553 }, { hizb: 57, startPage: 562 }, 
    { hizb: 58, startPage: 572 }, { hizb: 59, startPage: 582 }, { hizb: 60, startPage: 591 }
  ];
  
  const FlipBook = () => {
    const flipBookRef = useRef<HTMLFlipBook>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [pageNumber, setPageNumber] = useState<number>(1);
    const [selectedHizb, setSelectedHizb] = useState<number>(1);
    const [isFullScreen, setIsFullScreen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [loadedImagesCount, setLoadedImagesCount] = useState(0);
    const [totalPages, setTotalPages] = useState(images.length);
    const reversedImages = [...images].reverse();
  

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
  
     useEffect(() => {
    if (loadedImagesCount === images.length) {
      setIsLoading(false);
    }
  }, [loadedImagesCount]);

    // تنقل بين الصفحات
    // const goToPrevPage = () => flipBookRef.current?.pageFlip().flipPrev();
    // const goToNextPage  = () => flipBookRef.current?.pageFlip().flipNext();
    const goToPrevPage = () => flipBookRef.current?.pageFlip().flipNext();
    const goToNextPage = () => flipBookRef.current?.pageFlip().flipPrev();
  
    // الانتقال لصفحة محددة
    // const goToPage = (page: number) => {
    //   if (page >= 1 && page <= images.length) {
    //     setPageNumber(page);
    //     flipBookRef.current?.pageFlip().flip(page - 1);
    //   }
    // };

    const goToPage = (page: number) => {
      if (page >= 1 && page <= totalPages) {
        setPageNumber(page);
       
        const flipToIndex = totalPages - page;
        flipBookRef.current?.pageFlip().flip(flipToIndex);
      }
    };
  
   
    const goToHizb = (hizbNumber: number) => {
      const hizb = hizbData.find(h => h.hizb === hizbNumber);
      if (hizb) {
        setSelectedHizb(hizbNumber);
        setPageNumber(hizb.startPage);
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

    const handlePageFlip = (e: any) => {
      const currentPage = totalPages - e.data + 1;
      setPageNumber(currentPage);
    };
    return (
      <div ref={containerRef} dir="rtl" className="flex flex-col items-center p-4 bg-gray-100 min-h-screen">
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


<div className="flipbook-container" style={{ direction: "rtl" }}>
        <HTMLFlipBook
          ref={flipBookRef}
          width={600}
          height={800}
          className="quran-flipbook shadow-lg"
          showCover={true}
          startPage={images.length-1}
          direction="rtl"
          onFlip={handlePageFlip}
          flippingTime={500}
          usePortrait={false}
          maxShadowOpacity={0.5}
        >
          {reversedImages.map((image, index) => {
            // Calculate the actual page number (reversed)
            const actualPageNumber = totalPages - index;
            
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

        {/* <HTMLFlipBook
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
        </HTMLFlipBook> */}
  
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