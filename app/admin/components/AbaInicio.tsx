type Props = {
    midiaPreview: any
    logo: string
    nomePainel: string
    subtitulo: string
    slogan: string
    tamanhoFonteDataHora: number
    tamanhoFonteHora: number
    tamanhoFonteSlogan: number
    tamanhoLogoRodape: number
    tamanhoFonteRodape: number
    alturaBarraSuperior: number
    alturaBarraNoticias: number
    noticiasAtivas: any[]
}

export default function AbaInicio({
    midiaPreview,
    logo,
    nomePainel,
    subtitulo,
    slogan,
    tamanhoFonteDataHora,
    tamanhoFonteHora,
    tamanhoFonteSlogan,
    tamanhoLogoRodape,
    tamanhoFonteRodape,
    alturaBarraSuperior,
    alturaBarraNoticias,
    noticiasAtivas
}: Props) {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-4xl font-black">
                    Painel ao vivo
                </h1>

                <p className="mt-2 text-zinc-400">
                    Pré-visualização em tempo real do painel institucional da TV.
                </p>
            </div>

            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 mb-6">
                <h2 className="text-2xl font-bold mb-4">
                    Prévia da TV
                </h2>

                <div className="relative w-full aspect-video bg-black rounded-2xl overflow-hidden border border-zinc-700">
                    {midiaPreview && midiaPreview.tipo === "imagem" && (
                        <img
                            src={midiaPreview.arquivo}
                            alt="Prévia do banner"
                            className="absolute inset-0 w-full h-full object-cover"
                        />
                    )}

                    {midiaPreview && midiaPreview.tipo === "video" && (
                        <video
                            src={midiaPreview.arquivo}
                            muted
                            controls
                            className="absolute inset-0 w-full h-full object-cover"
                        />
                    )}

                    <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-black/80 to-transparent" />

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

                    <div className="absolute bottom-0 left-0 w-full text-white z-20 overflow-hidden">
                        <div
                            className="bg-[#0f2f70] border-t-4 border-[#f15434] flex items-center px-8 gap-6"
                            style={{ height: `${alturaBarraSuperior}px` }}
                        >
                            <span
                                className="font-semibold"
                                style={{ fontSize: `${tamanhoFonteDataHora}px` }}
                            >
                                26 de maio de 2026
                            </span>

                            <div className="h-8 w-px bg-white/25" />

                            <span
                                className="font-black"
                                style={{ fontSize: `${tamanhoFonteHora}px` }}
                            >
                                14:30
                            </span>

                            <div className="h-8 w-px bg-white/25" />

                            <p
                                className="font-medium text-white/90 tracking-wide flex-1"
                                style={{ fontSize: `${tamanhoFonteSlogan}px` }}
                            >
                                {slogan || "Slogan do rodapé"}
                            </p>

                            {logo.trim() !== "" && (
                                <>
                                    <div className="h-8 w-px bg-white/25" />

                                    <img
                                        src={logo}
                                        alt="Logo ADUSEPS"
                                        className="w-auto object-contain drop-shadow-md"
                                        style={{ height: `${tamanhoLogoRodape}px` }}
                                    />
                                </>
                            )}
                        </div>

                        <div
                            className="bg-[#2454a4] flex items-center overflow-hidden px-6"
                            style={{ height: `${alturaBarraNoticias}px` }}
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
        </div>
    )
}