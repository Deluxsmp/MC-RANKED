-- Run this once in Supabase Dashboard > SQL Editor.
create table if not exists public.players (
  id bigint primary key,
  name text not null,
  region text not null default 'AS',
  "skinUrl" text not null default '',
  namemc text not null default '',
  results jsonb not null default '{}'::jsonb,
  "totalPoints" numeric not null default 0,
  position integer not null default 0,
  updated_at timestamptz not null default now()
);

alter table public.players enable row level security;
drop policy if exists "Public can read players" on public.players;
create policy "Public can read players" on public.players for select using (true);
drop policy if exists "Authenticated admins can insert players" on public.players;
create policy "Authenticated admins can insert players" on public.players for insert to authenticated with check (true);
drop policy if exists "Authenticated admins can update players" on public.players;
create policy "Authenticated admins can update players" on public.players for update to authenticated using (true) with check (true);
drop policy if exists "Authenticated admins can delete players" on public.players;
create policy "Authenticated admins can delete players" on public.players for delete to authenticated using (true);

-- Enable Realtime for live updates. If already added, ignore the duplicate error.
alter publication supabase_realtime add table public.players;


-- One-time import of the players that were already in your old players.js.
insert into public.players (id,name,region,"skinUrl",namemc,results,"totalPoints",position) values
(1791363847793, 'Itz_Dhrubo', 'AS', '', '', '{"vanilla":{"tier":"HT1","points":100},"uhc":{"tier":"HT1","points":100},"pot":{"tier":"HT1","points":100},"nethop":{"tier":"HT1","points":100},"smp":{"tier":"HT1","points":100},"sword":{"tier":"HT1","points":100},"axe":{"tier":"HT1","points":100},"mace":{"tier":"HT1","points":100}}'::jsonb, 800.0, 1)
on conflict (id) do nothing;
