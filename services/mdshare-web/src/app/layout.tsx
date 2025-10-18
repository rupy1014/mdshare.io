import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/ui/theme-provider'
import { AuthProvider } from '@/hooks/use-auth'
import { SkipToContent } from '@/components/accessibility/accessibility-panel'
import { FocusIndicator } from '@/components/accessibility/accessibility-panel'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'MDShare Web - Notion-like Markdown Viewer',
  description: 'View and edit markdown documents with AI-powered features',
  keywords: ['markdown', 'viewer', 'editor', 'notion', 'ai', 'documentation'],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html suppressHydrationWarning>
      <body className={inter.className}>
        <SkipToContent />
        <FocusIndicator />
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            <main id="main-content" tabIndex={-1}>
              {children}
            </main>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
