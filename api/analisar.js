export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Método não permitido" });
    }

    const { texto } = req.body || {};
    if (!texto || typeof texto !== "string") {
      return res.status(400).json({ error: "Campo 'texto' inválido ou ausente" });
    }

    const resultado = texto.replace(/\s+/g, " ").trim();
    return res.status(200).json({ resultado }); // ✅ sempre JSON
  } catch (error) {
    console.error("Erro detalhado:", error);
    return res.status(500).json({ error: "Erro interno do servidor" }); // ✅ sempre JSON
  }
}
