// api/analisar.js
import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req, res) {
    // 1. Bloquear métodos que não sejam POST para maior segurança
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Método não permitido. Use POST.' });
    }

    // 2. Verificar se a chave de API está configurada no ambiente
    if (!process.env.GEMINI_API_KEY) {
        return res.status(500).json({ error: 'Erro de configuração: GEMINI_API_KEY não encontrada no Vercel.' });
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

    // Configuramos o modelo e as instruções de sistema focadas no Direito Moçambicano
    const model = genAI.getGenerativeModel({ 
        model: "gemini-1.5-flash",
        systemInstruction: `Você é um Professor de Direito de Moçambique especialista em CRM, Código Civil e Processo Penal. 
        Sua missão é ajudar alunos a resolver casos práticos de forma rigorosa e didática. 
        REGRAS:
        1. Use SEMPRE a Constituição da República de Moçambique (CRM), Código Civil e Código de Processo Penal Moçambicano.
        2. Estrutura da resposta: 
           - I. Questão Jurídica (O que está em causa?)
           - II. Enquadramento Legal (Citação de Artigos específicos)
           - III. Resolução/Parecer (Aplicação da lei aos factos com fundamentação clara).
        3. Use um tom profissional e acadêmico.`
    });

    try {
        const { prompt } = req.body;
        
        // Validar se o utilizador enviou um texto
        if (!prompt) {
            return res.status(400).json({ error: 'O caso prático está vazio. Por favor, descreva os factos.' });
        }

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        
        // 3. Devolvemos a resposta processada para o index.html
        return res.status(200).json({ text: text });

    } catch (error) {
        console.error("Erro na API Gemini:", error);
        // Retornar o erro detalhado ajuda a identificar se é um problema de quota ou de chave
        return res.status(500).json({ 
            error: "Erro ao processar o caso jurídico.",
            details: error.message 
        });
    }
}
