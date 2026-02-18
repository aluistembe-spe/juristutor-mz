const { GoogleGenerativeAI } = require("@google/generative-ai");

module.exports = async (req, res) => {
    // Configurações de CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(200).end();

    try {
        // GARANTIA: Se o req.body não estiver definido, tentamos ler os dados brutos
        let body = req.body;
        if (typeof body === 'string') {
            body = JSON.parse(body);
        }

        const prompt = body.prompt || body.text; 
        if (!prompt) return res.status(400).json({ error: 'O caso prático está vazio no servidor.' });

        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ 
            model: "gemini-1.5-flash",
            systemInstruction: "Você é um Professor de Direito moçambicano. Analise o caso citando a CRM e leis de Moçambique."
        });

        const result = await model.generateContent(prompt);
        const response = await result.response;
        
        return res.status(200).json({ text: response.text() });
    } catch (error) {
        console.error("Erro Juristutor:", error);
        return res.status(500).json({ error: "Erro interno", details: error.message });
    }
};
