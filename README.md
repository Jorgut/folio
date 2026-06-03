# Folio · 杂志风 PPT

> 由 Jorgut 创建 · MIT 协议开源

**单文件 HTML** 横向翻页 PPT，杂志编辑式排版。支持一键导出 PPTX（Native 全文字可编辑）和 PDF（可导入 InDesign）。

---

> ⚠️ **项目状态：测试阶段**
>
> Folio 目前处于**技术验证和测试阶段**，尚未正式发布。所有功能、API 和工作流都可能在后续版本中发生重大变更。
>
> - 当前版本：v0.4
> - 最后更新：2026-06-03
> - 稳定性：实验性
> - 贡献：欢迎反馈和建议，但暂不接受 PR（核心架构尚未定型）
>
> 如果你在使用过程中遇到问题或有改进建议，请在 [Issues](https://github.com/Jorgut/folio/issues) 中反馈。

---

## 核心特性

| 特性 | 状态 |
|------|------|
| 杂志级排版（8 种布局） | ✅ 稳定 |
| 响应式/自适应设计 | ✅ 稳定 |
| 交互式演示（快捷键、概览、全屏） | ✅ 稳定 |
| PPTX 截图导出 | ✅ 稳定 |
| PDF 导出（文字矢量可选中） | ✅ 稳定 |
| Native PPTX 引擎（全文字可编辑） | 🧪 测试中 |
| 出版级 PDF（裁切标记 / CMYK） | 🧪 测试中 |
| 设计工作流（IA → Wireframe → Mockup） | 🧪 测试中 |

## 快速开始

```bash
# 1. 拷贝模板到项目
cp index.html 我的项目/ppt.html
mkdir -p 我的项目/images

# 2. 浏览器预览
open 我的项目/ppt.html

# 3. 安装依赖（仅导出需要）
cd scripts/
npm install
npx playwright install chromium

# 4. 导出 PPTX（截图方式，布局 100% 还原）
node export-pptx.mjs 我的项目/ppt.html

# 5. 导出 PDF（文字可选中，InDesign 可用）
node export-pdf.mjs 我的项目/ppt.html
```

## 设计工作流

> 不要跳过 IA 和 wireframe 直接写 HTML。结构错了后面全白费。

```
IA (信息架构) → Lo-fi Wireframe → Mid-fi → Hi-fi → HTML Mockup → Native Export
```

### 完整流程

| 阶段 | 活动 | 产出 |
|------|------|------|
| **Phase A: IA** | 内容盘点、受众分析、叙事弧 | Deck Structure Document |
| **Phase B: Lo-fi** | 方块 + 占位符，5-10 分钟/页 | 手绘或简单数字草图 |
| **Phase C: Mid-fi** | Grid + 标注 + 内容层级 | 标注完整的线框图 |
| **Phase D: Hi-fi** | 真实内容 + 精确间距 | 开发交接文档 |
| **Phase E: HTML** | 用 Folio 模板实现 | index.html (mockup) |
| **Phase F: Export** | Native PPTX / PDF | .pptx / .pdf |

### 参考文件

| 文件 | 内容 |
|------|------|
| `references/presentation-design.md` | 编辑设计模式（NYT Magazine、Stripe Press、Monocle 等） |
| `references/information-architecture.md` | IA 五阶段流程（适配演示文稿） |
| `references/wireframing.md` | Lo-fi/Mid-fi/Hi-fi 线框图方法 |
| `templates/wireframe-sheet.html` | 可打印线框图纸（9 种布局 + 注释区） |

## 8 种杂志布局

| 布局 | 用途 |
|------|------|
| Cover | 封面 — 居中或偏置大字 |
| Split 4-8 / 3-9 / 7-5 | 不对称图文分栏 |
| Overlap | 全出血图 + 文字浮层 |
| Bleed Quote | 全出血图 + 引语 |
| Editorial | CSS 双栏正文 |
| Stats | 数字大字报 |
| Gallery | 图片画廊（auto-fill 自适应列数） |
| Closing | 收束页 |

## 设计原则

1. 不对称优于对称
2. 图文重叠创造层次
3. 全出血图呼吸感
4. 字号对比 ≥ 6:1
5. 留白是设计的一部分
6. 三种字体各司其职（衬线/非衬线/等宽）
7. 图片只用标准比例
8. 一套 deck 一套主题色

## 交互式演示

| 快捷键 | 功能 |
|--------|------|
| `→` `↓` `Space` | 下一页 |
| `←` `↑` | 上一页 |
| `G` | 缩略图概览 |
| `F` | 全屏切换 |
| `Escape` | 回到首页 / 关闭概览 |
| `B` | 低功耗模式 |
| `?` | 快捷键面板 |
| 🔗 按钮 | 复制当前页 URL |

## 依赖

- [PptxGenJS](https://github.com/gitbrent/PptxGenJS) — PPTX 生成
- [Playwright](https://playwright.dev) — 浏览器渲染 + 截图 + PDF

## 协作流程

| 目标工具 | 导出方式 | 说明 |
|---------|---------|------|
| **PowerPoint** | PPTX | 直接打开，文字可编辑 |
| **Google Slides** | PPTX → 上传 | 上传 .pptx 到 Drive，右键用 Slides 打开 |
| **Keynote** | PPTX → 打开 | 双击 .pptx 或用 Keynote 打开 |
| **Figma** | PDF → 导入 | 菜单 Import → 选择 PDF |
| **InDesign** | PDF → 置入 | 文件 → 置入 → 选择 PDF |

## 许可证

MIT License · Copyright (c) 2026 Jorgut
