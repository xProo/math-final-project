import { Inter } from 'next/font/google';
import './globals.css'
import type { Metadata } from 'next'

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Assistant Vocal avec Traitement du Signal',
  description: 'Application de reconnaissance vocale avec traitement du signal',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
