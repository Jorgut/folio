#!/bin/bash
# Folio - Design Intelligence Engine
# Double-click to start opencode with project context

cd "$(dirname "$0")"

HANDOFF=$(cat HANDOFF.md)

clear
echo ''
echo '╔══════════════════════════════════════════════╗'
echo '║  Folio - Design Intelligence Engine          ║'
echo '║                                              ║'
echo '║  Recent: README rewrite / Wireframe update   ║'
echo '║          Figma dual-mode / IDML docs         ║'
echo '║                                              ║'
echo '║  Starting opencode with context...           ║'
echo '╚══════════════════════════════════════════════╝'

exec opencode /Users/aj/.claude/skills/folio
