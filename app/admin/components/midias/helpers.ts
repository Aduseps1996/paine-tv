import type { Midia } from "@/types/painel"

export function obterTituloMidia(midia: Midia) {
    return (
        midia.plantao?.titulo ||
        midia.contatosOficiais?.titulo ||
        midia.titulo ||
        midia.categoria ||
        midia.arquivo.split("/").pop() ||
        "Mídia sem título"
    )
}

export function obterNomeTemplate(template?: Midia["template"]) {
    switch (template) {
        case "institucional":
            return "Institucional"

        case "painel":
            return "Painel Informativo"

        case "plantao-juridico":
            return "Plantão Judicial"

        case "contatos-oficiais":
            return "Contatos Oficiais"

        default:
            return "Banner Cheio"
    }
}

export function obterCorTemplate(template?: Midia["template"]) {
    switch (template) {
        case "institucional":
            return "bg-emerald-500/15 text-emerald-300 border-emerald-400/20"

        case "painel":
            return "bg-sky-500/15 text-sky-300 border-sky-400/20"

        case "plantao-juridico":
            return "bg-cyan-500/15 text-cyan-300 border-cyan-400/20"

        case "contatos-oficiais":
            return "bg-sky-500/15 text-sky-300 border-sky-400/20"

        default:
            return "bg-zinc-700/40 text-zinc-200 border-zinc-600"
    }
}

export function obterCorStatus(ativo: boolean) {
    return ativo
        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
        : "bg-red-50 text-red-700 border-red-200"
}

export function obterTextoStatus(ativo: boolean) {
    return ativo ? "Ativa" : "Inativa"
}

export function obterTextoProgramacao(midia: Midia) {
    return midia.exibicaoProgramada
        ? "Programada"
        : "Contínua"
}

export function obterCorProgramacao(programada?: boolean) {
    return programada
        ? "bg-amber-50 text-amber-800 border-amber-200"
        : "bg-blue-50 text-blue-700 border-blue-200"
}
