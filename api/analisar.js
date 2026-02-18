import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req, res) {
    // Configurações de CORS para o seu index.html
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(200).end();

    try {
        if (!process.env.GEMINI_API_KEY) {
            return res.status(500).json({ error: "Chave API não configurada na Vercel." });
        }

        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ 
            model: "gemini-1.5-flash",
            systemInstruction: "Você é o JurisTutor Moçambique. Analise casos APENAS sobre Direito Moçambicano. Se a pergunta não for jurídica ou for de outro país, recuse educadamente."
        });

        const { prompt } = req.body;
        if (!prompt) return res.status(400).json({ error: "O servidor não recebeu texto." });

        const result = await model.generateContent(prompt);
        return res.status(200).json({ text: result.response.text() });
        
    } catch (error) {
        // Isso fará o erro real aparecer no seu chat para sabermos o que falhou
        return res.status(500).json({ error: "Erro na IA", details: error.message });
    }
}
