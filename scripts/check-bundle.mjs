import { readFileSync, readdirSync } from "node:fs";
import { gzipSync } from "node:zlib";
import { runInNewContext } from "node:vm";

const chunksDirectory = new URL("../.next/static/chunks/", import.meta.url);
const manifestPath = new URL(
  "../.next/server/app/page_client-reference-manifest.js",
  import.meta.url,
);
const context = { globalThis: {} };
runInNewContext(readFileSync(manifestPath, "utf8"), context);

const manifest = context.globalThis.__RSC_MANIFEST?.["/page"];
if (!manifest) throw new Error("Page client reference manifest was not found");

const entryFiles = new Set(manifest.entryJSFiles["[project]/src/app/page"]);
const cssFiles = new Set(
  manifest.entryCSSFiles["[project]/src/app/page"].map(({ path }) => path),
);

function compressedSize(fileName) {
  const normalizedName = fileName.replace(/^static\/chunks\//, "");
  return gzipSync(readFileSync(new URL(normalizedName, chunksDirectory)), {
    level: 9,
  }).length;
}

const javascriptBytes = [...entryFiles].reduce(
  (total, fileName) => total + compressedSize(fileName),
  0,
);
const cssBytes = [...cssFiles].reduce(
  (total, fileName) => total + compressedSize(fileName),
  0,
);

const mapChunk = readdirSync(chunksDirectory).find((fileName) => {
  if (!fileName.endsWith(".js")) return false;
  const source = readFileSync(new URL(fileName, chunksDirectory), "utf8");
  return (
    source.includes('id:"yandex"') &&
    source.includes("https://yandex.ru/map-widget/v1/")
  );
});

if (javascriptBytes > 120 * 1024) {
  throw new Error(`Initial JavaScript exceeds 120 KB gzip: ${javascriptBytes}`);
}
if (cssBytes > 35 * 1024) {
  throw new Error(`CSS exceeds 35 KB gzip: ${cssBytes}`);
}
if (!mapChunk) throw new Error("A separate map provider chunk was not found");
if (entryFiles.has(`static/chunks/${mapChunk}`)) {
  throw new Error("Map provider is included in the initial JavaScript entry");
}

console.log(
  JSON.stringify(
    {
      initialJavaScriptGzipBytes: javascriptBytes,
      cssGzipBytes: cssBytes,
      mapChunk,
    },
    null,
    2,
  ),
);
