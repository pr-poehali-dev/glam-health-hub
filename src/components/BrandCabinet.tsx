import { useState, useEffect } from 'react';
import Icon from '@/components/ui/icon';
import { api } from '@/lib/api';

interface Product {
  id: number;
  sku: string;
  name: string;
  description: string;
  price: number;
  category: string;
  photo_url: string | null;
  stock: number;
  status: string;
  rejection_reason: string | null;
  created_at: string;
}

const categoryOptions = [
  { value: 'cosmetics', label: 'Косметика' },
  { value: 'supplements', label: 'БАДы' },
  { value: 'sports', label: 'Спортивное питание' },
];

const statusLabels: Record<string, { label: string; color: string }> = {
  pending: { label: 'На модерации', color: 'text-amber-600 bg-amber-50 border-amber-200' },
  approved: { label: 'Опубликован', color: 'text-emerald-600 bg-emerald-50 border-emerald-200' },
  rejected: { label: 'Отклонён', color: 'text-red-600 bg-red-50 border-red-200' },
};

export default function BrandCabinet() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    sku: '', name: '', description: '', price: '', category: 'cosmetics', stock: '0',
  });
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState('');

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    setLoading(true);
    const res = await api.getMyProducts();
    if (res.products) setProducts(res.products);
    setLoading(false);
  };

  const handlePhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPhotoFile(file);
    const reader = new FileReader();
    reader.onload = () => setPhotoPreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); setSuccess('');
    setSubmitting(true);

    let photo_b64 = '';
    if (photoFile) {
      const reader = new FileReader();
      photo_b64 = await new Promise((resolve) => {
        reader.onload = () => {
          const result = (reader.result as string).split(',')[1];
          resolve(result);
        };
        reader.readAsDataURL(photoFile);
      });
    }

    const res = await api.addProduct({
      ...form,
      price: parseFloat(form.price),
      stock: parseInt(form.stock),
      photo_b64,
    });

    setSubmitting(false);

    if (res.error) {
      setError(res.error);
    } else {
      setSuccess('Товар отправлен на модерацию. После проверки он появится в магазине.');
      setForm({ sku: '', name: '', description: '', price: '', category: 'cosmetics', stock: '0' });
      setPhotoFile(null);
      setPhotoPreview('');
      setShowForm(false);
      loadProducts();
    }
  };

  return (
    <div className="py-12 max-w-4xl mx-auto px-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="font-golos text-gold text-xs tracking-[0.3em] uppercase mb-1">Личный кабинет</p>
          <h2 className="font-cormorant text-3xl text-charcoal">Управление товарами</h2>
        </div>
        <button
          onClick={() => { setShowForm(!showForm); setError(''); setSuccess(''); }}
          className="flex items-center gap-2 bg-charcoal text-ivory px-5 py-2.5 font-golos text-xs tracking-[0.12em] uppercase hover:bg-gold transition-colors duration-300"
        >
          <Icon name={showForm ? 'X' : 'Plus'} size={13} />
          {showForm ? 'Отмена' : 'Добавить товар'}
        </button>
      </div>

      {success && (
        <div className="border border-emerald-200 bg-emerald-50 px-5 py-3 flex items-center gap-3 mb-6">
          <Icon name="CheckCircle" size={16} className="text-emerald-600" />
          <p className="font-golos text-sm text-emerald-700">{success}</p>
        </div>
      )}

      {/* Форма добавления товара */}
      {showForm && (
        <form onSubmit={handleSubmit} className="border border-border bg-white p-8 mb-8">
          <h3 className="font-cormorant text-2xl text-charcoal mb-6">Новый товар</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
            <div>
              <label className="font-golos text-[10px] uppercase tracking-[0.1em] text-muted-foreground block mb-1.5">
                Артикул (SKU) *
              </label>
              <input
                required value={form.sku} onChange={e => set('sku', e.target.value)}
                className="w-full border border-border px-3 py-2.5 font-golos text-sm focus:outline-none focus:border-gold"
                placeholder="SKU-001"
              />
            </div>
            <div>
              <label className="font-golos text-[10px] uppercase tracking-[0.1em] text-muted-foreground block mb-1.5">
                Категория *
              </label>
              <select
                value={form.category} onChange={e => set('category', e.target.value)}
                className="w-full border border-border px-3 py-2.5 font-golos text-sm focus:outline-none focus:border-gold bg-white"
              >
                {categoryOptions.map(c => (
                  <option key={c.value} value={c.value}>{c.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="mb-5">
            <label className="font-golos text-[10px] uppercase tracking-[0.1em] text-muted-foreground block mb-1.5">
              Название товара *
            </label>
            <input
              required value={form.name} onChange={e => set('name', e.target.value)}
              className="w-full border border-border px-3 py-2.5 font-golos text-sm focus:outline-none focus:border-gold"
              placeholder="Коллагеновый комплекс Premium"
            />
          </div>

          <div className="mb-5">
            <label className="font-golos text-[10px] uppercase tracking-[0.1em] text-muted-foreground block mb-1.5">
              Описание
            </label>
            <textarea
              rows={3} value={form.description} onChange={e => set('description', e.target.value)}
              className="w-full border border-border px-3 py-2.5 font-golos text-sm focus:outline-none focus:border-gold resize-none"
              placeholder="Состав, особенности, способ применения..."
            />
          </div>

          <div className="grid grid-cols-2 gap-5 mb-5">
            <div>
              <label className="font-golos text-[10px] uppercase tracking-[0.1em] text-muted-foreground block mb-1.5">
                Цена (₽) *
              </label>
              <input
                required type="number" min="0" step="0.01"
                value={form.price} onChange={e => set('price', e.target.value)}
                className="w-full border border-border px-3 py-2.5 font-golos text-sm focus:outline-none focus:border-gold"
                placeholder="2500"
              />
            </div>
            <div>
              <label className="font-golos text-[10px] uppercase tracking-[0.1em] text-muted-foreground block mb-1.5">
                Количество на складе
              </label>
              <input
                type="number" min="0"
                value={form.stock} onChange={e => set('stock', e.target.value)}
                className="w-full border border-border px-3 py-2.5 font-golos text-sm focus:outline-none focus:border-gold"
                placeholder="100"
              />
            </div>
          </div>

          {/* Фото */}
          <div className="mb-6">
            <label className="font-golos text-[10px] uppercase tracking-[0.1em] text-muted-foreground block mb-1.5">
              Фото товара
            </label>
            <div className="flex items-center gap-4">
              {photoPreview && (
                <img src={photoPreview} alt="preview" className="w-16 h-16 object-cover border border-border" />
              )}
              <label className="flex items-center gap-2 border border-dashed border-border px-4 py-3 cursor-pointer hover:border-gold transition-colors duration-200">
                <Icon name="Upload" size={14} className="text-muted-foreground" />
                <span className="font-golos text-xs text-muted-foreground">
                  {photoFile ? photoFile.name : 'Выбрать фото (JPG, PNG)'}
                </span>
                <input type="file" accept="image/*" onChange={handlePhoto} className="hidden" />
              </label>
            </div>
          </div>

          {error && (
            <div className="border border-destructive/30 bg-destructive/5 px-4 py-3 flex items-center gap-2 mb-4">
              <Icon name="AlertCircle" size={14} className="text-destructive" />
              <p className="font-golos text-xs text-destructive">{error}</p>
            </div>
          )}

          <div className="border border-gold/30 bg-gold-pale px-4 py-3 mb-5">
            <p className="font-golos text-xs text-charcoal/70">
              ⚠️ После отправки товар будет проверен администратором. Публикация — в течение 24 часов.
            </p>
          </div>

          <button
            type="submit" disabled={submitting}
            className="bg-gold text-ivory px-8 py-3 font-golos text-xs tracking-[0.15em] uppercase hover:bg-gold-light transition-colors duration-300 disabled:opacity-50 flex items-center gap-2"
          >
            {submitting && <Icon name="Loader2" size={13} className="animate-spin" />}
            Отправить на модерацию
          </button>
        </form>
      )}

      {/* Список товаров */}
      {loading ? (
        <div className="text-center py-12">
          <Icon name="Loader2" size={24} className="animate-spin text-gold mx-auto mb-3" />
          <p className="font-golos text-sm text-muted-foreground">Загрузка товаров...</p>
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-16 border border-dashed border-border">
          <Icon name="Package" size={32} className="text-muted-foreground mx-auto mb-4" />
          <p className="font-cormorant text-2xl text-charcoal mb-2">Нет товаров</p>
          <p className="font-golos text-sm text-muted-foreground">Добавьте первый товар нажав кнопку выше</p>
        </div>
      ) : (
        <div className="space-y-3">
          {products.map(p => (
            <div key={p.id} className="border border-border bg-white p-5 flex flex-col sm:flex-row gap-4">
              {p.photo_url && (
                <img src={p.photo_url} alt={p.name} className="w-16 h-16 object-cover border border-border shrink-0" />
              )}
              <div className="flex-1">
                <div className="flex items-start justify-between gap-3 mb-1">
                  <h4 className="font-cormorant text-xl text-charcoal">{p.name}</h4>
                  <span className={`font-golos text-[10px] tracking-wide uppercase px-2 py-0.5 border shrink-0 ${statusLabels[p.status]?.color}`}>
                    {statusLabels[p.status]?.label}
                  </span>
                </div>
                <p className="font-golos text-[11px] text-muted-foreground mb-2">
                  SKU: {p.sku} · {categoryOptions.find(c => c.value === p.category)?.label}
                </p>
                <div className="flex items-center gap-4">
                  <span className="font-cormorant text-lg text-charcoal">{p.price.toLocaleString('ru-RU')} ₽</span>
                  <span className="font-golos text-xs text-muted-foreground">Склад: {p.stock} шт.</span>
                </div>
                {p.status === 'rejected' && p.rejection_reason && (
                  <p className="font-golos text-xs text-red-600 mt-2">
                    Причина отказа: {p.rejection_reason}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
