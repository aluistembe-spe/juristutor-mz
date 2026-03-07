export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Método não permitido" });

  try {
    const { comentario, analise, pergunta, areaSelecionada } = req.body ?? {};

    if (!comentario) {
      return res.status(400).json({ error: "Campo 'comentario' é obrigatório." });
    }

    const payload = {
      comentario,
      analise,
      pergunta,
      areaSelecionada,
      timestamp: new Date().toISOString(),
      projeto: "JurisTutor MZ"
    };

    console.log("Relatório de Divergência Jurídica:", JSON.stringify(payload));
    return res.status(200).json({ ok: true });
  } catch (err) {
    return res.status(500).json({ error: "Erro interno do servidor" });
  }
}
