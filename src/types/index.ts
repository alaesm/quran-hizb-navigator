export type AyahId = number;

export interface Verse {
  id: number;
  verse_key: string;
  text_uthmani: string;
  verse_number: number;
  juz_number: number;
  hizb_number: number;
  rub_number: number;
  page_number: number;
  translations?: {
    id: number;
    text: string;
    language_name: string;
  }[];
  words?: {
    id: number;
    position: number;
    text_uthmani: string;
    verse_key: string;
    line_number: number;
    page_number: number;
    code_v1: string;
    code_v2: string;
  }[];
}