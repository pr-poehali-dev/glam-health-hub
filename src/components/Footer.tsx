import Icon from '@/components/ui/icon';

interface FooterProps {
  onNavigate: (section: string) => void;
}

export default function Footer({ onNavigate }: FooterProps) {
  return (
    <footer className="bg-charcoal border-t border-white/10">
      <div className="max-w-7xl mx-auto px-6 py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="font-cormorant text-3xl text-ivory font-light tracking-[0.2em] mb-3">AURA</div>
            <p className="font-golos text-xs text-ivory/40 leading-relaxed mb-5">
              Премиум велнесс-платформа для тех, кто инвестирует в своё здоровье и качество жизни.
            </p>
            <div className="flex gap-3">
              {['Instagram', 'Youtube', 'MessageCircle'].map((icon) => (
                <button
                  key={icon}
                  className="w-8 h-8 border border-white/20 flex items-center justify-center text-ivory/40 hover:border-gold hover:text-gold transition-all duration-300"
                >
                  <Icon name={icon} fallback="Circle" size={13} />
                </button>
              ))}
            </div>
          </div>

          {/* Nav links */}
          {[
            {
              title: 'Платформа',
              links: [
                { label: 'Главная', section: 'home' },
                { label: 'Магазин', section: 'shop' },
                { label: 'Консультации', section: 'consultations' },
                { label: 'Программы', section: 'programs' },
              ],
            },
            {
              title: 'Личный кабинет',
              links: [
                { label: 'Велнесс-оптимайзер', section: 'optimizer' },
                { label: 'Сообщество', section: 'community' },
                { label: 'Система лояльности', section: 'community' },
                { label: 'Мои программы', section: 'programs' },
              ],
            },
            {
              title: 'Компания',
              links: [
                { label: 'О нас', section: 'about' },
                { label: 'Служба поддержки', section: 'about' },
                { label: 'Стать экспертом', section: 'about' },
                { label: 'Партнёрство', section: 'about' },
              ],
            },
          ].map((col) => (
            <div key={col.title}>
              <h5 className="font-golos text-[10px] tracking-[0.2em] uppercase text-gold mb-4">{col.title}</h5>
              <ul className="space-y-2.5">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <button
                      onClick={() => onNavigate(l.section)}
                      className="font-golos text-xs text-ivory/50 hover:text-ivory transition-colors duration-200"
                    >
                      {l.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="gold-line mb-6" />

        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="font-golos text-[11px] text-ivory/30">
            © 2024 AURA Wellness. Все права защищены.
          </p>
          <div className="flex gap-6">
            {['Политика конфиденциальности', 'Пользовательское соглашение', 'Оферта'].map((l) => (
              <button key={l} className="font-golos text-[11px] text-ivory/30 hover:text-ivory/60 transition-colors duration-200">
                {l}
              </button>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
