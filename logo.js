// Applies the custom logo from site-config.js
(function () {
  const url = typeof SITE_LOGO_URL !== "undefined" ? SITE_LOGO_URL.trim() : "";
  if (!url || url === "PASTE_YOUR_TIERLIST_LOGO_LINK_HERE") return;

  document.querySelectorAll(".logo").forEach((el) => {
    const img = document.createElement("img");
    img.className = "logo-img";
    img.src = url;
    img.alt = "Tier List Logo";
    img.loading = "eager";
    img.onerror = () => { img.remove(); };
    el.textContent = "";
    el.appendChild(img);
  });
})();
