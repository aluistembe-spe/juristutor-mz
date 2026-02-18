import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req, res) {
    // Configuração de CORS para permitir que o seu index.html comunique com a API
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(200).end();

    try {
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ 
            model: "gemini-1.5-flash",
            // INSTRUÇÃO RESTRITA: Define o comportamento focado apenas em Direito Moçambicano
            systemInstruction: `Você é o JurisTutor Moçambique, um especialista em Direito Moçambicano. 
            REGRAS DE RESPOSTA:
            1. Responda APENAS a questões ligadas ao Direito Moçambicano (CRM, Código Penal, Civil, Comercial, Trabalho, etc.).
            2. Se o utilizador perguntar algo fora do âmbito jurídico ou de outros países, responda educadamente: "Como seu tutor jurídico moçambicano, estou limitado a analisar apenas questões ligadas ao ordenamento jurídico de Moçambique."
            3. Cite sempre os artigos da lei moçambicana vigente para fundamentar as suas respostas.`
        });

        const { prompt } = req.body;
        if (!prompt) return res.status(400).json({ error: 'O campo de texto está vazio.' });

        const result = await model.generateContent(prompt);
        const response = await result.response;
        
        return res.status(200).json({ text: response.text() });
    } catch (error) {
        console.error("Erro na API:", error);
        return res.status(500).json({ error: "Erro interno no servidor." });
    }
}
