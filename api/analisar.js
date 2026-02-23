import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(200).end();

    try {
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) return res.status(500).json({ error: "Chave API não configurada." });

        // Inicializamos a API sem especificar a versão no construtor para evitar o 404
        const genAI = new GoogleGenerativeAI(apiKey);
        
        // Selecionamos o modelo. O SDK usará a rota estável v1 por padrão.
        const model = genAI.getGenerativeModel({ 
            model: "gemini-1.5-flash",
            systemInstruction: "Você é o JurisTutor Moçambique. Responda apenas sobre Direito de Moçambique. Use a CRM 2018, Código Civil e a Lei 13/2023. Não invente links ou ficheiros."
        });

        const { prompt } = req.body;
        if (!prompt) return res.status(400).json({ error: "Prompt vazio." });

        // Chamada direta para o modelo estável
        const result = await model.generateContent(prompt);
        const text = result.response.text();

        return res.status(200).json({ text });
        
    } catch (error) {
        console.error("Erro na API Gemini:", error);
        return res.status(500).json({ 
            error: "Erro de Conexão", 
            details: error.message 
        });
    }
}
