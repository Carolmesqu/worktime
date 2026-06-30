const CACHE_NAME = "worktime-cache-v1";
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
});

// Intercepta as requisições para carregar do cache os estilos estáticos mais rápido
self.addEventListener("fetch", (e) => {
  // Ignora chamadas externas da API do Google Sheets e do Firebase Auth
  if (e.request.url.includes("script.google.com") || e.request.url.includes("firebase")) {
    return;
  }

  e.respondWith(
    caches.match(e.request).then((cachedResponse) => {
      return cachedResponse || fetch(e.request);
    })
  );
});