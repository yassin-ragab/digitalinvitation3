/* InvitationReact.jsx — small, isolated React add-on.
   Loaded by index.html via Babel Standalone (no npm, no build step).
   Reads the existing global CONFIG and `lang` from js/script.js. */
(function () {
  const { useState } = React;

  /* ---------- Settings you can edit ---------- */
  const EVENT_HOURS = 4;        // length of the calendar event
  const RSVP_WHATSAPP = "";     // e.g. "201001234567" (country code, no +). Empty = hide the WhatsApp button

  /* ---------- Texts ---------- */
  const TXT = {
    ar: { addCal: "أضف الموعد إلى التقويم", google: "تقويم جوجل", ics: "تحميل ملف .ics", calTitle: "حفل زفاف",
          rsvp: "تأكيد الحضور", name: "الاسم", yes: "سأحضر", no: "أعتذر عن الحضور", guests: "عدد الحضور",
          send: "تأكيد", needName: "من فضلك اكتب اسمك", edit: "تعديل الرد", wa: "أرسل عبر واتساب",
          okYes: (n, g) => `شكرًا ${n}! تم تسجيل حضورك (${g}).`, okNo: n => `شكرًا ${n}، سنفتقدك.`, waMsg: (n, a, g) => a ? `أنا ${n}، سأحضر (${g}).` : `أنا ${n}، أعتذر عن الحضور.` },
    en: { addCal: "Add to your calendar", google: "Google Calendar", ics: "Download .ics", calTitle: "Wedding of",
          rsvp: "RSVP", name: "Your name", yes: "I'll be there", no: "Can't make it", guests: "Guests",
          send: "Confirm", needName: "Please enter your name", edit: "Change response", wa: "Send via WhatsApp",
          okYes: (n, g) => `Thank you, ${n}! Your attendance is confirmed (${g}).`, okNo: n => `Thank you, ${n}. You will be missed.`, waMsg: (n, a, g) => a ? `${n} here — I'll be attending (${g}).` : `${n} here — I can't make it.` }
  };
  const L = TXT[lang] || TXT.en;
  const AMP = lang === "ar" ? "و" : "&";
  const coupleNames = () => `${CONFIG.groom[lang]} ${AMP} ${CONFIG.bride[lang]}`;

  /* ---------- Isolated styles (all classes start with "ivr-") ---------- */
  const css = `
  .ivr-box{margin-top:1.4rem;text-align:start}
  .ivr-title{font-size:.78rem;letter-spacing:.24em;text-transform:uppercase;color:var(--gray);margin-bottom:.7rem}
  [lang=ar] .ivr-title{font-size:1rem;letter-spacing:0;text-transform:none}
  .ivr-row{display:flex;gap:.5rem;justify-content:flex-start;flex-wrap:wrap}
  .ivr-btn{font:inherit;cursor:pointer;padding:.5rem 1.2rem;border:1px solid var(--sage);border-radius:0;background:var(--paper);color:var(--ink);text-decoration:none;font-size:.9rem;transition:background .3s,color .3s}
  .ivr-btn:hover,.ivr-btn:focus-visible,.ivr-btn.ivr-on{background:var(--ink);color:var(--paper);border-color:var(--ink);outline:none}
  .ivr-form{display:flex;flex-direction:column;gap:.7rem;align-items:flex-start;padding:1rem;border:1px solid var(--line);border-radius:10px;background:rgba(255,255,255,.4)}
  .ivr-input{width:100%;max-width:320px;font:inherit;text-align:start;padding:.55rem .8rem;border:1px solid var(--line);border-radius:8px;background:#fff;color:var(--ink)}
  .ivr-input:focus{outline:2px solid var(--sage);outline-offset:1px}
  .ivr-err{color:#9a4a4a;font-size:.85rem}
  .ivr-ok{padding:1rem;border:1px solid var(--line);border-radius:10px;background:rgba(255,255,255,.4);animation:ivr-in .6s ease both}
  .ivr-ok p{margin-bottom:.7rem;color:var(--ink)}
  @keyframes ivr-in{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}
  @media (prefers-reduced-motion:reduce){.ivr-ok{animation:none}.ivr-btn{transition:none}}`;
  const styleEl = document.createElement("style");
  styleEl.textContent = css;
  document.head.appendChild(styleEl);

  /* ---------- Component 1: Add to Calendar ---------- */
  const pad = n => String(n).padStart(2, "0");
  const stamp = d => `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}T${pad(d.getHours())}${pad(d.getMinutes())}00`;
  const esc = s => String(s).replace(/[\\;,]/g, m => "\\" + m);

  function AddToCalendar() {
    const start = new Date(`${CONFIG.eventDate}T${CONFIG.eventTime}:00`);
    const end = new Date(start.getTime() + EVENT_HOURS * 36e5);
    const title = `${L.calTitle} ${coupleNames()}`;
    const place = [CONFIG.venue[lang], (CONFIG.venueAlt || {})[lang], CONFIG.address[lang]].filter(Boolean).join(", ");
    const gUrl = "https://calendar.google.com/calendar/render?action=TEMPLATE" +
      `&text=${encodeURIComponent(title)}&dates=${stamp(start)}/${stamp(end)}&location=${encodeURIComponent(place)}`;

    const download = () => {
      const ics = ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Invitation//EN", "BEGIN:VEVENT",
        `UID:${stamp(start)}@invitation`, `DTSTAMP:${stamp(new Date())}`,
        `DTSTART:${stamp(start)}`, `DTEND:${stamp(end)}`,
        `SUMMARY:${esc(title)}`, `LOCATION:${esc(place)}`, `URL:${CONFIG.mapsUrl}`,
        "END:VEVENT", "END:VCALENDAR"].join("\r\n");
      const url = URL.createObjectURL(new Blob([ics], { type: "text/calendar;charset=utf-8" }));
      const a = document.createElement("a");
      a.href = url; a.download = "invitation.ics";
      document.body.appendChild(a); a.click(); a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    };

    return (
      <div className="ivr-box">
        <div className="ivr-title">{L.addCal}</div>
        <div className="ivr-row">
          <a className="ivr-btn" href={gUrl} target="_blank" rel="noopener">{L.google}</a>
          <button className="ivr-btn" type="button" onClick={download}>{L.ics}</button>
        </div>
      </div>
    );
  }

  /* ---------- Component 2: RSVP ---------- */
  const KEY = `ivr-rsvp-${CONFIG.eventDate}-${CONFIG.bride.en}-${CONFIG.groom.en}`;
  const load = () => { try { return JSON.parse(localStorage.getItem(KEY)); } catch (e) { return null; } };
  const save = v => { try { localStorage.setItem(KEY, JSON.stringify(v)); } catch (e) { /* storage unavailable */ } };

  function Rsvp() {
    const [saved, setSaved] = useState(load);
    const [editing, setEditing] = useState(false);
    const [name, setName] = useState(saved ? saved.name : "");
    const [attending, setAttending] = useState(saved ? saved.attending : true);
    const [guests, setGuests] = useState(saved ? saved.guests : 1);
    const [error, setError] = useState("");

    const submit = e => {
      e.preventDefault();
      if (!name.trim()) { setError(L.needName); return; }
      const v = { name: name.trim(), attending, guests: attending ? guests : 0 };
      save(v); setSaved(v); setEditing(false); setError("");
    };

    if (saved && !editing) {
      const wa = RSVP_WHATSAPP && `https://wa.me/${RSVP_WHATSAPP}?text=${encodeURIComponent(L.waMsg(saved.name, saved.attending, saved.guests))}`;
      return (
        <div className="ivr-box">
          <div className="ivr-ok" role="status">
            <p>{saved.attending ? L.okYes(saved.name, saved.guests) : L.okNo(saved.name)}</p>
            <div className="ivr-row">
              <button className="ivr-btn" type="button" onClick={() => setEditing(true)}>{L.edit}</button>
              {wa && <a className="ivr-btn" href={wa} target="_blank" rel="noopener">{L.wa}</a>}
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="ivr-box">
        <div className="ivr-title">{L.rsvp}</div>
        <form className="ivr-form" onSubmit={submit} noValidate>
          <input className="ivr-input" value={name} onChange={e => setName(e.target.value)} placeholder={L.name} aria-label={L.name} maxLength={60} />
          <div className="ivr-row">
            <button type="button" className={"ivr-btn" + (attending ? " ivr-on" : "")} onClick={() => setAttending(true)}>{L.yes}</button>
            <button type="button" className={"ivr-btn" + (!attending ? " ivr-on" : "")} onClick={() => setAttending(false)}>{L.no}</button>
          </div>
          {attending && (
            <div className="ivr-row" role="group" aria-label={L.guests}>
              {[1, 2, 3, 4, 5].map(n => (
                <button key={n} type="button" className={"ivr-btn" + (guests === n ? " ivr-on" : "")} onClick={() => setGuests(n)} aria-label={`${L.guests}: ${n}`}>{n}</button>
              ))}
            </div>
          )}
          {error && <div className="ivr-err" role="alert">{error}</div>}
          <button className="ivr-btn ivr-on" type="submit">{L.send}</button>
        </form>
      </div>
    );
  }

  /* ---------- Mount into the containers in index.html ---------- */
  const mount = (id, Component) => {
    const el = document.getElementById(id);
    if (el) ReactDOM.createRoot(el).render(<Component />);
  };
  mount("react-calendar", AddToCalendar);
  mount("react-rsvp", Rsvp);
})();
