"use client"

import { useMemo } from "react"

import { useTarjaPainel } from "@/hooks/tv/useTarjaPainel"
import type { ConfiguracoesPainel, Midia, ModeloTarja } from "@/types/painel"

type TarjaTVProps = {
    logo: string
    slogan: string
    data: string
    hora: string
    midiaAtual?: Midia | null
    mostrarTarja: boolean
    modeloTarja: ModeloTarja
    tamanhoFonteSlogan: number
    tamanhoFonteHora: number
    tamanhoLogoRodape: number
    tempoEntradaTarja: number
    tempoVisivelTarja: number
    tempoSaidaTarja: number
    tempoOcultaTarja: number
    tempoInicialTarja: number
    temperaturaAtual: number | null
    codigoClimaAtual: number | null
    erroClima: boolean
    configuracoes?: ConfiguracoesPainel
    midiaId?: string
}

export default function TarjaTV({
    logo,
    slogan,
    data,
    hora,
    midiaAtual,
    mostrarTarja,
    modeloTarja,
    tamanhoFonteSlogan,
    tamanhoFonteHora,
    tamanhoLogoRodape,
    tempoEntradaTarja,
    tempoVisivelTarja,
    tempoSaidaTarja,
    tempoOcultaTarja,
    tempoInicialTarja,
    temperaturaAtual,
    codigoClimaAtual,
    erroClima,
    midiaId
}: TarjaTVProps) {
    const { faseTarja, mostrarQrTelejornal } = useTarjaPainel({
        mostrarTarja,
        modeloTarja,
        tempoEntradaTarja,
        tempoVisivelTarja,
        tempoSaidaTarja,
        tempoOcultaTarja,
        tempoInicialTarja,
        midiaId
    })

    const etiquetaTarjaFinal = midiaAtual?.tarjaEtiqueta || "ADUSEPS INFORMA"
    const tituloTarjaFinal = midiaAtual?.tarjaTitulo || slogan || "Informação e compromisso com o associado"
    const subtituloTarjaFinal = midiaAtual?.tarjaSubtitulo || data

    const mostrarModelo = useMemo(() => mostrarTarja, [mostrarTarja])

    if (!mostrarModelo) {
        return null
    }

    const classeTransicao =
        faseTarja === "entrando" || faseTarja === "visivel"
            ? "translate-x-0 opacity-100"
            : "-translate-x-[120%] opacity-0"

    const estiloTransicao = {
        transitionDuration:
            faseTarja === "entrando"
                ? `${tempoEntradaTarja}s`
                : faseTarja === "saindo"
                    ? `${tempoSaidaTarja}s`
                    : "0s"
    }

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
        <div className="absolute left-0 right-0 z-30 pointer-events-none" style={{ bottom: "95px" }}>
            {modeloTarja === "telejornal" && (
                <div className={`relative mx-auto w-[94vw] transition-all ${classeTransicao}`} style={estiloTransicao}>
                    <div className="absolute -top-6 left-8 z-40">
                        <div className={`absolute left-4 bottom-full z-0 transition-all duration-1000 ${mostrarQrTelejornal ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"}`}>
                            {midiaAtual?.qrcode && (
                                <div className="rounded-xl bg-white p-2 shadow-xl">
                                    <img
                                        src={`https://api.qrserver.com/v1/create-qr-code/?size=130x130&data=${encodeURIComponent(midiaAtual.qrcode)}`}
                                        alt="QR Code"
                                        className="h-32 w-32"
                                    />
                                </div>
                            )}
                        </div>

                        <div className="relative z-20 rounded-t-md bg-[#073bd9] px-5 py-1.5 shadow-xl">
                            <span className="text-xs font-black uppercase tracking-[0.22em] text-white">
                                {mostrarQrTelejornal ? "VEJA MAIS NO NOSSO INSTAGRAM" : etiquetaTarjaFinal}
                            </span>
                        </div>
                    </div>

                    <div className="relative overflow-hidden rounded-xl border border-white/25 bg-white/95 shadow-[0_22px_70px_rgba(0,0,0,0.55)] backdrop-blur-md">
                        <div className="absolute inset-y-0 right-0 w-[300px] bg-gradient-to-l from-[#073bd9] to-[#0d5cff]" />
                        <div className="absolute right-[235px] top-0 h-full w-24 skew-x-[-24deg] bg-white/95" />
                        <div className="absolute inset-0 bg-gradient-to-r from-white/30 via-transparent to-white/10" />
                        <div className="absolute left-0 top-0 h-full w-2 bg-[#073bd9]" />

                        <div className="relative z-10 flex items-center justify-between gap-6 px-9 py-4">
                            <div className="min-w-0 flex-1 pl-4 pr-6">
                                <h2
                                    className="truncate font-black uppercase leading-none tracking-tight text-[#071b42]"
                                    style={{ fontSize: `clamp(18px, 1.55vw, ${Math.max(tamanhoFonteSlogan + 2, 26)}px)` }}
                                >
                                    {tituloTarjaFinal}
                                </h2>

                                <p
                                    className="mt-2 truncate font-semibold text-[#334155]"
                                    style={{ fontSize: `${Math.max(tamanhoFonteSlogan - 2, 14)}px` }}
                                >
                                    {subtituloTarjaFinal}
                                </p>
                            </div>

                            <div className="relative z-20 flex shrink-0 items-center gap-4">
                                {logo.trim() !== "" && (
                                    <div className="rounded-lg bg-white px-3 py-2 shadow-lg ring-1 ring-black/10">
                                        <img
                                            src={logo}
                                            alt="Logo ADUSEPS"
                                            className="w-auto object-contain"
                                            style={{ height: `${tamanhoLogoRodape}px` }}
                                        />
                                    </div>
                                )}

                                <div className="min-w-[105px] rounded-lg bg-white/15 px-3 py-2 text-center shadow-inner backdrop-blur">
                                    <span
                                        className="font-black tracking-tight text-white drop-shadow"
                                        style={{ fontSize: `${tamanhoFonteHora}px` }}
                                    >
                                        {hora}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="h-1.5 bg-gradient-to-r from-[#073bd9] via-[#0d5cff] to-[#073bd9]" />
                    </div>
                </div>
            )}

            {modeloTarja === "compacta" && (
                <div className={`relative mx-auto w-[92vw] transition-all ${classeTransicao}`} style={estiloTransicao}>
                    <div className="rounded-2xl border border-white/10 bg-black/75 px-8 py-3 shadow-2xl backdrop-blur-md">
                        <div className="flex items-center gap-4">
                            <span className="text-xs font-black uppercase tracking-[0.18em] text-[#34bcf8]">{etiquetaTarjaFinal}</span>
                            <div className="h-4 w-px bg-white/20" />
                            <span className="truncate text-xl font-bold text-white">{tituloTarjaFinal}</span>
                        </div>

                        {subtituloTarjaFinal && (
                            <p className="mt-1 truncate text-sm text-white/70">{subtituloTarjaFinal}</p>
                        )}
                    </div>
                </div>
            )}

            {modeloTarja === "live" && (
                <div className={`relative mx-auto w-[94vw] transition-all ${classeTransicao}`} style={estiloTransicao}>
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
                                {tituloTarjaFinal}
                            </h2>
                            <div className="mt-2 flex min-w-0 items-center gap-3">
                                <div className="h-[3px] w-12 shrink-0 rounded-full bg-[#f15434]" />
                                <p className="truncate font-semibold text-white/75" style={{ fontSize: `${Math.max(tamanhoFonteSlogan - 2, 14)}px` }}>
                                    {subtituloTarjaFinal}
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
            )}

            {modeloTarja === "infobar" && (
                <div className={`relative mx-auto w-[94vw] transition-all ${faseTarja === "entrando" || faseTarja === "visivel" ? "translate-y-0 opacity-100 scale-100" : "translate-y-8 opacity-0 scale-[0.98]"}`} style={estiloTransicao}>
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
                                <span className="relative text-xs font-black uppercase tracking-[0.22em] text-white drop-shadow">{etiquetaTarjaFinal}</span>
                            </div>
                            <div className="relative flex min-w-0 flex-1 flex-col justify-center px-7">
                                <div className="absolute left-0 top-1/2 h-10 w-px -translate-y-1/2 bg-white/15" />
                                <h2 className="truncate font-black uppercase leading-none text-white drop-shadow" style={{ fontSize: `${Math.max(tamanhoFonteSlogan + 5, 23)}px` }}>
                                    {tituloTarjaFinal}
                                </h2>
                                {subtituloTarjaFinal && (
                                    <p className="mt-1 truncate font-semibold text-white/70" style={{ fontSize: `${Math.max(tamanhoFonteSlogan - 4, 13)}px` }}>
                                        {subtituloTarjaFinal}
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
            )}

            {modeloTarja === "digital" && (
                <div className={`fixed left-0 top-0 z-40 h-[100dvh] w-[min(50vw,900px)] transition-all ${faseTarja === "entrando" || faseTarja === "visivel" ? "translate-x-0 opacity-100" : "-translate-x-full opacity-0"}`} style={estiloTransicao}>
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
                                        {etiquetaTarjaFinal}
                                    </span>
                                </div>

                                <h2 className="font-black uppercase leading-[0.92] tracking-wide text-white drop-shadow-[0_8px_20px_rgba(0,0,0,0.55)]" style={{ fontSize: "clamp(32px,3.2vw,68px)" }}>
                                    {tituloTarjaFinal}
                                </h2>

                                {subtituloTarjaFinal && (
                                    <p className="mx-auto mt-[clamp(12px,2.5vh,24px)] max-w-[620px] font-medium leading-tight text-white/82" style={{ fontSize: "clamp(17px,1.55vw,30px)" }}>
                                        {subtituloTarjaFinal}
                                    </p>
                                )}
                            </div>

                            <div className="mt-auto flex flex-col items-center justify-center pt-[clamp(16px,3vh,32px)] pb-[clamp(4px,1vh,8px)]">
                                {midiaAtual?.qrcode && midiaAtual.qrcode.trim() !== "" ? (
                                    <div className="relative rounded-[clamp(1rem,2vw,1.7rem)] bg-white p-[clamp(8px,1.2vw,16px)] shadow-[0_0_35px_rgba(13,92,255,0.75)]">
                                        <div className="absolute -inset-2 rounded-[2rem] border border-[#34bcf8]/60" />
                                        <img src={`https://api.qrserver.com/v1/create-qr-code/?size=260x260&data=${encodeURIComponent(midiaAtual.qrcode)}`} alt="QR Code" className="relative h-[min(20vw,26vh,224px)] w-[min(20vw,26vh,224px)]" />
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
            )}
        </div>
    )
}
