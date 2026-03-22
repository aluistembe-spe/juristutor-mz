const { GoogleGenAI } = require('@google/genai');

// Inicia o SDK com a chave de API fornecida pela variável de ambiente GEMINI_API_KEY
const ai = new GoogleGenAI(); 

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { texto } = req.body;

    if (!texto) {
      return res.status(400).json({ error: 'O texto é obrigatório.' });
    }

    const prompt = `Você é o Juris Tutor MZ, um assistente especialista em Direito Moçambicano, profundamente conhecedor da Constituição da República de Moçambique de 2018, do Código Civil Moçambicano e demais legislações em vigor.
Seu objetivo é analisar textos legais, contratos, dúvidas jurídicas ou situações descritas pelo usuário exclusivamente sob a ótica do ordenamento jurídico de Moçambique.
Forneça uma análise clara, estruturada e fundamentada legalmente sempre que possível, citando os artigos e leis relevantes e explicando-os de forma muito didática. Formate sua resposta em Markdown.

Analise o seguinte texto:

"${texto}"`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    res.status(200).json({ resultado: response.text });
  } catch (error) {
    console.error('Erro na API do Gemini:', error);
    res.status(500).json({ error: 'Erro interno ao consultar o assistente jurídico. Verifique a chave de API e tente novamente.' });
  }
};
