# Infra

## bunny-edge-script.js

Bunny CDN Edge Script (ID **79923**) that powers the Russia-accessible mirror
`imba.run`. It reverse-proxies every request to `www.imba.live` (Vercel) and
rewrites redirect `Location` headers back to the `imba.run` host.

**Critical:** it forces `cache-control: no-store` on every non-static response.
Bunny's cache key is URL-only and ignores the `Vary` / `RSC` / `Next-Action`
headers that distinguish a Next.js HTML document from its RSC payload or a
server-action response. Caching those would poison the cache — an RSC stream
gets served where HTML is expected → the React Server Components render throws a
500. Only content-hashed assets under `/_next/static/` (and other static file
extensions) stay cacheable.

### Deploy

This file is the source of truth; the live copy lives in Bunny. To deploy:

```sh
# 1. Upload code
curl -X POST "https://api.bunny.net/compute/script/79923/code" \
  -H "AccessKey: $BUNNY_API_KEY" -H "Content-Type: application/json" \
  --data-binary "$(jq -Rs '{Code: .}' infra/bunny-edge-script.js)"

# 2. Publish a new release
curl -X POST "https://api.bunny.net/compute/script/79923/publish" \
  -H "AccessKey: $BUNNY_API_KEY" -H "Content-Type: application/json" -d '{}'

# 3. Purge the imba.run pull zone (clears any poisoned entries)
curl -X POST "https://api.bunny.net/pullzone/6055986/purgeCache" \
  -H "AccessKey: $BUNNY_API_KEY"
```
