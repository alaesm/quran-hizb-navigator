"use client";
import React, { useState } from 'react';
import { getHizbAyahs } from '../utils/quranSections';

export const QuranSection: React.FC = () => {
    const [currentHizb, setCurrentHizb] = useState(1);
    const hizbData = getHizbAyahs(currentHizb);

    return (
        <div className="container mx-auto p-4" dir="rtl">
            <div className="max-w-4xl mx-auto">
                <div className="bg-white rounded-lg shadow-lg p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-emerald-800">
                            الحزب {currentHizb}
                        </h2>
                        <div className="flex gap-4">
                            <button 
                                onClick={() => setCurrentHizb(prev => Math.max(1, prev - 1))}
                                className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                                disabled={currentHizb === 1}
                            >
                                السابق
                            </button>
                            <button 
                                onClick={() => setCurrentHizb(prev => Math.min(60, prev + 1))}
                                className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                                disabled={currentHizb === 60}
                            >
                                التالي
                            </button>
                        </div>
                    </div>

                    <div className="bg-emerald-50 p-4 rounded-lg mb-6">
                        <p className="text-lg mb-2">
                            <span className="font-bold text-emerald-800">بداية الحزب: </span>
                            سورة {hizbData.start.surah} - آية {hizbData.start.ayah}
                        </p>
                        <p className="text-lg">
                            <span className="font-bold text-emerald-800">نهاية الحزب: </span>
                            سورة {hizbData.end.surah} - آية {hizbData.end.ayah}
                        </p>
                    </div>

                    <div className="space-y-4">
                        <h3 className="text-xl font-bold text-emerald-800 mb-4">آيات الحزب:</h3>
                        <div className="bg-white border border-emerald-100 rounded-lg divide-y divide-emerald-100">
                            {hizbData.ayahs.map((ayah, index) => (
                                <div 
                                    key={index}
                                    className="p-4 hover:bg-emerald-50 transition-colors"
                                >
                                    <p className="text-right text-lg">
                                        <span className="font-bold text-emerald-700">
                                            {`سورة ${ayah.surah} - آية ${ayah.ayah}`}
                                        </span>
                                        {ayah.text && (
                                            <span className="mr-4 font-arabic">
                                                {ayah.text}
                                            </span>
                                        )}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};