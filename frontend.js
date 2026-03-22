document.getElementById("btnAnalisar").addEventListener("click", async () => {
  try {
    const texto = document.getElementById("entrada").value.trim();

    if (!texto) {
      document.getElementById("resultado").innerText = "Por favor, insira um texto.";
      return;
    }

    document.getElementById("resultado").innerText = "Analisando... por favor, aguarde.";
    const btn = document.getElementById("btnAnalisar");
    btn.disabled = true;
    btn.classList.add("opacity-50", "cursor-not-allowed");

    const response = await fetch("/api/analisar", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ texto })
    });

    const data = await response.json();

    if (response.ok) {
      document.getElementById("resultado").innerText = data.resultado;
    } else {
      document.getElementById("resultado").innerText = `Erro: ${data.error}`;
    }
  } catch (err) {
    console.error("Erro no frontend:", err);
    document.getElementById("resultado").innerText = "Erro inesperado no cliente.";
  } finally {
    const btn = document.getElementById("btnAnalisar");
    btn.disabled = false;
    btn.classList.remove("opacity-50", "cursor-not-allowed");
  }
});
