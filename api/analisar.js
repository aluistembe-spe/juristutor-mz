import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(200).end();

    try {
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) return res.status(500).json({ error: "Chave não configurada na Vercel." });

        // Inicialização robusta
        const genAI = new GoogleGenerativeAI(apiKey);
        
        // Chamada direta ao modelo estável (evita o erro 404 do v1beta)
        const model = genAI.getGenerativeModel({ 
            model: "gemini-1.5-flash",
            systemInstruction: "Você é o JurisTutor Moçambique. Use apenas Direito Moçambicano real (CRM, Código Civil, Lei 13/2023). Cite artigos."
        });

        const { prompt } = req.body;
        const result = await model.generateContent(prompt);
        const response = await result.response;
        
        return res.status(200).json({ text: response.text() });
        
    } catch (error) {
        // Retorna o erro real para sabermos se é a chave (400) ou o modelo (404)
        return res.status(500).json({ error: "Erro na IA", details: error.message });
    }
}
