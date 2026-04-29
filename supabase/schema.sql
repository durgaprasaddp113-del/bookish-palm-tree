-- Enable extension
create extension if not exists "uuid-ossp";

create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  role text not null check (role in ('admin','doctor','user')) default 'user',
  created_at timestamptz default now()
);

create table if not exists patient_profiles (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references profiles(id),
  full_name text not null,
  age int,
  gender text,
  mobile_number text,
  blood_group text,
  emergency_contact text,
  medical_history text,
  allergies text,
  notes text,
  assigned_doctor_id uuid references profiles(id),
  created_at timestamptz default now()
);

create table if not exists health_records (
  id uuid primary key default uuid_generate_v4(),
  patient_id uuid references patient_profiles(id) on delete cascade,
  record_date date not null,
  blood_pressure text,
  sugar_level numeric,
  temperature numeric,
  weight numeric,
  symptoms text,
  remarks text,
  status text check (status in ('Normal','Attention Required','Urgent')) not null
);

create table if not exists appointments (
  id uuid primary key default uuid_generate_v4(),
  patient_id uuid references patient_profiles(id),
  doctor_id uuid references profiles(id),
  appointment_at timestamptz not null,
  purpose text,
  status text check (status in ('Pending','Completed','Cancelled')) default 'Pending'
);

create table if not exists medicine_reminders (
  id uuid primary key default uuid_generate_v4(),
  patient_id uuid references patient_profiles(id),
  medicine_name text,
  dosage text,
  reminder_time time,
  start_date date,
  end_date date,
  reminder_status text default 'Pending'
);

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.profiles (id, full_name, role)
  values (new.id, coalesce(new.raw_user_meta_data->>'full_name','New User'), coalesce(new.raw_user_meta_data->>'role','user'));
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users for each row execute procedure public.handle_new_user();

alter table profiles enable row level security;
alter table patient_profiles enable row level security;
alter table health_records enable row level security;
alter table appointments enable row level security;
alter table medicine_reminders enable row level security;

create policy "profiles own" on profiles for select using (auth.uid()=id);
create policy "admin full profiles" on profiles for all using ((select role from profiles where id=auth.uid())='admin');

create policy "patient visible by role" on patient_profiles for select using (
  (select role from profiles where id=auth.uid())='admin' or
  user_id = auth.uid() or
  assigned_doctor_id = auth.uid()
);
create policy "patient mod admin_doctor" on patient_profiles for all using (
  (select role from profiles where id=auth.uid()) in ('admin','doctor')
);

create policy "records visible by role" on health_records for select using (
  exists(select 1 from patient_profiles p where p.id=patient_id and (p.user_id=auth.uid() or p.assigned_doctor_id=auth.uid())) or
  (select role from profiles where id=auth.uid())='admin'
);
create policy "records mod admin_doctor" on health_records for all using ((select role from profiles where id=auth.uid()) in ('admin','doctor'));

create policy "appointments visible" on appointments for select using (
  doctor_id=auth.uid() or
  exists(select 1 from patient_profiles p where p.id=patient_id and p.user_id=auth.uid()) or
  (select role from profiles where id=auth.uid())='admin'
);
create policy "appointments mod admin_doctor" on appointments for all using ((select role from profiles where id=auth.uid()) in ('admin','doctor'));

create policy "reminders visible" on medicine_reminders for select using (
  exists(select 1 from patient_profiles p where p.id=patient_id and (p.user_id=auth.uid() or p.assigned_doctor_id=auth.uid())) or
  (select role from profiles where id=auth.uid())='admin'
);
create policy "reminders mod admin_doctor" on medicine_reminders for all using ((select role from profiles where id=auth.uid()) in ('admin','doctor'));

-- Sample data (replace UUIDs with your real auth users)
insert into patient_profiles (full_name, age, gender, mobile_number, blood_group, emergency_contact, medical_history, allergies, notes)
values ('Riya Patel', 31, 'Female', '555-1000', 'B+', 'Amit Patel: 555-2000', 'Thyroid', 'Penicillin', 'Weekly monitoring');
