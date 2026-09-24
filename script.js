// Footer copyright year — keeps "© <year> John Hepworth" current without
// a manual edit each January.
document.getElementById('year').textContent = new Date().getFullYear();

// Depth gauge — pops up once the middle of the viewport is below the
// hero's waterline and tracks depth for the current scroll position.
// Depth is linear with scroll: 0 m at the waterline to MAX_DEPTH at the
// bottom of the page, and the bar's marker moves by the same fraction.
(function () {
  var gauge = document.querySelector('.depth-gauge');
  if (!gauge) return;

  var valueEl = gauge.querySelector('.dg-value');
  var waves = document.querySelector('.wave-region');
  var MAX_DEPTH = 6000;

  function update() {
    ticking = false;
    var root = document.documentElement;
    var y = window.scrollY + root.clientHeight / 2;
    // Waterline: roughly where the back waves crest in the wave strip.
    var surface = waves.getBoundingClientRect().top + window.scrollY + waves.offsetHeight * 0.4;
    var bottom = root.scrollHeight - root.clientHeight / 2;
    gauge.classList.toggle('is-visible', y > surface);

    var p = Math.min(Math.max((y - surface) / Math.max(bottom - surface, 1), 0), 1);
    valueEl.textContent = Math.round(p * MAX_DEPTH).toLocaleString('en-US');
    gauge.style.setProperty('--p', p.toFixed(4));
  }

  var ticking = false;
  function schedule() {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(update);
    }
  }

  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', schedule);
  update();
})();
