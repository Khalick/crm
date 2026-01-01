-- Run this in Supabase SQL editor to create tables and security policies

create extension if not exists "uuid-ossp";

-- Create user_credentials table (encrypted email credentials per user)
create table if not exists user_credentials (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users(id) on delete cascade,
  email_provider text not null check (email_provider in ('gmail', 'sendgrid')),
  send_from text not null,
  app_password text not null, -- For Gmail SMTP
  sendgrid_key text, -- For SendGrid API
  sendgrid_from text, -- SendGrid sender email
  hunter_key text, -- Optional Hunter.io API key
  apollo_key text, -- Optional Apollo.io API key
  created_at timestamp default now(),
  updated_at timestamp default now(),
  unique(user_id)
);

-- Create leads table
create table if not exists leads (
  id uuid default uuid_generate_v4() primary key,
  business_name text not null check (char_length(business_name) <= 200),
  email text unique not null check (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
  location text check (char_length(location) <= 200),
  status text default 'new' check (status in ('new', 'contacted', 'replied', 'closed')),
  notes text check (char_length(notes) <= 1000),
  last_contacted timestamp,
  created_at timestamp default now()
);

-- Create email_events table
create table if not exists email_events (
  id uuid default uuid_generate_v4() primary key,
  lead_email text not null,
  event_type text not null check (event_type in ('sent', 'opened', 'clicked', 'replied', 'bounced', 'unsubscribed')),
  metadata jsonb,
  created_at timestamp default now()
);

-- Create indexes for performance
create index if not exists idx_leads_email on leads(email);
create index if not exists idx_leads_status on leads(status);
create index if not exists idx_leads_created on leads(created_at desc);
create index if not exists idx_events_lead_email on email_events(lead_email);
create index if not exists idx_events_type on email_events(event_type);
create index if not exists idx_events_created on email_events(created_at desc);

-- Enable Row Level Security (RLS)
alter table leads enable row level security;
alter table email_events enable row level security;

-- Create policies for leads table
-- Service role can do everything (used by your API)
create policy "Service role full access to leads"
  on leads
  for all
  to service_role
  using (true)
  with check (true);

-- Anon key can only read (for analytics/leads pages)
create policy "Anon can read leads"
  on leads
  for select
  to anon
  using (true);

-- Enable RLS on user_credentials
alter table user_credentials enable row level security;

-- Create policies for user_credentials table
-- Users can only access their own credentials
create policy "Users can read own credentials"
  on user_credentials
  for select
  to authenticated
  using (auth.uid() = user_id);

create policy "Users can insert own credentials"
  on user_credentials
  for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "Users can update own credentials"
  on user_credentials
  for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Service role can access all credentials (for API operations)
create policy "Service role full access to credentials"
  on user_credentials
  for all
  to service_role
  using (true)
  with check (true);

-- Create policies for email_events table
-- Service role can do everything
create policy "Service role full access to email_events"
  on email_events
  for all
  to service_role
  using (true)
  with check (true);

-- Anon key can only read
create policy "Anon can read email_events"
  on email_events
  for select
  to anon
  using (true);

-- Grant necessary permissions
grant usage on schema public to anon, service_role;
grant all on leads to service_role;
grant select on leads to anon;
grant all on email_events to service_role;
grant select on email_events to anon;
