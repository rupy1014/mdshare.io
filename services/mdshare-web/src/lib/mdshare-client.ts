import { ProjectInfo, DocumentInfo } from 'mdshare-core'
// import { promises as fs } from 'fs'
// import path from 'path'

export class MDShareClient {
  private currentProject: ProjectInfo | null = null

  constructor() {
    // 브라우저 환경에서는 파일 시스템 접근이 불가능하므로 engine을 초기화하지 않음
  }

  // 프로젝트 로드
  async loadProject(projectPath: string): Promise<ProjectInfo> {
    try {
      // 브라우저 환경에서는 Mock 프로젝트 정보 반환
      this.currentProject = {
        id: 'mock-project',
        name: 'MDShare Web Demo',
        description: 'MDShare 웹 데모 프로젝트',
        path: projectPath,
        config: {
          project: {
            name: 'MDShare Web Demo',
            version: '1.0.0',
            description: 'MDShare 웹 데모 프로젝트',
            author: 'MDShare Team',
            license: 'MIT',
            language: 'ko',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            type: 'documentation',
            criticality: 'medium'
          },
          settings: {
            theme: 'default',
            navigation: 'sidebar',
            searchEnabled: true,
            aiFeaturesEnabled: true,
            autoIndexingEnabled: true,
            chatbotEnabled: true,
            allowDownload: true,
            allowComments: false
          },
          ai: {
            autoTagging: true,
            autoCategorization: true,
            relationshipAnalysis: true,
            contentSuggestions: true,
            embeddingModel: 'text-embedding-3-small',
            chatModel: 'gpt-4o-mini'
          },
          access: {
            visibility: 'private',
            inviteCode: undefined,
            allowedDomains: [],
            passwordProtected: false
          },
          deployment: {
            method: 'manual',
            customDomain: undefined,
            autoDeploy: false
          }
        },
        documents: this.getMockDocuments(),
        statistics: {
          documentCount: 3,
          totalWords: 2600,
          categories: ['개요', 'API', '가이드'],
          tags: ['개요', '프로젝트', 'API', '문서', '설치', '가이드'],
          authors: ['MDShare Team'],
          lastIndexed: new Date().toISOString()
        }
      }
      return this.currentProject
    } catch (error) {
      console.error('프로젝트 로드 실패:', error)
      throw error
    }
  }

  // 현재 프로젝트 정보 가져오기
  getCurrentProject(): ProjectInfo | null {
    return this.currentProject
  }

  // 문서 목록 가져오기
  async getDocuments(): Promise<DocumentInfo[]> {
    if (!this.currentProject) {
      throw new Error('프로젝트가 로드되지 않았습니다.')
    }

    try {
      // 브라우저 환경에서는 Mock 데이터 반환
      return this.getMockDocuments()
    } catch (error) {
      console.error('문서 목록 가져오기 실패:', error)
      return []
    }
  }

  // 문서 읽기
  async readDocument(documentPath: string): Promise<string> {
    if (!this.currentProject) {
      throw new Error('프로젝트가 로드되지 않았습니다.')
    }

    try {
      // 브라우저 환경에서는 Mock 문서 내용 반환
      const mockContent = this.getMockDocumentContent(documentPath)
      return mockContent
    } catch (error) {
      console.error('문서 읽기 실패:', error)
      throw error
    }
  }

  // 문서 저장
  async saveDocument(documentPath: string, content: string): Promise<void> {
    if (!this.currentProject) {
      throw new Error('프로젝트가 로드되지 않았습니다.')
    }

    try {
      // 브라우저 환경에서는 Mock 저장 (실제로는 저장하지 않음)
      console.log(`Mock 저장: ${documentPath}`)
    } catch (error) {
      console.error('문서 저장 실패:', error)
      throw error
    }
  }

  // 샘플 프로젝트 로드 (개발용)
  async loadSampleProject(): Promise<ProjectInfo> {
    // 브라우저 환경에서는 Mock 프로젝트 로드
    return await this.loadProject('/mock-project')
  }

  // Mock 문서 내용 반환
  private getMockDocumentContent(documentPath: string): string {
    const mockContents: Record<string, string> = {
      '/docs/overview.md': `---
title: "프로젝트 개요"
description: "MDShare 프로젝트의 전체적인 개요와 목표"
author: "MDShare Team"
category: "개요"
tags: ["개요", "프로젝트"]
---

# MDShare 프로젝트 개요

MDShare는 현대적인 마크다운 문서 관리 및 공유 플랫폼입니다.

## 주요 기능

- 📝 마크다운 기반 문서 작성
- 🔍 강력한 검색 기능
- 🤖 AI 기반 자동 태깅 및 분류
- 📱 반응형 웹 인터페이스
- 🔗 문서 간 연결 및 관계 분석

## 기술 스택

- **Frontend**: Next.js, React, TypeScript
- **Backend**: Node.js, Express
- **Database**: MongoDB
- **AI**: OpenAI GPT API
- **Deployment**: Cloudflare Pages

## 시작하기

1. 프로젝트 클론
2. 의존성 설치
3. 환경 변수 설정
4. 개발 서버 실행

더 자세한 내용은 [설치 가이드](/docs/installation.md)를 참조하세요.`,

      '/docs/api.md': `---
title: "API 문서"
description: "MDShare API 사용법과 엔드포인트 설명"
author: "MDShare Team"
category: "API"
tags: ["API", "문서"]
---

# MDShare API 문서

MDShare API를 사용하여 문서를 프로그래밍 방식으로 관리할 수 있습니다.

## 인증

API 사용을 위해서는 API 키가 필요합니다.

\`\`\`bash
curl -H "Authorization: Bearer YOUR_API_KEY" \\
  https://api.mdshare.app/v1/documents
\`\`\`

## 엔드포인트

### 문서 관리

- \`GET /v1/documents\` - 문서 목록 조회
- \`POST /v1/documents\` - 새 문서 생성
- \`GET /v1/documents/{id}\` - 특정 문서 조회
- \`PUT /v1/documents/{id}\` - 문서 수정
- \`DELETE /v1/documents/{id}\` - 문서 삭제

### 검색

- \`GET /v1/search\` - 문서 검색
- \`GET /v1/search/suggestions\` - 검색 제안

## 응답 형식

모든 API 응답은 JSON 형식으로 반환됩니다.

\`\`\`json
{
  "success": true,
  "data": {
    "id": "doc-123",
    "title": "문서 제목",
    "content": "문서 내용",
    "createdAt": "2023-10-27T00:00:00Z"
  }
}
\`\`\``,

      '/docs/installation.md': `---
title: "설치 가이드"
description: "MDShare 설치 및 설정 방법"
author: "MDShare Team"
category: "가이드"
tags: ["설치", "가이드"]
---

# MDShare 설치 가이드

MDShare를 설치하고 설정하는 방법을 안내합니다.

## 시스템 요구사항

- Node.js 18.0.0 이상
- npm 8.0.0 이상
- MongoDB 5.0 이상 (선택사항)

## 설치 방법

### 1. 프로젝트 클론

\`\`\`bash
git clone https://github.com/mdshare/mdshare.git
cd mdshare
\`\`\`

### 2. 의존성 설치

\`\`\`bash
npm install
\`\`\`

### 3. 환경 변수 설정

\`.env\` 파일을 생성하고 다음 내용을 추가합니다:

\`\`\`env
NEXT_PUBLIC_API_URL=http://localhost:3001
OPENAI_API_KEY=your_openai_api_key
MONGODB_URI=mongodb://localhost:27017/mdshare
\`\`\`

### 4. 개발 서버 실행

\`\`\`bash
npm run dev
\`\`\`

## Docker를 사용한 설치

\`\`\`bash
docker-compose up -d
\`\`\`

## 문제 해결

자주 발생하는 문제와 해결 방법:

### 포트 충돌
기본 포트 3000이 사용 중인 경우:
\`\`\`bash
npm run dev -- -p 3001
\`\`\`

### 의존성 오류
\`\`\`bash
rm -rf node_modules package-lock.json
npm install
\`\`\``
    }

    return mockContents[documentPath] || '# 문서를 찾을 수 없습니다.\n\n요청한 문서가 존재하지 않습니다.'
  }

  // Mock 데이터 생성 (개발용)
  getMockDocuments(): DocumentInfo[] {
    return [
      {
        id: '1',
        title: '프로젝트 개요',
        path: '/docs/overview.md',
        description: 'MDShare 프로젝트의 전체적인 개요와 목표',
        lastModified: new Date('2023-10-27'),
        tags: ['개요', '프로젝트'],
        metadata: {
          wordCount: 1200,
          readingTime: 5,
          author: 'MDShare Team'
        }
      },
      {
        id: '2',
        title: 'API 문서',
        path: '/docs/api.md',
        description: 'MDShare API 사용법과 엔드포인트 설명',
        lastModified: new Date('2023-10-26'),
        tags: ['API', '문서'],
        metadata: {
          wordCount: 800,
          readingTime: 4,
          author: 'MDShare Team'
        }
      },
      {
        id: '3',
        title: '설치 가이드',
        path: '/docs/installation.md',
        description: 'MDShare 설치 및 설정 방법',
        lastModified: new Date('2023-10-25'),
        tags: ['설치', '가이드'],
        metadata: {
          wordCount: 600,
          readingTime: 3,
          author: 'MDShare Team'
        }
      }
    ]
  }
}

// 싱글톤 인스턴스
export const mdshareClient = new MDShareClient()
