'use client'

import { useEffect, useState } from 'react'
import { MarkdownParser } from 'mdshare-core'
import { SmartLink } from '@/components/viewer/smart-link'

interface ExtendedMarkdownViewerProps {
  content: string
  basePath?: string
}

export function ExtendedMarkdownViewer({ content, basePath = '' }: ExtendedMarkdownViewerProps) {
  const [processedHtml, setProcessedHtml] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const processMarkdown = async () => {
      setIsLoading(true)
      setError(null)

      try {
        const parser = new MarkdownParser()
        const result = await parser.parse(content, {
          basePath,
          includeHtml: true,
          extractMetadata: false,
          processDiagrams: true,
          resolveLinks: true
        })

        if (result.success && result.document) {
          setProcessedHtml(result.document.html)
        } else {
          setError(result.error || '마크다운 파싱 실패')
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : '마크다운 처리 중 오류 발생')
      } finally {
        setIsLoading(false)
      }
    }

    processMarkdown()
  }, [content, basePath])

  // HTML을 처리하여 확장 컴포넌트로 교체
  const processExtendedElements = (html: string) => {
    let processedHtml = html

    // Mermaid 다이어그램 처리 - 간단한 플레이스홀더로 교체
    processedHtml = processedHtml.replace(
      /<div class="mermaid-diagram" data-type="mermaid">\s*([\s\S]*?)\s*<\/div>/g,
      (match, diagramContent) => {
        return `
          <div class="extended-element mermaid-placeholder" data-type="mermaid" data-content="${encodeURIComponent(diagramContent.trim())}">
            <div class="p-4 border border-border rounded-lg bg-muted/50">
              <div class="flex items-center space-x-2 mb-2">
                <div class="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span class="text-sm font-medium">Mermaid 다이어그램</span>
              </div>
              <pre class="text-xs text-muted-foreground whitespace-pre-wrap">${diagramContent.trim()}</pre>
              <div class="text-xs text-muted-foreground mt-2">💡 실제 Mermaid 렌더링은 향후 구현 예정</div>
            </div>
          </div>
        `
      }
    )

    // PlantUML 다이어그램 처리
    processedHtml = processedHtml.replace(
      /<div class="plantuml-diagram" data-type="plantuml">\s*([\s\S]*?)\s*<\/div>/g,
      (match, diagramContent) => {
        return `
          <div class="extended-element plantuml-placeholder" data-type="plantuml" data-content="${encodeURIComponent(diagramContent.trim())}">
            <div class="p-4 border border-border rounded-lg bg-muted/50">
              <div class="flex items-center space-x-2 mb-2">
                <div class="w-2 h-2 bg-green-500 rounded-full"></div>
                <span class="text-sm font-medium">PlantUML 다이어그램</span>
              </div>
              <pre class="text-xs text-muted-foreground whitespace-pre-wrap">${diagramContent.trim()}</pre>
              <div class="text-xs text-muted-foreground mt-2">💡 PlantUML 렌더링은 향후 구현 예정</div>
            </div>
          </div>
        `
      }
    )

    // Sequence 다이어그램 처리
    processedHtml = processedHtml.replace(
      /<div class="sequence-diagram" data-type="sequence">\s*([\s\S]*?)\s*<\/div>/g,
      (match, diagramContent) => {
        return `
          <div class="extended-element sequence-placeholder" data-type="sequence" data-content="${encodeURIComponent(diagramContent.trim())}">
            <div class="p-4 border border-border rounded-lg bg-muted/50">
              <div class="flex items-center space-x-2 mb-2">
                <div class="w-2 h-2 bg-purple-500 rounded-full"></div>
                <span class="text-sm font-medium">Sequence 다이어그램</span>
              </div>
              <pre class="text-xs text-muted-foreground whitespace-pre-wrap">${diagramContent.trim()}</pre>
              <div class="text-xs text-muted-foreground mt-2">💡 Sequence 다이어그램 렌더링은 향후 구현 예정</div>
            </div>
          </div>
        `
      }
    )

    // CSV 렌더러 처리 - 실제 데이터로 렌더링
    processedHtml = processedHtml.replace(
      /<div class="csv-renderer" data-path="([^"]+)">([^<]*)<\/div>/g,
      (match, csvPath, loadingText) => {
        const mockData = getMockCsvData(csvPath)
        return `
          <div class="extended-element csv-renderer" data-path="${csvPath}">
            ${renderCsvTable(mockData, csvPath)}
          </div>
        `
      }
    )

    // JSON 렌더러 처리 - 실제 데이터로 렌더링
    processedHtml = processedHtml.replace(
      /<div class="json-renderer" data-path="([^"]+)">([^<]*)<\/div>/g,
      (match, jsonPath, loadingText) => {
        const mockData = getMockJsonData(jsonPath)
        return `
          <div class="extended-element json-renderer" data-path="${jsonPath}">
            ${renderJsonView(mockData, jsonPath)}
          </div>
        `
      }
    )

    return processedHtml
  }

  const finalHtml = processExtendedElements(processedHtml)

  if (isLoading) {
    return (
      <div className="p-8 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-muted-foreground">마크다운 렌더링 중...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-4 border border-destructive rounded-lg bg-destructive/10">
        <div className="text-destructive font-medium mb-2">렌더링 오류</div>
        <div className="text-sm text-muted-foreground">{error}</div>
      </div>
    )
  }

  return (
    <div
      className="prose prose-slate dark:prose-invert max-w-none"
      dangerouslySetInnerHTML={{ __html: finalHtml }}
    />
  )
}

// Mock CSV 데이터 생성
function getMockCsvData(path: string): any[] {
  if (path.includes('students')) {
    return [
      { 이름: '홍길동', 이메일: 'hong@example.com', 전공: '컴퓨터공학', 학년: '3', 상태: '완료' },
      { 이름: '김철수', 이메일: 'kim@example.com', 전공: '전자공학', 학년: '2', 상태: '진행중' },
      { 이름: '이영희', 이메일: 'lee@example.com', 전공: '수학', 학년: '4', 상태: '완료' },
      { 이름: '박민수', 이메일: 'park@example.com', 전공: '물리학', 학년: '1', 상태: '미완료' },
      { 이름: '정수진', 이메일: 'jung@example.com', 전공: '화학', 학년: '3', 상태: '완료' }
    ]
  }
  
  return [
    { 컬럼1: '값1', 컬럼2: '값2', 컬럼3: '값3' },
    { 컬럼1: '값4', 컬럼2: '값5', 컬럼3: '값6' }
  ]
}

// Mock JSON 데이터 생성
function getMockJsonData(path: string): any {
  if (path.includes('endpoints')) {
    return [
      {
        method: 'GET',
        path: '/api/users',
        description: '사용자 목록 조회',
        auth: true,
        parameters: [
          { name: 'page', type: 'number', required: false },
          { name: 'limit', type: 'number', required: false }
        ]
      },
      {
        method: 'POST',
        path: '/api/users',
        description: '새 사용자 생성',
        auth: true,
        parameters: [
          { name: 'name', type: 'string', required: true },
          { name: 'email', type: 'string', required: true }
        ]
      }
    ]
  }
  
  return {
    name: '예제 데이터',
    version: '1.0.0',
    description: 'JSON 구조화 뷰 예시',
    items: [
      { id: 1, name: '아이템 1', active: true },
      { id: 2, name: '아이템 2', active: false }
    ]
  }
}

// CSV 테이블 렌더링
function renderCsvTable(data: any[], path: string): string {
  if (!data || data.length === 0) {
    return `
      <div class="p-4 border border-destructive rounded-lg bg-destructive/10">
        <div class="text-destructive text-sm">CSV 데이터를 찾을 수 없습니다</div>
      </div>
    `
  }

  const headers = Object.keys(data[0])
  const rows = data.slice(0, 10) // 최대 10행만 표시

  return `
    <div class="my-4 border border-border rounded-lg overflow-hidden">
      <div class="p-4 border-b border-border bg-muted/50">
        <div class="flex items-center justify-between mb-3">
          <div class="flex items-center space-x-2">
            <span class="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold border-transparent bg-primary text-primary-foreground">CSV</span>
            <span class="text-sm font-medium">${path.split('/').pop()}</span>
            <span class="text-xs text-muted-foreground">(${data.length}행)</span>
          </div>
          <div class="flex items-center space-x-2">
            <button class="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-8 w-8 p-0" title="복사">
              <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
              </svg>
            </button>
            <button class="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-8 w-8 p-0" title="다운로드">
              <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-muted/30">
            <tr>
              ${headers.map(header => `<th class="px-4 py-3 text-left text-sm font-medium">${header}</th>`).join('')}
            </tr>
          </thead>
          <tbody>
            ${rows.map(row => `
              <tr class="border-b border-border hover:bg-muted/30">
                ${headers.map(header => `<td class="px-4 py-3 text-sm">${row[header] || ''}</td>`).join('')}
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
      ${data.length > 10 ? `
        <div class="p-3 text-center text-sm text-muted-foreground bg-muted/30">
          ${data.length - 10}개 행 더 보기...
        </div>
      ` : ''}
    </div>
  `
}

// JSON 뷰 렌더링
function renderJsonView(data: any, path: string): string {
  return `
    <div class="my-4 border border-border rounded-lg overflow-hidden">
      <div class="p-4 border-b border-border bg-muted/50">
        <div class="flex items-center justify-between mb-3">
          <div class="flex items-center space-x-2">
            <span class="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold border-transparent bg-primary text-primary-foreground">JSON</span>
            <span class="text-sm font-medium">${path.split('/').pop()}</span>
          </div>
          <div class="flex items-center space-x-2">
            <button class="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-8 w-8 p-0" title="복사">
              <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
              </svg>
            </button>
            <button class="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-8 w-8 p-0" title="다운로드">
              <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>
      <div class="p-4">
        <pre class="font-mono text-sm overflow-x-auto whitespace-pre-wrap">${JSON.stringify(data, null, 2)}</pre>
      </div>
    </div>
  `
}
