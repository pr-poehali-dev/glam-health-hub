import { useState } from 'react';
import Icon from '@/components/ui/icon';

const categories = ['Все', 'Косметика', 'БАДы', 'Спортивное питание'];

const products = [
  {
    id: 1,
    name: 'Коллагеновый комплекс',
    brand: 'Pure Aura',
    category: 'БАДы',
    price: 4200,
    rating: 4.9,
    reviews: 342,
    badge: 'Хит продаж',
    emoji: '✨',
    desc: 'Морской коллаген типов I и III с витамином C и гиалуроновой кислотой',
  },
  {
    id: 2,
    name: 'Сыворотка с ретинолом',
    brand: 'Derma Luxe',
    category: 'Косметика',
    price: 6800,
    rating: 4.8,
    reviews: 218,
    badge: 'Новинка',
    emoji: '🌿',
    desc: 'Ночная сыворотка с инкапсулированным ретинолом 0.5%',
  },
  {
    id: 3,
    name: 'Протеин Whey Premium',
    brand: 'Vital Sport',
    category: 'Спортивное питание',
    price: 3900,
    rating: 4.7,
    reviews: 156,
    badge: null,
    emoji: '💪',
    desc: 'Концентрат сывороточного протеина, 28г белка на порцию',
  },
  {
    id: 4,
    name: 'Омега-3 Ultra',
    brand: 'Pure Aura',
    category: 'БАДы',
    price: 2600,
    rating: 5.0,
    reviews: 487,
    badge: 'Выбор экспертов',
    emoji: '🐟',
    desc: 'Рыбий жир высокой очистки, EPA/DHA 800/600 мг',
  },
  {
    id: 5,
    name: 'Увлажняющий крем-масло',
    brand: 'Botanica',
    category: 'Косметика',
    price: 5400,
    rating: 4.9,
    reviews: 203,
    badge: null,
    emoji: '🌸',
    desc: 'Питательный крем с маслом ши и экстрактом розы',
  },
  {
    id: 6,
    name: 'BCAA + Glutamine',
    brand: 'Vital Sport',
    category: 'Спортивное питание',
    price: 2100,
    rating: 4.6,
    reviews: 98,
    badge: null,
    emoji: '⚡',
    desc: 'Аминокислоты с разветвлённой цепью + глутамин для восстановления',
  },
];

export default function ShopSection() {
  const [activeCategory, setActiveCategory] = useState('Все');
  const [sort, setSort] = useState('popular');

  const filtered = products.filter(
    (p) => activeCategory === 'Все' || p.category === activeCategory
  );

  return (
    <section className="py-24 bg-ivory">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="mb-14">
          <p className="font-golos text-gold text-xs tracking-[0.3em] uppercase mb-3">Магазин</p>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
            <h2 className="font-cormorant font-light text-charcoal" style={{ fontSize: 'clamp(2.2rem, 4vw, 3.5rem)' }}>
              Отборные продукты<br />
              <em className="italic text-gold">для вашего здоровья</em>
            </h2>
            <div className="flex items-center gap-3">
              <span className="font-golos text-xs text-muted-foreground tracking-wider uppercase">Сортировать:</span>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="font-golos text-xs border border-border bg-transparent px-3 py-1.5 tracking-wide text-charcoal focus:outline-none focus:border-gold"
              >
                <option value="popular">По популярности</option>
                <option value="price-asc">Цена: по возрастанию</option>
                <option value="price-desc">Цена: по убыванию</option>
                <option value="rating">По рейтингу</option>
              </select>
            </div>
          </div>
        </div>

        <div className="gold-line mb-8" />

        {/* Category filter */}
        <div className="flex flex-wrap gap-2 mb-10">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`font-golos text-xs tracking-[0.12em] uppercase px-5 py-2 border transition-all duration-300 ${
                activeCategory === cat
                  ? 'bg-charcoal text-ivory border-charcoal'
                  : 'border-border text-charcoal/60 hover:border-charcoal hover:text-charcoal'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Product grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((product, i) => (
            <div
              key={product.id}
              className="premium-card bg-white border border-border group cursor-pointer"
              style={{ animationDelay: `${i * 0.08}s` }}
            >
              {/* Product image placeholder */}
              <div className="relative h-52 bg-gradient-to-br from-gold-pale to-ivory flex items-center justify-center overflow-hidden">
                <span style={{ fontSize: '4rem' }}>{product.emoji}</span>
                {product.badge && (
                  <span className="absolute top-3 left-3 bg-charcoal text-ivory font-golos text-[10px] tracking-[0.1em] uppercase px-2.5 py-1">
                    {product.badge}
                  </span>
                )}
                <button className="absolute top-3 right-3 w-8 h-8 border border-border bg-white/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:border-gold hover:text-gold">
                  <Icon name="Heart" size={14} />
                </button>
              </div>

              {/* Info */}
              <div className="p-5">
                <p className="font-golos text-[10px] tracking-[0.15em] uppercase text-muted-foreground mb-1">{product.brand}</p>
                <h3 className="font-cormorant text-xl text-charcoal mb-2">{product.name}</h3>
                <p className="font-golos text-xs text-muted-foreground leading-relaxed mb-4">{product.desc}</p>

                <div className="flex items-center gap-1 mb-4">
                  <Icon name="Star" size={11} className="text-gold fill-gold" />
                  <span className="font-golos text-xs text-charcoal font-medium">{product.rating}</span>
                  <span className="font-golos text-xs text-muted-foreground">({product.reviews})</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="font-cormorant text-2xl text-charcoal">
                    {product.price.toLocaleString('ru-RU')} ₽
                  </span>
                  <button className="flex items-center gap-2 bg-charcoal text-ivory px-4 py-2 font-golos text-xs tracking-[0.1em] uppercase hover:bg-gold transition-colors duration-300">
                    <Icon name="ShoppingCart" size={12} />
                    В корзину
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View all */}
        <div className="text-center mt-12">
          <button className="font-golos text-xs tracking-[0.2em] uppercase border border-charcoal px-10 py-3.5 text-charcoal hover:bg-charcoal hover:text-ivory transition-all duration-300">
            Смотреть весь каталог
            <Icon name="ArrowRight" size={13} className="inline ml-2" />
          </button>
        </div>
      </div>
    </section>
  );
}