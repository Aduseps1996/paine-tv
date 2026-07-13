"use client"

import { useEffect, useMemo, useState } from "react"

import {
    collection,
    onSnapshot,
    orderBy,
    query
} from "firebase/firestore"

import { db } from "@/lib/firebase"
import type { Noticia } from "@/types/painel"

type UseNoticiasPainelParams = {
    modoPreview?: boolean
    previewNoticias?: Noticia[]
}

function noticiaEstaDentroDoHorario(noticia: Noticia, agora: Date) {
    if (!noticia.programada) return true

    if (!noticia.inicioExibicao || !noticia.fimExibicao) {
        return false
    }

    const inicio = new Date(noticia.inicioExibicao)
    const fim = new Date(noticia.fimExibicao)

    if (Number.isNaN(inicio.getTime()) || Number.isNaN(fim.getTime())) {
        return false
    }

    if (!agora) return false

    return agora >= inicio && agora <= fim
}

export function useNoticiasPainel({
    modoPreview = false,
    previewNoticias
}: UseNoticiasPainelParams) {
    const [noticias, setNoticias] = useState<Noticia[]>([])
    const [agora, setAgora] = useState(() => new Date())

    useEffect(() => {
        const relogio = setInterval(() => {
            setAgora(new Date())
        }, 30000)

        return () => clearInterval(relogio)
    }, [])

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

                const listaAtiva = lista.filter((noticia) => noticia.ativo === true)

                setNoticias(listaAtiva)
            },
            () => {
                setNoticias([])
            }
        )

        return () => unsubscribe()
    }, [modoPreview])

    const noticiasBase = useMemo(() => {
        return modoPreview ? previewNoticias || [] : noticias
    }, [modoPreview, previewNoticias, noticias])

    const noticiasVisiveis = useMemo(() => {
        return noticiasBase.filter((noticia) => noticiaEstaDentroDoHorario(noticia, agora))
    }, [agora, noticiasBase])

    return {
        noticias,
        noticiasVisiveis
    }
}
