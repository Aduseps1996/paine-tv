"use client"

type LiveProps = {
    tituloTarja: string
    subtituloTarja: string
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

export default function Live({
    tituloTarja,
    subtituloTarja,
    hora,
    temperaturaAtual,
    codigoClimaAtual,
    erroClima,
    tamanhoFonteSlogan,
    tamanhoFonteHora,
    faseTarja,
    tempoEntradaTarja,
    tempoSaidaTarja
}: LiveProps) {
    const classeTransicao =
        faseTarja === "entrando" || faseTarja === "visivel"
            ? "translate-x-0 opacity-100"
            : "-translate-x-[120%] opacity-0"

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
            <div className="relative flex h-[92px] items-stretch overflow-hidden rounded-2xl border border-white/15 bg-[#071633]/95 shadow-[0_18px_60px_rgba(0,0,0,0.65)] backdrop-blur-xl">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(13,92,255,0.45),transparent_35%),linear-gradient(135deg,rgba(255,255,255,0.12),transparent_45%)]" />
                <div className="relative z-20 flex w-[165px] shrink-0 flex-col items-center justify-center bg-gradient-to-br from-[#e43d30] via-[#b91c1c] to-[#6f0f0f] text-white">
                    <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.22),transparent_55%)]" />
                    <span className="relative text-[28px] font-light leading-none tracking-[0.08em]">LIVE</span>
                    <span className="relative mt-1 text-[14px] font-black uppercase tracking-[0.35em]">NEWS</span>
                </div>
                <div className="relative z-10 -ml-5 w-16 shrink-0 skew-x-[-28deg] bg-[#071633]" />
                <div className="relative -ml-8 flex min-w-0 flex-1 flex-col justify-center px-10">
                    <div className="absolute left-0 top-1/2 h-12 w-px -translate-y-1/2 bg-white/15" />
                    <h2 className="font-black uppercase leading-tight text-white drop-shadow line-clamp-2" style={{ fontSize: `${Math.max(tamanhoFonteSlogan + 8, 26)}px` }}>
                        {tituloTarja}
                    </h2>
                    <div className="mt-2 flex min-w-0 items-center gap-3">
                        <div className="h-[3px] w-12 shrink-0 rounded-full bg-[#f15434]" />
                        <p className="truncate font-semibold text-white/75" style={{ fontSize: `${Math.max(tamanhoFonteSlogan - 2, 14)}px` }}>
                            {subtituloTarja}
                        </p>
                    </div>
                </div>
                <div className="relative flex w-[165px] shrink-0 flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-[#0d5cff] via-[#073bd9] to-[#03153d] text-white">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(52,188,248,0.45),transparent_48%)]" />
                    <div className="absolute -left-5 top-0 h-full w-10 skew-x-[-18deg] bg-white/15" />
                    <span className="relative text-[10px] font-black uppercase tracking-[0.30em] text-white/65">Recife</span>
                    <span className="relative mt-1 text-3xl font-black leading-none drop-shadow">
                        {erroClima || temperaturaAtual === null ? "--" : `${obterIconeClima(codigoClimaAtual)} ${temperaturaAtual}°C`}
                    </span>
                </div>
                <div className="relative flex w-[145px] shrink-0 flex-col items-center justify-center overflow-hidden bg-[#020b1d] text-white">
                    <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.12),transparent_55%)]" />
                    <span className="relative text-[10px] font-black uppercase tracking-[0.28em] text-white/55">Ao vivo</span>
                    <span className="relative mt-1 font-black leading-none tracking-tight text-white" style={{ fontSize: `${Math.max(tamanhoFonteHora + 2, 26)}px` }}>
                        {hora}
                    </span>
                </div>
                <div className="absolute bottom-0 left-0 h-1.5 w-full bg-gradient-to-r from-[#e43d30] via-[#0d5cff] to-[#34bcf8]" />
            </div>
        </div>
    )
}
