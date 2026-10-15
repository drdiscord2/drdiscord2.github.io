import { useEffect } from 'react';

const BASE = 'https://infomachine.github.io/';

function setMeta(attr: 'name' | 'property', key: string, value: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.content = value;
}

export function useSeo(opts: { title: string; description?: string; image?: string; jsonLd?: Record<string, unknown> }) {
  useEffect(() => {
    document.title = `${opts.title} · Infomachine`;
    setMeta('name', 'description', opts.description ?? 'Infomachine — PC hardware database, benchmarks and PC builder.');
    setMeta('property', 'og:title', opts.title);
    setMeta('property', 'og:description', opts.description ?? 'PC hardware database, benchmarks and PC builder.');
    setMeta('property', 'og:url', window.location.href);
    setMeta('property', 'og:image', opts.image ?? `${BASE}icons/icon-512.png`);
    setMeta('name', 'twitter:title', opts.title);
    setMeta('name', 'twitter:description', opts.description ?? '');
    let ld = document.getElementById('im-page-jsonld');
    if (opts.jsonLd) {
      if (!ld) {
        ld = document.createElement('script');
        (ld as HTMLElement).id = 'im-page-jsonld';
        (ld as HTMLScriptElement).type = 'application/ld+json';
        document.head.appendChild(ld);
      }
      ld.textContent = JSON.stringify(opts.jsonLd);
    } else if (ld) {
      ld.remove();
    }
  }, [opts.title, opts.description, opts.image, JSON.stringify(opts.jsonLd ?? {})]);
}
