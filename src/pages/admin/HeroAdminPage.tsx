import { useState } from 'react';
import { ErrorState } from '../../components/common/ErrorState';
import { LoadingState } from '../../components/common/LoadingState';
import { useToast } from '../../components/common/ToastProvider';
import { useAsyncData } from '../../hooks/useAsyncData';
import { dataProvider } from '../../services/dataProvider';
import type { HeroContent } from '../../types/content';
import { required } from '../../utils/validation';

export function HeroAdminPage() {
  const { showToast } = useToast();
  const { data, setData, loading, error } = useAsyncData(() => dataProvider.getSingleton<HeroContent>('hero_content'), []);
  const [validationError, setValidationError] = useState('');

  if (loading) return <LoadingState />;
  if (error) return <ErrorState message={error} />;
  if (!data) return null;

  return (
    <form
      className="space-y-4"
      onSubmit={async (event) => {
        event.preventDefault();
        const err = required(data.title, 'Заголовок');
        if (err) return setValidationError(err);
        const saved = (await dataProvider.upsert('hero_content', data)) as HeroContent;
        setData(saved);
        setValidationError('');
        showToast('Hero сохранен');
      }}
    >
      <h2 className="font-serif text-xl">Hero блок</h2>
      <Field label="Eyebrow" value={data.eyebrow} onChange={(value) => setData({ ...data, eyebrow: value })} />
      <Field label="Заголовок" value={data.title} onChange={(value) => setData({ ...data, title: value })} />
      <Area label="Подзаголовок" value={data.subtitle} onChange={(value) => setData({ ...data, subtitle: value })} />
      <Field label="Кнопка 1 - текст" value={data.primary_button_text} onChange={(value) => setData({ ...data, primary_button_text: value })} />
      <Field label="Кнопка 1 - ссылка" value={data.primary_button_url} onChange={(value) => setData({ ...data, primary_button_url: value })} />
      <Field label="Кнопка 2 - текст" value={data.secondary_button_text} onChange={(value) => setData({ ...data, secondary_button_text: value })} />
      <Field label="Кнопка 2 - ссылка" value={data.secondary_button_url} onChange={(value) => setData({ ...data, secondary_button_url: value })} />
      <Area label="Цитата" value={data.quote_text} onChange={(value) => setData({ ...data, quote_text: value })} />
      <Field label="Автор цитаты" value={data.quote_author} onChange={(value) => setData({ ...data, quote_author: value })} />
      {validationError && <ErrorState message={validationError} />}
      <button className="rounded bg-[var(--color-accent)] px-4 py-2 text-sm text-white">Сохранить</button>
    </form>
  );
}

function Field({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return <label className="block"><span className="mb-1 block text-sm text-[var(--color-muted)]">{label}</span><input className="w-full rounded border border-[var(--color-border-mid)] px-3 py-2" value={value} onChange={(e) => onChange(e.target.value)} /></label>;
}

function Area({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return <label className="block"><span className="mb-1 block text-sm text-[var(--color-muted)]">{label}</span><textarea rows={4} className="w-full rounded border border-[var(--color-border-mid)] px-3 py-2" value={value} onChange={(e) => onChange(e.target.value)} /></label>;
}
