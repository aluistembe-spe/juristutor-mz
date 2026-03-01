/**
 * JurisTutor MZ – Análise baseada EXCLUSIVAMENTE na legislação moçambicana.
 * Referências: Lei 23/2007 (Código do Trabalho), Lei 22/2019 (Lei da Família),
 * Lei 19/1997 (Lei de Terras), DUAT, usos e costumes locais.
 */
function inferirAreaDaLei(lower) {
  const has = (w) => lower.includes(w);

  if (
    has("despedimento") ||
    has("despedir") ||
    has("contrato de trabalho") ||
    has("salário") ||
    has("salario")
  ) {
    return "laboral";
  }

  if (
    has("casamento") ||
    has("união de facto") ||
    has("uniao de facto") ||
    has("herança") ||
    has("heranca") ||
    has("sucessão") ||
    has("sucessao")
  ) {
    return "familia";
  }

  if (has("duat") || has("terra") || has("terras") || has("parcela") || has("concessão") || has("concessao")) {
    return "terra";
  }

  if (
    has("crime") ||
    has("pena") ||
    has("prisão") ||
    has("prisao") ||
    has("homicídio") ||
    has("homicidio") ||
    has("furto")
  ) {
    return "penal";
  }

  if (has("processo penal") || has("acusação") || has("acusacao") || has("instrução") || has("instrucao")) {
    return "processo_penal";
  }

  if (has("processo civil") || has("petição inicial") || has("peticao inicial") || has("execução") || has("execucao")) {
    return "processo_civil";
  }

  if (
    has("constituição") ||
    has("constituicao") ||
    has("direitos fundamentais") ||
    has("direitos humanos") ||
    has("liberdades") ||
    has("tribunal constitucional")
  ) {
    return "constitucional";
  }

  if (
    has("acto administrativo") ||
    has("ato administrativo") ||
    has("licença") ||
    has("licenca") ||
    has("alvará") ||
    has("alvara") ||
    has("concurso público") ||
    has("concurso publico")
  ) {
    return "administrativo";
  }

  if (has("contrato")) {
    return "contrato";
  }

  return "outro";
}

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

    const isPergunta =
      cleaned.includes("?") ||
      /^o que|^qual|^quais|^como|^quando|^por que|^porque/i.test(cleaned.trim());

    const palavras = cleaned.split(/\s+/).filter(Boolean);
    const nPalavras = palavras.length;
    const nCaracteres = cleaned.length;
    const nFrases = cleaned
      .split(/[.!?]+/)
      .filter((s) => s.trim().length > 0).length;

    const alertas = [];
    const sugestoesGerais = [];

    const area = !tipo || tipo === "outro" ? inferirAreaDaLei(lower) : tipo;

    switch (area) {
      case "laboral": {
        // Lei 23/2007 – Código do Trabalho de Moçambique
        if (
          lower.includes("despedimento") ||
          lower.includes("despedir") ||
          lower.includes("rescisão") ||
          lower.includes("rescisao")
        ) {
          alertas.push(
            "Verifique se o despedimento cumpre o Código do Trabalho (Lei 23/2007): justa causa, extinção do posto, inadaptação ou colectivo. Despedimento injusto dá direito a indemnização de 45 dias de salário por ano de serviço."
          );
        }
        if (lower.includes("indemnização") || lower.includes("indemnizacao")) {
          alertas.push(
            "Confirme o cálculo conforme Lei 23/2007: 30/15/5 dias por ano conforme escalão salarial, ou 45 dias em caso de despedimento injusto."
          );
        }
        if (lower.includes("aviso prévio") || lower.includes("aviso previo")) {
          alertas.push(
            "O aviso prévio é obrigatório nos termos do Código do Trabalho moçambicano. Verifique prazos e forma de comunicação."
          );
        }
        if (lower.includes("férias") || lower.includes("ferias")) {
          alertas.push(
            "As férias não gozadas devem ser pagas à cessação do contrato, nos termos da Lei 23/2007."
          );
        }
        if (lower.includes("renúncia") || lower.includes("renuncia")) {
          alertas.push(
            "A renúncia de direitos indisponíveis é nula nos termos do Código do Trabalho moçambicano."
          );
        }
        sugestoesGerais.push(
          "Confronte as cláusulas com a Lei 23/2007 (Código do Trabalho) e instrumentos de regulamentação colectiva aplicáveis em Moçambique."
        );
        sugestoesGerais.push(
          "Verifique salário, horário, férias, segurança social e forma de cessação conforme a legislação moçambicana."
        );
        break;
      }

      case "familia": {
        // Lei 22/2019 – Lei da Família de Moçambique
        if (
          lower.includes("casamento") ||
          lower.includes("união de facto") ||
          lower.includes("uniao de facto")
        ) {
          alertas.push(
            "A Lei 22/2019 define casamento e união de facto. Confirme se os requisitos e efeitos patrimoniais estão em conformidade."
          );
        }
        if (lower.includes("herança") || lower.includes("heranca") || lower.includes("sucessão") || lower.includes("sucessao")) {
          alertas.push(
            "A Lei da Família moçambicana reconhece usos e costumes locais em matéria de herança, desde que não contrariem a Constituição ou a Lei."
          );
        }
        if (lower.includes("menor") || lower.includes("criança") || lower.includes("crianca")) {
          alertas.push(
            "A Lei 22/2019 protege o superior interesse da criança. Todas as disposições devem ser interpretadas nesse sentido."
          );
        }
        sugestoesGerais.push(
          "Verifique se o texto respeita a Lei 22/2019 (Lei da Família) e o superior interesse da criança."
        );
        sugestoesGerais.push(
          "Confirme se há requisitos de homologação judicial ou registo civil quando exigidos pela lei moçambicana."
        );
        break;
      }

      case "terra": {
        // Lei 19/1997 – Lei de Terras de Moçambique, DUAT
        if (lower.includes("duat") || lower.includes("terra") || lower.includes("terras")) {
          alertas.push(
            "O DUAT (Direito de Uso e Aproveitamento da Terra) é o título previsto na Lei 19/1997. O Estado é proprietário; o DUAT concede direitos de uso e aproveitamento."
          );
        }
        if (
          lower.includes("comunidade") ||
          lower.includes("comunidades locais") ||
          lower.includes("delimitação") ||
          lower.includes("delimitacao")
        ) {
          alertas.push(
            "A Lei de Terras moçambicana reconhece direitos fundiários às comunidades locais e práticas costumeiras. Verifique delimitação e consulta."
          );
        }
        sugestoesGerais.push(
          "Confronte com a Lei 19/1997 (Lei de Terras) e o Regulamento da Lei de Terras. Verifique DUAT e direitos das comunidades locais."
        );
        sugestoesGerais.push(
          "Confirme se a comunidade ou terceiros afectados foram consultados, conforme exigido pela legislação moçambicana."
        );
        break;
      }

      case "contrato": {
        if (lower.includes("multa") || lower.includes("cláusula penal") || lower.includes("clausula penal")) {
          alertas.push(
            "Em Moçambique, as cláusulas penais excessivas ou unilaterais podem ser reduzidas pelo tribunal. Verifique equilíbrio entre as partes."
          );
        }
        if (lower.includes("renúncia") || lower.includes("renuncia")) {
          alertas.push(
            "A renúncia de direitos indisponíveis é nula. Confirme se não há cláusulas que violem a ordem pública moçambicana."
          );
        }
        sugestoesGerais.push(
          "Confirme se objeto, preço, prazos e garantias estão definidos de forma precisa, em conformidade com a legislação moçambicana."
        );
        sugestoesGerais.push(
          "Avalie se as obrigações das partes estão equilibradas e se o contrato respeita a ordem pública de Moçambique."
        );
        break;
      }

      case "penal": {
        if (lower.includes("prisão preventiva") || lower.includes("prisao preventiva")) {
          alertas.push(
            "A prisão preventiva em Moçambique é medida excepcional prevista no Código de Processo Penal, devendo respeitar os prazos e fundamentos legais."
          );
        }
        if (lower.includes("homicídio") || lower.includes("homicidio")) {
          alertas.push(
            "O homicídio é crime grave previsto no Código Penal moçambicano, na parte dos crimes contra a vida."
          );
        }
        if (lower.includes("furto") || lower.includes("roubo")) {
          alertas.push(
            "Crimes contra o património (furto, roubo, etc.) são regulados no Código Penal moçambicano, com penas que variam consoante a gravidade."
          );
        }
        sugestoesGerais.push(
          "Identifique qual o tipo de crime em causa (contra a vida, património, integridade física, etc.) e consulte a parte especial do Código Penal moçambicano."
        );
        sugestoesGerais.push(
          "Avalie se estão reunidos os elementos típicos do crime (conduta, ilicitude, culpa) segundo a doutrina e jurisprudência moçambicanas."
        );
        break;
      }

      case "processo_penal": {
        sugestoesGerais.push(
          "Organize os factos pela sequência processual (denúncia, investigação, acusação, julgamento, recursos) à luz do Código de Processo Penal moçambicano."
        );
        sugestoesGerais.push(
          "Verifique prazos de prisão preventiva, instrução e recursos previstos no CPP, garantindo respeito às garantias de defesa."
        );
        break;
      }

      case "processo_civil": {
        sugestoesGerais.push(
          "Identifique se o texto corresponde a petição inicial, contestação, recurso ou outro acto à luz do Código de Processo Civil moçambicano."
        );
        sugestoesGerais.push(
          "Confirme requisitos formais (competência, valor, causa de pedir, pedido) exigidos pelo CPC para a peça processual em causa."
        );
        break;
      }

      case "constitucional": {
        sugestoesGerais.push(
          "Relacione o problema com os direitos, liberdades e garantias previstos na Constituição da República de Moçambique."
        );
        sugestoesGerais.push(
          "Analise se há violação de princípios constitucionais como legalidade, igualdade, dignidade da pessoa humana ou acesso à justiça."
        );
        break;
      }

      case "administrativo": {
        sugestoesGerais.push(
          "Verifique se o acto administrativo observado respeita os princípios de legalidade, imparcialidade e transparência do direito administrativo moçambicano."
        );
        sugestoesGerais.push(
          "Confirme prazos e meios de impugnação contenciosa junto do Tribunal Administrativo ou das autoridades hierarquicamente superiores."
        );
        break;
      }

      default: {
        sugestoesGerais.push(
          "Clarifique qual é o objetivo do documento e qual lei moçambicana se aplica (trabalho, família, terras, contratos)."
        );
        sugestoesGerais.push(
          "Liste as dúvidas concretas para discutir com um advogado ou jurista conhecedor da legislação de Moçambique."
        );
      }
    }

    // Alertas gerais (qualquer tipo)
    if (alertas.length === 0 && (lower.includes("prazo") || lower.includes("dias"))) {
      alertas.push(
        "Confirme se os prazos estão de acordo com a lei moçambicana aplicável (Código do Trabalho, Lei da Família, Lei de Terras, etc.)."
      );
    }

    const linhas = [];
    linhas.push("Resumo técnico (baseado na legislação de Moçambique):");
    linhas.push(`- ${nPalavras} palavra(s), ${nFrases} frase(s), ${nCaracteres} caracter(es).`);
    linhas.push("");

    if (alertas.length) {
      linhas.push("⚠️ Pontos de atenção:");
      alertas.forEach((a) => linhas.push(`- ${a}`));
      linhas.push("");
    } else {
      linhas.push(
        "Não foram encontrados alertas óbvios por palavras-chave. Isto NÃO substitui uma análise profissional da legislação moçambicana."
      );
      linhas.push("");
    }

    linhas.push("Próximos passos sugeridos:");
    sugestoesGerais.forEach((s) => linhas.push(`- ${s}`));
    linhas.push("");
    linhas.push("— JurisTutor MZ: soluções locais com base na lei de Moçambique —");

    return res.status(200).json({ resultado: linhas.join("\n") });
  } catch (err) {
    console.error("Erro no analisar.js:", err);
    return res.status(500).json({ error: "Erro interno do servidor" });
  }
}
