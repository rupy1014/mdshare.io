import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ThemeProvider } from '@/components/ui/ThemeProvider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'MDShare - AI-powered Documentation Platform',
  description: 'AI-powered markdown documentation platform with intelligent indexing, search, and chatbot features',
  keywords: ['documentation', 'markdown', 'ai', 'search', 'chatbot'],
  authors: [{ name: 'MDShare Team' }],
  creator: 'MDShare Team',
  publisher: 'MDShare',
  robots: 'index, follow',
  openGraph: {
    type: 'website',
    locale: 'ko_KR',
    url: 'https://mdshare.app',
    siteName: 'MDShare',
    title: 'MDShare - AI-powered Documentation Platform',
    description: 'AI-powered markdown documentation platform with intelligent indexing, search, and chatbot features',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'MDShare - AI-powered Documentation Platform',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MDShare - AI-powered Documentation Platform',
    description: 'AI-powered markdown documentation platform with intelligent indexing, search, and chatbot features',
    images: ['/og-image.png'],
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="min-h-screen bg-background">
            <Header />
            <main className="container mx-auto px-4 py-8">
              {children}
            </main>
            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
