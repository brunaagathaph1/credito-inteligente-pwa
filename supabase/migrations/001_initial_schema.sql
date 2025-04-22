
-- Migration: 001_initial_schema.sql
-- Description: Initial database schema setup with core tables and policies
-- Created at: 2024-04-22

-- Create App Roles Enum
create type public.app_role as enum ('admin', 'user');

-- Create Profiles Table
create table public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  email text,
  nome text,
  telefone text,
  role app_role default 'user'::app_role,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create Clients Table
create table public.clientes (
  id uuid default gen_random_uuid() primary key,
  nome text not null,
  cpf text unique,
  telefone text,
  email text,
  endereco text,
  score integer default 500,
  observacoes text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  created_by uuid references auth.users(id) not null
);

-- Create Loans Table
create table public.emprestimos (
  id uuid default gen_random_uuid() primary key,
  cliente_id uuid references public.clientes(id) not null,
  valor_principal decimal(10,2) not null,
  taxa_juros decimal(5,2) not null,
  tipo_juros text not null check (tipo_juros in ('simples', 'composto')),
  data_emprestimo date not null default current_date,
  data_vencimento date not null,
  status text not null check (status in ('pendente', 'em_dia', 'atrasado', 'quitado')) default 'pendente',
  observacoes text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  created_by uuid references auth.users(id) not null
);

-- Create Payments Table
create table public.pagamentos (
  id uuid default gen_random_uuid() primary key,
  emprestimo_id uuid references public.emprestimos(id) not null,
  valor decimal(10,2) not null,
  data_pagamento date not null default current_date,
  tipo text not null check (tipo in ('parcial', 'total')),
  observacoes text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  created_by uuid references auth.users(id) not null
);

-- Enable RLS
alter table public.profiles enable row level security;
alter table public.clientes enable row level security;
alter table public.emprestimos enable row level security;
alter table public.pagamentos enable row level security;

-- Create Profiles Policies
create policy "Users can view their own profile"
  on public.profiles for select
  to authenticated
  using (auth.uid() = id);

create policy "Users can update their own profile"
  on public.profiles for update
  to authenticated
  using (auth.uid() = id);

-- Create Clients Policies
create policy "Authenticated users can view clients they created"
  on public.clientes for select
  to authenticated
  using (created_by = auth.uid());

create policy "Authenticated users can insert clients"
  on public.clientes for insert
  to authenticated
  with check (created_by = auth.uid());

create policy "Authenticated users can update clients they created"
  on public.clientes for update
  to authenticated
  using (created_by = auth.uid());

-- Create Loans Policies
create policy "Authenticated users can view loans they created"
  on public.emprestimos for select
  to authenticated
  using (created_by = auth.uid());

create policy "Authenticated users can insert loans"
  on public.emprestimos for insert
  to authenticated
  with check (created_by = auth.uid());

create policy "Authenticated users can update loans they created"
  on public.emprestimos for update
  to authenticated
  using (created_by = auth.uid());

-- Create Payments Policies
create policy "Authenticated users can view payments they created"
  on public.pagamentos for select
  to authenticated
  using (created_by = auth.uid());

create policy "Authenticated users can insert payments"
  on public.pagamentos for insert
  to authenticated
  with check (created_by = auth.uid());

create policy "Authenticated users can update payments they created"
  on public.pagamentos for update
  to authenticated
  using (created_by = auth.uid());

-- Create Function to Handle User Creation
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, nome, role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'nome', new.email),
    'user'
  );
  return new;
end;
$$ language plpgsql security definer;

-- Create Trigger for New Users
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
