import { useState } from 'react';
import { EmptyState } from '../../components/common/EmptyState';
import { ErrorState } from '../../components/common/ErrorState';
import { LoadingState } from '../../components/common/LoadingState';
import { useToast } from '../../components/common/ToastProvider';
import { useAsyncData } from '../../hooks/useAsyncData';
import { dataProvider } from '../../services/dataProvider';
import type { FaqItem } from '../../types/content';

const createItem = (): FaqItem => ({ id: 0, question: '', answer: '', category: '', sort_order: 1, is_published: true, created_at: new Date().toISOString() });

export function FaqAdminPage() {
  const { showToast } = useToast();
  const { data, setData, loading, error } = useAsyncData(() => dataProvider.list<FaqItem>('faq'), []);
  const [form, setForm] = useState<FaqItem>(createItem());

  if (loading) return <LoadingState />;
  if (error) return <ErrorState message={error} />;
  if (!data) return null;

  return (
    <div className="space-y-4">
      <h2 className="font-serif text-xl">FAQ</h2>
      <form className="grid gap-3 sm:grid-cols-2" onSubmit={async (e) => {
        e.preventDefault();
        const saved = (await dataProvider.upsert('faq', form)) as FaqItem;
        setData(form.id ? data.map((r) => (r.id === saved.id ? saved : r)) : [...data, saved]);
        setForm(createItem());
        showToast('Сохранено');
      }}>
        <Field label="Вопрос" value={form.question} onChange={(v) => setForm({ ...form, question: v })} />
        <Field label="Категория" value={form.category} onChange={(v) => setForm({ ...form, category: v })} />
        <Field label="Sort" value={String(form.sort_order)} onChange={(v) => setForm({ ...form, sort_order: Number(v) || 1 })} />
        <label className="flex items-center gap-2 text-sm pt-7"><input type="checkbox" checked={form.is_published} onChange={(e) => setForm({ ...form, is_published: e.target.checked })} /> Published</label>
        <label className="sm:col-span-2"><span className="mb-1 block text-sm text-[var(--color-muted)]">Ответ</span><textarea rows={4} className="w-full rounded border border-[var(--color-border-mid)] px-3 py-2" value={form.answer} onChange={(e) => setForm({ ...form, answer: e.target.value })} /></label>
        <div className="sm:col-span-2 flex gap-2"><button className="rounded bg-[var(--color-accent)] px-4 py-2 text-sm text-white">{form.id ? 'Обновить' : 'Добавить'}</button>{form.id > 0 && <button type="button" className="rounded border border-[var(--color-border-mid)] px-4 py-2 text-sm" onClick={() => setForm(createItem())}>Сбросить</button>}</div>
      </form>

      <div className="overflow-x-auto">
        {!data.length && <EmptyState text="Пока пусто" />}
        {!!data.length && <table className="min-w-full text-sm"><thead><tr className="border-b border-[var(--color-border)] text-left text-[var(--color-muted)]"><th className="py-2">Вопрос</th><th>Категория</th><th>Sort</th><th>Actions</th></tr></thead><tbody>{data.map((item) => <tr key={item.id} className="border-b border-[var(--color-border)]"><td className="py-2">{item.question}</td><td>{item.category}</td><td>{item.sort_order}</td><td className="space-x-2"><button type="button" className="text-[var(--color-accent)]" onClick={() => setForm(item)}>Edit</button><button type="button" className="text-red-600" onClick={async () => { if (!window.confirm('Удалить?')) return; await dataProvider.remove('faq', item.id); setData(data.filter((r) => r.id !== item.id)); showToast('Удалено'); }}>Delete</button></td></tr>)}</tbody></table>}
      </div>
    </div>
  );
}

function Field({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return <label><span className="mb-1 block text-sm text-[var(--color-muted)]">{label}</span><input className="w-full rounded border border-[var(--color-border-mid)] px-3 py-2" value={value} onChange={(e) => onChange(e.target.value)} /></label>;
}
