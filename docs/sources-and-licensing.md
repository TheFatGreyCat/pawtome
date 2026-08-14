# Pawtome source and licensing report

Reviewed: 2026-08-14.

## Evidence scope

The deterministic seed uses claim-level links to recognized breed registries, veterinary professional guidance, welfare guidance, and the MSD Veterinary Manual. Registry sources support naming/classification only. General care templates support species-group principles only. Entry-specific lifespan, size, health predispositions, and precise ratings remain null or marked `needs-entry-review`.

| ID | Source | Evidence use | Important limit |
|---|---|---|---|
| `fci-breed-nomenclature` | Fédération Cynologique Internationale, FCI Breeds Nomenclature | Dog breed naming/classification | Not individual temperament, health, or lifespan evidence |
| `cfa-recognized-breeds` | Cat Fanciers' Association, CFA Recognized Breeds | Cat breed naming and broad registry descriptions | Not a prediction for an individual cat |
| `aav-basic-care` | Association of Avian Veterinarians, Basic Care for Companion Birds (2019) | General companion-bird care | Species-specific avian review still required |
| `aav-environmental-needs` | Association of Avian Veterinarians, Environmental Needs of Birds (2023) | Enrichment, rest, social/privacy framework | Not a species prescription |
| `merck-rabbit-home` | McClure, MSD Veterinary Manual, Providing a Home for a Rabbit (2020) | Rabbit housing/diet/exercise | Must not be generalized to rodents |
| `rspca-small-pets` | RSPCA, Choosing the Best Pet for Your Family | Small-pet welfare/suitability | Not a clinical reference |
| `merck-reptile-husbandry` | Divers and Comolli, MSD Veterinary Manual (2025) | Reptile husbandry principles | Values are species-specific |
| `merck-fish-home` | Francis-Floyd and Petty, MSD Veterinary Manual (2020; updated 2026) | Aquarium setup and water-quality principles | Water/stocking needs are species-specific |
| `wsava-nutrition` | WSAVA Global Nutrition Guidelines (2021) | Individualized dog/cat nutrition boundary | Not a diet prescription |
| `avsab-humane-training` | AVSAB Humane Dog Training Position Statement (2021) | Reward-based dog training | Does not guarantee outcomes |
| `aaha-behavior-guidelines` | AAHA Canine and Feline Behavior Management Guidelines (2015) | Behavior-assessment context | Not diagnostic |
| `merck-food-hazards` | Gwaltney-Brant, MSD Veterinary Manual, Food Hazards (2020; updated 2026) | Toxic-food and emergency guidance | Risk depends on species, product, dose, and patient |

Canonical URLs and full metadata live once in `lib/catalog.ts` and `public.citations`; `content_citations` stores the exact supported claim. Community experience remains separately labeled in the preserved demo and is never seeded as scientific evidence.

## Images and redistribution

- `public/brand/pawtome-logo.png`: 1254×1254 PNG, 548,947 bytes. The repository contains no embedded creator/license record. Seed metadata therefore says `Unknown legacy project asset` and `Needs rights review`; confirm ownership before uploading or redistributing it through Supabase Storage.
- Seeded catalog entries reference only `/brand/pawtome-logo.png`, so no third-party binary is copied into Postgres or Storage.
- The preserved demo UI still hotlinks ten `images.unsplash.com` URLs plus one hero URL. They were present before this task; the repository does not identify their creators or source-page URLs. They were not downloaded, seeded as Storage objects, or re-uploaded. Before production editorial use, resolve each Unsplash photo page, creator, canonical source URL, and current license/attribution requirement—or replace it with rights-cleared media.
- User pet photos are private, owner-scoped uploads. Pawtome records path, owner, dimensions when available, MIME type, byte size, and alt text; it never stores image binary data in Postgres.

## Editorial review rule

Do not publish a new health, nutrition, toxicity, behavior, welfare, or training assertion unless it has a `citations` record plus a `content_citations` row naming the supported claim and limitations. Use `unknown`/`needs-review` when evidence is absent or does not justify precision.
