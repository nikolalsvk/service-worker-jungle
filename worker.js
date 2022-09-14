const version = 'v1'

const addResourcesToCache = async (resources) => {
  const cache = await caches.open(version);
  await cache.addAll(resources);
};

self.addEventListener('install', event => {
  console.log(`${version} installing…`);

  event.waitUntil(
    addResourcesToCache([
      "/",
      "/index.html",
      "/styles.css",
      "/script.js",
      "/jungle.png"
    ])
  );
});

self.addEventListener('activate', event => {
  console.log('Activate event')
});

const putInCache = async (request, response) => {
  const cache = await caches.open(version);

  if (request.method === 'POST') {
    console.log('Cannot cache POST requests')
    return
  }

  await cache.put(request, response);
};

const cacheFirst = async (request) => {
  const responseFromCache = await caches.match(request);
  if (responseFromCache) {
    return responseFromCache;
  }
  const responseFromNetwork = await fetch(request);
  // We need to clone the response because the response stream can only be read once
  putInCache(request, responseFromNetwork.clone())
  return responseFromNetwork
};

self.addEventListener("fetch", (event) => {
  event.respondWith(cacheFirst(event.request));
});
