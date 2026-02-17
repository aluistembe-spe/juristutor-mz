const { GoogleGenerativeAI } = require("@google/generative-ai");

module.exports = async (req, res) => {
    // Configuração de CORS para permitir que o seu index.html fale com esta API
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    try {
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ 
            model: "gemini-1.5-flash",
            systemInstruction: "Você é um Professor de Direito Moçambicano. Responda com base na CRM e nos códigos vigentes em Moçambique."
        });

        const { prompt } = req.body;
        if (!prompt) return res.status(400).json({ error: 'O campo de texto está vazio.' });

        const result = await model.generateContent(prompt);
        const response = await result.response;
        
        // Retorno obrigatório como objeto com a propriedade "text"
        return res.status(200).json({ text: response.text() });
    } catch (error) {
        console.error("Erro na API:", error);
        return res.status(500).json({ error: "Erro interno no servidor.", details: error.message });
    }
};
