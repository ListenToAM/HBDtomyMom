// ถ้าแก้ไฟล์แล้วอยากบังคับให้เครื่องแม่โหลดใหม่ทั้งหมด ให้เปลี่ยนเลขเวอร์ชันตรงนี้
const CACHE = "mom-app-v4";

const FILES = [
  "./",
  "index.html",
  "messages.js",
  "manifest.json",
  "FCVision.otf",
  "icon-180.png",
  "icon-192.png",
  "icon-512.png",
  "photo1.jpg",
  "photo2.jpg"
];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE).then((c) => c.addAll(FILES)));
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

// ลองโหลดจากเน็ตก่อน (ได้ข้อความใหม่ล่าสุดเสมอ) ถ้าไม่มีเน็ตค่อยใช้ของที่เก็บไว้
self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;
  event.respondWith(
    fetch(event.request, { cache: "no-cache" })
      .then((res) => {
        const copy = res.clone();
        caches.open(CACHE).then((c) => c.put(event.request, copy));
        return res;
      })
      .catch(() => caches.match(event.request).then((hit) => hit || caches.match("index.html")))
  );
});