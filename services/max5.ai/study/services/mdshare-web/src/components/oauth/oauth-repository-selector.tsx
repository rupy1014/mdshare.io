'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { 
  Search, 
  Star, 
  Eye, 
  Lock, 
  Unlock, 
  GitBranch,
  Calendar,
  Code,
  FileText,
  RefreshCw,
  CheckCircle,
  AlertCircle
} from 'lucide-react'
import { oauthService } from '@/lib/oauth-service'
import type { OAuthRepository, OAuthSession } from '@/types/oauth'

interface OAuthRepositorySelectorProps {
  session: OAuthSession
  onRepositorySelect?: (repository: OAuthRepository) => void
  onLogout?: () => void
}

export function OAuthRepositorySelector({ 
  session, 
  onRepositorySelect, 
  onLogout 
}: OAuthRepositorySelectorProps) {
  const [repositories, setRepositories] = useState<OAuthRepository[]>([])
  const [filteredRepos, setFilteredRepos] = useState<OAuthRepository[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState<'all' | 'private' | 'public' | 'can-edit'>('all')

  useEffect(() => {
    loadRepositories()
  }, [session])

  useEffect(() => {
    filterRepositories()
  }, [repositories, searchTerm, filterType])

  const loadRepositories = async () => {
    try {
      setIsLoading(true)
      const repos = await oauthService.getUserRepositories(session.provider, session.accessToken)
      setRepositories(repos)
    } catch (error) {
      console.error('저장소 목록 로드 실패:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const filterRepositories = () => {
    let filtered = repositories

    // 검색어 필터
    if (searchTerm) {
      filtered = filtered.filter(repo =>
        repo.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        repo.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        repo.fullName.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // 타입 필터
    switch (filterType) {
      case 'private':
        filtered = filtered.filter(repo => repo.isPrivate)
        break
      case 'public':
        filtered = filtered.filter(repo => !repo.isPrivate)
        break
      case 'can-edit':
        filtered = filtered.filter(repo => repo.permissions.push)
        break
      default:
        // 'all' - 필터 없음
        break
    }

    setFilteredRepos(filtered)
  }

  const getLanguageIcon = (language?: string) => {
    if (!language) return <Code className="h-4 w-4" />
    
    switch (language.toLowerCase()) {
      case 'typescript':
      case 'javascript':
        return <Code className="h-4 w-4 text-yellow-500" />
      case 'markdown':
        return <FileText className="h-4 w-4 text-blue-500" />
      default:
        return <Code className="h-4 w-4 text-gray-500" />
    }
  }

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / 1024 / 1024).toFixed(1)} MB`
  }

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const getPermissionBadge = (repo: OAuthRepository) => {
    if (repo.permissions.admin) {
      return <Badge variant="destructive" className="text-xs">관리자</Badge>
    }
    if (repo.permissions.push) {
      return <Badge variant="default" className="text-xs">편집 가능</Badge>
    }
    return <Badge variant="secondary" className="text-xs">읽기 전용</Badge>
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <RefreshCw className="h-6 w-6 animate-spin" />
        <span className="ml-2">저장소 목록을 불러오는 중...</span>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">저장소 선택</h2>
          <p className="text-muted-foreground">
            작업할 저장소를 선택해주세요
          </p>
        </div>
        
        <Button variant="outline" onClick={onLogout}>
          다른 계정으로 로그인
        </Button>
      </div>

      {/* 검색 및 필터 */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="저장소 검색..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button
                variant={filterType === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilterType('all')}
              >
                전체
              </Button>
              <Button
                variant={filterType === 'can-edit' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilterType('can-edit')}
              >
                편집 가능
              </Button>
              <Button
                variant={filterType === 'public' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilterType('public')}
              >
                공개
              </Button>
              <Button
                variant={filterType === 'private' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilterType('private')}
              >
                비공개
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 저장소 목록 */}
      <div className="grid gap-4">
        {filteredRepos.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <AlertCircle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">
                {searchTerm ? '검색 결과가 없습니다' : '저장소가 없습니다'}
              </h3>
              <p className="text-muted-foreground">
                {searchTerm ? '다른 검색어를 시도해보세요.' : '이 계정에는 접근 가능한 저장소가 없습니다.'}
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredRepos.map((repo) => (
            <Card key={repo.id} className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => onRepositorySelect?.(repo)}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold">{repo.name}</h3>
                      {repo.isPrivate ? (
                        <Lock className="h-4 w-4 text-red-500" />
                      ) : (
                        <Unlock className="h-4 w-4 text-green-500" />
                      )}
                      {getPermissionBadge(repo)}
                    </div>
                    
                    {repo.description && (
                      <p className="text-sm text-muted-foreground mb-3">
                        {repo.description}
                      </p>
                    )}
                    
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <div className="flex items-center space-x-1">
                        <GitBranch className="h-3 w-3" />
                        <span>{repo.defaultBranch}</span>
                      </div>
                      
                      <div className="flex items-center space-x-1">
                        {getLanguageIcon(repo.language)}
                        <span>{repo.language || 'Unknown'}</span>
                      </div>
                      
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-3 w-3" />
                        <span>{formatDate(repo.lastPushedAt)}</span>
                      </div>
                      
                      <div className="flex items-center space-x-1">
                        <FileText className="h-3 w-3" />
                        <span>{formatSize(repo.size)}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        window.open(repo.url, '_blank')
                      }}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      보기
                    </Button>
                    
                    {repo.permissions.push && (
                      <Button
                        variant="default"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation()
                          onRepositorySelect?.(repo)
                        }}
                      >
                        <CheckCircle className="h-4 w-4 mr-1" />
                        선택
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* 통계 정보 */}
      <Card className="bg-muted/50">
        <CardContent className="p-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">
              총 {repositories.length}개 저장소 중 {filteredRepos.length}개 표시
            </span>
            <div className="flex items-center space-x-4">
              <span>편집 가능: {repositories.filter(r => r.permissions.push).length}개</span>
              <span>공개: {repositories.filter(r => !r.isPrivate).length}개</span>
              <span>비공개: {repositories.filter(r => r.isPrivate).length}개</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
