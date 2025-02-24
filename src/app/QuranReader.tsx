"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { Tabs, TabsContent } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Surah, Translation, Verse } from "@/types/quran";
import { qariOptions } from "@/types/qariOptions";
import { ModeToggle } from "@/components/ModeToggle";
import debounce from "lodash.debounce";
import React from "react";

const EnhancedQuranReader = () => {
  const [surahs, setSurahs] = useState<Surah[]>([]);
  const [currentSurah, setCurrentSurah] = useState<Surah | null>(null);
  const [verses, setVerses] = useState<Verse | null>(null);
  const [translation, setTranslation] = useState<Translation | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");

  const [currentPage, setCurrentPage] = useState<number>(1);
 
  const [showSideNav, setShowSideNav] = useState<boolean>(false);
  const [qari, setQari] = useState<string>("ar.alafasy");
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const versesPerPage = 10;

  const fetchSurahs = useCallback(async () => {
    try {
      const res = await fetch("/api/surahs");
      if (!res.ok) throw new Error("Failed to fetch surahs");
      const data = await res.json();
      setSurahs(data);
      setCurrentSurah(data[0]);
    } catch (err) {
      console.error("Error fetching surahs:", err);
    }
  }, []);

  const fetchVerses = useCallback(async (surahIndex: string) => {
    try {
      setIsLoading(true);
      const [versesRes, translationRes] = await Promise.all([
        fetch(`/api/surah/${surahIndex}`),
        fetch(`/api/translation/ar/${surahIndex}`),
      ]);

      if (!versesRes.ok || !translationRes.ok) {
        throw new Error("Failed to fetch data");
      }

      const [versesData, translationData] = await Promise.all([
        versesRes.json(),
        translationRes.json(),
      ]);

      setVerses(versesData.verse);
      setTranslation(translationData);
    } catch (err) {
      console.error("Error fetching verses:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSurahs();
  }, [fetchSurahs]);

  useEffect(() => {
    if (currentSurah) {
      fetchVerses(currentSurah.index);
      setCurrentPage(1);
    }
  }, [currentSurah, fetchVerses]);

  const handleSurahChange = (index: string) => {
    const surah = surahs.find((s) => s.index === index);
    if (surah) setCurrentSurah(surah);
    setShowSideNav(false);
  };

  const debouncedSearchTerm = useMemo(
    () => debounce((term) => setSearchTerm(term), 300),
    []
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    debouncedSearchTerm(e.target.value);
  };

  const filteredVerses = useMemo(() => {
    return verses
      ? Object.entries(verses).filter(
          ([key, verse]) =>
            verse.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (translation &&
              translation.verse[key]
                ?.toLowerCase()
                .includes(searchTerm.toLowerCase()))
        )
      : [];
  }, [verses, translation, searchTerm]);

  const paginatedVerses = useMemo(() => {
    return filteredVerses.slice(
      (currentPage - 1) * versesPerPage,
      currentPage * versesPerPage
    );
  }, [filteredVerses, currentPage, versesPerPage]);

  const totalPages = useMemo(() => {
    return Math.ceil(filteredVerses.length / versesPerPage);
  }, [filteredVerses.length, versesPerPage]);



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

  const SurahView = ({
    paginatedVerses,
  }: {
    paginatedVerses: [string, string][];
  }) => {
    return (
      <div className="flex justify-center">
        <div className="max-w-3xl w-full">
          <p
            className="leading-relaxed arabic-text text-center"
            style={{
              fontSize: `32px`,
              lineHeight: "3rem",
              direction: "rtl",
              wordSpacing: "0.2rem",
              fontFamily: "Warsh, 'Noto Naskh Arabic', serif",
              padding: "2rem",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            {paginatedVerses.map(([key, verse],) => (
              <span
                key={key}
                className="block mb-6 text-center w-full"
                style={{
                  position: "relative",
                }}
              >
                {verse}
                <span className="ayah-number mx-1 inline-block">
                  <AyahNumber number={parseInt(key.split("_")[1])} />
                </span>
              </span>
            ))}
          </p>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto p-4 flex gap-4">
        {showSideNav && (
          <div className="block flex-grow w-1/2 lg:w-1/4 pr-4">
            <ScrollArea className="h-[calc(100vh-2rem)]">
              <div className="space-y-2">
                {surahs.map((surah) => (
                  <Button
                    key={surah.index}
                    variant={
                      currentSurah?.index === surah.index
                        ? "secondary"
                        : "ghost"
                    }
                    className="w-full justify-start"
                    onClick={() => handleSurahChange(surah.index)}
                  >
                    {surah.index}. {surah.title} ({surah.titleAr})
                  </Button>
                ))}
              </div>
            </ScrollArea>
          </div>
        )}
        <Button
          variant="outline"
          size="icon"
          onClick={() => setShowSideNav(!showSideNav)}
          aria-label={showSideNav ? "Hide sidebar" : "Show sidebar"}
        >
          {showSideNav ? <ChevronRight /> : <ChevronLeft />}
        </Button>

        <Button
    variant="outline"
    onClick={() => window.location.href = '/thumn-selector'}
    className="whitespace-nowrap"
  >
    اختيار الأثمان
  </Button>
        <div className={`${showSideNav ? "w-3/4 hidden" : "w-full"} flex-grow`}>
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold">قارئ القرآن الكريم</h1>
            <ModeToggle />
          </div>
          <div className="flex gap-4 mb-4">
            <Input
              type="text"
              placeholder="بحث ايات..."
              onChange={handleSearchChange}
              className="flex-grow"
              aria-label="Search verses"
            />
            <Select value={qari} onValueChange={setQari}>
              <SelectTrigger aria-label="Select reciter">
                <SelectValue placeholder="اختر القارئ" />
              </SelectTrigger>
              <SelectContent>
                {qariOptions.map((option) => (
                  <SelectItem key={option.identifier} value={option.identifier}>
                    {option.name} | {option.language}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <span className="ml-4">جاري التحميل...</span>
            </div>
          ) : currentSurah && verses && translation ? (
            <Card>
              <CardHeader>
                <CardTitle className="flex flex-col items-center text-center">
                  <h2 className="flex flex-col items-center gap-4 mb-2">
                    <span
                      className="text-4xl font-warsh block mb-4 relative"
                      style={{
                        fontFamily: "Warsh, 'Noto Naskh Arabic', serif",
                        lineHeight: "1.8",
                        textAlign: "center",
                        padding: "0 2rem",
                        position: "relative",
                        display: "inline-block",
                      }}
                    >
                      {currentSurah.titleAr}
                    </span>
                  </h2>
                
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="verses">
                  <TabsContent value="verses">
                    <SurahView paginatedVerses={paginatedVerses} />

                    <div className="flex justify-between mt-4">
                      <Button
                        disabled={currentPage === totalPages}
                        onClick={() => setCurrentPage((p) => p + 1)}
                        aria-label="Next page"
                      >
                        التالي
                      </Button>
                      <span>
                        الصفحة {currentPage} من {totalPages}
                      </span>
                      <Button
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage((p) => p - 1)}
                        aria-label="Previous page"
                      >
                        السابق
                      </Button>
                    </div>
                  </TabsContent>
                  <TabsContent value="info">
                    <p>
                      <strong>مكان النزول:</strong> {currentSurah.place}
                    </p>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          ) : (
            <p>لا توجد بيانات لعرضها.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default React.memo(EnhancedQuranReader);
