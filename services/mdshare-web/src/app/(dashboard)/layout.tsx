'use client'

import { AccessGate } from '@/components/access-control/access-gate'
import { Header } from '@/components/ui/header'
import { Sidebar } from '@/components/ui/sidebar'

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
          <Sidebar />
          <main className="flex-1">
            {children}
          </main>
        </div>
      </div>
    </AccessGate>
  )
}
