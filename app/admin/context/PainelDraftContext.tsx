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
    AvisoUrgente,
    ConfiguracoesPainel,
    Midia,
    Noticia
} from "@/types/painel"
import {
    excluirArquivosMidiaStorage,
    excluirMidiaStorage
} from "@/utils/excluirMidiaStorage"

type PainelDraft = {
    configuracoes: ConfiguracoesPainel
    midias: Midia[]
    noticias: Noticia[]
    comunicados: AvisoUrgente[]
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
    atualizarComunicadosDraft: (comunicados: AvisoUrgente[]) => void
    descartarAlteracoes: () => Promise<void>
    publicar: () => Promise<void>
}

const estadoVazio: PainelDraft = {
    configuracoes: {},
    midias: [],
    noticias: [],
    comunicados: []
}

const PainelDraftContext = createContext<PainelDraftContextValue | null>(null)

async function limparMidiasRemovidasDoStorage(
    midiasPublicadas: Midia[],
    midiasDraft: Midia[]
) {
    const midiasAtuais = new Map(
        midiasDraft.map((midia) => [midia.id, midia])
    )

    const arquivosObsoletos = midiasPublicadas.map((midiaPublicada) => {
        const midiaAtual = midiasAtuais.get(midiaPublicada.id)

        return {
            storagePath:
                !midiaAtual ||
                midiaAtual.storagePath !== midiaPublicada.storagePath
                    ? midiaPublicada.storagePath
                    : undefined,
            thumbnailStoragePath:
                !midiaAtual ||
                midiaAtual.thumbnailStoragePath !==
                    midiaPublicada.thumbnailStoragePath
                    ? midiaPublicada.thumbnailStoragePath
                    : undefined,
            personalizacaoVisual: {
                fundoStoragePath:
                    !midiaAtual ||
                    midiaAtual.personalizacaoVisual?.fundoStoragePath !==
                        midiaPublicada.personalizacaoVisual?.fundoStoragePath
                        ? midiaPublicada.personalizacaoVisual?.fundoStoragePath
                        : undefined
            }
        }
    })

    await Promise.all(
        arquivosObsoletos.map((midia) =>
            excluirArquivosMidiaStorage(midia)
        )
    )
}

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

    const atualizarComunicadosDraft = useCallback(
        (comunicados: AvisoUrgente[]) => {
            setDraft((atual) => ({
                ...atual,
                comunicados
            }))
        },
        []
    )

    const descartarAlteracoes = useCallback(async () => {
        const caminhosPublicados = new Set(
            publicado.midias.flatMap((midia) =>
                [
                    midia.storagePath,
                    midia.thumbnailStoragePath,
                    midia.personalizacaoVisual?.fundoStoragePath
                ].filter((caminho): caminho is string => Boolean(caminho))
            )
        )
        const caminhosDescartados = draft.midias
            .flatMap((midia) => [
                midia.storagePath,
                midia.thumbnailStoragePath,
                midia.personalizacaoVisual?.fundoStoragePath
            ])
            .filter(
                (caminho): caminho is string =>
                    typeof caminho === "string" &&
                    caminho.length > 0 &&
                    !caminhosPublicados.has(caminho)
            )
        const fundoGlobalDescartado =
            draft.configuracoes.personalizacaoBanners?.fundoStoragePath
        const fundoGlobalPublicado =
            publicado.configuracoes.personalizacaoBanners?.fundoStoragePath

        if (
            fundoGlobalDescartado &&
            fundoGlobalDescartado !== fundoGlobalPublicado
        ) {
            caminhosDescartados.push(fundoGlobalDescartado)
        }

        setDraft({
            configuracoes: { ...publicado.configuracoes },
            midias: publicado.midias.map((midia) => ({ ...midia })),
            noticias: publicado.noticias.map((noticia) => ({ ...noticia })),
            comunicados: publicado.comunicados.map((comunicado) => ({
                ...comunicado
            }))
        })

        const resultados = await Promise.allSettled(
            [...new Set(caminhosDescartados)].map(excluirMidiaStorage)
        )

        if (resultados.some((resultado) => resultado.status === "rejected")) {
            console.warn("Alguns uploads descartados não puderam ser removidos.")
        }
    }, [
        draft.midias,
        draft.configuracoes.personalizacaoBanners?.fundoStoragePath,
        publicado
    ])

    const temAlteracoesPendentes = useMemo(() => {
        return JSON.stringify(draft) !== JSON.stringify(publicado)
    }, [draft, publicado])

    const publicar = useCallback(async () => {
        try {
            setPublicando(true)

            await publicarPainel(draft)
            setPublicado(draft)

            // Só remove os arquivos antigos depois que o novo estado já está
            // completamente publicado no Firestore.
            const resultadosLimpeza = await Promise.allSettled([
                limparMidiasRemovidasDoStorage(publicado.midias, draft.midias),
                publicado.configuracoes.personalizacaoBanners?.fundoStoragePath !==
                    draft.configuracoes.personalizacaoBanners?.fundoStoragePath
                    ? excluirMidiaStorage(
                        publicado.configuracoes.personalizacaoBanners
                            ?.fundoStoragePath
                    )
                    : Promise.resolve()
            ])

            if (
                resultadosLimpeza.some(
                    (resultado) => resultado.status === "rejected"
                )
            ) {
                console.warn(
                    "O painel foi publicado, mas alguns arquivos antigos não puderam ser removidos."
                )
            }

            alert("Painel publicado na TV!")
        } catch (erro) {
            console.error("Erro ao publicar o painel:", erro)
            alert(
                erro instanceof Error
                    ? erro.message
                    : "Não foi possível publicar o painel."
            )
        } finally {
            setPublicando(false)
        }
    }, [draft, publicado])

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
            atualizarComunicadosDraft,
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
            atualizarComunicadosDraft,
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
