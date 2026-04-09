import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../features/admin/auth/AuthContext';
import { getAuthModeLabel } from '../../services/authService';

export function AdminLoginPage() {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('admin');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const from = (location.state as { from?: string } | null)?.from ?? '/admin';

  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--color-bg)] p-4">
      <form
        className="w-full max-w-md rounded border border-[var(--color-border)] bg-[var(--color-card)] p-6"
        onSubmit={async (event) => {
          event.preventDefault();
          setError('');
          setLoading(true);
          try {
            await signIn(email, password);
            navigate(from, { replace: true });
          } catch (err) {
            setError(err instanceof Error ? err.message : 'Не удалось выполнить вход');
          } finally {
            setLoading(false);
          }
        }}
      >
        <h1 className="font-serif text-2xl">Вход в админку</h1>
        <p className="mt-1 text-xs text-[var(--color-muted)]">Режим: {getAuthModeLabel()}</p>

        <div className="mt-5 space-y-4">
          <label className="block text-sm">
            <span className="mb-1 block text-[var(--color-muted)]">Email</span>
            <input className="w-full rounded border border-[var(--color-border-mid)] px-3 py-2" value={email} onChange={(e) => setEmail(e.target.value)} />
          </label>
          <label className="block text-sm">
            <span className="mb-1 block text-[var(--color-muted)]">Пароль</span>
            <input type="password" className="w-full rounded border border-[var(--color-border-mid)] px-3 py-2" value={password} onChange={(e) => setPassword(e.target.value)} />
          </label>
          {error && <p className="rounded bg-red-50 p-2 text-sm text-red-700">{error}</p>}
          <button disabled={loading} className="w-full rounded bg-[var(--color-accent)] px-4 py-2 text-sm text-white disabled:opacity-50">
            {loading ? 'Входим...' : 'Войти'}
          </button>
        </div>
      </form>
    </div>
  );
}
