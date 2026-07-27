import { useState } from "react"
import { Info } from "lucide-react"

import type { Midia } from "@/types/painel"
import { excluirMidiaStorage } from "@/utils/excluirMidiaStorage"

import MidiaCard from "./MidiaCard"

type Props = {
    midias: Midia[]
    todasMidias: Midia[]
    atualizarMidiasDraft: (midias: Midia[]) => void
    onEditar: (midia: Midia) => void
}

export default function MidiasGrid({
    midias,
    todasMidias,
    atualizarMidiasDraft,
    onEditar
}: Props) {
    const [idArrastado, setIdArrastado] = useState<string | null>(null)

    function alternarMidia(midia: Midia) {
        atualizarMidiasDraft(
            todasMidias.map((item) =>
                item.id === midia.id
                    ? { ...item, ativo: !item.ativo }
                    : item
            )
        )
    }

    async function excluirMidia(midia: Midia) {
        const confirmar = confirm("Deseja remover esta mídia do rascunho?")
        if (!confirmar) return

        await excluirMidiaStorage(midia.storagePath)
        atualizarMidiasDraft(
            todasMidias.filter((item) => item.id !== midia.id)
        )
    }

    function reorganizar(idDestino: string) {
        if (!idArrastado || idArrastado === idDestino) return

        const origem = todasMidias.findIndex((item) => item.id === idArrastado)
        const destino = todasMidias.findIndex((item) => item.id === idDestino)
        if (origem < 0 || destino < 0) return

        const reorganizadas = [...todasMidias]
        const [movida] = reorganizadas.splice(origem, 1)
        reorganizadas.splice(destino, 0, movida)

        atualizarMidiasDraft(
            reorganizadas.map((item, indice) => ({
                ...item,
                ordem: indice + 1
            }))
        )
        setIdArrastado(null)
    }

    if (midias.length === 0) {
        return (
            <section className="p-10 text-center">
                <h3 className="text-2xl font-extrabold text-slate-950">
                    Nenhuma mídia encontrada
                </h3>

                <p className="mt-3 text-slate-500">
                    Ajuste os filtros ou cadastre uma nova mídia para começar.
                </p>
            </section>
        )
    }

    return (
        <section className="p-4 sm:p-5">
            <div className="mb-4 flex items-center gap-2 rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 text-xs font-semibold text-blue-700">
                <Info size={16} />
                Arraste os cards para reorganizar a ordem de exibição.
            </div>

            <div className="grid gap-4 md:grid-cols-2 2xl:grid-cols-3">
                {midias.map((midia) => (
                    <div
                        key={midia.id}
                        draggable
                        onDragStart={() => setIdArrastado(midia.id)}
                        onDragEnd={() => setIdArrastado(null)}
                        onDragOver={(evento) => evento.preventDefault()}
                        onDrop={() => reorganizar(midia.id)}
                        className={idArrastado === midia.id ? "opacity-55" : ""}
                    >
                        <MidiaCard
                            midia={midia}
                            onEditar={onEditar}
                            onAlternar={alternarMidia}
                            onExcluir={excluirMidia}
                        />
                    </div>
                ))}
            </div>
        </section>
    )
}
