import type { Midia, Noticia } from "@/types/painel"

type Props = {
    midiaPreview?: Midia
    logo: string
    nomePainel: string
    subtitulo: string
    tamanhoFonteRodape: number
    alturaBarraNoticias: number
    noticiasAtivas: Noticia[]
}

export default function AbaInicio({
    midiaPreview,
    logo,
    nomePainel,
    subtitulo,
    tamanhoFonteRodape,
    alturaBarraNoticias,
    noticiasAtivas
}: Props) {
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

                <div className="mx-auto max-w-4xl rounded-4xl border-8 border-zinc-900 bg-zinc-950 p-4 shadow-2xl">
                    <div className="relative overflow-hidden rounded-3xl border border-zinc-700 bg-black">
                        <div className="relative aspect-video bg-black">
                            {midiaPreview && midiaPreview.tipo === "imagem" && (
                                <img
                                    src={midiaPreview.arquivo}
                                    alt="Prévia do banner"
                                    className="absolute inset-0 w-full h-full object-contain bg-black"
                                />
                            )}

                            {midiaPreview && midiaPreview.tipo === "video" && (
                                <video
                                    src={midiaPreview.arquivo}
                                    muted
                                    controls
                                    className="absolute inset-0 w-full h-full object-contain bg-black"
                                />
                            )}

                            <div className="absolute top-0 left-0 w-full h-24 bg-linear-to-b from-black/80 to-transparent" />

                            {(logo.trim() !== "" || nomePainel.trim() !== "" || subtitulo.trim() !== "") && (
                                <div className="absolute top-5 left-6 flex items-center gap-4">
                                    {logo.trim() !== "" && (
                                        <img
                                            src={logo}
                                            alt="Logo"
                                            className="w-14 h-14 object-contain"
                                        />
                                    )}

                                    {(nomePainel.trim() !== "" || subtitulo.trim() !== "") && (
                                        <div>
                                            {nomePainel.trim() !== "" && (
                                                <h3 className="text-2xl font-black tracking-wider leading-none">
                                                    {nomePainel}
                                                </h3>
                                            )}

                                            {subtitulo.trim() !== "" && (
                                                <p className="text-xs text-zinc-300 mt-1">
                                                    {subtitulo}
                                                </p>
                                            )}
                                        </div>
                                    )}
                                </div>
                            )}

                            {midiaPreview?.mostrarTarja && (
                                <div className="absolute left-4 right-4 top-20 rounded-3xl border border-white/10 bg-black/75 p-4 text-white shadow-lg">
                                    <p className="text-[11px] uppercase tracking-[0.3em] text-sky-300">
                                        {midiaPreview.tarjaEtiqueta || "TARJA"}
                                    </p>
                                    {midiaPreview.tarjaTitulo && (
                                        <h3 className="text-xl font-black mt-2">
                                            {midiaPreview.tarjaTitulo}
                                        </h3>
                                    )}
                                    {midiaPreview.tarjaSubtitulo && (
                                        <p className="text-sm text-zinc-300 mt-2">
                                            {midiaPreview.tarjaSubtitulo}
                                        </p>
                                    )}
                                </div>
                            )}

                            <div className="absolute bottom-0 left-0 w-full text-white z-20 overflow-hidden">
                                <div
                                    className="bg-[#2454a4] flex items-center overflow-hidden px-6"
                                    style={{
                                        height: `${alturaBarraNoticias}px`
                                    }}
                                >
                                    <p
                                        className="font-medium whitespace-nowrap"
                                        style={{ fontSize: `${tamanhoFonteRodape}px` }}
                                    >
                                        {noticiasAtivas.length > 0
                                            ? noticiasAtivas.map((noticia) => noticia.texto).join("   •   ")
                                            : "Prévia das notícias do rodapé"}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="mt-4 h-4 rounded-full bg-zinc-900 mx-auto w-32" />
                </div>
            </div>
        </div>
    )
}
