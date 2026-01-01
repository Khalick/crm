-- Run this in Supabase SQL editor to create tables and security policies

create extension if not exists "uuid-ossp";

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
