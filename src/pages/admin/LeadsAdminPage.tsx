import { useMemo, useState } from 'react';
import { EmptyState } from '../../components/common/EmptyState';
import { ErrorState } from '../../components/common/ErrorState';
import { LoadingState } from '../../components/common/LoadingState';
import { useToast } from '../../components/common/ToastProvider';
import { useAsyncData } from '../../hooks/useAsyncData';
import { dataProvider } from '../../services/dataProvider';
import type { Lead, LeadStatus } from '../../types/content';
import { formatDateTime } from '../../utils/date';

const statuses: LeadStatus[] = ['new', 'contacted', 'in_progress', 'closed'];

export function LeadsAdminPage() {
  const { showToast } = useToast();
  const { data, setData, loading, error } = useAsyncData(() => dataProvider.list<Lead>('leads'), []);
  const [filter, setFilter] = useState<LeadStatus | 'all'>('all');

  const filtered = useMemo(() => {
    if (!data) return [];
    if (filter === 'all') return data;
    return data.filter((lead) => lead.status === filter);
  }, [data, filter]);

  if (loading) return <LoadingState />;
  if (error) return <ErrorState message={error} />;
  if (!data) return null;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-serif text-xl">Заявки</h2>
        <label className="text-sm text-[var(--color-muted)]">
          Фильтр
          <select className="ml-2 rounded border border-[var(--color-border-mid)] px-2 py-1" value={filter} onChange={(e) => setFilter(e.target.value as LeadStatus | 'all')}>
            <option value="all">Все</option>
            {statuses.map((status) => <option key={status} value={status}>{status}</option>)}
          </select>
        </label>
      </div>

      {!filtered.length && <EmptyState text="Заявок пока нет" />}
      {!!filtered.length && (
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead>
              <tr className="border-b border-[var(--color-border)] text-[var(--color-muted)]">
                <th className="py-2">Дата</th>
                <th>Имя</th>
                <th>Контакт</th>
                <th>Цель</th>
                <th>Статус</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((lead) => (
                <tr key={lead.id} className="border-b border-[var(--color-border)]">
                  <td className="py-2">{formatDateTime(lead.created_at)}</td>
                  <td>{lead.name}</td>
                  <td>{lead.contact}</td>
                  <td>{lead.goal}</td>
                  <td>
                    <select
                      className="rounded border border-[var(--color-border-mid)] px-2 py-1"
                      value={lead.status}
                      onChange={async (e) => {
                        const status = e.target.value as LeadStatus;
                        await dataProvider.updateLeadStatus(lead.id, status);
                        setData(data.map((row) => (row.id === lead.id ? { ...row, status } : row)));
                        showToast('Статус обновлен');
                      }}
                    >
                      {statuses.map((status) => <option key={status} value={status}>{status}</option>)}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
