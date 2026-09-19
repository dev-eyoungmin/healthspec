import { marked, type Tokens } from 'marked';

/** Where a repo-relative path ends up on the site; anything absent stays a link to GitHub. */
export const PAGES: Record<string, string> = {
  'README.md': 'index.html',
  'spec/SPEC.md': 'spec.html',
  'CHANGELOG.md': 'changelog.html',
  'docs/guides/incremental-sync.md': 'guides/incremental-sync.html',
  'docs/guides/testing.md': 'guides/testing.html',
  'docs/guides/errors.md': 'guides/errors.html',
  'docs/migration/from-react-native-healthkit.md': 'migration/from-react-native-healthkit.html',
  'docs/migration/from-react-native-health-connect.md': 'migration/from-react-native-health-connect.html',
  'docs/migration/from-react-native-health.md': 'migration/from-react-native-health.html',
  'docs/mapping/README.md': 'types/index.html',
  'docs/NATIVE-VERIFICATION.md': 'verification.html',
  'CONTRIBUTING.md': 'contributing.html',
};

export const GITHUB = 'https://github.com/dev-eyoungmin/healthspec';
const BLOB = `${GITHUB}/blob/main/`;

export const escapeHtml = (s: string): string =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/** `guides/testing.html` is two levels in, so its links to the root need `../`. */
export const prefixFor = (out: string): string => '../'.repeat(out.split('/').length - 1);

export const slug = (text: string): string =>
  text
    .toLowerCase()
    .replace(/<[^>]+>/g, '')
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');

/** Resolves `../../spec/SPEC.md` from a source file to a site page, a GitHub blob, or leaves it alone. */
function resolveLink(href: string, sourceFile: string, out: string): string {
  if (/^(https?:|mailto:|#)/.test(href)) return href;
  const [target, hash = ''] = href.split('#');
  const fragment = hash ? `#${hash}` : '';
  if (!target) return fragment;
  const dir = sourceFile.split('/').slice(0, -1).join('/');
  const parts = (dir ? `${dir}/${target}` : target).split('/');
  const resolved: string[] = [];
  for (const part of parts) {
    if (part === '.' || part === '') continue;
    if (part === '..') resolved.pop();
    else resolved.push(part);
  }
  const repoPath = resolved.join('/');
  const page = PAGES[repoPath];
  if (page) return prefixFor(out) + page + fragment;
  // A directory README, e.g. docs/mapping/ → its page.
  const asReadme = PAGES[`${repoPath}/README.md`];
  if (asReadme) return prefixFor(out) + asReadme + fragment;
  return BLOB + repoPath + fragment;
}

export interface RenderedMarkdown {
  html: string;
  /** `##` headings, for the in-page table of contents. */
  headings: Array<{ level: number; text: string; id: string }>;
  /** The first `#` heading, used as the page title. */
  title?: string;
}

/** Renders one markdown document, rewriting its links and collecting its headings. */
export function renderMarkdown(source: string, sourceFile: string, out: string): RenderedMarkdown {
  const headings: RenderedMarkdown['headings'] = [];
  let title: string | undefined;

  const renderer = new marked.Renderer();
  renderer.link = ({ href, title: linkTitle, tokens }: Tokens.Link) => {
    const text = marked.Parser.parseInline(tokens);
    const resolved = resolveLink(href, sourceFile, out);
    const external = /^https?:/.test(resolved);
    return `<a href="${escapeHtml(resolved)}"${linkTitle ? ` title="${escapeHtml(linkTitle)}"` : ''}${external ? ' rel="noreferrer"' : ''}>${text}</a>`;
  };
  renderer.heading = ({ tokens, depth }: Tokens.Heading) => {
    const text = marked.Parser.parseInline(tokens);
    const id = slug(text);
    if (depth === 1 && !title) {
      title = text.replace(/<[^>]+>/g, '');
      return `<h1 id="${id}">${text}</h1>`;
    }
    if (depth <= 3) headings.push({ level: depth, text, id });
    return `<h${depth} id="${id}"><a class="anchor" href="#${id}" aria-hidden="true">#</a>${text}</h${depth}>`;
  };

  const html = marked.parse(source, { renderer, async: false, gfm: true }) as string;
  return { html, headings, ...(title === undefined ? {} : { title }) };
}

export interface LayoutOptions {
  /** Site-relative output path, e.g. `guides/testing.html`. */
  out: string;
  title: string;
  description: string;
  body: string;
  /** Which top-level navigation entry to mark as current. */
  section?: string;
  toc?: RenderedMarkdown['headings'];
  /** Extra markup before `</body>`, e.g. the type index's search script. */
  scripts?: string;
  /** The repo-relative file this page was generated from, linked at the bottom. */
  sourceFile?: string;
  wide?: boolean;
  /** Extra class on <body>, e.g. the landing page's wider measure. */
  bodyClass?: string;
}

const NAV: Array<{ href: string; label: string; section: string }> = [
  { href: 'index.html', label: 'Overview', section: 'home' },
  { href: 'types/index.html', label: 'Health types', section: 'types' },
  { href: 'guides/index.html', label: 'Guides', section: 'guides' },
  { href: 'spec.html', label: 'Specification', section: 'spec' },
];

export function layout(options: LayoutOptions): string {
  const p = prefixFor(options.out);
  const nav = NAV.map(
    (item) => `<a href="${p}${item.href}"${options.section === item.section ? ' aria-current="page"' : ''}>${item.label}</a>`,
  ).join('');
  const toc =
    options.toc && options.toc.length > 2
      ? `<nav class="toc" aria-label="On this page"><p>On this page</p><ul>${options.toc
          .map((h) => `<li class="toc-${h.level}"><a href="#${h.id}">${h.text}</a></li>`)
          .join('')}</ul></nav>`
      : '';
  const source = options.sourceFile
    ? `<p class="source">This page is generated from <a href="${BLOB}${options.sourceFile}" rel="noreferrer">${options.sourceFile}</a>.</p>`
    : '';

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${escapeHtml(options.title)}</title>
<meta name="description" content="${escapeHtml(options.description)}">
<meta property="og:title" content="${escapeHtml(options.title)}">
<meta property="og:description" content="${escapeHtml(options.description)}">
<meta property="og:type" content="website">
<link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>♥</text></svg>">
<link rel="stylesheet" href="${p}assets/site.css">
</head>
<body${[options.wide ? 'wide' : '', options.bodyClass ?? ''].filter(Boolean).join(' ') ? ` class="${[options.wide ? 'wide' : '', options.bodyClass ?? ''].filter(Boolean).join(' ')}"` : ''}>
<a class="skip" href="#main">Skip to content</a>
<header class="top">
  <a class="brand" href="${p}index.html"><span aria-hidden="true">♥</span> HealthSpec</a>
  <nav aria-label="Main">${nav}</nav>
  <a class="gh" href="${GITHUB}" rel="noreferrer">GitHub</a>
</header>
<div class="page">
${toc}
<main id="main">
${options.body}
${source}
</main>
</div>
<footer>
  <p>MIT licensed · <a href="${GITHUB}" rel="noreferrer">github.com/dev-eyoungmin/healthspec</a></p>
  <p class="pre">Pre-release: behaviour on physical devices is still being verified.</p>
</footer>
${options.scripts ?? ''}
</body>
</html>
`;
}
