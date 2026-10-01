import { access, mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { catalog } from "../lib/catalog.ts";

const outputRoot = ".cache/editorial-images";
const manifestPath = "docs/editorial-image-manifest.json";
const userAgent = "Pawtome/1.0 (https://pawtome.vercel.app; editorial image attribution audit)";
const allowedLicenses = /^(?:CC0(?: 1\.0)?|Public domain|CC BY(?:-SA)? (?:1\.0|2\.0|2\.5|3\.0|4\.0))$/i;
const extensions: Record<string, string> = { "image/jpeg": ".jpg", "image/png": ".png", "image/webp": ".webp" };
const overrides: Record<string, string> = {
  boxer: "Boxer (dog).jpg",
  chihuahua: "Chihuahua1 bvdb.jpg",
  pomeranian: "Pomeranian profile.jpg",
  siamese: "Siamese cat, modern-style.jpg",
  abyssinian: "Abyssinian cat - Patricia (cropped).jpg",
  bengal: "Bengal cat 1y.jpg",
  burmese: "Burmese (Cat).jpg",
  persian: "Chocolate Persian.jpg",
  birman: "Sacred Birman.jpg",
  "siberian-cat": "Siberian cat in summercoat.JPG",
  budgerigar: "Melopsittacus undulatus Alice Springs Desert Park (crop 2).jpg",
  "rose-ringed-parakeet": "Rose-ringed parakeet (Psittacula krameri) female.jpg",
  "domestic-pigeon": "Domestic pigeon.jpg",
  "netherland-dwarf-rabbit": "Young Netherland Dwarf rabbit.jpg",
  "holland-lop-rabbit": "Holland lop bunny.JPG",
  "zebra-danio": "Danio rerio.JPG",
};

type JsonObject = Record<string, unknown>;
type ManifestEntry = {
  slug: string;
  animalName: string;
  scientificName: string;
  group: string;
  storagePath: string;
  localPath: string;
  sourcePage: string;
  originalUrl: string;
  downloadUrl: string;
  creator: string;
  credit: string;
  license: string;
  licenseUrl: string | null;
  attribution: string;
  width: number;
  height: number;
  mimeType: string;
  fileSize: number;
  modifications: string;
};

const sleep = (milliseconds: number) => new Promise(resolve => setTimeout(resolve, milliseconds));
const text = (value: unknown) => typeof value === "string" ? value.replace(/<[^>]*>/g, " ").replace(/&nbsp;/g, " ").replace(/&amp;/g, "&").replace(/&#39;/g, "'").replace(/&quot;/g, '"').replace(/\s+/g, " ").trim() : "";

async function request(url: URL | string, accept = "*/*"): Promise<Response> {
  for (let attempt = 0; attempt < 4; attempt++) {
    const response = await fetch(url, { headers: { "User-Agent": userAgent, Accept: accept } });
    if (response.status !== 429) return response;
    const retryAfter = Number(response.headers.get("retry-after"));
    await sleep(Number.isFinite(retryAfter) && retryAfter > 0 ? retryAfter * 1000 : 3000 * (attempt + 1));
  }
  throw new Error("Wikimedia rate limit persisted after retries");
}

async function fetchJson(url: URL): Promise<JsonObject> {
  const response = await request(url, "application/json");
  if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);
  return await response.json() as JsonObject;
}

function firstPage(data: JsonObject): JsonObject | null {
  const query = data.query as JsonObject | undefined;
  const pages = query?.pages as Record<string, JsonObject> | undefined;
  return pages ? Object.values(pages)[0] ?? null : null;
}

async function findCommonsFile(titles: string[]): Promise<string | null> {
  for (const title of titles) {
    const url = new URL("https://en.wikipedia.org/w/api.php");
    url.search = new URLSearchParams({ action: "query", format: "json", formatversion: "2", redirects: "1", prop: "pageprops", ppprop: "page_image_free", titles: title }).toString();
    const page = firstPage(await fetchJson(url));
    const file = text((page?.pageprops as JsonObject | undefined)?.page_image_free);
    if (file) return file;
    await sleep(120);
  }

  const url = new URL("https://en.wikipedia.org/w/api.php");
  url.search = new URLSearchParams({ action: "query", format: "json", formatversion: "2", generator: "search", gsrsearch: titles.join(" "), gsrnamespace: "0", gsrlimit: "3", prop: "pageprops", ppprop: "page_image_free" }).toString();
  const query = (await fetchJson(url)).query as JsonObject | undefined;
  const pages = query?.pages as JsonObject[] | undefined;
  return pages?.map(page => text((page.pageprops as JsonObject | undefined)?.page_image_free)).find(Boolean) ?? null;
}

async function imageMetadata(fileName: string): Promise<{ info: JsonObject; metadata: JsonObject } | null> {
  const url = new URL("https://commons.wikimedia.org/w/api.php");
  url.search = new URLSearchParams({ action: "query", format: "json", formatversion: "2", prop: "imageinfo", iiprop: "url|mime|size|extmetadata", iiurlwidth: "1200", titles: `File:${fileName}` }).toString();
  const page = firstPage(await fetchJson(url));
  const info = (page?.imageinfo as JsonObject[] | undefined)?.[0];
  if (!info) return null;
  return { info, metadata: (info.extmetadata as JsonObject | undefined) ?? {} };
}

function meta(metadata: JsonObject, key: string): string {
  return text((metadata[key] as JsonObject | undefined)?.value);
}

async function gather(entry: (typeof catalog)[number]): Promise<ManifestEntry> {
  const animalName = entry.commonName["en-US"];
  const fileName = overrides[entry.slug] ?? await findCommonsFile([animalName, entry.scientificName]);
  if (!fileName) throw new Error("No Wikimedia Commons page image found");
  const result = await imageMetadata(fileName);
  if (!result) throw new Error(`No Commons metadata for ${fileName}`);

  const { info, metadata } = result;
  const license = meta(metadata, "LicenseShortName");
  if (!allowedLicenses.test(license)) throw new Error(`Rejected licence: ${license || "missing"}`);
  const mimeType = text(info.thumbmime) || text(info.mime);
  const extension = extensions[mimeType];
  if (!extension) throw new Error(`Rejected MIME type: ${mimeType || "missing"}`);
  const downloadUrl = text(info.thumburl) || text(info.url);
  const originalUrl = text(info.url);
  const sourcePage = text(info.descriptionurl);
  if (!downloadUrl || !originalUrl || !sourcePage) throw new Error("Incomplete Commons URLs");

  const response = await request(downloadUrl);
  if (!response.ok) throw new Error(`Image download failed: ${response.status}`);
  const bytes = new Uint8Array(await response.arrayBuffer());
  if (!bytes.length || bytes.length > 5 * 1024 * 1024) throw new Error(`Rejected file size: ${bytes.length}`);

  const storagePath = `animals/${entry.group}/${entry.slug}${extension}`;
  const localPath = join(outputRoot, storagePath);
  await mkdir(dirname(localPath), { recursive: true });
  await writeFile(localPath, bytes);

  const creator = meta(metadata, "Artist") || "Creator listed on Wikimedia Commons";
  const credit = meta(metadata, "Credit") || creator;
  const licenseUrl = meta(metadata, "LicenseUrl") || null;
  return {
    slug: entry.slug,
    animalName,
    scientificName: entry.scientificName,
    group: entry.group,
    storagePath,
    localPath: localPath.replaceAll("\\", "/"),
    sourcePage,
    originalUrl,
    downloadUrl,
    creator,
    credit,
    license,
    licenseUrl,
    attribution: `${creator}, ${license}, via Wikimedia Commons`,
    width: Number(info.thumbwidth ?? info.width),
    height: Number(info.thumbheight ?? info.height),
    mimeType,
    fileSize: bytes.length,
    modifications: text(info.thumburl) ? "Resized by Wikimedia Commons thumbnail service; no other changes." : "No changes.",
  };
}

await mkdir(dirname(manifestPath), { recursive: true });
const previous = await readFile(manifestPath, "utf8").then(value => JSON.parse(value) as { entries?: ManifestEntry[] }).catch(() => ({ entries: [] }));
const cached = new Map(previous.entries?.map(entry => [entry.slug, entry]));
const entries: ManifestEntry[] = [];
const failures: Array<{ slug: string; reason: string }> = [];
for (const entry of catalog) {
  try {
    const cachedEntry = cached.get(entry.slug);
    if (cachedEntry && !overrides[entry.slug] && allowedLicenses.test(cachedEntry.license)) {
      await access(cachedEntry.localPath);
      entries.push(cachedEntry);
      process.stdout.write(`= ${entry.slug}\n`);
      continue;
    }
    entries.push(await gather(entry));
    process.stdout.write(`✓ ${entry.slug}\n`);
  } catch (error) {
    failures.push({ slug: entry.slug, reason: error instanceof Error ? error.message : String(error) });
    process.stdout.write(`✗ ${entry.slug}\n`);
  }
  await sleep(800);
}

await writeFile(manifestPath, `${JSON.stringify({ generatedAt: new Date().toISOString(), source: "Wikimedia Commons", acceptedLicenses: allowedLicenses.source, entries, failures }, null, 2)}\n`);
console.log(`Gathered ${entries.length}/${catalog.length}; ${failures.length} require manual review.`);
if (failures.length) process.exitCode = 2;
