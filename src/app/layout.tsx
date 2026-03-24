import type { Metadata } from "next";

import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { APP_NAME } from "@/lib/constants";

import "./globals.css";
import "./theme.css";

export const metadata: Metadata = {
  metadataBase: new URL("http://localhost:3000"),
  title: {
    default: `${APP_NAME} | Premium second-hand marketplace`,
    template: `%s | ${APP_NAME}`,
  },
  description:
    "Buy and sell second-hand goods with better trust signals, cleaner listings, modern search, and safer local trade.",
  openGraph: {
    title: APP_NAME,
    description:
      "Premium second-hand marketplace with moderation, messaging, favorites, and modern seller tools.",
    type: "website",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="min-h-screen text-stone-900 antialiased">
        <SiteHeader />
        <main>{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
