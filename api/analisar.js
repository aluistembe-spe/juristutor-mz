import { GoogleGenerativeAI } from "https://esm.run/@google/generative-ai";

// Sua chave de API configurada
const API_KEY = "AIzaSyAgRSFycP4yjrnJ1FRCZxUYxQRSFySVyYw"; 
const genAI = new GoogleGenerativeAI(API_KEY);

// Seletores dos elementos da interface
const btn = document.getElementById('btn-analisar') as HTMLButtonElement;
const input = document.getElementById('prompt-input') as HTMLTextAreaElement;
const resultBox = document.getElementById('resultado-container') as HTMLDivElement;
const status = document.getElementById('status-text') as HTMLParagraphElement;

async function processarDireito() {
  const prompt = input.value.trim();
  
  if (!prompt) {
    alert("Por favor, descreva o caso jurídico para que eu possa analisar.");
    return;
  }

  // Preparação da Interface (Feedback de carregamento)
  btn.disabled = true;
  btn.innerText = "CONSULTANDO LEGISLAÇÃO...";
  status.innerText = "Aguarde, o JurisTutor está a fundamentar a resposta...";
  resultBox.classList.remove('hidden');
  resultBox.innerHTML = `
    <div class="flex items-center gap-2 text-emerald-700 font-medium">
      <svg class="animate-spin h-5 w-5 text-emerald-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      Gerando parecer jurídico baseado na CRM e leis vigentes...
    </div>
  `;

  try {
    // Configuração do modelo com instruções de sistema rigorosas para Moçambique
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash",
      systemInstruction: "Você é o JurisTutor Moçambique. Responda APENAS com base no Direito de Moçambique. Utilize a Constituição da República (CRM), Código Civil, Lei do Trabalho (Lei 13/2023) e Código Comercial. É OBRIGATÓRIO citar os artigos correspondentes. Formate o texto com negritos nos artigos para facilitar a leitura. Seja formal e técnico."
    });

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const textoFinal = response.text()
      .replace(/\n/g, '<br>') // Converte quebras de linha para HTML
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>'); // Formata negritos

    // Exibição do Resultado
    resultBox.innerHTML = `
      <div class="border-l-4 border-emerald-500 pl-4 py-2">
        <h3 class="font-bold text-emerald-900 mb-2 uppercase text-xs tracking-widest">Parecer Técnico:</h3>
        <div class="text-gray-700 antialiased">${textoFinal}</div>
      </div>
    `;
    status.innerText = "Análise concluída com sucesso.";
    
  } catch (erro: any) {
    console.error("Erro na API:", erro);
    resultBox.innerHTML = `
      <div class="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
        <strong>Erro de Conexão:</strong> Não foi possível processar o pedido. 
        Verifique se a sua API Key está ativa ou se atingiu o limite de uso gratuito.
      </div>
    `;
    status.innerText = "Ocorreu um erro inesperado.";
  } finally {
    btn.disabled = false;
    btn.innerText = "ANALISAR CASO";
  }
}

// Evento de clique para iniciar a lógica
btn.addEventListener('click', processarDireito);
