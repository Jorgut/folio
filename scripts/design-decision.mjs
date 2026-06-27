#!/usr/bin/env node

/**
 * design-decision.mjs — 设计决策 CLI
 *
 * 交互式 5 步决策流程，输出 Design Parameters 代码块。
 * （对应 design-intelligence/decision-engine.md）
 *
 * 用法:
 *   node scripts/design-decision.mjs           # 交互模式
 *   node scripts/design-decision.mjs --quick   # 快速模式（用默认推荐值）
 *   node scripts/design-decision.mjs --batch   # 非交互批量模式（需传参）
 *
 * 输出:
 *   <!-- Design Parameters -->
 *   加上可选的主题代码（调用 generate-theme.mjs）
 */

import { createInterface } from 'readline/promises';
import { stdin, stdout, argv, exit } from 'process';
import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

// ─── 决策知识库 (from decision-engine.md) ──────────────────────────

const PROJECT_TYPES = [
  { id: 'pitch',      name: '路演 / Pitch',        desc: '节奏快、视觉冲击', defaultAudience: 'exec' },
  { id: 'academic',   name: '学术报告',              desc: '内容优先、排版清晰', defaultAudience: 'academic' },
  { id: 'product',    name: '产品演示 / Launch',     desc: '功能介绍、对比', defaultAudience: 'client' },
  { id: 'brand',      name: '品牌展示',              desc: '品牌色、留白多', defaultAudience: 'client' },
  { id: 'portfolio',  name: '设计作品集',            desc: '视觉驱动、动效丰富', defaultAudience: 'client' },
  { id: 'dashboard',  name: '数据 Dashboard',        desc: '网格布局、信息密度', defaultAudience: 'exec' },
  { id: 'document',   name: '内部文档',              desc: '极简、低交互', defaultAudience: 'tech' },
];

const AUDIENCES = [
  { id: 'exec',     name: '高管',     desc: '时间少，大标题+关键数字' },
  { id: 'client',   name: '客户',     desc: '视觉一致性，易懂的图' },
  { id: 'public',   name: '大众',     desc: '吸引眼球的封面，少文字' },
  { id: 'academic', name: '学术',     desc: '可读性，数据准确性' },
  { id: 'tech',     name: '技术',     desc: '代码/架构图，深色模式' },
];

const STYLE_RECOMMENDATIONS = {
  // Pitch
  'pitch-exec':     { style: 'editorial',  interaction: 'L2', reason: '高管路演需要杂志级视觉冲击' },
  'pitch-client':   { style: 'editorial',  interaction: 'L2', reason: '客户路演需图文并茂' },
  'pitch-public':   { style: 'brutalism', interaction: 'L2', reason: '大众路演需视觉冲击' },
  'pitch-academic': { style: 'editorial',  interaction: 'L2', reason: '学术路演兼顾深度与视觉' },
  'pitch-tech':     { style: 'glass',     interaction: 'L2', reason: '科技路演需现代感' },
  // Academic
  'academic-exec':  { style: 'editorial',  interaction: 'L1', reason: '学术汇报需专业可信' },
  'academic-client':{ style: 'editorial',  interaction: 'L2', reason: '学术成果展示需专业感' },
  'academic-public':{ style: 'editorial',  interaction: 'L2', reason: '科普传播需可读性' },
  'academic-academic':{ style: 'minimal', interaction: 'L1', reason: '学术严谨，无装饰' },
  'academic-tech':  { style: 'minimal',   interaction: 'L1', reason: '技术细节优先' },
  // Product
  'product-exec':   { style: 'glass',     interaction: 'L2', reason: '产品演示需科技现代感' },
  'product-client': { style: 'glass',     interaction: 'L2', reason: '客户演示显专业' },
  'product-public': { style: 'editorial',  interaction: 'L3', reason: '大众产品发布需动效' },
  'product-academic':{ style: 'minimal',  interaction: 'L1', reason: '技术产品说明需简洁' },
  'product-tech':   { style: 'dark',      interaction: 'L2', reason: '科技产品深色模式' },
  // Brand
  'brand-exec':     { style: 'luxury',    interaction: 'L2', reason: '品牌展示需高端感' },
  'brand-client':   { style: 'luxury',    interaction: 'L2', reason: '客户品牌展示需精致' },
  'brand-public':   { style: 'editorial',  interaction: 'L2', reason: '大众品牌传播' },
  'brand-academic': { style: 'editorial',  interaction: 'L1', reason: '品牌学术案例' },
  'brand-tech':     { style: 'glass',     interaction: 'L2', reason: '科技品牌调性' },
  // Portfolio
  'portfolio-exec': { style: 'architectural', interaction: 'L3', reason: '作品集需空间感+动效' },
  'portfolio-client':{ style: 'architectural', interaction: 'L3', reason: '设计作品展示' },
  'portfolio-public':{ style: 'brutalism', interaction: 'L3', reason: '创意作品集大胆风格' },
  'portfolio-academic':{ style: 'architectural', interaction: 'L2', reason: '学术作品集空间感' },
  'portfolio-tech': { style: 'cyberpunk', interaction: 'L3', reason: '技术作品集赛博感' },
  // Dashboard
  'dashboard-exec': { style: 'bento',     interaction: 'L2', reason: '高管 Dashboard 信息密度' },
  'dashboard-client':{ style: 'bento',    interaction: 'L2', reason: '客户数据展示' },
  'dashboard-public':{ style: 'bento',    interaction: 'L2', reason: '公开数据概览' },
  'dashboard-academic':{ style: 'minimal',interaction: 'L1', reason: '学术数据清晰优先' },
  'dashboard-tech': { style: 'bento',     interaction: 'L2', reason: '技术团队 Dashboard' },
  // Document
  'document-exec':  { style: 'minimal',   interaction: 'L1', reason: '内部文档只需内容' },
  'document-client':{ style: 'minimal',   interaction: 'L1', reason: '客户文档简洁专业' },
  'document-public':{ style: 'editorial',  interaction: 'L1', reason: '公开文档可读性' },
  'document-academic':{ style: 'minimal', interaction: 'L1', reason: '学术文档严谨排版' },
  'document-tech':  { style: 'minimal',   interaction: 'L1', reason: '技术文档简洁高效' },
};

const INTERACTION_LEVELS = [
  { id: 'L0', name: 'L0 · 静态',      desc: '纯翻页，无交互动效' },
  { id: 'L1', name: 'L1 · 轻量',      desc: '基础翻页 + URL hash' },
  { id: 'L2', name: 'L2 · 标准',      desc: '过渡动画 + 键盘快捷键 + Lightbox' },
  { id: 'L3', name: 'L3 · 丰富',      desc: '视差滚动 + 滚动触发 + 卡片 Hover' },
  { id: 'L4', name: 'L4 · 沉浸',      desc: 'WebGL + 粒子 + 音频 + 鼠标追踪' },
];

const OUTPUT_FORMATS = [
  { id: 'html', name: 'HTML',    desc: '完整交互体验（主输出格式）' },
  { id: 'pptx', name: 'PPTX',    desc: '全文字可编辑，客户交付（推荐）' },
  { id: 'pdf',  name: 'PDF',     desc: '印刷/出版/分享' },
];

const VISUAL_STYLES = [
  { id: 'minimal',       name: 'Minimal · 极简主义',       desc: 'Apple, Muji — 通用、商业、科技' },
  { id: 'editorial',     name: 'Editorial · 编辑风',       desc: 'NYT Magazine — 杂志、内容展示' },
  { id: 'swiss',         name: 'Swiss · 瑞士国际主义',      desc: '网格 + 无衬线 + 原色' },
  { id: 'architectural', name: 'Architectural · 建筑风',   desc: '空间 + 细体 + 混凝土质感' },
  { id: 'brutalism',     name: 'Brutalism · 粗野主义',     desc: '粗排版 + 高对比' },
  { id: 'glass',         name: 'Glass · 毛玻璃',           desc: 'Apple Vision Pro — 科技现代' },
  { id: 'dark',          name: 'Dark · 深色模式',           desc: '暗底 + 发光强调' },
  { id: 'bento',         name: 'Bento · 便当网格',         desc: 'Dashboard 风格' },
  { id: 'luxury',        name: 'Luxury · 高端',            desc: '衬线 + 留白 + 金色' },
  { id: 'cyberpunk',     name: 'Cyberpunk · 赛博朋克',     desc: '霓虹 + 发光 + 色差' },
];

const PROJECT_TYPE_STYLE_MAP = {
  pitch:      { preferred: ['editorial', 'glass', 'dark'],      defaultInteraction: 'L2' },
  academic:   { preferred: ['minimal', 'editorial'],            defaultInteraction: 'L1' },
  product:    { preferred: ['glass', 'dark', 'minimal'],        defaultInteraction: 'L2' },
  brand:      { preferred: ['luxury', 'editorial', 'minimal'],  defaultInteraction: 'L2' },
  portfolio:  { preferred: ['architectural', 'brutalism', 'cyberpunk'], defaultInteraction: 'L3' },
  dashboard:  { preferred: ['bento', 'minimal', 'dark'],       defaultInteraction: 'L2' },
  document:   { preferred: ['minimal', 'editorial'],            defaultInteraction: 'L1' },
};

// ─── 交互式 Prompt ─────────────────────────────────────────────────

const rl = createInterface({ input: stdin, output: stdout });

async function select(prompt, choices, defaultValue) {
  console.log(`\n${prompt}`);
  console.log('-'.repeat(prompt.length));

  // Show choices with index
  for (let i = 0; i < choices.length; i++) {
    const marker = defaultValue !== undefined && choices[i].id === defaultValue ? ' ►' : '';
    console.log(`  ${i + 1}. ${choices[i].name}${marker}`);
    if (choices[i].desc) console.log(`     ${choices[i].desc}`);
  }
  console.log('');

  while (true) {
    const raw = await rl.question(`选择 (1-${choices.length})${defaultValue ? ` [${choices.findIndex(c => c.id === defaultValue) + 1}]` : ''}: `);
    const input = raw.trim();
    // Default
    if (input === '' && defaultValue) {
      const idx = choices.findIndex(c => c.id === defaultValue);
      return choices[idx];
    }
    const num = parseInt(input, 10);
    if (num >= 1 && num <= choices.length) {
      return choices[num - 1];
    }
    console.log(`请输入 1-${choices.length} 之间的数字。`);
  }
}

// ─── 决策推理 ──────────────────────────────────────────────────────

function recommendStyle(projectType, audience) {
  const key = `${projectType}-${audience}`;
  if (STYLE_RECOMMENDATIONS[key]) return STYLE_RECOMMENDATIONS[key];

  // Fallback: project-based preference + audience-based tweak
  const proj = PROJECT_TYPE_STYLE_MAP[projectType];
  if (proj) {
    const preferred = proj.preferred;
    // Audience tweaks
    if (audience === 'tech' && preferred.includes('dark')) return { style: 'dark', interaction: proj.defaultInteraction, reason: '技术受众偏好深色模式' };
    if (audience === 'academic') return { style: 'minimal', interaction: 'L1', reason: '学术场景简洁优先' };
    if (audience === 'exec') return { style: preferred[0] || 'editorial', interaction: 'L2', reason: '高管需要专业视觉' };
    return { style: preferred[0] || 'editorial', interaction: proj.defaultInteraction, reason: '基于项目类型推荐' };
  }

  return { style: 'editorial', interaction: 'L2', reason: '默认推荐' };
}

function isValidStyle(style) {
  return VISUAL_STYLES.some(s => s.id === style);
}

// ─── 输出生成 ──────────────────────────────────────────────────────

function generateDecisionBlock(params) {
  const lines = [];
  lines.push('<!-- ════════════════════════════════════════════');
  lines.push('     ✨ Design Parameters');
  lines.push(`     Project Type:    ${params.projectType}`);
  lines.push(`     Audience:        ${params.audience}`);
  lines.push(`     Visual Style:    ${params.visualStyle}`);
  lines.push(`     Interaction Lv:  ${params.interactionLevel}`);
  lines.push(`     Color Theme:     ${params.colorTheme}`);
  lines.push(`     Output Format:   ${params.outputFormat}`);
  lines.push('     ════════════════════════════════════════════');
  if (params.reason) {
    lines.push(`     Decision:        ${params.reason}`);
    lines.push('     ════════════════════════════════════════════');
  }
  lines.push('-->');
  return lines.join('\n');
}

function themeForStyle(styleId) {
  const map = {
    editorial:     'default',
    minimal:       'mono',
    swiss:         'mono',
    architectural: 'sand',
    brutalism:     'mono',
    glass:         'indigo',
    dark:          'indigo',
    bento:         'default',
    luxury:        'default',
    cyberpunk:     'neon',
  };
  return map[styleId] || 'default';
}

// ─── Call generate-theme.mjs ───────────────────────────────────────

function spawnGenerateTheme(styleId) {
  return new Promise((resolve, reject) => {
    const child = spawn('node', [
      resolve(__dirname, 'generate-theme.mjs'),
      styleId,
    ], { stdio: ['ignore', 'pipe', 'pipe'] });

    let output = '';
    child.stdout.on('data', (chunk) => { output += chunk; });
    child.stderr.on('data', (chunk) => { output += chunk; });
    child.on('close', (code) => {
      if (code === 0) resolve(output);
      else reject(new Error(`generate-theme exited with code ${code}: ${output}`));
    });
  });
}

// ─── 交互式决策流程 ────────────────────────────────────────────────

async function interactiveDecision() {
  console.log('');
  console.log('╔══════════════════════════════════════════════════════════╗');
  console.log('║           Folio Design Decision Engine v1              ║');
  console.log('║    在写代码之前，先做好设计决策。                        ║');
  console.log('╚══════════════════════════════════════════════════════════╝');
  console.log('');

  // Step 1: Project Type
  const project = await select(
    '【第 1 步】项目类型 — 选择最接近的：',
    PROJECT_TYPES
  );

  // Step 2: Audience
  const audience = await select(
    `【第 2 步】受众分析 — "${project.name}" 的听众是谁：`,
    AUDIENCES,
    project.defaultAudience
  );

  // Step 3: Recommended visual style
  const rec = recommendStyle(project.id, audience.id);
  const defaultStyle = isValidStyle(rec.style) ? rec.style : 'editorial';

  const style = await select(
    `【第 3 步】视觉风格 — 推荐: ${rec.style} (${rec.reason})`,
    VISUAL_STYLES,
    defaultStyle
  );

  // Step 4: Interaction level
  const defaultInteraction = PROJECT_TYPE_STYLE_MAP[project.id]?.defaultInteraction || 'L2';
  const interaction = await select(
    `【第 4 步】交互层级 — "${style.name}" 适合:`,
    INTERACTION_LEVELS,
    rec.interaction || defaultInteraction
  );

  // Step 5: Output format
  const output = await select(
    '【第 5 步】输出格式 — 最终交付物：',
    OUTPUT_FORMATS,
    'pptx'
  );

  rl.close();

  // ─── 输出结果 ──────────────────────────────────────────────
  const colorTheme = themeForStyle(style.id);

  console.log('\n');
  console.log('╔══════════════════════════════════════════════════════════╗');
  console.log('║  决策完成                                               ║');
  console.log('╚══════════════════════════════════════════════════════════╝');
  console.log('');

  const params = {
    projectType:    `${project.name} (${project.id})`,
    audience:       `${audience.name} (${audience.id})`,
    visualStyle:    `${style.name} (${style.id})`,
    interactionLevel: interaction.name,
    colorTheme:     colorTheme,
    outputFormat:   `${output.name} (${output.id})`,
    reason:         rec.reason,
  };

  console.log(generateDecisionBlock(params));
  console.log('');

  // Ask if user wants theme code
  const wantTheme = await new Promise((resolve) => {
    const rl2 = createInterface({ input: stdin, output: stdout });
    rl2.question('\n生成对应主题代码 (CSS + Fonts + Effects)? [Y/n] ', (ans) => {
      rl2.close();
      resolve(ans.toLowerCase() !== 'n');
    });
  });

  if (wantTheme) {
    console.log('\n');
    try {
      const themeCode = await spawnGenerateTheme(style.id);
      console.log(themeCode);
    } catch (e) {
      console.error('Failed to generate theme:', e.message);
    }
  }

  console.log('\n将 Design Parameters 代码块粘贴到 HTML 文件头部，帮助维护者理解设计意图。');
}

// ─── Batch mode ─────────────────────────────────────────────────────

function batchDecision(args) {
  const project = PROJECT_TYPES.find(p => p.id === args.project);
  const audience = AUDIENCES.find(a => a.id === args.audience);
  const style = VISUAL_STYLES.find(s => s.id === args.style) || VISUAL_STYLES[0];
  const interaction = INTERACTION_LEVELS.find(l => l.id === args.interaction) || INTERACTION_LEVELS[1];
  const output = OUTPUT_FORMATS.find(f => f.id === args.format) || OUTPUT_FORMATS[0];

  const projName = project ? `${project.name} (${project.id})` : args.project || 'unknown';
  const audName = audience ? `${audience.name} (${audience.id})` : args.audience || 'unknown';
  const rec = project && audience ? recommendStyle(project.id, audience.id) : { reason: 'manual' };

  const params = {
    projectType: projName,
    audience: audName,
    visualStyle: style.name + ` (${style.id})`,
    interactionLevel: interaction.name,
    colorTheme: themeForStyle(style.id),
    outputFormat: output.name + ` (${output.id})`,
    reason: rec.reason,
  };

  console.log(generateDecisionBlock(params));
}

// ─── CLI dispatch ───────────────────────────────────────────────────

const args = argv.slice(2);

if (args[0] === '--help' || args[0] === '-h') {
  console.log(`
Folio Design Decision Engine CLI

Usage:
  node scripts/design-decision.mjs              Interactive mode
  node scripts/design-decision.mjs --batch      Batch mode (pass params)
  node scripts/design-decision.mjs --quick      Quick mode (defaults only)

Batch mode params:
  --project   pitch|academic|product|brand|portfolio|dashboard|document
  --audience  exec|client|public|academic|tech
  --style     minimal|editorial|swiss|architectural|brutalism|glass|dark|bento|luxury|cyberpunk
  --interaction L0|L1|L2|L3|L4
  --format    html|pptx|pdf

Example:
  node scripts/design-decision.mjs --batch --project pitch --audience exec --style editorial --interaction L2 --format pptx
`);
  exit(0);
}

if (args[0] === '--batch') {
  const params = {};
  for (let i = 1; i < args.length; i += 2) {
    const key = args[i].replace('--', '');
    const val = args[i + 1];
    if (val && !val.startsWith('--')) params[key] = val;
  }
  batchDecision(params);
  exit(0);
}

// Quick mode & interactive
if (args[0] === '--quick') {
  // Use executive pitch as default
  batchDecision({ project: 'pitch', audience: 'exec', style: 'editorial', interaction: 'L2', format: 'pptx' });
  exit(0);
}

// Interactive (default)
await interactiveDecision();
