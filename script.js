// Parallax suave del fondo y aparición de secciones al hacer scroll.
(() => {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const els = document.querySelectorAll(".reveal");
  if (reduce || !("IntersectionObserver" in window)) {
    els.forEach((el) => el.classList.add("in"));
  } else {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
      });
    }, { threshold: 0.12 });
    els.forEach((el) => io.observe(el));
  }

  if (reduce) return;
  const blobs = [...document.querySelectorAll(".aurora .blob")];
  const speeds = [0.25, -0.18, 0.12];
  let ticking = false;
  window.addEventListener("scroll", () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const y = window.scrollY;
      blobs.forEach((b, i) => { b.style.transform = `translate3d(0, ${y * speeds[i]}px, 0)`; });
      ticking = false;
    });
  }, { passive: true });
})();

// "Copy address": alternativa al mailto para quien no tiene programa de correo configurado.
(() => {
  document.querySelectorAll(".copy-mail").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const mail = btn.dataset.mail;
      try {
        await navigator.clipboard.writeText(mail);
      } catch (e) {
        const t = document.createElement("textarea");
        t.value = mail; document.body.appendChild(t); t.select();
        try { document.execCommand("copy"); } catch (e2) { /* sin portapapeles: la dirección ya está visible */ }
        t.remove();
      }
      const old = btn.textContent;
      btn.textContent = "Copied!";
      setTimeout(() => { btn.textContent = old; }, 1600);
    });
  });
})();
