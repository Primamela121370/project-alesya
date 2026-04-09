import { isSupabaseConfigured, supabase } from '../lib/supabase';

const FALLBACK_KEY = 'alesya-admin-auth';
const fallbackEmail = import.meta.env.VITE_ADMIN_EMAIL ?? 'admin';
const fallbackPassword = import.meta.env.VITE_ADMIN_PASSWORD ?? '121370';

export interface AuthUser {
  email: string;
}

export async function signIn(email: string, password: string) {
  if (isSupabaseConfigured && supabase) {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw new Error(error.message);
    return;
  }

  if (email !== fallbackEmail || password !== fallbackPassword) {
    throw new Error('Неверный логин или пароль');
  }

  localStorage.setItem(FALLBACK_KEY, JSON.stringify({ email }));
}

export async function signOut() {
  if (isSupabaseConfigured && supabase) {
    const { error } = await supabase.auth.signOut();
    if (error) throw new Error(error.message);
    return;
  }
  localStorage.removeItem(FALLBACK_KEY);
}

export async function getCurrentUser(): Promise<AuthUser | null> {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase.auth.getUser();
    if (error) throw new Error(error.message);
    if (!data.user?.email) return null;
    return { email: data.user.email };
  }

  const raw = localStorage.getItem(FALLBACK_KEY);
  if (!raw) return null;
  return JSON.parse(raw) as AuthUser;
}

export function subscribeAuth(listener: (user: AuthUser | null) => void) {
  if (isSupabaseConfigured && supabase) {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      listener(session?.user?.email ? { email: session.user.email } : null);
    });
    return () => subscription.unsubscribe();
  }

  const handler = () => {
    getCurrentUser().then(listener).catch(() => listener(null));
  };
  window.addEventListener('storage', handler);
  return () => window.removeEventListener('storage', handler);
}

export function getAuthModeLabel() {
  return isSupabaseConfigured ? 'Supabase Auth' : 'Local fallback auth';
}
