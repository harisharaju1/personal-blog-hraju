alter table public.posts
  add column visibility text not null default 'public'
    check (visibility in ('public', 'draft'));

create index posts_visibility_idx on public.posts (visibility);
