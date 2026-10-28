import type { Metadata } from "next";
import "./globals.css";
import { Bricolage_Grotesque, Geist } from "next/font/google";
import { cn } from "@/lib/utils";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});
const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-bricolage",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Portfolio",
  description:
    "Personal portfolio of a freelance software developer based in Cuba.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="es"
      className={cn("dark font-sans", geist.variable, bricolage.variable)}
    >
      <body>{children}</body>
    </html>
  );
}
