import { 
    findSurahAyahByAyahId,
 
  
    type AyahId,
   
} from "quran-meta";

const TOTAL_AYAHS = 6236; 
const TOTAL_HIZBS = 60;

export interface AyahInfo {
    surah: number;
    ayah: number;
    text?: string;
}

export interface HizbRange {
    number: number;
    start: AyahInfo;
    end: AyahInfo;
    ayahs: AyahInfo[];
}

export const getHizbAyahs = (hizbNumber: number): HizbRange => {
    if (hizbNumber < 1 || hizbNumber > TOTAL_HIZBS) {
        throw new Error('رقم الحزب يجب أن يكون بين 1 و 60');
    }

    let startAyahId: number;
    let endAyahId: number;

    // Calculate start and end ayah IDs
    if (hizbNumber === 1) {
        startAyahId = 1;
    } else {
        startAyahId = ((hizbNumber - 1) * (TOTAL_AYAHS / TOTAL_HIZBS)) + 1;
    }

    if (hizbNumber === TOTAL_HIZBS) {
        endAyahId = TOTAL_AYAHS;
    } else {
        endAyahId = (hizbNumber * (TOTAL_AYAHS / TOTAL_HIZBS));
    }

    startAyahId = Math.floor(startAyahId);
    endAyahId = Math.floor(endAyahId);

    const [startSurah, startAyah] = findSurahAyahByAyahId(startAyahId as AyahId);
    const [endSurah, endAyah] = findSurahAyahByAyahId(endAyahId as AyahId);

    const ayahs: AyahInfo[] = [];
    for (let ayahId = startAyahId; ayahId <= endAyahId; ayahId++) {
        const [surah, ayah] = findSurahAyahByAyahId(ayahId as AyahId);
        ayahs.push({ surah, ayah });
    }

    return {
        number: hizbNumber,
        start: { surah: startSurah, ayah: startAyah },
        end: { surah: endSurah, ayah: endAyah },
        ayahs
    };
};