import { useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { ArrowUpRight, Menu, X } from 'lucide-react';
import { ErrorState } from '../../components/common/ErrorState';
import { LoadingState } from '../../components/common/LoadingState';
import { useToast } from '../../components/common/ToastProvider';
import { useSeoMeta } from '../../hooks/useSeoMeta';
import { dataProvider, getDefaultPublicContent } from '../../services/dataProvider';
import type { Lead } from '../../types/content';

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

  const fallback = getDefaultPublicContent();
  const sections = content.sections.length ? content.sections : fallback.sections;
  const sectionItems = content.sectionItems.length ? content.sectionItems : fallback.sectionItems;

  const sortedSections = [...sections].sort((a, b) => a.sort_order - b.sort_order);
  const painsSection =
    sections.find((row) => row.key === 'pains') ??
    sections.find((row) => row.key.includes('pain')) ??
    sortedSections[0];
  const howSection =
    sections.find((row) => row.key === 'how_i_work') ??
    sections.find((row) => row.key.includes('how') || row.key.includes('work')) ??
    sortedSections[1];
  const forWhomSection =
    sections.find((row) => row.key === 'for_whom') ??
    sections.find((row) => row.key.includes('whom') || row.key.includes('for')) ??
    sortedSections[2];

  const painsItems = sectionItems.filter((row) => row.section_id === painsSection?.id);
  const howItems = sectionItems.filter((row) => row.section_id === howSection?.id);
  const forWhomItems = sectionItems.filter((row) => row.section_id === forWhomSection?.id);

  if (loading) return <div className="mx-auto max-w-5xl px-6 py-16"><LoadingState /></div>;
  if (error) return <div className="mx-auto max-w-5xl px-6 py-16"><ErrorState message={error} /></div>;

  return (
    <div className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)]">
      <Nav />
      <Hero content={content.hero} />
      <StatsRow results={content.results} />
      {!!painsSection && <Pains section={painsSection} items={painsItems} />}
      <QuoteBlock quote={content.hero.quote_text} author={content.hero.quote_author} />
      {!!howSection && <HowIWork section={howSection} items={howItems} />}
      {!!forWhomSection && <ForWhom section={forWhomSection} items={forWhomItems} />}
      <Results items={content.results} />
      <DiagnosticCTA />
      <Testimonials items={content.testimonials} />
      <Faq items={content.faq} />
      <LeadForm onSubmitted={() => showToast('Заявка отправлена')} />
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
    ['Подход', '#approach'],
    ['Для кого', '#for-whom'],
    ['Результаты', '#results'],
    ['Отзывы', '#testimonials'],
  ];

  return (
    <nav className={`fixed left-0 right-0 top-0 z-50 transition-all duration-400 ${scrolled ? 'nav-glass' : ''}`}>
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-5 sm:px-8">
        <span className="font-serif text-lg text-[var(--color-text)]">Алеся</span>
        <div className="hidden items-center gap-7 md:flex">
          {links.map(([label, href]) => (
            <a key={href} href={href} className="text-sm text-[var(--color-muted)] transition-colors hover:text-[var(--color-text)]">{label}</a>
          ))}
          <a href="#contact" className="rounded-sm border border-[var(--color-accent)] px-4 py-2 text-sm text-[var(--color-accent)] transition-all duration-250 hover:bg-[var(--color-accent)] hover:text-white">
            Написать мне
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

function Hero({ content }: { content: ReturnType<typeof getDefaultPublicContent>['hero'] }) {
  return (
    <section className="mx-auto w-full max-w-5xl px-6 pb-16 pt-32 sm:px-8 sm:pt-40">
      <div className="grid gap-12 lg:grid-cols-[1fr_320px] lg:gap-16 lg:items-start">
        <div>
          <p className="hero-tag mb-5 text-xs font-medium uppercase tracking-[0.26em] text-[var(--color-accent)]">{content.eyebrow}</p>
          <h1 className="hero-heading mb-6 font-serif text-[2.6rem] leading-[1.12] sm:text-5xl lg:text-[3.4rem]" style={{ letterSpacing: '-0.015em' }}>
            {content.title}
          </h1>
          <p className="hero-sub mb-8 max-w-lg text-base leading-[1.8] text-[var(--color-muted)] sm:text-lg">{content.subtitle}</p>
          <div className="hero-ctas flex flex-wrap gap-3">
            <a href={content.primary_button_url} className="inline-flex items-center gap-2 rounded-sm bg-[var(--color-accent)] px-6 py-3.5 text-sm font-medium text-white hover:bg-[var(--color-accent-hover)]">
              {content.primary_button_text} <ArrowUpRight size={16} strokeWidth={2} />
            </a>
            <a href={content.secondary_button_url} className="inline-flex items-center gap-2 rounded-sm border border-[var(--color-border-mid)] px-6 py-3.5 text-sm font-medium text-[var(--color-muted)] hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]">
              {content.secondary_button_text}
            </a>
          </div>
        </div>

        <aside className="hero-aside hidden lg:block">
          <div className="border border-[var(--color-border)] bg-[var(--color-card)] p-7" style={{ boxShadow: 'var(--shadow-card)' }}>
            <div className="mb-4 font-serif text-4xl italic leading-none text-[var(--color-accent)] opacity-40" aria-hidden>
              "
            </div>
            <p className="pull-quote text-base leading-relaxed">{content.quote_text}</p>
            <p className="mt-5 text-sm text-[var(--color-muted)]">- {content.quote_author}</p>
          </div>
        </aside>
      </div>
    </section>
  );
}

function StatsRow({ results }: { results: ReturnType<typeof getDefaultPublicContent>['results'] }) {
  const maxScore = results.length ? Math.max(...results.map((row) => Number(row.score) || 0)) : 95;
  const items = [
    { value: `${results.length || 100}+`, label: 'кейсов' },
    { value: `${maxScore}`, label: 'максимальный балл' },
    { value: 'ОГЭ / ЕГЭ', label: 'форматы' },
    { value: '1:1', label: 'индивидуально' },
  ];

  return (
    <div className="border-y border-[var(--color-border)] bg-[var(--color-surface)]">
      <div className="mx-auto grid max-w-5xl grid-cols-2 divide-x divide-y divide-[var(--color-border)] px-6 sm:grid-cols-4 sm:divide-y-0 sm:px-8">
        {items.map((item) => (
          <div key={item.label} className="px-6 py-6 first:pl-0 last:pr-0">
            <p className="font-serif text-2xl text-[var(--color-accent)]">{item.value}</p>
            <p className="mt-1 text-xs text-[var(--color-muted)]">{item.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function Pains({ section, items }: { section: ReturnType<typeof getDefaultPublicContent>['sections'][number]; items: ReturnType<typeof getDefaultPublicContent>['sectionItems']; }) {
  return (
    <section id="approach" className="mx-auto w-full max-w-5xl px-6 py-20 sm:px-8 sm:py-28">
      <SectionTitle tag={section.tag} title={section.title} description={section.description} />
      <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item, i) => (
          <div key={item.id} className={`reveal reveal-d${Math.min(i + 1, 4)} border border-[var(--color-border)] bg-[var(--color-card)] p-7 transition-all duration-300 hover:border-[var(--color-border-mid)]`} style={{ boxShadow: 'var(--shadow-card)' }}>
            <p className="mb-3 text-xs font-medium uppercase tracking-[0.18em] text-[var(--color-accent)] opacity-70">{item.subtitle}</p>
            <p className="mb-4 font-serif text-xl leading-snug">{item.title}</p>
            <p className="text-sm leading-relaxed text-[var(--color-muted)]">{item.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function QuoteBlock({ quote, author }: { quote: string; author: string }) {
  return (
    <section className="bg-[var(--color-surface)] py-16 sm:py-20">
      <div className="reveal mx-auto max-w-3xl px-6 sm:px-8">
        <div className="font-serif text-[5rem] leading-none text-[var(--color-accent)] opacity-25" aria-hidden>
          "
        </div>
        <blockquote className="pull-quote mt-2 text-xl leading-relaxed sm:text-2xl">
          {quote}
        </blockquote>
        <p className="mt-6 text-sm text-[var(--color-muted)]">- {author}</p>
      </div>
    </section>
  );
}

function HowIWork({ section, items }: { section: ReturnType<typeof getDefaultPublicContent>['sections'][number]; items: ReturnType<typeof getDefaultPublicContent>['sectionItems']; }) {
  return (
    <section className="mx-auto w-full max-w-5xl px-6 py-20 sm:px-8 sm:py-28">
      <SectionTitle tag={section.tag} title={section.title} description={section.description} />
      <div className="mt-12 space-y-px">
        {items.map((item, i) => (
          <div key={item.id} className={`reveal reveal-d${Math.min(i + 1, 4)} group flex items-start gap-6 border border-[var(--color-border)] bg-[var(--color-card)] p-6 transition-all duration-300 hover:border-[var(--color-border-mid)] hover:bg-[var(--color-bg)]`}>
            <span className="mt-0.5 font-serif text-2xl italic text-[var(--color-accent)] opacity-40 transition-opacity duration-300 group-hover:opacity-80">
              {String(i + 1).padStart(2, '0')}
            </span>
            <div>
              <p className="mb-1.5 font-medium text-[var(--color-text)]">{item.title}</p>
              <p className="text-sm leading-relaxed text-[var(--color-muted)]">{item.text}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function ForWhom({ section, items }: { section: ReturnType<typeof getDefaultPublicContent>['sections'][number]; items: ReturnType<typeof getDefaultPublicContent>['sectionItems']; }) {
  return (
    <section id="for-whom" className="bg-[var(--color-surface)] py-20 sm:py-28">
      <div className="mx-auto w-full max-w-5xl px-6 sm:px-8">
        <SectionTitle tag={section.tag} title={section.title} description={section.description} />
        <div className="mt-12 grid gap-5 sm:grid-cols-2">
          {items.map((item, i) => (
            <div key={item.id} className={`reveal reveal-d${Math.min(i + 1, 4)} group border-l-2 border-[var(--color-accent)] border-opacity-30 bg-[var(--color-card)] p-7 transition-all duration-300 hover:border-opacity-100`} style={{ boxShadow: 'var(--shadow-card)', borderLeftColor: 'rgba(168,82,42,0.28)' }}>
              <p className="mb-3 text-xs font-medium uppercase tracking-[0.18em] text-[var(--color-accent)] opacity-70">{item.subtitle}</p>
              <h3 className="mb-3 font-serif text-xl leading-snug">{item.title}</h3>
              <p className="text-sm leading-relaxed text-[var(--color-muted)]">{item.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Results({ items }: { items: ReturnType<typeof getDefaultPublicContent>['results'] }) {
  return (
    <section id="results" className="mx-auto w-full max-w-5xl px-6 py-20 sm:px-8 sm:py-28">
      <SectionTitle tag="Результаты" title="Реальные истории учеников" description="Каждый балл — это системная работа и поддержка на дистанции." />
      <div className="mt-12 grid gap-5 sm:grid-cols-3">
        {items.map((item, i) => (
          <div key={item.id} className={`reveal reveal-d${Math.min(i + 1, 4)} relative overflow-hidden border border-[var(--color-border)] bg-[var(--color-card)] p-7 transition-all duration-300 hover:border-[var(--color-border-mid)]`} style={{ boxShadow: 'var(--shadow-card)' }}>
            <div className="mb-6 flex items-end gap-2">
              <span className="font-serif font-medium leading-none text-[var(--color-accent)]" style={{ fontSize: '3.8rem', letterSpacing: '-0.04em' }}>{item.score}</span>
            </div>
            <div className="border-t border-[var(--color-border)] pt-5">
              <p className="font-serif text-xl">{item.student_name}</p>
              <p className="mt-2 text-sm leading-relaxed text-[var(--color-muted)]">{item.short_text}</p>
              <p className="mt-4 text-xs font-medium uppercase tracking-[0.14em] text-[var(--color-accent)]">{item.duration}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function DiagnosticCTA() {
  return (
    <section id="diagnostics" className="bg-[var(--color-surface)] py-20 sm:py-28">
      <div className="mx-auto w-full max-w-5xl px-6 sm:px-8">
        <div className="reveal border border-[var(--color-border-mid)] bg-[var(--color-card)] p-10 sm:p-14" style={{ boxShadow: 'var(--shadow-soft)' }}>
          <Tag>Бесплатно • 5 минут</Tag>
          <Rule />
          <h2 className="mt-5 max-w-xl font-serif text-3xl leading-snug sm:text-4xl">
            Узнайте текущий уровень и реалистичный план подготовки
          </h2>
          <p className="mt-5 max-w-lg leading-relaxed text-[var(--color-muted)]">
            Короткая диагностика покажет сильные и слабые стороны и поможет понять, как выйти на нужный результат без хаоса.
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <a href="#lead-form" className="inline-flex items-center gap-2 rounded-sm bg-[var(--color-accent)] px-6 py-3.5 text-sm font-medium text-white hover:bg-[var(--color-accent-hover)]">
              Пройти диагностику <ArrowUpRight size={16} strokeWidth={2} />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

function Testimonials({ items }: { items: ReturnType<typeof getDefaultPublicContent>['testimonials'] }) {
  return (
    <section id="testimonials" className="mx-auto w-full max-w-5xl px-6 py-20 sm:px-8 sm:py-28">
      <SectionTitle tag="Отзывы" title="Что говорят ученики и родители" />
      <div className="mt-12 grid gap-5 sm:grid-cols-3">
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
    </section>
  );
}

function Faq({ items }: { items: ReturnType<typeof getDefaultPublicContent>['faq'] }) {
  if (!items.length) return null;
  return (
    <section id="faq" className="bg-[var(--color-surface)] py-20 sm:py-28">
      <div className="mx-auto max-w-5xl px-6 sm:px-8">
        <SectionTitle tag="FAQ" title="Частые вопросы" />
        <div className="mt-8 space-y-3">
          {items.map((item, i) => (
            <details key={item.id} className={`reveal reveal-d${Math.min(i + 1, 4)} rounded border border-[var(--color-border)] bg-[var(--color-card)] p-4`}>
              <summary className="cursor-pointer font-medium">{item.question}</summary>
              <p className="mt-3 text-sm text-[var(--color-muted)]">{item.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

function LeadForm({ onSubmitted }: { onSubmitted: () => void }) {
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
    <section id="contact" className="bg-[var(--color-surface)] py-20 sm:py-28">
      <div className="mx-auto w-full max-w-5xl px-6 sm:px-8">
        <div className="reveal border border-[var(--color-border-mid)] bg-[var(--color-card)] p-10 sm:p-14" style={{ boxShadow: 'var(--shadow-soft)' }}>
          <Tag>Давайте познакомимся</Tag>
          <Rule />
          <h2 className="mt-5 max-w-xl font-serif text-3xl leading-snug sm:text-4xl">Оставить заявку</h2>
          <p className="mt-5 max-w-lg leading-relaxed text-[var(--color-muted)]">Оставьте контакты, и я свяжусь с вами, чтобы обсудить старт подготовки.</p>

          <form
            id="lead-form"
            className="mt-8 grid gap-3 sm:grid-cols-2"
            onSubmit={async (event) => {
              event.preventDefault();
              setSending(true);
              try {
                await dataProvider.createLead(form as Omit<Lead, 'id' | 'status' | 'created_at'>);
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
                {sending ? 'Отправляем...' : 'Отправить заявку'}
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
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-4">
        <span className="font-serif text-[var(--color-muted)]">{settings.site_name}</span>
        <div className="flex flex-wrap gap-3 text-sm">
          {contacts.map(([label, href]) => (
            <a key={label} href={href} target="_blank" rel="noreferrer" className="text-[var(--color-muted)] hover:text-[var(--color-accent)]">
              {label}
            </a>
          ))}
        </div>
      </div>
      <div className="mx-auto mt-2 max-w-5xl text-xs text-[var(--color-muted)] opacity-60">
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

