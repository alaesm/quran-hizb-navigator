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
          <img
            src="/logo.png"
            alt="شعار الجمعية"
            className="absolute  right-4 w-40 h-40"
          />
          <h1 className="text-3xl font-bold text-blue-600 dark:text-blue-300 mt-12">
            مرحبا بك في منصة مسار الأثمان
          </h1>
          <p className="text-lg text-gray-700 dark:text-gray-300 mt-2">
            اختر واستمع إلى الأثمان بسهولة مع ميزات البحث والتفاعل
          </p>
         
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
