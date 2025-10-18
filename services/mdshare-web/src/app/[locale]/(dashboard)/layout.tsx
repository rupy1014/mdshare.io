'use client'

import { useAuth } from '@/hooks/use-auth'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { Header } from '@/components/ui/header'
import { FolderTree } from '@/components/navigation/folder-tree'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { isAuthenticated, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login')
    }
  }, [isAuthenticated, isLoading, router])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return (
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
  )
}
