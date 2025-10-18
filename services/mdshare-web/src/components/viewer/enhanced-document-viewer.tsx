'use client'

import { useState, useEffect } from 'react'
import { ExtendedMarkdownViewer } from '@/components/markdown/extended-markdown-viewer'
import { TableOfContents } from './table-of-contents'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Share2, 
  Download, 
  Bookmark, 
  Eye,
  EyeOff,
  Maximize2,
  Minimize2,
  Settings,
  Printer
} from 'lucide-react'

import type { DocumentInfo } from 'mdshare-core'

interface EnhancedDocumentViewerProps {
  content: string
  documentInfo?: DocumentInfo
  className?: string
  showToc?: boolean
}

export function EnhancedDocumentViewer({ 
  content, 
  documentInfo,
  className = '',
  showToc: propShowToc = true
}: EnhancedDocumentViewerProps) {
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [showToc, setShowToc] = useState(propShowToc)
  const [isTocCollapsed, setIsTocCollapsed] = useState(false)
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [fontSize, setFontSize] = useState('medium')
  const [lineHeight, setLineHeight] = useState('relaxed')
  const [showMetadata, setShowMetadata] = useState(true)

  useEffect(() => {
    // localStorage에서 사용자 설정 불러오기
    const savedFontSize = localStorage.getItem('mdshare-font-size') || 'medium'
    const savedLineHeight = localStorage.getItem('mdshare-line-height') || 'relaxed'
    const savedShowToc = propShowToc && localStorage.getItem('mdshare-show-toc') !== 'false'
    const savedShowMetadata = localStorage.getItem('mdshare-show-metadata') !== 'false'
    
    setFontSize(savedFontSize)
    setLineHeight(savedLineHeight)
    setShowToc(savedShowToc)
    setShowMetadata(savedShowMetadata)
  }, [])

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen)
  }

  const toggleBookmark = () => {
    setIsBookmarked(!isBookmarked)
    // TODO: 북마크 저장 로직 구현
  }

  const handleFontSizeChange = (size: string) => {
    setFontSize(size)
    localStorage.setItem('mdshare-font-size', size)
  }

  const handleLineHeightChange = (height: string) => {
    setLineHeight(height)
    localStorage.setItem('mdshare-line-height', height)
  }

  const toggleToc = () => {
    setShowToc(!showToc)
    localStorage.setItem('mdshare-show-toc', String(!showToc))
  }

  const toggleMetadata = () => {
    setShowMetadata(!showMetadata)
    localStorage.setItem('mdshare-show-metadata', String(!showMetadata))
  }

  const printDocument = () => {
    window.print()
  }

  const shareDocument = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: documentInfo?.title || '문서',
          text: documentInfo?.description || '',
          url: window.location.href
        })
      } catch (error) {
        console.log('공유 취소됨')
      }
    } else {
      // 클립보드에 링크 복사
      await navigator.clipboard.writeText(window.location.href)
      // TODO: 토스트 알림 표시
    }
  }

  const downloadDocument = () => {
    const blob = new Blob([content], { type: 'text/markdown;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `${documentInfo?.title || 'document'}.md`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const getFontSizeClass = (size: string) => {
    switch (size) {
      case 'small': return 'text-sm'
      case 'medium': return 'text-base'
      case 'large': return 'text-lg'
      case 'xl': return 'text-xl'
      default: return 'text-base'
    }
  }

  const getLineHeightClass = (height: string) => {
    switch (height) {
      case 'compact': return 'leading-tight'
      case 'normal': return 'leading-normal'
      case 'relaxed': return 'leading-relaxed'
      case 'loose': return 'leading-loose'
      default: return 'leading-relaxed'
    }
  }

  return (
    <div className={`enhanced-document-viewer ${isFullscreen ? 'fixed inset-0 z-50 bg-background' : ''} ${className}`}>
      {/* 툴바 */}
      <div className="border-b border-border bg-background sticky top-0 z-10">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center space-x-4">
            {/* 폰트 크기 설정 */}
            <div className="flex items-center space-x-2">
              <span className="text-sm text-muted-foreground">폰트:</span>
              <div className="flex items-center space-x-1">
                {['small', 'medium', 'large', 'xl'].map((size) => (
                  <Button
                    key={size}
                    variant={fontSize === size ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => handleFontSizeChange(size)}
                    className="h-8 px-2 text-xs"
                  >
                    {size === 'small' ? 'S' : 
                     size === 'medium' ? 'M' : 
                     size === 'large' ? 'L' : 'XL'}
                  </Button>
                ))}
              </div>
            </div>

            {/* 줄 간격 설정 */}
            <div className="flex items-center space-x-2">
              <span className="text-sm text-muted-foreground">간격:</span>
              <div className="flex items-center space-x-1">
                {['compact', 'normal', 'relaxed', 'loose'].map((height) => (
                  <Button
                    key={height}
                    variant={lineHeight === height ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => handleLineHeightChange(height)}
                    className="h-8 px-2 text-xs"
                  >
                    {height === 'compact' ? '좁게' :
                     height === 'normal' ? '보통' :
                     height === 'relaxed' ? '넓게' : '매우 넓게'}
                  </Button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {/* 목차 토글 */}
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleToc}
              className="h-8 px-3"
            >
              {showToc ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
              목차
            </Button>

            {/* 메타데이터 토글 */}
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleMetadata}
              className="h-8 px-3"
            >
              <Settings className="h-4 w-4" />
            </Button>

            {/* 북마크 */}
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleBookmark}
              className="h-8 px-3"
            >
              {isBookmarked ? (
                <Bookmark className="h-4 w-4 text-primary" />
              ) : (
                <Bookmark className="h-4 w-4" />
              )}
            </Button>

            {/* 공유 */}
            <Button
              variant="ghost"
              size="sm"
              onClick={shareDocument}
              className="h-8 px-3"
            >
              <Share2 className="h-4 w-4" />
            </Button>

            {/* 다운로드 */}
            <Button
              variant="ghost"
              size="sm"
              onClick={downloadDocument}
              className="h-8 px-3"
            >
              <Download className="h-4 w-4" />
            </Button>

            {/* 인쇄 */}
            <Button
              variant="ghost"
              size="sm"
              onClick={printDocument}
              className="h-8 px-3"
            >
              <Printer className="h-4 w-4" />
            </Button>

            {/* 전체화면 */}
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleFullscreen}
              className="h-8 px-3"
            >
              {isFullscreen ? (
                <Minimize2 className="h-4 w-4" />
              ) : (
                <Maximize2 className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* 메인 콘텐츠 */}
      <div className="flex">
        {/* 목차 사이드바 */}
        {showToc && (
          <div className="w-80 border-r border-border bg-muted/20 p-4 overflow-y-auto max-h-screen sticky top-16">
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-muted-foreground">목차</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsTocCollapsed(!isTocCollapsed)}
                  className="h-6 w-6 p-0"
                >
                  {isTocCollapsed ? (
                    <Eye className="h-3 w-3" />
                  ) : (
                    <EyeOff className="h-3 w-3" />
                  )}
                </Button>
              </div>
              {!isTocCollapsed && (
                <div className="max-h-96 overflow-y-auto border rounded-lg p-3 bg-background">
                  <TableOfContents content={content} />
                </div>
              )}
            </div>
          </div>
        )}

        {/* 문서 내용 */}
        <div className="flex-1">
          <div className="max-w-4xl mx-auto p-6">
            {/* 문서 메타데이터 */}
            {showMetadata && documentInfo && (
              <div className="mb-8 border-b border-border pb-6">
                <h1 className="text-3xl font-bold mb-4">{documentInfo.title}</h1>
                <p className="text-lg text-muted-foreground mb-4">{documentInfo.description}</p>
                
                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                  <span>작성자: {documentInfo.metadata.author}</span>
                  <span>수정일: {documentInfo.lastModified.toLocaleDateString('ko-KR')}</span>
                  <span>{documentInfo.metadata.wordCount} 단어</span>
                  <span>{documentInfo.metadata.readingTime}분 읽기</span>
                </div>

                {documentInfo.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-4">
                    {documentInfo.tags.map((tag, index) => (
                      <Badge key={index} variant="outline">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* 마크다운 콘텐츠 */}
            <div className={`prose prose-slate dark:prose-invert max-w-none ${getFontSizeClass(fontSize)} ${getLineHeightClass(lineHeight)}`}>
              <ExtendedMarkdownViewer content={content} />
            </div>
          </div>
        </div>
      </div>

      {/* 전체화면일 때 닫기 버튼 */}
      {isFullscreen && (
        <div className="fixed top-4 right-4 z-50">
          <Button
            variant="outline"
            size="sm"
            onClick={toggleFullscreen}
            className="bg-background/80 backdrop-blur-sm"
          >
            <Minimize2 className="h-4 w-4 mr-2" />
            전체화면 종료
          </Button>
        </div>
      )}
    </div>
  )
}
