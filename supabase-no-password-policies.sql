-- MCRANCKED: enable password-free admin panel writes.
-- Run this in Supabase Dashboard > SQL Editor.
-- WARNING: anyone who can access your website and its public anon key can add, edit, or delete ranking entries.

alter table public.players enable row level security;

grant select, insert, update, delete on table public.players to anon, authenticated;

drop policy if exists "Authenticated admins can insert players" on public.players;
drop policy if exists "Authenticated admins can update players" on public.players;
drop policy if exists "Authenticated admins can delete players" on public.players;
drop policy if exists "Public can manage players without login" on public.players;

create policy "Public can manage players without login"
on public.players for all to anon, authenticated
using (true) with check (true);

-- Keep public read access for the ranking page.
drop policy if exists "Public can read players" on public.players;
create policy "Public can read players" on public.players for select using (true);

-- Enable Realtime for automatic public ranking updates.
do $$
begin
  alter publication supabase_realtime add table public.players;
exception when duplicate_object then
  null;
end $$;
