export type Surah = {
  place: string;
  type: string;
  count: number;
  title: string;
  titleAr: string;
  index: string;
  pages: string;
  juz: Array<{ index: string; verse: { start: string; end: string } }>;
  audio_ayat: number;
};

interface SurahViewProps {
  paginatedVerses: [string, string][]; 
  surahName: string; 
}

export interface Hizb {
  index: number;
  title: string;
  verses: Verse[];
}

export interface Verse {
  surah: number;
  ayah: number;
  text: string;
}

export type Translation = {
  index: number;
  verse: {
    [key: string]: string;
  };
  count: number;
};