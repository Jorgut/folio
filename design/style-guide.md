# Style Guide · 风格参数速查

> 10 种视觉风格，统一结构：字体 / 颜色 / 间距 / 动效 / 特效 / 布局 / 禁忌。
> 按场景选风格 → 按风格读对应参数 → 直接应用。

## 决策表：场景 → 风格

| 场景 | 推荐风格 | 理由 |
|------|---------|------|
| 公司路演 / Pitch | Editorial 或 Glass | 杂志感，图文节奏好 |
| 学术汇报 / 研究报告 | Minimal 或 Editorial | 内容优先，阅读友好 |
| 设计作品集 | Architectural 或 Swiss | 留白多，视觉驱动 |
| 新产品发布 | Glass 或 Dark | 科技感，发光强调 |
| 品牌展示 / 官网 | Luxury 或 Editorial | 高端感，衬线+金色 |
| 黑客马拉松 / 路演 | Neon 或 Brutalism | 大胆，视觉冲击 |
| 数据 Dashboard | Bento | 网格+卡片，信息密度高 |
| 技术架构分享 | Dark 或 Minimal | 深色/极简，代码友好 |
| 内部文档 / 纯内容 | Minimal | 极简，低交互，可打印 |

---

## Architectural · 建筑风

> 空间 · 结构 · 作品集 | 参考: Tadao Ando, David Chipperfield, Snøhetta

| 参数 | 值 |
|------|-----|
| 标题字体 | Cormorant Garamond Light (300) |
| 正文字体 | Inter Light / Helvetica Neue Light (300) |
| 元数据 | Inter / SF Mono (400, `letter-spacing: 0.05em`) |
| 背景/文字 | `#f2efe8` 纸白 / `#2a2520` 深棕灰 |
| 强调色 | `#8a7a6a` 石色 |
| 间距 | 奢侈留白 `--sp-8`(64) 到 `--sp-10`(128) |
| 动效 | L1-L2，慢速 600ms+，Parallax |
| 特效 | Noise(混凝土质感) / Glass(石材面板) / 极简网格线 |
| 布局 | Bleed / Overlap / Gallery — 图 > 文 |
| 禁忌 | ❌ 粗重无衬线 ❌ 霓虹色 ❌ 密集文字 |

---

## Bento · 便当网格

> Dashboard · 数据 · 模块化 | 参考: Apple Music, Notion, Linear

| 参数 | 值 |
|------|-----|
| 标题字体 | Inter SemiBold (600) |
| 正文字体 | Inter / SF Pro Text (400) |
| 数字/元数据 | SF Mono (700) / Inter (400 小字号) |
| 背景/卡片 | `#f5f5f7` / `#ffffff`（浅色） |
| 强调色 | `#4a6fa5` 或数据色 |
| 间距 | 紧凑 Grid: `gap: --sp-4`(16) / `--sp-5`(24)，卡片内 padding: `--sp-4` |
| 动效 | L2 — CountUp + Stagger 80ms |
| 特效 | 卡片阴影(subtle) / 圆角 12-16px / 无装饰 |
| 布局 | CSS Grid auto-fill, 每屏 4-8 卡片, Stats/Table 嵌入卡片 |
| 禁忌 | ❌ 全出血图 ❌ 多方向阅读 ❌ 过大间距 ❌ 不对齐 |

---

## Brutalism · 粗野主义

> 大胆 · 反传统 · 网络原生 | 参考: Brutalist Websites, 反设计运动

| 参数 | 值 |
|------|-----|
| 标题字体 | Impact / Arial Black / Anton (900)，全大写 |
| 正文字体 | Courier New / Space Mono (等宽) |
| 标题色 | `#000000` 纯黑 |
| 强调色 | `#ff0000` 红 / `#0000ff` 蓝 / `#ffff00` 黄（纯色直出） |
| 间距 | 故意打破 8pt Grid — 极密或极疏 |
| 动效 | L1 — 粗暴过渡，不光滑 |
| 特效 | Noise(粗粝) / 粗边框 0 圆角 / 像素化 / 曝光过度 |
| 布局 | Cover 撑满超大 / List 粗体编号 / Stats 巨数字 |
| 禁忌 | ❌ 渐变/阴影 ❌ 毛玻璃 ❌ 小字/细腻排版 |

---

## Cyberpunk · 赛博朋克

> 创意 · 游戏 · 未来 | 参考: Cyberpunk 2077, Blade Runner, Tron

| 参数 | 值 |
|------|-----|
| 标题字体 | Orbitron / Rajdhani Bold (700)，全大写 |
| 正文字体 | Rajdhani / Exo 2 (400) |
| 背景/面板 | `#0a0a1a` / `#12122a` |
| 文字/强调 | `#e8e8ff` / `#00f0ff` 青 + `#ff00aa` 粉 + `#ffcc00` 黄 |
| 间距 | 标准 8pt Grid，但倾斜/切成角度 |
| 动效 | L3-L4 — Glitch / 扫描线 / 粒子 / 鼠标交互 |
| 特效 | Glow 霓虹 / 色差 / 扫描线 / 粒子 / Glitch / Shader 扭曲 |
| 布局 | Cover 居中+故障动效 / Stats 发光数字 / Gallery 色差预览 |
| 禁忌 | ❌ 衬线 ❌ 白色背景 ❌ 毛玻璃 ❌ 圆角 > 4px |

---

## Dark · 深色模式

> 科技 · 夜间 · 沉浸 | 参考: GitHub Dark, VSCode, 游戏 UI

| 参数 | 值 |
|------|-----|
| 标题字体 | Inter Heavy / SF Pro Display (800) |
| 正文字体 | Inter Light / Helvetica Neue Light (300) |
| 元数据 | SF Mono / JetBrains Mono (400) |
| 背景/面板 | `#0f0f1a` / `#1a1a2e` |
| 强调色 | `#00d4ff` 亮青 / `#7c5cfc` 紫 |
| 间距 | 标准 8pt Grid |
| 动效 | L2 — 发光 Glow 强调 + 平滑过渡 |
| 特效 | Aurora(暗底渐变光) / Glow(发光文字) / 细微粒子 / 发光边框 |
| 布局 | Cover 居中+发光线 / Split 深色面板+发光 / Stats 发光数字 |
| 禁忌 | ❌ 浅色叠浅色 ❌ 棕色/土色 ❌ 大量多色发光 |

---

## Editorial · 编辑风

> 杂志 · 内容展示 | 参考: NYT Magazine, Monocle, Kinfolk

| 参数 | 值 |
|------|-----|
| 标题字体 | Playfair Display / Cormorant Garamond (700) |
| 正文字体 | Inter / Charter (400) |
| 引语 | Playfair Display Italic (400) |
| 背景/文字 | `#f9f9f6` 暖白 / `#1a1a1a` |
| 强调色 | `#a67c52` 暖金 |
| 间距 | 标准 8pt Grid: section padding `--sp-5` / `--sp-6` |
| 动效 | L2 — FadeIn + 图片 Reveal |
| 特效 | Noise Overlay(纸质感) / Gradient Mesh(丰富白背景) |
| 布局 | Overlap(杂志灵魂) / Bleed / Editorial 双栏 / Pull-quote |
| 禁忌 | ❌ 霓虹色 ❌ WebGL/Shader ❌ 多主题色混搭 |

---

## Glass · 毛玻璃

> 科技 · 现代 · SaaS | 参考: Apple Vision Pro, Fluent Design

| 参数 | 值 |
|------|-----|
| 标题字体 | Inter SemiBold / SF Pro Display (600) |
| 正文字体 | Inter / SF Pro Text (400) |
| 背景 | `#f0f4f8` + 渐变（浅） / `#0a0e1a` + 暗渐变（深） |
| 强调色 | `#4a6fa5` / `#667eea` |
| 间距 | 标准 8pt Grid，面板间 `--sp-5` / `--sp-6` |
| 动效 | L2-L3 — 300ms ease-out + Magnetic Hover + 浮动感 |
| 特效 | Glass 毛玻璃(`backdrop-filter: blur(20px)`) / Aurora / 悬浮阴影 / 圆角 ≥ 16px |
| 布局 | Cover 居中毛玻璃面板 / Overlap 浮层 / Split 毛玻璃侧面板 |
| 禁忌 | ❌ 不透明/高饱和背景 ❌ 锐利直角 ❌ 粗野/霓虹冲突 |

---

## Luxury · 高端

> 高端品牌 · 精品 · 时尚 | 参考: Chanel, Hermès, Cartier

| 参数 | 值 |
|------|-----|
| 标题字体 | Playfair Display / Cormorant Garamond Medium (500) |
| 正文字体 | Inter Thin / Helvetica Neue Thin (200-300) |
| 引语 | Playfair Display Italic |
| 背景/文字 | `#faf8f5` 纸白 / `#1a1614` |
| 强调色 | `#c9a87c` 暖金 |
| 间距 | 奢侈：section padding `--sp-8` 起 |
| 动效 | L1-L2 — 慢速优雅 600ms+，极少动效 |
| 特效 | Gradient Mesh / 极淡 Noise(纸张) / 1px 金线分割 / 小字大写+大间距 |
| 布局 | Cover 居中+下方元数据 / Spread 全出血 / Pull-quote 斜体引语 |
| 禁忌 | ❌ 粗重字体 ❌ 霓虹色 ❌ 密集排版 ❌ 圆角 > 8px ❌ WebGL/3D |

---

## Minimal · 极简主义

> 通用 · 商业 · 科技 | 参考: Apple, Muji, Braun

| 参数 | 值 |
|------|-----|
| 标题字体 | Helvetica Neue Light / Inter Light (300) |
| 正文字体 | Helvetica Neue / Inter (400) |
| 元数据 | SF Mono / JetBrains Mono (400) |
| 背景/文字 | `#ffffff` / `#1a1a1a` |
| 强调色 | `#4a4a4a` 灰度 |
| 间距 | 大量留白 `--sp-8`(64) / `--sp-9`(80) |
| 动效 | L2 — FadeIn + SlideUp，无装饰动效 |
| 特效 | 无 — 去除所有装饰性特效 |
| 布局 | Cover 居中极大字 / Split 4/8 或 3/9 / 内容区 ≤ 60% |
| 禁忌 | ❌ 任何装饰元素 ❌ 多色强调 ❌ 过度动效 ❌ 全出血图 |

---

## Swiss · 瑞士国际主义

> 设计 · 艺术 · 文化 | 参考: Müller-Brockmann, Vignelli

| 参数 | 值 |
|------|-----|
| 标题字体 | Helvetica Bold / Inter Bold / Akzidenz Grotesk (700)，常 all caps |
| 正文字体 | Helvetica / Inter (400) |
| 背景/文字 | `#ffffff` / `#111111` |
| 强调色 | `#d93f3f` 红 / `#1a6f5c` 绿 / `#2d5fa0` 蓝 |
| 间距 | 严格网格对齐，8 倍数 |
| 动效 | L1-L2 — 干净翻页，无装饰 |
| 特效 | 纯色块 / 几何装饰线/点 / 大字排版 as 图形 |
| 布局 | Cover 居中大字+色块 / Compare 并排对齐 / Stats 数字+辅助线 |
| 禁忌 | ❌ 斜体/装饰字体 ❌ 渐变/阴影 ❌ 图片出血太多 |

---

## 主题色板参考

| class | `--page` | `--ink` | `--accent` | `--grey` | 深色 `--page-inv` |
|-------|----------|---------|------------|----------|-------------------|
| `default` | `#f9f9f6` | `#1a1a1a` | `#a67c52` | `#666` | `#111` |
| `indigo` | `#f7f8fc` | `#1b1b2a` | `#4a6fa5` | `#6b7280` | `#0f0f1a` |
| `forest` | `#f6f8f5` | `#1a241b` | `#5a7a5a` | `#5c6b5c` | `#0d140e` |
| `sand` | `#f8f6f0` | `#2a2520` | `#b8955c` | `#7a7068` | `#1a1612` |
| `mono` | `#ffffff` | `#1a1a1a` | `#4a4a4a` | `#808080` | `#000` |
| `neon` | `#f5f5ff` | `#0a0a1a` | `#00f0ff` | `#7a7a9a` | `#000011` |
| `rose` | `#fdf8fa` | `#1a1018` | `#c45a7a` | `#8a6a7a` | `#0e080c` |
| `ocean` | `#f5f8fc` | `#0f1a24` | `#3a8ab5` | `#5a7a8a` | `#080e14` |

> 切换: `<body class="theme-{name}">`。60-30-10 法则 — 主色 60% / 辅色 30% / 强调色 10%。
