'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { 
  ArrowLeft,
  FileText,
  Users,
  Settings,
  Plus,
  Search,
  GitBranch,
  Brain,
  Shield,
  Rocket,
  TrendingUp,
  Clock,
  Activity,
  Copy,
  Trash2,
  Edit,
  UserPlus,
  Mail
} from 'lucide-react'
import { MemberManagement } from '@/components/member/member-management'
import { InviteCodeManagement } from '@/components/invite/invite-code-management'
import Link from 'next/link'

interface TeamMember {
  id: string
  name: string
  email: string
  role: 'admin' | 'editor' | 'viewer'
  joinedAt: string
  lastActive: string
}

interface InviteCode {
  id: string
  code: string
  role: 'admin' | 'editor' | 'viewer'
  maxUses: number
  usedCount: number
  expiresAt: string
  createdBy: string
}

export default function DemoAccessPage() {
  const [members] = useState<TeamMember[]>([
    {
      id: '1',
      name: '김개발',
      email: 'kim@example.com',
      role: 'admin',
      joinedAt: '2024-01-01',
      lastActive: '2시간 전'
    },
    {
      id: '2',
      name: '박리더',
      email: 'park@example.com',
      role: 'editor',
      joinedAt: '2024-01-02',
      lastActive: '1일 전'
    },
    {
      id: '3',
      name: '이백엔드',
      email: 'lee@example.com',
      role: 'editor',
      joinedAt: '2024-01-03',
      lastActive: '3시간 전'
    },
    {
      id: '4',
      name: '정프론트',
      email: 'jung@example.com',
      role: 'viewer',
      joinedAt: '2024-01-04',
      lastActive: '1주일 전'
    }
  ])

  const [inviteCodes] = useState<InviteCode[]>([
    {
      id: '1',
      code: 'ADMIN123',
      role: 'admin',
      maxUses: 1,
      usedCount: 1,
      expiresAt: '2024-02-01',
      createdBy: '김개발'
    },
    {
      id: '2',
      code: 'EDITOR456',
      role: 'editor',
      maxUses: 5,
      usedCount: 2,
      expiresAt: '2024-02-15',
      createdBy: '김개발'
    },
    {
      id: '3',
      code: 'VIEWER789',
      role: 'viewer',
      maxUses: 10,
      usedCount: 1,
      expiresAt: '2024-03-01',
      createdBy: '김개발'
    }
  ])

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'admin': return 'destructive'
      case 'editor': return 'default'
      case 'viewer': return 'secondary'
      default: return 'outline'
    }
  }

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'admin': return '관리자'
      case 'editor': return '에디터'
      case 'viewer': return '뷰어'
      default: return role
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* 헤더 */}
      <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center justify-between px-4">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Rocket className="h-5 w-5 text-primary" />
              <span className="font-semibold">MDShare</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full" />
              <span className="text-sm font-medium">TechTeam-Docs</span>
              <Badge variant="secondary">관리자</Badge>
            </div>
          </div>
          
          <div className="flex items-center space-x-1">
            <Button variant="ghost" size="sm" title="검색">
              <Search className="h-4 w-4" />
            </Button>
            
            <Link href="/workspace/demo/document/1">
              <Button variant="ghost" size="sm" title="문서 인덱싱">
                <Brain className="h-4 w-4" />
              </Button>
            </Link>
            
            <Button variant="ghost" size="sm" title="Git 연동">
              <GitBranch className="h-4 w-4" />
            </Button>
            
            <Link href="/workspace/demo/access">
              <Button variant="default" size="sm" title="접근 제어">
                <Shield className="h-4 w-4" />
              </Button>
            </Link>
            
            <div className="flex items-center space-x-3 px-3 py-1 rounded-md bg-muted/50 ml-auto">
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium">김개발</span>
                <Badge variant="destructive" className="text-xs">관리자</Badge>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* 사이드바 */}
        <aside className="w-80 border-r border-border bg-muted/20 p-4 overflow-y-auto">
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-semibold text-muted-foreground mb-2">워크스페이스</h3>
              <div className="space-y-1">
                <Button variant="ghost" className="w-full justify-start" asChild>
                  <Link href="/workspace/demo/dashboard">
                    <FileText className="h-4 w-4 mr-2" />
                    대시보드
                  </Link>
                </Button>
                <Button variant="ghost" className="w-full justify-start">
                  <FileText className="h-4 w-4 mr-2" />
                  문서
                </Button>
                <Button variant="ghost" className="w-full justify-start">
                  <Users className="h-4 w-4 mr-2" />
                  팀원
                </Button>
                <Button variant="ghost" className="w-full justify-start">
                  <Settings className="h-4 w-4 mr-2" />
                  설정
                </Button>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-muted-foreground mb-2">접근 제어</h3>
              <div className="space-y-1">
                <Button variant="ghost" className="w-full justify-start text-sm bg-primary/10 text-primary">
                  👥 팀원 관리
                </Button>
                <Button variant="ghost" className="w-full justify-start text-sm">
                  🔗 초대 코드
                </Button>
                <Button variant="ghost" className="w-full justify-start text-sm">
                  🔐 권한 설정
                </Button>
                <Button variant="ghost" className="w-full justify-start text-sm">
                  📊 활동 로그
                </Button>
              </div>
            </div>
          </div>
        </aside>

        {/* 메인 콘텐츠 */}
        <main className="flex-1 p-6">
          <div className="max-w-6xl mx-auto">
            {/* 헤더 */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-3xl font-bold mb-2">접근 제어</h1>
                <p className="text-muted-foreground">
                  팀원 관리 및 권한 설정을 통해 워크스페이스를 안전하게 관리하세요
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="outline">
                  <UserPlus className="h-4 w-4 mr-2" />
                  팀원 초대
                </Button>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  초대 코드 생성
                </Button>
              </div>
            </div>

            {/* 통계 카드 */}
            <div className="grid md:grid-cols-4 gap-4 mb-8">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <Users className="h-5 w-5 text-primary" />
                    <div>
                      <div className="text-2xl font-bold">{members.length}</div>
                      <div className="text-sm text-muted-foreground">총 팀원</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <Shield className="h-5 w-5 text-primary" />
                    <div>
                      <div className="text-2xl font-bold">1</div>
                      <div className="text-sm text-muted-foreground">관리자</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <Edit className="h-5 w-5 text-primary" />
                    <div>
                      <div className="text-2xl font-bold">2</div>
                      <div className="text-sm text-muted-foreground">에디터</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <FileText className="h-5 w-5 text-primary" />
                    <div>
                      <div className="text-2xl font-bold">1</div>
                      <div className="text-sm text-muted-foreground">뷰어</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
              {/* 팀원 관리 */}
              <MemberManagement 
                workspaceId="workspace-1" 
                userRole="admin" 
              />

              {/* 초대 코드 관리 */}
              <InviteCodeManagement 
                workspaceId="workspace-1" 
                userRole="admin" 
              />
            </div>

            {/* 권한 설명 */}
            <Card className="mt-8">
              <CardHeader>
                <CardTitle>권한 설명</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-6">
                  <div>
                    <div className="flex items-center space-x-2 mb-2">
                      <Badge variant="destructive">관리자</Badge>
                    </div>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• 모든 문서 읽기/편집</li>
                      <li>• 팀원 관리</li>
                      <li>• 워크스페이스 설정</li>
                      <li>• 접근 제어</li>
                      <li>• Git 연동</li>
                    </ul>
                  </div>
                  
                  <div>
                    <div className="flex items-center space-x-2 mb-2">
                      <Badge variant="default">에디터</Badge>
                    </div>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• 모든 문서 읽기/편집</li>
                      <li>• 댓글 작성</li>
                      <li>• 문서 생성</li>
                      <li>• AI 인덱싱</li>
                      <li>• Git 연동</li>
                    </ul>
                  </div>
                  
                  <div>
                    <div className="flex items-center space-x-2 mb-2">
                      <Badge variant="secondary">뷰어</Badge>
                    </div>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• 문서 읽기</li>
                      <li>• 댓글 작성</li>
                      <li>• 검색</li>
                      <li>• 북마크</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}
