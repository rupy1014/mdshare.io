// MDShare Core Types

export interface Frontmatter {
  title?: string;
  description?: string;
  author?: string;
  category?: string;
  tags?: string[];
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  createdAt?: string;
  updatedAt?: string;
  version?: string;
  status?: 'draft' | 'published' | 'archived';
  criticality?: 'low' | 'medium' | 'high';
  dependencies?: string[];
  usedBy?: string[];
  [key: string]: any;
}

export interface ParsedDocument {
  frontmatter: Frontmatter;
  content: string;
  html: string;
  metadata: DocumentMetadata;
  raw: string;
}

export interface DocumentMetadata {
  wordCount: number;
  readingTime: number; // in minutes
  headings: Heading[];
  links: Link[];
  images: Image[];
  codeBlocks: CodeBlock[];
  tables: Table[];
  diagrams: Diagram[];
}

export interface Heading {
  level: number;
  text: string;
  id: string;
  line: number;
}

export interface Link {
  text: string;
  url: string;
  type: 'internal' | 'external';
  line: number;
}

export interface Image {
  alt: string;
  src: string;
  title?: string;
  line: number;
}

export interface CodeBlock {
  language?: string;
  code: string;
  line: number;
}

export interface Table {
  headers: string[];
  rows: string[][];
  line: number;
}

export interface Diagram {
  type: 'mermaid' | 'plantuml' | 'sequence';
  content: string;
  line: number;
}

export interface ProjectConfig {
  project: {
    name: string;
    version: string;
    description: string;
    author: string;
    license?: string;
    language: string;
    createdAt: string;
    updatedAt: string;
    type: string;
    criticality: 'low' | 'medium' | 'high';
  };
  settings: {
    theme: string;
    navigation: 'sidebar' | 'top' | 'both';
    searchEnabled: boolean;
    aiFeaturesEnabled: boolean;
    autoIndexingEnabled: boolean;
    chatbotEnabled: boolean;
    allowDownload: boolean;
    allowComments: boolean;
  };
  ai: {
    autoTagging: boolean;
    autoCategorization: boolean;
    relationshipAnalysis: boolean;
    contentSuggestions: boolean;
    embeddingModel: string;
    chatModel: string;
    crossProjectAnalysis?: boolean;
  };
  access: {
    visibility: 'public' | 'private' | 'restricted';
    inviteCode?: string;
    allowedDomains: string[];
    passwordProtected: boolean;
    roleBasedAccess?: boolean;
  };
  deployment: {
    method: 'manual' | 'github-pages' | 'vercel' | 'netlify';
    customDomain?: string;
    autoDeploy: boolean;
    buildCommand?: string;
    environment?: string;
  };
  integration?: {
    dependsOn?: string[];
    usedBy?: string[];
    [key: string]: any;
  };
}

export interface ProjectIndex {
  projectId: string;
  lastIndexed: string;
  documentCount: number;
  totalWords: number;
  structure: DocumentStructure[];
  statistics: {
    wordCount: Record<string, number>;
    categoryCount: Record<string, number>;
    tagCount: Record<string, number>;
    authorCount: Record<string, number>;
  };
}

export interface DocumentStructure {
  path: string;
  title: string;
  type: 'markdown' | 'json' | 'csv' | 'other';
  tags: string[];
  category?: string;
  author?: string;
  createdAt?: string;
  updatedAt?: string;
  wordCount: number;
  readingTime: number;
}

export interface AIIndex {
  topics: Record<string, TopicEntry[]>;
  relationships: Relationship[];
  suggestions: Suggestion[];
  lastUpdated: string;
}

export interface TopicEntry {
  document: string;
  relevance: number;
  excerpt?: string;
}

export interface Relationship {
  source: string;
  target: string;
  type: 'dependency' | 'reference' | 'similar' | 'parent-child';
  strength: number;
  description?: string;
}

export interface Suggestion {
  type: 'missing-link' | 'duplicate-content' | 'improvement';
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  documents: string[];
}

export interface ParseOptions {
  includeHtml?: boolean;
  extractMetadata?: boolean;
  processDiagrams?: boolean;
  resolveLinks?: boolean;
  basePath?: string;
}

export interface ParseResult {
  success: boolean;
  document?: ParsedDocument;
  error?: string;
  warnings?: string[];
}

export interface DocumentInfo {
  id: string;
  title: string;
  path: string;
  description: string;
  lastModified: Date;
  tags: string[];
  metadata: {
    wordCount: number;
    readingTime: number;
    author: string;
  };
}

export interface ProjectInfo {
  id: string;
  name: string;
  description: string;
  path: string;
  config: ProjectConfig;
  documents: DocumentInfo[];
  statistics: {
    documentCount: number;
    totalWords: number;
    categories: string[];
    tags: string[];
    authors: string[];
    lastIndexed: string;
  };
}
