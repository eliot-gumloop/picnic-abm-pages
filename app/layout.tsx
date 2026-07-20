import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "@/styles/picnic.css";

export const metadata: Metadata = {
  title: "All your tools. One basket. · Gumloop",
  description: "Gumloop picnic basket ABM landing page",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${GeistSans.variable} ${GeistMono.variable}`}
    >
      {/* Gellix files not in repo yet — headings use Geist Medium until brand font ships */}
      <body className={GeistSans.className}>{children}</body>
    </html>
  );
}
