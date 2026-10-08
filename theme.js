// Tema claro/oscuro: automático según el dispositivo; el botón fija la elección y se recuerda.
// Se carga en <head> (sin defer) para aplicar el tema antes de pintar y evitar un parpadeo.
(() => {
  const root = document.documentElement;
  const media = window.matchMedia("(prefers-color-scheme: dark)");
  let saved = null;
  try { saved = localStorage.getItem("ps-theme"); } catch (e) { /* almacenamiento bloqueado: modo automático */ }

  function apply() {
    if (saved === "light" || saved === "dark") root.dataset.theme = saved;
    else delete root.dataset.theme;
    root.dataset.resolved = saved || (media.matches ? "dark" : "light");
  }
  apply();
  media.addEventListener("change", () => { if (!saved) apply(); });

  document.addEventListener("DOMContentLoaded", () => {
    const btn = document.querySelector(".theme-toggle");
    if (!btn) return;
    btn.addEventListener("click", () => {
      saved = root.dataset.resolved === "dark" ? "light" : "dark";
      try { localStorage.setItem("ps-theme", saved); } catch (e) { /* solo para esta visita */ }
      apply();
    });
  });
})();
