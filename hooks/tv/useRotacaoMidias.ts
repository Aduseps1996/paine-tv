"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"

import {
    midiaEhYoutube,
    montarListaInteligente,
    obterAssinaturaMidia,
    obterChaveMidia
} from "@/components/tv/banner/utils"
import type { Midia } from "@/types/painel"

type UseRotacaoMidiasParams = {
    midias: Midia[]
    fallback: string
}

export function useRotacaoMidias({
    midias,
    fallback
}: UseRotacaoMidiasParams) {
    const [indiceAtual, setIndiceAtual] = useState(0)
    const [agoraPainel, setAgoraPainel] = useState<Date | null>(null)
    const [midiasComErro, setMidiasComErro] = useState<string[]>([])
    const timeoutAvancoRef = useRef<ReturnType<typeof setTimeout> | null>(null)
    const timeoutRecarregarVideoRef = useRef<ReturnType<typeof setTimeout> | null>(null)

    useEffect(() => {
        const atualizarAgora = () => setAgoraPainel(new Date())

        const timeoutInicial = setTimeout(atualizarAgora, 0)
        const intervalo = setInterval(atualizarAgora, 10000)

        return () => {
            clearTimeout(timeoutInicial)
            clearInterval(intervalo)
        }
    }, [])

    useEffect(() => {
        return () => {
            if (timeoutAvancoRef.current) {
                clearTimeout(timeoutAvancoRef.current)
            }

            if (timeoutRecarregarVideoRef.current) {
                clearTimeout(timeoutRecarregarVideoRef.current)
            }
        }
    }, [])

    const midiaEstaDentroDoHorario = useCallback((midia: Midia) => {
        if (!midia.exibicaoProgramada) return true

        if (!midia.inicioExibicao || !midia.fimExibicao) {
            return false
        }

        const inicio = new Date(midia.inicioExibicao)
        const fim = new Date(midia.fimExibicao)

        if (Number.isNaN(inicio.getTime()) || Number.isNaN(fim.getTime())) {
            return false
        }

        if (!agoraPainel) return true

        return agoraPainel >= inicio && agoraPainel <= fim
    }, [agoraPainel])

    const midiaPodeSerExibida = useCallback((midia: Midia) => {
        if (!midia.ativo) return false

        if (midiaEhYoutube(midia)) {
            const linkYoutube =
                midia.linkYoutubeExibicao ||
                midia.arquivo

            if (!linkYoutube || linkYoutube.trim() === "") {
                return false
            }

            if (!midia.exibicaoProgramada) {
                return false
            }

            return midiaEstaDentroDoHorario(midia)
        }

        if (!midia.arquivo || midia.arquivo.trim() === "") {
            return false
        }

        if (midia.exibicaoProgramada) {
            return midiaEstaDentroDoHorario(midia)
        }

        return true
    }, [midiaEstaDentroDoHorario])

    const midiasValidas = useMemo(() => {
        const listaValida = midias.filter((midia) => {
            return midiaPodeSerExibida(midia)
        })

        const listaSemErro = listaValida.filter((midia) => {
            return !midiasComErro.includes(obterChaveMidia(midia))
        })

        const listaParaUso =
            listaSemErro.length > 0
                ? listaSemErro
                : listaValida

        const youtubeAtivo = listaParaUso.find((midia) => {
            return (
                midia.ativo === true &&
                midia.exibicaoProgramada === true &&
                midiaEhYoutube(midia) &&
                Boolean(midia.linkYoutubeExibicao || midia.arquivo)
            )
        })

        if (youtubeAtivo) {
            return [youtubeAtivo]
        }

        return montarListaInteligente(
            listaParaUso.filter((midia) => midia.tipo !== "youtube")
        )
    }, [midias, midiasComErro, midiaPodeSerExibida])

    const assinaturaMidias = midiasValidas
        .map(obterAssinaturaMidia)
        .join("|")

    useEffect(() => {
        const timeout = window.setTimeout(() => {
            setIndiceAtual(0)
            setMidiasComErro([])
        }, 0)

        if (timeoutAvancoRef.current) {
            clearTimeout(timeoutAvancoRef.current)
            timeoutAvancoRef.current = null
        }

        if (timeoutRecarregarVideoRef.current) {
            clearTimeout(timeoutRecarregarVideoRef.current)
            timeoutRecarregarVideoRef.current = null
        }

        return () => window.clearTimeout(timeout)
    }, [assinaturaMidias])

    const indiceSeguro =
        indiceAtual >= midiasValidas.length
            ? 0
            : indiceAtual

    const midiaAtual = midiasValidas[indiceSeguro]

    const avancarMidia = useCallback(() => {
        if (midiasValidas.length <= 1) return

        if (timeoutAvancoRef.current) {
            clearTimeout(timeoutAvancoRef.current)
        }

        timeoutAvancoRef.current = setTimeout(() => {
            setIndiceAtual((valorAtual) => {
                const proximo = valorAtual + 1
                return proximo >= midiasValidas.length ? 0 : proximo
            })
        }, 150)
    }, [midiasValidas.length])

    useEffect(() => {
        if (!midiaAtual) return
        if (midiasValidas.length <= 1) return
        if (midiaAtual.tipo !== "imagem") return

        const duracaoSegura = Math.max(1, Number(midiaAtual.duracao || 8))

        const intervaloBanner = setInterval(() => {
            avancarMidia()
        }, duracaoSegura * 1000)

        return () => clearInterval(intervaloBanner)
    }, [midiaAtual, midiasValidas.length, assinaturaMidias, avancarMidia])

    const marcarMidiaComErro = useCallback((midia: Midia | undefined) => {
        if (!midia) return

        const chave = obterChaveMidia(midia)

        setMidiasComErro((listaAtual) => {
            if (listaAtual.includes(chave)) return listaAtual
            return [...listaAtual, chave]
        })
    }, [])

    const tentarRecarregarVideo = useCallback((video: HTMLVideoElement) => {
        if (timeoutRecarregarVideoRef.current) {
            clearTimeout(timeoutRecarregarVideoRef.current)
        }

        timeoutRecarregarVideoRef.current = setTimeout(() => {
            try {
                video.load()

                setTimeout(() => {
                    video.play().catch(() => {
                        // Autoplay pode falhar momentaneamente em alguns players de TV.
                    })
                }, 500)
            } catch {
                // Mantem a midia unica no ar para evitar fallback falso.
            }
        }, 800)
    }, [])

    const lidarComErroVideo = useCallback((video: HTMLVideoElement) => {
        if (midiasValidas.length > 1) {
            marcarMidiaComErro(midiaAtual)
            avancarMidia()
            return
        }

        tentarRecarregarVideo(video)
    }, [
        avancarMidia,
        marcarMidiaComErro,
        midiaAtual,
        midiasValidas.length,
        tentarRecarregarVideo
    ])

    const reiniciarOuAvancarVideo = useCallback((video: HTMLVideoElement) => {
        if (midiasValidas.length > 1) {
            avancarMidia()
            return
        }

        try {
            video.currentTime = 0
            video.play().catch(() => {
                tentarRecarregarVideo(video)
            })
        } catch {
            tentarRecarregarVideo(video)
        }
    }, [avancarMidia, midiasValidas.length, tentarRecarregarVideo])

    const lidarComErroImagem = useCallback((imagem: HTMLImageElement) => {
        if (midiasValidas.length > 1) {
            marcarMidiaComErro(midiaAtual)
            avancarMidia()
            return
        }

        if (imagem.src !== fallback) {
            imagem.src = fallback
        }
    }, [
        avancarMidia,
        fallback,
        marcarMidiaComErro,
        midiaAtual,
        midiasValidas.length
    ])

    return {
        midias: midiasValidas,
        midiaAtual,
        possuiRotacao: midiasValidas.length > 1,
        assinaturaMidias,
        agoraPainel,
        avancarMidia,
        marcarMidiaComErro,
        lidarComErroVideo,
        reiniciarOuAvancarVideo,
        lidarComErroImagem
    }
}
