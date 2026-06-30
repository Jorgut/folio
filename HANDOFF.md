# Folio · Session Handoff

最后提交: `e12b7e4` · 仓库: `github.com/Jorgut/folio`

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
- 新手引导优化：README / SKILL 改成更明确的“8 页 + HTML first”起手式
- 跨平台兼容补强：
  - `SKILL.md` 增加 frontmatter (`name`, `description`, `version`, `tags`, `compatible_with`)
  - 新增 `SKILL.min.md` 供 prompt-only / low-context 宿主使用
  - 新增 `INSTALL.md` 说明 Claude Code / OpenCode / Codex / 通用 LLM 的安装与降级使用
- 更新核心 v1 已落地：
  - `manifest.json`
  - `VERSION`
  - `CHANGELOG.md`
  - `scripts/check-update.mjs`
  - `scripts/self-update.mjs`
- 更新策略已明确写入文档：
  - 有 startup hook 的宿主可自动检查
  - 无 startup hook 的宿主在 first-use 检查
  - 无脚本/无网络权限的宿主降级为手动更新
- GitHub 推送稳定性修复：新增 `scripts/git-push-gh-auth.sh`
  - 适用于 HTTPS remote 无法交互弹凭证、但 `gh auth status` 已登录的环境
  - 已验证 `--dry-run` 与真实 push 都可用
- 本轮相关提交：
  - `210fdd2` Add cross-platform update core
  - `e12b7e4` Add gh-auth push helper

## 待办

1. **架构评估** — ChatGPT 建议重构为 Design Intelligence Engine:
   - 分层结构: Design Principles / Layout System / Design System / UI Components / Animation / Visual Effects / 3D / Audio / Assets / AI Prompt Library
   - Decision Engine 决策层 (平台→受众→风格→交互)
   - Interaction Pattern Library
   - Visual Style Library (每种风格关联字体/配色/动效/音效等)
   - 需要评估是 monolithic pipeline 还是三个独立层

2. **C2D API Key** — 在 `scripts/.env` 中配置

3. **平台级 adapter（下一阶段）**
   - 目前只有“跨平台更新核心”，还没有平台专属自动触发层
   - 可继续补：Claude Code / OpenCode / Codex / Hermes 的 hook / first-use / manual 行为说明或适配脚本

4. **可选：机器可读 skill manifest 扩展**
   - 如果后续要继续增强跨平台发现能力，可补一个更中性的 `skill.json` / `manifest` 兼容层

## 项目结构

```
folio/
├── index.html          主模板 (16 布局)
├── SKILL.md            AI 指引
├── README.md           本文件 (中英双语)
├── INSTALL.md          跨平台安装/排障说明
├── SKILL.min.md        极简 skill 版本（prompt-only 兜底）
├── manifest.json       更新元数据
├── VERSION             本地版本号
├── CHANGELOG.md        更新记录
├── HANDOFF.md          上下文
├── start.command       启动器
├── design/             设计系统
├── engines/            决策引擎规则 (7 文件)
├── scripts/            导出脚本 + 更新脚本 + Figma 插件
├── assets/screenshots/ 预览截图
├── templates/          线框图模板
└── references/         设计参考资料
```

## 当前状态备注

- GitHub 上已经有 `manifest.json`，`check-update.mjs` 不再依赖“未来再上传”这个前提
- `scripts/self-update.mjs` 目前要求：
  - 本地是 git clone
  - working tree 干净
  - 允许 `git pull --ff-only`
- 普通 `git push` 在某些非交互环境下仍可能因为 HTTPS 凭证弹窗被禁用而失败；此时直接用：

```bash
bash scripts/git-push-gh-auth.sh
```
