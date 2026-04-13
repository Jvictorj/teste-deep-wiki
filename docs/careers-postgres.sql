create table if not exists career_applications (
  id text primary key,
  first_name text not null,
  last_name text not null,
  email text not null,
  phone text not null,
  city text not null,
  state text not null,
  linkedin_url text not null,
  portfolio_url text not null default '',
  interest_area text not null,
  interest_area_label text not null,
  vacancy_id text not null default '',
  vacancy_title text not null default '',
  experience_level text not null,
  experience_level_label text not null,
  message text not null,
  consent_lgpd boolean not null,
  page_url text not null default '',
  submitted_at timestamptz not null,
  resume_file_name text not null,
  resume_mime_type text not null,
  resume_size_bytes integer not null,
  resume_base64_content text not null,
  created_at timestamptz not null default now()
);

create index if not exists career_applications_email_idx
  on career_applications (email);

create index if not exists career_applications_interest_area_idx
  on career_applications (interest_area);

create index if not exists career_applications_created_at_idx
  on career_applications (created_at desc);
