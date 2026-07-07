"use client"

type CompactaProps = {
    tituloTarja: string
    subtituloTarja: string
    etiquetaTarja: string
    faseTarja: "oculta" | "entrando" | "visivel" | "saindo"
    tempoEntradaTarja: number
    tempoSaidaTarja: number
}

export default function Compacta({
    tituloTarja,
    subtituloTarja,
    etiquetaTarja,
    faseTarja,
    tempoEntradaTarja,
    tempoSaidaTarja
}: CompactaProps) {
    const classeTransicao =
        faseTarja === "entrando" || faseTarja === "visivel"
            ? "translate-x-0 opacity-100"
            : "-translate-x-[120%] opacity-0"

    return (
        <div className={`relative mx-auto w-[92vw] transition-all ${classeTransicao}`} style={{ transitionDuration: faseTarja === "entrando" ? `${tempoEntradaTarja}s` : faseTarja === "saindo" ? `${tempoSaidaTarja}s` : "0s" }}>
            <div className="rounded-2xl border border-white/10 bg-black/75 px-8 py-3 shadow-2xl backdrop-blur-md">
                <div className="flex items-center gap-4">
                    <span className="text-xs font-black uppercase tracking-[0.18em] text-[#34bcf8]">{etiquetaTarja}</span>
                    <div className="h-4 w-px bg-white/20" />
                    <span className="truncate text-xl font-bold text-white">{tituloTarja}</span>
                </div>

                {subtituloTarja && (
                    <p className="mt-1 truncate text-sm text-white/70">{subtituloTarja}</p>
                )}
            </div>
        </div>
    )
}
