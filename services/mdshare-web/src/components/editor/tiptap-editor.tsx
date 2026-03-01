'use client'

import { useState } from 'react'
import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import Link from '@tiptap/extension-link'
import Underline from '@tiptap/extension-underline'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Bold, Italic, Underline as UnderlineIcon, List, ListOrdered, Heading2, Link2 } from 'lucide-react'

interface TiptapEditorProps {
  initialContent?: string
}

export function TiptapEditor({ initialContent = '<h1>새 문서</h1><p>내용을 입력하세요.</p>' }: TiptapEditorProps) {
  const [linkUrl, setLinkUrl] = useState('')
  const [htmlOutput, setHtmlOutput] = useState(initialContent)

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link.configure({
        openOnClick: false,
        autolink: true,
      }),
      Placeholder.configure({
        placeholder: '문서를 작성하세요...'
      })
    ],
    content: initialContent,
    editorProps: {
      attributes: {
        class: 'min-h-[420px] rounded-md border border-input bg-background p-4 prose prose-sm max-w-none focus:outline-none'
      }
    },
    onUpdate: ({ editor }) => {
      setHtmlOutput(editor.getHTML())
    }
  })

  if (!editor) return null

  const applyLink = () => {
    const value = linkUrl.trim()
    if (!value) {
      editor.chain().focus().unsetLink().run()
      return
    }
    editor.chain().focus().setLink({ href: value }).run()
    setLinkUrl('')
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2 rounded-md border p-2">
        <Button size="sm" variant={editor.isActive('bold') ? 'default' : 'outline'} onClick={() => editor.chain().focus().toggleBold().run()}>
          <Bold className="h-4 w-4" />
        </Button>
        <Button size="sm" variant={editor.isActive('italic') ? 'default' : 'outline'} onClick={() => editor.chain().focus().toggleItalic().run()}>
          <Italic className="h-4 w-4" />
        </Button>
        <Button size="sm" variant={editor.isActive('underline') ? 'default' : 'outline'} onClick={() => editor.chain().focus().toggleUnderline().run()}>
          <UnderlineIcon className="h-4 w-4" />
        </Button>
        <Button size="sm" variant={editor.isActive('heading', { level: 2 }) ? 'default' : 'outline'} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>
          <Heading2 className="h-4 w-4" />
        </Button>
        <Button size="sm" variant={editor.isActive('bulletList') ? 'default' : 'outline'} onClick={() => editor.chain().focus().toggleBulletList().run()}>
          <List className="h-4 w-4" />
        </Button>
        <Button size="sm" variant={editor.isActive('orderedList') ? 'default' : 'outline'} onClick={() => editor.chain().focus().toggleOrderedList().run()}>
          <ListOrdered className="h-4 w-4" />
        </Button>

        <div className="ml-auto flex items-center gap-2">
          <Input
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
            placeholder="https://example.com"
            className="w-56"
          />
          <Button size="sm" variant="outline" onClick={applyLink}>
            <Link2 className="h-4 w-4 mr-1" /> 링크
          </Button>
        </div>
      </div>

      <EditorContent editor={editor} />

      <details className="rounded-md border p-3">
        <summary className="cursor-pointer text-sm font-medium">HTML 출력 미리보기</summary>
        <pre className="mt-2 whitespace-pre-wrap break-words text-xs text-muted-foreground">{htmlOutput}</pre>
      </details>
    </div>
  )
}
