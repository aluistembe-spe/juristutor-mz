import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req, res) {
    // Configuração de CORS para permitir que o frontend fale com o backend
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(200).end();

    if (req.method === 'GET') {
        return res.status(200).json({ message: "JurisTutor MZ Online" });
    }

    try {
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) throw new Error("GEMINI_API_KEY não configurada.");

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ 
            model: "gemini-1.5-flash",
            systemInstruction: "Você é o JurisTutor Moçambique, especialista em Direito Moçambicano. Cite sempre artigos da lei nacional (CRM, Código Civil, Código Penal, Lei do Trabalho 13/2023)."
        });

        const { prompt } = req.body;
        if (!prompt) return res.status(400).json({ error: "Prompt vazio" });

        const result = await model.generateContent(prompt);
        const text = result.response.text();

        return res.status(200).json({ text });
        
    } catch (error) {
        console.error("ERRO NO SERVIDOR:", error.message);
        return res.status(500).json({ error: "Erro na análise jurídica", details: error.message });
    }
}
