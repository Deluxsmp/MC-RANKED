/* ============================================================
   MCRANKED — SUPABASE LIVE READ  (Option A)
   ------------------------------------------------------------
   Loaded on every page before app.js. If a key is set in supabase-config.js,
   it reads the live `players` table and hands the rows to app.js.
   If no key is set, or the request fails, it silently falls back to players.js —
   the site never breaks.

   Load order (on every HTML page):
     <script src="supabase-config.js"></script>
     <script src="supabase-live.js"></script>
     <script src="players.js"></script>
     <script src="newsandservers.js"></script>
     <script src="data.js"></script>
     <script src="app.js"></script>
   ============================================================ */

(function () {
  "use strict";

  var cfg = window.SUPABASE_CONFIG || {};
  var url = cfg.url || window.SUPABASE_URL || "";
  var key = cfg.anonKey || window.SUPABASE_ANON_KEY || "";
  var table = cfg.table || window.SUPABASE_TABLE || "players";

  /* Not configured -> resolve with null so app.js uses players.js. */
  if (!url || !key) {
    console.info("[MCRANKED] No Supabase key — showing data from players.js.");
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
      console.info("[MCRANKED] Supabase live: " + rows.length + " player(s) loaded.");
      window.MCRANKED_LIVE_ACTIVE = true;
      return rows.map(rowToPlayer);
    })
    .catch(function (err) {
      console.warn("[MCRANKED] Supabase live read failed, using players.js:", err.message);
      return null;
    });
})();
