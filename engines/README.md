# Engines

> Folio 的各引擎知识库。每个引擎定义特定设计维度的选择规则。

| 引擎 | 职责 | 核心文件 |
|------|------|---------|
| [Layout Engine](./layout-engine.md) | 布局选择与组合 | `engines/layout-engine.md` |
| [Typography Engine](./typography-engine.md) | 字体系统与排版 | `engines/typography-engine.md` |
| [Color Engine](./color-engine.md) | 配色系统与主题 | `engines/color-engine.md` |
| [Interaction Engine](./interaction-engine.md) | 交互模式选择 | `engines/interaction-engine.md` |
| [Animation Engine](./animation-engine.md) | 动效方案 | `engines/animation-engine.md` |
| [Visual Effects Engine](./visual-effects-engine.md) | 视觉特效 | `engines/visual-effects-engine.md` |
| [Export Engine](./export-engine.md) | 输出格式与导出 | `engines/export-engine.md` |

## 引擎协作流程

```
决策表与工作流 (SKILL.md)
  │  分析输入 → 输出决策参数
  │
  ├── Layout Engine ← 选择布局序列
  ├── Typography Engine ← 选择字体系统
  ├── Color Engine ← 选择配色主题
  ├── Interaction Engine ← 选择交互层级
  ├── Animation Engine ← 选择动效方案
  ├── Visual Effects Engine ← 选择视觉特效
  └── Export Engine ← 选择输出格式
        │
        ▼
   最终输出 (HTML / PPTX / PDF)
```

所有引擎的决策参数最终记录在 HTML 头部：

```html
<!--
Design Parameters:
  Visual Style:    Editorial
  Interaction Lv:  L2
  Color Theme:     default
  Layout Strategy: Cover→Split→Stats→Timeline→Closing
-->
```
