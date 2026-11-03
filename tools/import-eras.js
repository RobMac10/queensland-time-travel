#!/usr/bin/env node
// One-off importer. Reads the ARCHIVED story versions (git tag `story-version`, folder archive/story-version/)
// of the four information-bank repos and writes one normalised JSON file per era into src/eras/.
// It copies the story text, Real history facts, sources, Behind the Story and discussion questions as they were.
// It does not add any history. Framing text for the time-travel app lives in src/framing.js.
// Run from the project root, with the four repos next to this one:  node tools/import-eras.js
const fs = require('fs'), path = require('path');
const REPOS = path.resolve(__dirname, '..', '..');
const OUT = path.resolve(__dirname, '..', 'src', 'eras');
const IMG = path.resolve(__dirname, '..', 'images');

function load(repo, files, g) {
  global.window = {};
  for (const f of files) { const p = path.join(REPOS, repo, 'archive/story-version/src', f); delete require.cache[p]; require(p); }
  return window[g];
}
function info(repo) { global.window = {}; const p = path.join(REPOS, repo, 'src/info.js'); delete require.cache[p]; require(p); return window.INFO; }
const clone = o => JSON.parse(JSON.stringify(o));

function normNode(id, n, whereMap) {
  const o = { id, title: n.title };
  const where = n.where || (whereMap && whereMap[id]) || null;
  if (where) o.where = where;
  if (n.img) o.img = n.img;
  if (n.set) o.set = n.set;
  o.text = clone(n.text);
  if (n.choices) o.choices = n.choices.map(c => { const x = { label: c.label || c.t, to: c.to }; if (c.set) x.set = c.set; if (c.if) x.if = c.if; return x; });
  if (n.real) o.real = n.real.map(r => ({ paras: [r.t], src: r.src }));
  else o.real = [n.fact, n.fact2].filter(Boolean).map(f => ({ h: f.h, paras: f.text, src: f.src }));
  if (n.end) { o.end = true; o.kind = n.kind || ''; if (n.summary) o.summary = n.summary; }
  if (n.teacher) o.teacher = Array.isArray(n.teacher) ? { notes: n.teacher } : n.teacher;
  return o;
}
function normQs(groups) { return groups.map(g => ({ h: g.h, qs: g.qs.map(q => ({ q: q.q, a: q.answer || (q.a ? [q.a] : []) })) })); }
function behindFromList(B, caution) {
  const s = [];
  s.push({ kind: 'made', h: 'What is invented', list: B.invented });
  s.push({ kind: 'plain', h: 'What the story leaves out on purpose', list: B.left });
  s.push({ kind: 'plain', h: 'Fairness to the people in the story', list: B.caution });
  return s;
}

const eras = {};

// ---------- Grass Rush and Gold Rush (same data shape) ----------
for (const [id, repo] of [['grass', 'grass-rush-adventure'], ['gold', 'qld-gold-rush-adventure']]) {
  const D = load(repo, ['data.js'], 'APP');
  const nodes = {};
  for (const k of D.order) if (k !== 'start') nodes[k] = normNode(k, D.nodes[k]);
  const images = {};
  for (const [k, im] of Object.entries(D.images)) images[k] = { file: 'images/' + im.file, alt: im.alt, caption: im.caption, credit: im.credit, url: im.url, people: false };
  eras[id] = {
    id, repo,
    startChoices: D.nodes.start.choices.map(c => ({ label: c.t, to: c.to })),
    startText: D.nodes.start.text, startTeacher: D.nodes.start.teacher,
    warning: D.warning, review: null,
    sources: D.sources, sourcesIntro: D.sourcesIntro, imageNote: D.imageNote,
    images, nodes,
    behind: { sections: D.behind.sections.map(s => clone(s)) },
    discuss: normQs(D.discuss)
  };
}
// ---------- Native Police ----------
{
  const D = load('native-police-adventure', ['data1.js', 'data2.js', 'data3.js'], 'NPA');
  const where = {}; for (const k of Object.keys(D.nodes)) where[k] = 'Central Queensland · late 1870s';
  const nodes = {}; for (const [k, n] of Object.entries(D.nodes)) nodes[k] = normNode(k, n, where);
  const I = info('native-police-adventure');
  const im = D.behind.image;
  const images = {
    troopers: { file: im.file, alt: im.alt, caption: im.cap, credit: '', url: D.sources[im.src].u, people: true, summary: 'the 1864 photograph of Native Mounted Police at Rockhampton (it shows men who have died)' },
    quay: { file: I.images.quay.file, alt: I.images.quay.alt, caption: I.images.quay.caption, credit: I.images.quay.credit, url: I.images.quay.url, people: false }
  };
  eras.np = {
    id: 'np', repo: 'native-police-adventure',
    startChoices: null,
    warning: D.opening.warning, review: D.opening.review,
    sources: D.sources, sourcesIntro: null, imageNote: D.behind.imageNote,
    images, nodes,
    behind: { intro: D.behind.intro, sections: behindFromList(D.behind) },
    discuss: [{ h: 'Discuss', qs: D.discuss.map(q => ({ q: q.q, a: [q.a] })) }, { h: 'Write', qs: D.write.map(q => ({ q: q.q, a: [q.a] })) }],
    teacherNotes: D.teacherNotes, openingIntro: D.opening.intro
  };
}
// ---------- Sugar ----------
{
  const D = load('sugar-story-adventure', ['data1.js', 'data2.js', 'data3.js', 'data4.js'], 'SS');
  const W = 'Mackay district, Queensland';
  const where = { how: 'An island in the New Hebrides · 1884', ship: 'At sea · 1884', landing: 'Mackay · 1884', work: W + ' · 1884', sick: W + ' · 1884', wages: W, creek: W,
    contract_end: W + ' · 1887', home: 'Home island · 1887 to 1889', return: W + ' · 1889', central: W + ' · the 1890s', protector: W + ' · 1897', law1901: W + ' · 1901',
    petition: W + ' · 1904 to 1906' };
  const nodes = {}; for (const [k, n] of Object.entries(D.nodes)) nodes[k] = normNode(k, n, where);
  const I = info('sugar-story-adventure');
  const images = {};
  for (const im of D.behind.images) images[im.src === 'photoBundaberg' ? 'bundaberg' : 'hambledon'] = { file: im.file, alt: im.alt, caption: im.cap, credit: '', url: D.sources[im.src].u, people: true, summary: im.summary.replace(/^Image \d: /, '') };
  const m = I.images.mill;
  images.mill = { file: m.file, alt: m.alt, caption: m.caption, credit: m.credit, url: m.url, people: true, summary: m.summary };
  eras.sugar = {
    id: 'sugar', repo: 'sugar-story-adventure',
    startChoices: null,
    warning: D.opening.warning, review: D.opening.review,
    sources: D.sources, sourcesIntro: null, imageNote: D.behind.imageNote,
    images, nodes,
    behind: { intro: D.behind.intro, sections: behindFromList(D.behind) },
    discuss: [{ h: 'Discuss', qs: D.discuss.map(q => ({ q: q.q, a: [q.a] })) }, { h: 'Write', qs: D.write.map(q => ({ q: q.q, a: [q.a] })) }],
    teacherNotes: D.teacherNotes, openingIntro: D.opening.intro
  };
}
fs.mkdirSync(OUT, { recursive: true }); fs.mkdirSync(IMG, { recursive: true });
for (const [id, e] of Object.entries(eras)) {
  fs.writeFileSync(path.join(OUT, id + '.json'), JSON.stringify(e, null, 1) + '\n');
  for (const im of Object.values(e.images)) {
    const f = path.basename(im.file); const srcDir = path.join(REPOS, e.repo, 'images');
    fs.copyFileSync(path.join(srcDir, f), path.join(IMG, f));
  }
  console.log(id, Object.keys(e.nodes).length, 'nodes');
}
