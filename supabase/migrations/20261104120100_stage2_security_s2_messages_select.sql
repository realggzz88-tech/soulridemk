-- S2: messages are not readable by anon. Realtime follows RLS.

drop policy if exists "Messages are viewable by everyone" on public.messages;

create policy "Messages are viewable by signed-in users"
on public.messages
for select
to authenticated
using (true);
