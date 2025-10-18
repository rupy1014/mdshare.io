// AI Service Integration
// 분리된 AI 서비스들을 통합하여 제공하는 메인 서비스

import type { DocumentInfo } from 'mdshare-core'
import { ClaudeCodeClient, IndexingService, QueryProcessor } from './ai'
import type { 
  AITagSuggestion, 
  DocumentAIAnalysis, 
  AISearchResult, 
  ClaudeCodeResponse 
} from './ai'

export class AIService {
  private claudeClient: ClaudeCodeClient
  private indexingService: IndexingService
  private queryProcessor: QueryProcessor

  constructor(apiKey?: string) {
    this.claudeClient = new ClaudeCodeClient(apiKey)
    this.indexingService = new IndexingService()
    this.queryProcessor = new QueryProcessor()
  }

  // 자동 태그 생성
  async generateTags(content: string, title: string): Promise<AITagSuggestion[]> {
    return this.indexingService['generateTags'](content, title)
  }

  // 의미론적 검색
  async semanticSearch(query: string, documents: DocumentInfo[]): Promise<AISearchResult[]> {
    return this.queryProcessor.semanticSearch(query, documents)
  }

  // 문서 요약 생성
  async generateSummary(content: string): Promise<string> {
    return this.queryProcessor.generateSummary(content)
  }

  // 종합적인 문서 AI 분석
  async analyzeDocument(document: DocumentInfo, allDocuments: DocumentInfo[]): Promise<DocumentAIAnalysis> {
    return this.indexingService.indexDocument(document)
  }

  // Claude Code 연동
  async sendClaudeQuery(query: string, context?: string): Promise<ClaudeCodeResponse> {
    return this.claudeClient.sendQuery(query, context)
  }

  // 문서 구조 최적화
  async optimizeDocumentStructure(documentPath: string, content: string): Promise<ClaudeCodeResponse> {
    return this.claudeClient.optimizeDocumentStructure(documentPath, content)
  }

  // 문서 관계 분석
  async analyzeDocumentRelationships(documents: Array<{ path: string; title: string; content: string }>): Promise<ClaudeCodeResponse> {
    return this.claudeClient.analyzeDocumentRelationships(documents)
  }

  // 인덱싱 파일 생성
  async generateIndexFile(documents: Array<{ path: string; title: string; summary: string }>): Promise<ClaudeCodeResponse> {
    return this.claudeClient.generateIndexFile(documents)
  }

  // 자연어 질의 처리
  async processNaturalLanguageQuery(query: string, documents: DocumentInfo[]): Promise<{
    intent: string
    entities: string[]
    results: AISearchResult[]
  }> {
    return this.queryProcessor.processNaturalLanguageQuery(query, documents)
  }
}

// 기존 인터페이스와의 호환성을 위한 타입 재export
export type {
  AITagSuggestion,
  DocumentAIAnalysis,
  AISearchResult,
  ClaudeCodeResponse
}