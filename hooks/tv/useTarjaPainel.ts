"use client"

import { useEffect, useState } from "react"

import type { ModeloTarja } from "@/types/painel"

type UseTarjaPainelParams = {
    mostrarTarja: boolean
    modeloTarja: ModeloTarja
    tempoEntradaTarja: number
    tempoVisivelTarja: number
    tempoSaidaTarja: number
    tempoOcultaTarja: number
    tempoInicialTarja: number
    midiaId?: string
}

export function useTarjaPainel({
    mostrarTarja,
    modeloTarja,
    tempoEntradaTarja,
    tempoVisivelTarja,
    tempoSaidaTarja,
    tempoOcultaTarja,
    tempoInicialTarja,
    midiaId
}: UseTarjaPainelParams) {
    const [faseTarja, setFaseTarja] = useState<"oculta" | "entrando" | "visivel" | "saindo">("oculta")
    const [mostrarQrTelejornal, setMostrarQrTelejornal] = useState(false)

    useEffect(() => {
        if (!mostrarTarja || modeloTarja !== "telejornal") {
            const timer = setTimeout(() => setMostrarQrTelejornal(false), 0)
            return () => clearTimeout(timer)
        }

        const timerReset = setTimeout(() => setMostrarQrTelejornal(false), 0)
        const timer = setTimeout(() => setMostrarQrTelejornal(true), 5000)

        return () => {
            clearTimeout(timerReset)
            clearTimeout(timer)
        }
    }, [mostrarTarja, modeloTarja, midiaId])

    useEffect(() => {
        if (!mostrarTarja) {
            const timer = setTimeout(() => setFaseTarja("oculta"), 0)
            return () => clearTimeout(timer)
        }

        let ativo = true

        function iniciarCiclo() {
            if (!ativo) return

            setFaseTarja("oculta")

            const timerOculta = setTimeout(() => {
                if (!ativo) return

                setFaseTarja("entrando")

                const timerEntrada = setTimeout(() => {
                    if (!ativo) return

                    setFaseTarja("visivel")

                    const timerVisivel = setTimeout(() => {
                        if (!ativo) return

                        setFaseTarja("saindo")

                        const timerSaida = setTimeout(() => {
                            if (!ativo) return

                            setFaseTarja("oculta")

                            const timerFim = setTimeout(() => {
                                if (!ativo) return
                                iniciarCiclo()
                            }, tempoOcultaTarja * 1000)

                            return () => clearTimeout(timerFim)
                        }, tempoSaidaTarja * 1000)

                        return () => clearTimeout(timerSaida)
                    }, tempoVisivelTarja * 1000)

                    return () => clearTimeout(timerVisivel)
                }, tempoEntradaTarja * 1000)

                return () => clearTimeout(timerEntrada)
            }, tempoInicialTarja * 1000)

            return () => clearTimeout(timerOculta)
        }

        const timerInicial = setTimeout(iniciarCiclo, 0)

        return () => {
            ativo = false
            clearTimeout(timerInicial)
        }
    }, [
        mostrarTarja,
        tempoEntradaTarja,
        tempoVisivelTarja,
        tempoSaidaTarja,
        tempoOcultaTarja,
        tempoInicialTarja,
        midiaId
    ])

    return {
        faseTarja,
        mostrarQrTelejornal
    }
}
