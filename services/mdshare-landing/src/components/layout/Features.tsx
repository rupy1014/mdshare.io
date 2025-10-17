import { Search, Bot, Zap, Shield, Globe, Users } from 'lucide-react';
import { Card } from '@/components/ui/Card';

export function Features() {
  const features = [
    {
      icon: Search,
      title: 'AI 기반 검색',
      description: '의미를 이해하는 지능형 검색으로 정확한 문서를 찾아보세요.',
    },
    {
      icon: Bot,
      title: 'AI 챗봇',
      description: '문서 내용을 바탕으로 질문에 답변하는 지능형 챗봇입니다.',
    },
    {
      icon: Zap,
      title: '자동 인덱싱',
      description: '문서 구조를 자동으로 분석하고 관계를 파악합니다.',
    },
    {
      icon: Shield,
      title: '보안',
      description: '엔터프라이즈급 보안으로 안전하게 문서를 관리하세요.',
    },
    {
      icon: Globe,
      title: '글로벌 배포',
      description: 'Cloudflare Pages로 전 세계 어디서나 빠른 접속이 가능합니다.',
    },
    {
      icon: Users,
      title: '협업',
      description: '팀원들과 함께 문서를 작성하고 관리할 수 있습니다.',
    },
  ];

  return (
    <section className="py-20">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            강력한 기능들
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            AI와 최신 기술을 활용한 문서화 플랫폼의 모든 기능을 확인해보세요.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="p-6 text-center">
              <div className="flex justify-center mb-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
