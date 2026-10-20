# Export Engine

> 输出格式选择与导出规则

## 格式对比

| 格式 | 脚本 | 特性 | 适用场景 |
|------|------|------|---------|
| **HTML** | 浏览器直接打开 | 完整交互、动效、导航 | 主输出格式 |
| **PPTX** | `export-native-pptx.mjs` | 全文字可编辑、矢量 | 客户交付、后续编辑 |
| **PDF** | `export-print-pdf.mjs` | 矢量文字、可导入 InDesign | 印刷、出版 |
| **PNG** | Playwright 截图 | 每页独立图片 | 社交分享、预览 |

## 决策规则

```
IF 客户需要编辑内容 → PPTX（推荐）
IF 印刷/出版 → PDF
IF 网页发布 → HTML
IF 社交媒体 → PNG（分享缩略图）
```

## 导出质量等级

| 等级 | 截图质量 | 适用 |
|------|---------|------|
| High (默认) | 2x 设备像素 | 高清展示 |
| Print | 300 DPI | 印刷 |
| Draft | 1x 快速预览 | 内容审查 |

## 导出命令

```bash
# PPTX（全文字可编辑 — 推荐）
node <SKILL_ROOT>/scripts/export-native-pptx.mjs index.html

# PDF（矢量文字，InDesign 可用）
node <SKILL_ROOT>/scripts/export-print-pdf.mjs index.html

# 验证已有 HTML 与同名 PPTX，不重新生成
node <SKILL_ROOT>/scripts/export-verify.mjs index.html

# 仅检查 HTML；浏览器检查需要宿主授权
node <SKILL_ROOT>/scripts/export-verify.mjs index.html --html-only

# 明确要求先生成 PPTX，再验证
node <SKILL_ROOT>/scripts/export-verify.mjs index.html --export
```

## 导出约束

- HTML 文件必须在本地文件系统（file:// 协议）
- PPTX 导出保留文字内容、列表、表格
- 图片嵌入 PPTX/PDF
- WebGL/Three.js 内容不会出现在 PPTX/PDF 中
