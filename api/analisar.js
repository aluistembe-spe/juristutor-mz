import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req, res) {
    // Configuração de CORS para permitir a comunicação com o index.html
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(200).end();

    try {
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ 
            model: "gemini-1.5-flash",
            systemInstruction: `Você é o JurisTutor Moçambique. Sua única função é analisar questões de DIREITO MOÇAMBICANO.
            REGRAS ESTRITAS:
            1. Responda apenas sobre leis, códigos (Penal, Civil, Família, Trabalho, etc.) e a Constituição de Moçambique (CRM).
            2. Se o usuário perguntar sobre QUALQUER outro assunto (culinária, outros países, tecnologia, etc.), responda: "Como tutor jurídico moçambicano, estou programado para responder apenas a questões ligadas ao Direito de Moçambique."
            3. Use uma linguagem técnica, porém didática, citando sempre os artigos relevantes.`
        });

        // Garantia de leitura do prompt enviado pelo index.html
        const prompt = req.body && req.body.prompt;
        if (!prompt) return res.status(400).json({ error: 'O caso prático está vazio.' });

        const result = await model.generateContent(prompt);
        const response = await result.response;
        
        return res.status(200).json({ text: response.text() });
    } catch (error) {
        console.error("Erro Juristutor:", error);
        return res.status(500).json({ error: "Erro interno", details: error.message });
    }
}
