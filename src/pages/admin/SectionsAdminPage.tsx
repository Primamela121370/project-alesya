import { useMemo, useState } from 'react';
import { EmptyState } from '../../components/common/EmptyState';
import { ErrorState } from '../../components/common/ErrorState';
import { LoadingState } from '../../components/common/LoadingState';
import { useToast } from '../../components/common/ToastProvider';
import { useAsyncData } from '../../hooks/useAsyncData';
import { dataProvider } from '../../services/dataProvider';
import type { Section, SectionItem } from '../../types/content';

const createSection = (): Section => ({ id: 0, key: '', tag: '', title: '', description: '', type: 'cards', sort_order: 1, is_published: true, updated_at: new Date().toISOString() });
const createItem = (sectionId: number): SectionItem => ({ id: 0, section_id: sectionId, title: '', subtitle: '', text: '', value: '', label: '', image_url: '', sort_order: 1, is_published: true });

export function SectionsAdminPage() {
  const { showToast } = useToast();
  const { data, setData, loading, error } = useAsyncData(async () => {
    const [sections, items] = await Promise.all([
      dataProvider.list<Section>('sections'),
      dataProvider.list<SectionItem>('section_items'),
    ]);
    return { sections, items };
  }, []);

  const [selectedSectionId, setSelectedSectionId] = useState<number | null>(null);
  const [sectionForm, setSectionForm] = useState<Section>(createSection());
  const [itemForm, setItemForm] = useState<SectionItem | null>(null);

  const selectedItems = useMemo(() => {
    if (!data || !selectedSectionId) return [];
    return data.items.filter((row) => row.section_id === selectedSectionId);
  }, [data, selectedSectionId]);

  if (loading) return <LoadingState />;
  if (error) return <ErrorState message={error} />;
  if (!data) return null;

  return (
    <div className="space-y-6">
      <section className="rounded border border-[var(--color-border)] p-4">
        <h2 className="font-serif text-xl">Секции</h2>
        <form className="mt-4 grid gap-3 sm:grid-cols-2" onSubmit={async (e) => {
          e.preventDefault();
          const saved = (await dataProvider.upsert('sections', sectionForm)) as Section;
          const sections = sectionForm.id ? data.sections.map((row) => (row.id === saved.id ? saved : row)) : [...data.sections, saved];
          setData({ ...data, sections });
          setSectionForm(createSection());
          showToast('Секция сохранена');
        }}>
          <Field label="Key" value={sectionForm.key} onChange={(v) => setSectionForm({ ...sectionForm, key: v })} />
          <Field label="Tag" value={sectionForm.tag} onChange={(v) => setSectionForm({ ...sectionForm, tag: v })} />
          <Field label="Title" value={sectionForm.title} onChange={(v) => setSectionForm({ ...sectionForm, title: v })} />
          <Field label="Type" value={sectionForm.type} onChange={(v) => setSectionForm({ ...sectionForm, type: v })} />
          <Field label="Sort" value={String(sectionForm.sort_order)} onChange={(v) => setSectionForm({ ...sectionForm, sort_order: Number(v) || 1 })} />
          <label className="flex items-center gap-2 pt-7 text-sm"><input type="checkbox" checked={sectionForm.is_published} onChange={(e) => setSectionForm({ ...sectionForm, is_published: e.target.checked })} /> Published</label>
          <label className="sm:col-span-2"><span className="mb-1 block text-sm text-[var(--color-muted)]">Description</span><textarea rows={3} className="w-full rounded border border-[var(--color-border-mid)] px-3 py-2" value={sectionForm.description} onChange={(e) => setSectionForm({ ...sectionForm, description: e.target.value })} /></label>
          <div className="sm:col-span-2 flex gap-2"><button className="rounded bg-[var(--color-accent)] px-4 py-2 text-sm text-white">{sectionForm.id ? 'Обновить' : 'Добавить'} секцию</button>{sectionForm.id > 0 && <button type="button" className="rounded border border-[var(--color-border-mid)] px-4 py-2 text-sm" onClick={() => setSectionForm(createSection())}>Сбросить</button>}</div>
        </form>

        <div className="mt-4 overflow-x-auto">
          {!data.sections.length && <EmptyState text="Секций нет" />}
          {!!data.sections.length && <table className="min-w-full text-sm"><thead><tr className="border-b border-[var(--color-border)] text-left text-[var(--color-muted)]"><th className="py-2">Key</th><th>Title</th><th>Sort</th><th>Actions</th></tr></thead><tbody>{data.sections.map((section) => <tr key={section.id} className="border-b border-[var(--color-border)]"><td className="py-2">{section.key}</td><td>{section.title}</td><td>{section.sort_order}</td><td className="space-x-2"><button type="button" className="text-[var(--color-accent)]" onClick={() => { setSectionForm(section); setSelectedSectionId(section.id); }}>Edit</button><button type="button" className="text-[var(--color-muted)]" onClick={() => { setSelectedSectionId(section.id); setItemForm(createItem(section.id)); }}>Items</button><button type="button" className="text-red-600" onClick={async () => { if (!window.confirm('Удалить секцию?')) return; await dataProvider.remove('sections', section.id); setData({ sections: data.sections.filter((s) => s.id !== section.id), items: data.items.filter((i) => i.section_id !== section.id) }); if (selectedSectionId === section.id) setSelectedSectionId(null); showToast('Удалено'); }}>Delete</button></td></tr>)}</tbody></table>}
        </div>
      </section>

      <section className="rounded border border-[var(--color-border)] p-4">
        <h2 className="font-serif text-xl">Карточки секции</h2>
        {!selectedSectionId && <p className="mt-2 text-sm text-[var(--color-muted)]">Выберите секцию в таблице выше</p>}
        {selectedSectionId && (
          <>
            <form className="mt-4 grid gap-3 sm:grid-cols-2" onSubmit={async (e) => {
              e.preventDefault();
              if (!itemForm) return;
              const saved = (await dataProvider.upsert('section_items', itemForm)) as SectionItem;
              const items = itemForm.id ? data.items.map((row) => (row.id === saved.id ? saved : row)) : [...data.items, saved];
              setData({ ...data, items });
              setItemForm(createItem(selectedSectionId));
              showToast('Карточка сохранена');
            }}>
              <Field label="Title" value={itemForm?.title ?? ''} onChange={(v) => setItemForm({ ...(itemForm ?? createItem(selectedSectionId)), section_id: selectedSectionId, title: v })} />
              <Field label="Subtitle" value={itemForm?.subtitle ?? ''} onChange={(v) => setItemForm({ ...(itemForm ?? createItem(selectedSectionId)), section_id: selectedSectionId, subtitle: v })} />
              <Field label="Sort" value={String(itemForm?.sort_order ?? 1)} onChange={(v) => setItemForm({ ...(itemForm ?? createItem(selectedSectionId)), section_id: selectedSectionId, sort_order: Number(v) || 1 })} />
              <label className="flex items-center gap-2 pt-7 text-sm"><input type="checkbox" checked={itemForm?.is_published ?? true} onChange={(e) => setItemForm({ ...(itemForm ?? createItem(selectedSectionId)), section_id: selectedSectionId, is_published: e.target.checked })} /> Published</label>
              <label className="sm:col-span-2"><span className="mb-1 block text-sm text-[var(--color-muted)]">Text</span><textarea rows={3} className="w-full rounded border border-[var(--color-border-mid)] px-3 py-2" value={itemForm?.text ?? ''} onChange={(e) => setItemForm({ ...(itemForm ?? createItem(selectedSectionId)), section_id: selectedSectionId, text: e.target.value })} /></label>
              <div className="sm:col-span-2 flex gap-2"><button className="rounded bg-[var(--color-accent)] px-4 py-2 text-sm text-white">{itemForm?.id ? 'Обновить' : 'Добавить'} карточку</button><button type="button" className="rounded border border-[var(--color-border-mid)] px-4 py-2 text-sm" onClick={() => setItemForm(createItem(selectedSectionId))}>Сбросить</button></div>
            </form>

            <div className="mt-4 overflow-x-auto">
              {!selectedItems.length && <EmptyState text="Карточек нет" />}
              {!!selectedItems.length && <table className="min-w-full text-sm"><thead><tr className="border-b border-[var(--color-border)] text-left text-[var(--color-muted)]"><th className="py-2">Title</th><th>Sort</th><th>Actions</th></tr></thead><tbody>{selectedItems.map((item) => <tr key={item.id} className="border-b border-[var(--color-border)]"><td className="py-2">{item.title}</td><td>{item.sort_order}</td><td className="space-x-2"><button type="button" className="text-[var(--color-accent)]" onClick={() => setItemForm(item)}>Edit</button><button type="button" className="text-red-600" onClick={async () => { if (!window.confirm('Удалить карточку?')) return; await dataProvider.remove('section_items', item.id); setData({ ...data, items: data.items.filter((r) => r.id !== item.id) }); showToast('Удалено'); }}>Delete</button></td></tr>)}</tbody></table>}
            </div>
          </>
        )}
      </section>
    </div>
  );
}

function Field({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return <label><span className="mb-1 block text-sm text-[var(--color-muted)]">{label}</span><input className="w-full rounded border border-[var(--color-border-mid)] px-3 py-2" value={value} onChange={(e) => onChange(e.target.value)} /></label>;
}
