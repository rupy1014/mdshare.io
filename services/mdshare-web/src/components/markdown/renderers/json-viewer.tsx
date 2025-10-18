'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Download, Copy } from 'lucide-react'

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
