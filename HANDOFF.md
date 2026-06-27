# Folio · Session Handoff

最后提交: `bcdd168` · 仓库: `github.com/Jorgut/folio`

---

## 已完成

- 仓库重命名 `folio-ppt` → `folio`
- README 全面重写，中英双语单页锚点导航
- Badges: GitHub stars / License / Skill / HTML/PPTX/PDF/Figma/IDML / Claude Code / OpenClaw / Open Code / Codex
- tagline 修正: "Auto-generated layout, manually editable after export"
- 补全所有导出脚本表、工具脚本表
- 恢复 Figma 双模式 (C2D + 本地插件) 完整说明
- 恢复 IDML/InDesign PDF 输出格式
- 增加线框图速写独立段落 + 截图
- Wireframe 模板: 13→17 张卡片 (新增 Chapter/Inset/Table/Pullquote)
- 主题色选项更新 (4旧→8新)
- 清理冗余文件，移除 @figit/dom-to-figma

## 待办

1. **用户引导优化** — 用户说"我看了我都觉得很复杂，我不知道应该如何着手"
   - 需要让"开始一个项目"的流程更直观
   - 目前 README 从用户视角写了"告诉 AI 你要什么"，但实际操作流程可能还需要简化

2. **架构评估** — ChatGPT 建议重构为 Design Intelligence Engine:
   - 分层结构: Design Principles / Layout System / Design System / UI Components / Animation / Visual Effects / 3D / Audio / Assets / AI Prompt Library
   - Decision Engine 决策层 (平台→受众→风格→交互)
   - Interaction Pattern Library
   - Visual Style Library (每种风格关联字体/配色/动效/音效等)
   - 需要评估是 monolithic pipeline 还是三个独立层

3. **C2D API Key** — 在 `scripts/.env` 中配置

## 项目结构

```
folio/
├── index.html          主模板 (16 布局)
├── SKILL.md            AI 指引
├── README.md           本文件 (中英双语)
├── HANDOFF.md          上下文
├── start.command       启动器
├── design/             设计系统
├── engines/            决策引擎规则 (7 文件)
├── scripts/            导出脚本 + Figma 插件
├── assets/screenshots/ 预览截图
├── templates/          线框图模板
└── references/         设计参考资料
```
