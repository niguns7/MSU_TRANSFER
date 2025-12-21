import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';
import '@mantine/notifications/styles.css';
import './globals.css';
import { ColorSchemeScript, MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { theme } from './theme';
import Script from 'next/script';
import { Suspense } from 'react';
import MetaPixelRouteTracker from '@/components/MetaPixelRouteTracker';

export const metadata = {
  title: 'Transfer Advising Form - MSU Transfer',
  description: 'Complete your transfer advising application form',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <ColorSchemeScript />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body>
        {/* Meta Pixel Code - Moved to body for proper client-side execution */}
        <Script
          id="meta-pixel"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '5097950720430030');
              fbq('track', 'PageView');
            `,
          }}
        />
        
        {/* Noscript fallback - Moved to body so Next.js renders it */}
        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: 'none' }}
            src="https://www.facebook.com/tr?id=5097950720430030&ev=PageView&noscript=1"
            alt=""
          />
        </noscript>

        {/* Route change tracker for SPA navigation */}
        <Suspense fallback={null}>
          <MetaPixelRouteTracker />
        </Suspense>

        <MantineProvider theme={theme}>
          <Notifications position="top-right" />
          {children}
        </MantineProvider>
      </body>
    </html>
  );
}
