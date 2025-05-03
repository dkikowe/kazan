import type { Metadata } from "next";
import { Geist, Geist_Mono, Manrope } from "next/font/google";
import "./globals.css";
import Footer from "@/widgets/footer";
import { headers } from "next/headers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin", "cyrillic"],
});

export const metadata: Metadata = {
  title: "Экскурсии по Казани | Официальный сайт экскурсий",
  description:
    "Увлекательные экскурсии по Казани с профессиональными гидами. Обзорные экскурсии, пешие прогулки, гастрономические туры и индивидуальные маршруты.",
  keywords:
    "экскурсии Казань, туры по Казани, гиды Казань, достопримечательности Казани, обзорные экскурсии",
  openGraph: {
    title: "Экскурсии по Казани | Официальный сайт экскурсий",
    description: "Увлекательные экскурсии по Казани с профессиональными гидами",
    type: "website",
    locale: "ru_RU",
    siteName: "Экскурсии по Казани",
  },
  twitter: {
    card: "summary_large_image",
    title: "Экскурсии по Казани | Официальный сайт экскурсий",
    description: "Увлекательные экскурсии по Казани с профессиональными гидами",
  },
  viewport: "width=device-width, initial-scale=1",
  robots: "index, follow",
  alternates: {
    canonical: "https://khajan-final.vercel.app",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const headersList = await headers();
  const pathname = headersList.get("x-pathname") || "";
  const isAdminRoute = pathname.startsWith("/admin");

  return (
    <html lang="en">
      <body className={`${manrope.className} antialiased`}>
        {children}
        {!isAdminRoute && <Footer />}
      </body>
    </html>
  );
}
