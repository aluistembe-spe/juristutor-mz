import { GoogleGenerativeAI } from "https://esm.run/@google/generative-ai";

// Chave de API fornecida
const API_KEY = "AIzaSyAgRSFycP4yjrnJ1FRCZxUYxQRSFySVyYw"; 
const genAI = new GoogleGenerativeAI(API_KEY);

async function analisarAgora() {
  const input = document.getElementById('legal-input');
  const output = document.getElementById('result-box');
  const content = output?.querySelector('div');
  const btn = document.getElementById('main-action-btn');

  if (!input.value.trim()) return alert("Por favor, descreva o caso.");

  // Feedback visual
  btn.innerText = "A PROCESSAR...";
  btn.disabled = true;
  output?.classList.remove('hidden');
  if (content) content.innerHTML = "<i>A consultar legislação moçambicana...</i>";

  try {
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash",
      systemInstruction: "Você é o JurisTutor MZ. Responda com base no Direito de Moçambique (CRM, Código Civil, Lei 13/2023). Permita respostas sobre Direito Internacional apenas quando houver relações ou implicações diretas com Moçambique. Cite artigos obrigatoriamente."
    });

    const result = await model.generateContent(input.value);
    const response = await result.response;
    const text = response.text();

    if (content) {
      content.innerHTML = text.replace(/\n/g, '<br>').replace(/\*\*(.*?)\*\*/g, '<b>$1</b>');
    }
  } catch (error) {
    console.error(error);
    if (content) content.innerHTML = "<b class='text-red-600'>Erro:</b> Falha na comunicação com a inteligência artificial. Verifique sua conexão ou chave de acesso.";
  } finally {
    btn.innerText = "Gerar Parecer Jurídico";
    btn.disabled = false;
  }
}

// Inicialização do evento
document.getElementById('main-action-btn')?.addEventListener('click', analisarAgora);
