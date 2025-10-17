'use client'

import { useState } from 'react'
import { DocumentGrid } from '@/components/viewer/document-grid'
import { SearchBar } from '@/components/search/search-bar'
import type { DocumentInfo } from 'mdshare-core'

export default function DashboardPage() {
  const [searchResults, setSearchResults] = useState<DocumentInfo[] | undefined>()
  const [searchQuery, setSearchQuery] = useState('')

  const handleSearchResults = (results: DocumentInfo[]) => {
    setSearchResults(results)
  }

  const handleSearchQuery = (query: string) => {
    setSearchQuery(query)
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-foreground mb-2">
          문서 대시보드
        </h1>
        <p className="text-muted-foreground">
          마크다운 문서를 탐색하고 편집하세요
        </p>
        {searchQuery && (
          <p className="text-sm text-muted-foreground mt-2">
            "{searchQuery}" 검색 결과: {searchResults?.length || 0}개
          </p>
        )}
      </div>
      
      <div className="mb-6">
        <SearchBar 
          onSearchResults={handleSearchResults}
          onSearchQuery={handleSearchQuery}
        />
      </div>
      
      <DocumentGrid documents={searchResults} />
    </div>
  )
}
