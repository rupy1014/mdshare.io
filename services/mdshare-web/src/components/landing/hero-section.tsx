'use client'

import React from 'react'
import { Button } from '@/components/ui/button'
import { 
  Rocket, 
  BookOpen,
  CheckCircle,
  Zap,
  Brain,
  FileText,
  Users,
  TrendingUp
} from 'lucide-react'
import Link from 'next/link'

interface HeroSectionProps {
  shareUrl: string
  setShareUrl: (url: string) => void
  handleAccessWorkspace: () => void
}

export function HeroSection({ shareUrl, setShareUrl, handleAccessWorkspace }: HeroSectionProps) {
  return (
    <section className="min-h-screen flex items-center justify-center py-20 px-4">
      <div className="text-center max-w-5xl mx-auto">
        <div className="mb-8">
          <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-2xl mx-auto mb-6">
            <Brain className="h-8 w-8 text-primary-foreground" />
          </div>
          <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
            MDShare
          </h1>
          <h2 className="text-3xl font-semibold mb-4 text-foreground">
            AI와 함께 일하는 지능형 업무 플랫폼
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-4xl mx-auto leading-relaxed">
            마크다운으로 문서화하고, AI가 자동으로 실행하는<br />
            <span className="text-primary font-semibold">월 300만원 → 800만원</span> 성과를 만드는 업무 혁신
          </p>
        </div>

        {/* 핵심 가치 제안 */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="bg-background/50 backdrop-blur border rounded-lg p-6">
            <Zap className="h-8 w-8 text-yellow-500 mx-auto mb-3" />
            <h3 className="font-semibold mb-2">3배 빠른 처리</h3>
            <p className="text-sm text-muted-foreground">반복 업무 자동화로 처리 속도 3배 향상</p>
          </div>
          <div className="bg-background/50 backdrop-blur border rounded-lg p-6">
            <TrendingUp className="h-8 w-8 text-green-500 mx-auto mb-3" />
            <h3 className="font-semibold mb-2">267% 수익 증가</h3>
            <p className="text-sm text-muted-foreground">실제 사용자 월 수익 300만원 → 800만원</p>
          </div>
          <div className="bg-background/50 backdrop-blur border rounded-lg p-6">
            <Brain className="h-8 w-8 text-blue-500 mx-auto mb-3" />
            <h3 className="font-semibold mb-2">AI 매뉴얼 로봇</h3>
            <p className="text-sm text-muted-foreground">학습하지 않고 문서를 참조하는 완벽한 실행</p>
          </div>
        </div>

        {/* CTA 버튼들 */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
          <Button size="lg" asChild className="w-full sm:w-auto px-8 py-4 text-lg">
            <Link href="/ko/workspace/create">
              <Rocket className="h-5 w-5 mr-2" />
              14일 무료 체험
            </Link>
          </Button>
          <Button size="lg" variant="outline" asChild className="w-full sm:w-auto px-8 py-4 text-lg">
            <Link href="/ko/docs">
              <BookOpen className="h-5 w-5 mr-2" />
              성공 사례 보기
            </Link>
          </Button>
        </div>

        {/* 추가 정보 */}
        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <CheckCircle className="h-4 w-4" />
          <span>14일 무료 체험 • 설치 불필요 • 즉시 사용 가능</span>
        </div>
      </div>
    </section>
  )
}