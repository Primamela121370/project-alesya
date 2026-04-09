import { useState } from 'react';
import { ErrorState } from '../../components/common/ErrorState';
import { LoadingState } from '../../components/common/LoadingState';
import { useToast } from '../../components/common/ToastProvider';
import { useAsyncData } from '../../hooks/useAsyncData';
import { dataProvider } from '../../services/dataProvider';
import type { SiteSettings } from '../../types/content';
import { required } from '../../utils/validation';

export function ContactsAdminPage() {
  const { showToast } = useToast();
  const { data, setData, loading, error } = useAsyncData(() => dataProvider.getSingleton<SiteSettings>('site_settings'), []);
  const [validationError, setValidationError] = useState('');

  if (loading) return <LoadingState />;
  if (error) return <ErrorState message={error} />;
  if (!data) return null;

  return (
    <form
      className="space-y-4"
      onSubmit={async (event) => {
        event.preventDefault();
        const err = required(data.site_name, 'Site name');
        if (err) return setValidationError(err);
        const saved = (await dataProvider.upsert('site_settings', data)) as SiteSettings;
        setData(saved);
        setValidationError('');
        showToast('Контакты сохранены');
      }}
    >
      <h2 className="font-serif text-xl">Контакты / site settings</h2>
      {[
        ['Site name', 'site_name'],
        ['Footer text', 'footer_text'],
        ['Город', 'city'],
        ['Telegram', 'telegram_url'],
        ['WhatsApp', 'whatsapp_url'],
        ['Email', 'email'],
        ['Телефон', 'phone'],
      ].map(([label, key]) => (
        <label key={key} className="block">
          <span className="mb-1 block text-sm text-[var(--color-muted)]">{label}</span>
          <input className="w-full rounded border border-[var(--color-border-mid)] px-3 py-2" value={data[key as keyof SiteSettings] as string} onChange={(e) => setData({ ...data, [key]: e.target.value })} />
        </label>
      ))}
      {validationError && <ErrorState message={validationError} />}
      <button className="rounded bg-[var(--color-accent)] px-4 py-2 text-sm text-white">Сохранить</button>
    </form>
  );
}
