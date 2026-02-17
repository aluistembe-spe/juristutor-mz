import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req, res) {
  // Verificação de segurança
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ 
    model: "gemini-1.5-flash",
    systemInstruction: "Você é um Professor de Direito de Moçambique especialista em CRM, Civil e Processual Penal." 
  });

  try {
    const { prompt } = req.body;
    const result = await model.generateContent(prompt);
    const response = await result.response;
    res.status(200).json({ text: response.text() });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}