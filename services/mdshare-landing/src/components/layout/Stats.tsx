export function Stats() {
  const stats = [
    {
      number: '10K+',
      label: '활성 사용자',
    },
    {
      number: '1M+',
      label: '처리된 문서',
    },
    {
      number: '99.9%',
      label: '가동 시간',
    },
    {
      number: '50+',
      label: '지원 언어',
    },
  ];

  return (
    <section className="py-20 bg-muted/50">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            신뢰받는 플랫폼
          </h2>
          <p className="text-xl text-muted-foreground">
            전 세계 사용자들이 선택한 MDShare의 성과를 확인해보세요.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-primary mb-2">
                {stat.number}
              </div>
              <div className="text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
