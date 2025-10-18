'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Users, GraduationCap, Building, Code, BarChart3, Mail } from 'lucide-react'

export function UseCasesSection() {
  return (
    <section className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">실제 성과를 낸 사용자들</h2>
          <p className="text-lg text-muted-foreground">
            AI와 함께 일하는 방법을 터득한 실제 사례들
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="font-semibold mb-2">김민수 (마케팅 프리랜서)</h3>
              <p className="text-sm text-muted-foreground mb-3">
                클라이언트 8개 동시 관리, 월 800만원 수익
              </p>
              <div className="text-xs text-green-600 font-semibold">
                월 300만원 → 800만원 (267% 증가)
              </div>
            </CardContent>
          </Card>
          
          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="font-semibold mb-2">박영희 (볼트 유통 영업팀장)</h3>
              <p className="text-sm text-muted-foreground mb-3">
                거래처 25개 관리, 처리 속도 3배 향상
              </p>
              <div className="text-xs text-green-600 font-semibold">
                야근 주 3회 → 정시 퇴근
              </div>
            </CardContent>
          </Card>
          
          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Code className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="font-semibold mb-2">이준호 (1인 개발자)</h3>
              <p className="text-sm text-muted-foreground mb-3">
                SaaS 2개 + 외주 3개 동시 운영
              </p>
              <div className="text-xs text-green-600 font-semibold">
                월 500만원 → 1,800만원 (360% 증가)
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}