import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método não permitido" });
  }

  try {
    const genAI = new GoogleGenerativeAI({ apiKey: process.env.GOOGLE_API_KEY });
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const result = await model.generateContent({
      contents: [
        { role: "system", parts: [{ text: "Você é o JurisTutor MZ. Responda APENAS com base no Direito de Moçambique (CRM, Código Civil, Lei 13/2023). Casos de Direito Internacional com relação em Moçambique são permitidos. Cite artigos obrigatoriamente." }] },
        { role: "user", parts: [{ text: req.body?.input || "Nenhum caso fornecido." }] }
      ]
    });

    res.status(200).json({ text: result.response.text() });
  } catch (error) {
    console.error("Erro detalhado:", error);
    res.status(500).json({ error: "Erro ao gerar parecer." });
  }
}
