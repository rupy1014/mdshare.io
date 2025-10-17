'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  List, 
  ChevronRight, 
  ChevronDown, 
  Hash,
  BookOpen,
  Clock,
  FileText
} from 'lucide-react'

interface HeadingItem {
  id: string
  level: number
  text: string
  children: HeadingItem[]
}

interface TableOfContentsProps {
  content: string
  className?: string
}

export function TableOfContents({ content, className = '' }: TableOfContentsProps) {
  const [headings, setHeadings] = useState<HeadingItem[]>([])
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set())
  const [activeHeading, setActiveHeading] = useState<string>('')
  const [isCollapsed, setIsCollapsed] = useState(false)

  useEffect(() => {
    const extractedHeadings = extractHeadings(content)
    setHeadings(extractedHeadings)
    
    // 첫 번째 헤딩을 기본 활성화
    if (extractedHeadings.length > 0) {
      setActiveHeading(extractedHeadings[0].id)
    }
  }, [content])

  useEffect(() => {
    const handleScroll = () => {
      const headingElements = document.querySelectorAll('h1, h2, h3, h4, h5, h6')
      let currentHeading = ''

      headingElements.forEach((heading) => {
        const rect = heading.getBoundingClientRect()
        if (rect.top <= 100) {
          currentHeading = heading.id
        }
      })

      if (currentHeading) {
        setActiveHeading(currentHeading)
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const extractHeadings = (content: string): HeadingItem[] => {
    const lines = content.split('\n')
    const headings: HeadingItem[] = []
    const stack: HeadingItem[] = []

    lines.forEach((line, index) => {
      const match = line.match(/^(#{1,6})\s+(.+)$/)
      if (match) {
        const level = match[1].length
        const text = match[2].trim()
        const id = generateHeadingId(text)

        const heading: HeadingItem = {
          id,
          level,
          text,
          children: []
        }

        // 스택을 사용하여 계층 구조 생성
        while (stack.length > 0 && stack[stack.length - 1].level >= level) {
          stack.pop()
        }

        if (stack.length === 0) {
          headings.push(heading)
        } else {
          stack[stack.length - 1].children.push(heading)
        }

        stack.push(heading)
      }
    })

    return headings
  }

  const generateHeadingId = (text: string): string => {
    return text
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()
  }

  const toggleExpanded = (headingId: string) => {
    const newExpanded = new Set(expandedItems)
    if (newExpanded.has(headingId)) {
      newExpanded.delete(headingId)
    } else {
      newExpanded.add(headingId)
    }
    setExpandedItems(newExpanded)
  }

  const scrollToHeading = (headingId: string) => {
    const element = document.getElementById(headingId)
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start',
        inline: 'nearest'
      })
    }
  }

  const renderHeading = (heading: HeadingItem, depth: number = 0): React.ReactNode => {
    const isExpanded = expandedItems.has(heading.id)
    const isActive = activeHeading === heading.id
    const hasChildren = heading.children.length > 0

    return (
      <div key={heading.id} className="select-none">
        <div
          className={`
            flex items-center space-x-2 py-1.5 px-2 rounded-md cursor-pointer transition-colors
            ${isActive 
              ? 'bg-primary text-primary-foreground' 
              : 'hover:bg-muted/50 text-muted-foreground hover:text-foreground'
            }
          `}
          style={{ paddingLeft: `${depth * 12 + 8}px` }}
          onClick={() => {
            scrollToHeading(heading.id)
            if (hasChildren) {
              toggleExpanded(heading.id)
            }
          }}
        >
          {hasChildren && (
            <Button
              variant="ghost"
              size="sm"
              className="h-4 w-4 p-0 hover:bg-transparent"
              onClick={(e) => {
                e.stopPropagation()
                toggleExpanded(heading.id)
              }}
            >
              {isExpanded ? (
                <ChevronDown className="h-3 w-3" />
              ) : (
                <ChevronRight className="h-3 w-3" />
              )}
            </Button>
          )}
          
          <div className="flex items-center space-x-1 flex-1 min-w-0">
            <Hash className="h-3 w-3 flex-shrink-0" />
            <span className="text-sm truncate">{heading.text}</span>
          </div>
          
          {isActive && (
            <div className="w-1 h-4 bg-primary-foreground rounded-full flex-shrink-0" />
          )}
        </div>

        {hasChildren && isExpanded && (
          <div>
            {heading.children.map(child => renderHeading(child, depth + 1))}
          </div>
        )}
      </div>
    )
  }

  const getReadingTime = (): number => {
    const words = content
      .replace(/```[\s\S]*?```/g, '') // 코드 블록 제거
      .replace(/`[^`]+`/g, '') // 인라인 코드 제거
      .replace(/#{1,6}\s+/g, '') // 헤딩 마커 제거
      .replace(/^\s*[-*+]\s+/gm, '') // 리스트 마커 제거
      .replace(/^\s*\d+\.\s+/gm, '') // 번호 리스트 마커 제거
      .replace(/\s+/g, ' ') // 공백 정규화
      .trim()
      .split(' ')
      .filter(word => word.length > 0).length

    return Math.ceil(words / 200) // 200 단어/분
  }

  const getWordCount = (): number => {
    return content
      .replace(/```[\s\S]*?```/g, '')
      .replace(/`[^`]+`/g, '')
      .replace(/#{1,6}\s+/g, '')
      .replace(/^\s*[-*+]\s+/gm, '')
      .replace(/^\s*\d+\.\s+/gm, '')
      .replace(/\s+/g, ' ')
      .trim()
      .split(' ')
      .filter(word => word.length > 0).length
  }

  if (headings.length === 0) {
    return null
  }

  return (
    <div className={`bg-card border border-border rounded-lg ${className}`}>
      {/* 헤더 */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <BookOpen className="h-4 w-4 text-primary" />
            <span className="font-medium text-sm">목차</span>
            <Badge variant="secondary" className="text-xs">
              {headings.length}
            </Badge>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="h-6 w-6 p-0"
          >
            {isCollapsed ? (
              <ChevronRight className="h-3 w-3" />
            ) : (
              <ChevronDown className="h-3 w-3" />
            )}
          </Button>
        </div>
        
        {!isCollapsed && (
          <div className="flex items-center space-x-4 mt-2 text-xs text-muted-foreground">
            <div className="flex items-center space-x-1">
              <FileText className="h-3 w-3" />
              <span>{getWordCount()} 단어</span>
            </div>
            <div className="flex items-center space-x-1">
              <Clock className="h-3 w-3" />
              <span>{getReadingTime()}분 읽기</span>
            </div>
          </div>
        )}
      </div>

      {/* 목차 내용 */}
      {!isCollapsed && (
        <div className="p-2 max-h-96 overflow-y-auto">
          {headings.map(heading => renderHeading(heading))}
        </div>
      )}
    </div>
  )
}
