// @ts-nocheck
(function () {
  "use strict";

  const APP_DATA = {
    STORAGE_KEY: "shawarma_app_v2",

    BG_COLORS: [
      "linear-gradient(135deg,#FEF3C7 0%,#FDE68A 100%)",
      "linear-gradient(135deg,#FFF7ED 0%,#FED7AA 100%)",
      "linear-gradient(135deg,#FEF9C3 0%,#FEF08A 100%)",
      "linear-gradient(135deg,#ECFDF5 0%,#A7F3D0 100%)",
      "linear-gradient(135deg,#EFF6FF 0%,#BFDBFE 100%)",
      "linear-gradient(135deg,#FDF4FF 0%,#E9D5FF 100%)",
    ],

    DEFAULT_STATE: {
      pw: "123b5e645ffc86f81a6cdd5726cb2a79dcbf5a4ef82cbc1dfc0790276340b313",
      logo: null,
      heroTitle: "شاورما المهند",
      heroSub: "أشهى شاورما بالفحم — طعم الأصالة بكل لقمة 🔥",
      socials: {
        fb: "https://www.facebook.com/mohanadresturant",
        ig: "https://www.instagram.com/mohanad_resturant/",
        wa: "972593311135"
      },
      menus: [
        { id: "m1", name: "شاورما دجاج", icon: "🍗", img: null },
        { id: "m2", name: "شاورما لحم", icon: "🥩", img: null },
        { id: "m3", name: "مشاوي وأطباق", icon: "🔥", img: null },
        { id: "m4", name: "مشروبات", icon: "🥤", img: null },
      ],
      items: [
        {
          id: "i1",
          name: "شاورما دجاج عادية",
          desc: "شاورما دجاج مشوي بالتوابل الأصيلة مع الثوم والخضار الطازجة",
          price: 20,
          menuId: "m1",
          img: null,
          badge: "الأكثر طلباً",
        },
        {
          id: "i2",
          name: "شاورما دجاج حارة",
          desc: "لمن يحب الحرارة — دجاج مشوي مع صلصة الفلفل الحار والسماق",
          price: 22,
          menuId: "m1",
          img: null,
          badge: "",
        },
        {
          id: "i3",
          name: "شاورما دجاج بالجبن",
          desc: "دجاج مشوي مع جبن مذوّب وثوم بلدي وبقدونس طازج",
          price: 24,
          menuId: "m1",
          img: null,
          badge: "جديد",
        },
        {
          id: "i4",
          name: "شاورما دجاج بالكريمة",
          desc: "دجاج ناعم بصلصة الكريمة والفطر المشوي",
          price: 26,
          menuId: "m1",
          img: null,
          badge: "",
        },
        {
          id: "i5",
          name: "شاورما لحم عادية",
          desc: "لحم غنم مشوي على الفحم مع الطحينة والبهارات الدمشقية",
          price: 26,
          menuId: "m2",
          img: null,
          badge: "الأكثر طلباً",
        },
        {
          id: "i6",
          name: "شاورما لحم حارة",
          desc: "لحم مشوي مع فلفل حار وبهارات الشرق الأوسط",
          price: 28,
          menuId: "m2",
          img: null,
          badge: "",
        },
        {
          id: "i7",
          name: "شاورما لحم مشكل",
          desc: "مزيج لحم الغنم والدجاج مع الطحينة والبرغل",
          price: 32,
          menuId: "m2",
          img: null,
          badge: "مميز",
        },
        {
          id: "i8",
          name: "كباب مشوي",
          desc: "كباب لحم بهارات طازجة مشوي على جمر الفحم يُقدّم مع الأرز والسلطة",
          price: 35,
          menuId: "m3",
          img: null,
          badge: "عرض اليوم",
        },
        {
          id: "i9",
          name: "شيش طاووق",
          desc: "صدر دجاج متبّل في الزبادي والليمون مشوي ذهبياً",
          price: 32,
          menuId: "m3",
          img: null,
          badge: "",
        },
        {
          id: "i10",
          name: "طبق مشاوي مشكل",
          desc: "كباب وشيش طاووق وشاورما مع مقبلات شرقية وخبز مشوي",
          price: 55,
          menuId: "m3",
          img: null,
          badge: "مميز",
        },
        {
          id: "i11",
          name: "عصير ليمون نعناع",
          desc: "ليمون طازج بالنعناع والثلج المجروش — منعش ومثالي",
          price: 12,
          menuId: "m4",
          img: null,
          badge: "",
        },
        {
          id: "i12",
          name: "لبن أيران",
          desc: "لبن مملّح بارد — الرفيق التقليدي للشاورما",
          price: 8,
          menuId: "m4",
          img: null,
          badge: "",
        },
        {
          id: "i13",
          name: "مياه معدنية",
          desc: "مياه معدنية باردة 500 مل",
          price: 4,
          menuId: "m4",
          img: null,
          badge: "",
        },
      ],
    },
  };

  /* ════════════════════════════════
   0. PASSWORD HASHING
   ════════════════════════════════ */
  async function hashPassword(password) {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
  }

  async function validatePassword(inputPassword, storedHash) {
    const inputHash = await hashPassword(inputPassword);
    return inputHash === storedHash;
  }

  /* ════════════════════════════════
   1. STORAGE BACKEND (localStorage)
   ════════════════════════════════ */
  const STORAGE_KEY = APP_DATA.STORAGE_KEY;
  const DEFAULT_STATE = APP_DATA.DEFAULT_STATE;
  const BG_COLORS = APP_DATA.BG_COLORS;

  /* ─ load/save ─ */
  function loadState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) return JSON.parse(raw);
    } catch (e) {}
    return JSON.parse(JSON.stringify(DEFAULT_STATE));
  }
  function saveState() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(S));
      showSync("synced", "تم الحفظ ✓");
      setTimeout(() => showSync("idle"), 2000);
    } catch (e) {
      showSync("error", "فشل الحفظ — المساحة ممتلئة");
    }
  }
  function showSync(status, msg) {
    const el = document.getElementById("syncIndicator");
    const dot = el.querySelector(".dot");
    const txt = el.querySelector(".sync-text");
    if (status === "idle") {
      el.classList.remove("show");
      return;
    }
    el.className = "show " + status;
    txt.textContent = msg || "";
  }

  /* ════════════════════════════════
   2. STATE
   ════════════════════════════════ */
  let S = loadState();
  let activeMenuId = S.menus[0]?.id || null;

  /* image buffer (not persisted as-is — already base64 in state) */
  const imgBuf = {
    _menuImg: null,
    _addImg: null,
    _editImg: null,
    _editMenuImg: null,
  };

  /* ════════════════════════════════
   3. RENDER ENGINE
   ════════════════════════════════ */
  function render() {
    if (!activeMenuId && S.menus.length) activeMenuId = S.menus[0].id;
    renderNav();
    renderSections();
    renderLogo();
    renderSocials();
    renderWhatsAppFloat();
    renderWatermark();
    updateFavicon();
    renderHeroText();
  }

  function renderHeroText() {
    const t = document.getElementById("heroTitle");
    const s = document.getElementById("heroSub");
    if (t) t.textContent = S.heroTitle || "شاورما المهند";
    if (s) s.textContent = S.heroSub || "";
    
    const ft = document.getElementById("footerTitle");
    if (ft) ft.textContent = S.heroTitle || "شاورما المهند";
  }

  function renderNav() {
    const nav = document.getElementById("navInner");
    if (!nav) return;
    if (!S.menus.length) {
      nav.innerHTML =
        '<span style="padding:14px 16px;font-size:.87rem;color:var(--g400)">لا توجد قوائم</span>';
      return;
    }
    nav.innerHTML = S.menus
      .map(
        (m) => `
    <button class="nav-btn${m.id === activeMenuId ? " active" : ""}" data-menu="${m.id}">
      <span class="nav-icon">${m.icon}</span> ${m.name}
    </button>`,
      )
      .join("");
    nav.querySelectorAll(".nav-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        activeMenuId = btn.dataset.menu;
        render();
        document
          .getElementById("mainContent")
          .scrollIntoView({ behavior: "smooth", block: "start" });
      });
    });
  }

  function renderSections() {
    const main = document.getElementById("mainContent");
    if (!main) return;
    main.innerHTML = S.menus
      .map((m, mi) => {
        const items = S.items.filter((i) => i.menuId === m.id);
        const bg = BG_COLORS[mi % BG_COLORS.length];
        const cards = items.length
          ? items.map((it) => renderCard(it, m)).join("")
          : renderEmpty(m);
        return `<div class="menu-sec${m.id === activeMenuId ? " active" : ""}" id="ms_${m.id}">
      ${renderBanner(m, bg, items.length)}
      <div class="items-grid">${cards}</div>
    </div>`;
      })
      .join("");
  }

  function renderBanner(m, bg, count) {
    const img = m.img
      ? `<img class="cat-banner-img" src="${m.img}" alt="${m.name}">`
      : `<div class="cat-banner-ph" style="background:${bg}"><span style="animation:float 3s ease-in-out infinite;display:block;font-size:5rem">${m.icon}</span></div>`;
    return `<div class="cat-banner">
    ${img}
    <div class="cat-banner-overlay">
      <div class="cat-banner-title">${m.icon} ${m.name}</div>
      <div class="cat-banner-count">${count} صنف متاح</div>
    </div>
  </div>`;
  }

  function renderCard(it, m) {
    const waNum = (S.socials?.wa || "").replace(/\D/g, "");
    const msg = encodeURIComponent(
      `مرحباً، أود طلب: ${it.name} - السعر: ₪${(+it.price).toFixed(1)}`,
    );
    const waLink = waNum ? `https://wa.me/${waNum}?text=${msg}` : "#";
    const orderBtn = waNum
      ? `<a class="order-btn" href="${waLink}" target="_blank" rel="noopener">
         <svg viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 00-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
         اطلب الآن
       </a>`
      : "";
    const badge = it.badge ? `<div class="item-badge">${it.badge}</div>` : "";
    return `<div class="item-card">
    <div class="item-img-wrap">
      ${badge}
      ${it.img ? `<img class="item-img" src="${it.img}" alt="${it.name}">` : `<div class="item-ph" style="background:${BG_COLORS[S.menus.indexOf(m) % BG_COLORS.length]}">${m.icon}</div>`}
    </div>
    <div class="item-body">
      <div class="item-name">${it.name}</div>
      <div class="item-desc">${it.desc || "لا يوجد وصف"}</div>
      <div class="price-row">
        <span class="item-price">₪ ${(+it.price).toFixed(1)}</span>
        ${orderBtn}
      </div>
    </div>
  </div>`;
  }

  function renderEmpty(m) {
    return `<div class="empty"><div class="empty-icon">${m.icon}</div><p class="empty-txt">لا توجد أصناف في هذه القائمة بعد</p></div>`;
  }

  function renderLogo() {
    const img = document.getElementById("logoImg");
    const em = document.getElementById("logoEmoji");
    if (img && em) {
      if (S.logo) {
        img.src = S.logo;
        img.style.display = "block";
        em.style.display = "none";
      } else {
        img.style.display = "none";
        em.style.display = "block";
      }
    }

    const fImg = document.getElementById("footerLogoImg");
    const fEm = document.getElementById("footerLogoEmoji");
    if (fImg && fEm) {
      if (S.logo) {
        fImg.src = S.logo;
        fImg.style.display = "block";
        fEm.style.display = "none";
      } else {
        fImg.style.display = "none";
        fEm.style.display = "block";
      }
    }
  }

  function renderWatermark() {
    const wImg = document.getElementById("heroWatermarkImg");
    const wEmoji = document.getElementById("heroWatermarkEmoji");
    if (S.logo) {
      wImg.src = S.logo;
      wImg.style.display = "block";
      wEmoji.style.display = "none";
    } else {
      wImg.style.display = "none";
      wEmoji.style.display = "block";
    }
    const wm = document.getElementById("pageWatermark");
    const eg = document.getElementById("pageWatermarkEmoji");
    if (!wm) return;
    if (S.logo) {
      wm.style.setProperty("--wm-url", `url("${S.logo}")`);
      eg.style.display = "none";
    } else {
      wm.style.setProperty("--wm-url", "none");
      eg.style.display = "";
      if (!eg.innerHTML)
        eg.innerHTML = Array(120).fill("<span>🌯</span>").join("");
    }
  }

  function renderSocials() {
    const el = document.getElementById("heroSocials");
    if (!el) return;
    const sc = S.socials || {};
    let html = "";
    if (sc.fb)
      html += `<a class="hero-social-btn fb" href="${sc.fb}" target="_blank" rel="noopener" title="فيسبوك"><svg viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg></a>`;
    if (sc.ig)
      html += `<a class="hero-social-btn ig" href="${sc.ig}" target="_blank" rel="noopener" title="انستقرام"><svg viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg></a>`;
    if (sc.wa)
      html += `<a class="hero-social-btn wa" href="https://wa.me/${sc.wa.replace(/\D/g, "")}" target="_blank" rel="noopener" title="واتساب"><svg viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 00-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg></a>`;
    el.innerHTML = html;
    el.style.display = sc.fb || sc.ig || sc.wa ? "flex" : "none";
  }

  function renderWhatsAppFloat() {
    const btn = document.getElementById("whatsappFloat");
    if (!btn) return;
    const waNum = (S.socials?.wa || "").replace(/\D/g, "");
    if (waNum && waNum.length >= 10) {
      btn.href = `https://wa.me/${waNum}`;
      btn.style.display = "flex";
    } else {
      btn.style.display = "none";
    }
  }

  function updateFavicon() {
    const fav = document.getElementById("siteFavicon");
    if (!fav) return;
    if (S.logo) {
      fav.href = S.logo;
      return;
    }
    const c = document.createElement("canvas");
    c.width = c.height = 64;
    const ctx = c.getContext("2d");
    ctx.font = "52px serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("🌯", 32, 34);
    fav.href = c.toDataURL("image/png");
  }

  /* ════════════════════════════════
   4. TOAST
   ════════════════════════════════ */
  let _toastTimer = null;
  function showToast(msg, type = "success", dur = 2800) {
    const el = document.getElementById("statusToast");
    if (!el) return;
    el.textContent = msg;
    el.className = "show " + type;
    clearTimeout(_toastTimer);
    _toastTimer = setTimeout(() => {
      el.className = "";
    }, dur);
  }

  /* ════════════════════════════════
   5. OVERLAY HELPERS
   ════════════════════════════════ */
  function openOv(id) {
    document.getElementById(id)?.classList.add("open");
  }
  function closeOv(id) {
    document.getElementById(id)?.classList.remove("open");
  }

  /* close buttons (data-close="ovId") */
  document.addEventListener("click", (e) => {
    const t = e.target.closest("[data-close]");
    if (t) closeOv(t.dataset.close);
    /* click backdrop to close */
    if (e.target.classList.contains("ov")) closeOv(e.target.id);
  });

  /* ════════════════════════════════
   6. IMAGE PREVIEW HELPER
   ════════════════════════════════ */
  function bindImgInput(inputId, prevId, bufKey) {
    document.getElementById(inputId)?.addEventListener("change", function () {
      const f = this.files[0];
      if (!f) return;
      const r = new FileReader();
      r.onload = (ev) => {
        imgBuf[bufKey] = ev.target.result;
        const p = document.getElementById(prevId);
        if (p) {
          p.src = ev.target.result;
          p.style.display = "block";
        }
      };
      r.readAsDataURL(f);
    });
  }
  bindImgInput("menuImgFile", "menuImgPrev", "_menuImg");
  bindImgInput("iImgFile", "iImgPrev", "_addImg");
  bindImgInput("eImgFile", "eImgPrev", "_editImg");
  bindImgInput("eMImgFile", "eMImgPrev", "_editMenuImg");

  /* ════════════════════════════════
   7. ADMIN TABS
   ════════════════════════════════ */
  document.querySelectorAll(".atab").forEach((tab) => {
    tab.addEventListener("click", function () {
      const parent = this.closest(".mbd");
      parent
        .querySelectorAll(".atab")
        .forEach((t) => t.classList.remove("active"));
      parent
        .querySelectorAll(".asec")
        .forEach((s) => s.classList.remove("active"));
      this.classList.add("active");
      const sec = this.dataset.sec;
      document.getElementById("sec-" + sec)?.classList.add("active");
      if (sec === "items") rAdminItems();
      if (sec === "add") popMenuSels();
      if (sec === "settings") fillSettings();
    });
  });

  /* ════════════════════════════════
   8. LOGIN
   ════════════════════════════════ */
  
  document.getElementById("logoWrap").addEventListener("click", openLogin);
  function openLogin() {
    document.getElementById("pwIn").value = "";
    document.getElementById("pwErr").style.display = "none";
    openOv("loginOv");
    setTimeout(() => document.getElementById("pwIn").focus(), 200);
  }
  document.getElementById("loginBtn").addEventListener("click", checkPw);
  document.getElementById("pwIn").addEventListener("keydown", (e) => {
    if (e.key === "Enter") checkPw();
  });
  async function checkPw() {
    const inputPassword = document.getElementById("pwIn").value;
    const storedHash = S.pw;
    const inputHash = await hashPassword(inputPassword);
    
    console.log("Input Password:", inputPassword);
    console.log("Input Hash:", inputHash);
    console.log("Stored Hash:", storedHash);
    console.log("Match:", inputHash === storedHash);
    
    const isValid = await validatePassword(inputPassword, storedHash);
    if (isValid) {
      closeOv("loginOv");
      openOv("adminOv");
      rMenusList();
      rAdminItems();
      popMenuSels();
    } else {
      document.getElementById("pwErr").style.display = "block";
      document.getElementById("pwIn").select();
    }
  }

  /* ════════════════════════════════
   9. MENUS CRUD
   ════════════════════════════════ */
  function rMenusList() {
    const el = document.getElementById("menusList");
    if (!S.menus.length) {
      el.innerHTML =
        '<p style="color:var(--g400);text-align:center;padding:12px;font-size:.84rem">لا توجد قوائم بعد</p>';
      return;
    }
    el.innerHTML = S.menus
      .map(
        (m) => `
    <div class="litem">
      <div class="lthumb">${m.img ? `<img src="${m.img}">` : m.icon}</div>
      <div class="linfo">
        <div class="lname">${m.name}</div>
        <div class="lmeta">${S.items.filter((i) => i.menuId === m.id).length} صنف</div>
      </div>
      <div class="lacts">
        <button class="btn btn-g btn-sm" data-action="editMenu" data-id="${m.id}">تعديل</button>
        <button class="btn btn-d btn-sm" data-action="delMenu" data-id="${m.id}">حذف</button>
      </div>
    </div>`,
      )
      .join("");
  }

  document.getElementById("addMenuBtn").addEventListener("click", () => {
    const n = document.getElementById("newMName").value.trim();
    const ic = document.getElementById("newMIcon").value.trim() || "🌯";
    if (!n) {
      showToast("أدخل اسم القائمة", "error");
      return;
    }
    S.menus.push({
      id: "m" + Date.now(),
      name: n,
      icon: ic,
      img: imgBuf._menuImg || null,
    });
    imgBuf._menuImg = null;
    saveState();
    render();
    rMenusList();
    popMenuSels();
    document.getElementById("newMName").value = "";
    document.getElementById("newMIcon").value = "";
    const prev = document.getElementById("menuImgPrev");
    if (prev) prev.style.display = "none";
    document.getElementById("menuImgFile").value = "";
    showToast("✅ تم إضافة القائمة!");
  });

  /* delegated menu actions */
  document.getElementById("menusList").addEventListener("click", (e) => {
    const btn = e.target.closest("[data-action]");
    if (!btn) return;
    const { action, id } = btn.dataset;
    if (action === "editMenu") openEditMenu(id);
    if (action === "delMenu") delMenu(id);
  });

  function delMenu(id) {
    if (!confirm("حذف هذه القائمة وجميع أصنافها؟")) return;
    S.menus = S.menus.filter((m) => m.id !== id);
    S.items = S.items.filter((i) => i.menuId !== id);
    activeMenuId = S.menus[0]?.id || null;
    saveState();
    render();
    rMenusList();
    rAdminItems();
  }

  function openEditMenu(id) {
    const m = S.menus.find((x) => x.id === id);
    if (!m) return;
    imgBuf._editMenuImg = m.img;
    document.getElementById("eMId").value = id;
    document.getElementById("eMName").value = m.name;
    document.getElementById("eMIcon").value = m.icon;
    const prev = document.getElementById("eMImgPrev");
    if (m.img) {
      prev.src = m.img;
      prev.style.display = "block";
    } else {
      prev.style.display = "none";
    }
    document.getElementById("eMImgFile").value = "";
    closeOv("adminOv");
    openOv("editMenuOv");
  }

  document.getElementById("updateMenuBtn").addEventListener("click", () => {
    const id = document.getElementById("eMId").value;
    const m = S.menus.find((x) => x.id === id);
    if (!m) return;
    m.name = document.getElementById("eMName").value.trim() || m.name;
    m.icon = document.getElementById("eMIcon").value.trim() || m.icon;
    if (imgBuf._editMenuImg) m.img = imgBuf._editMenuImg;
    imgBuf._editMenuImg = null;
    saveState();
    render();
    closeOv("editMenuOv");
    openOv("adminOv");
    rMenusList();
    showToast("✅ تم تعديل القائمة!");
  });

  /* ════════════════════════════════
   10. ITEMS CRUD
   ════════════════════════════════ */
  function rAdminItems() {
    const el = document.getElementById("adminItems");
    if (!S.items.length) {
      el.innerHTML =
        '<p style="color:var(--g400);text-align:center;padding:12px;font-size:.84rem">لا توجد أصناف بعد</p>';
      return;
    }
    el.innerHTML = S.items
      .map((it) => {
        const m = S.menus.find((x) => x.id === it.menuId);
        return `<div class="litem">
      <div class="lthumb">${it.img ? `<img src="${it.img}">` : m?.icon || "🌯"}</div>
      <div class="linfo">
        <div class="lname">${it.name}</div>
        <div class="lmeta">${m?.name || ""} · ₪${(+it.price).toFixed(1)}${it.badge ? " · " + it.badge : ""}</div>
      </div>
      <div class="lacts">
        <button class="btn btn-g btn-sm" data-action="editItem" data-id="${it.id}">تعديل</button>
        <button class="btn btn-d btn-sm" data-action="delItem"  data-id="${it.id}">حذف</button>
      </div>
    </div>`;
      })
      .join("");
  }

  /* delegated item actions */
  document.getElementById("adminItems").addEventListener("click", (e) => {
    const btn = e.target.closest("[data-action]");
    if (!btn) return;
    const { action, id } = btn.dataset;
    if (action === "editItem") openEdit(id);
    if (action === "delItem") delItem(id);
  });

  function popMenuSels() {
    const opts = S.menus
      .map((m) => `<option value="${m.id}">${m.icon} ${m.name}</option>`)
      .join("");
    ["iMenu", "eMenu"].forEach((id) => {
      const el = document.getElementById(id);
      if (el) el.innerHTML = opts;
    });
  }

  document.getElementById("saveItemBtn").addEventListener("click", () => {
    const n = document.getElementById("iName").value.trim();
    const p = parseFloat(document.getElementById("iPrice").value);
    const mId = document.getElementById("iMenu").value;
    if (!n) {
      showToast("أدخل اسم الصنف", "error");
      return;
    }
    if (!mId) {
      showToast("اختر القائمة", "error");
      return;
    }
    S.items.push({
      id: "i" + Date.now(),
      name: n,
      desc: document.getElementById("iDesc").value.trim(),
      price: isNaN(p) ? 0 : p,
      menuId: mId,
      img: imgBuf._addImg || null,
      badge: document.getElementById("iBadge").value,
    });
    imgBuf._addImg = null;
    saveState();
    render();
    rAdminItems();
    resetAdd();
    showToast("✅ تم إضافة الصنف بنجاح!");
  });

  document.getElementById("resetAddBtn").addEventListener("click", resetAdd);
  function resetAdd() {
    ["iName", "iDesc", "iPrice"].forEach((id) => {
      const el = document.getElementById(id);
      if (el) el.value = "";
    });
    document.getElementById("iBadge").value = "";
    const prev = document.getElementById("iImgPrev");
    if (prev) prev.style.display = "none";
    const file = document.getElementById("iImgFile");
    if (file) file.value = "";
    imgBuf._addImg = null;
  }

  function delItem(id) {
    if (!confirm("حذف هذا الصنف نهائياً؟")) return;
    S.items = S.items.filter((i) => i.id !== id);
    saveState();
    render();
    rAdminItems();
  }

  function openEdit(id) {
    const it = S.items.find((i) => i.id === id);
    if (!it) return;
    imgBuf._editImg = it.img;
    document.getElementById("eId").value = id;
    document.getElementById("eName").value = it.name;
    document.getElementById("eDesc").value = it.desc || "";
    document.getElementById("ePrice").value = it.price;
    document.getElementById("eBadge").value = it.badge || "";
    popMenuSels();
    document.getElementById("eMenu").value = it.menuId;
    const prev = document.getElementById("eImgPrev");
    if (it.img) {
      prev.src = it.img;
      prev.style.display = "block";
    } else {
      prev.style.display = "none";
    }
    document.getElementById("eImgFile").value = "";
    closeOv("adminOv");
    openOv("editOv");
  }

  document.getElementById("updateItemBtn").addEventListener("click", () => {
    const id = document.getElementById("eId").value;
    const it = S.items.find((i) => i.id === id);
    if (!it) return;
    it.name = document.getElementById("eName").value.trim() || it.name;
    it.desc = document.getElementById("eDesc").value.trim();
    it.price = parseFloat(document.getElementById("ePrice").value) || it.price;
    it.menuId = document.getElementById("eMenu").value || it.menuId;
    it.badge = document.getElementById("eBadge").value;
    if (imgBuf._editImg) it.img = imgBuf._editImg;
    imgBuf._editImg = null;
    saveState();
    render();
    closeOv("editOv");
    openOv("adminOv");
    rAdminItems();
    showToast("✅ تم حفظ التعديلات!");
  });

  /* ════════════════════════════════
   11. SETTINGS
   ════════════════════════════════ */
  function fillSettings() {
    const sc = S.socials || {};
    document.getElementById("socialFb").value = sc.fb || "";
    document.getElementById("socialIg").value = sc.ig || "";
    document.getElementById("socialWa").value = sc.wa || "";
    document.getElementById("sName").value = S.heroTitle || "";
    document.getElementById("sDesc").value = S.heroSub || "";
    updateWaPreview();
  }

  document
    .getElementById("socialWa")
    .addEventListener("input", updateWaPreview);
  function updateWaPreview() {
    const num = document.getElementById("socialWa").value.replace(/\D/g, "");
    const wrap = document.getElementById("waPreviewWrap");
    if (!wrap) return;
    if (num.length >= 10) {
      wrap.innerHTML = `<div class="wa-preview"><svg viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 00-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>wa.me/${num} ✓</div>`;
    } else {
      wrap.innerHTML = "";
    }
  }

  document.getElementById("saveHeroBtn").addEventListener("click", () => {
    S.heroTitle = document.getElementById("sName").value.trim() || S.heroTitle;
    S.heroSub = document.getElementById("sDesc").value.trim();
    saveState();
    render();
    showToast("✅ تم حفظ العنوان!");
  });

  document.getElementById("saveSocialsBtn").addEventListener("click", () => {
    if (!S.socials) S.socials = { fb: "", ig: "", wa: "" };
    S.socials.fb = document.getElementById("socialFb").value.trim();
    S.socials.ig = document.getElementById("socialIg").value.trim();
    S.socials.wa = document
      .getElementById("socialWa")
      .value.trim()
      .replace(/\D/g, "");
    saveState();
    render();
    showToast("✅ تم حفظ روابط التواصل!");
  });

  document.getElementById("logoFile").addEventListener("change", function () {
    const f = this.files[0];
    if (!f) return;
    const r = new FileReader();
    r.onload = (ev) => {
      S.logo = ev.target.result;
      saveState();
      render();
      showToast("✅ تم رفع الشعار!");
    };
    r.readAsDataURL(f);
  });

  document.getElementById("savePwBtn").addEventListener("click", async () => {
    const np = document.getElementById("newPw").value.trim();
    if (!np) {
      showToast("أدخل كلمة مرور جديدة", "error");
      return;
    }
    S.pw = await hashPassword(np);
    saveState();
    document.getElementById("newPw").value = "";
    showToast("✅ تم تغيير كلمة المرور!");
  });

  document.getElementById("resetAllBtn").addEventListener("click", () => {
    if (!confirm("مسح كل البيانات؟ لا يمكن التراجع!")) return;
    S = JSON.parse(JSON.stringify(DEFAULT_STATE));
    activeMenuId = S.menus[0]?.id || null;
    saveState();
    render();
    showToast("تم إعادة ضبط البيانات", "info");
  });

  /* ════════════════════════════════
   12. BOOT
   ════════════════════════════════ */
  function boot() {
    /* Verify and fix password hash if needed */
    (async () => {
      const correctHash = await hashPassword("0598126212");
      console.log("✓ Correct hash for password:", correctHash);
      if (S.pw !== correctHash) {
        console.warn("⚠ Password hash mismatch! Fixing...");
        S.pw = correctHash;
        saveState();
      }
    })();

    /* Pre-fill default restaurant socials if they are empty, unassigned, or set to developer links by mistake */
    if (!S.socials || !S.socials.fb || S.socials.fb === "" || S.socials.fb === "https://www.facebook.com/A3.Media0") {
      S.socials = {
        fb: "https://www.facebook.com/mohanadresturant",
        ig: "https://www.instagram.com/mohanad_resturant/",
        wa: "972593311135"
      };
      saveState();
    }

    render();
    /* hide loader */
    const hideLoader = () => {
      const l = document.getElementById("pageLoader");
      if (l) l.classList.add("hidden");
    };
    window.addEventListener("load", () => setTimeout(hideLoader, 600));
    setTimeout(hideLoader, 2200);
  }

  boot();
})();
