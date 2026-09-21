const fs = require('fs');
const path = require('path');

const publicDir = path.join(process.cwd(), 'public');

fs.writeFileSync(path.join(publicDir, 'manifest.json'), `{
  "name": "AgriCore X",
  "short_name": "AgriCore",
  "description": "Industrial Agricultural Control System",
  "start_url": "/dashboard",
  "display": "standalone",
  "background_color": "#0d1117",
  "theme_color": "#0d1117",
  "icons": [
    {
      "src": "/favicon.ico",
      "sizes": "64x64",
      "type": "image/x-icon"
    }
  ]
}`);

fs.writeFileSync(path.join(publicDir, 'sw.js'), `const CACHE_NAME = 'agricore-v1';

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(['/dashboard', '/favicon.ico']);
    })
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  
  event.respondWith(
    fetch(event.request).catch(() => {
      return caches.match(event.request);
    })
  );
});
`);

console.log('Created PWA files');
