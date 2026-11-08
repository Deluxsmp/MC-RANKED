/* ============================================================
   MCRANKED — SUPABASE LIVE READ  (Option A)
   ------------------------------------------------------------
   Loaded by every page BEFORE app.js. If Supabase is configured in
   supabase-config.js, this fetches the live `players` table and hands
   the rows to app.js, which renders them instead of the static
   players.js file.

   If Supabase is NOT configured (empty URL/key), or the request fails,
   it silently falls back to the static players.js — the site never
   breaks.

   Load order in each HTML page:
     <script src="supabase-config.js"></script>
     <script src="supabase-live.js"></script>
     <script src="players.js"></script>
     <script src="newsandservers.js"></script>
     <script src="data.js"></script>
     <script src="app.js"></script>
   ============================================================ */

(function () {
  "use strict";

  var url = window.SUPABASE_URL;
  var key = window.SUPABASE_ANON_KEY;
  var table = window.SUPABASE_TABLE || "players";

  /* Not configured -> resolve with null so app.js uses players.js. */
  if (!url || !key) {
    window.MCRANKED_LIVE = Promise.resolve(null);
    return;
  }

  function rowToPlayer(row) {
    var data = row && row.data && typeof row.data === "object" ? row.data : {};
    var p = Object.assign({}, data);
    p.id = row.id;
    p.name = row.name;
    p.region = row.region;
    p.totalPoints = Number(row.totalPoints) || 0;
    p.position = Number(row.position) || 0;
    return p;
  }

  window.MCRANKED_LIVE = fetch(
    url.replace(/\/$/, "") + "/rest/v1/" + encodeURIComponent(table) + "?select=*&order=position.asc",
    {
      headers: {
        apikey: key,
        Authorization: "Bearer " + key,
        Accept: "application/json"
      }
    }
  )
    .then(function (res) {
      if (!res.ok) throw new Error("Supabase HTTP " + res.status);
      return res.json();
    })
    .then(function (rows) {
      if (!Array.isArray(rows)) return null;
      return rows.map(rowToPlayer);
    })
    .catch(function (err) {
      console.warn("[MCRANKED] Supabase live read failed, using players.js:", err.message);
      return null;
    });
})();
