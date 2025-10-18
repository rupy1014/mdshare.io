'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Search,
  ArrowLeft,
  FileText,
  Calendar,
  Tag,
  Filter,
  X
} from 'lucide-react'
import { mdshareClient } from '@/lib/mdshare-client'
import type { DocumentInfo } from 'mdshare-core'

export default function SearchPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [query, setQuery] = useState(searchParams.get('q') || '')
  const [results, setResults] = useState<DocumentInfo[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [availableTags, setAvailableTags] = useState<string[]>([])

  useEffect(() => {
    if (query.trim()) {
      handleSearch()
    }
  }, [query])

  const handleSearch = async () => {
    if (!query.trim()) return

    setIsLoading(true)
    try {
      // 실제로는 API 호출
      const allDocuments = await mdshareClient.getDocuments()
      const filteredResults = allDocuments.filter(doc => 
        doc.title.toLowerCase().includes(query.toLowerCase()) ||
        doc.description.toLowerCase().includes(query.toLowerCase()) ||
        doc.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
      )
      
      setResults(filteredResults)
      
      // 사용 가능한 태그 업데이트
      const tags = Array.from(new Set(allDocuments.flatMap(doc => doc.tags)))
      setAvailableTags(tags)
    } catch (error) {
      console.error('검색 실패:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleTagFilter = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag))
    } else {
      setSelectedTags([...selectedTags, tag])
    }
  }

  const clearFilters = () => {
    setSelectedTags([])
    setQuery('')
    setResults([])
  }

  const filteredResults = results.filter(doc => 
    selectedTags.length === 0 || 
    selectedTags.some(tag => doc.tags.includes(tag))
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      {/* 헤더 */}
      <header className="border-b border-border/50 bg-background/80 backdrop-blur">
        <div className="container flex h-16 items-center justify-between px-4">
          <Link href="/ko" className="flex items-center space-x-2">
            <ArrowLeft className="h-4 w-4" />
            <span>홈으로</span>
          </Link>
          <div className="flex items-center space-x-2">
            <Search className="h-5 w-5 text-primary" />
            <span className="font-semibold">검색</span>
          </div>
        </div>
      </header>

      {/* 메인 콘텐츠 */}
      <div className="container py-8 px-4">
        <div className="max-w-4xl mx-auto">
          {/* 검색 입력 */}
          <div className="mb-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="문서, 태그, 내용을 검색하세요..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className="pl-10 pr-4 py-3 text-lg"
              />
              <Button 
                onClick={handleSearch}
                disabled={!query.trim() || isLoading}
                className="absolute right-2 top-1/2 transform -translate-y-1/2"
                size="sm"
              >
                {isLoading ? '검색 중...' : '검색'}
              </Button>
            </div>
          </div>

          {/* 필터 */}
          {availableTags.length > 0 && (
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-medium text-muted-foreground">태그 필터</h3>
                {selectedTags.length > 0 && (
                  <Button variant="ghost" size="sm" onClick={clearFilters}>
                    <X className="h-4 w-4 mr-1" />
                    필터 초기화
                  </Button>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                {availableTags.map(tag => (
                  <Badge
                    key={tag}
                    variant={selectedTags.includes(tag) ? 'default' : 'outline'}
                    className="cursor-pointer"
                    onClick={() => handleTagFilter(tag)}
                  >
                    <Tag className="h-3 w-3 mr-1" />
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* 검색 결과 */}
          <div className="space-y-4">
            {isLoading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4" />
                <p className="text-muted-foreground">검색 중...</p>
              </div>
            ) : query.trim() && filteredResults.length === 0 ? (
              <div className="text-center py-12">
                <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">검색 결과가 없습니다</h3>
                <p className="text-muted-foreground">
                  다른 키워드로 검색해보세요
                </p>
              </div>
            ) : filteredResults.length > 0 ? (
              <>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold">
                    검색 결과 ({filteredResults.length}개)
                  </h2>
                  {selectedTags.length > 0 && (
                    <div className="flex items-center space-x-2">
                      <Filter className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">
                        {selectedTags.length}개 태그로 필터링됨
                      </span>
                    </div>
                  )}
                </div>
                
                <div className="space-y-4">
                  {filteredResults.map((doc) => (
                    <Card key={doc.id} className="hover:shadow-md transition-shadow">
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <CardTitle className="text-lg mb-1">
                              <Link 
                                href={`/ko/dashboard/document/${doc.id}`}
                                className="hover:text-primary transition-colors"
                              >
                                {doc.title}
                              </Link>
                            </CardTitle>
                            <p className="text-sm text-muted-foreground line-clamp-2">
                              {doc.description}
                            </p>
                          </div>
                          <div className="flex items-center space-x-1 ml-4">
                            <FileText className="h-4 w-4 text-muted-foreground" />
                            <span className="text-xs text-muted-foreground">
                              {doc.metadata?.wordCount || 0}단어
                            </span>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-1">
                              <Calendar className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm text-muted-foreground">
                                {doc.lastModified.toLocaleDateString()}
                              </span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Tag className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm text-muted-foreground">
                                {doc.metadata?.readingTime || 0}분 읽기
                              </span>
                            </div>
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {doc.tags.slice(0, 3).map(tag => (
                              <Badge key={tag} variant="secondary" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                            {doc.tags.length > 3 && (
                              <Badge variant="outline" className="text-xs">
                                +{doc.tags.length - 3}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center py-12">
                <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">검색어를 입력하세요</h3>
                <p className="text-muted-foreground">
                  문서, 태그, 내용을 검색하여 원하는 정보를 찾아보세요
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
