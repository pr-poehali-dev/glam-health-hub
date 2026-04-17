import { useState, useEffect } from 'react';
import Icon from '@/components/ui/icon';
import { api } from '@/lib/api';

interface Program {
  id: number;
  title: string;
  description: string;
  duration: string;
  price: number | null;
  category: string;
  photo_url: string | null;
  status: string;
  rejection_reason: string | null;
  created_at: string;
}

const statusLabels: Record<string, { label: string; color: string }> = {
  pending: { label: 'На модерации', color: 'text-amber-600 bg-amber-50 border-amber-200' },
  approved: { label: 'Опубликована', color: 'text-emerald-600 bg-emerald-50 border-emerald-200' },
  rejected: { label: 'Отклонена', color: 'text-red-600 bg-red-50 border-red-200' },
};

export default function SalonCabinet() {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    title: '', description: '', duration: '', price: '', category: '',
  });
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState('');

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  useEffect(() => { loadPrograms(); }, []);

  const loadPrograms = async () => {
    setLoading(true);
    const res = await api.getMyPrograms();
    if (res.programs) setPrograms(res.programs);
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
      photo_b64 = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = () => resolve((reader.result as string).split(',')[1]);
        reader.readAsDataURL(photoFile);
      });
    }

    const res = await api.addProgram({
      ...form,
      price: form.price ? parseFloat(form.price) : null,
      photo_b64,
    });

    setSubmitting(false);

    if (res.error) {
      setError(res.error);
    } else {
      setSuccess('Программа отправлена на модерацию. После проверки она появится на платформе.');
      setForm({ title: '', description: '', duration: '', price: '', category: '' });
      setPhotoFile(null);
      setPhotoPreview('');
      setShowForm(false);
      loadPrograms();
    }
  };

  return (
    <div className="py-12 max-w-4xl mx-auto px-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="font-golos text-gold text-xs tracking-[0.3em] uppercase mb-1">Личный кабинет</p>
          <h2 className="font-cormorant text-3xl text-charcoal">Управление программами</h2>
        </div>
        <button
          onClick={() => { setShowForm(!showForm); setError(''); setSuccess(''); }}
          className="flex items-center gap-2 bg-charcoal text-ivory px-5 py-2.5 font-golos text-xs tracking-[0.12em] uppercase hover:bg-gold transition-colors duration-300"
        >
          <Icon name={showForm ? 'X' : 'Plus'} size={13} />
          {showForm ? 'Отмена' : 'Добавить программу'}
        </button>
      </div>

      {success && (
        <div className="border border-emerald-200 bg-emerald-50 px-5 py-3 flex items-center gap-3 mb-6">
          <Icon name="CheckCircle" size={16} className="text-emerald-600" />
          <p className="font-golos text-sm text-emerald-700">{success}</p>
        </div>
      )}

      {/* Форма добавления программы */}
      {showForm && (
        <form onSubmit={handleSubmit} className="border border-border bg-white p-8 mb-8">
          <h3 className="font-cormorant text-2xl text-charcoal mb-6">Новая программа</h3>

          <div className="mb-5">
            <label className="font-golos text-[10px] uppercase tracking-[0.1em] text-muted-foreground block mb-1.5">
              Название программы *
            </label>
            <input
              required value={form.title} onChange={e => set('title', e.target.value)}
              className="w-full border border-border px-3 py-2.5 font-golos text-sm focus:outline-none focus:border-gold"
              placeholder="Детокс-программа «Обновление»"
            />
          </div>

          <div className="mb-5">
            <label className="font-golos text-[10px] uppercase tracking-[0.1em] text-muted-foreground block mb-1.5">
              Описание программы
            </label>
            <textarea
              rows={4} value={form.description} onChange={e => set('description', e.target.value)}
              className="w-full border border-border px-3 py-2.5 font-golos text-sm focus:outline-none focus:border-gold resize-none"
              placeholder="Подробное описание программы: что входит, результаты, для кого подходит..."
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-5">
            <div>
              <label className="font-golos text-[10px] uppercase tracking-[0.1em] text-muted-foreground block mb-1.5">
                Продолжительность
              </label>
              <input
                value={form.duration} onChange={e => set('duration', e.target.value)}
                className="w-full border border-border px-3 py-2.5 font-golos text-sm focus:outline-none focus:border-gold"
                placeholder="21 день"
              />
            </div>
            <div>
              <label className="font-golos text-[10px] uppercase tracking-[0.1em] text-muted-foreground block mb-1.5">
                Стоимость (₽)
              </label>
              <input
                type="number" min="0" step="0.01"
                value={form.price} onChange={e => set('price', e.target.value)}
                className="w-full border border-border px-3 py-2.5 font-golos text-sm focus:outline-none focus:border-gold"
                placeholder="15000"
              />
            </div>
            <div>
              <label className="font-golos text-[10px] uppercase tracking-[0.1em] text-muted-foreground block mb-1.5">
                Категория
              </label>
              <input
                value={form.category} onChange={e => set('category', e.target.value)}
                className="w-full border border-border px-3 py-2.5 font-golos text-sm focus:outline-none focus:border-gold"
                placeholder="Детокс"
              />
            </div>
          </div>

          {/* Фото */}
          <div className="mb-6">
            <label className="font-golos text-[10px] uppercase tracking-[0.1em] text-muted-foreground block mb-1.5">
              Фото программы
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
              ⚠️ После отправки программа будет проверена администратором. Публикация — в течение 24 часов.
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

      {/* Список программ */}
      {loading ? (
        <div className="text-center py-12">
          <Icon name="Loader2" size={24} className="animate-spin text-gold mx-auto mb-3" />
          <p className="font-golos text-sm text-muted-foreground">Загрузка программ...</p>
        </div>
      ) : programs.length === 0 ? (
        <div className="text-center py-16 border border-dashed border-border">
          <Icon name="CalendarDays" size={32} className="text-muted-foreground mx-auto mb-4" />
          <p className="font-cormorant text-2xl text-charcoal mb-2">Нет программ</p>
          <p className="font-golos text-sm text-muted-foreground">Добавьте первую программу нажав кнопку выше</p>
        </div>
      ) : (
        <div className="space-y-3">
          {programs.map(p => (
            <div key={p.id} className="border border-border bg-white p-5 flex flex-col sm:flex-row gap-4">
              {p.photo_url && (
                <img src={p.photo_url} alt={p.title} className="w-16 h-16 object-cover border border-border shrink-0" />
              )}
              <div className="flex-1">
                <div className="flex items-start justify-between gap-3 mb-1">
                  <h4 className="font-cormorant text-xl text-charcoal">{p.title}</h4>
                  <span className={`font-golos text-[10px] tracking-wide uppercase px-2 py-0.5 border shrink-0 ${statusLabels[p.status]?.color}`}>
                    {statusLabels[p.status]?.label}
                  </span>
                </div>
                <p className="font-golos text-xs text-muted-foreground mb-2">{p.description}</p>
                <div className="flex items-center gap-4">
                  {p.duration && (
                    <span className="font-golos text-xs text-muted-foreground flex items-center gap-1">
                      <Icon name="Clock" size={11} /> {p.duration}
                    </span>
                  )}
                  {p.price && (
                    <span className="font-cormorant text-lg text-charcoal">{p.price.toLocaleString('ru-RU')} ₽</span>
                  )}
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
