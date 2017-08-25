// proper initialization
if( 'function' === typeof importScripts) {
  importScripts('./serviceworker-cache-polyfill.js')
}
var CACHE_NAME = 'riot-pwa-v2'

// File want to cache
var urlsToCache = [
  '/',
  '/src/www/index.html',
  '/src/www/manifest.json',
  '/src/www/serviceworker-cache-polyfill.js',
  '/src/www/assets/img/blank-thumbnail.png',
  '/src/www/assets/img/favicon.png',
  '/src/www/assets/img/icon-48.png',
  '/src/www/assets/img/icon-96.png',
  '/src/www/assets/img/icon-128.png',
  '/src/www/assets/img/icon-144.png',
  '/src/www/assets/img/icon-152.png',
  '/src/www/assets/img/icon-196.png',
  '/src/www/assets/img/icon-384.png',
  '/src/www/vendor/bootstrap/css/bootstrap.min.css',
  '/src/www/vendor/ionicons/css/ionicons.min.css',
  '/src/www/vendor/ionicons/fonts/ionicons.ttf',
  '/src/www/vendor/ionicons/fonts/ionicons.woff',
  // '/main.js'
]
// Set this to true for production
var doCache = true;

// Delete old caches that are not our current one!
self.addEventListener("activate", event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys()
      .then(keyList =>
        Promise.all(keyList.map(key => {
          if (!cacheWhitelist.includes(key)) {
            console.log('Deleting cache: ' + key)
            return caches.delete(key);
          }
        }))
      )
  );
});

// The first time the user starts up the PWA, 'install' is triggered.
self.addEventListener('install', (event) => {
  if (doCache) {
    event.waitUntil(
      caches.open(CACHE_NAME)
        .then((cache) => {
            // Open a cache and cache our files
            // We want to cache the page and the main.js generated by webpack
            // We could also cache any static assets like CSS or images
            cache.addAll(urlsToCache)
            console.log('cached');
          })
      
    );
  }
});

// When the webpage goes to fetch files, we intercept that request and serve up the matching files
// if we have them
self.addEventListener('fetch', (event) => {
    if (doCache) {
      event.respondWith(
          caches.match(event.request).then((response) => {
              return response || fetch(event.request);
          })
      );
    }
  })