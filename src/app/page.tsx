import HizbSelectorPage from '@/app/HizbSelectorPage'
import { Metadata } from 'next';
import HizbDisplayZaky from './HizbSelectorZaky';
import HizbRandomSelector from './HizbRandomSelector';

export const metadata: Metadata = {
  title: 'منصة مسار الأثمان: اختيار عشوائي لأثمان القرآن برواية ورش عن نافع من طريق الأزرق',
  description: 'قارئ قرآن تفاعلي مع ترجمات متعددة، تلاوات صوتية، وإمكانيات البحث. اقرأ واستمع إلى القرآن الكريم مع مختلف المقرئين.',
  keywords: 'قرآن, قارئ القرآن, إسلامي , تلاوات القرآن, ترجمات القرآن',
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
  }
};

export default function Home() {
  return (
    <main>
      {/* <HizbSelectorPage /> */}
      {/* <HizbDisplayZaky hizbNumber={1}/> */}
      <HizbRandomSelector/>
    </main>
  )
}