import { catalog, type AnimalEntry, type CatalogGroup } from "./catalog";
import { createSupabaseServerClient } from "./supabase/server";

export type CatalogResult = { entries: AnimalEntry[]; source: "supabase" | "seed"; warning: string | null };

export async function getAnimalCatalog(): Promise<CatalogResult> {
  const supabase = await createSupabaseServerClient();
  if (!supabase) return { entries: catalog, source: "seed", warning: null };

  const { data, error } = await supabase
    .from("animal_entries")
    .select("slug, common_names, scientific_name, entry_kind, origin, activity, beginner_suitability, size_text, lifespan_text, image_url, image_alt, content, citation_ids, reviewed_at, review_status, species!inner(slug)")
    .eq("publication_status", "published")
    .order("sort_order")
    .order("slug");

  if (error || !data?.length) {
    return { entries: catalog, source: "seed", warning: error?.message ?? "The database catalog is empty; deterministic seed data is shown." };
  }

  const entries = data.map((row) => {
    const content = row.content as AnimalEntry;
    const species = Array.isArray(row.species) ? row.species[0] : row.species;
    return {
      ...content,
      slug: row.slug,
      commonName: row.common_names,
      scientificName: row.scientific_name,
      group: species.slug as CatalogGroup,
      entryKind: row.entry_kind,
      origin: row.origin,
      activity: row.activity,
      beginnerSuitability: row.beginner_suitability,
      size: row.size_text,
      lifespan: row.lifespan_text,
      imageUrl: row.image_url,
      imageAlt: row.image_alt,
      citationIds: row.citation_ids,
      reviewedAt: row.reviewed_at,
      reviewStatus: row.review_status,
    } as AnimalEntry;
  });

  return { entries, source: "supabase", warning: null };
}
