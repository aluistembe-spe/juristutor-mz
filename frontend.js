const entrada = document.getElementById("entrada");
const contador = document.getElementById("contador-caracteres");
const btn = document.getElementById("btnAnalisar");
const btnLabel = document.getElementById("btnLabel");
const btnSpinner = document.getElementById("btnSpinner");
const resultado = document.getElementById("resultado");
const mensagemErro = document.getElementById("mensagem-erro");
const tipoSelect = document.getElementById("tipo-documento");

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
