import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Cvistan — Build Your Professional CV',
  description: 'Create a stunning professional CV in minutes. Free, mobile-friendly, and no sign-up required.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://cvistan.com'),
  openGraph: {
    title: 'Cvistan — Build Your Professional CV',
    description: 'Create a stunning professional CV in minutes. Free, mobile-friendly, and no sign-up required.',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
      </head>
      <body className="bg-surface-50 text-surface-900 antialiased">
        {children}
      </body>
    </html>
  );
}
