'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  ArrowLeft,
  Brain,
  Terminal,
  GitBranch,
  FileText,
  Settings,
  BookOpen,
  Zap
} from 'lucide-react'
import Link from 'next/link'
import { ClaudeIntegration } from '@/components/claude/claude-integration'
import { DocumentSync } from '@/components/sync/document-sync'

export default function ClaudePage() {
  const [activeTab, setActiveTab] = useState<'commands' | 'sync'>('commands')

  return (
    <div className="min-h-screen bg-background">
      {/* 헤더 */}
      <header className="border-b border-border/50 bg-background/80 backdrop-blur">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/workspace/demo/access">
                <ArrowLeft className="h-4 w-4 mr-2" />
                뒤로가기
              </Link>
            </Button>
            <div className="flex items-center space-x-2">
              <Brain className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold">Claude Code 연동</span>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant="secondary">
              <Terminal className="h-3 w-3 mr-1" />
              데모 환경
            </Badge>
          </div>
        </div>
      </header>

      {/* 메인 콘텐츠 */}
      <main className="container py-8 px-4">
        {/* 탭 네비게이션 */}
        <div className="flex space-x-1 mb-8 bg-muted/50 p-1 rounded-lg w-fit">
          <Button
            variant={activeTab === 'commands' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setActiveTab('commands')}
            className="flex items-center space-x-2"
          >
            <Brain className="h-4 w-4" />
            <span>Claude 명령어</span>
          </Button>
          <Button
            variant={activeTab === 'sync' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setActiveTab('sync')}
            className="flex items-center space-x-2"
          >
            <GitBranch className="h-4 w-4" />
            <span>문서 동기화</span>
          </Button>
        </div>

        {/* 콘텐츠 영역 */}
        {activeTab === 'commands' && (
          <div>
            <div className="mb-8">
              <h1 className="text-3xl font-bold mb-4">Claude Code 연동</h1>
              <p className="text-lg text-muted-foreground max-w-3xl">
                터미널에서 Claude Code를 사용하여 문서를 검색, 분석, 생성하고 최적화하세요.
                웹과 로컬 환경이 완벽하게 동기화됩니다.
              </p>
            </div>

            <ClaudeIntegration 
              workspaceId="workspace-1" 
              userRole="admin" 
            />
          </div>
        )}

        {activeTab === 'sync' && (
          <div>
            <div className="mb-8">
              <h1 className="text-3xl font-bold mb-4">문서 동기화</h1>
              <p className="text-lg text-muted-foreground max-w-3xl">
                로컬 문서와 웹 플랫폼 간의 동기화를 관리하세요.
                Git 기반으로 안전하고 효율적인 동기화가 가능합니다.
              </p>
            </div>

            <DocumentSync 
              workspaceId="workspace-1" 
              userRole="admin" 
            />
          </div>
        )}

        {/* 추가 정보 */}
        <Card className="mt-12">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BookOpen className="h-5 w-5 text-primary" />
              <span>Claude Code 연동 가이드</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium mb-3 flex items-center space-x-2">
                  <Zap className="h-4 w-4 text-primary" />
                  <span>주요 기능</span>
                </h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• 문서 검색 및 분석</li>
                  <li>• 자동 문서 생성</li>
                  <li>• Claude 최적화 구조</li>
                  <li>• Git 기반 동기화</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-3 flex items-center space-x-2">
                  <Settings className="h-4 w-4 text-primary" />
                  <span>설정 요구사항</span>
                </h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Claude Code 설치 필요</li>
                  <li>• Git 저장소 연결</li>
                  <li>• 워크스페이스 권한</li>
                  <li>• 터미널 환경</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
