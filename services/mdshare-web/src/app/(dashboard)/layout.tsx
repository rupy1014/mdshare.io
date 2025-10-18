'use client'

import { AccessGate } from '@/components/access-control/access-gate'
import { Header } from '@/components/ui/header'
import { FolderTree } from '@/components/navigation/folder-tree'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AccessGate>
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex">
          {/* 폴더트리 사이드바 */}
          <aside className="w-80 border-r border-border bg-muted/20 p-4 overflow-y-auto">
            <FolderTree />
          </aside>
          
          {/* 메인 콘텐츠 */}
          <main className="flex-1">
            {children}
          </main>
        </div>
      </div>
    </AccessGate>
  )
}
