import { GoogleGenerativeAI } from "@google/generative-ai";
export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    if (req.method === 'OPTIONS') return res.status(200).end();
    try {
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            return res.status(500).json({ error: "ERRO: GEMINI_API_KEY não encontrada nas variáveis da Vercel." });
        }
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ 
            model: "gemini-1.5-flash",
            systemInstruction: "Você é o JurisTutor Moçambique. Use apenas Direito Moçambicano. Se for um teste de sistema, responda: 'Sistema Online'."
        });

        const { prompt } = req.body;
        if (!prompt) return res.status(400).json({ error: "O prompt está vazio." });
        const result = await model.generateContent(prompt);
        const text = result.response.text();
        return res.status(200).json({ text });
    } catch (error) {
        console.error("Erro Interno JurisTutor:", error.message);
        return res.status(500).json({ 
            error: "Erro na IA", 
            details: error.message 
        });
    }
}
