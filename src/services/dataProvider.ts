import type {
  DashboardData,
  FaqItem,
  HeroContent,
  Lead,
  LeadStatus,
  PublicContent,
  Result,
  Section,
  SectionItem,
  SeoSettings,
  SiteSettings,
  TableName,
  Testimonial,
} from '../types/content';
import { isSupabaseConfigured, supabase } from '../lib/supabase';
import { defaultPublicContent, defaultStoreState, type LocalStoreState } from './seed';

const STORAGE_KEY = 'alesya-cms-store-v2';

type UpsertPayload = SiteSettings | HeroContent | Section | SectionItem | Result | Testimonial | FaqItem | SeoSettings | Lead;
type LocalArrayTable = 'sections' | 'section_items' | 'results' | 'testimonials' | 'faq' | 'leads';

interface DataProvider {
  getPublicContent(): Promise<PublicContent>;
  getDashboardData(): Promise<DashboardData>;
  list<T>(table: TableName): Promise<T[]>;
  getSingleton<T>(table: 'site_settings' | 'hero_content' | 'seo_settings'): Promise<T>;
  upsert(table: TableName, payload: UpsertPayload): Promise<UpsertPayload>;
  remove(table: TableName, id: number): Promise<void>;
  createLead(payload: Omit<Lead, 'id' | 'status' | 'created_at'>): Promise<Lead>;
  updateLeadStatus(id: number, status: LeadStatus): Promise<void>;
}

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

function getStore(): LocalStoreState {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultStoreState));
    return clone(defaultStoreState);
  }
  try {
    return JSON.parse(raw) as LocalStoreState;
  } catch {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultStoreState));
    return clone(defaultStoreState);
  }
}

function saveStore(store: LocalStoreState) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
}

function nextId(list: Array<{ id: number }>) {
  return list.length ? Math.max(...list.map((row) => row.id)) + 1 : 1;
}

function sortBy<T extends { sort_order?: number; created_at?: string }>(rows: T[]) {
  return rows.sort((a, b) => {
    if (typeof a.sort_order === 'number' && typeof b.sort_order === 'number') return a.sort_order - b.sort_order;
    if (a.created_at && b.created_at) return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    return 0;
  });
}

function getLocalArray(store: LocalStoreState, table: LocalArrayTable) {
  if (table === 'sections') return store.sections;
  if (table === 'section_items') return store.section_items;
  if (table === 'results') return store.results;
  if (table === 'testimonials') return store.testimonials;
  if (table === 'faq') return store.faq;
  return store.leads;
}

function setLocalArray(store: LocalStoreState, table: LocalArrayTable, rows: LocalStoreState[LocalArrayTable]) {
  if (table === 'sections') store.sections = rows as LocalStoreState['sections'];
  else if (table === 'section_items') store.section_items = rows as LocalStoreState['section_items'];
  else if (table === 'results') store.results = rows as LocalStoreState['results'];
  else if (table === 'testimonials') store.testimonials = rows as LocalStoreState['testimonials'];
  else if (table === 'faq') store.faq = rows as LocalStoreState['faq'];
  else store.leads = rows as LocalStoreState['leads'];
}

const localProvider: DataProvider = {
  async getPublicContent() {
    const store = getStore();
    return {
      settings: store.site_settings,
      hero: store.hero_content,
      sections: sortBy(store.sections.filter((row) => row.is_published)),
      sectionItems: sortBy(store.section_items.filter((row) => row.is_published)),
      results: sortBy(store.results.filter((row) => row.is_published)),
      testimonials: sortBy(store.testimonials.filter((row) => row.is_published)),
      faq: sortBy(store.faq.filter((row) => row.is_published)),
      seo: store.seo_settings,
    };
  },

  async getDashboardData() {
    const store = getStore();
    return {
      leadsCount: store.leads.length,
      testimonialsCount: store.testimonials.length,
      resultsCount: store.results.length,
      recentLeads: [...store.leads]
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        .slice(0, 5),
    };
  },

  async list<T>(table: TableName) {
    const store = getStore();
    if (table === 'site_settings' || table === 'hero_content' || table === 'seo_settings') {
      return [clone(store[table]) as T];
    }
    return clone(getLocalArray(store, table as LocalArrayTable)) as T[];
  },

  async getSingleton<T>(table: 'site_settings' | 'hero_content' | 'seo_settings') {
    const store = getStore();
    return clone(store[table]) as T;
  },

  async upsert(table: TableName, payload: UpsertPayload) {
    const store = getStore();
    const timestamp = new Date().toISOString();

    if (table === 'site_settings') {
      const updated = { ...(payload as SiteSettings), updated_at: timestamp };
      store.site_settings = updated;
      saveStore(store);
      return updated;
    }

    if (table === 'hero_content') {
      const updated = { ...(payload as HeroContent), updated_at: timestamp };
      store.hero_content = updated;
      saveStore(store);
      return updated;
    }

    if (table === 'seo_settings') {
      const updated = { ...(payload as SeoSettings), updated_at: timestamp };
      store.seo_settings = updated;
      saveStore(store);
      return updated;
    }

    const arrayTable = table as LocalArrayTable;
    const rows = [...getLocalArray(store, arrayTable)] as unknown as Array<{ id: number } & Record<string, unknown>>;
    const input = payload as unknown as { id: number } & Record<string, unknown>;
    const index = rows.findIndex((row) => row.id === input.id);

    if (index >= 0) {
      rows[index] = { ...rows[index], ...input };
    } else {
      rows.push({ ...input, id: nextId(rows) });
    }

    setLocalArray(store, arrayTable, rows as unknown as LocalStoreState[LocalArrayTable]);
    saveStore(store);
    return rows[index >= 0 ? index : rows.length - 1] as unknown as UpsertPayload;
  },

  async remove(table, id) {
    if (table === 'site_settings' || table === 'hero_content' || table === 'seo_settings') {
      throw new Error('Singleton table cannot be deleted');
    }
    const store = getStore();
    const arrayTable = table as LocalArrayTable;
    const rows = getLocalArray(store, arrayTable);
    setLocalArray(store, arrayTable, rows.filter((row) => row.id !== id) as LocalStoreState[LocalArrayTable]);
    saveStore(store);
  },

  async createLead(payload) {
    const store = getStore();
    const lead: Lead = {
      id: nextId(store.leads),
      status: 'new',
      created_at: new Date().toISOString(),
      ...payload,
    };
    store.leads = [lead, ...store.leads];
    saveStore(store);
    return lead;
  },

  async updateLeadStatus(id, status) {
    const store = getStore();
    store.leads = store.leads.map((lead) => (lead.id === id ? { ...lead, status } : lead));
    saveStore(store);
  },
};

function requireSupabase() {
  if (!supabase) throw new Error('Supabase client not configured');
  return supabase;
}

const supabaseProvider: DataProvider = {
  async getPublicContent() {
    const client = requireSupabase();
    const [settingsRes, heroRes, sectionsRes, sectionItemsRes, resultsRes, testimonialsRes, faqRes, seoRes] = await Promise.all([
      client.from('site_settings').select('*').single(),
      client.from('hero_content').select('*').single(),
      client.from('sections').select('*').eq('is_published', true).order('sort_order', { ascending: true }),
      client.from('section_items').select('*').eq('is_published', true).order('sort_order', { ascending: true }),
      client.from('results').select('*').eq('is_published', true).order('sort_order', { ascending: true }),
      client.from('testimonials').select('*').eq('is_published', true).order('sort_order', { ascending: true }),
      client.from('faq').select('*').eq('is_published', true).order('sort_order', { ascending: true }),
      client.from('seo_settings').select('*').eq('page_key', 'home').single(),
    ]);

    const error = settingsRes.error || heroRes.error || sectionsRes.error || sectionItemsRes.error || resultsRes.error || testimonialsRes.error || faqRes.error || seoRes.error;
    if (error) throw new Error(error.message);

    return {
      settings: settingsRes.data,
      hero: heroRes.data,
      sections: sectionsRes.data ?? [],
      sectionItems: sectionItemsRes.data ?? [],
      results: resultsRes.data ?? [],
      testimonials: testimonialsRes.data ?? [],
      faq: faqRes.data ?? [],
      seo: seoRes.data,
    } as PublicContent;
  },

  async getDashboardData() {
    const client = requireSupabase();
    const [leadsRes, testimonialsRes, resultsRes, recentRes] = await Promise.all([
      client.from('leads').select('*', { count: 'exact', head: true }),
      client.from('testimonials').select('*', { count: 'exact', head: true }),
      client.from('results').select('*', { count: 'exact', head: true }),
      client.from('leads').select('*').order('created_at', { ascending: false }).limit(5),
    ]);

    const error = leadsRes.error || testimonialsRes.error || resultsRes.error || recentRes.error;
    if (error) throw new Error(error.message);

    return {
      leadsCount: leadsRes.count ?? 0,
      testimonialsCount: testimonialsRes.count ?? 0,
      resultsCount: resultsRes.count ?? 0,
      recentLeads: (recentRes.data ?? []) as Lead[],
    };
  },

  async list<T>(table: TableName) {
    const client = requireSupabase();
    const query = client.from(table).select('*');
    const { data, error } = table === 'leads'
      ? await query.order('created_at', { ascending: false })
      : ['sections', 'section_items', 'results', 'testimonials', 'faq'].includes(table)
        ? await query.order('sort_order', { ascending: true })
        : await query;
    if (error) throw new Error(error.message);
    return (data ?? []) as T[];
  },

  async getSingleton<T>(table: 'site_settings' | 'hero_content' | 'seo_settings') {
    const client = requireSupabase();
    const { data, error } = table === 'seo_settings'
      ? await client.from(table).select('*').eq('page_key', 'home').single()
      : await client.from(table).select('*').single();
    if (error) throw new Error(error.message);
    return data as T;
  },

  async upsert(table, payload) {
    const client = requireSupabase();
    const { data, error } = await client.from(table).upsert(payload).select().single();
    if (error) throw new Error(error.message);
    return data as UpsertPayload;
  },

  async remove(table, id) {
    const client = requireSupabase();
    const { error } = await client.from(table).delete().eq('id', id);
    if (error) throw new Error(error.message);
  },

  async createLead(payload) {
    const client = requireSupabase();
    const { data, error } = await client.from('leads').insert({ ...payload, status: 'new' }).select().single();
    if (error) throw new Error(error.message);
    return data as Lead;
  },

  async updateLeadStatus(id, status) {
    const client = requireSupabase();
    const { error } = await client.from('leads').update({ status }).eq('id', id);
    if (error) throw new Error(error.message);
  },
};

export const dataProvider: DataProvider = isSupabaseConfigured ? supabaseProvider : localProvider;
export function getDefaultPublicContent() {
  return defaultPublicContent;
}

