# Accessibility · 无障碍设计

> WCAG 2.1 AA 标准在演示场景中的实现。这不是"额外工作"——可访问性好的 deck 对所有用户都更好用。

---

## 1. 色彩对比度

**问题：** 你的观众里可能有 8% 的男性和 0.5% 的女性有某种形式的色觉障碍。如果你的文字和背景对比度不够，他们看不清。

**标准：**

| 要求 | WCAG AA（必须达到） | WCAG AAA（加分项） |
|------|-------------------|-------------------|
| 正文 | ≥ 4.5:1 | ≥ 7:1 |
| 大文字 (≥24px 或 ≥19px bold) | ≥ 3:1 | ≥ 4.5:1 |
| 禁用状态 | 无要求 | 无要求 |

**在 Folio 中的应用：**

8 套主题色的对比度已经预设满足 AA 标准。但在以下情况需要额外检查：
- 强调色叠在背景色上（尤其是 `theme-rose` 和 `theme-neon` 的浅色模式）
- 文字叠在图片上时（Overlap 布局）— 在文字面板下加半透明背景

检查工具：WebAIM Contrast Checker

---

## 2. 触控目标 (Fitts's Law)

**要求：** 所有可交互元素触控区域 ≥ 44×44px。

**为什么：** 人的指尖平均宽度 10-14mm，44px ≈ 11.6mm（在标准屏幕密度下）。小于这个尺寸，手指定位的误触率急剧上升。

**覆盖的元素：**
- 导航圆点
- 翻页箭头
- 按钮（CTA、关闭、全屏等）
- 链接

**在 Folio 中的实现：**

```css
/* 不可见点击区扩展 */
.clickable::after {
  content: '';
  position: absolute;
  inset: calc((44px - 100%) / -2);
}
```

视觉上导航点只有 12px，但触控面积 44px。不牺牲美观，不牺牲可用性。

---

## 3. 文字缩放

**要求：** 页面在 200% 缩放后内容不丢失、不重叠。

**为什么：** 部分用户视觉障碍需要放大阅读。如果你的 deck 在 200% 下文字重叠或按钮不可见，他们就无法使用。

**在 Folio 中的实现：**

```css
/* 用 clamp() 响应式字号，不用固定 px */
h1 { font-size: clamp(2rem, 5vw, 5rem); }

/* 容器不用固定宽度 */
.container { width: min(90%, 1200px); }
```

- 不使用绝对定位的精确像素
- 文本溢出用 `overflow-wrap: break-word` 兜底

---

## 4. 键盘导航

**要求：** 所有交互必须键盘可访问。不能假设观众使用鼠标。

**为什么：** 部分用户无法使用鼠标（运动障碍、视觉障碍使用屏幕阅读器）。你的 deck 只支持鼠标点击翻页？那他们就无法使用。

**在 Folio 中的实现：**

```
键盘支持：
- 翻页：← → ↑ ↓ Space
- 全屏：F
- 退出：Escape
- 焦点可见：:focus-visible 样式
```

```css
*:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 2px;
}
```

---

## 5. 动效可控

**要求：** 部分用户因前庭障碍（vestibular disorders）在使用有动效的界面时会头晕、恶心。必须提供关闭动效的能力。

**在 Folio 中的实现：**

```css
/* 尊重系统设置 */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}

/* 手动低功耗模式（B 键） */
body.low-power *, body.low-power *::before, body.low-power *::after {
  animation-duration: 0.01ms !important;
  transition-duration: 0.01ms !important;
}
```

---

## 6. 屏幕阅读器

**要求：** 屏幕阅读器用户需要知道页面结构和内容。

**在 Folio 中的实现：**

```html
<!-- 页面标题 — 帮助屏幕阅读器用户理解当前在哪一页 -->
<section aria-label="第3页：我们的数据" role="region">

<!-- 图片替代文字 — 不要留空 alt -->
<img src="chart.jpg" alt="2024年营收增长35%的图表">

<!-- 跳转链接 — 让用户可以直接跳到主内容 -->
<a href="#content" class="skip-link">跳到主要内容</a>

<!-- 动态内容通知 — 告知屏幕阅读器内容已更新 -->
<div aria-live="polite" class="sr-only">第3页已加载</div>
```

---

## 总结：无障碍检查清单

- [ ] 所有正文对比度 ≥ 4.5:1（用工具检查强调色叠背景色）
- [ ] 所有可交互元素触控区域 ≥ 44px
- [ ] 200% 缩放后内容不丢失
- [ ] 键盘完整可操作（不用鼠标也能翻完全部页面）
- [ ] 动效有关闭方式（prefers-reduced-motion 或 B 键）
- [ ] section 有 aria-label，图片有 alt 文字
