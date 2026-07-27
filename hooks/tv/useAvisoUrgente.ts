"use client"

import { useEffect, useMemo, useRef, useState } from "react"

import type { AvisoUrgente } from "@/types/painel"
import { useComunicadosAtivos } from "./useComunicadosAtivos"

export function useAvisoUrgente(
    usarPreview = false,
    comunicadosPreview: AvisoUrgente[] = []
) {
    const comunicadosAtivos = useComunicadosAtivos(
        usarPreview,
        comunicadosPreview
    )
    const [avisoVisivel, setAvisoVisivel] =
        useState<AvisoUrgente | null>(null)
    const indiceRef = useRef(0)

    const sobreposicoes = useMemo(
        () => comunicadosAtivos.filter(
            (comunicado) => comunicado.exibirSobreposicao ?? true
        ),
        [comunicadosAtivos]
    )

    const assinatura = sobreposicoes
        .map((item) => [
            item.id,
            item.titulo,
            item.mensagem,
            item.intervaloSobreposicaoMinutos,
            item.duracaoSobreposicaoSegundos
        ].join(":"))
        .join("|")

    useEffect(() => {
        if (sobreposicoes.length === 0) {
            const limpar = window.setTimeout(() => {
                setAvisoVisivel(null)
            }, 0)

            return () => window.clearTimeout(limpar)
        }

        let cancelado = false
        let timeoutOcultar: number | null = null
        let timeoutRepetir: number | null = null

        function exibirProximo() {
            if (cancelado || sobreposicoes.length === 0) return

            const indice = indiceRef.current % sobreposicoes.length
            const comunicado = sobreposicoes[indice]
            indiceRef.current = (indice + 1) % sobreposicoes.length

            setAvisoVisivel(comunicado)

            const duracao = Math.max(
                5,
                Number(comunicado.duracaoSobreposicaoSegundos || 12)
            )

            timeoutOcultar = window.setTimeout(() => {
                if (cancelado) return

                setAvisoVisivel(null)

                const intervalo = Math.max(
                    1,
                    Number(comunicado.intervaloSobreposicaoMinutos || 10)
                )

                timeoutRepetir = window.setTimeout(
                    exibirProximo,
                    intervalo * 60 * 1000
                )
            }, duracao * 1000)
        }

        exibirProximo()

        return () => {
            cancelado = true

            if (timeoutOcultar !== null) {
                window.clearTimeout(timeoutOcultar)
            }

            if (timeoutRepetir !== null) {
                window.clearTimeout(timeoutRepetir)
            }
        }
        // A assinatura reinicia o ciclo apenas quando o conteúdo ou os
        // tempos mudam, não a cada atualização do relógio interno.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [assinatura])

    return avisoVisivel
}
