#!/bin/bash
# Folio · 启动 Opencode 继续工作
# 双击此文件自动打开项目并恢复上下文

cd "$(dirname "$0")"

echo ""
echo "╔══════════════════════════════════════════════╗"
echo "║  Folio · Design Intelligence Engine          ║"
echo "║                                              ║"
echo "║  启动 Opencode 中...                         ║"
echo "║                                              ║"
echo "║  最近完成：                                   ║"
echo "║  · README 中英双语重写                        ║"
echo "║  · Wireframe 模板更新（13→17 布局）           ║"
echo "║  · Figma C2D + 本地双模式说明                  ║"
echo "║  · IDML/InDesign 导出文档                     ║"
echo "║                                              ║"
echo "║  待办：                                       ║"
echo "║  · 优化"开始项目"的用户引导流程               ║"
echo "║  · 评估 Design Intelligence Engine 架构重构    ║"
echo "║                                              ║"
echo "║  上下文文件：HANDOFF.md                       ║"
echo "╚══════════════════════════════════════════════╝"
echo ""

open HANDOFF.md

# 启动 opencode
opencode
