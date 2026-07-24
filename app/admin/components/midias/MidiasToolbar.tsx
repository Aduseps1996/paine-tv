import type { TemplateMidia, TipoMidia } from "@/types/painel"

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
    onNovaMidia: () => void
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
    totalResultados,
    onNovaMidia
}: Props) {
    return (
        <section className="rounded-[34px] border border-white/10 bg-zinc-900/85 p-5 shadow-[0_24px_70px_rgba(0,0,0,0.32)] backdrop-blur-sm sm:p-7">
            <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                    <h2 className="text-2xl font-black sm:text-3xl">
                        Biblioteca
                    </h2>

                    <p className="mt-2 text-sm text-zinc-400 sm:text-base">
                        {totalResultados} resultado(s) encontrado(s) no rascunho.
                    </p>
                </div>

                <button
                    type="button"
                    onClick={onNovaMidia}
                    className="w-fit rounded-2xl border border-sky-300/20 bg-sky-500 px-5 py-3 text-sm font-black text-white shadow-[0_14px_35px_rgba(14,165,233,0.22)] disabled:cursor-not-allowed disabled:opacity-40"
                >
                    + Nova mídia
                </button>
            </div>

            <div className="grid gap-3 lg:grid-cols-[minmax(0,1.4fr)_repeat(3,minmax(0,1fr))]">
                <input
                    type="text"
                    placeholder="Pesquisar por título, categoria ou arquivo..."
                    value={busca}
                    onChange={(e) => setBusca(e.target.value)}
                />

                <select
                    value={filtroTemplate}
                    onChange={(e) =>
                        setFiltroTemplate(e.target.value as "todos" | TemplateMidia)
                    }
                >
                    <option value="todos">Todos os templates</option>
                    <option value="cheio">Banner Cheio</option>
                    <option value="institucional">Institucional</option>
                    <option value="painel">Painel Informativo</option>
                    <option value="plantao-juridico">Plantão Judicial</option>
                    <option value="contatos-oficiais">Contatos Oficiais</option>
                </select>

                <select
                    value={filtroTipo}
                    onChange={(e) =>
                        setFiltroTipo(e.target.value as "todos" | TipoMidia)
                    }
                >
                    <option value="todos">Todos os tipos</option>
                    <option value="imagem">Imagem</option>
                    <option value="video">Vídeo</option>
                    <option value="youtube">YouTube / Live</option>
                    <option value="dinamica">Conteúdo dinâmico</option>
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
        </section>
    )
}
