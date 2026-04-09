import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../features/admin/auth/AuthContext';

const links = [
  { to: '/admin', label: 'Дашборд', end: true },
  { to: '/admin/hero', label: 'Hero' },
  { to: '/admin/sections', label: 'Секции' },
  { to: '/admin/results', label: 'Результаты' },
  { to: '/admin/testimonials', label: 'Отзывы' },
  { to: '/admin/faq', label: 'FAQ' },
  { to: '/admin/contacts', label: 'Контакты' },
  { to: '/admin/seo', label: 'SEO' },
  { to: '/admin/leads', label: 'Заявки' },
];

export function AdminLayout() {
  const navigate = useNavigate();
  const { signOut, user } = useAuth();

  return (
    <div className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)]">
      <div className="mx-auto grid max-w-[1280px] grid-cols-1 gap-4 p-4 lg:grid-cols-[240px_1fr]">
        <aside className="rounded border border-[var(--color-border)] bg-[var(--color-card)] p-4 lg:min-h-[calc(100vh-2rem)]">
          <p className="font-serif text-lg">CMS AleSya</p>
          <p className="mt-1 text-xs text-[var(--color-muted)]">{user?.email}</p>
          <nav className="mt-6 space-y-1">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.end}
                className={({ isActive }) =>
                  `block rounded px-3 py-2 text-sm transition ${isActive ? 'bg-[var(--color-accent)] text-white' : 'text-[var(--color-muted)] hover:bg-[var(--color-surface)] hover:text-[var(--color-text)]'}`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>
        </aside>

        <main className="rounded border border-[var(--color-border)] bg-[var(--color-card)] p-4 sm:p-6">
          <header className="mb-6 flex flex-wrap items-center justify-between gap-3 border-b border-[var(--color-border)] pb-4">
            <div>
              <h1 className="font-serif text-2xl">Админ-панель</h1>
              <p className="text-sm text-[var(--color-muted)]">Управление контентом сайта</p>
            </div>
            <button
              type="button"
              onClick={async () => {
                await signOut();
                navigate('/admin/login');
              }}
              className="rounded border border-[var(--color-border-mid)] px-3 py-2 text-sm text-[var(--color-muted)] transition hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]"
            >
              Выйти
            </button>
          </header>

          <Outlet />
        </main>
      </div>
    </div>
  );
}
