# Session Log · 2026-06-09

> Folio v0.4 → v0.7 · Phase 1 Complete

## Summary

完成了 Folio Phase 1（Native PPTX 引擎）全部三个子阶段，创建了 加伍磅 真实客户 deck 并通过多轮评审修改，项目已推送到 GitHub。

## 完成工作

### Phase 1a — Native PPTX 文字提取引擎

- 创建 `scripts/export-native-pptx.mjs`
- 两阶段架构：Playwright 提取渲染样式 → PptxGenJS 原生 text box
- 文字/色块/网格线全为原生对象，仅照片用截图

### Phase 1b — 布局映射引擎

- 创建 `scripts/layout-mapping.mjs`（688 行）
- 12 种布局 mapper + fallback：cover, split-4-8, overlap-right, bleed-quote, editorial, stats, gallery, closing, timeline, spread, compare, list
- 集成到 export-native-pptx.mjs 中

### Phase 1c — 输出验证脚本

- 创建 `scripts/export-verify.mjs`
- 11 项自动检查：slide 数量、layout 识别、console error、PPTX 结构、文字提取完整性
- 验证通过：12 slides, 3.1MB PPTX, 72 text boxes, 11/11 checks passed

### 模板大改（v0.1 → v0.5）

- 8 → 12 种布局（新增 timeline, spread, compare, list）
- 4 → 8 个主题（新增 mono, neon, rose, ocean）
- WebGL canvas + CSS animated gradient 背景
- Lucide SVG 图标（替换 emoji）
- 极端排版对比（hero:body ~10:1）
- 动画精修

### 加伍磅 Deck（12-slide 设计提案）

- 基于 Folio 模板创建，品牌橙 #FF671F
- 多轮评审修改：
  - 删除 share 按钮（突兀）
  - Slide 2：替换为 full-bleed magazine spread
  - Slide 7/10：添加 floor plan 作为低透明度背景
  - Slide 4：`@media (max-width: 768px)` responsive
  - Wheel/touch handler：slide 内滚动优先
  - 添加 `⌘` nav toggle 按钮
  - Slides 6/9：从 editorial 替换为 Variant C（moodboard 上文字下4图）

### Wireframe Sheet

- 更新 `templates/wireframe-sheet.html`：9 → 13 种布局
- 新增 Spread, Compare, Timeline, List 卡片

### 文档更新

- README.md / ROADMAP.md / SKILL.md → v0.7
- GitHub README 加入截图（slide-cover, slide-editorial, wireframe-sheet）
- 修复 `.gitignore` 中 `*.png` 规则导致的截图无法提交问题

### GitHub

- 仓库：`Jorgut/folio` → 改名 `Jorgut/folio-ppt`
- 添加 8 个 topics：html-ppt, html-to-pptx, magazine-layout, powerpoint, pptx-generator, presentation, presentation-tool, slide-deck
- 描述：中英双语
- 8 次 commits，已全部推送

## 关键决策

| 决策 | 原因 |
|------|------|
| 用 Playwright `getComputedStyle()` 而非解析 CSS | 直接取实际渲染值，避免 clamp() 等计算 |
| `layout-mapping.mjs` 独立模块 | 关注点分离，export 脚本只调用 `applyLayoutMapping()` |
| Scroll-within-slide-first | wheel/touch 垂直操作先检查 slide 内部滚动边界 |
| Variant C moodboard | 用户对比 3 个变体后选定上文字下4图 |
| `gh auth login --web` | 设备认证流，适用于无 SSH key/无交互环境 |

## 待办

- 新项目 deck（用户说暂时不做）
- Phase 2（Figma Plugin / 出版级 PDF）— 未排期

## Repo

https://github.com/Jorgut/folio-ppt
