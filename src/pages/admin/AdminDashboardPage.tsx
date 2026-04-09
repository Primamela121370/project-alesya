import { Link } from 'react-router-dom';
import { ErrorState } from '../../components/common/ErrorState';
import { LoadingState } from '../../components/common/LoadingState';
import { useAsyncData } from '../../hooks/useAsyncData';
import { dataProvider } from '../../services/dataProvider';
import { formatDateTime } from '../../utils/date';

export function AdminDashboardPage() {
  const { data, loading, error } = useAsyncData(() => dataProvider.getDashboardData(), []);

  if (loading) return <LoadingState />;
  if (error) return <ErrorState message={error} />;
  if (!data) return null;

  return (
    <div className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-3">
        <Card title="Заявки" value={data.leadsCount} />
        <Card title="Отзывы" value={data.testimonialsCount} />
        <Card title="Результаты" value={data.resultsCount} />
      </div>

      <div className="rounded border border-[var(--color-border)] p-4">
        <h2 className="font-serif text-xl">Быстрые переходы</h2>
        <div className="mt-3 flex flex-wrap gap-2 text-sm">
          {[
            ['/admin/hero', 'Hero'],
            ['/admin/sections', 'Секции'],
            ['/admin/results', 'Результаты'],
            ['/admin/testimonials', 'Отзывы'],
            ['/admin/leads', 'Заявки'],
          ].map(([to, label]) => (
            <Link key={to} to={to} className="rounded border border-[var(--color-border-mid)] px-3 py-2 hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]">
              {label}
            </Link>
          ))}
        </div>
      </div>

      <div className="rounded border border-[var(--color-border)] p-4">
        <h2 className="font-serif text-xl">Последние заявки</h2>
        <div className="mt-3 overflow-x-auto">
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
              {data.recentLeads.map((lead) => (
                <tr key={lead.id} className="border-b border-[var(--color-border)]">
                  <td className="py-2">{formatDateTime(lead.created_at)}</td>
                  <td>{lead.name}</td>
                  <td>{lead.contact}</td>
                  <td>{lead.goal}</td>
                  <td>{lead.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function Card({ title, value }: { title: string; value: number }) {
  return (
    <div className="rounded border border-[var(--color-border)] p-4">
      <p className="text-sm text-[var(--color-muted)]">{title}</p>
      <p className="mt-1 font-serif text-3xl">{value}</p>
    </div>
  );
}
