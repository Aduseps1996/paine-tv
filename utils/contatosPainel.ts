import type { ConfiguracoesPainel, ContatoPainel } from "@/types/painel"

export const CONTATO_PLANTAO_ID = "plantao-juridico"

export const CONTATOS_PADRAO: ContatoPainel[] = [
    {
        id: "recepcao",
        titulo: "Recepção",
        tipo: "telefone",
        valores: ["(81) 3423-0540", "(81) 3139-8501"],
        observacao: "Atendimento geral",
        ativo: true,
        mostrarNoBanner: true,
        ordem: 1
    },
    {
        id: CONTATO_PLANTAO_ID,
        titulo: "Plantão Judicial",
        tipo: "whatsapp",
        valores: ["(81) 99838-2275"],
        observacao: "Sábados, domingos e feriados",
        ativo: true,
        mostrarNoBanner: true,
        ordem: 2
    },
    {
        id: "servico-social",
        titulo: "Serviço Social",
        tipo: "whatsapp",
        valores: ["(81) 99422-6197"],
        ativo: true,
        mostrarNoBanner: true,
        ordem: 3
    },
    {
        id: "juridico",
        titulo: "Jurídico",
        tipo: "whatsapp",
        valores: ["(81) 99690-2753"],
        ativo: true,
        mostrarNoBanner: true,
        ordem: 4
    }
]

export function normalizarContatos(
    contatos?: ContatoPainel[]
): ContatoPainel[] {
    const origem =
        Array.isArray(contatos) && contatos.length > 0
            ? contatos
            : CONTATOS_PADRAO

    return origem
        .map((contato, indice) => ({
            ...contato,
            valores: Array.isArray(contato.valores)
                ? contato.valores.filter((valor) => valor.trim() !== "")
                : [],
            ativo: contato.ativo !== false,
            mostrarNoBanner: contato.mostrarNoBanner !== false,
            ordem: Number(contato.ordem || indice + 1)
        }))
        .sort((a, b) => a.ordem - b.ordem)
}

export function obterContatoPorId(
    configuracoes: ConfiguracoesPainel | undefined,
    id: string
) {
    if (
        !Array.isArray(configuracoes?.contatos) ||
        configuracoes.contatos.length === 0
    ) {
        return undefined
    }

    return normalizarContatos(configuracoes?.contatos).find(
        (contato) => contato.id === id && contato.ativo
    )
}

export function obterValorContato(
    configuracoes: ConfiguracoesPainel | undefined,
    id: string,
    fallback = ""
) {
    return obterContatoPorId(configuracoes, id)?.valores[0] || fallback
}
