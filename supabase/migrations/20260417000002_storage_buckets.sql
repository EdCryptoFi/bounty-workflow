-- =====================================================================
-- Bounty WorkFlow · Storage buckets + RLS
-- A3 fix: bucket privado, path prefixado por user_id, MIME/size limitados
-- =====================================================================

-- Bucket 'attachments' — privado, 10 MB, MIME whitelist
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'attachments',
  'attachments',
  false,
  10485760,
  array['image/png','image/jpeg','image/webp','image/gif','application/pdf']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

-- =====================================================================
-- Policies no storage.objects
-- Convenção de path: {user_id}/{campaign_id}/{filename}
-- Primeiro segmento = user_id → valida via (storage.foldername(name))[1]
-- =====================================================================

-- SELECT: só o dono lê seus arquivos
drop policy if exists "attachments_owner_select" on storage.objects;
create policy "attachments_owner_select" on storage.objects
  for select to authenticated
  using (
    bucket_id = 'attachments'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

-- INSERT: só pode gravar no próprio prefixo
drop policy if exists "attachments_owner_insert" on storage.objects;
create policy "attachments_owner_insert" on storage.objects
  for insert to authenticated
  with check (
    bucket_id = 'attachments'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

-- UPDATE: só pode atualizar o próprio
drop policy if exists "attachments_owner_update" on storage.objects;
create policy "attachments_owner_update" on storage.objects
  for update to authenticated
  using (
    bucket_id = 'attachments'
    and (storage.foldername(name))[1] = auth.uid()::text
  )
  with check (
    bucket_id = 'attachments'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

-- DELETE: só pode deletar o próprio
drop policy if exists "attachments_owner_delete" on storage.objects;
create policy "attachments_owner_delete" on storage.objects
  for delete to authenticated
  using (
    bucket_id = 'attachments'
    and (storage.foldername(name))[1] = auth.uid()::text
  );
