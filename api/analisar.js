import { GoogleGenerativeAI } from "https://esm.run/@google/generative-ai";

// Configurações e Identidade
const KEY = "AIzaSyAgRSFycP4yjrnJ1FRCZxUYxQRSFySVyYw"; 
const genAI = new GoogleGenerativeAI(KEY);

const btn = document.getElementById('main-action-btn');
const input = document.getElementById('legal-input');
const resultBox = document.getElementById('result-box');
const status = document.getElementById('status-display');
const contentArea = resultBox.querySelector('div');

async function executarConsultoria() {
    const userInput = input.value.trim();
    if (!userInput) return alert("Introduza os factos para análise.");

    // Interface em carregamento
    btn.disabled = true;
    btn.classList.add('opacity-50', 'cursor-not-allowed');
    btn.innerText = "FUNDAMENTANDO ARTIGOS...";
    status.innerText = "Consultando base de dados jurídica de Moçambique...";
    resultBox.classList.remove('hidden');
    contentArea.innerHTML = `<div class="flex gap-2"><span>⚡</span> <i>A analisar legislação vigente...</i></div>`;

    try {
        const model = genAI.getGenerativeModel({ 
            model: "gemini-1.5-flash",
            systemInstruction: `
                Você é o JurisTutor MZ. Sua autoridade é estritamente o Direito Moçambicano.
                REGRAS DE RESPOSTA:
                1. Use como base a CRM, Lei 13/2023 (Trabalho), Código Civil e Código Comercial de Moçambique.
                2. Se o assunto envolver Direito Internacional, você pode citar Tratados Ratificados por Moçambique.
                3. Formate a resposta como um Parecer Técnico Jurídico.
                4. CITE SEMPRE O NÚMERO DOS ARTIGOS.
                5. Use negrito para os artigos e leis mencionadas.
            `
        });

        const result = await model.generateContent(userInput);
        const response = await result.response;
        const text = response.text();

        // Formatação Dinâmica
        contentArea.innerHTML = text
            .replace(/\n/g, '<br>')
            .replace(/\*\*(.*?)\*\*/g, '<b>$1</b>')
            .replace(/\*(.*?)\*/g, '<i>$1</i>');

        status.innerText = "Análise Finalizada.";
        status.classList.replace('text-emerald-600', 'text-blue-600');

    } catch (error) {
        console.error("Erro Crítico:", error);
        contentArea.innerHTML = `<b class="text-red-600">ERRO DE CONEXÃO:</b> A API do Google não respondeu. Verifique sua chave ou limite de créditos.`;
        status.innerText = "Falha no processamento.";
    } finally {
        btn.disabled = false;
        btn.classList.remove('opacity-50', 'cursor-not-allowed');
        btn.innerText = "Gerar Parecer Jurídico";
    }
}

btn.addEventListener('click', executarConsultoria);
