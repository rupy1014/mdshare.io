'use client'

import { Rocket } from 'lucide-react'
import Link from 'next/link'

export function Footer() {
  return (
    <footer className="border-t border-border/50 py-12">
      <div className="container px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-2 mb-4 md:mb-0">
            <Rocket className="h-5 w-5 text-primary" />
            <span className="font-semibold">MDShare</span>
          </div>
          <div className="flex items-center space-x-6 text-sm text-muted-foreground">
            <Link href="/privacy" className="hover:text-foreground">개인정보처리방침</Link>
            <Link href="/terms" className="hover:text-foreground">이용약관</Link>
            <Link href="/contact" className="hover:text-foreground">문의하기</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
