"use client";

import React, { useRef, useState,useEffect } from "react";
import HTMLFlipBook from "react-pageflip";
import { hizbData } from "@/types/quran_hizb_pages";
const images = Array.from({ length: 604 }, (_, i) => 
  `/images/__02.01.05.Masahif-Qira'at-Nafe_removed-${i + 1}.jpg`
);


  
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
      <div ref={containerRef} dir="rtl" className="flex flex-col items-center p-4 bg-gray-100 min-w-min min-h-screen">
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
          width={400}
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