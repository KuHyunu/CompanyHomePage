(() => {
  const root = document.querySelector('.vending-orbit');
  if (!root) return;
  const scene = root.querySelector('.vending-orbit-scene');
  const cards = [...root.querySelectorAll('.vending-orbit-card')];
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)');
  let angle = 0;
  let paused = reduceMotion.matches;
  let hovered = false;
  let focused = false;
  let visible = false;
  let previousTime;
  let radius = 0;
  const measure = () => { radius = Math.min(350, Math.max(60, scene.clientWidth / 2 - cards[0].offsetWidth / 2 - 16)); };
  const draw = () => {
    cards.forEach((card, index) => {
      const phase = angle + index * Math.PI * 2 / cards.length;
      const depth = (Math.cos(phase) + 1) / 2;
      const x = Math.sin(phase) * radius;
      const scale = .68 + depth * .32;
      card.style.transform = `translate3d(${x}px,${(1-depth)*-12}px,0) scale(${scale}) rotateY(${-Math.sin(phase)*14}deg)`;
      card.style.zIndex = String(Math.round(depth * 100));
      card.style.opacity = String(.25 + depth * .75);
      card.style.pointerEvents = depth < .25 ? 'none' : '';
    });
    root.dataset.rotation = String(angle);
  };
  const step = direction => {
    angle = Math.round(angle / (Math.PI / 2)) * (Math.PI / 2) + direction * Math.PI / 2;
    draw();
  };
  scene.addEventListener('pointerenter', event => { if (event.pointerType === 'mouse') hovered = true; });
  scene.addEventListener('pointerleave', () => { hovered = false; });
  scene.addEventListener('focusin', () => { focused = true; });
  scene.addEventListener('focusout', event => { focused = scene.contains(event.relatedTarget); });
  scene.addEventListener('keydown', event => {
    if (!['ArrowLeft','ArrowRight'].includes(event.key)) return;
    event.preventDefault(); step(event.key === 'ArrowRight' ? -1 : 1);
  });
  reduceMotion.addEventListener('change', event => { paused = event.matches; });
  new IntersectionObserver(entries => { visible = entries[0].isIntersecting; }, { rootMargin: '100px' }).observe(root);
  new ResizeObserver(() => { measure(); draw(); }).observe(scene);
  const animate = time => {
    const elapsed = previousTime === undefined ? 0 : Math.min(time - previousTime, 80);
    previousTime = time;
    if (visible && !document.hidden && !paused && !hovered && !focused) {
      angle = (angle + elapsed / 32000 * Math.PI * 2) % (Math.PI * 2); draw();
    }
    requestAnimationFrame(animate);
  };
  measure(); draw(); requestAnimationFrame(animate);
})();
