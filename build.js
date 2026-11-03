#!/usr/bin/env node
// Builds the student version (site root) and the teacher version (teacher/) from src/.
// Run:  node build.js
// Source: src/framing.js, src/eras/*.json, src/app.js, src/index.html, src/styles.css, and images/.
// Student build removes: every "teacher" key on a scene, discussion answers ("a"), teacher notes, the hub's teacher
//   section, app.js blocks between /*T*/ and /*/T*/ markers, and index.html blocks between <!--T--> markers.
const fs = require('fs'), path = require('path');
const root = __dirname, src = path.join(root, 'src');
global.window = {};
require(path.join(src, 'framing.js'));
const F = window.FRAMING;

const eras = {};
for (const id of F.order) eras[id] = JSON.parse(fs.readFileSync(path.join(src, 'eras', id + '.json'), 'utf8'));

// ---- checks: every source key, node link and image key must exist ----
let bad = 0;
const fail = m => { console.error('CHECK FAILED: ' + m); bad++; };
for (const [id, e] of Object.entries(eras)) {
  const start = e.startChoices ? e.startChoices.map(c => c.to) : [F.eras[id].begin];
  start.forEach(t => { if (!e.nodes[t]) fail(id + ' start -> ' + t); });
  for (const [k, n] of Object.entries(e.nodes)) {
    if (n.img && !e.images[n.img]) fail(id + '.' + k + ' image ' + n.img);
    if (!n.real || !n.real.length) fail(id + '.' + k + ' has no real history');
    (n.real || []).forEach(r => r.src.forEach(s => { if (!e.sources[s]) fail(id + '.' + k + ' source ' + s); }));
    (n.choices || []).forEach(c => { if (!e.nodes[c.to]) fail(id + '.' + k + ' choice -> ' + c.to); });
    if (!n.end && !(n.choices && n.choices.length)) fail(id + '.' + k + ' dead end');
  }
  if (!Object.values(e.nodes).some(n => n.end)) fail(id + ' has no ending');
  if (!e.images[F.eras[id].hero]) fail(id + ' hero image');
  F.eras[id].arrivalReal.concat(F.eras[id].countryReal).forEach(([nk, a, b]) => {
    const idx = typeof a === 'number' ? a : b;
    if (!e.nodes[nk] || !e.nodes[nk].real[idx]) fail(id + ' arrival/country real ' + nk + ' ' + idx);
  });
}
if (!eras.gold.images[F.hero.image]) fail('hub hero image');
if (bad) process.exit(1);

const DATA = { hub: F, eras };
function strip(D) {
  for (const e of Object.values(D.eras)) {
    delete e.startTeacher; delete e.teacherNotes;
    for (const n of Object.values(e.nodes)) delete n.teacher;
    e.discuss.forEach(g => g.qs.forEach(q => delete q.a));
  }
  delete D.hub.teacher;
  return D;
}
function codeMode(s, mode) {
  if (mode === 'student') s = s.replace(/\/\*T\*\/[\s\S]*?\/\*\/T\*\//g, '');
  return s.replace(/\/\*\/?T\*\//g, '');
}
function htmlMode(s, mode) {
  if (mode === 'student') s = s.replace(/<!--T-->[\s\S]*?<!--\/T-->/g, '');
  return s.replace(/<!--\/?T-->/g, '');
}
function out(dir, mode) {
  fs.mkdirSync(dir, { recursive: true });
  let D = JSON.parse(JSON.stringify(DATA));
  if (mode === 'student') D = strip(D);
  fs.writeFileSync(path.join(dir, 'data.js'), 'window.QTT=' + JSON.stringify(D) + ';\n');
  fs.writeFileSync(path.join(dir, 'app.js'), codeMode(fs.readFileSync(path.join(src, 'app.js'), 'utf8'), mode));
  let h = htmlMode(fs.readFileSync(path.join(src, 'index.html'), 'utf8'), mode);
  if (mode === 'teacher') h = h.replace('<meta name="theme-color"', '<meta name="robots" content="noindex">\n<meta name="theme-color"');
  fs.writeFileSync(path.join(dir, 'index.html'), h);
  fs.copyFileSync(path.join(src, 'styles.css'), path.join(dir, 'styles.css'));
  fs.mkdirSync(path.join(dir, 'images'), { recursive: true });
  for (const f of fs.readdirSync(path.join(root, 'images'))) fs.copyFileSync(path.join(root, 'images', f), path.join(dir, 'images', f));
}
out(root, 'student');
out(path.join(root, 'teacher'), 'teacher');
console.log('built student (/) and teacher (/teacher/)');
