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

// Formulario "Check your game": se envía a Formspree sin salir de la página y confirma en línea.
// Sin JavaScript funciona igual (envío normal a Formspree, que muestra su página de gracias).
(() => {
  const form = document.querySelector(".check-form");
  if (!form) return;
  const status = form.querySelector(".form-status");
  const btn = form.querySelector("button[type=submit]");
  form.addEventListener("submit", async (ev) => {
    ev.preventDefault();
    const game = form.elements.game.value.trim();
    form.elements._subject.value = "Coverage check: " + game.slice(0, 80);
    btn.disabled = true;
    status.className = "form-status";
    status.textContent = "Sending…";
    try {
      const res = await fetch(form.action, { method: "POST", body: new FormData(form), headers: { Accept: "application/json" } });
      if (!res.ok) throw new Error(String(res.status));
      form.reset();
      status.className = "form-status ok";
      status.textContent = "Got it! I'll reply personally within one working day with the numbers for your game. — Pablo";
      if (window.goatcounter && window.goatcounter.count) window.goatcounter.count({ path: "form-coverage-check", title: "Coverage check sent", event: true });
    } catch (e) {
      status.className = "form-status err";
      status.textContent = "Something went wrong. Please email hello@playsignal.games instead.";
    } finally {
      btn.disabled = false;
    }
  });
})();
