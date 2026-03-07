document.getElementById("btnAnalisar").addEventListener("click", async () => {
  try {
    const texto = document.getElementById("entrada").value.trim();

    if (!texto) {
      document.getElementById("resultado").innerText = "Por favor, insira um texto para análise jurídica.";
      return;
    }

    // Indica ao usuário que a inteligência está classificando e consultando a legislação
    document.getElementById("resultado").innerText = "Classificando matéria e consultando legislação moçambicana...";

    const response = await fetch("/api/analisar", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        texto: texto,
        // O backend usará estes parâmetros para aplicar a interpretação lógica e sistemática
        contexto: "Moçambique" 
      })
    });

    const data = await response.json();

    if (response.ok) {
      // Exibe o resultado contendo a classificação, base legal e nexo causal (se aplicável)
      document.getElementById("resultado").innerText = data.resultado;
    } else {
      document.getElementById("resultado").innerText = `Erro na análise: ${data.error}`;
    }
  } catch (err) {
    console.error("Erro no fluxo do frontend:", err);
    document.getElementById("resultado").innerText = "Erro inesperado ao processar o caso.";
  }
});
