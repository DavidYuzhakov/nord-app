#!/usr/bin/env bash
set -euo pipefail

# Эти значения передаёт GitHub Actions.
app_dir=$1
export COMPOSE_PROJECT_NAME=$2
release_tag=$3
release_sha=$4
cd -- "$app_dir"

compose() {
  docker compose -f docker-compose.yml "$@" < /dev/null
}

# Не переносим незакоммиченные изменения сервера в релиз.
if ! git diff --quiet || ! git diff --cached --quiet; then
  echo 'На VPS есть изменения в отслеживаемых файлах. Сначала разберись с ними.' >&2
  exit 1
fi

# Загружаем тег и сверяем его с коммитом, который прошёл CI.
export GIT_TERMINAL_PROMPT=0
export GIT_SSH_COMMAND='ssh -o BatchMode=yes -o StrictHostKeyChecking=yes'
git fetch --no-tags origin "refs/tags/$release_tag" < /dev/null
if [[ "$(git rev-parse 'FETCH_HEAD^{commit}')" != "$release_sha" ]]; then
  echo 'Тег больше не соответствует коммиту, проверенному в GitHub Actions.' >&2
  exit 1
fi
git checkout --no-overwrite-ignore --detach "$release_sha"

# Сначала собираем оба образа. При ошибке старая версия продолжит работать.
compose build backend frontend
compose up -d --no-deps --no-build backend frontend

# Проверяем Nginx и пересоздаём его, чтобы он получил новые адреса контейнеров.
compose run --rm --no-deps -T nginx nginx -t
compose up -d --no-deps --no-build --force-recreate nginx

# Ждём HTTP 200 от сайта и API: до 24 попыток на каждый адрес.
for url in https://nord-app.ru/ https://api.nord-app.ru/song; do
  for attempt in {1..24}; do
    status=$(curl --silent --output /dev/null --write-out '%{http_code}' \
      --connect-timeout 3 --max-time 5 "$url") || status=000
    if [[ "$status" == 200 ]]; then
      break
    fi
    echo "Ожидаем $url — попытка $attempt/24, HTTP $status"
    sleep 5
  done

  if [[ "$status" != 200 ]]; then
    echo "Деплой не прошёл проверку: $url отвечает HTTP $status." >&2
    exit 1
  fi
done

echo "Деплой завершён: $release_tag ($release_sha)"
