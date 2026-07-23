import type { Midia } from "@/types/painel"

export function obterTituloMidia(midia: Midia) {
    return (
        midia.plantao?.titulo ||
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

        default:
            return "bg-zinc-700/40 text-zinc-200 border-zinc-600"
    }
}

export function obterCorStatus(ativo: boolean) {
    return ativo
        ? "bg-emerald-500/15 text-emerald-300 border-emerald-400/20"
        : "bg-red-500/15 text-red-300 border-red-400/20"
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
        ? "bg-amber-500/15 text-amber-300 border-amber-400/20"
        : "bg-sky-500/15 text-sky-300 border-sky-400/20"
}
