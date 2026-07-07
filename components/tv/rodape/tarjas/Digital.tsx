"use client"

type DigitalProps = {
    logo: string
    tituloTarja: string
    subtituloTarja: string
    etiquetaTarja: string
    hora: string
    temperaturaAtual: number | null
    codigoClimaAtual: number | null
    erroClima: boolean
    faseTarja: "oculta" | "entrando" | "visivel" | "saindo"
    tempoEntradaTarja: number
    tempoSaidaTarja: number
    qrcode?: string
}

export default function Digital({
    logo,
    tituloTarja,
    subtituloTarja,
    etiquetaTarja,
    hora,
    temperaturaAtual,
    codigoClimaAtual,
    erroClima,
    faseTarja,
    tempoEntradaTarja,
    tempoSaidaTarja,
    qrcode
}: DigitalProps) {
    const classeTransicao =
        faseTarja === "entrando" || faseTarja === "visivel"
            ? "translate-x-0 opacity-100"
            : "-translate-x-full opacity-0"

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
        <div className={`fixed left-0 top-0 z-40 h-[100dvh] w-[min(50vw,900px)] transition-all ${classeTransicao}`} style={{ transitionDuration: faseTarja === "entrando" ? `${tempoEntradaTarja}s` : faseTarja === "saindo" ? `${tempoSaidaTarja}s` : "0s" }}>
            <div className="relative h-full w-full overflow-hidden bg-[#020b1d]/95 shadow-[30px_0_90px_rgba(0,0,0,0.75)] backdrop-blur-xl">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(13,92,255,0.55),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(255,75,35,0.35),transparent_32%),linear-gradient(135deg,rgba(255,255,255,0.10),transparent_45%)]" />
                <div className="absolute inset-0 opacity-25 bg-[linear-gradient(120deg,transparent_0%,rgba(255,255,255,0.10)_50%,transparent_100%)]" />
                <div className="absolute right-0 top-0 h-full w-[3px] bg-gradient-to-b from-[#073bd9] via-[#34bcf8] to-[#f15434] shadow-[0_0_35px_rgba(52,188,248,0.9)]" />

                <div className="relative flex h-full flex-col text-white" style={{ paddingLeft: "clamp(20px,2.8vw,56px)", paddingRight: "clamp(20px,2.8vw,56px)", paddingTop: "clamp(12px,2vh,24px)", paddingBottom: "clamp(16px,4vh,64px)" }}>
                    <div className="flex items-center justify-between">
                        {logo.trim() !== "" && (
                            <img src={logo} alt="Logo ADUSEPS" className="h-[clamp(38px,5vh,64px)] w-auto object-contain" />
                        )}
                    </div>

                    <div className="mt-[clamp(10px,2vh,24px)] text-center">
                        <div className="mb-[clamp(14px,3vh,28px)] inline-flex rounded-md bg-gradient-to-r from-[#bb2c63] to-[#f15434] px-[clamp(14px,2vw,24px)] py-[clamp(6px,1vh,8px)] shadow-lg">
                            <span className="text-[clamp(10px,0.85vw,14px)] font-black uppercase tracking-[0.25em] text-white">
                                {etiquetaTarja}
                            </span>
                        </div>

                        <h2 className="font-black uppercase leading-[0.92] tracking-wide text-white drop-shadow-[0_8px_20px_rgba(0,0,0,0.55)]" style={{ fontSize: "clamp(32px,3.2vw,68px)" }}>
                            {tituloTarja}
                        </h2>

                        {subtituloTarja && (
                            <p className="mx-auto mt-[clamp(12px,2.5vh,24px)] max-w-[620px] font-medium leading-tight text-white/82" style={{ fontSize: "clamp(17px,1.55vw,30px)" }}>
                                {subtituloTarja}
                            </p>
                        )}
                    </div>

                    <div className="mt-auto flex flex-col items-center justify-center pt-[clamp(16px,3vh,32px)] pb-[clamp(4px,1vh,8px)]">
                        {qrcode && qrcode.trim() !== "" ? (
                            <div className="relative rounded-[clamp(1rem,2vw,1.7rem)] bg-white p-[clamp(8px,1.2vw,16px)] shadow-[0_0_35px_rgba(13,92,255,0.75)]">
                                <div className="absolute -inset-2 rounded-[2rem] border border-[#34bcf8]/60" />
                                <img src={`https://api.qrserver.com/v1/create-qr-code/?size=260x260&data=${encodeURIComponent(qrcode)}`} alt="QR Code" className="relative h-[min(20vw,26vh,224px)] w-[min(20vw,26vh,224px)]" />
                            </div>
                        ) : (
                            <div className="flex h-[min(20vw,26vh,224px)] w-[min(20vw,26vh,224px)] items-center justify-center rounded-[clamp(1rem,2vw,1.7rem)] border border-white/15 bg-white/10 text-center shadow-[0_0_35px_rgba(13,92,255,0.35)]">
                                <span className="px-6 text-[clamp(10px,0.9vw,14px)] font-black uppercase tracking-[0.20em] text-white/45">QR Code opcional</span>
                            </div>
                        )}

                        <div className="mt-[clamp(12px,2vh,20px)] flex items-center gap-[clamp(8px,1vw,12px)]">
                            <span className="text-[clamp(26px,2.5vw,40px)]">📷</span>
                            <div className="text-left">
                                <p className="text-[clamp(10px,0.9vw,14px)] font-black uppercase tracking-[0.16em] text-white">Nos siga no Instagram</p>
                                <p className="text-[clamp(16px,1.5vw,24px)] font-black text-[#f15434]">@aduseps</p>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-2xl border border-white/15 bg-white/8 px-[clamp(14px,2vw,24px)] py-[clamp(10px,1.6vh,16px)] shadow-[0_0_30px_rgba(13,92,255,0.25)] backdrop-blur-md">
                        <div className="flex items-center justify-between gap-[clamp(10px,1.5vw,24px)]">
                            <div className="flex items-center gap-[clamp(8px,1.2vw,16px)]">
                                <div className="flex h-[clamp(40px,5vh,56px)] w-[clamp(40px,5vh,56px)] items-center justify-center rounded-xl border border-[#0d5cff]/60 text-[clamp(24px,2.4vw,36px)] text-[#0d5cff]">🕘</div>
                                <div>
                                    <span className="block font-black leading-none text-white" style={{ fontSize: "clamp(28px,2.8vw,52px)" }}>{hora}</span>
                                    <span className="text-[clamp(9px,0.8vw,14px)] font-black uppercase tracking-[0.12em] text-[#2b8cff]">Horário atual</span>
                                </div>
                            </div>
                            <div className="h-[clamp(36px,5vh,56px)] w-px bg-white/25" />
                            <div className="flex items-center gap-4 text-right">
                                <div>
                                    <span className="block text-[clamp(24px,2.4vw,42px)] font-black leading-none text-white">
                                        {erroClima || temperaturaAtual === null ? "--" : `${obterIconeClima(codigoClimaAtual)} ${temperaturaAtual}°C`}
                                    </span>
                                    <span className="text-[clamp(9px,0.8vw,14px)] font-black uppercase tracking-[0.12em] text-[#2b8cff]">Recife / PE</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="absolute bottom-0 left-0 h-1.5 w-full bg-gradient-to-r from-[#073bd9] via-[#bb2c63] to-[#f15434]" />
                </div>
            </div>
        </div>
    )
}
