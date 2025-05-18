import type { Metadata } from "next";
import { Inter, Roboto_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

const robotoMono = Roboto_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-roboto-mono',
});

export const metadata: Metadata = {
  title: 'Assistant Vocal avec Traitement du Signal',
  description: 'Application de reconnaissance vocale avec traitement du signal',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body className={`${inter.variable} ${robotoMono.variable} font-sans`}>
        {children}
      </body>
    </html>
  );
}
