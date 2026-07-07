import { useState } from "react"

import type { TemplateMidia, TipoMidia } from "@/types/painel"

import { usePainelDraftContext } from "../context/PainelDraftContext"
import MidiasGrid from "./midias/MidiasGrid"
import MidiasHeader from "./midias/MidiasHeader"
import MidiasStats from "./midias/MidiasStats"
import MidiasToolbar from "./midias/MidiasToolbar"
import ModalNovaMidia from "./midias/ModalNovaMidia"

export default function AbaMidias() {
    const { draft, atualizarMidiasDraft } = usePainelDraftContext()

    const [modalNovaMidiaAberto, setModalNovaMidiaAberto] = useState(false)
    const [busca, setBusca] = useState("")
    const [filtroTemplate, setFiltroTemplate] = useState<"todos" | TemplateMidia>("todos")
    const [filtroTipo, setFiltroTipo] = useState<"todos" | TipoMidia>("todos")
    const [filtroStatus, setFiltroStatus] = useState<"todos" | "ativas" | "inativas" | "programadas">("todos")

    const midias = draft.midias

    const midiasFiltradas = midias.filter((midia) => {
        const texto = `${midia.titulo || ""} ${midia.categoria || ""} ${midia.arquivo || ""}`.toLowerCase()
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

    return (
        <div className="space-y-8">
            <MidiasHeader />

            <MidiasStats midias={midias} />

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
                onNovaMidia={() => setModalNovaMidiaAberto(true)}
            />

            <MidiasGrid
                midias={midiasFiltradas}
                todasMidias={midias}
                atualizarMidiasDraft={atualizarMidiasDraft}
            />

            {modalNovaMidiaAberto && (
                <ModalNovaMidia
                    midias={midias}
                    atualizarMidiasDraft={atualizarMidiasDraft}
                    onFechar={() => setModalNovaMidiaAberto(false)}
                />
            )}
        </div>
    )
}
