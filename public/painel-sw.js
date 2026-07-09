const CACHE_NAME = "painel-tv-midias-v1"

self.addEventListener("install", () => {
  self.skipWaiting()
})

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      )
    )
  )

  self.clients.claim()
})

self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url)

  const ehMidia =
    url.href.includes("firebasestorage.googleapis.com") ||
    url.href.includes("firebasestorage.app") ||
    url.pathname.match(/\.(png|jpg|jpeg|webp|gif|mp4)$/i)

  if (!ehMidia || event.request.method !== "GET") return

  event.respondWith(
    caches.open(CACHE_NAME).then(async (cache) => {
      const respostaCache = await cache.match(event.request)

      if (respostaCache) {
        return respostaCache
      }

      const respostaRede = await fetch(event.request)

      if (respostaRede && respostaRede.ok) {
        cache.put(event.request, respostaRede.clone())
      }

      return respostaRede
    })
  )
})
