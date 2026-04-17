import Icon from '@/components/ui/icon';

const HERO_IMAGE = 'https://cdn.poehali.dev/projects/48ca5154-8937-4bc8-b36c-ec54ff253faf/files/6a0bcbeb-bb2f-4393-9d38-b2e76ab91e4a.jpg';

interface HeroSectionProps {
  onNavigate: (section: string) => void;
}

const quickLinks = [
  { icon: 'ShoppingBag', label: 'Магазин', section: 'shop' },
  { icon: 'Calendar', label: 'Консультации', section: 'consultations' },
  { icon: 'Flame', label: 'Программы', section: 'programs' },
  { icon: 'Brain', label: 'Оптимайзер', section: 'optimizer' },
];

export default function HeroSection({ onNavigate }: HeroSectionProps) {
  return (
    <section className="relative min-h-screen flex flex-col overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0">
        <img
          src={HERO_IMAGE}
          alt="Wellness"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-charcoal/90 via-charcoal/60 to-charcoal/20" />
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal/70 via-charcoal/10 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex-1 flex flex-col justify-center max-w-7xl mx-auto px-6 pt-24 pb-16 w-full">
        <div className="max-w-xl">
          {/* Eyebrow */}
          <p className="reveal font-golos text-gold text-xs tracking-[0.3em] uppercase mb-6">
            Премиум Велнесс Платформа
          </p>

          {/* Headline */}
          <h1 className="reveal reveal-delay-1 font-cormorant font-light text-ivory leading-[1.05] mb-6"
            style={{ fontSize: 'clamp(3rem, 6vw, 5.5rem)' }}>
            Ваше здоровье —<br />
            <em className="font-light italic" style={{ color: 'hsl(var(--gold-light))' }}>
              ваш капитал
            </em>
          </h1>

          {/* Subtext */}
          <p className="reveal reveal-delay-2 font-golos text-ivory/70 text-base leading-relaxed mb-10 max-w-md">
            Персонализированный подход к красоте, питанию и ментальному здоровью. 
            Эксклюзивные специалисты, авторские программы и сообщество единомышленников.
          </p>

          {/* CTAs */}
          <div className="reveal reveal-delay-3 flex flex-wrap gap-4 mb-16">
            <button
              onClick={() => onNavigate('optimizer')}
              className="flex items-center gap-2 bg-gold text-ivory px-8 py-3.5 font-golos text-sm tracking-[0.12em] uppercase hover:bg-gold-light transition-all duration-300 hover:shadow-[0_8px_24px_rgba(180,140,60,0.35)]"
            >
              <Icon name="Sparkles" size={16} />
              Начать бесплатно
            </button>
            <button
              onClick={() => onNavigate('programs')}
              className="flex items-center gap-2 border border-ivory/50 text-ivory px-8 py-3.5 font-golos text-sm tracking-[0.12em] uppercase hover:border-gold hover:text-gold transition-all duration-300"
            >
              Смотреть программы
              <Icon name="ArrowRight" size={16} />
            </button>
          </div>

          {/* Stats */}
          <div className="reveal reveal-delay-4 flex gap-10">
            {[
              { num: '12 000+', label: 'участников' },
              { num: '340+', label: 'специалистов' },
              { num: '4.9', label: 'рейтинг' },
            ].map((s) => (
              <div key={s.label}>
                <div className="stat-number text-3xl text-gold">{s.num}</div>
                <div className="font-golos text-xs text-ivory/50 tracking-[0.1em] uppercase mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick access bar */}
      <div className="relative z-10 bg-ivory/10 backdrop-blur-sm border-t border-ivory/20">
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-wrap gap-2 justify-center sm:justify-start">
          <span className="font-golos text-xs text-ivory/40 tracking-[0.1em] uppercase self-center mr-4 hidden sm:block">
            Быстрый доступ:
          </span>
          {quickLinks.map((link) => (
            <button
              key={link.section}
              onClick={() => onNavigate(link.section)}
              className="flex items-center gap-2 px-4 py-2 border border-ivory/20 text-ivory/80 hover:border-gold hover:text-gold font-golos text-xs tracking-[0.1em] uppercase transition-all duration-300"
            >
              <Icon name={link.icon} fallback="Circle" size={13} />
              {link.label}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}