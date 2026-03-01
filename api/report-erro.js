export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método não permitido" });
  }

  try {
    const { comentario, analise, pergunta, areaSelecionada } = req.body ?? {};

    if (!comentario || typeof comentario !== "string") {
      return res
        .status(400)
        .json({ error: "Campo 'comentario' é obrigatório para reportar o erro." });
    }

    const payload = {
      comentario,
      analise: analise || "",
      pergunta: pergunta || "",
      areaSelecionada: areaSelecionada || "",
      userAgent: req.headers["user-agent"] || "",
      timestamp: new Date().toISOString(),
    };

    // Nesta fase guardamos apenas em log. Em produção,
    // este payload deve ser enviado para uma base de dados
    // ou fila de revisão por juristas moçambicanos.
    console.log("JurisTutor MZ - Reporte de erro jurídico:", JSON.stringify(payload));

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error("Erro em /api/report-erro:", err);
    return res.status(500).json({ error: "Erro interno do servidor" });
  }
}

