const $ = s => document.querySelector(s), wait = ms => new Promise(r => setTimeout(r, ms));
const C = CONFIG, HEART = 'M100 180 C20 120 0 80 0 55 C0 22 25 5 52 5 C75 5 92 18 100 35 C108 18 125 5 148 5 C175 5 200 22 200 55 C200 80 180 120 100 180Z';
const rnd = (a, b) => a + Math.random() * (b - a);
// Susun teks dari lirik yang ditempel di config.js
const RAW = (C.lyricsText || '').trim().split('\n').map(s => s.trim());
const LY = C.cues.map(q => ({ ...q, text: (RAW[q.line] || '').split(/\s+/).slice(q.from || 0, q.to).join(' ') || '(tempel lirik di config.js)' }));

/* ========== TEKS & HEADER ========== */
$('#hSmall').textContent = C.header.small; $('#hTitle').textContent = C.header.title;
$('#hSub').textContent = C.header.sub; $('#hHint').textContent = C.header.hint;
$('#endText').textContent = C.endText;
const words = (el, t) => el.innerHTML = t.split(' ').map((w, k) => `<span style="transition-delay:${k * .15}s">${w}</span>`).join(' ');

/* ========== PARTIKEL (ringan: sprite + batas jumlah) ========== */
const LOW = innerWidth < 700 || (navigator.hardwareConcurrency || 8) <= 4, MAXP = LOW ? 40 : 70, K = LOW ? .5 : 1;
const cv = $('#fx'), cx = cv.getContext('2d', { alpha: true }), dpr = Math.min(devicePixelRatio || 1, 1.5);
let W, H, P = [], mode = { rate: 0.05, chars: ['❤', '✦'] };
function resize() { W = innerWidth; H = innerHeight; cv.width = W * dpr; cv.height = H * dpr; }
addEventListener('resize', resize); resize();
const SP = {};
function sprite(c) {            // emoji digambar SEKALI saja, lalu dipakai ulang
  if (SP[c]) return SP[c];
  const o = document.createElement('canvas'); o.width = o.height = 64; const g = o.getContext('2d');
  g.font = '48px serif'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillStyle = '#c4122f'; g.fillText(c, 32, 34);
  return SP[c] = o;
}
const spawn = o => { if (P.length >= MAXP) return; P.push({ x: rnd(0, W), y: H + 30, vx: rnd(-.3, .3), vy: rnd(-1.5, -.5), g: 0, s: rnd(14, 32), r: rnd(0, 6), vr: rnd(-.02, .02), a: 1, fade: 0, c: '❤', sw: rnd(0, 6), ...o }); };
function burst(n, x = W / 2, y = H * .72, chars = ['❤', '🌸', '✦', '💗']) {
  n = Math.round(n * K);
  for (let i = 0; i < n; i++) { const a = rnd(-Math.PI * .95, -Math.PI * .05), v = rnd(6, 15);
    spawn({ x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v, g: .2, s: rnd(16, 34), c: chars[i % chars.length], fade: .009, vr: rnd(-.1, .1) }); }
}
function radial(n) {
  n = Math.round(n * K);
  for (let i = 0; i < n; i++) { const a = rnd(0, 6.28), v = rnd(3, 11);
    spawn({ x: W / 2, y: H / 2, vx: Math.cos(a) * v, vy: Math.sin(a) * v, g: .03, s: rnd(22, 40), c: '🌸', fade: .011, vr: rnd(-.08, .08) }); }
}
(function loop() {
  if (document.hidden) return void requestAnimationFrame(loop);
  cx.setTransform(1, 0, 0, 1, 0, 0); cx.clearRect(0, 0, cv.width, cv.height);
  if (Math.random() < mode.rate * K) spawn({ c: mode.chars[Math.floor(Math.random() * mode.chars.length)] });
  P = P.filter(p => p.a > 0 && p.y > -80 && p.y < H + 100);
  for (const p of P) {
    p.sw += .02; p.vy += p.g; p.x += p.vx + (p.g ? 0 : Math.sin(p.sw) * .5); p.y += p.vy; p.r += p.vr; if (p.fade) p.a -= p.fade;
    const co = Math.cos(p.r) * dpr, si = Math.sin(p.r) * dpr;
    cx.setTransform(co, si, -si, co, p.x * dpr, p.y * dpr); cx.globalAlpha = Math.max(0, p.a);
    cx.drawImage(sprite(p.c), -p.s / 2, -p.s / 2, p.s, p.s);
  }
  requestAnimationFrame(loop);
})();

/* ========== AUDIO ========== */
const SRC = [].concat(C.music); let si = 0;      // music boleh satu alamat atau beberapa (cadangan)
const bgm = new Audio(SRC[0]); bgm.preload = 'auto'; bgm.volume = 0;
bgm.addEventListener('error', () => {            // alamat pertama gagal -> coba cadangan -> kalau semua gagal beri tahu
  if (++si < SRC.length) { bgm.src = SRC[si]; bgm.load(); return; }
  const t = $('#tapmusic'); t.textContent = '⚠️ file musik tidak bisa dimuat, cek alamat di config.js'; t.style.display = 'block';
});
bgm.onended = () => { bgm.currentTime = C.musicStart || 0; bgm.play(); };   // ulang dari bagian vokal
const showMute = () => $('#mute').style.display = 'block';
function fadeOut(a, ms = 1200) {
  const v0 = a.volume, t0 = performance.now();
  (function f(t) { const k = Math.min(1, (t - t0) / ms); a.volume = v0 * (1 - k); k < 1 ? requestAnimationFrame(f) : a.pause(); })(t0);
}
let unlocked = false;
function unlockAudio() {         // iPhone hanya mengizinkan suara yang dimulai dari sentuhan, jadi lagu "dibuka" dulu secara senyap
  if (unlocked) return; unlocked = true; const m = bgm.muted; bgm.muted = true;
  bgm.play().then(() => { bgm.pause(); bgm.currentTime = C.musicStart || 0; bgm.muted = m; }).catch(() => { unlocked = false; bgm.muted = m; });
}
['pointerup', 'touchend', 'click'].forEach(ev => addEventListener(ev, () => { if ($('#s1').classList.contains('on')) { unlockAudio(); } }));
function startMusic() {
  try { bgm.currentTime = C.musicStart || 0; } catch (e) {}
  bgm.volume = 0;
  return bgm.play().then(() => {
    showMute(); $('#tapmusic').style.display = 'none'; let v = 0;
    const t = setInterval(() => { v = Math.min(C.volume, v + .05); bgm.volume = v; if (v >= C.volume) clearInterval(t); }, 80);
  });
}
function playMusic() {           // lagu utama mulai di teks pertama; kalau diblokir HP, muncul tombol ketuk
  const run = () => startMusic().catch(() => { $('#tapmusic').style.display = 'block'; });
  if (bgm.readyState >= 1) return run();
  let done = false; const g = () => { if (!done) { done = true; run(); } };
  bgm.addEventListener('loadedmetadata', g, { once: true }); setTimeout(g, 2500);   // tunggu file siap dulu (penting di HP)
}
$('#tapmusic').onclick = e => { e.stopPropagation(); startMusic().catch(() => {}); };
$('#mute').onclick = e => { e.stopPropagation(); bgm.muted = !bgm.muted; e.target.textContent = bgm.muted ? '🔇' : '🔊'; };

/* ========== SCENE ========== */
const go = id => document.querySelectorAll('.scene').forEach(s => s.classList.toggle('on', s.id === id));
const bg = (c, grid) => { document.body.style.backgroundColor = c; $('#grid').style.opacity = grid ? 1 : 0; };

/* ========== 1. PUZZLE ========== */
function initPuzzle() {
  const b = $('#board'), S = Math.min(280, innerWidth * .74), h = S / 2, s1 = $('#s1');
  b.style.width = b.style.height = S + 'px'; b.className = ''; b.innerHTML = '';
  s1.querySelectorAll('.piece').forEach(p => p.remove());
  let placed = 0; const Q = [[0, 0], [1, 0], [0, 1], [1, 1]];
  Q.forEach(([qx, qy]) => { const d = document.createElement('div'); d.className = 'slot';
    Object.assign(d.style, { width: h + 'px', height: h + 'px', left: qx * h + 'px', top: qy * h + 'px' }); b.appendChild(d); });
  const sp = [[.05, .3], [.7, .28], [.07, .78], [.68, .76]], rot = [-24, 18, -12, 22];
  Q.forEach(([qx, qy], i) => {
    const p = document.createElement('div'); p.className = 'piece'; p.style.width = p.style.height = h + 'px';
    p.innerHTML = `<svg viewBox="0 0 200 200" style="width:${S}px;height:${S}px;left:${-qx * h}px;top:${-qy * h}px"><path d="${HEART}"/></svg>`;
    let x = Math.min(innerWidth - h - 8, Math.max(8, sp[i][0] * innerWidth)), y = sp[i][1] * innerHeight - h / 2, dr = false, ox, oy;
    const set = (r, sc = 1) => p.style.transform = `translate(${x}px,${y}px) rotate(${r}deg) scale(${sc})`;
    set(rot[i], 0); s1.appendChild(p); p.style.transitionDelay = i * .12 + 's';
    requestAnimationFrame(() => requestAnimationFrame(() => set(rot[i])));
    setTimeout(() => p.style.transitionDelay = '0s', 1000);
    p.onpointerdown = e => { if (p.dataset.done) return; dr = true; p.setPointerCapture(e.pointerId); ox = e.clientX - x; oy = e.clientY - y; p.classList.add('drag'); p.style.zIndex = 9; set(0, 1.08); };
    p.onpointermove = e => { if (!dr) return; x = e.clientX - ox; y = e.clientY - oy; set(0, 1.08); };
    p.onpointerup = () => {
      if (!dr) return; dr = false; p.classList.remove('drag'); const r = b.getBoundingClientRect(), tx = r.left + qx * h, ty = r.top + qy * h;
      if (Math.hypot(x - tx, y - ty) < h * .45) { x = tx; y = ty; p.dataset.done = 1; p.classList.add('done'); p.style.zIndex = 2; set(0); if (++placed === 4) win(); }
      else set(0);
    };
  });
}
async function win() {
  $('#board').classList.add('win'); await wait(500); burst(24, W / 2, H / 2); await wait(1500);
  bloom();
}

/* ========== 2. HATI MELEDAK + BUNGA ========== */
async function bloom() {
  const bh = $('#bigheart'); bh.className = ''; bg('#ffc2d9', 0); go('s2'); mode = { rate: .25, chars: ['🌸'] };
  await wait(400); bh.classList.add('pop'); radial(26); await wait(1400); radial(20);
  bh.classList.add('zoom'); await wait(900); radial(14); await wait(1400); lyrics();
}

/* ========== 3. KATA-KATA + BACKSOUND ========== */
async function lyrics() {
  const L = $('#lyric'); bg('#ffd0e0', 0); go('s3'); mode = { rate: .14, chars: ['❤', '✦', '❤'] };
  await wait(900);
  for (let i = 0; i < LY.length; i++) {
    const ln = LY[i];
    if (i === 0) { playMusic(); await wait(C.musicLead || 0); }   // musik mulai pas teks pertama
    L.style.transition = 'none'; L.classList.remove('out');
    L.innerHTML = ln.text.split(' ').map(w => `<span>${w}</span>`).join(' ');
    void L.offsetWidth; L.style.transition = '';
    L.querySelectorAll('span').forEach((s, k) => {      // kata muncul abu-abu lalu menggelap
      setTimeout(() => s.classList.add('vis'), k * ln.gap);
      setTimeout(() => s.classList.add('dark'), k * ln.gap + 250);
    });
    await wait(ln.total); L.classList.add('out');       // keluar: membesar & memudar
    if (i === 0) bg('#f8f6f4', 1);
    await wait(i === 0 ? 350 : 500);
  }
  photos();
}

/* ========== 4. FOTO + ANIMASI AKHIR ========== */
let qTimer;
function startQuotes() {         // kata penyemangat bergantian dengan fade
  const el = $('#quoteText'), Q = C.quotes; if (!Q || !Q.length) return; let i = 0; clearInterval(qTimer);
  const show = () => { el.classList.remove('in'); setTimeout(() => { el.textContent = Q[i++ % Q.length]; el.classList.add('in'); }, 800); };
  show(); qTimer = setInterval(show, 5500);
}
async function photos() {
  clearInterval(qTimer); $('#quoteText').classList.remove('in');
  const st = $('#stage'), fin = $('#finale'), pos = innerWidth < 600 ? [[2, 0], [27, 38], [52, 2]] : [[5, 14], [36, 34], [66, 6]];
  st.innerHTML = ''; st.classList.remove('lift'); fin.classList.remove('in'); $('#endTitle').classList.remove('in');
  bg('#fbf8f6', 1); go('s4'); mode = { rate: .08, chars: ['❤', '✦', '🌸'] };
  const els = C.photos.slice(0, 3).map((p, i) => {
    const d = document.createElement('div'); d.className = 'pol' + (p.capTop ? ' top' : ''); d.style.left = pos[i][0] + '%'; d.style.top = pos[i][1] + '%';
    d.style.setProperty('--r', p.rot + 'deg'); d.style.transitionDelay = i * .45 + 's';
    d.innerHTML = `<div class="card">${p.src ? `<img src="${p.src}" alt="">` : '<div class="ph">📷</div>'}</div><div class="cap ${p.color === 'red' ? 'red' : ''}">${p.caption}</div>`;
    st.appendChild(d); return d;
  });
  await wait(100); els.forEach(e => e.classList.add('in'));
  await wait(2800); els.forEach((e, i) => { e.style.transitionDelay = '0s'; e.style.animationDelay = i * .6 + 's'; e.classList.add('bob'); });
  await wait(2200);
  /* --- ANIMASI AKHIR --- */
  st.classList.add('lift'); fin.classList.add('in'); words($('#endTitle'), C.endTitle);
  await wait(100); $('#endTitle').classList.add('in');
  burst(36); await wait(700); burst(24, W * .2); burst(24, W * .8); mode = { rate: .2, chars: ['❤', '🌸', '💗', '✦'] };
  await wait(1200); startQuotes();
}
document.addEventListener('click', e => { if ($('#s4').classList.contains('on') && e.target.id !== 'again') burst(8, e.clientX, e.clientY); });
$('#again').onclick = () => { clearInterval(qTimer); fadeOut(bgm, 800); bg('#f8f6f4', 0); mode = { rate: .06, chars: ['❤', '✦'] }; go('s1'); initPuzzle(); };

initPuzzle();
