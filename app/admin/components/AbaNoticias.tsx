"use client"

import { useMemo, useState } from "react"
import type { CategoriaNoticia, Noticia, StatusVisual } from "@/types/painel"
import { usePainelDraftContext } from "../context/PainelDraftContext"

export default function AbaNoticias() {
    const { draft, atualizarNoticiasDraft } = usePainelDraftContext()

    const noticias = draft.noticias

    const [modalNovaNoticiaAberto, setModalNovaNoticiaAberto] = useState(false)
    const [busca, setBusca] = useState("")
    const [textoNoticia, setTextoNoticia] = useState("")
    const [noticiaProgramada, setNoticiaProgramada] = useState(false)
    const [inicioNoticia, setInicioNoticia] = useState("")
    const [fimNoticia, setFimNoticia] = useState("")
    const [categoriaNoticia, setCategoriaNoticia] =
        useState<CategoriaNoticia>("normal")

    const noticiasAtivas = noticias.filter((n) => n.ativo).length
    const noticiasInativas = noticias.length - noticiasAtivas
    const noticiasProgramadas = noticias.filter((n) => n.programada).length

    const noticiasFiltradas = useMemo(() => {
        const termo = busca.trim().toLowerCase()

        if (!termo) return noticias

        return noticias.filter((noticia) =>
            `${noticia.texto} ${noticia.categoria || ""}`
                .toLowerCase()
                .includes(termo)
        )
    }, [noticias, busca])

    function atualizarNoticia(id: string, dados: Partial<Noticia>) {
        atualizarNoticiasDraft(
            noticias.map((noticia) =>
                noticia.id === id ? { ...noticia, ...dados } : noticia
            )
        )
    }

    function alterarOrdemNoticia(id: string, novaOrdem: number) {
        const ordemSegura = Math.max(1, Math.min(novaOrdem, noticias.length))

        const noticiaMovida = noticias.find((noticia) => noticia.id === id)
        if (!noticiaMovida) return

        const outrasNoticias = noticias
            .filter((noticia) => noticia.id !== id)
            .sort((a, b) => a.ordem - b.ordem)

        outrasNoticias.splice(ordemSegura - 1, 0, {
            ...noticiaMovida,
            ordem: ordemSegura
        })

        atualizarNoticiasDraft(
            outrasNoticias.map((noticia, index) => ({
                ...noticia,
                ordem: index + 1
            }))
        )
    }

    function alternarNoticia(id: string, ativo: boolean) {
        atualizarNoticia(id, { ativo: !ativo })
    }

    function removerNoticia(id: string) {
        const confirmar = confirm("Deseja remover esta notícia do rascunho?")
        if (!confirmar) return

        atualizarNoticiasDraft(noticias.filter((noticia) => noticia.id !== id))
    }

    function adicionarNoticia() {
        if (!textoNoticia.trim()) return

        atualizarNoticiasDraft([
            ...noticias,
            {
                id: `draft-${Date.now()}`,
                texto: textoNoticia.trim(),
                ativo: true,
                ordem: noticias.length + 1,
                categoria: categoriaNoticia,
                programada: noticiaProgramada,
                inicioExibicao: inicioNoticia,
                fimExibicao: fimNoticia
            }
        ])

        setTextoNoticia("")
        setNoticiaProgramada(false)
        setInicioNoticia("")
        setFimNoticia("")
        setCategoriaNoticia("normal")
        setModalNovaNoticiaAberto(false)
    }

    function obterStatusNoticia(noticia: Noticia): StatusVisual {
        if (!noticia.ativo) {
            return {
                texto: "Inativa",
                classe: "border-red-400/20 bg-red-500/10 text-red-300"
            }
        }

        if (!noticia.programada) {
            return {
                texto: "Em exibição",
                classe: "border-emerald-400/20 bg-emerald-500/10 text-emerald-300"
            }
        }

        if (!noticia.inicioExibicao || !noticia.fimExibicao) {
            return {
                texto: "Programação incompleta",
                classe: "border-amber-400/20 bg-amber-500/10 text-amber-300"
            }
        }

        const agora = new Date()
        const inicio = new Date(noticia.inicioExibicao)
        const fim = new Date(noticia.fimExibicao)

        if (Number.isNaN(inicio.getTime()) || Number.isNaN(fim.getTime())) {
            return {
                texto: "Data inválida",
                classe: "border-red-400/20 bg-red-500/10 text-red-300"
            }
        }

        if (agora < inicio) {
            return {
                texto: "Agendada",
                classe: "border-sky-400/20 bg-sky-500/10 text-sky-300"
            }
        }

        if (agora > fim) {
            return {
                texto: "Encerrada",
                classe: "border-zinc-600 bg-zinc-800 text-zinc-300"
            }
        }

        return {
            texto: "Em exibição",
            classe: "border-emerald-400/20 bg-emerald-500/10 text-emerald-300"
        }
    }

    return (
        <div className="space-y-8">
            <section className="rounded-[28px] border border-white/10 bg-gradient-to-br from-white/[0.06] to-white/[0.02] p-5 shadow-[0_20px_60px_rgba(0,0,0,0.22)] sm:p-7">
                <div>
                    <div className="inline-flex rounded-full border border-sky-400/25 bg-sky-500/10 px-3 py-1 text-[11px] font-black uppercase tracking-[0.32em] text-sky-300">
                        Comunicação
                    </div>

                    <h1 className="mt-4 text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl">
                        Notícias do rodapé
                    </h1>

                    <p className="mt-3 max-w-3xl text-sm leading-relaxed text-zinc-400 sm:text-base">
                        Cadastre e organize as mensagens exibidas no letreiro da TV. Tudo fica no rascunho até ser publicado.
                    </p>
                </div>
            </section>

            <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                {[
                    { label: "Total", value: noticias.length, desc: "notícias no rascunho" },
                    { label: "Ativas", value: noticiasAtivas, desc: "em exibição" },
                    { label: "Inativas", value: noticiasInativas, desc: "fora do rodapé" },
                    { label: "Programadas", value: noticiasProgramadas, desc: "com período definido" }
                ].map((card) => (
                    <div
                        key={card.label}
                        className="rounded-[26px] border border-white/10 bg-zinc-900/80 p-5 shadow-[0_16px_40px_rgba(0,0,0,0.18)]"
                    >
                        <p className="text-xs font-black uppercase tracking-[0.25em] text-zinc-500">
                            {card.label}
                        </p>

                        <div className="mt-4 text-5xl font-black">
                            {card.value}
                        </div>

                        <p className="mt-3 text-sm text-zinc-400">
                            {card.desc}
                        </p>
                    </div>
                ))}
            </section>

            <section className="rounded-[34px] border border-white/10 bg-zinc-900/85 p-5 shadow-[0_24px_70px_rgba(0,0,0,0.32)] backdrop-blur-sm sm:p-7">
                <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                        <h2 className="text-2xl font-black sm:text-3xl">
                            Biblioteca de notícias
                        </h2>

                        <p className="mt-2 text-sm text-zinc-400 sm:text-base">
                            {noticiasFiltradas.length} resultado(s) encontrado(s).
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={() => setModalNovaNoticiaAberto(true)}
                        className="w-fit rounded-2xl border border-sky-300/20 bg-sky-500 px-5 py-3 text-sm font-black text-white shadow-[0_14px_35px_rgba(14,165,233,0.22)]"
                    >
                        + Nova notícia
                    </button>
                </div>

                <input
                    type="text"
                    placeholder="Pesquisar notícia..."
                    value={busca}
                    onChange={(e) => setBusca(e.target.value)}
                />

                <div className="mt-6 space-y-4">
                    {noticiasFiltradas.map((noticia) => {
                        const status = obterStatusNoticia(noticia)

                        return (
                            <article
                                key={noticia.id}
                                className="rounded-[28px] border border-white/10 bg-zinc-900/85 p-5 shadow-[0_18px_45px_rgba(0,0,0,0.22)]"
                            >
                                <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                                    <div className="flex flex-wrap gap-2">
                                        <span className={`rounded-full border px-3 py-1 text-xs font-black ${status.classe}`}>
                                            {status.texto}
                                        </span>

                                        <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs font-black text-zinc-300">
                                            {noticia.categoria || "normal"}
                                        </span>

                                        {noticia.programada && (
                                            <span className="rounded-full border border-sky-400/20 bg-sky-500/10 px-3 py-1 text-xs font-black text-sky-300">
                                                Programada
                                            </span>
                                        )}
                                    </div>

                                    <div className="text-xs font-bold uppercase tracking-[0.22em] text-zinc-500">
                                        Ordem {noticia.ordem}
                                    </div>
                                </div>

                                <textarea
                                    value={noticia.texto}
                                    onChange={(e) =>
                                        atualizarNoticia(noticia.id, {
                                            texto: e.target.value
                                        })
                                    }
                                    className="min-h-[100px] resize-none"
                                />

                                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                                    <div>
                                        <label className="mb-2 block text-sm font-bold text-zinc-300">
                                            Categoria
                                        </label>

                                        <select
                                            value={noticia.categoria || "normal"}
                                            onChange={(e) =>
                                                atualizarNoticia(noticia.id, {
                                                    categoria: e.target.value as CategoriaNoticia
                                                })
                                            }
                                        >
                                            <option value="normal">Normal</option>
                                            <option value="live">Live / Ao vivo</option>
                                            <option value="urgente">Urgente</option>
                                            <option value="institucional">Institucional</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="mb-2 block text-sm font-bold text-zinc-300">
                                            Ordem
                                        </label>

                                        <input
                                            type="number"
                                            min="1"
                                            value={noticia.ordem}
                                            onChange={(e) =>
                                                alterarOrdemNoticia(
                                                    noticia.id,
                                                    Number(e.target.value)
                                                )
                                            }
                                        />
                                    </div>
                                </div>

                                <div className="mt-4 rounded-2xl border border-white/10 bg-zinc-950/60 p-4">
                                    <label className="flex items-center justify-between gap-4">
                                        <div>
                                            <p className="font-bold text-white">
                                                Exibição programada
                                            </p>

                                            <p className="mt-1 text-sm text-zinc-400">
                                                Define quando esta notícia entra e sai do rodapé.
                                            </p>
                                        </div>

                                        <input
                                            type="checkbox"
                                            checked={noticia.programada ?? false}
                                            onChange={(e) =>
                                                atualizarNoticia(noticia.id, {
                                                    programada: e.target.checked
                                                })
                                            }
                                        />
                                    </label>

                                    {noticia.programada && (
                                        <div className="mt-4 grid gap-4 sm:grid-cols-2">
                                            <input
                                                type="datetime-local"
                                                value={noticia.inicioExibicao || ""}
                                                onChange={(e) =>
                                                    atualizarNoticia(noticia.id, {
                                                        inicioExibicao: e.target.value
                                                    })
                                                }
                                            />

                                            <input
                                                type="datetime-local"
                                                value={noticia.fimExibicao || ""}
                                                onChange={(e) =>
                                                    atualizarNoticia(noticia.id, {
                                                        fimExibicao: e.target.value
                                                    })
                                                }
                                            />
                                        </div>
                                    )}
                                </div>

                                <div className="mt-5 flex flex-wrap gap-3">
                                    <button
                                        type="button"
                                        onClick={() =>
                                            alternarNoticia(noticia.id, noticia.ativo)
                                        }
                                        className="rounded-2xl border border-zinc-700 bg-zinc-950/70 px-4 py-3 text-sm font-black text-zinc-200"
                                    >
                                        {noticia.ativo ? "Desativar" : "Ativar"}
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => removerNoticia(noticia.id)}
                                        className="rounded-2xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm font-black text-red-300"
                                    >
                                        Excluir
                                    </button>
                                </div>
                            </article>
                        )
                    })}
                </div>
            </section>

            {modalNovaNoticiaAberto && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
                    <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-[34px] border border-white/10 bg-zinc-950 p-6 shadow-2xl sm:p-8">
                        <div className="mb-7 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                            <div>
                                <div className="inline-flex rounded-full border border-sky-400/25 bg-sky-500/10 px-3 py-1 text-[11px] font-black uppercase tracking-[0.32em] text-sky-300">
                                    Nova notícia
                                </div>

                                <h2 className="mt-4 text-3xl font-black tracking-tight">
                                    Salvar notícia no rascunho
                                </h2>

                                <p className="mt-3 text-sm leading-relaxed text-zinc-400">
                                    A notícia só aparecerá na TV depois da publicação na página Início.
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={() => setModalNovaNoticiaAberto(false)}
                                className="w-fit rounded-2xl border border-zinc-700 bg-zinc-900/80 px-5 py-3 text-sm font-bold text-zinc-200"
                            >
                                Fechar
                            </button>
                        </div>

                        <div className="space-y-5">
                            <section className="rounded-[26px] border border-white/10 bg-white/[0.03] p-5">
                                <h3 className="text-xl font-black">
                                    Conteúdo
                                </h3>

                                <div className="mt-5 grid gap-4">
                                    <select
                                        value={categoriaNoticia}
                                        onChange={(e) =>
                                            setCategoriaNoticia(
                                                e.target.value as CategoriaNoticia
                                            )
                                        }
                                    >
                                        <option value="normal">Normal</option>
                                        <option value="live">Live / Ao vivo</option>
                                        <option value="urgente">Urgente</option>
                                        <option value="institucional">Institucional</option>
                                    </select>

                                    <input
                                        type="text"
                                        placeholder="Digite a mensagem que será exibida no rodapé"
                                        value={textoNoticia}
                                        onChange={(e) => setTextoNoticia(e.target.value)}
                                    />
                                </div>
                            </section>

                            <section className="rounded-[26px] border border-white/10 bg-white/[0.03] p-5">
                                <h3 className="text-xl font-black">
                                    Exibição
                                </h3>

                                <div className="mt-5 space-y-4">
                                    <label className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-zinc-950/60 px-4 py-4">
                                        <span className="font-bold">
                                            Programar exibição
                                        </span>

                                        <input
                                            type="checkbox"
                                            checked={noticiaProgramada}
                                            onChange={(e) =>
                                                setNoticiaProgramada(e.target.checked)
                                            }
                                        />
                                    </label>

                                    {noticiaProgramada && (
                                        <div className="grid gap-4 sm:grid-cols-2">
                                            <input
                                                type="datetime-local"
                                                value={inicioNoticia}
                                                onChange={(e) => setInicioNoticia(e.target.value)}
                                            />

                                            <input
                                                type="datetime-local"
                                                value={fimNoticia}
                                                onChange={(e) => setFimNoticia(e.target.value)}
                                            />
                                        </div>
                                    )}
                                </div>
                            </section>

                            <section className="rounded-[26px] border border-white/10 bg-[#183b78]/95 p-5">
                                <p className="mb-3 text-sm font-black uppercase tracking-[0.22em] text-zinc-200">
                                    Prévia do letreiro
                                </p>

                                <div className="overflow-hidden rounded-2xl bg-[#183b78] py-4">
                                    <div className="whitespace-nowrap font-bold text-white">
                                        <span className="mx-8">
                                            {textoNoticia.trim() || "Digite uma notícia para visualizar no letreiro"}
                                        </span>

                                        <span className="mx-6 text-[#f15434]">•</span>

                                        <span className="mx-8 opacity-80">
                                            Categoria: {categoriaNoticia}
                                        </span>
                                    </div>
                                </div>
                            </section>

                            <button
                                type="button"
                                onClick={adicionarNoticia}
                                className="w-full rounded-2xl border border-sky-300/20 bg-sky-500 px-5 py-4 text-sm font-black text-white shadow-[0_14px_35px_rgba(14,165,233,0.22)]"
                            >
                                Salvar no rascunho
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}