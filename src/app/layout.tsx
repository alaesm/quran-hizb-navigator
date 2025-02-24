import type { Metadata } from 'next';
import { Cairo } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from 'next-themes';

const cairo = Cairo({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'منصة مسار الأثمان: اختيار عشوائي لأثمان القرآن برواية ورش عن نافع من طريق الأزرق',
  description: 'قارئ قرآن تفاعلي مع ترجمات متعددة، تلاوات صوتية، وإمكانيات البحث. اقرأ واستمع إلى القرآن الكريم مع مختلف المقرئين.',
  keywords: 'قرآن, قارئ القرآن, إسلامي, تلاوات القرآن, ترجمات القرآن',
  openGraph: {
    title: 'منصة مسار الأثمان: اختيار عشوائي لأثمان القرآن برواية ورش عن نافع من طريق الأزرق',
    description: 'قارئ قرآن تفاعلي مع ترجمات وتلاوات صوتية',
    type: 'website',
    locale: 'ar',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'منصة مسار الأثمان: اختيار عشوائي لأثمان القرآن برواية ورش عن نافع من طريق الأزرق',
    description: 'قارئ قرآن تفاعلي مع ترجمات وتلاوات صوتية',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <body className={`text-right ${cairo.className} antialiased`}>
      <header className="bg-gradient-to-r from-emerald-600 to-emerald-900 text-white p-4 shadow-md">
  <div className="container mx-auto flex flex-col sm:flex-row items-center justify-between">
    <div className="flex items-center mb-4 sm:mb-0">
      <span className="text-lg font-semibold">منصة المسابقة القرآنية</span>
    </div>
  </div>
</header>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
