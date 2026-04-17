import { useState, useEffect } from 'react';
import Icon from '@/components/ui/icon';
import { isLoggedIn, getRole, getUserName, clearAuth } from '@/lib/api';

interface NavbarProps {
  activeSection: string;
  onNavigate: (section: string) => void;
  onAuthClick: () => void;
  onCabinetClick: () => void;
  authKey: number;
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

export default function Navbar({ activeSection, onNavigate, onAuthClick, onCabinetClick, authKey }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [userDropdown, setUserDropdown] = useState(false);

  const loggedIn = isLoggedIn();
  const role = getRole();
  const name = getUserName();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // закрыть дропдаун при клике вне
  useEffect(() => {
    if (!userDropdown) return;
    const handler = () => setUserDropdown(false);
    setTimeout(() => document.addEventListener('click', handler), 0);
    return () => document.removeEventListener('click', handler);
  }, [userDropdown]);

  // пересчёт при изменении authKey
  void authKey;

  const handleLogout = () => {
    clearAuth();
    setUserDropdown(false);
    window.location.reload();
  };

  const roleLabel: Record<string, string> = {
    user: 'Пользователь',
    brand: 'Бренд',
    salon: 'Салон / Клиника',
    admin: 'Администратор',
  };

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

        {/* Auth area */}
        <div className="flex items-center gap-3">
          {loggedIn ? (
            <div className="relative hidden lg:block">
              <button
                onClick={(e) => { e.stopPropagation(); setUserDropdown(!userDropdown); }}
                className="flex items-center gap-2 border border-border px-4 py-2 text-xs font-golos text-charcoal hover:border-gold hover:text-gold transition-colors duration-200"
              >
                <Icon name="User" size={13} />
                <span className="max-w-[100px] truncate">{name || 'Кабинет'}</span>
                <Icon name="ChevronDown" size={11} />
              </button>

              {userDropdown && (
                <div className="absolute right-0 top-full mt-1 w-52 bg-ivory border border-border shadow-lg z-50">
                  <div className="px-4 py-3 border-b border-border">
                    <p className="font-golos text-xs text-muted-foreground">{roleLabel[role] || role}</p>
                    <p className="font-golos text-sm text-charcoal truncate">{name}</p>
                  </div>
                  {(role === 'brand' || role === 'salon') && (
                    <button
                      onClick={() => { setUserDropdown(false); onCabinetClick(); }}
                      className="w-full text-left px-4 py-2.5 font-golos text-xs text-charcoal hover:bg-gold-pale hover:text-gold transition-colors flex items-center gap-2"
                    >
                      <Icon name="LayoutDashboard" size={12} />
                      Личный кабинет
                    </button>
                  )}
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2.5 font-golos text-xs text-charcoal hover:bg-gold-pale hover:text-gold transition-colors flex items-center gap-2"
                  >
                    <Icon name="LogOut" size={12} />
                    Выйти
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={onAuthClick}
              className="hidden lg:flex items-center gap-2 bg-charcoal text-ivory px-5 py-2 text-xs tracking-[0.14em] uppercase font-golos hover:bg-gold transition-colors duration-300"
            >
              <Icon name="Sparkles" size={14} />
              Войти
            </button>
          )}

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
          <div className="gold-line" />
          {loggedIn ? (
            <>
              {(role === 'brand' || role === 'salon') && (
                <button
                  onClick={() => { setMenuOpen(false); onCabinetClick(); }}
                  className="text-left font-golos text-sm text-charcoal/70"
                >
                  Личный кабинет
                </button>
              )}
              <button onClick={handleLogout} className="text-left font-golos text-sm text-charcoal/70">
                Выйти
              </button>
            </>
          ) : (
            <button
              onClick={() => { setMenuOpen(false); onAuthClick(); }}
              className="text-left font-golos text-sm text-gold"
            >
              Войти / Зарегистрироваться
            </button>
          )}
        </div>
      )}
    </nav>
  );
}
