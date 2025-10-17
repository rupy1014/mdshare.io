'use client'

import { Home, FileText, Settings, Plus, Brain, Shield } from 'lucide-react'
import { Button } from './button'
import Link from 'next/link'

export function Sidebar() {
  return (
    <aside className="w-64 border-r border-border bg-background">
      <div className="p-4">
        <Button className="w-full justify-start" variant="ghost">
          <Plus className="h-4 w-4 mr-2" />
          새 문서
        </Button>
      </div>
      
      <nav className="px-4">
        <div className="space-y-1">
          <Link href="/dashboard">
            <Button className="w-full justify-start" variant="ghost">
              <Home className="h-4 w-4 mr-2" />
              대시보드
            </Button>
          </Link>
          
          <Link href="/editor">
            <Button className="w-full justify-start" variant="ghost">
              <FileText className="h-4 w-4 mr-2" />
              에디터
            </Button>
          </Link>
          
          <Link href="/ai">
            <Button className="w-full justify-start" variant="ghost">
              <Brain className="h-4 w-4 mr-2" />
              AI 인덱싱
            </Button>
          </Link>
          
          <Link href="/access">
            <Button className="w-full justify-start" variant="ghost">
              <Shield className="h-4 w-4 mr-2" />
              접근 제어
            </Button>
          </Link>
          
          <Button className="w-full justify-start" variant="ghost">
            <Settings className="h-4 w-4 mr-2" />
            설정
          </Button>
        </div>
      </nav>
    </aside>
  )
}
