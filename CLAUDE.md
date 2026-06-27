@AGENTS.md

## Деплой фронтенда

**НИКОГДА не запускай `vercel deploy` напрямую.**
Деплой только через `git push` — Vercel подключён к GitHub и деплоит автоматически.

## Инфраструктура imba.run

**Bunny CDN НЕ используется.** Не предлагай чистить Bunny-кэш, не читай `infra/bunny-edge-script.js` как актуальный источник истины.
`imba.run` и `imba.live` — оба на Vercel напрямую. ChunkLoadError на imba.run = browser cache, лечится hard-refresh.
