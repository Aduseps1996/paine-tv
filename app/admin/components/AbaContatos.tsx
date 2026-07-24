"use client"

import {
    ArrowDown,
    ArrowUp,
    Eye,
    EyeOff,
    MessageCircleMore,
    Phone,
    Plus,
    Trash2
} from "lucide-react"

import type { ContatoPainel } from "@/types/painel"
import { normalizarContatos } from "@/utils/contatosPainel"
import { usePainelDraftContext } from "../context/PainelDraftContext"

function novoContato(total: number): ContatoPainel {
    return {
        id: `contato-${Date.now()}`,
        titulo: "Novo contato",
        tipo: "telefone",
        valores: [""],
        observacao: "",
        ativo: true,
        mostrarNoBanner: true,
        ordem: total + 1
    }
}

export default function AbaContatos() {
    const { draft, atualizarConfiguracoesDraft } = usePainelDraftContext()
    const contatos =
        Array.isArray(draft.configuracoes.contatos) &&
        draft.configuracoes.contatos.length > 0
            ? [...draft.configuracoes.contatos].sort(
                (a, b) => Number(a.ordem || 0) - Number(b.ordem || 0)
            )
            : normalizarContatos(draft.configuracoes.contatos)

    function salvarLista(lista: ContatoPainel[]) {
        atualizarConfiguracoesDraft({
            contatos: lista.map((contato, indice) => ({
                ...contato,
                ordem: indice + 1
            }))
        })
    }

    function atualizarContato(id: string, dados: Partial<ContatoPainel>) {
        salvarLista(
            contatos.map((contato) =>
                contato.id === id
                    ? { ...contato, ...dados }
                    : contato
            )
        )
    }

    function atualizarValor(id: string, indice: number, valor: string) {
        const contato = contatos.find((item) => item.id === id)
        if (!contato) return

        const valores = [...contato.valores]
        valores[indice] = valor
        atualizarContato(id, { valores })
    }

    function adicionarValor(id: string) {
        const contato = contatos.find((item) => item.id === id)
        if (!contato) return
        atualizarContato(id, { valores: [...contato.valores, ""] })
    }

    function removerValor(id: string, indice: number) {
        const contato = contatos.find((item) => item.id === id)
        if (!contato || contato.valores.length <= 1) return
        atualizarContato(id, {
            valores: contato.valores.filter((_, posicao) => posicao !== indice)
        })
    }

    function mover(id: string, direcao: -1 | 1) {
        const indice = contatos.findIndex((contato) => contato.id === id)
        const destino = indice + direcao

        if (indice < 0 || destino < 0 || destino >= contatos.length) return

        const lista = [...contatos]
        const [movido] = lista.splice(indice, 1)
        lista.splice(destino, 0, movido)
        salvarLista(lista)
    }

    function excluir(id: string) {
        const contato = contatos.find((item) => item.id === id)
        if (!contato) return

        if (!confirm(`Excluir o contato "${contato.titulo}"?`)) return
        salvarLista(contatos.filter((item) => item.id !== id))
    }

    return (
        <div className="space-y-7">
            <section className="rounded-[30px] border border-white/10 bg-zinc-900/85 p-6 shadow-[0_24px_70px_rgba(0,0,0,0.28)] sm:p-8">
                <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                        <div className="inline-flex rounded-full border border-cyan-400/25 bg-cyan-500/10 px-3 py-1 text-[11px] font-black uppercase tracking-[0.28em] text-cyan-300">
                            Cadastro central
                        </div>
                        <h2 className="mt-4 text-3xl font-black tracking-tight">
                            Contatos oficiais
                        </h2>
                        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-zinc-400">
                            Edite aqui os dados exibidos dentro de cada card. O número é salvo uma vez e a alteração vale para o banner de contatos, o Plantão Judicial e qualquer outro lugar que utilize o mesmo contato.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={() => salvarLista([...contatos, novoContato(contatos.length)])}
                        className="flex w-fit items-center gap-2 rounded-2xl bg-sky-500 px-5 py-3 text-sm font-black text-white"
                    >
                        <Plus className="h-4 w-4" />
                        Novo contato
                    </button>
                </div>
            </section>

            <section className="grid gap-5">
                {contatos.map((contato, indiceContato) => (
                    <article
                        key={contato.id}
                        className="rounded-[28px] border border-white/10 bg-zinc-900/85 p-5 shadow-[0_18px_50px_rgba(0,0,0,0.22)] sm:p-6"
                    >
                        <div className="mb-5 flex items-center justify-between gap-3 border-b border-white/10 pb-4">
                            <div>
                                <p className="text-[11px] font-black uppercase tracking-[0.2em] text-sky-300">
                                    Card {indiceContato + 1}
                                </p>
                                <p className="mt-1 text-lg font-black text-white">
                                    {contato.titulo || "Novo contato"}
                                </p>
                            </div>
                            <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs font-black text-zinc-400">
                                Ordem {indiceContato + 1}
                            </span>
                        </div>

                        <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
                            <div className="grid min-w-0 flex-1 gap-4 md:grid-cols-[minmax(0,1.2fr)_220px]">
                                <label className="text-sm font-bold text-zinc-300">
                                    Nome do setor
                                    <input
                                        className="mt-2"
                                        value={contato.titulo}
                                        onChange={(e) =>
                                            atualizarContato(contato.id, {
                                                titulo: e.target.value
                                            })
                                        }
                                    />
                                </label>

                                <label className="text-sm font-bold text-zinc-300">
                                    Tipo
                                    <select
                                        className="mt-2"
                                        value={contato.tipo}
                                        onChange={(e) =>
                                            atualizarContato(contato.id, {
                                                tipo: e.target.value as ContatoPainel["tipo"]
                                            })
                                        }
                                    >
                                        <option value="telefone">Telefone</option>
                                        <option value="whatsapp">WhatsApp</option>
                                        <option value="site">Site</option>
                                    </select>
                                </label>
                            </div>

                            <div className="flex flex-wrap gap-2">
                                <button
                                    type="button"
                                    title="Mover para cima"
                                    disabled={indiceContato === 0}
                                    onClick={() => mover(contato.id, -1)}
                                    className="rounded-xl border border-white/10 bg-white/[0.04] p-3 text-zinc-300 disabled:opacity-30"
                                >
                                    <ArrowUp className="h-4 w-4" />
                                </button>
                                <button
                                    type="button"
                                    title="Mover para baixo"
                                    disabled={indiceContato === contatos.length - 1}
                                    onClick={() => mover(contato.id, 1)}
                                    className="rounded-xl border border-white/10 bg-white/[0.04] p-3 text-zinc-300 disabled:opacity-30"
                                >
                                    <ArrowDown className="h-4 w-4" />
                                </button>
                                <button
                                    type="button"
                                    onClick={() =>
                                        atualizarContato(contato.id, {
                                            mostrarNoBanner: !contato.mostrarNoBanner
                                        })
                                    }
                                    className={`flex items-center gap-2 rounded-xl border px-4 py-3 text-xs font-black ${
                                        contato.mostrarNoBanner
                                            ? "border-cyan-400/25 bg-cyan-500/10 text-cyan-300"
                                            : "border-white/10 bg-white/[0.04] text-zinc-400"
                                    }`}
                                >
                                    {contato.mostrarNoBanner ? (
                                        <Eye className="h-4 w-4" />
                                    ) : (
                                        <EyeOff className="h-4 w-4" />
                                    )}
                                    {contato.mostrarNoBanner
                                        ? "No banner"
                                        : "Oculto no banner"}
                                </button>
                                <button
                                    type="button"
                                    onClick={() =>
                                        atualizarContato(contato.id, {
                                            ativo: !contato.ativo
                                        })
                                    }
                                    className={`rounded-xl border px-4 py-3 text-xs font-black ${
                                        contato.ativo
                                            ? "border-emerald-400/25 bg-emerald-500/10 text-emerald-300"
                                            : "border-red-400/20 bg-red-500/10 text-red-300"
                                    }`}
                                >
                                    {contato.ativo ? "Ativo" : "Inativo"}
                                </button>
                                <button
                                    type="button"
                                    title="Excluir contato"
                                    onClick={() => excluir(contato.id)}
                                    className="rounded-xl border border-red-400/20 bg-red-500/10 p-3 text-red-300"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </button>
                            </div>
                        </div>

                        <div className="mt-5 grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(260px,0.55fr)]">
                            <div className="rounded-2xl border border-white/10 bg-zinc-950/55 p-4">
                                <div className="mb-3 flex items-center gap-2 text-sm font-black text-white">
                                    {contato.tipo === "whatsapp" ? (
                                        <MessageCircleMore className="h-4 w-4 text-emerald-400" />
                                    ) : (
                                        <Phone className="h-4 w-4 text-sky-400" />
                                    )}
                                    Número ou endereço
                                </div>

                                <div className="grid gap-3">
                                    {contato.valores.map((valor, indice) => (
                                        <div
                                            key={`${contato.id}-${indice}`}
                                            className="flex gap-2"
                                        >
                                            <input
                                                value={valor}
                                                onChange={(e) =>
                                                    atualizarValor(
                                                        contato.id,
                                                        indice,
                                                        e.target.value
                                                    )
                                                }
                                                placeholder={
                                                    contato.tipo === "site"
                                                        ? "www.exemplo.com.br"
                                                        : "(81) 00000-0000"
                                                }
                                            />
                                            {contato.valores.length > 1 && (
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        removerValor(contato.id, indice)
                                                    }
                                                    className="rounded-xl border border-red-400/20 bg-red-500/10 px-3 text-red-300"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                </div>

                                <button
                                    type="button"
                                    onClick={() => adicionarValor(contato.id)}
                                    className="mt-3 text-xs font-black text-sky-300"
                                >
                                    + Adicionar outro número
                                </button>
                            </div>

                            <label className="text-sm font-bold text-zinc-300">
                                Observação
                                <textarea
                                    className="mt-2 min-h-28 resize-none"
                                    value={contato.observacao || ""}
                                    onChange={(e) =>
                                        atualizarContato(contato.id, {
                                            observacao: e.target.value
                                        })
                                    }
                                    placeholder="Ex.: Sábados, domingos e feriados"
                                />
                            </label>
                        </div>
                    </article>
                ))}
            </section>

            <p className="text-center text-sm text-zinc-500">
                As alterações ficam no rascunho. Use “Publicar na TV” na página Início.
            </p>
        </div>
    )
}
