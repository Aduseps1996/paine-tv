import type { CategoriaNoticia, Noticia, StatusVisual } from "@/types/painel"
import { atualizarNoticia as atualizarNoticiaServico } from "@/lib/firestore/noticias"

type Props = {
    noticias: Noticia[]
    novaNoticia: string
    setNovaNoticia: (valor: string) => void

    adicionarNoticia: () => void
    removerNoticia: (id: string) => void
    alternarNoticia: (id: string, ativo: boolean) => void
    carregarNoticias: () => void

    noticiaProgramada: boolean
    setNoticiaProgramada: (valor: boolean) => void
    inicioNoticia: string
    setInicioNoticia: (valor: string) => void
    fimNoticia: string
    setFimNoticia: (valor: string) => void
    categoriaNoticia: CategoriaNoticia
    setCategoriaNoticia: (valor: CategoriaNoticia) => void

}

export default function AbaNoticias({
    noticias,
    novaNoticia,
    setNovaNoticia,
    adicionarNoticia,
    removerNoticia,
    alternarNoticia,
    carregarNoticias,

    noticiaProgramada,
    setNoticiaProgramada,
    inicioNoticia,
    setInicioNoticia,
    fimNoticia,
    setFimNoticia,
    categoriaNoticia,
    setCategoriaNoticia
}: Props) {
    async function atualizarNoticia(id: string, dados: Partial<Noticia>) {
        await atualizarNoticiaServico(id, dados)
        carregarNoticias()
    }

    function obterStatusNoticia(noticia: Noticia): StatusVisual {
        if (!noticia.ativo) {
            return {
                texto: "Inativa",
                classe: "bg-red-500/15 text-red-400"
            }
        }

        if (!noticia.programada) {
            return {
                texto: "Em exibição",
                classe: "bg-green-500/15 text-green-400"
            }
        }

        if (!noticia.inicioExibicao || !noticia.fimExibicao) {
            return {
                texto: "Programação incompleta",
                classe: "bg-yellow-500/15 text-yellow-400"
            }
        }

        const agora = new Date()
        const inicio = new Date(noticia.inicioExibicao)
        const fim = new Date(noticia.fimExibicao)

        if (Number.isNaN(inicio.getTime()) || Number.isNaN(fim.getTime())) {
            return {
                texto: "Data inválida",
                classe: "bg-red-500/15 text-red-400"
            }
        }

        if (agora < inicio) {
            return {
                texto: "Agendada",
                classe: "bg-blue-500/15 text-blue-400"
            }
        }

        if (agora > fim) {
            return {
                texto: "Encerrada",
                classe: "bg-zinc-600 text-zinc-300"
            }
        }

        return {
            texto: "Em exibição",
            classe: "bg-green-500/15 text-green-400"
        }
    }

    return (
        <div className="space-y-4 sm:space-y-6">
            <div className="rounded-[24px] border border-white/10 bg-white/[0.03] p-4 shadow-[0_16px_40px_rgba(0,0,0,0.18)] sm:p-6">
                <div className="inline-flex rounded-full border border-sky-400/25 bg-sky-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.3em] text-sky-300">
                    Comunicação
                </div>
                <h1 className="mt-3 text-2xl sm:text-3xl md:text-4xl font-black tracking-tight">
                    Notícias do rodapé
                </h1>

                <p className="mt-2 max-w-2xl text-sm text-zinc-400 sm:text-base">
                    Cadastre e organize as mensagens exibidas no letreiro da TV.
                </p>
            </div>

            <div className="rounded-[28px] border border-white/10 bg-zinc-900/80 p-5 shadow-[0_20px_50px_rgba(0,0,0,0.24)] backdrop-blur-sm sm:p-6">
                <h2 className="mb-2 text-2xl font-bold">
                    Nova notícia
                </h2>

                <p className="text-zinc-400 mb-6">
                    Adicione uma nova mensagem para aparecer no rodapé do painel.
                </p>

                <div className="grid grid-cols-1 gap-4">
                    <div>
                        <label className="mb-2 block text-sm font-bold text-zinc-300">
                            Categoria da notícia
                        </label>

                        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                            <button
                                type="button"
                                onClick={() => setCategoriaNoticia("normal")}
                                className={`rounded-xl px-4 py-3 font-bold transition ${categoriaNoticia === "normal"
                                    ? "bg-zinc-200 text-black"
                                    : "bg-zinc-800 border border-zinc-700 text-white"
                                    }`}
                            >
                                Normal
                            </button>

                            <button
                                type="button"
                                onClick={() => setCategoriaNoticia("live")}
                                className={`rounded-xl px-4 py-3 font-bold transition ${categoriaNoticia === "live"
                                    ? "bg-red-600 text-white"
                                    : "bg-zinc-800 border border-zinc-700 text-white"
                                    }`}
                            >
                                🔴 Live
                            </button>

                            <button
                                type="button"
                                onClick={() => setCategoriaNoticia("urgente")}
                                className={`rounded-xl px-4 py-3 font-bold transition ${categoriaNoticia === "urgente"
                                    ? "bg-yellow-600 text-white"
                                    : "bg-zinc-800 border border-zinc-700 text-white"
                                    }`}
                            >
                                ⚠️ Urgente
                            </button>

                            <button
                                type="button"
                                onClick={() => setCategoriaNoticia("institucional")}
                                className={`rounded-xl px-4 py-3 font-bold transition ${categoriaNoticia === "institucional"
                                    ? "bg-blue-600 text-white"
                                    : "bg-zinc-800 border border-zinc-700 text-white"
                                    }`}
                            >
                                📢 Institucional
                            </button>
                        </div>
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-bold text-zinc-300">
                            Texto da notícia
                        </label>

                        <input
                            type="text"
                            placeholder="Digite a mensagem que será exibida no rodapé"
                            className="w-full rounded-xl border border-zinc-700 bg-zinc-800 px-4 py-3 outline-none"
                            value={novaNoticia}
                            onChange={(e) => setNovaNoticia(e.target.value)}
                        />
                    </div>

                    <label className="flex items-center gap-3 rounded-xl border border-zinc-700 bg-zinc-800 px-4 py-3">
                        <input
                            type="checkbox"
                            checked={noticiaProgramada}
                            onChange={(e) => setNoticiaProgramada(e.target.checked)}
                        />

                        <span className="font-bold">
                            Programar exibição desta notícia
                        </span>
                    </label>

                    {noticiaProgramada && (
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div>
                                <label className="mb-2 block text-sm font-bold text-zinc-300">
                                    Início da notícia
                                </label>

                                <input
                                    type="datetime-local"
                                    value={inicioNoticia}
                                    onChange={(e) => setInicioNoticia(e.target.value)}
                                    className="w-full rounded-xl border border-zinc-700 bg-zinc-800 px-4 py-3 outline-none"
                                />
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-bold text-zinc-300">
                                    Fim da notícia
                                </label>

                                <input
                                    type="datetime-local"
                                    value={fimNoticia}
                                    onChange={(e) => setFimNoticia(e.target.value)}
                                    className="w-full rounded-xl border border-zinc-700 bg-zinc-800 px-4 py-3 outline-none"
                                />
                            </div>
                        </div>
                    )}

                    <div className="rounded-2xl border border-zinc-700 bg-[#183b78]/95 p-4 overflow-hidden">
    <p className="mb-3 text-sm font-bold text-zinc-200">
        Prévia do letreiro
    </p>

    <div className="overflow-hidden rounded-xl bg-[#183b78] py-3">
        <div className="whitespace-nowrap font-bold text-white">
            <span className="mx-8">
                {novaNoticia.trim() !== ""
                    ? novaNoticia
                    : "Digite uma notícia para visualizar no letreiro"}
            </span>

            <span className="mx-6 text-[#f15434]">
                •
            </span>

            <span className="mx-8 opacity-80">
                Categoria: {categoriaNoticia}
            </span>

            {noticiaProgramada && (
                <>
                    <span className="mx-6 text-[#f15434]">
                        •
                    </span>

                    <span className="mx-8 opacity-80">
                        Notícia programada
                    </span>
                </>
            )}
        </div>
    </div>
</div>

                    <button
                        onClick={adicionarNoticia}
                        className="rounded-2xl bg-gradient-to-r from-emerald-500 to-green-600 px-4 py-3 font-semibold text-white shadow-lg shadow-emerald-500/20 transition hover:brightness-110"
                    >
                        Adicionar notícia
                    </button>

                </div>
            </div>

            <section className="rounded-[28px] border border-white/10 bg-zinc-900/80 p-5 shadow-[0_20px_50px_rgba(0,0,0,0.24)] backdrop-blur-sm sm:p-6">
                <div className="mb-6">
                    <h2 className="text-2xl font-bold">
                        Notícias cadastradas
                    </h2>

                    <p className="text-zinc-400 mt-1">
                        Controle a ordem, status, categoria e programação das notícias.
                    </p>
                </div>

                <div className="space-y-4">
                    {noticias.map((noticia) => {
                        const status = obterStatusNoticia(noticia)

                        return (
                            <div
                                key={noticia.id}
                                className="rounded-[24px] border border-white/10 bg-zinc-800/70 p-5 shadow-[0_12px_30px_rgba(0,0,0,0.22)]"
                            >
                                <div className="mb-4 flex items-center justify-between gap-4">
                                    <div className="flex flex-wrap items-center gap-2">
                                        <span
                                            className={`rounded-full px-3 py-1 text-xs font-bold ${status.classe}`}
                                        >
                                            {status.texto}
                                        </span>

                                        {noticia.programada && (
                                            <span className="rounded-full bg-blue-500/15 px-3 py-1 text-xs font-bold text-blue-400">
                                                Programada
                                            </span>
                                        )}

                                        <span className="rounded-full bg-zinc-700 px-3 py-1 text-xs font-bold text-zinc-300">
                                            {noticia.categoria || "normal"}
                                        </span>
                                    </div>

                                    <span className="text-xs text-zinc-500">
                                        Ordem: {noticia.ordem}
                                    </span>
                                </div>

                                <textarea
                                    value={noticia.texto}
                                    onChange={(e) => {
                                        if (!noticia.id) return

                                        atualizarNoticia(noticia.id, {
                                            texto: e.target.value
                                        })
                                    }}
                                    className="w-full bg-zinc-900 border border-zinc-700 rounded-xl p-3 outline-none resize-none min-h-[100px]"
                                />

                                <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                                    <div>
                                        <label className="text-sm text-zinc-300 mb-2 block">
                                            Categoria
                                        </label>

                                        <select
                                            value={noticia.categoria || "normal"}
                                            onChange={(e) => {
                                                if (!noticia.id) return

                                                atualizarNoticia(noticia.id, {
                                                    categoria: e.target.value as CategoriaNoticia
                                                })
                                            }}
                                            className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 outline-none"
                                        >
                                            <option value="normal">Normal</option>
                                            <option value="live">Live / Ao vivo</option>
                                            <option value="urgente">Urgente</option>
                                            <option value="institucional">Institucional</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="text-sm text-zinc-300 mb-2 block">
                                            Ordem
                                        </label>

                                        <input
                                            type="number"
                                            min="1"
                                            value={noticia.ordem}
                                            onChange={(e) => {
                                                if (!noticia.id) return

                                                atualizarNoticia(noticia.id, {
                                                    ordem: Number(e.target.value)
                                                })
                                            }}
                                            className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 outline-none"
                                        />
                                    </div>
                                </div>

                                <div className="mt-4 rounded-xl border border-zinc-700 bg-zinc-900/70 p-4">
                                    <label className="flex items-center gap-3">
                                        <input
                                            type="checkbox"
                                            checked={noticia.programada ?? false}
                                            onChange={(e) => {
                                                if (!noticia.id) return

                                                atualizarNoticia(noticia.id, {
                                                    programada: e.target.checked
                                                })
                                            }}
                                        />

                                        <span className="font-bold">
                                            Programar exibição desta notícia
                                        </span>
                                    </label>

                                    {noticia.programada && (
                                        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                                            <div>
                                                <label className="text-sm text-zinc-300 mb-2 block">
                                                    Início
                                                </label>

                                                <input
                                                    type="datetime-local"
                                                    value={noticia.inicioExibicao || ""}
                                                    onChange={(e) => {
                                                        if (!noticia.id) return

                                                        atualizarNoticia(noticia.id, {
                                                            inicioExibicao: e.target.value
                                                        })
                                                    }}
                                                    className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 outline-none"
                                                />
                                            </div>

                                            <div>
                                                <label className="text-sm text-zinc-300 mb-2 block">
                                                    Fim
                                                </label>

                                                <input
                                                    type="datetime-local"
                                                    value={noticia.fimExibicao || ""}
                                                    onChange={(e) => {
                                                        if (!noticia.id) return

                                                        atualizarNoticia(noticia.id, {
                                                            fimExibicao: e.target.value
                                                        })
                                                    }}
                                                    className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 outline-none"
                                                />
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className="mt-4 flex flex-wrap items-center gap-3">
                                    <button
                                        onClick={() =>
                                            noticia.id &&
                                            alternarNoticia(noticia.id, noticia.ativo)
                                        }
                                        className={`rounded-lg px-4 py-2 text-sm font-bold transition ${noticia.ativo
                                            ? "bg-yellow-600 hover:bg-yellow-700"
                                            : "bg-green-600 hover:bg-green-700"
                                            }`}
                                    >
                                        {noticia.ativo ? "Desativar" : "Ativar"}
                                    </button>

                                    <button
                                        onClick={() =>
                                            noticia.id && removerNoticia(noticia.id)
                                        }
                                        className="rounded-lg bg-red-600 px-4 py-2 text-sm font-bold transition hover:bg-red-700"
                                    >
                                        Excluir
                                    </button>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </section>
        </div>
    )
}
