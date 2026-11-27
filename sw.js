// 오프라인 저장 (암호화된 파일 그대로 저장. 암호는 기기 안에서만 풂). 새 버전이 올라오면 이름이 바뀌어 다시 받음
const CACHE = 'billiards-sec-cba686b7';
const FILES = ["./", "index.html", "app.enc", "keys.json", "three.min.js", "GLTFLoader.js", "Michelle.glb", "manifest.webmanifest", "icon-192.png", "icon-512.png", "icon-maskable-512.png"];
self.addEventListener('install', (e) => { e.waitUntil(caches.open(CACHE).then((c) => c.addAll(FILES)).then(() => self.skipWaiting())); });
self.addEventListener('activate', (e) => { e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k !== CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return;
  e.respondWith(caches.match(e.request, { ignoreSearch: true }).then((hit) => hit || fetch(e.request).then((res) => {
    if (res && (res.ok || res.type === 'opaque') && /fonts\.(googleapis|gstatic)\.com/.test(e.request.url)) { const copy = res.clone(); caches.open(CACHE).then((c) => c.put(e.request, copy)); }
    return res;
  }).catch(() => caches.match('./index.html'))));
});
