import Page from "@/app/page"; 
import type { Metadata } from "next";
import { Cairo } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "next-themes";

import Sidebar from "@/components/Sidebar";

const cairo = Cairo({ subsets: ["latin"] });

export const metadata: Metadata = {
  title:
    "منصة مسار الأثمان: اختيار عشوائي لأثمان القرآن برواية ورش عن نافع من طريق الأزرق",
  description:
    "قارئ قرآن تفاعلي مع ترجمات متعددة، تلاوات صوتية، وإمكانيات البحث. اقرأ واستمع إلى القرآن الكريم مع مختلف المقرئين.",
  keywords: "قرآن, قارئ القرآن, إسلامي, تلاوات القرآن, ترجمات القرآن",
  openGraph: {
    title:
      "منصة مسار الأثمان: اختيار عشوائي لأثمان القرآن برواية ورش عن نافع من طريق الأزرق",
    description: "قارئ قرآن تفاعلي مع ترجمات وتلاوات صوتية",
    type: "website",
    locale: "ar",
  },
  twitter: {
    card: "summary_large_image",
    title:
      "منصة مسار الأثمان: اختيار عشوائي لأثمان القرآن برواية ورش عن نافع من طريق الأزرق",
    description: "قارئ قرآن تفاعلي مع ترجمات وتلاوات صوتية",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <body
        className={`text-right bg-gray-100 dark:bg-gray-900 ${cairo.className} antialiased`}
      >
        <div className="flex min-h-screen">
          {/* الشريط الجانبي */}
          
          <div className="flex-1 flex flex-col">
            {/* الهيدر مع الشعار */}
           
            <header className="bg-white dark:bg-gray-800 shadow-md py-3 px-4 flex items-center gap-4">
             
           
              <img
                src="/logo.png"
                alt="شعار الجمعية"
                className="w-16 h-16 object-contain rounded-lg border border-gray-200 dark:border-gray-600"
              />
              <div>
                <h1 className="text-lg font-semibold text-gray-800 dark:text-gray-100 leading-tight">
                  منصة مسار الأثمان
                </h1>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5 leading-relaxed">
                  اختيار عشوائي لأثمان القرآن برواية ورش عن نافع
                </p>
              </div>

              <div className="flex-col justify-end"  >
                <Sidebar/>
              </div>
             
             
            </header>
            {/* المحتوى */}
            <main className="p-6 flex-1">{children}</main>
          </div>
        </div>

        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
