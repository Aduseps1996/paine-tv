import type { Midia } from "@/types/painel"

import {
    obterCorProgramacao,
    obterCorStatus,
    obterNomeTemplate,
    obterTextoProgramacao,
    obterTextoStatus,
    obterTituloMidia
} from "./helpers"

type Props = {
    midia: Midia
    onAlternar: (midia: Midia) => void
    onExcluir: (midia: Midia) => void
    onAlterarOrdem: (id: string, ordem: number) => void
    onAtualizar: (id: string, dados: Partial<Midia>) => void
    exibirExibicao: boolean
    exibirTarja: boolean
    onToggleExibicao: (midia: Midia) => void
    onToggleTarja: (midia: Midia) => void
    children?: React.ReactNode
}

export default function MidiaCard({
    midia,
    onAlternar,
    onExcluir,
    onAlterarOrdem,
    onAtualizar,
    exibirExibicao,
    exibirTarja,
    onToggleExibicao,
    onToggleTarja,
    children
}: Props) {
    const titulo = obterTituloMidia(midia)

    return (
        <article className="overflow-hidden rounded-[30px] border border-white/10 bg-zinc-900/85 shadow-[0_24px_70px_rgba(0,0,0,0.28)]">
            <div className="relative aspect-video overflow-hidden bg-black">
                {midia.tipo === "imagem" && (
                    <img
                        src={midia.arquivo}
                        alt={titulo}
                        className="absolute inset-0 h-full w-full object-contain"
                    />
                )}

                {midia.tipo === "video" && (
                    <video
                        src={midia.arquivo}
                        muted
                        controls
                        className="absolute inset-0 h-full w-full object-contain"
                    />
                )}

                {midia.tipo === "youtube" && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black px-6 text-center">
                        <div className="rounded-full border border-red-400/25 bg-red-500/10 px-4 py-2 text-sm font-black text-red-300">
                            YouTube / Live
                        </div>

                        <p className="mt-4 max-w-full break-all text-xs text-zinc-500">
                            {midia.linkYoutubeExibicao || midia.arquivo}
                        </p>
                    </div>
                )}

                <div className="absolute left-4 top-4 flex flex-wrap gap-2">
                    <span className={`rounded-full border px-3 py-1 text-xs font-black ${obterCorStatus(midia.ativo)}`}>
                        {obterTextoStatus(midia.ativo)}
                    </span>

                    <span className={`rounded-full border px-3 py-1 text-xs font-black ${obterCorProgramacao(midia.exibicaoProgramada)}`}>
                        {obterTextoProgramacao(midia)}
                    </span>
                </div>
            </div>

            <div className="p-5">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                        <h3 className="text-xl font-black leading-tight">
                            {titulo}
                        </h3>

                        <p className="mt-2 max-w-xl break-all text-sm text-zinc-500">
                            {midia.arquivo}
                        </p>
                    </div>

                    <span className="w-fit rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs font-black text-zinc-300">
                        {obterNomeTemplate(midia.template)}
                    </span>
                </div>

                <div className="mt-5 grid grid-cols-3 gap-3">
                    <div className="rounded-2xl border border-white/10 bg-zinc-950/60 p-3">
                        <p className="text-[10px] font-black uppercase tracking-[0.22em] text-zinc-500">
                            Ordem
                        </p>

                        <input
                            type="number"
                            min="1"
                            value={midia.ordem}
                            onChange={(e) => onAlterarOrdem(midia.id, Number(e.target.value))}
                            className="mt-2 w-full bg-transparent text-sm font-black text-white outline-none"
                        />
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-zinc-950/60 p-3">
                        <p className="text-[10px] font-black uppercase tracking-[0.22em] text-zinc-500">
                            Duração
                        </p>

                        {midia.tipo === "imagem" ? (
                            <input
                                type="number"
                                min="1"
                                value={midia.duracao}
                                onChange={(e) =>
                                    onAtualizar(midia.id, {
                                        duracao: Number(e.target.value)
                                    })
                                }
                                className="mt-2 w-full bg-transparent text-sm font-black text-white outline-none"
                            />
                        ) : (
                            <p className="mt-2 text-sm font-black text-zinc-300">
                                Até o fim
                            </p>
                        )}
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-zinc-950/60 p-3">
                        <p className="text-[10px] font-black uppercase tracking-[0.22em] text-zinc-500">
                            Repetição
                        </p>

                        <input
                            type="number"
                            min="1"
                            max="10"
                            value={midia.pesoExibicao || 1}
                            onChange={(e) =>
                                onAtualizar(midia.id, {
                                    pesoExibicao: Number(e.target.value)
                                })
                            }
                            className="mt-2 w-full bg-transparent text-sm font-black text-white outline-none"
                        />
                    </div>
                </div>

                <div className="mt-5 flex flex-wrap gap-3">
                    <button
                        type="button"
                        onClick={() => onAlternar(midia)}
                        className="rounded-2xl border border-zinc-700 bg-zinc-950/70 px-4 py-3 text-sm font-black text-zinc-200"
                    >
                        {midia.ativo ? "Desativar" : "Ativar"}
                    </button>

                    <button
                        type="button"
                        onClick={() => onToggleExibicao(midia)}
                        className={`rounded-2xl px-4 py-3 text-sm font-black ${
                            exibirExibicao
                                ? "border border-sky-300/30 bg-sky-500 text-white"
                                : "border border-white/10 bg-white/[0.04] text-zinc-200"
                        }`}
                    >
                        Configurar exibição
                    </button>

                    <button
                        type="button"
                        onClick={() => onToggleTarja(midia)}
                        className={`rounded-2xl px-4 py-3 text-sm font-black ${
                            exibirTarja
                                ? "border border-sky-300/30 bg-sky-500 text-white"
                                : "border border-white/10 bg-white/[0.04] text-zinc-200"
                        }`}
                    >
                        Tarja
                    </button>

                    <button
                        type="button"
                        onClick={() => onExcluir(midia)}
                        className="rounded-2xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm font-black text-red-300"
                    >
                        Excluir
                    </button>
                </div>

                {children}
            </div>
        </article>
    )
}