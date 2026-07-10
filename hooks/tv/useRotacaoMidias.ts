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
    const [controleProgramacao, setControleProgramacao] =
        useState<Record<string, number>>({})
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

    const obterInicioFimMidia = useCallback((midia: Midia) => {
        if (!midia.inicioExibicao || !midia.fimExibicao) {
            return null
        }

        const inicio = new Date(midia.inicioExibicao)
        const fim = new Date(midia.fimExibicao)

        if (Number.isNaN(inicio.getTime()) || Number.isNaN(fim.getTime())) {
            return null
        }

        return { inicio, fim }
    }, [])

    const midiaEstaNoPeriodo = useCallback((midia: Midia) => {
        if (!agoraPainel) return true

        const periodo = obterInicioFimMidia(midia)

        if (!periodo) return false

        return agoraPainel >= periodo.inicio && agoraPainel <= periodo.fim
    }, [agoraPainel, obterInicioFimMidia])

    const midiaProgramadaEstaVencida = useCallback((midia: Midia) => {
        if (!agoraPainel) return false

        const modo = midia.modoProgramacao || "periodo"

        if (modo === "periodo") return true

        const ultimaExibicao = controleProgramacao[midia.id] || 0

        if (modo === "uma_vez") {
            return ultimaExibicao === 0
        }

        if (modo === "intervalo") {
            const intervalo = Math.max(
                5,
                Number(midia.intervaloExibicaoMinutos || 20)
            )
            return agoraPainel.getTime() - ultimaExibicao >= intervalo * 60 * 1000
        }

        return true
    }, [agoraPainel, controleProgramacao])

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

            return midiaEstaNoPeriodo(midia)
        }

        if (!midia.arquivo || midia.arquivo.trim() === "") {
            return false
        }

        if (midia.exibicaoProgramada) {
            return midiaEstaNoPeriodo(midia)
        }

        return true
    }, [midiaEstaNoPeriodo])

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

        const programadasVencidas = listaParaUso
            .filter((midia) => midia.tipo !== "youtube")
            .filter((midia) => midia.exibicaoProgramada)
            .filter((midia) => midiaProgramadaEstaVencida(midia))
            .sort((a, b) => {
                const prioridadeA = Number(a.prioridadeProgramacao || 3)
                const prioridadeB = Number(b.prioridadeProgramacao || 3)

                return prioridadeA - prioridadeB
            })

        if (programadasVencidas.length > 0) {
            const escolhida = programadasVencidas[0]

            return [
                escolhida,
                ...montarListaInteligente(
                    listaParaUso
                        .filter((midia) => midia.tipo !== "youtube")
                        .filter((midia) => midia.id !== escolhida.id)
                )
            ]
        }

        return montarListaInteligente(
            listaParaUso.filter((midia) => midia.tipo !== "youtube")
        )
    }, [
        midias,
        midiasComErro,
        midiaPodeSerExibida,
        midiaProgramadaEstaVencida
    ])

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

    useEffect(() => {
        if (!midiaAtual || !agoraPainel) return
        if (!midiaAtual.exibicaoProgramada) return

        const modo = midiaAtual.modoProgramacao || "periodo"

        if (modo === "periodo") return

        const timeout = window.setTimeout(() => {
            setControleProgramacao((atual) => {
                if (atual[midiaAtual.id]) return atual

                return {
                    ...atual,
                    [midiaAtual.id]: agoraPainel.getTime()
                }
            })
        }, 0)

        return () => window.clearTimeout(timeout)
    }, [midiaAtual, agoraPainel])

    const indiceProximaMidia =
    midiasValidas.length > 1
        ? indiceSeguro + 1 >= midiasValidas.length
            ? 0
            : indiceSeguro + 1
        : null

    const proximaMidia =
        indiceProximaMidia !== null
            ? midiasValidas[indiceProximaMidia]
            : null

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
        proximaMidia,
        avancarMidia,
        marcarMidiaComErro,
        lidarComErroVideo,
        reiniciarOuAvancarVideo,
        lidarComErroImagem
    }
}
