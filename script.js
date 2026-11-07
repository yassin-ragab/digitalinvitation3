/* ============ EDIT HERE ============ */
const CONFIG = {
  language: "ar",                       // "ar" or "en"  (override with ?lang=en)
  groom:  { ar: "زياد",  en: "Ziad"    },
  bride:  { ar: "سلمى", en: "Salma"   },
  eventDate: "2026-11-20",              // YYYY-MM-DD  (Friday)
  eventTime: "20:00",                   // 24h HH:MM   (8:00 PM)
  venue:    { ar: "قاعة فينيسيا", en: "Venicia Hall" },
  venueAlt: { ar: "Venicia Hall", en: "قاعة فينيسيا" },
  address:  { ar: "محور اللبيني، الحرانية، الجيزة، مصر.", en: "Al-Lebeini Axis, Al-Haraniya, Giza, Egypt." },
  mapsUrl: "https://www.google.com/maps/search/?api=1&query=%D9%82%D8%A7%D8%B9%D8%A9+%D9%81%D9%8A%D9%86%D9%8A%D8%B3%D9%8A%D8%A7+%D9%85%D8%AD%D9%88%D8%B1+%D8%A7%D9%84%D9%84%D8%A8%D9%8A%D9%86%D9%8A+%D8%A7%D9%84%D8%AD%D8%B1%D8%A7%D9%86%D9%8A%D8%A9+%D8%A7%D9%84%D8%AC%D9%8A%D8%B2%D8%A9",
  verse: {
    ar: "﴿ وَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُم مِّنْ أَنفُسِكُمْ أَزْوَاجًا لِّتَسْكُنُوا إِلَيْهَا وَجَعَلَ بَيْنَكُم مَّوَدَّةً وَرَحْمَةً ﴾",
    en: "“And among His signs is that He created for you spouses, that you may find tranquility in them, and placed between you love and mercy.” (Ar-Rum 30:21)"
  },
  message: {
    ar: "بكل الحب والسرور ندعوكم لمشاركتنا أجمل لحظات العمر، ونسأل الله أن يبارك لهما ويجمع بينهما في خير.",
    en: "With joyful hearts, Ziad and Salma invite you to share the happiest day of their lives and to bless their union with your presence and prayers."
  },
  instructions: {                       // use empty arrays [] to hide the box
    ar: [],
    en: []
  },
  instructionsNote: {                   // shown directly below the instructions
    ar: "",
    en: ""
  },
  music: ""                             // e.g. "music.mp3" — adds a play/pause button, never autoplays
};
/* ===================================== */

const TEXT = {
  ar: { tap:"اضغط لفتح الدعوة", bism:"بسم الله الرحمن الرحيم", eyebrow:"تتشرف بدعوتكم لحضور حفل زفاف", amp:"و", time:"الساعة", count:"باقٍ على الفرحة", venue:"المكان", d:"يوم", h:"ساعة", m:"دقيقة", s:"ثانية", map:"افتح الخريطة", thanks:"بارك الله لهما وبارك عليهما وجمع بينهما في خير. يسعدنا حضوركم ودعاؤكم.", on:"في", title:"دعوة زفاف" },
  en: { tap:"Tap to open", bism:"", eyebrow:"You are cordially invited", amp:"&", time:"Time", count:"Counting down", venue:"Venue", d:"Days", h:"Hours", m:"Minutes", s:"Seconds", map:"Open in Google Maps", thanks:"With love and gratitude — we can't wait to celebrate with you.", on:"On", title:"Wedding Invitation" }
};

const $ = id => document.getElementById(id);
const qLang = new URLSearchParams(location.search).get("lang");
const lang = TEXT[qLang] ? qLang : (TEXT[CONFIG.language] ? CONFIG.language : "en");
const t = TEXT[lang];
const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
const target = () => new Date(`${CONFIG.eventDate}T${CONFIG.eventTime}:00`);
const num = n => lang === "ar" ? new Intl.NumberFormat("ar-EG", { minimumIntegerDigits: 2, useGrouping: false }).format(n) : String(n).padStart(2, "0");

function render() {
  const root = document.documentElement;
  root.lang = lang; root.dir = lang === "ar" ? "rtl" : "ltr";
  const groom = CONFIG.groom[lang], bride = CONFIG.bride[lang];
  const set = (id, v) => { $(id).textContent = v; };
  document.title = `${t.title} · ${groom} ${t.amp} ${bride}`;
  set("tap-hint", t.tap); set("bismillah", t.bism); set("eyebrow", t.eyebrow);
  set("groom", groom); set("bride", bride); set("amp", t.amp);
  set("m1", Array.from(groom)[0]); set("m2", Array.from(bride)[0]); set("m-amp", t.amp);
  set("verse", CONFIG.verse[lang]); set("message", CONFIG.message[lang]);
  set("l-count", t.count); set("l-venue", t.venue);
  set("l-d", t.d); set("l-h", t.h); set("l-m", t.m); set("l-s", t.s);
  set("venue", CONFIG.venue[lang]); set("venue-alt", (CONFIG.venueAlt || {})[lang] || ""); set("address", CONFIG.address[lang]);
  set("thanks", t.thanks); set("sign", `${groom} ${t.amp} ${bride}`);
  const map = $("map"); map.textContent = t.map; map.href = CONFIG.mapsUrl;
  $("seal-btn").setAttribute("aria-label", t.tap);

  const loc = lang === "ar" ? "ar-EG" : "en-GB", when = target();
  const f = o => new Intl.DateTimeFormat(loc, o).format(when);
  const full = f({ weekday: "long", day: "numeric", month: "long", year: "numeric" });
  set("d-day", f({ day: "numeric" })); set("d-month", `${f({ month: "long" })} ${f({ year: "numeric" })}`);
  set("d-week", (lang === "ar" ? "يوم " : "") + f({ weekday: "long" }));
  set("time", f({ hour: "numeric", minute: "2-digit", hour12: true }));
  set("closedate", `${t.on} ${full}`);

  const notes = (CONFIG.instructions[lang] || []).filter(Boolean);
  const note = (CONFIG.instructionsNote || {})[lang] || "";
  if (notes.length || note) {
    notes.forEach(n => { const li = document.createElement("li"); li.textContent = n; $("notes-list").appendChild(li); });
    set("notes-note", note);
    $("notes").hidden = false;
  }
}

function tick() {
  let diff = Math.max(0, target() - Date.now());
  const d = Math.floor(diff / 864e5); diff %= 864e5;
  const h = Math.floor(diff / 36e5);  diff %= 36e5;
  const m = Math.floor(diff / 6e4),  s = Math.floor((diff % 6e4) / 1e3);
  $("c-d").textContent = num(d); $("c-h").textContent = num(h);
  $("c-m").textContent = num(m); $("c-s").textContent = num(s);
}

function effects() {
  if (reduced) return;
  const fx = $("fx"), r = (a, b) => a + Math.random() * (b - a), ns = "http://www.w3.org/2000/svg";
  const cols = ["#B8DDF2", "#FFFFFF", "#C7D2DC"];
  for (let i = 0; i < 7; i++) {
    const s = document.createElementNS(ns, "svg");
    s.setAttribute("viewBox", "-12 -12 24 24"); s.setAttribute("class", "fl");
    let g = `<g fill="${cols[i % 3]}" fill-opacity=".75">`;
    for (let k = 0; k < 5; k++) g += `<ellipse cx="0" cy="-6" rx="3.2" ry="6" transform="rotate(${k * 72})"/>`;
    s.innerHTML = g + `</g><circle r="2" fill="#526B7D"/>`;
    s.style.cssText = `left:${r(2,95)}%;width:${r(18,32)}px;height:${r(18,32)}px;animation-duration:${r(24,38)}s;animation-delay:${-r(0,30)}s`;
    fx.appendChild(s);
  }
  for (let i = 0; i < 20; i++) {
    const p = document.createElement("i"); p.className = "gp";
    p.style.cssText = `left:${r(0,100)}%;animation-duration:${r(9,17)}s;animation-delay:${-r(0,17)}s`;
    fx.appendChild(p);
  }
}

function reveal() {
  const els = document.querySelectorAll("[data-r]");
  if (reduced || !("IntersectionObserver" in window)) { els.forEach(e => e.classList.add("in")); return; }
  const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }), { threshold: .12 });
  els.forEach(e => io.observe(e));
}

function openInvitation() {
  const intro = $("intro"), btn = $("seal-btn");
  if (intro.classList.contains("open")) return;
  btn.disabled = true; intro.classList.add("open");
  setTimeout(() => {
    $("stage").hidden = false;
    $("stage").classList.add("show");
    reveal(); window.scrollTo(0, 0);
    intro.classList.add("gone");
  }, reduced ? 0 : 2300);
}

function music() {
  if (!CONFIG.music) return;
  const audio = new Audio(CONFIG.music); audio.loop = true;
  const b = document.createElement("button");
  b.id = "music"; b.type = "button"; b.textContent = "♪"; b.setAttribute("aria-label", "Play music");
  b.onclick = () => {
    if (audio.paused) audio.play().then(() => { b.textContent = "❚❚"; b.setAttribute("aria-label", "Pause music"); }).catch(() => {});
    else { audio.pause(); b.textContent = "♪"; b.setAttribute("aria-label", "Play music"); }
  };
  document.body.appendChild(b);
}

render(); tick(); setInterval(tick, 1000); effects(); music();
$("seal-btn").addEventListener("click", openInvitation);
