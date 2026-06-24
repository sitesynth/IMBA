import * as BunnySDK from "https://esm.sh/@bunny.net/edgescript-sdk@0.11.2";

// Only content-hashed static assets are safe for Bunny to cache. Everything
// else is dynamic from a cache-correctness standpoint.
const STATIC_EXT = /\.(?:js|mjs|css|woff2?|ttf|otf|eot|png|jpe?g|gif|webp|avif|svg|ico|mp4|webm|mp3|map)$/i;

function isStaticAsset(pathname) {
  return (
    pathname.startsWith("/_next/static/") ||
    pathname.startsWith("/_next/image") ||
    STATIC_EXT.test(pathname)
  );
}

BunnySDK.net.http.serve(async (request) => {
  const url = new URL(request.url);
  const target = "https://www.imba.live" + url.pathname + url.search;

  const headers = new Headers(request.headers);
  headers.set("Host", "www.imba.live");
  headers.set("x-real-host", url.host);

  const resp = await fetch(target, {
    method: request.method,
    headers,
    body: ["GET", "HEAD"].includes(request.method) ? null : request.body,
    redirect: "manual",
  });

  const rh = new Headers(resp.headers);

  const loc = rh.get("location");
  if (loc) {
    rh.set("location", loc
      .replace("https://www.imba.live", "https://" + url.host)
      .replace("http://www.imba.live", "https://" + url.host)
      .replace("https://imba.live", "https://" + url.host)
      .replace("http://imba.live", "https://" + url.host)
    );
  }

  // Bunny's cache key is URL-only and ignores the Vary / RSC / Next-Action
  // headers that distinguish a Next.js HTML document from its RSC payload or a
  // server-action response. Caching dynamic responses poisons the cache: an RSC
  // stream gets served where HTML is expected (or vice versa), which crashes the
  // React Server Components render with a 500. Force all non-static responses to
  // bypass the edge cache; content-hashed static assets stay cacheable.
  if (!isStaticAsset(url.pathname)) {
    rh.set("cache-control", "private, no-store, no-cache, must-revalidate");
    rh.delete("etag");
  }

  return new Response(resp.body, { status: resp.status, headers: rh });
});
