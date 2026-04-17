import { useState } from 'react';
import Icon from '@/components/ui/icon';

const programs = [
  {
    id: 1,
    title: 'Детокс-марафон',
    subtitle: '21 день обновления',
    duration: '21 день',
    level: 'Начинающий',
    participants: 2340,
    price: 8900,
    color: 'from-emerald-900 to-teal-800',
    accentColor: 'text-emerald-300',
    icon: '🌿',
    description: 'Мягкое очищение организма с персональным меню, медитациями и поддержкой куратора',
    features: ['Персональное меню на каждый день', 'Программа детокс-практик', 'Чек-листы и трекеры', 'Поддержка куратора 24/7'],
    progress: 68,
    enrolled: true,
  },
  {
    id: 2,
    title: 'Велнесс-трансформация',
    subtitle: '90 дней к лучшей версии себя',
    duration: '90 дней',
    level: 'Средний',
    participants: 1180,
    price: 24900,
    color: 'from-slate-900 to-charcoal',
    accentColor: 'text-gold-light',
    icon: '✨',
    description: 'Комплексная программа трансформации: питание, движение, ментальное здоровье и уход',
    features: ['Адаптивный план питания', 'Тренировочный план 5 дней/нед', 'Ментальные практики', 'Персональный куратор'],
    progress: 0,
    enrolled: false,
  },
  {
    id: 3,
    title: 'Стресс-менеджмент',
    subtitle: 'Антистресс за 14 дней',
    duration: '14 дней',
    level: 'Для всех',
    participants: 3450,
    price: 4900,
    color: 'from-violet-900 to-purple-800',
    accentColor: 'text-violet-300',
    icon: '🧘',
    description: 'Научно обоснованные техники снижения стресса и тревожности для современного ритма жизни',
    features: ['Дыхательные практики', 'Медитации аудио/видео', 'Дневник эмоций', 'Групповые эфиры'],
    progress: 0,
    enrolled: false,
  },
];

const weekMenu = [
  { day: 'Пн', breakfast: 'Овсянка с ягодами и семенами чиа', lunch: 'Салат с лососем и авокадо', dinner: 'Киноа с овощами и тофу' },
  { day: 'Вт', breakfast: 'Смузи-боул с манго и гранолой', lunch: 'Суп-крем из тыквы', dinner: 'Запечённая курица с брокколи' },
  { day: 'Ср', breakfast: 'Яйца пашот на шпинате', lunch: 'Боул с нутом и свежими овощами', dinner: 'Рыба на пару с зелёным салатом' },
  { day: 'Чт', breakfast: 'Греческий йогурт с мёдом и орехами', lunch: 'Лёгкий борщ без картофеля', dinner: 'Куриные котлеты с цветной капустой' },
  { day: 'Пт', breakfast: 'Блинчики из гречневой муки', lunch: 'Сэндвич с тунцом и зеленью', dinner: 'Ужин на выбор из меню детокса' },
];

export default function ProgramsSection() {
  const [activeProgram, setActiveProgram] = useState(programs[0]);
  const [showMenu, setShowMenu] = useState(false);

  return (
    <section className="py-24 bg-charcoal relative overflow-hidden">
      {/* Decorative */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gold/5 rounded-full -translate-y-1/2 translate-x-1/3 blur-3xl" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-gold/5 rounded-full translate-y-1/2 -translate-x-1/3 blur-2xl" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Header */}
        <div className="mb-14">
          <p className="font-golos text-gold text-xs tracking-[0.3em] uppercase mb-3">Программы</p>
          <div className="flex flex-col lg:flex-row justify-between gap-6">
            <h2 className="font-cormorant font-light text-ivory" style={{ fontSize: 'clamp(2.2rem, 4vw, 3.5rem)' }}>
              Детокс-марафоны<br />
              <em className="italic" style={{ color: 'hsl(var(--gold-light))' }}>и велнесс-программы</em>
            </h2>
            <p className="font-golos text-ivory/50 text-sm max-w-xs leading-relaxed self-end">
              Авторские программы от ведущих специалистов с отслеживанием прогресса в реальном времени
            </p>
          </div>
        </div>

        {/* Programs list */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-12">
          {programs.map((prog) => (
            <div
              key={prog.id}
              onClick={() => setActiveProgram(prog)}
              className={`relative cursor-pointer border transition-all duration-400 overflow-hidden ${
                activeProgram.id === prog.id
                  ? 'border-gold shadow-[0_0_0_1px_hsl(var(--gold))]'
                  : 'border-white/10 hover:border-white/30'
              }`}
            >
              <div className={`bg-gradient-to-br ${prog.color} p-6`}>
                <div className="flex items-start justify-between mb-4">
                  <span style={{ fontSize: '2.5rem' }}>{prog.icon}</span>
                  {prog.enrolled && (
                    <span className="font-golos text-[10px] tracking-[0.1em] uppercase bg-gold text-ivory px-2 py-0.5">
                      Активна
                    </span>
                  )}
                </div>
                <h3 className="font-cormorant text-2xl text-ivory mb-1">{prog.title}</h3>
                <p className={`font-golos text-xs ${prog.accentColor} tracking-wide mb-3`}>{prog.subtitle}</p>
                <p className="font-golos text-xs text-ivory/60 leading-relaxed mb-5">{prog.description}</p>

                <div className="flex items-center justify-between">
                  <div className="flex gap-4">
                    <div>
                      <div className="font-golos text-[10px] text-ivory/40 uppercase tracking-wider">Срок</div>
                      <div className="font-cormorant text-lg text-ivory">{prog.duration}</div>
                    </div>
                    <div>
                      <div className="font-golos text-[10px] text-ivory/40 uppercase tracking-wider">Участники</div>
                      <div className="font-cormorant text-lg text-ivory">{prog.participants.toLocaleString('ru-RU')}</div>
                    </div>
                  </div>
                  <div className="font-cormorant text-2xl text-ivory">
                    {prog.price.toLocaleString('ru-RU')} ₽
                  </div>
                </div>

                {prog.enrolled && prog.progress > 0 && (
                  <div className="mt-4">
                    <div className="flex justify-between font-golos text-[10px] text-ivory/50 mb-1.5">
                      <span>Прогресс</span>
                      <span>{prog.progress}%</span>
                    </div>
                    <div className="h-0.5 bg-white/10 rounded-full">
                      <div
                        className="h-full bg-gold rounded-full transition-all duration-700"
                        style={{ width: `${prog.progress}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Detail panel */}
        <div className="border border-white/10 bg-white/5 backdrop-blur-sm p-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Features */}
            <div className="flex-1">
              <h4 className="font-cormorant text-2xl text-ivory mb-5">Что входит в программу</h4>
              <ul className="space-y-3">
                {activeProgram.features.map((f) => (
                  <li key={f} className="flex items-center gap-3">
                    <div className="w-4 h-4 border border-gold flex items-center justify-center shrink-0">
                      <Icon name="Check" size={10} className="text-gold" />
                    </div>
                    <span className="font-golos text-sm text-ivory/80">{f}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Menu preview */}
            <div className="flex-1">
              <div className="flex items-center justify-between mb-5">
                <h4 className="font-cormorant text-2xl text-ivory">Меню-план на неделю</h4>
                <button
                  onClick={() => setShowMenu(!showMenu)}
                  className="font-golos text-xs text-gold tracking-wide flex items-center gap-1"
                >
                  {showMenu ? 'Скрыть' : 'Показать'}
                  <Icon name={showMenu ? 'ChevronUp' : 'ChevronDown'} size={12} />
                </button>
              </div>

              {showMenu ? (
                <div className="space-y-2">
                  {weekMenu.map((day) => (
                    <div key={day.day} className="border border-white/10 p-3">
                      <div className="font-golos text-xs text-gold uppercase tracking-wider mb-2">{day.day}</div>
                      <div className="space-y-1">
                        <p className="font-golos text-[11px] text-ivory/60"><span className="text-ivory/40">Завтрак:</span> {day.breakfast}</p>
                        <p className="font-golos text-[11px] text-ivory/60"><span className="text-ivory/40">Обед:</span> {day.lunch}</p>
                        <p className="font-golos text-[11px] text-ivory/60"><span className="text-ivory/40">Ужин:</span> {day.dinner}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="border border-white/10 p-4 text-center">
                  <span style={{ fontSize: '2rem' }}>🥗</span>
                  <p className="font-golos text-sm text-ivory/50 mt-2">Нажмите «Показать» для просмотра меню на 7 дней</p>
                </div>
              )}
            </div>
          </div>

          {/* CTA */}
          <div className="flex flex-col sm:flex-row gap-4 mt-8 pt-8 border-t border-white/10">
            <button className="flex-1 bg-gold text-ivory py-3.5 font-golos text-xs tracking-[0.15em] uppercase hover:bg-gold-light transition-colors duration-300 flex items-center justify-center gap-2">
              <Icon name="Play" size={14} />
              Присоединиться к программе
            </button>
            <button className="flex-1 border border-white/20 text-ivory/80 py-3.5 font-golos text-xs tracking-[0.15em] uppercase hover:border-gold hover:text-gold transition-all duration-300">
              Подробнее о программе
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
