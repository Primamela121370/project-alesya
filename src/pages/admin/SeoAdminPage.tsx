import { useState } from 'react';
import { ErrorState } from '../../components/common/ErrorState';
import { LoadingState } from '../../components/common/LoadingState';
import { useToast } from '../../components/common/ToastProvider';
import { useAsyncData } from '../../hooks/useAsyncData';
import { dataProvider } from '../../services/dataProvider';
import type { SeoSettings } from '../../types/content';
import { required } from '../../utils/validation';

export function SeoAdminPage() {
  const { showToast } = useToast();
  const { data, setData, loading, error } = useAsyncData(() => dataProvider.getSingleton<SeoSettings>('seo_settings'), []);
  const [validationError, setValidationError] = useState('');

  if (loading) return <LoadingState />;
  if (error) return <ErrorState message={error} />;
  if (!data) return null;

  return (
    <form
      className="space-y-4"
      onSubmit={async (event) => {
        event.preventDefault();
        const err = required(data.meta_title, 'Meta title');
        if (err) return setValidationError(err);
        const saved = (await dataProvider.upsert('seo_settings', data)) as SeoSettings;
        setData(saved);
        setValidationError('');
        showToast('SEO сохранено');
      }}
    >
      <h2 className="font-serif text-xl">SEO</h2>
      {[
        ['Meta title', 'meta_title'],
        ['Meta description', 'meta_description'],
        ['OG title', 'og_title'],
        ['OG description', 'og_description'],
        ['OG image', 'og_image_url'],
        ['Canonical', 'canonical_url'],
        ['Favicon', 'favicon_url'],
      ].map(([label, key]) => (
        <label key={key} className="block">
          <span className="mb-1 block text-sm text-[var(--color-muted)]">{label}</span>
          {key.includes('description') ? (
            <textarea rows={4} className="w-full rounded border border-[var(--color-border-mid)] px-3 py-2" value={data[key as keyof SeoSettings] as string} onChange={(e) => setData({ ...data, [key]: e.target.value })} />
          ) : (
            <input className="w-full rounded border border-[var(--color-border-mid)] px-3 py-2" value={data[key as keyof SeoSettings] as string} onChange={(e) => setData({ ...data, [key]: e.target.value })} />
          )}
        </label>
      ))}
      {validationError && <ErrorState message={validationError} />}
      <button className="rounded bg-[var(--color-accent)] px-4 py-2 text-sm text-white">Сохранить</button>
    </form>
  );
}
