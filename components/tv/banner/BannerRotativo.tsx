"use client"

import { useEffect, useMemo, useRef } from "react"

import { useClimaPainel } from "@/hooks/tv/useClimaPainel"
import { usePainelData } from "@/hooks/tv/usePainelData"
import { useRotacaoMidias } from "@/hooks/tv/useRotacaoMidias"
import type { ConfiguracoesPainel, Midia, Noticia } from "@/types/painel"
import BannerCheio from "./BannerCheio"
import EscalaJuridicaPainel from "./EscalaJuridicaPainel"
import BannerInstitucional from "./BannerInstitucional"
import BannerSocial from "./BannerSocial"
import BannerPainel from "./BannerPainel"
import BannerPlantaoJuridico from "./BannerPlantaoJuridico"
import BannerContatosOficiais from "./BannerContatosOficiais"
import BannerYoutube from "./BannerYoutube"
import {
    midiaEhYoutube,
    normalizarConfiguracoesBanner,
    obterAssinaturaMidia,
    type BannerTemplateProps
} from "./utils"

type Props = {
    fallback: string
    onMidiaAtualChange?: (midia: Midia | null) => void
    modoPreview?: boolean
    previewConfiguracoes?: ConfiguracoesPainel
    previewMidias?: Midia[]
    previewNoticias?: Noticia[]
}

export default function BannerRotativo({
    fallback,
    onMidiaAtualChange,
    modoPreview = false,
    previewConfiguracoes,
    previewMidias,
    previewNoticias
}: Props) {
    const ultimaMidiaNotificadaRef = useRef<string | null>(null)

    const { midias, configuracoes } = usePainelData({
        modoPreview,
        previewConfiguracoes,
        previewMidias,
        previewNoticias
    })

    const configuracoesBanner = normalizarConfiguracoesBanner(configuracoes)

    const mostrarEscalaJuridicaTv =
        configuracoesBanner.mostrarEscalaJuridicaTv ?? false

    const duracaoEscalaJuridicaTv =
        Math.max(5, Number(configuracoesBanner.duracaoEscalaJuridicaTv || 15))

    const midiasComEscalaJuridica: Midia[] = useMemo(() => {
        if (!mostrarEscalaJuridicaTv) {
            return midias
        }

        return [
            ...midias,
            {
                id: "escala-juridica-tv",
                tipo: "imagem",
                arquivo: "__escala_juridica__",
                ativo: true,
                ordem: 999,
                duracao: duracaoEscalaJuridicaTv,
                pesoExibicao: 1,
                template: "escala-juridica"
            }
        ]
    }, [duracaoEscalaJuridicaTv, midias, mostrarEscalaJuridicaTv])

    const {
        midias: midiasRotacao,
        midiaAtual,
        proximaMidia,
        possuiRotacao,
        agoraPainel,
        marcarMidiaComErro,
        lidarComErroVideo,
        reiniciarOuAvancarVideo,
        lidarComErroImagem
    } = useRotacaoMidias({ midias: midiasComEscalaJuridica, fallback })

    const clima = useClimaPainel(configuracoesBanner)

    useEffect(() => {
        const assinaturaAtual = midiaAtual
            ? obterAssinaturaMidia(midiaAtual)
            : "sem-midia"

        if (ultimaMidiaNotificadaRef.current === assinaturaAtual) {
            return
        }

        ultimaMidiaNotificadaRef.current = assinaturaAtual
        onMidiaAtualChange?.(midiaAtual || null)
    }, [midiaAtual, onMidiaAtualChange])

    if (midiasRotacao.length === 0 || !midiaAtual) {
        return (
            <div className="absolute inset-0 bg-black">
                {fallback && (
                    <img
                        src={fallback}
                        alt="Imagem padrao"
                        className="absolute inset-0 h-full w-full object-cover"
                    />
                )}
            </div>
        )
    }

    const chaveMidiaAtual = obterAssinaturaMidia(midiaAtual)

    if (midiaEhYoutube(midiaAtual)) {
        return (
            <BannerYoutube
                midiaAtual={midiaAtual}
                fallback={fallback}
                chaveMidiaAtual={chaveMidiaAtual}
            />
        )
    }

    const templateAtual = midiaAtual.template || "cheio"

    const preloadProximaMidia =
        proximaMidia &&
            proximaMidia.tipo === "imagem" &&
            proximaMidia.arquivo &&
            !midiaEhYoutube(proximaMidia) ? (
            <img
                src={proximaMidia.arquivo}
                alt=""
                aria-hidden="true"
                className="pointer-events-none absolute h-0 w-0 opacity-0"
                key={`preload-${obterAssinaturaMidia(proximaMidia)}`}
            />
        ) : null

    const templateProps: BannerTemplateProps = {
        midiaAtual,
        fallback,
        chaveMidiaAtual,
        possuiRotacao,
        onErroMidia: marcarMidiaComErro,
        onErroImagem: lidarComErroImagem,
        onErroVideo: lidarComErroVideo,
        onVideoEnded: reiniciarOuAvancarVideo
    }

    function renderizarTemplate() {
        switch (templateAtual) {
            case "plantao-juridico":
                return (
                    <BannerPlantaoJuridico
                        midiaAtual={midiaAtual}
                        agoraPainel={agoraPainel}
                        configuracoes={configuracoesBanner}
                    />
                )

            case "contatos-oficiais":
                return (
                    <BannerContatosOficiais
                        midiaAtual={midiaAtual}
                        configuracoes={configuracoesBanner}
                    />
                )

            case "escala-juridica":
                return (
                    <EscalaJuridicaPainel
                        configuracoes={configuracoesBanner}
                        clima={clima}
                    />
                )

            case "painel":
                return (
                    <BannerPainel
                        midiaAtual={midiaAtual}
                        configuracoes={configuracoesBanner}
                        clima={clima}
                        fallback={fallback}
                        possuiRotacao={possuiRotacao}
                        agoraPainel={agoraPainel}
                        onErroMidia={marcarMidiaComErro}
                        onVideoEnded={reiniciarOuAvancarVideo}
                    />
                )

            case "institucional":
                return <BannerInstitucional {...templateProps} />

            case "social":
                return <BannerSocial {...templateProps} />

            default:
                return <BannerCheio {...templateProps} />
        }
    }

    return (
        <>
            {preloadProximaMidia}

            <div
                key={chaveMidiaAtual}
                className="absolute inset-0"
            >
                {renderizarTemplate()}
            </div>
        </>
    )
}
