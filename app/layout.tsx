import './globals.css'
import type { Metadata } from 'next'

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
      <body>{children}</body>
    </html>
  )
}
