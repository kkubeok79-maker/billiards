// 오프라인 저장 (암호화된 파일 그대로 저장. 암호는 기기 안에서만 풂). 새 버전이 올라오면 이름이 바뀌어 다시 받음
const CACHE = 'billiards-sec-3c8faa52';
const FILES = ["./", "index.html", "app.enc", "keys.json", "three.min.js", "GLTFLoader.js", "Michelle.glb", "manifest.webmanifest", "icon-192.png", "icon-512.png", "icon-maskable-512.png"];
self.addEventListener('install', (e) => { e.waitUntil(caches.open(CACHE).then((c) => c.addAll(FILES)).then(() => self.skipWaiting())); });
self.addEventListener('activate', (e) => { e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k !== CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return;
  const u = new URL(e.request.url);
  // 앱 파일(같은 주소)은 '인터넷 먼저': 연결되면 늘 새 파일을 받아 저장해 두고, 인터넷이 없을 때만 저장본을 씀
  //  → GitHub에 새로 올리면 앱을 한 번 다시 열기만 해도 바로 새 버전 (예전에는 저장본을 먼저 써서 옛 버전이 계속 나왔음)
  if (u.origin === location.origin) {
    e.respondWith(fetch(e.request, { cache: 'no-cache' }).then((res) => {
      if (res && res.ok) { const copy = res.clone(); caches.open(CACHE).then((c) => c.put(e.request, copy)); }
      return res;
    }).catch(() => caches.match(e.request, { ignoreSearch: true }).then((hit) => hit || caches.match('./index.html'))));
    return;
  }
  e.respondWith(caches.match(e.request, { ignoreSearch: true }).then((hit) => hit || fetch(e.request).then((res) => {
    if (res && (res.ok || res.type === 'opaque') && /fonts\.(googleapis|gstatic)\.com/.test(e.request.url)) { const copy = res.clone(); caches.open(CACHE).then((c) => c.put(e.request, copy)); }
    return res;
  })));
});