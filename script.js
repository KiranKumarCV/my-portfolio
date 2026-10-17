/**
 * KIRAN KUMAR C V — PORTFOLIO
 * Vanilla JavaScript · no dependencies
 */
(function () {
  'use strict';

  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  document.addEventListener('DOMContentLoaded', function () {
    initTheme();
    initHeader();
    initSplit();
    initLoader();
    initCounters();
    initRotator();
    initPipeline();
    initProjects();
    initTerminal();
    initCopy();
    initFX();
    var y = $('#year');
    if (y) y.textContent = new Date().getFullYear();
  });

  /* ------------------------------------------------------------------
   * Toast helper
   * ------------------------------------------------------------------ */
  var toastTimer;
  function toast(msg) {
    var t = $('#toast');
    if (!t) return;
    t.textContent = msg;
    t.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { t.classList.remove('show'); }, 2200);
  }

  /* ------------------------------------------------------------------
   * 1. Theme toggle (remembers choice)
   * ------------------------------------------------------------------ */
  function initTheme() {
    var btn = $('#themeToggle');
    if (!btn) return;
    var root = document.documentElement;
    var meta = $('meta[name="theme-color"]');

    function apply(theme) {
      root.setAttribute('data-theme', theme);
      if (meta) meta.setAttribute('content', theme === 'light' ? '#f6f3ec' : '#0f1110');
    }
    apply(root.getAttribute('data-theme') || 'dark');

    btn.addEventListener('click', function () {
      var next = root.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
      apply(next);
      try { localStorage.setItem('kk-theme', next); } catch (e) { /* storage unavailable */ }
    });
  }

  /* ------------------------------------------------------------------
   * 2. Header: scrolled state, progress bar, mobile menu, active link
   * ------------------------------------------------------------------ */
  function initHeader() {
    var header = $('#siteHeader');
    var progress = $('#progress');
    var menuBtn = $('#menuBtn');
    var links = $$('.nav-link');
    var aurora = $('.aurora');
    if (!header) return;

    var ticking = false;
    function onScroll() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () {
        var y = window.scrollY;
        header.classList.toggle('scrolled', y > 12);
        if (aurora && y < 1400) aurora.style.setProperty('--sy', y);
        if (progress) {
          var max = document.documentElement.scrollHeight - window.innerHeight;
          progress.style.transform = 'scaleX(' + (max > 0 ? Math.min(y / max, 1) : 0) + ')';
        }
        ticking = false;
      });
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    /* Mobile menu */
    function setMenu(open) {
      header.classList.toggle('open', open);
      if (menuBtn) {
        menuBtn.setAttribute('aria-expanded', String(open));
        menuBtn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
      }
    }
    if (menuBtn) {
      menuBtn.addEventListener('click', function () { setMenu(!header.classList.contains('open')); });
    }
    $$('#nav a').forEach(function (a) { a.addEventListener('click', function () { setMenu(false); }); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setMenu(false); });
    window.addEventListener('resize', function () { if (window.innerWidth > 900) setMenu(false); });

    /* Active section highlight */
    var map = {};
    links.forEach(function (l) {
      var id = (l.getAttribute('href') || '').replace('#', '');
      if (id) map[id] = l;
    });
    var sections = Object.keys(map).map(function (id) { return document.getElementById(id); }).filter(Boolean);
    if ('IntersectionObserver' in window && sections.length) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) {
            links.forEach(function (l) { l.classList.remove('active'); });
            if (map[en.target.id]) map[en.target.id].classList.add('active');
          }
        });
      }, { rootMargin: '-45% 0px -50% 0px' });
      sections.forEach(function (s) { io.observe(s); });
    }
  }

  /* ------------------------------------------------------------------
   * 3. Scroll reveal
   * ------------------------------------------------------------------ */
  function initReveal() {
    var els = $$('.reveal, .draw');
    $$('.tags').forEach(function (ul) {
      Array.prototype.forEach.call(ul.children, function (li, i) { li.style.setProperty('--i', i); });
    });
    if (!('IntersectionObserver' in window) || reduceMotion) {
      els.forEach(function (el) { el.classList.add('in'); });
      return;
    }
    /* light stagger for siblings inside grids */
    ['.skill-grid', '.contact-grid', '.certs', '.stats', '.timeline'].forEach(function (sel) {
      $$(sel).forEach(function (grid) {
        $$('.reveal', grid).forEach(function (el, i) { el.style.setProperty('--d', (i * 0.08) + 's'); });
      });
    });
    var io = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('in'); obs.unobserve(en.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    els.forEach(function (el) { io.observe(el); });
  }

  /* ------------------------------------------------------------------
   * 4. Count-up numbers
   * ------------------------------------------------------------------ */
  function initCounters() {
    var nums = $$('[data-count]');
    if (!nums.length) return;
    function run(el) {
      var target = parseFloat(el.getAttribute('data-count'));
      var suffix = el.getAttribute('data-suffix') || '';
      if (reduceMotion) { el.textContent = target + suffix; return; }
      var start = null, dur = 1100;
      function step(ts) {
        if (start === null) start = ts;
        var p = Math.min((ts - start) / dur, 1);
        var eased = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(target * eased) + (p === 1 ? suffix : '');
        if (p < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    }
    if (!('IntersectionObserver' in window)) { nums.forEach(run); return; }
    var io = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (en) { if (en.isIntersecting) { run(en.target); obs.unobserve(en.target); } });
    }, { threshold: 0.6 });
    nums.forEach(function (n) { io.observe(n); });
  }

  /* ------------------------------------------------------------------
   * 5. Hero role typewriter (words depend on the Software / Civil profile)
   * ------------------------------------------------------------------ */
  var profileWords = {
    tech: ['DevOps & Automation', 'Ansible · Docker · Kubernetes', 'Python Automation Scripting', 'Databases & SQL']
  };
  function currentProfile() { return 'tech'; }
  var rotatorCtl = { restart: function () {} };

  function initRotator() {
    var el = $('#rotator');
    if (!el) return;
    var wi = 0, ci = 0, deleting = false, timer = null;

    if (reduceMotion) {
      rotatorCtl.restart = function () { el.textContent = profileWords[currentProfile()][0]; };
      rotatorCtl.restart();
      return;
    }

    function tick() {
      var words = profileWords[currentProfile()];
      var w = words[wi % words.length];
      if (!deleting) {
        ci++;
        el.textContent = w.slice(0, ci);
        if (ci >= w.length) { deleting = true; timer = setTimeout(tick, 1800); return; }
        timer = setTimeout(tick, 55); return;
      }
      ci--;
      el.textContent = w.slice(0, Math.max(ci, 0));
      if (ci <= 0) { deleting = false; wi = (wi + 1) % words.length; timer = setTimeout(tick, 280); return; }
      timer = setTimeout(tick, 28);
    }
    rotatorCtl.restart = function () {
      clearTimeout(timer);
      wi = 0; ci = 0; deleting = false; el.textContent = '';
      timer = setTimeout(tick, 250);
    };
    /* show the first word right away, then start the loop */
    var first = profileWords[currentProfile()][0];
    el.textContent = first; ci = first.length; deleting = true;
    timer = setTimeout(tick, 2600);
  }

  /* ------------------------------------------------------------------
   * 5b. Split headlines into words for the mask-reveal animation
   * ------------------------------------------------------------------ */
  function initSplit() {
    if (reduceMotion) return;
    $$('h1, .title, .contact-title').forEach(function (el) {
      var i = 0;
      (function walk(node) {
        Array.prototype.slice.call(node.childNodes).forEach(function (n) {
          if (n.nodeType === 3) {
            var frag = document.createDocumentFragment();
            n.textContent.split(/(\s+)/).forEach(function (part) {
              if (!part) return;
              if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(' ')); return; }
              var w = document.createElement('span'); w.className = 'w';
              var inner = document.createElement('span'); inner.className = 'wi';
              inner.textContent = part; inner.style.setProperty('--i', i++);
              w.appendChild(inner); frag.appendChild(w);
            });
            node.replaceChild(frag, n);
          } else if (n.nodeType === 1) { walk(n); }
        });
      })(el);
      el.classList.add('split');
    });
  }

  /* ------------------------------------------------------------------
   * 5c. Intro loader → then start reveals
   * ------------------------------------------------------------------ */
  function initLoader() {
    var loader = $('#loader');
    var started = false;
    function start() {
      if (started) return;
      started = true;
      document.body.classList.add('ready');
      if (loader) {
        loader.classList.add('done');
        setTimeout(function () { if (loader.parentNode) loader.parentNode.removeChild(loader); }, 1200);
      }
      initReveal();
      setTimeout(initPet, 500);
    }
    if (!loader || reduceMotion) { start(); return; }
    var minWait = new Promise(function (r) { setTimeout(r, 700); });
    var loaded = new Promise(function (r) {
      if (document.readyState === 'complete') r(); else window.addEventListener('load', r);
    });
    Promise.all([minWait, loaded]).then(start);
    setTimeout(start, 2200); /* failsafe */
  }

  /* ------------------------------------------------------------------
   * 6. Automation workflow explorer (Experience)
   * ------------------------------------------------------------------ */
  function initPipeline() {
    var steps = $$('.pipe-step');
    var title = $('#pipeTitle');
    var text = $('#pipeText');
    var panel = $('#pipePanel');
    if (!steps.length || !title || !text) return;

    var data = [
      { t: 'Provisioning with Ansible', p: 'Server setup, dependencies and configuration are written as Ansible automation instead of manual steps — so the same setup can be applied again and again.' },
      { t: 'Packaging with Docker', p: 'Microservices are packaged as containers so each service runs the same way on any machine — the same image in development and in production.' },
      { t: 'Orchestrating with Kubernetes', p: 'Containerised services are deployed and managed on Kubernetes, supporting the scalability and reliability goals of cloud-native applications.' },
      { t: 'Repeatable, consistent environments', p: 'The end result of the internship work: provisioning, deployment and configuration workflows that reduce manual effort and give consistent, repeatable environments.' }
    ];

    function select(idx, focus) {
      steps.forEach(function (s, i) {
        var on = i === idx;
        s.classList.toggle('active', on);
        s.setAttribute('aria-selected', String(on));
        s.tabIndex = on ? 0 : -1;
      });
      title.textContent = data[idx].t;
      text.textContent = data[idx].p;
      if (panel) { panel.classList.remove('flash'); void panel.offsetWidth; panel.classList.add('flash'); }
      if (focus) steps[idx].focus();
    }

    steps.forEach(function (s, i) {
      s.tabIndex = i === 0 ? 0 : -1;
      s.addEventListener('click', function () { select(i, false); });
      s.addEventListener('keydown', function (e) {
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') { e.preventDefault(); select((i + 1) % steps.length, true); }
        if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') { e.preventDefault(); select((i - 1 + steps.length) % steps.length, true); }
      });
    });
  }

  /* ------------------------------------------------------------------
   * 7. Projects: case-study dialog + screenshot lightbox
   * ------------------------------------------------------------------ */
  function initProjects() {
    var caseDlg = $('#caseDialog');
    var caseBody = $('#caseBody');
    var lb = $('#lightbox');
    var lbImg = $('#lbImg');
    var lbCap = $('#lbCap');
    if (!caseDlg || !lb) return;

    var canModal = typeof caseDlg.showModal === 'function';

    function lockScroll(lock) { document.body.style.overflow = lock ? 'hidden' : ''; }
    function backdropClose(dlg) {
      dlg.addEventListener('click', function (e) {
        if (e.target === dlg) dlg.close();
      });
      dlg.addEventListener('close', function () {
        if (!$('dialog[open]')) lockScroll(false);
      });
    }
    backdropClose(caseDlg);
    backdropClose(lb);

    /* Case studies */
    $$('.case-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var tpl = document.getElementById(btn.getAttribute('data-case'));
        if (!tpl) return;
        caseBody.innerHTML = '';
        caseBody.appendChild(tpl.content.cloneNode(true));
        caseBody.scrollTop = 0;
        if (canModal) caseDlg.showModal(); else caseDlg.setAttribute('open', '');
        lockScroll(true);
      });
    });
    $('#caseClose').addEventListener('click', function () { caseDlg.close(); });

    /* Lightbox */
    var group = [];
    var cur = 0;

    function show(i) {
      cur = (i + group.length) % group.length;
      var img = $('img', group[cur]);
      lbImg.src = img.currentSrc || img.src;
      lbImg.alt = img.alt;
      lbCap.textContent = img.alt + '  (' + (cur + 1) + ' / ' + group.length + ')';
      var single = group.length < 2;
      $('#lbPrev').hidden = single;
      $('#lbNext').hidden = single;
    }

    $$('.project').forEach(function (proj) {
      var shots = $$('.shot', proj);
      shots.forEach(function (shot) {
        shot.addEventListener('click', function () {
          group = shots;
          show(parseInt(shot.getAttribute('data-index'), 10) || 0);
          if (typeof lb.showModal === 'function') lb.showModal(); else lb.setAttribute('open', '');
          lockScroll(true);
        });
      });
    });

    $('#lbClose').addEventListener('click', function () { lb.close(); });
    $('#lbPrev').addEventListener('click', function () { show(cur - 1); });
    $('#lbNext').addEventListener('click', function () { show(cur + 1); });
    lb.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowLeft') show(cur - 1);
      if (e.key === 'ArrowRight') show(cur + 1);
    });
    /* swipe left/right on touch screens */
    var sx = null;
    lb.addEventListener('touchstart', function (e) { sx = e.changedTouches[0].clientX; }, { passive: true });
    lb.addEventListener('touchend', function (e) {
      if (sx === null) return;
      var dx = e.changedTouches[0].clientX - sx; sx = null;
      if (Math.abs(dx) > 50 && group.length > 1) show(dx < 0 ? cur + 1 : cur - 1);
    }, { passive: true });
  }

  /* ------------------------------------------------------------------
   * 8. Interactive terminal
   * ------------------------------------------------------------------ */
  function initTerminal() {
    var input = $('#termInput');
    var out = $('#termOut');
    var screen = $('#termScreen');
    var quick = $('#termQuick');
    if (!input || !out) return;

    var history = [];
    var hIdx = 0;

    function esc(s) { return s.replace(/[&<>]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]; }); }
    function row(html, cls) {
      var d = document.createElement('div');
      d.className = 'row' + (cls ? ' ' + cls : '');
      d.innerHTML = html;
      out.appendChild(d);
    }
    function lines(arr) { arr.forEach(function (l) { row(l); }); }

    var commands = {
      help: function () {
        lines([
          'Available commands:',
          '  <b>about</b>       who I am',
          '  <b>stack</b>       languages &amp; tools',
          '  <b>experience</b>  internship summary',
          '  <b>projects</b>    what I\'ve built',
          '  <b>education</b>   degrees &amp; workshops',
          '  <b>contact</b>     how to reach me',
          '  <b>resume</b>      open my résumé (PDF)',
          '  <b>theme</b>       toggle light / dark',
          '  <b>clear</b>       clear the screen'
        ]);
      },
      about: function () {
        lines([
          '<span class="k">Kiran Kumar C V</span> — Python developer · DevOps &amp; automation',
          'B.E. Computer Science (8.0 CGPA) + Diploma in Civil Engineering',
          'Project Engineer at Trivi Infracons · Karnataka, India'
        ]);
      },
      stack: function () {
        lines([
          '<b>Languages</b>  Python · Java · C · SQL · HTML/CSS',
          '<b>DevOps</b>     Ansible · Docker · Kubernetes · Git/GitHub',
          '<b>Database</b>   MySQL',
          '<b>AI/Graphics</b> TensorFlow/Keras · OpenCV · OpenGL · Unity3D',
          '<b>Reporting</b>  Power BI · Matplotlib',
          '<b>Civil</b>      AutoCAD · ArchiCAD · DPR · Estimation'
        ]);
      },
      experience: function () {
        lines([
          '<span class="k">Project Engineer</span> @ Trivi Infracons (Apr 2026 – now)',
          '→ Site supervision, DPR &amp; reports, AutoCAD, estimation, site inspection',
          '<span class="k">Intern</span> @ Rooman Technologies',
          '→ Ansible, Docker &amp; Kubernetes automation for microservices',
          '<span class="k">Site Engineer</span> — 9 months (civil)'
        ]);
      },
      projects: function () {
        lines([
          '01  Lung Disease Classification (ML &amp; Explainable AI) — May 2025',
          '02  Rubik\'s Cube Simulation (C · OpenGL) — Jun 2024',
          '03  School Fees Management System (MySQL · PHP) — Dec 2023',
          '<span class="dim">Scroll to “Projects” for screenshots &amp; case studies.</span>'
        ]);
      },
      education: function () {
        lines([
          'B.E. Computer Science — Rajeev Institute of Technology (2023–2025) · 8.0 CGPA',
          'Diploma in Civil Engineering — Govt. Polytechnic Belur (2018–2021) · 72%',
          'Courses: AutoCAD &amp; ArchiCAD · AR/VR (Unity3D) · Cyber Security · Data Analytics'
        ]);
      },
      contact: function () {
        lines([
          'email     <a href="mailto:2602kirankumar@gmail.com">2602kirankumar@gmail.com</a>',
          'phone     +91 82170 37305',
          'github    <a href="https://github.com/KiranKumarCV" target="_blank" rel="noopener noreferrer">github.com/KiranKumarCV</a>',
          'linkedin  <a href="https://www.linkedin.com/in/kiran-kumar-c-v" target="_blank" rel="noopener noreferrer">in/kiran-kumar-c-v</a>'
        ]);
      },
      resume: function () {
        row('Opening résumé…');
        window.open('assets/resume/Kiran-Kumar-CV.pdf', '_blank', 'noopener');
      },
      theme: function () {
        var btn = $('#themeToggle');
        if (btn) btn.click();
        row('Theme switched.');
      },
      clear: function () { out.innerHTML = ''; }
    };
    /* friendly aliases */
    commands.skills = commands.stack;
    commands.cv = commands.resume;
    commands.whoami = commands.about;
    commands.ls = commands.projects;

    function run(raw) {
      var cmd = raw.trim().toLowerCase();
      if (!cmd) return;
      history.push(cmd);
      hIdx = history.length;
      row('<span class="k">$</span> ' + esc(cmd), 'cmd');
      if (commands[cmd]) commands[cmd]();
      else row('command not found: ' + esc(cmd) + ' — try <b>help</b>', 'dim');
      screen.scrollTop = screen.scrollHeight;
    }

    input.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') { run(input.value); input.value = ''; }
      else if (e.key === 'ArrowUp') {
        if (history.length) { hIdx = Math.max(0, hIdx - 1); input.value = history[hIdx] || ''; }
        e.preventDefault();
      } else if (e.key === 'ArrowDown') {
        hIdx = Math.min(history.length, hIdx + 1);
        input.value = history[hIdx] || '';
        e.preventDefault();
      }
    });
    if (quick) {
      quick.addEventListener('click', function (e) {
        var b = e.target.closest('button[data-cmd]');
        if (b) run(b.getAttribute('data-cmd'));
      });
    }
    /* Click anywhere in the screen to focus the input (without stealing scroll on touch) */
    screen.addEventListener('click', function (e) {
      if (!e.target.closest('a, button')) input.focus({ preventScroll: true });
    });
  }

  /* ------------------------------------------------------------------
   * 9. Copy e-mail
   * ------------------------------------------------------------------ */
  function initCopy() {
    var btn = $('#copyEmail');
    if (!btn) return;
    btn.addEventListener('click', function () {
      var value = btn.getAttribute('data-copy');
      function done() { toast('Email address copied'); }
      function fallback() {
        var ta = document.createElement('textarea');
        ta.value = value; ta.setAttribute('readonly', '');
        ta.style.position = 'fixed'; ta.style.opacity = '0';
        document.body.appendChild(ta); ta.select();
        try { document.execCommand('copy'); done(); } catch (e) { toast('Press Ctrl/Cmd + C to copy'); }
        document.body.removeChild(ta);
      }
      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(value).then(done, fallback);
      } else {
        fallback();
      }
    });
  }

  /* ------------------------------------------------------------------
   * 10. Pointer effects: cursor glow, portrait tilt, spotlight, magnetic buttons
   * ------------------------------------------------------------------ */
  function initFX() {
    var fine = window.matchMedia('(pointer: fine)').matches;
    if (reduceMotion || !fine) return;

    /* soft glow following the cursor */
    var glow = $('#cursorGlow');
    var gx = 0, gy = 0, tx = 0, ty = 0, glowOn = false;
    if (glow) {
      window.addEventListener('mousemove', function (e) {
        tx = e.clientX; ty = e.clientY;
        if (!glowOn) { glowOn = true; glow.classList.add('on'); gx = tx; gy = ty; }
      }, { passive: true });
      document.addEventListener('mouseleave', function () { glow.classList.remove('on'); glowOn = false; });
      (function loop() {
        gx += (tx - gx) * 0.12; gy += (ty - gy) * 0.12;
        glow.style.transform = 'translate(' + gx.toFixed(1) + 'px,' + gy.toFixed(1) + 'px)';
        requestAnimationFrame(loop);
      })();
    }

    /* hero portrait tilt + chip parallax */
    var hero = $('.hero');
    var tilt = $('.portrait .tilt');
    var chips = $$('.chip');
    if (hero && tilt) {
      var raf = null;
      hero.addEventListener('mousemove', function (e) {
        if (raf) return;
        raf = requestAnimationFrame(function () {
          raf = null;
          var r = hero.getBoundingClientRect();
          var nx = (e.clientX - r.left) / r.width - 0.5;
          var ny = (e.clientY - r.top) / r.height - 0.5;
          tilt.style.setProperty('--ry', (nx * 14).toFixed(2) + 'deg');
          tilt.style.setProperty('--rx', (-ny * 10).toFixed(2) + 'deg');
          chips.forEach(function (c) {
            var d = parseFloat(c.getAttribute('data-depth')) || 20;
            c.style.setProperty('--px', (nx * d).toFixed(1) + 'px');
            c.style.setProperty('--py', (ny * d).toFixed(1) + 'px');
          });
        });
      }, { passive: true });
      hero.addEventListener('mouseleave', function () {
        tilt.style.setProperty('--ry', '0deg'); tilt.style.setProperty('--rx', '0deg');
        chips.forEach(function (c) { c.style.setProperty('--px', '0px'); c.style.setProperty('--py', '0px'); });
      });
    }

    /* spotlight that follows the pointer inside cards */
    var spots = $$('.skill-card, .c-card, .exp-card, .pipeline, .cert, .project, .role-card, .idea');
    spots.forEach(function (el) {
      el.classList.add('spot');
      el.addEventListener('mousemove', function (e) {
        var r = el.getBoundingClientRect();
        el.style.setProperty('--mx', (e.clientX - r.left) + 'px');
        el.style.setProperty('--my', (e.clientY - r.top) + 'px');
      }, { passive: true });
    });

    /* magnetic buttons */
    $$('.btn-solid, .btn-ghost, .copy').forEach(function (btn) {
      btn.addEventListener('mousemove', function (e) {
        var r = btn.getBoundingClientRect();
        btn.style.setProperty('--tx', ((e.clientX - r.left - r.width / 2) * 0.22).toFixed(1) + 'px');
        btn.style.setProperty('--ty', ((e.clientY - r.top - r.height / 2) * 0.3).toFixed(1) + 'px');
      });
      btn.addEventListener('mouseleave', function () {
        btn.style.setProperty('--tx', '0px'); btn.style.setProperty('--ty', '0px');
      });
    });
  }

  /* ------------------------------------------------------------------
   * 11. "K" door + peeking virtual pet
   *     Every PET_INTERVAL_MS (15 s) the door opens and a NEW random pet peeks out.
   *     Move the cursor to it (or tap it on a phone) and it comes out and welcomes you.
   *     If nobody interacts, it waves goodbye by ducking back inside.
   * ------------------------------------------------------------------ */
  var PET_INTERVAL_MS = 15000;                       /* a new pet peeks every 15 seconds */
  var PET_PEEK_MS = 5200;                            /* how long it waits for you before ducking back in */
  var PET_MESSAGES = ['Welcome to my profile..', "How are you doing today?"];
  var PET_WALK_CYCLES = 2;                           /* leg cycles (0.6 s each) per walk, keeps steps in sync */
  var PET_EYE = '#241a2b';

  /* ---- generic four-legged cartoon pet, drawn facing right ---- */
  function quad(o) {
    var L = o.line;
    function st(w) { return ' stroke="' + L + '" stroke-width="' + (w || 1.25) + '" stroke-linejoin="round" stroke-linecap="round"'; }
    function leg(x, cls, dark) {
      return '<g class="lg ' + cls + '"><rect x="' + x + '" y="41" width="7" height="12" rx="3.5" fill="' + (dark ? o.leg2 : o.leg) + '"' + st() + '/>' +
        '<ellipse cx="' + (x + 3.5) + '" cy="52.5" rx="4.5" ry="2.3" fill="' + (dark ? o.paw2 : o.paw) + '"' + st() + '/></g>';
    }
    function curve(d, w, inner) {
      return '<path d="' + d + '" fill="none" stroke="' + L + '" stroke-width="' + (w + 2.2) + '" stroke-linecap="round"/>' +
             '<path d="' + d + '" fill="none" stroke="' + inner + '" stroke-width="' + w + '" stroke-linecap="round"/>';
    }

    var tails = {
      cat: '<g class="tail">' + curve('M12 39C-1 39 -2 23 8 21', 5, o.main) + '</g>',
      dog: '<g class="tail">' + curve('M12 37C6 36 4 30 7 25', 4.4, o.main) + '</g>',
      fox: '<g class="tail"><ellipse cx="4" cy="33" rx="12" ry="6.8" transform="rotate(-38 4 33)" fill="' + o.main + '"' + st() + '/>' +
           '<ellipse cx="-3.6" cy="24.6" rx="4.6" ry="3.6" transform="rotate(-38 -3.6 24.6)" fill="#fff6ea"' + st(1) + '/></g>',
      pom: '<g class="tail"><circle cx="9" cy="37" r="5.2" fill="' + (o.tailc || o.main) + '"' + st() + '/></g>',
      curl: '<g class="tail">' + curve('M11 36c-6-2-5-8-1-7s3 5-1 5', 2.2, o.muzzle2 || o.main) + '</g>',
      stub: '<g class="tail"><circle cx="10" cy="38" r="3.4" fill="' + o.main + '"' + st() + '/></g>'
    };

    var earsBack = '', earsFront = '', marksHead = '', marksBody = '', whisk = '';
    switch (o.ears) {
      case 'tri':
        earsBack = '<g class="ear"><path d="M34 17 36 2.5 46 12z" fill="' + o.main + '"' + st() + '/><path d="M36.8 13.5 37.4 7.4 42 11.6z" fill="' + o.earIn + '"/></g>' +
                   '<path d="M45 12 53 3.5 56 19z" fill="' + o.main + '"' + st() + '/><path d="M47 13 52.6 8 54 16z" fill="' + o.earIn + '"/>';
        break;
      case 'fox':
        earsBack = '<g class="ear"><path d="M34 17 35 0.5 46 12z" fill="' + o.main + '"' + st() + '/><path d="M35.2 6.5 35.5 2.6 39 5.6z" fill="#3a2217"/><path d="M36.8 13.5 37 8.5 41.6 11.6z" fill="#3a2217" opacity=".85"/></g>' +
                   '<path d="M45 12 54 1 57 19z" fill="' + o.main + '"' + st() + '/><path d="M51.6 3.4 53.6 2 55 6.4z" fill="#3a2217"/><path d="M47.4 13 53 8.6 54.4 16z" fill="#3a2217" opacity=".85"/>';
        break;
      case 'bunny':
        earsBack = '<g class="ear"><ellipse cx="38" cy="7" rx="3.9" ry="11.5" transform="rotate(-8 38 7)" fill="' + o.main + '"' + st() + '/><ellipse cx="38" cy="8" rx="1.7" ry="7.6" transform="rotate(-8 38 7)" fill="' + o.earIn + '"/></g>' +
                   '<ellipse cx="48" cy="8" rx="3.7" ry="11" transform="rotate(9 48 8)" fill="' + o.main + '"' + st() + '/><ellipse cx="48" cy="9" rx="1.6" ry="7.2" transform="rotate(9 48 8)" fill="' + o.earIn + '"/>';
        break;
      case 'round':
        earsBack = '<g class="ear"><circle cx="34.5" cy="14" r="5.4" fill="' + o.earc + '"' + st() + '/></g><circle cx="52.5" cy="13" r="5.4" fill="' + o.earc + '"' + st() + '/>';
        break;
      case 'pig':
        earsBack = '<g class="ear"><path d="M34 16 37 4.5 46.5 12.5z" fill="' + o.main + '"' + st() + '/><path d="M37 12.6 38.2 8.2 42.6 11.8z" fill="' + o.earIn + '"/></g>' +
                   '<path d="M46 12.5 55.5 5 57 18z" fill="' + o.main + '"' + st() + '/><path d="M48 13.2 53.6 9 54.6 15z" fill="' + o.earIn + '"/>';
        break;
      case 'hamster':
        earsBack = '<g class="ear"><circle cx="35" cy="14.5" r="4.8" fill="' + o.main + '"' + st() + '/><circle cx="35" cy="14.8" r="2.6" fill="' + o.earIn + '"/></g>' +
                   '<circle cx="52" cy="14" r="4.8" fill="' + o.main + '"' + st() + '/><circle cx="52" cy="14.3" r="2.6" fill="' + o.earIn + '"/>';
        break;
      case 'floppy':
        earsFront = '<g class="ear"><path d="M36 13C28 12 27 29 33 34 38 33 40 22 39 13z" fill="' + o.earc + '"' + st() + '/></g>';
        break;
    }

    switch (o.marks) {
      case 'cat':
        marksHead = '<path d="M43 12.5v4.4M46.4 12v5.4M49.8 12.5v4.4" stroke="' + o.stripe + '" stroke-width="1.7" stroke-linecap="round" fill="none"/>';
        marksBody = '<path d="M14 31q3.4 4 2.2 10M20 29q3.6 4.6 2.4 11M26 28.5q3.4 4.4 2.4 10.6" stroke="' + o.stripe + '" stroke-width="2" stroke-linecap="round" fill="none" opacity=".85"/>';
        whisk = '<path d="M53 29.5l8-1.8M53.4 31.2l7.6 1.6" stroke="' + L + '" stroke-width=".7" stroke-linecap="round" opacity=".7"/>';
        break;
      case 'dog':
        marksHead = '<ellipse cx="41" cy="22.6" rx="6.4" ry="7.6" transform="rotate(14 41 22.6)" fill="' + o.earc + '" opacity=".92"/>';
        break;
      case 'fox':
        marksHead = '<path d="M32 28c4 9 18 12 25 1-5 3-9 3-13 2-5-1-9-1-12-3z" fill="#fff6ea"/>';
        break;
      case 'panda':
        marksHead = '<ellipse cx="40.6" cy="23.6" rx="5" ry="5.8" transform="rotate(22 40.6 23.6)" fill="#25272b"/><ellipse cx="51.4" cy="24" rx="4.4" ry="5.2" transform="rotate(-22 51.4 24)" fill="#25272b"/>';
        marksBody = '<ellipse cx="35.5" cy="38" rx="6" ry="11.4" fill="#25272b"/>';
        break;
      case 'hamster':
        marksBody = '<ellipse cx="22" cy="30.5" rx="9" ry="5.6" fill="' + o.stripe + '" opacity=".85"/>';
        marksHead = '<ellipse cx="38" cy="30.6" rx="5.6" ry="4.4" fill="' + o.muzzle + '"/><ellipse cx="52.4" cy="30.6" rx="4.8" ry="4" fill="' + o.muzzle + '"/>';
        break;
    }

    var face;
    if (o.pig) {
      face = '<ellipse cx="54.4" cy="28.8" rx="6" ry="4.8" fill="' + o.muzzle2 + '"' + st(1.1) + '/>' +
             '<ellipse cx="53" cy="28.6" rx="1" ry="1.7" fill="' + L + '"/><ellipse cx="56.6" cy="28.6" rx="1" ry="1.7" fill="' + L + '"/>';
    } else {
      face = '<ellipse cx="52" cy="28.8" rx="6.7" ry="5" fill="' + o.muzzle + '"/>' +
             '<path d="M54.4 25.6q2.2-1.8 4.4 0-.3 2.4-2.2 3.1-1.9-.7-2.2-3.1z" fill="' + o.nose + '"' + st(.8) + '/>' +
             '<path d="M56.6 28.8v1.6M53 31.2q1.8 1.7 3.6-.1" fill="none" stroke="' + L + '" stroke-width=".9" stroke-linecap="round"/>';
    }
    var eyes = '<g class="eyes">' +
      '<ellipse cx="41" cy="23.4" rx="3.4" ry="4.2" fill="' + PET_EYE + '"/><circle cx="42.3" cy="21.6" r="1.35" fill="#fff"/><circle cx="40" cy="25.4" r=".65" fill="#fff" opacity=".9"/>' +
      '<ellipse cx="50.4" cy="23.6" rx="2.9" ry="3.7" fill="' + PET_EYE + '"/><circle cx="51.4" cy="22" r="1.15" fill="#fff"/></g>';
    var blush = '<ellipse cx="36.4" cy="29.6" rx="3.2" ry="1.9" fill="#ff7f9a" opacity=".42"/>';

    return '<defs>' +
      '<linearGradient id="gb" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="' + o.main + '"/><stop offset="1" stop-color="' + o.main2 + '"/></linearGradient>' +
      '<linearGradient id="gh" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="' + o.head1 + '"/><stop offset="1" stop-color="' + o.head2 + '"/></linearGradient></defs>' +
      leg(17.5, 'a', true) + leg(41, 'b', true) + tails[o.tail] +
      '<ellipse cx="27" cy="37.5" rx="18.5" ry="11.8" fill="url(#gb)"' + st(1.35) + '/>' +
      '<ellipse cx="29" cy="44" rx="11.5" ry="5" fill="' + o.belly + '" opacity=".92"/>' + marksBody +
      leg(11, 'b', false) + leg(34.5, 'a', false) +
      '<g class="head">' + earsBack +
      '<ellipse cx="43" cy="24" rx="14.5" ry="12.5" fill="url(#gh)"' + st(1.35) + '/>' +
      marksHead + face + eyes + blush + whisk + earsFront + '</g>';
  }

  /* ---- three special shapes: penguin, chick, frog ---- */
  function penguin() {
    var L = '#12141c';
    return '<defs><linearGradient id="gb" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#434b62"/><stop offset="1" stop-color="#1f2330"/></linearGradient></defs>' +
      '<g class="lg a"><ellipse cx="23" cy="53" rx="6.4" ry="2.7" fill="#ff9f1c" stroke="#9a5a00" stroke-width="1.1"/></g>' +
      '<g class="lg b"><ellipse cx="38" cy="53" rx="6.4" ry="2.7" fill="#ff9f1c" stroke="#9a5a00" stroke-width="1.1"/></g>' +
      '<path class="tail" d="M16 45 7 52l14-1z" fill="#1f2330" stroke="' + L + '" stroke-width="1.1" stroke-linejoin="round"/>' +
      '<ellipse cx="30" cy="30" rx="17" ry="22.5" fill="url(#gb)" stroke="' + L + '" stroke-width="1.4"/>' +
      '<ellipse cx="34" cy="36" rx="11" ry="15.5" fill="#fbfbf6"/>' +
      '<g class="wing"><ellipse cx="15.5" cy="33" rx="4.4" ry="12" transform="rotate(10 15.5 33)" fill="#2a3042" stroke="' + L + '" stroke-width="1.2"/></g>' +
      '<g class="head"><ellipse cx="38" cy="21.5" rx="9.4" ry="7.6" fill="#fbfbf6"/>' +
      '<g class="eyes"><ellipse cx="35.4" cy="20.6" rx="2.6" ry="3.3" fill="' + PET_EYE + '"/><circle cx="36.4" cy="19.2" r="1.1" fill="#fff"/>' +
      '<ellipse cx="43" cy="20.8" rx="2.3" ry="3" fill="' + PET_EYE + '"/><circle cx="43.9" cy="19.5" r="1" fill="#fff"/></g>' +
      '<path d="M39.6 24.4q5.4-1.5 9 1.4-3.2 3.8-9 2.6z" fill="#ff9f1c" stroke="#9a5a00" stroke-width="1" stroke-linejoin="round"/>' +
      '<ellipse cx="33" cy="25.4" rx="2.8" ry="1.7" fill="#ff7f9a" opacity=".45"/></g>';
  }
  function chick() {
    var L = '#c98a00';
    return '<defs><radialGradient id="gb" cx=".4" cy=".32" r=".85"><stop offset="0" stop-color="#ffe98a"/><stop offset="1" stop-color="#ffc22e"/></radialGradient></defs>' +
      '<g class="lg a"><path d="M25.5 46v6.5" stroke="#ff9f1c" stroke-width="2.4" stroke-linecap="round"/><path d="M21 53.2h9" stroke="#ff9f1c" stroke-width="2.4" stroke-linecap="round"/></g>' +
      '<g class="lg b"><path d="M36.5 46v6.5" stroke="#ff9f1c" stroke-width="2.4" stroke-linecap="round"/><path d="M32 53.2h9" stroke="#ff9f1c" stroke-width="2.4" stroke-linecap="round"/></g>' +
      '<path class="tail" d="M12 36 4 31l1 8z" fill="#ffd24d" stroke="' + L + '" stroke-width="1.1" stroke-linejoin="round"/>' +
      '<circle cx="31" cy="31" r="19.5" fill="url(#gb)" stroke="' + L + '" stroke-width="1.4"/>' +
      '<g class="ear"><path d="M28 12.4c-1.4-6 3.6-6.4 5-3M33 11.6c2.6-6.4 7.2-4.4 6.6-.8" fill="none" stroke="#e5a800" stroke-width="2.2" stroke-linecap="round"/></g>' +
      '<g class="wing"><ellipse cx="22" cy="35" rx="8.4" ry="5.8" transform="rotate(-18 22 35)" fill="#ffd24d" stroke="' + L + '" stroke-width="1.2"/></g>' +
      '<g class="head"><path d="M47.5 29q8.4.8 8.6 4-4.2 3.4-8.6 1.6z" fill="#ff9f1c" stroke="#b86a00" stroke-width="1" stroke-linejoin="round"/>' +
      '<g class="eyes"><ellipse cx="41" cy="26.4" rx="3" ry="3.9" fill="' + PET_EYE + '"/><circle cx="42.2" cy="24.7" r="1.25" fill="#fff"/><circle cx="40" cy="28.2" r=".6" fill="#fff"/></g>' +
      '<ellipse cx="36" cy="34" rx="3.8" ry="2.3" fill="#ff7f9a" opacity=".5"/></g>';
  }
  function frog() {
    var L = '#1f5a2d';
    return '<defs><linearGradient id="gb" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#86e096"/><stop offset="1" stop-color="#46a85a"/></linearGradient></defs>' +
      '<g class="lg b"><ellipse cx="13" cy="48" rx="9.5" ry="5.4" fill="#3f9b52" stroke="' + L + '" stroke-width="1.2"/></g>' +
      '<g class="lg a"><ellipse cx="44" cy="51" rx="6.4" ry="3.2" fill="#3f9b52" stroke="' + L + '" stroke-width="1.2"/></g>' +
      '<ellipse cx="29" cy="38" rx="22" ry="14.5" fill="url(#gb)" stroke="' + L + '" stroke-width="1.4"/>' +
      '<ellipse cx="33" cy="45" rx="13" ry="6.4" fill="#dff7cf"/>' +
      '<circle cx="19" cy="31" r="2.3" fill="#2f8a44" opacity=".55"/><circle cx="26.5" cy="27.6" r="1.7" fill="#2f8a44" opacity=".55"/><circle cx="15" cy="38" r="1.6" fill="#2f8a44" opacity=".5"/>' +
      '<g class="head"><circle cx="38" cy="23.5" r="8" fill="#86e096" stroke="' + L + '" stroke-width="1.3"/><circle cx="22" cy="23.5" r="8" fill="#86e096" stroke="' + L + '" stroke-width="1.3"/>' +
      '<circle cx="38.6" cy="23" r="5.2" fill="#fff"/><circle cx="22.6" cy="23" r="5.2" fill="#fff"/>' +
      '<g class="eyes"><ellipse cx="40" cy="23.4" rx="3" ry="3.6" fill="' + PET_EYE + '"/><circle cx="41" cy="21.9" r="1.1" fill="#fff"/>' +
      '<ellipse cx="24" cy="23.4" rx="3" ry="3.6" fill="' + PET_EYE + '"/><circle cx="25" cy="21.9" r="1.1" fill="#fff"/></g>' +
      '<path d="M33 37q10 7 21-.5" fill="none" stroke="' + L + '" stroke-width="1.5" stroke-linecap="round"/>' +
      '<ellipse cx="49" cy="36.6" rx="3.2" ry="2" fill="#ff8aa0" opacity=".5"/></g>';
  }

  var PETS = {
    cat: quad({ main: '#f6a84a', main2: '#e68d2e', head1: '#fcbb62', head2: '#f39b3a', leg: '#f09a3a', leg2: '#d9822a', paw: '#fff1de', paw2: '#f1dcc0', belly: '#fff0d9', line: '#8a4a14', muzzle: '#fff0d9', nose: '#ff7d96', earIn: '#ffb3bf', stripe: '#c9742a', tail: 'cat', ears: 'tri', marks: 'cat' }),
    dog: quad({ main: '#c68a55', main2: '#a96f3f', head1: '#dca46d', head2: '#c68a55', leg: '#b87b49', leg2: '#9a6236', paw: '#f5e3c8', paw2: '#e4cfae', belly: '#f3e0c2', line: '#5e3a1d', muzzle: '#f6e6cc', nose: '#2a1d1f', earc: '#8a5530', tail: 'dog', ears: 'floppy', marks: 'dog' }),
    bunny: quad({ main: '#fffaf5', main2: '#efe6dc', head1: '#fffdf9', head2: '#f6eee5', leg: '#f7efe6', leg2: '#e3d7ca', paw: '#fff', paw2: '#f1e8de', belly: '#ffffff', line: '#9c8a7a', muzzle: '#fff4f0', nose: '#ff8fa6', earIn: '#ffbcc9', tail: 'pom', ears: 'bunny' }),
    fox: quad({ main: '#f2873a', main2: '#dd6c22', head1: '#f99c52', head2: '#ee7d30', leg: '#6a3a24', leg2: '#4d281a', paw: '#4d281a', paw2: '#3a1e12', belly: '#fff3e4', line: '#7a3a14', muzzle: '#fff3e4', nose: '#2a1d1f', tail: 'fox', ears: 'fox', marks: 'fox' }),
    panda: quad({ main: '#fbfbf8', main2: '#e7e7e1', head1: '#ffffff', head2: '#f1f1ec', leg: '#2a2c30', leg2: '#1d1f22', paw: '#2a2c30', paw2: '#1d1f22', belly: '#ffffff', line: '#1d1f22', muzzle: '#f3f3ee', nose: '#1d1f22', earc: '#2a2c30', tailc: '#fbfbf8', tail: 'pom', ears: 'round', marks: 'panda' }),
    pig: quad({ main: '#ffb3c1', main2: '#f592a7', head1: '#ffc4cf', head2: '#ffa8b8', leg: '#f79bb0', leg2: '#e5849b', paw: '#e97b95', paw2: '#d46885', belly: '#ffd0d9', line: '#a1425d', muzzle2: '#ff93a9', earIn: '#ff8aa3', tail: 'curl', ears: 'pig', pig: true }),
    hamster: quad({ main: '#e8b97a', main2: '#d49c5a', head1: '#f4cd94', head2: '#e5b476', leg: '#e3b274', leg2: '#c99358', paw: '#fff1dc', paw2: '#f0dcc0', belly: '#fff4e3', line: '#7a4d1f', muzzle: '#fff4e3', nose: '#ff8fa6', earIn: '#ffb3bf', stripe: '#c98b4a', tail: 'stub', ears: 'hamster', marks: 'hamster' }),
    penguin: penguin(),
    chick: chick(),
    frog: frog()
  };

  function initPet() {
    var pet = $('#pet'), lane = $('#petLane'), body = $('#petBody'), bubble = $('#petBubble'), door = $('#door');
    if (!pet || !lane || !body || !bubble || !door) return;

    var names = Object.keys(PETS);
    var current = null;
    try { current = localStorage.getItem('kk-pet'); } catch (e) { /* storage unavailable */ }

    /* a different pet every time: never the same as the one before (even across refreshes) */
    function nextPet() {
      var pool = names.filter(function (n) { return n !== current; });
      current = pool[Math.floor(Math.random() * pool.length)];
      try { localStorage.setItem('kk-pet', current); } catch (e) { /* storage unavailable */ }
      return current;
    }

    var HIDDEN = -80, PEEK = -30, REST = 62;          /* px, relative to the door's centre */
    var canAnimate = !reduceMotion && ('animate' in Element.prototype);
    var HINT = window.matchMedia('(pointer: coarse)').matches ? 'Psst… tap me!' : 'Psst… come closer!';
    var state = 'idle', wantOut = false, peekReady = false;
    var timers = [], sway = null, cx = 0, vw = 0, bubbleW = 0;

    function later(fn, ms) { var t = setTimeout(fn, ms); timers.push(t); return t; }
    function clearTimers() { timers.forEach(clearTimeout); timers = []; }
    function tx(x) { return 'translateX(' + x + 'px)'; }
    function curX() {
      var t = getComputedStyle(pet).transform;
      if (!t || t === 'none') return 0;
      try { return new DOMMatrixReadOnly(t).m41; } catch (e) { return 0; }
    }

    /* the lane is a clipping window whose left edge is the door's centre → pet steps out of the doorway */
    function layout() {
      vw = document.documentElement.clientWidth;
      var r = door.getBoundingClientRect();
      cx = Math.round(r.left + r.width / 2);
      lane.style.left = cx + 'px';
      lane.style.width = Math.max(vw - cx, 0) + 'px';
      var longest = [HINT].concat(PET_MESSAGES).sort(function (a, b) { return b.length - a.length; })[0];
      bubble.style.minWidth = '';
      bubble.textContent = longest;
      bubbleW = bubble.offsetWidth;
      bubble.style.minWidth = bubbleW + 'px';       /* fixed width = no jitter while typing */
      bubble.textContent = '';
    }
    function bubbleAt(centerX) {
      var left = Math.max(8, Math.min(centerX - 30, vw - bubbleW - 8));
      bubble.style.left = left + 'px';
      bubble.style.setProperty('--tail', Math.max(14, Math.min(centerX - left, bubbleW - 14)) + 'px');
    }
    function typeText(text, done) {
      if (!canAnimate) { bubble.textContent = text; if (done) later(done, 0); return; }
      var i = 0; bubble.textContent = '';
      (function step() {
        i++;
        bubble.textContent = text.slice(0, i);
        if (i < text.length) later(step, 55); else if (done) done();
      })();
    }

    function startSway() {
      if (!canAnimate) return;
      sway = pet.animate([{ transform: tx(PEEK) }, { transform: tx(PEEK + 5) }],
        { duration: 1200, direction: 'alternate', iterations: Infinity, easing: 'ease-in-out' });
    }
    function stopSway() {
      var x = curX();
      if (sway) { sway.cancel(); sway = null; }
      pet.style.transform = tx(x);
      return x;
    }

    function finish() {
      clearTimers();
      if (sway) { sway.cancel(); sway = null; }
      pet.classList.remove('show', 'walking', 'greet', 'back');
      bubble.classList.remove('say');
      pet.style.transform = tx(HIDDEN);
      door.classList.remove('open');
      state = 'idle'; wantOut = false; peekReady = false;
    }

    /* 1) door opens, pet slides up into the doorway and peeks (head visible) */
    function peek(auto) {
      if (state !== 'idle') return;
      if (auto && document.hidden) return;
      state = 'peeking'; wantOut = !auto; peekReady = false;
      clearTimers();
      body.innerHTML = '<svg viewBox="-8 0 72 56" role="presentation" focusable="false">' + PETS[nextPet()] + '</svg>';
      layout();
      pet.classList.remove('back', 'walking', 'greet');
      pet.style.transform = tx(HIDDEN);
      door.classList.add('open');
      later(function () {                              /* let the door swing open first */
        pet.classList.add('show');
        if (!canAnimate) { pet.style.transform = tx(PEEK); afterPeekIn(); return; }
        var a = pet.animate([{ transform: tx(HIDDEN) }, { transform: tx(PEEK) }],
          { duration: 520, easing: 'cubic-bezier(.2,.9,.3,1)', fill: 'forwards' });
        a.onfinish = function () { pet.style.transform = tx(PEEK); a.cancel(); afterPeekIn(); };
      }, 520);
    }
    function afterPeekIn() {
      if (wantOut) { comeOut(); return; }
      peekReady = true;
      startSway();
      bubbleAt(cx + PEEK + 45);
      bubble.textContent = HINT;
      bubble.classList.add('say');
      later(retreat, PET_PEEK_MS);
    }

    /* nobody came: duck back inside and close the door */
    function retreat() {
      if (state !== 'peeking') return;
      peekReady = false;
      bubble.classList.remove('say');
      var x = stopSway();
      if (!canAnimate) { finish(); return; }
      var a = pet.animate([{ transform: tx(x) }, { transform: tx(HIDDEN) }],
        { duration: 460, easing: 'cubic-bezier(.5,0,.8,.4)', fill: 'forwards' });
      a.onfinish = function () { a.cancel(); finish(); };
    }

    /* 2) cursor/tap detected: walk out of the doorway */
    function comeOut() {
      if (state === 'busy') return;
      state = 'busy'; wantOut = false; peekReady = false;
      clearTimers();
      bubble.classList.remove('say');
      var x = stopSway();
      if (!canAnimate) { pet.style.transform = tx(REST); door.classList.remove('open'); greet(); return; }
      pet.classList.add('walking');
      var a = pet.animate([{ transform: tx(x) }, { transform: tx(REST) }],
        { duration: PET_WALK_CYCLES * 600, easing: 'linear', fill: 'forwards' });
      a.onfinish = function () {
        pet.style.transform = tx(REST); a.cancel();
        pet.classList.remove('walking');
        door.classList.remove('open');                /* door swings shut behind it */
        greet();
      };
    }

    /* 3) hop, wag and say the welcome messages */
    function greet() {
      pet.classList.add('greet');
      later(function () {
        bubbleAt(cx + REST + 32);
        bubble.classList.add('say');
        var i = 0;
        (function next() {
          if (i >= PET_MESSAGES.length) { later(goHome, 300); return; }
          typeText(PET_MESSAGES[i++], function () { later(next, 1500); });
        })();
      }, 150);
    }

    /* 4) turn around, door opens, walk back in */
    function goHome() {
      bubble.classList.remove('say');
      pet.classList.remove('greet');
      if (!canAnimate) { finish(); return; }
      pet.classList.add('back');
      later(function () {
        door.classList.add('open');
        later(function () {
          pet.classList.add('walking');
          var a = pet.animate([{ transform: tx(REST) }, { transform: tx(HIDDEN) }],
            { duration: PET_WALK_CYCLES * 600, easing: 'linear', fill: 'forwards' });
          a.onfinish = function () { a.cancel(); pet.style.transform = tx(HIDDEN); later(finish, 250); };
        }, 380);
      }, 340);
    }

    /* hover / tap / keyboard on the door (or on the peeking pet) */
    function trigger() {
      if (state === 'idle') peek(false);
      else if (state === 'peeking') {
        wantOut = true;
        if (peekReady) comeOut();
      }
    }
    door.addEventListener('pointerenter', trigger);
    door.addEventListener('focus', trigger);
    door.addEventListener('click', function (e) { e.preventDefault(); trigger(); });

    finish();                                          /* start from a clean "hidden" state */
    peek(true);                                        /* first visitor right after the page loads */
    setInterval(function () { peek(true); }, PET_INTERVAL_MS);
  }
})();
