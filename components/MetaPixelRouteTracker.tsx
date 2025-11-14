'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

/**
 * MetaPixelRouteTracker
 * 
 * Tracks PageView events on route changes in Next.js App Router (SPA navigation).
 * Since Next.js is a single-page app, the initial pixel only fires on first load.
 * This component fires PageView on every route change.
 */
export default function MetaPixelRouteTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Track PageView on route change
    if (typeof window !== 'undefined' && window.fbq) {
      window.fbq('track', 'PageView');
      
      // Optional: Log for debugging
      if (process.env.NODE_ENV === 'development') {
        console.log('Meta Pixel: PageView tracked for', pathname);
      }
    }
  }, [pathname, searchParams]);

  return null;
}
