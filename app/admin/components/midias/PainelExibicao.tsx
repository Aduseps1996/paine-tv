import type { Midia } from "@/types/painel"

type Props = {
    midia: Midia
    exibicaoProgramada: boolean
    setExibicaoProgramada: (valor: boolean) => void
    inicioExibicao: string
    setInicioExibicao: (valor: string) => void
    fimExibicao: string
    setFimExibicao: (valor: string) => void
    linkYoutubeExibicao: string
    setLinkYoutubeExibicao: (valor: string) => void
    onSalvar: () => void
    onCancelar: () => void
}

export default function PainelExibicao({
    midia,
    exibicaoProgramada,
    setExibicaoProgramada,
    inicioExibicao,
    setInicioExibicao,
    fimExibicao,
    setFimExibicao,
    linkYoutubeExibicao,
    setLinkYoutubeExibicao,
    onSalvar,
    onCancelar
}: Props) {
    const ehYoutube = midia.tipo === "youtube"

    return (
        <div className="mt-5 rounded-[26px] border border-white/10 bg-white/[0.03] p-5">
            <div className="mb-5">
                <div className="inline-flex rounded-full border border-sky-400/25 bg-sky-500/10 px-3 py-1 text-[11px] font-black uppercase tracking-[0.28em] text-sky-300">
                    Exibição
                </div>

                <h3 className="mt-3 text-xl font-black">
                    Configurar exibição
                </h3>

                <p className="mt-2 text-sm leading-relaxed text-zinc-400">
                    Defina se esta mídia será exibida continuamente ou apenas dentro de um período.
                </p>
            </div>

            <div className="space-y-4">
                {!ehYoutube && (
                    <label className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-zinc-950/60 px-4 py-4">
                        <div>
                            <p className="font-bold text-white">
                                Exibição programada
                            </p>

                            <p className="mt-1 text-sm text-zinc-400">
                                Quando ativada, a mídia só aparece no intervalo definido.
                            </p>
                        </div>

                        <input
                            type="checkbox"
                            checked={exibicaoProgramada}
                            onChange={(e) => setExibicaoProgramada(e.target.checked)}
                        />
                    </label>
                )}

                {ehYoutube && (
                    <div className="rounded-2xl border border-white/10 bg-zinc-950/60 p-4">
                        <p className="text-sm font-black uppercase tracking-[0.22em] text-zinc-300">
                            YouTube / Live
                        </p>

                        <p className="mt-2 text-sm text-zinc-400">
                            Transmissões precisam de início e fim para não travarem a grade.
                        </p>

                        <input
                            type="text"
                            placeholder="Link da live ou vídeo"
                            value={linkYoutubeExibicao}
                            onChange={(e) => setLinkYoutubeExibicao(e.target.value)}
                            className="mt-4"
                        />
                    </div>
                )}

                {(exibicaoProgramada || ehYoutube) && (
                    <div className="grid gap-4 sm:grid-cols-2">
                        <div>
                            <label className="mb-2 block text-sm font-bold text-zinc-300">
                                Início
                            </label>

                            <input
                                type="datetime-local"
                                value={inicioExibicao}
                                onChange={(e) => setInicioExibicao(e.target.value)}
                            />
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-bold text-zinc-300">
                                Fim
                            </label>

                            <input
                                type="datetime-local"
                                value={fimExibicao}
                                onChange={(e) => setFimExibicao(e.target.value)}
                            />
                        </div>
                    </div>
                )}
            </div>

            <div className="mt-5 flex flex-wrap gap-3">
                <button
                    type="button"
                    onClick={onSalvar}
                    className="rounded-2xl border border-sky-300/20 bg-sky-500 px-5 py-3 text-sm font-black text-white shadow-[0_14px_35px_rgba(14,165,233,0.22)]"
                >
                    Salvar no rascunho
                </button>

                <button
                    type="button"
                    onClick={onCancelar}
                    className="rounded-2xl border border-zinc-700 bg-zinc-900/80 px-5 py-3 text-sm font-bold text-zinc-200"
                >
                    Fechar
                </button>
            </div>
        </div>
    )
}