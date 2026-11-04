import type { Metadata } from "next";
import { Figtree, Geist, Stack_Sans_Headline } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const figtree = Figtree({
  variable: "--font-figtree",
  subsets: ["latin"],
});

const stackHeadline = Stack_Sans_Headline({
  variable: "--font-stack-headline",
  subsets: ["latin"],
  // next/font has no metric overrides for this family, so name the fallback explicitly.
  adjustFontFallback: false,
  fallback: ["Arial", "sans-serif"],
});

export const metadata: Metadata = {
  title: "Vajiram & Ravi",
  description: "UPSC preparation with Vajiram & Ravi",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${stackHeadline.variable} ${figtree.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
