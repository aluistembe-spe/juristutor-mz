import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req, res) {
    // Configuração de Headers para evitar bloqueios de CORS
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Método não permitido' });
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ 
        model: "gemini-1.5-flash",
        systemInstruction: "Você é um Professor de Direito moçambicano. Responda com base na CRM e códigos vigentes em Moçambique."
    });

    try {
        const { prompt } = req.body;
        if (!prompt) return res.status(400).json({ error: 'Prompt vazio' });

        const result = await model.generateContent(prompt);
        const response = await result.response;
        
        // Retorno obrigatório como objeto com a propriedade "text"
        return res.status(200).json({ text: response.text() });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Erro interno", details: error.message });
    }
}
