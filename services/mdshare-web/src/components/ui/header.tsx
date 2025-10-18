'use client'

import { Search, Moon, Sun, User, LogOut, Brain, Shield, GitBranch, Bell, BellRing } from 'lucide-react'
import { Button } from './button'
import { Badge } from './badge'
import { GitPopup } from '@/components/git/git-popup'
import { useTheme } from 'next-themes'
import { useState, useEffect } from 'react'
import Link from 'next/link'

interface UserInfo {
  id: string
  email: string
  role: 'admin' | 'editor' | 'viewer'
  joinedAt: Date
}

export function Header() {
  const { theme, setTheme } = useTheme()
  const [user, setUser] = useState<UserInfo | null>(null)
  const [isGitPopupOpen, setIsGitPopupOpen] = useState(false)

  useEffect(() => {
    // localStorage에서 사용자 정보 확인
    const savedUser = localStorage.getItem('mdshare-user')
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser)
        setUser(userData)
      } catch (error) {
        console.error('사용자 정보 파싱 실패:', error)
      }
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('mdshare-user')
    setUser(null)
    // 페이지 새로고침하여 로그인 화면으로 이동
    window.location.reload()
  }

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'admin': return 'destructive'
      case 'editor': return 'default'
      case 'viewer': return 'secondary'
      default: return 'outline'
    }
  }

  // 권한 확인 함수
  const hasRole = (role: string) => {
    if (!user) return false
    const roleHierarchy: Record<string, number> = { viewer: 1, editor: 2, admin: 3 }
    return roleHierarchy[user.role] >= roleHierarchy[role]
  }

  return (
    <header className="border-b border-border bg-background backdrop-blur supports-[backdrop-filter]:bg-background/95">
      <div className="flex h-14 items-center justify-between pl-4">
        <div className="flex items-center space-x-4">
          <h1 className="text-xl font-bold">MDShare Web</h1>
        </div>
        
        <div className="flex items-center space-x-1">
          {/* 검색 */}
          <Button variant="ghost" size="sm" title="검색">
            <Search className="h-4 w-4" />
          </Button>
          
          {/* Git 연동 */}
          {hasRole('viewer') && (
            <Button 
              variant="ghost" 
              size="sm" 
              title="Git 연동"
              onClick={() => setIsGitPopupOpen(true)}
            >
              <GitBranch className="h-4 w-4" />
            </Button>
          )}
          
          {/* AI 인덱싱 */}
          {hasRole('viewer') && (
            <Link href="/ai">
              <Button variant="ghost" size="sm" title="AI 인덱싱">
                <Brain className="h-4 w-4" />
              </Button>
            </Link>
          )}
          
          {/* 접근 제어 */}
          {hasRole('admin') && (
            <Link href="/access">
              <Button variant="ghost" size="sm" title="접근 제어">
                <Shield className="h-4 w-4" />
              </Button>
            </Link>
          )}
          
          {/* 알림 */}
          <Link href="/workspace/demo/notifications">
            <Button variant="ghost" size="sm" title="알림" className="relative">
              <BellRing className="h-4 w-4" />
              <Badge variant="destructive" className="absolute -top-1 -right-1 h-5 w-5 text-xs flex items-center justify-center">3</Badge>
            </Button>
          </Link>
          
          {/* 테마 토글 */}
          <Button
            variant="ghost"
            size="sm"
            title="테마 변경"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          >
            {theme === 'dark' ? (
              <Sun className="h-4 w-4" />
            ) : (
              <Moon className="h-4 w-4" />
            )}
          </Button>
          
          {/* 사용자 정보 - 여백 없이 브라우저 우측 끝으로 */}
          {user && (
            <div className="flex items-center space-x-3 px-3 py-1 rounded-md bg-muted/50 ml-auto">
              <User className="h-4 w-4 text-muted-foreground" />
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium">{user.email}</span>
                <Badge variant={getRoleBadgeVariant(user.role)} className="text-xs">
                  {user.role === 'admin' ? '관리자' : 
                   user.role === 'editor' ? '에디터' : '뷰어'}
                </Badge>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="h-6 w-6 p-0 hover:bg-destructive/10 hover:text-destructive"
              >
                <LogOut className="h-3 w-3" />
              </Button>
            </div>
          )}
        </div>
      </div>
      
      {/* Git 팝업 */}
      <GitPopup 
        isOpen={isGitPopupOpen} 
        onClose={() => setIsGitPopupOpen(false)} 
      />
    </header>
  )
}
