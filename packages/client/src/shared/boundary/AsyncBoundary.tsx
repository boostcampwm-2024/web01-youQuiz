import { Suspense } from 'react';
import LoadingSpinner from '@/shared/assets/icons/loading-alt-loop.svg?react';

export default function AsyncBoundary({ children }: { children: React.ReactNode }) {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center w-screen h-screen">
          <LoadingSpinner className="animate-spin w-16 h-16 md:w-24 md:h-24 lg:w-32 lg:h-32" />
        </div>
      }
    >
      {children}
    </Suspense>
  );
}
