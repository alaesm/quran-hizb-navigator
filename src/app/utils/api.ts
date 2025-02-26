// api.ts

import { ApiResponse } from "@/types/types";

export const fetchVersesByRub = async (rubNumber: number): Promise<ApiResponse> => {
  const response = await fetch(
    `https://api.quran.com/api/v4/verses/by_rub/${rubNumber}?words=false`,
    {
      headers: { Accept: "application/json" },
    }
  );
  if (!response.ok) {
    throw new Error(`Failed to fetch verses for Rub ${rubNumber}`);
  }
  return response.json();
};