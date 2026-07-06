"use client"

import {
    createContext,
    useCallback,
    useContext,
    useMemo,
    useState
} from "react"

import { publicarPainel } from "@/lib/firestore/publicacao"
import type {
    ConfiguracoesPainel,
    Midia,
    Noticia
} from "@/types/painel"

type PainelDraft = {
    configuracoes: ConfiguracoesPainel
    midias: Midia[]
    noticias: Noticia[]
}

type EstadoInicial = PainelDraft

type PainelDraftContextValue = {
    publicado: PainelDraft
    draft: PainelDraft
    temAlteracoesPendentes: boolean
    publicando: boolean

    carregarPublicadoNoDraft: (dados: EstadoInicial) => void
    atualizarConfiguracoesDraft: (configuracoes: Partial<ConfiguracoesPainel>) => void
    atualizarMidiasDraft: (midias: Midia[]) => void
    atualizarNoticiasDraft: (noticias: Noticia[]) => void
    descartarAlteracoes: () => void
    publicar: () => Promise<void>
}

const estadoVazio: PainelDraft = {
    configuracoes: {},
    midias: [],
    noticias: []
}

const PainelDraftContext = createContext<PainelDraftContextValue | null>(null)

export function PainelDraftProvider({
    children
}: {
    children: React.ReactNode
}) {
    const [publicado, setPublicado] = useState<PainelDraft>(estadoVazio)
    const [draft, setDraft] = useState<PainelDraft>(estadoVazio)
    const [publicando, setPublicando] = useState(false)

    const carregarPublicadoNoDraft = useCallback((dados: EstadoInicial) => {
        setPublicado(dados)
        setDraft(dados)
    }, [])

    const atualizarConfiguracoesDraft = useCallback(
        (configuracoes: Partial<ConfiguracoesPainel>) => {
            setDraft((atual) => ({
                ...atual,
                configuracoes: {
                    ...atual.configuracoes,
                    ...configuracoes
                }
            }))
        },
        []
    )

    const atualizarMidiasDraft = useCallback((midias: Midia[]) => {
        setDraft((atual) => ({
            ...atual,
            midias
        }))
    }, [])

    const atualizarNoticiasDraft = useCallback((noticias: Noticia[]) => {
        setDraft((atual) => ({
            ...atual,
            noticias
        }))
    }, [])

    const descartarAlteracoes = useCallback(() => {
        setDraft({
            configuracoes: { ...publicado.configuracoes },
            midias: publicado.midias.map((midia) => ({ ...midia })),
            noticias: publicado.noticias.map((noticia) => ({ ...noticia }))
        })
    }, [publicado])

    const temAlteracoesPendentes = useMemo(() => {
        return JSON.stringify(draft) !== JSON.stringify(publicado)
    }, [draft, publicado])

    const publicar = useCallback(async () => {
        try {
            setPublicando(true)
            await publicarPainel(draft)
            setPublicado(draft)
            alert("Painel publicado na TV!")
        } finally {
            setPublicando(false)
        }
    }, [draft])

    const value = useMemo(
        () => ({
            publicado,
            draft,
            temAlteracoesPendentes,
            publicando,
            carregarPublicadoNoDraft,
            atualizarConfiguracoesDraft,
            atualizarMidiasDraft,
            atualizarNoticiasDraft,
            descartarAlteracoes,
            publicar
        }),
        [
            publicado,
            draft,
            temAlteracoesPendentes,
            publicando,
            carregarPublicadoNoDraft,
            atualizarConfiguracoesDraft,
            atualizarMidiasDraft,
            atualizarNoticiasDraft,
            descartarAlteracoes,
            publicar
        ]
    )

    return (
        <PainelDraftContext.Provider value={value}>
            {children}
        </PainelDraftContext.Provider>
    )
}

export function usePainelDraftContext() {
    const context = useContext(PainelDraftContext)

    if (!context) {
        throw new Error(
            "usePainelDraftContext deve ser usado dentro de PainelDraftProvider."
        )
    }

    return context
}
