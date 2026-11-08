/* ============================================================
   MCRANKED — SHARED APP LOGIC  (v6)
   Renders nav, footer and every page section from data.js
   ------------------------------------------------------------
   v6: Tier 6 removed everywhere (tiers page shows Tier 1-5 only).
       MT / ST tier references removed (only HT1-HT5 + LT1-LT5).
       Kill / Death / Win Rate fields removed everywhere.
       Home page fully redesigned (premium esports look).
   v8: one legacy kit removed. Home stat cards are now LIVE metrics
       derived from the real data (players, kits, tiers, regions,
       countries, tourneys, news, servers). Home page polished.
   v3: SMP / Bow / Shield kits removed. Admin links removed from
       public pages. Players / Tourneys / News / Servers show
       empty states. Stats are derived from real data.
   ============================================================ */
(function () {
  const D = window.MCRANKED || {};
  const SITE = D.SITE || {};
  const MODES = D.MODES || [];
  let PLAYERS = D.PLAYERS || [];
  const ICONS = D.ICONS || {};
  const REGIONS = D.REGIONS || {};
  const TIER_DEFS = D.TIER_DEFS || [];

  /* ---------- helpers ---------- */
  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" }[c]));
  const modeById = (id) => MODES.find((m) => m.id === id) || { id, n: id, i: "•" };
  const result = (p, id) => (p.results ? p.results[id] : null);
  const isTested = (r) => !!r && String(r.tier || "").trim() !== "";
  const tierNum = (t) => { const m = String(t || "").match(/[1-5]$/); return m ? Number(m[0]) : null; };
  const tierClass = (t) => "t-" + String(t || "").toLowerCase().replace(/[^a-z0-9]/g, "");
  const tierDef = (code) => TIER_DEFS.find((t) => t.code === code) || { color: "#8b98ab", bg: "#232c39", label: code };
  const overallTier = (p) => { const t = TIER_DEFS.find((d) => (p.totalPoints || 0) >= d.min); return t ? t.code : ""; };
  const skinUrl = (p) => p.skinUrl || `https://mc-heads.net/body/${encodeURIComponent(p.name)}/100.png`;
  const skinFallback = (img) => { if (img.dataset.failed === "1") { img.src = "https://mc-heads.net/body/Steve/100.png"; return; } img.dataset.failed = "1"; img.src = "https://mc-heads.net/body/Steve/100.png"; };
  const titleFor = (pos) => (pos === 1 ? "Combat Grandmaster" : pos <= 3 ? "Combat Master" : "Combat Ace");
  const emojiFor = (pos) => (pos === 1 ? "👑" : pos <= 3 ? "🏅" : "⚔️");
  /* Badge / rank is auto-assigned from the live leaderboard position:
     #1 -> Combat Grandmaster, #2 & #3 -> Combat Master, everyone else -> Combat Ace */
  const rankBadge = (pos) => {
    const list = D.RANK_BADGES || [];
    const key = pos === 1 ? "grandmaster" : pos <= 3 ? "master" : "ace";
    return list.find((b) => b.key === key) || { name: titleFor(pos), emoji: emojiFor(pos), color: "#8b7cff", bg: "#2a3244" };
  };
  const badgeChip = (pos, cls) => {
    const b = rankBadge(pos);
    return `<span class="rank-badge ${cls || ""}" style="color:${b.color};border-color:${b.color}55;background:${b.bg}">${b.emoji} ${esc(b.name)}</span>`;
  };
  const regionName = (code) => (REGIONS[code] ? REGIONS[code].name : code);
  const regionFlag = (code) => (REGIONS[code] ? REGIONS[code].flag : "🌐");
  const iconHTML = (m, cls) => {
    const url = ICONS[m.id] || m.icon || "";
    if (!url) return `<span class="icon-fallback">${esc(m.i || "•")}</span>`;
    return `<img class="${cls || "mode-icon-img"}" src="${esc(url)}" alt="${esc(m.n)}" loading="lazy" onerror="this.style.display='none';this.nextElementSibling.style.display='grid'"><span class="icon-fallback" style="display:none">${esc(m.i || "•")}</span>`;
  };
  const badgeColor = (b) => (D.BADGE_CATALOG && D.BADGE_CATALOG[b]) || "#8b7cff";

  /* ---------- empty state ---------- */
  function emptyState(opts) {
    const o = opts || {};
    return `<div class="empty-state">
      <div class="empty-icon">${o.icon || "📭"}</div>
      <h3>${esc(o.title || "Nothing here yet")}</h3>
      <p>${esc(o.text || "")}</p>
      ${o.action ? `<a class="btn btn-primary btn-sm" href="${esc(o.action.href)}">${esc(o.action.label)}</a>` : ""}
    </div>`;
  }

  /* ---------- derived stats (real data only) ---------- */
  function derivedStats() {
    const kits = MODES.filter((m) => m.id !== "overall");
    const countries = new Set(PLAYERS.map((p) => p.country).filter(Boolean)).size;
    return {
      players: PLAYERS.length,
      kits: kits.length,
      tiers: TIER_DEFS.length,
      regions: Object.keys(REGIONS).length,
      countries,
      tourneys: (D.TOURNEYS || []).length,
      news: (D.NEWS || []).length,
      servers: (D.SERVER_REGIONS || []).length
    };
  }

  /* ---------- nav + footer ---------- */
  const NAV = [
    { href: "index.html", label: "Home" },
    { href: "tiers.html", label: "Tiers" },
    { href: "players.html", label: "Players" },
    { href: "kits.html", label: "Kits" },
    { href: "tourneys.html", label: "Tourneys" },
    { href: "news.html", label: "News" },
    { href: "servers.html", label: "Servers" }
  ];
  function renderNav() {
    const el = document.getElementById("site-nav");
    if (!el) return;
    const here = (location.pathname.split("/").pop() || "index.html");
    el.innerHTML = `
      <div class="wrap">
        <a class="logo" href="index.html"><span class="mark">⚔</span><span class="logo-text">${esc(SITE.siteName || "MCRANKED")}</span></a>
        <nav class="navlinks" id="navlinks">
          ${NAV.map((n) => `<a href="${n.href}" class="${n.href === here ? "active" : ""}">${n.label}</a>`).join("")}
        </nav>
        <div style="display:flex;gap:10px;align-items:center">
          <a class="nav-cta" href="${esc(SITE.discordUrl || "#")}" target="_blank" rel="noopener">Join Discord</a>
          <button class="nav-toggle" id="navToggle" aria-label="Menu">☰</button>
        </div>
      </div>`;
    const t = document.getElementById("navToggle");
    if (t) t.onclick = () => document.getElementById("navlinks").classList.toggle("open");
  }
  function renderFooter() {
    const el = document.getElementById("site-footer");
    if (!el) return;
    el.innerHTML = `
      <div class="wrap">
        <div class="footer-grid">
          <div class="footer-about">
            <a class="logo" href="index.html"><span class="mark">⚔</span><span class="logo-text">${esc(SITE.siteName || "MCRANKED")}</span></a>
            <p>${esc(SITE.tagline || "")} — get tested by skilled testers, earn your official tier, and climb the leaderboard.</p>
          </div>
          <div><h5>Compete</h5><ul>
            <li><a href="tiers.html">Tier List</a></li>
            <li><a href="players.html">Players</a></li>
            <li><a href="kits.html">Kits</a></li>
            <li><a href="tourneys.html">Tourneys</a></li>
          </ul></div>
          <div><h5>Community</h5><ul>
            <li><a href="${esc(SITE.discordUrl || "#")}" target="_blank" rel="noopener">Discord</a></li>
            <li><a href="${esc(SITE.youtube || "#")}" target="_blank" rel="noopener">YouTube</a></li>
            <li><a href="${esc(SITE.twitch || "#")}" target="_blank" rel="noopener">Twitch</a></li>
            <li><a href="${esc(SITE.twitter || "#")}" target="_blank" rel="noopener">Twitter / X</a></li>
          </ul></div>
          <div><h5>Info</h5><ul>
            <li><a href="news.html">News</a></li>
            <li><a href="servers.html">Servers</a></li>
            <li><a href="${esc(SITE.storeUrl || "#")}">Store</a></li>
          </ul></div>
        </div>
        <div class="footer-bottom">
          <span>© ${new Date().getFullYear()} ${esc(SITE.siteName || "MCRANKED")} · Minecraft PvP Rankings</span>
          <span>Server IP: <b>${esc(SITE.serverIp || "")}</b></span>
        </div>
      </div>`;
  }

  /* ---------- shared: player modal ---------- */
  function ensureModal() {
    let m = document.getElementById("playerModal");
    if (m) return m;
    m = document.createElement("div");
    m.id = "playerModal";
    m.className = "modal hidden";
    m.innerHTML = `<div class="modal-card"><button class="modal-x" id="pmClose">×</button><div id="pmBody"></div></div>`;
    document.body.appendChild(m);
    m.addEventListener("click", (e) => { if (e.target === m) m.classList.add("hidden"); });
    m.querySelector("#pmClose").onclick = () => m.classList.add("hidden");
    return m;
  }
  function openPlayer(p) {
    const m = ensureModal();
    const body = m.querySelector("#pmBody");
    const tested = MODES.filter((x) => x.id !== "overall");
    const tiers = tested.map((mo) => {
      const r = result(p, mo.id);
      if (!isTested(r)) return `<div class="modal-tier"><span class="mt-name">${esc(mo.n)}</span><span class="mt-empty">—</span></div>`;
      return `<div class="modal-tier"><span class="mt-name">${esc(mo.n)}</span>${iconHTML(mo, "mini-icon-img")}<span class="tier-label ${tierClass(r.tier)}">${esc(r.tier)}</span></div>`;
    }).join("");
    body.innerHTML = `
      <div class="modal-top">
        <img class="modal-avatar" src="${esc(skinUrl(p))}" alt="${esc(p.name)}" onerror="skinFallback(this)">
        <h2>${esc(p.name)}</h2>
        <div class="modal-title-badge">${badgeChip(p.position || 99)}</div>
        <div class="modal-region">${regionFlag(p.region)} ${esc(regionName(p.region))}${p.country ? " · " + esc(p.country) : ""}</div>
      </div>
      <div class="modal-section"><h4>Overall Standing</h4>
        <div class="modal-stats">
          <div class="modal-stat"><b>#${p.position}</b><span>Rank</span></div>
          <div class="modal-stat"><b>${p.totalPoints}</b><span>Points</span></div>
          <div class="modal-stat"><b>${esc(p.team || "—")}</b><span>Team</span></div>
          <div class="modal-stat"><b>${p.tester ? "Yes" : "No"}</b><span>Tester</span></div>
        </div>
      </div>
      <div class="modal-section"><h4>Tiers (${tested.length} kits)</h4><div class="modal-tiers">${tiers}</div></div>
      ${p.bio ? `<div class="modal-section"><h4>About</h4><p class="modal-bio">${esc(p.bio)}</p></div>` : ""}
      <div class="modal-section"><h4>Profile</h4>
        <div class="modal-socials">
          <a href="https://namemc.com/profile/${encodeURIComponent(p.name)}" target="_blank" rel="noopener">NameMC ↗</a>
          ${p.uuid ? `<a href="#" onclick="return false">UUID: ${esc(String(p.uuid).slice(0, 8))}…</a>` : ""}
        </div>
      </div>`;
    m.classList.remove("hidden");
  }
  window.MCRANKED_openPlayer = openPlayer;
  window.skinFallback = skinFallback;

  /* ---------- HOME ---------- */
  function renderHome() {
    const root = document.getElementById("home-root");
    if (!root) return;
    const sorted = [...PLAYERS].sort((a, b) => a.position - b.position);
    const top = sorted.slice(0, 3);
    const rest = sorted.slice(3, 8);
    const st = derivedStats();
    const statCards = [
      ["players", "Total Players", "\ud83d\udc65"], ["kits", "Kits & Modes", "\ud83c\udfae"],
      ["tiers", "Tiers", "\ud83c\udfc6"], ["regions", "Regions", "\ud83c\udf0d"],
      ["countries", "Countries", "\ud83c\udff3\ufe0f"], ["tourneys", "Tourneys", "\ud83c\udfc5"],
      ["news", "News Posts", "\ud83d\udcf0"], ["servers", "Servers", "\ud83c\udf10"]
    ].map(([k, l, ic]) => `<div class="home-stat"><span class="hs-icon">${ic}</span><div class="hs-value">${(st[k] ?? 0).toLocaleString()}</div><div class="hs-label">${l}</div></div>`).join("");

    const podium = top.length ? top.map((p, i) => {
      const cls = ["first", "second", "third"][i];
      return `<a class="podium-card ${cls}" href="#" data-player="${p.id}">
        <span class="podium-place">${p.position}</span>
        <img class="podium-avatar" src="${esc(skinUrl(p))}" alt="${esc(p.name)}" onerror="skinFallback(this)">
        <div class="podium-name">${esc(p.name)}</div>
        ${badgeChip(p.position)}
        <span class="podium-points">${p.totalPoints} Points</span>
      </a>`;
    }).join("") : "";

    const rows = rest.map((p) => {
      const chips = ["vanilla", "uhc", "pot", "nethpot", "sword", "axe"].map((id) => {
        const r = result(p, id); const mo = modeById(id);
        if (!isTested(r)) return "";
        return `<span class="kit-chip">${iconHTML(mo, "mini-icon-img")}<span class="tier-label ${tierClass(r.tier)}">${esc(r.tier)}</span></span>`;
      }).join("");
      return `<div class="board-row rank-${p.position}" data-player="${p.id}">
        <div class="pos">${p.position}</div>
        <div class="p-cell"><img class="p-avatar" src="${esc(skinUrl(p))}" alt="${esc(p.name)}" onerror="skinFallback(this)">
          <div><div class="p-name">${esc(p.name)}</div><div class="p-meta">${badgeChip(p.position, "rank-badge-sm")}</div></div></div>
        <div class="region-badge">${regionFlag(p.region)} ${esc(p.region)}</div>
        <div class="kit-chips">${chips}</div>
        <div class="points-cell">${p.totalPoints}<small>points</small></div>
      </div>`;
    }).join("");

    const kitCards = MODES.filter((m) => m.id !== "overall").map((m) => {
      const count = PLAYERS.filter((p) => isTested(result(p, m.id))).length;
      return `<a class="home-kit" href="kits.html">
        <span class="home-kit-icon">${iconHTML(m, "home-kit-img")}</span>
        <span class="home-kit-name">${esc(m.n)}</span>
        <span class="home-kit-count">${count} ranked</span>
      </a>`;
    }).join("");

    const leaderboardBlock = `<div class="home-podium">${podium}</div>
         <div class="home-board">
           <div class="board-head"><span>#</span><span>Player</span><span>Region</span><span>Contributing Kits</span><span style="text-align:right">Points</span></div>
           ${rows}
         </div>`;

    const news = (D.NEWS || []).slice(0, 2).map((n) => `
      <article class="news-card">
        ${n.image ? `<div class="news-media"><img src="${esc(n.image)}" alt="${esc(n.title)}" loading="lazy" onerror="this.parentElement.style.display='none'"></div>` : ""}
        <div class="news-body">
          ${(n.tags && n.tags.length) ? `<div class="news-tags">${n.tags.map((t) => `<span class="news-tag">${esc(t)}</span>`).join("")}</div>` : ""}
          <h3>${esc(n.title)}</h3><p>${esc(n.desc)}</p>
          <div class="news-date">${esc(n.date)}</div>
        </div>
      </article>`).join("");

    const newsBlock = news || emptyState({
      icon: "📰",
      title: "No news yet",
      text: "Announcements, patch notes and season updates will show up here once published."
    });

    root.innerHTML = `
      <section class="home-hero">
        <div class="hero-bg" style="background-image:url('images/hero-bg.png')"></div>
        <div class="wrap">
          <span class="pill"><i></i> ${esc(SITE.siteName)} · LIVE</span>
          <h1>The <span class="grad">#1 Cracked</span><br>&amp; Premium Tierlist</h1>
          <p class="lead">${esc(SITE.tagline)}. Get tested by skilled testers, earn your official tier, and compete for a place on the global leaderboard.</p>
          <div class="countdown" id="countdown">
            <div class="cd-unit"><span class="cd-value" data-cd="days">00</span><span class="cd-label">Days</span></div>
            <div class="cd-unit"><span class="cd-value" data-cd="hours">00</span><span class="cd-label">Hours</span></div>
            <div class="cd-unit"><span class="cd-value" data-cd="minutes">00</span><span class="cd-label">Minutes</span></div>
            <div class="cd-unit"><span class="cd-value" data-cd="seconds">00</span><span class="cd-label">Seconds</span></div>
          </div>
          <p class="cd-date">${esc(SITE.nextRevealLabel || "")}</p>
          <div class="hero-actions">
            <a class="btn btn-primary" href="tiers.html">⚡ View Rankings</a>
            <a class="btn btn-ghost" href="${esc(SITE.discordUrl || "#")}" target="_blank" rel="noopener">Join Discord</a>
          </div>
        </div>
      </section>

      <section class="section home-stats-section"><div class="wrap">
        <div class="section-head">
          <div><p class="eyebrow">Live Network</p><h2 class="section-title">MCRANKED at a glance</h2>
            <p class="section-sub">Live counts, calculated automatically from the site data \u2014 add or remove anything in the admin panels and these update themselves.</p></div>
        </div>
        <div class="home-stats">${statCards}</div>
      </div></section>

      <div class="wrap"><div class="divider"></div></div>

      <section class="section"><div class="wrap">
        <div class="section-head">
          <div><p class="eyebrow">Leaderboard</p><h2 class="section-title">Top Players</h2>
            <p class="section-sub">The best ${esc(SITE.siteName)} players, ranked by total points across every kit.</p></div>
          <a class="btn btn-ghost btn-sm" href="tiers.html">Full Leaderboard →</a>
        </div>
        ${leaderboardBlock}
      </div></section>

      <div class="wrap"><div class="divider"></div></div>

      <section class="section"><div class="wrap">
        <div class="section-head">
          <div><p class="eyebrow">Gamemodes</p><h2 class="section-title">Kits &amp; Modes</h2>
            <p class="section-sub">Every kit we rank players in. Counts update live as players are added.</p></div>
          <a class="btn btn-ghost btn-sm" href="kits.html">All Kits \u2192</a>
        </div>
        <div class="home-kits">${kitCards}</div>
      </div></section>

      <div class="wrap"><div class="divider"></div></div>

      <section class="section"><div class="wrap">
        <div class="home-features">
          <a class="home-feature" href="tourneys.html">
            <img class="feature-image" src="images/trophy.png" alt="" loading="lazy">
            <span class="feature-content"><i class="feature-icon">🏆</i><span class="feature-title">Tourneys</span><span class="feature-subtitle">Compete For Cash Prizes</span></span>
          </a>
          <a class="home-feature" href="tiers.html">
            <img class="feature-image" src="images/crown.png" alt="" loading="lazy">
            <span class="feature-content"><i class="feature-icon">👑</i><span class="feature-title">Leaderboard</span><span class="feature-subtitle">Check Your Ranking</span></span>
          </a>
        </div>
      </div></section>

      <div class="wrap"><div class="divider"></div></div>

      <section class="section"><div class="wrap">
        <div class="home-cta">
          <h2>Ready to prove you're <span class="grad">cracked</span>?</h2>
          <p>Get tested by our verified testers, earn your official tier across every kit, and climb the global leaderboard. Your rank is waiting.</p>
          <div class="hero-actions">
            <a class="btn btn-primary" href="tiers.html">⚡ View Rankings</a>
            <a class="btn btn-ghost" href="${esc(SITE.discordUrl || "#")}" target="_blank" rel="noopener">Join Discord</a>
          </div>
        </div>
      </div></section>

      <div class="wrap"><div class="divider"></div></div>

      <section class="section"><div class="wrap">
        <div class="section-head"><div><p class="eyebrow">Updates</p><h2 class="section-title">Recent News</h2></div>
          <a class="btn btn-ghost btn-sm" href="news.html">All News →</a></div>
        <div class="news-grid">${newsBlock}</div>
      </div></section>`;

    startCountdown();
    root.querySelectorAll("[data-player]").forEach((el) => {
      el.addEventListener("click", (e) => {
        e.preventDefault();
        const p = PLAYERS.find((x) => String(x.id) === el.dataset.player);
        if (p) openPlayer(p);
      });
    });
  }

  function startCountdown() {
    const target = new Date(SITE.nextReveal || Date.now() + 86400000).getTime();
    const tick = () => {
      const diff = Math.max(0, target - Date.now());
      const d = Math.floor(diff / 86400000), h = Math.floor((diff % 86400000) / 3600000),
        m = Math.floor((diff % 3600000) / 60000), s = Math.floor((diff % 60000) / 1000);
      const set = (k, v) => { const el = document.querySelector(`[data-cd="${k}"]`); if (el) el.textContent = String(v).padStart(2, "0"); };
      set("days", d); set("hours", h); set("minutes", m); set("seconds", s);
    };
    tick(); setInterval(tick, 1000);
  }

  /* ---------- TIERS PAGE ---------- */
  let tiersState = { mode: "overall", q: "", region: "all", country: "all", sort: "points" };
  function renderTiers() {
    const root = document.getElementById("tiers-root");
    if (!root) return;
    const modeTabs = MODES.map((m) => `<button class="mode ${m.id === tiersState.mode ? "active" : ""}" data-mode="${m.id}"><span class="ico">${iconHTML(m)}</span>${esc(m.n)}</button>`).join("");
    const countries = [...new Set(PLAYERS.map((p) => p.country).filter(Boolean))].sort();
    const countryOpts = `<option value="all">All countries</option>` + countries.map((c) => `<option value="${esc(c)}">${esc(c)}</option>`).join("");
    const regionOpts = `<option value="all">All regions</option>` + Object.values(REGIONS).map((r) => `<option value="${r.code}">${r.name}</option>`).join("");

    root.innerHTML = `
      <div class="page-head"><div class="wrap">
        <div class="crumbs"><a href="index.html">Home</a> / Tiers</div>
        <h1>Player Tiers &amp; Rankings</h1>
        <p>These tiers are BETA and reset at the end of each season. Filter by kit, region and country, then click any player for the full profile.</p>
      </div></div>
      <div class="wrap">
        <div class="modes" id="modeTabs">${modeTabs}</div>
        <div class="toolbar">
          <div class="toolbar-left">
            <input class="input search" id="tierSearch" placeholder="Search player..." type="search">
            <select class="select" id="regionFilter">${regionOpts}</select>
            <select class="select" id="countryFilter">${countryOpts}</select>
            <select class="select" id="sortFilter">
              <option value="points">Sort: Points</option>
              <option value="name">Sort: Name</option>
            </select>
          </div>
          <div class="toolbar-left">
            <span class="badge" id="tierCount">0 players</span>
            <button class="btn btn-ghost btn-sm" id="distBtn">Show distribution</button>
          </div>
        </div>
        <div id="tierBoard"></div>
        <div id="distPanel" class="hidden" style="margin-top:22px"></div>
      </div>`;

    document.getElementById("modeTabs").addEventListener("click", (e) => {
      const b = e.target.closest("[data-mode]"); if (!b) return;
      tiersState.mode = b.dataset.mode;
      document.querySelectorAll("#modeTabs .mode").forEach((x) => x.classList.toggle("active", x === b));
      drawTiers();
    });
    document.getElementById("tierSearch").oninput = (e) => { tiersState.q = e.target.value.toLowerCase().trim(); drawTiers(); };
    document.getElementById("regionFilter").onchange = (e) => { tiersState.region = e.target.value; drawTiers(); };
    document.getElementById("countryFilter").onchange = (e) => { tiersState.country = e.target.value; drawTiers(); };
    document.getElementById("sortFilter").onchange = (e) => { tiersState.sort = e.target.value; drawTiers(); };
    document.getElementById("distBtn").onclick = () => {
      const p = document.getElementById("distPanel");
      p.classList.toggle("hidden");
      if (!p.classList.contains("hidden")) drawDistribution();
    };
    drawTiers();
  }

  function filteredPlayers() {
    let arr = PLAYERS.filter((p) => p.name.toLowerCase().includes(tiersState.q));
    if (tiersState.region !== "all") arr = arr.filter((p) => p.region === tiersState.region);
    if (tiersState.country !== "all") arr = arr.filter((p) => p.country === tiersState.country);
    const s = tiersState.sort;
    arr.sort((a, b) => {
      if (s === "name") return a.name.localeCompare(b.name);
      return (b.totalPoints || 0) - (a.totalPoints || 0);
    });
    return arr;
  }

  function drawTiers() {
    const board = document.getElementById("tierBoard");
    const count = document.getElementById("tierCount");
    const arr = filteredPlayers();
    count.textContent = arr.length + " player" + (arr.length === 1 ? "" : "s");

    if (tiersState.mode === "overall") {
      const rows = arr.map((p, i) => {
        const pos = i + 1;
        const chips = MODES.filter((m) => m.id !== "overall").map((mo) => {
          const r = result(p, mo.id);
          if (!isTested(r)) return "";
          return `<span class="kit-chip">${iconHTML(mo, "mini-icon-img")}<span class="tier-label ${tierClass(r.tier)}">${esc(r.tier)}</span></span>`;
        }).join("");
        return `<div class="board-row rank-${pos}" data-player="${p.id}">
          <div class="pos">${pos}</div>
          <div class="p-cell"><img class="p-avatar" src="${esc(skinUrl(p))}" alt="${esc(p.name)}" onerror="skinFallback(this)">
            <div><div class="p-name">${esc(p.name)}</div><div class="p-meta">${badgeChip(pos, "rank-badge-sm")} ${esc(p.country || "")}</div></div></div>
          <div class="region-badge">${regionFlag(p.region)} ${esc(p.region)}</div>
          <div class="kit-chips">${chips}</div>
          <div class="points-cell">${p.totalPoints}<small>points</small></div>
        </div>`;
      }).join("");
      board.innerHTML = `<div class="board">
        <div class="board-head"><span>#</span><span>Player</span><span>Country</span><span>Contributing Kits</span><span style="text-align:right">Points</span></div>
        ${rows}</div>`;
    } else {
      const buckets = { 1: [], 2: [], 3: [], 4: [], 5: [] };
      arr.forEach((p) => { const r = result(p, tiersState.mode); const n = tierNum(r && r.tier); if (n) buckets[n].push(p); });
      const mo = modeById(tiersState.mode);
      board.innerHTML = `<div class="tier-board">${[1, 2, 3, 4, 5].map((n) => `
        <div class="tier-col t${n}">
          <div class="tier-col-head">${iconHTML(mo, "mini-icon-img")} Tier ${n}</div>
          <div class="tier-col-list">${buckets[n].map((p) => {
            const r = result(p, tiersState.mode);
            return `<div class="tier-player" data-player="${p.id}"><img src="${esc(skinUrl(p))}" alt="${esc(p.name)}" onerror="skinFallback(this)"><span class="name">${esc(p.name)}</span><span class="pts">${esc(r.tier)}</span></div>`;
          }).join("")}</div>
        </div>`).join("")}</div>`;
    }
    board.querySelectorAll("[data-player]").forEach((el) => {
      el.addEventListener("click", () => { const p = PLAYERS.find((x) => String(x.id) === el.dataset.player); if (p) openPlayer(p); });
    });
  }

  function drawDistribution() {
    const panel = document.getElementById("distPanel");
    const counts = {};
    TIER_DEFS.forEach((t) => (counts[t.code] = 0));
    PLAYERS.forEach((p) => {
      if (tiersState.mode === "overall") {
        const t = TIER_DEFS.find((d) => p.totalPoints >= d.min);
        if (t) counts[t.code]++;
      } else {
        const r = result(p, tiersState.mode);
        if (isTested(r) && counts[r.tier] != null) counts[r.tier]++;
      }
    });
    const max = Math.max(1, ...Object.values(counts));
    panel.innerHTML = `<div class="card"><h3>Tier Distribution</h3>
      <div style="display:flex;flex-direction:column;gap:8px;margin-top:14px">
      ${TIER_DEFS.map((t) => `<div style="display:flex;align-items:center;gap:12px">
        <span class="tier-label ${tierClass(t.code)}" style="min-width:52px;text-align:center">${t.code}</span>
        <div class="progress" style="flex:1"><span style="width:${(counts[t.code] / max) * 100}%"></span></div>
        <span style="min-width:34px;text-align:right;font-weight:800;font-size:12px">${counts[t.code]}</span>
      </div>`).join("")}</div></div>`;
  }

  /* ---------- PLAYERS PAGE ---------- */
  function playerCard(p) {
    return `<div class="card" data-player="${p.id}" style="cursor:pointer">
      <div style="display:flex;gap:14px;align-items:center">
        <img src="${esc(skinUrl(p))}" alt="${esc(p.name)}" onerror="skinFallback(this)" style="width:64px;height:64px;object-fit:contain;object-position:center top">
        <div style="min-width:0">
          <div class="p-name">${esc(p.name)}</div>
          <div class="p-meta">${regionFlag(p.region)} ${esc(p.country || regionName(p.region))} · #${p.position}</div>
          <div style="margin-top:7px">${badgeChip(p.position || 99, "rank-badge-sm")}</div>
        </div>
      </div>
      <div class="modal-stats" style="margin-top:14px;grid-template-columns:repeat(3,1fr)">
        <div class="modal-stat"><b>${p.totalPoints}</b><span>Points</span></div>
        <div class="modal-stat"><b>${esc(p.team || "—")}</b><span>Team</span></div>
        <div class="modal-stat"><b>${esc(p.favoriteKit ? modeById(p.favoriteKit).n : "—")}</b><span>Fav Kit</span></div>
      </div>
    </div>`;
  }

  function renderPlayers() {
    const root = document.getElementById("players-root");
    if (!root) return;
    const grid = [...PLAYERS].sort((a, b) => a.position - b.position).map(playerCard).join("");
    root.innerHTML = `
      <div class="page-head"><div class="wrap">
        <div class="crumbs"><a href="index.html">Home</a> / Players</div>
        <h1>Player Directory</h1>
        <p>Browse every ranked player. Click a card to open the full profile with career stats, tiers and badges.</p>
      </div></div>
      <div class="wrap">
        <div class="toolbar"><div class="toolbar-left">
          <input class="input search" id="pSearch" placeholder="Search player..." type="search">
          <select class="select" id="pRegion"><option value="all">All regions</option>${Object.values(REGIONS).map((r) => `<option value="${r.code}">${r.name}</option>`).join("")}</select>
        </div><span class="badge" id="pCount">${PLAYERS.length} players</span></div>
        <div class="grid-3" id="pGrid">${grid}</div>
      </div>`;
    const apply = () => {
      const q = document.getElementById("pSearch").value.toLowerCase().trim();
      const rg = document.getElementById("pRegion").value;
      const list = PLAYERS.filter((p) => p.name.toLowerCase().includes(q) && (rg === "all" || p.region === rg)).sort((a, b) => a.position - b.position);
      document.getElementById("pCount").textContent = list.length + " players";
      document.getElementById("pGrid").innerHTML = list.map(playerCard).join("");
      document.querySelectorAll("#pGrid [data-player]").forEach((el) => el.addEventListener("click", () => { const p = PLAYERS.find((x) => String(x.id) === el.dataset.player); if (p) openPlayer(p); }));
    };
    document.getElementById("pSearch").oninput = apply;
    document.getElementById("pRegion").onchange = apply;
    apply();
  }

  /* ---------- KITS PAGE ---------- */
  function renderKits() {
    const root = document.getElementById("kits-root");
    if (!root) return;
    const kitModes = MODES.filter((m) => m.id !== "overall");
    const cards = kitModes.map((m) => {
      const tested = PLAYERS.filter((p) => isTested(result(p, m.id)));
      const top = tested.sort((a, b) => (result(b, m.id).points || 0) - (result(a, m.id).points || 0))[0];
      return `<div class="card kit-card">
        <div class="kit-icon">${iconHTML(m, "mini-icon-img")}</div>
        <h3>${esc(m.n)}</h3>
        <p>${tested.length} players ranked</p>
        ${top ? `<div style="margin-top:12px"><span class="badge gold">#1 ${esc(top.name)}</span></div>` : ""}
        <div style="margin-top:14px"><a class="btn btn-ghost btn-sm" href="tiers.html">View tiers →</a></div>
      </div>`;
    }).join("");
    root.innerHTML = `
      <div class="page-head"><div class="wrap">
        <div class="crumbs"><a href="index.html">Home</a> / Kits</div>
        <h1>Kits &amp; Gamemodes</h1>
        <p>Every kit tracked on ${esc(SITE.siteName)}. ${kitModes.length} kits across core and new gamemodes.</p>
      </div></div>
      <div class="wrap"><div class="grid-4">${cards}</div></div>`;
  }

  /* ---------- TOURNEYS PAGE ---------- */
  function renderTourneys() {
    const root = document.getElementById("tourneys-root");
    if (!root) return;
    const statusBadge = (s) => s === "live" ? `<span class="badge red">● LIVE</span>` : s === "open" ? `<span class="badge green">Open</span>` : s === "upcoming" ? `<span class="badge">Upcoming</span>` : `<span class="badge">Finished</span>`;
    const list = D.TOURNEYS || [];
    const cards = list.map((t) => {
      const mo = modeById(t.kit);
      const pct = Math.round((t.filled / t.slots) * 100);
      return `<div class="card tourney-card">
        <div class="tourney-top">
          <div style="display:flex;gap:12px;align-items:center">
            <div class="kit-icon" style="width:40px;height:40px;margin:0">${iconHTML(mo, "mini-icon-img")}</div>
            <div><h3 style="margin:0">${esc(t.name)}</h3><p style="margin:2px 0 0">${esc(mo.n)} · ${esc(t.date)}</p></div>
          </div>
          ${statusBadge(t.status)}
        </div>
        <div style="display:flex;justify-content:space-between;align-items:center">
          <span class="tourney-prize">${esc(t.prize)}</span>
          <span style="font-size:12px;color:var(--muted)">${t.filled}/${t.slots} slots</span>
        </div>
        <div class="progress"><span style="width:${pct}%"></span></div>
        <div style="display:flex;justify-content:space-between;font-size:12px;color:var(--muted)">
          <span>Winner: <b style="color:#fff">${esc(t.winner)}</b></span>
          <span>${pct}% full</span>
        </div>
      </div>`;
    }).join("");
    root.innerHTML = `
      <div class="page-head"><div class="wrap">
        <div class="crumbs"><a href="index.html">Home</a> / Tourneys</div>
        <h1>Tournaments</h1>
        <p>Compete for cash prizes in weekly and monthly ${esc(SITE.siteName)} tournaments across every kit.</p>
      </div></div>
      <div class="wrap">${list.length ? `<div class="grid-3">${cards}</div>` : emptyState({
        icon: "🏆",
        title: "No tournaments running",
        text: "There are no live or scheduled tournaments right now. New events will be announced here and on Discord.",
        action: { href: SITE.discordUrl || "#", label: "Join Discord for updates" }
      })}</div>`;
  }

  /* ---------- NEWS PAGE ---------- */
  function renderNews() {
    const root = document.getElementById("news-root");
    if (!root) return;
    const list = D.NEWS || [];
    const cards = list.map((n) => `
      <article class="news-card">
        ${n.image ? `<div class="news-media"><img src="${esc(n.image)}" alt="${esc(n.title)}" loading="lazy" onerror="this.parentElement.style.display='none'"></div>` : ""}
        <div class="news-body">
          ${(n.tags && n.tags.length) ? `<div class="news-tags">${n.tags.map((t) => `<span class="news-tag">${esc(t)}</span>`).join("")}</div>` : ""}
          <h3>${esc(n.title)}</h3><p>${esc(n.desc)}</p>
          <div class="news-date">${esc(n.date)}</div>
        </div>
      </article>`).join("");
    root.innerHTML = `
      <div class="page-head"><div class="wrap">
        <div class="crumbs"><a href="index.html">Home</a> / News</div>
        <h1>News &amp; Updates</h1>
        <p>Patch notes, kit releases, season resets and everything happening on ${esc(SITE.siteName)}.</p>
      </div></div>
      <div class="wrap">${list.length ? `<div class="news-grid">${cards}</div>` : emptyState({
        icon: "📰",
        title: "No news published yet",
        text: "Announcements, patch notes and season updates will appear here once they are published."
      })}</div>`;
  }

  /* ---------- SERVERS PAGE ---------- */
  function renderServers() {
    const root = document.getElementById("servers-root");
    if (!root) return;
    const list = D.SERVER_REGIONS || [];
    const totalServers = list.reduce((a, r) => a + (Number(r.servers) || 0), 0);
    const totalOnline = list.reduce((a, r) => a + (Number(r.online) || 0), 0);
    const rows = list.map((r) => `
      <li class="loc-region">
        <span class="loc-name"><span class="loc-dot"></span>${esc(r.name)}${r.ip ? ` <small style="color:var(--muted);font-weight:600">${esc(r.ip)}</small>` : ""}</span>
        <span class="loc-metrics"><span>${Number(r.servers) || 0} Servers</span><span class="loc-online">● ${Number(r.online) || 0} Online</span></span>
      </li>`).join("");
    root.innerHTML = `
      <div class="page-head"><div class="wrap">
        <div class="crumbs"><a href="index.html">Home</a> / Servers</div>
        <h1>Server Network</h1>
        <p>Play Anywhere. Queue From Anywhere. ${list.length ? `${totalServers} servers across ${list.length} regions.` : "Your server list is empty — add your own servers to get started."}</p>
      </div></div>
      <div class="wrap">
        ${list.length ? `
        <div class="stats-strip" style="grid-template-columns:repeat(3,1fr);margin-bottom:26px">
          <div class="stat-card"><div class="stat-value">${totalServers}</div><div class="stat-label">Total Servers</div></div>
          <div class="stat-card"><div class="stat-value">${totalOnline.toLocaleString()}</div><div class="stat-label">Players Online</div></div>
          <div class="stat-card"><div class="stat-value">${list.length}</div><div class="stat-label">Regions</div></div>
        </div>
        <div class="locations">
          <div class="locations-map"><img src="images/map.png" alt="Server locations map" loading="lazy">
            <div class="locations-count">🌐 ${totalServers} Locations</div></div>
          <ul class="locations-list">${rows}</ul>
        </div>` : emptyState({
          icon: "🌐",
          title: "No servers added yet",
          text: "No servers have been added yet. Server details will appear here once they are set up."
        })}
      </div>`;
  }

  /* ---------- scroll reveal (transform-only, never hides content) ---------- */
  function initReveal() {
    const targets = document.querySelectorAll(".section, .page-head, main > .wrap");
    if (!targets.length) return;
    document.documentElement.classList.add("js-ready");
    if (!("IntersectionObserver" in window)) { targets.forEach((t) => t.classList.add("reveal", "in")); return; }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
    }, { rootMargin: "0px 0px -6% 0px", threshold: 0.04 });
    targets.forEach((t) => { t.classList.add("reveal"); io.observe(t); });
    setTimeout(() => targets.forEach((t) => t.classList.add("in")), 1600);
  }

  /* ---------- boot ---------- */
  function renderAll() {
    renderNav();
    renderFooter();
    renderHome();
    renderTiers();
    renderPlayers();
    renderKits();
    renderTourneys();
    renderNews();
    renderServers();
    initReveal();
  }

  document.addEventListener("DOMContentLoaded", async () => {
    /* Option A: if supabase-live.js is present and configured, it exposes
       window.MCRANKED_LIVE — a promise of the live players array. When it
       resolves with an array we render that instead of the static
       players.js. On any failure it resolves null and we keep players.js. */
    try {
      if (window.MCRANKED_LIVE && typeof window.MCRANKED_LIVE.then === "function") {
        const live = await window.MCRANKED_LIVE;
        if (Array.isArray(live)) {
          PLAYERS = live;
          D.PLAYERS = live;
        }
      }
    } catch (e) {
      console.warn("[MCRANKED] live data unavailable, using players.js");
    }
    renderAll();
  });
})();
