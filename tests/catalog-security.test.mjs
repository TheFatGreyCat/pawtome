import assert from "node:assert/strict";
import test from "node:test";
import { catalog, catalogCounts, citations } from "../lib/catalog.ts";
import { PET_PHOTO_MAX_BYTES, safePetPhotoPath, validatePetPhoto } from "../lib/persistence.ts";

test("catalog meets the reviewed minimum without unsupported precision", () => {
  assert.deepEqual(catalogCounts, { dog:20, cat:15, bird:12, "small-mammal":8, reptile:8, "freshwater-fish":8 });
  const sources = new Set(citations.map(({id}) => id));
  for (const entry of catalog) {
    assert.equal(entry.size, null);
    assert.equal(entry.lifespan, null);
    assert.ok(entry.citationIds.length && entry.citationIds.every(id => sources.has(id)));
  }
});

test("private photo validation rejects unsafe types, sizes, owners, and extensions", () => {
  assert.equal(validatePetPhoto({ type:"image/webp", size:1024 }), null);
  assert.match(validatePetPhoto({ type:"image/svg+xml", size:1024 }), /JPEG/);
  assert.match(validatePetPhoto({ type:"image/png", size:PET_PHOTO_MAX_BYTES+1 }), /5 MB/);
  const owner="4f645997-2c52-4ca9-9f9d-f42a682a94ea";
  const id="a6ca9245-b1da-4b83-acab-4330384064b0";
  assert.equal(safePetPhotoPath(owner,"../../Momo.JPEG",id),`${owner}/${id}.jpg`);
  assert.throws(()=>safePetPhotoPath("../other-user","momo.jpg",id),/Invalid user/);
  assert.throws(()=>safePetPhotoPath(owner,"momo.svg",id),/Unsupported/);
});
