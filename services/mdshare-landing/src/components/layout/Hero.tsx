import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { ArrowRight, Sparkles, Search, Bot } from 'lucide-react';

export function Hero() {
  return (
    <section className="py-20 text-center">
      <div className="max-w-4xl mx-auto">
        <Badge variant="secondary" className="mb-4">
          <Sparkles className="h-3 w-3 mr-1" />
          AI 기반 문서화 플랫폼
        </Badge>
        
        <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
          MDShare
        </h1>
        
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          AI가 자동으로 인덱싱하고 분석하는 지능형 마크다운 문서화 플랫폼.
          검색, 챗봇, 관계 분석까지 모든 것이 자동화됩니다.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Button size="lg" className="text-lg">
            무료로 시작하기
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
          <Button variant="outline" size="lg" className="text-lg">
            데모 보기
          </Button>
        </div>

        {/* Feature highlights */}
        <div className="grid md:grid-cols-3 gap-8 text-left">
          <div className="flex items-start space-x-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Search className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold mb-2">지능형 검색</h3>
              <p className="text-sm text-muted-foreground">
                AI가 문서 내용을 이해하여 의미 기반 검색을 제공합니다.
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Bot className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold mb-2">AI 챗봇</h3>
              <p className="text-sm text-muted-foreground">
                문서 내용을 바탕으로 질문에 답변하는 지능형 챗봇입니다.
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Sparkles className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold mb-2">자동 인덱싱</h3>
              <p className="text-sm text-muted-foreground">
                문서 구조를 자동으로 분석하고 관계를 파악합니다.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
