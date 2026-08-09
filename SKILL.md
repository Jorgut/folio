---
name: folio
description: Magazine-style presentation skill that turns structured content into editable decks across HTML, PPTX, PDF, Figma, and IDML.
version: 1.0.5
tags:
  - presentation
  - slides
  - editorial
  - figma
  - pdf
  - pptx
compatible_with:
  - Codex
  - opencode
  - codex
  - generic-llm
---

# Folio · 版式引擎

> Layout Engine。你给内容 + 风格，我给 deck。
> 不做设计咨询，只做高质量渲染。3 分钟出 deck。

## Cross-platform loading note

This skill is designed to degrade gracefully across different agent platforms.

- If the host supports **file-based skills**, load this folder as `folio` and use `SKILL.md` as the entrypoint.
- If the host does **not** support native skills, paste the relevant parts of `SKILL.md` into the system prompt / project instructions / custom GPT instructions.
- If the host does not resolve `<SKILL_ROOT>`, replace it with the absolute path to this folder before running export commands.

## Update check policy

Folio includes a cross-platform update core:

- `manifest.json` — machine-readable release metadata
- `VERSION` — human-readable local version
- `CHANGELOG.md` — release notes
- `scripts/check-update.mjs` — safe update check
- `scripts/self-update.mjs` — user-confirmed upgrade path

Trigger rules:

1. If the host supports **startup hooks** or **automated skill entry actions**, run:
   ```bash
   node <SKILL_ROOT>/scripts/check-update.mjs
   ```
   when Folio is loaded.
2. If the host does **not** support startup hooks, run the same check on **first use in the session**.
3. If script execution or network access is unavailable, **skip the check and continue normally**.
4. If an update is found, **inform the user and ask whether to run**:
   ```bash
   node <SKILL_ROOT>/scripts/self-update.mjs
   ```
5. When an update is found, **show the concrete maintained features or release highlights first**, so the user can decide whether the upgrade is worth applying.

Do not silently overwrite the local skill. Update checks may be automatic, but upgrades must remain user-confirmed.

## 不知道怎么开始时，直接这样做

先不要同时决定风格、主题色、导出格式和插件流程。

默认起手式：

1. 先做 **8 页 deck**
2. 风格先用 **Minimal** 或 **Editorial**
3. 输出先选 **HTML**
4. 确认结构后，再导出 **PPTX / PDF / Figma / IDML**

给 AI 的最小可用提示词：

> 用 Folio 做一个关于 `[主题]` 的 8 页演示，风格干净现代，先导出 HTML。

工作原则：**先把内容结构跑通，再做风格微调和多格式导出。**

如果用户已经给出**主题**，默认视为信息已足够开始：

- 不要先反问“这个 presentation 是关于什么的”
- 不要先追问 8 页分别写什么
- 不要先追问视觉风格偏好
- 直接按默认值起稿：`8 页` + `Minimal` + `theme-default` + `HTML`
- 先产出一版结构，再在后续回合微调

只有在以下信息会阻止执行时才允许追问：

- 用户明确要求某个你无法推断的输出路径或文件位置
- 用户要求使用外部素材，但素材本身没有提供且无法替代
- 宿主环境缺少执行所必需的权限或文件

## 工作流

### Step 1: 确定风格

如果用户没有明确要求，默认：
- 风格：`Minimal`
- 主题：`theme-default`
- 输出：`HTML`
- 页数：`8`
- 受众：`混合受众`
- 信息密度：`balanced`

除非用户明确指定，否则用决策表定：

| 场景 | 风格 | 主题 class |
|------|------|-----------|
| 商业/正式/科技 | Minimal | `default` / `mono` |
| 杂志/内容/学术 | Editorial | `default` / `sand` |
| 设计/艺术/文化 | Swiss | `mono` |
| 建筑/空间/作品集 | Architectural | `forest` |
| 大胆/反传统 | Brutalism | `sand` |
| 科技/现代/SaaS | Glass | `indigo` / `ocean` |
| 深色模式/科技 | Dark | `indigo` / `forest` |
| Dashboard/数据 | Bento | `mono` |
| 高端/品牌 | Luxury | `rose` |
| 创意/游戏 | Cyberpunk | `neon` |

完整风格参数 → `design/style-guide.md`

### Step 2: 确定受众、密度和版式节奏

不要只问“做什么风格”。Folio 必须先判断这份 deck 给谁看：

| 线索 | 受众模式 | 密度 | 版式倾向 |
|------|----------|------|----------|
| 老板 / 投资人 / 专家评审 | `audience-expert` | compact / balanced | Evidence Board, Dense Compare, Sidebar Report |
| 客户 / 大众 / 新人 / 课程开场 | `audience-beginner` | airy / balanced | Hero + Rail, Portrait Feature, Centerpiece |
| 作品集 / 品牌 / 空间展示 | mixed | airy | Hero image, Gallery, Strip Narrative |
| 报告 / 研究 / 方法论 | expert | compact | Table, Timeline, Sidebar Report |
| 没说明受众 | mixed | balanced | 前面易懂，中段专业，结尾留白 |

每页先选：

1. 受众模式：`audience-beginner` / `audience-expert` / 默认 mixed
2. 密度：`density-airy` / `density-balanced` / `density-compact`
3. 构图家族：Hero + Rail / Portrait Feature / Evidence Board / Sidebar Report / Strip Narrative / Centerpiece / Dense Compare
4. 版心和锚点：`.content.layout-frame` + `frame-*` + `media-anchor-*`

### Step 2.5: 作品集/空间类 deck 的页型原则

当用户给的是作品集、空间提案、室内方案、品牌空间或视觉合集时，先把每页分成固定职责，而不是只看图片数量：

| 页型 | 作用 | 版式要点 |
|------|------|----------|
| Project Opener | 交代项目身份 | 标题、地点、年份、类型、1 张主图或 2 图主辅 |
| Proof Spread | 证明设计判断 | 1 张主图 + 2-4 张辅图，突出材质/动线/灯光/尺度 |
| Gallery Board | 展示图集 | 允许多图，但必须有主次，不要平均分配 |
| Detail / Atmosphere | 讲局部与气氛 | 图可以少，但要说明它证明了什么 |
| Closing | 收束与留白 | 只保留最关键的 1 句话或感谢页 |

混合竖图/横图时，优先遵循以下顺序：

1. 同级信息必须找齐：优先顶边、底边或同一基线对齐
2. 如果一张图只是辅助图，就把它放进明确的次级栏位，不要让它自由漂浮
3. 同一组图片要共享一个主轴，不要每张图各自居中
4. 只有在刻意制造非对称时，才允许局部错位

图片外观和间距默认遵循作品集级别的硬规则：

- 默认所有作品集图片使用直角：`border-radius: 0`。除非用户明确要求软圆角，否则不要对图片或 figure 加圆角
- 同一个 deck 里不允许有的图片圆角、有的图片直角；如果无法稳定控制，就全局禁用圆角
- 同一项目跨页必须共享同一条 image frame 右边界，不能第 1 页图组短一截、第 2 页贴到版心边
- 同一项目跨页若有文字页和 continuation 页，至少要统一右边界；能统一左边界时也要统一左边界
- 作品集图片 gap 默认用 `tight`，不要凭感觉留大缝

图片间距按图像密度选择：

| 模式 | Gap | 使用场景 |
|------|-----|----------|
| `tight` | 12-14px | 作品集图组、同项目连续页、2x2/多图证明页 |
| `standard` | 16-18px | 普通图文页、少量图像、需要呼吸感 |
| `wide` | 24-32px | 章节页、强留白页、单图和文字之间的大关系 |

如果用户指出某一页有对齐问题，不要只修那一页。必须扫描同一 deck 的所有项目页：

1. 图片圆角是否全局一致
2. 同项目跨页 image frame 左/右边界是否一致
3. 多图组是否共享顶边、底边或主轴
4. gap 是否按 `tight / standard / wide` 有意选择
5. continuation 页是否和项目 opener / proof spread 属于同一套版心

继续页（continuation）不要只放图片。它至少要回答一件事：

- 这是在证明什么
- 这组图属于哪一段空间体验
- 这一页和上一页是什么关系

如果用户在做的是作品集复盘，默认先看：

1. 页面职责是否清楚
2. 图文是否服从同一套网格
3. 主图/辅图是否有明显层级
4. 混合比例图片是否找齐
5. 继续页是否补了上下文

### Step 2.6: Architecture / Interior Portfolio QA Workflow

建筑、室内、空间、展览、品牌空间类作品集不能当成“图片重排任务”。必须当成“全书版式系统任务”处理：先建立资料和版心合同，再排版，再做全书几何验收，最后导出。

#### 1. Portfolio Intake：先锁资料 manifest

没有完成 manifest，不进入排版。先建立项目和图片清单：

| 字段 | 必填内容 |
|------|----------|
| project_id | 项目唯一 ID |
| project_title | 项目名 |
| project_type | residential / hospitality / retail / exhibition / F&B / other |
| page_count | 计划页数 |
| image_file | 图片文件名 |
| image_project | 图片归属项目 |
| image_role | hero / proof / detail / atmosphere / plan / process |
| ratio | 实测宽高比 |
| ratio_class | 16:9 / 4:3 / 3:4 / 9:16 / special |
| quality | high / usable / weak |
| crop_risk | none / low / high |
| notes | 是否拼贴、是否旧图、是否需要拆分或替换 |

硬规则：

- 项目图片数量必须等于 manifest 中该项目图片数量
- 任意图片项目归属不明时，停止排版
- 拼贴图、旧合成图、重复图必须先标记，不能混入最终图组
- 不允许把 A 项目的图片排进 B 项目
- 图片命名必须能读出项目和语义；不要只用 `image-1.jpg`

#### 2. Layout Contract：先锁全局版心合同

每本作品集必须在第一轮排版前定义全局合同：

| 合同项 | 必填 |
|--------|------|
| page_size | HTML viewport 和 PDF 页面尺寸 |
| margin_left / margin_right | 左右边距 |
| margin_top / margin_bottom | 上下边距 |
| image_frame | 项目图组外框 |
| image_gap | tight / standard / wide 的具体 px |
| image_radius | 默认 `0px`，除非用户明确要求 |
| caption_gap | caption 与图像关系 |
| text_image_gap | 文字栏与图组距离 |
| footer_safe_area | 页脚避让区 |
| opener_frame | project opener 图像版心 |
| continuation_frame | continuation 页图像版心 |
| pdf_safe_area | PDF 裁切和页脚安全区 |

硬规则：

- 版心合同先于页面局部造型
- 同一项目跨页至少共享同一条右边界
- 多项目同类型页面必须共享同一套 margin / gap / footer safe area
- 禁止边做边调导致“一页好、一页坏”

#### 3. Project Page Planning：先定页面职责

每个项目先写页面职责，再决定图片放哪里：

| 页型 | 允许内容 | 禁止 |
|------|----------|------|
| opener | 项目身份、主图、1-2 张辅助图 | 无上下文图片堆叠 |
| proof spread | 证明设计判断的主辅图组 | 平均分配所有图片 |
| gallery board | 多图展示但有主次和统一图框 | 每张图各自居中 |
| detail atmosphere | 材质、灯光、局部、尺度说明 | 只放漂亮局部而不说明作用 |
| continuation | 承接上一页，延续同一 image frame | 无标题、无关系、无语义的纯图片页 |

#### 4. Ratio Solver：比例先解，再裁切

图片比例处理必须显式：

- 横图优先映射到 16:9 或 4:3
- 竖图优先映射到 3:4 或 9:16
- 正方图或非常规比例标记为 `special`
- 如果裁切会破坏主体，必须记录 `crop_risk: high`，改用 special ratio 或询问用户
- 不允许静默把竖图硬裁成横图，也不允许为了填满网格裁掉主要空间信息

#### 5. Global Audit：用户指出一页，全书扫同类问题

用户指出任何一页的版式问题，都必须扫描同一 deck 的所有项目页，不只修截图页：

| 检查项 | 必须验证 |
|--------|----------|
| radius | 所有 figure / img 圆角是否一致 |
| image gap | 所有图组 gap 是否符合合同 |
| image frame | 同项目跨页左/右边界是否一致 |
| group alignment | 多图是否共享顶边、底边、中轴线或主轴 |
| text distance | 图片与文字距离是否安全 |
| footer safe area | 图片是否压到页脚、页码、项目标签 |
| overflow | 页面是否横向溢出或裁切 |
| manifest match | 项目图片是否完整、归属是否正确 |
| continuation context | 继续页是否说明和上一页的关系 |

#### 6. Geometry Verification：不要只凭肉眼

视觉看起来通过不等于通过。必须用浏览器或脚本检查每个 `figure` 的几何盒：

- `left`
- `right`
- `top`
- `bottom`
- `width`
- `height`
- computed `gap`
- computed `border-radius`
- 与 page footer / text block 的距离

至少要验证：

- HTML desktop
- HTML mobile 或窄屏
- PDF 页面截图

如果用户看到的截图和本地截图不同，先排查 viewport、浏览器缩放、file/local server 缓存、PDF 导出渲染差异，不要直接宣称“已经修好”。

#### 7. Visual Regression Report：改完必须可复核

每次修改作品集后，回复里必须说明：

- 改了哪几个项目
- 每个项目改了哪一页
- 使用了哪些图片
- 删除、替换或新增了哪些图片
- 调整了哪些 layout contract 值
- HTML 验证结果
- PDF 是否同步导出和截图验证
- 仍有哪些 pending 或 out-of-scope

#### 8. Hard Stop：以下情况不能说完成

只要出现以下任一情况，不能交付、不能说完成：

- 项目图片数量不等于 manifest
- 任意图片项目归属不明
- 任意 project figure 圆角不一致
- 任意图片压到页脚、页码或文字
- 任意页面横向溢出
- 同一项目跨页 image frame 没有找齐且无明确理由
- PDF 与 HTML 视觉明显不一致
- 交付 PDF 超过用户指定目标大小
- 没有做全书同类问题扫描

### Step 3: 拷贝模板

```bash
cp <SKILL_ROOT>/index.html 项目/index.html
mkdir -p 项目/images
```

在 `<body>` 上切换主题色（8 种预设）：

| class | 色感 | 适用风格 |
|-------|------|---------|
| `theme-default` | 墨水经典（暖白+古金） | Editorial, Minimal |
| `theme-indigo` | 靛蓝瓷（蓝灰） | Glass, Dark, 科技 |
| `theme-forest` | 森林墨（深绿） | Architectural, Dark |
| `theme-sand` | 沙丘（暖土） | Brutalism, Editorial |
| `theme-mono` | 单色（黑白灰） | Minimal, Swiss |
| `theme-neon` | 霓虹（暗底+荧光） | Cyberpunk |
| `theme-rose` | 玫瑰（暖粉+金） | Luxury |
| `theme-ocean` | 海洋（冷蓝） | Glass, Tech |

### Step 4: 填充内容

1. 读 `design/style-guide.md` → 按风格参数调字体/颜色/间距/特效
2. 读 `engines/layout-engine.md` → 先定构图协议，再选布局组合（16 种布局，不对称优先）
3. 每页先写 `data-layout`，再放 `.content.layout-frame` 或明确说明为什么使用 `full-bleed`
4. 每页必须声明受众/密度意图：通过 `audience-*`、`density-*` class 或在构图选择中体现
5. 图文页必须声明列跨、垂直锚点、图片焦点锚点和 caption gap
6. 粘 `<section data-layout="cover">`，改文案和图片路径
7. 图片放 `images/`，命名 `{页号}-{语义}.{ext}`

构图起手式：

```html
<section class="slide" data-layout="split-4-8">
  <div class="content layout-frame">
    <div class="frame-copy-left align-mid">...</div>
    <figure class="frame-media-right figure-stack">
      <div class="img media-anchor-top r-4x3">...</div>
      <figcaption class="caption">...</figcaption>
    </figure>
  </div>
</section>
```

需要检查版面时，临时给 `<body>` 加 `show-guides`，检查安全区、12 列、baseline 和图片锚点。交付前移除。

### Step 5: 导出

| 格式 | 命令 |
|------|------|
| PPTX（推荐，文字可编辑） | `node <SKILL_ROOT>/scripts/export-native-pptx.mjs index.html` |
| PDF 印刷 | `node <SKILL_ROOT>/scripts/export-print-pdf.mjs index.html` |
| **Figma**（双模式：C2D 云API / 本地插件） | `node <SKILL_ROOT>/scripts/export-figma.mjs index.html` |
| IDML（InDesign 原生导入） | `node <SKILL_ROOT>/scripts/export-idml.mjs index.html` |
| 验证 | `node <SKILL_ROOT>/scripts/export-verify.mjs index.html` |

### Figma 导出

**自动模式（推荐）：**
```bash
node scripts/export-figma.mjs index.html
```
→ 有 `C2D_API_KEY` 则用 Code.to.Design（高 fidelity，剪贴板粘贴）
→ 无 key 则用本地插件模式

**手动指定模式：**
```bash
node scripts/export-figma.mjs --mode c2d index.html    # 强制云 API
node scripts/export-figma.mjs --mode local index.html   # 强制本地插件
```

#### 本地插件模式（免费）
1. `node scripts/export-figma.mjs --mode local index.html` → 生成 `index.figma.json` + `figma-plugin/`
2. Figma 中：Plugins → Development → Import plugin from manifest… → 选择 `figma-plugin/manifest.json`
3. **Figma Design** 中运行：Plugins → Folio Importer → 选择 `index.figma.json` → Import
4. **Figma Slides** 中运行：打开 Slides 文件 → 同样运行 Folio Importer → 自动创建 Slide 节点（1920×1080）

#### Code.to.Design 模式（高 fidelity）
1. 配置环境变量：`export C2D_API_KEY="你的key"`
2. `node scripts/export-figma.mjs --mode c2d index.html`
3. 自动打开浏览器 Paste Helper → 复制到剪贴板 → Figma 粘贴

> 首次使用本地模式需要注册插件（一次性）。C2D 模式首次运行会自动引导获取 API Key。

## 文件索引

| 你要什么 | 读这个 |
|---------|-------|
| 风格参数（字体/颜色/特效/禁忌） | `design/style-guide.md` |
| 布局规则（什么时候用什么布局） | `engines/layout-engine.md` |
| 排版规则（字体配对/字号层级） | `engines/typography-engine.md` |
| 配色方案（主题色板/决策规则） | `engines/color-engine.md` |
| 交互模式（按场景选，不要随机加） | `design/principles.md` → Interaction Levels |
| 动效方案（时长/曲线/序列） | `engines/animation-engine.md` |
| 视觉特效（Glass/Aurora/Noise/Glow） | `engines/visual-effects-engine.md` |
| 导出参数（PPTX/PDF/Figma 配置） | `engines/export-engine.md` |
| 设计原理（Gestalt / UX Laws） | `design/principles.md` |

## 约束（违反 = 重做）

- **8pt Grid** — 间距严格 `--sp-4`(32) / `--sp-5`(40) / `--sp-6`(48) / `--sp-7`(56) / `--sp-8`(64) / `--sp-9`(80)
- **Composition Frame** — 非封面/非全出血页必须优先使用 `.content.layout-frame`
- **12 Column Grid** — 内容区 12 列，子元素用 `frame-*` 或 `col-span-*`
- **Layout Diversity** — 每 3 页必须至少出现 2 个构图家族
- **Audience Fit** — 专业受众用 compact/evidence/table，对大众受众用 airy/hero/centerpiece
- **Image Anchors** — 图片必须用 `media-anchor-*` 指定裁切焦点
- **Baseline Rhythm** — caption / module / section 间距分别用 `--folio-caption-gap` / `--folio-module-gap` / `--folio-section-gap`
- **不对称优先** — 别用 50/50，用 4/8、3/9、7/5
- **字号对比 ≥ 6:1** — 主标题 vs 正文
- **一个 deck 一套主题色** — 中途不换
- **连续 2 页相同布局后必须换布局**
- **导航层级 ≤ 3 层**（Hick's Law）
- **触控目标 ≥ 44px**（Fitts's Law）
- **不要随机加动效** — 从 `design/principles.md` 选合适的交互层级
- **封面 / 章节页 / 收束页** 必须用居中或大字布局
