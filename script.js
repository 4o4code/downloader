/* =========================================================
   APK NOVA — script.js
   100% client-side. No backend, no APIs, no server calls.
   ========================================================= */

(() => {
  "use strict";

  /* ===================== App Data =====================
     Add new apps here. `file` must point to a real file
     inside the /apks/ folder relative to index.html.
  ======================================================= */
  const apps = [
    {
      id: "swiftnotes",
      name: "SwiftNotes",
      category: "Productivity",
      version: "3.2.1",
      size: "14 MB",
      updated: "2026-07-12",
      file: "apks/app-1.apk",
      description: "A fast, distraction-free note-taking app with folders, tags, and offline sync-ready storage."
    },
    {
      id: "pixelcraft",
      name: "PixelCraft",
      category: "Games",
      version: "1.8.0",
      size: "58 MB",
      updated: "2026-06-30",
      file: "apks/app-2.apk",
      description: "A relaxing block-building puzzle game with hundreds of hand-crafted levels and no forced timers."
    },
    {
      id: "studybuddy",
      name: "StudyBuddy",
      category: "Education",
      version: "2.0.4",
      size: "21 MB",
      updated: "2026-08-02",
      file: "apks/app-3.apk",
      description: "Flashcards, spaced repetition, and simple progress tracking to help you study anywhere."
    },
    {
      id: "clipvault",
      name: "ClipVault",
      category: "Utilities",
      version: "1.4.2",
      size: "9 MB",
      updated: "2026-05-18",
      file: "apks/app-4.apk",
      description: "A lightweight clipboard manager that keeps your recent copies organized and searchable."
    },
    {
      id: "tunefall",
      name: "TuneFall",
      category: "Entertainment",
      version: "4.1.0",
      size: "33 MB",
      updated: "2026-07-25",
      file: "apks/app-5.apk",
      description: "A local music player with a clean interface, custom equalizer, and gapless playback."
    },
    {
      id: "pockettools",
      name: "Pocket Tools",
      category: "Tools",
      version: "5.0.1",
      size: "12 MB",
      updated: "2026-08-10",
      file: "apks/app-6.apk",
      description: "A compact toolbox: unit converter, flashlight, QR scanner, and file inspector in one app."
    }
  ];

  const categories = ["All", "Tools", "Education", "Entertainment", "Games", "Productivity", "Utilities"];

  /* ===================== State ===================== */
  let activeCategory = "All";
  let searchQuery = "";

  /* ===================== DOM refs ===================== */
  const grid = document.getElementById("appGrid");
  const emptyState = document.getElementById("emptyState");
  const categoryBar = document.getElementById("categoryBar");
  const resultCount = document.getElementById("resultCount");
  const heroSearchInput = document.getElementById("heroSearchInput");
  const headerSearchInput = document.getElementById("headerSearchInput");
  const toast = document.getElementById("toast");
  const toastMessage = document.getElementById("toastMessage");

  /* ===================== Rendering ===================== */
  function initial(name) {
    return name.trim().slice(0, 2).toUpperCase();
  }

  function renderCategories() {
    categoryBar.innerHTML = categories.map((cat) => `
      <button class="chip" type="button" data-cat="${cat}" aria-pressed="${cat === activeCategory}">
        ${cat}
      </button>
    `).join("");
  }

  function matchesQuery(app, q) {
    if (!q) return true;
    const haystack = `${app.name} ${app.category} ${app.description} ${app.version}`.toLowerCase();
    return haystack.includes(q.toLowerCase());
  }

  function getFilteredApps() {
    return apps.filter((app) => {
      const inCategory = activeCategory === "All" || app.category === activeCategory;
      return inCategory && matchesQuery(app, searchQuery);
    });
  }

  function renderApps() {
    const filtered = getFilteredApps();

    if (resultCount) {
      resultCount.textContent = filtered.length === apps.length
        ? `${apps.length} apps available`
        : `${filtered.length} of ${apps.length} apps`;
    }

    if (filtered.length === 0) {
      grid.innerHTML = "";
      emptyState.classList.add("visible");
      return;
    }
    emptyState.classList.remove("visible");

    grid.innerHTML = filtered.map((app) => `
      <article class="app-card" data-id="${app.id}">
        <div class="app-card-top">
          <div class="app-icon" aria-hidden="true">${initial(app.name)}</div>
          <div class="app-meta">
            <h3>${app.name}</h3>
            <span class="cat">${app.category}</span>
          </div>
        </div>
        <p class="app-desc">${app.description}</p>
        <div class="app-facts">
          <span>Version <b>${app.version}</b></span>
          <span>Size <b>${app.size}</b></span>
        </div>
        <div class="app-card-actions">
          <button class="btn btn-ghost btn-sm" type="button" data-action="details" data-id="${app.id}">
            App Details
          </button>
          <a class="btn btn-primary btn-sm" href="${app.file}" download data-action="download" data-id="${app.id}">
            Download APK
          </a>
        </div>
      </article>
    `).join("");
  }

  /* ===================== Search ===================== */
  function handleSearchInput(value) {
    searchQuery = value;
    if (heroSearchInput && heroSearchInput.value !== value) heroSearchInput.value = value;
    if (headerSearchInput && headerSearchInput.value !== value) headerSearchInput.value = value;
    renderApps();
  }

  heroSearchInput?.addEventListener("input", (e) => handleSearchInput(e.target.value));
  headerSearchInput?.addEventListener("input", (e) => handleSearchInput(e.target.value));

  /* ===================== Category Filter ===================== */
  categoryBar?.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-cat]");
    if (!btn) return;
    activeCategory = btn.dataset.cat;
    renderCategories();
    renderApps();
  });

  /* ===================== Theme =====================
     Modes: "system" (follows prefers-color-scheme),
     "light", "dark". Manual choice persists in localStorage.
  ======================================================= */
  const THEME_KEY = "apknova-theme";
  const root = document.documentElement;
  const themeButtons = document.querySelectorAll("[data-theme-choice]");

  function applyTheme(mode) {
    if (mode === "system") {
      root.removeAttribute("data-theme");
    } else {
      root.setAttribute("data-theme", mode);
    }
    themeButtons.forEach((btn) => {
      btn.setAttribute("aria-pressed", String(btn.dataset.themeChoice === mode));
    });
  }

  function initTheme() {
    let saved = "system";
    try {
      saved = localStorage.getItem(THEME_KEY) || "system";
    } catch (err) {
      /* localStorage unavailable (private mode) — fall back to system */
    }
    applyTheme(saved);
  }

  themeButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const mode = btn.dataset.themeChoice;
      applyTheme(mode);
      try {
        localStorage.setItem(THEME_KEY, mode);
      } catch (err) {
        /* ignore write failures */
      }
    });
  });

  /* ===================== Modal ===================== */
  const modalOverlay = document.getElementById("detailsModal");
  const modalBody = document.getElementById("detailsModalBody");
  let lastFocusedEl = null;

  function openModal(overlay) {
    lastFocusedEl = document.activeElement;
    overlay.classList.add("open");
    overlay.setAttribute("aria-hidden", "false");
    const focusTarget = overlay.querySelector("[data-autofocus]") || overlay.querySelector("button, a");
    focusTarget?.focus();
    document.body.style.overflow = "hidden";
  }

  function closeModal(overlay) {
    overlay.classList.remove("open");
    overlay.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    lastFocusedEl?.focus();
  }

  document.querySelectorAll(".modal-overlay").forEach((overlay) => {
    overlay.addEventListener("click", (e) => {
      if (e.target === overlay || e.target.closest("[data-close]")) {
        closeModal(overlay);
      }
    });
    overlay.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeModal(overlay);
    });
  });

  function renderAppDetails(app) {
    modalBody.innerHTML = `
      <button class="icon-btn modal-close" type="button" data-close aria-label="Close dialog">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6 6 18M6 6l12 12"/></svg>
      </button>
      <div class="modal-head">
        <div class="app-icon" aria-hidden="true">${initial(app.name)}</div>
        <div>
          <h3>${app.name}</h3>
          <span class="cat">${app.category}</span>
        </div>
      </div>
      <p class="modal-desc">${app.description}</p>
      <div class="modal-facts">
        <div class="modal-fact"><span>Version</span><b>${app.version}</b></div>
        <div class="modal-fact"><span>APK size</span><b>${app.size}</b></div>
        <div class="modal-fact"><span>Last updated</span><b>${app.updated}</b></div>
        <div class="modal-fact"><span>Category</span><b>${app.category}</b></div>
      </div>
      <div class="safety-note">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z"/></svg>
        <span>Downloaded directly from this site's own <code>/apks</code> folder. No account, sign-up, or extra app required.</span>
      </div>
      <a class="btn btn-primary btn-block" href="${app.file}" download data-action="download" data-id="${app.id}" data-autofocus>
        Download APK — ${app.size}
      </a>
    `;
  }

  grid?.addEventListener("click", (e) => {
    const detailsBtn = e.target.closest('[data-action="details"]');
    const downloadEl = e.target.closest('[data-action="download"]');
    if (detailsBtn) {
      const app = apps.find((a) => a.id === detailsBtn.dataset.id);
      if (!app) return;
      renderAppDetails(app);
      openModal(modalOverlay);
    }
    if (downloadEl) {
      handleDownloadClick(downloadEl);
    }
  });

  modalBody?.addEventListener("click", (e) => {
    const downloadEl = e.target.closest('[data-action="download"]');
    if (downloadEl) handleDownloadClick(downloadEl);
  });

  /* Legal / info modals (Privacy, Terms, Disclaimer, About, Contact) */
  document.querySelectorAll("[data-open-modal]").forEach((trigger) => {
    trigger.addEventListener("click", () => {
      const targetId = trigger.getAttribute("data-open-modal");
      const overlay = document.getElementById(targetId);
      if (overlay) openModal(overlay);
    });
  });

  /* ===================== Download ===================== */
  function showToast(message) {
    if (!toast || !toastMessage) return;
    toastMessage.textContent = message;
    toast.classList.add("visible");
    clearTimeout(showToast._t);
    showToast._t = setTimeout(() => toast.classList.remove("visible"), 3200);
  }

  function handleDownloadClick(el) {
    const app = apps.find((a) => a.id === el.dataset.id);
    // The <a download> attribute performs the actual download natively.
    // This only adds a small, honest confirmation — no fake progress bars.
    showToast(app ? `Downloading ${app.name} (${app.size})…` : "Starting download…");
  }

  /* ===================== UI Animations ===================== */
  // Reveal-on-scroll for sections (skipped entirely if reduced motion is set)
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!prefersReducedMotion && "IntersectionObserver" in window) {
    const revealTargets = document.querySelectorAll("[data-reveal]");
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = "1";
          entry.target.style.transform = "none";
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealTargets.forEach((el) => {
      el.style.opacity = "0";
      el.style.transform = "translateY(16px)";
      el.style.transition = "opacity 0.5s ease, transform 0.5s ease";
      io.observe(el);
    });
  }

  /* Mobile compact search toggle */
  const mobileSearchToggle = document.getElementById("mobileSearchToggle");
  const mobileSearchBar = document.getElementById("mobileSearchBar");
  mobileSearchToggle?.addEventListener("click", () => {
    const isOpen = mobileSearchBar.classList.toggle("open");
    mobileSearchToggle.setAttribute("aria-expanded", String(isOpen));
    if (isOpen) mobileSearchBar.querySelector("input")?.focus();
  });

  /* ===================== Init ===================== */
  initTheme();
  renderCategories();
  renderApps();
})();
