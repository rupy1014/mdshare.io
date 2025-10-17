'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { FileText, Calendar, Tag } from 'lucide-react'
import { mdshareClient } from '@/lib/mdshare-client'
import type { DocumentInfo } from 'mdshare-core'

interface DocumentGridProps {
  documents?: DocumentInfo[]
  loading?: boolean
}

export function DocumentGrid({ documents: propDocuments, loading: propLoading }: DocumentGridProps) {
  const [documents, setDocuments] = useState<DocumentInfo[]>([])
  const [loading, setLoading] = useState(true)

  // Props가 전달되면 사용, 아니면 내부 상태 사용
  const displayDocuments = propDocuments ?? documents
  const isLoading = propLoading ?? loading

  useEffect(() => {
    loadDocuments()
  }, [])

  const loadDocuments = async () => {
    try {
      setLoading(true)
      // 실제 프로젝트 로드 시도
      try {
        await mdshareClient.loadSampleProject()
        const docs = await mdshareClient.getDocuments()
        setDocuments(docs)
      } catch (error) {
        // 샘플 프로젝트 로드 실패 시 Mock 데이터 사용
        console.log('샘플 프로젝트 로드 실패, Mock 데이터 사용')
        const mockDocs = mdshareClient.getMockDocuments()
        setDocuments(mockDocs)
      }
    } catch (error) {
      console.error('문서 로드 오류:', error)
      // 에러 시 Mock 데이터 사용
      const mockDocs = mdshareClient.getMockDocuments()
      setDocuments(mockDocs)
    } finally {
      setLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="h-6 bg-muted rounded w-3/4"></div>
            </CardHeader>
            <CardContent>
              <div className="h-4 bg-muted rounded w-full mb-2"></div>
              <div className="h-4 bg-muted rounded w-2/3"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (displayDocuments.length === 0) {
    return (
      <div className="text-center py-12">
        <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-foreground mb-2">
          문서가 없습니다
        </h3>
        <p className="text-muted-foreground">
          검색 결과가 없거나 아직 문서가 생성되지 않았습니다.
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {displayDocuments.map((doc) => (
        <Link key={doc.id} href={`/document/${doc.id}`}>
          <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-2">
                  <FileText className="h-5 w-5 text-muted-foreground" />
                  <CardTitle className="text-lg">{doc.title}</CardTitle>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={(e) => {
                    e.preventDefault()
                    // 편집 기능은 향후 구현
                  }}
                >
                  편집
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4 line-clamp-2">
                {doc.description}
              </p>
              
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-4 w-4" />
                    <span>{doc.lastModified.toLocaleDateString('ko-KR')}</span>
                  </div>
                  <span>{doc.metadata?.wordCount || 0} 단어</span>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-1 mt-3">
                {doc.tags.map((tag: string) => (
                  <span
                    key={tag}
                    className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-secondary text-secondary-foreground"
                  >
                    <Tag className="h-3 w-3 mr-1" />
                    {tag}
                  </span>
                ))}
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  )
}
