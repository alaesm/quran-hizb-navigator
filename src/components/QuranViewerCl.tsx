import React, { useState } from 'react';
import { Verse } from '../types/index';

interface QuranViewerProps {
  verses: Verse[];
}

const QuranViewerCl: React.FC<QuranViewerProps> = ({ verses }) => {
  const [currentPage, setCurrentPage] = useState(0);
  const versesPerPage = 5; // Adjust based on preference
  
  // Group verses into pages
  const totalPages = Math.ceil(verses.length / versesPerPage);
  const pages = Array.from({ length: totalPages }, (_, i) => 
    verses.slice(i * versesPerPage, (i + 1) * versesPerPage)
  );
  
  const goToNextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    }
  };
  
  const goToPrevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };
  
  // If no verses, show message
  if (verses.length === 0) {
    return <div className="text-center py-8 text-emerald-800">لا توجد آيات للعرض</div>;
  }
  
  return (
    <div className="quran-viewer">
      <div className="relative">
        {/* Book container with page turning effect */}
        <div className="book-container bg-amber-100 rounded-lg shadow-lg p-6 min-h-[400px] relative overflow-hidden border-2 border-amber-300">
          <div className="book-content text-right">
            {pages[currentPage]?.map((verse) => (
              <div key={verse.id} className="verse mb-4 px-4">
                <p className="text-xl leading-loose" style={{ fontFamily: 'UthmanicHafs, "Traditional Arabic", serif' }}>
                  {verse.text_uthmani} <span className="verse-number inline-block bg-amber-200 text-amber-800 w-8 h-8 rounded-full text-center leading-8 mr-2">{verse.verse_number}</span>
                </p>
                {verse.translations?.[0] && (
                  <p className="text-gray-600 mt-1 text-base">
                    {verse.translations[0].text}
                  </p>
                )}
              </div>
            ))}
          </div>
          
          {/* Page markers */}
          <div className="absolute bottom-4 left-0 right-0 flex justify-center">
            <div className="flex gap-2">
              {Array.from({ length: totalPages }).map((_, index) => (
                <button
                  key={index}
                  className={`w-3 h-3 rounded-full ${
                    index === currentPage ? 'bg-amber-600' : 'bg-amber-300'
                  }`}
                  onClick={() => setCurrentPage(index)}
                />
              ))}
            </div>
          </div>
        </div>
        
        {/* Navigation buttons */}
        <button
          onClick={goToPrevPage}
          disabled={currentPage === 0}
          className={`absolute left-2 top-1/2 transform -translate-y-1/2 bg-white rounded-full w-10 h-10 flex items-center justify-center shadow ${
            currentPage === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100'
          }`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
        <button
          onClick={goToNextPage}
          disabled={currentPage === totalPages - 1}
          className={`absolute right-2 top-1/2 transform -translate-y-1/2 bg-white rounded-full w-10 h-10 flex items-center justify-center shadow ${
            currentPage === totalPages - 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100'
          }`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default QuranViewerCl;