import { useEffect } from 'react';
import { ExternalLink, Phone, Send } from 'lucide-react';
import { captureAttribution, trackEvent } from '../../lib/analytics';
import './contact-landing.css';

const message = 'Здравствуйте, Алеся Александровна! Увидела ваше объявление. Хотела бы узнать о занятиях английским.';
const whatsappUrl = `https://wa.me/79153201845?text=${encodeURIComponent(message)}`;
const telegramUrl = 'https://t.me/Olesyadeya';
const channels = [
  { label: 'Написать в WhatsApp', note: '+7 915 320-18-45', href: whatsappUrl, event: 'contact_whatsapp_click' as const, icon: Send },
  { label: 'Написать в Telegram', note: '@Olesyadeya', href: telegramUrl, event: 'contact_telegram_click' as const, icon: Send },
  { label: 'Позвонить', note: '+7 915 320-18-45', href: 'tel:+79153201845', event: 'contact_phone_click' as const, icon: Phone },
];

export function ContactLandingPage() {

  useEffect(() => {
    captureAttribution();
    trackEvent('page_view');
    const previousTitle = document.title;
    document.title = 'Связаться с Алесей Александровной';
    const canonical = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    const previousCanonical = canonical?.href;
    canonical?.setAttribute('href', 'https://olesiapro.ru/contact');
    return () => {
      document.title = previousTitle;
      if (canonical && previousCanonical) canonical.href = previousCanonical;
    };
  }, []);

  return <main className="qr-contact-page">
    <section className="qr-contact-card" aria-labelledby="contact-name">
      <header className="qr-contact-heading">
        <p className="qr-kicker">Преподаватель английского языка</p>
        <h1 id="contact-name">Алеся Александровна</h1>
        <p>Индивидуальные занятия онлайн.<br />Английский без стресса.</p>
      </header>

      <div className="qr-contact-prompt">
        <h2>Выберите удобный способ связи</h2>
      </div>

      <div className="qr-channel-list" aria-label="Способы связи">
        {channels.map(({ label, note, href, event, icon: Icon }) => (
          <a key={label} href={href} className="qr-channel" target={href.startsWith('http') ? '_blank' : undefined} rel="noreferrer" onClick={() => trackEvent(event)}>
            <Icon aria-hidden size={21} />
            <span><strong>{label}</strong><small>{note}</small></span>
            {href.startsWith('http') && <ExternalLink className="qr-channel-arrow" aria-hidden size={17} />}
          </a>
        ))}
      </div>
    </section>
  </main>;
}
