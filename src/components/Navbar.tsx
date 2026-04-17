import { useState, useEffect } from 'react';
import Icon from '@/components/ui/icon';

interface NavbarProps {
  activeSection: string;
  onNavigate: (section: string) => void;
}

const navItems = [
  { id: 'home', label: 'Главная' },
  { id: 'shop', label: 'Магазин' },
  { id: 'consultations', label: 'Консультации' },
  { id: 'programs', label: 'Программы' },
  { id: 'optimizer', label: 'Оптимайзер' },
  { id: 'community', label: 'Сообщество' },
  { id: 'about', label: 'О нас' },
];

export default function Navbar({ activeSection, onNavigate }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-ivory/95 backdrop-blur-md shadow-[0_1px_0_hsl(var(--border))]'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <button
          onClick={() => onNavigate('home')}
          className="font-cormorant text-2xl font-light tracking-[0.2em] text-charcoal hover:text-gold transition-colors duration-300"
        >
          AURA
        </button>

        {/* Desktop Nav */}
        <ul className="hidden lg:flex items-center gap-8">
          {navItems.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => onNavigate(item.id)}
                className={`nav-link font-golos text-xs tracking-[0.12em] uppercase transition-colors duration-300 ${
                  activeSection === item.id
                    ? 'text-gold active'
                    : 'text-charcoal/70 hover:text-charcoal'
                }`}
              >
                {item.label}
              </button>
            </li>
          ))}
        </ul>

        {/* CTA + Mobile */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => onNavigate('optimizer')}
            className="hidden lg:flex items-center gap-2 bg-charcoal text-ivory px-5 py-2 text-xs tracking-[0.14em] uppercase font-golos hover:bg-gold transition-colors duration-300"
          >
            <Icon name="Sparkles" size={14} />
            Войти
          </button>

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="lg:hidden text-charcoal"
          >
            <Icon name={menuOpen ? 'X' : 'Menu'} size={22} />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="lg:hidden bg-ivory border-t border-border px-6 py-6 flex flex-col gap-5">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => { onNavigate(item.id); setMenuOpen(false); }}
              className={`text-left font-golos text-sm tracking-[0.1em] uppercase ${
                activeSection === item.id ? 'text-gold' : 'text-charcoal/70'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </nav>
  );
}
