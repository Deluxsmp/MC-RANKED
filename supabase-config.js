/* ============================================================
   MCRANKED — SUPABASE CONFIG  (Option A)
   ------------------------------------------------------------
   👉 In this file you only set two values.
      Put them inside the "PASTE HERE" lines below.

   Where to find them (Supabase Dashboard -> Project Settings -> API Keys):
       Project URL          -> url      (e.g. https://abcdefgh.supabase.co)
       sb_publishable_...   -> anonKey  (Publishable key — use this one here)

   ⚠️ Never put an sb_secret_... (Secret / service_role) key here.
      That one belongs only in the bot's .env file.

   Leave both empty and the website reads data from players.js
   (nothing breaks).
   ============================================================ */

window.SUPABASE_CONFIG = {
  /* 👇 PASTE HERE — 1) Project URL */
  url: "",

  /* 👇 PASTE HERE — 2) sb_publishable_... key */
  anonKey: "",

  table: "players"
};

/* ------------------------------------------------------------
   The part below is automatic — no manual editing needed.
   The legacy names (window.SUPABASE_URL / window.SUPABASE_ANON_KEY)
   keep working too, so an older setup will not break.
   ------------------------------------------------------------ */
(function () {
  "use strict";
  var cfg = window.SUPABASE_CONFIG || {};
  window.SUPABASE_URL = cfg.url || window.SUPABASE_URL || "";
  window.SUPABASE_ANON_KEY = cfg.anonKey || window.SUPABASE_ANON_KEY || "";
  window.SUPABASE_TABLE = cfg.table || window.SUPABASE_TABLE || "players";
})();
