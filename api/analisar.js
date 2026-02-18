import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(200).end();

    // Lógica para o Cron Job (Método GET)
    if (req.method === 'GET') {
        return res.status(200).json({ message: "JurisTutor MZ: Verificação diária concluída." });
    }

    // Lógica para o Chat (Método POST)
    try {
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ 
            model: "gemini-1.5-flash",
            systemInstruction: "Você é o JurisTutor Moçambique. Analise casos estritamente sob o Direito Moçambicano."
        });
// Dentro do export default async function handler(req, res) {
if (req.method === 'GET') {
    return res.status(200).json({ 
        status: "Ativo", 
        message: "JurisTutor Moçambique: Verificação de rotina concluída." 
    });
}
        
        const { prompt } = req.body; // Recebe os dados do index.html
        if (!prompt) return res.status(400).json({ error: "Prompt vazio." });

        const result = await model.generateContent(prompt);
        return res.status(200).json({ text: result.response.text() });
        
    } catch (error) {
        return res.status(500).json({ error: "Erro de Servidor", details: error.message });
    }
}

