"use client"

type InfobarProps = {
    tituloTarja: string
    subtituloTarja: string
    etiquetaTarja: string
    hora: string
    temperaturaAtual: number | null
    codigoClimaAtual: number | null
    erroClima: boolean
    tamanhoFonteSlogan: number
    tamanhoFonteHora: number
    faseTarja: "oculta" | "entrando" | "visivel" | "saindo"
    tempoEntradaTarja: number
    tempoSaidaTarja: number
}

export default function Infobar({
    tituloTarja,
    subtituloTarja,
    etiquetaTarja,
    hora,
    temperaturaAtual,
    codigoClimaAtual,
    erroClima,
    tamanhoFonteSlogan,
    tamanhoFonteHora,
    faseTarja,
    tempoEntradaTarja,
    tempoSaidaTarja
}: InfobarProps) {
    const classeTransicao =
        faseTarja === "entrando" || faseTarja === "visivel"
            ? "translate-y-0 opacity-100 scale-100"
            : "translate-y-8 opacity-0 scale-[0.98]"

    function obterIconeClima(codigo: number | null) {
        if (codigo === null) return "🌤️"
        if (codigo === 0) return "☀️"
        if ([1, 2, 3].includes(codigo)) return "🌤️"
        if ([45, 48].includes(codigo)) return "🌫️"
        if ([51, 53, 55, 56, 57].includes(codigo)) return "🌦️"
        if ([61, 63, 65, 66, 67, 80, 81, 82].includes(codigo)) return "🌧️"
        if ([95, 96, 99].includes(codigo)) return "⛈️"
        return "🌤️"
    }

    return (
        <div className={`relative mx-auto w-[94vw] transition-all ${classeTransicao}`} style={{ transitionDuration: faseTarja === "entrando" ? `${tempoEntradaTarja}s` : faseTarja === "saindo" ? `${tempoSaidaTarja}s` : "0s" }}>
            <div className="relative overflow-hidden rounded-2xl border border-white/15 bg-[#061a3d]/90 shadow-[0_18px_60px_rgba(0,0,0,0.60)] backdrop-blur-xl">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(13,92,255,0.45),transparent_34%),linear-gradient(135deg,rgba(255,255,255,0.12),transparent_45%)]" />
                <div className="relative flex h-[76px] items-center">
                    <div className="relative flex h-full w-[145px] shrink-0 flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-[#0d5cff] via-[#073bd9] to-[#03153d] text-white">
                        <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.22),transparent_55%)]" />
                        <div className="absolute -right-4 top-0 h-full w-10 skew-x-[-18deg] bg-white/15" />
                        <span className="relative text-[10px] font-black uppercase tracking-[0.30em] text-white/70">Agora</span>
                        <span className="relative font-black leading-none drop-shadow" style={{ fontSize: `${Math.max(tamanhoFonteHora + 2, 26)}px` }}>
                            {hora}
                        </span>
                    </div>
                    <div className="relative flex h-full shrink-0 items-center overflow-hidden bg-gradient-to-br from-[#ff6b3d] via-[#f15434] to-[#b72718] px-5">
                        <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.25),transparent_55%)]" />
                        <span className="relative text-xs font-black uppercase tracking-[0.22em] text-white drop-shadow">{etiquetaTarja}</span>
                    </div>
                    <div className="relative flex min-w-0 flex-1 flex-col justify-center px-7">
                        <div className="absolute left-0 top-1/2 h-10 w-px -translate-y-1/2 bg-white/15" />
                        <h2 className="truncate font-black uppercase leading-none text-white drop-shadow" style={{ fontSize: `${Math.max(tamanhoFonteSlogan + 5, 23)}px` }}>
                            {tituloTarja}
                        </h2>
                        {subtituloTarja && (
                            <p className="mt-1 truncate font-semibold text-white/70" style={{ fontSize: `${Math.max(tamanhoFonteSlogan - 4, 13)}px` }}>
                                {subtituloTarja}
                            </p>
                        )}
                    </div>
                    <div className="relative flex h-full w-[180px] shrink-0 flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-[#10264d] via-[#0b2a5c] to-[#061a3d] text-white">
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(52,188,248,0.35),transparent_45%)]" />
                        <div className="absolute -left-4 top-0 h-full w-10 skew-x-[-18deg] bg-white/10" />
                        <span className="relative text-[10px] font-black uppercase tracking-[0.28em] text-white/65">Recife</span>
                        <span className="relative mt-1 text-2xl font-black leading-none drop-shadow">
                            {erroClima || temperaturaAtual === null ? "--" : `${obterIconeClima(codigoClimaAtual)} ${temperaturaAtual}°C`}
                        </span>
                    </div>
                </div>

                <div className="relative h-1.5 overflow-hidden bg-[#061a3d]">
                    <div className="absolute inset-y-0 left-0 w-1/2 bg-gradient-to-r from-[#073bd9] via-[#34bcf8] to-[#f15434]" />
                    <div className="absolute inset-y-0 right-0 w-1/2 bg-gradient-to-r from-[#f15434] via-[#073bd9] to-[#34bcf8]" />
                </div>
            </div>
        </div>
    )
}
