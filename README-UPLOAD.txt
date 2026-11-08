MCRANCKED — NO PASSWORD + LIVE RANKING

WHAT THIS VERSION DOES
- admin.html opens directly. There is NO password box, NO login, and NO Supabase Auth requirement.
- Add / edit / delete players from the admin page. Each gamemode has MT plus HT1, LT1, HT2, LT2, HT3, LT3, HT4, LT4, HT5 and LT5. New players default to MT for every gamemode. Public ranking cards and player details show MT when a mode has no rank.
- Player data is stored in the shared Supabase public.players table.
- The public ranking page refreshes automatically through Supabase Realtime.

INSTALL
1. In your website GitHub repository, replace admin.html, app.js, and rankings.html with the files in this ZIP.
2. Keep your existing supabase-config.js. Do NOT replace it with a blank/example config. It must keep your existing SUPABASE_URL and SUPABASE_ANON_KEY. No admin email or password setting is needed.
3. Open Supabase Dashboard > SQL Editor. Run supabase-no-password-policies.sql once. This enables anonymous public writes required by the no-login admin page.
4. Deploy / wait for your website host to finish deploying. Open /admin.html to manage players.

IMPORTANT SECURITY NOTE
Because you requested no password and no login, anyone who knows the admin page URL can add, edit, or delete players. The public Supabase anon key is not a secret, so this cannot be made private with frontend code alone.

Do not run the old supabase-setup.sql again just for this update. The new SQL file above changes policies only and does not delete existing players.
