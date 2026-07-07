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
    <footer className="h-full w-full min-h-0 overflow-hidden bg-[#0d5cff] text-white">
        <div className="grid h-full w-full grid-cols-[minmax(0,1fr)_260px] items-center overflow-hidden bg-gradient-to-r from-[#063ea8] via-[#0d5cff] to-[#063ea8]">
            
            <div className="min-w-0 overflow-hidden px-5">
                <p className="truncate text-[28px] font-black leading-none">
                    {textoFaixa}
                </p>
            </div>

            <div className="flex min-w-0 flex-col items-end justify-center overflow-hidden px-5 text-right">
                {configuracoes.mostrarHoraPainel && (
                    <p className="text-[52px] font-black leading-none">
                        {horaPainel}
                    </p>
                )}

                {configuracoes.mostrarDataPainel && (
                    <p className="mt-1 max-w-full truncate text-[15px] font-bold capitalize text-white/75">
                        {dataPainel}
                    </p>
                )}
            </div>
        </div>
    </footer>
)
}
