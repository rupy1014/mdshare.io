'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { 
  Rocket, 
  Users, 
  GitBranch, 
  Brain, 
  Shield, 
  ArrowRight,
  ExternalLink,
  Sparkles
} from 'lucide-react'
import Link from 'next/link'

export default function LandingPage() {
  const [inviteCode, setInviteCode] = useState('')

  const handleJoinWorkspace = () => {
    if (inviteCode.trim()) {
      window.location.href = `/join/${inviteCode.trim()}`
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      {/* 헤더 */}
      <header className="border-b border-border/50 bg-background/80 backdrop-blur">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center space-x-2">
            <Rocket className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">MDShare</span>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="ghost" asChild>
              <Link href="#features">기능</Link>
            </Button>
            <Button variant="ghost" asChild>
              <Link href="#pricing">요금제</Link>
            </Button>
            <Button asChild>
              <Link href="/login">로그인</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* 메인 히어로 섹션 */}
      <section className="container py-20 px-4">
        <div className="text-center max-w-4xl mx-auto">
          <Badge variant="secondary" className="mb-4">
            <Sparkles className="h-3 w-3 mr-1" />
            Claude Code와 완벽 연동
          </Badge>
          
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
            지능형 지식 관리 플랫폼
          </h1>
          
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            마크다운 기반 문서 관리부터 Claude Code 연동까지.<br />
            팀의 지식을 체계적으로 관리하고 AI와 함께 일하세요.
          </p>

          {/* CTA 버튼들 */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Button size="lg" asChild className="w-full sm:w-auto">
              <Link href="/workspace/create">
                <Rocket className="h-4 w-4 mr-2" />
                워크스페이스 만들기
              </Link>
            </Button>
            
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Input
                placeholder="초대 코드 입력"
                value={inviteCode}
                onChange={(e) => setInviteCode(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleJoinWorkspace()}
                className="flex-1"
              />
              <Button 
                variant="outline" 
                onClick={handleJoinWorkspace}
                disabled={!inviteCode.trim()}
              >
                참여하기
              </Button>
            </div>
          </div>

          {/* 데모 링크 */}
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <ExternalLink className="h-3 w-3" />
            <span>데모 체험: </span>
            <Link href="/demo" className="text-primary hover:underline">
              바로가기
            </Link>
          </div>
        </div>
      </section>

      {/* 주요 기능 섹션 */}
      <section id="features" className="py-20 bg-muted/30">
        <div className="container px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">왜 MDShare인가요?</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              단순한 마크다운 뷰어를 넘어서 Claude Code와 완벽하게 연동되는 지능형 플랫폼
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <div className="flex items-center space-x-2 mb-2">
                  <Brain className="h-5 w-5 text-primary" />
                  <CardTitle className="text-lg">Claude Code 연동</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  터미널에서 Claude Code로 문서를 질문하고 생성하세요. 
                  웹과 로컬 환경이 완벽하게 동기화됩니다.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center space-x-2 mb-2">
                  <GitBranch className="h-5 w-5 text-primary" />
                  <CardTitle className="text-lg">Git 기반 동기화</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Private Git 환경에서도 안전하게 동기화. 
                  웹 편집과 로컬 작업이 충돌 없이 진행됩니다.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center space-x-2 mb-2">
                  <Users className="h-5 w-5 text-primary" />
                  <CardTitle className="text-lg">팀 협업</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  실시간 협업 편집, 권한 관리, 변경사항 추적까지. 
                  팀의 지식을 효율적으로 공유하세요.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center space-x-2 mb-2">
                  <Shield className="h-5 w-5 text-primary" />
                  <CardTitle className="text-lg">보안 및 접근 제어</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  기업급 보안과 세밀한 권한 관리. 
                  민감한 문서도 안전하게 관리할 수 있습니다.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center space-x-2 mb-2">
                  <Rocket className="h-5 w-5 text-primary" />
                  <CardTitle className="text-lg">문서 구조 최적화</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Claude Code가 참조하기 쉬운 구조로 자동 최적화. 
                  인덱싱 파일과 관계 매핑을 자동 생성합니다.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center space-x-2 mb-2">
                  <Sparkles className="h-5 w-5 text-primary" />
                  <CardTitle className="text-lg">확장 마크다운</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  CSV, JSON, 다이어그램까지. 
                  일반 마크다운을 넘어선 풍부한 콘텐츠 표현이 가능합니다.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* 사용 사례 섹션 */}
      <section className="py-20">
        <div className="container px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">어떻게 사용하시나요?</h2>
            <p className="text-lg text-muted-foreground">
              다양한 팀과 개인이 MDShare를 활용하고 있습니다
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">개발 팀</h3>
                <p className="text-sm text-muted-foreground">
                  API 문서, 기술 스펙, 회의록을 체계적으로 관리하고 
                  Claude Code로 빠른 질의응답
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Brain className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">교육자</h3>
                <p className="text-sm text-muted-foreground">
                  강의 자료, 과제, 시험 문제를 관리하고 
                  학생들의 학습 진도를 추적
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">기업</h3>
                <p className="text-sm text-muted-foreground">
                  내부 문서, 매뉴얼, 프로세스를 표준화하고 
                  신입사원 온보딩 자동화
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA 섹션 */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container text-center px-4">
          <h2 className="text-3xl font-bold mb-4">지금 시작해보세요</h2>
          <p className="text-lg mb-8 opacity-90 max-w-2xl mx-auto">
            무료로 시작하고, 팀의 지식 관리 방식을 혁신해보세요
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" asChild>
              <Link href="/workspace/create">
                <Rocket className="h-4 w-4 mr-2" />
                무료로 시작하기
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary" asChild>
              <Link href="/demo">
                <ExternalLink className="h-4 w-4 mr-2" />
                데모 체험
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* 푸터 */}
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
    </div>
  )
}
