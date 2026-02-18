import { GoogleGenerativeAI } from "@google/generative-ai"; // Compatível com "type": "module"

export default async function handler(req, res) {
    // ... restante lógica de CORS e IA
}
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Resposta imediata para Preflight (CORS)
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    // Unificação da Lógica GET (Cron / Health Check)
    if (req.method === 'GET') {
        return res.status(200).json({ 
            status: "Ativo", 
            message: "JurisTutor Moçambique: Verificação de rotina concluída." 
        });
    }

    // Validação do Método POST para o Chat
    if (req.method !== 'POST') {
        return res.status(405).json({ error: "Método não permitido" });
    }

    try {
        // 1. Verificação da API KEY
        if (!process.env.GEMINI_API_KEY) {
            throw new Error("Variável de ambiente GEMINI_API_KEY não configurada.");
        }

        // 2. Extração segura do prompt
        // Garante que o body foi lido (Vercel faz o parse automático se o Header for application/json)
        const { prompt } = req.body; 
        
        if (!prompt || prompt.trim() === "") {
            return res.status(400).json({ error: "Prompt vazio ou inválido." });
        }

        // 3. Configuração do Gemini
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ 
            model: "gemini-1.5-flash",
            systemInstruction: "Você é o JurisTutor Moçambique. Analise casos estritamente sob o Direito Moçambicano. Use terminologia jurídica local (ex: Código Civil, CRM, etc)."
        });

        // 4. Execução da IA
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        return res.status(200).json({ text });

    } catch (error) {
        console.error("Erro na API JurisTutor:", error);
        return res.status(500).json({ 
            error: "Erro de Servidor", 
            details: error.message 
        });
    }
}


