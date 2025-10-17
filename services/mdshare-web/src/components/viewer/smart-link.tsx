'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  ExternalLink, 
  FileText, 
  Image, 
  Code, 
  Download,
  Eye,
  AlertCircle,
  CheckCircle
} from 'lucide-react'
import { mdshareClient } from '@/lib/mdshare-client'
import type { DocumentInfo } from 'mdshare-core'

interface SmartLinkProps {
  href: string
  children: React.ReactNode
  className?: string
}

interface LinkPreview {
  type: 'document' | 'image' | 'external' | 'unknown'
  title?: string
  description?: string
  thumbnail?: string
  status: 'loading' | 'found' | 'not-found' | 'error'
}

export function SmartLink({ href, children, className = '' }: SmartLinkProps) {
  const [preview, setPreview] = useState<LinkPreview | null>(null)
  const [showPreview, setShowPreview] = useState(false)

  useEffect(() => {
    if (href && !isExternalLink(href)) {
      analyzeLink(href)
    }
  }, [href])

  const isExternalLink = (url: string): boolean => {
    return url.startsWith('http://') || 
           url.startsWith('https://') || 
           url.startsWith('mailto:') ||
           url.startsWith('tel:') ||
           url.startsWith('ftp://')
  }

  const analyzeLink = async (linkHref: string) => {
    setPreview({ type: 'unknown', status: 'loading' })

    try {
      // 이미지 파일인지 확인
      if (isImageFile(linkHref)) {
        setPreview({
          type: 'image',
          title: linkHref.split('/').pop() || '이미지',
          thumbnail: linkHref,
          status: 'found'
        })
        return
      }

      // 문서 파일인지 확인
      if (isDocumentFile(linkHref)) {
        const documentInfo = await findDocumentByPath(linkHref)
        if (documentInfo) {
          setPreview({
            type: 'document',
            title: documentInfo.title,
            description: documentInfo.description,
            status: 'found'
          })
        } else {
          setPreview({
            type: 'document',
            title: linkHref.split('/').pop() || '문서',
            status: 'not-found'
          })
        }
        return
      }

      // 기타 파일 타입
      setPreview({
        type: 'unknown',
        title: linkHref.split('/').pop() || '파일',
        status: 'found'
      })

    } catch (error) {
      setPreview({
        type: 'unknown',
        status: 'error'
      })
    }
  }

  const isImageFile = (url: string): boolean => {
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.svg', '.webp', '.bmp', '.ico']
    const lowerUrl = url.toLowerCase()
    return imageExtensions.some(ext => lowerUrl.includes(ext))
  }

  const isDocumentFile = (url: string): boolean => {
    const documentExtensions = ['.md', '.txt', '.pdf', '.doc', '.docx', '.rtf']
    const lowerUrl = url.toLowerCase()
    return documentExtensions.some(ext => lowerUrl.includes(ext))
  }

  const findDocumentByPath = async (path: string): Promise<DocumentInfo | null> => {
    try {
      const documents = mdshareClient.getMockDocuments()
      return documents.find(doc => doc.path === path || doc.path.includes(path)) || null
    } catch (error) {
      return null
    }
  }

  const getLinkIcon = (preview: LinkPreview) => {
    switch (preview.type) {
      case 'document':
        return <FileText className="h-3 w-3" />
      case 'image':
        return <Image className="h-3 w-3" />
      case 'external':
        return <ExternalLink className="h-3 w-3" />
      default:
        return <Code className="h-3 w-3" />
    }
  }

  const getStatusIcon = (status: LinkPreview['status']) => {
    switch (status) {
      case 'loading':
        return <div className="animate-spin rounded-full h-3 w-3 border-b border-current" />
      case 'found':
        return <CheckCircle className="h-3 w-3 text-green-500" />
      case 'not-found':
        return <AlertCircle className="h-3 w-3 text-orange-500" />
      case 'error':
        return <AlertCircle className="h-3 w-3 text-red-500" />
    }
  }

  const renderLinkContent = () => {
    if (isExternalLink(href)) {
      return (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className={`inline-flex items-center space-x-1 text-primary hover:text-primary/80 transition-colors ${className}`}
        >
          {children}
          <ExternalLink className="h-3 w-3" />
        </a>
      )
    }

    // 내부 링크 처리
    if (href.startsWith('/document/')) {
      return (
        <Link
          href={href}
          className={`inline-flex items-center space-x-1 text-primary hover:text-primary/80 transition-colors ${className}`}
        >
          {children}
          {preview && (
            <div className="flex items-center space-x-1">
              {getLinkIcon(preview)}
              {getStatusIcon(preview.status)}
            </div>
          )}
        </Link>
      )
    }

    // 상대 경로 링크
    if (href.startsWith('./') || href.startsWith('../') || !href.startsWith('/')) {
      // 상대 경로를 절대 경로로 변환 (간단한 예시)
      const resolvedPath = resolveRelativePath(href)
      
      return (
        <Link
          href={resolvedPath}
          className={`inline-flex items-center space-x-1 text-primary hover:text-primary/80 transition-colors ${className}`}
          onMouseEnter={() => setShowPreview(true)}
          onMouseLeave={() => setShowPreview(false)}
        >
          {children}
          {preview && (
            <div className="flex items-center space-x-1">
              {getLinkIcon(preview)}
              {getStatusIcon(preview.status)}
            </div>
          )}
        </Link>
      )
    }

    // 기본 링크
    return (
      <a
        href={href}
        className={`inline-flex items-center space-x-1 text-primary hover:text-primary/80 transition-colors ${className}`}
      >
        {children}
        {preview && getLinkIcon(preview)}
      </a>
    )
  }

  const resolveRelativePath = (relativePath: string): string => {
    // 간단한 상대 경로 해결 로직
    if (relativePath.startsWith('./')) {
      return `/document/${relativePath.slice(2)}`
    }
    if (relativePath.startsWith('../')) {
      return `/document/${relativePath.slice(3)}`
    }
    return `/document/${relativePath}`
  }

  return (
    <div className="relative inline-block">
      {renderLinkContent()}
      
      {/* 링크 미리보기 */}
      {showPreview && preview && preview.status === 'found' && (
        <div className="absolute top-full left-0 mt-2 p-3 bg-popover border border-border rounded-lg shadow-lg z-50 min-w-64 max-w-80">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              {preview.type === 'image' && preview.thumbnail ? (
                <img
                  src={preview.thumbnail}
                  alt={preview.title}
                  className="w-12 h-12 object-cover rounded"
                />
              ) : (
                <div className="w-12 h-12 bg-muted rounded flex items-center justify-center">
                  {getLinkIcon(preview)}
                </div>
              )}
            </div>
            
            <div className="flex-1 min-w-0">
              <h4 className="font-medium text-sm truncate">{preview.title}</h4>
              {preview.description && (
                <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                  {preview.description}
                </p>
              )}
              <div className="flex items-center space-x-2 mt-2">
                <Badge variant="outline" className="text-xs">
                  {preview.type === 'document' ? '문서' : 
                   preview.type === 'image' ? '이미지' : '파일'}
                </Badge>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 px-2 text-xs"
                  onClick={() => setShowPreview(false)}
                >
                  <Eye className="h-3 w-3 mr-1" />
                  보기
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
