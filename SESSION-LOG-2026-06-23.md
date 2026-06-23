# Session Log — 2026-06-23

## 任务
修复 Folio 出版级 PDF 导出的图片丢失问题，并清理项目冗余文件。

## 问题诊断

### 根因分析
1. **SSL 连接失败** — 机器无法直接连接 `images.unsplash.com`（curl/Playwright Chromium 均失败）
2. **浏览器代理差异** — 用户浏览器走代理/VPN 可以加载图片，但 Playwright 自带的 Chromium 不走同一通道
3. **PDF 渲染器限制** — Playwright 的 `page.pdf()` 使用不同的渲染引擎，绝对定位的图片在 PDF 中丢失
4. **CJK 文字拆分** — Chromium PDF 渲染器将中文字符拆成单独字块，无法整段编辑

## 解决方案

### 1. 图片加载（SSL 问题）
- 改用 `channel: 'chrome'` 启动系统 Chrome，走用户代理加载图片
- 用 Playwright 浏览器下载图片到本地，替换 HTML 中的 URL

### 2. 图片渲染（PDF 丢失问题）
- **混合方案**：Playwright PDF 文字层 + 截图叠加图片层
- 对包含图片的页面，用截图覆盖在 PDF 上方
- 保留文字可编辑性，同时确保图片正确显示

### 3. 字号固定
- 将响应式字号（clamp/vw/vh）替换为固定值
- 确保 PDF 渲染器正确处理文字流

### 4. CJK 字体
- 强制加载中文字体（Noto Serif SC）
- 添加 `word-break: keep-all` 改善文字分组

## 清理

### 删除的冗余文件
- `scripts/export-mixed.mjs` — 旧版混合导出，已被 native-pptx 替代
- `scripts/export-pptx.mjs` — 旧版截图 PPTX，已被 native-pptx 替代
- `scripts/test-interactive.mjs` — 调试脚本
- `scripts/test-responsive.mjs` — 调试脚本

### 更新的文档
- `SKILL.md` — 修正脚本引用（export-pptx.mjs → export-native-pptx.mjs）
- `README.md` — 版本号 v0.7 → v0.8

## Git 提交记录
```
6cb0fe8 chore: cleanup redundant scripts and update docs
1242fae fix: PDF export - hybrid approach for images + editable text
53a904c v0.8: publishing-grade PDF export
```

## 当前项目状态
- 版本：v0.8
- GitHub：https://github.com/Jorgut/folio-ppt
- 导出脚本：5 个（native-pptx, print-pdf, pdf, verify, layout-mapping）

## 已知限制
1. **中文编辑** — Chromium PDF 渲染器将 CJK 文字拆成单字块，无法整段编辑。解决方案：编辑 HTML 源文件后重新导出
2. **图片依赖网络** — 首次导出需联网下载图片，后续使用本地缓存

## 工作流程
```bash
# 编辑内容
vim index.html

# 重新导出
node scripts/export-print-pdf.mjs index.html
```
