import type { Metadata } from "next";
import { Cairo } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "next-themes";
import HeaderWithSidebar from "@/components/ui/HeaderWithSidebar";

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
        {/* تصميم الصفحة متناسق مع الشعار */}
        <main className="relative max-w-4xl mb-4   flex flex-col items-center text-center">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center gap-3 min-h-[70px]">
              <img
                src="/logo.png"
                alt="شعار الجمعية"
                className="w-16 h-16 object-contain rounded-lg border border-gray-200 dark:border-gray-600"
              />
              <div className="flex-1">
                <h1 className="text-lg font-semibold text-gray-800 dark:text-gray-100 leading-tight">
                  منصة مسار الأثمان
                </h1>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5 leading-relaxed">
                  اختيار عشوائي لأثمان القرآن برواية ورش عن نافع
                </p>
              </div>
            </div>
         
        </main>

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
