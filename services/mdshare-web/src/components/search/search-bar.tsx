'use client'

import { useState, useEffect } from 'react'
import { Search, Filter, X } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { mdshareClient } from '@/lib/mdshare-client'
import type { DocumentInfo } from 'mdshare-core'

interface SearchBarProps {
  onSearchResults?: (results: DocumentInfo[]) => void
  onSearchQuery?: (query: string) => void
}

export function SearchBar({ onSearchResults, onSearchQuery }: SearchBarProps) {
  const [query, setQuery] = useState('')
  const [isAdvanced, setIsAdvanced] = useState(false)
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [availableTags, setAvailableTags] = useState<string[]>([])

  useEffect(() => {
    loadAvailableTags()
  }, [])

  const loadAvailableTags = async () => {
    try {
      const documents = mdshareClient.getMockDocuments()
      const tags = new Set<string>()
      documents.forEach(doc => {
        doc.tags.forEach(tag => tags.add(tag))
      })
      setAvailableTags(Array.from(tags))
    } catch (error) {
      console.error('태그 로드 오류:', error)
    }
  }

  const performSearch = async () => {
    try {
      const documents = mdshareClient.getMockDocuments()
      let results = documents

      // 텍스트 검색
      if (query.trim()) {
        const searchTerms = query.toLowerCase().split(' ')
        results = results.filter(doc => 
          searchTerms.some(term =>
            doc.title.toLowerCase().includes(term) ||
            doc.description.toLowerCase().includes(term) ||
            doc.tags.some(tag => tag.toLowerCase().includes(term))
          )
        )
      }

      // 태그 필터링
      if (selectedTags.length > 0) {
        results = results.filter(doc =>
          selectedTags.some(tag => doc.tags.includes(tag))
        )
      }

      onSearchResults?.(results)
      onSearchQuery?.(query)
    } catch (error) {
      console.error('검색 오류:', error)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      performSearch()
    }
  }

  const toggleTag = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    )
  }

  const clearFilters = () => {
    setSelectedTags([])
    setQuery('')
    onSearchResults?.(mdshareClient.getMockDocuments())
    onSearchQuery?.('')
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="문서 검색..."
            className="pl-10"
          />
        </div>
        <Button onClick={performSearch}>
          검색
        </Button>
        <Button 
          variant="outline"
          onClick={() => setIsAdvanced(!isAdvanced)}
        >
          <Filter className="h-4 w-4 mr-2" />
          고급 검색
        </Button>
        {(query || selectedTags.length > 0) && (
          <Button variant="ghost" onClick={clearFilters}>
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {isAdvanced && (
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium">태그 필터:</span>
            <div className="flex flex-wrap gap-2">
              {availableTags.map(tag => (
                <Badge
                  key={tag}
                  variant={selectedTags.includes(tag) ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => toggleTag(tag)}
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
