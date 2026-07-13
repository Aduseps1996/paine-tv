"use client"

import { useEffect, useState } from "react"

import {
    collection,
    doc,
    onSnapshot,
    orderBy,
    query
} from "firebase/firestore"

import { db } from "@/lib/firebase"
import type { ConfiguracoesPainel, Midia, Noticia } from "@/types/painel"

type UsePainelDataParams = {
    modoPreview?: boolean
    previewConfiguracoes?: ConfiguracoesPainel
    previewMidias?: Midia[]
    previewNoticias?: Noticia[]
}

export function usePainelData({
    modoPreview = false,
    previewConfiguracoes,
    previewMidias,
    previewNoticias
}: UsePainelDataParams) {
    const [midiasPublicadas, setMidiasPublicadas] = useState<Midia[]>([])
    const [noticiasPublicadas, setNoticiasPublicadas] = useState<Noticia[]>([])
    const [configuracoesPublicadas, setConfiguracoesPublicadas] =
        useState<ConfiguracoesPainel>({})

    useEffect(() => {
        if (modoPreview) return

        const consulta = query(
            collection(db, "midias"),
            orderBy("ordem", "asc")
        )

        const unsubscribe = onSnapshot(
            consulta,
            (resultado) => {
                const lista = resultado.docs.map((documento) => ({
                    id: documento.id,
                    ...documento.data()
                })) as Midia[]

                setMidiasPublicadas(lista)
            },
            () => {
                setMidiasPublicadas([])
            }
        )

        return () => unsubscribe()
    }, [modoPreview])

    useEffect(() => {
        if (modoPreview) return

        const consulta = query(
            collection(db, "noticias"),
            orderBy("ordem", "asc")
        )

        const unsubscribe = onSnapshot(
            consulta,
            (resultado) => {
                const lista = resultado.docs.map((documento) => ({
                    id: documento.id,
                    ...documento.data()
                })) as Noticia[]

                setNoticiasPublicadas(lista)
            },
            () => {
                setNoticiasPublicadas([])
            }
        )

        return () => unsubscribe()
    }, [modoPreview])

    useEffect(() => {
        if (modoPreview) return

        const unsubscribe = onSnapshot(
            doc(db, "configuracoes", "geral"),
            (documento) => {
                if (!documento.exists()) return

                setConfiguracoesPublicadas(documento.data() as ConfiguracoesPainel)
            },
            () => {
                setConfiguracoesPublicadas({})
            }
        )

        return () => unsubscribe()
    }, [modoPreview])

    if (modoPreview) {
        return {
            midias: previewMidias || [],
            noticias: previewNoticias || [],
            configuracoes: previewConfiguracoes || {}
        }
    }

    return {
        midias: midiasPublicadas,
        noticias: noticiasPublicadas,
        configuracoes: configuracoesPublicadas
    }
}
