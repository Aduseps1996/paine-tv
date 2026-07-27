"use client"

import { useCallback, useEffect, useState } from "react"

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
import {
    listarComunicados,
    ordenarComunicados
} from "@/lib/firestore/comunicados"
import type { AvisoUrgente, Midia, Noticia } from "@/types/painel"

export function useAdminCollections(habilitado = true) {
    const [midias, setMidias] = useState<Midia[]>([])
    const [noticias, setNoticias] = useState<Noticia[]>([])
    const [comunicados, setComunicados] = useState<AvisoUrgente[]>([])
    const [colecoesCarregadas, setColecoesCarregadas] = useState(false)
    const [erroCarregamento, setErroCarregamento] = useState<string | null>(null)

    const carregarMidias = useCallback(async () => {
        setMidias(await listarMidias())
    }, [])

    const carregarNoticias = useCallback(async () => {
        setNoticias(await listarNoticias())
    }, [])

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
        if (!habilitado) {
            const timeout = window.setTimeout(() => {
                setColecoesCarregadas(false)
                setErroCarregamento(null)
            }, 0)

            return () => window.clearTimeout(timeout)
        }

        let ativo = true

        void Promise.resolve().then(() => {
            if (!ativo) return
            setColecoesCarregadas(false)
            setErroCarregamento(null)
        })

        void Promise.all([
            listarMidias(),
            listarNoticias(),
            listarComunicados()
        ])
            .then(([midiasCarregadas, noticiasCarregadas, comunicadosCarregados]) => {
                if (!ativo) return

                // Atualiza as duas coleções juntas para o rascunho nunca ser
                // inicializado com apenas metade dos dados publicados.
                setMidias(midiasCarregadas)
                setNoticias(noticiasCarregadas)
                setComunicados(ordenarComunicados(comunicadosCarregados))
                setErroCarregamento(null)
                setColecoesCarregadas(true)
            })
            .catch((erro: unknown) => {
                if (!ativo) return

                setErroCarregamento(
                    erro instanceof Error
                        ? erro.message
                        : "Não foi possível carregar o conteúdo publicado."
                )
                setColecoesCarregadas(false)
            })

        return () => {
            ativo = false
        }
    }, [habilitado])

    return {
        midias,
        noticias,
        comunicados,
        colecoesCarregadas,
        erroCarregamento,
        carregarMidias,
        carregarNoticias,
        removerMidia,
        removerNoticia,
        alternarMidia,
        alternarNoticia
    }
}
