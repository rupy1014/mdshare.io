'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Download, Copy, Search, Eye, EyeOff } from 'lucide-react'
import Papa from 'papaparse'

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
          error: (error: any) => {
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
