/** The whole stylesheet: one file, no framework, light and dark from the reader's system. */
export const STYLESHEET = `:root {
  color-scheme: light dark;
  --bg: #fdfdfc;
  --fg: #1c1b19;
  --muted: #6b6862;
  --line: #e4e1db;
  --card: #ffffff;
  --accent: #b8402f;
  --accent-soft: #fbeeeb;
  --code-bg: #f5f3ef;
  --yes: #2f7a4f;
  --no: #a8a29a;
  --radius: 10px;
  --measure: 46rem;
}

@media (prefers-color-scheme: dark) {
  :root {
    --bg: #171614;
    --fg: #eae7e1;
    --muted: #a09a91;
    --line: #322f2b;
    --card: #1f1e1b;
    --accent: #ef8a72;
    --accent-soft: #2c211e;
    --code-bg: #232120;
    --yes: #67b98a;
    --no: #6b6862;
  }
}

* { box-sizing: border-box; }

html { -webkit-text-size-adjust: 100%; }

body {
  margin: 0;
  background: var(--bg);
  color: var(--fg);
  font: 16px/1.65 ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", sans-serif;
  text-rendering: optimizeLegibility;
}

code, pre, .mono { font-family: ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, monospace; }

a { color: var(--accent); text-decoration-thickness: 1px; text-underline-offset: 2px; }
a:hover { text-decoration-thickness: 2px; }

.skip { position: absolute; left: -9999px; }
.skip:focus { left: 1rem; top: 1rem; background: var(--card); padding: .5rem 1rem; z-index: 10; border-radius: var(--radius); }

/* ---------------------------------------------------------------- chrome */

.top {
  display: flex;
  align-items: center;
  gap: 1.25rem;
  flex-wrap: wrap;
  padding: .85rem 1.5rem;
  border-bottom: 1px solid var(--line);
  position: sticky;
  top: 0;
  background: color-mix(in srgb, var(--bg) 92%, transparent);
  backdrop-filter: blur(8px);
  z-index: 5;
}
.brand { font-weight: 650; color: var(--fg); text-decoration: none; letter-spacing: -.01em; }
.brand span { color: var(--accent); }
.top nav { display: flex; gap: 1.1rem; flex-wrap: wrap; margin-right: auto; }
.top nav a { color: var(--muted); text-decoration: none; font-size: .95rem; }
.top nav a:hover { color: var(--fg); }
.top nav a[aria-current="page"] { color: var(--fg); font-weight: 600; }
.gh { color: var(--muted); text-decoration: none; font-size: .95rem; }

.page { display: flex; gap: 2.5rem; align-items: flex-start; padding: 0 1.5rem; max-width: 74rem; margin: 0 auto; }
main { flex: 1; min-width: 0; padding: 2.5rem 0 4rem; max-width: var(--measure); margin-inline: auto; }
body.wide main { max-width: none; }
body.home { --measure: 58rem; }

footer {
  border-top: 1px solid var(--line);
  padding: 1.5rem;
  color: var(--muted);
  font-size: .9rem;
  text-align: center;
}
footer p { margin: .25rem 0; }
.pre { font-size: .85rem; }

/* ---------------------------------------------------------------- prose */

h1 { font-size: 2rem; line-height: 1.2; letter-spacing: -.02em; margin: 0 0 .75rem; }
h2 { font-size: 1.35rem; margin: 2.5rem 0 .75rem; letter-spacing: -.01em; }
h3 { font-size: 1.05rem; margin: 1.75rem 0 .5rem; }
p, ul, ol { margin: 0 0 1rem; }
li { margin: .25rem 0; }
hr { border: 0; border-top: 1px solid var(--line); margin: 2.5rem 0; }
blockquote { margin: 1rem 0; padding: .5rem 1rem; border-left: 3px solid var(--line); color: var(--muted); }

.lede { font-size: 1.1rem; color: var(--muted); }
.crumbs { font-size: .9rem; color: var(--muted); margin-bottom: .5rem; }
.hint { font-size: .9rem; color: var(--muted); }
.source { margin-top: 3rem; padding-top: 1rem; border-top: 1px solid var(--line); font-size: .85rem; color: var(--muted); }

h2 .anchor, h3 .anchor {
  float: left;
  margin-left: -1.1rem;
  width: 1.1rem;
  color: var(--line);
  text-decoration: none;
  opacity: 0;
}
h2:hover .anchor, h3:hover .anchor { opacity: 1; }
@media (max-width: 55rem) { h2 .anchor, h3 .anchor { display: none; } }

code {
  background: var(--code-bg);
  padding: .1em .35em;
  border-radius: 4px;
  font-size: .9em;
  overflow-wrap: break-word;
}
pre {
  background: var(--code-bg);
  border: 1px solid var(--line);
  border-radius: var(--radius);
  padding: 1rem;
  overflow-x: auto;
  font-size: .875rem;
  line-height: 1.55;
}
pre code { background: none; padding: 0; font-size: inherit; }

table { border-collapse: collapse; width: 100%; margin: 1rem 0; font-size: .95rem; }
th, td { text-align: left; padding: .5rem .65rem; border-bottom: 1px solid var(--line); vertical-align: top; }
th { font-weight: 600; font-size: .85rem; text-transform: uppercase; letter-spacing: .04em; color: var(--muted); }
.prose table, .fields, .types, .summary { display: block; overflow-x: auto; white-space: normal; }
@media (min-width: 45rem) { .prose table, .fields, .types, .summary { display: table; } }

/* ---------------------------------------------------------------- table of contents */

.toc {
  position: sticky;
  top: 4.5rem;
  width: 15rem;
  flex: none;
  padding: 2.5rem 0;
  font-size: .875rem;
  max-height: calc(100vh - 5rem);
  overflow-y: auto;
}
.toc p { color: var(--muted); text-transform: uppercase; letter-spacing: .05em; font-size: .7rem; margin: 0 0 .5rem; }
.toc ul { list-style: none; margin: 0; padding: 0; }
.toc a { color: var(--muted); text-decoration: none; display: block; padding: .15rem 0; }
.toc a:hover { color: var(--fg); }
.toc .toc-3 { padding-left: .9rem; }
@media (max-width: 60rem) { .toc { display: none; } }

/* ---------------------------------------------------------------- landing */

.hero { padding: 3rem 0 1rem; }
.hero h1 { font-size: 2.6rem; max-width: 18ch; }
.hero .lede { max-width: 60ch; }
.cta { display: flex; gap: .75rem; flex-wrap: wrap; margin-top: 1.5rem; }
.button {
  display: inline-block;
  background: var(--accent);
  color: var(--bg);
  padding: .6rem 1.1rem;
  border-radius: var(--radius);
  text-decoration: none;
  font-weight: 550;
}
.button.ghost { background: transparent; color: var(--fg); border: 1px solid var(--line); }
.quick { margin: 2rem 0; }

.tiles { display: grid; gap: 1rem; grid-template-columns: repeat(auto-fit, minmax(16rem, 1fr)); }
.tile {
  background: var(--card);
  border: 1px solid var(--line);
  border-radius: var(--radius);
  padding: 1.1rem 1.2rem;
}
.tile h3 { margin: 0 0 .4rem; font-size: 1rem; }
.tile p { margin: 0; color: var(--muted); font-size: .95rem; }
a.tile.link { text-decoration: none; color: inherit; display: block; }
a.tile.link h3 { color: var(--accent); }
a.tile.link:hover { border-color: var(--accent); }

.summary td:first-child { white-space: nowrap; }
.summary .num { text-align: right; font-variant-numeric: tabular-nums; font-weight: 600; }
.status p { color: var(--muted); }

/* ---------------------------------------------------------------- type reference */

.badges { display: flex; gap: .4rem; flex-wrap: wrap; margin: 0 0 1.5rem; }
.badge {
  font-size: .8rem;
  background: var(--code-bg);
  border: 1px solid var(--line);
  border-radius: 999px;
  padding: .15rem .65rem;
  color: var(--muted);
}
.badge.yes { color: var(--yes); border-color: color-mix(in srgb, var(--yes) 35%, var(--line)); }
.badge.no { color: var(--no); }
code.title { background: none; padding: 0; font-size: 1.9rem; }

.cards { display: grid; gap: 1rem; grid-template-columns: repeat(auto-fit, minmax(17rem, 1fr)); }
.card { background: var(--card); border: 1px solid var(--line); border-radius: var(--radius); padding: 1rem 1.2rem; }
.card h3 { margin: 0 0 .75rem; font-size: .95rem; text-transform: uppercase; letter-spacing: .04em; color: var(--muted); }
.card.absent { background: none; border-style: dashed; }
.card.absent p { color: var(--muted); font-size: .95rem; margin: 0; }
.card dl { margin: 0; display: grid; grid-template-columns: max-content minmax(0, 1fr); gap: .35rem .9rem; font-size: .92rem; }
.card dt { color: var(--muted); white-space: nowrap; }
.card dd { margin: 0; min-width: 0; overflow-wrap: anywhere; }
.card dd code { overflow-wrap: anywhere; }
.notes li { color: var(--muted); }
.req { color: var(--accent); font-weight: 700; }
.more { color: var(--muted); font-size: .85em; }
.only { font-size: .75rem; color: var(--muted); border: 1px solid var(--line); border-radius: 999px; padding: 0 .4rem; white-space: nowrap; }

/* ---------------------------------------------------------------- type index */

.filters { display: flex; gap: .75rem; flex-wrap: wrap; align-items: center; margin: 1.5rem 0 .5rem; }
.search { flex: 1 1 18rem; }
.filters input[type="search"], .filters select {
  width: 100%;
  font: inherit;
  font-size: .95rem;
  padding: .5rem .7rem;
  border: 1px solid var(--line);
  border-radius: var(--radius);
  background: var(--card);
  color: var(--fg);
}
.filters select { width: auto; }
.chips { display: flex; gap: .3rem; flex-wrap: wrap; }
.chips button {
  font: inherit;
  font-size: .9rem;
  padding: .45rem .8rem;
  border: 1px solid var(--line);
  background: var(--card);
  color: var(--muted);
  border-radius: var(--radius);
  cursor: pointer;
}
.chips button.on { color: var(--bg); background: var(--accent); border-color: var(--accent); }
.count { color: var(--muted); font-size: .9rem; margin: 0 0 1rem; }
.empty { color: var(--muted); }

.types td:first-child { min-width: 14rem; }
.types .desc { display: block; color: var(--muted); font-size: .85rem; }
.types .mark { text-align: center; color: var(--yes); }
.types tr:hover td { background: var(--accent-soft); }

.visually-hidden {
  position: absolute;
  width: 1px; height: 1px;
  padding: 0; margin: -1px;
  overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap; border: 0;
}
`;
