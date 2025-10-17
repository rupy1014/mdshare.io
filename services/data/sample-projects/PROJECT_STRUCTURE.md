# MDShare 사용자 프로젝트 구조 가이드

## 🎯 개요

MDShare에서 관리하는 사용자 프로젝트들은 **멀티 프로젝트 지원**과 **JSON 기반 인덱싱**을 통해 체계적으로 구성됩니다.

## 📁 기본 프로젝트 구조

```
my-documentation/                 # 프로젝트 루트
├── 📄 README.md                  # 프로젝트 개요
├── 📄 .mdshare/                  # MDShare 설정 폴더
│   ├── config.json               # 프로젝트 설정
│   ├── index.json                # 메인 인덱스
│   └── ai-indexes/               # AI 생성 인덱스들
│       ├── by-topic.json         # 주제별 인덱스
│       ├── by-date.json          # 날짜별 인덱스
│       ├── by-author.json        # 작성자별 인덱스
│       ├── relationships.json    # 문서 관계
│       └── suggestions.json      # AI 제안사항
├── 📁 docs/                      # 문서 폴더
│   ├── getting-started/          # 시작 가이드
│   ├── api-reference/            # API 문서
│   └── tutorials/                # 튜토리얼
├── 📁 data/                      # 데이터 폴더
│   ├── samples/                  # 샘플 데이터
│   └── templates/                # 템플릿
├── 📁 assets/                    # 정적 자산
│   ├── images/                   # 이미지
│   └── diagrams/                 # 다이어그램
└── 📁 _meta/                     # 메타데이터 폴더
    ├── authors.json              # 작성자 정보
    ├── categories.json           # 카테고리 정의
    └── tags.json                 # 태그 정의
```

## 🔧 프로젝트 설정 (.mdshare/config.json)

```json
{
  "project": {
    "name": "My Documentation",
    "version": "1.0.0",
    "description": "프로젝트 설명",
    "author": "작성자명",
    "license": "MIT",
    "language": "ko",
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-15T10:30:00Z"
  },
  "settings": {
    "theme": "default",
    "navigation": "sidebar",
    "searchEnabled": true,
    "aiFeaturesEnabled": true,
    "autoIndexingEnabled": true,
    "chatbotEnabled": true,
    "allowDownload": true,
    "allowComments": false
  },
  "ai": {
    "autoTagging": true,
    "autoCategorization": true,
    "relationshipAnalysis": true,
    "contentSuggestions": true,
    "embeddingModel": "text-embedding-3-small",
    "chatModel": "gpt-4o-mini"
  },
  "access": {
    "visibility": "private",
    "inviteCode": "abc123",
    "allowedDomains": [],
    "passwordProtected": false
  },
  "deployment": {
    "method": "manual",
    "customDomain": null,
    "autoDeploy": false,
    "buildCommand": null
  }
}
```

## 📋 메인 인덱스 (.mdshare/index.json)

```json
{
  "metadata": {
    "version": "1.0.0",
    "generatedAt": "2024-01-15T10:30:00Z",
    "totalDocuments": 45,
    "totalSize": "2.3MB",
    "lastModified": "2024-01-15T09:45:00Z"
  },
  "structure": {
    "docs": {
      "path": "docs/",
      "type": "folder",
      "description": "메인 문서 폴더",
      "children": [
        {
          "path": "docs/getting-started/",
          "type": "folder",
          "description": "시작 가이드",
          "children": [
            {
              "path": "docs/getting-started/installation.md",
              "type": "document",
              "title": "설치 가이드",
              "description": "프로젝트 설치 방법",
              "tags": ["installation", "setup", "getting-started"],
              "category": "getting-started",
              "author": "김개발",
              "createdAt": "2024-01-01T00:00:00Z",
              "updatedAt": "2024-01-10T14:20:00Z",
              "wordCount": 1250,
              "readingTime": "5분",
              "difficulty": "beginner"
            }
          ]
        }
      ]
    }
  },
  "statistics": {
    "byCategory": {
      "getting-started": 8,
      "api-reference": 15,
      "tutorials": 12,
      "examples": 10
    },
    "byAuthor": {
      "김개발": 25,
      "박프론트": 15,
      "이백엔드": 5
    },
    "byDifficulty": {
      "beginner": 20,
      "intermediate": 15,
      "advanced": 10
    },
    "recentUpdates": [
      {
        "path": "docs/api-reference/auth.md",
        "title": "인증 API",
        "updatedAt": "2024-01-15T09:45:00Z",
        "changes": "새로운 OAuth 2.0 예시 추가"
      }
    ]
  },
  "search": {
    "keywords": [
      "installation", "setup", "api", "authentication", "tutorial",
      "getting-started", "examples", "configuration", "deployment"
    ],
    "popularSearches": [
      "설치 방법",
      "API 사용법",
      "인증 설정",
      "배포 가이드"
    ]
  }
}
```

## 🤖 AI 인덱스 구조

### 주제별 인덱스 (.mdshare/ai-indexes/by-topic.json)

```json
{
  "metadata": {
    "generatedAt": "2024-01-15T10:30:00Z",
    "totalTopics": 12,
    "confidence": 0.89
  },
  "topics": [
    {
      "id": "installation-setup",
      "name": "설치 및 설정",
      "description": "프로젝트 설치, 환경 설정, 초기 구성 관련 문서",
      "confidence": 0.95,
      "documents": [
        {
          "path": "docs/getting-started/installation.md",
          "title": "설치 가이드",
          "relevanceScore": 0.98,
          "keyPhrases": ["설치", "환경 설정", "의존성", "패키지"]
        },
        {
          "path": "docs/getting-started/configuration.md",
          "title": "설정 가이드",
          "relevanceScore": 0.92,
          "keyPhrases": ["설정", "구성", "환경변수", "옵션"]
        }
      ],
      "relatedTopics": ["getting-started", "troubleshooting"],
      "suggestedTags": ["installation", "setup", "configuration"]
    },
    {
      "id": "api-development",
      "name": "API 개발",
      "description": "API 설계, 구현, 테스트 관련 문서",
      "confidence": 0.91,
      "documents": [
        {
          "path": "docs/api-reference/overview.md",
          "title": "API 개요",
          "relevanceScore": 0.96,
          "keyPhrases": ["API", "REST", "엔드포인트", "인증"]
        }
      ],
      "relatedTopics": ["authentication", "testing"],
      "suggestedTags": ["api", "development", "rest"]
    }
  ]
}
```

### 문서 관계 인덱스 (.mdshare/ai-indexes/relationships.json)

```json
{
  "metadata": {
    "generatedAt": "2024-01-15T10:30:00Z",
    "totalRelationships": 67,
    "confidence": 0.87
  },
  "relationships": [
    {
      "source": "docs/getting-started/installation.md",
      "target": "docs/getting-started/configuration.md",
      "type": "prerequisite",
      "strength": 0.89,
      "description": "설치 후 설정이 필요함",
      "confidence": 0.92
    },
    {
      "source": "docs/api-reference/overview.md",
      "target": "docs/api-reference/auth.md",
      "type": "related",
      "strength": 0.76,
      "description": "API 인증 관련 내용",
      "confidence": 0.84
    },
    {
      "source": "docs/tutorials/basic-usage.md",
      "target": "docs/examples/hello-world.md",
      "type": "example",
      "strength": 0.94,
      "description": "기본 사용법의 실제 예시",
      "confidence": 0.96
    }
  ],
  "learningPaths": [
    {
      "id": "beginner-path",
      "name": "초보자 학습 경로",
      "description": "처음 시작하는 사용자를 위한 단계별 가이드",
      "difficulty": "beginner",
      "estimatedTime": "2시간",
      "steps": [
        {
          "order": 1,
          "document": "docs/getting-started/installation.md",
          "title": "1. 설치하기",
          "description": "프로젝트를 설치하고 기본 환경을 구성합니다.",
          "estimatedTime": "30분"
        },
        {
          "order": 2,
          "document": "docs/getting-started/configuration.md",
          "title": "2. 설정하기",
          "description": "프로젝트를 사용하기 위한 기본 설정을 진행합니다.",
          "estimatedTime": "20분"
        },
        {
          "order": 3,
          "document": "docs/tutorials/basic-usage.md",
          "title": "3. 기본 사용법",
          "description": "프로젝트의 기본 기능을 학습합니다.",
          "estimatedTime": "45분"
        }
      ]
    }
  ]
}
```

## 📊 메타데이터 구조

### 작성자 정보 (_meta/authors.json)

```json
{
  "authors": [
    {
      "id": "kim-dev",
      "name": "김개발",
      "email": "kim@example.com",
      "role": "Lead Developer",
      "bio": "풀스택 개발자, 10년 경력",
      "avatar": "assets/images/kim-dev.jpg",
      "social": {
        "github": "kim-dev",
        "linkedin": "kim-dev",
        "twitter": "kim_dev"
      },
      "specialties": ["JavaScript", "Node.js", "React", "API Design"],
      "contributionStats": {
        "totalDocuments": 25,
        "totalWords": 45000,
        "lastContribution": "2024-01-15T09:45:00Z"
      }
    },
    {
      "id": "park-frontend",
      "name": "박프론트",
      "email": "park@example.com",
      "role": "Frontend Developer",
      "bio": "UI/UX 전문가, React 전문가",
      "avatar": "assets/images/park-frontend.jpg",
      "specialties": ["React", "TypeScript", "UI/UX", "Design System"],
      "contributionStats": {
        "totalDocuments": 15,
        "totalWords": 25000,
        "lastContribution": "2024-01-14T16:20:00Z"
      }
    }
  ]
}
```

### 카테고리 정의 (_meta/categories.json)

```json
{
  "categories": [
    {
      "id": "getting-started",
      "name": "시작하기",
      "description": "프로젝트 시작을 위한 기본 가이드",
      "icon": "🚀",
      "color": "#3B82F6",
      "order": 1,
      "parent": null,
      "children": ["installation", "configuration", "first-steps"]
    },
    {
      "id": "api-reference",
      "name": "API 레퍼런스",
      "description": "API 엔드포인트 및 사용법",
      "icon": "📚",
      "color": "#10B981",
      "order": 2,
      "parent": null,
      "children": ["authentication", "endpoints", "examples"]
    },
    {
      "id": "tutorials",
      "name": "튜토리얼",
      "description": "단계별 학습 가이드",
      "icon": "🎓",
      "color": "#F59E0B",
      "order": 3,
      "parent": null,
      "children": ["basic", "intermediate", "advanced"]
    }
  ],
  "hierarchy": [
    {
      "level": 1,
      "categories": ["getting-started", "api-reference", "tutorials", "examples"]
    },
    {
      "level": 2,
      "categories": ["installation", "configuration", "authentication", "endpoints"]
    }
  ]
}
```

### 태그 정의 (_meta/tags.json)

```json
{
  "tags": [
    {
      "name": "installation",
      "displayName": "설치",
      "description": "프로젝트 설치 관련",
      "color": "#EF4444",
      "category": "getting-started",
      "usageCount": 8,
      "relatedTags": ["setup", "configuration", "dependencies"]
    },
    {
      "name": "api",
      "displayName": "API",
      "description": "API 관련 내용",
      "color": "#10B981",
      "category": "api-reference",
      "usageCount": 15,
      "relatedTags": ["rest", "endpoints", "authentication"]
    },
    {
      "name": "tutorial",
      "displayName": "튜토리얼",
      "description": "학습 가이드",
      "color": "#F59E0B",
      "category": "tutorials",
      "usageCount": 12,
      "relatedTags": ["guide", "learning", "examples"]
    }
  ],
  "tagCloud": [
    { "name": "api", "weight": 15, "size": "large" },
    { "name": "installation", "weight": 8, "size": "medium" },
    { "name": "tutorial", "weight": 12, "size": "large" },
    { "name": "authentication", "weight": 6, "size": "small" }
  ]
}
```

## 🔄 멀티 프로젝트 지원

### 사용자 워크스페이스 구조

```
사용자 워크스페이스/
├── 📁 projects/                   # 모든 프로젝트
│   ├── 📁 my-documentation/       # 프로젝트 1
│   │   ├── .mdshare/
│   │   ├── docs/
│   │   └── ...
│   ├── 📁 api-docs/               # 프로젝트 2
│   │   ├── .mdshare/
│   │   ├── docs/
│   │   └── ...
│   └── 📁 team-wiki/              # 프로젝트 3
│       ├── .mdshare/
│       ├── docs/
│       └── ...
├── 📄 .mdshare-workspace.json     # 워크스페이스 설정
└── 📁 shared/                     # 공유 리소스
    ├── 📁 templates/              # 공통 템플릿
    ├── 📁 assets/                 # 공통 자산
    └── 📁 snippets/               # 코드 스니펫
```

### 워크스페이스 설정 (.mdshare-workspace.json)

```json
{
  "workspace": {
    "name": "개발팀 문서 워크스페이스",
    "owner": "김개발",
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-15T10:30:00Z"
  },
  "projects": [
    {
      "id": "my-documentation",
      "name": "My Documentation",
      "path": "projects/my-documentation",
      "type": "documentation",
      "status": "active",
      "lastUpdated": "2024-01-15T09:45:00Z",
      "visibility": "private"
    },
    {
      "id": "api-docs",
      "name": "API Documentation",
      "path": "projects/api-docs",
      "type": "api-docs",
      "status": "active",
      "lastUpdated": "2024-01-14T16:20:00Z",
      "visibility": "public"
    },
    {
      "id": "team-wiki",
      "name": "Team Wiki",
      "path": "projects/team-wiki",
      "type": "wiki",
      "status": "active",
      "lastUpdated": "2024-01-13T11:30:00Z",
      "visibility": "private"
    }
  ],
  "settings": {
    "defaultTheme": "default",
    "autoSync": true,
    "backupEnabled": true,
    "aiFeaturesEnabled": true,
    "crossProjectSearch": true
  },
  "shared": {
    "templates": "shared/templates/",
    "assets": "shared/assets/",
    "snippets": "shared/snippets/"
  }
}
```

## 📝 문서 작성 가이드

### Frontmatter 표준

```yaml
---
title: "문서 제목"
description: "문서 설명"
author: "kim-dev"
category: "getting-started"
tags: ["installation", "setup", "beginner"]
difficulty: "beginner"
createdAt: "2024-01-01T00:00:00Z"
updatedAt: "2024-01-10T14:20:00Z"
version: "1.0.0"
status: "published"
prerequisites: ["docs/getting-started/overview.md"]
related: ["docs/getting-started/configuration.md"]
estimatedTime: "5분"
---

# 문서 내용
```

### 확장 마크다운 문법

```markdown
<!-- CSV 테이블 자동 렌더링 -->
@csv[data/samples/users.csv]

<!-- JSON 데이터 자동 렌더링 -->
@json[data/samples/config.json]

<!-- 다이어그램 자동 렌더링 -->
@mermaid
graph TD
    A[시작] --> B[설치]
    B --> C[설정]
    C --> D[완료]
@endmermaid

<!-- YouTube 임베드 -->
@youtube[https://www.youtube.com/watch?v=example]

<!-- 코드 블록 with 언어 자동 감지 -->
```javascript
function hello() {
    console.log("Hello, MDShare!");
}
```

## 🚀 배포 및 공유

### 배포 설정

```json
{
  "deployment": {
    "method": "github-pages",
    "repository": "user/my-documentation",
    "branch": "gh-pages",
    "customDomain": "docs.example.com",
    "autoDeploy": true,
    "buildCommand": "npm run build",
    "outputDir": "dist"
  }
}
```

### 공유 옵션

```json
{
  "sharing": {
    "public": {
      "enabled": false,
      "url": "https://mdshare.app/project/abc123",
      "password": null
    },
    "invite": {
      "enabled": true,
      "code": "ABC123",
      "expiresAt": "2024-02-15T00:00:00Z"
    },
    "embed": {
      "enabled": true,
      "allowedDomains": ["example.com", "*.example.com"]
    }
  }
}
```

---

이 구조를 통해 사용자들은 체계적이고 확장 가능한 문서 프로젝트를 관리할 수 있으며, AI 기능을 통해 자동으로 인덱싱되고 관계 분석이 이루어집니다.
