"use client"

import MediaPlayer from "@/components/tv/MediaPlayer"
import type { Midia } from "@/types/painel"
import PainelClimaSidebar from "./PainelClimaSidebar"
import PainelFaixaInferior from "./PainelFaixaInferior"
import type {
    ClimaPainel,
    ConfiguracoesBanner
} from "./utils"

type Props = {
    midiaAtual: Midia
    configuracoes: ConfiguracoesBanner
    clima: ClimaPainel
    fallback: string
    possuiRotacao: boolean
    agoraPainel: Date | null
    onErroMidia: (midia: Midia) => void
    onVideoEnded: (video: HTMLVideoElement) => void
}

export default function BannerPainel({
    midiaAtual,
    configuracoes,
    clima,
    fallback,
    possuiRotacao,
    agoraPainel,
    onErroMidia,
    onVideoEnded
}: Props) {
    const alturaFaixa = Math.min(
        112,
        Math.max(72, Number(configuracoes.alturaBarraNoticias || 88))
    )

    const horaPainel = agoraPainel
        ? agoraPainel.toLocaleTimeString("pt-BR", {
            hour: "2-digit",
            minute: "2-digit"
        })
        : ""

    const dataPainel = agoraPainel
        ? agoraPainel.toLocaleDateString("pt-BR", {
            weekday: "long",
            day: "2-digit",
            month: "long"
        })
        : ""

    return (
        <div
            className="absolute inset-0 grid overflow-hidden bg-black"
            style={{
                gridTemplateColumns: "clamp(250px, 24vw, 390px) minmax(0, 1fr)",
                gridTemplateRows: `minmax(0, 1fr) ${alturaFaixa}px`
            }}
        >
            <aside className="row-span-2 min-h-0 overflow-hidden">
                <PainelClimaSidebar
                    clima={clima}
                    configuracoes={configuracoes}
                />
            </aside>

            <main className="relative min-h-0 min-w-0 overflow-hidden bg-[#07111f]">
                <div className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-br from-white/8 via-transparent to-sky-500/10" />

                <MediaPlayer
                    midia={midiaAtual}
                    fallback={fallback}
                    possuiRotacao={possuiRotacao}
                    onErroMidia={onErroMidia}
                    onVideoEnded={onVideoEnded}
                />
            </main>

            <footer className="relative min-h-0 overflow-hidden">
                <PainelFaixaInferior
                    midiaAtual={midiaAtual}
                    configuracoes={configuracoes}
                    horaPainel={horaPainel}
                    dataPainel={dataPainel}
                />
            </footer>
        </div>
    )
}
