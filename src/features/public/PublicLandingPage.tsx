import { useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { ArrowUpRight, Menu, X } from 'lucide-react';
import tutorPortrait from '../../assets/hero.png';
import { ErrorState } from '../../components/common/ErrorState';
import { LoadingState } from '../../components/common/LoadingState';
import { useToast } from '../../components/common/ToastProvider';
import { useSeoMeta } from '../../hooks/useSeoMeta';
import { trackHeroCtaClick, trackHeroVariantView, trackLeadSubmit, trackStickyCtaClick } from '../../lib/analytics';
import { dataProvider, getDefaultPublicContent } from '../../services/dataProvider';
import type { Lead } from '../../types/content';

const heroBullets = [
  'Отдельная система для устной части, аудирования и письма',
  'Прозрачная аналитика прогресса для родителей',
  'Снижение тревоги и психологическая поддержка',
  'Roadmap по месяцам до экзамена',
];

const painCards = [
  {
    title: 'Школа дает уровень ниже требований ЕГЭ',
    text: 'Типовой школьной программы часто недостаточно, чтобы уверенно выйти на высокий балл в условиях реального экзамена.',
  },
  {
    title: 'Устная часть вызывает панику',
    text: 'Даже сильные ученики теряются на speaking без отдельной системы тренировки и отработки структуры ответа.',
  },
  {
    title: 'Родители не понимают реальный уровень',
    text: 'Без объективной диагностики сложно понять, где ребенок сейчас и что реально можно улучшить за оставшееся время.',
  },
  {
    title: 'До экзамена остается все меньше времени',
    text: 'Когда нет пошагового плана, время уходит на хаотичную подготовку вместо роста результата.',
  },
];

const beforeItems = [
  'Страх устной части',
  'Хаос в грамматике',
  'Нет понимания прогресса',
  'Тревога родителей',
];

const afterItems = [
  'Уверенное speaking',
  'Понятная структура экзамена',
  'Прогнозируемый рост балла',
  'Спокойствие семьи',
];

const methodSteps = [
  {
    title: 'Диагностика',
    text: 'Проверяем сильные и слабые стороны, формируем стартовый срез и зоны быстрого роста.',
  },
  {
    title: 'Индивидуальная стратегия',
    text: 'Собираем персональный маршрут под цель поступления, сроки и текущий уровень ученика.',
  },
  {
    title: 'Еженедельные контрольные точки',
    text: 'Фиксируем прогресс, корректируем нагрузку и убираем просадки по ключевым разделам.',
  },
  {
    title: 'Финальный прогноз и шлифовка',
    text: 'Доводим слабые зоны до устойчивого результата и выходим на прогнозируемый экзаменационный балл.',
  },
];

const parentBenefits = [
  'Ежемесячный отчет по прогрессу',
  'Прогноз балла и динамика роста',
  'Контроль дедлайнов и темпа подготовки',
  'Честная обратная связь без приукрашивания',
  'Снижение тревоги дома и в семье',
];

type HeroVariant = {
  id: 'A' | 'B';
  title: string;
  subtitle: string;
  cta: string;
};

const heroVariants: HeroVariant[] = [
  {
    id: 'A',
    title: 'Подготовка к ЕГЭ по английскому на 80-90+ с персональной стратегией поступления в сильные вузы',
    subtitle:
      'За 7 дней родители получают честную диагностику уровня, прогноз реального балла и персональный маршрут до нужного результата без паники, хаоса и бессмысленного прорешивания.',
    cta: 'Получить прогноз балла',
  },
  {
    id: 'B',
    title: 'ЕГЭ по английскому без хаоса: персональный mentorship для 80-90+ и поступления в топ-вуз',
    subtitle:
      'Ребенок получает систему подготовки и уверенность, родители - прозрачный контроль прогресса, понятный план и реалистичный прогноз балла уже в первую неделю.',
    cta: 'Запросить стратегическую диагностику',
  },
];

function useScrollReveal() {
  useEffect(() => {
    const observed = new WeakSet<Element>();
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add('visible'); }),
      { threshold: 0.1, rootMargin: '0px 0px -48px 0px' },
    );

    const observeAll = () => {
      document.querySelectorAll('.reveal').forEach((el) => {
        if (observed.has(el)) return;
        observed.add(el);
        io.observe(el);
      });
    };

    observeAll();

    const mo = new MutationObserver(() => observeAll());
    mo.observe(document.body, { childList: true, subtree: true });

    return () => {
      mo.disconnect();
      io.disconnect();
    };
  }, []);
}

function Rule() {
  return <div className="rule-accent" aria-hidden />;
}

function Tag({ children }: { children: ReactNode }) {
  return <p className="text-xs font-medium uppercase tracking-[0.24em] text-[var(--color-accent)]">{children}</p>;
}

function SectionTitle({ tag, title, description }: { tag: string; title: string; description?: string }) {
  return (
    <div className="reveal space-y-4">
      <Tag>{tag}</Tag>
      <Rule />
      <h2 className="font-serif text-3xl leading-snug sm:text-4xl">{title}</h2>
      {description && <p className="max-w-xl leading-relaxed text-[var(--color-muted)]">{description}</p>}
    </div>
  );
}

export function PublicLandingPage() {
  const { showToast } = useToast();
  const [content, setContent] = useState(getDefaultPublicContent());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [heroVariant, setHeroVariant] = useState<HeroVariant>(heroVariants[0]);
  const [variantResolved, setVariantResolved] = useState(false);

  useScrollReveal();
  useSeoMeta(content.seo);

  useEffect(() => {
    let mounted = true;
    dataProvider
      .getPublicContent()
      .then((result) => {
        if (mounted) setContent(result);
      })
      .catch((err: unknown) => {
        if (mounted) setError(err instanceof Error ? err.message : 'Не удалось загрузить контент');
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    const key = 'alesya-hero-variant-v1';
    const saved = window.localStorage.getItem(key);
    if (saved === 'A' || saved === 'B') {
      setHeroVariant(heroVariants.find((row) => row.id === saved) ?? heroVariants[0]);
      setVariantResolved(true);
      return;
    }

    const picked = Math.random() < 0.5 ? heroVariants[0] : heroVariants[1];
    setHeroVariant(picked);
    window.localStorage.setItem(key, picked.id);
    setVariantResolved(true);
  }, []);

  useEffect(() => {
    if (!variantResolved) return;
    trackHeroVariantView(heroVariant.id);
  }, [heroVariant.id, variantResolved]);

  if (loading) return <div className="mx-auto max-w-5xl px-6 py-16"><LoadingState /></div>;
  if (error) return <div className="mx-auto max-w-5xl px-6 py-16"><ErrorState message={error} /></div>;

  return (
    <div className="min-h-screen bg-[var(--color-bg)] pb-24 text-[var(--color-text)] md:pb-0">
      <Nav />
      <HeroPremium
        variant={heroVariant}
        onPrimaryCtaClick={() => trackHeroCtaClick(heroVariant.id)}
      />
      <TrustStrip results={content.results} />
      <PainSection />
      <TransformationSection />
      <FounderSection />
      <MethodologySection />
      <ParentsSection />
      <CasesSection items={content.results} />
      <Testimonials items={content.testimonials} />
      <Faq items={content.faq} />
      <FinalCTA />
      <LeadForm
        variantId={heroVariant.id}
        onSubmitted={() => showToast('Заявка отправлена')}
      />
      <MobileStickyCTA
        ctaText={heroVariant.cta}
        onClick={() => trackStickyCtaClick(heroVariant.id)}
      />
      <Footer settings={content.settings} />
    </div>
  );
}

function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  const links = [
    ['Методика', '#method'],
    ['Для родителей', '#parents'],
    ['Кейсы', '#cases'],
    ['Отзывы', '#testimonials'],
  ];

  return (
    <nav className={`fixed left-0 right-0 top-0 z-50 transition-all duration-400 ${scrolled ? 'nav-glass' : ''}`}>
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5 sm:px-8">
        <span className="font-serif text-lg text-[var(--color-text)]">Олеся</span>
        <div className="hidden items-center gap-7 md:flex">
          {links.map(([label, href]) => (
            <a key={href} href={href} className="text-sm text-[var(--color-muted)] transition-colors hover:text-[var(--color-text)]">{label}</a>
          ))}
          <a href="#contact" className="rounded-sm border border-[var(--color-accent)] px-4 py-2 text-sm text-[var(--color-accent)] transition-all duration-250 hover:bg-[var(--color-accent)] hover:text-white">
            Получить прогноз
          </a>
        </div>
        <button className="p-1 text-[var(--color-muted)] md:hidden" onClick={() => setOpen(!open)} aria-label="Меню">
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>
      {open && (
        <div className="border-t border-[var(--color-border)] bg-[var(--color-bg)] px-6 py-5 md:hidden">
          {links.map(([label, href]) => (
            <a key={href} href={href} onClick={() => setOpen(false)} className="block py-3 text-sm text-[var(--color-muted)]">{label}</a>
          ))}
        </div>
      )}
    </nav>
  );
}

function HeroPremium({ variant, onPrimaryCtaClick }: { variant: HeroVariant; onPrimaryCtaClick: () => void }) {
  return (
    <section className="mx-auto w-full max-w-6xl px-6 pb-16 pt-32 sm:px-8 sm:pt-40">
      <div className="grid items-center gap-10 lg:grid-cols-[1fr_45%] lg:gap-16">
        <div>
          <p className="hero-tag mb-5 text-xs font-medium uppercase tracking-[0.26em] text-[var(--color-accent)]">Персональный наставник ЕГЭ/ОГЭ</p>
          <h1 className="hero-heading mb-6 font-serif text-[2.2rem] leading-[1.12] sm:text-5xl lg:text-[3.15rem]" style={{ letterSpacing: '-0.015em' }}>
            {variant.title}
          </h1>
          <p className="hero-sub mb-8 max-w-2xl text-base leading-[1.8] text-[var(--color-muted)] sm:text-lg">
            {variant.subtitle}
          </p>

          <ul className="hero-ctas grid gap-2.5 text-sm leading-relaxed text-[var(--color-text)] sm:grid-cols-2">
            {heroBullets.map((item) => (
              <li key={item} className="bullet-chip rounded-sm border border-[var(--color-border)] bg-[var(--color-card)] px-4 py-3">
                {item}
              </li>
            ))}
          </ul>

          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="#lead-form"
              onClick={onPrimaryCtaClick}
              className="inline-flex items-center gap-2 rounded-sm bg-[var(--color-accent)] px-6 py-3.5 text-sm font-medium text-white hover:bg-[var(--color-accent-hover)]"
            >
              {variant.cta} <ArrowUpRight size={16} strokeWidth={2} />
            </a>
          </div>
        </div>

        <div className="reveal hero-portrait-wrap relative">
          <div className="hero-glass" aria-hidden />
          <img
            src={tutorPortrait}
            alt="Олеся, персональный наставник по английскому ЕГЭ и ОГЭ"
            className="hero-portrait relative z-10 w-full rounded-[28px] object-cover"
          />
          <div className="hero-badge absolute left-4 top-4 z-20 rounded-full border border-[var(--color-border-mid)] bg-white/80 px-4 py-2 text-xs font-medium backdrop-blur">
            Персональный наставник ЕГЭ/ОГЭ
          </div>
          <div className="hero-proof absolute bottom-4 right-4 z-20 max-w-[280px] rounded-2xl border border-[var(--color-border-mid)] bg-[var(--color-card)] px-4 py-3 text-xs leading-relaxed text-[var(--color-muted)]" style={{ boxShadow: 'var(--shadow-card)' }}>
            Ученики поступают в ВШЭ, МГИМО и другие сильные вузы России
          </div>
        </div>
      </div>
    </section>
  );
}

function MobileStickyCTA({ ctaText, onClick }: { ctaText: string; onClick: () => void }) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-[var(--color-border)] bg-[var(--color-bg)]/95 px-4 py-3 backdrop-blur md:hidden">
      <a
        href="#lead-form"
        onClick={onClick}
        className="inline-flex w-full items-center justify-center gap-2 rounded-sm bg-[var(--color-accent)] px-5 py-3 text-sm font-medium text-white"
      >
        {ctaText}
        <ArrowUpRight size={16} strokeWidth={2} />
      </a>
    </div>
  );
}

function TrustStrip({ results }: { results: ReturnType<typeof getDefaultPublicContent>['results'] }) {
  const maxScore = results.length ? Math.max(...results.map((row) => Number(row.score) || 0)) : 95;
  const items = [
    { value: '7 дней', label: 'до прогноза балла' },
    { value: `${maxScore}+`, label: 'максимальные результаты' },
    { value: '1:1', label: 'формат mentorship' },
    { value: 'ежемесячно', label: 'прозрачная отчетность родителям' },
  ];

  return (
    <div className="border-y border-[var(--color-border)] bg-[var(--color-surface)]">
      <div className="mx-auto grid max-w-6xl grid-cols-2 divide-x divide-y divide-[var(--color-border)] px-6 sm:grid-cols-4 sm:divide-y-0 sm:px-8">
        {items.map((item) => (
          <div key={item.label} className="px-5 py-6 first:pl-0 last:pr-0">
            <p className="font-serif text-2xl text-[var(--color-accent)]">{item.value}</p>
            <p className="mt-1 text-xs text-[var(--color-muted)]">{item.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function PainSection() {
  return (
    <section id="pain" className="mx-auto w-full max-w-6xl px-6 py-20 sm:px-8 sm:py-28">
      <SectionTitle
        tag="Боли, которые мы закрываем"
        title="Проблема не в ребенке. Проблема в отсутствии системы"
        description="Когда подготовка строится стихийно, даже сильный ученик теряет баллы и уверенность."
      />
      <div className="mt-12 grid gap-5 sm:grid-cols-2">
        {painCards.map((item, i) => (
          <article key={item.title} className={`reveal reveal-d${Math.min(i + 1, 4)} border border-[var(--color-border)] bg-[var(--color-card)] p-7`} style={{ boxShadow: 'var(--shadow-card)' }}>
            <h3 className="mb-3 font-serif text-2xl leading-snug">{item.title}</h3>
            <p className="text-sm leading-relaxed text-[var(--color-muted)]">{item.text}</p>
          </article>
        ))}
      </div>
      <p className="reveal mt-10 text-center font-serif text-2xl leading-relaxed text-[var(--color-accent)]">
        Высокий балл - это не талант, а система подготовки и стратегия
      </p>
    </section>
  );
}

function TransformationSection() {
  return (
    <section className="bg-[var(--color-surface)] py-20 sm:py-28">
      <div className="mx-auto w-full max-w-6xl px-6 sm:px-8">
        <SectionTitle tag="Трансформация" title="До и после системной подготовки" />
        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          <article className="reveal rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)] p-8" style={{ boxShadow: 'var(--shadow-card)' }}>
            <p className="mb-5 text-xs font-medium uppercase tracking-[0.2em] text-[var(--color-muted)]">До</p>
            <ul className="space-y-3">
              {beforeItems.map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm leading-relaxed text-[var(--color-text)]">
                  <span className="mt-1 h-2 w-2 rounded-full bg-[var(--color-muted)]/60" aria-hidden />
                  {item}
                </li>
              ))}
            </ul>
          </article>

          <article className="reveal reveal-d2 rounded-2xl border border-[var(--color-border-mid)] bg-[var(--color-card)] p-8" style={{ boxShadow: 'var(--shadow-soft)' }}>
            <p className="mb-5 text-xs font-medium uppercase tracking-[0.2em] text-[var(--color-accent)]">После</p>
            <ul className="space-y-3">
              {afterItems.map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm leading-relaxed text-[var(--color-text)]">
                  <span className="mt-1 h-2 w-2 rounded-full bg-[var(--color-accent)]" aria-hidden />
                  {item}
                </li>
              ))}
            </ul>
          </article>
        </div>
      </div>
    </section>
  );
}

function FounderSection() {
  return (
    <section className="mx-auto w-full max-w-6xl px-6 py-20 sm:px-8 sm:py-28">
      <div className="grid items-center gap-10 lg:grid-cols-[42%_1fr]">
        <div className="reveal overflow-hidden rounded-[28px] border border-[var(--color-border)] bg-[var(--color-card)] p-3" style={{ boxShadow: 'var(--shadow-soft)' }}>
          <img src={tutorPortrait} alt="Олеся за работой с учеником" className="h-full w-full rounded-[22px] object-cover" />
        </div>
        <div className="reveal reveal-d2 space-y-5">
          <Tag>Личный бренд Олеси</Tag>
          <Rule />
          <h2 className="font-serif text-3xl leading-snug sm:text-4xl">Наставник, который ведет к результату, а не просто объясняет темы</h2>
          <p className="leading-relaxed text-[var(--color-muted)]">
            Подготовка строится как персональная стратегия поступления: с фокусом на реальный балл, мотивацию ученика и комфорт семьи. Мы снимаем страх устной части, выстраиваем рабочую дисциплину и держим прозрачную систему отчетности для родителей.
          </p>
          <p className="leading-relaxed text-[var(--color-muted)]">
            Вместо перегруза теорией - маршрут с понятными этапами, контрольными точками и поддержкой на каждом отрезке пути до экзамена.
          </p>
        </div>
      </div>
    </section>
  );
}

function MethodologySection() {
  return (
    <section id="method" className="bg-[var(--color-surface)] py-20 sm:py-28">
      <div className="mx-auto w-full max-w-6xl px-6 sm:px-8">
        <SectionTitle tag="Методика" title="Система из 4 этапов" description="Дорогой clean-подход: никакого хаоса, только управляемый рост балла." />
        <div className="timeline-grid mt-12 grid gap-5 lg:grid-cols-4">
          {methodSteps.map((step, i) => (
            <article key={step.title} className={`reveal reveal-d${Math.min(i + 1, 4)} timeline-step rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)] p-6`} style={{ boxShadow: 'var(--shadow-card)' }}>
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-[var(--color-accent)]">Шаг {i + 1}</p>
              <h3 className="mt-3 font-serif text-2xl leading-snug">{step.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-[var(--color-muted)]">{step.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function ParentsSection() {
  return (
    <section id="parents" className="mx-auto w-full max-w-6xl px-6 py-20 sm:px-8 sm:py-28">
      <div className="reveal rounded-[30px] border border-[var(--color-border-mid)] bg-[var(--color-card)] p-8 sm:p-12" style={{ boxShadow: 'var(--shadow-soft)' }}>
        <Tag>Для родителей</Tag>
        <Rule />
        <h2 className="mt-5 max-w-3xl font-serif text-3xl leading-snug sm:text-4xl">
          Вы больше не контролируете подготовку вручную - система и наставник делают это за вас
        </h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {parentBenefits.map((item, i) => (
            <p key={item} className={`reveal reveal-d${Math.min(i + 1, 4)} rounded-sm border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 text-sm text-[var(--color-text)]`}>
              {item}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}

function CasesSection({ items }: { items: ReturnType<typeof getDefaultPublicContent>['results'] }) {
  return (
    <section id="cases" className="mx-auto w-full max-w-6xl px-6 py-20 sm:px-8 sm:py-28">
      <SectionTitle
        tag="Кейсы"
        title="Истории роста: не только баллы, но и уверенность"
        description="Каждый кейс показывает трансформацию: от тревоги и хаоса к контролируемому результату."
      />
      <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item, i) => (
          <article key={item.id} className={`reveal reveal-d${Math.min(i + 1, 4)} border border-[var(--color-border)] bg-[var(--color-card)] p-7`} style={{ boxShadow: 'var(--shadow-card)' }}>
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-[var(--color-accent)]">{item.exam_type}</p>
            <h3 className="mt-3 font-serif text-2xl">{item.score}</h3>
            <p className="mt-2 text-sm leading-relaxed text-[var(--color-text)]">{item.student_name}</p>
            <p className="mt-3 text-sm leading-relaxed text-[var(--color-muted)]">{item.short_text}</p>
            <p className="mt-3 rounded-sm bg-[var(--color-surface)] px-3 py-2 text-xs text-[var(--color-muted)]">
              {item.note || item.duration || 'Боялась speaking -> уверенный результат на экзамене'}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}

function Testimonials({ items }: { items: ReturnType<typeof getDefaultPublicContent>['testimonials'] }) {
  return (
    <section id="testimonials" className="bg-[var(--color-surface)] py-20 sm:py-28">
      <div className="mx-auto w-full max-w-6xl px-6 sm:px-8">
        <SectionTitle tag="Отзывы" title="Что говорят ученики и родители" />
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item, i) => (
            <div key={item.id} className={`reveal reveal-d${Math.min(i + 1, 4)} border border-[var(--color-border)] bg-[var(--color-card)] p-7`} style={{ boxShadow: 'var(--shadow-card)' }}>
              <div className="font-serif text-4xl italic leading-none text-[var(--color-accent)] opacity-30" aria-hidden>"</div>
              <p className="mt-3 font-serif text-base italic leading-relaxed">{item.text}</p>
              <div className="mt-6 border-t border-[var(--color-border)] pt-5">
                <p className="text-sm font-medium">{item.author_name}</p>
                <p className="mt-0.5 text-xs text-[var(--color-muted)]">{item.author_role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Faq({ items }: { items: ReturnType<typeof getDefaultPublicContent>['faq'] }) {
  if (!items.length) return null;
  return (
    <section id="faq" className="mx-auto max-w-6xl px-6 py-20 sm:px-8 sm:py-28">
      <SectionTitle tag="FAQ" title="Частые вопросы" />
      <div className="mt-8 space-y-3">
        {items.map((item, i) => (
          <details key={item.id} className={`reveal reveal-d${Math.min(i + 1, 4)} rounded border border-[var(--color-border)] bg-[var(--color-card)] p-4`}>
            <summary className="cursor-pointer font-medium">{item.question}</summary>
            <p className="mt-3 text-sm text-[var(--color-muted)]">{item.answer}</p>
          </details>
        ))}
      </div>
    </section>
  );
}

function FinalCTA() {
  return (
    <section className="bg-[var(--color-surface)] py-20 sm:py-28">
      <div className="mx-auto w-full max-w-6xl px-6 sm:px-8">
        <div className="reveal rounded-[30px] border border-[var(--color-border-mid)] bg-[var(--color-card)] p-10 text-center sm:p-14" style={{ boxShadow: 'var(--shadow-soft)' }}>
          <Tag>Финальный шаг</Tag>
          <Rule />
          <h2 className="mx-auto mt-5 max-w-3xl font-serif text-3xl leading-snug sm:text-4xl">
            Узнайте реальный балл, на который ребенок может выйти уже через 7 дней
          </h2>
          <div className="mt-8">
            <a href="#lead-form" className="inline-flex items-center gap-2 rounded-sm bg-[var(--color-accent)] px-6 py-3.5 text-sm font-medium text-white hover:bg-[var(--color-accent-hover)]">
              Записаться на стратегическую диагностику <ArrowUpRight size={16} strokeWidth={2} />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

function LeadForm({ variantId, onSubmitted }: { variantId: HeroVariant['id']; onSubmitted: () => void }) {
  const [form, setForm] = useState({
    name: '',
    contact: '',
    student_grade: '',
    goal: 'ЕГЭ',
    message: '',
  });
  const [sending, setSending] = useState(false);
  const [consentAccepted, setConsentAccepted] = useState(false);

  return (
    <section id="contact" className="bg-[var(--color-bg)] py-20 sm:py-28">
      <div className="mx-auto w-full max-w-6xl px-6 sm:px-8">
        <div className="reveal border border-[var(--color-border-mid)] bg-[var(--color-card)] p-10 sm:p-14" style={{ boxShadow: 'var(--shadow-soft)' }}>
          <Tag>Старт подготовки</Tag>
          <Rule />
          <h2 className="mt-5 max-w-xl font-serif text-3xl leading-snug sm:text-4xl">Оставить заявку</h2>
          <p className="mt-5 max-w-2xl leading-relaxed text-[var(--color-muted)]">
            Оставьте контакты, и вы получите первичную стратегическую консультацию с честным пониманием текущего уровня и следующего шага.
          </p>

          <form
            id="lead-form"
            className="mt-8 grid gap-3 sm:grid-cols-2"
            onSubmit={async (event) => {
              event.preventDefault();
              setSending(true);
              try {
                await dataProvider.createLead(form as Omit<Lead, 'id' | 'status' | 'created_at'>);
                trackLeadSubmit(variantId);
                setForm({ name: '', contact: '', student_grade: '', goal: 'ЕГЭ', message: '' });
                setConsentAccepted(false);
                onSubmitted();
              } finally {
                setSending(false);
              }
            }}
          >
            <Input label="Имя" value={form.name} onChange={(value) => setForm({ ...form, name: value })} />
            <Input label="Телефон или Telegram" value={form.contact} onChange={(value) => setForm({ ...form, contact: value })} />
            <Input label="Класс ученика" value={form.student_grade} onChange={(value) => setForm({ ...form, student_grade: value })} />
            <label>
              <span className="mb-1 block text-sm text-[var(--color-muted)]">Цель</span>
              <select className="w-full rounded border border-[var(--color-border-mid)] px-3 py-2" value={form.goal} onChange={(event) => setForm({ ...form, goal: event.target.value })}>
                {['ОГЭ', 'ЕГЭ', 'диагностика', 'консультация'].map((goal) => (
                  <option key={goal} value={goal}>{goal}</option>
                ))}
              </select>
            </label>
            <label className="sm:col-span-2">
              <span className="mb-1 block text-sm text-[var(--color-muted)]">Сообщение</span>
              <textarea rows={4} className="w-full rounded border border-[var(--color-border-mid)] px-3 py-2" value={form.message} onChange={(event) => setForm({ ...form, message: event.target.value })} />
            </label>
            <label className="sm:col-span-2 flex items-start gap-3 rounded border border-[var(--color-border)] bg-[var(--color-surface)] p-3">
              <input
                type="checkbox"
                checked={consentAccepted}
                onChange={(event) => setConsentAccepted(event.target.checked)}
                className="mt-1 h-4 w-4 accent-[var(--color-accent)]"
                required
              />
              <span className="text-sm leading-relaxed text-[var(--color-muted)]">
                Я даю согласие на обработку персональных данных в соответствии с 152-ФЗ и принимаю условия{' '}
                <a
                  href="/consent.html"
                  target="_blank"
                  rel="noreferrer"
                  className="underline decoration-[var(--color-accent)] underline-offset-2 hover:text-[var(--color-accent)]"
                >
                  Согласия на обработку персональных данных
                </a>
                .
              </span>
            </label>
            <div className="sm:col-span-2">
              <button
                disabled={sending || !consentAccepted}
                className="rounded bg-[var(--color-accent)] px-6 py-3 text-sm text-white disabled:opacity-60"
              >
                {sending ? 'Отправляем...' : 'Получить прогноз балла'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}

function Footer({ settings }: { settings: ReturnType<typeof getDefaultPublicContent>['settings'] }) {
  const contacts = useMemo(
    () => [
      ['Telegram', settings.telegram_url],
      ['WhatsApp', settings.whatsapp_url],
      ['Email', `mailto:${settings.email}`],
    ],
    [settings],
  );

  return (
    <footer className="border-t border-[var(--color-border)] px-6 py-8 sm:px-8">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4">
        <span className="font-serif text-[var(--color-muted)]">{settings.site_name}</span>
        <div className="flex flex-wrap gap-3 text-sm">
          {contacts.map(([label, href]) => (
            <a key={label} href={href} target="_blank" rel="noreferrer" className="text-[var(--color-muted)] hover:text-[var(--color-accent)]">
              {label}
            </a>
          ))}
        </div>
      </div>
      <div className="mx-auto mt-2 max-w-6xl text-xs text-[var(--color-muted)] opacity-60">
        {settings.footer_text}{' '}
        <a href="/consent.html" target="_blank" rel="noreferrer" className="underline underline-offset-2 hover:text-[var(--color-accent)]">
          Согласие на обработку персональных данных
        </a>
        .
      </div>
    </footer>
  );
}

function Input({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <label>
      <span className="mb-1 block text-sm text-[var(--color-muted)]">{label}</span>
      <input className="w-full rounded border border-[var(--color-border-mid)] px-3 py-2" value={value} onChange={(event) => onChange(event.target.value)} />
    </label>
  );
}
