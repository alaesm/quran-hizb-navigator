"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import {  Book } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const ThumnSelector = () => {
  const router = useRouter();
  const [selectedHizbRange, setSelectedHizbRange] = useState<[number, number]>([1, 60]);
  const [currentThumn, setCurrentThumn] = useState<number | null>(null);
  const [startHizb, setStartHizb] = useState<number>(1);
  const [endHizb, setEndHizb] = useState<number>(60);
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
      const randomHizb = Math.floor(Math.random() * (end - start + 1)) + start;
      const randomThumn = Math.floor(Math.random() * 8) + 1;
      setCurrentThumn((randomHizb - 1) * 8 + randomThumn);
      setIsLoading(false);
    }, 700);
  }, [selectedHizbRange]);

  const handleViewVerses = useCallback(() => {
    if (currentThumn) {
      router.push(`/quran-reader?hizb=${Math.ceil(currentThumn / 8)}&thumn=${currentThumn % 8 || 8}`);
    }
  }, [router, currentThumn]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6">
      <Card className="w-full max-w-2xl bg-white shadow-lg rounded-2xl p-6">
        <CardHeader>
          <CardTitle className="text-center text-gray-800 text-2xl font-semibold">اختيار الأثمان العشوائي</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex justify-center gap-4">
            <div>
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
            <div>
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

          <Button 
            onClick={selectRandomThumn}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-lg shadow-md transition duration-300"
            size="lg"
            disabled={isLoading}
          >
            {isLoading ? "جاري الاختيار..." : "اختيار ثُمن عشوائي"}
          </Button>

          {currentThumn && (
            <div className="text-center p-6 border rounded-lg shadow-sm bg-gray-50">
              <h3 className="text-xl font-medium text-gray-800">الثمن المختار:</h3>
              <p className="text-3xl font-bold text-blue-600">الحزب {Math.ceil(currentThumn / 8)} - الثمن {currentThumn % 8 || 8}</p>
              <Button
                className="mt-4 bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg transition duration-300"
                onClick={handleViewVerses}
              >
                <Book className="h-4 w-4 ml-2" /> عرض آيات الثمن
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
