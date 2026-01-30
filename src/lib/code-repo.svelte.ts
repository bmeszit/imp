import type { Lang, PageId, Filename, Pages } from "$lib";

function key(lang: Lang, pageId: PageId): string {
  return `lang-${lang}-page-${pageId}`;
}

export function createCodeRepo(defaults: Pages, getLang: () => Lang ) {
  let pages = $state<Pages>({ hu: {}, en: {} });

  for (const lang of ["hu", "en"] as const) {
    for (const pageId in defaults[lang]) {
      const raw = localStorage.getItem(key(lang, pageId as PageId));
      const stored = (raw ? JSON.parse(raw) : {});

      pages[lang][pageId as PageId] = {
        ...defaults[lang][pageId as PageId],
        ...stored,
      };

      for (const fname in stored) {
        const def = defaults[lang][pageId as PageId]?.[fname as Filename];
        const cur = stored[fname];
        const curVersion = typeof cur?.version === "number" ? cur.version : 0;
        if (def && def.version > curVersion) {
          pages[lang][pageId as PageId][fname as Filename] = def;
        }
      }
    }
  }

  function save(pageId: PageId): void {
    const lang = getLang();
    localStorage.setItem(key(lang, pageId), JSON.stringify(pages[lang][pageId]));
  }

  function list(pageId: PageId): Filename[] {
    const lang = getLang();
    return Object.keys(pages[lang][pageId]) as Filename[];
  }

  function get(pageId: PageId, filename: Filename): string {
    const lang = getLang();
    const page = pages[lang][pageId];
    if (!page[filename]) {
      page[filename] = { content: "", version: 0 };
      save(pageId);
    }
    return page[filename].content;
  }

  function set(pageId: PageId, filename: Filename, content: string): void {
    const lang = getLang();
    const page = pages[lang][pageId];
    const version = page[filename]?.version ?? 0;
    page[filename] = { content, version };
    save(pageId);
  }

  function del(pageId: PageId, filename: Filename): void {
    const lang = getLang();
    delete pages[lang][pageId][filename];
    save(pageId);
  }

  function rename(pageId: PageId, from: Filename, to: Filename): boolean {
    const lang = getLang();
    if (from === to) return true;
    const page = pages[lang][pageId];
    if (!page[from] || page[to]) return false;
    page[to] = page[from];
    delete page[from];
    save(pageId);
    return true;
  }

  function reset(pageId: PageId): void {
    const lang = getLang();
    pages[lang][pageId] = { ...defaults[lang][pageId] };
    save(pageId);
  }

  return { pages, list, get, set, del, rename, reset };
}
