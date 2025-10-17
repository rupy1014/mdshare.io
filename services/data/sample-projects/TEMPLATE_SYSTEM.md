# MDShare 템플릿 시스템 설계

## 🎯 템플릿 시스템 개요

MDShare CLI는 다양한 프로젝트 유형을 위한 **템플릿 시스템**을 제공합니다. 사용자는 `mdshare init --template <template-name>` 명령어로 원하는 프로젝트 구조를 즉시 생성할 수 있습니다.

## 📋 템플릿 종류

### 1. 기본 템플릿

#### 📚 documentation
**용도**: 일반적인 문서화 프로젝트
```bash
mdshare init --template documentation
```

**포함 내용**:
- 기본 README.md
- docs/ 폴더 구조
- getting-started/ 섹션
- examples/ 섹션
- assets/ 폴더

#### 🔌 api-docs
**용도**: API 문서화 프로젝트
```bash
mdshare init --template api-docs
```

**포함 내용**:
- API 개요 문서
- 인증 가이드
- 엔드포인트 문서
- 사용 예시
- OpenAPI 스펙 파일
- 샘플 요청/응답

#### 📝 blog
**용도**: 개인/팀 블로그
```bash
mdshare init --template blog
```

**포함 내용**:
- 블로그 홈페이지
- 카테고리별 포스트 구조
- 태그 시스템
- 댓글 기능 설정
- RSS 피드 설정

#### 📖 wiki
**용도**: 팀 위키/지식 베이스
```bash
mdshare init --template wiki
```

**포함 내용**:
- 위키 홈페이지
- 카테고리별 문서 구조
- 검색 기능
- 버전 관리 설정
- 협업 기능

#### 🎓 tutorial
**용도**: 튜토리얼/강의 자료
```bash
mdshare init --template tutorial
```

**포함 내용**:
- 학습 경로 구조
- 단계별 가이드
- 실습 예제
- 퀴즈/테스트
- 진도 추적

### 2. 고급 템플릿

#### 🏢 enterprise
**용도**: 엔터프라이즈 멀티 프로젝트
```bash
mdshare init --template enterprise
```

**포함 내용**:
- 워크스페이스 구조
- 여러 서비스 프로젝트
- 공통 리소스
- 보안 정책
- 개발 표준

#### 🚀 startup
**용도**: 스타트업 프로젝트
```bash
mdshare init --template startup
```

**포함 내용**:
- 제품 문서
- API 문서
- 마케팅 자료
- 투자자 자료
- 팀 소개

#### 🔬 research
**용도**: 연구 프로젝트
```bash
mdshare init --template research
```

**포함 내용**:
- 연구 개요
- 실험 결과
- 데이터 분석
- 논문 구조
- 참고 자료

## 🏗️ 템플릿 구조

### 템플릿 디렉토리 구조
```
templates/
├── 📁 documentation/
│   ├── 📄 template.json          # 템플릿 메타데이터
│   ├── 📄 template.yaml          # 템플릿 설정
│   ├── 📁 files/                 # 템플릿 파일들
│   │   ├── README.md.template
│   │   ├── .mdshare/
│   │   │   └── config.json.template
│   │   ├── docs/
│   │   │   ├── getting-started/
│   │   │   └── examples/
│   │   └── assets/
│   ├── 📁 scripts/               # 생성 스크립트
│   │   └── post-init.js
│   └── 📁 prompts/               # 대화형 프롬프트
│       └── questions.yaml
├── 📁 api-docs/
│   ├── 📄 template.json
│   ├── 📁 files/
│   │   ├── openapi.yaml.template
│   │   ├── docs/api/
│   │   └── data/samples/
│   └── 📁 scripts/
└── 📁 enterprise/
    ├── 📄 template.json
    ├── 📁 files/
    │   ├── .mdshare-workspace/
    │   ├── projects/
    │   └── shared/
    └── 📁 scripts/
```

### 템플릿 메타데이터 (template.json)
```json
{
  "name": "documentation",
  "displayName": "일반 문서화",
  "description": "일반적인 문서화 프로젝트를 위한 템플릿",
  "version": "1.0.0",
  "author": "MDShare Team",
  "category": "basic",
  "tags": ["documentation", "getting-started"],
  "icon": "📚",
  "preview": {
    "screenshot": "templates/documentation/preview.png",
    "demo": "https://demo.mdshare.app/documentation"
  },
  "variables": {
    "PROJECT_NAME": {
      "type": "string",
      "required": true,
      "prompt": "프로젝트 이름을 입력하세요"
    },
    "PROJECT_DESCRIPTION": {
      "type": "string",
      "required": true,
      "prompt": "프로젝트 설명을 입력하세요"
    },
    "AUTHOR_NAME": {
      "type": "string",
      "required": true,
      "prompt": "작성자 이름을 입력하세요"
    },
    "LANGUAGE": {
      "type": "select",
      "required": true,
      "options": ["ko", "en", "ja"],
      "default": "ko",
      "prompt": "문서 언어를 선택하세요"
    },
    "AI_FEATURES": {
      "type": "boolean",
      "required": false,
      "default": true,
      "prompt": "AI 기능을 활성화하시겠습니까?"
    }
  },
  "features": [
    "자동 인덱싱",
    "AI 태깅",
    "검색 기능",
    "다크 모드",
    "모바일 지원"
  ],
  "dependencies": {
    "node": ">=18.0.0",
    "npm": ">=9.0.0"
  },
  "postInstall": [
    "npm install",
    "npm run setup"
  ]
}
```

### 템플릿 설정 (template.yaml)
```yaml
name: documentation
version: 1.0.0

# 템플릿 파일 구조
structure:
  files:
    - path: README.md
      template: README.md.template
      variables:
        - PROJECT_NAME
        - PROJECT_DESCRIPTION
        - AUTHOR_NAME
        - LANGUAGE
    - path: .mdshare/config.json
      template: config.json.template
      variables:
        - PROJECT_NAME
        - PROJECT_DESCRIPTION
        - AUTHOR_NAME
        - AI_FEATURES
    - path: docs/getting-started/installation.md
      template: installation.md.template
      variables:
        - PROJECT_NAME
        - LANGUAGE
    - path: docs/examples/basic-usage.md
      template: basic-usage.md.template
      variables:
        - PROJECT_NAME
        - LANGUAGE

# 디렉토리 생성
directories:
  - docs/getting-started
  - docs/examples
  - docs/api
  - data/samples
  - assets/images
  - assets/diagrams
  - _meta

# 생성 후 실행할 스크립트
scripts:
  postInit:
    - name: "의존성 설치"
      command: "npm install"
    - name: "초기 설정"
      command: "npm run setup"
    - name: "Git 초기화"
      command: "git init"
      optional: true

# 대화형 질문
prompts:
  - type: input
    name: PROJECT_NAME
    message: "프로젝트 이름을 입력하세요"
    default: "My Documentation"
    validate: required
    
  - type: input
    name: PROJECT_DESCRIPTION
    message: "프로젝트 설명을 입력하세요"
    default: "프로젝트를 위한 문서화 시스템"
    
  - type: input
    name: AUTHOR_NAME
    message: "작성자 이름을 입력하세요"
    default: "Anonymous"
    
  - type: select
    name: LANGUAGE
    message: "문서 언어를 선택하세요"
    choices:
      - { name: "한국어", value: "ko" }
      - { name: "English", value: "en" }
      - { name: "日本語", value: "ja" }
    default: "ko"
    
  - type: confirm
    name: AI_FEATURES
    message: "AI 기능을 활성화하시겠습니까?"
    default: true
    
  - type: confirm
    name: GIT_INIT
    message: "Git 저장소를 초기화하시겠습니까?"
    default: true
```

## 🔧 템플릿 엔진

### 변수 치환 시스템
```typescript
interface TemplateVariable {
  name: string;
  type: 'string' | 'number' | 'boolean' | 'select';
  required: boolean;
  default?: any;
  prompt: string;
  options?: string[]; // select 타입일 때
  validate?: (value: any) => boolean | string;
}

class TemplateEngine {
  private variables: Map<string, any> = new Map();
  
  // 변수 설정
  setVariable(name: string, value: any): void {
    this.variables.set(name, value);
  }
  
  // 템플릿 파일 처리
  processTemplate(templateContent: string): string {
    return templateContent.replace(
      /\{\{(\w+)\}\}/g,
      (match, variableName) => {
        const value = this.variables.get(variableName);
        return value !== undefined ? String(value) : match;
      }
    );
  }
  
  // 조건부 블록 처리
  processConditionalBlocks(content: string): string {
    return content.replace(
      /\{\{#if\s+(\w+)\}\}([\s\S]*?)\{\{\/if\}\}/g,
      (match, condition, block) => {
        const value = this.variables.get(condition);
        return value ? block : '';
      }
    );
  }
}
```

### 파일 생성 시스템
```typescript
class TemplateGenerator {
  private engine: TemplateEngine;
  
  constructor() {
    this.engine = new TemplateEngine();
  }
  
  async generateFromTemplate(
    templatePath: string,
    outputPath: string,
    variables: Record<string, any>
  ): Promise<void> {
    // 변수 설정
    Object.entries(variables).forEach(([key, value]) => {
      this.engine.setVariable(key, value);
    });
    
    // 템플릿 파일 읽기
    const templateContent = await fs.readFile(templatePath, 'utf-8');
    
    // 변수 치환
    const processedContent = this.engine.processTemplate(templateContent);
    
    // 출력 파일 생성
    await fs.writeFile(outputPath, processedContent, 'utf-8');
  }
  
  async generateProject(
    templateName: string,
    outputDir: string,
    variables: Record<string, any>
  ): Promise<void> {
    const templateDir = path.join(this.getTemplatesDir(), templateName);
    const templateConfig = await this.loadTemplateConfig(templateDir);
    
    // 디렉토리 생성
    for (const dir of templateConfig.directories || []) {
      await fs.mkdir(path.join(outputDir, dir), { recursive: true });
    }
    
    // 파일 생성
    for (const file of templateConfig.files || []) {
      const templatePath = path.join(templateDir, 'files', file.template);
      const outputPath = path.join(outputDir, file.path);
      
      await this.generateFromTemplate(templatePath, outputPath, variables);
    }
    
    // 후처리 스크립트 실행
    await this.runPostInstallScripts(templateDir, outputDir);
  }
}
```

## 📦 템플릿 배포 시스템

### 템플릿 레지스트리
```typescript
interface TemplateRegistry {
  name: string;
  displayName: string;
  description: string;
  version: string;
  author: string;
  category: string;
  tags: string[];
  downloadUrl: string;
  checksum: string;
  dependencies: Record<string, string>;
  lastUpdated: Date;
}

class TemplateRegistryService {
  private registryUrl = 'https://registry.mdshare.app/templates';
  
  async getAvailableTemplates(): Promise<TemplateRegistry[]> {
    const response = await fetch(`${this.registryUrl}/list`);
    return await response.json();
  }
  
  async installTemplate(templateName: string): Promise<void> {
    const template = await this.getTemplateInfo(templateName);
    
    // 템플릿 다운로드
    const templatePath = await this.downloadTemplate(template);
    
    // 검증
    await this.verifyTemplate(templatePath, template.checksum);
    
    // 설치
    await this.installTemplateFiles(templatePath);
  }
  
  async searchTemplates(query: string): Promise<TemplateRegistry[]> {
    const response = await fetch(`${this.registryUrl}/search?q=${encodeURIComponent(query)}`);
    return await response.json();
  }
}
```

### 커스텀 템플릿 생성
```typescript
class CustomTemplateBuilder {
  async createTemplate(
    templateName: string,
    sourceDir: string,
    config: TemplateConfig
  ): Promise<void> {
    const templateDir = path.join(this.getTemplatesDir(), templateName);
    
    // 템플릿 디렉토리 생성
    await fs.mkdir(templateDir, { recursive: true });
    
    // 설정 파일 생성
    await fs.writeFile(
      path.join(templateDir, 'template.json'),
      JSON.stringify(config, null, 2)
    );
    
    // 템플릿 파일 복사
    await this.copyTemplateFiles(sourceDir, templateDir);
    
    // 패키징
    await this.packageTemplate(templateDir);
  }
  
  async publishTemplate(templateName: string): Promise<void> {
    const templatePath = path.join(this.getTemplatesDir(), templateName);
    const packagePath = await this.createTemplatePackage(templatePath);
    
    // 레지스트리에 업로드
    await this.uploadToRegistry(packagePath);
  }
}
```

## 🎨 템플릿 예시

### API 문서 템플릿 파일 예시

**README.md.template**
```markdown
---
title: "{{PROJECT_NAME}}"
description: "{{PROJECT_DESCRIPTION}}"
author: "{{AUTHOR_NAME}}"
category: "api-documentation"
tags: ["api", "{{API_TYPE}}", "documentation"]
difficulty: "{{DIFFICULTY}}"
createdAt: "{{CREATED_DATE}}"
updatedAt: "{{CREATED_DATE}}"
version: "1.0.0"
status: "published"
---

# {{PROJECT_NAME}}

{{PROJECT_DESCRIPTION}}

## 🔧 API 개요

이 API는 {{API_TYPE}} 기반으로 구축되었습니다.

{{#if AUTHENTICATION}}
## 🔐 인증

{{AUTHENTICATION}} 방식을 사용합니다.

{{#if AUTHENTICATION_JWT}}
### JWT 토큰 인증
```http
Authorization: Bearer <your-jwt-token>
```
{{/if}}

{{#if AUTHENTICATION_API_KEY}}
### API 키 인증
```http
X-API-Key: <your-api-key>
```
{{/if}}
{{/if}}

## 📚 API 엔드포인트

### 기본 URL
```
{{BASE_URL}}
```

### 주요 엔드포인트
- `GET /api/v1/{{ENDPOINTS}}` - {{ENDPOINTS}} 목록 조회
- `POST /api/v1/{{ENDPOINTS}}` - 새 {{ENDPOINTS}} 생성
- `GET /api/v1/{{ENDPOINTS}}/{id}` - 특정 {{ENDPOINTS}} 조회
- `PUT /api/v1/{{ENDPOINTS}}/{id}` - {{ENDPOINTS}} 수정
- `DELETE /api/v1/{{ENDPOINTS}}/{id}` - {{ENDPOINTS}} 삭제

## 🚀 빠른 시작

1. [인증 설정](docs/authentication.md)
2. [첫 번째 요청](docs/quick-start.md)
3. [사용 예시](docs/examples/)

## 📖 상세 문서

- [인증 가이드](docs/authentication.md)
- [API 레퍼런스](docs/api-reference.md)
- [에러 코드](docs/error-codes.md)
- [사용 예시](docs/examples/)
- [SDK 및 라이브러리](docs/sdks/)

{{#if OPENAPI_SPEC}}
## 📋 OpenAPI 스펙

이 API의 완전한 스펙은 [OpenAPI 문서](openapi.yaml)에서 확인할 수 있습니다.
{{/if}}

## 📞 지원

- **문서**: [MDShare 문서](https://docs.mdshare.app)
- **이슈**: [GitHub Issues](https://github.com/mdshare/mdshare/issues)
- **커뮤니티**: [Discord](https://discord.gg/mdshare)

---

**참고**: 이 문서는 MDShare API 문서 템플릿으로 생성되었습니다.
```

**openapi.yaml.template**
```yaml
openapi: 3.0.0
info:
  title: "{{PROJECT_NAME}}"
  description: "{{PROJECT_DESCRIPTION}}"
  version: "1.0.0"
  contact:
    name: "{{AUTHOR_NAME}}"
servers:
  - url: "{{BASE_URL}}"
    description: "Production server"
  - url: "{{BASE_URL_STAGING}}"
    description: "Staging server"

{{#if AUTHENTICATION}}
security:
  {{#if AUTHENTICATION_JWT}}
  - bearerAuth: []
  {{/if}}
  {{#if AUTHENTICATION_API_KEY}}
  - apiKeyAuth: []
  {{/if}}

components:
  securitySchemes:
    {{#if AUTHENTICATION_JWT}}
    bearerAuth:
      type: http
      scheme: bearer
      bearerFormat: JWT
    {{/if}}
    {{#if AUTHENTICATION_API_KEY}}
    apiKeyAuth:
      type: apiKey
      in: header
      name: X-API-Key
    {{/if}}
{{/if}}

paths:
  /api/v1/{{ENDPOINTS}}:
    get:
      summary: "{{ENDPOINTS}} 목록 조회"
      description: "모든 {{ENDPOINTS}}의 목록을 조회합니다."
      {{#if AUTHENTICATION}}
      security:
        {{#if AUTHENTICATION_JWT}}
        - bearerAuth: []
        {{/if}}
        {{#if AUTHENTICATION_API_KEY}}
        - apiKeyAuth: []
        {{/if}}
      {{/if}}
      parameters:
        - name: page
          in: query
          description: "페이지 번호"
          schema:
            type: integer
            default: 1
        - name: limit
          in: query
          description: "페이지당 항목 수"
          schema:
            type: integer
            default: 20
      responses:
        '200':
          description: "성공"
          content:
            application/json:
              schema:
                type: object
                properties:
                  success:
                    type: boolean
                  data:
                    type: object
                    properties:
                      items:
                        type: array
                        items:
                          $ref: '#/components/schemas/{{ENDPOINTS_SINGULAR}}'
                      pagination:
                        $ref: '#/components/schemas/Pagination'
        '401':
          description: "인증 실패"
        '500':
          description: "서버 오류"

components:
  schemas:
    {{ENDPOINTS_SINGULAR}}:
      type: object
      properties:
        id:
          type: string
          description: "고유 식별자"
        name:
          type: string
          description: "이름"
        createdAt:
          type: string
          format: date-time
          description: "생성일시"
        updatedAt:
          type: string
          format: date-time
          description: "수정일시"
      required:
        - id
        - name

    Pagination:
      type: object
      properties:
        page:
          type: integer
        limit:
          type: integer
        total:
          type: integer
        totalPages:
          type: integer
        hasNext:
          type: boolean
        hasPrev:
          type: boolean
```

## 🔄 템플릿 업데이트 시스템

### 자동 업데이트
```typescript
class TemplateUpdateService {
  async checkForUpdates(): Promise<UpdateInfo[]> {
    const installedTemplates = await this.getInstalledTemplates();
    const updates: UpdateInfo[] = [];
    
    for (const template of installedTemplates) {
      const latestVersion = await this.getLatestVersion(template.name);
      
      if (this.isNewerVersion(latestVersion, template.version)) {
        updates.push({
          name: template.name,
          currentVersion: template.version,
          latestVersion: latestVersion,
          changelog: await this.getChangelog(template.name, template.version, latestVersion)
        });
      }
    }
    
    return updates;
  }
  
  async updateTemplate(templateName: string): Promise<void> {
    const updateInfo = await this.getUpdateInfo(templateName);
    
    // 백업 생성
    await this.createBackup(templateName);
    
    // 새 버전 다운로드
    await this.downloadTemplate(templateName, updateInfo.latestVersion);
    
    // 검증
    await this.verifyTemplate(templateName);
    
    // 업데이트 완료
    await this.markAsUpdated(templateName, updateInfo.latestVersion);
  }
}
```

---

이 템플릿 시스템을 통해 사용자는 **간단한 명령어로 완전한 프로젝트 구조**를 얻을 수 있고, **커뮤니티에서 제공하는 다양한 템플릿**을 활용할 수 있습니다.
