#!/usr/bin/env bash
set -Eeuo pipefail

SOURCE_ROOT="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")/.." && pwd -P)"
TMP_ROOT="$(mktemp -d)"
trap 'rm -rf "$TMP_ROOT"' EXIT

export HOME="$TMP_ROOT/home"
mkdir -p "$HOME" "$TMP_ROOT/bin"

# Команда `git` использует Docker только для preflight. Подмена гарантирует,
# что тест резервирования никогда не затронет Docker-хост.
cat >"$TMP_ROOT/bin/docker" <<'EOF'
#!/bin/sh
exit 0
EOF
chmod +x "$TMP_ROOT/bin/docker"
export PATH="$TMP_ROOT/bin:$PATH"

git config --global user.name "start.sh test"
git config --global user.email "start-sh-test@localhost"

git init --bare -q "$TMP_ROOT/origin.git"
git init -q "$TMP_ROOT/seed"
cd "$TMP_ROOT/seed"
cp "$SOURCE_ROOT/start.sh" .
cat >.gitignore <<'EOF'
/Mysor/
/.start-logs/
/.start-cocon-enabled
EOF
printf 'original\n' >tracked.txt
git add .
git commit -q -m "initial"
git branch -M main
git remote add origin "$TMP_ROOT/origin.git"
git push -q -u origin main
git --git-dir="$TMP_ROOT/origin.git" symbolic-ref HEAD refs/heads/main

git clone -q "$TMP_ROOT/origin.git" "$TMP_ROOT/work"
cd "$TMP_ROOT/work"
printf 'changed\n' >tracked.txt
printf 'new\n' >untracked.txt

bash ./start.sh git

[[ "$(cat tracked.txt)" == "original" ]]
[[ ! -e untracked.txt ]]
backup="$(find Mysor -mindepth 1 -maxdepth 1 -type d -print -quit)"
[[ -n "$backup" ]]
[[ "$(cat "$backup/files/tracked.txt")" == "changed" ]]
[[ "$(cat "$backup/files/untracked.txt")" == "new" ]]
[[ -s "$backup/unstaged.patch" ]]
[[ -z "$(git status --porcelain)" ]]

printf 'start.sh git backup test: OK\n'
