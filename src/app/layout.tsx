import './globals.css';
import type { Metadata } from 'next';
import AppProviders from '@/components/AppProviders';

export const metadata: Metadata = {
  title: 'EstateFlow ERP',
  description: 'Real estate ERP and CRM frontend demo',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="en"><body><AppProviders>{children}</AppProviders></body></html>;
}
