// hooks/useQuranVerses.ts
import { useState, useEffect } from 'react';

interface ApiResponse {
    verses: Verse[];
    pagination: Pagination;
  }
export interface Verse {
  id: number;
  verse_key: string;
  text_uthmani: string;
  chapter_id: number;
  verse_number: number;
  hizb_number: number;
  juz_number: number;
  sajdah_type: string | null;
  page_number: number;
  translations?: Array<{
    id: number;
    text: string;
    resource_name: string;
  }>;
  words?: Array<{
    text_uthmani: string;
    translation: { text: string };
    transliteration: { text: string };
  }>;
}

interface Pagination {
  current_page: number;
  next_page: number | null;
  total_pages: number;
  total_records: number;
}

interface ApiResponse {
    verses: Verse[];
    pagination: Pagination;
  }

interface ApiParams {
  language?: string;
  words?: boolean;
  translations?: string;
  audio?: number;
  page?: number;
  per_page?: number;
}

const API_BASE_URL = 'https://api.quran.com/api/v4';

const useApiFetch = <T,>(url: string, params: ApiParams = {}) => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const queryObject: Record<string, string> = {
            words: params.words ? 'true' : 'false',
            page: params.page?.toString() || '1',
            per_page: params.per_page?.toString() || '10'
          };
  
          // Add optional parameters with proper type conversion
          if (params.language) queryObject.language = params.language;
          if (params.translations) queryObject.translations = params.translations;
          if (params.audio) queryObject.audio = params.audio.toString();
  
          const queryParams = new URLSearchParams(queryObject).toString();
  
          const response = await fetch(`${API_BASE_URL}${url}?${queryParams}`, {
            headers: { 'Accept': 'application/json' }
          });

        if (!response.ok) throw new Error(`API Error: ${response.status}`);
        
        const jsonData: T = await response.json();
        setData(jsonData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [url, params]);

  return { data, loading, error };
};

// Hizb Range Hook
// hooks/useQuranVerses.ts (corrected)
export const useHizbRange = (min: number, max: number, params?: ApiParams) => {
    const [verses, setVerses] = useState<Verse[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
  
    useEffect(() => {
      const fetchRange = async () => {
        try {
          setLoading(true);
          setError(null);
          
          const hizbs = Array.from({ length: max - min + 1 }, (_, i) => min + i);
          const responses = await Promise.all(
            hizbs.map(async (hizb) => {
              const queryObject: Record<string, string> = {
                words: params?.words ? 'true' : 'false',
                page: params?.page?.toString() || '1',
                per_page: params?.per_page?.toString() || '50',
                language: params?.language || 'en'
              };
  
              const queryParams = new URLSearchParams(queryObject).toString();
              const response = await fetch(
                `${API_BASE_URL}/verses/by_hizb/${hizb}?${queryParams}`,
                { headers: { 'Accept': 'application/json' } }
              );
              return response.json();
            })
          );
  
          const allVerses = responses.flatMap((res: ApiResponse) => res.verses);
          setVerses(allVerses);
        } catch (err) {
          setError(err instanceof Error ? err.message : 'Failed to fetch range');
        } finally {
          setLoading(false);
        }
      };
  
      fetchRange();
    }, [min, max, params]);
  
    return { verses, loading, error };
  };

// Other Hooks
export const useChapterVerses = (chapter: number, params?: ApiParams) => 
  useApiFetch<ApiResponse>(`/verses/by_chapter/${chapter}`, params);

export const usePageVerses = (page: number, params?: ApiParams) => 
  useApiFetch<ApiResponse>(`/verses/by_page/${page}`, params);

export const useJuzVerses = (juz: number, params?: ApiParams) => 
  useApiFetch<ApiResponse>(`/verses/by_juz/${juz}`, params);

export const useRubVerses = (rub: number, params?: ApiParams) => 
  useApiFetch<ApiResponse>(`/verses/by_rub/${rub}`, params);

export const useVerseByKey = (key: string, params?: ApiParams) => 
  useApiFetch<{ verse: Verse }>(`/verses/by_key/${key}`, params);