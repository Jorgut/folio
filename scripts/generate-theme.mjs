#!/usr/bin/env node

/**
 * generate-theme.mjs — 引擎→代码联动
 *
 * 根据视觉风格名，生成对应的：
 *   1. CSS 变量 (color-engine.md → CSS custom properties)
 *   2. Google Fonts <link> 标签 (typography-engine.md → font pairings)
 *   3. 特效 CSS (visual-effects-engine.md → effect classes)
 *
 * 用法:
 *   node scripts/generate-theme.mjs <style-name>
 *   node scripts/generate-theme.mjs editorial       # 编辑风
 *   node scripts/generate-theme.mjs glass            # 毛玻璃
 *   node scripts/generate-theme.mjs all              # 所有风格
 *
 * 输出: 可直接粘贴到 <head> 的 HTML/CSS 代码块
 */

// ─── 视觉风格定义 ─────────────────────────────────────────────────

const STYLES = {
  editorial: {
    name: 'Editorial · 编辑风',
    theme: 'default',
    fonts: {
      heading: { family: 'Playfair Display', weights: [400, 700, 700], italic: true },
      body:    { family: 'Inter',            weights: [300, 400, 500, 600] },
      mono:    { family: 'JetBrains Mono',   weights: [400] },
      quote:   { family: 'Playfair Display', weights: [400], italic: true },
    },
    colors: {
      light: { page: '#f9f9f6', ink: '#1a1a1a', accent: '#a67c52', grey: '#666666' },
      dark:  { page: '#1a1a1a', ink: '#e8e4dc', accent: '#c9a87c', grey: '#999080' },
    },
    effects: ['noise', 'gradient-mesh'],
    description: '杂志风格，图文混排，阅读体验',
  },

  minimal: {
    name: 'Minimal · 极简主义',
    theme: 'mono',
    fonts: {
      heading: { family: 'Inter',              weights: [200, 300, 400] },
      body:    { family: 'Inter',              weights: [300, 400] },
      mono:    { family: 'JetBrains Mono',     weights: [400] },
      quote:   { family: 'Inter',              weights: [300], italic: true },
    },
    colors: {
      light: { page: '#ffffff', ink: '#1a1a1a', accent: '#4a4a4a', grey: '#808080' },
      dark:  { page: '#000000', ink: '#f5f5f5', accent: '#b0b0b0', grey: '#888888' },
    },
    effects: [],
    description: '少即是多，大量留白，无装饰',
  },

  swiss: {
    name: 'Swiss · 瑞士国际主义',
    theme: 'mono',
    fonts: {
      heading: { family: 'Inter', weights: [700, 900] },
      body:    { family: 'Inter', weights: [400] },
      mono:    { family: 'Inter', weights: [400] },
    },
    colors: {
      light: { page: '#ffffff', ink: '#111111', accent: '#d93f3f', grey: '#555555' },
      dark:  { page: '#111111', ink: '#ffffff', accent: '#d93f3f', grey: '#aaaaaa' },
    },
    effects: ['block-color'],
    description: '严格网格，无衬线，原色点缀',
  },

  architectural: {
    name: 'Architectural · 建筑风',
    theme: 'sand',
    fonts: {
      heading: { family: 'Cormorant Garamond', weights: [300, 400, 500] },
      body:    { family: 'Inter',               weights: [300, 400] },
      mono:    { family: 'Inter',               weights: [400] },
      quote:   { family: 'Cormorant Garamond',  weights: [300], italic: true },
    },
    colors: {
      light: { page: '#f2efe8', ink: '#2a2520', accent: '#8a7a6a', grey: '#6a6055' },
      dark:  { page: '#1a1a1a', ink: '#d4cdc0', accent: '#b0a090', grey: '#8a8075' },
    },
    effects: ['noise', 'glass', 'grid-overlay'],
    description: '空间感，细体文字，混凝土质感',
  },

  brutalism: {
    name: 'Brutalism · 粗野主义',
    theme: 'mono',
    fonts: {
      heading: { family: 'Inter', weights: [800, 900] },
      body:    { family: 'Space Mono', weights: [400] },
      mono:    { family: 'Space Mono', weights: [400] },
    },
    colors: {
      light: { page: '#ffffff', ink: '#000000', accent: '#ff0000', grey: '#333333' },
      dark:  { page: '#000000', ink: '#ffffff', accent: '#ff0000', grey: '#cccccc' },
    },
    effects: ['noise', 'exposure'],
    description: '粗犀牛排版，高对比，原色直出',
  },

  glass: {
    name: 'Glass · 毛玻璃',
    theme: 'indigo',
    fonts: {
      heading: { family: 'Inter', weights: [500, 600, 700] },
      body:    { family: 'Inter', weights: [300, 400] },
      mono:    { family: 'JetBrains Mono', weights: [400] },
    },
    colors: {
      light: { page: '#f0f4f8', ink: '#1a1a2e', accent: '#4a6fa5', grey: '#6b7280' },
      dark:  { page: '#0a0e1a', ink: '#e8ecf4', accent: '#6b8fc9', grey: '#8899b0' },
    },
    effects: ['glass', 'aurora'],
    description: '未来感透明层次，毛玻璃面板，高斯模糊',
  },

  dark: {
    name: 'Dark · 深色模式',
    theme: 'indigo',
    fonts: {
      heading: { family: 'Inter', weights: [700, 800, 900] },
      body:    { family: 'Inter', weights: [300, 400] },
      mono:    { family: 'JetBrains Mono', weights: [400] },
    },
    colors: {
      light: { page: '#f5f5f7', ink: '#1a1a1a', accent: '#4a6fa5', grey: '#6b7280' },
      dark:  { page: '#0f0f1a', ink: '#e8ecf4', accent: '#00d4ff', grey: '#6b7280' },
    },
    effects: ['aurora', 'glow'],
    description: '暗底发光，科技感，高对比',
  },

  bento: {
    name: 'Bento · 便当网格',
    theme: 'default',
    fonts: {
      heading: { family: 'Inter', weights: [500, 600, 700] },
      body:    { family: 'Inter', weights: [400] },
      mono:    { family: 'Inter', weights: [400] },
    },
    colors: {
      light: { page: '#f5f5f7', ink: '#1a1a1a', accent: '#4a6fa5', grey: '#6b7280' },
      dark:  { page: '#111111', ink: '#f5f5f7', accent: '#5a8fbf', grey: '#98989d' },
    },
    effects: ['card-shadow'],
    description: '卡片网格，信息密度高，Dashboard 风格',
  },

  luxury: {
    name: 'Luxury · 高端',
    theme: 'default',
    fonts: {
      heading: { family: 'Playfair Display', weights: [400, 500, 600] },
      body:    { family: 'Inter',             weights: [200, 300, 400] },
      mono:    { family: 'JetBrains Mono',    weights: [400] },
      quote:   { family: 'Playfair Display',  weights: [400], italic: true },
    },
    colors: {
      light: { page: '#faf8f5', ink: '#1a1614', accent: '#c9a87c', grey: '#8a8075' },
      dark:  { page: '#1a1614', ink: '#e8e0d8', accent: '#d4b88a', grey: '#a0988a' },
    },
    effects: ['gradient-mesh', 'noise'],
    description: '大量留白，衬线字体，金色强调',
  },

  cyberpunk: {
    name: 'Cyberpunk · 赛博朋克',
    theme: 'neon',
    fonts: {
      heading: { family: 'Orbitron', weights: [400, 500, 600, 700, 800, 900] },
      body:    { family: 'Rajdhani', weights: [300, 400, 500, 600, 700] },
      mono:    { family: 'JetBrains Mono', weights: [400] },
    },
    colors: {
      light: { page: '#f5f5ff', ink: '#0a0a1a', accent: '#00f0ff', grey: '#7a7aaa' },
      dark:  { page: '#0a0a1a', ink: '#e8e8ff', accent: '#00f0ff', grey: '#7a7aaa' },
    },
    effects: ['glow', 'chromatic', 'scanline', 'grid-overlay'],
    description: '霓虹夜色，色差效果，发光线条',
  },
};

// ─── 内置主题色板 (from color-engine.md) ──────────────────────────

const THEMES = {
  default: {
    name: '墨水经典',
    colors: {
      light: { page: '#f9f9f6', ink: '#1a1a1a', accent: '#a67c52', grey: '#666666', 'accent-dim': '#d4c4a8', 'ink-soft': '#555555', hr: 'rgba(0,0,0,0.08)' },
      dark:  { page: '#111111', ink: '#f5f0e8', accent: '#c9a87c', grey: '#999080', 'accent-dim': '#7a6a5a', 'ink-soft': '#a09890', hr: 'rgba(255,255,255,0.08)' },
    },
  },
  indigo: {
    name: '靛蓝瓷',
    colors: {
      light: { page: '#f7f8fc', ink: '#1b1b2a', accent: '#4a6fa5', grey: '#6b7280', 'accent-dim': '#8aafd5', 'ink-soft': '#4a4a5a', hr: 'rgba(0,0,0,0.08)' },
      dark:  { page: '#0f0f1a', ink: '#edf0f7', accent: '#6b8fc9', grey: '#8899b0', 'accent-dim': '#4a6a8a', 'ink-soft': '#a0a8b8', hr: 'rgba(255,255,255,0.08)' },
    },
  },
  forest: {
    name: '森林墨',
    colors: {
      light: { page: '#f6f8f5', ink: '#1a241b', accent: '#5a7a5a', grey: '#5c6b5c', 'accent-dim': '#9aba9a', 'ink-soft': '#4a5a4a', hr: 'rgba(0,0,0,0.08)' },
      dark:  { page: '#0d140e', ink: '#e8efe8', accent: '#7a9a7a', grey: '#7a8a7a', 'accent-dim': '#5a7a5a', 'ink-soft': '#9aaa9a', hr: 'rgba(255,255,255,0.08)' },
    },
  },
  sand: {
    name: '沙丘',
    colors: {
      light: { page: '#f8f6f0', ink: '#2a2520', accent: '#b8955c', grey: '#7a7068', 'accent-dim': '#d4c088', 'ink-soft': '#5a5550', hr: 'rgba(0,0,0,0.08)' },
      dark:  { page: '#1a1612', ink: '#f0e8d8', accent: '#d4b87c', grey: '#8a8078', 'accent-dim': '#a09070', 'ink-soft': '#a09890', hr: 'rgba(255,255,255,0.08)' },
    },
  },
  mono: {
    name: '单色',
    colors: {
      light: { page: '#ffffff', ink: '#1a1a1a', accent: '#4a4a4a', grey: '#808080', 'accent-dim': '#b0b0b0', 'ink-soft': '#555555', hr: 'rgba(0,0,0,0.08)' },
      dark:  { page: '#000000', ink: '#f0f0f0', accent: '#333333', grey: '#888888', 'accent-dim': '#666666', 'ink-soft': '#999999', hr: 'rgba(255,255,255,0.1)' },
    },
  },
  neon: {
    name: '霓虹',
    colors: {
      light: { page: '#f5f5ff', ink: '#0a0a1a', accent: '#00f0ff', grey: '#7a7a9a', 'accent-dim': '#40b0c0', 'ink-soft': '#4a4a6a', hr: 'rgba(0,0,0,0.08)' },
      dark:  { page: '#000011', ink: '#e0e0ff', accent: '#40ffc0', grey: '#7a7aaa', 'accent-dim': '#00a0b0', 'ink-soft': '#8080aa', hr: 'rgba(255,255,255,0.08)' },
    },
  },
  rose: {
    name: '玫瑰',
    colors: {
      light: { page: '#fdf8fa', ink: '#1a1018', accent: '#c45a7a', grey: '#8a6a7a', 'accent-dim': '#d88a9e', 'ink-soft': '#5a4a52', hr: 'rgba(0,0,0,0.08)' },
      dark:  { page: '#0e080c', ink: '#f8ecf0', accent: '#d88a9e', grey: '#8a7a82', 'accent-dim': '#b06a7e', 'ink-soft': '#a09a9e', hr: 'rgba(255,255,255,0.08)' },
    },
  },
  ocean: {
    name: '海洋',
    colors: {
      light: { page: '#f5f8fc', ink: '#0f1a24', accent: '#3a8ab5', grey: '#5a7a8a', 'accent-dim': '#6aaad5', 'ink-soft': '#4a5a6a', hr: 'rgba(0,0,0,0.08)' },
      dark:  { page: '#080e14', ink: '#e8f0f8', accent: '#6aaad5', grey: '#7a8a9a', 'accent-dim': '#3a7a9a', 'ink-soft': '#8a9aaa', hr: 'rgba(255,255,255,0.08)' },
    },
  },
};

// ─── 特效 CSS 片段 (from visual-effects-engine.md) ────────────────

const EFFECTS_CSS = {
  noise: `.noise::after {
  content: '';
  position: absolute; inset: 0;
  background: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
  mix-blend-mode: overlay; opacity: 0.04;
  pointer-events: none;
}`,
  glass: `.glass-panel {
  background: rgba(255,255,255,0.15);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255,255,255,0.2);
  border-radius: 16px;
}
.dark .glass-panel {
  background: rgba(0,0,0,0.3);
  border-color: rgba(255,255,255,0.08);
}`,
  aurora: `.aurora-bg {
  position: absolute; inset: 0;
  background:
    radial-gradient(ellipse 80% 60% at 20% 30%, rgba(102,126,234,0.15) 0%, transparent 60%),
    radial-gradient(ellipse 60% 50% at 80% 70%, rgba(118,75,162,0.12) 0%, transparent 60%),
    radial-gradient(ellipse 50% 40% at 50% 50%, rgba(0,212,255,0.08) 0%, transparent 50%);
  pointer-events: none;
}`,
  glow: `.glow-text {
  text-shadow: 0 0 20px var(--accent), 0 0 40px var(--accent);
}
.glow-border {
  box-shadow: 0 0 15px var(--accent), inset 0 0 15px var(--accent);
}`,
  'gradient-mesh': `.gradient-mesh {
  background:
    linear-gradient(135deg, rgba(166,124,82,0.03) 0%, transparent 50%),
    linear-gradient(225deg, rgba(166,124,82,0.02) 0%, transparent 50%);
}`,
  'block-color': `.block-highlight {
  background: var(--accent);
  color: var(--page);
  padding: 0.25em 0.5em;
  display: inline-block;
}`,
  'grid-overlay': `.grid-overlay {
  background-image:
    linear-gradient(rgba(128,128,128,0.05) 1px, transparent 1px),
    linear-gradient(90deg, rgba(128,128,128,0.05) 1px, transparent 1px);
  background-size: 40px 40px;
}`,
  exposure: `.exposure-overlay {
  mix-blend-mode: screen;
  opacity: 0.04;
  background: white;
}`,
  'card-shadow': `.bento-card {
  box-shadow: 0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.06);
  border-radius: 12px;
}
.dark .bento-card {
  box-shadow: 0 1px 3px rgba(0,0,0,0.3), 0 1px 2px rgba(0,0,0,0.2);
}`,
  chromatic: `.chromatic {
  animation: chromatic 0.3s ease-out;
}
@keyframes chromatic {
  0%   { text-shadow: -2px 0 #00f0ff, 2px 0 #ff00aa; }
  100% { text-shadow: none; }
}`,
  scanline: `.scanlines::after {
  content: '';
  position: absolute; inset: 0;
  background: repeating-linear-gradient(
    0deg,
    transparent,
    transparent 2px,
    rgba(0,0,0,0.03) 2px,
    rgba(0,0,0,0.03) 4px
  );
  pointer-events: none;
}`,
};

// ─── 字体 URL 生成 ─────────────────────────────────────────────────

function fontFamiliesToUrl(fonts) {
  // Map: family name → { allWeights: Set, italic: bool }
  const familyMap = new Map();
  const mergeFamily = (f) => {
    if (!f) return;
    const key = f.family;
    if (!familyMap.has(key)) familyMap.set(key, { allWeights: new Set(), italic: false });
    const entry = familyMap.get(key);
    if (f.weights) f.weights.forEach(w => entry.allWeights.add(w));
    if (f.italic) entry.italic = true;
  };
  mergeFamily(fonts.heading);
  mergeFamily(fonts.body);
  mergeFamily(fonts.mono);
  mergeFamily(fonts.quote);

  const params = [];
  for (const [name, entry] of familyMap) {
    let url = name.replace(/ /g, '+');
    const weights = [...entry.allWeights].sort((a,b) => a-b);
    if (weights.length) url += ':' + weights.join(',');
    if (entry.italic) url += ',italic';
    params.push(`family=${url}`);
  }
  return `https://fonts.googleapis.com/css2?${params.join('&')}&display=swap`;
}

// ─── CSS 变量生成 ─────────────────────────────────────────────────

function generateCSSVariables(styleKey) {
  const style = STYLES[styleKey];
  if (!style) return '';

  const theme = THEMES[style.theme];
  if (!theme) return '';

  const l = theme.colors.light;
  const d = theme.colors.dark;

  return `:root {
  --page: ${l.page};
  --ink: ${l.ink};
  --accent: ${l.accent};
  --grey: ${l.grey};
  --accent-dim: ${l['accent-dim']};
  --ink-soft: ${l['ink-soft']};
  --hr: ${l.hr};
  --page-inv: ${d.page};
  --ink-inv: ${d.ink};
  --accent-inv: ${d.accent};
}

.dark {
  --page: ${d.page};
  --ink: ${d.ink};
  --accent: ${d.accent};
  --grey: ${d.grey};
  --accent-dim: ${d['accent-dim']};
  --ink-soft: ${d['ink-soft']};
  --hr: ${d.hr};
  --page-inv: ${l.page};
  --ink-inv: ${l.ink};
  --accent-inv: ${l.accent};
}`;
}

// ─── 特效 CSS 生成 ─────────────────────────────────────────────────

function generateEffectsCSS(effects) {
  if (!effects || effects.length === 0) return '/* No visual effects for this style */';
  return effects.map(key => EFFECTS_CSS[key] || `/* Unknown effect: ${key} */`).join('\n\n');
}

// ─── 主题 body class 映射 ─────────────────────────────────────────

const THEME_BODY_CLASS = {
  default: 'theme-default',
  indigo: 'theme-indigo',
  forest: 'theme-forest',
  sand: 'theme-sand',
  mono: 'theme-mono',
  neon: 'theme-neon',
  rose: 'theme-rose',
  ocean: 'theme-ocean',
};

// ─── 完整输出 ──────────────────────────────────────────────────────

function generateFullTheme(styleKey) {
  const style = STYLES[styleKey];
  if (!style) {
    console.error(`Unknown style: "${styleKey}"`);
    console.error(`Available styles: ${Object.keys(STYLES).join(', ')}`);
    process.exit(1);
  }

  const fontUrl = fontFamiliesToUrl(style.fonts);
  const cssVars = generateCSSVariables(styleKey);
  const effectsCSS = generateEffectsCSS(style.effects);
  const bodyClass = THEME_BODY_CLASS[style.theme] || 'theme-default';

  const lines = [];
  lines.push(`<!-- ═════════════════════════════════════════════════════════`, '');
  lines.push(`     Theme: ${style.name}`);
  lines.push(`     Style: ${styleKey}`);
  lines.push(`     Body:  <body class="${bodyClass}">`);
  lines.push(`     Desc:  ${style.description}`, '');
  lines.push(`     ═════════════════════════════════════════════════════════ -->`, '');

  // Google Fonts
  lines.push(`<!-- 1. Google Fonts (from Typography Engine) -->`);
  lines.push(`<link href="${fontUrl}" rel="stylesheet">`);
  lines.push('');

  // CSS Variables
  lines.push(`<!-- 2. Theme CSS Variables (from Color Engine: ${style.theme}) -->`);
  lines.push('<style>');
  lines.push(cssVars);
  lines.push('</style>');
  lines.push('');

  // Effects
  if (style.effects.length > 0) {
    lines.push(`<!-- 3. Visual Effects CSS (from Visual Effects Engine: ${style.effects.join(', ')}) -->`);
    lines.push('<style>');
    lines.push(effectsCSS);
    lines.push('</style>');
    lines.push('');
  }

  return lines.join('\n');
}

// ─── CLI ────────────────────────────────────────────────────────────

const args = process.argv.slice(2);
const styleArg = (args[0] || '').toLowerCase();

if (!styleArg || styleArg === '--help' || styleArg === '-h') {
  console.log(`
Usage:
  node scripts/generate-theme.mjs <style-name>
  node scripts/generate-theme.mjs all

Available styles:
${Object.entries(STYLES).map(([key, s]) => `  ${key.padEnd(18)} ${s.name}`).join('\n')}

Examples:
  node scripts/generate-theme.mjs editorial
  node scripts/generate-theme.mjs glass   > theme-head.html
`);
  process.exit(0);
}

if (styleArg === 'all') {
  for (const key of Object.keys(STYLES)) {
    console.log(`\n${'═'.repeat(72)}`);
    console.log(`# ${STYLES[key].name}`);
    console.log(`${'═'.repeat(72)}\n`);
    console.log(generateFullTheme(key));
  }
} else {
  console.log(generateFullTheme(styleArg));
}
