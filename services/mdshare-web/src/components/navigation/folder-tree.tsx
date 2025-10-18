'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  ChevronRight, 
  ChevronDown, 
  FileText, 
  Folder, 
  FolderOpen,
  Plus,
  Star,
  Clock,
  Search,
  MoreHorizontal
} from 'lucide-react'
import { mdshareClient } from '@/lib/mdshare-client'
import type { DocumentInfo } from 'mdshare-core'

interface FolderNode {
  id: string
  name: string
  type: 'folder' | 'document'
  path: string
  children?: FolderNode[]
  isExpanded?: boolean
  isFavorite?: boolean
  lastModified?: Date
}

interface FolderTreeProps {
  onDocumentSelect?: (document: DocumentInfo) => void
  selectedDocumentId?: string
  className?: string
}

export function FolderTree({ 
  onDocumentSelect, 
  selectedDocumentId,
  className = '' 
}: FolderTreeProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [folderStructure, setFolderStructure] = useState<FolderNode[]>([])
  const [recentDocuments, setRecentDocuments] = useState<DocumentInfo[]>([])
  const [favoriteDocuments, setFavoriteDocuments] = useState<DocumentInfo[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // 현재 URL에서 문서 ID 추출
  const currentDocumentId = pathname.startsWith('/document/') 
    ? pathname.split('/document/')[1] 
    : selectedDocumentId

  useEffect(() => {
    loadFolderStructure()
    loadRecentDocuments()
    loadFavoriteDocuments()
  }, [])

  const loadFolderStructure = async () => {
    setIsLoading(true)
    try {
      await mdshareClient.loadSampleProject()
      const documents = await mdshareClient.getDocuments()
      
      // Mock 폴더 구조 생성
      const structure: FolderNode[] = [
        {
          id: 'docs',
          name: 'docs',
          type: 'folder',
          path: '/docs',
          isExpanded: true,
          children: [
            {
              id: '1',
              name: '프로젝트 개요.md',
              type: 'document',
              path: '/docs/overview.md',
              lastModified: new Date('2023-10-27')
            },
            {
              id: '2',
              name: 'API 문서.md',
              type: 'document',
              path: '/docs/api.md',
              lastModified: new Date('2023-10-26')
            },
            {
              id: '3',
              name: '설치 가이드.md',
              type: 'document',
              path: '/docs/installation.md',
              lastModified: new Date('2023-10-25')
            }
          ]
        },
        {
          id: 'guides',
          name: 'guides',
          type: 'folder',
          path: '/guides',
          isExpanded: false,
          children: [
            {
              id: 'getting-started',
              name: '시작하기.md',
              type: 'document',
              path: '/guides/getting-started.md',
              lastModified: new Date('2023-10-24')
            }
          ]
        },
        {
          id: 'assets',
          name: 'assets',
          type: 'folder',
          path: '/assets',
          isExpanded: false,
          children: []
        }
      ]

      setFolderStructure(structure)
    } catch (error) {
      console.error('폴더 구조 로드 실패:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const loadRecentDocuments = async () => {
    try {
      const documents = await mdshareClient.getDocuments()
      // 최근 수정된 순으로 정렬
      const recent = documents
        .sort((a, b) => b.lastModified.getTime() - a.lastModified.getTime())
        .slice(0, 5)
      setRecentDocuments(recent)
    } catch (error) {
      console.error('최근 문서 로드 실패:', error)
    }
  }

  const loadFavoriteDocuments = () => {
    // localStorage에서 즐겨찾기 문서 로드
    const favorites = localStorage.getItem('mdshare-favorites')
    if (favorites) {
      try {
        const favoriteIds = JSON.parse(favorites)
        // Mock 즐겨찾기 문서
        setFavoriteDocuments([
          {
            id: '1',
            title: '프로젝트 개요',
            path: '/docs/overview.md',
            description: 'MDShare 프로젝트의 전체적인 개요와 목표',
            lastModified: new Date('2023-10-27'),
            tags: ['개요', '프로젝트'],
            metadata: {
              wordCount: 1200,
              readingTime: 5,
              author: 'MDShare Team'
            }
          }
        ])
      } catch (error) {
        console.error('즐겨찾기 문서 로드 실패:', error)
      }
    }
  }

  const toggleFolder = (folderId: string) => {
    setFolderStructure(prev => 
      prev.map(node => 
        node.id === folderId 
          ? { ...node, isExpanded: !node.isExpanded }
          : node
      )
    )
  }

  const toggleFavorite = (documentId: string) => {
    const favorites = JSON.parse(localStorage.getItem('mdshare-favorites') || '[]')
    const isFavorite = favorites.includes(documentId)
    
    if (isFavorite) {
      const newFavorites = favorites.filter((id: string) => id !== documentId)
      localStorage.setItem('mdshare-favorites', JSON.stringify(newFavorites))
    } else {
      const newFavorites = [...favorites, documentId]
      localStorage.setItem('mdshare-favorites', JSON.stringify(newFavorites))
    }
    
    loadFavoriteDocuments()
  }

  const renderFolderNode = (node: FolderNode, depth: number = 0): React.ReactNode => {
    const isSelected = currentDocumentId === node.id
    const hasChildren = node.children && node.children.length > 0

    return (
      <div key={node.id}>
        <div
          className={`
            flex items-center space-x-2 py-1.5 px-2 rounded-md cursor-pointer transition-colors
            ${isSelected 
              ? 'bg-primary text-primary-foreground' 
              : 'hover:bg-muted/50 text-muted-foreground hover:text-foreground'
            }
          `}
          style={{ paddingLeft: `${depth * 16 + 8}px` }}
          onClick={() => {
            if (node.type === 'folder') {
              toggleFolder(node.id)
            } else {
              // 문서 선택 처리 - Next.js 라우터 사용
              router.push(`/document/${node.id}`)
            }
          }}
        >
          {node.type === 'folder' ? (
            <Button
              variant="ghost"
              size="sm"
              className="h-4 w-4 p-0 hover:bg-transparent"
              onClick={(e) => {
                e.stopPropagation()
                toggleFolder(node.id)
              }}
            >
              {node.isExpanded ? (
                <ChevronDown className="h-3 w-3" />
              ) : (
                <ChevronRight className="h-3 w-3" />
              )}
            </Button>
          ) : (
            <div className="w-4 h-4" /> // 들여쓰기용 공간
          )}
          
          <div className="flex items-center space-x-2 flex-1 min-w-0">
            {node.type === 'folder' ? (
              node.isExpanded ? (
                <FolderOpen className="h-4 w-4 flex-shrink-0" />
              ) : (
                <Folder className="h-4 w-4 flex-shrink-0" />
              )
            ) : (
              <FileText className="h-4 w-4 flex-shrink-0" />
            )}
            
            <span className="text-sm truncate">{node.name}</span>
            
            {node.type === 'document' && (
              <Button
                variant="ghost"
                size="sm"
                className="h-4 w-4 p-0 ml-auto hover:bg-transparent"
                onClick={(e) => {
                  e.stopPropagation()
                  toggleFavorite(node.id)
                }}
              >
                <Star className="h-3 w-3" />
              </Button>
            )}
          </div>
        </div>

        {node.type === 'folder' && node.isExpanded && hasChildren && (
          <div>
            {node.children!.map(child => renderFolderNode(child, depth + 1))}
          </div>
        )}
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className={`bg-card border border-border rounded-lg p-4 ${className}`}>
        <div className="animate-pulse space-y-2">
          <div className="h-4 bg-muted rounded w-3/4"></div>
          <div className="h-4 bg-muted rounded w-1/2"></div>
          <div className="h-4 bg-muted rounded w-5/6"></div>
        </div>
      </div>
    )
  }

  return (
    <div className={`bg-card border border-border rounded-lg ${className}`}>
      {/* 검색 바 */}
      <div className="p-3 border-b border-border">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="문서 검색..."
            className="w-full pl-10 pr-4 py-2 text-sm border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>

      {/* 즐겨찾기 */}
      {favoriteDocuments.length > 0 && (
        <div className="p-3 border-b border-border">
          <div className="flex items-center space-x-2 mb-2">
            <Star className="h-4 w-4 text-yellow-500" />
            <span className="text-sm font-medium">즐겨찾기</span>
          </div>
          <div className="space-y-1">
            {favoriteDocuments.map((doc) => (
              <Link
                key={doc.id}
                href={`/document/${doc.id}`}
                className="flex items-center space-x-2 py-1.5 px-2 rounded-md hover:bg-muted/50 text-sm"
              >
                <FileText className="h-3 w-3" />
                <span className="truncate">{doc.title}</span>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* 최근 문서 */}
      <div className="p-3 border-b border-border">
        <div className="flex items-center space-x-2 mb-2">
          <Clock className="h-4 w-4 text-blue-500" />
          <span className="text-sm font-medium">최근 문서</span>
        </div>
        <div className="space-y-1">
          {recentDocuments.map((doc) => (
            <Link
              key={doc.id}
              href={`/document/${doc.id}`}
              className="flex items-center space-x-2 py-1.5 px-2 rounded-md hover:bg-muted/50 text-sm"
            >
              <FileText className="h-3 w-3" />
              <span className="truncate">{doc.title}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* 폴더 트리 */}
      <div className="p-3">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium">문서</span>
          <div className="flex items-center space-x-1">
            <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
              <Plus className="h-3 w-3" />
            </Button>
            <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
              <MoreHorizontal className="h-3 w-3" />
            </Button>
          </div>
        </div>
        
        <div className="space-y-1">
          {folderStructure.map(node => renderFolderNode(node))}
        </div>
      </div>
    </div>
  )
}
