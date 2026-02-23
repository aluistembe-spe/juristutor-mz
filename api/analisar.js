import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(200).end();

    try {
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            return res.status(500).json({ error: "ERRO: GEMINI_API_KEY não configurada na Vercel." });
        }

        const genAI = new GoogleGenerativeAI(apiKey);
        
        // Configuração do "Cérebro" Jurídico Moçambicano
        const model = genAI.getGenerativeModel({ 
            model: "gemini-1.5-flash",
            systemInstruction: `Você é o JurisTutor Moçambique, uma IA especializada exclusivamente no Ordenamento Jurídico Moçambicano. 

            SUAS REGRAS DE OURO:
            1. FUNDAMENTAÇÃO: Use sempre a CRM (2018), Código Civil, Código Penal (2019) e a NOVA Lei do Trabalho (Lei 13/2023).
            2. CASOS PRÁTICOS: Para casos práticos, use o método SILP (Situação, Institutos, Lei, Parecer).
            3. JURISPRUDÊNCIA: Mencione sempre que possível entendimentos do Tribunal Supremo e do Conselho Constitucional de Moçambique.
            4. LACUNAS: Se houver lacuna na lei, fundamente com base no Artigo 10 do Código Civil (Integração de lacunas).
            5. PROIBIÇÃO: Não use leis de Portugal ou Brasil. Se o utilizador perguntar algo fora do contexto de Moçambique, redirecione-o para a lei nacional.
            
            ESTRUTURA DE RESPOSTA:
            - Enquadramento Legal (Artigos específicos).
            - Análise Doutrinária/Jurisprudencial.
            - Conclusão Prática Sugerida.`,
            generationConfig: {
                temperature: 0.2, // Mantém a resposta técnica e evita "alucinações"
                topP: 0.95,
            }
        });

        const { prompt } = req.body;
        if (!prompt) return res.status(400).json({ error: "O prompt está vazio." });

        // Adiciona um reforço no prompt do usuário para garantir o foco em MZ
        const promptReforcado = `Analise tecnicamente segundo o Direito de Moçambique: ${prompt}`;

        const result = await model.generateContent(promptReforcado);
        const text = result.response.text();

        return res.status(200).json({ text });
        
    } catch (error) {
        console.error("Erro Interno JurisTutor:", error.message);
        return res.status(500).json({ 
            error: "Erro na análise jurídica", 
            details: error.message 
        });
    }
}
