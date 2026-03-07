const SISTEMA_JURISTUTOR_MZ = `
Atua como **JurisTutor MZ**, uma IA de consultoria e estudo jurídico moçambicano de elite.

TAREFA OBRIGATÓRIA:
1. Sua primeira tarefa é CLASSIFICAR a matéria jurídica (Ex: Família, Sucessões, Penal).
2. Busque nos documentos do GitHub a legislação moçambicana correspondente e aplique a interpretação lógica e sistemática.
3. Se o caso envolver NEXO CAUSAL, utilize automaticamente o Código Civil moçambicano.

ESTRUTURA OBRIGATÓRIA:
1) Síntese fática; 2) Classificação; 3) Enquadramento (Base GitHub); 4) Hermenêutica; 5) Análise aplicada (Nexo Causal se necessário); 6) Conclusão; 7) Avisos.
`;

const ASSINATURA_FIXA = `
Todos os direitos reservados a Luís Filipe dos Santos Tembe Júnior.
Doações: E-Mola: 860420733 | BIM (NIB): 1099450284
`;

// Função para buscar legislação no seu GitHub
async function buscarLegislacaoNoGithub(caminhoArquivo) {
    const GITHUB_TOKEN = process.env.GITHUB_TOKEN; // Configure esta variável na Vercel
    const REPO_OWNER = "SEU_USUARIO_GITHUB"; 
    const REPO_NAME = "NOME_DO_REPOSITORIO";

    try {
        const response = await fetch(
            `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${caminhoArquivo}`,
            {
                headers: {
                    Authorization: `token ${GITHUB_TOKEN}`,
                    Accept: "application/vnd.github.v3.raw",
                },
            }
        );
        return response.ok ? await response.text() : "Legislação específica não encontrada no repositório.";
    } catch (err) {
        return "Erro ao acessar base de dados do GitHub.";
    }
}

module.exports = async (req, res) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");

    if (req.method === "OPTIONS") return res.status(200).end();

    try {
        const { GoogleGenerativeAI } = await import("@google/generative-ai");
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash", systemInstruction: SISTEMA_JURISTUTOR_MZ });

        const body = req.body || {};
        const casoEnviado = body.prompt || body.texto || "";

        // 1. Classificação rápida para decidir qual arquivo buscar
        const classificacaoResult = await model.generateContent(`Classifique apenas a matéria deste caso em uma palavra (Ex: Civil, Penal, Familia): ${casoEnviado}`);
        const materia = (await classificacaoResult.response).text().trim().toLowerCase();

        // 2. Busca o conteúdo no GitHub (Ex: arquivos com nome penal.txt, civil.txt)
        const conteudoLegal = await buscarLegislacaoNoGithub(`legislacao/${materia}.txt`);

        // 3. Gera a análise final com o contexto da lei
        const promptFinal = `
        LEGISLAÇÃO RECUPERADA: ${conteudoLegal}
        CASO DO UTILIZADOR: ${casoEnviado}
        
        Realize a análise jurídica seguindo estritamente o protocolo JurisTutor MZ.
        `;

        const result = await model.generateContent(promptFinal);
        const textoModelo = (await result.response).text();

        return res.status(200).json({ 
            resultado: textoModelo.trim() + "\n\n" + ASSINATURA_FIXA 
        });
    } catch (error) {
        return res.status(500).json({ error: "Erro na análise." });
    }
};
