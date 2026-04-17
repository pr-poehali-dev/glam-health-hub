import { useState } from 'react';
import Icon from '@/components/ui/icon';

const goals = [
  { id: 'weight', label: 'Снижение веса', icon: '⚖️' },
  { id: 'energy', label: 'Энергия и бодрость', icon: '⚡' },
  { id: 'skin', label: 'Здоровье кожи', icon: '✨' },
  { id: 'stress', label: 'Снижение стресса', icon: '🧘' },
  { id: 'immunity', label: 'Иммунитет', icon: '🛡️' },
  { id: 'sleep', label: 'Качество сна', icon: '🌙' },
];

const dailyPlan = [
  { time: '07:00', title: 'Пробуждение', desc: 'Стакан тёплой воды с лимоном', icon: 'Sunrise', category: 'morning' },
  { time: '07:30', title: 'Утренняя практика', desc: '15 мин медитации осознанности', icon: 'Brain', category: 'morning' },
  { time: '08:00', title: 'Завтрак', desc: 'Смузи-боул с протеином и ягодами', icon: 'UtensilsCrossed', category: 'nutrition' },
  { time: '12:30', title: 'Обед', desc: 'Боул с лососем, авокадо и киноа', icon: 'UtensilsCrossed', category: 'nutrition' },
  { time: '14:00', title: 'Водный баланс', desc: 'Выпейте 500 мл воды', icon: 'Droplets', category: 'hydration' },
  { time: '17:30', title: 'Тренировка', desc: 'Силовая тренировка 45 мин', icon: 'Dumbbell', category: 'fitness' },
  { time: '19:00', title: 'Ужин', desc: 'Запечённая грудка с брокколи', icon: 'UtensilsCrossed', category: 'nutrition' },
  { time: '21:30', title: 'Вечерняя рутина', desc: 'Уход за кожей + дыхательные упражнения', icon: 'Moon', category: 'evening' },
];

const categoryColors: Record<string, string> = {
  morning: 'text-amber-500 bg-amber-50',
  nutrition: 'text-emerald-600 bg-emerald-50',
  hydration: 'text-blue-500 bg-blue-50',
  fitness: 'text-red-500 bg-red-50',
  evening: 'text-violet-500 bg-violet-50',
};

const recommendations = [
  { icon: 'Package', title: 'Коллаген + Витамин C', desc: 'Утренний приём для синтеза коллагена', type: 'supplement' },
  { icon: 'Droplets', title: '2.4 л воды в день', desc: 'На основе вашего веса и активности', type: 'hydration' },
  { icon: 'Moon', title: 'Сон 22:30 — 06:30', desc: 'Оптимальное окно для вашего хронотипа', type: 'sleep' },
];

export default function OptimizerSection() {
  const [selectedGoals, setSelectedGoals] = useState<string[]>(['energy', 'skin']);
  const [completedItems, setCompletedItems] = useState<number[]>([0, 1, 2]);
  const [step, setStep] = useState<'goals' | 'plan'>('plan');

  const toggleGoal = (id: string) => {
    setSelectedGoals(prev =>
      prev.includes(id) ? prev.filter(g => g !== id) : [...prev, id]
    );
  };

  const toggleItem = (idx: number) => {
    setCompletedItems(prev =>
      prev.includes(idx) ? prev.filter(i => i !== idx) : [...prev, idx]
    );
  };

  const progress = Math.round((completedItems.length / dailyPlan.length) * 100);

  return (
    <section className="py-24 bg-ivory">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="mb-14">
          <p className="font-golos text-gold text-xs tracking-[0.3em] uppercase mb-3">Велнесс-оптимайзер</p>
          <div className="flex flex-col lg:flex-row justify-between gap-6">
            <h2 className="font-cormorant font-light text-charcoal" style={{ fontSize: 'clamp(2.2rem, 4vw, 3.5rem)' }}>
              Персональный план<br />
              <em className="italic text-gold">на каждый день</em>
            </h2>
            <div className="flex gap-2 self-end">
              {(['goals', 'plan'] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => setStep(s)}
                  className={`font-golos text-xs px-5 py-2 border tracking-[0.1em] uppercase transition-all duration-200 ${
                    step === s ? 'bg-charcoal text-ivory border-charcoal' : 'border-border text-charcoal/60 hover:border-charcoal'
                  }`}
                >
                  {s === 'goals' ? 'Мои цели' : 'План дня'}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="gold-line mb-12" />

        {step === 'goals' ? (
          /* Goals selection */
          <div>
            <p className="font-golos text-sm text-muted-foreground mb-6">
              Выберите цели, которые важны для вас прямо сейчас:
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-10">
              {goals.map((goal) => (
                <button
                  key={goal.id}
                  onClick={() => toggleGoal(goal.id)}
                  className={`p-5 border text-left transition-all duration-300 ${
                    selectedGoals.includes(goal.id)
                      ? 'border-gold bg-gold-pale shadow-[0_4px_16px_rgba(180,140,60,0.15)]'
                      : 'border-border bg-white hover:border-gold/50'
                  }`}
                >
                  <span style={{ fontSize: '2rem' }} className="block mb-3">{goal.icon}</span>
                  <span className="font-golos text-sm text-charcoal">{goal.label}</span>
                  {selectedGoals.includes(goal.id) && (
                    <div className="mt-2 flex items-center gap-1 text-gold">
                      <Icon name="Check" size={12} />
                      <span className="font-golos text-[10px] tracking-wide">Выбрано</span>
                    </div>
                  )}
                </button>
              ))}
            </div>
            <button
              onClick={() => setStep('plan')}
              className="bg-gold text-ivory px-10 py-3.5 font-golos text-xs tracking-[0.15em] uppercase hover:bg-gold-light transition-colors duration-300 flex items-center gap-2"
            >
              <Icon name="Sparkles" size={14} />
              Создать персональный план
            </button>
          </div>
        ) : (
          /* Daily plan */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Timeline */}
            <div className="lg:col-span-2">
              {/* Progress */}
              <div className="bg-white border border-border p-5 mb-6">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h4 className="font-cormorant text-xl text-charcoal">Прогресс сегодня</h4>
                    <p className="font-golos text-xs text-muted-foreground mt-0.5">
                      {completedItems.length} из {dailyPlan.length} задач выполнено
                    </p>
                  </div>
                  <div className="stat-number text-5xl text-gold">{progress}%</div>
                </div>
                <div className="h-1.5 bg-secondary rounded-full">
                  <div
                    className="h-full bg-gold rounded-full transition-all duration-700"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>

              {/* Plan items */}
              <div className="space-y-2">
                {dailyPlan.map((item, idx) => (
                  <div
                    key={idx}
                    onClick={() => toggleItem(idx)}
                    className={`flex items-center gap-4 p-4 border cursor-pointer transition-all duration-200 ${
                      completedItems.includes(idx)
                        ? 'border-gold/30 bg-gold-pale'
                        : 'border-border bg-white hover:border-gold/30'
                    }`}
                  >
                    <div className="font-cormorant text-lg text-muted-foreground w-12 shrink-0">{item.time}</div>
                    <div className={`w-8 h-8 flex items-center justify-center shrink-0 ${categoryColors[item.category]}`}>
                      <Icon name={item.icon} fallback="Circle" size={14} />
                    </div>
                    <div className="flex-1">
                      <div className={`font-golos text-sm transition-all ${completedItems.includes(idx) ? 'line-through text-muted-foreground' : 'text-charcoal'}`}>
                        {item.title}
                      </div>
                      <div className="font-golos text-xs text-muted-foreground">{item.desc}</div>
                    </div>
                    <div className={`w-5 h-5 border flex items-center justify-center shrink-0 transition-all duration-200 ${
                      completedItems.includes(idx) ? 'bg-gold border-gold' : 'border-border'
                    }`}>
                      {completedItems.includes(idx) && <Icon name="Check" size={10} className="text-ivory" />}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Sidebar: recommendations */}
            <div className="space-y-4">
              <div className="bg-charcoal p-6">
                <h4 className="font-cormorant text-xl text-ivory mb-4">Рекомендации ИИ</h4>
                <p className="font-golos text-xs text-ivory/50 leading-relaxed mb-5">
                  На основе ваших целей: энергия и здоровье кожи
                </p>
                <div className="space-y-4">
                  {recommendations.map((rec) => (
                    <div key={rec.title} className="border border-white/10 p-4">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-gold/20 flex items-center justify-center shrink-0">
                          <Icon name={rec.icon} fallback="Circle" size={14} className="text-gold" />
                        </div>
                        <div>
                          <div className="font-golos text-sm text-ivory mb-0.5">{rec.title}</div>
                          <div className="font-golos text-[11px] text-ivory/50">{rec.desc}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Streak */}
              <div className="bg-white border border-border p-6">
                <h4 className="font-cormorant text-xl text-charcoal mb-1">Серия дней</h4>
                <div className="stat-number text-6xl text-gold mb-2">14</div>
                <p className="font-golos text-xs text-muted-foreground">дней подряд вы выполняете план 🔥</p>
                <div className="gold-line mt-4" />
              </div>

              {/* Next consultation */}
              <div className="bg-white border border-gold/30 p-5">
                <div className="flex items-center gap-2 mb-3">
                  <Icon name="Calendar" size={14} className="text-gold" />
                  <span className="font-golos text-xs tracking-[0.1em] uppercase text-gold">Ближайшая консультация</span>
                </div>
                <p className="font-cormorant text-lg text-charcoal">Анна Морозова</p>
                <p className="font-golos text-xs text-muted-foreground">Нутрициолог · Завтра, 11:00</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
