create table if not exists public.activities (
  id bigint primary key,
  name text not null unique,
  progress integer not null default 0 check (progress >= 0 and progress <= 100),
  delayed boolean not null default false,
  remarks text default '',
  updated_at timestamptz not null default now()
);

insert into public.activities (id, name, progress, delayed, remarks)
values
  (1, 'Excavation', 0, false, ''),
  (2, 'Piling', 0, false, ''),
  (3, 'Raft', 0, false, ''),
  (4, 'Columns', 0, false, ''),
  (5, 'Slabs', 0, false, ''),
  (6, 'Blockwork', 0, false, ''),
  (7, 'MEP', 0, false, ''),
  (8, 'Finishing', 0, false, '')
on conflict (id) do nothing;

alter table public.activities enable row level security;

create policy "Public read activities"
on public.activities
for select
using (true);

create policy "Public write activities"
on public.activities
for insert
with check (true);

create policy "Public update activities"
on public.activities
for update
using (true)
with check (true);
