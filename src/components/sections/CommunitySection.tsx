import { useState } from 'react';
import Icon from '@/components/ui/icon';

const communities = [
  {
    id: 1,
    name: 'Детокс-клуб',
    members: 3420,
    activity: 'Очень активно',
    icon: '🌿',
    color: 'bg-emerald-50 border-emerald-200',
    locked: false,
    desc: 'Делимся рецептами, результатами и поддерживаем друг друга в детокс-путешествии',
  },
  {
    id: 2,
    name: 'Ментальное здоровье',
    members: 2180,
    activity: 'Активно',
    icon: '🧘',
    color: 'bg-violet-50 border-violet-200',
    locked: false,
    desc: 'Практики осознанности, истории трансформации, поддержка сообщества',
  },
  {
    id: 3,
    name: 'Элитный клуб',
    members: 340,
    activity: 'Закрытое',
    icon: '👑',
    color: 'bg-gold-pale border-gold/30',
    locked: true,
    desc: 'Закрытое сообщество для подписчиков Premium. Личный доступ к экспертам.',
  },
  {
    id: 4,
    name: 'Спорт & Питание',
    members: 5670,
    activity: 'Очень активно',
    icon: '💪',
    color: 'bg-rose-50 border-rose-200',
    locked: false,
    desc: 'Тренировочные планы, рецепты спортивного питания, мотивация и достижения',
  },
];

const challenges = [
  {
    id: 1,
    title: 'Марафон воды',
    desc: '30 дней пить 2л воды ежедневно',
    participants: 1240,
    daysLeft: 14,
    reward: 500,
    joined: true,
  },
  {
    id: 2,
    title: 'Без сахара: 21 день',
    desc: 'Исключите добавленный сахар из рациона',
    participants: 870,
    daysLeft: 7,
    reward: 750,
    joined: false,
  },
  {
    id: 3,
    title: '10 000 шагов',
    desc: 'Ежедневная прогулка в течение месяца',
    participants: 2340,
    daysLeft: 21,
    reward: 300,
    joined: true,
  },
];

const loyaltyTiers = [
  { name: 'Начинающий', points: '0–999', perks: 'Базовые рекомендации', color: 'text-muted-foreground' },
  { name: 'Осознанный', points: '1 000–4 999', perks: '5% скидка в магазине', color: 'text-emerald-600' },
  { name: 'Эксперт', points: '5 000–14 999', perks: '10% скидка + приоритет в записи', color: 'text-blue-600' },
  { name: 'Мастер', points: '15 000+', perks: 'Личный куратор + закрытые ивенты', color: 'text-gold', special: true },
];

export default function CommunitySection() {
  const [userPoints] = useState(3750);
  const [joinedCommunities, setJoinedCommunities] = useState<number[]>([1, 2]);
  const [joinedChallenges, setJoinedChallenges] = useState<number[]>([1, 3]);

  const toggleCommunity = (id: number) => {
    setJoinedCommunities(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const toggleChallenge = (id: number) => {
    setJoinedChallenges(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="mb-14 text-center">
          <p className="font-golos text-gold text-xs tracking-[0.3em] uppercase mb-3">Сообщество</p>
          <h2 className="font-cormorant font-light text-charcoal mb-4" style={{ fontSize: 'clamp(2.2rem, 4vw, 3.5rem)' }}>
            Сообщество единомышленников<br />
            <em className="italic text-gold">и система лояльности</em>
          </h2>
        </div>

        <div className="gold-line mb-14" />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Left: Communities + Challenges */}
          <div className="lg:col-span-2 space-y-10">
            {/* Communities */}
            <div>
              <h3 className="font-cormorant text-2xl text-charcoal mb-5">Закрытые сообщества</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {communities.map((c) => (
                  <div
                    key={c.id}
                    className={`border ${c.color} p-5 premium-card`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <span style={{ fontSize: '1.8rem' }}>{c.icon}</span>
                      {c.locked && (
                        <Icon name="Lock" size={14} className="text-gold" />
                      )}
                    </div>
                    <h4 className="font-cormorant text-xl text-charcoal mb-1">{c.name}</h4>
                    <p className="font-golos text-xs text-muted-foreground leading-relaxed mb-4">{c.desc}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <Icon name="Users" size={11} className="text-muted-foreground" />
                        <span className="font-golos text-xs text-muted-foreground">
                          {c.members.toLocaleString('ru-RU')}
                        </span>
                      </div>
                      {c.locked ? (
                        <button className="font-golos text-[10px] tracking-[0.1em] uppercase text-gold border border-gold px-3 py-1">
                          Premium
                        </button>
                      ) : (
                        <button
                          onClick={() => toggleCommunity(c.id)}
                          className={`font-golos text-[10px] tracking-[0.1em] uppercase px-3 py-1 border transition-all duration-200 ${
                            joinedCommunities.includes(c.id)
                              ? 'bg-charcoal text-ivory border-charcoal'
                              : 'border-charcoal text-charcoal hover:bg-charcoal hover:text-ivory'
                          }`}
                        >
                          {joinedCommunities.includes(c.id) ? 'Вступили' : 'Вступить'}
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Challenges */}
            <div>
              <h3 className="font-cormorant text-2xl text-charcoal mb-5">Активные челленджи</h3>
              <div className="space-y-3">
                {challenges.map((ch) => (
                  <div key={ch.id} className="border border-border p-5 flex flex-col sm:flex-row sm:items-center gap-4 premium-card">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-cormorant text-xl text-charcoal">{ch.title}</h4>
                        {joinedChallenges.includes(ch.id) && (
                          <span className="font-golos text-[10px] bg-gold text-ivory px-2 py-0.5 tracking-wide uppercase">
                            Участвую
                          </span>
                        )}
                      </div>
                      <p className="font-golos text-xs text-muted-foreground mb-3">{ch.desc}</p>
                      <div className="flex gap-4">
                        <div className="flex items-center gap-1">
                          <Icon name="Users" size={11} className="text-muted-foreground" />
                          <span className="font-golos text-xs text-muted-foreground">{ch.participants.toLocaleString('ru-RU')}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Icon name="Clock" size={11} className="text-muted-foreground" />
                          <span className="font-golos text-xs text-muted-foreground">Осталось {ch.daysLeft} дней</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Icon name="Award" size={11} className="text-gold" />
                          <span className="font-golos text-xs text-gold">+{ch.reward} баллов</span>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => toggleChallenge(ch.id)}
                      className={`shrink-0 font-golos text-xs tracking-[0.1em] uppercase px-6 py-2.5 border transition-all duration-300 ${
                        joinedChallenges.includes(ch.id)
                          ? 'bg-gold-pale border-gold/30 text-gold'
                          : 'border-charcoal text-charcoal hover:bg-charcoal hover:text-ivory'
                      }`}
                    >
                      {joinedChallenges.includes(ch.id) ? '✓ Участвую' : 'Присоединиться'}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Loyalty */}
          <div>
            <div className="bg-charcoal p-8 sticky top-24">
              <h3 className="font-cormorant text-2xl text-ivory mb-1">Система лояльности</h3>
              <p className="font-golos text-xs text-ivory/40 mb-6">Копите баллы — получайте привилегии</p>

              {/* Current balance */}
              <div className="border border-gold/30 bg-gold/10 p-5 mb-6">
                <div className="font-golos text-[10px] text-gold uppercase tracking-[0.2em] mb-1">Ваши баллы</div>
                <div className="stat-number text-5xl text-gold mb-1">{userPoints.toLocaleString('ru-RU')}</div>
                <div className="font-golos text-xs text-ivory/50">Статус: Осознанный</div>
                <div className="mt-3 h-1 bg-white/10 rounded-full">
                  <div
                    className="h-full bg-gold rounded-full"
                    style={{ width: `${(userPoints / 5000) * 100}%` }}
                  />
                </div>
                <div className="font-golos text-[10px] text-ivory/40 mt-1">
                  До статуса «Эксперт»: {(5000 - userPoints).toLocaleString('ru-RU')} баллов
                </div>
              </div>

              {/* Tiers */}
              <div className="space-y-3">
                {loyaltyTiers.map((tier) => (
                  <div
                    key={tier.name}
                    className={`border p-3.5 ${tier.special ? 'border-gold/40 bg-gold/10' : 'border-white/10'}`}
                  >
                    <div className={`font-cormorant text-lg ${tier.color}`}>{tier.name}</div>
                    <div className="font-golos text-[10px] text-ivory/30 mb-1">{tier.points} баллов</div>
                    <div className="font-golos text-xs text-ivory/60">{tier.perks}</div>
                  </div>
                ))}
              </div>

              {/* How to earn */}
              <div className="mt-6 pt-6 border-t border-white/10">
                <p className="font-golos text-xs text-ivory/40 uppercase tracking-wider mb-3">Как зарабатывать</p>
                {[
                  { action: 'Покупка в магазине', pts: '+1 балл / 10 ₽' },
                  { action: 'Консультация', pts: '+150 баллов' },
                  { action: 'Участие в программе', pts: '+500 баллов' },
                  { action: 'Челлендж выполнен', pts: '+до 750 баллов' },
                ].map((e) => (
                  <div key={e.action} className="flex justify-between py-1.5 border-b border-white/5">
                    <span className="font-golos text-xs text-ivory/60">{e.action}</span>
                    <span className="font-golos text-xs text-gold">{e.pts}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
