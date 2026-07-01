"use client"

import { useEffect, useMemo, useState } from "react"

import type { Midia, Noticia } from "@/types/painel"

export function useAdminPreview(midias: Midia[], noticias: Noticia[]) {
    const [indicePreview, setIndicePreview] = useState(0)

    const midiasAtivas = useMemo(() => {
        return [...midias]
            .filter((midia) => midia.ativo)
            .sort((a, b) => a.ordem - b.ordem)
    }, [midias])

    const noticiasAtivas = useMemo(() => {
        return [...noticias]
            .filter((noticia) => noticia.ativo)
            .sort((a, b) => a.ordem - b.ordem)
    }, [noticias])

    const activeIds = midiasAtivas.map((midia) => midia.id).join(",")
    const midiaPreview = midiasAtivas[indicePreview]

    useEffect(() => {
        if (midiasAtivas.length === 0) {
            const timeout = window.setTimeout(() => setIndicePreview(0), 0)
            return () => window.clearTimeout(timeout)
        }

        if (indicePreview >= midiasAtivas.length) {
            const timeout = window.setTimeout(() => setIndicePreview(0), 0)
            return () => window.clearTimeout(timeout)
        }
    }, [activeIds, indicePreview, midiasAtivas.length])

    useEffect(() => {
        if (midiasAtivas.length === 0) return

        const midiaAtual = midiasAtivas[indicePreview]

        if (!midiaAtual) {
            const timeout = window.setTimeout(() => setIndicePreview(0), 0)
            return () => window.clearTimeout(timeout)
        }

        if (midiaAtual.tipo !== "imagem") return

        const intervalo = window.setInterval(() => {
            setIndicePreview((indiceAtual) => {
                const proximoIndice = indiceAtual + 1

                if (proximoIndice >= midiasAtivas.length) {
                    return 0
                }

                return proximoIndice
            })
        }, midiaAtual.duracao * 1000)

        return () => window.clearInterval(intervalo)
    }, [activeIds, indicePreview, midiasAtivas])

    return {
        midiasAtivas,
        noticiasAtivas,
        midiaPreview
    }
}
