import { useState, useEffect } from 'react';
import { ArrowUpRight, Menu, X } from 'lucide-react';

/* ── Scroll reveal hook ─────────────────────────────── */
function useScrollReveal() {
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add('visible'); }),
      { threshold: 0.1, rootMargin: '0px 0px -48px 0px' },
    );
    document.querySelectorAll('.reveal').forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}

/* ── Shared UI ──────────────────────────────────────── */
function Rule() {
  return <div className="rule-accent" aria-hidden />;
}

function Tag({ children }) {
  return (
    <p className="text-xs font-medium uppercase tracking-[0.24em] text-[var(--color-accent)]">
      {children}
    </p>
  );
}

function SectionTitle({ tag, title, description }) {
  return (
    <div className="reveal space-y-4">
      <Tag>{tag}</Tag>
      <Rule />
      <h2 className="font-serif text-3xl leading-snug sm:text-4xl">{title}</h2>
      {description && (
        <p className="max-w-xl leading-relaxed text-[var(--color-muted)]">{description}</p>
      )}
    </div>
  );
}

function Btn({ children, secondary = false }) {
  const base =
    'inline-flex items-center gap-2 px-6 py-3.5 text-sm font-medium transition-all duration-250 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)]';
  return secondary ? (
    <button type="button" className={`${base} border border-[var(--color-border-mid)] text-[var(--color-muted)] hover:border-[var(--color-accent)] hover:text-[var(--color-accent)] rounded-sm`}>
      {children}
    </button>
  ) : (
    <button type="button" className={`${base} bg-[var(--color-accent)] text-white hover:bg-[var(--color-accent-hover)] rounded-sm`}>
      {children}
    </button>
  );
}

/* ── Nav ────────────────────────────────────────────── */
const navLinks = [
  ['Подход', '#approach'],
  ['Для кого', '#for-whom'],
  ['Результаты', '#results'],
  ['Отзывы', '#testimonials'],
];

function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);
  return (
    <nav className={`fixed left-0 right-0 top-0 z-50 transition-all duration-400 ${scrolled ? 'nav-glass' : ''}`}>
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-5 sm:px-8">
        <span className="font-serif text-lg text-[var(--color-text)]">
          Алеся
        </span>
        <div className="hidden items-center gap-7 md:flex">
          {navLinks.map(([label, href]) => (
            <a key={href} href={href} className="text-sm text-[var(--color-muted)] transition-colors hover:text-[var(--color-text)]">
              {label}
            </a>
          ))}
          <a
            href="#contact"
            className="rounded-sm border border-[var(--color-accent)] px-4 py-2 text-sm text-[var(--color-accent)] transition-all duration-250 hover:bg-[var(--color-accent)] hover:text-white"
          >
            Написать мне
          </a>
        </div>
        <button className="p-1 text-[var(--color-muted)] md:hidden" onClick={() => setOpen(!open)} aria-label="Меню">
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>
      {open && (
        <div className="border-t border-[var(--color-border)] bg-[var(--color-bg)] px-6 py-5 md:hidden">
          {navLinks.map(([label, href]) => (
            <a key={href} href={href} onClick={() => setOpen(false)} className="block py-3 text-sm text-[var(--color-muted)]">{label}</a>
          ))}
          <a href="#contact" onClick={() => setOpen(false)} className="mt-4 block rounded-sm bg-[var(--color-accent)] px-5 py-3 text-center text-sm text-white">
            Написать мне →
          </a>
        </div>
      )}
    </nav>
  );
}

/* ── Hero ───────────────────────────────────────────── */
function Hero() {
  return (
    <section className="mx-auto w-full max-w-5xl px-6 pb-16 pt-32 sm:px-8 sm:pt-40">
      <div className="grid gap-12 lg:grid-cols-[1fr_320px] lg:gap-16 lg:items-start">
        {/* Left */}
        <div>
          <p className="hero-tag mb-5 text-xs font-medium uppercase tracking-[0.26em] text-[var(--color-accent)]">
            Репетитор по английскому · ОГЭ и ЕГЭ
          </p>
          <h1
            className="hero-heading mb-6 font-serif text-[2.6rem] leading-[1.12] sm:text-5xl lg:text-[3.4rem]"
            style={{ letterSpacing: '-0.015em' }}
          >
            Подготовка к ОГЭ и ЕГЭ,
            где ваш ребёнок
            перестаёт бояться
            и&nbsp;начинает расти
          </h1>
          <p className="hero-sub mb-8 max-w-lg text-base leading-[1.8] text-[var(--color-muted)] sm:text-lg">
            Работаю с учениками 9–11 класса индивидуально — разбираю то, что пугает,
            выстраиваю систему и помогаю прийти на экзамен уверенным. Без паники, без зубрёжки.
          </p>
          <div className="hero-ctas flex flex-wrap gap-3">
            <Btn>Написать мне <ArrowUpRight size={16} strokeWidth={2} /></Btn>
            <Btn secondary>Пройти диагностику</Btn>
          </div>
        </div>

        {/* Aside — personal note */}
        <aside className="hero-aside hidden lg:block">
          <div
            className="border border-[var(--color-border)] bg-[var(--color-card)] p-7"
            style={{ boxShadow: 'var(--shadow-card)' }}
          >
            <div className="mb-4 font-serif text-4xl italic leading-none text-[var(--color-accent)] opacity-40" aria-hidden>
              "
            </div>
            <p className="pull-quote text-base leading-relaxed">
              Мне важно не просто «натаскать» на экзамен. Важно,
              чтобы ребёнок понял язык и пришёл на ЕГЭ с ощущением:
              я готов, я справлюсь.
            </p>
            <p className="mt-5 text-sm text-[var(--color-muted)]">— Алеся</p>
          </div>
        </aside>
      </div>
    </section>
  );
}

/* ── Stats row ──────────────────────────────────────── */
function StatsRow() {
  const items = [
    { value: '100+', label: 'учеников' },
    { value: '85–95', label: 'средний балл ЕГЭ' },
    { value: '4–5', label: 'оценки по ОГЭ' },
    { value: 'МГУ · ВШЭ · МГИМО', label: 'вузы выпускников' },
  ];
  return (
    <div className="border-y border-[var(--color-border)] bg-[var(--color-surface)]">
      <div className="mx-auto grid max-w-5xl grid-cols-2 divide-x divide-y divide-[var(--color-border)] sm:grid-cols-4 sm:divide-y-0 px-6 sm:px-8">
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

/* ── Pains section ──────────────────────────────────── */
const pains = [
  {
    exam: 'ОГЭ · 9 класс',
    q: '«Первый экзамен в жизни — не знаю, чего ожидать»',
    a: 'Страх неизвестного сильнее страха самого материала. Разбираем формат, проходим пробные условия — и неизвестность исчезает.',
  },
  {
    exam: 'ОГЭ и ЕГЭ',
    q: 'Устная часть — говорить вслух страшно',
    a: 'Боязнь ошибиться перед экзаменатором — самая частая причина потери баллов. Практикуем говорение в безопасной обстановке, без осуждения.',
  },
  {
    exam: 'ОГЭ',
    q: 'Монолог по картинке — о чём вообще говорить?',
    a: 'Учу строить связный монолог по структуре, а не перечислять объекты. После нескольких занятий это перестаёт быть проблемой.',
  },
  {
    exam: 'ОГЭ и ЕГЭ',
    q: 'Аудирование: слышу, но не понимаю',
    a: 'Учу слышать смысл текста, а не переводить каждое слово. Это навык — и он развивается быстрее, чем кажется.',
  },
  {
    exam: 'ОГЭ и ЕГЭ',
    q: 'Грамматика — хаос и путаница',
    a: 'Объясняю логику языка, а не набор правил. Когда есть понимание — времена, залоги и словообразование встают на место сами.',
  },
  {
    exam: 'ОГЭ и ЕГЭ',
    q: 'До экзамена мало времени',
    a: 'Честно скажу, что реально успеть. Выстроим приоритеты и составим план — без лишнего стресса и нереальных ожиданий.',
  },
];

function Pains() {
  return (
    <section id="approach" className="mx-auto w-full max-w-5xl px-6 py-20 sm:px-8 sm:py-28">
      <SectionTitle
        tag="Я понимаю"
        title="С чем приходят ко мне"
        description="Страх, неопределённость и ощущение «мне это не дано» — не исключение, а правило. Именно с этим я и работаю."
      />
      <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {pains.map((p, i) => (
          <div
            key={p.q}
            className={`reveal reveal-d${Math.min(i + 1, 4)} border border-[var(--color-border)] bg-[var(--color-card)] p-7 transition-all duration-300 hover:border-[var(--color-border-mid)]`}
            style={{ boxShadow: 'var(--shadow-card)' }}
          >
            <p className="mb-3 text-xs font-medium uppercase tracking-[0.18em] text-[var(--color-accent)] opacity-70">
              {p.exam}
            </p>
            <p className="mb-4 font-serif text-xl leading-snug">{p.q}</p>
            <p className="text-sm leading-relaxed text-[var(--color-muted)]">{p.a}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ── Quote block ────────────────────────────────────── */
function QuoteBlock() {
  return (
    <section className="bg-[var(--color-surface)] py-16 sm:py-20">
      <div className="reveal mx-auto max-w-3xl px-6 sm:px-8">
        <div
          className="font-serif text-[5rem] leading-none text-[var(--color-accent)] opacity-25"
          aria-hidden
        >
          "
        </div>
        <blockquote className="pull-quote mt-2 text-xl leading-relaxed sm:text-2xl">
          Страх перед экзаменом — это не про способности. Это про то, что
          нужно больше практики в&nbsp;правильных условиях. Каждый ребёнок,
          с&nbsp;которым я работала, мог больше, чем думал о&nbsp;себе в начале.
        </blockquote>
        <p className="mt-6 text-sm text-[var(--color-muted)]">— Алеся, репетитор по ЕГЭ по английскому</p>
      </div>
    </section>
  );
}

/* ── How I work ─────────────────────────────────────── */
const trustPoints = [
  { n: '01', title: 'Сначала — честная диагностика', text: 'Смотрю, где реальный уровень, что тормозит, чего боится ученик. Без оценок и без осуждения.' },
  { n: '02', title: 'Стратегия под конкретного человека', text: 'Не шаблонный план, а маршрут под уровень, цель и время до экзамена.' },
  { n: '03', title: 'Работа с тем, что пугает', text: 'Устная часть, аудирование, грамматические ловушки — разбираем именно это, не то, что проще.' },
  { n: '04', title: 'Родители видят прогресс', text: 'Регулярно рассказываю, как идёт подготовка. Не только баллы — что изменилось, что ещё нужно.' },
  { n: '05', title: 'Честность про сроки и ожидания', text: 'Не обещаю невозможного. Если пришли в феврале 11 класса — скажу прямо, что реалистично.' },
];

function HowIWork() {
  return (
    <section className="mx-auto w-full max-w-5xl px-6 py-20 sm:px-8 sm:py-28">
      <SectionTitle
        tag="Как я работаю"
        title="Не «натаскиваю», а разбираюсь вместе"
        description="Мой подход — это не прогон вариантов ЕГЭ до автоматизма. Это понимание языка и уверенность в себе."
      />
      <div className="mt-12 space-y-px">
        {trustPoints.map((p, i) => (
          <div
            key={p.n}
            className={`reveal reveal-d${i + 1} group flex items-start gap-6 border border-[var(--color-border)] bg-[var(--color-card)] p-6 transition-all duration-300 hover:border-[var(--color-border-mid)] hover:bg-[var(--color-bg)]`}
          >
            <span className="mt-0.5 font-serif text-2xl italic text-[var(--color-accent)] opacity-40 transition-opacity duration-300 group-hover:opacity-80">
              {p.n}
            </span>
            <div>
              <p className="mb-1.5 font-medium text-[var(--color-text)]">{p.title}</p>
              <p className="text-sm leading-relaxed text-[var(--color-muted)]">{p.text}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ── For whom ───────────────────────────────────────── */
const forWhomItems = [
  {
    grade: '9 класс · ОГЭ',
    title: 'Первый экзамен — хочется сдать хорошо и не облажаться',
    text: 'Разбираем формат ОГЭ с нуля, убираем страх перед устной частью. Хорошая оценка по ОГЭ — это ещё и хороший аттестат при поступлении в колледж или профильный класс.',
  },
  {
    grade: '9 класс · ОГЭ + задел на ЕГЭ',
    title: 'Планируете сдавать ЕГЭ по английскому через 2 года',
    text: 'ОГЭ — лучший момент выстроить фундамент. Те, кто начинает с 9 класса, приходят к ЕГЭ уже без паники и без нуля за плечами.',
  },
  {
    grade: '10–11 класс · ЕГЭ',
    title: 'Цель — поступить в МГУ, ВШЭ или МГИМО на бюджет',
    text: 'Работаю на конкретный результат: 85–95+ баллов. Разбираем слабые зоны, устраняем «ловушки» в заданиях, прокачиваем устную и письменную часть.',
  },
  {
    grade: 'Родителям',
    title: 'Хочется понимать, как идёт подготовка',
    text: 'Регулярно рассказываю, где ребёнок сейчас, что изменилось, что ещё нужно сделать. Никаких «всё хорошо» без подробностей.',
  },
];

function ForWhom() {
  return (
    <section id="for-whom" className="bg-[var(--color-surface)] py-20 sm:py-28">
      <div className="mx-auto w-full max-w-5xl px-6 sm:px-8">
        <SectionTitle
          tag="Для кого"
          title="Эта работа подойдёт, если…"
        />
        <div className="mt-12 grid gap-5 sm:grid-cols-2">
          {forWhomItems.map((item, i) => (
            <div
              key={item.title}
              className={`reveal reveal-d${i + 1} group border-l-2 border-[var(--color-accent)] border-opacity-30 bg-[var(--color-card)] p-7 transition-all duration-300 hover:border-opacity-100`}
              style={{ boxShadow: 'var(--shadow-card)', borderLeftColor: 'rgba(168,82,42,0.28)' }}
            >
              <p className="mb-3 text-xs font-medium uppercase tracking-[0.18em] text-[var(--color-accent)] opacity-70">
                {item.grade}
              </p>
              <h3 className="mb-3 font-serif text-xl leading-snug">{item.title}</h3>
              <p className="text-sm leading-relaxed text-[var(--color-muted)]">{item.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── Results ────────────────────────────────────────── */
const results = [
  { score: '94', from: '67', university: 'НИУ ВШЭ', outcome: 'Факультет мировой экономики', months: '8 месяцев работы' },
  { score: '91', from: null, university: 'МГИМО', outcome: 'Международные отношения', months: 'Поступление на бюджет' },
  { score: '88', from: null, university: 'МГУ', outcome: 'Иностранные языки и регионоведение', months: 'Поступление на бюджет' },
];

function Results() {
  return (
    <section id="results" className="mx-auto w-full max-w-5xl px-6 py-20 sm:px-8 sm:py-28">
      <SectionTitle
        tag="Результаты"
        title="Реальные истории учеников"
        description="Каждый балл — это месяцы работы, преодоление страха и конкретный выход на нужный результат."
      />
      <div className="mt-12 grid gap-5 sm:grid-cols-3">
        {results.map((r, i) => (
          <div
            key={r.university}
            className={`reveal reveal-d${i + 1} relative overflow-hidden border border-[var(--color-border)] bg-[var(--color-card)] p-7 transition-all duration-300 hover:border-[var(--color-border-mid)]`}
            style={{ boxShadow: 'var(--shadow-card)' }}
          >
            {/* Score */}
            <div className="mb-6 flex items-end gap-2">
              {r.from && (
                <>
                  <span className="font-serif text-3xl font-medium text-[var(--color-muted)]">{r.from}</span>
                  <span className="mb-1 text-sm text-[var(--color-accent)]">→</span>
                </>
              )}
              <span
                className="font-serif font-medium leading-none text-[var(--color-accent)]"
                style={{ fontSize: '3.8rem', letterSpacing: '-0.04em' }}
              >
                {r.score}
              </span>
              <span className="mb-2 text-sm text-[var(--color-muted)]">б.</span>
            </div>
            <div className="border-t border-[var(--color-border)] pt-5">
              <p className="font-serif text-xl">{r.university}</p>
              <p className="mt-2 text-sm leading-relaxed text-[var(--color-muted)]">{r.outcome}</p>
              <p className="mt-4 text-xs font-medium uppercase tracking-[0.14em] text-[var(--color-accent)]">
                {r.months}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ── Diagnostic CTA ─────────────────────────────────── */
function DiagnosticCTA() {
  return (
    <section id="diagnostics" className="bg-[var(--color-surface)] py-20 sm:py-28">
      <div className="mx-auto w-full max-w-5xl px-6 sm:px-8">
        <div
          className="reveal border border-[var(--color-border-mid)] bg-[var(--color-card)] p-10 sm:p-14"
          style={{ boxShadow: 'var(--shadow-soft)' }}
        >
          <Tag>Бесплатно · 5 минут</Tag>
          <Rule />
          <h2 className="mt-5 max-w-xl font-serif text-3xl leading-snug sm:text-4xl">
            Узнайте, на какой балл ЕГЭ готов ваш ребёнок прямо сейчас
          </h2>
          <p className="mt-5 max-w-lg leading-relaxed text-[var(--color-muted)]">
            Диагностика покажет реальный уровень, конкретные слабые места и честный прогноз.
            Без оценок — только понимание ситуации и план, что делать дальше.
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <Btn>Пройти диагностику <ArrowUpRight size={16} strokeWidth={2} /></Btn>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── Testimonials ───────────────────────────────────── */
const testimonials = [
  {
    quote: 'Ребёнок перестал бояться экзамена, а я впервые увидела прозрачный план подготовки. Результат 91 балл полностью совпал с прогнозом.',
    author: 'Елена',
    role: 'мама выпускника',
  },
  {
    quote: 'Очень бережный, но требовательный подход. За 8 месяцев сын вышел с 67 на 94 и поступил в ВШЭ на бюджет. Я не верила, что это возможно.',
    author: 'Мария',
    role: 'мама ученика',
  },
  {
    quote: 'Подготовка стала системной и спокойной. Без хаоса, без перегруза, и главное — я перестал бояться устной части.',
    author: 'Артём',
    role: 'выпускник',
  },
];

function Testimonials() {
  return (
    <section id="testimonials" className="mx-auto w-full max-w-5xl px-6 py-20 sm:px-8 sm:py-28">
      <SectionTitle
        tag="Отзывы"
        title="Что говорят ученики и родители"
      />
      <div className="mt-12 grid gap-5 sm:grid-cols-3">
        {testimonials.map((t, i) => (
          <div
            key={t.author}
            className={`reveal reveal-d${i + 1} border border-[var(--color-border)] bg-[var(--color-card)] p-7`}
            style={{ boxShadow: 'var(--shadow-card)' }}
          >
            <div className="font-serif text-4xl italic leading-none text-[var(--color-accent)] opacity-30" aria-hidden>
              "
            </div>
            <p className="mt-3 font-serif text-base italic leading-relaxed">{t.quote}</p>
            <div className="mt-6 border-t border-[var(--color-border)] pt-5">
              <p className="text-sm font-medium">{t.author}</p>
              <p className="mt-0.5 text-xs text-[var(--color-muted)]">{t.role}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ── Final CTA ──────────────────────────────────────── */
function FinalCTA() {
  return (
    <section id="contact" className="bg-[var(--color-surface)] py-20 sm:py-28">
      <div className="mx-auto w-full max-w-5xl px-6 sm:px-8">
        <div
          className="reveal border border-[var(--color-border-mid)] bg-[var(--color-card)] p-10 sm:p-14"
          style={{ boxShadow: 'var(--shadow-soft)' }}
        >
          <Tag>Давайте познакомимся</Tag>
          <Rule />
          <h2 className="mt-5 max-w-xl font-serif text-3xl leading-snug sm:text-4xl">
            Первая встреча — это просто разговор
          </h2>
          <p className="mt-5 max-w-lg leading-relaxed text-[var(--color-muted)]">
            Без давления и без обещаний. Хочу понять ситуацию вашего ребёнка, честно оценить
            её и сказать, чем могу реально помочь. Иногда это уже даёт ясность.
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <Btn>Написать Алесе <ArrowUpRight size={16} strokeWidth={2} /></Btn>
            <Btn secondary>Пройти диагностику</Btn>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── Footer ─────────────────────────────────────────── */
function Footer() {
  return (
    <footer className="border-t border-[var(--color-border)] px-6 py-8 sm:px-8">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-4">
        <span className="font-serif text-[var(--color-muted)]">Алеся · Репетитор по английскому</span>
        <p className="text-xs text-[var(--color-muted)] opacity-50">
          Подготовка к ЕГЭ · Индивидуально
        </p>
      </div>
    </footer>
  );
}

/* ── App ────────────────────────────────────────────── */
export default function App() {
  useScrollReveal();
  return (
    <div className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)]">
      <Nav />
      <Hero />
      <StatsRow />
      <Pains />
      <QuoteBlock />
      <HowIWork />
      <ForWhom />
      <Results />
      <DiagnosticCTA />
      <Testimonials />
      <FinalCTA />
      <Footer />
    </div>
  );
}
