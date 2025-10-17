'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { EnhancedDocumentViewer } from '@/components/viewer/enhanced-document-viewer'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import { mdshareClient } from '@/lib/mdshare-client'
import type { DocumentInfo } from 'mdshare-core'

export default function DocumentPage() {
  const params = useParams()
  const [document, setDocument] = useState<DocumentInfo | null>(null)
  const [content, setContent] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadDocument = async () => {
      setIsLoading(true)
      setError(null)

      try {
        // 먼저 프로젝트를 로드해야 함
        await mdshareClient.loadSampleProject()
        const documents = await mdshareClient.getDocuments()
        const doc = documents.find(d => d.id === params.id)
        
        if (doc) {
          setDocument(doc)
          const content = await mdshareClient.readDocument(doc.path)
          setContent(content)
        } else {
          setError('문서를 찾을 수 없습니다.')
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : '문서 로드 실패')
      } finally {
        setIsLoading(false)
      }
    }

    if (params.id) {
      loadDocument()
    }
  }, [params.id])

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    )
  }

  if (error || !document) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="text-destructive font-medium mb-2">오류</div>
            <div className="text-sm text-muted-foreground">{error}</div>
            <Button className="mt-4" onClick={() => window.history.back()}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              돌아가기
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      {/* 뒤로가기 버튼 */}
      <div className="mb-4">
        <Button 
          variant="ghost" 
          onClick={() => window.history.back()}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          돌아가기
        </Button>
      </div>

      {/* 향상된 문서 뷰어 */}
      <EnhancedDocumentViewer 
        content={content}
        documentInfo={document}
      />
    </div>
  )
}