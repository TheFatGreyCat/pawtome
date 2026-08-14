import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("keeps Pawtome deployable as a native Next.js app", async () => {
  const [app, pkg] = await Promise.all([
    readFile(new URL("../app/PawtomeApp.tsx", import.meta.url), "utf8"),
    readFile(new URL("../package.json", import.meta.url), "utf8"),
  ]);

  for (const route of ["/breeds/shiba-inu", "/food/strawberry", "/training/sit", "/behavior/paw-licking", "/my-pets/momo"]) {
    assert.match(app, new RegExp(route.replaceAll("/", "\\/")));
  }
  assert.doesNotMatch(pkg, /cloudflare|vinext|vite|wrangler|drizzle/i);
  assert.match(pkg, /"build": "next build"/);
});

