import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Inter } from 'next/font/google'
import { themeColor, backgroundColor } from '../../lib/theme'

const inter = Inter({ subsets: ['latin'] })

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "喜歡電影的人都有網 - MoviePsychopath",
  description: "",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="theme-color" content={themeColor} />
        <meta name="background-color" content={backgroundColor} />
      </head>
      <body
        className={`${inter.className} ${geistSans.variable} ${geistMono.variable} antialiased`}
        style={{ backgroundColor }}
      >
        {children}
      </body>
    </html>
  );
}
