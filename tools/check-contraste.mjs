import { readFileSync } from 'node:fs';

const CSS_PATH = new URL('../app/globals.css', import.meta.url);

const hex = (h) => {
  const n = h.replace('#', '');
  return [0, 2, 4].map((i) => parseInt(n.slice(i, i + 2), 16) / 255);
};

const linear = (c) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);

const luminance = (h) => {
  const [r, g, b] = hex(h).map(linear);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};

const contrast = (a, b) => {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
};

function parseTokens(block) {
  const out = {};
  if (!block) return out;
  for (const m of block.matchAll(/--([a-z0-9-]+)\s*:\s*(#[0-9a-fA-F]{3,8})\s*;/g)) {
    out[m[1]] = m[2].toUpperCase();
  }
  return out;
}

let css;
try {
  css = readFileSync(CSS_PATH, 'utf8');
} catch {
  console.error('FALHA: app/globals.css não existe.');
  process.exit(1);
}

const baseMatch = css.match(/:root\s*\{([^}]*)\}/);

if (!baseMatch) {
  console.error('FALHA: nenhum bloco :root encontrado em app/globals.css.');
  process.exit(1);
}

const tokens = parseTokens(baseMatch[1]);

const pairs = [
  ['text sobre bg', 'text', 'bg', 4.5],
  ['text sobre bg-soft', 'text', 'bg-soft', 4.5],
  ['muted sobre bg', 'muted', 'bg', 4.5],
  ['muted sobre bg-soft', 'muted', 'bg-soft', 4.5],
  ['brand sobre bg', 'brand', 'bg', 4.5],
  ['brand sobre bg-soft', 'brand', 'bg-soft', 4.5],
  ['on-brand sobre brand-fill', 'on-brand', 'brand-fill', 4.5],
  ['on-brand sobre brand-strong', 'on-brand', 'brand-strong', 4.5],
  ['line-strong sobre bg', 'line-strong', 'bg', 3],
  ['focus sobre bg', 'focus', 'bg', 3],
  ['grad-from sobre bg (texto grande)', 'grad-from', 'bg', 3],
  ['accent sobre accent-soft', 'accent', 'accent-soft', 4.5],
];

let failures = 0;

console.log('CLARO');
for (const [label, fg, bg, target] of pairs) {
  if (!tokens[fg] || !tokens[bg]) {
    console.log(`FALHA ${label.padEnd(36)} token ausente (${!tokens[fg] ? fg : bg})`);
    failures++;
    continue;
  }
  const ratio = contrast(tokens[fg], tokens[bg]);
  const ok = ratio >= target;
  if (!ok) failures++;
  console.log(`${ok ? 'ok   ' : 'FALHA'} ${label.padEnd(36)} ${ratio.toFixed(2)}:1 (alvo ${target})`);
}

/* O anel de foco sobre o botão cheio não alcança 3:1 contra o preenchimento.
   Quem resolve é o deslocamento: o anel cai no fundo da página. O teste cobra
   a regra dentro do bloco :focus-visible. */
console.log('\nREGRA DE FOCO');
const focusBlock = (css.match(/:focus-visible\s*\{([^}]*)\}/) || ['', ''])[1];
const hasOutline = /outline:\s*2px solid var\(--focus\)/.test(focusBlock);
const offsetMatch = focusBlock.match(/outline-offset:\s*(\d+)px/);
const offset = offsetMatch ? Number(offsetMatch[1]) : 0;
const ruleOk = hasOutline && offset >= 2;

const focusOnFill = tokens.focus && tokens['brand-fill'] ? contrast(tokens.focus, tokens['brand-fill']) : 0;
console.log(`foco sobre brand-fill   ${focusOnFill.toFixed(2)}:1 (reprova de propósito)`);
console.log(`outline-offset no foco  ${offset}px`);

if (!ruleOk) {
  failures++;
  console.log(
    'FALHA: o bloco :focus-visible precisa de `outline: 2px solid var(--focus)` e `outline-offset` >= 2px.'
  );
} else {
  console.log(`ok    anel deslocado para o fundo, onde mede ${contrast(tokens.focus, tokens.bg).toFixed(2)}:1`);
}

console.log(`\n${failures === 0 ? 'TODOS OS PARES PASSAM' : `${failures} VERIFICAÇÃO(ÕES) FALHAM`}`);
process.exit(failures === 0 ? 0 : 1);
