import { useState } from 'react';
import Icon from '@/components/ui/icon';
import { api, saveAuth } from '@/lib/api';

interface AuthModalProps {
  onClose: () => void;
  onSuccess: (role: string, name: string) => void;
}

type Mode = 'login' | 'register';
type Role = 'user' | 'brand' | 'salon';

const roleLabels: Record<Role, string> = {
  user: 'Пользователь',
  brand: 'Бренд / Производитель',
  salon: 'Салон / Клиника',
};

const roleDescriptions: Record<Role, string> = {
  user: 'Записывайтесь на консультации, участвуйте в программах, делайте покупки',
  brand: 'Добавляйте свои товары в магазин платформы',
  salon: 'Публикуйте программы и велнесс-услуги вашего заведения',
};

export default function AuthModal({ onClose, onSuccess }: AuthModalProps) {
  const [mode, setMode] = useState<Mode>('login');
  const [role, setRole] = useState<Role>('user');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    email: '',
    password: '',
    first_name: '',
    last_name: '',
    phone: '',
    city: '',
    brand_name: '',
    salon_name: '',
  });

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      let res;
      if (mode === 'login') {
        res = await api.login(form.email, form.password);
      } else {
        res = await api.register({ ...form, role });
      }

      if (res.error) {
        setError(res.error);
      } else {
        saveAuth(res.token, res.role, res.first_name || form.first_name || form.email);
        onSuccess(res.role, res.first_name || form.first_name || '');
        onClose();
      }
    } catch {
      setError('Ошибка соединения. Попробуйте позже.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-charcoal/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-ivory w-full max-w-md max-h-[90vh] overflow-y-auto animate-scale-in">
        {/* Header */}
        <div className="sticky top-0 bg-ivory border-b border-border px-8 py-5 flex items-center justify-between z-10">
          <div>
            <div className="font-cormorant text-2xl text-charcoal">
              {mode === 'login' ? 'Войти в AURA' : 'Создать аккаунт'}
            </div>
            <p className="font-golos text-xs text-muted-foreground mt-0.5">
              {mode === 'login' ? 'Добро пожаловать обратно' : 'Присоединяйтесь к сообществу'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center border border-border hover:border-gold hover:text-gold transition-colors duration-200"
          >
            <Icon name="X" size={14} />
          </button>
        </div>

        <div className="px-8 py-6">
          {/* Mode tabs */}
          <div className="flex border border-border mb-6">
            {(['login', 'register'] as Mode[]).map((m) => (
              <button
                key={m}
                onClick={() => { setMode(m); setError(''); }}
                className={`flex-1 py-2.5 font-golos text-xs tracking-[0.1em] uppercase transition-all duration-200 ${
                  mode === m ? 'bg-charcoal text-ivory' : 'text-charcoal/60 hover:text-charcoal'
                }`}
              >
                {m === 'login' ? 'Войти' : 'Регистрация'}
              </button>
            ))}
          </div>

          {/* Role selector (только при регистрации) */}
          {mode === 'register' && (
            <div className="mb-6">
              <p className="font-golos text-xs text-muted-foreground uppercase tracking-[0.1em] mb-3">
                Тип аккаунта
              </p>
              <div className="space-y-2">
                {(Object.keys(roleLabels) as Role[]).map((r) => (
                  <button
                    key={r}
                    onClick={() => setRole(r)}
                    className={`w-full text-left p-3 border transition-all duration-200 ${
                      role === r
                        ? 'border-gold bg-gold-pale'
                        : 'border-border hover:border-gold/40'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-golos text-sm text-charcoal">{roleLabels[r]}</span>
                      {role === r && <Icon name="Check" size={13} className="text-gold" />}
                    </div>
                    <p className="font-golos text-[11px] text-muted-foreground mt-0.5">{roleDescriptions[r]}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Базовые поля регистрации */}
            {mode === 'register' && (
              <>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-golos text-[10px] uppercase tracking-[0.1em] text-muted-foreground block mb-1">
                      Имя *
                    </label>
                    <input
                      type="text"
                      required
                      value={form.first_name}
                      onChange={e => set('first_name', e.target.value)}
                      className="w-full border border-border bg-white px-3 py-2.5 font-golos text-sm text-charcoal focus:outline-none focus:border-gold"
                      placeholder="Анна"
                    />
                  </div>
                  <div>
                    <label className="font-golos text-[10px] uppercase tracking-[0.1em] text-muted-foreground block mb-1">
                      Фамилия
                    </label>
                    <input
                      type="text"
                      value={form.last_name}
                      onChange={e => set('last_name', e.target.value)}
                      className="w-full border border-border bg-white px-3 py-2.5 font-golos text-sm text-charcoal focus:outline-none focus:border-gold"
                      placeholder="Иванова"
                    />
                  </div>
                </div>

                {role === 'brand' && (
                  <div>
                    <label className="font-golos text-[10px] uppercase tracking-[0.1em] text-muted-foreground block mb-1">
                      Название бренда *
                    </label>
                    <input
                      type="text"
                      required
                      value={form.brand_name}
                      onChange={e => set('brand_name', e.target.value)}
                      className="w-full border border-border bg-white px-3 py-2.5 font-golos text-sm text-charcoal focus:outline-none focus:border-gold"
                      placeholder="Pure Aura"
                    />
                  </div>
                )}

                {role === 'salon' && (
                  <div>
                    <label className="font-golos text-[10px] uppercase tracking-[0.1em] text-muted-foreground block mb-1">
                      Название салона / клиники *
                    </label>
                    <input
                      type="text"
                      required
                      value={form.salon_name}
                      onChange={e => set('salon_name', e.target.value)}
                      className="w-full border border-border bg-white px-3 py-2.5 font-golos text-sm text-charcoal focus:outline-none focus:border-gold"
                      placeholder="Beauty Studio"
                    />
                  </div>
                )}

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-golos text-[10px] uppercase tracking-[0.1em] text-muted-foreground block mb-1">
                      Телефон
                    </label>
                    <input
                      type="tel"
                      value={form.phone}
                      onChange={e => set('phone', e.target.value)}
                      className="w-full border border-border bg-white px-3 py-2.5 font-golos text-sm text-charcoal focus:outline-none focus:border-gold"
                      placeholder="+7 999 123 45 67"
                    />
                  </div>
                  <div>
                    <label className="font-golos text-[10px] uppercase tracking-[0.1em] text-muted-foreground block mb-1">
                      Город
                    </label>
                    <input
                      type="text"
                      value={form.city}
                      onChange={e => set('city', e.target.value)}
                      className="w-full border border-border bg-white px-3 py-2.5 font-golos text-sm text-charcoal focus:outline-none focus:border-gold"
                      placeholder="Москва"
                    />
                  </div>
                </div>
              </>
            )}

            {/* Email + Password */}
            <div>
              <label className="font-golos text-[10px] uppercase tracking-[0.1em] text-muted-foreground block mb-1">
                Email *
              </label>
              <input
                type="email"
                required
                value={form.email}
                onChange={e => set('email', e.target.value)}
                className="w-full border border-border bg-white px-3 py-2.5 font-golos text-sm text-charcoal focus:outline-none focus:border-gold"
                placeholder="email@example.com"
              />
            </div>
            <div>
              <label className="font-golos text-[10px] uppercase tracking-[0.1em] text-muted-foreground block mb-1">
                Пароль * {mode === 'register' && '(минимум 6 символов)'}
              </label>
              <input
                type="password"
                required
                value={form.password}
                onChange={e => set('password', e.target.value)}
                className="w-full border border-border bg-white px-3 py-2.5 font-golos text-sm text-charcoal focus:outline-none focus:border-gold"
                placeholder="••••••••"
              />
            </div>

            {error && (
              <div className="border border-destructive/30 bg-destructive/5 px-4 py-3 flex items-center gap-2">
                <Icon name="AlertCircle" size={14} className="text-destructive shrink-0" />
                <p className="font-golos text-xs text-destructive">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-charcoal text-ivory py-3.5 font-golos text-xs tracking-[0.15em] uppercase hover:bg-gold transition-colors duration-300 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Icon name="Loader2" size={14} className="animate-spin" />
                  Подождите...
                </>
              ) : mode === 'login' ? 'Войти' : 'Создать аккаунт'}
            </button>
          </form>

          <p className="font-golos text-[11px] text-muted-foreground text-center mt-4">
            {mode === 'login' ? 'Нет аккаунта? ' : 'Уже есть аккаунт? '}
            <button
              onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError(''); }}
              className="text-gold hover:underline"
            >
              {mode === 'login' ? 'Зарегистрироваться' : 'Войти'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
