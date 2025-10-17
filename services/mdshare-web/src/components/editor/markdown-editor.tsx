'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Save, Eye, Edit3, Sparkles, Tag } from 'lucide-react'
import { MarkdownParser } from 'mdshare-core'
import { aiService } from '@/lib/ai-service'
import { Badge } from '@/components/ui/badge'
import { ExtendedMarkdownViewer } from '@/components/markdown/extended-markdown-viewer'

const initialMarkdown = `# 확장 마크다운 데모

이곳에 마크다운을 작성하세요.

## 기본 마크다운 기능

- **굵은 글씨**
- *기울임*
- \`코드\`

## 코드 블록

\`\`\`javascript
function hello() {
  console.log("Hello, MDShare!");
}
\`\`\`

## 목록

1. 첫 번째 항목
2. 두 번째 항목
3. 세 번째 항목

> 인용문입니다.

---

## 확장 마크다운 기능

### CSV 데이터 렌더링

@csv[data/students.csv]

### JSON 데이터 렌더링

@json[data/endpoints.json]

### Mermaid 다이어그램

\`\`\`mermaid
@mermaid[graph TD
    A[시작] --> B{조건}
    B -->|예| C[실행]
    B -->|아니오| D[종료]
    C --> D]
\`\`\`

### PlantUML 다이어그램

\`\`\`plantuml
@plantuml[@startuml
사용자 -> 앱: 파일 업로드
앱 -> API: POST /upload
API -> S3: 파일 저장
@enduml]
\`\`\`

마지막으로 [링크](https://example.com)도 지원합니다.`

export function MarkdownEditor() {
  const [markdown, setMarkdown] = useState(initialMarkdown)
  const [isPreview, setIsPreview] = useState(false)
  const [suggestedTags, setSuggestedTags] = useState<Array<{tag: string, confidence: number, reason: string}>>([])
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [isGeneratingTags, setIsGeneratingTags] = useState(false)

  // AI 태그 생성
  const generateAITags = async () => {
    if (!markdown.trim()) return

    setIsGeneratingTags(true)
    try {
      const title = markdown.split('\n')[0].replace(/^#+\s*/, '') || '새 문서'
      const suggestions = await aiService.generateTags(markdown, title)
      setSuggestedTags(suggestions)
    } catch (error) {
      console.error('태그 생성 오류:', error)
    } finally {
      setIsGeneratingTags(false)
    }
  }

  // 태그 선택/해제
  const toggleTag = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    )
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between p-4 border-b border-border bg-muted/50">
        <div className="flex items-center space-x-2">
          <Button
            variant={isPreview ? 'ghost' : 'default'}
            size="sm"
            onClick={() => setIsPreview(false)}
          >
            <Edit3 className="h-4 w-4 mr-2" />
            편집
          </Button>
          <Button
            variant={isPreview ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setIsPreview(true)}
          >
            <Eye className="h-4 w-4 mr-2" />
            미리보기
          </Button>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button 
            size="sm" 
            variant="outline"
            onClick={generateAITags}
            disabled={isGeneratingTags || !markdown.trim()}
          >
            <Sparkles className="h-4 w-4 mr-2" />
            {isGeneratingTags ? '생성 중...' : 'AI 태그'}
          </Button>
          <Button size="sm">
            <Save className="h-4 w-4 mr-2" />
            저장
          </Button>
        </div>
      </div>

      {/* AI 태그 추천 영역 */}
      {(suggestedTags.length > 0 || selectedTags.length > 0) && (
        <div className="border-b border-border bg-muted/30 p-4">
          <div className="space-y-3">
            {suggestedTags.length > 0 && (
              <div>
                <div className="flex items-center space-x-2 mb-2">
                  <Sparkles className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium">AI 추천 태그</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {suggestedTags.map((suggestion, index) => (
                    <Badge
                      key={index}
                      variant={selectedTags.includes(suggestion.tag) ? "default" : "outline"}
                      className="cursor-pointer"
                      onClick={() => toggleTag(suggestion.tag)}
                      title={`신뢰도: ${Math.round(suggestion.confidence * 100)}% - ${suggestion.reason}`}
                    >
                      <Tag className="h-3 w-3 mr-1" />
                      {suggestion.tag}
                      <span className="ml-1 text-xs opacity-70">
                        {Math.round(suggestion.confidence * 100)}%
                      </span>
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            
            {selectedTags.length > 0 && (
              <div>
                <div className="flex items-center space-x-2 mb-2">
                  <Tag className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium">선택된 태그</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {selectedTags.map((tag, index) => (
                    <Badge
                      key={index}
                      variant="default"
                      className="cursor-pointer"
                      onClick={() => toggleTag(tag)}
                    >
                      <Tag className="h-3 w-3 mr-1" />
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      
      <div className="flex-1 flex">
        {!isPreview && (
          <div className="flex-1 border-r border-border">
            <textarea
              value={markdown}
              onChange={(e) => setMarkdown(e.target.value)}
              className="w-full h-full resize-none border-none outline-none bg-transparent font-mono text-sm leading-relaxed p-6"
              placeholder="마크다운을 입력하세요..."
            />
          </div>
        )}
        
        <div className={isPreview ? "flex-1" : "flex-1"}>
          <div className="h-full overflow-auto p-6">
            <ExtendedMarkdownViewer content={markdown} />
          </div>
        </div>
      </div>
    </div>
  )
}
