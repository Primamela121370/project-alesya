import { useState } from 'react';
import { EmptyState } from '../../components/common/EmptyState';
import { ErrorState } from '../../components/common/ErrorState';
import { LoadingState } from '../../components/common/LoadingState';
import { useToast } from '../../components/common/ToastProvider';
import { useAsyncData } from '../../hooks/useAsyncData';
import { dataProvider } from '../../services/dataProvider';
import type { Result } from '../../types/content';

const createResult = (): Result => ({
  id: 0,
  student_name: '',
  exam_type: 'ЕГЭ',
  score: '',
  short_text: '',
  duration: '',
  note: '',
  sort_order: 1,
  is_published: true,
  created_at: new Date().toISOString(),
});

export function ResultsAdminPage() {
  const { showToast } = useToast();
  const { data, setData, loading, error } = useAsyncData(() => dataProvider.list<Result>('results'), []);
  const [form, setForm] = useState<Result>(createResult());

  if (loading) return <LoadingState />;
  if (error) return <ErrorState message={error} />;
  if (!data) return null;

  return (
    <div className="space-y-4">
      <h2 className="font-serif text-xl">Результаты</h2>
      <form className="grid gap-3 sm:grid-cols-2" onSubmit={async (e) => {
        e.preventDefault();
        const saved = (await dataProvider.upsert('results', form)) as Result;
        setData(form.id ? data.map((r) => (r.id === saved.id ? saved : r)) : [...data, saved]);
        setForm(createResult());
        showToast('Сохранено');
      }}>
        <Field label="Имя" value={form.student_name} onChange={(v) => setForm({ ...form, student_name: v })} />
        <Field label="Экзамен" value={form.exam_type} onChange={(v) => setForm({ ...form, exam_type: v })} />
        <Field label="Балл" value={form.score} onChange={(v) => setForm({ ...form, score: v })} />
        <Field label="Срок" value={form.duration} onChange={(v) => setForm({ ...form, duration: v })} />
        <Field label="Подпись" value={form.note} onChange={(v) => setForm({ ...form, note: v })} />
        <Field label="Sort" value={String(form.sort_order)} onChange={(v) => setForm({ ...form, sort_order: Number(v) || 1 })} />
        <label className="sm:col-span-2"><span className="mb-1 block text-sm text-[var(--color-muted)]">Описание</span><textarea rows={3} className="w-full rounded border border-[var(--color-border-mid)] px-3 py-2" value={form.short_text} onChange={(e) => setForm({ ...form, short_text: e.target.value })} /></label>
        <label className="sm:col-span-2 flex items-center gap-2 text-sm"><input type="checkbox" checked={form.is_published} onChange={(e) => setForm({ ...form, is_published: e.target.checked })} /> Published</label>
        <div className="sm:col-span-2 flex gap-2"><button className="rounded bg-[var(--color-accent)] px-4 py-2 text-sm text-white">{form.id ? 'Обновить' : 'Добавить'}</button>{form.id > 0 && <button type="button" className="rounded border border-[var(--color-border-mid)] px-4 py-2 text-sm" onClick={() => setForm(createResult())}>Сбросить</button>}</div>
      </form>

      <div className="overflow-x-auto">
        {!data.length && <EmptyState text="Пока пусто" />}
        {!!data.length && <table className="min-w-full text-sm"><thead><tr className="border-b border-[var(--color-border)] text-left text-[var(--color-muted)]"><th className="py-2">Имя</th><th>Экзамен</th><th>Балл</th><th>Actions</th></tr></thead><tbody>{data.map((item) => <tr key={item.id} className="border-b border-[var(--color-border)]"><td className="py-2">{item.student_name}</td><td>{item.exam_type}</td><td>{item.score}</td><td className="space-x-2"><button type="button" className="text-[var(--color-accent)]" onClick={() => setForm(item)}>Edit</button><button type="button" className="text-red-600" onClick={async () => { if (!window.confirm('Удалить?')) return; await dataProvider.remove('results', item.id); setData(data.filter((r) => r.id !== item.id)); showToast('Удалено'); }}>Delete</button></td></tr>)}</tbody></table>}
      </div>
    </div>
  );
}

function Field({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return <label><span className="mb-1 block text-sm text-[var(--color-muted)]">{label}</span><input className="w-full rounded border border-[var(--color-border-mid)] px-3 py-2" value={value} onChange={(e) => onChange(e.target.value)} /></label>;
}
