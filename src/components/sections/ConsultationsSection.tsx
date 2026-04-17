import { useState } from 'react';
import Icon from '@/components/ui/icon';

const specialties = [
  { id: 'all', label: 'Все специалисты' },
  { id: 'nutritionist', label: 'Нутрициологи' },
  { id: 'psychologist', label: 'Психологи' },
  { id: 'dermatologist', label: 'Дерматологи' },
  { id: 'coach', label: 'Коучи' },
];

const experts = [
  {
    id: 1,
    name: 'Анна Морозова',
    title: 'Нутрициолог',
    specialty: 'nutritionist',
    experience: '12 лет опыта',
    rating: 5.0,
    reviews: 284,
    price: 5500,
    slots: ['09:00', '11:00', '14:00'],
    tags: ['Похудение', 'Спортивное питание', 'Детокс'],
    emoji: '👩‍⚕️',
    color: 'from-emerald-50 to-teal-50',
  },
  {
    id: 2,
    name: 'Дмитрий Климов',
    title: 'Психолог',
    specialty: 'psychologist',
    experience: '8 лет опыта',
    rating: 4.9,
    reviews: 176,
    price: 6000,
    slots: ['10:00', '15:00', '18:00'],
    tags: ['Тревожность', 'Выгорание', 'Отношения'],
    emoji: '🧠',
    color: 'from-violet-50 to-purple-50',
  },
  {
    id: 3,
    name: 'Елена Соколова',
    title: 'Дерматолог',
    specialty: 'dermatologist',
    experience: '15 лет опыта',
    rating: 4.9,
    reviews: 412,
    price: 7500,
    slots: ['08:30', '12:00', '16:30'],
    tags: ['Акне', 'Антивозрастная уход', 'Пигментация'],
    emoji: '🌿',
    color: 'from-rose-50 to-pink-50',
  },
  {
    id: 4,
    name: 'Артём Воронов',
    title: 'Велнесс-коуч',
    specialty: 'coach',
    experience: '10 лет опыта',
    rating: 4.8,
    reviews: 93,
    price: 4500,
    slots: ['09:30', '13:00', '17:00'],
    tags: ['Продуктивность', 'Привычки', 'Осознанность'],
    emoji: '⚡',
    color: 'from-amber-50 to-orange-50',
  },
];

export default function ConsultationsSection() {
  const [activeSpec, setActiveSpec] = useState('all');
  const [selectedSlots, setSelectedSlots] = useState<Record<number, string>>({});

  const filtered = experts.filter(
    (e) => activeSpec === 'all' || e.specialty === activeSpec
  );

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="mb-14 text-center">
          <p className="font-golos text-gold text-xs tracking-[0.3em] uppercase mb-3">Консультации</p>
          <h2 className="font-cormorant font-light text-charcoal mb-4" style={{ fontSize: 'clamp(2.2rem, 4vw, 3.5rem)' }}>
            Экспертная поддержка<br />
            <em className="italic text-gold">на каждом этапе</em>
          </h2>
          <p className="font-golos text-muted-foreground text-sm max-w-lg mx-auto leading-relaxed">
            Персональные консультации с проверенными специалистами. Видеозвонок, чат или очно.
          </p>
        </div>

        <div className="gold-line mb-10" />

        {/* Specialty filter */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {specialties.map((s) => (
            <button
              key={s.id}
              onClick={() => setActiveSpec(s.id)}
              className={`font-golos text-xs tracking-[0.1em] uppercase px-5 py-2 border transition-all duration-300 ${
                activeSpec === s.id
                  ? 'bg-charcoal text-ivory border-charcoal'
                  : 'border-border text-charcoal/60 hover:border-charcoal hover:text-charcoal'
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>

        {/* Experts grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filtered.map((expert) => (
            <div key={expert.id} className="premium-card border border-border bg-white overflow-hidden flex flex-col sm:flex-row">
              {/* Avatar area */}
              <div className={`bg-gradient-to-br ${expert.color} flex items-center justify-center sm:w-40 shrink-0 p-8 sm:p-0`}>
                <span style={{ fontSize: '3.5rem' }}>{expert.emoji}</span>
              </div>

              {/* Info */}
              <div className="p-6 flex-1">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-cormorant text-xl text-charcoal">{expert.name}</h3>
                    <p className="font-golos text-xs tracking-[0.12em] uppercase text-gold mt-0.5">{expert.title}</p>
                  </div>
                  <div className="text-right">
                    <div className="font-cormorant text-xl text-charcoal">{expert.price.toLocaleString('ru-RU')} ₽</div>
                    <div className="font-golos text-[10px] text-muted-foreground">/ 60 мин</div>
                  </div>
                </div>

                <p className="font-golos text-xs text-muted-foreground mb-3">{expert.experience}</p>

                <div className="flex items-center gap-1 mb-4">
                  <Icon name="Star" size={11} className="text-gold" />
                  <span className="font-golos text-xs font-medium text-charcoal">{expert.rating}</span>
                  <span className="font-golos text-xs text-muted-foreground">({expert.reviews} отзывов)</span>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {expert.tags.map((tag) => (
                    <span key={tag} className="font-golos text-[10px] bg-secondary text-charcoal/70 px-2 py-0.5 tracking-wide">
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Slots */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {expert.slots.map((slot) => (
                    <button
                      key={slot}
                      onClick={() => setSelectedSlots(prev => ({ ...prev, [expert.id]: slot }))}
                      className={`font-golos text-xs px-3 py-1.5 border transition-all duration-200 ${
                        selectedSlots[expert.id] === slot
                          ? 'bg-gold text-ivory border-gold'
                          : 'border-border text-charcoal/70 hover:border-gold hover:text-gold'
                      }`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>

                <button className="w-full bg-charcoal text-ivory py-2.5 font-golos text-xs tracking-[0.12em] uppercase hover:bg-gold transition-colors duration-300">
                  Записаться на консультацию
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Guarantee */}
        <div className="mt-14 border border-gold/30 bg-gold-pale p-8 flex flex-col sm:flex-row items-center gap-6">
          <Icon name="ShieldCheck" size={36} className="text-gold shrink-0" />
          <div>
            <h4 className="font-cormorant text-xl text-charcoal mb-1">Гарантия качества</h4>
            <p className="font-golos text-sm text-muted-foreground leading-relaxed">
              Все специалисты прошли строгую верификацию. Если консультация не оправдала ожиданий — вернём деньги в течение 24 часов.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
