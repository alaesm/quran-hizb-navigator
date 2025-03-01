// app/components/ClientComponent.tsx
"use client";

import { useSearchParams } from 'next/navigation';
import FlipBook from '../FlipBook';
import { ThumnSelector } from '../ThumnSelector';


export default function ClientComponent() {
  const searchParams = useSearchParams();
  const page = searchParams.get('page');

  const renderPage = () => {
    switch (page) {
      case 'flipBook':
        return <FlipBook />;
      case 'thumnSelector':
        return <ThumnSelector />;
      default:
        return <FlipBook />;
    }
  };

  return (
    <main className=''>
      {renderPage()}
    </main>
  );
}