import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { catalog, catalogCounts, citations } from "../lib/catalog.ts";

assert.deepEqual(catalogCounts, { dog:20, cat:15, bird:12, "small-mammal":8, reptile:8, "freshwater-fish":8 });
assert.equal(new Set(catalog.map((entry)=>entry.slug)).size, catalog.length, "Animal slugs must be unique.");
assert.equal(new Set(citations.map((citation)=>citation.id)).size, citations.length, "Citation IDs must be unique.");
const citationIds = new Set(citations.map((citation)=>citation.id));
for (const entry of catalog) {
  assert.ok(entry.commonName["en-US"] && entry.commonName["en-GB"] && entry.commonName.vi, `${entry.slug}: missing locale`);
  assert.ok(entry.scientificName.length >= 3, `${entry.slug}: missing scientific name`);
  assert.ok(entry.citationIds.length > 0 && entry.citationIds.every((id)=>citationIds.has(id)), `${entry.slug}: invalid citations`);
  assert.equal(entry.size, null, `${entry.slug}: unsupported size must remain null`);
  assert.equal(entry.lifespan, null, `${entry.slug}: unsupported lifespan must remain null`);
}
for (const citation of citations) assert.match(citation.url, /^https:\/\//, `${citation.id}: canonical URL must use HTTPS`);

const migration = await readFile(new URL("../supabase/migrations/202608140001_initial_pawtome.sql", import.meta.url), "utf8");
const tables = ["species","animal_entries","animal_traits","care_topics","care_articles","foods","food_safety","behaviors","training_guides","citations","content_citations","media_assets","content_reviews","profiles","pets","pet_photos","favorites","care_tasks","weight_entries","training_progress"];
for (const table of tables) {
  assert.match(migration, new RegExp(`create table public\\.${table} \\(`), `Missing ${table}`);
  assert.match(migration, new RegExp(`alter table public\\.${table} enable row level security;`), `RLS missing on ${table}`);
}
for (const boundary of ["public read published animals","users manage own pet photos","users manage own favorites","editors manage animals","users upload own pet photos"]) assert.ok(migration.includes(boundary), `Missing policy: ${boundary}`);

const seed = await readFile(new URL("../supabase/seed.sql", import.meta.url), "utf8");
assert.equal((seed.match(/insert into public\.animal_entries/g) ?? []).length, 71);
assert.ok(seed.includes("content_citations") && seed.includes("merck-food-hazards") && seed.includes("avsab-humane-training"));
console.log("Catalog, citations, schema/RLS structure, and deterministic seed validated.");
