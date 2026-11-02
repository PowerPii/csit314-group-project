-- Customer #4: keyword search over a project's title, description, style tags and category name.
-- PostgREST cannot OR across a joined table, so this runs in the database; call it with supabase.rpc().
-- `pattern` is an ilike pattern such as '%kitchen%' (the app escapes % and _ in what the user typed).
create function search_projects(pattern text)
returns setof project
language sql
stable
as $$
  select p.*
  from project p
  left join category c on c.id = p.category_id
  where p.title ilike pattern
     or p.description ilike pattern
     or c.name ilike pattern
     or exists (select 1 from unnest(p.style_tags) as tag where tag ilike pattern)
  order by p.created_at desc
$$;
