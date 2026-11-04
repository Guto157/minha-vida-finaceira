-- Execute este script uma única vez no SQL Editor do Supabase.
create table if not exists public.user_finance_data (
  user_id uuid primary key references auth.users(id) on delete cascade,
  data jsonb not null default '{"months":{}}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.user_finance_data enable row level security;

grant usage on schema public to authenticated;
grant select, insert, update on public.user_finance_data to authenticated;

drop policy if exists "Users can read own finance data" on public.user_finance_data;
create policy "Users can read own finance data"
on public.user_finance_data for select to authenticated
using (auth.uid() = user_id);

drop policy if exists "Users can insert own finance data" on public.user_finance_data;
create policy "Users can insert own finance data"
on public.user_finance_data for insert to authenticated
with check (auth.uid() = user_id);

drop policy if exists "Users can update own finance data" on public.user_finance_data;
create policy "Users can update own finance data"
on public.user_finance_data for update to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);
