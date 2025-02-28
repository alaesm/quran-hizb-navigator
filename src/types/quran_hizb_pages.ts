const hizbData = [
    { hizb: 1, startPage: 1 }, { hizb: 2, startPage: 11 }, { hizb: 3, startPage: 21 },
    { hizb: 4, startPage: 31 }, { hizb: 5, startPage: 41 }, { hizb: 6, startPage: 51 },
    { hizb: 7, startPage: 61 }, { hizb: 8, startPage: 71 }, { hizb: 9, startPage: 81 },
    { hizb: 10, startPage: 91 }, { hizb: 11, startPage: 101 }, { hizb: 12, startPage: 111 },
    { hizb: 13, startPage: 121 }, { hizb: 14, startPage: 131 }, { hizb: 15, startPage: 141 },
    { hizb: 16, startPage: 151 }, { hizb: 17, startPage: 161 }, { hizb: 18, startPage: 171 },
    { hizb: 19, startPage: 181 }, { hizb: 20, startPage: 191 }, { hizb: 21, startPage: 201 },
    { hizb: 22, startPage: 212 }, { hizb: 23, startPage: 221 }, { hizb: 24, startPage: 231 },
    { hizb: 25, startPage: 241 }, { hizb: 26, startPage: 251 }, { hizb: 27, startPage: 261 },
    { hizb: 28, startPage: 271 }, { hizb: 29, startPage: 281 }, { hizb: 30, startPage: 291 },
    { hizb: 31, startPage: 301 }, { hizb: 32, startPage: 311 }, { hizb: 33, startPage: 321 },
    { hizb: 34, startPage: 331 }, { hizb: 35, startPage: 341 }, { hizb: 36, startPage: 351 },
    { hizb: 37, startPage: 361 }, { hizb: 38, startPage: 371 }, { hizb: 39, startPage: 381 },
    { hizb: 40, startPage: 391 }, { hizb: 41, startPage: 401 }, { hizb: 42, startPage: 411 },
    { hizb: 43, startPage: 421 }, { hizb: 44, startPage: 431 }, { hizb: 45, startPage: 441 },
    { hizb: 46, startPage: 451 }, { hizb: 47, startPage: 461 }, { hizb: 48, startPage: 471 },
    { hizb: 49, startPage: 481 }, { hizb: 50, startPage: 491 }, { hizb: 51, startPage: 501 },
    { hizb: 52, startPage: 511 }, { hizb: 53, startPage: 521 }, { hizb: 54, startPage: 531 },
    { hizb: 55, startPage: 541 }, { hizb: 56, startPage: 551 }, { hizb: 57, startPage: 561 },
    { hizb: 58, startPage: 571 }, { hizb: 59, startPage: 581 }, { hizb: 60, startPage: 591 }
];

function getQuarterStartPages(hizbNumber) {
    const hizb = hizbData.find(h => h.hizb === hizbNumber);
    if (!hizb) {
        console.log("حزب غير موجود");
        return null;
    }
    
    const quarterPages = [
        hizb.startPage, 
        hizb.startPage + 5, 
        hizb.startPage + 10, 
        hizb.startPage + 15
    ];
    
    return quarterPages;
}

// مثال على الاستخدام
console.log(getQuarterStartPages(1)); // [1, 6, 11, 16]
console.log(getQuarterStartPages(5)); // [41, 46, 51, 56]
