alter table public.posts
  add column visibility text not null default 'public'
    check (visibility in ('public', 'draft'));

create index posts_visibility_idx on public.posts (visibility);

-- Recreate posts_hot so it picks up the new visibility column.
-- PostgreSQL expands SELECT * at view-creation time, so the original view
-- does not include columns added after it was created.
create or replace view public.posts_hot as
  select
    *,
    (
      log(greatest(abs(score), 1))
      + (extract(epoch from created_at) - 1700000000) / 45000.0
    ) as hot_rank
  from public.posts;
