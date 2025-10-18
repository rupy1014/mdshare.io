import { DocumentGrid } from '@/components/viewer/document-grid'
import { SearchBar } from '@/components/search/search-bar'

export default function HomePage() {
  return (
    <div className="p-6">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            대시보드
          </h1>
          <p className="text-muted-foreground">
            왼쪽 폴더트리에서 문서를 선택하거나 아래에서 검색하세요
          </p>
        </div>
        
        <SearchBar />
        
        <DocumentGrid />
      </div>
    </div>
  )
}
