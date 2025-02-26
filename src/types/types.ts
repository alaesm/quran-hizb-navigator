// types.ts
export type AyahId = number;

export interface Verse {
  id: number;
  chapter_id: number;
  verse_number: number;
  verse_key: string;
  text_uthmani: string;
  image_url: string;
  v1_page: number;
  // Add other fields as needed
}

export interface ApiResponse {
  verses: Verse[];
  pagination: {
    per_page: number;
    current_page: number;
    next_page: number | null;
    total_pages: number;
    total_records: number;
  };
}

export interface Category {
  name: string;
  minHizb: number;
  maxHizb: number;
}