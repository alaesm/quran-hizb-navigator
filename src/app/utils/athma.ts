export type AyahId = number;

export const AthmanList: AyahId[] = [
  0, 1, 22, 39, 59, 75, 92, 110, 131, 149, 168, 186, 203, 221, 240, 259, 279,
  298, 316, 334, 352, 369, 387, 405, 424, 443, 462, 481, 500, 519, 538, 557,
  576, 596, 615, 634, 653, 672, 691, 710, 729, 748, 768, 787, 806, 825, 844,
  863, 882, 901, 920, 940, 959, 978, 997, 1016, 1035, 1054, 1073, 1092, 1111,
  1130, 1149, 1168, 1187, 1206, 1225, 1244, 1263, 1282, 1301, 1320, 1339, 1358,
  1377, 1396, 1415, 1434, 1453, 1472, 1491, 1510, 1529, 1548, 1567, 1586, 1605,
  1624, 1643, 1662, 1681, 1700, 1719, 1738, 1757, 1776, 1795, 1814, 1833, 1852,
  1871, 1890, 1909, 1928, 1947, 1966, 1985, 2004, 2023, 2042, 2061, 2080, 2099,
  2118, 2137, 2156, 2175, 2194, 2213, 2232, 2251, 2270, 2289, 2308, 2327, 2346,
  2365, 2384, 2403, 2422, 2441, 2460, 2479, 2498, 2517, 2536, 2555, 2574, 2593,
  2612, 2631, 2650, 2669, 2688, 2707, 2726, 2745, 2764, 2783, 2802, 2821, 2840,
  2859, 2878, 2897, 2916, 2935, 2954, 2973, 2992, 3011, 3030, 3049, 3068, 3087,
  3106, 3125, 3144, 3163, 3182, 3201, 3220, 3239, 3258, 3277, 3296, 3315, 3334,
  3353, 3372, 3391, 3410, 3429, 3448, 3467, 3486, 3505, 3524, 3543, 3562, 3581,
  3600, 3619, 3638, 3657, 3676, 3695, 3714, 3733, 3752, 3771, 3790, 3809, 3828,
  3847, 3866, 3885, 3904, 3923, 3942, 3961, 3980, 3999, 4018, 4037, 4056, 4075,
  4094, 4113, 4132, 4151, 4170, 4189, 4208, 4227, 4246, 4265, 4284, 4303, 4322,
  4341, 4360, 4379, 4398, 4417, 4436, 4455, 4474, 4493, 4512, 4531, 4550, 4569,
  4588, 4607, 4626, 4645, 4664, 4683, 4702, 4721, 4740, 4759, 4778, 4797, 4816,
  4835, 4854, 4873, 4892, 4911, 4930, 4949, 4968, 4987, 5006, 5025, 5044, 5063,
  5082, 5101, 5120, 5139, 5158, 5177, 5196, 5215, 5234, 5253, 5272, 5291, 5310,
  5329, 5348, 5367, 5386, 5405, 5424, 5443, 5462, 5481, 5500, 5519, 5538, 5557,
  5576, 5595, 5614, 5633, 5652, 5671, 5690, 5709, 5728, 5747, 5766, 5785, 5804,
  5823, 5842, 5861, 5880, 5899, 5918, 5937, 5956, 5975, 5994, 6013, 6032, 6051,
  6070, 6089, 6108, 6127, 6146, 6165, 6184, 6203, 6222, 6241
] as const;

export const getVerseKeyFromIndex = (index: number): string => {
  if (index < 0 || index >= AthmanList.length) {
    throw new Error("Invalid index");
  }
  const ayahId = AthmanList[index];
  
  // This is an approximation - for a production app, you would need
  // a more accurate mapping from ayahId to surah:ayah
  const surah = Math.floor(ayahId / 286) + 1;
  const ayah = (ayahId % 286) + 1;
  return `${surah}:${ayah}`;
};

// Calculate which Hizb and Thumn based on index
export const getHizbThumnFromIndex = (index: number): { hizb: number; thumn: number } => {
  const hizbNumber = Math.floor(index / 4) + 1;
  const thumnNumber = (index % 4) + 1;
  
  return {
    hizb: hizbNumber,
    thumn: thumnNumber
  };
};