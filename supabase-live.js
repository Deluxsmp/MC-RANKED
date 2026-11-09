/* ============================================================
   MCRANKED — SUPABASE LIVE READ  (Option A)
   ------------------------------------------------------------
   প্রতিটা page-এ app.js-এর আগে load হয়। supabase-config.js-এ key
   দেওয়া থাকলে live `players` table পড়ে app.js-কে দেয়।
   key না থাকলে বা request fail করলে চুপচাপ players.js ব্যবহার করে —
   site কখনো ভাঙবে না।

   Load order (প্রতিটা HTML-এ):
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
    console.info("[MCRANKED] Supabase key নেই — players.js থেকে data দেখানো হচ্ছে।");
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
      console.info("[MCRANKED] Supabase live: " + rows.length + " player পাওয়া গেছে।");
      window.MCRANKED_LIVE_ACTIVE = true;
      return rows.map(rowToPlayer);
    })
    .catch(function (err) {
      console.warn("[MCRANKED] Supabase live read failed, using players.js:", err.message);
      return null;
    });
})();
