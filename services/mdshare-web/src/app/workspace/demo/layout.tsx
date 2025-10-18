import { ReactNode } from 'react'

interface DemoLayoutProps {
  children: ReactNode
}

export default function DemoLayout({ children }: DemoLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      {children}
    </div>
  )
}
