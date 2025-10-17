# 기술 아키텍처 및 상세 기능 명세

## 🏗️ 시스템 아키텍처

### 전체 구조
```
┌─────────────────┐
│  Desktop App    │ ← 로컬 업로드 전용
│  (Electron)     │
└────────┬────────┘
         │ HTTPS
         ▼
┌─────────────────────────────────────────┐
│           API Gateway                    │
│         (Rate Limiting)                  │
└─────────┬───────────────────────────────┘
          │
    ┌─────┴──────┬──────────┬──────────┐
    ▼            ▼          ▼          ▼
┌────────┐  ┌────────┐  ┌──────┐  ┌──────┐
│ Upload │  │ Auth   │  │ View │  │ AI   │
│Service │  │Service │  │Service│ │Service│
└───┬────┘  └───┬────┘  └──┬───┘  └──┬───┘
    │           │          │         │
    ▼           ▼          ▼         ▼
┌──────────────────────────────────────────┐
│         PostgreSQL                        │
│  (Users, Projects, Files, Permissions)   │
└──────────────────────────────────────────┘
    │           │          │         │
    ▼           ▼          ▼         ▼
┌─────────┐ ┌────────┐ ┌──────┐ ┌──────────┐
│   S3    │ │ Redis  │ │ CDN  │ │ Pinecone │
│(Files)  │ │(Cache) │ │(静的)│ │(Vector)  │
└─────────┘ └────────┘ └──────┘ └──────────┘
```

## 🔄 하이브리드 아키텍처 (Markdown ↔ JSON) ⭐ 핵심 차별화

### 철학: "사용자는 단순하게, AI는 똑똑하게"

**핵심 개념:**
- **사용자 레이어**: Markdown 파일 (간단, Git 호환, 데이터 소유권)
- **AI 레이어**: JSON 구조화 (검색, 인덱싱, 벡터화, 관계 분석)
- **Best of Both Worlds**: GitBook의 단순함 + Notion의 똑똑함

```
┌─────────────────────────────────────────────┐
│  Layer 1: 사용자 소스 (Source of Truth)        │
│  .md 파일 → Git 버전 관리 → 사용자 직접 편집      │
└──────────────────┬──────────────────────────┘
                   │ Parsing Pipeline
                   ▼
┌─────────────────────────────────────────────┐
│  Layer 2: 구조화 레이어 (JSON)                  │
│  AST → Block 분해 → 메타데이터 추출 → 관계 분석   │
└──────────────────┬──────────────────────────┘
                   │ AI Processing
                   ▼
┌─────────────────────────────────────────────┐
│  Layer 3: AI 레이어                           │
│  벡터화 → 검색 인덱스 → 자동 태깅 → 관계 그래프    │
└─────────────────────────────────────────────┘
```

### Markdown → JSON 변환 파이프라인

#### 1. 파싱 & 구조화
```typescript
// lib/parser/markdown-to-json.ts

interface ParsedDocument {
  id: string;
  metadata: DocumentMetadata;
  blocks: Block[];
  structure: DocumentStructure;
  aiEnriched: AIEnrichment;
}

interface Block {
  id: string;
  type: 'heading' | 'paragraph' | 'list' | 'code' | 'table' | 'image';
  level?: number;        // heading만 해당
  content: string;
  rawMarkdown: string;
  position: { start: number; end: number };
  vector?: number[];     // AI 벡터 임베딩
  children?: Block[];    // 계층 구조
}

interface DocumentMetadata {
  // Frontmatter 추출
  title: string;
  date?: string;
  author?: string;
  tags?: string[];
  category?: string;

  // AI 자동 추출
  summary?: string;              // AI 생성 요약
  relatedDocs?: string[];        // AI 발견 관련 문서
  prerequisites?: string[];      // 선행 문서
  targetAudience?: string[];     // 대상 독자
  estimatedReadingTime?: number; // 예상 읽기 시간

  // 계층 구조
  parent?: string;
  children?: string[];

  // AI 친화도
  aiScore?: number;              // 0-100
  aiSuggestions?: string[];      // 개선 제안
}

// 전체 파싱 프로세스
async function parseMarkdownToJSON(
  markdownContent: string,
  filePath: string,
  projectId: string
): Promise<ParsedDocument> {

  // 1. Frontmatter 추출
  const { frontmatter, content } = extractFrontmatter(markdownContent);

  // 2. Markdown → AST (Abstract Syntax Tree)
  const ast = unified()
    .use(remarkParse)
    .use(remarkGfm)
    .parse(content);

  // 3. AST → Block 구조
  const blocks: Block[] = [];
  let blockId = 0;

  visit(ast, (node) => {
    if (isBlockNode(node)) {
      blocks.push({
        id: `${projectId}_${filePath}_${blockId++}`,
        type: node.type as Block['type'],
        level: node.depth,
        content: extractTextContent(node),
        rawMarkdown: nodeToMarkdown(node),
        position: node.position,
        children: node.children ? parseChildren(node.children) : []
      });
    }
  });

  // 4. 문서 구조 분석
  const structure = analyzeDocumentStructure(blocks);

  // 5. AI 분석 (비동기 큐로 처리)
  const aiEnriched = await enrichWithAI(blocks, frontmatter);

  return {
    id: generateDocId(projectId, filePath),
    metadata: {
      ...frontmatter,
      ...aiEnriched.metadata
    },
    blocks,
    structure,
    aiEnriched
  };
}
```

#### 2. 문서 구조 분석
```typescript
interface DocumentStructure {
  headings: HeadingNode[];
  tableOfContents: TOCEntry[];
  sections: Section[];
  links: Link[];
  codeBlocks: CodeBlock[];
  images: Image[];
}

interface HeadingNode {
  id: string;
  level: number;
  text: string;
  children: HeadingNode[];
  blockIds: string[];  // 이 섹션에 속한 블록들
}

// 자동 목차 생성
function generateTableOfContents(blocks: Block[]): TOCEntry[] {
  const toc: TOCEntry[] = [];
  const headings = blocks.filter(b => b.type === 'heading');

  let stack: { level: number; entry: TOCEntry }[] = [];

  for (const heading of headings) {
    const entry: TOCEntry = {
      id: heading.id,
      level: heading.level,
      text: heading.content,
      children: []
    };

    // 계층 구조 생성
    while (stack.length > 0 && stack[stack.length - 1].level >= heading.level) {
      stack.pop();
    }

    if (stack.length === 0) {
      toc.push(entry);
    } else {
      stack[stack.length - 1].entry.children.push(entry);
    }

    stack.push({ level: heading.level, entry });
  }

  return toc;
}
```

#### 3. AI 자동 분석 & 강화
```typescript
// AI 분석 파이프라인 (BullMQ 백그라운드 작업)
async function enrichWithAI(
  blocks: Block[],
  frontmatter: DocumentMetadata
): Promise<AIEnrichment> {

  // 1. 문서 요약 생성 (frontmatter.summary가 없을 때만)
  let summary = frontmatter.summary;
  if (!summary) {
    summary = await generateSummary(blocks);
  }

  // 2. 자동 태깅 (frontmatter.tags 보완)
  const autoTags = await extractTags(blocks);
  const tags = [...new Set([...(frontmatter.tags || []), ...autoTags])];

  // 3. 블록 단위 벡터화
  const blocksWithVectors = await Promise.all(
    blocks.map(async (block) => ({
      ...block,
      vector: await embedText(block.content)
    }))
  );

  // 4. AI 친화도 평가
  const aiScore = evaluateAIFriendliness({
    frontmatter,
    blocks,
    structure: analyzeDocumentStructure(blocks)
  });

  // 5. 개선 제안 생성
  const suggestions = generateImprovementSuggestions(aiScore);

  return {
    metadata: {
      summary,
      tags,
      aiScore: aiScore.total,
      aiSuggestions: suggestions
    },
    blocksWithVectors
  };
}

// AI 친화도 평가 알고리즘
function evaluateAIFriendliness(doc: {
  frontmatter: DocumentMetadata;
  blocks: Block[];
  structure: DocumentStructure;
}): AIScore {

  let scores = {
    frontmatter: 0,   // 30점
    structure: 0,     // 30점
    clarity: 0,       // 20점
    links: 0          // 20점
  };

  // 1. Frontmatter 완성도 (30점)
  const requiredFields = ['title', 'summary', 'tags', 'category'];
  const optionalFields = ['relatedDocs', 'prerequisites', 'targetAudience'];

  scores.frontmatter += requiredFields.filter(f => doc.frontmatter[f]).length * 5;
  scores.frontmatter += optionalFields.filter(f => doc.frontmatter[f]).length * 3;

  // 2. 구조화 수준 (30점)
  const hasHeadings = doc.structure.headings.length > 0;
  const hasMultipleLevels = new Set(doc.structure.headings.map(h => h.level)).size > 1;
  const hasCodeBlocks = doc.structure.codeBlocks.length > 0;
  const hasTOC = doc.structure.tableOfContents.length >= 3;

  if (hasHeadings) scores.structure += 10;
  if (hasMultipleLevels) scores.structure += 10;
  if (hasCodeBlocks) scores.structure += 5;
  if (hasTOC) scores.structure += 5;

  // 3. 내용 명확성 (20점)
  const avgBlockLength = doc.blocks.reduce((sum, b) => sum + b.content.length, 0) / doc.blocks.length;
  const hasLists = doc.blocks.some(b => b.type === 'list');
  const hasExamples = doc.blocks.some(b => b.content.includes('예:') || b.content.includes('example'));

  if (avgBlockLength > 50 && avgBlockLength < 500) scores.clarity += 10; // 적정 길이
  if (hasLists) scores.clarity += 5;
  if (hasExamples) scores.clarity += 5;

  // 4. 링크 및 관계 (20점)
  const internalLinks = doc.structure.links.filter(l => l.type === 'internal').length;
  const hasRelatedDocs = doc.frontmatter.relatedDocs && doc.frontmatter.relatedDocs.length > 0;

  scores.links += Math.min(internalLinks * 3, 15);
  if (hasRelatedDocs) scores.links += 5;

  const total = Object.values(scores).reduce((sum, s) => sum + s, 0);

  return {
    ...scores,
    total,
    grade: total >= 80 ? 'excellent' : total >= 60 ? 'good' : total >= 40 ? 'fair' : 'poor'
  };
}
```

### JSON 기반 검색 최적화

#### 1. 하이브리드 검색 (Lexical + Semantic)
```typescript
// 검색 전략: 키워드 + 의미 기반 결합
async function hybridSearch(
  projectId: string,
  query: string,
  options: SearchOptions = {}
): Promise<SearchResult[]> {

  // 1. Lexical Search (BM25 알고리즘 - Elasticsearch)
  const lexicalResults = await elasticsearch.search({
    index: `project_${projectId}`,
    body: {
      query: {
        multi_match: {
          query,
          fields: ['metadata.title^3', 'blocks.content^2', 'metadata.tags'],
          type: 'best_fields',
          fuzziness: 'AUTO'
        }
      },
      size: 20
    }
  });

  // 2. Semantic Search (벡터 유사도 - Pinecone)
  const queryEmbedding = await embedText(query);
  const semanticResults = await pinecone.query({
    vector: queryEmbedding,
    topK: 20,
    filter: { projectId },
    includeMetadata: true
  });

  // 3. Hybrid Fusion (Reciprocal Rank Fusion)
  const combined = fuseResults(lexicalResults, semanticResults);

  // 4. Metadata Filtering
  const filtered = applyMetadataFilters(combined, options);

  // 5. Reranking (Cross-Encoder for top 10)
  const reranked = await rerankResults(query, filtered.slice(0, 10));

  return reranked;
}

// Reciprocal Rank Fusion 알고리즘
function fuseResults(
  lexicalResults: any[],
  semanticResults: any[],
  k: number = 60
): SearchResult[] {
  const scores = new Map<string, number>();

  // Lexical 점수
  lexicalResults.forEach((result, rank) => {
    const docId = result._id;
    scores.set(docId, (scores.get(docId) || 0) + 1 / (k + rank + 1));
  });

  // Semantic 점수
  semanticResults.forEach((result, rank) => {
    const docId = result.id;
    scores.set(docId, (scores.get(docId) || 0) + 1 / (k + rank + 1));
  });

  // 점수순 정렬
  return Array.from(scores.entries())
    .sort((a, b) => b[1] - a[1])
    .map(([docId, score]) => ({
      docId,
      score,
      // ... 메타데이터
    }));
}
```

#### 2. 계층적 검색 (Hierarchical Search)
```typescript
// 3단계 검색: 문서 → 섹션 → 블록
async function hierarchicalSearch(
  projectId: string,
  query: string
): Promise<HierarchicalResult[]> {

  // Level 1: 문서 레벨 검색
  const relevantDocs = await searchDocuments(projectId, query, { topK: 5 });

  // Level 2: 관련 문서 내 섹션 검색
  const sections = await Promise.all(
    relevantDocs.map(doc =>
      searchSectionsInDoc(doc.id, query)
    )
  );

  // Level 3: 블록 단위 정밀 검색
  const blocks = await Promise.all(
    sections.flat().map(section =>
      searchBlocksInSection(section.id, query)
    )
  );

  return {
    documents: relevantDocs,
    sections: sections.flat(),
    blocks: blocks.flat()
  };
}
```

#### 3. 쿼리 확장 (Query Expansion)
```typescript
// LLM으로 동의어/약어 확장
async function expandQuery(query: string): Promise<string[]> {
  const expanded = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [{
      role: 'system',
      content: '사용자 검색어의 동의어, 약어, 관련 용어를 5개 이내로 추출하세요.'
    }, {
      role: 'user',
      content: query
    }],
    temperature: 0.3
  });

  return [query, ...parseExpandedTerms(expanded.choices[0].message.content)];
}

// 예시:
// "JWT" → ["JWT", "JSON Web Token", "토큰 인증", "Bearer Token"]
// "온보딩" → ["온보딩", "신입교육", "신규입사", "오리엔테이션"]
```

### 자동 인덱싱 시스템

#### 1. 인덱스 자동 생성
```typescript
// .index/ 폴더 자동 생성
async function generateAutoIndexes(projectId: string) {
  const allDocs = await getAllDocuments(projectId);

  // 1. 주제별 인덱스 (AI 자동 분류)
  const byTopic = await clusterByTopic(allDocs);
  await saveIndex(projectId, 'by-topic.md', formatTopicIndex(byTopic));

  // 2. 날짜별 타임라인
  const byDate = groupByDate(allDocs);
  await saveIndex(projectId, 'by-date.md', formatDateIndex(byDate));

  // 3. 작성자별
  const byAuthor = groupByAuthor(allDocs);
  await saveIndex(projectId, 'by-author.md', formatAuthorIndex(byAuthor));

  // 4. 카테고리별 (frontmatter 기반)
  const byCategory = groupByCategory(allDocs);
  await saveIndex(projectId, 'by-category.md', formatCategoryIndex(byCategory));

  // 5. 문서 관계 그래프
  const relationships = await analyzeDocumentRelationships(allDocs);
  await saveIndex(projectId, 'related-docs.md', formatRelationshipIndex(relationships));

  // 6. AI 추천 구조
  const aiSuggested = await generateRecommendedStructure(allDocs);
  await saveIndex(projectId, 'ai-suggested.md', formatSuggestedIndex(aiSuggested));
}

// AI 기반 주제 클러스터링
async function clusterByTopic(docs: ParsedDocument[]): Promise<TopicCluster[]> {
  // 1. 모든 문서 벡터 수집
  const vectors = docs.map(doc => ({
    id: doc.id,
    vector: averageBlockVectors(doc.blocks),
    title: doc.metadata.title
  }));

  // 2. K-means 클러스터링 (또는 HDBSCAN)
  const clusters = performClustering(vectors, { k: 'auto' });

  // 3. 각 클러스터 주제 레이블링 (LLM)
  const labeled = await Promise.all(
    clusters.map(async (cluster) => {
      const docTitles = cluster.members.map(m => m.title);
      const label = await generateTopicLabel(docTitles);
      return { ...cluster, topic: label };
    })
  );

  return labeled;
}

// 문서 관계 분석 (벡터 유사도 + 링크 그래프)
async function analyzeDocumentRelationships(
  docs: ParsedDocument[]
): Promise<DocumentRelationship[]> {
  const relationships: DocumentRelationship[] = [];

  for (const doc of docs) {
    // 1. 명시적 링크 (내부 링크)
    const explicitLinks = doc.structure.links
      .filter(l => l.type === 'internal')
      .map(l => ({ target: l.href, strength: 1.0, type: 'explicit' }));

    // 2. 암시적 관계 (벡터 유사도)
    const docVector = averageBlockVectors(doc.blocks);
    const similar = await findSimilarDocuments(docVector, docs, { topK: 5, threshold: 0.7 });
    const implicitLinks = similar.map(s => ({
      target: s.id,
      strength: s.similarity,
      type: 'semantic'
    }));

    // 3. 계층적 관계 (frontmatter parent/children)
    const hierarchical = [
      ...(doc.metadata.parent ? [{ target: doc.metadata.parent, type: 'parent' }] : []),
      ...(doc.metadata.children || []).map(c => ({ target: c, type: 'child' }))
    ];

    relationships.push({
      source: doc.id,
      links: [...explicitLinks, ...implicitLinks, ...hierarchical]
    });
  }

  return relationships;
}
```

#### 2. 실시간 인덱스 업데이트
```typescript
// 문서 추가/수정 시 자동 인덱스 업데이트
async function onDocumentChange(
  projectId: string,
  docId: string,
  changeType: 'create' | 'update' | 'delete'
) {
  // 1. 영향받는 인덱스 식별
  const affectedIndexes = identifyAffectedIndexes(docId, changeType);

  // 2. 증분 업데이트 (전체 재생성 아님)
  for (const indexType of affectedIndexes) {
    await updateIndexIncremental(projectId, indexType, docId, changeType);
  }

  // 3. 관계 그래프 업데이트
  if (changeType !== 'delete') {
    await updateDocumentRelationships(projectId, docId);
  }
}
```

### 성능 최적화

**파싱 속도:**
- 증분 파싱: 변경된 파일만 재파싱
- 캐싱: AST 결과 Redis 캐싱 (30분)
- 병렬 처리: 여러 파일 동시 파싱

**검색 속도:**
- Elasticsearch: Lexical 검색 < 50ms
- Pinecone: Semantic 검색 < 100ms
- Reranking: Top 10만 처리 < 200ms
- 총 검색 시간: < 400ms

**메모리 효율:**
- 블록 단위 벡터화: 전체 문서 아닌 블록별
- Lazy Loading: 필요한 블록만 로드
- 벡터 압축: Product Quantization

## 🎨 프론트엔드 (Web Viewer)

### 기술 스택
- **Framework**: Next.js 14 (App Router)
- **UI Library**: React 18
- **Styling**: Tailwind CSS + shadcn/ui
- **마크다운 렌더링**:
  - `remark` (파싱)
  - `rehype` (HTML 변환)
  - `react-markdown` (렌더링)
  - `remark-gfm` (GitHub Flavored Markdown)
  - `remark-frontmatter` (메타데이터)
- **확장 렌더링**:
  - `mermaid` (다이어그램)
  - `react-csv-viewer` (CSV 테이블)
  - `react-player` (YouTube/Vimeo 임베드)
  - `react-syntax-highlighter` (코드 블록)
- **코드 하이라이팅**: Shiki
- **상태 관리**: Zustand
- **데이터 페칭**: TanStack Query (React Query)

### 확장 마크다운 렌더링 엔진

**핵심 철학**: "간결한 원본 + 풍부한 렌더링"

#### 렌더링 파이프라인
```typescript
// lib/markdown/renderer.ts

// 1. 마크다운 파싱 & 변환
const pipeline = unified()
  .use(remarkParse)                    // MD → AST
  .use(remarkGfm)                      // GitHub 확장
  .use(remarkFrontmatter)              // Frontmatter 추출
  .use(remarkExtendedLinks)            // 스마트 링크 처리 ⭐
  .use(remarkDataFiles)                // CSV/JSON 감지 ⭐
  .use(remarkDiagrams)                 // Mermaid 처리 ⭐
  .use(rehypeRaw)                      // HTML 허용
  .use(rehypeHighlight)                // 코드 하이라이팅
  .use(rehypeReact, { components });   // React 컴포넌트로 변환

// 2. 커스텀 플러그인 (핵심 차별화)

// CSV/JSON 자동 감지 및 변환
function remarkDataFiles() {
  return (tree) => {
    visit(tree, 'link', (node) => {
      const url = node.url;

      // CSV 링크 감지
      if (url.endsWith('.csv')) {
        node.type = 'csv-embed';
        node.data = { csvPath: url };
      }

      // JSON 링크 감지
      if (url.endsWith('.json')) {
        node.type = 'json-embed';
        node.data = { jsonPath: url };
      }
    });
  };
}

// 외부 링크 자동 임베드
function remarkExtendedLinks() {
  return (tree) => {
    visit(tree, 'link', (node) => {
      const url = node.url;

      // YouTube 링크 감지
      if (isYouTubeUrl(url)) {
        node.type = 'youtube-embed';
        node.data = { videoId: extractYouTubeId(url) };
      }

      // GitHub 링크 미리보기
      if (isGitHubUrl(url)) {
        node.type = 'github-preview';
        node.data = { repoUrl: url };
      }
    });
  };
}

// 3. 커스텀 React 컴포넌트 매핑
const components = {
  // CSV 자동 테이블
  'csv-embed': ({ csvPath }) => (
    <CSVTable
      path={csvPath}
      sortable
      filterable
      downloadable
    />
  ),

  // JSON 구조화 뷰
  'json-embed': ({ jsonPath }) => (
    <JSONViewer
      path={jsonPath}
      expandable
    />
  ),

  // YouTube 임베드
  'youtube-embed': ({ videoId }) => (
    <YouTubePlayer
      videoId={videoId}
      responsive
    />
  ),

  // Mermaid 다이어그램
  'code.language-mermaid': ({ children }) => (
    <MermaidDiagram code={children} />
  ),

  // 코드 블록 (복사 버튼 포함)
  'code': ({ className, children }) => (
    <CodeBlock
      language={className?.replace('language-', '')}
      code={children}
      copyable
    />
  ),

  // 이미지 최적화
  'img': ({ src, alt }) => (
    <OptimizedImage
      src={src}
      alt={alt}
      lazyLoad
      lightbox
    />
  )
};
```

#### 핵심 컴포넌트 상세

**1. CSV 테이블 렌더러**
```typescript
// components/markdown/CSVTable.tsx
interface CSVTableProps {
  path: string;           // CSV 파일 경로
  sortable?: boolean;     // 정렬 가능 여부
  filterable?: boolean;   // 필터링 가능 여부
  downloadable?: boolean; // 다운로드 가능 여부
}

function CSVTable({ path, sortable, filterable, downloadable }: CSVTableProps) {
  const { data, loading } = useCSVData(path);
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [filterText, setFilterText] = useState('');

  // CSV 파싱
  const parsedData = useMemo(() => {
    return Papa.parse(data, { header: true });
  }, [data]);

  // 정렬 로직
  const sortedData = useMemo(() => {
    if (!sortColumn) return parsedData.data;
    return [...parsedData.data].sort((a, b) => {
      return a[sortColumn] > b[sortColumn] ? 1 : -1;
    });
  }, [parsedData, sortColumn]);

  // 필터링 로직
  const filteredData = useMemo(() => {
    if (!filterText) return sortedData;
    return sortedData.filter(row =>
      Object.values(row).some(val =>
        String(val).toLowerCase().includes(filterText.toLowerCase())
      )
    );
  }, [sortedData, filterText]);

  return (
    <div className="csv-table-container">
      <div className="toolbar">
        <span>📊 {path} ({filteredData.length} rows)</span>
        {filterable && (
          <input
            placeholder="Search..."
            onChange={(e) => setFilterText(e.target.value)}
          />
        )}
        {downloadable && (
          <button onClick={() => downloadCSV(data, path)}>
            ⬇ Download
          </button>
        )}
      </div>

      <table>
        <thead>
          <tr>
            {parsedData.meta.fields.map(field => (
              <th
                key={field}
                onClick={() => sortable && setSortColumn(field)}
                className={sortable ? 'sortable' : ''}
              >
                {field}
                {sortColumn === field && ' ▼'}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {filteredData.map((row, idx) => (
            <tr key={idx}>
              {parsedData.meta.fields.map(field => (
                <td key={field}>{row[field]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
```

**2. JSON 뷰어**
```typescript
// components/markdown/JSONViewer.tsx
interface JSONViewerProps {
  path: string;
  expandable?: boolean;
}

function JSONViewer({ path, expandable }: JSONViewerProps) {
  const { data, loading } = useJSONData(path);

  // API 엔드포인트 형식 감지
  const isAPIEndpoint = data.every(item =>
    'method' in item && 'path' in item
  );

  if (isAPIEndpoint) {
    return (
      <div className="api-endpoints">
        {data.map(endpoint => (
          <div key={endpoint.path} className="endpoint-card">
            <div className="method">{endpoint.method}</div>
            <div className="path">{endpoint.path}</div>
            <div className="description">{endpoint.description}</div>
            {endpoint.auth && <div className="badge">🔒 Auth Required</div>}
          </div>
        ))}
      </div>
    );
  }

  // 일반 JSON
  return (
    <ReactJson
      src={data}
      collapsed={!expandable}
      theme="monokai"
    />
  );
}
```

**3. Mermaid 다이어그램**
```typescript
// components/markdown/MermaidDiagram.tsx
function MermaidDiagram({ code }: { code: string }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      mermaid.render('mermaid-diagram', code).then(({ svg }) => {
        containerRef.current.innerHTML = svg;
      });
    }
  }, [code]);

  return <div ref={containerRef} className="mermaid-diagram" />;
}
```

**4. 스마트 링크 프리뷰**
```typescript
// components/markdown/LinkPreview.tsx
function GitHubPreview({ repoUrl }: { repoUrl: string }) {
  const { repo, loading } = useGitHubRepo(repoUrl);

  if (loading) return <a href={repoUrl}>{repoUrl}</a>;

  return (
    <div className="github-preview-card">
      <div className="header">
        <span className="icon">🔗</span>
        <span className="repo-name">{repo.full_name}</span>
      </div>
      <p className="description">{repo.description}</p>
      <div className="stats">
        <span>⭐ {repo.stargazers_count}</span>
        <span>🍴 {repo.forks_count}</span>
        <span>📝 {repo.language}</span>
      </div>
    </div>
  );
}
```

### 주요 컴포넌트

#### 1. 문서 뷰어
```typescript
// components/DocumentViewer.tsx
interface DocumentViewerProps {
  content: string;        // 마크다운 원문
  metadata: FileMetadata; // 파일 정보
  projectId: string;      // 프로젝트 ID (데이터 파일 경로 해석용)
  theme: 'light' | 'dark';
}

function DocumentViewer({ content, metadata, projectId, theme }: DocumentViewerProps) {
  // Frontmatter 추출
  const { frontmatter, content: mdContent } = extractFrontmatter(content);

  // 마크다운 렌더링 (확장 플러그인 포함)
  const renderedContent = useMemo(() => {
    return renderMarkdown(mdContent, {
      projectId,  // CSV/JSON 경로 해석에 사용
      basePath: metadata.path,
      components: customComponents
    });
  }, [mdContent, projectId, metadata.path]);

  return (
    <div className="document-viewer">
      {/* Frontmatter 헤더 */}
      {frontmatter && (
        <div className="document-header">
          <h1>{frontmatter.title || metadata.name}</h1>
          <div className="metadata">
            {frontmatter.author && <span>👤 {frontmatter.author}</span>}
            {frontmatter.date && <span>📅 {frontmatter.date}</span>}
            {frontmatter.tags && (
              <div className="tags">
                {frontmatter.tags.map(tag => (
                  <span key={tag} className="tag">🏷️ {tag}</span>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* 렌더링된 콘텐츠 */}
      <div className="markdown-content">
        {renderedContent}
      </div>
    </div>
  );
}
```

#### 2. 폴더 네비게이션
```typescript
// components/FolderTree.tsx
interface FolderTreeProps {
  structure: FolderNode[];  // 폴더 구조
  currentPath: string;
  onNavigate: (path: string) => void;
}

// 기능:
// - 접을 수 있는 트리 구조
// - 드래그 앤 드롭 지원 (미래)
// - 검색 필터링
// - 즐겨찾기
```

#### 3. 검색 인터페이스
```typescript
// components/SearchModal.tsx
interface SearchModalProps {
  projectId: string;
  onSelect: (fileId: string) => void;
}

// 기능:
// - 실시간 검색 (debounce)
// - 하이라이팅
// - 키보드 단축키 (Cmd+K)
// - 최근 검색어
```

#### 4. AI 챗봇 (Phase 2)
```typescript
// components/AIChatbot.tsx
interface AIChatbotProps {
  projectId: string;
  context: string[]; // 현재 보는 문서들
}

// 기능:
// - 문서 기반 Q&A
// - 스트리밍 응답
// - 소스 인용 (어떤 문서에서 답변)
// - 대화 히스토리
```

### 페이지 구조
```
/                          → 랜딩 페이지
/login                     → 로그인/회원가입
/dashboard                 → 내 프로젝트 목록
/p/[projectId]            → 프로젝트 홈
/p/[projectId]/f/[...path] → 파일 뷰어
/p/[projectId]/search     → 검색 결과
/p/[projectId]/settings   → 프로젝트 설정
/account                  → 계정 설정
/pricing                  → 요금제
```

## 💻 백엔드 (API Server)

### 기술 스택
- **Runtime**: Node.js 20 (LTS)
- **Framework**: Fastify (고성능)
- **ORM**: Prisma
- **Database**: PostgreSQL 15
- **Cache**: Redis
- **Storage**: AWS S3 (+ CloudFront CDN)
- **Queue**: BullMQ (비동기 작업)
- **Auth**: JWT + Refresh Token

### 데이터베이스 스키마

```sql
-- 사용자
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(100),
  plan VARCHAR(20) DEFAULT 'free', -- free, pro, team, enterprise
  storage_used BIGINT DEFAULT 0,
  ai_queries_used INT DEFAULT 0,
  ai_queries_limit INT DEFAULT 100,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 프로젝트
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(200) NOT NULL,
  slug VARCHAR(200) UNIQUE NOT NULL, -- URL-friendly
  description TEXT,
  visibility VARCHAR(20) DEFAULT 'private', -- public, private
  invite_code VARCHAR(50) UNIQUE, -- 초대 링크용
  custom_domain VARCHAR(255), -- 프리미엄 기능
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  INDEX idx_slug (slug),
  INDEX idx_user_id (user_id)
);

-- 파일
CREATE TABLE files (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  path VARCHAR(1000) NOT NULL, -- 폴더 경로 포함
  name VARCHAR(255) NOT NULL,
  type VARCHAR(50) DEFAULT 'markdown', -- markdown, image, pdf
  size BIGINT NOT NULL,
  s3_key VARCHAR(500) NOT NULL, -- S3 저장 경로
  md5_hash VARCHAR(32), -- 중복 방지
  version INT DEFAULT 1,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(project_id, path),
  INDEX idx_project_id (project_id),
  INDEX idx_path (path)
);

-- 파일 버전 (히스토리)
CREATE TABLE file_versions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  file_id UUID REFERENCES files(id) ON DELETE CASCADE,
  version INT NOT NULL,
  s3_key VARCHAR(500) NOT NULL,
  size BIGINT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(file_id, version)
);

-- 프로젝트 멤버
CREATE TABLE project_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  role VARCHAR(20) DEFAULT 'viewer', -- owner, editor, viewer
  joined_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(project_id, user_id),
  INDEX idx_project_user (project_id, user_id)
);

-- AI 벡터 (Phase 2)
CREATE TABLE document_vectors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  file_id UUID REFERENCES files(id) ON DELETE CASCADE,
  chunk_index INT NOT NULL, -- 문서를 청크로 나눔
  content TEXT NOT NULL, -- 원본 텍스트
  vector_id VARCHAR(100), -- Pinecone ID
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(file_id, chunk_index)
);

-- AI 대화 히스토리 (Phase 2)
CREATE TABLE chat_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES chat_sessions(id) ON DELETE CASCADE,
  role VARCHAR(20) NOT NULL, -- user, assistant
  content TEXT NOT NULL,
  sources JSONB, -- 참조한 문서 정보
  created_at TIMESTAMP DEFAULT NOW()
);
```

### API 엔드포인트

#### 인증
```
POST   /api/auth/register     회원가입
POST   /api/auth/login        로그인
POST   /api/auth/refresh      토큰 갱신
POST   /api/auth/logout       로그아웃
GET    /api/auth/me           내 정보
```

#### 프로젝트
```
GET    /api/projects              내 프로젝트 목록
POST   /api/projects              프로젝트 생성
GET    /api/projects/:id          프로젝트 상세
PUT    /api/projects/:id          프로젝트 수정
DELETE /api/projects/:id          프로젝트 삭제
POST   /api/projects/:id/invite   초대 링크 생성
POST   /api/projects/join/:code   초대 코드로 참여
```

#### 파일
```
GET    /api/projects/:id/files              파일 목록 (트리)
GET    /api/projects/:id/files/:fileId      파일 내용
GET    /api/projects/:id/files/:fileId/raw  원본 다운로드
GET    /api/projects/:id/files/:fileId/pdf  PDF 변환 다운로드
POST   /api/projects/:id/upload             파일 업로드 (CLI/Desktop용)
DELETE /api/projects/:id/files/:fileId      파일 삭제 (소유자만)
```

#### 검색
```
GET    /api/projects/:id/search?q=keyword   전체 검색
POST   /api/projects/:id/search/semantic    AI 의미 검색 (Phase 2)
```

#### AI 챗봇 (Phase 2)
```
POST   /api/projects/:id/chat/sessions      새 대화 시작
GET    /api/projects/:id/chat/sessions      내 대화 목록
POST   /api/projects/:id/chat/messages      메시지 전송
GET    /api/projects/:id/chat/:sessionId    대화 히스토리
```

#### 통계 (프리미엄)
```
GET    /api/projects/:id/analytics/views    조회수
GET    /api/projects/:id/analytics/search   인기 검색어
GET    /api/projects/:id/analytics/files    파일별 통계
```

## 🖥️ 데스크톱 앱 (업로드 클라이언트)

### 기술 스택
- **Framework**: Electron
- **UI**: React + Tailwind
- **파일 감지**: Chokidar (파일 변경 감지)
- **업로드**: multipart/form-data

### 주요 기능

#### 1. 폴더 선택 & 업로드
```typescript
interface UploadConfig {
  projectId: string;
  localPath: string;      // 로컬 폴더 경로
  excludePatterns: string[]; // .gitignore 스타일
  autoSync: boolean;      // 파일 변경 시 자동 업로드
}

// 제외 패턴 예시:
// - node_modules/
// - .git/
// - *.log
// - .DS_Store
```

#### 2. 업로드 프로세스
```
1. 폴더 스캔 → 파일 목록 생성
2. MD5 해시 계산 → 중복 파일 스킵
3. 이미지/첨부파일 자동 감지
4. 상대 경로 링크 검증
5. 청크 업로드 (대용량 파일)
6. 진행 상황 표시
7. 완료 알림
```

#### 3. 동기화 모드 (옵션)
```typescript
// 파일 변경 감지 → 자동 업로드
watcher.on('change', async (path) => {
  await uploadFile(path);
  showNotification('파일 동기화 완료');
});
```

## 🤖 AI 서비스 (Phase 2)

### 기술 스택
- **벡터 DB**: Pinecone (관리형) or Qdrant (오픈소스)
- **임베딩**: OpenAI text-embedding-3-small
- **LLM**: OpenAI GPT-4o-mini (비용 효율)
- **프레임워크**: LangChain

### 아키텍처

#### 1. 문서 임베딩 파이프라인
```typescript
// 새 파일 업로드 시 자동 실행
async function embedDocument(fileId: string) {
  const file = await getFile(fileId);
  const content = await downloadFromS3(file.s3_key);

  // 청크로 나누기 (512 토큰 단위)
  const chunks = splitIntoChunks(content, 512);

  // 각 청크 임베딩
  for (const [index, chunk] of chunks.entries()) {
    const embedding = await openai.embeddings.create({
      model: 'text-embedding-3-small',
      input: chunk.text
    });

    // Pinecone에 저장
    await pinecone.upsert({
      id: `${fileId}_${index}`,
      values: embedding.data[0].embedding,
      metadata: {
        fileId,
        chunkIndex: index,
        text: chunk.text,
        path: file.path
      }
    });

    // DB에 메타데이터 저장
    await saveChunkMetadata(fileId, index, chunk.text);
  }
}
```

#### 2. AI 검색 (Semantic Search)
```typescript
async function semanticSearch(projectId: string, query: string) {
  // 쿼리 임베딩
  const queryEmbedding = await openai.embeddings.create({
    model: 'text-embedding-3-small',
    input: query
  });

  // 유사 문서 검색
  const results = await pinecone.query({
    vector: queryEmbedding.data[0].embedding,
    topK: 5,
    filter: { projectId }
  });

  // 관련 문서 반환
  return results.matches.map(match => ({
    fileId: match.metadata.fileId,
    path: match.metadata.path,
    snippet: match.metadata.text,
    score: match.score
  }));
}
```

#### 3. 챗봇 (RAG)
```typescript
async function chatWithDocuments(
  projectId: string,
  question: string,
  conversationHistory: Message[]
) {
  // 1. 관련 문서 검색
  const relevantDocs = await semanticSearch(projectId, question);

  // 2. 컨텍스트 구성
  const context = relevantDocs
    .map(doc => `[${doc.path}]\n${doc.snippet}`)
    .join('\n\n');

  // 3. LLM 호출
  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content: `당신은 문서 기반 Q&A 봇입니다.
                  주어진 문서 내용만을 기반으로 답변하세요.
                  답변 시 출처를 명시하세요.`
      },
      ...conversationHistory,
      {
        role: 'user',
        content: `문서 내용:\n${context}\n\n질문: ${question}`
      }
    ],
    stream: true // 실시간 스트리밍
  });

  // 4. 소스 추출
  const sources = relevantDocs.map(doc => ({
    fileId: doc.fileId,
    path: doc.path,
    relevanceScore: doc.score
  }));

  return { response, sources };
}
```

#### 4. AI 자동 인덱싱 시스템 ⭐ 핵심 차별화

**목표**: 사용자가 100개 문서를 업로드하면, AI가 5분 안에 모든 인덱스를 자동 생성

```typescript
// 백그라운드 작업 큐 (BullMQ)
async function queueAutoIndexing(projectId: string) {
  await indexQueue.add('generate-indexes', {
    projectId,
    tasks: [
      'topic-clustering',      // 주제별 분류
      'date-timeline',         // 날짜별 타임라인
      'author-grouping',       // 작성자별
      'category-extraction',   // 카테고리별
      'relationship-analysis', // 문서 관계
      'ai-structure-suggestion' // AI 추천 구조
    ]
  }, {
    priority: 2,  // 높은 우선순위
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 2000
    }
  });
}

// 인덱스 생성 워커
indexQueue.process('generate-indexes', async (job) => {
  const { projectId, tasks } = job.data;
  const allDocs = await getAllDocuments(projectId);

  // 병렬 실행으로 성능 최적화
  await Promise.all([
    tasks.includes('topic-clustering') && generateTopicIndex(projectId, allDocs),
    tasks.includes('date-timeline') && generateDateIndex(projectId, allDocs),
    tasks.includes('author-grouping') && generateAuthorIndex(projectId, allDocs),
    tasks.includes('category-extraction') && generateCategoryIndex(projectId, allDocs),
    tasks.includes('relationship-analysis') && generateRelationshipIndex(projectId, allDocs),
    tasks.includes('ai-structure-suggestion') && generateAISuggestionIndex(projectId, allDocs)
  ].filter(Boolean));

  // 인덱스 완료 이벤트
  await notifyUser(projectId, 'indexes-ready');
});

// 주제별 인덱스 생성 (K-means 클러스터링)
async function generateTopicIndex(projectId: string, docs: ParsedDocument[]) {
  // 1. 문서 벡터 수집
  const vectors = docs.map(doc => ({
    id: doc.id,
    vector: averageBlockVectors(doc.blocks),
    metadata: doc.metadata
  }));

  // 2. 최적 클러스터 수 결정 (Elbow Method)
  const optimalK = findOptimalClusters(vectors, { minK: 3, maxK: 10 });

  // 3. K-means 클러스터링
  const clusters = performKMeans(vectors, optimalK);

  // 4. 각 클러스터에 주제 레이블 부여 (LLM)
  const labeledClusters = await Promise.all(
    clusters.map(async (cluster) => {
      const titles = cluster.members.map(m => m.metadata.title).join('\n');
      const label = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [{
          role: 'system',
          content: '다음 문서 제목들의 공통 주제를 한글 2-3단어로 요약하세요.'
        }, {
          role: 'user',
          content: titles
        }],
        temperature: 0.3
      });

      return {
        topic: label.choices[0].message.content,
        documents: cluster.members,
        coherence: cluster.coherenceScore
      };
    })
  );

  // 5. Markdown 인덱스 생성
  const markdown = formatTopicIndexMarkdown(labeledClusters);

  // 6. .index/ 폴더에 저장
  await saveIndexFile(projectId, '.index/by-topic.md', markdown);

  return labeledClusters;
}

// 문서 관계 그래프 생성
async function generateRelationshipIndex(projectId: string, docs: ParsedDocument[]) {
  const graph: DocumentGraph = {
    nodes: docs.map(doc => ({
      id: doc.id,
      title: doc.metadata.title,
      category: doc.metadata.category,
      tags: doc.metadata.tags
    })),
    edges: []
  };

  // 1. 명시적 링크 추출
  for (const doc of docs) {
    const internalLinks = doc.structure.links.filter(l => l.type === 'internal');
    for (const link of internalLinks) {
      graph.edges.push({
        source: doc.id,
        target: resolveDocId(link.href, docs),
        type: 'explicit',
        weight: 1.0
      });
    }
  }

  // 2. 벡터 유사도 기반 암시적 관계
  for (let i = 0; i < docs.length; i++) {
    const doc1Vector = averageBlockVectors(docs[i].blocks);

    for (let j = i + 1; j < docs.length; j++) {
      const doc2Vector = averageBlockVectors(docs[j].blocks);
      const similarity = cosineSimilarity(doc1Vector, doc2Vector);

      // 유사도 0.7 이상만 관계로 인정
      if (similarity >= 0.7) {
        graph.edges.push({
          source: docs[i].id,
          target: docs[j].id,
          type: 'semantic',
          weight: similarity
        });
      }
    }
  }

  // 3. Frontmatter parent/children 관계
  for (const doc of docs) {
    if (doc.metadata.parent) {
      graph.edges.push({
        source: doc.id,
        target: doc.metadata.parent,
        type: 'hierarchical',
        weight: 1.0,
        direction: 'child-to-parent'
      });
    }
  }

  // 4. Markdown 관계 그래프 생성 (Mermaid 다이어그램 포함)
  const markdown = formatRelationshipMarkdown(graph);
  await saveIndexFile(projectId, '.index/related-docs.md', markdown);

  return graph;
}

// AI 추천 구조 생성
async function generateAISuggestionIndex(projectId: string, docs: ParsedDocument[]) {
  // 1. 문서 품질 분석
  const analysis = docs.map(doc => ({
    id: doc.id,
    title: doc.metadata.title,
    aiScore: doc.metadata.aiScore,
    issues: identifyDocumentIssues(doc)
  }));

  // 2. 개선이 필요한 문서 식별
  const needsImprovement = analysis
    .filter(a => a.aiScore < 60)
    .sort((a, b) => a.aiScore - b.aiScore);

  // 3. 고립된 문서 찾기 (링크 없음)
  const isolated = docs.filter(doc => {
    const hasIncoming = docs.some(d =>
      d.structure.links.some(l => l.href.includes(doc.id))
    );
    const hasOutgoing = doc.structure.links.filter(l => l.type === 'internal').length > 0;
    return !hasIncoming && !hasOutgoing;
  });

  // 4. 중복 가능성이 있는 문서 (벡터 유사도 0.9 이상)
  const duplicates = findPotentialDuplicates(docs, { threshold: 0.9 });

  // 5. AI 추천 생성 (LLM)
  const suggestions = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [{
      role: 'system',
      content: `문서 분석 결과를 바탕으로 개선 방안을 제안하세요.
                - 폴더 구조 재구성
                - 문서 병합/분리 제안
                - 누락된 문서 제안
                - 학습 경로 제안`
    }, {
      role: 'user',
      content: JSON.stringify({
        totalDocs: docs.length,
        lowQuality: needsImprovement.length,
        isolated: isolated.length,
        duplicates: duplicates.length,
        categories: [...new Set(docs.map(d => d.metadata.category))],
        topics: [...new Set(docs.flatMap(d => d.metadata.tags || []))]
      })
    }],
    temperature: 0.5
  });

  // 6. Markdown 생성
  const markdown = formatAISuggestionMarkdown({
    needsImprovement,
    isolated,
    duplicates,
    aiSuggestions: suggestions.choices[0].message.content
  });

  await saveIndexFile(projectId, '.index/ai-suggested.md', markdown);

  return suggestions;
}
```

#### 5. AI 친화도 실시간 평가

```typescript
// 문서 업로드/수정 시 자동 평가
async function evaluateDocumentAIFriendliness(
  doc: ParsedDocument
): Promise<AIFriendlinessReport> {

  const report: AIFriendlinessReport = {
    score: 0,
    breakdown: {},
    suggestions: [],
    examples: []
  };

  // 1. Frontmatter 완성도 (30점)
  const frontmatterScore = evaluateFrontmatter(doc.metadata);
  report.breakdown.frontmatter = frontmatterScore;
  report.score += frontmatterScore.score;

  if (frontmatterScore.score < 20) {
    report.suggestions.push({
      category: 'frontmatter',
      severity: 'high',
      message: 'Frontmatter 필수 필드 누락',
      fix: `다음 필드를 추가하세요: ${frontmatterScore.missing.join(', ')}`,
      example: `---
title: ${doc.metadata.title || '문서 제목'}
summary: 이 문서는 ...에 대한 설명입니다
tags: [tag1, tag2, tag3]
category: 카테고리명
---`
    });
  }

  // 2. 구조화 수준 (30점)
  const structureScore = evaluateStructure(doc.structure);
  report.breakdown.structure = structureScore;
  report.score += structureScore.score;

  if (!structureScore.hasHeadings) {
    report.suggestions.push({
      category: 'structure',
      severity: 'high',
      message: '제목이 없어 문서 구조를 파악하기 어렵습니다',
      fix: '# 주제목, ## 소제목 형식으로 계층적 구조 추가',
      example: `# 메인 주제
## 섹션 1
내용...

## 섹션 2
내용...`
    });
  }

  // 3. 내용 명확성 (20점)
  const clarityScore = evaluateClarity(doc.blocks);
  report.breakdown.clarity = clarityScore;
  report.score += clarityScore.score;

  if (clarityScore.tooLong) {
    report.suggestions.push({
      category: 'clarity',
      severity: 'medium',
      message: '일부 문단이 너무 길어 AI가 이해하기 어렵습니다',
      fix: '긴 문단을 리스트나 여러 문단으로 나누세요',
      example: `❌ 나쁜 예:
이 시스템은 마이크로서비스 아키텍처를 사용하며 각 서비스는 독립적으로 배포...

✅ 좋은 예:
**시스템 아키텍처:**
- 마이크로서비스 기반
- 독립 배포 가능
- 서비스 간 REST API 통신`
    });
  }

  // 4. 링크 및 관계 (20점)
  const linksScore = evaluateLinks(doc.structure, doc.metadata);
  report.breakdown.links = linksScore;
  report.score += linksScore.score;

  if (linksScore.isolated) {
    report.suggestions.push({
      category: 'links',
      severity: 'medium',
      message: '이 문서는 다른 문서와 연결되지 않아 고립되어 있습니다',
      fix: 'related_docs 필드에 관련 문서를 추가하거나 내부 링크를 삽입하세요',
      example: `---
related_docs: [guide.md, tutorial.md, faq.md]
---

또는 본문에:
자세한 내용은 [사용자 가이드](./guide.md)를 참조하세요.`
    });
  }

  // 5. 전체 등급 부여
  report.grade =
    report.score >= 80 ? 'excellent' :
    report.score >= 60 ? 'good' :
    report.score >= 40 ? 'fair' : 'poor';

  report.badge = getScoreBadge(report.score);

  return report;
}

// 점수에 따른 배지
function getScoreBadge(score: number): string {
  if (score >= 80) return '🏆 우수 (AI가 완벽하게 이해)';
  if (score >= 60) return '👍 양호 (AI가 잘 이해)';
  if (score >= 40) return '⚠️ 보통 (개선 필요)';
  return '❌ 미흡 (AI 이해 어려움)';
}
```

#### 6. 성능 & 비용 최적화

**임베딩 비용 절감:**
```typescript
// 1. 증분 벡터화: 변경된 블록만 재처리
async function incrementalEmbedding(
  oldDoc: ParsedDocument,
  newDoc: ParsedDocument
) {
  const changedBlocks = detectChangedBlocks(oldDoc.blocks, newDoc.blocks);

  // 변경된 블록만 벡터화
  const embeddings = await Promise.all(
    changedBlocks.map(block => embedText(block.content))
  );

  // Pinecone 업데이트 (전체 재생성 X)
  await pinecone.upsert(
    changedBlocks.map((block, i) => ({
      id: block.id,
      values: embeddings[i],
      metadata: { ...block.metadata }
    }))
  );

  // 비용 절감 예시:
  // 100개 문서, 평균 20블록 = 2000 블록
  // 전체 재처리: $0.40 (2000 * $0.0002)
  // 증분 처리 (10% 변경): $0.04 (200 * $0.0002)
  // → 90% 비용 절감
}

// 2. 캐싱: 동일 텍스트 재사용
const embeddingCache = new Map<string, number[]>();

async function cachedEmbed(text: string): Promise<number[]> {
  const hash = md5(text);

  if (embeddingCache.has(hash)) {
    return embeddingCache.get(hash);
  }

  const embedding = await embedText(text);
  embeddingCache.set(hash, embedding);
  return embedding;
}

// 3. 배치 처리: API 호출 최소화
async function batchEmbed(texts: string[]): Promise<number[][]> {
  // OpenAI 배치 API: 최대 2048개
  const batches = chunk(texts, 2048);

  const results = await Promise.all(
    batches.map(batch =>
      openai.embeddings.create({
        model: 'text-embedding-3-small',
        input: batch
      })
    )
  );

  return results.flatMap(r => r.data.map(d => d.embedding));
}
```

**검색 성능:**
```typescript
// Phase별 성능 목표

// Phase 1 (MVP): 키워드 검색만
// - Elasticsearch BM25
// - 응답 시간: < 100ms
// - 비용: $20/월 (Bonsai starter)

// Phase 2 (AI 통합): 하이브리드 검색
// - Elasticsearch + Pinecone
// - 응답 시간: < 400ms
// - 비용: $100/월 (Pinecone Starter + Elasticsearch)

// Phase 3 (최적화): Reranking 추가
// - + Cohere Rerank API
// - 응답 시간: < 600ms
// - 정확도: 95%+
// - 비용: $200/월
```

## 🔒 보안 설계

### 인증 & 인가
```typescript
// JWT 토큰 구조
interface JWTPayload {
  userId: string;
  email: string;
  plan: 'free' | 'pro' | 'team' | 'enterprise';
  iat: number; // issued at
  exp: number; // expiration
}

// Access Token: 15분
// Refresh Token: 7일 (httpOnly cookie)

// 권한 체크 미들웨어
async function checkProjectAccess(
  userId: string,
  projectId: string,
  requiredRole: 'viewer' | 'editor' | 'owner'
) {
  const project = await getProject(projectId);

  // Public 프로젝트는 누구나 읽기 가능
  if (project.visibility === 'public' && requiredRole === 'viewer') {
    return true;
  }

  // 멤버 확인
  const member = await getProjectMember(projectId, userId);
  if (!member) throw new Error('Access denied');

  // 역할 체크
  const roleHierarchy = { viewer: 1, editor: 2, owner: 3 };
  if (roleHierarchy[member.role] < roleHierarchy[requiredRole]) {
    throw new Error('Insufficient permissions');
  }

  return true;
}
```

### Rate Limiting
```typescript
// API 요청 제한
const rateLimits = {
  free: {
    search: 100,    // 100 req/hour
    aiChat: 10,     // 10 req/hour
    upload: 50      // 50 req/day
  },
  pro: {
    search: 1000,
    aiChat: 100,
    upload: 500
  }
};

// Redis로 구현
async function checkRateLimit(userId: string, action: string) {
  const key = `ratelimit:${userId}:${action}`;
  const count = await redis.incr(key);

  if (count === 1) {
    await redis.expire(key, 3600); // 1시간
  }

  const limit = rateLimits[user.plan][action];
  if (count > limit) {
    throw new Error('Rate limit exceeded');
  }
}
```

### 파일 보안
```typescript
// S3 Presigned URL (시간 제한)
async function getSecureFileUrl(fileId: string, userId: string) {
  // 권한 확인
  await checkProjectAccess(userId, file.projectId, 'viewer');

  // 15분 유효 URL 생성
  const url = await s3.getSignedUrlPromise('getObject', {
    Bucket: 'mdshare-files',
    Key: file.s3_key,
    Expires: 900 // 15분
  });

  return url;
}
```

## 📊 성능 최적화

### 캐싱 전략
```typescript
// 1. CDN 캐싱 (정적 파일)
// CloudFront: 1년 (이미지, CSS, JS)

// 2. Redis 캐싱 (동적 데이터)
const cacheStrategy = {
  projectMetadata: 3600,    // 1시간
  fileList: 600,            // 10분
  fileContent: 1800,        // 30분
  searchResults: 300        // 5분
};

// 캐시 헬퍼
async function getCached<T>(
  key: string,
  ttl: number,
  fetchFn: () => Promise<T>
): Promise<T> {
  const cached = await redis.get(key);
  if (cached) return JSON.parse(cached);

  const data = await fetchFn();
  await redis.setex(key, ttl, JSON.stringify(data));
  return data;
}
```

### 데이터베이스 최적화
```sql
-- 인덱스 전략
CREATE INDEX idx_files_project_path ON files(project_id, path);
CREATE INDEX idx_files_updated ON files(updated_at DESC);
CREATE INDEX idx_members_project_user ON project_members(project_id, user_id);

-- 파티셔닝 (대용량 데이터)
CREATE TABLE chat_messages PARTITION BY RANGE (created_at);
```

### 로딩 최적화
```typescript
// 1. 파일 목록 페이지네이션
async function listFiles(projectId: string, page = 1, limit = 50) {
  const offset = (page - 1) * limit;
  return await db.files.findMany({
    where: { projectId },
    skip: offset,
    take: limit,
    orderBy: { updatedAt: 'desc' }
  });
}

// 2. 증분 로딩 (Infinite Scroll)
// 3. 이미지 lazy loading
// 4. 코드 스플리팅 (Next.js dynamic import)
```

## 🚀 배포 아키텍처

### 인프라 선택
```
프론트엔드: Vercel (Next.js 최적화)
백엔드: Railway or Fly.io (쉬운 스케일링)
데이터베이스: Supabase (PostgreSQL + 관리형)
스토리지: AWS S3 + CloudFront
캐시: Redis (Railway 또는 Upstash)
모니터링: Sentry (에러), PostHog (분석)
```

### CI/CD 파이프라인
```yaml
# .github/workflows/deploy.yml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Run tests
        run: npm test

      - name: Build frontend
        run: cd frontend && npm run build

      - name: Deploy to Vercel
        run: vercel --prod

      - name: Deploy backend
        run: railway up

      - name: Run migrations
        run: npx prisma migrate deploy
```

## 📏 코드 품질 & 테스팅

### 테스트 전략
```typescript
// 1. 단위 테스트 (Jest)
describe('File Upload', () => {
  it('should reject files larger than limit', async () => {
    const result = await uploadFile(largeFile);
    expect(result.error).toBe('File too large');
  });
});

// 2. 통합 테스트 (Supertest)
describe('API /projects', () => {
  it('should create project', async () => {
    const res = await request(app)
      .post('/api/projects')
      .send({ name: 'Test' })
      .expect(201);
  });
});

// 3. E2E 테스트 (Playwright)
test('user can upload and view document', async ({ page }) => {
  await page.goto('/dashboard');
  await page.click('text=New Project');
  // ... 업로드 시나리오
});
```

### 모니터링
```typescript
// 1. 에러 추적 (Sentry)
Sentry.init({ dsn: process.env.SENTRY_DSN });

// 2. 성능 모니터링
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    metrics.record('api.latency', duration, {
      method: req.method,
      path: req.path
    });
  });
  next();
});

// 3. 비즈니스 메트릭
trackEvent('file_uploaded', { projectId, fileSize });
trackEvent('ai_query', { projectId, tokens });
```

## 💾 백업 & 재해 복구

### 데이터 백업
```
PostgreSQL:
- 일일 자동 백업 (Supabase 기본 제공)
- 7일 보관

S3:
- Versioning 활성화
- Lifecycle 정책 (30일 후 Glacier)
- Cross-region replication (엔터프라이즈)

Redis:
- RDB 스냅샷 (6시간마다)
- AOF 로그 (append-only file)
```

### 장애 대응
```typescript
// 1. Circuit Breaker (외부 API)
const breaker = new CircuitBreaker(openai.chat, {
  timeout: 30000,
  errorThresholdPercentage: 50,
  resetTimeout: 60000
});

// 2. Graceful Degradation
if (aiServiceDown) {
  return fallbackSearch(query); // 키워드 검색으로 대체
}

// 3. Health Check
app.get('/health', async (req, res) => {
  const dbOk = await checkDatabase();
  const redisOk = await checkRedis();
  const s3Ok = await checkS3();

  res.json({
    status: dbOk && redisOk && s3Ok ? 'healthy' : 'degraded',
    services: { db: dbOk, redis: redisOk, s3: s3Ok }
  });
});
```

## 🔮 미래 확장성

### 마이크로서비스 전환 (필요시)
```
현재 (Monolith):
├─ API Gateway
└─ Single Backend

미래 (Microservices):
├─ API Gateway
├─ Auth Service
├─ Upload Service
├─ View Service
├─ AI Service (분리)
└─ Analytics Service
```

### 글로벌 확장
```
- 멀티 리전 배포 (US, EU, Asia)
- 지역별 S3 버킷
- CDN 최적화
- 다국어 지원 (i18n)
```

---

## 🌟 왜 이 하이브리드 아키텍처가 "모던"한가?

### 핵심 답변: 사용자 경험과 AI 파워의 완벽한 균형

**문제 인식:**
요즘 트렌드는 "모든 것을 JSON으로" (Notion, Linear, Airtable 등 Block-based 시스템)입니다. 이것은 강력하지만, 복잡하고 데이터 종속성이 높습니다.

**우리의 선택:**
하이브리드 아키텍처 = **Markdown 소스 (사람) + JSON 처리 (AI)**

### 1. 사용자 경험: "단순함을 지킨다"

```
❌ 기존 Block-based 시스템 (Notion):
사용자 → 복잡한 에디터 → Nested JSON → DB 저장
- 진입 장벽: 높음 (특수한 에디터 학습 필요)
- 데이터 이동: 어려움 (JSON 구조 종속)
- Git 통합: 불가능

✅ 우리 시스템:
사용자 → .md 파일 작성 → 업로드 → 끝
- 진입 장벽: 낮음 (VSCode, Obsidian 등 자유롭게 선택)
- 데이터 이동: 쉬움 (순수 .md 파일)
- Git 통합: 완벽 (버전 관리, 협업)
```

**ROI 분석:**
- Notion 마이그레이션 비용: 100 페이지 = 20시간 (수동 변환)
- 우리 시스템: 100개 .md 파일 = 5분 (폴더 드래그 & 드롭)

### 2. AI 파워: "보이지 않는 똑똑함"

```
사용자가 보는 것:
simple.md (순수 마크다운)

시스템 내부:
simple.md
  → Parser → AST → JSON
  → Block 분해 [heading, paragraph, list, ...]
  → 벡터화 [block1: [0.12, -0.33, ...], block2: [...]]
  → Elasticsearch 인덱싱
  → Pinecone 벡터 저장
  → 자동 태깅, 관계 분석, 목차 생성
```

**사용자 입장:**
"어? 그냥 마크다운 파일 올렸는데 자동으로 목차 생겼네? 관련 문서 추천도 되네?"

**시스템 내부:**
- 12단계 파싱 파이프라인
- K-means 클러스터링
- 벡터 유사도 계산
- LLM 태그 추출
- 관계 그래프 구축

### 3. 비교: 왜 순수 JSON 방식보다 나은가?

| 측면 | 순수 JSON (Notion 스타일) | 하이브리드 (우리) |
|------|---------------------------|-------------------|
| **사용자 복잡도** | 높음 (전용 에디터 학습) | 낮음 (마크다운만 알면 OK) |
| **데이터 소유권** | 낮음 (JSON 종속) | 높음 (.md 파일 원본) |
| **AI 활용도** | 높음 (구조화됨) | 높음 (내부에서 구조화) |
| **Git 통합** | 불가능 | 완벽 |
| **마이그레이션 비용** | 높음 (수동 변환) | 없음 (복사만) |
| **학습 곡선** | 가파름 | 완만 (마크다운 표준) |
| **확장성** | 제한적 (플랫폼 종속) | 높음 (표준 기반) |

### 4. 실제 사례로 이해하기

**시나리오: 100개 사내 매뉴얼 관리**

```
Notion 방식:
1. Notion 에디터로 100개 페이지 작성 (40시간)
2. 블록 구조 수동 정리 (10시간)
3. 페이지 간 링크 수동 연결 (5시간)
4. AI가 읽으려면 Notion API로 JSON 추출 → 파싱 → 정제
5. 총 시간: 55시간

우리 방식:
1. VSCode로 100개 .md 파일 작성 (40시간)
2. 폴더 업로드 (5분)
3. AI 자동 처리:
   - 블록 구조 자동 분석 (5분)
   - 태그 자동 추출 (3분)
   - 관계 자동 파악 (2분)
   - 인덱스 자동 생성 (5분)
4. 총 시간: 40시간 20분

절감: 14시간 40분 (27% 효율 향상)
+ 데이터 소유권 보장
+ Git 버전 관리 가능
+ 어떤 에디터든 사용 가능
```

### 5. 기술적 우수성

**파싱 파이프라인 성능:**
```typescript
// 순수 JSON 접근:
Database → JSON → AI Processing
- DB 읽기: 100ms
- JSON 파싱: 50ms
- AI 처리: 300ms
- 총: 450ms

// 우리 하이브리드:
S3 → Markdown → AST → JSON → Cached → AI Processing
- S3 읽기: 50ms (CDN 캐싱)
- MD 파싱: 20ms (증분 파싱)
- AST → JSON: 30ms (캐싱)
- AI 처리: 300ms (벡터 캐싱)
- 총: 400ms

→ 성능 손실 없음 + 캐싱으로 오히려 더 빠름
```

**비용 효율:**
```
순수 JSON (DB 저장):
- DB 스토리지: $0.10/GB/월
- DB I/O: $0.20/1M requests
- 100GB 문서 + 1M requests/월 = $210/월

하이브리드 (S3 + DB):
- S3 스토리지: $0.023/GB/월 (원본 .md)
- DB 스토리지: $0.10/GB/월 (메타데이터만)
- CloudFront: $0.085/GB (캐싱)
- 100GB 문서 (S3: 100GB, DB: 10GB) = $3.30/월

→ 98% 비용 절감
```

### 6. 미래 확장성

**하이브리드 아키텍처의 진화 가능성:**

```
현재 (Phase 1-2):
Markdown → JSON → AI Processing

미래 (Phase 3+):
1. Real-time Collaboration Layer:
   Markdown → Operational Transform → JSON → AI Processing

2. Advanced AI Features:
   Markdown → Knowledge Graph → Reasoning Engine → AI Agents

3. Multi-modal Support:
   Markdown + Images + Videos → Unified Embedding → Cross-modal Search

4. Enterprise Integration:
   Markdown → API Gateway → ERP/CRM Integration → Business Intelligence
```

**핵심 원칙은 유지:**
- 사용자는 여전히 .md 파일만 다룸
- 시스템은 내부에서 점점 더 똑똑해짐
- 데이터 소유권은 항상 사용자에게

### 7. 결론: "The Best of Both Worlds"

**이 하이브리드 아키텍처가 모던한 이유:**

✅ **Progressive Enhancement 철학**
- 기본: 마크다운 (누구나 사용 가능)
- 강화: AI 자동 처리 (보이지 않게 똑똑함)
- 확장: 필요에 따라 기능 추가 (사용자 부담 없음)

✅ **User-Centric Design**
- 사용자는 익숙한 도구 사용 (VSCode, Obsidian, Typora)
- 플랫폼은 복잡한 처리 담당 (파싱, 벡터화, AI)
- 명확한 관심사 분리 (Separation of Concerns)

✅ **AI-First Architecture**
- 모든 문서 자동 구조화
- 블록 단위 벡터화
- 실시간 관계 분석
- 자동 인덱싱

✅ **Zero Lock-in Philosophy**
- 언제든 .md 파일 다운로드 가능
- Git으로 버전 관리
- 다른 플랫폼으로 이동 자유

**한 마디로:**
> "Notion의 똑똑함 + GitBook의 단순함 + 데이터 소유권 = 우리 플랫폼"

이것이 2025년 현재, 가장 모던하고 실용적인 접근법입니다.
