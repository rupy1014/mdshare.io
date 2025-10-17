import type { DocumentInfo } from 'mdshare-core'

export interface AITagSuggestion {
  tag: string
  confidence: number
  reason: string
}

export interface DocumentAIAnalysis {
  aiFriendlinessScore: number
  suggestedTags: AITagSuggestion[]
  relationships: Array<{
    target: string
    relationship: string
    strength: number
  }>
  improvements: string[]
  topics: string[]
  sentiment: 'positive' | 'neutral' | 'negative'
}

export interface AISearchResult extends DocumentInfo {
  relevanceScore: number
  matchedTerms: string[]
}

export class AIService {
  private apiKey: string | null = null

  constructor(apiKey?: string) {
    this.apiKey = apiKey || null
  }

  // 자동 태그 생성 (Mock 구현)
  async generateTags(content: string, title: string): Promise<AITagSuggestion[]> {
    // 실제로는 OpenAI API를 사용하지만, 여기서는 Mock 구현
    const mockTags: AITagSuggestion[] = []

    // 키워드 기반 태그 생성
    const keywords = this.extractKeywords(content + ' ' + title)
    
    keywords.forEach(keyword => {
      const confidence = Math.random() * 0.4 + 0.6 // 0.6-1.0
      mockTags.push({
        tag: keyword,
        confidence,
        reason: `문서에서 "${keyword}" 키워드가 자주 사용됨`
      })
    })

    // 카테고리 기반 태그 생성
    const categories = this.detectCategories(content)
    categories.forEach(category => {
      mockTags.push({
        tag: category,
        confidence: Math.random() * 0.3 + 0.7,
        reason: `문서 내용이 "${category}" 카테고리에 해당함`
      })
    })

    return mockTags.sort((a, b) => b.confidence - a.confidence)
  }

  // 의미론적 검색 (Mock 구현)
  async semanticSearch(query: string, documents: DocumentInfo[]): Promise<AISearchResult[]> {
    const results: AISearchResult[] = []

    documents.forEach(doc => {
      const relevanceScore = this.calculateRelevance(query, doc)
      if (relevanceScore > 0.1) {
        results.push({
          ...doc,
          relevanceScore,
          matchedTerms: this.findMatchedTerms(query, doc)
        })
      }
    })

    return results.sort((a, b) => b.relevanceScore - a.relevanceScore)
  }

  // 문서 요약 생성
  async generateSummary(content: string): Promise<string> {
    // Mock 구현 - 실제로는 AI API 사용
    const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 10)
    const summary = sentences.slice(0, 2).join('. ')
    return summary + (sentences.length > 2 ? '...' : '')
  }

  // 종합적인 문서 AI 분석
  async analyzeDocument(document: DocumentInfo, allDocuments: DocumentInfo[]): Promise<DocumentAIAnalysis> {
    const content = `${document.title} ${document.description}`
    
    // AI 친화도 평가
    const aiFriendlinessScore = await this.evaluateAIFriendliness(document)
    
    // 자동 태그 생성
    const suggestedTags = await this.generateTags(content, document.title)
    
    // 문서 관계 분석
    const relationships = await this.analyzeDocumentRelationships(document, allDocuments)
    
    // 주제 추출
    const topics = await this.extractTopics(content)
    
    // 감정 분석
    const sentiment = await this.analyzeSentiment(content)
    
    // 개선 제안 생성
    const improvements = await this.generateImprovements(document, aiFriendlinessScore, suggestedTags)
    
    return {
      aiFriendlinessScore,
      suggestedTags,
      relationships,
      improvements,
      topics,
      sentiment
    }
  }

  // AI 친화도 평가
  async evaluateAIFriendliness(document: DocumentInfo): Promise<number> {
    let score = 0

    // Frontmatter 완성도 (30점)
    if (document.metadata?.author) score += 10
    if (document.tags && document.tags.length > 0) score += 10
    if (document.description && document.description.length > 10) score += 10

    // 구조화 수준 (30점)
    if (document.title && document.title.length > 5) score += 15
    if (document.description && document.description.includes('.')) score += 15

    // 내용 명확성 (20점)
    if (document.description && document.description.length > 50) score += 10
    if (document.metadata?.wordCount && document.metadata.wordCount > 100) score += 10

    // 태그 및 관계 (20점)
    if (document.tags && document.tags.length >= 3) score += 10
    if (document.tags && document.tags.length >= 5) score += 10

    return Math.min(score, 100)
  }

  // 주제 추출
  async extractTopics(content: string): Promise<string[]> {
    const topics: string[] = []
    const text = content.toLowerCase()

    // 기술 주제
    if (text.includes('react') || text.includes('nextjs')) topics.push('React/Next.js')
    if (text.includes('typescript') || text.includes('javascript')) topics.push('JavaScript/TypeScript')
    if (text.includes('api') || text.includes('rest')) topics.push('API 개발')
    if (text.includes('database') || text.includes('db')) topics.push('데이터베이스')
    if (text.includes('ai') || text.includes('machine learning')) topics.push('AI/ML')
    
    // 도메인 주제
    if (text.includes('설치') || text.includes('setup')) topics.push('환경 설정')
    if (text.includes('배포') || text.includes('deploy')) topics.push('배포')
    if (text.includes('테스트') || text.includes('test')) topics.push('테스팅')
    if (text.includes('보안') || text.includes('security')) topics.push('보안')
    if (text.includes('성능') || text.includes('performance')) topics.push('성능 최적화')

    return topics.slice(0, 5) // 최대 5개 주제
  }

  // 감정 분석
  async analyzeSentiment(content: string): Promise<'positive' | 'neutral' | 'negative'> {
    const text = content.toLowerCase()
    
    const positiveWords = ['좋다', '훌륭', '완벽', '성공', '효과적', '쉽다', '빠르다', '안정적']
    const negativeWords = ['문제', '오류', '실패', '어렵다', '느리다', '불안정', '복잡']
    
    const positiveCount = positiveWords.filter(word => text.includes(word)).length
    const negativeCount = negativeWords.filter(word => text.includes(word)).length
    
    if (positiveCount > negativeCount) return 'positive'
    if (negativeCount > positiveCount) return 'negative'
    return 'neutral'
  }

  // 개선 제안 생성
  async generateImprovements(
    document: DocumentInfo, 
    aiScore: number, 
    suggestedTags: AITagSuggestion[]
  ): Promise<string[]> {
    const improvements: string[] = []

    if (aiScore < 70) {
      if (!document.metadata?.author) {
        improvements.push('작성자 정보를 추가하여 신뢰성을 높이세요')
      }
      if (!document.tags || document.tags.length < 3) {
        improvements.push('더 많은 태그를 추가하여 검색 가능성을 높이세요')
      }
      if (!document.description || document.description.length < 50) {
        improvements.push('문서 설명을 더 자세히 작성하여 이해도를 높이세요')
      }
    }

    if (suggestedTags.length > 0) {
      improvements.push(`${suggestedTags.length}개의 AI 추천 태그를 적용해보세요`)
    }

    if (document.metadata?.wordCount && document.metadata.wordCount < 100) {
      improvements.push('문서 내용을 더 풍부하게 작성해보세요')
    }

    if (!document.description || !document.description.includes('.')) {
      improvements.push('문서 설명에 완전한 문장을 사용해보세요')
    }

    return improvements.slice(0, 4) // 최대 4개 제안
  }

  // 문서 관계 분석 (개별 문서용)
  async analyzeDocumentRelationships(document: DocumentInfo, allDocuments: DocumentInfo[]): Promise<Array<{
    target: string
    relationship: string
    strength: number
  }>> {
    const relationships: Array<{
      target: string
      relationship: string
      strength: number
    }> = []

    for (const otherDoc of allDocuments) {
      if (otherDoc.id === document.id) continue

      const similarity = this.calculateSimilarity(document, otherDoc)
      if (similarity > 0.3) {
        relationships.push({
          target: otherDoc.title,
          relationship: this.determineRelationship(document, otherDoc),
          strength: similarity
        })
      }
    }

    return relationships.slice(0, 3) // 최대 3개 관계만 표시
  }

  // 문서 관계 분석 (전체 문서용)
  async analyzeAllDocumentRelationships(documents: DocumentInfo[]): Promise<Array<{
    source: string
    target: string
    relationship: string
    strength: number
  }>> {
    const relationships: Array<{
      source: string
      target: string
      relationship: string
      strength: number
    }> = []

    for (let i = 0; i < documents.length; i++) {
      for (let j = i + 1; j < documents.length; j++) {
        const doc1 = documents[i]
        const doc2 = documents[j]
        
        const similarity = this.calculateSimilarity(doc1, doc2)
        if (similarity > 0.3) {
          relationships.push({
            source: doc1.title,
            target: doc2.title,
            relationship: this.determineRelationship(doc1, doc2),
            strength: similarity
          })
        }
      }
    }

    return relationships
  }

  // 키워드 추출 (Mock)
  private extractKeywords(text: string): string[] {
    const words = text.toLowerCase()
      .replace(/[^\w\s가-힣]/g, ' ')
      .split(/\s+/)
      .filter(word => word.length > 2)

    const wordCount = new Map<string, number>()
    words.forEach(word => {
      wordCount.set(word, (wordCount.get(word) || 0) + 1)
    })

    return Array.from(wordCount.entries())
      .filter(([_, count]) => count > 1)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([word, _]) => word)
  }

  // 카테고리 감지 (Mock)
  private detectCategories(content: string): string[] {
    const categories: string[] = []
    const text = content.toLowerCase()

    if (text.includes('api') || text.includes('endpoint') || text.includes('rest')) {
      categories.push('API')
    }
    if (text.includes('설치') || text.includes('setup') || text.includes('환경')) {
      categories.push('설치')
    }
    if (text.includes('문서') || text.includes('documentation') || text.includes('가이드')) {
      categories.push('문서')
    }
    if (text.includes('프로젝트') || text.includes('project') || text.includes('개요')) {
      categories.push('프로젝트')
    }
    if (text.includes('개발') || text.includes('development') || text.includes('코드')) {
      categories.push('개발')
    }

    return categories
  }

  // 관련성 계산 (Mock)
  private calculateRelevance(query: string, doc: DocumentInfo): number {
    const queryTerms = query.toLowerCase().split(/\s+/)
    let score = 0

    // 제목 매칭 (높은 가중치)
    queryTerms.forEach(term => {
      if (doc.title.toLowerCase().includes(term)) {
        score += 0.4
      }
      if (doc.description.toLowerCase().includes(term)) {
        score += 0.2
      }
      if (doc.tags.some(tag => tag.toLowerCase().includes(term))) {
        score += 0.3
      }
    })

    return Math.min(score, 1.0)
  }

  // 매칭된 용어 찾기
  private findMatchedTerms(query: string, doc: DocumentInfo): string[] {
    const queryTerms = query.toLowerCase().split(/\s+/)
    const matchedTerms: string[] = []

    queryTerms.forEach(term => {
      if (doc.title.toLowerCase().includes(term) ||
          doc.description.toLowerCase().includes(term) ||
          doc.tags.some(tag => tag.toLowerCase().includes(term))) {
        matchedTerms.push(term)
      }
    })

    return matchedTerms
  }

  // 문서 유사도 계산
  private calculateSimilarity(doc1: DocumentInfo, doc2: DocumentInfo): number {
    // 태그 유사도
    const tags1 = new Set(doc1.tags)
    const tags2 = new Set(doc2.tags)
    const commonTags = Array.from(tags1).filter(tag => tags2.has(tag))
    const tagSimilarity = commonTags.length / Math.max(tags1.size, tags2.size)

    // 제목 유사도 (간단한 문자열 유사도)
    const titleSimilarity = this.stringSimilarity(doc1.title, doc2.title)

    return (tagSimilarity * 0.6 + titleSimilarity * 0.4)
  }

  // 문자열 유사도 계산 (간단한 구현)
  private stringSimilarity(str1: string, str2: string): number {
    const words1 = str1.toLowerCase().split(/\s+/)
    const words2 = str2.toLowerCase().split(/\s+/)
    const commonWords = words1.filter(word => words2.includes(word))
    return commonWords.length / Math.max(words1.length, words2.length)
  }

  // 관계 유형 결정
  private determineRelationship(doc1: DocumentInfo, doc2: DocumentInfo): string {
    const tags1 = new Set(doc1.tags)
    const tags2 = new Set(doc2.tags)
    const commonTags = Array.from(tags1).filter(tag => tags2.has(tag))

    if (commonTags.includes('API') && commonTags.includes('문서')) {
      return 'API 문서 관계'
    }
    if (commonTags.includes('설치') && commonTags.includes('개발')) {
      return '개발 환경 관계'
    }
    if (commonTags.includes('프로젝트') && commonTags.includes('문서')) {
      return '프로젝트 문서 관계'
    }

    return '관련 문서'
  }
}

// 싱글톤 인스턴스
export const aiService = new AIService()
