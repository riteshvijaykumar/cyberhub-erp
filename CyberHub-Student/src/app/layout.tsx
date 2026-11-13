import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import AuthBoundary from "../components/AuthBoundary";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CyberHub Student Portal",
  description: "Student academic achievement and activity management portal.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body><AuthBoundary>{children}</AuthBoundary></body>
    </html>
  );
}
