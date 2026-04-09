import type {
  FaqItem,
  HeroContent,
  Lead,
  PublicContent,
  Result,
  Section,
  SectionItem,
  SeoSettings,
  SiteSettings,
  Testimonial,
} from '../types/content';

const now = new Date().toISOString();

export const defaultSiteSettings: SiteSettings = {
  id: 1,
  site_name: 'Алеся - Репетитор по английскому',
  footer_text: 'Подготовка к ЕГЭ и ОГЭ по английскому',
  city: 'Москва',
  telegram_url: 'https://t.me/alesya_english',
  whatsapp_url: 'https://wa.me/79990000000',
  email: 'alesya@example.com',
  phone: '+7 (999) 000-00-00',
  updated_at: now,
};

export const defaultHero: HeroContent = {
  id: 1,
  eyebrow: 'Репетитор по английскому • ОГЭ и ЕГЭ',
  title: 'Подготовка к ОГЭ и ЕГЭ, где ученик перестает бояться и начинает расти',
  subtitle:
    'Работаю с учениками 9-11 классов индивидуально: разбираем страхи, выстраиваем систему и уверенно идем к экзамену. Без паники, без зубрежки.',
  primary_button_text: 'Написать мне',
  primary_button_url: '#contact',
  secondary_button_text: 'Пройти диагностику',
  secondary_button_url: '#lead-form',
  quote_text:
    'Мне важно не просто натаскать на экзамен. Важно, чтобы ученик понял язык и пришел на ЕГЭ с ощущением: я готов, я справлюсь.',
  quote_author: 'Алеся',
  updated_at: now,
};

export const defaultSections: Section[] = [
  {
    id: 1,
    key: 'pains',
    tag: 'Я понимаю',
    title: 'С чем приходят ко мне',
    description: 'Страх, неопределенность и ощущение «мне это не дано» - это не исключение, а правило.',
    type: 'cards',
    sort_order: 1,
    is_published: true,
    updated_at: now,
  },
  {
    id: 2,
    key: 'how_i_work',
    tag: 'Как я работаю',
    title: 'Не «натаскиваю», а разбираюсь вместе',
    description: 'Подход через диагностику, стратегию и регулярную обратную связь.',
    type: 'steps',
    sort_order: 2,
    is_published: true,
    updated_at: now,
  },
  {
    id: 3,
    key: 'for_whom',
    tag: 'Для кого',
    title: 'Эта работа подойдет, если...',
    description: 'Для учеников 9-11 классов и родителей, которым важны прозрачность и результат.',
    type: 'cards',
    sort_order: 3,
    is_published: true,
    updated_at: now,
  },
];

export const defaultSectionItems: SectionItem[] = [
  { id: 1, section_id: 1, title: 'Первый экзамен - не знаю, чего ожидать', subtitle: 'ОГЭ • 9 класс', text: 'Разбираем формат, проводим пробные условия, и неизвестность исчезает.', value: '', label: '', image_url: '', sort_order: 1, is_published: true },
  { id: 2, section_id: 1, title: 'Устная часть - говорить вслух страшно', subtitle: 'ОГЭ и ЕГЭ', text: 'Практикуем говорение в безопасной обстановке, без осуждения.', value: '', label: '', image_url: '', sort_order: 2, is_published: true },
  { id: 3, section_id: 1, title: 'Монолог по картинке - о чем говорить?', subtitle: 'ОГЭ', text: 'Учим строить связный монолог по структуре, а не перечислять объекты.', value: '', label: '', image_url: '', sort_order: 3, is_published: true },
  { id: 4, section_id: 1, title: 'Аудирование: слышу, но не понимаю', subtitle: 'ОГЭ и ЕГЭ', text: 'Учим слышать смысл текста, а не переводить каждое слово.', value: '', label: '', image_url: '', sort_order: 4, is_published: true },
  { id: 5, section_id: 1, title: 'Грамматика - хаос и путаница', subtitle: 'ОГЭ и ЕГЭ', text: 'Объясняю логику языка, чтобы времена и конструкции встали на место.', value: '', label: '', image_url: '', sort_order: 5, is_published: true },
  { id: 6, section_id: 1, title: 'До экзамена мало времени', subtitle: 'ОГЭ и ЕГЭ', text: 'Честно расставляем приоритеты и идем по реалистичному плану.', value: '', label: '', image_url: '', sort_order: 6, is_published: true },

  { id: 7, section_id: 2, title: 'Сначала честная диагностика', subtitle: '', text: 'Определяем реальный уровень, пробелы и зоны тревоги.', value: '01', label: '', image_url: '', sort_order: 1, is_published: true },
  { id: 8, section_id: 2, title: 'Стратегия под конкретного ученика', subtitle: '', text: 'План не по шаблону, а под уровень, цель и сроки.', value: '02', label: '', image_url: '', sort_order: 2, is_published: true },
  { id: 9, section_id: 2, title: 'Работаем с тем, что пугает', subtitle: '', text: 'Устная часть, аудирование, грамматические ловушки — адресно.', value: '03', label: '', image_url: '', sort_order: 3, is_published: true },
  { id: 10, section_id: 2, title: 'Родители видят прогресс', subtitle: '', text: 'Регулярная обратная связь: что изменилось и что дальше.', value: '04', label: '', image_url: '', sort_order: 4, is_published: true },
  { id: 11, section_id: 2, title: 'Честность про сроки и ожидания', subtitle: '', text: 'Не обещаю невозможного, даю реалистичный прогноз.', value: '05', label: '', image_url: '', sort_order: 5, is_published: true },

  { id: 12, section_id: 3, title: '9 класс: ОГЭ', subtitle: 'ОГЭ', text: 'Подготовка к первому экзамену без паники и давления.', value: '', label: '', image_url: '', sort_order: 1, is_published: true },
  { id: 13, section_id: 3, title: '9 класс: фундамент на ЕГЭ', subtitle: 'ОГЭ + ЕГЭ', text: 'Начинаем заранее и выходим к ЕГЭ без хаоса.', value: '', label: '', image_url: '', sort_order: 2, is_published: true },
  { id: 14, section_id: 3, title: '10-11 класс: поступление', subtitle: 'ЕГЭ', text: 'Работа на целевой балл и поступление в нужный вуз.', value: '', label: '', image_url: '', sort_order: 3, is_published: true },
  { id: 15, section_id: 3, title: 'Родителям: прозрачный прогресс', subtitle: 'Контроль', text: 'Понятная динамика и конкретные шаги без “все хорошо”.', value: '', label: '', image_url: '', sort_order: 4, is_published: true },
];

export const defaultResults: Result[] = [
  { id: 1, student_name: 'Анна К.', exam_type: 'ЕГЭ', score: '94', short_text: 'Поступление в ВШЭ на бюджет', duration: '8 месяцев работы', note: 'Старт с 67 баллов', sort_order: 1, is_published: true, created_at: now },
  { id: 2, student_name: 'Илья М.', exam_type: 'ЕГЭ', score: '91', short_text: 'Поступление в МГИМО', duration: '10 месяцев', note: 'Фокус на устной части', sort_order: 2, is_published: true, created_at: now },
  { id: 3, student_name: 'София Н.', exam_type: 'ОГЭ', score: '5', short_text: 'Уверенная сдача ОГЭ', duration: '6 месяцев', note: 'Сняли страх экзамена', sort_order: 3, is_published: true, created_at: now },
];

export const defaultTestimonials: Testimonial[] = [
  { id: 1, author_name: 'Елена', author_role: 'мама выпускника', text: 'Ребенок перестал бояться экзамена, а результат полностью совпал с прогнозом.', stars: 5, avatar_url: '', sort_order: 1, is_published: true, created_at: now },
  { id: 2, author_name: 'Мария', author_role: 'мама ученика', text: 'Очень бережный, но требовательный подход. Вышли на высокий балл и бюджет.', stars: 5, avatar_url: '', sort_order: 2, is_published: true, created_at: now },
  { id: 3, author_name: 'Артем', author_role: 'выпускник', text: 'Перестал бояться устной части и начал реально понимать, как сдавать экзамен.', stars: 5, avatar_url: '', sort_order: 3, is_published: true, created_at: now },
];

export const defaultFaq: FaqItem[] = [
  { id: 1, question: 'Сколько занятий в неделю нужно?', answer: 'Обычно 2 занятия в неделю. Зависит от стартового уровня и срока до экзамена.', category: 'Общее', sort_order: 1, is_published: true, created_at: now },
  { id: 2, question: 'Есть ли диагностика перед стартом?', answer: 'Да, начинаем с диагностики, чтобы построить реалистичный план подготовки.', category: 'Старт', sort_order: 2, is_published: true, created_at: now },
  { id: 3, question: 'Работаете ли с 9 классом?', answer: 'Да, отдельно готовлю к ОГЭ и помогаю заложить базу под ЕГЭ.', category: 'ОГЭ', sort_order: 3, is_published: true, created_at: now },
];

export const defaultSeo: SeoSettings = {
  id: 1,
  page_key: 'home',
  meta_title: 'Репетитор по английскому: ОГЭ и ЕГЭ | Алеся',
  meta_description: 'Индивидуальная подготовка к ОГЭ и ЕГЭ по английскому: диагностика, план и реальный прогресс.',
  og_title: 'Подготовка к ОГЭ и ЕГЭ по английскому',
  og_description: 'Системная подготовка без перегруза с фокусом на результат.',
  og_image_url: '',
  canonical_url: '',
  favicon_url: '',
  updated_at: now,
};

export const defaultLeads: Lead[] = [];

export interface LocalStoreState {
  site_settings: SiteSettings;
  hero_content: HeroContent;
  sections: Section[];
  section_items: SectionItem[];
  results: Result[];
  testimonials: Testimonial[];
  faq: FaqItem[];
  seo_settings: SeoSettings;
  leads: Lead[];
}

export const defaultStoreState: LocalStoreState = {
  site_settings: defaultSiteSettings,
  hero_content: defaultHero,
  sections: defaultSections,
  section_items: defaultSectionItems,
  results: defaultResults,
  testimonials: defaultTestimonials,
  faq: defaultFaq,
  seo_settings: defaultSeo,
  leads: defaultLeads,
};

export const defaultPublicContent: PublicContent = {
  settings: defaultSiteSettings,
  hero: defaultHero,
  sections: defaultSections,
  sectionItems: defaultSectionItems,
  results: defaultResults,
  testimonials: defaultTestimonials,
  faq: defaultFaq,
  seo: defaultSeo,
};
