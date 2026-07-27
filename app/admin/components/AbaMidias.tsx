import { useState } from "react"

import type {
    AbaAdmin,
    Midia,
    TemplateMidia,
    TipoMidia
} from "@/types/painel"

import { usePainelDraftContext } from "../context/PainelDraftContext"
import MidiasGrid from "./midias/MidiasGrid"
import MidiasHeader from "./midias/MidiasHeader"
import MidiasStats from "./midias/MidiasStats"
import MidiasToolbar from "./midias/MidiasToolbar"
import ModalNovaMidia from "./midias/ModalNovaMidia"

export default function AbaMidias({
    navegarPara
}: {
    navegarPara: (aba: AbaAdmin) => void
}) {
    const {
        draft,
        atualizarMidiasDraft
    } = usePainelDraftContext()

    const [modalNovaMidiaAberto, setModalNovaMidiaAberto] = useState(false)
    const [midiaEditando, setMidiaEditando] = useState<Midia | null>(null)
    const [busca, setBusca] = useState("")
    const [filtroTemplate, setFiltroTemplate] = useState<"todos" | TemplateMidia>("todos")
    const [filtroTipo, setFiltroTipo] = useState<"todos" | TipoMidia>("todos")
    const [filtroStatus, setFiltroStatus] = useState<"todos" | "ativas" | "inativas" | "programadas">("todos")

    const midias = draft.midias

    const midiasFiltradas = midias.filter((midia) => {
        const texto = `${midia.titulo || ""} ${midia.categoria || ""} ${midia.arquivo || ""} ${midia.plantao?.chamadaPadrao || ""} ${midia.plantao?.ocasiaoEspecial || ""} ${midia.contatosOficiais?.titulo || ""}`.toLowerCase()
        const correspondeBusca = texto.includes(busca.toLowerCase())
        const correspondeTemplate = filtroTemplate === "todos" || midia.template === filtroTemplate
        const correspondeTipo = filtroTipo === "todos" || midia.tipo === filtroTipo
        const correspondeStatus =
            filtroStatus === "todos" ||
            (filtroStatus === "ativas" && midia.ativo) ||
            (filtroStatus === "inativas" && !midia.ativo) ||
            (filtroStatus === "programadas" && midia.exibicaoProgramada)

        return correspondeBusca && correspondeTemplate && correspondeTipo && correspondeStatus
    })

    if (modalNovaMidiaAberto || midiaEditando) {
        return (
            <ModalNovaMidia
                key={midiaEditando?.id || "nova-midia"}
                midias={midias}
                midiaEditando={midiaEditando}
                atualizarMidiasDraft={atualizarMidiasDraft}
                onFechar={() => {
                    setModalNovaMidiaAberto(false)
                    setMidiaEditando(null)
                }}
            />
        )
    }

    return (
        <div className="space-y-5">
            <MidiasHeader
                onNovaMidia={() => setModalNovaMidiaAberto(true)}
                onRevisar={() => navegarPara("previa-tv")}
            />

            <MidiasStats midias={midias} />

            <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-[0_8px_24px_rgba(15,23,42,0.04)]">
                <MidiasToolbar
                    busca={busca}
                    setBusca={setBusca}
                    filtroTemplate={filtroTemplate}
                    setFiltroTemplate={setFiltroTemplate}
                    filtroTipo={filtroTipo}
                    setFiltroTipo={setFiltroTipo}
                    filtroStatus={filtroStatus}
                    setFiltroStatus={setFiltroStatus}
                    totalResultados={midiasFiltradas.length}
                />

                <MidiasGrid
                    midias={midiasFiltradas}
                    todasMidias={midias}
                    atualizarMidiasDraft={atualizarMidiasDraft}
                    onEditar={setMidiaEditando}
                />
            </section>
        </div>
    )
}
