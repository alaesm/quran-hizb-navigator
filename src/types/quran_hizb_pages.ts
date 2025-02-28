
const hizbData = [
    { hizb: 1, startPage: 1 }, { hizb: 2, startPage: 11 }, { hizb: 3, startPage: 22 }, 
    { hizb: 4, startPage: 32 }, { hizb: 5, startPage: 42 }, { hizb: 6, startPage: 51 }, 
    { hizb: 7, startPage: 62 }, { hizb: 8, startPage: 71 }, { hizb: 9, startPage: 82 }, 
    { hizb: 10, startPage: 92 }, { hizb: 11, startPage: 102 }, { hizb: 12, startPage: 111 }, 
    { hizb: 13, startPage: 121 }, { hizb: 14, startPage: 132 }, { hizb: 15, startPage: 142 }, 
    { hizb: 16, startPage: 151 }, { hizb: 17, startPage: 162 }, { hizb: 18, startPage: 173 }, 
    { hizb: 19, startPage: 182 }, { hizb: 20, startPage: 192 }, { hizb: 21, startPage: 201 }, 
    { hizb: 22, startPage: 212 }, { hizb: 23, startPage: 222 }, { hizb: 24, startPage: 231 }, 
    { hizb: 25, startPage: 242 }, { hizb: 26, startPage: 252 }, { hizb: 27, startPage: 262 }, 
    { hizb: 28, startPage: 272 }, { hizb: 29, startPage: 282 }, { hizb: 30, startPage: 292 }, 
    { hizb: 31, startPage: 302 }, { hizb: 32, startPage: 312 }, { hizb: 33, startPage: 322 }, 
    { hizb: 34, startPage: 332 }, { hizb: 35, startPage: 342 }, { hizb: 36, startPage: 352 }, 
    { hizb: 37, startPage: 362 }, { hizb: 38, startPage: 371 }, { hizb: 39, startPage: 382 }, 
    { hizb: 40, startPage: 392 }, { hizb: 41, startPage: 402 }, { hizb: 42, startPage: 413 }, 
    { hizb: 43, startPage: 422 }, { hizb: 44, startPage: 431 }, { hizb: 45, startPage: 442 }, 
    { hizb: 46, startPage: 451 }, { hizb: 47, startPage: 462 }, { hizb: 48, startPage: 472 }, 
    { hizb: 49, startPage: 482 }, { hizb: 50, startPage: 491 }, { hizb: 51, startPage: 502 }, 
    { hizb: 52, startPage: 513 }, { hizb: 53, startPage: 522 }, { hizb: 54, startPage: 531 }, 
    { hizb: 55, startPage: 542 }, { hizb: 56, startPage: 553 }, { hizb: 57, startPage: 562 }, 
    { hizb: 58, startPage: 572 }, { hizb: 59, startPage: 582 }, { hizb: 60, startPage: 591 }
  ];


  export function getHizbPages(hizbNumber) {
    const hizb = hizbData.find(h => h.hizb === hizbNumber);
    const nextHizb = hizbData.find(h => h.hizb === hizbNumber + 1);

    if (!hizb) {
        console.log("❌ حزب غير موجود:", hizbNumber);
        return null;
    }

    const startPage = hizb.startPage;
    const endPage = nextHizb ? nextHizb.startPage - 1 : 604; // 600 آخر صفحة في المصحف

    const pages = [];
    for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
    }

    return { startPage, endPage, pages };
}

export function getQuarterPages(hizbNumber, eighthNumber) {
    const hizbInfo = getHizbPages(hizbNumber);
    if (!hizbInfo) {
        console.log("❌ حزب غير موجود:", hizbNumber);
        return null;
    }

    if (eighthNumber < 1 || eighthNumber > 8) {
        console.log("❌ رقم الثمن غير صحيح:", eighthNumber);
        return null;
    }

    const { startPage, endPage } = hizbInfo;
    const hizbPagesCount = endPage - startPage + 1; // عدد صفحات الحزب
    const quarterSize = hizbPagesCount / 4; // عدد الصفحات لكل ربع

    // تحديد بداية كل ربع
    const quarterPages = [
        startPage,
        startPage + Math.floor(quarterSize),
        startPage + Math.floor(quarterSize * 2),
        startPage + Math.floor(quarterSize * 3),
        endPage + 1
    ];

    // تحديد الربع الذي يحتوي على الثمن المحدد
    const quarterIndex = Math.floor((eighthNumber - 1) / 2);
    const quarterStartPage = quarterPages[quarterIndex];
    const quarterEndPage = quarterPages[quarterIndex + 1] - 1; // آخر صفحة في الربع

    // إنشاء مصفوفة تحتوي على جميع الصفحات من بداية الربع إلى نهايته
    const pages = [];
    for (let i = quarterStartPage; i <= quarterEndPage; i++) {
        pages.push(i);
    }

    return { quarterStartPage, quarterEndPage, pages };
}




export function getEighthStartPage(hizbNumber: number, eighthNumber: number): number | null {
    const hizb = hizbData.find(h => h.hizb === hizbNumber);
    if (!hizb) {
        console.error("❌ حزب غير موجود:", hizbNumber);
        return null;
    }

    if (eighthNumber < 1 || eighthNumber > 8) {
        console.error("❌ رقم الثمن غير صحيح:", eighthNumber);
        return null;
    }
     
    console.log("📖 حزب:", hizbNumber, "الثمن:", eighthNumber, hizb.startPage + (eighthNumber - 1) * 2);
    return hizb.startPage + (eighthNumber - 1) * 2;
}


