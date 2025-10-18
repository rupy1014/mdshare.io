'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Brain,
  Terminal,
  Copy,
  Play,
  BookOpen,
  Search,
  FileText,
  Settings,
  ArrowRight,
  Code,
  Zap
} from 'lucide-react'
import type { ClaudeCommand } from '@/types/document'

interface ClaudeIntegrationProps {
  workspaceId: string
  userRole: 'admin' | 'editor' | 'viewer'
}

interface CommandsByCategory {
  search: ClaudeCommand[]
  analyze: ClaudeCommand[]
  generate: ClaudeCommand[]
  optimize: ClaudeCommand[]
}

export function ClaudeIntegration({ workspaceId, userRole }: ClaudeIntegrationProps) {
  const [commands, setCommands] = useState<CommandsByCategory>({
    search: [],
    analyze: [],
    generate: [],
    optimize: []
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [copiedCommand, setCopiedCommand] = useState<string | null>(null)

  useEffect(() => {
    fetchClaudeCommands()
  }, [workspaceId])

  const fetchClaudeCommands = async () => {
    try {
      const response = await fetch(`/api/workspaces/${workspaceId}/claude/commands`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('mdshare-access-token')}`
        }
      })

      const result = await response.json()

      if (result.success) {
        setCommands(result.data.commands)
      } else {
        setError(result.error?.message || 'Claude 명령어를 불러오는데 실패했습니다')
      }
    } catch (error) {
      setError('네트워크 오류가 발생했습니다')
    } finally {
      setLoading(false)
    }
  }

  const handleCopyCommand = async (command: string) => {
    try {
      await navigator.clipboard.writeText(command)
      setCopiedCommand(command)
      setTimeout(() => setCopiedCommand(null), 2000)
    } catch (error) {
      console.error('클립보드 복사 실패:', error)
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'search': return <Search className="h-4 w-4" />
      case 'analyze': return <Brain className="h-4 w-4" />
      case 'generate': return <FileText className="h-4 w-4" />
      case 'optimize': return <Zap className="h-4 w-4" />
      default: return <Code className="h-4 w-4" />
    }
  }

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'search': return '검색'
      case 'analyze': return '분석'
      case 'generate': return '생성'
      case 'optimize': return '최적화'
      default: return category
    }
  }

  const getCategoryDescription = (category: string) => {
    switch (category) {
      case 'search': return '문서에서 키워드나 내용을 검색합니다'
      case 'analyze': return '문서를 분석하고 요약합니다'
      case 'generate': return '새로운 문서를 생성합니다'
      case 'optimize': return 'Claude Code를 위한 문서 구조를 최적화합니다'
      default: return ''
    }
  }

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4" />
        <p className="text-muted-foreground">Claude 명령어를 불러오는 중...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Brain className="h-5 w-5 text-primary" />
            <span>Claude Code 연동</span>
            <Badge variant="secondary" className="ml-auto">
              <Terminal className="h-3 w-3 mr-1" />
              터미널 도구
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-muted/50 rounded-lg p-4 mb-4">
            <h4 className="font-medium mb-2 flex items-center">
              <BookOpen className="h-4 w-4 mr-2" />
              사용 방법
            </h4>
            <ol className="text-sm text-muted-foreground space-y-1">
              <li>1. 아래 명령어를 복사하여 터미널에서 실행하세요</li>
              <li>2. Claude Code가 설치되어 있어야 합니다</li>
              <li>3. 워크스페이스 ID는 자동으로 포함됩니다</li>
            </ol>
          </div>
          
          {error && (
            <div className="mb-4 p-3 bg-destructive/10 border border-destructive/20 rounded-md">
              <p className="text-sm text-destructive">{error}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 명령어 카테고리별 표시 */}
      {Object.entries(commands).map(([category, categoryCommands]) => (
        <Card key={category}>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              {getCategoryIcon(category)}
              <span>{getCategoryLabel(category)}</span>
              <Badge variant="outline" className="text-xs">
                {categoryCommands.length}개 명령어
              </Badge>
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              {getCategoryDescription(category)}
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {categoryCommands.map((command: any) => (
                <div key={command.id} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-medium flex items-center space-x-2">
                        <span>{command.name}</span>
                        <Badge variant="secondary" className="text-xs">
                          {getCategoryLabel(command.category)}
                        </Badge>
                      </h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        {command.description}
                      </p>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleCopyCommand(command.command)}
                      className="flex items-center space-x-1"
                    >
                      {copiedCommand === command.command ? (
                        <>
                          <span className="text-green-600">복사됨!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="h-4 w-4" />
                          <span>복사</span>
                        </>
                      )}
                    </Button>
                  </div>

                  {/* 명령어 */}
                  <div className="bg-background border rounded p-3 mb-3">
                    <code className="text-sm font-mono">{command.command}</code>
                  </div>

                  {/* 예제 */}
                  {command.examples.length > 0 && (
                    <div>
                      <h5 className="text-sm font-medium mb-2">사용 예제:</h5>
                      <div className="space-y-2">
                        {command.examples.map((example: string, index: number) => (
                          <div key={index} className="bg-muted/50 rounded p-2">
                            <code className="text-xs font-mono">{example}</code>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}

      {/* 설치 안내 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Settings className="h-5 w-5 text-primary" />
            <span>Claude Code 설치</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="bg-muted/50 rounded-lg p-4">
              <h4 className="font-medium mb-2">터미널에서 설치하기</h4>
              <div className="space-y-2">
                <div className="bg-background border rounded p-2">
                  <code className="text-sm">npm install -g @anthropic/claude-code</code>
                </div>
                <div className="bg-background border rounded p-2">
                  <code className="text-sm">claude-code init</code>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <ArrowRight className="h-4 w-4" />
              <span>설치 후 위의 명령어들을 사용하여 문서를 관리할 수 있습니다</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
