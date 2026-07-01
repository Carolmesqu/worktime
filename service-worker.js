const CACHE_NAME = "worktime-cache-v3";
const ASSETS = [
  "./index.html",
  "./css/variables.css",
  "./css/global.css",
  "./css/components.css",
  "./css/dashboard.css",
  "./css/login.css"
];

// Instalação do Service Worker e Cache dos arquivos estruturais de estilo
self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    })
  );
  self.skipWaiting();
});

// Ativação e limpeza de caches antigos se houver atualização de versão
self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Estratégia "network-first": sempre tenta buscar a versão mais nova online e usa
// o cache apenas como reserva quando o usuário estiver offline. Isso evita que o
// celular fique preso numa versão antiga do HTML/CSS (o que quebrava o layout).
self.addEventListener("fetch", (e) => {
  // Só cuidamos de requisições GET; ignora chamadas externas do Google Sheets/Firebase
  if (
    e.request.method !== "GET" ||
    e.request.url.includes("script.google.com") ||
    e.request.url.includes("firebase")
  ) {
    return;
  }

  e.respondWith(
    fetch(e.request)
      .then((networkResponse) => {
        // Guarda uma cópia atualizada no cache para uso offline futuro
        const responseClone = networkResponse.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(e.request, responseClone);
        });
        return networkResponse;
      })
      .catch(() => caches.match(e.request))
  );
});