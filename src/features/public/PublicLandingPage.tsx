import { useEffect } from 'react';
import { ArrowUpRight, Copy, Phone, Send } from 'lucide-react';
import portrait from '../../assets/alesya-aleksandrovna.jpg';
import { captureAttribution, trackEvent } from '../../lib/analytics';

const directions = ['ЕГЭ', 'ОГЭ', 'Школьный английский', 'Грамматика', 'Разговорный английский'];
const steps = [
  ['01', 'Тестирование', 'Определяем текущий уровень и реальные пробелы.'],
  ['02', 'Цель', 'Фиксируем желаемый результат и доступное время.'],
  ['03', 'Индивидуальный план', 'Собираем понятный маршрут именно для ученика.'],
  ['04', 'Подготовка', 'Спокойно и последовательно движемся к результату.'],
];
const message = 'Здравствуйте, Алеся Александровна! Увидела ваше объявление. Хотела бы узнать о занятиях английским.';
const phone = (import.meta.env.VITE_CONTACT_PHONE as string | undefined)?.trim() ?? '';
const wa = (import.meta.env.VITE_CONTACT_WHATSAPP as string | undefined)?.replace(/\D/g, '') ?? '';
const tg = (import.meta.env.VITE_CONTACT_TELEGRAM as string | undefined)?.trim() ?? '';
const maxValue = (import.meta.env.VITE_CONTACT_MAX as string | undefined)?.trim() ?? '';
const mx = (() => {
  try {
    const url = new URL(maxValue);
    return url.protocol === 'https:' && (url.hostname === 'max.ru' || url.hostname === 'www.max.ru') ? url.toString() : '';
  } catch { return ''; }
})();
type ContactEvent = 'contact_whatsapp_click' | 'contact_telegram_click' | 'contact_max_click' | 'contact_phone_click';
const contacts = [
  wa && ['WhatsApp', `https://wa.me/${wa}?text=${encodeURIComponent(message)}`, 'contact_whatsapp_click'],
  tg && ['Telegram', `${tg}${tg.includes('?') ? '&' : '?'}text=${encodeURIComponent(message)}`, 'contact_telegram_click'],
  mx && ['MAX', mx, 'contact_max_click'],
  phone && ['Позвонить', `tel:${phone.replace(/[^+\d]/g, '')}`, 'contact_phone_click'],
].filter(Boolean) as [string, string, ContactEvent][];

export function PublicLandingPage() {
  useEffect(() => { captureAttribution(); trackEvent('page_view'); }, []);
  return <div className="site-shell">
    <header className="topbar"><a className="wordmark" href="#top">Алеся Александровна</a><a className="quiet-link" href="#contact">Обсудить занятия <ArrowUpRight aria-hidden size={17} /></a></header>
    <main>
      <section className="hero" id="top">
        <div className="hero-copy"><p className="eyebrow">Индивидуальные занятия онлайн</p><h1>Английский<br /><em>без стресса</em></h1><p className="intro">Понятно объясняю и спокойно веду к результату - с учётом уровня, цели и темпа ученика.</p><ul className="directions">{directions.map((item) => <li key={item}>{item}</li>)}</ul><a className="button primary" href="#contact">Начать разговор <ArrowUpRight aria-hidden size={19} /></a></div>
        <div className="portrait"><img src={portrait} alt="Алеся Александровна, преподаватель английского языка" /><div className="caption"><span>Алеся Александровна</span><strong>16 лет преподавания</strong></div></div>
      </section>
      <section className="proof"><div><p className="eyebrow">Результаты учеников на ЕГЭ</p><p>Цифры без громких обещаний - результат совместной последовательной работы.</p></div><div className="scores">{['96', '91', '87'].map((score) => <strong key={score}>{score}</strong>)}</div></section>
      <section className="approach"><div className="heading"><p className="eyebrow">Как строится работа</p><h2>Сначала понять.<br />Потом двигаться.</h2></div><ol className="steps">{steps.map(([number, title, text]) => <li key={number}><span>{number}</span><div><h3>{title}</h3><p>{text}</p></div></li>)}</ol></section>
      <section className="contact" id="contact"><div><p className="eyebrow">Связаться</p><h2>Давайте начнём<br />с разговора</h2><p>Расскажите, какая задача стоит сейчас. Вместе поймём, какой формат подготовки подойдёт.</p></div><div className="contact-panel">{contacts.length ? <div className="contact-grid">{contacts.map(([label, href, event]) => <a className="button contact-button" key={label} href={href} onClick={() => trackEvent(event)} target={href.startsWith('http') ? '_blank' : undefined} rel="noreferrer">{event === 'contact_phone_click' ? <Phone aria-hidden size={19} /> : <Send aria-hidden size={19} />} {label}</a>)}</div> : <p className="unavailable">Контакты уточняются. Кнопки связи появятся здесь сразу после подтверждения номера и профилей.</p>}{phone && <div className="phone-row"><span>{phone}</span><button type="button" onClick={() => navigator.clipboard.writeText(phone)}><Copy aria-hidden size={17} /> Скопировать</button></div>}<div className="message"><p><span>Сообщение уже подготовлено</span>«{message}»</p><button type="button" onClick={() => navigator.clipboard.writeText(message)}><Copy aria-hidden size={17} /> Скопировать текст</button></div></div></section>
    </main>
    <footer><span>Алеся Александровна</span><span>Английский без стресса</span></footer>
  </div>;
}
