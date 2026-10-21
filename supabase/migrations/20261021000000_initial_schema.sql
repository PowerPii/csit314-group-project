-- Initial schema for the renovation platform.
-- One table per entity class in src/entity. Change the schema only by adding a new migration file.

create table role (
  id           bigint generated always as identity primary key,
  name         text not null unique,
  description  text not null default '',
  is_suspended boolean not null default false,
  created_at   timestamptz not null default now()
);

create table user_account (
  id            bigint generated always as identity primary key,
  name          text not null,
  email         text not null unique,
  phone         text,
  password_hash text not null,
  role_id       bigint not null references role (id),
  is_suspended  boolean not null default false,
  created_at    timestamptz not null default now()
);

-- One company profile per interior designer account.
create table company_profile (
  id             bigint generated always as identity primary key,
  designer_id    bigint not null unique references user_account (id) on delete cascade,
  company_name   text not null,
  description    text not null default '',
  contact_email  text,
  contact_phone  text,
  logo_url       text,
  accreditation  text,
  awards         text,
  property_types text,
  service_areas  text,
  social_links   text,
  created_at     timestamptz not null default now()
);

-- IDP categories, managed by the platform manager.
create table category (
  id           bigint generated always as identity primary key,
  name         text not null unique,
  description  text not null default '',
  is_suspended boolean not null default false,
  created_at   timestamptz not null default now()
);

-- Interior design project (IDP).
create table project (
  id            bigint generated always as identity primary key,
  designer_id   bigint not null references user_account (id) on delete cascade,
  category_id   bigint references category (id),
  title         text not null,
  description   text not null default '',
  status        text not null default 'current' check (status in ('current', 'completed')),
  style_tags    text[] not null default '{}',
  price_min     integer,
  price_max     integer,
  image_urls    text[] not null default '{}',
  completed_at  timestamptz,
  created_at    timestamptz not null default now()
);

-- Customer's favourites list. Each row is one "shortlist" of a project.
create table favourite (
  id          bigint generated always as identity primary key,
  customer_id bigint not null references user_account (id) on delete cascade,
  project_id  bigint not null references project (id) on delete cascade,
  created_at  timestamptz not null default now(),
  unique (customer_id, project_id)
);

-- One row per time a project page is viewed (view counts and PM reports).
create table project_view (
  id         bigint generated always as identity primary key,
  project_id bigint not null references project (id) on delete cascade,
  viewer_id  bigint references user_account (id) on delete set null,
  viewed_at  timestamptz not null default now()
);

create index project_designer_idx on project (designer_id);
create index project_category_idx on project (category_id);
create index favourite_project_idx on favourite (project_id);
create index project_view_project_idx on project_view (project_id, viewed_at);

-- The app only reaches the database from server code with the service-role key,
-- so row level security is on with no policies: the public anon key can read nothing.
alter table role enable row level security;
alter table user_account enable row level security;
alter table company_profile enable row level security;
alter table category enable row level security;
alter table project enable row level security;
alter table favourite enable row level security;
alter table project_view enable row level security;
