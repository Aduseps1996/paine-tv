import type { TemplateMidia, TipoMidia } from "@/types/painel"
import { Search } from "lucide-react"

type Props = {
    busca: string
    setBusca: (valor: string) => void

    filtroTemplate: "todos" | TemplateMidia
    setFiltroTemplate: (valor: "todos" | TemplateMidia) => void

    filtroTipo: "todos" | TipoMidia
    setFiltroTipo: (valor: "todos" | TipoMidia) => void

    filtroStatus: "todos" | "ativas" | "inativas" | "programadas"
    setFiltroStatus: (valor: "todos" | "ativas" | "inativas" | "programadas") => void

    totalResultados: number
}

export default function MidiasToolbar({
    busca,
    setBusca,
    filtroTemplate,
    setFiltroTemplate,
    filtroTipo,
    setFiltroTipo,
    filtroStatus,
    setFiltroStatus,
    totalResultados
}: Props) {
    const tipos: Array<{ valor: "todos" | TipoMidia; rotulo: string }> = [
        { valor: "todos", rotulo: "Todas" },
        { valor: "imagem", rotulo: "Imagens" },
        { valor: "video", rotulo: "Vídeos" },
        { valor: "youtube", rotulo: "YouTube" },
        { valor: "dinamica", rotulo: "Dinâmicas" }
    ]

    return (
        <div className="border-b border-slate-200 p-4 sm:p-5">
            <div className="mb-4 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <h2 className="text-lg font-extrabold text-slate-950 sm:text-xl">
                        Biblioteca de mídias
                    </h2>

                    <p className="mt-1 text-xs text-slate-500 sm:text-sm">
                        {totalResultados} resultado(s) no rascunho
                    </p>
                </div>
            </div>

            <div className="flex flex-col gap-3 xl:flex-row xl:items-center">
                <label className="relative block">
                    <Search className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                        type="text"
                        placeholder="Buscar por título..."
                        value={busca}
                        onChange={(e) => setBusca(e.target.value)}
                        className="min-w-0 pl-10 xl:w-80"
                    />
                </label>

                <div className="flex flex-wrap gap-2">
                    {tipos.map((item) => (
                        <button
                            key={item.valor}
                            type="button"
                            onClick={() => setFiltroTipo(item.valor)}
                            className={`min-h-10 rounded-lg border px-4 text-sm font-bold transition ${
                                filtroTipo === item.valor
                                    ? "border-[#0d6efd] bg-blue-50 text-[#0d6efd]"
                                    : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                            }`}
                        >
                            {item.rotulo}
                        </button>
                    ))}
                </div>

                <div className="flex flex-col gap-3 sm:flex-row xl:ml-auto">
                <select
                    value={filtroTemplate}
                    onChange={(e) =>
                        setFiltroTemplate(e.target.value as "todos" | TemplateMidia)
                    }
                    className="min-w-44"
                >
                    <option value="todos">Todos os templates</option>
                    <option value="cheio">Banner Cheio</option>
                    <option value="institucional">Institucional</option>
                    <option value="painel">Painel Informativo</option>
                    <option value="plantao-juridico">Plantão Judicial</option>
                    <option value="contatos-oficiais">Contatos Oficiais</option>
                </select>

                <select
                    value={filtroStatus}
                    onChange={(e) =>
                        setFiltroStatus(
                            e.target.value as
                                | "todos"
                                | "ativas"
                                | "inativas"
                                | "programadas"
                        )
                    }
                >
                    <option value="todos">Todos os status</option>
                    <option value="ativas">Ativas</option>
                    <option value="inativas">Inativas</option>
                    <option value="programadas">Programadas</option>
                </select>
                </div>
            </div>
        </div>
    )
}
