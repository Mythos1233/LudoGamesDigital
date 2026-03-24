document.addEventListener("DOMContentLoaded", function () {

  // ─── VLibras ──────────────────────────────────────────────────
  if (window.VLibras) {
    new window.VLibras.Widget("https://vlibras.gov.br/app");
  }

  // ─── Narração por voz ─────────────────────────────────────────
  const vozSuportada = "speechSynthesis" in window;

  const legendaBox   = document.querySelector(".legenda-box");
  const textoLegenda = document.getElementById("texto-legenda");

  function falarTexto(e) {
    if (!vozSuportada) return;

    window.speechSynthesis.cancel();

    const texto = e.currentTarget.innerText.trim();
    if (!texto) return;

    const mensagem = new SpeechSynthesisUtterance(texto);
    mensagem.lang = "pt-BR";

    textoLegenda.innerText = texto;
    legendaBox.classList.add("ativa");

    mensagem.onend = function () {
      legendaBox.classList.remove("ativa");
    };

    mensagem.onerror = function () {
      legendaBox.classList.remove("ativa");
    };

    window.speechSynthesis.speak(mensagem);
  }

  // Leitura ao passar o mouse (menu)
  document.querySelectorAll(".narra-texto").forEach(function (el) {
    el.addEventListener("mouseenter", falarTexto);
  });

  // Leitura ao clicar
  document.querySelectorAll(".leitura").forEach(function (el) {
    el.addEventListener("click", falarTexto);
  });

  // ─── Cursor personalizado ──────────────────────────────────────
  // Usa left/top (igual ao original) — transform causava desalinhamento
  const cursor = document.getElementById("cursor-personalizado");

  if (cursor) {
    document.addEventListener("mousemove", function (e) {
      cursor.style.left = (e.clientX - 40) + "px";
      cursor.style.top  = (e.clientY - 40) + "px";
    });
  }

  // ─── Gradiente do header conforme scroll ───────────────────────
  const layers = [
    { el: document.getElementById("azul"),   threshold: 0    },
    { el: document.getElementById("verde"),  threshold: 750  },
    { el: document.getElementById("marrom"), threshold: 1850 },
  ];

  // Thresholds dinâmicos — recalcula se o layout mudar
  function recalcularThresholds() {
    const alturaDoc = document.documentElement.scrollHeight;
    if (alturaDoc > 1000) {
      layers[1].threshold = alturaDoc * 0.30;
      layers[2].threshold = alturaDoc * 0.65;
    }
  }

  recalcularThresholds();
  window.addEventListener("resize", recalcularThresholds);

  // Scroll com requestAnimationFrame para não travar a página
  let rafAgendado = false;

  function atualizarGradiente() {
    const y = window.scrollY;
    let ativa = 0;

    layers.forEach(function (layer, i) {
      if (y >= layer.threshold) ativa = i;
    });

    layers.forEach(function (layer, i) {
      layer.el.style.opacity = i === ativa ? "1" : "0";
    });

    rafAgendado = false;
  }

  window.addEventListener("scroll", function () {
    if (!rafAgendado) {
      rafAgendado = true;
      requestAnimationFrame(atualizarGradiente);
    }
  }, { passive: true });

});