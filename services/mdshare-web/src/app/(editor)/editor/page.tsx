import { Header } from '@/components/ui/header'
import { Sidebar } from '@/components/ui/sidebar'
import { MarkdownEditor } from '@/components/editor/markdown-editor'

export default function EditorPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 flex flex-col">
          <div className="p-6 border-b border-border">
            <h1 className="text-2xl font-bold text-foreground mb-2">
              마크다운 에디터
            </h1>
            <p className="text-muted-foreground">
              노션 스타일로 마크다운을 편집하세요
            </p>
          </div>
          
          <div className="flex-1 overflow-hidden">
            <div className="h-full flex flex-col">
              <div className="border-b border-border bg-muted/50 px-6 py-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-muted-foreground">새 문서</span>
                  </div>
                </div>
              </div>
              
              <div className="flex-1 p-6">
                <div className="h-full border border-border rounded-lg overflow-hidden">
                  <MarkdownEditor />
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
