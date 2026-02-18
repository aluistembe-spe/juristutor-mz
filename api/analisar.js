import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req, res) {
    // Permite que o teu index.html fale com este servidor
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(200).end();

    try {
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ 
            model: "gemini-1.5-flash",
            // Este é o prompt de sistema que garante o foco apenas em Direito
            systemInstruction: `Você é o JurisTutor Moçambique, um Professor de Direito especializado no ordenamento jurídico moçambicano. 
            REGRAS DE RESPOSTA:
            1. Responda APENAS a questões sobre Direito Moçambicano (CRM, Códigos Penal, Civil, Comercial, Família, Trabalho, etc.).
            2. Se o usuário perguntar algo fora do Direito, diga: "Como tutor jurídico moçambicano, foco-me exclusivamente no Direito de Moçambique."
            3. Cite sempre os artigos das leis vigentes em Moçambique.`
        });

        // Lê o texto que vem do teu site
        const prompt = req.body && req.body.prompt;
        if (!prompt) return res.status(400).json({ error: 'Nenhum texto foi enviado.' });

        const result = await model.generateContent(prompt);
        const response = await result.response;
        
        return res.status(200).json({ text: response.text() });
    } catch (error) {
        return res.status(500).json({ error: "Falha na conexão com a IA.", details: error.message });
    }
}
