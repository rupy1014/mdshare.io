'use client'

import { useEffect, useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Download, Copy, Search, Eye, EyeOff } from 'lucide-react'
import Papa from 'papaparse'

// Mermaid 다이어그램 렌더러
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

// CSV 테이블 렌더러
interface CsvRendererProps {
  csvPath: string
}

export function CsvRenderer({ csvPath }: CsvRendererProps) {
  const [data, setData] = useState<any[]>([])
  const [headers, setHeaders] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [sortColumn, setSortColumn] = useState<string | null>(null)
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')
  const [showFullTable, setShowFullTable] = useState(false)

  useEffect(() => {
    const loadCsvData = async () => {
      setIsLoading(true)
      setError(null)

      try {
        // Mock CSV 데이터 (실제로는 파일에서 로드)
        const mockCsvData = getMockCsvData(csvPath)
        
        Papa.parse(mockCsvData, {
          header: true,
          skipEmptyLines: true,
          complete: (results) => {
            if (results.errors.length > 0) {
              setError(`CSV 파싱 오류: ${results.errors[0].message}`)
            } else {
              setData(results.data as any[])
              setHeaders(Object.keys(results.data[0] || {}))
            }
            setIsLoading(false)
          },
          error: (error) => {
            setError(`CSV 로드 오류: ${error.message}`)
            setIsLoading(false)
          }
        })
      } catch (err) {
        setError(err instanceof Error ? err.message : 'CSV 로드 실패')
        setIsLoading(false)
      }
    }

    loadCsvData()
  }, [csvPath])

  const getMockCsvData = (path: string): string => {
    // Mock 데이터 제공
    if (path.includes('students')) {
      return `이름,이메일,전공,학년,상태
홍길동,hong@example.com,컴퓨터공학,3,완료
김철수,kim@example.com,전자공학,2,진행중
이영희,lee@example.com,수학,4,완료
박민수,park@example.com,물리학,1,미완료
정수진,jung@example.com,화학,3,완료`
    }
    
    return `컬럼1,컬럼2,컬럼3
값1,값2,값3
값4,값5,값6`
  }

  const filteredData = data.filter(row =>
    Object.values(row).some(value =>
      String(value).toLowerCase().includes(searchTerm.toLowerCase())
    )
  )

  const sortedData = [...filteredData].sort((a, b) => {
    if (!sortColumn) return 0
    
    const aVal = String(a[sortColumn] || '')
    const bVal = String(b[sortColumn] || '')
    
    if (sortDirection === 'asc') {
      return aVal.localeCompare(bVal)
    } else {
      return bVal.localeCompare(aVal)
    }
  })

  const displayedData = showFullTable ? sortedData : sortedData.slice(0, 10)

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortColumn(column)
      setSortDirection('asc')
    }
  }

  const copyToClipboard = async () => {
    const csvContent = Papa.unparse(data)
    await navigator.clipboard.writeText(csvContent)
    // TODO: 토스트 알림 추가
  }

  const downloadCsv = () => {
    const csvContent = Papa.unparse(data)
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', csvPath.split('/').pop() || 'data.csv')
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  if (isLoading) {
    return (
      <div className="p-4 border border-border rounded-lg bg-muted/50">
        <div className="flex items-center space-x-2">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
          <span className="text-sm text-muted-foreground">CSV 로드 중...</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-4 border border-destructive rounded-lg bg-destructive/10">
        <div className="text-sm text-destructive mb-2">CSV 로드 오류</div>
        <div className="text-xs text-muted-foreground">{error}</div>
      </div>
    )
  }

  return (
    <div className="my-4 border border-border rounded-lg overflow-hidden">
      {/* 헤더 */}
      <div className="p-4 border-b border-border bg-muted/50">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <Badge variant="outline">CSV</Badge>
            <span className="text-sm font-medium">{csvPath.split('/').pop()}</span>
            <span className="text-xs text-muted-foreground">({data.length}행)</span>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={copyToClipboard}
              className="h-8 w-8 p-0"
            >
              <Copy className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={downloadCsv}
              className="h-8 w-8 p-0"
            >
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        {/* 검색 및 컨트롤 */}
        <div className="flex items-center space-x-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <input
              type="text"
              placeholder="검색..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-sm border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          {data.length > 10 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowFullTable(!showFullTable)}
              className="h-8"
            >
              {showFullTable ? (
                <>
                  <EyeOff className="h-4 w-4 mr-1" />
                  간략히
                </>
              ) : (
                <>
                  <Eye className="h-4 w-4 mr-1" />
                  전체보기
                </>
              )}
            </Button>
          )}
        </div>
      </div>

      {/* 테이블 */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted/30">
            <tr>
              {headers.map((header, index) => (
                <th
                  key={index}
                  className="px-4 py-3 text-left text-sm font-medium cursor-pointer hover:bg-muted/50"
                  onClick={() => handleSort(header)}
                >
                  <div className="flex items-center space-x-1">
                    <span>{header}</span>
                    {sortColumn === header && (
                      <span className="text-xs">
                        {sortDirection === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {displayedData.map((row, rowIndex) => (
              <tr key={rowIndex} className="border-b border-border hover:bg-muted/30">
                {headers.map((header, colIndex) => (
                  <td key={colIndex} className="px-4 py-3 text-sm">
                    {String(row[header] || '')}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {!showFullTable && data.length > 10 && (
        <div className="p-3 text-center text-sm text-muted-foreground bg-muted/30">
          {data.length - 10}개 행 더 보기... 전체보기 버튼을 클릭하세요
        </div>
      )}
    </div>
  )
}

// JSON 구조화 뷰 렌더러
interface JsonRendererProps {
  jsonPath: string
}

export function JsonRenderer({ jsonPath }: JsonRendererProps) {
  const [data, setData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [expandedKeys, setExpandedKeys] = useState<Set<string>>(new Set())
  const [viewMode, setViewMode] = useState<'tree' | 'raw'>('tree')

  useEffect(() => {
    const loadJsonData = async () => {
      setIsLoading(true)
      setError(null)

      try {
        // Mock JSON 데이터 (실제로는 파일에서 로드)
        const mockJsonData = getMockJsonData(jsonPath)
        setData(mockJsonData)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'JSON 로드 실패')
      } finally {
        setIsLoading(false)
      }
    }

    loadJsonData()
  }, [jsonPath])

  const getMockJsonData = (path: string): any => {
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

  const toggleExpanded = (key: string) => {
    const newExpanded = new Set(expandedKeys)
    if (newExpanded.has(key)) {
      newExpanded.delete(key)
    } else {
      newExpanded.add(key)
    }
    setExpandedKeys(newExpanded)
  }

  const renderJsonValue = (value: any, key: string, depth: number = 0): React.ReactNode => {
    const indent = '  '.repeat(depth)
    
    if (value === null) {
      return <span className="text-muted-foreground">null</span>
    }
    
    if (typeof value === 'boolean') {
      return <span className="text-blue-600">{String(value)}</span>
    }
    
    if (typeof value === 'number') {
      return <span className="text-green-600">{value}</span>
    }
    
    if (typeof value === 'string') {
      return <span className="text-orange-600">"{value}"</span>
    }
    
    if (Array.isArray(value)) {
      const arrayKey = `${key}-array`
      const isExpanded = expandedKeys.has(arrayKey)
      
      return (
        <div>
          <button
            onClick={() => toggleExpanded(arrayKey)}
            className="text-blue-600 hover:text-blue-800 cursor-pointer"
          >
            {isExpanded ? '▼' : '▶'} Array({value.length})
          </button>
          {isExpanded && (
            <div className="ml-4 mt-1">
              {value.map((item, index) => (
                <div key={index} className="flex">
                  <span className="text-muted-foreground mr-2">{index}:</span>
                  <div className="flex-1">
                    {renderJsonValue(item, `${key}-${index}`, depth + 1)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )
    }
    
    if (typeof value === 'object') {
      const objectKey = `${key}-object`
      const isExpanded = expandedKeys.has(objectKey)
      
      return (
        <div>
          <button
            onClick={() => toggleExpanded(objectKey)}
            className="text-blue-600 hover:text-blue-800 cursor-pointer"
          >
            {isExpanded ? '▼' : '▶'} Object({Object.keys(value).length})
          </button>
          {isExpanded && (
            <div className="ml-4 mt-1">
              {Object.entries(value).map(([k, v]) => (
                <div key={k} className="flex">
                  <span className="text-purple-600 mr-2">"{k}":</span>
                  <div className="flex-1">
                    {renderJsonValue(v, `${key}-${k}`, depth + 1)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )
    }
    
    return <span>{String(value)}</span>
  }

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(JSON.stringify(data, null, 2))
    // TODO: 토스트 알림 추가
  }

  const downloadJson = () => {
    const jsonContent = JSON.stringify(data, null, 2)
    const blob = new Blob([jsonContent], { type: 'application/json;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', jsonPath.split('/').pop() || 'data.json')
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  if (isLoading) {
    return (
      <div className="p-4 border border-border rounded-lg bg-muted/50">
        <div className="flex items-center space-x-2">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
          <span className="text-sm text-muted-foreground">JSON 로드 중...</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-4 border border-destructive rounded-lg bg-destructive/10">
        <div className="text-sm text-destructive mb-2">JSON 로드 오류</div>
        <div className="text-xs text-muted-foreground">{error}</div>
      </div>
    )
  }

  return (
    <div className="my-4 border border-border rounded-lg overflow-hidden">
      {/* 헤더 */}
      <div className="p-4 border-b border-border bg-muted/50">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <Badge variant="outline">JSON</Badge>
            <span className="text-sm font-medium">{jsonPath.split('/').pop()}</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1 bg-background border border-border rounded-md">
              <button
                onClick={() => setViewMode('tree')}
                className={`px-3 py-1 text-xs ${viewMode === 'tree' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'}`}
              >
                Tree
              </button>
              <button
                onClick={() => setViewMode('raw')}
                className={`px-3 py-1 text-xs ${viewMode === 'raw' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'}`}
              >
                Raw
              </button>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={copyToClipboard}
              className="h-8 w-8 p-0"
            >
              <Copy className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={downloadJson}
              className="h-8 w-8 p-0"
            >
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* 콘텐츠 */}
      <div className="p-4">
        {viewMode === 'tree' ? (
          <div className="font-mono text-sm">
            {renderJsonValue(data, 'root')}
          </div>
        ) : (
          <pre className="font-mono text-sm overflow-x-auto">
            {JSON.stringify(data, null, 2)}
          </pre>
        )}
      </div>
    </div>
  )
}
