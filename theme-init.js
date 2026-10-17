/* Runs before first paint: JS flag + saved/system colour theme (prevents a flash). */
(function () {
  var d = document.documentElement;
  d.classList.add('js');
  try {
    var t = localStorage.getItem('kk-theme');
    if (t === 'light' || t === 'dark') d.setAttribute('data-theme', t);
    else if (window.matchMedia('(prefers-color-scheme: light)').matches) d.setAttribute('data-theme', 'light');
  } catch (e) { /* storage unavailable */ }
})();
