# Design Principles · 设计原则速查

> 快速参考版。要理解每个原则的"为什么"和完整教学 → `design/knowledge-base/`

---

## 交互层级 (Interaction Levels)

| 层级 | 适用场景 | 允许动效 | 特效限制 |
|------|---------|---------|---------|
| L0 | PDF/打印预览 | 无 | 无 |
| L1 | 内部文档、纯内容 | FadeIn 翻页 | 无 |
| **L2** | **大部分路演（推荐）** | FadeIn + SlideUp + Scroll Reveal + Stagger | Noise / Gradient Mesh |
| L3 | 作品集、营销页面 | Parallax + Glass + Magnetic Hover + CountUp | + Aurora / Glass |
| L4 | 创意展示、品牌体验 | Glitch + 粒子 + Shader + 鼠标追踪 | 全部 |

**决策规则：**
- 企业 PPT → 最大 L2，不用 Cursor / Shader / Liquid / Mouse Distortion
- 作品集 → 可用 L3+，Motion + Lenis + Three.js
- Dashboard → Count Up + Chart Animation + Scroll Reveal
- 出版/印刷 → L0，关闭所有动效

**按类别索引：**

| 类别 | 模式 | 适用风格 |
|------|------|---------|
| 页面进入 | Fade In / Scale / Stagger / Reveal / Split Text | 全部 |
| Hover | Lift / Glow / Scale / Magnetic / Tilt | Glass, Dark, Cyberpunk |
| 滚动 | Parallax / Pin / Horizontal / Progress | Editorial, Architectural |
| 导航 | Dots / Sidebar / Bottom Nav / Mini Map / Swipe | 全部 |
| 加载 | Skeleton / Progress / Shimmer / Blur | Dashboard, Glass |
| 数据 | Count Up / Chart Animate / Morph / Progress Ring | Stats, Bento |

---

## 布局规则

- **不对称优先** — 别用 50/50，用 4/8、3/9、7/5
- **布局节奏** — 连续 2 页相同布局后必须换
- **内容密度** — List 每页 4-6 项，Gallery 每页 4-8 张，Stats 每页 3-4 个
- **封面/章节/收束** — 必须用居中或大字布局

## 触控与导航

| 规则 | 数值 | 依据 |
|------|------|------|
| 触控目标 | ≥ 44px | Fitts's Law |
| 导航层级 | ≤ 3 层 | Hick's Law |
| 菜单项 | ≤ 7 项 | Hick's Law |
| 翻页方向 | 左/上 = 上页，右/下 = 下页 | Jakob's Law |

## 视觉约束

| 约束 | 标准 |
|------|------|
| 间距 | 8pt Grid：`--sp-4`(32) / `--sp-5`(40) / `--sp-6`(48) / `--sp-7`(56) / `--sp-8`(64) |
| 网格 | 12 Column，`col-span-*` |
| 字号对比 | 主标题 vs 正文 ≥ 6:1 |
| 主题色 | 一个 deck 一套，不换 |
| 字体家族 | ≤ 3 种 |
| 正文行距 | 1.5-1.8，每行 ≤ 80 字符 |
| 对比度 | ≥ 4.5:1 (WCAG AA) |

---

详细教学 → `design/knowledge-base/`
