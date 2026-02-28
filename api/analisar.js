import { GoogleGenerativeAI } from "https://esm.run/@google/generative-ai";

// Use a sua chave aqui
const API_KEY = "AIzaSyAgRSFycP4yjrnJ1FRCZxUYxQRSFySVyYw"; 
const genAI = new GoogleGenerativeAI(API_KEY);

async function analisarAgora() {
  const input = document.getElementById('legal-input');
  const output = document.getElementById('result-box');
  const content = output?.querySelector('div');
  const btn = document.getElementById('main-action-btn');

  if (!input.value.trim()) return alert("Por favor, descreva o caso.");

  // Feedback visual imediato
  btn.innerText = "A PROCESSAR...";
  btn.disabled = true;
  output?.classList.remove('hidden');
  if (content) content.innerHTML = "<i>A consultar legislação moçambicana...</i>";

  try {
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash",
      systemInstruction: "Você é o JurisTutor MZ. Responda APENAS com base no Direito de Moçambique (CRM, Código Civil, Lei 13/2023). Casos de Direito Internacional com relação em Moçambique são permitidos. Cite artigos obrigatoriamente."
    });

    const result = await model.generateContent(input.value);
    const response = await result.response;
    const text = response.text();

    if (content) {
      // Converte o Markdown da IA para HTML básico
      content.innerHTML = text
        .replace(/\*\*(.*?)\*\*/g, '<b>$1</b>')
        .replace(/\n/g, '<br>');
    }
  } catch (error) {
    console.error("Erro detalhado:", error);
    if (content) content.innerHTML = "<b class='text-red-600'>Erro:</b> A ligação falhou. Verifique se a chave API é válida.";
  } finally {
    btn.innerText = "Gerar Parecer Jurídico";
    btn.disabled = false;
  }
}

// ESTA PARTE É CRUCIAL: Liga o botão à função quando a página carrega
window.addEventListener('DOMContentLoaded', () => {
  const botao = document.getElementById('main-action-btn');
  if (botao) {
    botao.onclick = analisarAgora;
    console.log("JurisTutor: Botão configurado com sucesso.");
  }
});

