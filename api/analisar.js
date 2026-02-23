import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(200).end();

    try {
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) return res.status(500).json({ error: "Configuração ausente: GEMINI_API_KEY." });

        const genAI = new GoogleGenerativeAI(apiKey);
        
        const model = genAI.getGenerativeModel({ 
            model: "gemini-1.5-flash",
            systemInstruction: `Você é o JurisTutor Moçambique.
            
            MISSÃO: Fornecer respostas jurídicas baseadas estritamente no ordenamento moçambicano vigente.
            
            REGRAS DE CONTEÚDO:
            1. NÃO invente caminhos de ficheiros ou links locais (ex: C:/leis/...).
            2. BASEIE-SE no conteúdo real das leis: CRM, Lei 13/2023 (Trabalho), Código Penal 2019, Código Civil, etc.
            3. JURISPRUDÊNCIA: Cite a orientação dos Tribunais Superiores de Moçambique (Supremo e Constitucional).
            4. PRECISÃO: Se o tema for novo (como a Lei 13/2023), garanta que a resposta reflete as mudanças atuais em relação à lei de 2007.
            5. LACUNAS: Use o Artigo 10 do Código Civil para fundamentar a integração de lacunas.
            
            ESTRUTURA:
            - Indicação da norma e artigos.
            - Resposta fundamentada ao caso.
            - Citação de jurisprudência/doutrina nacional se aplicável.`,
            generationConfig: {
                temperature: 0.1, // Máximo rigor, mínima "criatividade".
                topP: 0.95,
            }
        });

        const { prompt } = req.body;
        if (!prompt) return res.status(400).json({ error: "Prompt vazio." });

        // Força a busca interna por legislação moçambicana real
        const promptFinal = `Utilizando a legislação e jurisprudência real de Moçambique disponível online e em bases de dados jurídicas, responda: ${prompt}`;

        const result = await model.generateContent(promptFinal);
        const text = result.response.text();

        return res.status(200).json({ text });
        
    } catch (error) {
        return res.status(500).json({ error: "Erro na análise", details: error.message });
    }
}
