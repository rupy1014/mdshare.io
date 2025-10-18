'use client'

import { useEffect, useRef, useState } from 'react'

interface MermaidDiagramProps {
  content: string
  type: 'mermaid' | 'plantuml' | 'sequence'
}

export function MermaidDiagram({ content, type }: MermaidDiagramProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const renderDiagram = async () => {
      if (!containerRef.current) return

      setIsLoading(true)
      setError(null)

      try {
        // Mermaid 다이어그램 렌더링
        if (type === 'mermaid') {
          const mermaid = (await import('mermaid')).default
          
          // Mermaid 초기화
          mermaid.initialize({
            startOnLoad: false,
            theme: 'default',
            securityLevel: 'loose',
          })

          // 기존 내용 지우기
          containerRef.current.innerHTML = ''

          // 다이어그램 생성
          const { svg } = await mermaid.render(`mermaid-${Date.now()}`, content)
          containerRef.current.innerHTML = svg
        } else {
          // PlantUML과 Sequence 다이어그램은 기본 텍스트로 표시
          containerRef.current.innerHTML = `
            <div class="p-4 border border-border rounded-lg bg-muted/50">
              <div class="text-sm text-muted-foreground mb-2">${type.toUpperCase()} 다이어그램</div>
              <pre class="text-sm font-mono whitespace-pre-wrap">${content}</pre>
              <div class="text-xs text-muted-foreground mt-2">
                💡 향후 ${type} 렌더링 지원 예정
              </div>
            </div>
          `
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : '다이어그램 렌더링 실패')
        containerRef.current.innerHTML = `
          <div class="p-4 border border-destructive rounded-lg bg-destructive/10">
            <div class="text-sm text-destructive">다이어그램 렌더링 오류</div>
            <div class="text-xs text-muted-foreground mt-1">${error}</div>
            <pre class="text-xs font-mono mt-2 whitespace-pre-wrap">${content}</pre>
          </div>
        `
      } finally {
        setIsLoading(false)
      }
    }

    renderDiagram()
  }, [content, type, error])

  if (isLoading) {
    return (
      <div className="p-4 border border-border rounded-lg bg-muted/50">
        <div className="flex items-center space-x-2">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
          <span className="text-sm text-muted-foreground">다이어그램 렌더링 중...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="my-4">
      <div ref={containerRef} className="diagram-container" />
    </div>
  )
}
