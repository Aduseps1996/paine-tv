"use client"

// ============================================================================
// IMPORTS
// ============================================================================
import { useEffect, useState } from "react"

import {
    collection,
    onSnapshot,
    query,
    orderBy
} from "firebase/firestore"

import { db } from "../lib/firebase"

// ============================================================================
// TIPOS E INTERFACES
// ============================================================================

/**
 * Tipo Midia
 * Modelo de dados de uma mídia exibida no banner rotativo.
 * Usa o mesmo formato de documento armazenado no Firebase.
 */
type Midia = {
    id?: string
    tipo: "imagem" | "video"
    arquivo: string
    ativo: boolean
    ordem: number
    duracao: number
    template?: "cheio" | "informativo" | "institucional" | "urgente"
    titulo?: string
    subtitulo?: string
    rodape?: string
    qrcode?: string
    categoria?: string
    cta?: string
}

// ============================================================================
// COMPONENTE PRINCIPAL: BannerRotativo
// ============================================================================

/**
 * BannerRotativo
 * Componente que exibe um banner rotativo com conteúdo carregado do Firebase.
 * Suporta múltiplos templates (cheio, informativo, institucional, urgente)
 * e diferentes tipos de mídia (imagem e vídeo).
 * 
 * Props:
 * - fallback: URL da imagem padrão para usar quando não há mídia disponível
 */
export default function BannerRotativo({
    fallback
}: {
    fallback: string
}) {

    // --------------------------------------------------------------------------
    // ESTADO DO COMPONENTE
    // --------------------------------------------------------------------------
    
    // Lista de mídias ativas carregadas do Firebase
    const [midias, setMidias] = useState<Midia[]>([])
    // Índice da mídia atualmente exibida
    const [indiceAtual, setIndiceAtual] = useState(0)
    // Controla transição de opacidade ao trocar de mídia
    const [visivel, setVisivel] = useState(true)
    // Flag para indicar erro ao carregar a mídia
    const [erroMidia, setErroMidia] = useState(false)


    // --------------------------------------------------------------------------
    // VARIÁVEIS DERIVADAS
    // --------------------------------------------------------------------------
    
    // Verifica se há mais de uma mídia disponível para rotação
    const possuiRotacao = midias.length > 1
    // Obtém a mídia atualmente sendo exibida
    const midiaAtual = midias[indiceAtual]

    // --------------------------------------------------------------------------
    // EFEITOS
    // --------------------------------------------------------------------------

    /**
     * Efeito: Resetar estado de erro ao trocar de mídia
     * Garante que a próxima mídia será exibida sem o estado de erro anterior
     */
    useEffect(() => {
        setErroMidia(false)
    }, [indiceAtual])


    // --------------------------------------------------------------------------
    // FUNÇÕES UTILITÁRIAS
    // --------------------------------------------------------------------------

    /**
     * avancarMidia()
     * Avança para a próxima mídia na lista com transição suave.
     * - Desativa visibilidade da mídia atual
     * - Aguarda 1.2s para transição
     * - Incrementa o índice (volta ao início se necessário)
     * - Reativa visibilidade da nova mídia
     */
    function avancarMidia() {
        if (midias.length <= 1) return

        setVisivel(false)

        setTimeout(() => {
            setIndiceAtual((valorAtual) => {
                const proximo = valorAtual + 1

                if (proximo >= midias.length) {
                    return 0
                }

                return proximo
            })

            setVisivel(true)
        }, 1200)
    }

    /**
     * Efeito: Subscrição em tempo real do Firebase
     * - Carrega todas as mídias da coleção "midias"
     * - Filtra apenas as mídias com status "ativo"
     * - Ordena pela ordem especificada
     * - Ajusta o índice se a lista ficar menor
     * - Desinscreve ao desmontar o componente
     */
    useEffect(() => {

        const consulta = query(
            collection(db, "midias"),
            orderBy("ordem", "asc")
        )

        const unsubscribe = onSnapshot(consulta, (resultado) => {

            const lista = resultado.docs.map((doc) => ({
                id: doc.id,
                ...doc.data()
            })) as Midia[]

            // Filtra apenas as mídias ativas
            const listaAtiva = lista.filter(
                (midia) => midia.ativo === true
            )

            setMidias(listaAtiva)

            // Ajusta o índice atual caso a lista fique menor após atualização
            setIndiceAtual((indiceAtual) => {
                if (indiceAtual >= listaAtiva.length) {
                    return 0
                }

                return indiceAtual
            })

        })

        return () => unsubscribe()

    }, [])

    /**
     * Efeito: Rotação automática para imagens
     * - Só ativa se houver mais de uma mídia
     * - Só ativa para mídias do tipo "imagem"
     * - Usa a duração da mídia para definir o intervalo
     * - Limpa o intervalo ao desmontar
     */
    useEffect(() => {
        if (!midiaAtual) return

        if (midias.length <= 1) return

        if (midiaAtual.tipo !== "imagem") return

        const intervaloBanner = setInterval(() => {
            avancarMidia()
        }, midiaAtual.duracao * 1000)

        return () => clearInterval(intervaloBanner)
    }, [midiaAtual, midias.length])

    // --------------------------------------------------------------------------
    // RENDERIZAÇÃO: Fallback (sem mídia disponível)
    // --------------------------------------------------------------------------

    /**
     * Se não houver mídia disponível, exibe uma imagem padrão (fallback)
     */
    if (midias.length === 0 || !midiaAtual || erroMidia) {
        return (
            <img
                src={fallback}
                alt="Imagem padrão"
                className="absolute inset-0 w-full h-full object-cover"
            />
        )
    }

    const templateAtual = midiaAtual.template || "cheio"

    /* Área destinada à mídia - Institucional */
    const areaMidia =
    "absolute inset-x-0 top-0 bottom-[clamp(88px,10vh,132px)] h-auto w-full object-cover"

    /* Área destinada à mídia - Informativo */
    const areaMidiaInformativa =
    "absolute top-0 left-0 w-full h-[calc(100vh-6.5rem)] object-cover"

    const transicaoMidia = possuiRotacao
        ? `transition-opacity duration-700 ease-in-out ${
            visivel ? "opacity-100" : "opacity-0"
        }`
        : ""

    const animacaoImagemInformativa = possuiRotacao
        ? "scale-[1.02] animate-[zoomBanner_22s_linear_infinite]"
        : ""

    const animacaoImagemInstitucional = possuiRotacao
        ? "scale-[1.02] animate-[zoomBanner_24s_linear_infinite]"
        : ""

    // --------------------------------------------------------------------------
    // RENDERIZAÇÃO: TEMPLATE INFORMATIVO
    // --------------------------------------------------------------------------

    /**
     * Template "informativo"
     * Exibe mídia em tela cheia com caixa de texto informativa no canto superior direito
     * - Imagem ou vídeo como fundo (com zoom e filtros)
     * - Card azul com categoria, título e subtítulo
     */
    if (templateAtual === "informativo") {

        return (

            <div className="absolute inset-0">

                {/* Mídia de fundo (imagem ou vídeo) */}
                {midiaAtual.tipo === "imagem" ? (
                    <img
                        src={midiaAtual.arquivo}
                        alt="Banner institucional"
                        onError={(e) => {
                            e.currentTarget.src = fallback
                        }}
                        className={`${areaMidiaInformativa} ${animacaoImagemInformativa} brightness-[0.96] contrast-[1.04] saturate-[1.02] ${transicaoMidia}`} />
                ) : (
                    <video
                        src={midiaAtual.arquivo}
                        autoPlay
                        muted
                        playsInline
                        className={`${areaMidiaInformativa} ${animacaoImagemInformativa} brightness-[0.96] contrast-[1.04] saturate-[1.02] ${transicaoMidia}`}
                        onError={() => {
                            if (midias.length <= 1) {
                                setErroMidia(true)
                                return
                            }

                            avancarMidia()
                        }}
                        onEnded={(e) => {
                            if (midias.length <= 1) {
                                e.currentTarget.currentTime = 0
                                e.currentTarget.play()
                                return
                            }

                            avancarMidia()
                        }}
                    />
                )}

                {/* Card com informações sobrepostas */}
                <div className="absolute top-10 right-10 w-[420px] rounded-3xl overflow-hidden bg-black/35 bg-[#342c7c]/75 border border-white/10 shadow-2xl z-10">

                    {/* Header com categoria em fundo azul claro */}
                    <div className="bg-[#34bcf8] px-6 py-4">

                        <h2 className="text-2xl font-black text-white tracking-wide">
                            {midiaAtual.categoria || "ADUSEPS"}
                        </h2>

                    </div>

                    {/* Conteúdo: título e subtítulo */}
                    <div className="p-6 text-white">

                        <p className="text-3xl font-bold leading-tight">
                            {midiaAtual.titulo || "Informação e compromisso com o associado."}
                        </p>

                        <div className="mt-6 h-px bg-white/10" />

                        <p className="mt-6 text-lg text-white/80 leading-relaxed">
                            {midiaAtual.subtitulo || "Atendimento jurídico, financeiro e institucional com transparência e acolhimento."}
                        </p>

                    </div>

                </div>

            </div>

        )
    }

    // --------------------------------------------------------------------------
    // RENDERIZAÇÃO: TEMPLATE INSTITUCIONAL
    // --------------------------------------------------------------------------

    /**
     * Template "institucional"
     * Exibe mídia com gradient overlay e card de conteúdo no lado esquerdo
     * - Imagem ou vídeo como fundo
     * - Gradiente escuro da esquerda para transparência à direita
     * - Card com badge de categoria, título, descrição e QR Code opcional
     */
    if (templateAtual === "institucional") {
        return (
            <div className="absolute inset-0 overflow-hidden">
                
                {/* Mídia de fundo (imagem ou vídeo) */}
                {midiaAtual.tipo === "imagem" ? (
                    <img
                        src={midiaAtual.arquivo}
                        alt="Banner institucional"
                        onError={(e) => {
                            e.currentTarget.src = fallback
                        }}
                        className={`${areaMidia} ${animacaoImagemInstitucional} brightness-[0.92] contrast-[1.04] ${transicaoMidia}`}
                    />
                ) : (
                    <video
                        src={midiaAtual.arquivo}
                        autoPlay
                        muted
                        playsInline
                        className={`${areaMidia} ${animacaoImagemInstitucional} brightness-[0.92] contrast-[1.04] ${transicaoMidia}`}
                        onError={() => {
                            if (midias.length <= 1) {
                                setErroMidia(true)
                                return
                            }

                            avancarMidia()
                        }}

                        onEnded={(e) => {
                            if (midias.length <= 1) {
                                e.currentTarget.currentTime = 0
                                e.currentTarget.play()
                                return
                            }

                            avancarMidia()
                        }}
                    />
                )}

                {/* Overlay gradient para melhor legibilidade */}
                <div className="absolute inset-0 bg-gradient-to-r from-[#071633]/85 via-[#071633]/45 to-transparent" />

                {/* Card com informações sobrepostas */}
                <div className="absolute left-[clamp(1rem,4vw,3.5rem)] top-1/2 w-[min(88vw,560px)] -translate-y-1/2">
                    <div className="rounded-[2rem] border border-white/10 bg-black/20 bg-black/35 p-[clamp(1.25rem,3vw,2.5rem)] shadow-[0_25px_80px_rgba(0,0,0,0.45)]">
                        
                        {/* Badge com categoria */}
                        <div className="inline-flex items-center rounded-full bg-[#34bcf8]/15 border border-[#34bcf8]/30 px-5 py-2 mb-6">
                            <span className="text-sm font-black uppercase tracking-[0.18em] text-[#34bcf8]">
                                {midiaAtual.categoria || "ADUSEPS"}
                            </span>
                        </div>

                        {/* Título principal */}
                        <h1 className="text-[clamp(2rem,4vw,3rem)] font-black leading-[1.05] text-white">
                            {midiaAtual.titulo || "Informação e acolhimento ao associado"}
                        </h1>

                        {/* Subtítulo/descrição */}
                        <p className="mt-6 text-[clamp(1rem,1.8vw,1.25rem)] leading-relaxed text-white/80">
                            {midiaAtual.subtitulo || "Serviços institucionais, comunicados e conteúdos importantes exibidos em tempo real para melhor atendimento."}
                        </p>

                        {/* Divisor com rodapé */}
                        <div className="mt-10 flex items-center gap-4">
                            <div className="w-16 h-1 rounded-full bg-[#34bcf8]" />

                            <span className="text-sm font-bold uppercase tracking-[0.22em] text-white/60">
                                {midiaAtual.rodape || "Painel Institucional"}
                            </span>
                        </div>

                        {/* Seção QR Code (opcional) */}
                        {midiaAtual.qrcode && midiaAtual.qrcode.trim() !== "" && (
                            <div className="mt-8 flex items-center gap-5 rounded-2xl border border-white/10 bg-white/10 p-4">
                                {/* Imagem do QR Code */}
                                <img
                                    src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(midiaAtual.qrcode)}`}
                                    alt="QR Code"
                                    className="h-28 w-28 rounded-xl bg-white p-2"
                                />

                                {/* Texto auxiliar do QR Code */}
                                <div>
                                    <p className="text-sm font-bold uppercase tracking-[0.22em] text-white/55">
                                        Acesse pelo celular
                                    </p>

                                    <p className="mt-2 text-lg font-semibold text-white/85">
                                        {midiaAtual.cta || "Aponte a câmera para o QR Code"}
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        )
    }

    // --------------------------------------------------------------------------
    // RENDERIZAÇÃO: TEMPLATE URGENTE
    // --------------------------------------------------------------------------

    /**
     * Template "urgente"
     * Exibe mídia com filtro muito escuro e texto grande em primeiro plano
     * - Imagem ou vídeo como fundo (muito escurecido)
     * - Badge vermelha com "URGENTE" no topo
     * - Título grande, subtítulo e rodapé com destaque
     */
    if (templateAtual === "urgente") {
        return (
            <div className="absolute inset-0 overflow-hidden">

                {/* Mídia de fundo (imagem ou vídeo) */}
                {midiaAtual.tipo === "imagem" ? (
                    <img
                        src={midiaAtual.arquivo}
                        alt="Banner urgente"
                        onError={(e) => {
                            e.currentTarget.src = fallback
                        }}
                        className={`${areaMidia} brightness-[0.45] ${possuiRotacao
                            ? `transition-opacity duration-700 ease-in-out ${visivel ? "opacity-100" : "opacity-0"
                            }`
                            : ""
                            }`}
                    />
                ) : (
                    <video
                        src={midiaAtual.arquivo}
                        autoPlay
                        muted
                        playsInline
                        className={`${areaMidia} brightness-[0.45] ${possuiRotacao
                            ? `transition-opacity duration-700 ease-in-out ${visivel ? "opacity-100" : "opacity-0"
                            }`
                            : ""
                            }`}
                        onError={() => {
                            if (midias.length <= 1) {
                                setErroMidia(true)
                                return
                            }

                            avancarMidia()
                        }}

                        onEnded={(e) => {
                            if (midias.length <= 1) {
                                e.currentTarget.currentTime = 0
                                e.currentTarget.play()
                                return
                            }

                            avancarMidia()
                        }}
                    />
                )}

                {/* Overlay gradient em tons avermelhados para urgência */}
                <div className="absolute inset-0 bg-gradient-to-r from-[#3b0000]/90 via-[#220000]/75 to-black/50" />

                {/* Badge URGENTE no topo esquerdo */}
                <div className="absolute left-[clamp(1rem,4vw,4rem)] top-[clamp(1rem,6vh,4rem)]">
                    <div className="inline-flex items-center rounded-full bg-red-600 px-6 py-3 shadow-2xl">
                        <span className="text-lg font-black uppercase tracking-[0.25em] text-white">
                            {midiaAtual.categoria || "URGENTE"}
                        </span>
                    </div>
                </div>

                {/* Conteúdo textual centrado verticalmente */}
                <div className="absolute left-[clamp(1rem,4vw,4rem)] top-1/2 max-w-[min(90vw,1000px)] -translate-y-1/2">
                    {/* Título em tamanho grande */}
                    <h1 className="text-[clamp(2.5rem,7vw,5rem)] font-black leading-[0.95] text-white drop-shadow-2xl">
                        {midiaAtual.titulo || "Comunicado Importante"}
                    </h1>

                    {/* Subtítulo/descrição */}
                    <p className="mt-8 text-[clamp(1.25rem,3vw,2rem)] leading-relaxed text-white/90">
                        {midiaAtual.subtitulo || "Informações importantes para os associados."}
                    </p>

                    {/* Rodapé (opcional) */}
                    {midiaAtual.rodape && midiaAtual.rodape.trim() !== "" && (
                        <p className="mt-8 text-xl font-bold uppercase tracking-[0.20em] text-white/65">
                            {midiaAtual.rodape}
                        </p>
                    )}
                </div>

            </div>
        )
    }

    // --------------------------------------------------------------------------
    // RENDERIZAÇÃO: TEMPLATE PADRÃO (CHEIO)
    // --------------------------------------------------------------------------

    /**
     * Template "cheio" (padrão)
     * Exibe apenas mídia em tela cheia (imagem ou vídeo)
     * - Sem sobreposições de texto
     * - Suporta transição de rotação
     * - Trata erros e término de vídeos
     */
    return (
        <>

            {/* Renderização condicional: imagem ou vídeo */}
            {
                midiaAtual.tipo === "imagem" ? (

                    // ---- IMAGEM ----
                    <img
                        src={midiaAtual.arquivo}
                        alt="Banner"
                        onError={(e) => {
                            e.currentTarget.src = fallback
                        }}
                        className={`${areaMidia} ${transicaoMidia}`}
                    />

                ) : (

                    // ---- VÍDEO ----
                    <video
                        src={midiaAtual.arquivo}
                        autoPlay
                        muted
                        playsInline
                        className={`${areaMidia} ${transicaoMidia}`}

                        onError={() => {
                            // Se é a única mídia, marca como erro e exibe fallback
                            if (midias.length <= 1) {
                                setErroMidia(true)
                                return
                            }

                            // Caso contrário, avança para a próxima mídia
                            avancarMidia()
                        }}

                        onEnded={(e) => {
                            // Se é a única mídia, reinicia a reprodução em loop
                            if (midias.length <= 1) {
                                e.currentTarget.currentTime = 0
                                e.currentTarget.play()
                                return
                            }

                            // Caso contrário, avança para a próxima mídia
                            avancarMidia()
                        }}
                    />

                )
            }

        </>
    )
}