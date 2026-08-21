(function () {
  "use strict";

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const hasGSAP = typeof gsap !== "undefined";

  /* ============================================================
     Elements
     ============================================================ */
  const introSplash = document.getElementById("intro-splash");
  const introSkip = document.getElementById("intro-skip");
  const introK = document.getElementById("intro-k");
  const introRing = document.getElementById("intro-ring");
  const introHint = document.getElementById("intro-hint");

  const profileScreen = document.getElementById("profile-screen");
  const browseScreen = document.getElementById("browse-screen");
  const rowsContainer = document.getElementById("rows-container");
  const heroSection = document.getElementById("hero");
  const topnav = document.getElementById("topnav");
  const currentAvatar = document.getElementById("current-avatar");
  const searchInput = document.getElementById("search-input");
  const profileSwitchContainer = document.getElementById("profile-switch");

  const overlay = document.getElementById("cinematic-overlay");
  const overlayBg = document.getElementById("overlay-bg");
  const overlayClose = document.getElementById("overlay-close");
  const overlayEyebrow = document.getElementById("overlay-eyebrow");
  const overlayTitle = document.getElementById("overlay-title");
  const overlaySubtitle = document.getElementById("overlay-subtitle");
  const overlayMeta = document.getElementById("overlay-meta");
  const overlayPlay = document.getElementById("overlay-play");
  const overlayMusic = document.getElementById("overlay-music");
  const overlayText = document.getElementById("overlay-text");
  const overlayToast = document.getElementById("overlay-toast");

  const lightbox = document.getElementById("image-lightbox");
  const lightboxClose = document.getElementById("lightbox-close");
  const lightboxStage = document.getElementById("lightbox-stage");

  const letterAudio = document.getElementById("letter-audio");
  const lockToast = document.getElementById("lock-toast");
  const profilesContainer = document.getElementById("profiles");

  let lastFocusedEl = null;
  let activeProfile = "kristina";
  let audioCtx = null;
  let toastTimer = null;
  let lockToastTimer = null;

  /* ============================================================
     Synthesized "ta-dum" sound effect (no external audio file)
     ============================================================ */
  function getAudioCtx() {
    if (!audioCtx) {
      const Ctx = window.AudioContext || window.webkitAudioContext;
      if (Ctx) audioCtx = new Ctx();
    }
    return audioCtx;
  }

  function tonalHit(ctx, time, freqStart, freqEnd, duration, gainPeak) {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(freqStart, time);
    osc.frequency.exponentialRampToValueAtTime(freqEnd, time + duration);
    gain.gain.setValueAtTime(0.0001, time);
    gain.gain.exponentialRampToValueAtTime(gainPeak, time + 0.03);
    gain.gain.exponentialRampToValueAtTime(0.0001, time + duration);
    osc.connect(gain).connect(ctx.destination);
    osc.start(time);
    osc.stop(time + duration + 0.05);
  }

  function playTadum() {
    const ctx = getAudioCtx();
    if (!ctx) return;
    if (ctx.state === "suspended") ctx.resume();
    const now = ctx.currentTime;
    tonalHit(ctx, now + 0.02, 180, 110, 0.22, 0.5);
    tonalHit(ctx, now + 0.32, 130, 55, 0.55, 0.7);
  }

  function unlockAudioOnce() {
    const ctx = getAudioCtx();
    if (ctx && ctx.state === "suspended") ctx.resume();
  }
  document.addEventListener("click", unlockAudioOnce, { once: true });
  document.addEventListener("touchstart", unlockAudioOnce, { once: true });

  /* ============================================================
     Intro sequence
     ============================================================ */
  function finishIntro() {
    try { sessionStorage.setItem("kflix_intro_seen", "1"); } catch (e) {}
    introSplash.classList.add("hidden");
    profileScreen.classList.remove("hidden");
    if (hasGSAP && !reduceMotion) {
      gsap.from(".profile-content > *", { opacity: 0, y: 16, duration: 0.5, stagger: 0.08, ease: "power2.out" });
    }
  }

  function runIntro() {
    let seen = false;
    try { seen = sessionStorage.getItem("kflix_intro_seen") === "1"; } catch (e) {}

    if (seen || reduceMotion || !hasGSAP) {
      introSplash.classList.add("hidden");
      profileScreen.classList.remove("hidden");
      return;
    }

    const tl = gsap.timeline({ onComplete: finishIntro });

    tl.to(introK, { opacity: 1, scale: 1, duration: 0.7, ease: "power3.out" })
      .to(introK, { backgroundPosition: "0% 0", duration: 0.9, ease: "power1.inOut" }, "<0.05")
      .add(() => playTadum(), "<0.1")
      .to(introRing, { opacity: 0.8, scale: 1, duration: 0.35, ease: "power2.out" }, "<")
      .to(introRing, { opacity: 0, scale: 2.4, duration: 0.7, ease: "power2.out" }, "<0.05")
      .to(introHint, { opacity: 1, duration: 0.4 }, "-=0.2")
      .to({}, { duration: 0.9 })
      .to([introK, introRing, introHint], { opacity: 0, duration: 0.4, ease: "power1.in" })
      .to(introSplash, { opacity: 0, duration: 0.4, ease: "power1.in" }, "<");

    introSkip.addEventListener("click", (e) => {
      e.stopPropagation();
      tl.kill();
      gsap.set(introSplash, { opacity: 1 });
      finishIntro();
    });
    introSplash.addEventListener("click", () => unlockAudioOnce());
  }

  /* ============================================================
     Media helpers (HEIC-aware)
     ============================================================ */
  function isHeic(src) {
    return /\.(heic|heif)(\?.*)?$/i.test(src || "");
  }

  async function resolveImageSrc(src) {
    if (!isHeic(src)) return src;
    if (typeof heic2any === "undefined") return src;
    try {
      const res = await fetch(src);
      const blob = await res.blob();
      const converted = await heic2any({ blob, toType: "image/jpeg", quality: 0.9 });
      return URL.createObjectURL(converted);
    } catch (err) {
      console.warn("HEIC conversion failed, falling back to original src", err);
      return src;
    }
  }

  /* ============================================================
     Toast (used when a Play button has no media configured yet)
     ============================================================ */
  function showToast(message) {
    clearTimeout(toastTimer);
    overlayToast.textContent = message;
    overlayToast.classList.add("show");
    toastTimer = setTimeout(() => overlayToast.classList.remove("show"), 3200);
  }

  function showLockToast(message) {
    clearTimeout(lockToastTimer);
    lockToast.textContent = message;
    lockToast.classList.add("show");
    lockToastTimer = setTimeout(() => lockToast.classList.remove("show"), 3000);
  }

  /* ============================================================
     Image lightbox — clean fullscreen viewer for photo items
     ============================================================ */
  async function openLightbox(src, title) {
    lightbox.classList.remove("hidden");
    lightboxStage.innerHTML = `<div class="media-placeholder">Loading photo…</div>`;
    const resolved = await resolveImageSrc(src);
    const img = document.createElement("img");
    img.src = resolved;
    img.alt = title || "";
    lightboxStage.innerHTML = "";
    lightboxStage.appendChild(img);
  }
  function closeLightbox() {
    lightbox.classList.add("hidden");
    lightboxStage.innerHTML = "";
  }
  lightboxClose.addEventListener("click", closeLightbox);
  lightbox.addEventListener("click", (e) => { if (e.target === lightbox) closeLightbox(); });

  /* ============================================================
     Unified cinematic overlay — every card (and the Letter) opens here
     ============================================================ */
  function buildParagraphs(text) {
    return (text || "")
      .split(/\n\s*\n/)
      .map((p) => p.trim())
      .filter(Boolean);
  }

  function openCinematicOverlay(item, opts) {
    opts = opts || {};
    lastFocusedEl = document.activeElement;

    overlay.classList.remove("hidden");
    document.body.style.overflow = "hidden";
    overlayToast.classList.remove("show");

    // --- Background layer ---
    overlayBg.innerHTML = "";
    let bgVideoEl = null;
    const media = item.media || {};
    if (media.src && (media.type === "video" || /\.(mp4|mov|webm)(\?.*)?$/i.test(media.src))) {
      bgVideoEl = document.createElement("video");
      bgVideoEl.src = media.src;
      bgVideoEl.autoplay = true;
      bgVideoEl.muted = true;
      bgVideoEl.loop = true;
      bgVideoEl.playsInline = true;
      overlayBg.appendChild(bgVideoEl);
      bgVideoEl.play().catch(() => {});
    } else if (media.src) {
      overlayBg.className = "overlay-bg " + (item.gradient || "poster-a");
      resolveImageSrc(media.src).then((resolved) => {
        const img = document.createElement("img");
        img.src = resolved;
        img.alt = "";
        overlayBg.appendChild(img);
      });
    } else {
      overlayBg.className = "overlay-bg " + (item.gradient || "poster-a");
    }
    if (bgVideoEl) overlayBg.className = "overlay-bg";

    // --- Text content ---
    overlayEyebrow.textContent = item.tag || "";
    overlayTitle.textContent = item.title || "";

    if (item.subtitle) {
      overlaySubtitle.textContent = item.subtitle;
      overlaySubtitle.classList.remove("hidden");
    } else {
      overlaySubtitle.classList.add("hidden");
    }

    overlayMeta.innerHTML = item.isSpecial ? "" : (item.blurb ? `<span>${item.blurb}</span>` : "");

    // --- Body text: letter gets a staggered reveal, everything else a simple fade ---
    overlayText.innerHTML = "";
    const bodyText = item.isSpecial ? item.letterText : item.synopsis;
    const paragraphs = buildParagraphs(bodyText);
    paragraphs.forEach((p) => {
      const pEl = document.createElement("p");
      pEl.textContent = p;
      if (!reduceMotion) pEl.classList.add("reveal-hidden");
      overlayText.appendChild(pEl);
    });

    const revealParagraphs = () => {
      const pEls = overlayText.querySelectorAll("p");
      if (hasGSAP && !reduceMotion) {
        gsap.to(pEls, {
          opacity: 1,
          y: 0,
          duration: 0.65,
          stagger: item.isSpecial ? 0.28 : 0.1,
          ease: "power2.out",
          delay: 0.35,
          onComplete: () => pEls.forEach((el) => el.classList.remove("reveal-hidden"))
        });
      } else {
        pEls.forEach((el) => el.classList.remove("reveal-hidden"));
      }
    };
    revealParagraphs();

    // --- Music toggle (only shown when a track is configured) ---
    letterAudio.pause();
    letterAudio.currentTime = 0;
    if (item.music) {
      letterAudio.src = item.music;
      overlayMusic.classList.remove("hidden");
      overlayMusic.textContent = "🎵 Music";
      overlayMusic.classList.remove("is-playing");
      overlayMusic.onclick = () => {
        if (letterAudio.paused) {
          letterAudio.play().catch(() => {});
          overlayMusic.textContent = "🔇 Mute";
          overlayMusic.classList.add("is-playing");
        } else {
          letterAudio.pause();
          overlayMusic.textContent = "🎵 Music";
          overlayMusic.classList.remove("is-playing");
        }
      };
    } else {
      overlayMusic.classList.add("hidden");
      overlayMusic.onclick = null;
    }

    // --- Play button: unmute background video / open photo / nudge to add media ---
    const setPlayLabel = (label) => { overlayPlay.textContent = label; };

    if (bgVideoEl) {
      setPlayLabel("▶ Play");
      overlayPlay.onclick = () => {
        if (bgVideoEl.muted) {
          bgVideoEl.muted = false;
          bgVideoEl.play().catch(() => {});
          setPlayLabel("🔇 Mute");
        } else {
          bgVideoEl.muted = true;
          setPlayLabel("▶ Play");
        }
      };
      if (opts.autoPlay) overlayPlay.onclick();
    } else if (media.src) {
      setPlayLabel("▶ View Photo");
      overlayPlay.onclick = () => openLightbox(media.src, item.title);
      if (opts.autoPlay) overlayPlay.onclick();
    } else {
      setPlayLabel("▶ Play");
      overlayPlay.onclick = () => showToast(`Add a video or photo in config.js for "${item.title}" to enable playback here.`);
    }

    if (hasGSAP && !reduceMotion) {
      gsap.fromTo(overlay, { opacity: 0 }, { opacity: 1, duration: 0.35, ease: "power2.out" });
      gsap.fromTo(
        ["#overlay-eyebrow", "#overlay-title", "#overlay-subtitle", "#overlay-meta", "#overlay-actions"].map((s) => document.querySelector(s)).filter(Boolean),
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, duration: 0.5, stagger: 0.06, ease: "power2.out", delay: 0.1 }
      );
    }

    overlayClose.focus();
  }

  function closeCinematicOverlay() {
    overlay.classList.add("hidden");
    document.body.style.overflow = "";
    overlayBg.querySelectorAll("video").forEach((v) => v.pause());
    overlayBg.innerHTML = "";
    letterAudio.pause();
    if (lastFocusedEl) lastFocusedEl.focus();
  }

  overlayClose.addEventListener("click", closeCinematicOverlay);
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      if (!lightbox.classList.contains("hidden")) { closeLightbox(); return; }
      if (!overlay.classList.contains("hidden")) closeCinematicOverlay();
    }
  });

  /* ============================================================
     Hero
     ============================================================ */
  function renderHero() {
    const h = SITE_CONFIG.hero;
    const eyebrow = SITE_CONFIG.personalization[activeProfile]?.heroEyebrow || h.eyebrow;
    const hasVideo = !!h.video;

    heroSection.innerHTML = `
      <div class="hero-bg ${h.poster}"></div>
      ${hasVideo ? `<video class="hero-video" id="hero-video-el" src="${h.video}" autoplay muted loop playsinline></video>` : ""}
      <div class="hero-content">
        <div class="hero-eyebrow" id="hero-eyebrow">${eyebrow}</div>
        <h1 class="hero-title">${h.title}</h1>
        <div class="hero-meta">${h.meta.map((m) => `<span>${m}</span>`).join("")}</div>
        <p class="hero-synopsis">${h.synopsis}</p>
        <div class="hero-actions">
          <button class="btn btn-primary" id="hero-play">▶ Play</button>
          <button class="btn btn-secondary" id="hero-info">ⓘ More Info</button>
        </div>
      </div>
    `;

    const heroItem = { id: "hero", title: h.title, synopsis: h.synopsis, blurb: h.tagline, tag: h.meta.join(" · "), gradient: h.poster, media: { type: "video", src: h.video } };

    const heroVideoEl = document.getElementById("hero-video-el");
    const heroPlayBtn = document.getElementById("hero-play");
    heroPlayBtn.addEventListener("click", () => {
      if (heroVideoEl) {
        if (heroVideoEl.muted) {
          heroVideoEl.muted = false;
          heroVideoEl.play().catch(() => {});
          heroPlayBtn.textContent = "🔇 Mute";
        } else {
          heroVideoEl.muted = true;
          heroPlayBtn.textContent = "▶ Play";
        }
      } else {
        showToast("Add a background video in config.js (hero.video) to enable playback with sound.");
        openCinematicOverlay(heroItem);
      }
    });
    document.getElementById("hero-info").addEventListener("click", () => openCinematicOverlay(heroItem));

    if (!reduceMotion) spawnEmbers();
  }

  function spawnEmbers() {
    const bg = heroSection.querySelector(".hero-bg");
    const count = 18;
    for (let i = 0; i < count; i++) {
      const ember = document.createElement("div");
      ember.className = "ember";
      ember.style.left = Math.random() * 100 + "%";
      ember.style.animationDuration = 6 + Math.random() * 8 + "s";
      ember.style.animationDelay = Math.random() * 10 + "s";
      bg.appendChild(ember);
    }
  }

  /* ============================================================
     Rows
     ============================================================ */
  function renderRows() {
    rowsContainer.innerHTML = "";
    SITE_CONFIG.rows.forEach((row) => {
      const rowEl = document.createElement("section");
      rowEl.className = "row";
      rowEl.dataset.rowId = row.id;

      let title = row.title;
      if (row.id === "continue-watching") {
        title = SITE_CONFIG.personalization[activeProfile]?.continueRow || row.title;
      }

      const trackId = `track-${row.id}`;
      rowEl.innerHTML = `
        <h2 class="row-title">${title}</h2>
        <div class="row-track-wrap">
          <button class="row-arrow left" aria-label="Scroll left">‹</button>
          <div class="row-track" id="${trackId}"></div>
          <button class="row-arrow right" aria-label="Scroll right">›</button>
        </div>
      `;
      rowsContainer.appendChild(rowEl);

      const track = rowEl.querySelector(".row-track");
      row.items.forEach((item) => {
        const card = buildCard(item, row.layout);
        track.appendChild(card);
      });

      const [leftArrow, rightArrow] = rowEl.querySelectorAll(".row-arrow");
      leftArrow.addEventListener("click", () => track.scrollBy({ left: -track.clientWidth * 0.85, behavior: "smooth" }));
      rightArrow.addEventListener("click", () => track.scrollBy({ left: track.clientWidth * 0.85, behavior: "smooth" }));
    });

    if (hasGSAP && !reduceMotion) {
      gsap.from(".row", { opacity: 0, y: 24, duration: 0.6, stagger: 0.08, ease: "power2.out", delay: 0.2 });
    }
  }

  function buildCard(item, layout) {
    const isWide = layout === "wide";
    const card = document.createElement("div");
    card.className = `card ${isWide ? "card-wide" : "card-poster"}${item.isSpecial ? " card-special" : ""}`;
    card.dataset.title = item.title.toLowerCase();
    card.tabIndex = 0;
    card.setAttribute("role", "button");
    card.setAttribute("aria-label", `${item.title} — open details`);

    const progressHTML =
      typeof item.progress === "number"
        ? `<div class="card-progress"><div class="card-progress-fill" style="width:0%" data-target="${item.progress}"></div></div>`
        : "";

    card.innerHTML = `
      <div class="card-art ${item.gradient}">
        ${item.badge ? `<span class="card-badge">${item.badge}</span>` : ""}
        <span class="card-title">${item.title}</span>
      </div>
      <div class="card-hover-info">
        <p class="card-hover-blurb">${item.blurb || ""}</p>
      </div>
      <button class="card-play-btn" aria-label="Play ${item.title}">▶</button>
      ${progressHTML}
    `;

    let hoverTimer = null;
    card.addEventListener("mouseenter", () => {
      hoverTimer = setTimeout(() => card.classList.add("is-hovering"), 350);
    });
    card.addEventListener("mouseleave", () => {
      clearTimeout(hoverTimer);
      card.classList.remove("is-hovering");
    });
    card.addEventListener("focusin", () => card.classList.add("is-hovering"));
    card.addEventListener("focusout", () => card.classList.remove("is-hovering"));

    const playBtn = card.querySelector(".card-play-btn");
    playBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      openCinematicOverlay(item, { autoPlay: true });
    });

    card.addEventListener("click", () => openCinematicOverlay(item));
    card.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        openCinematicOverlay(item);
      }
    });

    return card;
  }

  function animateProgressBars() {
    document.querySelectorAll(".card-progress-fill").forEach((fill) => {
      const target = fill.dataset.target;
      requestAnimationFrame(() => { fill.style.width = target + "%"; });
    });
  }

  /* ============================================================
     Profile picker — rendered from config (supports photos + locked profiles)
     ============================================================ */
  function avatarInnerHTML(profile) {
    return profile.photo
      ? `<img src="${profile.photo}" alt="${profile.label}" />`
      : `<span class="avatar-letter">${profile.initial}</span>`;
  }

  function renderProfilePicker() {
    profilesContainer.innerHTML = "";
    SITE_CONFIG.profiles.forEach((profile) => {
      const btn = document.createElement("button");
      btn.className = `profile${profile.locked ? " locked" : ""}`;
      btn.dataset.profile = profile.id;
      if (profile.locked) btn.setAttribute("aria-disabled", "true");

      btn.innerHTML = `
        <div class="avatar avatar-${profile.id}">
          ${avatarInnerHTML(profile)}
          ${profile.locked ? `<span class="lock-badge">🔒</span>` : ""}
        </div>
        <span>${profile.label}</span>
      `;

      btn.addEventListener("click", () => {
        if (profile.locked) {
          showLockToast(profile.lockMessage || "🔒 This profile isn't unlocked yet.");
          return;
        }
        enterBrowseAs(profile.id);
      });

      profilesContainer.appendChild(btn);
    });
  }

  function enterBrowseAs(profileId) {
    setActiveProfile(profileId);

    const doEnter = () => {
      profileScreen.classList.add("hidden");
      browseScreen.classList.remove("hidden");
      animateProgressBars();
      if (hasGSAP && !reduceMotion) {
        gsap.from(".hero-content > *", { opacity: 0, y: 20, duration: 0.5, stagger: 0.08, ease: "power2.out" });
      }
    };

    if (hasGSAP && !reduceMotion) {
      gsap.to(profileScreen, { opacity: 0, scale: 1.03, duration: 0.35, ease: "power1.in", onComplete: doEnter });
    } else {
      doEnter();
    }
  }

  /* ============================================================
     Profile switching (top nav) — also rendered from config
     ============================================================ */
  function renderNavSwitch() {
    profileSwitchContainer.innerHTML = "";
    SITE_CONFIG.profiles.forEach((profile) => {
      const btn = document.createElement("button");
      btn.className = `profile-switch-btn${profile.locked ? " locked" : ""}${profile.id === activeProfile ? " active" : ""}`;
      btn.dataset.profile = profile.id;
      btn.setAttribute("aria-label", `Switch to ${profile.label}'s profile`);
      btn.innerHTML = profile.photo ? `<img src="${profile.photo}" alt="${profile.label}" />` : profile.initial;

      btn.addEventListener("click", () => {
        if (profile.locked) {
          showLockToast(profile.lockMessage || "🔒 This profile isn't unlocked yet.");
          return;
        }
        setActiveProfile(profile.id);
      });

      profileSwitchContainer.appendChild(btn);
    });
  }

  function setActiveProfile(profileId) {
    activeProfile = profileId;
    const profile = SITE_CONFIG.profiles.find((p) => p.id === profileId) || SITE_CONFIG.profiles[0];

    currentAvatar.innerHTML = profile.photo ? `<img src="${profile.photo}" alt="${profile.label}" />` : profile.initial;

    document.querySelectorAll(".profile-switch-btn").forEach((btn) => {
      btn.classList.toggle("active", btn.dataset.profile === profileId);
    });

    const eyebrowEl = document.getElementById("hero-eyebrow");
    if (eyebrowEl) eyebrowEl.textContent = SITE_CONFIG.personalization[profileId]?.heroEyebrow || SITE_CONFIG.hero.eyebrow;

    const continueTitle = document.querySelector('.row[data-row-id="continue-watching"] .row-title');
    if (continueTitle) continueTitle.textContent = SITE_CONFIG.personalization[profileId]?.continueRow || "Continue Watching";
  }

  /* ============================================================
     Sticky nav background on scroll
     ============================================================ */
  window.addEventListener("scroll", () => {
    if (!topnav) return;
    topnav.classList.toggle("scrolled", window.scrollY > 40);
  });

  /* ============================================================
     Search / filter
     ============================================================ */
  if (searchInput) {
    searchInput.addEventListener("input", () => {
      const q = searchInput.value.trim().toLowerCase();
      document.querySelectorAll(".row").forEach((rowEl) => {
        let visibleCount = 0;
        rowEl.querySelectorAll(".card").forEach((card) => {
          const match = !q || card.dataset.title.includes(q);
          card.style.display = match ? "" : "none";
          if (match) visibleCount++;
        });
        rowEl.classList.toggle("no-results", visibleCount === 0);
      });
    });
  }

  /* ============================================================
     Init
     ============================================================ */
  renderHero();
  renderRows();
  renderProfilePicker();
  renderNavSwitch();
  runIntro();
})();
