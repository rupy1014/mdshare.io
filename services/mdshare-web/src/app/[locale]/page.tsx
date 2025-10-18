'use client'

import React, { useState } from 'react'
import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/button'
import { 
  Rocket, 
  ExternalLink
} from 'lucide-react'
import Link from 'next/link'
import { LanguageSwitcher } from '@/components/ui/language-switcher'
import { HeroSection, FeaturesSection, UseCasesSection, PricingSection, CtaSection, Footer } from '@/components/landing'

export default function LandingPage() {
  const t = useTranslations()
  const [shareUrl, setShareUrl] = useState('')

  const handleAccessWorkspace = () => {
    if (shareUrl.trim()) {
      // 공유 링크에서 workspaceId와 shareId 추출
      const urlParts = shareUrl.trim().split('/')
      const shareIndex = urlParts.findIndex(part => part === 'share')
      
      if (shareIndex !== -1 && urlParts.length > shareIndex + 2) {
        const workspaceId = urlParts[shareIndex + 1]
        const shareId = urlParts[shareIndex + 2]
        window.location.href = `/share/${workspaceId}/${shareId}`
      } else {
        alert('올바른 공유 링크를 입력해주세요')
      }
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      {/* 헤더 */}
      <header className="border-b border-border/50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="w-full flex h-16 items-center justify-between px-6">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-lg">
              <Rocket className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <span className="font-bold text-2xl bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">MDShare</span>
              <p className="text-xs text-muted-foreground -mt-1">AI-Powered Knowledge Platform</p>
            </div>
          </div>
          
          {/* <nav className="hidden lg:flex items-center space-x-8">
            <Link href="#features" className="text-sm font-medium hover:text-primary transition-colors relative group">
              기능
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full"></span>
            </Link>
            <Link href="/ko/docs" className="text-sm font-medium hover:text-primary transition-colors relative group">
              문서
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full"></span>
            </Link>
            <Link href="/ko/search" className="text-sm font-medium hover:text-primary transition-colors relative group">
              검색
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full"></span>
            </Link>
            <Link href="/ko/chat" className="text-sm font-medium hover:text-primary transition-colors relative group">
              AI 채팅
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full"></span>
            </Link>
            <Link href="/ko/workspace/demo/dashboard" className="text-sm font-medium hover:text-primary transition-colors relative group">
              데모
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full"></span>
            </Link>
          </nav> */}
          
          <div className="flex items-center space-x-3">
            <LanguageSwitcher />
            <Button variant="ghost" size="sm" asChild className="hidden sm:flex">
              <Link href="/login">로그인</Link>
            </Button>
            <Button size="sm" asChild className="px-6">
              <Link href="/register">시작하기</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <HeroSection 
        shareUrl={shareUrl}
        setShareUrl={setShareUrl}
        handleAccessWorkspace={handleAccessWorkspace}
      />

      {/* Features Section */}
      <FeaturesSection />

      {/* Use Cases Section */}
      <UseCasesSection />

      {/* Pricing Section */}
      <PricingSection />

      {/* CTA Section */}
      <CtaSection />

      {/* Footer */}
      <Footer />
    </div>
  )
}