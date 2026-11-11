/* Gregado homepage application bundle. Original application logic retained. */
"use strict";

// Keep the existing login gate before initializing homepage features.
if (localStorage.getItem('isLoggedIn') !== 'true') {
      window.location.replace("login.html");
    }

// Homepage theme controls, interactions, sliders, reveals and saved-college UI.
document.addEventListener("DOMContentLoaded", () => {
      const $ = (s) => document.querySelector(s);
      const $$ = (s) => [...document.querySelectorAll(s)];

      // =======================================================
      // 1. SIX-THEME SYSTEM (Presets and behavior from theme.html)
      // =======================================================
      const themes = [
        { id: "deep-ocean", name: "Deep Ocean", short: "01", description: "A calm, clear blue hour.", accent: "#44D3E0", accentSoft: "rgba(68,211,224,.14)", surface: "rgba(8,37,53,.78)", surfaceSolid: "#0B2C40", background: "#071D2B", foreground: "#F1FAFC", muted: "#B7D0D9", line: "rgba(135,208,221,.20)", glow: "rgba(32,168,197,.23)", accent2: "#7CBDF0", buttonText: "#05252D", displayFont: "Manrope", bodyFont: "Inter", mode: "dark" },
        { id: "sunset-glow", name: "Sunset Glow", short: "02", description: "Warm, expressive, quietly bold.", accent: "#FF987D", accentSoft: "rgba(255,152,125,.15)", surface: "rgba(57,30,37,.80)", surfaceSolid: "#3D2229", background: "#23151D", foreground: "#FFF7F2", muted: "#E1C4BB", line: "rgba(245,177,143,.22)", glow: "rgba(199,86,76,.24)", accent2: "#F5C778", buttonText: "#351C1D", displayFont: "Fraunces", bodyFont: "DM Sans", mode: "dark" },
        { id: "forest-emerald", name: "Forest Emerald", short: "03", description: "Grounded greens, generous space.", accent: "#65D5A0", accentSoft: "rgba(101,213,160,.15)", surface: "rgba(15,48,41,.82)", surfaceSolid: "#15382F", background: "#0A211C", foreground: "#F0FAF4", muted: "#BCD5C7", line: "rgba(130,211,162,.21)", glow: "rgba(48,155,103,.22)", accent2: "#C4D66F", buttonText: "#09251B", displayFont: "Manrope", bodyFont: "DM Sans", mode: "dark" },
        { id: "cyberpunk-neon", name: "Cyberpunk Neon", short: "04", description: "Electric edges for the curious.", accent: "#EB82FF", accentSoft: "rgba(235,130,255,.15)", surface: "rgba(29,24,56,.83)", surfaceSolid: "#201A3A", background: "#111020", foreground: "#FAF6FF", muted: "#C7BFDB", line: "rgba(196,135,255,.25)", glow: "rgba(128,74,218,.25)", accent2: "#C2FF62", buttonText: "#211128", displayFont: "Space Grotesk", bodyFont: "Inter", mode: "dark" },
        { id: "arctic-frost", name: "Arctic Frost", short: "05", description: "Bright, crisp, wonderfully open.", accent: "#076F7C", accentSoft: "rgba(7,111,124,.12)", surface: "rgba(255,255,255,.79)", surfaceSolid: "#FFFFFF", background: "#EAF3F6", foreground: "#153340", muted: "#405E6B", line: "rgba(26,76,91,.19)", glow: "rgba(89,174,191,.20)", accent2: "#3159A1", buttonText: "#FFFFFF", displayFont: "Outfit", bodyFont: "Inter", mode: "light" },
        { id: "gregado-classic", name: "Gregado Classic", short: "06", description: "Our signature midnight and blue.", accent: "#69A9F3", accentSoft: "rgba(105,169,243,.14)", surface: "rgba(20,31,49,.83)", surfaceSolid: "#17243A", background: "#101827", foreground: "#F5F7FC", muted: "#BBC7D8", line: "rgba(155,181,221,.20)", glow: "rgba(59,130,246,.20)", accent2: "#F2BD7A", buttonText: "#07182C", displayFont: "Manrope", bodyFont: "Inter", mode: "dark" }
      ];

      const root = document.documentElement;
      const getStoredTheme = () => {
        try {
          const saved = localStorage.getItem("gregado_premium_theme");
          if (themes.some(theme => theme.id === saved)) return saved;
          // Migrate the older two-state preference without losing the visitor's choice.
          return localStorage.getItem("gregado_theme") === "light" ? "arctic-frost" : "gregado-classic";
        } catch (_) {
          return "gregado-classic";
        }
      };
      let activeTheme = themes.find(theme => theme.id === getStoredTheme()) || themes[5];

      const themeStyles = document.createElement("style");
      themeStyles.id = "gregado-six-theme-styles";
      themeStyles.textContent = `
        body { background: radial-gradient(ellipse at 84% 8%, var(--glow), transparent 42%), var(--bg) !important; background-attachment: fixed !important; color: var(--foreground) !important; font-family: var(--body-font), Inter, sans-serif !important; transition: background-color .42s ease, color .38s ease; }
        body, button, input, textarea, select { font-family: var(--body-font), Inter, sans-serif !important; }
        h1, h2, h3, h4, h5, h6, .brand span, .spa-page-title, .spa-modal-title, .feature-card h3, .search-panel h2, .menu-panel h2 { font-family: var(--display-font), Manrope, sans-serif !important; }
        .site-header .nav-shell { background: color-mix(in srgb, var(--surface-solid) 88%, transparent) !important; border-color: var(--line) !important; box-shadow: 0 12px 36px rgba(0,0,0,.16) !important; }
        .brand span { color: var(--accent) !important; }
        .nav-link { color: var(--foreground) !important; }
        .nav-link:hover, .nav-link.active { background: var(--accent-soft) !important; color: var(--accent) !important; }
        .nav-link.active:after { background: var(--accent) !important; }
        .nav-dropdown-wrapper .nav-icon, .nav-dropdown-wrapper button > span, .mobile-drawer .mobile-drawer-btn span { color: var(--accent) !important; }
        .nav-tagline { color: var(--muted) !important; border-color: var(--line) !important; }
        .mobile-menu-btn, .mobile-drawer { background: var(--surface-solid) !important; border-color: var(--line) !important; color: var(--foreground) !important; }
        .mobile-menu-btn span { background: var(--foreground) !important; }
        .mobile-drawer a, .mobile-drawer button { color: var(--foreground) !important; }
        .mobile-drawer a:hover, .mobile-drawer button:hover { background: var(--accent-soft) !important; color: var(--accent) !important; }
        .hero { background-color: var(--bg) !important; }
        .hero h1 em, .section-top h2 span, .why-copy h2 span, .section-kicker, .spa-group-section h2, .spa-location-tag, .spa-back-btn, .text-btn { color: var(--accent) !important; }
        .eyebrow span, .section-kicker span { background: var(--accent) !important; }
        .primary-btn, .spa-download-btn { background: var(--accent) !important; color: var(--button-text) !important; box-shadow: 0 12px 30px color-mix(in srgb, var(--accent) 25%, transparent) !important; }
        .primary-btn:hover, .spa-download-btn:hover { background: color-mix(in srgb, var(--accent) 84%, #000) !important; color: var(--button-text) !important; }
        .destination-section, .why-section { background: var(--bg) !important; }
        .section-top h2, .why-copy h2, .feature-card h3, .spa-page-title, .spa-modal-title, .search-panel h2, .menu-panel h2 { color: var(--foreground) !important; }
        .section-top > p, .why-copy p, .feature-card p, .section-top .muted, .spa-content-box p { color: var(--muted) !important; }
        .feature-card, .spa-group-section, .spa-detail-modal, .spa-alphabet-nav, .compare-col, .team-section { background: var(--surface) !important; border-color: var(--line) !important; color: var(--foreground) !important; }
        .feature-number { color: var(--muted) !important; }
        .feature-card:hover { border-color: var(--accent) !important; }
        .cta-section, .footer { background: var(--surface-solid) !important; color: var(--foreground) !important; }
        .cta-inner h2, .footer-brand, .footer-brand strong { color: var(--foreground) !important; }
        .cta-inner p, .footer { color: var(--muted) !important; }
        .cta-inner h2 span, .section-kicker.light { color: var(--accent) !important; }
        .cta-orb, .orb-one, .orb-two { opacity: .34; }
        .light-btn { background: var(--accent) !important; color: var(--button-text) !important; }
        .search-overlay, .menu-overlay { background: color-mix(in srgb, var(--bg) 72%, transparent) !important; }
        .search-panel, .menu-panel, .mobile-drawer, .nav-dropdown-content, .mobile-dropdown-content { background: var(--surface-solid) !important; border-color: var(--line) !important; color: var(--foreground) !important; }
        .search-panel h2, .menu-panel h2, .search-panel input, .search-input-wrap input { color: var(--foreground) !important; }
        .search-input-wrap { border-color: var(--line) !important; background: var(--surface) !important; }
        .search-results .result, .spa-search-item { background: var(--surface) !important; color: var(--foreground) !important; border-color: var(--line) !important; }
        .result:hover, .spa-search-item:hover { background: var(--accent-soft) !important; color: var(--accent) !important; }
        .menu-item { color: var(--foreground) !important; border-color: var(--line) !important; }
        .menu-item:hover { color: var(--accent) !important; }
        .close-panel, .spa-close-btn { background: var(--accent-soft) !important; color: var(--foreground) !important; }
        .spa-back-btn, .btn-action-sm, .dev-btn { background: var(--accent-soft) !important; border-color: color-mix(in srgb, var(--accent) 45%, var(--line)) !important; color: var(--accent) !important; }
        .spa-back-btn:hover, .spa-college-btn:hover, .spa-alphabet-nav button:hover, .btn-action-sm:hover, .dev-btn:hover { background: var(--accent) !important; color: var(--button-text) !important; }
        .spa-college-btn, .spa-search-item, .featured-col-btn { background: var(--surface) !important; color: var(--foreground) !important; border-color: var(--line) !important; }
        .spa-group-section h2, .spa-location-tag, .about-modal-content h4, .featured-col-btn strong, .spa-search-item strong { color: var(--accent) !important; }
        .spa-pdf-action { background: var(--accent-soft) !important; border-color: color-mix(in srgb, var(--accent) 48%, var(--line)) !important; }
        .skeleton-ring-1, .skeleton-ring-2 { border-top-color: var(--accent) !important; border-bottom-color: var(--accent) !important; border-left-color: var(--accent) !important; border-right-color: var(--accent) !important; }
        .skeleton-text { color: var(--accent) !important; }
        .scroll-progress-line { background: var(--accent) !important; }
        .custom-cursor { border-color: var(--accent) !important; box-shadow: 0 0 15px color-mix(in srgb, var(--accent) 45%, transparent) !important; }
        .toast { background: var(--surface-solid) !important; color: var(--foreground) !important; border: 1px solid var(--line) !important; }
        .theme-picker-wrap { position: relative; }
        .theme-trigger { display: inline-flex; align-items: center; gap: 9px; min-width: 136px; padding: 8px 10px; border: 1px solid var(--line); border-radius: 13px; background: var(--surface); color: var(--foreground); cursor: pointer; transition: border-color .18s ease, background .18s ease; }
        .theme-trigger:hover { border-color: color-mix(in srgb, var(--accent) 56%, var(--line)); }
        .theme-trigger__swatch { width: 11px; height: 11px; flex: 0 0 auto; border-radius: 50%; box-shadow: 0 0 14px color-mix(in srgb, var(--accent) 62%, transparent); }
        .theme-trigger__text { display: flex; flex-direction: column; align-items: flex-start; gap: 1px; min-width: 0; }
        .theme-trigger__text small { color: var(--muted); font-size: .53rem; letter-spacing: .12em; }
        .theme-trigger__text strong { max-width: 104px; overflow: hidden; color: var(--foreground); font-size: .7rem; font-weight: 700; text-overflow: ellipsis; white-space: nowrap; }
        .theme-trigger__chevron { margin-left: auto; color: var(--muted); font-size: 1rem; transform: translateY(-2px); }
        .theme-popover { position: absolute; z-index: 10020; top: calc(100% + 16px); right: -56px; width: min(380px, calc(100vw - 30px)); padding: 18px; border: 1px solid var(--line); border-radius: 24px; background: color-mix(in srgb, var(--surface-solid) 92%, transparent); color: var(--foreground); box-shadow: 0 26px 75px rgba(0,0,0,.24); backdrop-filter: blur(24px); animation: gregado-theme-pop .2s cubic-bezier(.2,.78,.24,1) both; }
        .theme-popover[hidden] { display: none !important; }
        @keyframes gregado-theme-pop { from { opacity: 0; transform: translateY(8px) scale(.98); } to { opacity: 1; transform: none; } }
        .theme-popover__heading { padding: 3px 4px 12px; display: flex; flex-direction: column; gap: 6px; border-bottom: 1px solid var(--line); }
        .theme-popover__heading > span:last-child { color: var(--foreground); font-family: var(--display-font); font-size: 1.05rem; font-weight: 700; }
        .theme-option-list { display: grid; gap: 3px; padding-top: 7px; }
        .theme-option { width: 100%; min-height: 57px; display: flex; align-items: center; gap: 11px; padding: 8px 9px; border: 1px solid transparent; border-radius: 14px; background: transparent; color: var(--foreground); text-align: left; cursor: pointer; transition: background .18s ease, border .18s ease, transform .18s ease; }
        .theme-option:hover, .theme-option.is-active { border-color: var(--line); background: var(--accent-soft); }
        .theme-option:hover { transform: translate(2px); }
        .theme-option__swatches { display: flex; flex: 0 0 45px; align-items: center; }
        .theme-option__swatches i { width: 18px; height: 18px; margin-right: -5px; border: 2px solid var(--surface-solid); border-radius: 50%; }
        .theme-option__copy { min-width: 0; display: flex; flex: 1; flex-direction: column; gap: 3px; }
        .theme-option__copy strong { color: var(--foreground); font-size: .77rem; font-weight: 700; }
        .theme-option__copy small { color: var(--muted); font-size: .64rem; }
        .theme-option__check { width: 22px; color: var(--accent); text-align: center; font-family: 'DM Mono', monospace; font-size: .62rem; }
        .theme-popover__footnote { margin: 11px 4px 1px; color: var(--muted); font-size: .62rem; line-height: 1.55; }
        .theme-wave-button { position: fixed; z-index: 9999970; bottom: 24px; left: 23px; min-height: 60px; display: flex; align-items: center; gap: 11px; padding: 8px 15px 8px 9px; border: 1px solid var(--line); border-radius: 999px; background: color-mix(in srgb, var(--surface-solid) 88%, transparent); color: var(--foreground); box-shadow: 0 12px 38px #0000002e; cursor: pointer; backdrop-filter: blur(22px); transition: transform .22s cubic-bezier(.2,.78,.24,1), border-color .22s ease, box-shadow .22s ease; }
        .theme-wave-button:hover { transform: translateY(-3px); border-color: color-mix(in srgb, var(--accent) 55%, var(--line)); box-shadow: 0 16px 38px color-mix(in srgb, var(--accent) 14%, transparent); }
        .theme-wave-button__symbol { position: relative; width: 40px; height: 40px; display: block; flex: 0 0 40px; overflow: hidden; border-radius: 50%; background: var(--accent-soft); }
        .theme-wave-button__symbol span { position: absolute; left: 6px; width: 28px; height: 14px; border: 1.5px solid var(--accent); border-color: var(--accent) transparent transparent; border-radius: 50%; transform: rotate(-12deg); }
        .theme-wave-button__symbol span:nth-child(1) { top: 9px; }
        .theme-wave-button__symbol span:nth-child(2) { top: 15px; left: 3px; transform: rotate(9deg); }
        .theme-wave-button__symbol span:nth-child(3) { top: 21px; left: 8px; transform: rotate(-9deg); }
        .theme-wave-button__copy { display: flex; flex-direction: column; align-items: flex-start; gap: 3px; }
        .theme-wave-button__copy small { color: var(--muted); font-family: 'DM Mono', monospace; font-size: .5rem; letter-spacing: .1em; }
        .theme-wave-button__copy strong { max-width: 112px; overflow: hidden; color: var(--foreground); font-size: .68rem; font-weight: 700; text-overflow: ellipsis; white-space: nowrap; }
        .theme-wave-button__arrow { width: 25px; height: 25px; margin-left: 1px; display: grid; flex: 0 0 25px; place-items: center; border-radius: 50%; background: var(--accent); color: var(--button-text); }
        .mobile-theme-button { display: flex !important; justify-content: space-between; align-items: center; }
        .transition-stage { position: fixed; z-index: 9999980; inset: 0; display: none; width: 100vw; height: 100vh; overflow: hidden; pointer-events: none; }
        .transition-stage canvas { display: block; width: 100%; height: 100%; }
        @media (max-width: 1100px) { .theme-trigger { min-width: 118px; } .theme-trigger__text strong { max-width: 86px; } }
        @media (max-width: 800px) { .theme-picker-wrap { display: none; } .theme-wave-button { bottom: 16px; left: 12px; min-height: 54px; gap: 8px; padding-right: 11px; } .theme-wave-button__symbol { width: 36px; height: 36px; flex-basis: 36px; } }
        @media (prefers-reduced-motion: reduce) { .theme-popover, .theme-option, .theme-wave-button { animation: none !important; transition: none !important; } }
      `;
      document.head.appendChild(themeStyles);

      function applyThemeVariables(theme) {
        activeTheme = theme;
        root.dataset.theme = theme.id;
        root.style.colorScheme = theme.mode;
        const vars = {
          "--bg": theme.background,
          "--surface": theme.surface,
          "--surface-solid": theme.surfaceSolid,
          "--foreground": theme.foreground,
          "--muted": theme.muted,
          "--line": theme.line,
          "--accent": theme.accent,
          "--accent-soft": theme.accentSoft,
          "--accent-2": theme.accent2,
          "--glow": theme.glow,
          "--button-text": theme.buttonText,
          "--display-font": `'${theme.displayFont}', 'Manrope', sans-serif`,
          "--body-font": `'${theme.bodyFont}', 'Inter', sans-serif`,
          // Compatibility aliases used by the existing homepage and SPA styles.
          "--bg-color": theme.background,
          "--text-color": theme.foreground,
          "--primary-color": theme.accent,
          "--glass-bg": theme.surface,
          "--glass-border": theme.line,
          "--paper": theme.background,
          "--navy": theme.foreground,
          "--ink": theme.foreground,
          "--blue": theme.accent,
          "--blue-2": theme.accent,
          "--muted-color": theme.muted,
          "--white": theme.surfaceSolid
        };
        Object.entries(vars).forEach(([name, value]) => root.style.setProperty(name, value));
        document.body.classList.toggle("light-mode", theme.mode === "light");
        document.querySelector('meta[name="theme-color"]')?.setAttribute("content", theme.background);
        try {
          localStorage.setItem("gregado_premium_theme", theme.id);
          localStorage.setItem("gregado_theme", theme.mode === "light" ? "light" : "dark");
        } catch (_) { }
        updateThemeControls();
      }

      function updateThemeControls() {
        const name = document.getElementById("themeTriggerName");
        const swatch = document.getElementById("themeTriggerSwatch");
        const bottomName = document.getElementById("bottomThemeName");
        if (name) name.textContent = activeTheme.name;
        if (swatch) swatch.style.background = activeTheme.accent;
        if (bottomName) bottomName.textContent = activeTheme.name;
        document.querySelectorAll(".theme-option").forEach(button => {
          const selected = button.dataset.themeId === activeTheme.id;
          button.classList.toggle("is-active", selected);
          button.setAttribute("aria-checked", String(selected));
          const check = button.querySelector(".theme-option__check");
          if (check) check.textContent = selected ? "✓" : (themes.find(item => item.id === button.dataset.themeId)?.short || "");
        });
      }

      const themeOptionList = document.getElementById("themeOptionList");
      if (themeOptionList) {
        themes.forEach(theme => {
          const option = document.createElement("button");
          option.type = "button";
          option.className = "theme-option";
          option.dataset.themeId = theme.id;
          option.setAttribute("role", "menuitemradio");
          option.setAttribute("aria-checked", "false");
          option.innerHTML = `
            <span class="theme-option__swatches" aria-hidden="true">
              <i style="background:${theme.background}"></i><i style="background:${theme.accent}"></i><i style="background:${theme.accent2}"></i>
            </span>
            <span class="theme-option__copy"><strong></strong><small></small></span>
            <span class="theme-option__check" aria-hidden="true">${theme.short}</span>`;
          option.querySelector("strong").textContent = theme.name;
          option.querySelector("small").textContent = theme.description;
          option.addEventListener("click", event => {
            const rect = event.currentTarget.getBoundingClientRect();
            selectTheme(theme.id, "glass", { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 });
          });
          themeOptionList.appendChild(option);
        });
      }

      const themePopover = document.getElementById("themePopover");
      const themePickerToggle = document.getElementById("themePickerToggle");
      const themePickerWrap = document.getElementById("themePickerWrap");
      const closeThemePicker = () => {
        if (themePopover) themePopover.hidden = true;
        if (themePickerToggle) themePickerToggle.setAttribute("aria-expanded", "false");
      };
      if (themePickerToggle && themePopover) {
        themePickerToggle.addEventListener("click", () => {
          const opening = themePopover.hidden;
          themePopover.hidden = !opening;
          themePickerToggle.setAttribute("aria-expanded", String(opening));
        });
        document.addEventListener("pointerdown", event => {
          if (themePickerWrap && !themePickerWrap.contains(event.target)) closeThemePicker();
        });
        themePickerToggle.addEventListener("keydown", event => {
          if (event.key === "Escape") closeThemePicker();
        });
      }

      function selectTheme(themeId, effect, origin) {
        const nextTheme = themes.find(theme => theme.id === themeId);
        if (!nextTheme) return;
        closeThemePicker();
        if (window.closeMenus) window.closeMenus();
        if (nextTheme.id === activeTheme.id) return;
        const commit = () => applyThemeVariables(nextTheme);
        const reducedMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
        const fx = window.GregadoThemeFX;
        if (reducedMotion || !fx) { commit(); return; }
        if (effect === "wave") fx.playWave(nextTheme.accent, commit);
        else fx.playGlassBurst(nextTheme.accent, origin || { x: window.innerWidth / 2, y: window.innerHeight / 2 }, commit);
      }

      function switchTheme(source, origin) {
        const currentIndex = themes.findIndex(theme => theme.id === activeTheme.id);
        const nextTheme = themes[(currentIndex + 1) % themes.length];
        selectTheme(nextTheme.id, source === "bottom" ? "wave" : "glass", origin);
      }

      const bottomThemeBtn = document.getElementById("bottomThemeToggle");
      const mobileThemeBtn = document.getElementById("mobileThemeToggle");
      if (bottomThemeBtn) bottomThemeBtn.addEventListener("click", () => switchTheme("bottom"));
      if (mobileThemeBtn) mobileThemeBtn.addEventListener("click", event => {
        const rect = event.currentTarget.getBoundingClientRect();
        switchTheme("menu", { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 });
        if (window.closeMenus) window.closeMenus();
      });

      // Apply the persisted preset before the rest of the homepage interactions initialize.
      applyThemeVariables(activeTheme);

      // =======================================================
      // 2. SAVED COLLEGES LOGIC (Wishlist)
      // =======================================================
      window.getSavedColleges = () => JSON.parse(localStorage.getItem("gregado_saved_data") || "[]");

      window.toggleSavedCollege = (name, loc, desc) => {
        let saved = window.getSavedColleges();
        if (saved.some(c => c.name === name)) {
          saved = saved.filter(c => c.name !== name);
        } else {
          saved.push({ name, loc, desc });
        }
        localStorage.setItem("gregado_saved_data", JSON.stringify(saved));
      };

      window.openSavedModal = () => {
        if (window.closeMenus) window.closeMenus();
        const grid = document.getElementById("savedGridArea");
        const saved = window.getSavedColleges();

        if (saved.length === 0) {
          grid.innerHTML = `<div style="grid-column: 1 / -1; text-align:center; padding:2rem;">No colleges saved yet.</div>`;
        } else {
          grid.innerHTML = saved.map((c, i) => `
         <div class="compare-col" style="background:var(--glass-bg); border:1px solid var(--glass-border); padding:20px; border-radius:12px; text-align:center;">
           <span style="font-size:2.5rem; display:block; margin-bottom:15px;">🎓</span>
           <h4 style="color:var(--primary-color);">${c.name}</h4>
           <span style="display:block; color:var(--primary-color); font-size:0.9rem; margin-bottom:10px; font-weight:800;">📍 ${c.loc}</span>
           <button class="btn-action-sm" onclick="window.removeSavedCol(${i})" style="margin: 15px auto 0; background:rgba(239, 68, 68, 0.1); color:#ef4444 !important; border-color:rgba(239, 68, 68, 0.4);">❌ Remove</button>
         </div>
       `).join("");
        }
        document.getElementById("savedModalView").classList.add("is-active");
      };

      window.removeSavedCol = (index) => {
        let saved = window.getSavedColleges();
        saved.splice(index, 1);
        localStorage.setItem("gregado_saved_data", JSON.stringify(saved));
        window.openSavedModal();
      };

      // =======================================================
      // 3. CURSOR & SCROLL PROGRESS
      // =======================================================
      const cursor = $("#customCursor");
      if (cursor) {
        let mouseX = 0, mouseY = 0, cursorX = 0, cursorY = 0;
        window.addEventListener("mousemove", (e) => { mouseX = e.clientX; mouseY = e.clientY; }, { passive: true });
        const animateCursor = () => {
          cursorX += (mouseX - cursorX) * 0.15;
          cursorY += (mouseY - cursorY) * 0.15;
          cursor.style.transform = `translate(${cursorX}px, ${cursorY}px)`;
          requestAnimationFrame(animateCursor);
        };
        animateCursor();
        document.body.addEventListener("mouseover", (e) => {
          if (e.target.closest("a, button, .destination-card, .spa-college-btn, input, .featured-col-btn")) cursor.classList.add("hover");
        });
        document.body.addEventListener("mouseout", (e) => {
          if (e.target.closest("a, button, .destination-card, .spa-college-btn, input, .featured-col-btn")) cursor.classList.remove("hover");
        });
      }

      const progressBar = $("#scrollProgress");
      if (progressBar) {
        window.addEventListener("scroll", () => {
          const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
          const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
          progressBar.style.width = (winScroll / height) * 100 + "%";
        }, { passive: true });
      }

      // =======================================================
      // 4. HERO SLIDER LOGIC
      // =======================================================
      const slides = $$(".hero-slide");
      const dotsWrap = $("#sliderDots");
      const current = $("#slideCurrent");
      const progress = $("#slideProgress");
      let index = 0;
      let timer = null;
      const duration = 5500;

      if (slides.length > 0 && dotsWrap) {
        slides.forEach((_, i) => {
          const b = document.createElement("button");
          b.type = "button";
          b.setAttribute("aria-label", `Show slide ${i + 1}`);
          b.addEventListener("click", () => goTo(i, true));
          dotsWrap.appendChild(b);
        });
        const dots = $$("button", dotsWrap);
        function goTo(next, manual = false) {
          slides[index].classList.remove("is-active");
          index = (next + slides.length) % slides.length;
          slides[index].classList.add("is-active");
          if (current) current.textContent = String(index + 1).padStart(2, "0");
          dots.forEach((d, i) => d.classList.toggle("is-active", i === index));
          if (progress) {
            progress.style.transition = "none";
            progress.style.transform = "scaleX(0)";
            requestAnimationFrame(() => {
              requestAnimationFrame(() => {
                progress.style.transition = `transform ${duration}ms linear`;
                progress.style.transform = "scaleX(1)";
              });
            });
          }
          if (manual) restart();
        }
        function restart() {
          clearInterval(timer);
          timer = setInterval(() => goTo(index + 1), duration);
        }
        goTo(0);
        restart();
        const hero = $(".hero");
        if (hero) {
          hero.addEventListener("mouseenter", () => clearInterval(timer));
          hero.addEventListener("mouseleave", restart);
        }
      }

      // =======================================================
      // 5. HEADER SHRINK, REVEAL, EFFECTS
      // =======================================================
      const header = $("#siteHeader");
      if (header) {
        const onScroll = () => {
          if (window.scrollY > 40) {
            header.classList.add("scrolled");
            header.style.backdropFilter = "blur(25px)";
          } else {
            header.classList.remove("scrolled");
            header.style.backdropFilter = "blur(10px)";
          }
        };
        onScroll();
        window.addEventListener("scroll", onScroll, { passive: true });
      }

      const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add("revealed");
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: .12 });
      $$(".reveal").forEach(el => observer.observe(el));

      document.body.addEventListener("click", function (e) {
        const btn = e.target.closest(".ripple-btn");
        if (!btn) return;
        const rect = btn.getBoundingClientRect();
        const ripple = document.createElement("span");
        const size = Math.max(rect.width, rect.height);
        ripple.className = "ripple";
        ripple.style.width = ripple.style.height = `${size}px`;
        ripple.style.left = `${e.clientX - rect.left - size / 2}px`;
        ripple.style.top = `${e.clientY - rect.top - size / 2}px`;
        btn.appendChild(ripple);
        setTimeout(() => ripple.remove(), 700);
      });

      $$(".magnetic").forEach(btn => {
        btn.addEventListener("mousemove", e => {
          const r = btn.getBoundingClientRect();
          const x = (e.clientX - r.left - r.width / 2) / r.width * 16;
          const y = (e.clientY - r.top - r.height / 2) / r.height * 16;
          btn.style.transform = `translate(${x}px, ${y}px)`;
        });
        btn.addEventListener("mouseleave", () => btn.style.transform = "");
      });

      $$(".destination-card").forEach(card => {
        card.addEventListener("mousemove", (e) => {
          const rect = card.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;
          const centerX = rect.width / 2;
          const centerY = rect.height / 2;
          const tiltX = ((y - centerY) / centerY) * -12;
          const tiltY = ((x - centerX) / centerX) * 12;
          card.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale3d(1.03, 1.03, 1.03)`;
          card.style.transition = "transform 0.1s ease";
        });
        card.addEventListener("mouseleave", () => {
          card.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)";
          card.style.transition = "transform 0.6s cubic-bezier(0.23, 1, 0.32, 1)";
        });
      });

      const tagline = $(".nav-tagline");
      if (tagline) {
        const originalText = "YOUR DREAM ✦ OUR GUIDANCE";
        tagline.innerHTML = "";
        let i = 0;
        const typeWriter = () => {
          if (i < originalText.length) {
            tagline.innerHTML += originalText.charAt(i);
            i++;
            setTimeout(typeWriter, 80);
          }
        };
        setTimeout(typeWriter, 1200);
      }
    });

// Existing menu, modal and logout helpers.
window.handleLogout = function () {
      localStorage.clear();
      window.location.replace("login.html");
    };

    window.openDesktopMenu = function () {
      const menu = document.getElementById('menuOverlay');
      menu.style.display = 'flex';
      menu.style.visibility = 'visible';
      setTimeout(() => menu.style.opacity = '1', 10);
    };

    window.closeDesktopMenu = function () {
      const menu = document.getElementById('menuOverlay');
      menu.style.opacity = '0';
      setTimeout(() => {
        menu.style.display = 'none';
        menu.style.visibility = 'hidden';
      }, 300);
    };

    window.toggleMobileMenu = function (btn) {
      btn.classList.toggle('is-active');
      const drawer = document.getElementById('mobileDrawer');
      if (drawer.style.transform === 'translateY(0%)') {
        drawer.style.transform = 'translateY(-150%)';
      } else {
        drawer.style.transform = 'translateY(0%)';
      }
    };

    window.closeMenus = function () {
      closeDesktopMenu();
      const drawer = document.getElementById('mobileDrawer');
      if (drawer) drawer.style.transform = 'translateY(-150%)';
      const mobileBtn = document.getElementById('mobileMenuBtn');
      if (mobileBtn) mobileBtn.classList.remove('is-active');

      const mobileF = document.getElementById('mobileFeatured');
      if (mobileF) mobileF.classList.remove('active');
    };

    window.openAboutModal = function () {
      closeMenus();
      const aModal = document.getElementById('aboutModal');
      aModal.style.display = 'flex';
    };

    window.closeAboutModal = function () {
      document.getElementById('aboutModal').style.display = 'none';
    };

    window.addEventListener('click', (e) => {
      const aModal = document.getElementById('aboutModal');
      if (e.target === aModal) aModal.style.display = 'none';
    });

// Firebase / Firestore SPA integration. Dynamic imports avoid blocking the initial page render.
(async function initializeGregadoFirebase() {
  try {
    const [firebaseAppModule, firestoreModule] = await Promise.all([
      import("https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js"),
      import("https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js")
    ]);
    const { initializeApp } = firebaseAppModule;
    const { getFirestore, collection, onSnapshot } = firestoreModule;

    const firebaseConfig = {
          apiKey: "AIzaSyDnmgIclnhm2tU-0d0ZYB_5KOxt86WMkD8",
          authDomain: "grigado.firebaseapp.com",
          projectId: "grigado",
          storageBucket: "grigado.firebasestorage.app",
          messagingSenderId: "808047975194",
          appId: "1:808047975194:web:f3ddf29d162660f84caaa3"
        };

        const app = initializeApp(firebaseConfig);
        const db = getFirestore(app);

        // Normalize legacy destination names/keys so old Firestore records
        // and newly published records are grouped under the same destination.
        const STATE_NAMES = {
          kerala: "Kerala",
          hyderabad: "Hyderabad",
          coimbatore: "Coimbatore",
          bengaluru: "Bengaluru",
          manglore: "Mangaluru",
          mysore: "Mysore",
          kanyakumari: "Kanyakumari",
          chennai: "Chennai",
          tamilnadu: "Tamil Nadu",
          karnataka: "Karnataka",
          andhrapradesh: "Andhra Pradesh",
          other: "Other Places"
        };
        const STATE_ALIASES = {
          kerala: "kerala",
          hyderabad: "hyderabad", hydrabad: "hyderabad", hydrabaad: "hyderabad",
          coimbatore: "coimbatore", coibatore: "coimbatore", coimbatorecity: "coimbatore",
          bengaluru: "bengaluru", bangalore: "bengaluru", bangaluru: "bengaluru",
          manglore: "manglore", mangalore: "manglore", mangaluru: "manglore",
          mysore: "mysore", mysuru: "mysore",
          kanyakumari: "kanyakumari",
          chennai: "chennai",
          tamilnadu: "tamilnadu",
          karnataka: "karnataka",
          andhrapradesh: "andhrapradesh", andrapradesh: "andhrapradesh",
          other: "other", otherplaces: "other"
        };
        const compactStateValue = value => String(value ?? "")
          .normalize("NFKD").replace(/[\u0300-\u036f]/g, "")
          .toLowerCase().replace(/[^a-z0-9]/g, "");
        function resolveStateKey(record) {
          const candidates = [
            record?.stateKey, record?.stateName, record?.state,
            record?.destinationKey, record?.destination,
            record?.placeKey, record?.place, record?.location
          ];
          let genericFallback = "";
          for (const candidate of candidates) {
            const whole = compactStateValue(candidate);
            const wholeMatch = STATE_ALIASES[whole];
            if (wholeMatch && wholeMatch !== "other") return wholeMatch;
            if (wholeMatch === "other") genericFallback = "other";
            // Also recognize values such as "Hyderabad, Telangana" or "Kochi, Kerala".
            for (const part of String(candidate ?? "").split(/[,|/()\-]+/)) {
              const token = compactStateValue(part);
              const tokenMatch = STATE_ALIASES[token];
              if (tokenMatch && tokenMatch !== "other") return tokenMatch;
              if (tokenMatch === "other") genericFallback = "other";
            }
          }
          return genericFallback;
        }

        function canonicalDistrict(value) {
          const compact = compactStateValue(value);
          if (compact === "kasargod") return "Kasaragod";
          const known = ["Alappuzha", "Ernakulam", "Idukki", "Kannur", "Kasaragod", "Kollam", "Kottayam", "Kozhikode", "Malappuram", "Palakkad", "Pathanamthitta", "Thiruvananthapuram", "Thrissur", "Wayanad"];
          return known.find(name => compactStateValue(name) === compact) || String(value ?? "").trim();
        }

        let placesData = {};
        window.rawCollegesCache = [];

        onSnapshot(collection(db, "colleges"), (snapshot) => {
          placesData = {};
          window.rawCollegesCache = [];
          let featuredHtml = "";

          snapshot.forEach(doc => {
            const rawData = doc.data() || {};
            const resolvedStateKey = resolveStateKey(rawData);
            const normalizedType = String(rawData.type || "").toLowerCase();
            const data = {
              ...rawData,
              id: doc.id,
              stateKey: resolvedStateKey || rawData.stateKey || "",
              stateName: STATE_NAMES[resolvedStateKey] || rawData.stateName || rawData.state || "",
              type: normalizedType === "district" || (!normalizedType && resolvedStateKey === "kerala") ? "district" : "alphabet",
              district: canonicalDistrict(rawData.district)
            };
            window.rawCollegesCache.push(data);

            // Featured/Offers (*) check
            if (data.isFeatured === true || data.isFeatured === "true") {
              const loc = data.type === 'district' ? `${data.district}, ${data.stateName}` : data.stateName;
              featuredHtml += `<button class="featured-col-btn" onclick="openFeaturedModal('${data.id}')">
                                  <strong>${data.name}</strong>
                                  <span>📍 ${loc}</span>
                                </button>`;
            }

            const sk = data.stateKey;
            if (!sk || !STATE_NAMES[sk]) return;
            if (!placesData[sk]) {
              placesData[sk] = { name: data.stateName, type: data.type, data: [] };
            }

            if (data.type === 'district') {
              let distObj = placesData[sk].data.find(d => d.district === data.district);
              if (!distObj) {
                distObj = { district: data.district, colleges: [] };
                placesData[sk].data.push(distObj);
              }
              distObj.colleges.push(data);
            } else {
              placesData[sk].data.push(data);
            }
          });

          // Update Offers Menus
          const fDesktop = document.getElementById("featuredDesktopDropdown");
          const fMobile = document.getElementById("mobileFeatured");
          if (fDesktop) fDesktop.innerHTML = featuredHtml || '<div class="empty-featured">NOTHING</div>';
          if (fMobile) fMobile.innerHTML = featuredHtml || '<div class="empty-featured">NOTHING</div>';

          if (currentPlaceKey && placesData[currentPlaceKey]) {
            renderPlaceData(currentPlaceKey);
          }
        }, (error) => {
          console.error("Gregado colleges listener failed:", error);
          const target = document.getElementById("spa-container");
          if (target) target.innerHTML = '<p style="text-align:center;padding:2rem;">Unable to load colleges right now. Please refresh the page.</p>';
        });

        window.openFeaturedModal = function (colId) {
          if (window.closeMenus) window.closeMenus();
          const colObj = window.rawCollegesCache.find(c => c.id === colId);
          if (colObj) {
            const locStr = colObj.type === 'district' ? `${colObj.district}, ${colObj.stateName}` : colObj.stateName;
            if (window.openModal) window.openModal(colObj, locStr);
          }
        };

        const mainSections = document.getElementById('main-landing-sections');
        const spaPlaceView = document.getElementById('spa-place-view');
        const spaTitle = document.getElementById('spa-title');
        const spaNav = document.getElementById('spa-nav');
        const spaContainer = document.getElementById('spa-container');
        let currentPlaceKey = '';

        window.handlePlaceClick = function (e, placeKey) {
          if (e) { e.preventDefault(); e.stopPropagation(); }
          currentPlaceKey = placeKey;

          const skel = document.getElementById('skeletonOverlay');
          if (skel) skel.classList.add("active");

          setTimeout(() => {
            mainSections.style.display = 'none';
            spaPlaceView.classList.add('active');

            if (placesData[placeKey]) {
              spaTitle.textContent = placesData[placeKey].name.toUpperCase();
              renderPlaceData(placeKey);
            } else {
              spaTitle.textContent = "COMING SOON";
              spaContainer.innerHTML = '<h3 style="text-align:center; margin-top:3rem;">No colleges currently available in this region.</h3>';
              spaNav.innerHTML = '';
            }
            window.scrollTo({ top: 0, behavior: 'smooth' });

            setTimeout(() => { if (skel) skel.classList.remove("active"); }, 400);
          }, 600);
        };

        window.closePlaceView = function () {
          const skel = document.getElementById('skeletonOverlay');
          if (skel) skel.classList.add("active");
          setTimeout(() => {
            currentPlaceKey = '';
            spaPlaceView.classList.remove('active');
            mainSections.style.display = 'block';
            setTimeout(() => { if (skel) skel.classList.remove("active"); }, 400);
          }, 500);
        };

        function renderPlaceData(key) {
          spaNav.innerHTML = ''; spaContainer.innerHTML = '';
          const pData = placesData[key];
          if (!pData) return;

          if (pData.type === 'district') {
            pData.data.sort((a, b) => a.district.localeCompare(b.district));
            for (let i = 65; i <= 90; i++) {
              const char = String.fromCharCode(i);
              const btn = document.createElement('button'); btn.textContent = char;
              const found = pData.data.find(d => d.district.toUpperCase().startsWith(char));
              if (found) btn.onclick = () => document.getElementById(`sec-${found.district}`).scrollIntoView({ behavior: 'smooth', block: 'start' });
              else btn.classList.add('disabled');
              spaNav.appendChild(btn);
            }
            pData.data.forEach(item => {
              const sec = document.createElement('section'); sec.className = 'spa-group-section'; sec.id = `sec-${item.district}`;
              sec.innerHTML = `<h2>📍 ${item.district} Colleges</h2>`;
              const grid = document.createElement('div'); grid.className = 'spa-colleges-grid';
              item.colleges.sort((a, b) => a.name.localeCompare(b.name)).forEach(colObj => {
                const btn = document.createElement('button'); btn.className = 'spa-college-btn';
                btn.innerHTML = `<span>${colObj.name}</span><span class="arrow">↗</span>`;
                btn.onclick = () => openModal(colObj, `${item.district}, ${pData.name}`);
                grid.appendChild(btn);
              });
              sec.appendChild(grid); spaContainer.appendChild(sec);
            });
          } else {
            const sorted = pData.data.sort((a, b) => a.name.localeCompare(b.name));
            const grouped = {};
            sorted.forEach(c => { const l = c.name.charAt(0).toUpperCase(); if (!grouped[l]) grouped[l] = []; grouped[l].push(c); });

            for (let i = 65; i <= 90; i++) {
              const char = String.fromCharCode(i);
              const btn = document.createElement('button'); btn.textContent = char;
              if (grouped[char]) btn.onclick = () => document.getElementById(`sec-${char}`).scrollIntoView({ behavior: 'smooth', block: 'start' });
              else btn.classList.add('disabled');
              spaNav.appendChild(btn);
            }

            Object.keys(grouped).forEach(letter => {
              const sec = document.createElement('section'); sec.className = 'spa-group-section'; sec.id = `sec-${letter}`;
              sec.innerHTML = `<h2>${letter}</h2>`;
              const grid = document.createElement('div'); grid.className = 'spa-colleges-grid';
              grouped[letter].forEach(colObj => {
                const btn = document.createElement('button'); btn.className = 'spa-college-btn';
                btn.innerHTML = `<span>${colObj.name}</span><span class="arrow">↗</span>`;
                btn.onclick = () => openModal(colObj, pData.name);
                grid.appendChild(btn);
              });
              sec.appendChild(grid); spaContainer.appendChild(sec);
            });
          }
        }

        const sModal = document.getElementById('spaModal');
        let sTimer = null;

        window.openModal = function (colObj, locationStr) {
          document.getElementById('spaModalTitle').textContent = colObj.name;
          document.getElementById('spaModalLocation').textContent = `📍 ${locationStr}`;
          sModal.classList.add('is-active');

          const slider = document.getElementById('spaSlider');
          slider.innerHTML = '<div class="spa-slider-nav" id="spaSliderNav"></div>';
          const nav = document.getElementById('spaSliderNav');

          // Stop any previous college media before rendering the newly selected college.
          if (sTimer) {
            clearTimeout(sTimer);
            sTimer = null;
          }
          slider.querySelectorAll('video').forEach(video => video.pause());

          const mediaList = colObj.images && colObj.images.length > 0
            ? colObj.images
            : [{ type: 'image', url: 'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=1200&q=80' }];
          let cur = 0;
          const mediaItems = [];

          // Cloudinary's fl_attachment delivery flag asks the server to download
          // the original uploaded media instead of opening it in the browser.
          function getMediaDownloadUrl(mediaUrl) {
            try {
              const parsedUrl = new URL(mediaUrl, window.location.href);
              if (parsedUrl.hostname.endsWith('cloudinary.com') && parsedUrl.pathname.includes('/upload/')) {
                parsedUrl.pathname = parsedUrl.pathname.replace('/upload/', '/upload/fl_attachment/');
                return parsedUrl.href;
              }
            } catch (error) {
              console.warn('Could not prepare media download URL:', error);
            }
            return mediaUrl;
          }

          function scheduleImageAdvance() {
            if (sTimer) {
              clearTimeout(sTimer);
              sTimer = null;
            }
            // Images keep the existing automatic 3.5-second slide interval.
            // Videos advance only from their own 'ended' event below.
            if (mediaList.length > 1 && mediaList[cur]?.type !== 'video') {
              sTimer = setTimeout(() => showMediaSlide(cur + 1), 3500);
            }
          }

          function showMediaSlide(idx) {
            if (sTimer) {
              clearTimeout(sTimer);
              sTimer = null;
            }

            cur = (idx + mediaList.length) % mediaList.length;
            mediaItems.forEach((item, i) => {
              item.classList.toggle('active', i === cur);
              const video = item.querySelector('video');
              if (!video) return;

              video.onended = null;
              if (i !== cur) {
                video.pause();
                try { video.currentTime = 0; } catch (_) { /* Metadata may not be loaded yet. */ }
              }
            });

            slider.querySelectorAll('.spa-slider-dot').forEach((dot, i) => {
              dot.classList.toggle('active', i === cur);
            });

            const activeVideo = mediaItems[cur]?.querySelector('video');
            if (activeVideo) {
              activeVideo.muted = true;
              activeVideo.loop = false;
              activeVideo.playsInline = true;
              activeVideo.currentTime = 0;
              activeVideo.onended = () => {
                if (sModal.classList.contains('is-active') && mediaList.length > 1) {
                  showMediaSlide(cur + 1);
                }
              };
              const playAttempt = activeVideo.play();
              if (playAttempt && typeof playAttempt.catch === 'function') {
                playAttempt.catch(error => console.warn('College video autoplay was blocked:', error));
              }
              // Do not schedule a timer for video slides. The next slide is shown
              // only after the complete video playback reaches its ended event.
            } else {
              scheduleImageAdvance();
            }
          }

          mediaList.forEach((m, i) => {
            const item = document.createElement('div');
            item.className = `spa-slider-item ${i === 0 ? 'active' : ''}`;

            if (m.type === 'image') {
              const img = document.createElement('img');
              img.src = m.url;
              img.alt = 'College photo';
              item.appendChild(img);
            } else if (m.type === 'video') {
              const vid = document.createElement('video');
              vid.src = m.url;
              vid.autoplay = true;
              vid.muted = true;
              vid.loop = false;
              vid.playsInline = true;
              item.appendChild(vid);
            }

            if (m.url && (m.type === 'image' || m.type === 'video')) {
              const downloadButton = document.createElement('a');
              downloadButton.className = 'spa-media-download';
              downloadButton.href = getMediaDownloadUrl(m.url);
              downloadButton.setAttribute('download', '');
              downloadButton.setAttribute('aria-label', `Download college ${m.type}`);
              downloadButton.title = `Download ${m.type}`;
              downloadButton.innerHTML = '<span aria-hidden="true">⬇</span>';
              downloadButton.addEventListener('click', event => event.stopPropagation());
              item.appendChild(downloadButton);
            }

            slider.appendChild(item);
            mediaItems.push(item);

            if (mediaList.length > 1) {
              const dot = document.createElement('button');
              dot.type = 'button';
              dot.className = `spa-slider-dot ${i === 0 ? 'active' : ''}`;
              dot.setAttribute('aria-label', `Show media ${i + 1}`);
              dot.onclick = () => showMediaSlide(i);
              nav.appendChild(dot);
            }
          });

          // Start with the first media item. If it is a video, it remains visible
          // until playback finishes; the existing dots still allow manual changes.
          showMediaSlide(0);

          const contentBox = document.getElementById('spaContentBox');
          const descHtml = colObj.description ? `<p>${colObj.description.replace(/\n/g, '<br>')}</p>` : '<p>More details coming soon.</p>';
          const pdfHtml = colObj.pdfUrl
            ? `<a href="${colObj.pdfUrl}" target="_blank" class="spa-download-btn"><span>⬇ View/Download PDF</span></a>`
            : `<span style="font-size:0.85rem;">No document attached</span>`;

          // Compare and Share removed, Only Save kept
          contentBox.innerHTML = `
            ${descHtml}
            <div class="spa-pdf-action">
              <div class="spa-pdf-info">
                <strong>Fee Structure & Syllabus Brochure</strong>
                <span>Official college documents & course breakdowns</span>
              </div>
              ${pdfHtml}
            </div>
          `;

          // Inject Save Button
          if (!document.getElementById('modalActionBar')) {
            const isSaved = window.getSavedColleges().some(c => c.name === colObj.name);
            const actionBar = document.createElement("div");
            actionBar.id = "modalActionBar";
            actionBar.className = "modal-action-bar";
            actionBar.innerHTML = `
                <button id="btnSaveCol" class="btn-action-sm ${isSaved ? 'saved' : ''}">
                  ${isSaved ? '❤️ Saved' : '🤍 Save College'}
                </button>
             `;
            contentBox.insertBefore(actionBar, contentBox.firstChild);

            document.getElementById('btnSaveCol').addEventListener('click', function () {
              window.toggleSavedCollege(colObj.name, locationStr, colObj.description);
              const savedNow = window.getSavedColleges().some(c => c.name === colObj.name);
              this.innerHTML = savedNow ? "❤️ Saved" : "🤍 Save College";
              this.classList.toggle("saved", savedNow);
            });
          }

        }

        document.getElementById('spaModalClose').onclick = () => {
          sModal.classList.remove('is-active');
          if (sTimer) {
            clearTimeout(sTimer);
            sTimer = null;
          }
          document.querySelectorAll('#spaSlider video').forEach(video => {
            video.pause();
            video.onended = null;
          });
        };

        // AI Search
        const searchOverlay = document.getElementById('aiSearchOverlay');
        const aiInput = document.getElementById('aiSmartInput');
        const aiResults = document.getElementById('aiSmartResults');
        const aiHeading = document.getElementById('aiSearchHeading');

        window.triggerAISearch = function (e) {
          if (e) { e.preventDefault(); e.stopPropagation(); }
          if (window.closeMenus) window.closeMenus();
          searchOverlay.style.display = 'flex';
          aiInput.value = '';
          if (!currentPlaceKey) {
            aiHeading.textContent = "Where do you want to study?";
            aiInput.placeholder = "Search places or colleges...";
            showPlacesList();
          } else {
            const placeName = placesData[currentPlaceKey] ? placesData[currentPlaceKey].name : currentPlaceKey;
            aiHeading.textContent = `Search in ${placeName}`;
            aiInput.placeholder = `Search colleges in ${placeName}...`;
            aiResults.innerHTML = '';
          }
          setTimeout(() => aiInput.focus(), 150);
        };

        window.closeAISearch = function () { searchOverlay.style.display = 'none'; };

        function showPlacesList() {
          const placesList = Object.keys(placesData).map(k => ({ key: k, name: placesData[k].name }));
          aiResults.innerHTML = placesList.map(p => `
            <div class="spa-search-item" onclick="selectAISearch('place', '${p.key}')">
              <strong>📍 ${p.name}</strong><span>Click to explore destination</span>
            </div>
          `).join('');
        }

        function levDist(a, b) {
          const mat = Array.from({ length: a.length + 1 }, () => []);
          for (let i = 0; i <= a.length; i++) mat[i][0] = i;
          for (let j = 0; j <= b.length; j++) mat[0][j] = j;
          for (let i = 1; i <= a.length; i++) {
            for (let j = 1; j <= b.length; j++) {
              const c = a[i - 1].toLowerCase() === b[j - 1].toLowerCase() ? 0 : 1;
              mat[i][j] = Math.min(mat[i - 1][j] + 1, mat[i][j - 1] + 1, mat[i - 1][j - 1] + c);
            }
          }
          return mat[a.length][b.length];
        }

        aiInput.addEventListener('input', function () {
          const q = this.value.trim().toLowerCase();
          if (!q) {
            if (!currentPlaceKey) showPlacesList();
            else aiResults.innerHTML = '';
            return;
          }
          let matches = [];
          if (!currentPlaceKey) {
            Object.keys(placesData).forEach(k => {
              if (placesData[k].name.toLowerCase().includes(q)) matches.push({ type: 'place', n: placesData[k].name, key: k, s: 100 });
            });
            window.rawCollegesCache.forEach(col => {
              let score = 0;
              if (col.name.toLowerCase().includes(q)) score += 10;
              col.name.toLowerCase().split(' ').forEach(w => { const dist = levDist(q, w); if (dist <= 2) score += (5 - dist); });
              if (score > 0) {
                const loc = col.type === 'district' ? `${col.district}, ${col.stateName}` : col.stateName;
                matches.push({ type: 'college', n: col.name, l: loc, key: col.stateKey, id: col.id, s: score });
              }
            });
          } else {
            window.rawCollegesCache.filter(c => c.stateKey === currentPlaceKey).forEach(col => {
              let score = 0;
              if (col.name.toLowerCase().includes(q)) score += 10;
              col.name.toLowerCase().split(' ').forEach(w => { const dist = levDist(q, w); if (dist <= 2) score += (5 - dist); });
              if (score > 0) {
                const loc = col.type === 'district' ? `${col.district}, ${col.stateName}` : col.stateName;
                matches.push({ type: 'college', n: col.name, l: loc, key: col.stateKey, id: col.id, s: score });
              }
            });
          }
          matches.sort((a, b) => b.s - a.s);
          if (matches.length > 0) {
            aiResults.innerHTML = matches.slice(0, 10).map(m => {
              if (m.type === 'place') {
                return `<div class="spa-search-item" onclick="selectAISearch('place', '${m.key}')">
                          <strong>📍 ${m.n}</strong><span>Click to explore destination</span>
                        </div>`;
              } else {
                return `<div class="spa-search-item" onclick="selectAISearch('college', '${m.key}', '${m.id}')">
                          <strong>🎓 ${m.n}</strong><span>📍 ${m.l}</span>
                        </div>`;
              }
            }).join('');
          } else {
            aiResults.innerHTML = `<div class="spa-search-item" style="cursor:default;"><span>No matching results found in this view</span></div>`;
          }
        });

        window.selectAISearch = function (type, placeKey, colId) {
          closeAISearch();
          if (type === 'place') {
            handlePlaceClick(null, placeKey);
          } else if (type === 'college') {
            if (currentPlaceKey !== placeKey) handlePlaceClick(null, placeKey);
            const colObj = window.rawCollegesCache.find(c => c.id === colId);
            if (colObj) {
              const locStr = colObj.type === 'district' ? `${colObj.district}, ${colObj.stateName}` : colObj.stateName;
              setTimeout(() => openModal(colObj, locStr), 350);
            }
          }
        };
  } catch (error) {
    console.error("Gregado Firebase initialization failed:", error);
  }
})();

// Additional mobile navigation handling and accessibility state.
(function () {
      "use strict";

      const getMobileDrawer = function () {
        return document.getElementById("mobileDrawer");
      };

      const getMobileMenuButton = function () {
        return document.getElementById("mobileMenuBtn");
      };

      window.toggleMobileMenu = function (button) {
        const drawer = getMobileDrawer();
        const menuButton = button || getMobileMenuButton();
        if (!drawer) return;

        const shouldOpen = !drawer.classList.contains("open");
        drawer.classList.toggle("open", shouldOpen);
        drawer.style.transform = shouldOpen ? "translateY(0%)" : "translateY(-150%)";
        drawer.style.visibility = shouldOpen ? "visible" : "hidden";
        drawer.setAttribute("aria-hidden", shouldOpen ? "false" : "true");

        if (menuButton) {
          menuButton.classList.toggle("is-active", shouldOpen);
          menuButton.setAttribute("aria-expanded", shouldOpen ? "true" : "false");
          menuButton.setAttribute("aria-label", shouldOpen ? "Close navigation" : "Open navigation");
        }
      };

      window.toggleMobileOffers = function (button) {
        const dropdown = document.getElementById("mobileOffersDropdown");
        const desktopList = document.getElementById("featuredDesktopDropdown");
        if (!dropdown) return;

        if (desktopList && desktopList.innerHTML.trim()) {
          dropdown.innerHTML = desktopList.innerHTML;
        }

        const shouldOpen = !dropdown.classList.contains("open");
        dropdown.classList.toggle("open", shouldOpen);
        if (button) button.setAttribute("aria-expanded", shouldOpen ? "true" : "false");
      };

      window.closeMenus = function () {
        if (typeof window.closeDesktopMenu === "function") {
          window.closeDesktopMenu();
        }

        const drawer = getMobileDrawer();
        if (drawer) {
          drawer.classList.remove("open");
          drawer.style.transform = "translateY(-150%)";
          drawer.style.visibility = "hidden";
          drawer.setAttribute("aria-hidden", "true");
        }

        const menuButton = getMobileMenuButton();
        if (menuButton) {
          menuButton.classList.remove("is-active");
          menuButton.setAttribute("aria-expanded", "false");
          menuButton.setAttribute("aria-label", "Open navigation");
        }

        const mobileFeatured = document.getElementById("mobileFeatured");
        if (mobileFeatured) mobileFeatured.classList.remove("active");

        const offersDropdown = document.getElementById("mobileOffersDropdown");
        if (offersDropdown) offersDropdown.classList.remove("open");

        const offersButton = document.getElementById("mobileOffersBtn");
        if (offersButton) offersButton.setAttribute("aria-expanded", "false");
      };

      document.addEventListener("click", function (event) {
        const drawer = getMobileDrawer();
        const target = event.target;
        if (!drawer || !drawer.classList.contains("open")) return;

        if (drawer.contains(target) || target.closest("#mobileMenuBtn") || target.closest("#mobileOffersWrap")) {
          return;
        }
        window.closeMenus();
      });

      document.addEventListener("click", function (event) {
        const offersWrap = document.getElementById("mobileOffersWrap");
        const offersDropdown = document.getElementById("mobileOffersDropdown");
        if (!offersWrap || !offersDropdown || !offersDropdown.classList.contains("open")) return;
        if (!offersWrap.contains(event.target)) {
          offersDropdown.classList.remove("open");
          const offersButton = document.getElementById("mobileOffersBtn");
          if (offersButton) offersButton.setAttribute("aria-expanded", "false");
        }
      });

      document.addEventListener("keydown", function (event) {
        if (event.key === "Escape") {
          window.closeMenus();
          const searchOverlay = document.getElementById("aiSearchOverlay");
          if (searchOverlay && searchOverlay.style.display !== "none" && typeof window.closeAISearch === "function") {
            window.closeAISearch();
          }
        }
      });

      window.addEventListener("resize", function () {
        if (window.innerWidth > 800) window.closeMenus();
      }, { passive: true });

      const drawer = getMobileDrawer();
      if (drawer) {
        drawer.classList.remove("open");
        drawer.style.transform = "translateY(-150%)";
        drawer.style.visibility = "hidden";
        drawer.setAttribute("aria-hidden", "true");
      }

      const menuButton = getMobileMenuButton();
      if (menuButton) {
        menuButton.setAttribute("aria-expanded", "false");
      }
    })();
