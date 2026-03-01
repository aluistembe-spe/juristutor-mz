const entrada = document.getElementById("entrada");
const contador = document.getElementById("contador-caracteres");
const btn = document.getElementById("btnAnalisar");
const btnLabel = document.getElementById("btnLabel");
const btnSpinner = document.getElementById("btnSpinner");
const resultado = document.getElementById("resultado");
const mensagemErro = document.getElementById("mensagem-erro");
const tipoSelect = document.getElementById("tipo-documento");
const btnCopiar = document.getElementById("btnCopiar");
const btnReportar = document.getElementById("btnReportar");
const modalErro = document.getElementById("modal-erro");
const inputReport = document.getElementById("input-report");
const btnCancelarReport = document.getElementById("btnCancelarReport");
const btnEnviarReport = document.getElementById("btnEnviarReport");

const MAX_CHARS = 4000;

entrada.addEventListener("input", () => {
  const length = entrada.value.length;
  contador.textContent = `${length} caractere${length === 1 ? "" : "s"}`;

  if (length > MAX_CHARS) {
    mensagemErro.textContent = `Limite de ${MAX_CHARS} caracteres. Resuma o texto.`;
    mensagemErro.classList.remove("hidden");
  } else {
    mensagemErro.classList.add("hidden");
  }
});

async function analisar() {
  const texto = entrada.value.trim();
  const tipo = tipoSelect.value;

  if (!texto) {
    mensagemErro.textContent = "Por favor, insira um texto para análise.";
    mensagemErro.classList.remove("hidden");
    return;
  }

  if (texto.length > MAX_CHARS) {
    mensagemErro.textContent = `Limite de ${MAX_CHARS} caracteres. Resuma o texto.`;
    mensagemErro.classList.remove("hidden");
    return;
  }

  mensagemErro.classList.add("hidden");
  btn.disabled = true;
  btnLabel.textContent = "Analisando...";
  btnSpinner.classList.remove("hidden");

  try {
    const response = await fetch("/api/analisar", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ texto, tipo }),
    });

    const data = await response.json();

    if (response.ok) {
      resultado.textContent = data.resultado;
    } else {
      resultado.textContent = `Erro: ${data.error || "não foi possível analisar."}`;
    }
  } catch (err) {
    console.error("Erro no frontend:", err);
    resultado.textContent = "Erro inesperado. Verifique a ligação e tente novamente.";
  } finally {
    btn.disabled = false;
    btnLabel.textContent = "Analisar com base na lei MZ";
    btnSpinner.classList.add("hidden");
  }
}

btn.addEventListener("click", (e) => {
  e.preventDefault();
  analisar();
});

if (btnCopiar) {
  btnCopiar.addEventListener("click", async () => {
    const texto = (resultado.textContent || "").trim();
    if (!texto) {
      window.alert("Não há análise para copiar ainda.");
      return;
    }

    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(texto);
      } else {
        const area = document.createElement("textarea");
        area.value = texto;
        area.style.position = "fixed";
        area.style.left = "-9999px";
        document.body.appendChild(area);
        area.focus();
        area.select();
        document.execCommand("copy");
        document.body.removeChild(area);
      }
      window.alert("Análise copiada para a área de transferência.");
    } catch (err) {
      console.error("Erro ao copiar análise:", err);
      window.alert("Não foi possível copiar a análise.");
    }
  });
}

if (btnReportar && modalErro && inputReport && btnCancelarReport && btnEnviarReport) {
  const openModal = () => {
    const texto = (resultado.textContent || "").trim();
    if (!texto) {
      window.alert("Não há análise para reportar ainda.");
      return;
    }
    inputReport.value = "";
    modalErro.classList.remove("hidden");
  };

  const closeModal = () => {
    modalErro.classList.add("hidden");
  };

  btnReportar.addEventListener("click", openModal);
  btnCancelarReport.addEventListener("click", closeModal);

  btnEnviarReport.addEventListener("click", async () => {
    const comentario = inputReport.value.trim();
    if (!comentario) {
      window.alert("Por favor, descreva o erro jurídico antes de enviar.");
      return;
    }

    try {
      const response = await fetch("/api/report-erro", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          comentario,
          analise: (resultado.textContent || "").trim(),
          pergunta: entrada.value.trim(),
          areaSelecionada: tipoSelect.value,
        }),
      });

      if (!response.ok) {
        throw new Error("Falha ao enviar relatório");
      }

      closeModal();
      window.alert("Relatório enviado para revisão jurídica. Obrigado pela ajuda!");
    } catch (err) {
      console.error("Erro ao enviar relatório:", err);
      window.alert("Não foi possível enviar o relatório. Tente novamente mais tarde.");
    }
  });
}
