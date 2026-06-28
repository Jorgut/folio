#!/usr/bin/env bash
set -euo pipefail

if ! command -v gh >/dev/null 2>&1; then
  printf 'gh CLI is required but not installed.\n' >&2
  exit 1
fi

if ! command -v git >/dev/null 2>&1; then
  printf 'git is required but not installed.\n' >&2
  exit 1
fi

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT_DIR"

REMOTE_URL="$(GIT_MASTER=1 git remote get-url origin)"
TOKEN="$(gh auth token)"

if [[ -z "$TOKEN" ]]; then
  printf 'No GitHub token available from gh auth token.\n' >&2
  exit 1
fi

BRANCH="${1:-$(GIT_MASTER=1 git rev-parse --abbrev-ref HEAD)}"
shift $(( $# > 0 ? 1 : 0 ))

case "$REMOTE_URL" in
  https://github.com/*)
    AUTHED_URL="https://x-access-token:${TOKEN}@${REMOTE_URL#https://}"
    ;;
  *)
    printf 'Unsupported origin URL for this helper: %s\n' "$REMOTE_URL" >&2
    exit 1
    ;;
esac

printf 'Pushing %s to origin using gh auth token...\n' "$BRANCH"
GIT_MASTER=1 git push "$AUTHED_URL" "$BRANCH" "$@"
