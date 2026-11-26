-- =====================================================================
-- Gradeeting — Fix: the admin can't delete comments
-- =====================================================================
-- Run once in Supabase: SQL Editor → New query → paste → Run. Safe to run twice.
--
-- Two things can stop a comment from being deleted. This fixes both:
--   1. No DELETE policy on `comments`: Supabase then deletes 0 rows WITHOUT
--      an error, so the admin page said "Deleted" while nothing happened.
--   2. Reactions / reports still pointing at the comment without ON DELETE CASCADE:
--      the database refuses the delete ("violates foreign key constraint").
--
-- To see which one you had BEFORE running this, run these two queries:
--   select policyname, cmd, roles from pg_policies where schemaname = 'public' and tablename = 'comments';
--     → no row with cmd = 'DELETE' (or 'ALL') for authenticated = cause 1
--   select conrelid::regclass as from_table, conname, confdeltype from pg_constraint
--   where confrelid = 'public.comments'::regclass and contype = 'f';
--     → confdeltype other than 'c' (cascade) = cause 2
-- =====================================================================

begin;

-- 1. Let the signed-in admin delete comments.
--    (If you ran the volunteer-login update, its "admin_only_for_signed_in"
--     restrictive policy already limits this to accounts in the admins table.)
drop policy if exists "Admin can delete comments" on public.comments;
create policy "Admin can delete comments" on public.comments
  for delete to authenticated
  using (true);

-- 2. Deleting a comment also deletes its reactions and reports.
do $$
declare
  r record;
  def text;
begin
  for r in
    select c.conrelid::regclass as tbl, c.conname, pg_get_constraintdef(c.oid) as condef
    from pg_constraint c
    where c.confrelid = 'public.comments'::regclass
      and c.contype = 'f'
      and c.confdeltype <> 'c'
  loop
    -- Keep the same columns, replace any existing ON DELETE rule with CASCADE
    def := regexp_replace(r.condef, '\s+ON DELETE (NO ACTION|RESTRICT|SET NULL|SET DEFAULT)', '', 'i');
    execute format('alter table %s drop constraint %I', r.tbl, r.conname);
    execute format('alter table %s add constraint %I %s on delete cascade', r.tbl, r.conname, def);
  end loop;
end $$;

commit;
