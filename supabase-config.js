/* ============================================================
   MCRANKED — SUPABASE CONFIG  (Option A)
   ------------------------------------------------------------
   👉 এই ফাইলে শুধু ২টা জায়গায় আপনার key বসাবেন।
      নিচের "PASTE HERE" লেখা লাইনের ভেতরে।

   কোথায় পাবেন (আপনার screenshot-এ যেটা দেখছেন):
     Supabase Dashboard -> Project Settings -> API Keys
       Project URL          -> url      (যেমন https://abcdefgh.supabase.co)
       sb_publishable_...   -> anonKey  (Publishable key — এটাই এখানে বসবে)

   ⚠️ sb_secret_... (Secret / service_role) key এখানে কখনো বসাবেন না।
      ওটা শুধু bot-এর .env ফাইলে যাবে।

   খালি রাখলে website players.js থেকে data দেখাবে (কিছু ভাঙবে না)।
   ============================================================ */

window.SUPABASE_CONFIG = {
  /* 👇 PASTE HERE — ১) Project URL */
  url: "",

  /* 👇 PASTE HERE — ২) sb_publishable_... key */
  anonKey: "",

  table: "players"
};

/* ------------------------------------------------------------
   নিচের অংশ automatic — হাত দিতে হবে না।
   পুরনো নাম (window.SUPABASE_URL / window.SUPABASE_ANON_KEY)
   দিয়েও কাজ করবে, তাই আগের setup ভাঙবে না।
   ------------------------------------------------------------ */
(function () {
  "use strict";
  var cfg = window.SUPABASE_CONFIG || {};
  window.SUPABASE_URL = cfg.url || window.SUPABASE_URL || "";
  window.SUPABASE_ANON_KEY = cfg.anonKey || window.SUPABASE_ANON_KEY || "";
  window.SUPABASE_TABLE = cfg.table || window.SUPABASE_TABLE || "players";
})();
