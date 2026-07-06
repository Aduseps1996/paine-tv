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

    const totalMidias = draft.midias.length
    const midiasAtivas = draft.midias.filter((midia) => midia.ativo).length

    const totalNoticias = draft.noticias.length
    const noticiasAtivas = draft.noticias.filter((noticia) => noticia.ativo).length

    const statusTexto = temAlteracoesPendentes
        ? "Alterações pendentes"
        : "TV sincronizada"

    const statusClasse = temAlteracoesPendentes
        ? "border-amber-400/30 bg-amber-400/10 text-amber-300"
        : "border-emerald-400/30 bg-emerald-400/10 text-emerald-300"

    return (
        <div className="space-y-8">

            {/* CABEÇALHO */}
            <section className="rounded-[28px] border border-white/10 bg-gradient-to-br from-white/[0.06] to-white/[0.02] p-5 shadow-[0_20px_60px_rgba(0,0,0,0.22)] sm:p-7">
                <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                        <div className="inline-flex rounded-full border border-sky-400/25 bg-sky-500/10 px-3 py-1 text-[11px] font-black uppercase tracking-[0.32em] text-sky-300">
                            Central de publicação
                        </div>

                        <h1 className="mt-4 text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl">
                            Painel TV
                        </h1>

                        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-zinc-400 sm:text-base">
                            Edite o rascunho, revise a prévia e publique na TV somente quando estiver tudo pronto.
                        </p>
                    </div>

                    <div className="flex flex-wrap gap-3">
                        <button
                            type="button"
                            disabled={!temAlteracoesPendentes || publicando}
                            onClick={descartarAlteracoes}
                            className="rounded-2xl border border-zinc-700 bg-zinc-900/80 px-5 py-3 text-sm font-bold text-zinc-200 shadow-lg disabled:cursor-not-allowed disabled:opacity-40"
                        >
                            Descartar alterações
                        </button>

                        <button
                            type="button"
                            onClick={publicar}
                            disabled={!temAlteracoesPendentes || publicando}
                            className="rounded-2xl border border-sky-300/20 bg-sky-500 px-6 py-3 text-sm font-black text-white shadow-[0_14px_35px_rgba(14,165,233,0.28)] disabled:cursor-not-allowed disabled:opacity-40"
                        >
                            {publicando ? "Publicando..." : "Publicar na TV"}
                        </button>
                    </div>
                </div>
            </section>

            {/* CARDS */}
            <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                <div className="rounded-[26px] border border-white/10 bg-zinc-900/80 p-5 shadow-[0_16px_40px_rgba(0,0,0,0.18)]">
                    <p className="text-xs font-black uppercase tracking-[0.25em] text-zinc-500">
                        Status
                    </p>

                    <div className={`mt-4 inline-flex rounded-full border px-3 py-1 text-sm font-black ${statusClasse}`}>
                        {statusTexto}
                    </div>

                    <p className="mt-4 text-sm text-zinc-400">
                        {temAlteracoesPendentes
                            ? "Existem mudanças no rascunho ainda não publicadas."
                            : "A prévia está igual ao painel publicado."}
                    </p>
                </div>

                <div className="rounded-[26px] border border-white/10 bg-zinc-900/80 p-5 shadow-[0_16px_40px_rgba(0,0,0,0.18)]">
                    <p className="text-xs font-black uppercase tracking-[0.25em] text-zinc-500">
                        Mídias
                    </p>

                    <div className="mt-4 flex items-end gap-2">
                        <span className="text-5xl font-black">{totalMidias}</span>
                        <span className="mb-2 text-sm font-bold text-zinc-400">cadastradas</span>
                    </div>

                    <p className="mt-3 text-sm text-zinc-400">
                        {midiasAtivas} ativas no rascunho.
                    </p>
                </div>

                <div className="rounded-[26px] border border-white/10 bg-zinc-900/80 p-5 shadow-[0_16px_40px_rgba(0,0,0,0.18)]">
                    <p className="text-xs font-black uppercase tracking-[0.25em] text-zinc-500">
                        Notícias
                    </p>

                    <div className="mt-4 flex items-end gap-2">
                        <span className="text-5xl font-black">{totalNoticias}</span>
                        <span className="mb-2 text-sm font-bold text-zinc-400">mensagens</span>
                    </div>

                    <p className="mt-3 text-sm text-zinc-400">
                        {noticiasAtivas} ativas no rodapé.
                    </p>
                </div>

                <div className="rounded-[26px] border border-white/10 bg-zinc-900/80 p-5 shadow-[0_16px_40px_rgba(0,0,0,0.18)]">
                    <p className="text-xs font-black uppercase tracking-[0.25em] text-zinc-500">
                        Modo
                    </p>

                    <div className="mt-4 text-3xl font-black text-sky-300">
                        Rascunho
                    </div>

                    <p className="mt-3 text-sm text-zinc-400">
                        A TV só muda depois da publicação.
                    </p>
                </div>
            </section>

            {/* PRÉVIA */}
            <section className="rounded-[34px] border border-white/10 bg-zinc-900/85 p-5 shadow-[0_24px_70px_rgba(0,0,0,0.32)] backdrop-blur-sm sm:p-7">
                <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                        <h2 className="text-2xl font-black sm:text-3xl">
                            Prévia da TV
                        </h2>

                        <p className="mt-2 text-sm text-zinc-400 sm:text-base">
                            Esta é a visualização do rascunho atual, antes de enviar para o painel.
                        </p>
                    </div>

                    <div className="inline-flex w-fit rounded-full border border-emerald-400/25 bg-emerald-400/10 px-4 py-2 text-sm font-black text-emerald-300">
                        Prévia em tempo real
                    </div>
                </div>

                <div className="mx-auto max-w-6xl rounded-[32px] border-8 border-zinc-950 bg-black p-4 shadow-2xl">
                    <div className="relative overflow-hidden rounded-[24px] border border-zinc-800 bg-black">
                        <div className="relative aspect-video overflow-hidden bg-black">
    <div className="absolute inset-0">
        <PainelTV
            modoPreview
            previewConfiguracoes={draft.configuracoes}
            previewMidias={draft.midias}
            previewNoticias={draft.noticias}
        />
    </div>
</div>
                    </div>

                    <div className="mx-auto mt-4 h-4 w-32 rounded-full bg-zinc-950" />
                </div>
            </section>

            {/* RESUMO INFERIOR */}
            <section className="grid gap-4 lg:grid-cols-3">
                <div className="rounded-[26px] border border-white/10 bg-white/[0.03] p-5">
                    <h3 className="text-lg font-black">
                        Fluxo de trabalho
                    </h3>

                    <p className="mt-3 text-sm leading-relaxed text-zinc-400">
                        Configure mídias, notícias, clima e identidade visual. Depois volte aqui para revisar e publicar.
                    </p>
                </div>

                <div className="rounded-[26px] border border-white/10 bg-white/[0.03] p-5">
                    <h3 className="text-lg font-black">
                        Segurança
                    </h3>

                    <p className="mt-3 text-sm leading-relaxed text-zinc-400">
                        Nenhuma alteração aparece na TV enquanto não for publicada.
                    </p>
                </div>

                <div className="rounded-[26px] border border-white/10 bg-white/[0.03] p-5">
                    <h3 className="text-lg font-black">
                        Publicação
                    </h3>

                    <p className="mt-3 text-sm leading-relaxed text-zinc-400">
                        Ao publicar, configurações, mídias e notícias são sincronizadas com o painel.
                    </p>
                </div>
            </section>
        </div>
    )
}