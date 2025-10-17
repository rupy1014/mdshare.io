export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            MDShare - AI-powered Documentation Platform
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            AI 기반 마크다운 문서화 플랫폼입니다. 지능형 인덱싱, 검색, 챗봇 기능을 제공합니다.
          </p>
          <div className="space-x-4">
            <a 
              href="http://localhost:7778" 
              className="inline-block bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors"
            >
              서비스 시작하기
            </a>
            <a 
              href="http://localhost:7778/dashboard" 
              className="inline-block border border-border px-6 py-3 rounded-lg font-medium hover:bg-accent transition-colors"
            >
              대시보드 보기
            </a>
          </div>
        </div>
        
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <h3 className="text-lg font-semibold mb-2">AI 기반 검색</h3>
            <p className="text-muted-foreground">
              지능형 검색으로 원하는 문서를 빠르게 찾으세요
            </p>
          </div>
          <div className="text-center">
            <h3 className="text-lg font-semibold mb-2">노션 스타일 편집</h3>
            <p className="text-muted-foreground">
              직관적인 인터페이스로 마크다운을 편집하세요
            </p>
          </div>
          <div className="text-center">
            <h3 className="text-lg font-semibold mb-2">실시간 협업</h3>
            <p className="text-muted-foreground">
              팀원들과 함께 문서를 작성하고 공유하세요
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
