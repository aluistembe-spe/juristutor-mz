// api/analisar.js
import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req, res) {
  // O Vercel vai buscar a chave aqui (você vai configurar lá no painel deles)
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

  // Configuramos o modelo e as instruções de sistema (o contexto de Moçambique)
  const model = genAI.getGenerativeModel({ 
    model: "gemini-1.5-flash",
    systemInstruction: `Você é um Professor de Direito de Moçambique. 
    Sua missão é ajudar alunos a resolver casos práticos. 
    REGRAS:
    1. Use SEMPRE a Constituição da República de Moçambique (CRM), Código Civil e Código de Processo Penal Moçambicano.
    2. Estrutura da resposta: 
       - I. Questão Jurídica (O que está em causa?)
       - II. Enquadramento Legal (Artigos específicos)
       - III. Resolução/Parecer (Aplicação da lei aos factos).
    3. Use um tom profissional e didático.`
  });

  try {
    const { prompt } = req.body;
    const result = await model.generateContent(prompt);
    const response = await result.response;
    
    // Devolvemos a resposta da IA para o seu index.html
    res.status(200).json({ text: response.text() });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao processar o caso jurídico." });
  }
}
