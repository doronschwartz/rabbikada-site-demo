/* Demo site: one page, hash routes. All content comes from data.js (built from the live YouTube channel and podcast feeds). */
const D = window.DATA, SH = D.shiurim, SE = D.series, app = document.getElementById("app");
const esc = s => String(s ?? "").replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const th = id => `https://i.ytimg.com/vi/${id}/mqdefault.jpg`;
const big = id => `https://i.ytimg.com/vi/${id}/maxresdefault.jpg`;
const img = (id, hi) => `<img loading="lazy" src="${hi ? big(id) : th(id)}" ${hi ? `onerror="this.onerror=null;this.src='${th(id)}'"` : ""} alt="">`;
const mins = s => s >= 3600 ? `${Math.floor(s / 3600)} hr ${Math.round(s % 3600 / 60)} min` : `${Math.max(1, Math.round(s / 60))} min`;
const fdate = d => d ? new Date(d + "T12:00:00").toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short", year: "numeric" }) : "";
const subj = id => D.subjects.find(s => s.id === id);
const seriesOf = id => Object.values(SE).filter(s => s.subject === id);
const SUBORDER = ["Shabbat", "Hagim", "Other topics", ""];
const sortSeries = a => a.sort((x, y) => SUBORDER.indexOf(x.sub) - SUBORDER.indexOf(y.sub) || (x.daily ? 1 : 0) - (y.daily ? 1 : 0) || (x.order ?? 0) - (y.order ?? 0) || y.items.length - x.items.length);
const tags = s => `<span class="tag">Video</span>${s.a ? '<span class="tag o">Audio</span>' : ""}${s.n ? '<span class="tag">Notes</span>' : ""}${s.tx || s.tr ? '<span class="tag">Transcript</span>' : ""}`;
const primary = s => SE[s.s.find(x => !SE[x].topic) || s.s[0]];
const total = Object.keys(SH).length;
const WEEK = [["Monday · 6:00pm", "HaMaspik LeOvdei HaShem", "hamaspik-leovdei-hashem"], ["Tuesday · 8:00pm", "Moreh Nevuchim", "moreh-nevuchim"], ["Thursday · 6:00pm", "Hilchot Shabbat", "hilchot-shabbat"]];
const latest = slug => SE[slug].items.map(i => SH[i]).sort((a, b) => b.p.localeCompare(a.p))[0];

function card(s, ctx) {
  return `<a class="card" href="#/shiur/${s.id}${ctx ? "/" + ctx : ""}">${img(s.id, true)}<div class="bd"><div class="k">${esc(s.r || primary(s).name)}</div><div class="t">${esc(s.t)}</div>${tags(s)}</div></a>`;
}
function seriesCard(s) {
  const n = s.items.length, notes = s.items.filter(i => SH[i].n).length;
  return `<a class="sc" href="#/series/${s.slug}">${img(s.items[0])}<div class="x"><div class="t">${esc(s.name)}</div><div class="m">${n} shiur${n > 1 ? "im" : ""}${notes ? " · " + notes + " with notes" : ""}</div></div></a>`;
}
const searchBox = (q = "") => `<form class="sbox" onsubmit="event.preventDefault();location.hash='#/search/'+encodeURIComponent(this.q.value.trim())"><input name="q" value="${esc(q)}" placeholder="Search any topic, e.g. Kiddush on Friday night" autocomplete="off"><button>Search</button></form>`;

/* ---------- pages ---------- */
function home() {
  const dh = SE["daily-halacha-hanukah"] || Object.values(SE).find(s => s.daily);
  return `<section class="hero pat"><div><div class="kick">About</div>
  <h1>Holland Park community rabbi, London Sephardi Beth Din Dayan and sought-after speaker</h1>
  <p>Renowned for his clarity, depth and warmth, Dayan Kada brings together Torah scholarship, legal expertise and a passion for teaching. Over 1000 shiurim to watch or listen to.</p>
  ${searchBox()}<div class="b"><a class="btn" href="#/shiurim">Browse shiurim</a><a class="btn ghost" href="#/page/about">Know more</a></div></div>
  <div class="ph"><b>New photo here</b><span>The Rabbi speaking to a large audience of young people (photo to come from the Rabbi)</span></div></section>
  <div class="week"><div class="l">THIS WEEK</div>${WEEK.map(([d, n, sl]) => { const l = latest(sl); return `<a href="#/series/${sl}"><div class="d J">${d}</div><div class="t">${n}</div><div class="s">Latest: ${esc(refShort(l, SE[sl]).split("|").pop().trim() || l.t)}</div></a>`; }).join("")}</div>
  <section class="sec"><div class="head"><h2 class="sh">Latest shiurim</h2><a href="#/shiurim">All shiurim →</a></div><div class="cards">${WEEK.map(w => card(latest(w[2]), w[2])).join("")}</div></section>
  <section class="sec lavbg"><div class="head"><h2 class="sh">Shiurim by subject</h2><a href="#/shiurim">All ${Object.keys(SE).length} series →</a></div><div class="pg">
  ${D.subjects.map(s => { const n = s.id === "articles" ? D.articles.length : new Set(seriesOf(s.id).flatMap(x => x.items)).size; return `<a class="pl" href="#/${s.id === "articles" ? "articles" : "subject/" + s.id}"><div class="h">${s.heb}</div><div class="e">${s.name}</div><div class="c">${s.blurb}</div><div class="n">${n} ${s.id === "articles" ? "articles" : "shiurim"}</div></a>`; }).join("")}
  <a class="pl go" href="#/search/"><div class="h">חיפוש</div><div class="e">Search everything</div><div class="c">Every shiur and every set of notes, by topic</div></a></div></section>
  <section class="sec"><div class="head"><h2 class="sh">Daily Halacha</h2><a href="#/daily">All clips →</a></div><div class="cards c4">${(dh.items.filter(i => /hanuk|menorah|candle|antiochus|matityahu/i.test(SH[i].t)).slice(0, 4).length === 4 ? dh.items.filter(i => /hanuk|menorah|candle|antiochus|matityahu/i.test(SH[i].t)) : dh.items).slice(0, 4).map(i => { const s = SH[i]; return `<a class="card" href="#/shiur/${i}/${dh.slug}">${img(i)}<div class="bd"><div class="t">${esc(s.t)}</div><div class="m">${mins(s.d)}</div></div></a>`; }).join("")}</div></section>
  <section class="three"><div class="tc"><h3>Podcasts</h3><p>Every series is its own podcast on Spotify and Apple.</p><a class="btn" href="#/podcasts">Listen now</a></div>
  <div class="tc"><h3>Live</h3><p>Join the weekly shiurim live on Zoom and YouTube, Monday, Tuesday and Thursday evenings.</p><a class="btn" href="#/page/live">Watch now</a></div>
  <div class="tc"><h3>Events</h3><p>Upcoming special classes and lectures.</p><a class="btn" href="#/page/events">See what’s coming</a></div></section>
  ${askBlock()}`;
}
function askBlock() {
  return `<section class="ask pat"><div><h2>Ask the Rabbi</h2><p>Send a question privately and the Rabbi will reply to you. Some questions, with names removed, may become Daily Halacha clips.</p></div>
  <form class="form" onsubmit="event.preventDefault();this.querySelector('.ok').textContent='Demo only: nothing was sent.'"><input placeholder="Your name"><input placeholder="Email"><textarea placeholder="Your question…"></textarea><button class="btn">Send question</button><div class="ok"></div></form></section>`;
}
function shiurim() {
  return `<section class="top pat"><div class="crumb">Shiurim</div><h1>All shiurim</h1><p>${total} shiurim in ${Object.keys(SE).length} series, by subject.</p>${searchBox()}</section>
  <section class="sec">${D.subjects.filter(s => s.id !== "articles").map(s => `<div class="head" style="margin-top:34px"><h2 class="sh">${s.name} <span class="heb" style="color:var(--or);font-size:24px">${s.heb}</span></h2><a href="#/subject/${s.id}">Open ${s.name} →</a></div><div class="sgrid">${sortSeries(seriesOf(s.id)).slice(0, 8).map(seriesCard).join("")}</div>${seriesOf(s.id).length > 8 ? `<p class="more"><a href="#/subject/${s.id}">See all ${seriesOf(s.id).length} series in ${s.name} →</a></p>` : ""}`).join("")}</section>`;
}
function subject(id) {
  const s = subj(id); if (!s) return notFound();
  const all = sortSeries(seriesOf(id)), subs = [...new Set(all.map(x => x.sub))];
  const n = new Set(all.flatMap(x => x.items)).size;
  return `<section class="top pat"><div class="crumb"><a href="#/shiurim">Shiurim</a> › ${s.name}</div><h1>${s.name}</h1><div class="hh heb">${s.heb}</div><p>${s.blurb}</p>
  <div class="stats"><div><b>${n}</b><span>Shiurim</span></div><div><b>${all.length}</b><span>Series</span></div></div></section>
  <section class="sec">${subs.map(sub => { const full = all.filter(x => x.sub === sub && !x.daily), dly = all.filter(x => x.sub === sub && x.daily);
    return `${sub && full.length ? `<div class="subh">${sub}</div>` : ""}${full.length ? `<div class="sgrid">${full.map(seriesCard).join("")}</div>` : ""}${dly.length ? `<div class="subh">${sub ? sub + " · " : ""}Daily Halacha clips</div><div class="sgrid">${dly.map(seriesCard).join("")}</div>` : ""}`; }).join("")}</section>`;
}
function series(slug) {
  const s = SE[slug]; if (!s) return notFound();
  const sj = subj(s.subject), items = s.items.map(i => SH[i]);
  const secs = items.reduce((a, x) => a + x.d, 0), notes = items.filter(x => x.n).length, dated = items.some(x => x.g);
  const rel = sortSeries(seriesOf(s.subject)).filter(x => x.slug !== slug).slice(0, 4);
  return `<section class="top two pat"><div><div class="crumb"><a href="#/shiurim">Shiurim</a> › <a href="#/subject/${sj.id}">${sj.name}</a>${s.sub ? " › " + s.sub : ""}</div>
  <h1>${esc(s.name)}</h1>${s.desc ? `<p>${esc(s.desc)}</p>` : ""}
  <div class="stats"><div><b>${items.length}</b><span>Shiurim</span></div><div><b>${Math.round(secs / 3600) || "<1"}</b><span>Hours</span></div>${notes ? `<div><b>${notes}</b><span>With notes</span></div>` : ""}</div>
  <div style="margin-top:24px;display:flex;gap:12px;flex-wrap:wrap"><a class="btn" href="#/shiur/${items[0].id}/${slug}">▶ Start from shiur 1</a>${s.spotify ? `<a class="btn ghost" target="_blank" rel="noopener" href="${s.spotify}">Spotify</a>` : ""}${s.playlist ? `<a class="btn ghost" target="_blank" rel="noopener" href="https://www.youtube.com/playlist?list=${s.playlist}">YouTube playlist</a>` : ""}</div></div>${img(items[0].id, true)}</section>
  <div class="bar"><input id="flt" placeholder="Search within this series…" oninput="filt(this.value)"><span id="cnt">${items.length} shiurim</span></div>
  <section class="list"><div id="rows">${items.map((x, i) => `<a class="row" href="#/shiur/${x.id}/${slug}" data-q="${esc((x.t + " " + x.r).toLowerCase())}"><div class="n">${i + 1}</div>${img(x.id)}<div><div class="t">${esc(x.t)}</div><div class="r">${tags(x)}</div></div><div class="d">${x.g ? `<b>${fdate(x.g)}</b>` : ""}${esc(refShort(x, s))}${x.r && x.d ? " · " : ""}${x.d ? mins(x.d) : ""}</div></a>`).join("")}</div>
  <div><div class="box lk"><h3>Listen &amp; follow</h3>${s.spotify ? `<a target="_blank" rel="noopener" href="${s.spotify}">Spotify podcast<span>→</span></a>` : ""}${s.playlist ? `<a target="_blank" rel="noopener" href="https://www.youtube.com/playlist?list=${s.playlist}">YouTube playlist<span>→</span></a>` : ""}<a href="#/podcasts">All podcasts<span>→</span></a></div>
  ${dated ? "" : `<div class="box"><h3>Dates</h3><p>The date each shiur was given is not matched for this series yet.</p></div>`}
  ${rel.length ? `<div class="box lk"><h3>More in ${sj.name}</h3>${rel.map(r => `<a href="#/series/${r.slug}">${esc(r.name)}<span>→</span></a>`).join("")}</div>` : ""}</div></section>`;
}
function refShort(x, s) {
  const w = x.r.split(/\s+/), first = s.name.split(/[\s:(]/)[0].toLowerCase().replace(/[^a-z]/g, "");
  if (!w[0] || w[0].toLowerCase().replace(/[^a-z]/g, "") !== first) return x.r;
  while (w.length && !/\d/.test(w[0]) && !/^(ch|chapter|chapters|part|pt|perek|perakim|siman|essay|introduction|intro)\b/i.test(w[0])) w.shift();
  return w.join(" ").replace(/^[\s,·:|]+/, "");
}
window.filt = v => {
  const w = v.toLowerCase().split(/\s+/).filter(Boolean); let n = 0;
  document.querySelectorAll("#rows .row").forEach(r => { const ok = w.every(x => r.dataset.q.includes(x)); r.style.display = ok ? "" : "none"; n += ok; });
  document.getElementById("cnt").textContent = n + " shiurim";
};
function shiur(id, ctx) {
  const x = SH[id]; if (!x) return notFound();
  const s = SE[ctx] && SE[ctx].items.includes(id) ? SE[ctx] : primary(x), sj = subj(s.subject);
  const i = s.items.indexOf(id), prev = SH[s.items[i - 1]], next = SH[s.items[i + 1]];
  const nx = (y, l) => y ? `<a class="nx" href="#/shiur/${y.id}/${s.slug}">${img(y.id)}<div><small>${l}</small><b>${esc(y.t)}</b></div></a>` : "";
  const share = "https://wa.me/?text=" + encodeURIComponent(x.t + " https://youtu.be/" + id);
  return `<section class="wrap"><div><div class="crumb"><a href="#/shiurim">Shiurim</a> › <a href="#/subject/${sj.id}">${sj.name}</a> › <a href="#/series/${s.slug}">${esc(s.name.split(/[:(]/)[0])}</a></div>
  <h1>${esc(x.t)}</h1><div class="meta">${x.g ? `<b>Given ${fdate(x.g)}</b> · ` : ""}${esc(x.r || s.name)}${x.d ? " · " + mins(x.d) : ""}</div>
  ${x.e ? `<div class="vid"><iframe src="https://www.youtube-nocookie.com/embed/${id}?rel=0" title="${esc(x.t)}" allow="accelerometer; autoplay; encrypted-media; picture-in-picture; fullscreen" allowfullscreen referrerpolicy="strict-origin-when-cross-origin"></iframe></div>`
    : `<a class="vid poster" target="_blank" rel="noopener" href="https://youtu.be/${id}">${img(id, true)}<span>▶ Watch on YouTube</span></a><div class="none" style="margin-top:10px">This video has “Allow embedding” switched off on YouTube, so it cannot play on the site until that is switched on.</div>`}
  ${x.a ? `<div class="audio"><audio controls preload="none" src="${esc(x.a)}"></audio>${s.spotify ? `<a target="_blank" rel="noopener" href="${s.spotify}">Listen on Spotify →</a>` : ""}</div>` : ""}
  ${panes(x)}</div>
  <div><div class="box lk"><h3>This shiur</h3>${x.nd ? `<a target="_blank" rel="noopener" href="https://docs.google.com/document/d/${x.nd}/edit">Notes as a document<span>→</span></a>` : ""}${x.tr ? `<a target="_blank" rel="noopener" href="${esc(x.tr)}">Full transcript<span>→</span></a>` : ""}${s.spotify ? `<a target="_blank" rel="noopener" href="${s.spotify}">Spotify podcast<span>→</span></a>` : ""}<a target="_blank" rel="noopener" href="https://youtu.be/${id}">Like or comment on YouTube<span>→</span></a><a target="_blank" rel="noopener" href="${share}">Share on WhatsApp<span>→</span></a></div>
  <div class="box"><h3>In this series</h3><div class="nx" style="border-bottom:1px solid var(--line)">${img(id)}<div><small>Now playing · ${i + 1} of ${s.items.length}</small><b>${esc(x.t)}</b></div></div>${nx(next, "Next")}${nx(prev, "Previous")}<div style="padding-top:14px"><a class="btn sm" href="#/series/${s.slug}">Whole series</a></div></div>
  <div class="box"><h3>Ask the Rabbi</h3><p>Ask the Rabbi about this shiur, privately.</p><div style="margin-top:12px"><a class="btn ghost sm" href="#/page/ask">Ask a question</a></div></div></div></section>`;
}
function panes(x) {
  const tabs = [x.sm && ["s", "Summary"], x.n && ["n", "Notes"], (x.tx || x.tr) && ["t", "Transcript"]].filter(Boolean);
  if (!tabs.length) return `<div class="none">Notes and a transcript have not been written for this shiur yet.</div>`;
  const first = x.n ? "n" : tabs[0][0];
  return `<div class="tabs">${tabs.map(([k, l]) => `<button data-tab="${k}" class="${k === first ? "on" : ""}">${l}</button>`).join("")}</div>
  ${tabs.map(([k]) => `<div class="notes${k === "t" ? " trans" : ""}" id="pane-${k}" ${k === first ? "" : "hidden"}>Loading…</div>`).join("")}`;
}
function showTab(k) {
  document.querySelectorAll(".tabs button").forEach(o => o.classList.toggle("on", o.dataset.tab === k));
  document.querySelectorAll(".notes").forEach(p => p.hidden = p.id !== "pane-" + k);
}
function afterShiur(id, tab) {
  const x = SH[id]; if (!x) return;
  const pane = k => document.getElementById("pane-" + k);
  const load = (k, url, fallback) => fetch(url).then(r => r.ok ? r.text() : Promise.reject()).then(h => { if (pane(k)) { pane(k).innerHTML = h; if (k === "t") wireTranscript(x); } }).catch(() => { if (pane(k)) pane(k).innerHTML = fallback; });
  document.querySelectorAll(".tabs button").forEach(b => b.onclick = () => showTab(b.dataset.tab));
  if (x.n) load("n", `notes/${id}.html`, `<p>The notes could not be loaded here. <a target="_blank" rel="noopener" href="https://docs.google.com/document/d/${x.nd}/edit">Open them as a document →</a></p>`);
  if (x.sm) load("s", `summaries/${id}.html`, "<p>The summary could not be loaded.</p>");
  if (x.tx) load("t", `transcripts/${id}.html`, `<p>The transcript could not be loaded here. <a target="_blank" rel="noopener" href="${esc(x.tr)}">Open it on Sofer.ai →</a></p>`);
  else if (x.tr && pane("t")) pane("t").innerHTML = `<p>The transcript for this shiur has not been brought onto the page yet.</p><p><a target="_blank" rel="noopener" href="${esc(x.tr)}">Open it on Sofer.ai →</a></p>`;
  if (tab && pane(tab)) showTab(tab);
}
function wireTranscript(x) {
  const p = document.getElementById("pane-t"), au = document.querySelector(".audio audio");
  p.querySelectorAll(".toc a").forEach(a => a.onclick = () => p.querySelector("#ts-" + a.dataset.sec).scrollIntoView({ behavior: "smooth", block: "start" }));
  p.querySelectorAll(".ts").forEach(b => b.onclick = () => {
    const t = +b.dataset.t;
    if (au) { au.currentTime = t; au.play(); p.querySelectorAll(".ts.on").forEach(o => o.classList.remove("on")); b.classList.add("on"); }
    else { const f = document.querySelector(".vid iframe"); if (f) { f.src = `https://www.youtube-nocookie.com/embed/${x.id}?start=${t}&autoplay=1&rel=0`; f.scrollIntoView({ behavior: "smooth", block: "center" }); } }
  });
}
function daily() {
  const ds = Object.values(SE).filter(s => s.daily).sort((a, b) => b.items.length - a.items.length), n = new Set(ds.flatMap(s => s.items)).size;
  return `<section class="top pat"><div class="crumb"><a href="#/shiurim">Shiurim</a> › <a href="#/subject/halacha">Halacha</a> › Daily Halacha</div><h1>Daily Halacha</h1><p>Short clips answering one practical question each, grouped by time of year.</p><div class="stats"><div><b>${n}</b><span>Clips</span></div><div><b>${ds.length}</b><span>Collections</span></div></div></section>
  <section class="sec"><div class="sgrid">${ds.map(seriesCard).join("")}</div></section>`;
}
function podcasts() {
  const seen = new Set(), shows = [];
  Object.values(SE).filter(s => s.spotify).sort((a, b) => b.items.length - a.items.length).forEach(s => { if (!seen.has(s.spotify)) { seen.add(s.spotify); shows.push(s); } });
  return `<section class="top pat"><div class="crumb">Podcasts</div><h1>Podcasts</h1><p>Every series is its own podcast. ${shows.length} shows are on Spotify, and the same feeds work in Apple Podcasts.</p></section>
  <section class="sec"><div class="sgrid">${shows.map(s => `<div class="sc">${img(s.items[0])}<div class="x"><div class="t">${esc(s.feed === "parasha" ? "Weekly Parasha" : s.feed === "feed" ? "Daily Halacha" : s.name)}</div><div class="m"><a target="_blank" rel="noopener" href="${s.spotify}" style="color:var(--gold)">Open in Spotify →</a></div></div></div>`).join("")}</div></section>`;
}
function articles() {
  return `<section class="top pat"><div class="crumb">Articles</div><h1>Articles</h1><div class="hh heb">מאמרים</div><p>${D.articles.length} written pieces already on rabbikada.com.</p></section>
  <section class="res">${D.articles.map(a => `<div class="art"><div class="m">${fdate(a.date)}</div><div class="t">${esc(a.t)}</div><p>${esc(a.x)}</p></div>`).join("")}</section>`;
}
const PAGES = {
  about: ["About", `<p>Holland Park community rabbi, London Sephardi Beth Din Dayan and sought-after speaker.</p><h3>Still to come</h3><ul><li>The Rabbi's biography, from the current About page</li><li>A new photo from the Rabbi</li></ul>`],
  live: ["Live", `<p>Join the weekly shiurim live on Zoom and YouTube.</p><h3>Weekly schedule</h3><ul><li>Monday 6:00pm · HaMaspik LeOvdei HaShem</li><li>Tuesday 8:00pm · Moreh Nevuchim</li><li>Thursday 6:00pm · Hilchot Shabbat</li></ul><h3>Still to come</h3><ul><li>The Zoom and YouTube links for each shiur</li></ul>`],
  events: ["Events", `<p>Upcoming special classes and lectures.</p><h3>Still to come</h3><ul><li>A simple list the Rabbi's team can add to</li></ul>`],
  donate: ["Donate", `<h3>Still to decide</h3><ul><li>What Donate supports, and its link to the charity</li><li>The payment provider</li></ul>`],
};
function page(k) {
  if (k === "ask") return `<section class="top pat"><div class="crumb">Ask the Rabbi</div><h1>Ask the Rabbi</h1></section>${askBlock()}`;
  const p = PAGES[k]; if (!p) return notFound();
  return `<section class="top pat"><div class="crumb">${p[0]}</div><h1>${p[0]}</h1></section><section class="plain">${p[1]}</section>`;
}
const notFound = () => `<section class="plain"><h3>Page not found</h3><p><a href="#/" style="color:var(--gold)">Back to the home page →</a></p></section>`;

/* ---------- search: titles straight away, notes text loaded on first use ---------- */
let notesLoading;
const loadJs = src => new Promise(res => { const s = document.createElement("script"); s.src = src; s.onload = res; s.onerror = res; document.body.appendChild(s); });
const loadNotes = () => notesLoading ||= Promise.all([loadJs("search.js"), loadJs("search_t.js")]);
function search(q) {
  return `<section class="top pat"><div class="crumb">Search</div><h1>Search</h1><p>Searches every shiur title and the full text of the notes and transcripts.</p>${searchBox(q)}</section><section class="res" id="res">${q ? "Searching…" : "Type a topic above."}</section>`;
}
async function runSearch(q) {
  const box = document.getElementById("res"); if (!q || !box) return;
  const w = q.toLowerCase().split(/\s+/).filter(Boolean), hl = t => w.reduce((a, x) => a.replace(new RegExp("(" + x.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + ")", "ig"), "<mark>$1</mark>"), esc(t));
  const titleHits = Object.values(SH).filter(x => { const h = (x.t + " " + x.r + " " + x.s.map(s => SE[s].name).join(" ")).toLowerCase(); return w.every(y => h.includes(y)); });
  await loadNotes();
  const seen = new Set(titleHits.map(x => x.id)), noteHits = [];
  for (const [src, where, tab] of [[window.NOTES || {}, "in the notes", "n"], [window.TRANS || {}, "in the transcript", "t"]]) {
    for (const [id, text] of Object.entries(src)) {
      if (seen.has(id) || !SH[id]) continue;
      const low = text.toLowerCase(); if (!w.every(y => low.includes(y))) continue;
      let at = low.indexOf(q.toLowerCase()); const phrase = at >= 0; if (at < 0) at = low.indexOf(w[0]);
      seen.add(id); noteHits.push({ x: SH[id], phrase, where, tab, snip: (at > 90 ? "… " : "") + text.slice(Math.max(0, at - 90), at + 190) + " …" });
    }
  }
  noteHits.sort((a, b) => b.phrase - a.phrase);
  const row = (x, snip, where, tab) => `<a class="hit" href="#/shiur/${x.id}${tab ? "/-/" + tab : ""}">${img(x.id)}<div><div class="k">${esc(primary(x).name.split(/[:(]/)[0])} · ${where}</div><div class="t">${hl(x.t)}</div>${snip ? `<div class="s">${hl(snip)}</div>` : ""}</div></a>`;
  if (location.hash !== "#/search/" + encodeURIComponent(q)) return;
  box.innerHTML = `<p style="color:var(--mut);margin-bottom:8px"><b>${titleHits.length}</b> shiurim match by title and <b>${noteHits.length}</b> more mention it in their notes or transcript.</p>` +
    titleHits.slice(0, 40).map(x => row(x, "", "title")).join("") + noteHits.slice(0, 80).map(h => row(h.x, h.snip, h.where, h.tab)).join("") || "No results.";
}

/* ---------- router ---------- */
function route() {
  const [, r = "", a = "", b = "", c = ""] = location.hash.split("/"), arg = decodeURIComponent(a);
  const html = r === "" ? home() : r === "shiurim" ? shiurim() : r === "subject" ? subject(arg) : r === "series" ? series(arg) : r === "shiur" ? shiur(arg, b)
    : r === "daily" ? daily() : r === "podcasts" ? podcasts() : r === "articles" ? articles() : r === "search" ? search(arg) : r === "page" ? page(arg) : notFound();
  app.innerHTML = html; placeScroll();
  document.getElementById("nav").classList.remove("open");
  document.querySelectorAll("#nav a").forEach(l => l.classList.toggle("on", l.getAttribute("href") === "#/" + [r, a].filter(Boolean).join("/") || (l.getAttribute("href") === "#/shiurim" && ["subject", "series", "shiur", "search"].includes(r))));
  if (r === "shiur") afterShiur(arg, c);
  if (r === "search") runSearch(arg);
}
document.querySelector(".burger").onclick = () => document.getElementById("nav").classList.toggle("open");
document.getElementById("demo").textContent = `Demo · real shiurim from YouTube, ${D.built} · not the live site`;
/* Back and forward return to where you were on the page; a new page starts at the top. */
history.scrollRestoration = "manual";
const POS = {}; let entry = 0, stamp = Date.now(), traversing = false;
addEventListener("popstate", e => { POS[entry] = scrollY; traversing = !!(e.state && e.state.k); if (traversing) entry = e.state.k; });
function placeScroll() {
  if (traversing) { const y = POS[entry] || 0; traversing = false; scrollTo(0, y); [150, 500, 1200].forEach(ms => setTimeout(() => { if (Math.abs(scrollY - y) > 4 && history.state && history.state.k === entry && !moved) scrollTo(0, y); }, ms)); moved = false; }
  else { entry = ++stamp; history.replaceState({ k: entry }, ""); scrollTo(0, 0); }
}
let moved = false; addEventListener("wheel", () => moved = true, { passive: true }); addEventListener("touchmove", () => moved = true, { passive: true });
addEventListener("hashchange", route); route();
