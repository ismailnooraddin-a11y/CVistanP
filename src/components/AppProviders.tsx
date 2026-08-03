'use client';

import DemoProvider from './DemoProvider';
import ToastProvider from './ToastProvider';

export default function AppProviders({ children }: { children: React.ReactNode }) {
  return <DemoProvider><ToastProvider>{children}</ToastProvider></DemoProvider>;
}
