-- ============================================================
-- PROFILES TABLE
-- ============================================================
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  ckd_stage text not null check (
    ckd_stage in ('1-2', '3a', '3b', '4', '5', 'dialysis')
  ),
  onboarded boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Auto-create profile row on signup
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.profiles (id, email, ckd_stage, onboarded)
  values (new.id, new.email, '1-2', false);
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ============================================================
-- MEALS TABLE
-- ============================================================
create table public.meals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  photo_url text not null,
  photo_path text not null,
  overall_verdict text not null check (
    overall_verdict in ('SAFE', 'CAUTION', 'UNSAFE')
  ),
  total_potassium_mg numeric(8, 2) not null,
  total_phosphorus_mg numeric(8, 2) not null,
  total_protein_g numeric(8, 2) not null,
  potassium_verdict text not null check (
    potassium_verdict in ('SAFE', 'CAUTION', 'UNSAFE')
  ),
  phosphorus_verdict text not null check (
    phosphorus_verdict in ('SAFE', 'CAUTION', 'UNSAFE')
  ),
  protein_verdict text not null check (
    protein_verdict in ('SAFE', 'CAUTION', 'UNSAFE')
  ),
  ckd_stage_at_scan text not null,
  notes text,
  scanned_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create index meals_user_id_scanned_at_idx on public.meals (
  user_id,
  scanned_at desc
);

-- ============================================================
-- MEAL INGREDIENTS TABLE
-- ============================================================
create table public.meal_ingredients (
  id uuid primary key default gen_random_uuid(),
  meal_id uuid not null references public.meals(id) on delete cascade,
  name text not null,
  portion_estimate text not null,
  confidence text not null check (confidence in ('high', 'medium', 'low')),
  potassium_mg numeric(8, 2) not null,
  phosphorus_mg numeric(8, 2) not null,
  protein_g numeric(8, 2) not null,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create index meal_ingredients_meal_id_idx on public.meal_ingredients (meal_id);

-- ============================================================
-- ROW LEVEL SECURITY POLICIES
-- ============================================================
alter table public.profiles enable row level security;
alter table public.meals enable row level security;
alter table public.meal_ingredients enable row level security;

-- Profiles: users can read and update their own profile
create policy "Users can read own profile" on public.profiles
  for select using (auth.uid() = id);

create policy "Users can update own profile" on public.profiles
  for update using (auth.uid() = id);

-- Meals: users can read, insert, and delete their own meals
create policy "Users can read own meals" on public.meals
  for select using (auth.uid() = user_id);

create policy "Users can insert own meals" on public.meals
  for insert with check (auth.uid() = user_id);

create policy "Users can delete own meals" on public.meals
  for delete using (auth.uid() = user_id);

-- Meal ingredients: accessible via meal ownership
create policy "Users can read own meal ingredients" on public.meal_ingredients
  for select using (
    exists (
      select 1 from public.meals m
      where m.id = meal_id and m.user_id = auth.uid()
    )
  );

create policy "Users can insert own meal ingredients" on public.meal_ingredients
  for insert with check (
    exists (
      select 1 from public.meals m
      where m.id = meal_id and m.user_id = auth.uid()
    )
  );

-- ============================================================
-- CKD STAGE THRESHOLDS REFERENCE TABLE
-- ============================================================
create table public.ckd_stage_thresholds (
  stage text primary key,
  stage_label text not null,
  stage_description text not null,
  potassium_limit_mg numeric(8, 2) not null,
  phosphorus_limit_mg numeric(8, 2) not null,
  protein_limit_g numeric(8, 2) not null,
  fluid_limit_ml int,
  created_at timestamptz not null default now()
);

-- ============================================================
-- SMS SETTINGS TABLE
-- ============================================================
create table public.sms_settings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references public.profiles(id) on delete cascade,
  phone_number text,
  phone_verified boolean not null default false,
  sms_enabled boolean not null default false,
  meal_log_reminders_enabled boolean not null default false,
  hydration_reminders_enabled boolean not null default false,
  reminder_times text[] default array['08:00', '12:00', '18:00'],
  timezone text default 'UTC',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ============================================================
-- RLS FOR NEW TABLES
-- ============================================================
alter table public.ckd_stage_thresholds enable row level security;
alter table public.sms_settings enable row level security;

-- CKD thresholds: public read access (reference data)
create policy "Everyone can read ckd_stage_thresholds" on public.ckd_stage_thresholds
  for select using (true);

-- SMS settings: users own their own settings
create policy "Users can read own sms_settings" on public.sms_settings
  for select using (auth.uid() = user_id);

create policy "Users can insert own sms_settings" on public.sms_settings
  for insert with check (auth.uid() = user_id);

create policy "Users can update own sms_settings" on public.sms_settings
  for update using (auth.uid() = user_id);

-- ============================================================
-- SEED DATA: CKD STAGE THRESHOLDS
-- ============================================================
insert into public.ckd_stage_thresholds (
  stage,
  stage_label,
  stage_description,
  potassium_limit_mg,
  phosphorus_limit_mg,
  protein_limit_g,
  fluid_limit_ml
) values
  ('1-2', 'Stage 1–2', 'Early CKD — standard nutrient restrictions', 3500, 1000, 60, null),
  ('3a', 'Stage 3a', 'Mild to moderate CKD — increased nutrient management', 3000, 900, 50, null),
  ('3b', 'Stage 3b', 'Moderate CKD — closer nutrient monitoring', 2500, 800, 45, null),
  ('4', 'Stage 4', 'Advanced CKD — tight nutrient control', 2000, 750, 40, null),
  ('5', 'Stage 5', 'End-stage renal disease — strict restrictions', 1500, 700, 35, null),
  ('dialysis', 'Dialysis', 'On dialysis — adjusted nutrient needs', 2500, 1000, 70, 800)
on conflict (stage) do nothing;
