-- Platform Manager reports (PM #8-#10). PostgREST has no GROUP BY, so the "top N" and
-- "no views" queries run in the database; call them with supabase.rpc(). Ranges are [from_ts, to_ts).

create function top_viewed_projects(from_ts timestamptz, to_ts timestamptz, max_rows int)
returns table (project_id bigint, title text, count bigint)
language sql stable as $$
  select p.id, p.title, count(*)
  from project_view v join project p on p.id = v.project_id
  where v.viewed_at >= from_ts and v.viewed_at < to_ts
  group by p.id, p.title
  order by count(*) desc, p.id
  limit max_rows
$$;

create function top_saved_projects(from_ts timestamptz, to_ts timestamptz, max_rows int)
returns table (project_id bigint, title text, count bigint)
language sql stable as $$
  select p.id, p.title, count(*)
  from favourite f join project p on p.id = f.project_id
  where f.created_at >= from_ts and f.created_at < to_ts
  group by p.id, p.title
  order by count(*) desc, p.id
  limit max_rows
$$;

create function top_viewed_categories(from_ts timestamptz, to_ts timestamptz, max_rows int)
returns table (category_id bigint, name text, count bigint)
language sql stable as $$
  select c.id, c.name, count(*)
  from project_view v
  join project p on p.id = v.project_id
  join category c on c.id = p.category_id
  where v.viewed_at >= from_ts and v.viewed_at < to_ts
  group by c.id, c.name
  order by count(*) desc, c.id
  limit max_rows
$$;

-- Projects that already existed during the range but were not viewed in it.
create function projects_with_no_views(from_ts timestamptz, to_ts timestamptz)
returns setof project
language sql stable as $$
  select p.*
  from project p
  where p.created_at < to_ts
    and not exists (
      select 1 from project_view v
      where v.project_id = p.id and v.viewed_at >= from_ts and v.viewed_at < to_ts
    )
  order by p.created_at desc
$$;
