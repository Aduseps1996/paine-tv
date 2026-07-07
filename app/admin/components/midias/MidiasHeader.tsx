export default function MidiasHeader() {
    return (
        <section className="rounded-[28px] border border-white/10 bg-gradient-to-br from-white/[0.06] to-white/[0.02] p-5 shadow-[0_20px_60px_rgba(0,0,0,0.22)] sm:p-7">
            <div>
                <div className="inline-flex rounded-full border border-sky-400/25 bg-sky-500/10 px-3 py-1 text-[11px] font-black uppercase tracking-[0.32em] text-sky-300">
                    Biblioteca de mídias
                </div>

                <h1 className="mt-4 text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl">
                    Gerenciamento de conteúdo
                </h1>

                <p className="mt-3 max-w-3xl text-sm leading-relaxed text-zinc-400 sm:text-base">
                    Organize banners, vídeos, lives e campanhas. Tudo fica no rascunho até ser publicado na TV.
                </p>
            </div>
        </section>
    )
}