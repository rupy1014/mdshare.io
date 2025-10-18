'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  ArrowLeft,
  Bell,
  BellRing,
  Settings,
  Activity,
  TrendingUp
} from 'lucide-react'
import Link from 'next/link'
import { NotificationCenter } from '@/components/notification/notification-center'
import { NotificationSettingsComponent } from '@/components/notification/notification-settings'

export default function NotificationPage() {
  const [activeTab, setActiveTab] = useState<'notifications' | 'settings'>('notifications')

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
              <BellRing className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold">알림 센터</span>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant="secondary">
              <Activity className="h-3 w-3 mr-1" />
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
            variant={activeTab === 'notifications' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setActiveTab('notifications')}
            className="flex items-center space-x-2"
          >
            <Bell className="h-4 w-4" />
            <span>알림</span>
          </Button>
          <Button
            variant={activeTab === 'settings' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setActiveTab('settings')}
            className="flex items-center space-x-2"
          >
            <Settings className="h-4 w-4" />
            <span>설정</span>
          </Button>
        </div>

        {/* 콘텐츠 영역 */}
        {activeTab === 'notifications' && (
          <div>
            <div className="mb-8">
              <h1 className="text-3xl font-bold mb-4">알림 센터</h1>
              <p className="text-lg text-muted-foreground max-w-3xl">
                워크스페이스의 모든 활동과 변경사항을 한눈에 확인하세요.
                중요한 알림을 놓치지 않고 팀과 함께 일하세요.
              </p>
            </div>

            <NotificationCenter userId="user-1" />
          </div>
        )}

        {activeTab === 'settings' && (
          <div>
            <div className="mb-8">
              <h1 className="text-3xl font-bold mb-4">알림 설정</h1>
              <p className="text-lg text-muted-foreground max-w-3xl">
                받고 싶은 알림의 종류와 방법을 설정하세요.
                이메일, 브라우저 알림, 그리고 알림 빈도를 자유롭게 조정할 수 있습니다.
              </p>
            </div>

            <NotificationSettingsComponent userId="user-1" />
          </div>
        )}

        {/* 추가 정보 */}
        <Card className="mt-12">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              <span>알림 시스템 가이드</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium mb-3">알림 타입</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• 문서 생성, 수정, 삭제</li>
                  <li>• 멤버 초대, 참여, 탈퇴</li>
                  <li>• 역할 변경 및 권한 업데이트</li>
                  <li>• 문서 동기화 상태</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-3">알림 방법</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• 브라우저 푸시 알림</li>
                  <li>• 이메일 알림</li>
                  <li>• 즉시 또는 요약 알림</li>
                  <li>• 타입별 개별 설정</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
