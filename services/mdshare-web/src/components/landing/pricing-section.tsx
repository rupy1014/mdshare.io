'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CheckCircle, Zap, TrendingUp, Clock } from 'lucide-react'
import Link from 'next/link'

export function PricingSection() {
  return (
    <section className="py-20 px-4 bg-muted/30">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">투자 대비 10배 수익</h2>
          <p className="text-lg text-muted-foreground">
            실제 사용자들의 성과를 바탕으로 한 투명한 가격
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {/* 무료 체험 플랜 */}
          <Card className="text-center">
            <CardHeader>
              <CardTitle className="text-2xl">14일 무료 체험</CardTitle>
              <div className="text-4xl font-bold">₩0</div>
              <p className="text-muted-foreground">14일간 모든 기능</p>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm mb-6">
                <li className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>모든 프리미엄 기능</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>AI 자동화 도구</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>팀 협업 기능</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>체험 후 자동 유료 전환</span>
                </li>
              </ul>
              <Button className="w-full" asChild>
                <Link href="/ko/workspace/create">무료 체험 시작</Link>
              </Button>
            </CardContent>
          </Card>
          
          {/* 프로 플랜 */}
          <Card className="text-center border-primary relative">
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
              <span className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-semibold">
                가장 인기
              </span>
            </div>
            <CardHeader>
              <CardTitle className="text-2xl">프로</CardTitle>
              <div className="text-4xl font-bold">₩29,000</div>
              <p className="text-muted-foreground">월</p>
            </CardHeader>
            <CardContent>
              <div className="mb-4 p-3 bg-green-50 rounded-lg">
                <div className="text-sm text-green-700 font-semibold">
                  14일 체험 후 월 29,000원
                </div>
                <div className="text-xs text-green-600">
                  월 300만원 → 800만원 성과 달성
                </div>
              </div>
              <ul className="space-y-2 text-sm mb-6">
                <li className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>완전한 자동화 도구</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>AI 질의응답 시스템</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>팀 협업 기능</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>우선 지원</span>
                </li>
              </ul>
              <Button className="w-full" asChild>
                <Link href="/ko/workspace/create">프로 시작하기</Link>
              </Button>
            </CardContent>
          </Card>
          
          {/* 팀 플랜 */}
          <Card className="text-center">
            <CardHeader>
              <CardTitle className="text-2xl">팀</CardTitle>
              <div className="text-4xl font-bold">₩99,000</div>
              <p className="text-muted-foreground">월 (팀당)</p>
            </CardHeader>
            <CardContent>
              <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                <div className="text-sm text-blue-700 font-semibold">
                  팀 전체 생산성 3배 향상
                </div>
                <div className="text-xs text-blue-600">
                  처리 속도 3배, 오류율 80% 감소
                </div>
              </div>
              <ul className="space-y-2 text-sm mb-6">
                <li className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>무제한 팀원</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>고급 권한 관리</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>전담 컨설턴트</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>맞춤형 교육</span>
                </li>
              </ul>
              <Button className="w-full" asChild>
                <Link href="/ko/workspace/create">팀 시작하기</Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* 성과 보장 섹션 */}
        <div className="mt-16 text-center">
          <div className="bg-background border rounded-lg p-8">
            <h3 className="text-xl font-semibold mb-4">성과 보장</h3>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="flex items-center justify-center space-x-2">
                <Zap className="h-5 w-5 text-yellow-500" />
                <span className="text-sm">처리 속도 3배 향상</span>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <TrendingUp className="h-5 w-5 text-green-500" />
                <span className="text-sm">수익 200% 이상 증가</span>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <Clock className="h-5 w-5 text-blue-500" />
                <span className="text-sm">업무 시간 50% 단축</span>
              </div>
            </div>
            <p className="text-sm text-muted-foreground mt-4">
              3개월 내 성과가 없으면 전액 환불 보장
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}