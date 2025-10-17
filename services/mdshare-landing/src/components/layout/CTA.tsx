import { Button } from '@/components/ui/Button';
import { ArrowRight, Github } from 'lucide-react';

export function CTA() {
  return (
    <section className="py-20">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">
          지금 시작해보세요
        </h2>
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          AI 기반 문서화 플랫폼으로 더 스마트하게 문서를 관리하고,
          팀과 함께 협업하세요.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Button size="lg" className="text-lg">
            무료로 시작하기
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
          <Button variant="outline" size="lg" className="text-lg">
            <Github className="mr-2 h-5 w-5" />
            GitHub에서 보기
          </Button>
        </div>

        <div className="text-sm text-muted-foreground">
          <p>무료 플랜으로 시작하고, 언제든지 업그레이드할 수 있습니다.</p>
        </div>
      </div>
    </section>
  );
}
