import fs from "fs";

const swJsFileStr = (static_resources) => `
  const VERSION = "v1";
  const CACHE_NAME = \`brainer-version-\$\{VERSION\}\`;

  const APP_STATIC_RESOURCES = ${JSON.stringify(static_resources)};

  self.addEventListener("install", (event) => {
    event.waitUntil(
      (async () => {
        const cache = await caches.open(CACHE_NAME);
        cache.addAll(APP_STATIC_RESOURCES);
      })(),
    );
  });

  self.addEventListener("activate", (event) => {
    event.waitUntil(
      (async () => {
        const names = await caches.keys();
        await Promise.all(
          names.map((name) => {
            if (name !== CACHE_NAME) {
              return caches.delete(name);
            }
          }),
        );
        await clients.claim();
      })(),
    );
  });

  self.addEventListener("fetch", (event) => {
    if (event.request.mode === "navigate") {
      event.respondWith(caches.match("/"));
      return;
    }
    event.respondWith(
      (async () => {
        const cache = await caches.open(CACHE_NAME);
        const cachedResponse = await cache.match(event.request.url);
        if (cachedResponse) {
          return cachedResponse;
        }
        return new Response(null, { status: 404 });
      })(),
    );
  });
`
function readdir(dir) {
  return new Promise((res, rej) => {
    fs.readdir(dir, (err, files) => {
      if (err) {
        console.log(err);
        rej();
      }
      res(files);
    })
  })
}

async function generate_pwa_files() {
  console.log("generating pwa files...");
  try {
    let static_resources = [];
    let files = await readdir("./dist/assets");
    static_resources = [...static_resources, ...files.map(f => `/assets/${f}`)]
    files = await readdir("./dist");
    static_resources = [...static_resources, ...files.map(f => `/${f}`).filter(f => f.includes("."))]
    static_resources.push("/");
    fs.writeFileSync("./dist/sw.js", swJsFileStr(static_resources))
    console.log("pwa files generated...");
  } catch(err) {
    console.log("error: ", err);
  }
}

generate_pwa_files();
