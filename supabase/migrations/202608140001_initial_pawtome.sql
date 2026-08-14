begin;

create extension if not exists pgcrypto;

create function public.set_updated_at()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table public.species (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  names jsonb not null check (jsonb_typeof(names) = 'object' and names ?& array['en-US','en-GB','vi']),
  sort_order integer not null default 0 check (sort_order >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.animal_entries (
  id uuid primary key default gen_random_uuid(),
  species_id uuid not null references public.species(id) on delete restrict,
  slug text not null unique check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  entry_kind text not null check (entry_kind in ('breed','species','variety','morph')),
  common_names jsonb not null check (jsonb_typeof(common_names) = 'object' and common_names ?& array['en-US','en-GB','vi']),
  scientific_name text not null check (length(scientific_name) between 3 and 160),
  origin text,
  activity text not null default 'needs-review' check (activity in ('low','moderate','high','needs-review')),
  beginner_suitability text not null default 'needs-review' check (beginner_suitability in ('potentially-suitable','experienced-care','needs-review')),
  size_text text,
  lifespan_text text,
  image_url text not null default '/brand/pawtome-logo.png',
  image_alt jsonb not null check (jsonb_typeof(image_alt) = 'object' and image_alt ?& array['en-US','en-GB','vi']),
  content jsonb not null check (jsonb_typeof(content) = 'object'),
  citation_ids text[] not null default '{}',
  review_status text not null default 'needs-entry-review' check (review_status in ('reviewed-general','needs-entry-review')),
  publication_status text not null default 'draft' check (publication_status in ('draft','in-review','published','archived')),
  reviewed_at date,
  sort_order integer not null default 0 check (sort_order >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.animal_traits (
  id uuid primary key default gen_random_uuid(),
  animal_entry_id uuid not null references public.animal_entries(id) on delete cascade,
  trait_key text not null check (trait_key ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  qualitative_value text,
  localized_value jsonb check (localized_value is null or jsonb_typeof(localized_value) = 'object'),
  evidence_state text not null default 'needs-review' check (evidence_state in ('reviewed','needs-review','unknown')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (animal_entry_id, trait_key)
);

create table public.care_topics (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  names jsonb not null check (jsonb_typeof(names) = 'object' and names ?& array['en-US','en-GB','vi']),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.care_articles (
  id uuid primary key default gen_random_uuid(),
  care_topic_id uuid not null references public.care_topics(id) on delete restrict,
  slug text not null unique check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  titles jsonb not null check (jsonb_typeof(titles) = 'object' and titles ?& array['en-US','en-GB','vi']),
  body jsonb not null check (jsonb_typeof(body) = 'object'),
  publication_status text not null default 'draft' check (publication_status in ('draft','in-review','published','archived')),
  reviewed_at date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.foods (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  names jsonb not null check (jsonb_typeof(names) = 'object' and names ?& array['en-US','en-GB','vi']),
  category text not null,
  publication_status text not null default 'draft' check (publication_status in ('draft','in-review','published','archived')),
  reviewed_at date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.food_safety (
  id uuid primary key default gen_random_uuid(),
  food_id uuid not null references public.foods(id) on delete cascade,
  species_id uuid not null references public.species(id) on delete restrict,
  safety_level text not null check (safety_level in ('generally-safe','caution','avoid','danger','unknown')),
  guidance jsonb not null check (jsonb_typeof(guidance) = 'object' and guidance ?& array['en-US','en-GB','vi']),
  emergency_guidance jsonb check (emergency_guidance is null or jsonb_typeof(emergency_guidance) = 'object'),
  publication_status text not null default 'draft' check (publication_status in ('draft','in-review','published','archived')),
  reviewed_at date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (food_id, species_id)
);

create table public.behaviors (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  species_id uuid references public.species(id) on delete restrict,
  titles jsonb not null check (jsonb_typeof(titles) = 'object' and titles ?& array['en-US','en-GB','vi']),
  guidance jsonb not null check (jsonb_typeof(guidance) = 'object'),
  evidence_label text not null default 'pawtome-guidance' check (evidence_label in ('pawtome-guidance','veterinary-guideline','peer-reviewed','community-experience')),
  publication_status text not null default 'draft' check (publication_status in ('draft','in-review','published','archived')),
  reviewed_at date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.training_guides (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  species_id uuid not null references public.species(id) on delete restrict,
  titles jsonb not null check (jsonb_typeof(titles) = 'object' and titles ?& array['en-US','en-GB','vi']),
  steps jsonb not null check (jsonb_typeof(steps) = 'object'),
  method text not null default 'reward-based' check (method = 'reward-based'),
  publication_status text not null default 'draft' check (publication_status in ('draft','in-review','published','archived')),
  reviewed_at date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.citations (
  id text primary key check (id ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  title text not null,
  authors_or_organization text not null,
  publication_year integer check (publication_year is null or publication_year between 1800 and 2100),
  journal_or_publisher text not null,
  identifier text,
  canonical_url text not null check (canonical_url ~ '^https://'),
  evidence_type text not null check (evidence_type in ('peer-reviewed','systematic-review','veterinary-guideline','veterinary-manual','government-guidance','breed-registry','welfare-guidance')),
  evidence_strength text not null check (evidence_strength in ('high','moderate','limited','authoritative','professional-consensus','reviewed-guidance')),
  accessed_at date not null,
  reviewed_at date not null,
  applicable_species text[] not null default '{}',
  supported_claim text not null,
  limitations text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.content_citations (
  id uuid primary key default gen_random_uuid(),
  citation_id text not null references public.citations(id) on delete restrict,
  animal_entry_id uuid references public.animal_entries(id) on delete cascade,
  care_article_id uuid references public.care_articles(id) on delete cascade,
  food_safety_id uuid references public.food_safety(id) on delete cascade,
  behavior_id uuid references public.behaviors(id) on delete cascade,
  training_guide_id uuid references public.training_guides(id) on delete cascade,
  supported_claim text not null,
  evidence_label text not null check (evidence_label in ('broad-tendency','pawtome-guidance','peer-reviewed','veterinary-guideline','veterinary-manual','community-experience')),
  created_at timestamptz not null default now(),
  check (num_nonnulls(animal_entry_id, care_article_id, food_safety_id, behavior_id, training_guide_id) = 1)
);

create table public.editor_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  granted_at timestamptz not null default now(),
  granted_by uuid references auth.users(id) on delete set null
);

create function public.is_editor()
returns boolean
language sql
stable
security definer
set search_path = public
as $$ select exists (select 1 from public.editor_users where user_id = (select auth.uid())); $$;

revoke all on function public.is_editor() from public;
grant execute on function public.is_editor() to anon, authenticated;

create table public.media_assets (
  id uuid primary key default gen_random_uuid(),
  bucket_id text not null check (bucket_id in ('editorial-images','pet-photos')),
  storage_path text not null check (storage_path !~ '(^|/)\.\.(/|$)'),
  is_public boolean not null default false,
  owner_id uuid references auth.users(id) on delete cascade,
  animal_entry_id uuid references public.animal_entries(id) on delete cascade,
  care_article_id uuid references public.care_articles(id) on delete cascade,
  creator text not null,
  source_url text,
  license_name text not null,
  license_url text,
  attribution text not null,
  alt_text jsonb not null check (jsonb_typeof(alt_text) = 'object' and alt_text ?& array['en-US','en-GB','vi']),
  width integer not null check (width > 0),
  height integer not null check (height > 0),
  mime_type text not null check (mime_type in ('image/jpeg','image/png','image/webp')),
  file_size bigint not null check (file_size between 1 and 5242880),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (bucket_id, storage_path),
  check ((bucket_id = 'editorial-images' and is_public and owner_id is null) or (bucket_id = 'pet-photos' and not is_public and owner_id is not null)),
  check (num_nonnulls(animal_entry_id, care_article_id) <= 1)
);

create table public.content_reviews (
  id uuid primary key default gen_random_uuid(),
  reviewer_id uuid not null references auth.users(id) on delete restrict,
  animal_entry_id uuid references public.animal_entries(id) on delete cascade,
  care_article_id uuid references public.care_articles(id) on delete cascade,
  food_safety_id uuid references public.food_safety(id) on delete cascade,
  behavior_id uuid references public.behaviors(id) on delete cascade,
  training_guide_id uuid references public.training_guides(id) on delete cascade,
  decision text not null check (decision in ('approved','changes-requested','retired')),
  review_note text,
  reviewed_at timestamptz not null default now(),
  next_review_at date,
  check (num_nonnulls(animal_entry_id, care_article_id, food_safety_id, behavior_id, training_guide_id) = 1)
);

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text check (display_name is null or length(display_name) between 1 and 80),
  locale text not null default 'en-US' check (locale in ('vi','en-US','en-GB')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.pets (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  animal_entry_id uuid references public.animal_entries(id) on delete set null,
  name text not null check (length(name) between 1 and 80),
  birth_date date,
  sex text check (sex is null or sex in ('female','male','unknown')),
  notes text check (notes is null or length(notes) <= 4000),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (id, owner_id)
);

create table public.pet_photos (
  id uuid primary key default gen_random_uuid(),
  pet_id uuid not null,
  owner_id uuid not null references auth.users(id) on delete cascade,
  storage_path text not null unique check (storage_path !~ '(^|/)\.\.(/|$)'),
  alt_text text,
  mime_type text not null check (mime_type in ('image/jpeg','image/png','image/webp')),
  file_size bigint not null check (file_size between 1 and 5242880),
  width integer check (width is null or width > 0),
  height integer check (height is null or height > 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  foreign key (pet_id, owner_id) references public.pets(id, owner_id) on delete cascade
);

create table public.favorites (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  target_type text not null check (target_type in ('animal-entry','care-article','food','behavior','training-guide')),
  target_key text not null check (target_key ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  created_at timestamptz not null default now(),
  unique (user_id, target_type, target_key)
);

create table public.care_tasks (
  id uuid primary key default gen_random_uuid(),
  pet_id uuid not null,
  owner_id uuid not null references auth.users(id) on delete cascade,
  title text not null check (length(title) between 1 and 160),
  due_at timestamptz,
  completed_at timestamptz,
  recurrence text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  foreign key (pet_id, owner_id) references public.pets(id, owner_id) on delete cascade
);

create table public.weight_entries (
  id uuid primary key default gen_random_uuid(),
  pet_id uuid not null,
  owner_id uuid not null references auth.users(id) on delete cascade,
  measured_at timestamptz not null default now(),
  weight_kg numeric(7,3) not null check (weight_kg > 0 and weight_kg < 1000),
  note text check (note is null or length(note) <= 1000),
  created_at timestamptz not null default now(),
  foreign key (pet_id, owner_id) references public.pets(id, owner_id) on delete cascade
);

create table public.training_progress (
  id uuid primary key default gen_random_uuid(),
  pet_id uuid not null,
  owner_id uuid not null references auth.users(id) on delete cascade,
  training_guide_id uuid not null references public.training_guides(id) on delete restrict,
  completed_steps integer not null default 0 check (completed_steps >= 0),
  successful_attempts integer not null default 0 check (successful_attempts >= 0),
  notes text check (notes is null or length(notes) <= 2000),
  last_practiced_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  foreign key (pet_id, owner_id) references public.pets(id, owner_id) on delete cascade,
  unique (pet_id, training_guide_id)
);

create index animal_entries_species_idx on public.animal_entries(species_id, publication_status, sort_order);
create index animal_entries_activity_idx on public.animal_entries(activity, beginner_suitability) where publication_status = 'published';
create index animal_traits_entry_idx on public.animal_traits(animal_entry_id);
create index food_safety_species_idx on public.food_safety(species_id, safety_level);
create index content_citations_citation_idx on public.content_citations(citation_id);
create index media_assets_entry_idx on public.media_assets(animal_entry_id) where animal_entry_id is not null;
create index pets_owner_idx on public.pets(owner_id);
create index pet_photos_owner_pet_idx on public.pet_photos(owner_id, pet_id);
create index care_tasks_owner_due_idx on public.care_tasks(owner_id, due_at);
create index weight_entries_pet_measured_idx on public.weight_entries(pet_id, measured_at desc);
create index training_progress_owner_idx on public.training_progress(owner_id, pet_id);

create trigger species_updated before update on public.species for each row execute function public.set_updated_at();
create trigger animal_entries_updated before update on public.animal_entries for each row execute function public.set_updated_at();
create trigger animal_traits_updated before update on public.animal_traits for each row execute function public.set_updated_at();
create trigger care_topics_updated before update on public.care_topics for each row execute function public.set_updated_at();
create trigger care_articles_updated before update on public.care_articles for each row execute function public.set_updated_at();
create trigger foods_updated before update on public.foods for each row execute function public.set_updated_at();
create trigger food_safety_updated before update on public.food_safety for each row execute function public.set_updated_at();
create trigger behaviors_updated before update on public.behaviors for each row execute function public.set_updated_at();
create trigger training_guides_updated before update on public.training_guides for each row execute function public.set_updated_at();
create trigger citations_updated before update on public.citations for each row execute function public.set_updated_at();
create trigger media_assets_updated before update on public.media_assets for each row execute function public.set_updated_at();
create trigger profiles_updated before update on public.profiles for each row execute function public.set_updated_at();
create trigger pets_updated before update on public.pets for each row execute function public.set_updated_at();
create trigger pet_photos_updated before update on public.pet_photos for each row execute function public.set_updated_at();
create trigger care_tasks_updated before update on public.care_tasks for each row execute function public.set_updated_at();
create trigger training_progress_updated before update on public.training_progress for each row execute function public.set_updated_at();

create function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles(id, display_name, locale)
  values (new.id, nullif(left(new.raw_user_meta_data ->> 'display_name', 80), ''), coalesce(nullif(new.raw_user_meta_data ->> 'locale',''), 'en-US'))
  on conflict (id) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created after insert on auth.users for each row execute function public.handle_new_user();

alter table public.species enable row level security;
alter table public.animal_entries enable row level security;
alter table public.animal_traits enable row level security;
alter table public.care_topics enable row level security;
alter table public.care_articles enable row level security;
alter table public.foods enable row level security;
alter table public.food_safety enable row level security;
alter table public.behaviors enable row level security;
alter table public.training_guides enable row level security;
alter table public.citations enable row level security;
alter table public.content_citations enable row level security;
alter table public.editor_users enable row level security;
alter table public.media_assets enable row level security;
alter table public.content_reviews enable row level security;
alter table public.profiles enable row level security;
alter table public.pets enable row level security;
alter table public.pet_photos enable row level security;
alter table public.favorites enable row level security;
alter table public.care_tasks enable row level security;
alter table public.weight_entries enable row level security;
alter table public.training_progress enable row level security;

grant usage on schema public to anon, authenticated;
grant select on table
  public.species,
  public.animal_entries,
  public.animal_traits,
  public.care_topics,
  public.care_articles,
  public.foods,
  public.food_safety,
  public.behaviors,
  public.training_guides,
  public.citations,
  public.content_citations,
  public.media_assets,
  public.content_reviews
to anon;
grant select, insert, update, delete on table
  public.species,
  public.animal_entries,
  public.animal_traits,
  public.care_topics,
  public.care_articles,
  public.foods,
  public.food_safety,
  public.behaviors,
  public.training_guides,
  public.citations,
  public.content_citations,
  public.media_assets,
  public.content_reviews,
  public.profiles,
  public.pets,
  public.pet_photos,
  public.favorites,
  public.care_tasks,
  public.weight_entries,
  public.training_progress
to authenticated;
grant select on table public.editor_users to authenticated;

create policy "public read species" on public.species for select to anon, authenticated using (true);
create policy "public read published animals" on public.animal_entries for select to anon, authenticated using (publication_status = 'published' or public.is_editor());
create policy "public read published animal traits" on public.animal_traits for select to anon, authenticated using (exists (select 1 from public.animal_entries a where a.id = animal_entry_id and (a.publication_status = 'published' or public.is_editor())));
create policy "public read care topics" on public.care_topics for select to anon, authenticated using (true);
create policy "public read published care" on public.care_articles for select to anon, authenticated using (publication_status = 'published' or public.is_editor());
create policy "public read published foods" on public.foods for select to anon, authenticated using (publication_status = 'published' or public.is_editor());
create policy "public read published food safety" on public.food_safety for select to anon, authenticated using (publication_status = 'published' or public.is_editor());
create policy "public read published behaviors" on public.behaviors for select to anon, authenticated using (publication_status = 'published' or public.is_editor());
create policy "public read published training" on public.training_guides for select to anon, authenticated using (publication_status = 'published' or public.is_editor());
create policy "public read citations" on public.citations for select to anon, authenticated using (true);
create policy "public read claim citations" on public.content_citations for select to anon, authenticated using (true);
create policy "public read approved reviews" on public.content_reviews for select to anon, authenticated using (decision = 'approved' or public.is_editor());
create policy "public read editorial media" on public.media_assets for select to anon, authenticated using (is_public or owner_id = (select auth.uid()));
create policy "editor self read" on public.editor_users for select to authenticated using (user_id = (select auth.uid()));

create policy "editors manage species" on public.species for all to authenticated using (public.is_editor()) with check (public.is_editor());
create policy "editors manage animals" on public.animal_entries for all to authenticated using (public.is_editor()) with check (public.is_editor());
create policy "editors manage animal traits" on public.animal_traits for all to authenticated using (public.is_editor()) with check (public.is_editor());
create policy "editors manage care topics" on public.care_topics for all to authenticated using (public.is_editor()) with check (public.is_editor());
create policy "editors manage care" on public.care_articles for all to authenticated using (public.is_editor()) with check (public.is_editor());
create policy "editors manage foods" on public.foods for all to authenticated using (public.is_editor()) with check (public.is_editor());
create policy "editors manage food safety" on public.food_safety for all to authenticated using (public.is_editor()) with check (public.is_editor());
create policy "editors manage behaviors" on public.behaviors for all to authenticated using (public.is_editor()) with check (public.is_editor());
create policy "editors manage training" on public.training_guides for all to authenticated using (public.is_editor()) with check (public.is_editor());
create policy "editors manage citations" on public.citations for all to authenticated using (public.is_editor()) with check (public.is_editor());
create policy "editors manage claim citations" on public.content_citations for all to authenticated using (public.is_editor()) with check (public.is_editor());
create policy "editors manage media" on public.media_assets for all to authenticated using (public.is_editor()) with check (public.is_editor() and bucket_id = 'editorial-images' and is_public and owner_id is null);
create policy "editors manage reviews" on public.content_reviews for all to authenticated using (public.is_editor()) with check (public.is_editor() and reviewer_id = (select auth.uid()));

create policy "users read own profile" on public.profiles for select to authenticated using (id = (select auth.uid()));
create policy "users update own profile" on public.profiles for update to authenticated using (id = (select auth.uid())) with check (id = (select auth.uid()));
create policy "users read own pets" on public.pets for select to authenticated using (owner_id = (select auth.uid()));
create policy "users create own pets" on public.pets for insert to authenticated with check (owner_id = (select auth.uid()));
create policy "users update own pets" on public.pets for update to authenticated using (owner_id = (select auth.uid())) with check (owner_id = (select auth.uid()));
create policy "users delete own pets" on public.pets for delete to authenticated using (owner_id = (select auth.uid()));
create policy "users manage own pet photos" on public.pet_photos for all to authenticated using (owner_id = (select auth.uid())) with check (owner_id = (select auth.uid()));
create policy "users manage own favorites" on public.favorites for all to authenticated using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));
create policy "users manage own care tasks" on public.care_tasks for all to authenticated using (owner_id = (select auth.uid())) with check (owner_id = (select auth.uid()));
create policy "users manage own weight entries" on public.weight_entries for all to authenticated using (owner_id = (select auth.uid())) with check (owner_id = (select auth.uid()));
create policy "users manage own training progress" on public.training_progress for all to authenticated using (owner_id = (select auth.uid())) with check (owner_id = (select auth.uid()));

insert into storage.buckets(id, name, public, file_size_limit, allowed_mime_types)
values
  ('editorial-images','editorial-images',true,5242880,array['image/jpeg','image/png','image/webp']),
  ('pet-photos','pet-photos',false,5242880,array['image/jpeg','image/png','image/webp'])
on conflict (id) do update set public = excluded.public, file_size_limit = excluded.file_size_limit, allowed_mime_types = excluded.allowed_mime_types;

create policy "public reads editorial images" on storage.objects for select to public using (bucket_id = 'editorial-images');
create policy "editors upload editorial images" on storage.objects for insert to authenticated with check (bucket_id = 'editorial-images' and public.is_editor() and name !~ '(^|/)\.\.(/|$)' and lower(name) ~ '\.(jpe?g|png|webp)$');
create policy "editors update editorial images" on storage.objects for update to authenticated using (bucket_id = 'editorial-images' and public.is_editor()) with check (bucket_id = 'editorial-images' and public.is_editor() and name !~ '(^|/)\.\.(/|$)' and lower(name) ~ '\.(jpe?g|png|webp)$');
create policy "editors delete editorial images" on storage.objects for delete to authenticated using (bucket_id = 'editorial-images' and public.is_editor());
create policy "users read own pet photos" on storage.objects for select to authenticated using (bucket_id = 'pet-photos' and (storage.foldername(name))[1] = (select auth.uid())::text);
create policy "users upload own pet photos" on storage.objects for insert to authenticated with check (bucket_id = 'pet-photos' and (storage.foldername(name))[1] = (select auth.uid())::text and name !~ '(^|/)\.\.(/|$)' and lower(name) ~ '\.(jpe?g|png|webp)$');
create policy "users update own pet photos" on storage.objects for update to authenticated using (bucket_id = 'pet-photos' and (storage.foldername(name))[1] = (select auth.uid())::text) with check (bucket_id = 'pet-photos' and (storage.foldername(name))[1] = (select auth.uid())::text and name !~ '(^|/)\.\.(/|$)' and lower(name) ~ '\.(jpe?g|png|webp)$');
create policy "users delete own pet photos" on storage.objects for delete to authenticated using (bucket_id = 'pet-photos' and (storage.foldername(name))[1] = (select auth.uid())::text);

commit;
