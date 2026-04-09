import { useEffect } from 'react';
import type { SeoSettings } from '../types/content';

export function useSeoMeta(seo: SeoSettings | null) {
  useEffect(() => {
    if (!seo) return;

    document.title = seo.meta_title;

    const ensureMeta = (name: string, content: string, attr: 'name' | 'property' = 'name') => {
      const selector = attr === 'name' ? `meta[name="${name}"]` : `meta[property="${name}"]`;
      const element = document.querySelector(selector) ?? document.createElement('meta');
      element.setAttribute(attr, name);
      element.setAttribute('content', content ?? '');
      if (!element.parentElement) document.head.appendChild(element);
    };

    ensureMeta('description', seo.meta_description);
    ensureMeta('og:title', seo.og_title || seo.meta_title, 'property');
    ensureMeta('og:description', seo.og_description || seo.meta_description, 'property');

    if (seo.og_image_url) ensureMeta('og:image', seo.og_image_url, 'property');

    const canonical = document.querySelector('link[rel="canonical"]') ?? document.createElement('link');
    canonical.setAttribute('rel', 'canonical');
    if (seo.canonical_url) canonical.setAttribute('href', seo.canonical_url);
    if (!canonical.parentElement) document.head.appendChild(canonical);
  }, [seo]);
}
