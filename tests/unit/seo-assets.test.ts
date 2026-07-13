import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import test from "node:test";
import { fileURLToPath } from "node:url";

const projectRoot = fileURLToPath(new URL("../..", import.meta.url));
const brandImagesPath = `${projectRoot}/public/images/brand`;
const ogImagePath = `${brandImagesPath}/og-shawarma-no1.png`;
const layoutPath = `${projectRoot}/src/app/layout.tsx`;

test("publishes the production social preview without placeholder assets", () => {
  assert.equal(existsSync(ogImagePath), true, "production OG image is missing");

  const image = readFileSync(ogImagePath);
  assert.deepEqual(
    [...image.subarray(0, 8)],
    [137, 80, 78, 71, 13, 10, 26, 10],
    "OG image must be a PNG",
  );
  assert.equal(image.readUInt32BE(16), 1200);
  assert.equal(image.readUInt32BE(20), 630);

  const layout = readFileSync(layoutPath, "utf8");
  assert.match(layout, /\/images\/brand\/og-shawarma-no1\.png/);
  assert.doesNotMatch(layout, /og-placeholder/);
  assert.equal(existsSync(`${brandImagesPath}/og-placeholder.png`), false);
  assert.equal(existsSync(`${brandImagesPath}/og-placeholder.svg`), false);
});
