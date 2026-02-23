import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req, res) {
    // Configurações de CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(200).end();

    if (req.method === 'GET') {
        return res.status(200).json({ status: "Ativo", message: "JurisTutor MZ Online" });
    }

    try {
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ 
            model: "gemini-1.5-flash",
            systemInstruction: `Você é o JurisTutor Moçambique, uma IA de elite especializada em Direito Moçambicano.
            
            Sua missão é auxiliar estudantes a resolver casos práticos e colmatar lacunas na lei (Art. 10 do Código Civil).
            
            REGRAS DE OURO:
            1. Use APENAS leis de Moçambique: CRM, Código Civil, Código Penal (2019), Lei do Trabalho (Lei 13/2023), Código de Processo Civil.
            2. Estrutura da Resposta: 
               - ENQUADRAMENTO: Liste os artigos aplicáveis.
               - ANÁLISE: Aplique a lei aos factos (subsunção).
               - JURISPRUDÊNCIA: Mencione o entendimento comum dos tribunais superiores moçambicanos se relevante.
               - CONCLUSÃO: Resposta direta ao problema.
            3. Se houver lacuna, explique como integrar (analogia ou princípios gerais).
            4. NUNCA cite leis de outros países (Portugal/Brasil).`,
            generationConfig: {
                temperature: 0.1,
                topP: 0.95,
                maxOutputTokens: 2500,
            }
        });

        const { prompt } = req.body;
        if (!prompt) return res.status(400).json({ error: "Prompt vazio" });

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        if (!text) throw new Error("A IA gerou uma resposta vazia.");

        return res.status(200).json({ text });
        
    } catch (error) {
        console.error("Erro na API:", error);
        return res.status(500).json({ error: "Erro no JurisTutor", details: error.message });
    }
}
