# MCRANCKED — Shared Admin + Live Rankings

The existing website design is retained. Player data now lives in one Supabase database, so multiple admins see the same list and public rankings refresh automatically.

## One-time setup
1. Create a free project at https://supabase.com/.
2. In Project Settings → API, copy the Project URL and anon/public key into `supabase-config.js`. Never put the `service_role` key in website files.
3. Open Supabase → SQL Editor, paste all of `supabase-setup.sql`, and run it once.
4. In Supabase Authentication → Providers, keep Email enabled. Disable public sign-ups.
5. In Authentication → Users, add each trusted admin by email and set a password. All 2–3 admins use the same `admin.html` link but their own login.
6. Upload the whole folder to your website hosting. Keep `supabase-config.js` beside `admin.html` and `rankings.html`.

## Using it
- Admins open `admin.html`, enter their email in the prompt and their password, then add/edit/delete players.
- All admin panels sync when a player changes.
- `rankings.html` reads from the same database and updates live. No more downloading/replacing `players.js`.

## Security note
The anon/public key is intended to be visible in frontend code. The SQL policies allow public read and authenticated-user writes. Only create accounts for trusted admins and disable public sign-ups. Never expose the `service_role` key. For stricter per-admin authorization, use a server-side role/edge function before production.
