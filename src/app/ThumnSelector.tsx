"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Book } from "lucide-react"; // استيراد الأيقونات
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const ThumnSelector = () => {
  const router = useRouter();
  const [selectedHizbRange, setSelectedHizbRange] = useState<[number, number]>([1, 60]);
  const [lastSelectedThumn, setLastSelectedThumn] = useState<number | null>(null);
  const [currentThumn, setCurrentThumn] = useState<number | null>(null);
  const [startHizb, setStartHizb] = useState<number>(1);
  const [endHizb, setEndHizb] = useState<number>(60);
  const [selectedThumns, setSelectedThumns] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleRangeChange = useCallback((start: number, end: number) => {
    if (start > 0 && end <= 60 && start <= end) {
      setSelectedHizbRange([start, end]);
      setStartHizb(start);
      setEndHizb(end);
    }
  }, []);

  const selectRandomThumn = useCallback(() => {
    setIsLoading(true); 
    
  
    setTimeout(() => {
      const [start, end] = selectedHizbRange;
      const range = end - start + 1;
      
 
      const sections: { start: number; end: number }[] = [];
      
      if (range === 60) {
     
        for (let i = start; i <= end; i += 10) {
          sections.push({ start: i, end: Math.min(i + 9, end) });
        }
      } else if (range >= 10) {
       
        sections.push(
          { start, end: start + 4 },
          { start: start + 5, end }
        );
      } else {
       
        sections.push({ start, end });
      }

      
      const randomSectionIndex = Math.floor(Math.random() * sections.length);
      const selectedSection = sections[randomSectionIndex];

     
      const availableThumns: number[] = [];
      for (let hizb = selectedSection.start; hizb <= selectedSection.end; hizb++) {
        for (let thumn = 1; thumn <= 8; thumn++) {
          const thumnNumber = (hizb - 1) * 8 + thumn;
          if (!selectedThumns.includes(thumnNumber) && thumnNumber !== lastSelectedThumn) {
            availableThumns.push(thumnNumber);
          }
        }
      }

      if (availableThumns.length === 0) {
       
        setSelectedThumns([]);
        setIsLoading(false); 
        return;
      }

     
      const randomThumnIndex = Math.floor(Math.random() * availableThumns.length);
      const newThumn = availableThumns[randomThumnIndex];

      setLastSelectedThumn(currentThumn);
      setCurrentThumn(newThumn);
      setSelectedThumns(prev => [...prev, newThumn]);
      setIsLoading(false); 
    }, 500); 
  }, [selectedHizbRange, lastSelectedThumn, currentThumn, selectedThumns]);

  
  const handleViewVerses = useCallback((hizbNumber: number, thumnNumber: number) => {
    router.push(`/quran-reader?hizb=${hizbNumber}&thumn=${thumnNumber}`);
  }, [router]);

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="sm"
        className="absolute top-4 right-4 bg-gray-300"
        onClick={() => router.back()}
      >
        <ArrowRight className="h-4 w-4 ml-2" />
        رجوع
      </Button>

      <Card className="w-full max-w-2xl mx-auto mt-8">
        <CardHeader>
          <CardTitle className="text-center">اختيار الأثمان العشوائي</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col gap-4">
            <div className="flex gap-4 items-center justify-center">
              <div>
                <Label htmlFor="startHizb">من الحزب</Label>
                <Input
                  id="startHizb"
                  type="number"
                  min={1}
                  max={60}
                  value={startHizb}
                  onChange={(e) => {
                    const value = parseInt(e.target.value);
                    handleRangeChange(value, endHizb);
                  }}
                  className="w-24 text-center"
                />
              </div>
              <div>
                <Label htmlFor="endHizb">إلى الحزب</Label>
                <Input
                  id="endHizb"
                  type="number"
                  min={1}
                  max={60}
                  value={endHizb}
                  onChange={(e) => {
                    const value = parseInt(e.target.value);
                    handleRangeChange(startHizb, value);
                  }}
                  className="w-24 text-center"
                />
              </div>
            </div>
          </div>

          <Button 
            onClick={selectRandomThumn}
            className="w-full"
            size="lg"
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>جاري الاختيار...</span>
              </div>
            ) : (
              "اختيار ثُمن عشوائي"
            )}
          </Button>

          {isLoading ? (
            <div className="text-center p-6 border rounded-lg">
              <div className="flex flex-col items-center gap-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                <p className="text-muted-foreground">جاري اختيار الثمن...</p>
              </div>
            </div>
          ) : currentThumn && (
            <div className="text-center p-6 border rounded-lg">
              <h3 className="text-xl mb-2">الثمن المختار:</h3>
              <p className="text-3xl font-bold">
                الحزب {Math.ceil(currentThumn / 8)} - الثمن {currentThumn % 8 || 8}
              </p>
              <p className="text-sm mt-2 text-muted-foreground">
                {selectedHizbRange[1] - selectedHizbRange[0] + 1 === 60 
                  ? `يتم الاختيار من الأحزاب ${Math.ceil(currentThumn / 8 / 10) * 10 - 9} إلى ${Math.min(Math.ceil(currentThumn / 8 / 10) * 10, 60)}`
                  : selectedHizbRange[1] - selectedHizbRange[0] + 1 >= 10
                  ? `يتم الاختيار من الأحزاب ${Math.ceil(currentThumn / 8 / 5) * 5 - 4} إلى ${Math.min(Math.ceil(currentThumn / 8 / 5) * 5, selectedHizbRange[1])}`
                  : 'يتم الاختيار من النطاق المحدد'}
              </p>
              
           
              <Button
                className="mt-4"
                onClick={() => handleViewVerses(
                  Math.ceil(currentThumn / 8),
                  currentThumn % 8 || 8
                )}
              >
                <Book className="h-4 w-4 ml-2" />
                عرض آيات الثمن
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};