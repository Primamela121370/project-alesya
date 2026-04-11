type HeroVariantId = 'A' | 'B';
type AbEventKey = 'views' | 'heroCta' | 'stickyCta' | 'leadSubmit';

type AbStats = Record<HeroVariantId, Record<AbEventKey, number>>;

const AB_STATS_KEY = 'alesya-hero-ab-stats-v1';

function getMetricaId(): number | null {
  const raw = import.meta.env.VITE_YANDEX_METRIKA_ID;
  if (!raw) return null;
  const parsed = Number(raw);
  return Number.isFinite(parsed) ? parsed : null;
}

function getEmptyStats(): AbStats {
  return {
    A: { views: 0, heroCta: 0, stickyCta: 0, leadSubmit: 0 },
    B: { views: 0, heroCta: 0, stickyCta: 0, leadSubmit: 0 },
  };
}

function readStats(): AbStats {
  try {
    const raw = window.localStorage.getItem(AB_STATS_KEY);
    if (!raw) return getEmptyStats();
    const parsed = JSON.parse(raw) as AbStats;
    if (!parsed?.A || !parsed?.B) return getEmptyStats();
    return parsed;
  } catch {
    return getEmptyStats();
  }
}

function writeStats(stats: AbStats) {
  window.localStorage.setItem(AB_STATS_KEY, JSON.stringify(stats));
}

function reachGoal(goal: string, params?: Record<string, unknown>) {
  const id = getMetricaId();
  if (!id || typeof window === 'undefined' || typeof window.ym !== 'function') return;
  window.ym(id, 'reachGoal', goal, params);
}

function incrementAbStat(variant: HeroVariantId, key: AbEventKey) {
  if (typeof window === 'undefined') return;
  const stats = readStats();
  stats[variant][key] += 1;
  writeStats(stats);
}

export function trackHeroVariantView(variant: HeroVariantId) {
  incrementAbStat(variant, 'views');
  reachGoal('hero_variant_view', { variant });
}

export function trackHeroCtaClick(variant: HeroVariantId) {
  incrementAbStat(variant, 'heroCta');
  reachGoal('hero_cta_click', { variant, placement: 'hero' });
}

export function trackStickyCtaClick(variant: HeroVariantId) {
  incrementAbStat(variant, 'stickyCta');
  reachGoal('hero_cta_click', { variant, placement: 'sticky' });
}

export function trackLeadSubmit(variant: HeroVariantId) {
  incrementAbStat(variant, 'leadSubmit');
  reachGoal('lead_submit', { variant });
}

declare global {
  interface Window {
    ym?: (counterId: number, method: 'reachGoal', goal: string, params?: Record<string, unknown>) => void;
  }
}

