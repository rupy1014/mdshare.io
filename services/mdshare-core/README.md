# MDShare Core

MDShare Core는 AI 기반 마크다운 문서화 시스템의 핵심 라이브러리입니다.

## 🚀 주요 기능

- **확장된 마크다운 파싱**: Frontmatter, CSV/JSON 렌더링, 다이어그램 지원
- **메타데이터 관리**: 프로젝트 설정, 인덱스, AI 분석 결과 관리
- **AI 기능**: 자동 인덱싱, 관계 분석, 콘텐츠 제안
- **프로젝트 관리**: 멀티 프로젝트 지원, 통합 분석

## 📦 설치

```bash
npm install mdshare-core
```

## 🔧 사용법

### 기본 사용법

```typescript
import { MDShareEngine } from 'mdshare-core';

// 프로젝트 초기화
const engine = new MDShareEngine('./my-project');
await engine.initializeProject('My Project', 'Author Name');

// 문서 파싱
const result = await engine.parseFile('./docs/README.md');
if (result.success) {
  console.log('Title:', result.document.frontmatter.title);
  console.log('Word count:', result.document.metadata.wordCount);
}

// 모든 문서 파싱
const parseResults = await engine.parseAllFiles();
console.log(`Parsed ${parseResults.success} files successfully`);

// 프로젝트 통계
const stats = await engine.getStatistics();
console.log('Total documents:', stats.documentCount);
console.log('Total words:', stats.totalWords);
```

### 마크다운 파서 직접 사용

```typescript
import { MarkdownParser } from 'mdshare-core';

const parser = new MarkdownParser();
const result = await parser.parse(markdownContent, {
  includeHtml: true,
  extractMetadata: true,
  processDiagrams: true
});

if (result.success) {
  console.log('HTML:', result.document.html);
  console.log('Metadata:', result.document.metadata);
}
```

## 🎯 확장된 마크다운 문법

### CSV 렌더링
```markdown
@csv[data/sample.csv]
```

### JSON 렌더링
```markdown
@json[data/config.json]
```

### 다이어그램
```markdown
```mermaid
@mermaid[
graph TD
    A[Start] --> B[Process]
    B --> C[End]
]
```
```

## 📁 프로젝트 구조

```
my-project/
├── .mdshare/
│   ├── config.json          # 프로젝트 설정
│   ├── index.json           # 메인 인덱스
│   └── ai-indexes/          # AI 인덱스
│       ├── by-topic.json
│       ├── by-date.json
│       └── by-relationship.json
├── docs/                    # 문서 폴더
├── data/                    # 데이터 폴더
├── assets/                  # 정적 자산
└── _meta/                   # 메타데이터
```

## 🧪 예제 실행

```bash
# 기본 사용법 예제
npx ts-node examples/basic-usage.ts

# 파서 테스트 예제
npx ts-node examples/parser-test.ts
```

## 📚 API 문서

### MDShareEngine

주요 클래스로, 전체 프로젝트를 관리합니다.

#### 메서드

- `initializeProject(name, author)`: 새 프로젝트 초기화
- `parseFile(path, options)`: 단일 파일 파싱
- `parseAllFiles(options)`: 모든 파일 파싱
- `getStatistics()`: 프로젝트 통계 조회
- `searchDocuments(query)`: 문서 검색
- `getDocumentsByCategory(category)`: 카테고리별 문서 조회
- `getDocumentsByTag(tag)`: 태그별 문서 조회

### MarkdownParser

마크다운 파싱을 담당하는 클래스입니다.

#### 메서드

- `parse(content, options)`: 마크다운 콘텐츠 파싱

#### 옵션

- `includeHtml`: HTML 생성 여부 (기본값: true)
- `extractMetadata`: 메타데이터 추출 여부 (기본값: true)
- `processDiagrams`: 다이어그램 처리 여부 (기본값: true)
- `resolveLinks`: 내부 링크 해석 여부 (기본값: true)
- `basePath`: 기본 경로

### MetadataManager

메타데이터 관리를 담당하는 클래스입니다.

#### 메서드

- `loadConfig()`: 프로젝트 설정 로드
- `saveConfig(config)`: 프로젝트 설정 저장
- `loadIndex()`: 프로젝트 인덱스 로드
- `saveIndex(index)`: 프로젝트 인덱스 저장

## 🔄 개발

```bash
# 의존성 설치
npm install

# 빌드
npm run build

# 개발 모드
npm run dev

# 테스트
npm test
```

## 📄 라이선스

MIT License

## 🤝 기여

기여를 환영합니다! 이슈를 생성하거나 풀 리퀘스트를 보내주세요.

## 📞 지원

- **문서**: [MDShare 문서](https://docs.mdshare.app)
- **이슈**: [GitHub Issues](https://github.com/mdshare/mdshare-core/issues)
- **커뮤니티**: [Discord](https://discord.gg/mdshare)
