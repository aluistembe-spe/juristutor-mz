const { GoogleGenerativeAI } = require("@google/generative-ai");

module.exports = async (req, res) => {
    // Configuração de CORS para permitir a comunicação com o index.html
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (!process.env.GEMINI_API_KEY) {
        return res.status(500).json({ error: "Erro: GEMINI_API_KEY não configurada na Vercel." });
    }

    try {
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ 
            model: "gemini-1.5-flash",
            systemInstruction: "Você é um Professor de Direito moçambicano. Analise casos práticos citando a CRM e os códigos vigentes em Moçambique."
        });

        const { prompt } = req.body;
        if (!prompt) return res.status(400).json({ error: 'O campo de texto está vazio.' });

        const result = await model.generateContent(prompt);
        const response = await result.response;
        
        return res.status(200).json({ text: response.text() });
    } catch (error) {
        console.error("Erro na API:", error);
        return res.status(500).json({ error: "Erro interno", details: error.message });
    }
};
