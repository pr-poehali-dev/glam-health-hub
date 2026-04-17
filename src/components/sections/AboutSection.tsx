import Icon from '@/components/ui/icon';

const contacts = [
  { icon: 'Mail', label: 'Email', value: 'hello@aura-wellness.ru', href: 'mailto:hello@aura-wellness.ru' },
  { icon: 'Phone', label: 'Телефон', value: '+7 (800) 555-01-20', href: 'tel:+78005550120' },
  { icon: 'MessageCircle', label: 'Telegram', value: '@aura_support', href: '#' },
  { icon: 'MapPin', label: 'Адрес', value: 'Москва, Пресненская наб., 8', href: '#' },
];

const values = [
  { icon: 'Shield', title: 'Качество', desc: 'Строгий отбор специалистов и продуктов. Только проверенные эксперты с подтверждёнными результатами.' },
  { icon: 'Heart', title: 'Забота', desc: 'Индивидуальный подход к каждому. Ваше благополучие — наш главный приоритет.' },
  { icon: 'Leaf', title: 'Осознанность', desc: 'Мы верим в бережное отношение к себе и природе. Только натуральные и этичные решения.' },
  { icon: 'Zap', title: 'Инновации', desc: 'Технологии ИИ и нейросетей на службе вашего здоровья. Наука + природа.' },
];

const faq = [
  {
    q: 'Как работает система рекомендаций?',
    a: 'Велнесс-оптимайзер анализирует ваши цели, образ жизни и прогресс, чтобы создать персональный план. Алгоритм адаптируется каждую неделю.',
  },
  {
    q: 'Могу ли я вернуть товар?',
    a: 'Да, в течение 14 дней с момента получения при сохранении товарного вида и упаковки согласно законодательству РФ.',
  },
  {
    q: 'Как проходят онлайн-консультации?',
    a: 'Консультации проводятся через видеосвязь в приложении AURA. После сессии специалист отправляет вам персональные рекомендации.',
  },
  {
    q: 'Что такое Premium-подписка?',
    a: 'Неограниченный доступ ко всем программам, закрытое сообщество, скидки в магазине и персональный велнесс-куратор.',
  },
];

export default function AboutSection() {
  return (
    <section className="py-24 bg-ivory">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="mb-16 text-center">
          <p className="font-golos text-gold text-xs tracking-[0.3em] uppercase mb-3">О платформе</p>
          <h2 className="font-cormorant font-light text-charcoal mb-6" style={{ fontSize: 'clamp(2.2rem, 4vw, 3.5rem)' }}>
            AURA — платформа нового<br />
            <em className="italic text-gold">поколения для вашего здоровья</em>
          </h2>
          <p className="font-golos text-muted-foreground text-sm max-w-2xl mx-auto leading-relaxed">
            Мы создали пространство, где современные технологии встречаются с холистическим подходом к здоровью. 
            AURA объединяет лучших экспертов, качественные продукты и персональные программы в одной экосистеме.
          </p>
        </div>

        <div className="gold-line mb-16" />

        {/* Values */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {values.map((v) => (
            <div key={v.title} className="premium-card bg-white border border-border p-6">
              <div className="w-10 h-10 border border-gold/40 flex items-center justify-center mb-5">
                <Icon name={v.icon} fallback="Circle" size={18} className="text-gold" />
              </div>
              <h4 className="font-cormorant text-xl text-charcoal mb-2">{v.title}</h4>
              <p className="font-golos text-xs text-muted-foreground leading-relaxed">{v.desc}</p>
            </div>
          ))}
        </div>

        {/* Mission statement */}
        <div className="bg-charcoal p-12 mb-16 text-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-5" style={{
            backgroundImage: 'radial-gradient(circle at 30% 50%, hsl(42,72%,46%) 0%, transparent 50%), radial-gradient(circle at 70% 50%, hsl(42,72%,46%) 0%, transparent 50%)',
          }} />
          <p className="font-golos text-gold text-xs tracking-[0.3em] uppercase mb-6 relative z-10">Наша миссия</p>
          <blockquote className="font-cormorant text-ivory font-light italic relative z-10 max-w-3xl mx-auto"
            style={{ fontSize: 'clamp(1.5rem, 3vw, 2.2rem)', lineHeight: 1.4 }}>
            "Сделать профессиональную заботу о здоровье доступной, персональной и вдохновляющей для каждого человека"
          </blockquote>
        </div>

        {/* FAQ + Contacts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* FAQ */}
          <div>
            <h3 className="font-cormorant text-2xl text-charcoal mb-6">Часто задаваемые вопросы</h3>
            <div className="space-y-1">
              {faq.map((item) => (
                <details key={item.q} className="group border border-border bg-white">
                  <summary className="flex items-center justify-between p-5 cursor-pointer list-none">
                    <span className="font-golos text-sm text-charcoal pr-4">{item.q}</span>
                    <Icon name="ChevronDown" size={14} className="text-gold shrink-0 group-open:rotate-180 transition-transform duration-200" />
                  </summary>
                  <div className="px-5 pb-5">
                    <p className="font-golos text-xs text-muted-foreground leading-relaxed">{item.a}</p>
                  </div>
                </details>
              ))}
            </div>
          </div>

          {/* Contacts */}
          <div>
            <h3 className="font-cormorant text-2xl text-charcoal mb-6">Связаться с нами</h3>
            <div className="space-y-4 mb-8">
              {contacts.map((c) => (
                <a
                  key={c.label}
                  href={c.href}
                  className="flex items-center gap-4 p-4 border border-border bg-white hover:border-gold transition-colors duration-300 group"
                >
                  <div className="w-9 h-9 border border-border flex items-center justify-center group-hover:border-gold group-hover:text-gold transition-colors duration-300">
                    <Icon name={c.icon} fallback="Circle" size={15} />
                  </div>
                  <div>
                    <div className="font-golos text-[10px] text-muted-foreground uppercase tracking-[0.1em]">{c.label}</div>
                    <div className="font-golos text-sm text-charcoal group-hover:text-gold transition-colors duration-200">{c.value}</div>
                  </div>
                  <Icon name="ArrowRight" size={13} className="ml-auto text-muted-foreground group-hover:text-gold transition-colors duration-200" />
                </a>
              ))}
            </div>

            {/* Support form teaser */}
            <div className="border border-gold/30 bg-gold-pale p-6">
              <h4 className="font-cormorant text-xl text-charcoal mb-2">Служба поддержки</h4>
              <p className="font-golos text-xs text-muted-foreground leading-relaxed mb-4">
                Ответим в течение 2 часов в рабочее время. Для срочных вопросов — Telegram.
              </p>
              <button className="w-full bg-charcoal text-ivory py-3 font-golos text-xs tracking-[0.12em] uppercase hover:bg-gold transition-colors duration-300">
                Написать в поддержку
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
