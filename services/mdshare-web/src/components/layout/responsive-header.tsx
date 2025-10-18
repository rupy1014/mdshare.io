'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  Menu,
  X,
  Home,
  FileText,
  Users,
  Settings,
  Bell,
  Brain,
  GitBranch,
  Shield,
  Search,
  Moon,
  Sun
} from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useTheme } from 'next-themes'

interface MobileNavigationProps {
  isOpen: boolean
  onClose: () => void
}

export function MobileNavigation({ isOpen, onClose }: MobileNavigationProps) {
  const pathname = usePathname()
  const { theme, setTheme } = useTheme()

  const navigationItems = [
    {
      id: 'dashboard',
      label: '대시보드',
      href: '/workspace/demo/dashboard',
      icon: <Home className="h-4 w-4" />
    },
    {
      id: 'documents',
      label: '문서',
      href: '/workspace/demo/document/1',
      icon: <FileText className="h-4 w-4" />
    },
    {
      id: 'claude',
      label: 'Claude Code',
      href: '/workspace/demo/claude',
      icon: <Brain className="h-4 w-4" />
    },
    {
      id: 'access',
      label: '접근 제어',
      href: '/workspace/demo/access',
      icon: <Shield className="h-4 w-4" />
    },
    {
      id: 'notifications',
      label: '알림',
      href: '/workspace/demo/notifications',
      icon: <Bell className="h-4 w-4" />
    }
  ]

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />
      <div className="fixed left-0 top-0 h-full w-80 bg-background border-r shadow-lg">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold">메뉴</h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        <nav className="p-4 space-y-2">
          {navigationItems.map((item) => (
            <Link key={item.id} href={item.href} onClick={onClose}>
              <div className={`flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                pathname === item.href 
                  ? 'bg-primary text-primary-foreground' 
                  : 'hover:bg-muted'
              }`}>
                {item.icon}
                <span>{item.label}</span>
              </div>
            </Link>
          ))}
          
          <div className="pt-4 border-t">
            <Button
              variant="ghost"
              className="w-full justify-start"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            >
              {theme === 'dark' ? <Sun className="h-4 w-4 mr-3" /> : <Moon className="h-4 w-4 mr-3" />}
              테마 변경
            </Button>
          </div>
        </nav>
      </div>
    </div>
  )
}

export function ResponsiveHeader() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [user, setUser] = useState<any>(null)
  const { theme, setTheme } = useTheme()

  useEffect(() => {
    const userData = localStorage.getItem('mdshare-user')
    if (userData) {
      setUser(JSON.parse(userData))
    }
  }, [])

  return (
    <header className="border-b border-border/50 bg-background/80 backdrop-blur sticky top-0 z-40">
      <div className="container flex h-16 items-center justify-between px-4">
        {/* 로고 및 모바일 메뉴 버튼 */}
        <div className="flex items-center space-x-4">
          <Button 
            variant="ghost" 
            size="sm" 
            className="lg:hidden"
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <Menu className="h-4 w-4" />
          </Button>
          
          <div className="flex items-center space-x-2">
            <div className="h-6 w-6 bg-primary rounded" />
            <span className="text-xl font-bold hidden sm:block">MDShare</span>
          </div>
        </div>

        {/* 데스크톱 네비게이션 */}
        <nav className="hidden lg:flex items-center space-x-1">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/workspace/demo/dashboard">
              <Home className="h-4 w-4 mr-2" />
              대시보드
            </Link>
          </Button>
          
          <Button variant="ghost" size="sm" asChild>
            <Link href="/workspace/demo/document/1">
              <FileText className="h-4 w-4 mr-2" />
              문서
            </Link>
          </Button>
          
          <Button variant="ghost" size="sm" asChild>
            <Link href="/workspace/demo/claude">
              <Brain className="h-4 w-4 mr-2" />
              Claude
            </Link>
          </Button>
          
          <Button variant="ghost" size="sm" asChild>
            <Link href="/workspace/demo/access">
              <Shield className="h-4 w-4 mr-2" />
              접근제어
            </Link>
          </Button>
          
          <Button variant="ghost" size="sm" asChild>
            <Link href="/workspace/demo/notifications">
              <Bell className="h-4 w-4 mr-2" />
              알림
            </Link>
          </Button>
        </nav>

        {/* 우측 액션 버튼들 */}
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm" className="hidden sm:flex">
            <Search className="h-4 w-4" />
          </Button>
          
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="hidden sm:flex"
          >
            {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>
          
          {user && (
            <div className="flex items-center space-x-2">
              <div className="hidden sm:block text-sm">
                <div className="font-medium">{user.name}</div>
                <div className="text-xs text-muted-foreground">{user.role}</div>
              </div>
              <div className="h-8 w-8 bg-primary/10 rounded-full flex items-center justify-center">
                <span className="text-sm font-medium">{user.name.charAt(0)}</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 모바일 네비게이션 */}
      <MobileNavigation 
        isOpen={isMobileMenuOpen} 
        onClose={() => setIsMobileMenuOpen(false)} 
      />
    </header>
  )
}
