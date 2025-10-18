'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  ArrowLeft,
  FileText,
  Users,
  Settings,
  Plus,
  Search,
  GitBranch,
  Brain,
  Shield,
  Rocket,
  TrendingUp,
  Clock,
  Activity,
  Edit,
  Share,
  Bookmark,
  MoreHorizontal
} from 'lucide-react'
import Link from 'next/link'
import { EnhancedDocumentViewer } from '@/components/viewer/enhanced-document-viewer'
import type { DocumentInfo } from 'mdshare-core'

export default function DemoDocumentPage() {
  const params = useParams()
  const documentId = params.id as string

  const [document, setDocument] = useState<DocumentInfo | null>(null)
  const [content, setContent] = useState('')

  useEffect(() => {
    // Mock document data
    const mockDocument: DocumentInfo = {
      id: documentId,
      path: `/docs/api-auth-${documentId}.md`,
      title: 'API 문서 - 사용자 인증',
      description: 'JWT 기반 사용자 인증 API 명세서',
      lastModified: new Date(),
      tags: ['API', '인증', 'JWT'],
      metadata: {
        wordCount: 1250,
        readingTime: 5,
        author: '김개발'
      }
    }

    const mockContent = `# API 문서 - 사용자 인증

## 개요

이 문서는 MDShare 플랫폼의 사용자 인증 API에 대한 명세서입니다.
JWT(JSON Web Token) 기반의 인증 방식을 사용하며, RESTful API 설계 원칙을 따릅니다.

## 인증 플로우

### 1. 로그인

사용자가 이메일과 비밀번호로 로그인합니다.

\`\`\`javascript
POST /api/auth/login
{
  "email": "user@example.com",
  "password": "password123"
}
\`\`\`

**응답:**
\`\`\`javascript
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "user-123",
    "email": "user@example.com",
    "name": "홍길동",
    "role": "editor"
  }
}
\`\`\`

### 2. 토큰 검증

모든 보호된 엔드포인트에서 JWT 토큰을 검증합니다.

\`\`\`javascript
GET /api/user/profile
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
\`\`\`

## API 엔드포인트

### 인증 관련

| 메서드 | 엔드포인트 | 설명 | 권한 |
|--------|------------|------|------|
| POST | /api/auth/login | 로그인 | 없음 |
| POST | /api/auth/logout | 로그아웃 | 인증 필요 |
| POST | /api/auth/refresh | 토큰 갱신 | 인증 필요 |
| GET | /api/auth/me | 현재 사용자 정보 | 인증 필요 |

### 워크스페이스 관리

| 메서드 | 엔드포인트 | 설명 | 권한 |
|--------|------------|------|------|
| GET | /api/workspaces | 워크스페이스 목록 | 인증 필요 |
| POST | /api/workspaces | 워크스페이스 생성 | 인증 필요 |
| GET | /api/workspaces/{id} | 워크스페이스 상세 | 워크스페이스 멤버 |
| PUT | /api/workspaces/{id} | 워크스페이스 수정 | 워크스페이스 관리자 |

## 오류 코드

### HTTP 상태 코드

- \`200 OK\`: 요청 성공
- \`201 Created\`: 리소스 생성 성공
- \`400 Bad Request\`: 잘못된 요청
- \`401 Unauthorized\`: 인증 실패
- \`403 Forbidden\`: 권한 없음
- \`404 Not Found\`: 리소스 없음
- \`500 Internal Server Error\`: 서버 오류

### 커스텀 오류 코드

\`\`\`javascript
{
  "success": false,
  "error": {
    "code": "INVALID_TOKEN",
    "message": "유효하지 않은 토큰입니다",
    "details": "토큰이 만료되었거나 형식이 올바르지 않습니다"
  }
}
\`\`\`

## 보안 고려사항

1. **토큰 만료**: JWT 토큰은 24시간 후 자동 만료
2. **HTTPS 필수**: 모든 API 호출은 HTTPS를 통해서만
3. **Rate Limiting**: IP당 분당 100회 요청 제한
4. **입력 검증**: 모든 입력 데이터에 대한 유효성 검사

## 테스트

### cURL 예제

\`\`\`bash
# 로그인
curl -X POST https://api.mdshare.com/auth/login \\
  -H "Content-Type: application/json" \\
  -d '{"email":"test@example.com","password":"password123"}'

# 사용자 정보 조회
curl -X GET https://api.mdshare.com/auth/me \\
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
\`\`\`

### Postman Collection

Postman에서 사용할 수 있는 API 컬렉션을 제공합니다.
[다운로드 링크](https://docs.mdshare.com/api/postman-collection.json)

## 관련 문서

- [워크스페이스 API](./workspace-api.md)
- [문서 관리 API](./document-api.md)
- [권한 관리](./permissions.md)

---

*마지막 업데이트: 2024년 1월 15일*
*작성자: 김개발*
*리뷰어: 박리더*`

    setDocument(mockDocument)
    setContent(mockContent)
  }, [documentId])

  if (!document) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4" />
          <p className="text-muted-foreground">문서를 불러오는 중...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* 헤더 */}
      <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center justify-between px-4">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Rocket className="h-5 w-5 text-primary" />
              <span className="font-semibold">MDShare</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full" />
              <span className="text-sm font-medium">TechTeam-Docs</span>
              <Badge variant="secondary">관리자</Badge>
            </div>
          </div>
          
          <div className="flex items-center space-x-1">
            <Button variant="ghost" size="sm" title="검색">
              <Search className="h-4 w-4" />
            </Button>
            
            <Link href="/workspace/demo/document/1">
              <Button variant="ghost" size="sm" title="문서 인덱싱">
                <Brain className="h-4 w-4" />
              </Button>
            </Link>
            
            <Button variant="ghost" size="sm" title="Git 연동">
              <GitBranch className="h-4 w-4" />
            </Button>
            
            <Link href="/workspace/demo/access">
              <Button variant="ghost" size="sm" title="접근 제어">
                <Shield className="h-4 w-4" />
              </Button>
            </Link>
            
            <div className="flex items-center space-x-3 px-3 py-1 rounded-md bg-muted/50 ml-auto">
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium">김개발</span>
                <Badge variant="destructive" className="text-xs">관리자</Badge>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* 사이드바 */}
        <aside className="w-80 border-r border-border bg-muted/20 p-4 overflow-y-auto">
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-semibold text-muted-foreground mb-2">워크스페이스</h3>
              <div className="space-y-1">
                <Button variant="ghost" className="w-full justify-start" asChild>
                  <Link href="/workspace/demo/dashboard">
                    <FileText className="h-4 w-4 mr-2" />
                    대시보드
                  </Link>
                </Button>
                <Button variant="ghost" className="w-full justify-start">
                  <FileText className="h-4 w-4 mr-2" />
                  문서
                </Button>
                <Button variant="ghost" className="w-full justify-start">
                  <Users className="h-4 w-4 mr-2" />
                  팀원
                </Button>
                <Button variant="ghost" className="w-full justify-start">
                  <Settings className="h-4 w-4 mr-2" />
                  설정
                </Button>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-muted-foreground mb-2">폴더</h3>
              <div className="space-y-1">
                <Button variant="ghost" className="w-full justify-start text-sm bg-primary/10 text-primary">
                  📁 API 문서
                </Button>
                <Button variant="ghost" className="w-full justify-start text-sm">
                  📁 회의록
                </Button>
                <Button variant="ghost" className="w-full justify-start text-sm">
                  📁 기술 스펙
                </Button>
                <Button variant="ghost" className="w-full justify-start text-sm">
                  📁 기타
                </Button>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-muted-foreground mb-2">목차</h3>
              <div className="space-y-1">
                <Button variant="ghost" className="w-full justify-start text-sm">
                  개요
                </Button>
                <Button variant="ghost" className="w-full justify-start text-sm">
                  인증 플로우
                </Button>
                <Button variant="ghost" className="w-full justify-start text-sm">
                  API 엔드포인트
                </Button>
                <Button variant="ghost" className="w-full justify-start text-sm">
                  오류 코드
                </Button>
                <Button variant="ghost" className="w-full justify-start text-sm">
                  보안 고려사항
                </Button>
                <Button variant="ghost" className="w-full justify-start text-sm">
                  테스트
                </Button>
                <Button variant="ghost" className="w-full justify-start text-sm">
                  관련 문서
                </Button>
              </div>
            </div>
          </div>
        </aside>

        {/* 메인 콘텐츠 */}
        <main className="flex-1">
          {/* 문서 헤더 */}
          <div className="border-b border-border bg-background sticky top-0 z-10">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <Button variant="ghost" size="sm" asChild>
                    <Link href="/workspace/demo/dashboard">
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      대시보드
                    </Link>
                  </Button>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm">
                    <Edit className="h-4 w-4 mr-2" />
                    편집
                  </Button>
                  <Button variant="outline" size="sm">
                    <Share className="h-4 w-4 mr-2" />
                    공유
                  </Button>
                  <Button variant="outline" size="sm">
                    <Bookmark className="h-4 w-4 mr-2" />
                    북마크
                  </Button>
                  <Button variant="outline" size="sm">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <div>
                <h1 className="text-3xl font-bold mb-2">{document.title}</h1>
                <p className="text-muted-foreground mb-4">{document.description}</p>
                
                <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                  <div className="flex items-center space-x-1">
                    <Users className="h-4 w-4" />
                    <span>{document.metadata?.author || '작성자 미상'}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="h-4 w-4" />
                    <span>{document.lastModified.toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <FileText className="h-4 w-4" />
                    <span>{document.metadata.wordCount}단어</span>
                  </div>
                  <div className="flex space-x-1">
                    {document.tags.map((tag, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 문서 내용 */}
          <div className="p-6">
            <EnhancedDocumentViewer 
              content={content}
              documentInfo={document}
            />
          </div>
        </main>
      </div>
    </div>
  )
}
