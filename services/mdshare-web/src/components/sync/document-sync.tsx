'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  GitBranch,
  Upload,
  Download,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  Clock,
  FileText,
  ArrowUpDown,
  ExternalLink
} from 'lucide-react'
import type { DocumentSyncInfo } from '@/types/document'

interface DocumentSyncProps {
  workspaceId: string
  userRole: 'admin' | 'editor' | 'viewer'
}

export function DocumentSync({ workspaceId, userRole }: DocumentSyncProps) {
  const [syncInfo, setSyncInfo] = useState<DocumentSyncInfo[]>([])
  const [loading, setLoading] = useState(true)
  const [syncing, setSyncing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [syncStrategy, setSyncStrategy] = useState<'push' | 'pull' | 'sync'>('sync')

  useEffect(() => {
    fetchSyncStatus()
  }, [workspaceId])

  const fetchSyncStatus = async () => {
    try {
      const response = await fetch(`/api/workspaces/${workspaceId}/sync`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('mdshare-access-token')}`
        }
      })

      const result = await response.json()

      if (result.success) {
        setSyncInfo(result.data)
      } else {
        setError(result.error?.message || '동기화 상태를 불러오는데 실패했습니다')
      }
    } catch (error) {
      setError('네트워크 오류가 발생했습니다')
    } finally {
      setLoading(false)
    }
  }

  const handleSync = async (strategy: 'push' | 'pull' | 'sync') => {
    if (userRole === 'viewer') {
      alert('뷰어 권한으로는 동기화를 수행할 수 없습니다')
      return
    }

    setSyncing(true)
    setError(null)

    try {
      const response = await fetch(`/api/workspaces/${workspaceId}/sync`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('mdshare-access-token')}`
        },
        body: JSON.stringify({
          workspaceId,
          documents: syncInfo,
          strategy
        })
      })

      const result = await response.json()

      if (result.success) {
        // 동기화 성공 후 상태 새로고침
        await fetchSyncStatus()
        alert(`${getStrategyLabel(strategy)} 완료!`)
      } else {
        setError(result.error?.message || '동기화에 실패했습니다')
      }
    } catch (error) {
      setError('네트워크 오류가 발생했습니다')
    } finally {
      setSyncing(false)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'synced':
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case 'modified':
        return <AlertCircle className="h-4 w-4 text-yellow-600" />
      case 'conflict':
        return <AlertCircle className="h-4 w-4 text-red-600" />
      case 'pending':
        return <Clock className="h-4 w-4 text-blue-600" />
      default:
        return <Clock className="h-4 w-4 text-gray-600" />
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'synced': return '동기화됨'
      case 'modified': return '수정됨'
      case 'conflict': return '충돌'
      case 'pending': return '대기중'
      default: return '알 수 없음'
    }
  }

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'synced': return 'default'
      case 'modified': return 'secondary'
      case 'conflict': return 'destructive'
      case 'pending': return 'outline'
      default: return 'outline'
    }
  }

  const getStrategyIcon = (strategy: string) => {
    switch (strategy) {
      case 'push': return <Upload className="h-4 w-4" />
      case 'pull': return <Download className="h-4 w-4" />
      case 'sync': return <ArrowUpDown className="h-4 w-4" />
      default: return <RefreshCw className="h-4 w-4" />
    }
  }

  const getStrategyLabel = (strategy: string) => {
    switch (strategy) {
      case 'push': return 'Push (로컬 → 원격)'
      case 'pull': return 'Pull (원격 → 로컬)'
      case 'sync': return 'Sync (양방향 동기화)'
      default: return strategy
    }
  }

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleString('ko-KR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getModifiedCount = () => {
    return syncInfo.filter(sync => sync.status === 'modified').length
  }

  const getConflictCount = () => {
    return syncInfo.filter(sync => sync.status === 'conflict').length
  }

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4" />
        <p className="text-muted-foreground">동기화 상태를 불러오는 중...</p>
      </div>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <GitBranch className="h-5 w-5 text-primary" />
          <span>문서 동기화</span>
          <Badge variant="outline" className="text-xs">
            {syncInfo.length}개 문서
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {error && (
          <div className="mb-4 p-3 bg-destructive/10 border border-destructive/20 rounded-md">
            <p className="text-sm text-destructive">{error}</p>
          </div>
        )}

        {/* 동기화 요약 */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="text-center p-3 bg-muted/50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">
              {syncInfo.filter(s => s.status === 'synced').length}
            </div>
            <div className="text-sm text-muted-foreground">동기화됨</div>
          </div>
          <div className="text-center p-3 bg-muted/50 rounded-lg">
            <div className="text-2xl font-bold text-yellow-600">
              {getModifiedCount()}
            </div>
            <div className="text-sm text-muted-foreground">수정됨</div>
          </div>
          <div className="text-center p-3 bg-muted/50 rounded-lg">
            <div className="text-2xl font-bold text-red-600">
              {getConflictCount()}
            </div>
            <div className="text-sm text-muted-foreground">충돌</div>
          </div>
        </div>

        {/* 동기화 버튼들 */}
        {userRole !== 'viewer' && (
          <div className="flex flex-wrap gap-2 mb-6">
            <Button 
              onClick={() => handleSync('push')}
              disabled={syncing}
              variant="outline"
              className="flex items-center space-x-2"
            >
              <Upload className="h-4 w-4" />
              <span>Push</span>
            </Button>
            <Button 
              onClick={() => handleSync('pull')}
              disabled={syncing}
              variant="outline"
              className="flex items-center space-x-2"
            >
              <Download className="h-4 w-4" />
              <span>Pull</span>
            </Button>
            <Button 
              onClick={() => handleSync('sync')}
              disabled={syncing}
              className="flex items-center space-x-2"
            >
              {syncing ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                <ArrowUpDown className="h-4 w-4" />
              )}
              <span>Sync</span>
            </Button>
          </div>
        )}

        {/* 문서 동기화 상태 목록 */}
        <div className="space-y-3">
          {syncInfo.map((sync) => (
            <div key={sync.documentId} className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors">
              <div className="flex items-center space-x-3">
                <FileText className="h-5 w-5 text-muted-foreground" />
                <div>
                  <h4 className="font-medium">{sync.remotePath}</h4>
                  <p className="text-sm text-muted-foreground">
                    로컬: {sync.localPath}
                  </p>
                  <div className="flex items-center space-x-2 mt-1">
                    {getStatusIcon(sync.status)}
                    <Badge variant={getStatusBadgeVariant(sync.status)} className="text-xs">
                      {getStatusLabel(sync.status)}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {formatDate(sync.lastSync)}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <code className="text-xs bg-muted px-2 py-1 rounded">
                  {sync.gitHash.substring(0, 8)}
                </code>
                {userRole !== 'viewer' && (
                  <Button variant="ghost" size="sm">
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          ))}

          {syncInfo.length === 0 && (
            <div className="text-center py-8">
              <GitBranch className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-medium mb-2">동기화된 문서가 없습니다</h3>
              <p className="text-sm text-muted-foreground">
                문서를 동기화하려면 Git 저장소를 연결하세요
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
