import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import test from "node:test";
import { fileURLToPath } from "node:url";

const projectRoot = fileURLToPath(new URL("../..", import.meta.url));
const brandImagesPath = `${projectRoot}/public/images/brand`;
const ogImagePath = `${brandImagesPath}/og-shawarma-no1.png`;
const iconSourcePath = `${projectRoot}/public/icons/brand-icon-photo.png`;
const layoutPath = `${projectRoot}/src/app/layout.tsx`;
const manifestPath = `${projectRoot}/public/manifest.webmanifest`;
const topBarPath = `${projectRoot}/src/components/layout/TopBar.tsx`;
const progressPath = `${projectRoot}/src/components/progress/ShawarmaProgress.tsx`;
const emptyStatePath = `${projectRoot}/src/components/ui/EmptyState.tsx`;
const componentStylesPath = `${projectRoot}/src/components/site.module.css`;

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

test("uses the supplied high-resolution shawarma image directly in every brand icon", () => {
  assert.equal(existsSync(iconSourcePath), true, "brand icon photo is missing");

  const iconSource = readFileSync(iconSourcePath);
  assert.deepEqual(
    [...iconSource.subarray(0, 8)],
    [137, 80, 78, 71, 13, 10, 26, 10],
  );
  assert.equal(iconSource.readUInt32BE(16), 1024);
  assert.equal(iconSource.readUInt32BE(20), 1536);

  for (const filePath of [
    layoutPath,
    manifestPath,
    topBarPath,
    progressPath,
    emptyStatePath,
  ]) {
    const source = readFileSync(filePath, "utf8");
    assert.match(source, /brand-icon-photo\.png/);
    assert.doesNotMatch(source, /icons\/icon\.svg/);
  }
});

test("keeps the mobile hero title compact without changing the desktop title", () => {
  const styles = readFileSync(componentStylesPath, "utf8");

  assert.match(
    styles,
    /\.hero h1\s*{[^}]*font-size:\s*30px;[^}]*line-height:\s*34px;/s,
  );
  assert.match(
    styles,
    /@media \(max-width: 374px\)[\s\S]*?\.hero h1\s*{[^}]*font-size:\s*28px;[^}]*line-height:\s*32px;/,
  );
  assert.match(
    styles,
    /@media \(min-width: 761px\)[\s\S]*?\.hero h1\s*{[^}]*font-size:\s*36px;[^}]*line-height:\s*40px;/,
  );
});
