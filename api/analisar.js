import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req, res) {
    // Configurações de CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    // Unificação da Lógica GET (Cron / Health Check)
    if (req.method === 'GET') {
        return res.status(200).json({
            status: "Ativo",
            message: "JurisTutor Moçambique: Verificação de rotina concluída."
        });
    }

    // Validação do Método POST para o Chat
    if (req.method !== 'POST') {
        return res.status(405).json({ error: "Método não permitido" });
    }

    try {
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ 
            model: "gemini-1.5-flash",
            systemInstruction: "Você é o JurisTutor Moçambique, especialista em Direito Moçambicano. Responda apenas questões jurídicas de Moçambique."
        });

        const { prompt } = req.body;
        if (!prompt) return res.status(400).json({ error: "Prompt vazio" });

        const result = await model.generateContent(prompt);
        return res.status(200).json({ text: result.response.text() });
        
    } catch (error) {
        return res.status(500).json({ error: "Erro na IA", details: error.message });
    }
}
