"use client"

import type { Midia } from "@/types/painel"
import type { ConfiguracoesBanner } from "./utils"

type Props = {
    midiaAtual: Midia
    configuracoes: ConfiguracoesBanner
    horaPainel: string
    dataPainel: string
}

export default function PainelFaixaInferior({
    midiaAtual,
    configuracoes,
    horaPainel,
    dataPainel
}: Props) {
    const textoFaixa =
        midiaAtual.mostrarTarja
            ? `${midiaAtual.tarjaEtiqueta || "ADUSEPS"} ${midiaAtual.tarjaTitulo || midiaAtual.titulo || ""} ${midiaAtual.tarjaSubtitulo || midiaAtual.subtitulo || ""}`
            : midiaAtual.rodape ||
            midiaAtual.titulo ||
            "ADUSEPS - Informacao, acolhimento e defesa do associado"

    const logo = configuracoes.logo || ""

    return (
        <div className="absolute bottom-0 left-0 right-0 z-20 grid h-[clamp(78px,9vh,108px)] grid-cols-[clamp(130px,15vw,210px)_minmax(0,1fr)_clamp(130px,16vw,240px)] items-center overflow-hidden bg-gradient-to-r from-[#063ea8] via-[#0d5cff] to-[#063ea8] px-0 text-white shadow-[0_-18px_60px_rgba(0,0,0,0.28)]">
            <div className="min-w-0 h-full w-full truncate bg-white px-[clamp(0.65rem,1.4vw,1.25rem)] py-3 text-center text-[clamp(0.75rem,1.3vw,1.15rem)] font-black uppercase tracking-[0.10em] text-[#0d5cff] flex items-center justify-center">
                {configuracoes.mostrarLogoFaixaPainel && logo ? (
                    <img
                        src={logo.startsWith("/") || logo.startsWith("http") ? logo : `/${logo}`}
                        alt="Logo"
                        className="max-h-full max-w-[70%] object-contain"
                    />
                ) : (
                    <span className="truncate">
                        {midiaAtual.mostrarTarja
                            ? midiaAtual.tarjaEtiqueta || "Informe"
                            : midiaAtual.categoria || "ADUSEPS"}
                    </span>
                )}
            </div>

            <div className="min-w-0 flex-1 px-4">
                <p className="truncate text-[clamp(1.25rem,2.25vw,2.45rem)] font-black leading-tight">
                    {textoFaixa}
                </p>
            </div>

            <div className="flex min-w-0 flex-col items-end justify-center px-4 text-right">
                {configuracoes.mostrarHoraPainel && (
                    <p className="text-[clamp(2rem,3.2vw,3.6rem)] font-black leading-none">
                        {horaPainel}
                    </p>
                )}

                {configuracoes.mostrarDataPainel && (
                    <p className="mt-1 max-w-full truncate text-[clamp(0.68rem,1vw,0.95rem)] font-bold capitalize text-white/75">
                        {dataPainel}
                    </p>
                )}
            </div>
        </div>
    )
}
