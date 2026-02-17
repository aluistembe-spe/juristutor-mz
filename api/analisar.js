// api/analisar.js
const { GoogleGenerativeAI } = require("@google/generative-ai");

module.exports = async (req, res) => {
    // Configuração de Headers para permitir a comunicação
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Método não permitido' });
    }

    try {
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ 
            model: "gemini-1.5-flash",
            systemInstruction: "Você é um Professor de Direito moçambicano. Analise casos práticos citando a CRM e os Códigos Penais/Civis de Moçambique."
        });

        const { prompt } = req.body;
        if (!prompt) return res.status(400).json({ error: 'Envie um caso prático.' });

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        // Resposta exata que o seu index.html espera
        return res.status(200).json({ text: text });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Erro na IA", details: error.message });
    }
};
