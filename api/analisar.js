export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método não permitido" });
  }

  try {
    const { texto, tipo } = req.body ?? {};

    if (!texto || typeof texto !== "string") {
      return res.status(400).json({ error: "Campo 'texto' inválido ou ausente" });
    }

    const cleaned = texto.replace(/\s+/g, " ").trim();
    const lower = cleaned.toLowerCase();

    const palavras = cleaned.split(/\s+/).filter(Boolean);
    const nPalavras = palavras.length;
    const nCaracteres = cleaned.length;
    const nFrases = cleaned
      .split(/[.!?]+/)
      .filter((s) => s.trim().length > 0).length;

    const alertas = [];

    if (lower.includes("renuncia") || lower.includes("renúncia")) {
      alertas.push("Verifique se não há renúncia de direitos que a lei considera indisponíveis.");
    }
    if (lower.includes("prazo") && lower.includes("dias")) {
      alertas.push("Confirme se os prazos estão de acordo com o Código do Trabalho ou Código Civil aplicável.");
    }
    if (lower.includes("rescisao") || lower.includes("rescisão") || lower.includes("desped")) {
      alertas.push("Analise se os requisitos para rescisão/despedimento estão descritos de forma clara e equilibrada.");
    }
    if (lower.includes("multa") || lower.includes("penalidade") || lower.includes("cláusula penal")) {
      alertas.push("Revise se as penalidades não são excessivas ou unilaterais.");
    }

    const sugestoesGerais = [];
    switch (tipo) {
      case "laboral":
        sugestoesGerais.push(
          "Confronte as cláusulas com o Código do Trabalho moçambicano e instrumentos de regulamentação colectiva."
        );
        sugestoesGerais.push(
          "Verifique se há referência a salário, horário, férias, segurança social e forma de cessação."
        );
        break;
      case "familia":
        sugestoesGerais.push("Verifique se o texto respeita o interesse superior de menores eventualmente envolvidos.");
        sugestoesGerais.push("Confirme se há requisitos de homologação judicial quando necessário.");
        break;
      case "contrato":
        sugestoesGerais.push("Confirme se objeto, preço, prazos e garantias estão definidos de forma precisa.");
        sugestoesGerais.push("Avalie se as obrigações das duas partes estão equilibradas.");
        break;
      case "terra":
        sugestoesGerais.push("Revise se há referência ao DUAT e às regras de uso e aproveitamento da terra.");
        sugestoesGerais.push("Confirme se a comunidade ou terceiros afetados foram considerados.");
        break;
      default:
        sugestoesGerais.push("Clarifique qual é o objetivo do documento (provar, regular, registar, etc.).");
        sugestoesGerais.push("Liste as dúvidas concretas para discutir com um profissional do direito.");
    }

    const linhas = [];
    linhas.push("Resumo técnico rápido:");
    linhas.push(`- ${nPalavras} palavra(s), ${nFrases} frase(s), ${nCaracteres} caracter(es).`);
    linhas.push("");

    if (alertas.length) {
      linhas.push("⚠️ Pontos de atenção encontrados:");
      alertas.forEach((a) => linhas.push(`- ${a}`));
      linhas.push("");
    } else {
      linhas.push(
        "Não foram encontrados alertas óbvios por palavras‑chave, mas isso NÃO substitui uma análise profissional."
      );
      linhas.push("");
    }

    linhas.push("Próximos passos sugeridos:");
    sugestoesGerais.forEach((s) => linhas.push(`- ${s}`));

    return res.status(200).json({ resultado: linhas.join("\n") });
  } catch (err) {
    console.error("Erro no analisar.js:", err);
    return res.status(500).json({ error: "Erro interno do servidor" });
  }
}
