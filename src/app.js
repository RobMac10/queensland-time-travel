(function () {
  'use strict';
  var D = window.QTT, H = D.hub, E = D.eras, ORDER = H.order;
  var main = document.getElementById('main'), nav = document.getElementById('nav'), foot = document.getElementById('foot');
  var BANK = 'https://robmac10.github.io/';
  var PKEY = 'qtt-progress-v1', RKEY = 'qtt-run-v1';

  /* ---------- storage (falls back to memory if the browser blocks it) ---------- */
  var mem = {};
  function store(kind) { try { var s = window[kind]; s.setItem('qtt-test', '1'); s.removeItem('qtt-test'); return s; } catch (e) { return null; } }
  var LS = store('localStorage'), SS = store('sessionStorage');
  function rd(s, k) { try { return JSON.parse(s ? s.getItem(k) : mem[k]); } catch (e) { return null; } }
  function wr(s, k, v) { var t = JSON.stringify(v); try { if (s) s.setItem(k, t); else mem[k] = t; } catch (e) { mem[k] = t; } }
  var progress = rd(LS, PKEY) || { eras: {} };
  function saveProgress() { wr(LS, PKEY, progress); }
  function eraProg(id) { if (!progress.eras[id]) progress.eras[id] = { endings: {}, chars: {} }; return progress.eras[id]; }
  function visited(id) { var p = progress.eras[id]; return !!(p && p.endings && Object.keys(p.endings).length); }
  function visitedCount() { return ORDER.filter(visited).length; }
  function allVisited() { return visitedCount() === ORDER.length; }
  var run = rd(SS, RKEY);
  function saveRun() { wr(SS, RKEY, run); }

  /* ---------- helpers ---------- */
  function el(tag, attrs, kids) {
    var e = document.createElement(tag);
    if (attrs) for (var k in attrs) {
      if (attrs[k] == null) continue;
      if (k === 'text') e.textContent = attrs[k];
      else if (k === 'class') e.className = attrs[k];
      else e.setAttribute(k, attrs[k]);
    }
    (kids || []).forEach(function (c) { if (c) e.appendChild(typeof c === 'string' ? document.createTextNode(c) : c); });
    return e;
  }
  function p(t, cls) { return el('p', cls ? { 'class': cls, text: t } : { text: t }); }
  function ul(list) { var u = el('ul'); list.forEach(function (t) { u.appendChild(el('li', { text: t })); }); return u; }
  function link(href, text, cls, ext) { var a = el('a', { href: href, 'class': cls || null, text: text }); if (ext) { a.setAttribute('target', '_blank'); a.setAttribute('rel', 'noopener'); } return a; }
  function stopNo(id) { return ORDER.indexOf(id) + 1; }
  function matches(c) { if (!c) return true; for (var k in c) if (run.v[k] !== c[k]) return false; return true; }
  function copy(o) { return JSON.parse(JSON.stringify(o || {})); }
  function srcLinks(id, keys) {
    var wrap = el('span', { 'class': 'srcs' }, [el('span', { text: 'Source: ' })]);
    keys.forEach(function (k, i) {
      var s = E[id].sources[k]; if (!s) return;
      if (i) wrap.appendChild(document.createTextNode('; '));
      wrap.appendChild(link(s.u, s.short || s.t, null, true));
    });
    return wrap;
  }
  function realBox(id, blocks, title, open) {
    var d = el('details', { 'class': 'panel real' });
    if (open) d.setAttribute('open', '');
    d.appendChild(el('summary', { text: title || 'Real history for this scene' }));
    blocks.forEach(function (b) {
      var w = el('div', { 'class': 'rblock' }, [el('span', { 'class': 'badge b-real', text: 'Real' })]);
      if (b.h) w.appendChild(el('h3', { text: b.h }));
      b.paras.forEach(function (t) { w.appendChild(p(t)); });
      w.appendChild(srcLinks(id, b.src));
      d.appendChild(w);
    });
    return d;
  }
  function pickBlocks(id, picks) { return picks.map(function (k) { var nk = k[0], idx = typeof k[1] === 'number' ? k[1] : k[2]; return E[id].nodes[nk].real[idx]; }); }
  function figure(id, key, cls) {
    var im = E[id].images[key];
    var f = el('figure', { 'class': cls || null });
    f.appendChild(el('img', { src: im.file, alt: im.alt, loading: 'lazy' }));
    var cap = el('figcaption', null, [document.createTextNode(im.caption + ' ')]);
    if (im.credit) cap.appendChild(document.createTextNode(im.credit + '. '));
    cap.appendChild(link(im.url, 'Image page', null, true));
    f.appendChild(cap);
    return f;
  }
  function credit(id, key) {
    var im = E[id].images[key];
    return el('p', { 'class': 'bcredit' }, [document.createTextNode(im.caption + (im.credit ? ' ' + im.credit + '. ' : ' ')), link(im.url, 'Image page', null, true)]);
  }
  /*T*/
  function toggle(label, content) {
    var tid = 't' + Math.random().toString(36).slice(2, 8);
    var b = el('button', { type: 'button', 'class': 'btn small tog', 'aria-expanded': 'false', 'aria-controls': tid, text: 'Show ' + label });
    var box = el('div', { id: tid, 'class': 'tbox', hidden: '' });
    box.appendChild(content);
    b.addEventListener('click', function () {
      var open = box.hasAttribute('hidden');
      if (open) box.removeAttribute('hidden'); else box.setAttribute('hidden', '');
      b.setAttribute('aria-expanded', open ? 'true' : 'false');
      b.textContent = (open ? 'Hide ' : 'Show ') + label;
    });
    return el('div', { 'class': 'tgroup' }, [b, box]);
  }
  function teacherBlock(t) {
    if (!t) return null;
    var inner = el('div');
    if (t.about) inner.appendChild(el('p', null, [el('b', { text: 'About this scene. ' }), document.createTextNode(t.about)]));
    if (t.notes) inner.appendChild(ul(t.notes));
    if (t.ask && t.ask.length) {
      inner.appendChild(el('h3', { text: 'Questions to ask' })); inner.appendChild(ul(t.ask));
      inner.appendChild(el('h3', { text: 'Suggested answers' })); inner.appendChild(ul(t.answers));
    }
    var wrap = el('div', { 'class': 'panel teacher' });
    wrap.appendChild(el('h2', { text: 'Teacher notes' }));
    wrap.appendChild(toggle('notes for this scene', inner));
    return wrap;
  }
  /*/T*/

  /* ---------- page frame ---------- */
  var curEra = null;
  function setEra(id) {
    curEra = id;
    var s = document.body.style;
    if (id) { s.setProperty('--accent', H.eras[id].color); s.setProperty('--deep', H.eras[id].deep); document.body.setAttribute('data-era', id); }
    else { s.removeProperty('--accent'); s.removeProperty('--deep'); document.body.removeAttribute('data-era'); }
  }
  function setPage(title, nodes, opts) {
    opts = opts || {};
    main.innerHTML = '';
    var wrap = el('div', { 'class': opts.wide ? 'page wide' : 'page' });
    (opts.pre || []).forEach(function (n) { main.appendChild(n); });
    if (opts.h1 !== false) wrap.appendChild(el('h1', { tabindex: '-1', text: title, id: 'h1' }));
    nodes.forEach(function (n) { if (n) wrap.appendChild(n); });
    if (!opts.noHome) wrap.appendChild(homeBar());
    main.appendChild(wrap);
    document.title = title + ' · ' + H.title;
    window.scrollTo(0, 0);
    var h = document.getElementById(opts.focus || 'h1'); if (h) h.focus({ preventScroll: true });
    main.classList.remove('fade'); void main.offsetWidth; main.classList.add('fade');
  }
  function homeBar() {
    return el('div', { 'class': 'homebar' }, [
      el('a', { 'class': 'btn dark', href: '#/', text: 'Back to the hub' }),
      el('a', { 'class': 'btn home', href: H.siteHome, text: 'Home' })
    ]);
  }
  function renderNav(route) {
    nav.innerHTML = '';
    var items = [['#/', 'Hub'], ['#/behind', 'Behind the Story'], ['#/about', 'About']];
    if (allVisited()) items.push(['#/country', 'Back to Country']);
    /*T*/ if (!allVisited()) items.push(['#/country', 'Back to Country']); items.push(['#/teacher', 'Teacher notes']); /*/T*/
    items.forEach(function (it) {
      var a = el('a', { href: it[0], text: it[1] });
      var cur = (it[0] === '#/' && (route === '' || route.indexOf('era/') === 0)) || it[0] === '#/' + route;
      if (cur) a.setAttribute('aria-current', 'page');
      nav.appendChild(a);
    });
    nav.appendChild(el('span', { 'class': 'pill', title: 'Eras visited on this device', text: visitedCount() + ' of ' + ORDER.length + ' visited' }));
  }

  /* ---------- era tabs and links ---------- */
  function bankUrl(id, part) { return BANK + E[id].repo + '/' + (part || ''); }
  function bankLinks(id) {
    var w = el('div', { 'class': 'banklinks' });
    w.appendChild(link(bankUrl(id), 'Open the information bank: ' + H.eras[id].name, 'btn big', true));
    w.appendChild(el('p', { 'class': 'small' }, [
      document.createTextNode('Go straight to: '),
      link(bankUrl(id, '#/timeline'), 'Timeline', null, true), document.createTextNode(' · '),
      link(bankUrl(id, '#/lives'), 'Real lives', null, true), document.createTextNode(' · '),
      link(bankUrl(id, '#/places'), 'Places', null, true), document.createTextNode(' · '),
      link(bankUrl(id, '#/sources'), 'Sources', null, true)
    ]));
    /*T*/ w.appendChild(el('p', { 'class': 'small' }, [document.createTextNode('Teacher version of this information bank: '), link(bankUrl(id, 'teacher/'), 'open it here', null, true), document.createTextNode('.')])); /*/T*/
    return w;
  }
  function etabs(id, cur) {
    var t = el('nav', { 'class': 'etabs', 'aria-label': H.eras[id].name + ' pages' });
    [['', 'Visit'], ['behind', 'Behind the Story'], ['discuss', 'Discuss and write'], ['sources', 'Sources']].forEach(function (x) {
      var a = el('a', { href: '#/era/' + id + (x[0] ? '/' + x[0] : ''), text: x[1] });
      if (x[0] === cur) a.setAttribute('aria-current', 'page');
      t.appendChild(a);
    });
    t.appendChild(link(bankUrl(id), 'Information bank', null, true));
    return t;
  }
  function banner(id, kicker, big, small, compact) {
    var hero = E[id].images[H.eras[id].hero];
    var b = el('section', { 'class': 'banner' + (compact ? ' compact' : ''), 'aria-label': 'Era banner' });
    b.appendChild(el('img', { src: hero.file, alt: '', 'aria-hidden': 'true' }));
    b.appendChild(el('div', { 'class': 'shade' }));
    var t = el('div', { 'class': 'btext' });
    t.appendChild(el('p', { 'class': 'kick', text: kicker }));
    t.appendChild(el('p', { 'class': 'big', text: big }));
    if (small) t.appendChild(el('p', { 'class': 'sm', text: small }));
    b.appendChild(t);
    b.appendChild(credit(id, H.eras[id].hero));
    return b;
  }

  /* ---------- hub ---------- */
  function warnBox() {
    var w = el('div', { 'class': 'care', role: 'note' });
    w.appendChild(el('h2', { text: 'Cultural content warning' }));
    w.appendChild(p(H.warning[0].replace(/^Cultural content warning\.\s*/, ''), 'strong'));
    w.appendChild(p(H.warning[1]));
    w.appendChild(el('div', { 'class': 'panel check' }, [p(H.review)]));
    return w;
  }
  function viewHub() {
    setEra(null);
    var heroEra = H.hero.era, hero = E[heroEra].images[H.hero.image];
    var kids = [];
    var first = ORDER.filter(function (i) { return !visited(i); })[0] || ORDER[0];
    var s = el('section', { 'class': 'hero', 'aria-labelledby': 'h1' });
    s.appendChild(el('img', { src: hero.file, alt: hero.alt }));
    s.appendChild(el('div', { 'class': 'shade' }));
    var t = el('div', { 'class': 'htext' });
    t.appendChild(el('p', { 'class': 'kick', text: H.kicker + ' · Queensland · 1840 to 1908' }));
    t.appendChild(el('h1', { id: 'h1', tabindex: '-1', text: H.title }));
    t.appendChild(p(H.subtitle, 'lead'));
    t.appendChild(el('p', { 'class': 'cta' }, [
      el('a', { 'class': 'btn gold big', href: '#/era/' + first, text: visitedCount() ? 'Continue: ' + H.eras[first].name : 'Begin at stop 1: ' + H.eras[ORDER[0]].name }),
      el('a', { 'class': 'btn ghost big', href: '#how', 'data-scroll': 'how', text: 'How it works' })
    ]));
    s.appendChild(t);
    s.appendChild(credit(heroEra, H.hero.image));
    kids.push(s);

    // ruler
    var rs = el('section', { 'class': 'band ruler-band', 'aria-labelledby': 'rul-h' });
    var rw = el('div', { 'class': 'inner' });
    rw.appendChild(el('h2', { id: 'rul-h', text: 'Four eras on one timeline' }));
    rw.appendChild(p('Each bar shows the years that an era’s information bank covers. The eras overlap, because these things happened across Queensland at the same time. Select a bar to go to that era.', 'small'));
    var R = el('div', { 'class': 'ruler', role: 'group', 'aria-label': 'Timeline of the four eras, 1840 to 1910' });
    var axis = el('div', { 'class': 'axis', 'aria-hidden': 'true' });
    for (var y = 1840; y <= 1910; y += 10) axis.appendChild(el('span', { 'class': 'tick' + ((y - 1840) % 20 ? ' minor' : ''), style: 'left:' + ((y - 1840) / 70 * 100) + '%', text: String(y) }));
    R.appendChild(axis);
    ORDER.forEach(function (id, i) {
      var e = H.eras[id], l = (e.span[0] - 1840) / 70 * 100, w = (e.span[1] - e.span[0]) / 70 * 100;
      var a = el('a', { 'class': 'rbar' + (visited(id) ? ' done' : ''), href: '#/era/' + id, style: 'left:' + l + '%;width:' + w + '%;top:' + (34 + i * 42) + 'px;--accent:' + e.color + ';--deep:' + e.deep, title: e.name + ', ' + e.spanLabel + (visited(id) ? ' (visited)' : '') });
      a.appendChild(el('b', { text: String(i + 1) }));
      a.appendChild(el('span', { text: e.short }));
      a.appendChild(el('i', { text: e.spanLabel }));
      R.appendChild(a);
    });
    rw.appendChild(R);
    rs.appendChild(rw);
    kids.push(rs);

    // how it works
    var hs = el('section', { 'class': 'band how', id: 'how', 'aria-labelledby': 'how-h' });
    var hw = el('div', { 'class': 'inner' });
    hw.appendChild(el('h2', { id: 'how-h', text: 'How it works' }));
    H.intro.forEach(function (x) { hw.appendChild(p(x, 'intro')); });
    var steps = el('ol', { 'class': 'steps' });
    H.steps.forEach(function (x) { steps.appendChild(el('li', null, [el('b', { 'class': 'n', text: x.n }), el('h3', { text: x.h }), p(x.p)])); });
    hw.appendChild(steps);
    hw.appendChild(warnBox());
    hs.appendChild(hw);
    kids.push(hs);

    // stops
    var ss = el('section', { 'class': 'band stops-band', 'aria-labelledby': 'st-h' });
    var sw = el('div', { 'class': 'inner' });
    sw.appendChild(el('h2', { id: 'st-h', text: 'Choose a stop' }));
    sw.appendChild(p('Start at stop 1 and go in order, or go straight to any era. Each visit takes about ten minutes.', 'small'));
    var list = el('ol', { 'class': 'stops' });
    ORDER.forEach(function (id, i) {
      var e = H.eras[id], hi = E[id].images[e.hero], pr = progress.eras[id];
      var nEnd = Object.keys(E[id].nodes).filter(function (k) { return E[id].nodes[k].end; }).length;
      var got = pr ? Object.keys(pr.endings).length : 0;
      var li = el('li', { 'class': 'stop' + (visited(id) ? ' done' : ''), style: '--accent:' + e.color + ';--deep:' + e.deep, id: 'stop-' + id });
      li.appendChild(el('span', { 'class': 'pin', 'aria-hidden': 'true', text: visited(id) ? '✓' : String(i + 1) }));
      var card = el('article', { 'class': 'card', 'aria-labelledby': 'c-' + id });
      var pic = el('div', { 'class': 'pic' }, [el('img', { src: hi.file, alt: hi.alt, loading: 'lazy' }), el('div', { 'class': 'shade' }),
        el('div', { 'class': 'ptext' }, [el('p', { 'class': 'kick', text: 'Stop ' + (i + 1) }), el('p', { 'class': 'yrs', text: e.spanLabel })])]);
      card.appendChild(pic);
      var body = el('div', { 'class': 'cbody' });
      body.appendChild(el('h3', { id: 'c-' + id, text: e.name }));
      body.appendChild(p(e.place + ' · ' + e.visitLabel, 'meta'));
      body.appendChild(p(e.blurb));
      var chips = el('ul', { 'class': 'chips', 'aria-label': 'Who you can be' });
      e.who.forEach(function (w) { chips.appendChild(el('li', { text: w })); });
      body.appendChild(chips);
      body.appendChild(el('p', { 'class': 'status' + (visited(id) ? ' yes' : ''), text: visited(id) ? 'Visited. Endings found: ' + got + ' of ' + nEnd : 'Not visited yet. ' + nEnd + ' endings to find' }));
      body.appendChild(el('p', { 'class': 'acts' }, [
        el('a', { 'class': 'btn accent', href: '#/era/' + id, text: visited(id) ? 'Visit again' : 'Travel to ' + e.short }),
        link(bankUrl(id), 'Information bank', 'btn ghostd', true)
      ]));
      body.appendChild(credit(id, e.hero));
      card.appendChild(body);
      li.appendChild(card);
      list.appendChild(li);
    });
    // final
    var fin = el('li', { 'class': 'stop final' + (allVisited() ? ' open' : '') });
    fin.appendChild(el('span', { 'class': 'pin', 'aria-hidden': 'true', text: '★' }));
    var fc = el('article', { 'class': 'card fin', 'aria-labelledby': 'c-country' });
    var fb = el('div', { 'class': 'cbody' });
    fb.appendChild(el('h3', { id: 'c-country', text: 'Back to Country' }));
    var dots = el('p', { 'class': 'dots', 'aria-label': visitedCount() + ' of ' + ORDER.length + ' eras visited' });
    ORDER.forEach(function (id) { dots.appendChild(el('span', { 'class': 'dot' + (visited(id) ? ' on' : ''), style: '--accent:' + H.eras[id].color, title: H.eras[id].name })); });
    fb.appendChild(dots);
    if (allVisited()) {
      fb.appendChild(p('You have reached an ending in all four eras. Read the final reflection.'));
      fb.appendChild(el('p', { 'class': 'acts' }, [el('a', { 'class': 'btn gold', href: '#/country', text: 'Back to Country' })]));
    } else {
      fb.appendChild(p('Reach an ending in all four eras (' + visitedCount() + ' of ' + ORDER.length + ' so far) and a final reflection opens.'));
      /*T*/ fb.appendChild(el('p', { 'class': 'acts' }, [el('a', { 'class': 'btn gold', href: '#/country', text: 'Open it now (teacher)' })])); /*/T*/
    }
    fc.appendChild(fb); fin.appendChild(fc); list.appendChild(fin);
    sw.appendChild(list);
    ss.appendChild(sw);
    kids.push(ss);

    // end of hub
    var es = el('section', { 'class': 'band endband' });
    var ew = el('div', { 'class': 'inner' });
    ew.appendChild(p(H.bookLine, 'small'));
    ew.appendChild(el('p', { 'class': 'acts' }, [
      el('a', { 'class': 'btn home', href: H.siteHome, text: 'Home' }),
      el('a', { 'class': 'btn ghost', href: '#/behind', text: 'Behind the Story' })
    ]));
    var clr = el('button', { type: 'button', 'class': 'linkbtn', text: 'Clear my progress on this device' });
    clr.addEventListener('click', function () {
      if (window.confirm('Clear which eras you have visited on this device?')) { progress = { eras: {} }; saveProgress(); run = null; saveRun(); route(); }
    });
    ew.appendChild(clr);
    es.appendChild(ew);
    kids.push(es);

    main.innerHTML = '';
    kids.forEach(function (k) { main.appendChild(k); });
    document.title = H.title;
    window.scrollTo(0, 0);
    main.classList.remove('fade'); void main.offsetWidth; main.classList.add('fade');
    Array.prototype.forEach.call(main.querySelectorAll('[data-scroll]'), function (a) {
      a.addEventListener('click', function (ev) { ev.preventDefault(); var t2 = document.getElementById(a.getAttribute('data-scroll')); if (t2) { t2.scrollIntoView({ behavior: 'smooth' }); } });
    });
  }

  /* ---------- era arrival ---------- */
  function startRun(id, to, label) {
    run = { era: id, v: {}, path: [{ id: '__arrive', title: 'You arrive in ' + H.eras[id].short, choice: label, vin: {} }] };
    saveRun();
    location.hash = '#/era/' + id + '/n/' + to;
  }
  function viewArrival(id) {
    setEra(id);
    var e = E[id], f = H.eras[id], kids = [];
    kids.push(etabs(id, ''));
    f.arrival.forEach(function (t) { kids.push(p(t)); });
    if (e.startText) kids.push(p(e.startText[0]));
    var care = el('div', { 'class': 'care', role: 'note' });
    care.appendChild(el('h2', { text: 'Cultural content warning' }));
    (e.warning || []).forEach(function (t, i) { care.appendChild(i === 0 ? p(t, 'strong') : p(t)); });
    care.appendChild(el('div', { 'class': 'panel check' }, [p(e.review || H.review)]));
    kids.push(care);
    kids.push(realBox(id, pickBlocks(id, f.arrivalReal), 'Real history for this arrival', true));
    var chooser = el('div', { 'class': 'chooser' });
    if (e.startChoices) {
      chooser.appendChild(el('h2', { text: 'Whose place do you take?' }));
      chooser.appendChild(p('When you choose, you confirm that you have read the content warning.', 'small'));
      var cl = el('ul', { 'class': 'whocards' });
      e.startChoices.forEach(function (c) {
        var lab = c.label.replace(/^Follow /, '');
        var b = el('button', { type: 'button', 'class': 'who', text: lab.charAt(0).toUpperCase() + lab.slice(1) });
        b.addEventListener('click', function () { startRun(id, c.to, lab); });
        cl.appendChild(el('li', null, [b]));
      });
      chooser.appendChild(cl);
    } else {
      var b2 = el('button', { type: 'button', 'class': 'btn accent big', text: 'I have read the warning. Travel to ' + f.visitLabel.replace(/^Starts in |^Set in /, '') + '.' });
      b2.addEventListener('click', function () { startRun(id, f.begin, f.who[0]); });
      chooser.appendChild(b2);
    }
    kids.push(chooser);
    /*T*/ if (e.startTeacher) kids.push(teacherBlock({ notes: e.startTeacher })); /*/T*/
    kids.push(el('div', { 'class': 'panel' }, [el('h2', { text: 'Before or after your visit' }), p('Behind the Story lists everything in this era that is invented. The information bank has the timeline, places, people and real lives for the era.'), el('p', { 'class': 'acts' }, [link('#/era/' + id + '/behind', 'Behind the Story', 'btn dark'), link(bankUrl(id), 'Information bank', 'btn', true)])]));
    setPage(f.name, kids, { pre: [banner(id, 'Stop ' + stopNo(id) + ' of ' + ORDER.length, f.spanLabel, f.place)] });
  }

  /* ---------- scenes ---------- */
  function paras(list) {
    var out = [];
    list.forEach(function (x) {
      if (typeof x === 'string') out.push(p(x));
      else if (matches(x.if)) out.push(p(x.t));
    });
    return out;
  }
  function viewScene(id, nid) {
    var e = E[id], n = e.nodes[nid], f = H.eras[id];
    if (!n) { location.hash = '#/era/' + id; return; }
    if (!run || run.era !== id || !run.path || !run.path.length) { location.hash = '#/era/' + id; return; }
    setEra(id);
    var at = -1;
    run.path.forEach(function (s, i) { if (s.id === nid) at = i; });
    if (at >= 0) { run.v = copy(run.path[at].vin); run.path = run.path.slice(0, at + 1); delete run.path[at].choice; }
    else run.path.push({ id: nid, title: n.title, vin: copy(run.v) });
    if (n.set) for (var k in n.set) run.v[k] = n.set[k];
    saveRun();
    var kids = [];
    kids.push(el('p', { 'class': 'crumb' }, [link('#/era/' + id, f.name + ' · Stop ' + stopNo(id)), document.createTextNode(n.end ? ' · Ending' : ' · Scene ' + (run.path.length - 1))]));
    if (n.end) kids.push(el('p', { 'class': 'kind', text: 'Ending' + (n.kind ? ': ' + n.kind : '') }));
    if (n.img) kids.push(figure(id, n.img, 'scenefig'));
    paras(n.text).forEach(function (x) { kids.push(x); });
    if (n.end) {
      var ep = eraProg(id); ep.endings[nid] = 1; if (run.path[1]) ep.chars[run.path[1].id] = 1; saveProgress(); renderNav(currentRoute());
      if (!n.text.some(function (x) { return /This (ending|story) is invented/.test(typeof x === 'string' ? x : x.t); })) kids.push(el('p', { 'class': 'tag-invented', text: 'This ending is invented. It shows one life that was possible.' }));
      kids.push(el('div', { 'class': 'returned', role: 'status' }, [el('h2', { text: 'Your visit is over' }), p(H.returnText.replace(/^Your visit is over\.\s*/, ''))]));
      var wh = el('details', { 'class': 'panel real happened', open: '' });
      wh.appendChild(el('summary', { text: 'What really happened' }));
      if (n.summary) wh.appendChild(el('div', { 'class': 'sumry' }, [el('h3', { text: 'What this ending shows' }), p(n.summary)]));
      n.real.forEach(function (b) {
        var w = el('div', { 'class': 'rblock' }, [el('span', { 'class': 'badge b-real', text: 'Real' })]);
        if (b.h) w.appendChild(el('h3', { text: b.h }));
        b.paras.forEach(function (t) { w.appendChild(p(t)); });
        w.appendChild(srcLinks(id, b.src));
        wh.appendChild(w);
      });
      wh.appendChild(bankLinks(id));
      kids.push(wh);
    } else {
      kids.push(realBox(id, n.real));
    }
    if (n.choices) {
      var cl = el('ul', { 'class': 'choices', 'aria-label': 'Your choices' });
      n.choices.filter(function (c) { return matches(c.if); }).forEach(function (c) {
        var b = el('button', { type: 'button', 'class': 'sc', text: c.label });
        b.addEventListener('click', function () {
          var cur = run.path[run.path.length - 1];
          if (cur) cur.choice = c.label;
          if (c.set) for (var k2 in c.set) run.v[k2] = c.set[k2];
          saveRun();
          location.hash = '#/era/' + id + '/n/' + c.to;
        });
        cl.appendChild(el('li', null, [b]));
      });
      kids.push(el('h2', { 'class': 'sr', text: 'What do you do?' }));
      kids.push(cl);
    }
    /*T*/ var tb = teacherBlock(n.teacher); if (tb) kids.push(tb); /*/T*/
    if (n.end) {
      var pl = el('ol', { 'class': 'trail' });
      run.path.forEach(function (s) { pl.appendChild(el('li', null, [el('b', { text: s.title }), s.choice ? document.createTextNode(': ' + s.choice) : null])); });
      kids.push(el('div', { 'class': 'panel' }, [el('h2', { text: 'Your path' }), pl]));
      if (allVisited()) kids.push(el('div', { 'class': 'unlock', role: 'status' }, [el('h2', { text: 'You have visited all four eras' }), p('The final reflection is open.'), el('p', { 'class': 'acts' }, [el('a', { 'class': 'btn gold', href: '#/country', text: 'Go to Back to Country' })])]));
      var nextId = null;
      for (var i = 0; i < ORDER.length; i++) { var cand = ORDER[(ORDER.indexOf(id) + 1 + i) % ORDER.length]; if (cand !== id && !visited(cand)) { nextId = cand; break; } }
      var again = el('button', { type: 'button', 'class': 'btn dark', text: 'Try another path in this era' });
      again.addEventListener('click', function () { run = null; saveRun(); location.hash = '#/era/' + id; });
      var acts = el('div', { 'class': 'actions' }, [again]);
      if (nextId) acts.appendChild(el('a', { 'class': 'btn accent', href: '#/era/' + nextId, text: 'Next: ' + H.eras[nextId].name }));
      acts.appendChild(el('a', { 'class': 'btn', href: '#/', text: 'Return to the hub' }));
      kids.push(acts);
      kids.push(el('p', { 'class': 'small' }, [link('#/era/' + id + '/behind', 'Behind the Story'), document.createTextNode(' · '), link('#/era/' + id + '/discuss', 'Discuss and write'), document.createTextNode(' · '), link('#/era/' + id + '/sources', 'Sources')]));
    } else {
      var rs = el('button', { type: 'button', 'class': 'btn small', text: 'Start this era again' });
      rs.addEventListener('click', function () { run = null; saveRun(); location.hash = '#/era/' + id; });
      kids.push(el('p', { 'class': 'small', text: 'You can stop at any time.' }));
      kids.push(el('div', { 'class': 'actions' }, [rs, el('a', { 'class': 'btn small', href: '#/', text: 'Leave and return to the hub' })]));
    }
    var parts = (n.where || f.place).split(' · ');
    var big = parts.length > 1 ? parts[parts.length - 1] : parts[0];
    var small = parts.length > 1 ? parts.slice(0, -1).join(' · ') : '';
    setPage(n.title, kids, { pre: [banner(id, f.name + ' · Stop ' + stopNo(id), big, small, true)] });
  }

  /* ---------- era pages ---------- */
  function viewBehindEra(id) {
    setEra(id);
    var e = E[id], f = H.eras[id], kids = [etabs(id, 'behind')];
    kids.push(p('This page shows what is invented in this era, what is real, and what the author could not find. If you find a mistake, please tell the author so it can be fixed.'));
    if (e.behind.intro) kids.push(p(e.behind.intro));
    e.behind.sections.forEach(function (s) {
      var cls = s.kind === 'made' ? 'panel made' : s.kind === 'care' ? 'care' : s.kind === 'real' ? 'panel real' : 'panel';
      var w = el('div', { 'class': cls }, [el('h2', { text: s.h })]);
      (s.p || []).forEach(function (t) { w.appendChild(p(t)); });
      if (s.list) w.appendChild(ul(s.list));
      kids.push(w);
    });
    kids.push(el('div', { 'class': 'panel real' }, [el('h2', { text: 'Real history' }), p('Every real fact in this era is given in a “Real history” panel with its source. See the Sources page for the full list.')]));
    if (!e.behind.sections.some(function (s) { return s.kind === 'care'; }))
      kids.push(el('div', { 'class': 'care' }, [el('h2', { text: 'Content warning and community review' }), p(e.warning[0]), p(e.review || H.review)]));
    var imgs = el('div', { 'class': 'panel' }, [el('h2', { text: 'Images and credits' })]);
    imgs.appendChild(p('All images are old photographs, maps or drawings in the public domain. Each one is credited. There are no AI images. Some photographs show people who have died, and you can choose whether to look at them.', 'small'));
    Object.keys(e.images).forEach(function (k) {
      var im = e.images[k];
      var d = el('details', { 'class': 'imgd' });
      d.appendChild(el('summary', { text: (im.people ? 'View photograph: ' : 'View image: ') + (im.summary || im.caption.replace(/\.$/, '')) + (im.people && !im.summary ? ' (may show people who have died)' : '') }));
      d.appendChild(figure(id, k));
      imgs.appendChild(d);
    });
    kids.push(imgs);
    setPage('Behind the Story: ' + f.name, kids, { pre: [banner(id, 'Stop ' + stopNo(id), f.name, 'What is invented and what is real', true)] });
  }
  function viewDiscussEra(id) {
    setEra(id);
    var e = E[id], f = H.eras[id], kids = [etabs(id, 'discuss')];
    kids.push(p('Play at least two paths before you answer these. Use the Real history panels as evidence, and say which parts of the story are invented.'));
    var n = 0;
    e.discuss.forEach(function (g) {
      kids.push(el('h2', { text: g.h }));
      var ol = el('ol', { 'class': 'qs', start: String(n + 1) });
      g.qs.forEach(function (q) {
        n++;
        var li = el('li', null, [el('p', { text: q.q })]);
        /*T*/ if (q.a && q.a.length) { var box = el('div'); q.a.forEach(function (t) { box.appendChild(p(t)); }); li.appendChild(toggle('suggested answer', box)); } /*/T*/
        ol.appendChild(li);
      });
      kids.push(ol);
    });
    /*T*/ if (e.teacherNotes) kids.push(el('div', { 'class': 'panel teacher' }, [el('h2', { text: 'Teacher notes for this era' }), ul(e.teacherNotes)])); /*/T*/
    setPage('Discuss and write: ' + f.name, kids, { pre: [banner(id, 'Stop ' + stopNo(id), f.name, 'Questions for the classroom', true)] });
  }
  function viewSourcesEra(id) {
    setEra(id);
    var e = E[id], f = H.eras[id], kids = [etabs(id, 'sources')];
    kids.push(p(e.sourcesIntro || 'Every fact in a “Real history” panel comes from one of these sources. The people who wrote most of the records of the time were officers, officials and settlers, so the records show their side. Where a source is a book or journal article, the link goes to a copy that can be read online.'));
    var u = el('ul', { 'class': 'sourcelist' });
    Object.keys(e.sources).forEach(function (k) {
      var s = e.sources[k];
      u.appendChild(el('li', null, [document.createTextNode(s.t + ' '), link(s.u, s.u, null, true)]));
    });
    kids.push(u);
    kids.push(el('div', { 'class': 'note' }, [p('Some records and some of the web pages named here use words that are offensive today. Talk to a teacher before you read them. Trove is the National Library of Australia’s newspaper archive.')]));
    kids.push(bankLinks(id));
    setPage('Sources: ' + f.name, kids, { pre: [banner(id, 'Stop ' + stopNo(id), f.name, 'Where the facts come from', true)] });
  }

  /* ---------- app-wide pages ---------- */
  function viewBehindApp() {
    setEra(null);
    var B = H.behindApp, kids = [p(B.intro)];
    kids.push(el('div', { 'class': 'panel made' }, [el('h2', { text: 'What this app adds, and it is invented' }), ul(B.invented)]));
    kids.push(el('div', { 'class': 'panel real' }, [el('h2', { text: 'What is kept from the stories and the information banks' }), ul(B.kept)]));
    var w = el('div', { 'class': 'panel' }, [el('h2', { text: 'What is invented in each era' })]);
    var l = el('ul', { 'class': 'eralinks' });
    ORDER.forEach(function (id) { l.appendChild(el('li', null, [link('#/era/' + id + '/behind', H.eras[id].name + ': Behind the Story')])); });
    w.appendChild(l); kids.push(w);
    kids.push(warnBox());
    setPage('Behind the Story', kids);
  }
  function viewAbout() {
    setEra(null);
    var kids = [];
    H.about.forEach(function (t) { kids.push(p(t)); });
    kids.push(p(H.bookLine));
    kids.push(el('div', { 'class': 'panel' }, [el('h2', { text: 'Privacy' }), p(H.privacy)]));
    var cr = el('div', { 'class': 'panel' }, [el('h2', { text: 'Image credits' })]);
    var u = el('ul', { 'class': 'sourcelist' });
    ORDER.forEach(function (id) {
      Object.keys(E[id].images).forEach(function (k) {
        var im = E[id].images[k];
        u.appendChild(el('li', null, [document.createTextNode(H.eras[id].short + ': ' + im.caption + ' ' + (im.credit ? im.credit + '. ' : '')), link(im.url, 'Image page', null, true)]));
      });
    });
    cr.appendChild(u); kids.push(cr);
    kids.push(p('By Robin McKean. Historical details come from the sources listed on each era’s Sources page.'));
    setPage('About this app', kids);
  }
  function viewCountry() {
    setEra(null);
    var open = allVisited(), teacher = false;
    /*T*/ teacher = true; /*/T*/
    if (!open && !teacher) {
      setPage('Back to Country', [p('This reflection opens when you have reached an ending in all four eras. You have visited ' + visitedCount() + ' of ' + ORDER.length + ' so far.'),
        el('p', { 'class': 'acts' }, [el('a', { 'class': 'btn dark', href: '#/', text: 'Return to the hub' })])]);
      return;
    }
    var C = H.country, kids = [];
    C.intro.forEach(function (t) { kids.push(p(t, 'lead2')); });
    var w = el('div', { 'class': 'panel' }, [el('h2', { text: 'What you visited' })]);
    var ol = el('ul', { 'class': 'visits' });
    ORDER.forEach(function (id) {
      var pr = progress.eras[id], e = E[id], f = H.eras[id];
      var who = [], ends = [];
      if (pr) {
        Object.keys(pr.chars).forEach(function (k) {
          var sc = e.startChoices ? e.startChoices.filter(function (c) { return c.to === k; })[0] : null;
          who.push(sc ? sc.label.replace(/^Follow /, '') : f.who[0]);
        });
        Object.keys(pr.endings).forEach(function (k) { if (e.nodes[k]) ends.push(e.nodes[k].title); });
      }
      var li = el('li', { style: '--accent:' + f.color });
      li.appendChild(el('b', { text: f.name + ' (' + f.spanLabel + ')' }));
      if (who.length) li.appendChild(p('You were: ' + who.join('; ') + '.', 'small'));
      if (ends.length) li.appendChild(p('Endings found: ' + ends.join('; ') + '.', 'small'));
      li.appendChild(link(bankUrl(id), 'Information bank', null, true));
      ol.appendChild(li);
    });
    w.appendChild(ol); kids.push(w);
    kids.push(el('h2', { text: 'Think about it' }));
    var q = el('ol', { 'class': 'qs' });
    C.questions.forEach(function (t) { q.appendChild(el('li', null, [p(t)])); });
    kids.push(q);
    var blocks = [];
    ORDER.forEach(function (id) { H.eras[id].countryReal.forEach(function (k) { blocks.push({ id: id, b: E[id].nodes[k[0]].real[k[1]] }); }); });
    var d = el('details', { 'class': 'panel real' });
    d.appendChild(el('summary', { text: 'Real history behind this page' }));
    blocks.forEach(function (x) {
      var wb = el('div', { 'class': 'rblock' }, [el('span', { 'class': 'badge b-real', text: 'Real' }), el('p', { 'class': 'small', text: H.eras[x.id].name })]);
      if (x.b.h) wb.appendChild(el('h3', { text: x.b.h }));
      x.b.paras.forEach(function (t) { wb.appendChild(p(t)); });
      wb.appendChild(srcLinks(x.id, x.b.src));
      d.appendChild(wb);
    });
    kids.push(d);
    setPage('Back to Country', kids);
  }
  /*T*/
  function viewTeacher() {
    setEra(null);
    var T = H.teacher, kids = [ul(T.notes)];
    kids.push(el('h2', { text: 'Questions across all four eras' }));
    var ol = el('ol', { 'class': 'qs' });
    T.questions.forEach(function (it) {
      var li = el('li', null, [el('p', { text: it.q })]);
      var box = el('div'); it.a.forEach(function (t) { box.appendChild(p(t)); });
      li.appendChild(toggle('suggested answer', box));
      ol.appendChild(li);
    });
    kids.push(ol);
    var w = el('div', { 'class': 'panel' }, [el('h2', { text: 'Teacher versions of the information banks' })]);
    var l = el('ul'); ORDER.forEach(function (id) { l.appendChild(el('li', null, [link(bankUrl(id, 'teacher/'), H.eras[id].name, null, true)])); });
    w.appendChild(l); kids.push(w);
    setPage('Teacher notes', kids);
  }
  /*/T*/

  /* ---------- routing ---------- */
  function currentRoute() { return (location.hash || '#/').replace(/^#\/?/, ''); }
  function route() {
    var r = currentRoute();
    renderNav(r);
    var m = r.match(/^era\/([a-z]+)(?:\/(.*))?$/);
    if (r === '' || r === 'how') { viewHub(); }
    else if (m && E[m[1]]) {
      var rest = m[2] || '';
      if (rest === '') viewArrival(m[1]);
      else if (rest.indexOf('n/') === 0) viewScene(m[1], rest.slice(2));
      else if (rest === 'behind') viewBehindEra(m[1]);
      else if (rest === 'discuss') viewDiscussEra(m[1]);
      else if (rest === 'sources') viewSourcesEra(m[1]);
      else viewArrival(m[1]);
    }
    else if (r === 'behind') viewBehindApp();
    else if (r === 'about') viewAbout();
    else if (r === 'country') viewCountry();
    /*T*/ else if (r === 'teacher') viewTeacher(); /*/T*/
    else viewHub();
  }
  foot.appendChild(p('This app may contain names and images of deceased Aboriginal, Torres Strait Islander and South Sea Islander people. The people in the stories are invented. The real history is in the panels, with its sources.'));
  foot.appendChild(p('By Robin McKean. No tracking, no cookies. Nothing you do is sent anywhere.'));
  window.addEventListener('hashchange', route);
  route();
})();
