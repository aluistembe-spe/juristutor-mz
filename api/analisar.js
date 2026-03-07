const SISTEMA_JURISTUTOR_MZ = `
Atua como **JurisTutor MZ**, uma IA de consultoria e estudo jurídico moçambicano de elite.

TAREFA OBRIGATÓRIA:
1. Sempre que receber um caso, sua primeira tarefa é CLASSIFICAR a matéria jurídica (Ex: Família, Sucessões, Penal, Administrativo).
2. Busque nos documentos do GitHub a legislação moçambicana correspondente e aplique a interpretação lógica e sistemática.
3. Se o caso envolver NEXO CAUSAL, utilize automaticamente o Código Civil moçambicano para fundamentar a análise.

PERFIL E ESCOPO:
- Postura profissional, técnica e analítica, focada estritamente na ordem jurídica de Moçambique.
- Se a pergunta tratar de outro país, explique que sua especialidade é exclusiva de Moçambique.

ESTRUTURA OBRIGATÓRIA DA RESPOSTA:
1) **Síntese fática**
2) **Classificação da Matéria Jurídica** (Identificação clara do ramo do direito).
3) **Enquadramento jurídico e Base Legal** (Legislação moçambicana e busca documental).
4) **Hermenêutica jurídica** (Interpretação lógica e sistemática).
5) **Análise aplicada ao caso concreto** (Incluindo nexo causal via Código Civil, se aplicável).
6) **Conclusão e próximos passos**
7) **Limitações e avisos**

Siga estritamente estas ordens sem fazer alterações não pedidas.
`;
const ASSINATURA_FIXA = `
Todos os direitos reservados a Luís Filipe dos Santos Tembe Júnior.
Se desejar apoiar esta iniciativa, pode fazer uma doação via:

E-Mola: 860420733
BIM (NIB): 1099450284
`;

module.exports = async (req, res) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");

    if (req.method === "OPTIONS") return res.status(200).end();

    if (!process.env.GEMINI_API_KEY) {
        return res.status(500).json({ error: "Erro: GEMINI_API_KEY não configurada." });
    }

    try {
        const { GoogleGenerativeAI } = await import("@google/generative-ai");
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({
            model: "gemini-1.5-flash",
            systemInstruction: SISTEMA_JURISTUTOR_MZ,
        });

        const body = req.body || {};
        let promptBruto = body.prompt || body.texto || "";

        if (!promptBruto) {
            return res.status(400).json({ error: "O campo de texto está vazio." });
        }

        // Comando adicional injetado para garantir o cumprimento das instruções de classificação e nexo causal
        const promptFinal = `Analise o seguinte caso sob a legislação moçambicana, classificando a matéria e aplicando nexo causal pelo Código Civil se necessário:\n\n${promptBruto}`;

        const result = await model.generateContent(promptFinal);
        const response = await result.response;
        const textoModelo = response.text();

        const textoFinal = (textoModelo ? textoModelo.trim() : "Não foi possível gerar a análise.") + "\n\n" + ASSINATURA_FIXA;

        return res.status(200).json({ text: textoFinal, resultado: textoFinal });
    } catch (error) {
        return res.status(500).json({ error: "Erro interno", details: error.message });
    }
};
