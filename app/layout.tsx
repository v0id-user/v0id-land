import type { Metadata } from "next";
import { IBM_Plex_Sans_Arabic } from "next/font/google";
import "./globals.css";
import Cursor from "@/components/Cursor";
import { Toaster } from "react-hot-toast";
import BannerMessage from "@/components/BannerMessage";
import { Analytics } from "@vercel/analytics/react"

const ibmPlexSansArabic = IBM_Plex_Sans_Arabic({
  weight: ["100", "200", "300", "400", "500", "600", "700"],
  subsets: ["arabic"],
});

export const metadata: Metadata = {
  title: "#V0ID",
  description: "مساحتي الشخصية وموقعي للتعبير والكتابة ومشاركة أفكاري ومشاريعي وكذلك رحلتي وتجربتي الشخصية في العالم التقني.",
  openGraph: {
    title: "#V0ID",
    description: "مساحتي الشخصية وموقعي للتعبير والكتابة ومشاركة أفكاري ومشاريعي وكذلك رحلتي وتجربتي الشخصية في العالم التقني.",
    url: "https://v0id.me",
    siteName: "#V0ID",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${ibmPlexSansArabic.className} antialiased`}>
        {/* Global Analytics */}
        <Analytics />
        
        {/* Global Cursor */}
        <Cursor />

        {/* Global Toaster */}
        <Toaster
          position="top-center"
          reverseOrder={false}
        />
        {children}
        <BannerMessage />
      </body>
    </html>
  );
}