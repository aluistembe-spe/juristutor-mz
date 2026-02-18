import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req, res) {
    // Configurações de segurança e acesso
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(200).end();

    try {
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ 
            model: "gemini-1.5-flash",
            systemInstruction: "Você é um Professor de Direito moçambicano. Analise casos apenas sobre o Direito de Moçambique, citando a CRM e leis vigentes."
        });

        // Esta linha lê o que vem do seu index.html
        const { prompt } = req.body; 
        
        if (!prompt) return res.status(400).json({ error: "O texto está vazio." });

        const result = await model.generateContent(prompt);
        return res.status(200).json({ text: result.response.text() });
        
    } catch (error) {
        return res.status(500).json({ error: "Erro de conexão", details: error.message });
    }
}
