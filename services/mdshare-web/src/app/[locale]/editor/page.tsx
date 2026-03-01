import { TiptapEditor } from '@/components/editor/tiptap-editor'

export default function EditorPage() {
  return (
    <div className="container mx-auto max-w-5xl py-8 px-4 space-y-4">
      <div>
        <h1 className="text-2xl font-bold">Tiptap 에디터 (베타)</h1>
        <p className="text-sm text-muted-foreground">Notion 스타일 WYSIWYG 편집을 위한 베이스 구현입니다.</p>
      </div>

      <TiptapEditor />
    </div>
  )
}
