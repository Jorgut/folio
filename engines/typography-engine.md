# Typography Engine

> 字体系统与排版规则

## 核心原则

1. **对比大于一致** — 标题与正文字号比 ≥ 6:1
2. **字体分工明确** — 标题 / 正文 / 元数据各有专用字体
3. **行距与行长** — 正文 1.5-1.8 行距，每行 ≤ 80 字符
4. **层级清晰** — 标题 → 副标题 → 正文 → 元数据 → 标注

## Text Fit QA

Treat rendered text boxes as part of the layout geometry.

For every dense slide, table slide, bilingual slide, and final export candidate, check:

| Check | Failure signal |
|------|----------------|
| Bounding box | Text extends outside slide, safe line, or intended text frame |
| Line count | Rendered lines exceed the planned frame height |
| Long line | CJK sentence becomes a single hard-to-scan line; Latin metadata becomes an unbroken strip |
| Shrink-to-fit | PowerPoint or export tooling silently reduces type size to make copy fit |
| Footer safety | Source notes, page numbers, or disclaimers collide with body/caption content |
| Script fit | Chinese and Latin text both remain legible with their actual rendered fonts |
| Export consistency | HTML, PPTX, and PDF preserve line breaks, size, and hierarchy |

Severity:

- `P0`: clipped, hidden, off-slide, or overlapping text.
- `P1`: readable only through excessive shrink, unsafe footer collision, or too-small body/table text.
- `P2`: awkward line breaks, widows/orphans, weak rhythm, or overlong metadata.

Do not use shrink-to-fit as the default fix. Prefer reducing copy, splitting the slide, changing to a denser page type, or moving secondary information into notes/appendix.


## 字体配对矩阵

| 风格 | 标题 | 正文 | 元数据 | 语感 |
|------|------|------|--------|------|
| **Editorial** | 衬线 (`Playfair Display`) | 无衬线 (`Inter`) | 等宽 | 高级杂志 |
| **Swiss** | 几何无衬线 (`Inter Heavy`) | 几何无衬线 (`Inter`) | 紧凑 | 现代理性 |
| **Minimal** | 细无衬线 (`Helvetica Neue Light`) | 无衬线 (`Helvetica Neue`) | 小字 | 日系简约 |
| **Architectural** | 细衬线 (`Cormorant Garamond`) | 无衬线 (`Inter Light`) | 压缩 | 空间感 |
| **Brutalism** | 粗无衬线（`Impact` / `Arial Black`） | 无衬线 | 大字号 | 大胆直接 |
| **Dark** | 现代无衬线 (`SF Pro Display`) | 细无衬线 (`Inter Light`) | 半透明 | 科技感 |
| **Luxury** | 衬线 (`Playfair Display` / `Didot`) | 细无衬线 (`Inter Thin`) | 大写间距 | 高端感 |
| **Cyberpunk** | 展示字体 (`Orbitron` / `Rajdhani`) | 科技无衬线 | 发光 | 未来感 |

> 模板内置 Google Fonts 加载，按需引入。

## 排版层级

```
H1: 封面标题     → clamp(3rem, 6vw, 6rem)   字重 700-900
H2: 章节标题     → clamp(2rem, 4vw, 4rem)    字重 700-900
H3: 区块标题     → clamp(1.25rem, 2vw, 2rem) 字重 600-700
H4: 卡片标题     → clamp(1rem, 1.5vw, 1.5rem)字重 600
.lead: 引语     → clamp(1.125rem, 1.5vw, 1.5rem) 字重 400
.body: 正文     → clamp(0.9375rem, 1.1vw, 1.125rem) 字重 400
.caption: 标注  → 0.75rem-0.875rem         字重 400
.meta: 元数据   → 0.625rem-0.75rem         字重 400
```

## 决策规则

```
IF 正式/学术 → 用衬线标题
IF 科技/现代 → 用无衬线
IF 创意/艺术 → 用展示字体或夸张标题
IF 品牌感 → 匹配品牌现有字体
IF 中文内容 → 衬线用 Noto Serif SC，无衬线用 Noto Sans SC
```

## 排版禁忌

- ❌ 标题用细体 + 小字号（没有冲击力）
- ❌ 正文行距 < 1.4（读起来挤）
- ❌ 一行超过 80 个字符（行长过长）
- ❌ 使用超过 3 种不同字体家族
- ❌ 全大写正文（降低可读性）
