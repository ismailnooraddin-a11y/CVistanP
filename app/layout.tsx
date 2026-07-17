import type { Metadata, Viewport } from "next";
import "./globals.css";
import { WorkspaceProvider } from "@/store/workspace-store";
import { ToastProvider } from "@/components/ui";

export const metadata: Metadata = {
  title: { default: "EstateFlow Pro", template: "%s · EstateFlow Pro" },
  description: "A complete multi-tenant real estate operating system for modern agencies.",
  applicationName: "EstateFlow Pro",
  manifest: "/manifest.webmanifest",
  icons: { icon: "/icon.svg" }
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f6f7fb" },
    { media: "(prefers-color-scheme: dark)", color: "#11131a" }
  ]
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en" suppressHydrationWarning><body><WorkspaceProvider><ToastProvider>{children}</ToastProvider></WorkspaceProvider></body></html>;
}
