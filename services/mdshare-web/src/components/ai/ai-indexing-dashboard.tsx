'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
  Brain, 
  Tag, 
  Link, 
  TrendingUp, 
  FileText, 
  Users, 
  Calendar,
  Sparkles,
  CheckCircle,
  AlertCircle,
  Clock
} from 'lucide-react'
import { aiService, type DocumentAIAnalysis } from '@/lib/ai-service'
import { mdshareClient } from '@/lib/mdshare-client'
import type { DocumentInfo } from 'mdshare-core'

interface AIIndexingStats {
  totalDocuments: number
  indexedDocuments: number
  autoTagsGenerated: number
  relationshipsFound: number
  aiFriendlinessScore: number
}

interface DocumentAIAnalysisWithDoc extends DocumentAIAnalysis {
  document: DocumentInfo
}

export function AIIndexingDashboard() {
  const [stats, setStats] = useState<AIIndexingStats>({
    totalDocuments: 0,
    indexedDocuments: 0,
    autoTagsGenerated: 0,
    relationshipsFound: 0,
    aiFriendlinessScore: 0
  })
  const [documents, setDocuments] = useState<DocumentInfo[]>([])
  const [documentAnalyses, setDocumentAnalyses] = useState<DocumentAIAnalysisWithDoc[]>([])
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisProgress, setAnalysisProgress] = useState(0)

  useEffect(() => {
    loadDocuments()
  }, [])

  const loadDocuments = async () => {
    try {
      const docs = mdshareClient.getMockDocuments()
      setDocuments(docs)
      setStats(prev => ({
        ...prev,
        totalDocuments: docs.length
      }))
    } catch (error) {
      console.error('문서 로드 실패:', error)
    }
  }

  const runAIAnalysis = async () => {
    setIsAnalyzing(true)
    setAnalysisProgress(0)

    try {
      const analyses: DocumentAIAnalysisWithDoc[] = []

      for (let i = 0; i < documents.length; i++) {
        const doc = documents[i]
        
        // 진행률 업데이트
        setAnalysisProgress((i / documents.length) * 100)

        // AI 종합 분석
        const analysis = await aiService.analyzeDocument(doc, documents)

        analyses.push({
          document: doc,
          ...analysis
        })

        // 진행률 표시를 위한 작은 지연
        await new Promise(resolve => setTimeout(resolve, 100))
      }

      setDocumentAnalyses(analyses)
      
      // 통계 업데이트
      const totalTags = analyses.reduce((sum, analysis) => sum + analysis.suggestedTags.length, 0)
      const totalRelationships = analyses.reduce((sum, analysis) => sum + analysis.relationships.length, 0)
      const avgAIScore = analyses.reduce((sum, analysis) => sum + analysis.aiFriendlinessScore, 0) / analyses.length

      setStats({
        totalDocuments: documents.length,
        indexedDocuments: documents.length,
        autoTagsGenerated: totalTags,
        relationshipsFound: totalRelationships,
        aiFriendlinessScore: Math.round(avgAIScore)
      })

      setAnalysisProgress(100)
    } catch (error) {
      console.error('AI 분석 실패:', error)
    } finally {
      setIsAnalyzing(false)
    }
  }


  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">AI 자동 인덱싱</h1>
          <p className="text-muted-foreground mt-2">
            AI가 문서를 분석하여 자동으로 인덱스를 생성하고 관계를 파악합니다
          </p>
        </div>
        <Button 
          onClick={runAIAnalysis} 
          disabled={isAnalyzing}
          className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
        >
          {isAnalyzing ? (
            <>
              <Clock className="h-4 w-4 mr-2 animate-spin" />
              분석 중...
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4 mr-2" />
              AI 분석 시작
            </>
          )}
        </Button>
      </div>

      {/* 진행률 표시 */}
      {isAnalyzing && (
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>AI 분석 진행률</span>
                <span>{Math.round(analysisProgress)}%</span>
              </div>
              <Progress value={analysisProgress} className="w-full" />
              <p className="text-xs text-muted-foreground">
                문서 구조 분석, 자동 태깅, 관계 파악 중...
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* 통계 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">총 문서</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalDocuments}</div>
            <p className="text-xs text-muted-foreground">
              인덱싱된 문서: {stats.indexedDocuments}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">자동 태그</CardTitle>
            <Tag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.autoTagsGenerated}</div>
            <p className="text-xs text-muted-foreground">
              AI가 생성한 태그
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">문서 관계</CardTitle>
            <Link className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.relationshipsFound}</div>
            <p className="text-xs text-muted-foreground">
              발견된 연관성
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">AI 친화도</CardTitle>
            <Brain className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.aiFriendlinessScore}%</div>
            <p className="text-xs text-muted-foreground">
              평균 이해도 점수
            </p>
          </CardContent>
        </Card>
      </div>

      {/* 문서별 분석 결과 */}
      {documentAnalyses.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Brain className="h-5 w-5" />
              <span>문서별 AI 분석 결과</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {documentAnalyses.map((analysis, index) => (
                <div key={analysis.document.id} className="border border-border rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-lg">{analysis.document.title}</h3>
                      <p className="text-sm text-muted-foreground">{analysis.document.description}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge 
                        variant={analysis.aiFriendlinessScore >= 80 ? "default" : analysis.aiFriendlinessScore >= 60 ? "secondary" : "destructive"}
                      >
                        AI 친화도: {analysis.aiFriendlinessScore}점
                      </Badge>
                      <Badge 
                        variant={analysis.sentiment === 'positive' ? "default" : analysis.sentiment === 'neutral' ? "secondary" : "destructive"}
                      >
                        {analysis.sentiment === 'positive' ? '긍정적' : analysis.sentiment === 'negative' ? '부정적' : '중립적'}
                      </Badge>
                    </div>
                  </div>

                  {/* 추천 태그 */}
                  {analysis.suggestedTags.length > 0 && (
                    <div className="mb-3">
                      <div className="flex items-center space-x-2 mb-2">
                        <Tag className="h-4 w-4 text-primary" />
                        <span className="text-sm font-medium">추천 태그</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {analysis.suggestedTags.slice(0, 5).map((tag, tagIndex) => (
                          <Badge 
                            key={tagIndex} 
                            variant="outline" 
                            className="text-xs"
                          >
                            {tag.tag} ({Math.round(tag.confidence * 100)}%)
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* 주제 추출 */}
                  {analysis.topics.length > 0 && (
                    <div className="mb-3">
                      <div className="flex items-center space-x-2 mb-2">
                        <TrendingUp className="h-4 w-4 text-primary" />
                        <span className="text-sm font-medium">주제</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {analysis.topics.map((topic, topicIndex) => (
                          <Badge 
                            key={topicIndex} 
                            variant="secondary" 
                            className="text-xs"
                          >
                            {topic}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* 문서 관계 */}
                  {analysis.relationships.length > 0 && (
                    <div className="mb-3">
                      <div className="flex items-center space-x-2 mb-2">
                        <Link className="h-4 w-4 text-primary" />
                        <span className="text-sm font-medium">관련 문서</span>
                      </div>
                      <div className="space-y-1">
                        {analysis.relationships.map((rel, relIndex) => (
                          <div key={relIndex} className="text-sm">
                            <span className="text-muted-foreground">→</span> {rel.target}
                            <span className="text-xs text-muted-foreground ml-2">
                              ({rel.relationship}, {Math.round(rel.strength * 100)}%)
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* 개선 제안 */}
                  {analysis.improvements.length > 0 && (
                    <div>
                      <div className="flex items-center space-x-2 mb-2">
                        <AlertCircle className="h-4 w-4 text-orange-500" />
                        <span className="text-sm font-medium">개선 제안</span>
                      </div>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        {analysis.improvements.map((improvement, impIndex) => (
                          <li key={impIndex} className="flex items-start space-x-2">
                            <span className="text-orange-500 mt-1">•</span>
                            <span>{improvement}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
