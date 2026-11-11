/* Demo site: one page, hash routes. All content comes from data.js (built from the live YouTube channel and podcast feeds). */
const D = window.DATA, SH = D.shiurim, SE = D.series, app = document.getElementById("app");
const esc = s => String(s ?? "").replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const th = id => `https://i.ytimg.com/vi/${id}/mqdefault.jpg`;
const big = id => `https://i.ytimg.com/vi/${id}/maxresdefault.jpg`;
const img = (id, hi) => `<img loading="lazy" src="${hi ? big(id) : th(id)}" ${hi ? `onerror="this.onerror=null;this.src='${th(id)}'"` : ""} alt="">`;
const mins = s => s >= 3600 ? `${Math.floor(s / 3600)} hr ${Math.round(s % 3600 / 60)} min` : `${Math.max(1, Math.round(s / 60))} min`;
const fdate = d => d ? new Date(d + "T12:00:00").toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short", year: "numeric" }) : "";
const subj = id => D.subjects.find(s => s.id === id);
/* "Hagim" is its own section and also stays inside Halacha: it shows the Halacha › Hagim series (Rabbi, 11 Nov) */
const seriesOf = id => Object.values(SE).filter(s => id === "hagim" ? s.subject === "halacha" && s.sub === "Hagim" : s.subject === id);
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
  return `<a class="sc" href="#/series/${s.slug}">${s.slug === "other-shiurim" ? otherCover : img(s.items[0])}<div class="x"><div class="t">${esc(s.name)}</div><div class="m">${n} shiur${n > 1 ? "im" : ""}${notes ? " · " + notes + " with notes" : ""}</div></div></a>`;
}
const searchBox = (q = "") => `<form class="sbox" onsubmit="event.preventDefault();location.hash='#/search/'+encodeURIComponent(this.q.value.trim())"><input name="q" value="${esc(q)}" placeholder="Search any topic, e.g. Kiddush on Friday night" autocomplete="off"><button>Search</button></form>`;

/* ---------- pages ---------- */
function home() {
  const dh = SE["daily-halacha-hanukah"] || Object.values(SE).find(s => s.daily);
  return `<section class="hero pat"><div><div class="kick">About</div>
  <h1>Holland Park community rabbi, London Sephardi Beth Din Dayan and sought-after speaker</h1>
  <p>Renowned for his clarity, depth and warmth, Dayan Kada brings together Torah scholarship, legal expertise and a passion for teaching.</p>
  ${searchBox()}<div class="b"><a class="btn" href="#/shiurim">Browse shiurim</a><a class="btn ghost" href="#/page/about">The Rabbi’s bio</a></div></div>
  <div class="ph"><b>New photo here</b><span>The Rabbi speaking to a large audience of young people (photo to come from the Rabbi)</span></div></section>
  <div class="week"><div class="l">THIS WEEK</div>${WEEK.map(([d, n, sl]) => { const l = latest(sl); return `<a href="#/series/${sl}"><div class="d J">${d}</div><div class="t">${n}</div><div class="s">Latest: ${esc(refShort(l, SE[sl]).split("|").pop().trim() || l.t)}</div></a>`; }).join("")}</div>
  ${thisWeek()}
  <section class="sec"><div class="head"><h2 class="sh">Latest shiurim</h2><a href="#/shiurim">All shiurim →</a></div><div class="cards">${WEEK.map(w => card(latest(w[2]), w[2])).join("")}</div></section>
  <section class="sec lavbg"><div class="head"><h2 class="sh">Shiurim by subject</h2><a href="#/shiurim">All ${Object.keys(SE).length} series →</a></div><div class="pg">
  ${D.subjects.map(s => { const n = s.id === "articles" ? D.articles.length : new Set(seriesOf(s.id).flatMap(x => x.items)).size; return `<a class="pl" href="#/${s.id === "articles" ? "articles" : "subject/" + s.id}"><div class="h">${s.heb}</div><div class="e">${s.name}</div><div class="c">${s.blurb}</div><div class="n">${n} ${s.id === "articles" ? "articles" : "shiurim"}</div></a>`; }).join("")}
  <a class="pl go wide" href="#/search/"><div class="h">חיפוש</div><div class="e">Search everything</div><div class="c">Every shiur, and the full text of the notes and transcripts, by topic</div></a></div></section>
  <section class="sec"><div class="head"><h2 class="sh">Daily Halacha</h2><a href="#/daily">All clips →</a></div><div class="cards c4">${(dh.items.filter(i => /hanuk|menorah|candle|antiochus|matityahu/i.test(SH[i].t)).slice(0, 4).length === 4 ? dh.items.filter(i => /hanuk|menorah|candle|antiochus|matityahu/i.test(SH[i].t)) : dh.items).slice(0, 4).map(i => { const s = SH[i]; return `<a class="card" href="#/shiur/${i}/${dh.slug}">${img(i)}<div class="bd"><div class="t">${esc(s.t)}</div><div class="m">${mins(s.d)}</div></div></a>`; }).join("")}</div></section>
  <section class="three"><div class="tc"><h3>Live</h3><p>Join the weekly shiurim live on Zoom and YouTube, Monday, Tuesday and Thursday evenings.</p><a class="btn" href="#/page/live">Watch now</a></div>
  <div class="tc"><h3>Events</h3><p>Upcoming special classes and lectures.</p><a class="btn" href="#/page/events">See what’s coming</a></div></section>
  ${askBlock()}`;
}
/* This week's Parashah and the coming festival, right under the weekly schedule (meeting, 11 Nov). D.now is worked out at build time. */
function thisWeek() {
  const n = D.now || {}, p = n.parasha, f = n.festival; if (!p && !f) return "";
  const pItems = p ? p.slugs.flatMap(s => SE[s] ? SE[s].items.map(i => [i, s]) : []).sort((a, b) => SH[b[0]].p.localeCompare(SH[a[0]].p)).slice(0, 4) : [];
  const fSeries = f ? Object.values(SE).filter(s => new RegExp(f.rx, "i").test(s.name)).sort((a, b) => (a.daily ? 1 : 0) - (b.daily ? 1 : 0) || b.items.length - a.items.length).slice(0, 4) : [];
  const eve = f ? fdate(new Date(Date.parse(f.date) - 864e5).toISOString().slice(0, 10)) : "";
  return `<section class="sec"><div class="head"><h2 class="sh">Parashah and festivals</h2></div>
  ${p ? `<div class="subh">This week’s Parashah: ${esc(p.name)}</div>${pItems.length ? `<div class="cards c4">${pItems.map(([i, s]) => card(SH[i], s)).join("")}</div>` : `<p><a href="#/search/${encodeURIComponent(p.name)}">Find shiurim on Parashat ${esc(p.name)} →</a></p>`}` : ""}
  ${f && fSeries.length ? `<div class="subh" style="margin-top:28px">Coming up: ${esc(f.name)} · begins the evening of ${eve}</div><div class="sgrid">${fSeries.map(seriesCard).join("")}</div>` : ""}</section>`;
}
function askBlock() {
  return `<section class="ask pat"><div><h2>Ask the Rabbi</h2><p>Send a question privately and the Rabbi will reply to you. Some questions, with names removed, may become Daily Halacha clips.</p></div>
  <form class="form" onsubmit="event.preventDefault();this.querySelector('.ok').textContent='Demo only: nothing was sent.'"><input placeholder="Your name"><input placeholder="Email"><textarea placeholder="Your question…"></textarea><button class="btn">Send question</button><div class="ok"></div></form></section>`;
}
const dhCover = `<div class="cover"><span class="heb">הלכה יומית</span><b>Daily Halacha</b></div>`;
const otherCover = `<div class="cover"><span class="heb">שונות</span><b>Other topics</b></div>`;
/* Daily Halacha comes straight after Shabbat (Rabbi: Shabbat, Daily Halacha, Hagim, Other topics); in the Hagim section, at the end */
const withDaily = (subs, parts, dcard) => { if (dcard) { const at = subs.indexOf("Shabbat"); parts.splice(at >= 0 ? at + 1 : parts.length, 0, dcard); } return parts.join(""); };
function shiurim() {
  const block = s => {
    const all = sortSeries(seriesOf(s.id)), fold = all.filter(x => x.daily).length > 3, shown = fold ? all.filter(x => !x.daily) : all, dly = fold ? all.filter(x => x.daily) : [];
    const sb = x => s.id === "hagim" ? "" : x.sub, subs = [...new Set(shown.map(sb))];
    const dcard = dly.length ? `<div class="subh">Daily Halacha</div><div class="sgrid"><a class="sc" href="#/daily">${dhCover}<div class="x"><div class="t">Daily Halacha: all ${dly.length} collections</div><div class="m">${new Set(dly.flatMap(x => x.items)).size} short clips, by time of year</div></div></a></div>` : "";
    return `<div class="head" id="sj-${s.id}" style="margin-top:44px"><h2 class="sh">${s.name} <span class="heb" style="color:var(--or);font-size:24px">${s.heb}</span></h2><a href="#/subject/${s.id}">Open ${s.name} →</a></div>
    ${withDaily(subs, subs.map(sub => `${sub ? `<div class="subh">${sub}</div>` : ""}<div class="sgrid">${shown.filter(x => sb(x) === sub).map(seriesCard).join("")}</div>`), dcard)}`;
  };
  /* quick links that jump to each subject on this page (meeting, 11 Nov); buttons, because links would change the route */
  const jump = `<div class="jump">${D.subjects.filter(s => s.id !== "articles").map(s => `<button onclick="document.getElementById('sj-${s.id}').scrollIntoView({behavior:'smooth'})">${s.name}</button>`).join("")}</div>`;
  return `<section class="top pat"><div class="crumb">Shiurim</div><h1>All shiurim</h1><p>Every series, by subject.</p>${searchBox()}${jump}</section>
  <section class="sec" style="padding-top:20px">${D.subjects.filter(s => s.id !== "articles").map(block).join("")}</section>`;
}
function subject(id) {
  const s = subj(id); if (!s) return notFound();
  const all = sortSeries(seriesOf(id)), sb = x => id === "hagim" ? "" : x.sub, subs = [...new Set(all.filter(x => !x.daily).map(sb))], dly = all.filter(x => x.daily);
  const n = new Set(all.flatMap(x => x.items)).size;
  return `<section class="top pat"><div class="crumb"><a href="#/shiurim">Shiurim</a> › ${s.name}</div><h1>${s.name}</h1><div class="hh heb">${s.heb}</div><p>${s.blurb}</p>
  <div class="stats"><div><b>${n}</b><span>Shiurim</span></div><div><b>${all.length}</b><span>Series</span></div></div></section>
  <section class="sec">${withDaily(subs, subs.map(sub => { const full = all.filter(x => sb(x) === sub && !x.daily);
    return `${sub ? `<div class="subh">${sub}</div>` : ""}<div class="sgrid">${full.map(seriesCard).join("")}</div>`; }),
    dly.length ? `<div class="subh">Daily Halacha</div><div class="sgrid">${dly.map(seriesCard).join("")}</div>` : "")}</section>`;
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
/* Related shiurim (meeting, 11 Nov): worked out at build time from what each shiur discusses (build/related.py) */
const related = x => (x.rl || []).map(i => SH[i]).filter(Boolean);
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
  <div><div class="box lk"><h3>This shiur</h3>${x.n ? pdfLink(x, "", "Download the notes (PDF)<span>⤓</span>") : ""}${x.nd ? `<a target="_blank" rel="noopener" href="https://docs.google.com/document/d/${x.nd}/edit">Notes as a document<span>→</span></a>` : ""}${x.tr ? `<a target="_blank" rel="noopener" href="${esc(x.tr)}">Full transcript<span>→</span></a>` : ""}${s.spotify ? `<a target="_blank" rel="noopener" href="${s.spotify}">Spotify podcast<span>→</span></a>` : ""}<a target="_blank" rel="noopener" href="https://youtu.be/${id}">Like or comment on YouTube<span>→</span></a><a target="_blank" rel="noopener" href="${share}">Share on WhatsApp<span>→</span></a></div>
  <div class="box"><h3>In this series</h3><div class="nx" style="border-bottom:1px solid var(--line)">${img(id)}<div><small>Now playing · ${i + 1} of ${s.items.length}</small><b>${esc(x.t)}</b></div></div>${nx(next, "Next")}${nx(prev, "Previous")}<div style="padding-top:14px"><a class="btn sm" href="#/series/${s.slug}">Whole series</a></div></div>
  ${(r => r.length ? `<div class="box"><h3>Related shiurim</h3>${r.map(y => nx(y, primary(y).name.split(/[:(]/)[0])).join("")}</div>` : "")(related(x))}
  <div class="box"><h3>Ask the Rabbi</h3><p>Ask the Rabbi about this shiur, privately.</p><div style="margin-top:12px"><a class="btn ghost sm" href="#/page/ask">Ask a question</a></div></div></div></section>`;
}
/* The notes as a branded PDF ("Dayan Daniel Kada"), made by build/notes_pdf.py */
const pdfLink = (x, cls, label = "⤓ Notes as PDF") => `<a class="${cls}" href="pdf/${x.id}.pdf" download="${esc(("Dayan Daniel Kada - " + x.t).replace(/[\\/:*?"<>|]/g, "").slice(0, 120))}.pdf">${label}</a>`;
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
  const load = (k, url, fallback) => fetch(url).then(r => r.ok ? r.text() : Promise.reject()).then(h => { if (pane(k)) { pane(k).innerHTML = (k === "n" ? `<div class="notesbar"><a class="pdf" href="pdf/${x.id}.pdf" target="_blank" rel="noopener">⤓ Notes as PDF</a></div>` : "") + h; if (k === "t") wireTranscript(x); } }).catch(() => { if (pane(k)) pane(k).innerHTML = fallback; });
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
  /* the coming festival's collections first (meeting, 11 Nov) */
  const f = (D.now || {}).festival, soon = f ? ds.filter(s => new RegExp(f.rx, "i").test(s.name)) : [], rest = ds.filter(s => !soon.includes(s));
  return `<section class="top pat"><div class="crumb"><a href="#/shiurim">Shiurim</a> › <a href="#/subject/halacha">Halacha</a> › Daily Halacha</div><h1>Daily Halacha</h1><p>Short clips answering one practical question each, grouped by time of year.</p><div class="stats"><div><b>${n}</b><span>Clips</span></div><div><b>${ds.length}</b><span>Collections</span></div></div></section>
  <section class="sec">${soon.length ? `<div class="subh">Coming up: ${esc(f.name)}</div><div class="sgrid">${soon.map(seriesCard).join("")}</div><div class="subh" style="margin-top:28px">All collections</div>` : ""}<div class="sgrid">${rest.map(seriesCard).join("")}</div></section>`;
}
const POD_TOP = ["moreh-nevuchim", "hamaspik-leovdei-hashem", "emunot-vedeot", "hilchot-shabbat"];
function podCard(s) {
  const clip = s.feed === "parasha" || s.feed === "feed", name = s.feed === "parasha" ? "Weekly Parashah" : s.feed === "feed" ? "Daily Halacha: Elul to Sukkot" : s.name;
  const to = s.feed === "parasha" ? "#/subject/parasha" : s.feed === "feed" ? "#/daily" : "#/series/" + s.slug;
  return `<div class="sc"><a href="${to}">${img(s.items[0])}</a><div class="x"><div class="t"><a href="${to}">${esc(name)}</a></div><div class="m">${subj(s.subject).name}${s.sub ? " · " + s.sub : ""}</div>
  <div class="m"><a href="${to}" style="color:var(--navy)">${clip ? "Open on the site" : "Open the series"} →</a> &nbsp; <a target="_blank" rel="noopener" href="${s.spotify}" style="color:var(--gold)">Spotify →</a></div></div></div>`;
}
function podcasts() {
  const seen = new Set(), shows = [], rank = s => { const i = POD_TOP.indexOf(s.slug); return i >= 0 ? i : 10 + D.subjects.findIndex(x => x.id === s.subject) * 10 + SUBORDER.indexOf(s.sub); };
  Object.values(SE).filter(s => s.spotify && !s.topic).sort((a, b) => rank(a) - rank(b) || b.items.length - a.items.length).forEach(s => { if (!seen.has(s.spotify)) { seen.add(s.spotify); shows.push(s); } });
  const clips = s => s.daily || s.feed === "parasha" || s.feed === "feed", main = shows.filter(s => !clips(s)), short = shows.filter(clips);
  return `<section class="top pat"><div class="crumb">Podcasts</div><h1>Podcasts</h1><p><b style="color:#fff">The same shiurim, to listen to.</b> Each series on the Shiurim page is also an audio podcast. Follow it in Spotify or Apple Podcasts and every new shiur arrives on your phone automatically, to hear on the way to work or in the car. Nothing here is separate from the Shiurim page: each one opens the same series.</p>
  <div class="stats"><div><b>${shows.length}</b><span>Podcasts on Spotify</span></div></div></section>
  <section class="sec"><div class="subh">Series</div><div class="sgrid">${main.map(podCard).join("")}</div>
  <div class="subh">Short clips: Daily Halacha and Parashah</div><div class="sgrid">${short.map(podCard).join("")}</div></section>`;
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
/* Sounds-alike matching. Transliterations vary ("Noda Biyehudah", "Noda Bi Huda", "Nodabi Yoda"), so each search word is also turned into
   its consonant skeleton and matched with flexible spelling: vowels, h and y may vary; s ~ tz/ts/z; k ~ kh/ch/c/q/h; v ~ b/w; spaces may split a word. */
const SKEL = s => s.toLowerCase().replace(/(tz|ts|z)/g, "s").replace(/(kh|ch|ck|c|q)/g, "k").replace(/ph/g, "f").replace(/w/g, "v").replace(/[^a-z]/g, "").replace(/[aeiouyh]/g, "").replace(/(.)\1+/g, "$1");
const CLS = { s: "(?:tz|ts|ss|s|z)", k: "(?:kh|ch|ck|c|q|k|h)", v: "[vwb]", b: "[bv]", f: "(?:ph|f|p)", t: "(?:th|t|s)" };
function fuzzyRe(q) {
  /* word by word: each search word must match one word in the text (which may be split by one space, "Bi Huda"), with nothing in between the words */
  const words = q.trim().split(/\s+/).map(x => [x, SKEL(x)]).filter(([, s]) => s.length);
  if (!words.length || words.reduce((a, [, s]) => a + s.length, 0) < 3 || words.length === 1 && words[0][1].length < 4) return null;  /* one short word ("chanuk") sounds like too many English words */
  const gap = "(?:[aeiouyh'’\\-]|ch|kh| (?=[aeiouyh])){0,6}";
  const one = ([w, sk]) => (/^[aeiouy]/i.test(w) ? "(?:[aeiouy]|h){0,2}" : /^h/i.test(w) ? "(?:ch|kh|h)[aeiouy]{0,2}" : "") + [...sk].map((c, i) => (c === "k" && i ? "(?:kh|ch|ck|c|q|k)" : CLS[c] || c) + "+").join(gap) + "[aeiouyh]{0,3}";
  return new RegExp("\\b" + words.map(one).join("[\\s\\-]*") + "\\b", "i");
}
/* Hebrew forms of names that the Sofer transcripts write in Hebrew letters */
const ALIAS = [["noda biyehudah", "נודע ביהודה"], ["rambam", "רמב\"ם|רמבם|הרמב\"ם"], ["shulhan arukh", "שולחן ערוך|שלחן ערוך"], ["gemara", "גמרא|הגמרא"],
  ["hatam sofer", "חתם סופר"], ["mishnah berurah", "משנה ברורה"], ["ben ish hai", "בן איש חי"], ["kaf hahayim", "כף החיים"], ["rav ovadia", "עובדיה"],
  ["igrot moshe", "אגרות משה"], ["rashi", "רש\"י"], ["ramban", "רמב\"ן"], ["rabbeinu avraham", "רבינו אברהם|רבנו אברהם"], ["hazal", "חז\"ל"],
  ["shabbat", "שבת"], ["hanukkah", "חנוכה|chanukah|chanukkah|chanuka|hanukkah|hanukah|hanuka"], ["pesah", "פסח|pesach"], ["teshuvah", "תשובה"], ["misvah", "מצוה|מצווה|mitzvah|mitzva|mitsvah"],
  ["misvot", "מצות|מצוות|mitzvot|mitzvos|mitsvot"], ["bitahon", "ביטחון|בטחון|bitachon"], ["hames", "חמץ|chametz|chometz|hametz"], ["massah", "מצה|matzah|matza|matsa"],
  ["sukkah", "סוכה|succah|sukka"], ["kiddush", "קידוש"], ["havdalah", "הבדלה"], ["tefillin", "תפילין|tefilin|tfillin"], ["sisit", "ציצית|tzitzit|tsitsit"]];
function hebrewFor(q) { const sk = q.trim().split(/\s+/).map(WSK).join(""); const a = ALIAS.find(([e]) => SKEL(e) === sk || e.split(" ").map(WSK).join("") === sk); return a ? new RegExp(a[1], "i") : null; }
/* Part of a known name ("nodeh", "noda b", "shulhan") also searches for the whole name, in any spelling and in Hebrew */
const WSK = w => SKEL(w.replace(/^(ch|kh)/i, "h"));
function namesFor(q) {
  const qs = q.trim().split(/\s+/).map(WSK).filter(Boolean); if (!qs.length || qs.join("").length < 2) return [];
  return ALIAS.filter(([e]) => {
    const es = e.split(" ").map(WSK), n = qs.length - 1;
    if (qs.length > es.length || qs.join() === es.join()) return false;
    return qs.every((s, i) => i < n ? s === es[i] : es[i].startsWith(s) && (s.length >= 2 || n > 0));
  }).slice(0, 3).map(([e, heb]) => ({ name: e.replace(/\b\w/g, c => c.toUpperCase()), re: fuzzyRe(e), he: new RegExp(heb, "i") }));
}

async function runSearch(q) {
  const box = document.getElementById("res"); if (!q || !box) return;
  const w = q.toLowerCase().split(/\s+/).filter(Boolean), hl = t => w.reduce((a, x) => a.replace(new RegExp("(" + x.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + ")", "ig"), "<mark>$1</mark>"), esc(t));
  const titleHits = Object.values(SH).filter(x => { const h = (x.t + " " + x.r + " " + x.s.map(s => SE[s].name).join(" ")).toLowerCase(); return w.every(y => h.includes(y)); });
  box.innerHTML = titleHits.length ? `<p style="color:var(--mut)">Searching inside every shiur…</p>` : "Searching inside every shiur…";
  await loadNotes();
  const seen = new Set(titleHits.map(x => x.id)), noteHits = [], fz = fuzzyRe(q), he = hebrewFor(q);
  /* different spellings are only looked for when the exact words are rare, so common English words don't flood the results */
  const exactCount = Object.values(window.TRANS || {}).concat(Object.values(window.NOTES || {})).reduce((a, s) => a + (w.every(y => s.toLowerCase().includes(y)) ? 1 : 0), titleHits.length);
  const fuzzyOn = exactCount < 15, names = fuzzyOn ? namesFor(q) : [];
  for (const nm of names) Object.values(SH).forEach(x => { if (!seen.has(x.id) && (nm.re && nm.re.test(x.t) || nm.he.test(x.t))) { seen.add(x.id); titleHits.push(x); } });
  const snip = (text, at, len) => { const a = Math.max(0, at - 90); return { snip: (a > 0 ? "… " : "") + text.slice(a, at + len + 160) + " …", mark: text.slice(at, at + len) }; };
  for (const [src, where, tab] of [[window.NOTES || {}, "in the notes", "n"], [window.TRANS || {}, "in the transcript", "t"]]) {
    for (const [id, text] of Object.entries(src)) {
      if (seen.has(id) || !SH[id]) continue;
      const low = text.toLowerCase(); let hit = null;
      if (w.every(y => low.includes(y))) { let at = low.indexOf(q.toLowerCase()); const phrase = at >= 0; if (at < 0) at = low.indexOf(w[0]); hit = { rank: phrase ? 3 : 2, ...snip(text, at, q.length) }; }
      else if (he) { const m = he.exec(text); if (m) hit = { rank: 2, ...snip(text, m.index, m[0].length), how: "in Hebrew" }; }
      if (!hit && fz && fuzzyOn) { const m = fz.exec(text); if (m) hit = { rank: 1, ...snip(text, m.index, m[0].length), how: "spelled “" + m[0].trim() + "”" }; }
      for (const nm of names) { if (hit) break; const m = nm.re && nm.re.exec(text) || nm.he.exec(text); if (m) hit = { rank: 1, ...snip(text, m.index, m[0].length), how: nm.name + (m[0].trim().toLowerCase() === nm.name.toLowerCase() ? "" : ", spelled “" + m[0].trim() + "”") }; }
      if (!hit) continue;
      seen.add(id); noteHits.push({ x: SH[id], where: where + (hit.how ? ", " + hit.how : ""), tab, ...hit });
    }
  }
  noteHits.sort((a, b) => b.rank - a.rank);
  const mk = (s, m) => m ? esc(s).split(esc(m)).join(`<mark>${esc(m)}</mark>`) : hl(s);
  const row = (x, h, where, tab) => `<a class="hit" href="#/shiur/${x.id}${tab ? "/-/" + tab : ""}">${img(x.id)}<div><div class="k">${esc(primary(x).name.split(/[:(]/)[0])} · ${where}</div><div class="t">${hl(x.t)}</div>${h ? `<div class="s">${h.rank === 3 || h.rank === 2 && !h.how ? hl(h.snip) : mk(h.snip, h.mark)}</div>` : ""}</div></a>`;
  if (location.hash !== "#/search/" + encodeURIComponent(q)) return;
  const nT = Object.keys(window.TRANS || {}).length;
  box.innerHTML = `<p style="color:var(--mut);margin-bottom:8px"><b>${titleHits.length}</b> shiurim match by title and <b>${noteHits.length}</b> more mention it inside the shiur (searching the notes and the ${nT} transcripts, including different spellings).${names.length ? ` Also showing <b>${names.map(n => esc(n.name)).join("</b>, <b>")}</b>.` : ""}</p>` +
    (titleHits.slice(0, 40).map(x => row(x, null, "title")).join("") + noteHits.slice(0, 100).map(h => row(h.x, h, h.where, h.tab)).join("") || "No results.");
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
