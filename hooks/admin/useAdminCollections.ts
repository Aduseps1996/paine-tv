"use client"

import { useEffect, useState } from "react"

import {
    atualizarMidia,
    listarMidias,
    removerMidiaPorId
} from "@/lib/firestore/midias"
import {
    atualizarNoticia,
    listarNoticias,
    removerNoticiaPorId
} from "@/lib/firestore/noticias"
import type { Midia, Noticia } from "@/types/painel"

export function useAdminCollections() {
    const [midias, setMidias] = useState<Midia[]>([])
    const [noticias, setNoticias] = useState<Noticia[]>([])

    async function carregarMidias() {
        setMidias(await listarMidias())
    }

    async function carregarNoticias() {
        setNoticias(await listarNoticias())
    }

    async function removerMidia(id: string) {
        await removerMidiaPorId(id)
        await carregarMidias()
    }

    async function removerNoticia(id: string) {
        await removerNoticiaPorId(id)
        await carregarNoticias()
    }

    async function alternarMidia(id: string, ativoAtual: boolean) {
        await atualizarMidia(id, {
            ativo: !ativoAtual
        })

        await carregarMidias()
    }

    async function alternarNoticia(id: string, ativoAtual: boolean) {
        await atualizarNoticia(id, {
            ativo: !ativoAtual
        })

        await carregarNoticias()
    }

    useEffect(() => {
        void Promise.resolve().then(async () => {
            await Promise.all([
                carregarMidias(),
                carregarNoticias()
            ])
        })
    }, [])

    return {
        midias,
        noticias,
        carregarMidias,
        carregarNoticias,
        removerMidia,
        removerNoticia,
        alternarMidia,
        alternarNoticia
    }
}
