"use client"

import LogoRodape from "../LogoRodape"
import QRCodeRodape from "../QRCodeRodape"

type TelejornalProps = {
    logo: string
    slogan: string
    hora: string
    tituloTarja: string
    subtituloTarja: string
    etiquetaTarja: string
    tamanhoFonteSlogan: number
    tamanhoFonteHora: number
    tamanhoLogoRodape: number
    mostrarQrTelejornal: boolean
    faseTarja: "oculta" | "entrando" | "visivel" | "saindo"
    tempoEntradaTarja: number
    tempoSaidaTarja: number
    qrcode?: string
}

export default function Telejornal({
    logo,
    slogan,
    hora,
    tituloTarja,
    subtituloTarja,
    etiquetaTarja,
    tamanhoFonteSlogan,
    tamanhoFonteHora,
    tamanhoLogoRodape,
    mostrarQrTelejornal,
    faseTarja,
    tempoEntradaTarja,
    tempoSaidaTarja,
    qrcode
}: TelejornalProps) {
    const classeTransicao =
        faseTarja === "entrando" || faseTarja === "visivel"
            ? "translate-x-0 opacity-100"
            : "-translate-x-[120%] opacity-0"

    return (
        <div className={`relative mx-auto w-[94vw] transition-all ${classeTransicao}`} style={{ transitionDuration: faseTarja === "entrando" ? `${tempoEntradaTarja}s` : faseTarja === "saindo" ? `${tempoSaidaTarja}s` : "0s" }}>
            <div className="absolute -top-6 left-8 z-40">
                <div className={`absolute left-4 bottom-full z-0 transition-all duration-1000 ${mostrarQrTelejornal ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"}`}>
                    <QRCodeRodape qrcode={qrcode} />
                </div>

                <div className="relative z-20 rounded-t-md bg-[#073bd9] px-5 py-1.5 shadow-xl">
                    <span className="text-xs font-black uppercase tracking-[0.22em] text-white">
                        {mostrarQrTelejornal ? "VEJA MAIS NO NOSSO INSTAGRAM" : etiquetaTarja}
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
                        <h2 className="truncate font-black uppercase leading-none tracking-tight text-[#071b42]" style={{ fontSize: `clamp(18px, 1.55vw, ${Math.max(tamanhoFonteSlogan + 2, 26)}px)` }}>
                            {tituloTarja}
                        </h2>

                        <p className="mt-2 truncate font-semibold text-[#334155]" style={{ fontSize: `${Math.max(tamanhoFonteSlogan - 2, 14)}px` }}>
                            {subtituloTarja}
                        </p>
                    </div>

                    <div className="relative z-20 flex shrink-0 items-center gap-4">
                        <LogoRodape logo={logo} tamanhoLogoRodape={tamanhoLogoRodape} />

                        <div className="min-w-[105px] rounded-lg bg-white/15 px-3 py-2 text-center shadow-inner backdrop-blur">
                            <span className="font-black tracking-tight text-white drop-shadow" style={{ fontSize: `${tamanhoFonteHora}px` }}>
                                {hora}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="h-1.5 bg-gradient-to-r from-[#073bd9] via-[#0d5cff] to-[#073bd9]" />
            </div>
        </div>
    )
}
