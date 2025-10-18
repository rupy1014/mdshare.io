'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { 
  Share2, 
  Copy, 
  Link as LinkIcon,
  Users,
  Settings,
  Eye,
  EyeOff,
  CheckCircle,
  AlertCircle
} from 'lucide-react'

interface ShareSettings {
  allowView: boolean
  allowEdit: boolean
  allowComment: boolean
  requireApproval: boolean
  expiresAt?: Date
}

interface ShareLink {
  id: string
  url: string
  permissions: ShareSettings
  createdAt: Date
  isActive: boolean
  accessCount: number
}

interface WorkspaceShareProps {
  workspaceId: string
  workspaceName: string
}

export function WorkspaceShare({ workspaceId, workspaceName }: WorkspaceShareProps) {
  const [shareLinks, setShareLinks] = useState<ShareLink[]>([])
  const [isCreating, setIsCreating] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [shareSettings, setShareSettings] = useState<ShareSettings>({
    allowView: true,
    allowEdit: false,
    allowComment: true,
    requireApproval: false
  })

  const generateShareLink = async () => {
    setIsCreating(true)
    try {
      // 실제로는 API 호출
      const newLink: ShareLink = {
        id: `share_${Date.now()}`,
        url: `${window.location.origin}/share/${workspaceId}/${generateRandomId()}`,
        permissions: { ...shareSettings },
        createdAt: new Date(),
        isActive: true,
        accessCount: 0
      }
      
      setShareLinks(prev => [newLink, ...prev])
      setShowSettings(false)
    } catch (error) {
      console.error('공유 링크 생성 실패:', error)
    } finally {
      setIsCreating(false)
    }
  }

  const generateRandomId = () => {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
  }

  const copyToClipboard = async (url: string) => {
    await navigator.clipboard.writeText(url)
    // TODO: 토스트 알림 추가
  }

  const toggleLinkStatus = (linkId: string) => {
    setShareLinks(prev => prev.map(link => 
      link.id === linkId ? { ...link, isActive: !link.isActive } : link
    ))
  }

  const deleteLink = (linkId: string) => {
    setShareLinks(prev => prev.filter(link => link.id !== linkId))
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Share2 className="h-5 w-5 text-primary" />
          <span>워크스페이스 공유</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* 공유 링크 생성 */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-medium">공유 링크 생성</h3>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowSettings(!showSettings)}
              >
                <Settings className="h-4 w-4 mr-1" />
                설정
              </Button>
            </div>

            {/* 공유 설정 */}
            {showSettings && (
              <Card className="bg-muted/30">
                <CardContent className="p-4">
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-3">권한 설정</h4>
                      <div className="space-y-2">
                        <label className="flex items-center space-x-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={shareSettings.allowView}
                            onChange={(e) => setShareSettings(prev => ({ ...prev, allowView: e.target.checked }))}
                            className="text-primary"
                          />
                          <Eye className="h-4 w-4" />
                          <span className="text-sm">보기 권한</span>
                        </label>
                        <label className="flex items-center space-x-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={shareSettings.allowEdit}
                            onChange={(e) => setShareSettings(prev => ({ ...prev, allowEdit: e.target.checked }))}
                            className="text-primary"
                          />
                          <Users className="h-4 w-4" />
                          <span className="text-sm">편집 권한</span>
                        </label>
                        <label className="flex items-center space-x-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={shareSettings.allowComment}
                            onChange={(e) => setShareSettings(prev => ({ ...prev, allowComment: e.target.checked }))}
                            className="text-primary"
                          />
                          <span className="text-sm">댓글 권한</span>
                        </label>
                        <label className="flex items-center space-x-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={shareSettings.requireApproval}
                            onChange={(e) => setShareSettings(prev => ({ ...prev, requireApproval: e.target.checked }))}
                            className="text-primary"
                          />
                          <CheckCircle className="h-4 w-4" />
                          <span className="text-sm">승인 필요</span>
                        </label>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            <Button 
              onClick={generateShareLink}
              disabled={isCreating}
              className="w-full"
            >
              {isCreating ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2" />
                  생성 중...
                </>
              ) : (
                <>
                  <Share2 className="h-4 w-4 mr-2" />
                  공유 링크 생성
                </>
              )}
            </Button>
          </div>

          {/* 공유 링크 목록 */}
          {shareLinks.length > 0 && (
            <div className="space-y-3">
              <h3 className="font-medium">생성된 공유 링크</h3>
              {shareLinks.map((link) => (
                <Card key={link.id} className="bg-muted/30">
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      {/* 링크 정보 */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <LinkIcon className="h-4 w-4 text-muted-foreground" />
                          <code className="text-sm bg-background px-2 py-1 rounded">
                            {link.url.split('/').pop()}
                          </code>
                          <Badge variant={link.isActive ? 'default' : 'secondary'}>
                            {link.isActive ? '활성' : '비활성'}
                          </Badge>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard(link.url)}
                            className="h-8 w-8 p-0"
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleLinkStatus(link.id)}
                            className="h-8 w-8 p-0"
                          >
                            {link.isActive ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </Button>
                        </div>
                      </div>

                      {/* 권한 정보 */}
                      <div className="flex items-center space-x-2">
                        {link.permissions.allowView && (
                          <Badge variant="outline" className="text-xs">
                            <Eye className="h-3 w-3 mr-1" />
                            보기
                          </Badge>
                        )}
                        {link.permissions.allowEdit && (
                          <Badge variant="outline" className="text-xs">
                            <Users className="h-3 w-3 mr-1" />
                            편집
                          </Badge>
                        )}
                        {link.permissions.allowComment && (
                          <Badge variant="outline" className="text-xs">
                            댓글
                          </Badge>
                        )}
                        {link.permissions.requireApproval && (
                          <Badge variant="outline" className="text-xs">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            승인 필요
                          </Badge>
                        )}
                      </div>

                      {/* 통계 정보 */}
                      <div className="text-xs text-muted-foreground">
                        생성일: {link.createdAt.toLocaleDateString()} • 
                        접근 횟수: {link.accessCount}회
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* 안내 메시지 */}
          <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium text-blue-900 dark:text-blue-100 mb-1">
                  공유 링크 사용법
                </p>
                <ul className="text-blue-700 dark:text-blue-300 space-y-1">
                  <li>• 생성된 링크를 복사하여 팀원들에게 공유하세요</li>
                  <li>• 링크를 비활성화하면 더 이상 접근할 수 없습니다</li>
                  <li>• 권한 설정을 통해 접근 범위를 제어할 수 있습니다</li>
                  <li>• 언제든지 링크를 삭제하거나 수정할 수 있습니다</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
