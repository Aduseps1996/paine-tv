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
    const animacaoImagem = possuiRotacao
        ? "scale-[1.02] animate-[zoomBanner_22s_linear_infinite]"
        : ""

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
        <div className="absolute inset-0 overflow-hidden bg-[#58c9f3]">
            <div className="absolute inset-0 bg-gradient-to-br from-[#7de2ff] via-[#4fc3ef] to-[#218bd6]" />

            <div className="relative z-10 grid h-[calc(100vh-clamp(78px,9vh,108px))] w-full grid-cols-[clamp(260px,24vw,420px)_minmax(0,1fr)] gap-0 p-0">
                <PainelClimaSidebar
                    clima={clima}
                    configuracoes={configuracoes}
                />

                <main
                    className="relative h-full min-w-0 overflow-hidden rounded-none border border-white/10 border-l-white/20 bg-[#0F172A]"
                    style={{
                        boxShadow:
                            "inset 0 1px 0 rgba(255,255,255,.10), 0 8px 30px rgba(0,0,0,.18)"
                    }}
                >
                    <div className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-br from-white/10 via-transparent to-[#0d5cff]/15" />
                    <MediaPlayer
                        tipo={midiaAtual.tipo === "video" ? "video" : "imagem"}
                        src={midiaAtual.arquivo}
                        alt="Midia principal"
                        fallback={fallback}
                        modoExibicao={midiaAtual.modoExibicao || "cover"}
                        className={`relative z-0 ${midiaAtual.tipo === "imagem" ? animacaoImagem : ""}`}
                        onErro={() => onErroMidia(midiaAtual)}
                        onVideoEnded={onVideoEnded}
                    />
                </main>
            </div>

            <PainelFaixaInferior
                midiaAtual={midiaAtual}
                configuracoes={configuracoes}
                horaPainel={horaPainel}
                dataPainel={dataPainel}
            />
        </div>
    )
}
