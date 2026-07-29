import './globals.css';
import type { Metadata } from 'next';
export const metadata: Metadata = { title: 'EstateFlow ERP', description: 'Real estate ERP and CRM frontend' };
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en"><body>{children}</body></html>}
