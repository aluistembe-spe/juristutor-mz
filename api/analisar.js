import { GoogleGenerativeAI } from "https://esm.run/@google/generative-ai";

const API_KEY = "AIzaSyAgRSFycP4yjrnJ1FRCZxUYxQRSFySVyYw"; 
const genAI = new GoogleGenerativeAI(API_KEY);

async function analisarAgora() {
    const input = document.getElementById('legal-input');
    const output = document.getElementById('result-box');
    const content = output ? output.querySelector('div') : null;
    const btn = document.getElementById('main-action-btn');

    if (!input || !input.value.trim()) return alert("Por favor, descreva o caso.");

    // Feedback Visual
    btn.innerText = "A PROCESSAR...";
    btn.disabled = true;
    if (output) output.classList.remove('hidden');
    if (content) content.innerHTML = "<i>A consultar legislação moçambicana...</i>";

    try {
        const model = genAI.getGenerativeModel({ 
            model: "gemini-1.5-flash",
            systemInstruction: "Você é o JurisTutor MZ. Responda estritamente com base no Direito de Moçambique (CRM, Código Civil, Lei 13/2023). Casos de Direito Internacional são permitidos apenas se houver conexão com Moçambique. É obrigatório citar os artigos correspondentes."
        });

        const result = await model.generateContent(input.value);
        const response = await result.response;
        const text = response.text();

        if (content) {
            content.innerHTML = text
                .replace(/\*\*(.*?)\*\*/g, '<b>$1</b>') // Negrito
                .replace(/\n/g, '<br>'); // Quebra de linha
        }
    } catch (error) {
        console.error("Erro na API:", error);
        if (content) content.innerHTML = "<b style='color:red'>Erro:</b> Não foi possível conectar à IA. Verifique sua chave API no Google AI Studio.";
    } finally {
        btn.innerText = "Gerar Parecer Jurídico";
        btn.disabled = false;
    }
}

// Garante que o botão seja mapeado apenas após o HTML carregar
window.addEventListener('DOMContentLoaded', () => {
    const mainBtn = document.getElementById('main-action-btn');
    if (mainBtn) {
        mainBtn.addEventListener('click', analisarAgora);
    }
});
