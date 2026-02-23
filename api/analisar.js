import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req, res) {
    // Configuração de CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(200).end();

    try {
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            return res.status(500).json({ error: "Chave API não configurada no ambiente Vercel." });
        }

        // Forçamos o uso da versão estável v1
        const genAI = new GoogleGenerativeAI(apiKey);
        
        const model = genAI.getGenerativeModel({ 
            model: "gemini-1.5-flash",
            // Instruções focadas no Direito Moçambicano
            systemInstruction: "Você é o JurisTutor Moçambique. Responda tecnicamente com base no Código Civil de Moçambique, Lei 13/2023 e CRM. Não use leis estrangeiras."
        });

        const { prompt } = req.body;
        if (!prompt) return res.status(400).json({ error: "O pedido está vazio." });

        // Gerar conteúdo
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        return res.status(200).json({ text });
        
    } catch (error) {
        console.error("Erro Crítico:", error.message);
        // Se a chave for inválida, o erro será capturado aqui de forma limpa
        return res.status(500).json({ 
            error: "Falha na comunicação com o servidor de IA", 
            details: error.message 
        });
    }
}
