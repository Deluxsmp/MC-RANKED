MCRANCKED GitHub update bundle

Upload/replace these 3 files in the ROOT of your GitHub repository:
- admin.html
- app.js
- rankings.html

IMPORTANT: Do not replace your already-configured supabase-config.js with a blank template. If the repository does not yet contain supabase-config.js, create it in the repository root with your own Project URL and Publishable Key:

window.SUPABASE_URL = "YOUR_PROJECT_URL";
window.SUPABASE_ANON_KEY = "YOUR_PUBLISHABLE_KEY";

Use only the Supabase Publishable key (or legacy anon public key), never a Secret/service_role key.

Keep existing index.html, styles.css, icons.js, logo.js, site-config.js, and all other files. Do not delete repository contents.

After committing, Vercel should deploy automatically if connected to this GitHub repo. Open /admin.html to test.

Admin login requires a Supabase Auth user whose UID is also registered in public.admins. Public rankings read public.players.

PASSWORD-ONLY LOGIN:
In your existing supabase-config.js, add this line with the email of the existing Supabase admin account:
window.ADMIN_LOGIN_EMAIL = "YOUR_EXISTING_ADMIN_EMAIL";
Do not replace your existing Supabase URL/key. The email is stored in config so the login page asks only for a password.
After login, use "Change Admin Password" inside admin.html to update that account password.
