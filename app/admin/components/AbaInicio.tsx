import PainelTV from "@/components/tv/PainelTV"
import { usePainelDraftContext } from "../context/PainelDraftContext"

export default function AbaInicio() {
    const {
        draft,
        temAlteracoesPendentes,
        descartarAlteracoes,
        publicar,
        publicando
    } = usePainelDraftContext()

    const midiaPreview = draft.midias.find((midia) => midia.ativo)
    const logo = draft.configuracoes.logo || ""
    const nomePainel = draft.configuracoes.nomePainel || ""
    const subtitulo = draft.configuracoes.subtitulo || ""
    const tamanhoFonteRodape = draft.configuracoes.tamanhoFonteRodape || 28
    const alturaBarraNoticias = draft.configuracoes.alturaBarraNoticias || 44
    const noticiasAtivas = draft.noticias.filter((noticia) => noticia.ativo)

    void midiaPreview
    void logo
    void nomePainel
    void subtitulo
    void tamanhoFonteRodape
    void alturaBarraNoticias
    void noticiasAtivas

    return (
        <div className="space-y-4 sm:space-y-6">
            <div className="rounded-[24px] border border-white/10 bg-white/[0.03] p-4 shadow-[0_16px_40px_rgba(0,0,0,0.18)] sm:p-6">
                <div className="inline-flex rounded-full border border-sky-400/25 bg-sky-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.3em] text-sky-300">
                    Visão geral
                </div>
                <h1 className="mt-3 text-2xl sm:text-3xl md:text-4xl font-black tracking-tight">
                    Painel ao vivo
                </h1>

                <p className="mt-2 max-w-2xl text-sm text-zinc-400 sm:text-base">
                    Pré-visualização em tempo real do painel institucional da TV.
                </p>
            </div>

            <div className="rounded-[28px] border border-white/10 bg-zinc-900/80 p-4 shadow-[0_20px_50px_rgba(0,0,0,0.24)] backdrop-blur-sm sm:p-6">
                <h2 className="mb-4 text-2xl font-bold">
                    Prévia da TV
                </h2>

                <div className="mb-5 flex flex-wrap gap-3">
                    <button
                        type="button"
                        disabled={!temAlteracoesPendentes}
                        onClick={descartarAlteracoes}
                        className="rounded-xl border border-zinc-700 px-4 py-2 text-sm font-bold text-zinc-200 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                        Descartar alterações
                    </button>

                    <button
                        type="button"
                        onClick={publicar}
                        disabled={!temAlteracoesPendentes || publicando}
                        className="rounded-xl bg-sky-500 px-4 py-2 text-sm font-black text-white disabled:cursor-not-allowed disabled:opacity-40"
                    >
                        {publicando ? "Publicando..." : "Publicar na TV"}
                    </button>
                </div>

                <div className="mx-auto max-w-4xl rounded-4xl border-8 border-zinc-900 bg-zinc-950 p-4 shadow-2xl">
                    <div className="relative overflow-hidden rounded-3xl border border-zinc-700 bg-black">
                        <div className="relative aspect-video overflow-hidden bg-black">
                            <div className="absolute left-0 top-0 h-[1080px] w-[1920px] origin-top-left scale-[0.445]">
                                <PainelTV
                                    modoPreview
                                    previewConfiguracoes={draft.configuracoes}
                                    previewMidias={draft.midias}
                                    previewNoticias={draft.noticias}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="mt-4 h-4 rounded-full bg-zinc-900 mx-auto w-32" />
                </div>
            </div>
        </div>
    )
}
