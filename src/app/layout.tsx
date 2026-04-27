import type { Metadata } from "next";
import { JetBrains_Mono, Nunito, Sora } from "next/font/google";
import { Providers } from "./providers";
import "./globals.css";

const sora = Sora({
  subsets: ["latin"],
  variable: "--font-sora",
  display: "swap",
  weight: ["600", "700", "800"]
});

const nunito = Nunito({
  subsets: ["latin"],
  variable: "--font-nunito",
  display: "swap",
  weight: ["400", "600", "700"]
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
  weight: ["400", "500"]
});

export const metadata: Metadata = {
  title: "Baarako gèlèya bana",
  description: "Bourse d’emploi et d’entrepreneuriat pour les jeunes au Mali"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${sora.variable} ${nunito.variable} ${jetbrains.variable}`}>
      <body className="min-h-screen w-full overflow-x-hidden">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
