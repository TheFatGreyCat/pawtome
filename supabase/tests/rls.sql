begin;
create extension if not exists pgtap with schema extensions;
select plan(8);

select has_table('public','animal_entries','animal catalog exists');
select has_table('public','pets','private pets table exists');
select has_table('public','editor_users','editor grants are separate from user-editable profiles');

insert into auth.users(id,aud,role,email,encrypted_password,email_confirmed_at,raw_app_meta_data,raw_user_meta_data,created_at,updated_at)
values
 ('10000000-0000-4000-8000-000000000001','authenticated','authenticated','owner-a@example.invalid','',now(),'{}','{}',now(),now()),
 ('20000000-0000-4000-8000-000000000002','authenticated','authenticated','owner-b@example.invalid','',now(),'{}','{}',now(),now()),
 ('30000000-0000-4000-8000-000000000003','authenticated','authenticated','editor@example.invalid','',now(),'{}','{}',now(),now());
insert into public.editor_users(user_id) values ('30000000-0000-4000-8000-000000000003');
insert into public.pets(id,owner_id,name) values
 ('11000000-0000-4000-8000-000000000001','10000000-0000-4000-8000-000000000001','Owner A pet'),
 ('22000000-0000-4000-8000-000000000002','20000000-0000-4000-8000-000000000002','Owner B pet');

set local role anon;
select results_eq($$select count(*)::bigint from public.animal_entries where publication_status <> 'published'$$,$$values (0::bigint)$$,'anonymous users cannot read drafts');

set local role authenticated;
select set_config('request.jwt.claims','{"sub":"10000000-0000-4000-8000-000000000001","role":"authenticated"}',true);
select results_eq($$select name from public.pets order by name$$,$$values ('Owner A pet'::text)$$,'owner reads only own pets');
select is_empty($$select * from public.editor_users$$,'ordinary user cannot enumerate editors');
select throws_ok($$insert into public.pet_photos(pet_id,owner_id,storage_path,mime_type,file_size) values ('22000000-0000-4000-8000-000000000002','10000000-0000-4000-8000-000000000001','10000000-0000-4000-8000-000000000001/not-owned.jpg','image/jpeg',100)$$,'23503',null,'cross-owner photo relationship is rejected');

select set_config('request.jwt.claims','{"sub":"30000000-0000-4000-8000-000000000003","role":"authenticated"}',true);
select ok(public.is_editor(),'authorized editor is recognized');

select * from finish();
rollback;
