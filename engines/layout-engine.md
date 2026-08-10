# Layout Engine

> 布局选择与组合规则

## 核心原则

1. **不对称优先** — 避免 50/50 对称分割，推荐 4/8、3/9、7/5
2. **图文叠加** — 文字浮于图上是杂志感的灵魂
3. **全出血** — 图片突破安全区边界创造沉浸感
4. **节奏变化** — 连续 2 页相同布局后必须换布局
5. **封面 / 章节 / 收束页** — 必须用居中或大字布局
6. **主辅分层** — 同一页的图片不应平均分配，必须有主图、辅图和证明图的层级
7. **图片外观一致** — 作品集图片默认直角；不要在同一 deck 中混用圆角和直角
8. **参考先归纳** — 外部案例板只用于提取版心、图组、gap、留白和对齐规则，不直接照抄模板

## 构图协议

Folio 的布局不是把元素放到页面上，而是先建立版心，再决定元素占据哪些线。

每一页在写 HTML 前必须先回答 5 个问题：

| 问题 | 必填答案 |
|------|----------|
| 版心 | `content` / `content-v` / `content-h` / `full-bleed` |
| 出血模式 | `no-bleed` / `soft-bleed` / `edge-bleed` / `full-bleed` / `print-bleed` |
| 网格 | 默认 `layout-frame`，12 列 + 8 行 |
| 主视觉 | `frame-media-left` / `frame-media-right` / `frame-media-wide` / `frame-full` |
| 文案锚点 | `frame-copy-left` / `frame-copy-right` / `frame-title` / `frame-body` |
| 间距 | 只用 `--folio-caption-gap` / `--folio-module-gap` / `--folio-section-gap` |

默认结构：

```html
<section class="slide" data-layout="split-4-8" data-bleed-mode="no-bleed">
  <div class="content layout-frame">
    <div class="frame-copy-left align-mid">...</div>
    <figure class="frame-media-right figure-stack">
      <div class="img media-anchor-top r-4x3">...</div>
      <figcaption class="caption">...</figcaption>
    </figure>
  </div>
</section>
```

### 版面线

| 线 | 作用 |
|----|------|
| bleed line | 图片为印刷或视觉冲击允许超出的外延线 |
| trim line | 最终页面边缘；PDF 和截图应以此为可见边界 |
| safe line | 标题、正文、caption、页码、页脚必须留在此线内 |
| content frame | 12-column 工作版心，默认图文模块都应对齐到这里 |
| `--safe-x` | 左右外边距，所有非出血内容必须落在此线内 |
| `--safe-y` | 上下外边距，标题、元数据、图片边缘优先对齐 |
| `--nav-safe` | 底部导航避让区，正文和图片说明不能压到这里 |
| 12-column | 控制左右位置和宽度，不允许随意写百分比宽度 |
| 8-row | 控制上下锚点，用于标题、图片、正文的垂直关系 |
| baseline 8px | 控制文字段落、caption、模块间距节奏 |

调试时在 `<body>` 加 `show-guides`，检查列、边距和 baseline 是否成立。交付前移除。

### 出血模式

出血不是装饰效果，而是版心合同的一部分。每页必须先声明 `data-bleed-mode`，再决定图片是否能突破内容框。

| 模式 | 边界规则 |
|------|----------|
| `no-bleed` | 图像、文字、caption 全部对齐 content frame 或 safe line |
| `soft-bleed` | 主图可以轻微突破 content frame，但不能触碰 trim line |
| `edge-bleed` | 主图可以贴住一条或两条 trim line，文字和 caption 仍必须留在 safe line 内 |
| `full-bleed` | 主图铺满 trim line 内的整页，文字覆盖层必须回到 safe line |
| `print-bleed` | 主图超出 trim line，PDF/印刷按 3mm 等效出血处理，导出前必须检查裁切 |

出血验收：

- `no-bleed` 页面不得有图片越过 safe line，除非在 page planning 中说明理由
- `soft-bleed` 页面必须仍能看见稳定 content frame，不能像随机溢出
- `edge-bleed` 和 `full-bleed` 页面必须检查文字、页码、项目标签没有贴边
- `print-bleed` 只用于需要印刷裁切的导出；普通 HTML 预览不要假装已经有真实 3mm 裁切

### 参考板转译

作品集和空间类 deck 可以先看用户维护的持续参考板：

`https://www.pinterest.com/jorgutyn/visualizationlayouts-%D0%BC%D0%B0%D0%BA%D0%B5%D1%82%D1%8B/layout/`

使用参考板时必须输出“转译结论”，不要只说“参考 Pinterest 风格”：

- 这组参考适合哪种页型：opener / proof spread / gallery board / detail atmosphere
- 它的网格是什么：single hero / 2-column / 3-column / masonry / strip / board
- 它的图像层级是什么：hero + support / equal grid / rhythm strip / text-led
- 它的 gap 属于 tight / standard / wide 哪一档
- 它依赖哪条对齐线：共享顶边、底边、右边界、baseline 或主轴
- 当前 deck 只继承结构原则，不复制图片、文案、品牌和模板细节

内置参考库：

- `reference-layouts/taxonomy.md`：把参考图分成 hero opener、2-column board、moodboard grid、split proof spread 等类型
- `reference-layouts/templates.md`：把类型转译成可复用线框模板
- `reference-layouts/catalog.md`：记录 Pinterest 参考板 43 个 pin 的全量分类映射
- `reference-layouts/previews/index.html`：灰阶线框预览，用于快速挑选版式方向

### 作品集版心合同

建筑、室内、空间作品集必须先定义 layout contract，再做页面局部设计：

| 合同项 | 作用 |
|--------|------|
| page size | HTML 和 PDF 的统一页面尺寸 |
| margins | 左右上下边距，决定全书版心 |
| image frame | 项目图组的外框，跨页必须复用 |
| image gap | `tight` / `standard` / `wide` 的具体值 |
| image radius | 默认 0；全书必须一致 |
| text-image gap | 文字栏和图组之间的距离 |
| caption gap | caption 到图片或图组的距离 |
| footer safe area | 页码、项目标签和图像之间的安全距离 |
| opener frame | 项目首页图像框 |
| continuation frame | 项目继续页图像框 |
| PDF safe area | 导出 PDF 后仍成立的裁切和页脚避让 |

版心合同是硬约束，不是建议。局部构图可以变化，但不能破坏全书的 margin、gap、footer safe area 和同项目跨页边界。

### 几何验收

高级作品集不能只凭截图肉眼判断。交付前必须检查每个项目页的 `figure` 几何盒：

- `left`
- `right`
- `top`
- `bottom`
- `width`
- `height`
- computed `gap`
- computed `border-radius`
- 到页脚、页码、项目标签和文字块的距离

用户指出一处问题时，必须全书扫描同类问题。不能只修用户截图里的页面。

### 图片外观

作品集和空间提案默认不要给图片加圆角：

- `figure` 和 `figure img` 默认 `border-radius: 0`
- 除非用户明确要求柔和卡片风格，否则不要使用 6px、8px、12px 这类圆角
- 一旦选择圆角，同一 deck 必须全局一致；不能局部有圆角、局部没有圆角
- 如果导出、截图或跨平台渲染无法稳定保持圆角一致，就回退到全局直角

### 图片间距尺度

图片间距不是装饰值，必须按图像数量和版式密度选择：

| 模式 | Gap | 使用场景 |
|------|-----|----------|
| `tight` | 12-14px | 多图作品集、同项目连续页、2x2 proof spread |
| `standard` | 16-18px | 普通图文页、双图页、少量图片 |
| `wide` | 24-32px | 图文大分隔、章节页、单图留白 |

多图项目页优先用 `tight`。如果一页有 4 张以上图片，默认不要超过 14px。

### 图片锚点

图片必须说明焦点锚点，避免 `object-fit: cover` 随机裁切重点：

| 类名 | 用途 |
|------|------|
| `media-anchor-top` | 人脸、建筑顶部、天空线在上方 |
| `media-anchor-mid` | 默认居中构图 |
| `media-anchor-bottom` | 地面、产品底座、桌面信息在下方 |
| `media-anchor-left` | 主体在左 |
| `media-anchor-right` | 主体在右 |

图片和说明文字用 `figure-stack`，caption gap 固定为 `--folio-caption-gap`。

### 混合比例对齐规则

当一页同时出现竖图和横图，或不同高度的图片时，先做“找齐”，再做“好看”：

- 同级图片优先共享顶边、底边或中轴线，避免一张图像漂浮在另一张图旁边
- 如果一张图是主图，辅图必须服从主图的高度、边线或网格槽位
- 辅图不要按自身比例独立决定版心；应优先按整组模块的高度与节奏裁切
- 若无法同时满足顶边和底边，优先保住主图的完整性，再让辅图适度裁切
- 竖图与横图并置时，尽量让它们落在同一视觉组里，而不是各自单独居中
- 只有在刻意制造节奏断裂时，才允许局部错位

同一项目跨页还有额外要求：

- project opener、proof spread、gallery board、detail page 必须共享同一套 image frame
- 文字页和 continuation 页至少要统一图片组右边界
- 如果一页因为文字栏占位导致左边界不同，右边界仍必须找齐
- 禁止第 1 页图片组短一截、第 2 页贴到版心边；这会让项目看起来像两个不相关页面
- 修复某个项目的边界时，必须扫描所有项目页，不只修用户截图里的那一页

### 作品集 hard stop

以下情况不能交付：

- 图片 manifest 未完成
- 项目图片数量和 manifest 不一致
- 图片归属项目不明
- 同一 deck 图片圆角不一致
- 多图页 gap 不符合 layout contract
- 任意图像压到 footer safe area、页码、项目标签或正文
- 任意页面横向溢出
- 同一项目跨页 image frame 没有找齐且无明确设计理由
- HTML 和 PDF 页面截图视觉不一致

### 对齐规则

- 标题左边缘和正文左边缘必须共线，除非使用 Cover / Chapter / Closing。
- 同一页多张图片必须共享至少一条上边线、左边线或中轴线。
- 图文 Split 优先 `4/8`、`3/9`、`7/5`；禁止临时写 `width: 43%` 这类无网格依据的比例。
- 正文模块之间用 `--folio-module-gap`；章节级留白用 `--folio-section-gap`。
- 全出血图片可以突破安全区，但覆盖文字仍必须回到 `content-start/content-end` 内。
- 连续页可以换视觉，但外边距、列沟和 caption gap 必须保持一致。
- 作品集/空间类页面优先显式标出页型：`project opener` / `proof spread` / `gallery board` / `detail page` / `closing`。

## 版式丰富度系统

Folio 必须根据内容和用户专业度选择不同构图，不允许全 deck 重复一种“标题 + 图片 + 正文”的默认结构。

### 受众模式

| 用户/听众 | HTML class | 版式策略 |
|-----------|------------|----------|
| 非专业 / 初次接触 | `audience-beginner` | 大标题、短句、单一阅读路径、强图片解释 |
| 专业 / 评审 / 投资人 | `audience-expert` | 信息密度更高、对照表、边注、证据链、可扫描结构 |
| 混合受众 | 默认 | 关键页 beginner，证据页 expert，收束页 airy |

### 信息密度

| 密度 | HTML class | 使用场景 |
|------|------------|----------|
| Airy | `density-airy` | 封面后第一观点、奢侈品牌、建筑/作品集、强情绪页 |
| Balanced | `density-balanced` | 默认叙事页、图文页、方法解释 |
| Compact | `density-compact` | 数据、对比、表格、清单、专家材料 |

### 构图家族

| 家族 | 典型组合 | 适合内容 |
|------|----------|----------|
| Hero + Rail | `frame-media-hero` + `frame-copy-rail-right` | 高质量图片 + 短观点 |
| Portrait Feature | `frame-copy-left` + `frame-media-portrait` | 人物、产品、建筑立面、案例主图 |
| Evidence Board | `frame-title-wide` + `frame-card-a/b/c` | 三证据、三方案、三阶段 |
| Sidebar Report | `frame-sidebar-left` + `frame-main-right` | 专业报告、研究发现、方法论 |
| Strip Narrative | `frame-media-strip-top` + `frame-copy-wide` | 时间线、流程、场景开场 |
| Centerpiece | `frame-centerpiece` | 单一强观点、报价、宣言、章节前奏 |
| Dense Compare | `frame-title-wide` + compact cards/table | 专家对照、投资人/评审材料 |

### 专业度决策

```
IF 用户说“给老板/投资人/专家评审看”
  → 用 audience-expert + density-compact/balanced
  → 多用 Sidebar Report / Dense Compare / Evidence Board

IF 用户说“给大众/客户/新人/课程开场”
  → 用 audience-beginner + density-airy/balanced
  → 多用 Hero + Rail / Portrait Feature / Centerpiece

IF 用户只给主题，没有说明受众
  → 前 30% 页面 beginner，主体 balanced，证据页 expert，结尾 airy
```

### 版式节奏

8 页 deck 推荐节奏：

```
Cover
→ Hero + Rail
→ Sidebar Report
→ Evidence Board
→ Gallery / Strip Narrative
→ Dense Compare
→ Centerpiece / Quote
→ Closing
```

16 页 deck 推荐节奏：

```
Cover
→ Hero + Rail
→ Overlay
→ Editorial
→ Stats
→ Evidence Board
→ Gallery
→ Chapter
→ Sidebar Report
→ Timeline / Strip Narrative
→ Dense Compare
→ Table
→ Portrait Feature
→ Pull Quote
→ Centerpiece
→ Closing
```

### 丰富度禁忌

- 不要为了“丰富”随机换布局；每次变化都必须对应内容功能变化。
- 同一 deck 里最多 2 页使用完全相同构图家族。
- 专业页可以紧凑，但必须保留清晰扫描线：标题、证据、结论不能混成一团。
- 非专业页可以留白，但不能空洞；每页必须有一个可复述的核心观点。
- 图片质量低时不要用 Hero + Rail；改用 Sidebar Report 或 Evidence Board，让文字承担主信息。

## 布局组合策略

| 内容类型 | 推荐布局序列 | 说明 |
|---------|------------|------|
| 产品路演 | Cover → Split → Gallery → Stats → Closing | 先摆产品再讲故事 |
| 研究报告 | Cover → Timeline → Split → Table → Stats → Closing | 先时间线建立信任 |
| 设计作品集 | Cover → Project Opener → Proof Spread → Gallery Board → Detail Page → Closing | 视觉驱动，但要有页型分工 |
| 商业模式 | Cover → List → Compare → Stats → Table → Closing | 逻辑驱动 |
| 学术汇报 | Cover → Editorial → Table → Stats → Split → Closing | 内容驱动 |

## 布局速查

| 布局 | 定义 | 最佳内容量 | 视觉权重 |
|------|------|-----------|---------|
| Cover | `<section data-layout="cover">` | 标题 + 副标题 | 高 |
| Split 4-8 | `data-layout="split"` 默认 | 1 图 + 若干文字 | 中 |
| Split 3-9 | `class="col-span-3"` 左侧 | 窄侧强调 | 中 |
| Overlap | `data-layout="overlap"` | 全屏图 + 浮层文字 | 高 |
| Bleed Quote | `data-layout="bleed-quote"` | 图 + 大字引语 | 很高 |
| Editorial | `data-layout="editorial"` | 2栏正文 | 低 |
| Stats | `data-layout="stats"` | 3-4 个数字 | 很高 |
| Gallery | `data-layout="gallery"` | 4-8 张图 | 中 |
| Timeline | `data-layout="timeline"` | 3-6 步骤 | 中 |
| Spread | `data-layout="spread"` | 左图右文全出血 | 很高 |
| Compare | `data-layout="compare"` | 2 组对比 | 中 |
| List | `data-layout="list"` | 4-8 条项目 | 低 |
| Chapter | `data-layout="chapter"` | 章节标题 | 高 |
| Table | `data-layout="table"` | 3-8 行数据 | 低 |
| Inset | `data-layout="inset"` | 1 图 1 文 | 中 |
| Pull-quote | `data-layout="pull-quote"` | 1 条引用 | 高 |

## 布局决策规则

```
IF 图片质量高 → 选择 Overlap / Bleed / Spread / Gallery
IF 数据重要 → 选择 Stats / Table
IF 需要叙事 → 选择 Timeline / List
IF 需要对比 → 选择 Compare
IF 品牌感 → 选择 Cover (全屏品牌色或视频背景)
IF 内容密集 → 选择 Editorial / Split (右侧放内容)
```

## 组合禁忌

- ❌ 连续 3 页 Split 布局（视觉疲劳）
- ❌ 连续使用 Stats（每个数字失去冲击力）
- ❌ Cover 后接 Bleed（两个全出血冲突）
- ❌ Gallery 后再用 Gallery（视觉单调）

## 响应式行为

| 布局 | 平板 | 手机 |
|------|------|------|
| Split | 上下排列 | 全堆叠 |
| Overlap | 浮层缩小 | 图在上，文字在下 |
| Spread | 缩小图片区域 | 单列 |
| Gallery | 3 列 | 2 列 |
| Editorial | 合并一栏 | 单列 |
