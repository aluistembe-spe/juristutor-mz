// api/analisar.js
export default async function handler(req, res) {
  try {
    // Verifica se é POST
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Método não permitido" });
    }

    // Lê dados enviados
    const { texto } = req.body;
    if (!texto) {
      return res.status(400).json({ error: "Falta o campo 'texto'" });
    }

    // Exemplo: usar variável de ambiente
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: "API_KEY não configurada" });
    }

    // Aqui colocas a lógica de análise jurídica
    // Exemplo fictício:
    const resultado = `Analisando: ${texto} com chave ${apiKey.substring(0,5)}...`;

    return res.status(200).json({ resultado });
  } catch (err) {
    console.error("Erro no analisar.js:", err);
    return res.status(500).json({ error: "Erro interno do servidor" });
  }
}
