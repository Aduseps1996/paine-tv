"use client"

import { useEffect, useState } from "react"

import {
    collection,
    onSnapshot,
    query,
    orderBy
} from "firebase/firestore"

import { db } from "../lib/firebase"

// Modelo de dados de uma mídia exibida no banner rotativo
// Usa o mesmo formato de documento armazenado no Firebase
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

// Componente que exibe um banner rotativo com conteúdo carregado do Firebase.
// Recebe uma imagem de fallback para usar quando não há mídia disponível.
export default function BannerRotativo({
    fallback
}: {
    fallback: string
}) {

    // Lista de mídias ativas carregadas do Firebase
    const [midias, setMidias] = useState<Midia[]>([])
    // Índice da mídia atualmente exibida
    const [indiceAtual, setIndiceAtual] = useState(0)
    // Controla transição de opacidade ao trocar de mídia
    const [visivel, setVisivel] = useState(true)

    const midiaAtual = midias[indiceAtual]
    const possuiRotacao = midias.length > 1

    // Avança para a próxima mídia na lista, com transição de saída/entrada
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

    // Subscrição em tempo real ao Firebase para carregar mídias ordenadas
    // Sempre mantém o estado atualizado quando há alterações no banco.
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

    // Efeito de rotação automática para imagens.
    // Só entra em ação se houver mais de uma mídia e a mídia atual for imagem.
    useEffect(() => {
        if (!midiaAtual) return

        if (midias.length <= 1) return

        if (midiaAtual.tipo !== "imagem") return

        const intervaloBanner = setInterval(() => {
            avancarMidia()
        }, midiaAtual.duracao * 1000)

        return () => clearInterval(intervaloBanner)
    }, [midiaAtual, midias.length])

    // Se não houver mídia disponível, mostra o fallback padrão
    if (midias.length === 0 || !midiaAtual) {
        return (
            <img
                src={fallback}
                alt="Imagem padrão"
                className="absolute inset-0 w-full h-full object-cover"
            />
        )
    }

    const templateAtual = midiaAtual.template || "cheio"

    // Renderiza o template informativo: imagem em tela cheia com caixa de texto informativa
    if (templateAtual === "informativo") {

        return (

            <div className="absolute inset-0">

                <img
                    src={midiaAtual.arquivo}
                    alt="Banner institucional"
                    onError={(e) => {
                        e.currentTarget.src = fallback
                    }}
                    className={`absolute top-0 left-0 w-full h-[calc(100vh-6.5rem)] object-cover scale-[1.02] animate-[zoomBanner_22s_linear_infinite] brightness-[0.96] contrast-[1.04] saturate-[1.02] transition-opacity duration-[1600ms] ease-in-out ${visivel ? "opacity-100" : "opacity-0"
                        }`}
                />

                <div className="absolute top-10 right-10 w-[420px] rounded-3xl overflow-hidden backdrop-blur-md bg-[#342c7c]/75 border border-white/10 shadow-2xl z-10">

                    <div className="bg-[#34bcf8] px-6 py-4">

                        <h2 className="text-2xl font-black text-white tracking-wide">
                            ADUSEPS
                        </h2>

                    </div>

                    <div className="p-6 text-white">

                        <p className="text-3xl font-bold leading-tight">
                            Informação e compromisso com o associado.
                        </p>

                        <div className="mt-6 h-px bg-white/10" />

                        <p className="mt-6 text-lg text-white/80 leading-relaxed">
                            Atendimento jurídico, financeiro e institucional com transparência e acolhimento.
                        </p>

                    </div>

                </div>

            </div>

        )

    }

    // Renderiza o template institucional: imagem de fundo com texto, categoria e QR Code opcionais
    if (templateAtual === "institucional") {

        return (

            <div className="absolute inset-0 overflow-hidden">

                <img
                    src={midiaAtual.arquivo}
                    alt="Banner institucional"
                    onError={(e) => {
                        e.currentTarget.src = fallback
                    }}
                    className={`absolute top-0 left-0 w-full h-[calc(100vh-6.7rem)] object-cover scale-[1.02] animate-[zoomBanner_24s_linear_infinite] brightness-[0.92] contrast-[1.04] ${possuiRotacao
                        ? `transition-opacity duration-[1600ms] ease-in-out ${visivel ? "opacity-100" : "opacity-0"
                        }`
                        : ""
                        }`}
                />

                <div className="absolute inset-0 bg-gradient-to-r from-[#071633]/85 via-[#071633]/45 to-transparent" />

                <div className="absolute left-14 top-1/2 -translate-y-1/2 w-[560px]">

                    <div className="rounded-[2rem] border border-white/10 bg-black/20 backdrop-blur-md p-10 shadow-[0_25px_80px_rgba(0,0,0,0.45)]">

                        <div className="inline-flex items-center rounded-full bg-[#34bcf8]/15 border border-[#34bcf8]/30 px-5 py-2 mb-6">
                            <span className="text-sm font-black uppercase tracking-[0.18em] text-[#34bcf8]">
                                {midiaAtual.categoria || "ADUSEPS"}
                            </span>
                        </div>

                        <h1 className="text-5xl font-black leading-[1.05] text-white">
                            {midiaAtual.titulo || "Informação e acolhimento ao associado"}
                        </h1>

                        <p className="mt-6 text-xl leading-relaxed text-white/80">
                            {midiaAtual.subtitulo || "Serviços institucionais, comunicados e conteúdos importantes exibidos em tempo real para melhor atendimento."}
                        </p>

                        <div className="mt-10 flex items-center gap-4">

                            <div className="w-16 h-1 rounded-full bg-[#34bcf8]" />

                            <span className="text-sm font-bold uppercase tracking-[0.22em] text-white/60">
                                {midiaAtual.rodape || "Painel Institucional"}
                            </span>

                        </div>

                        {midiaAtual.qrcode && midiaAtual.qrcode.trim() !== "" && (
                            <div className="mt-8 flex items-center gap-5 rounded-2xl border border-white/10 bg-white/10 p-4">
                                <img
                                    src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(midiaAtual.qrcode)}`}
                                    alt="QR Code"
                                    className="h-28 w-28 rounded-xl bg-white p-2"
                                />

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

    if (templateAtual === "urgente") {

    return (

        <div className="absolute inset-0 overflow-hidden">

            <img
                src={midiaAtual.arquivo}
                alt="Banner urgente"
                onError={(e) => {
                    e.currentTarget.src = fallback
                }}
                className="absolute top-0 left-0 w-full h-[calc(100vh-6.7rem)] object-cover brightness-[0.45]"
            />

            <div className="absolute inset-0 bg-gradient-to-r from-[#3b0000]/90 via-[#220000]/75 to-black/50" />

            <div className="absolute top-16 left-16">

                <div className="inline-flex items-center rounded-full bg-red-600 px-6 py-3 shadow-2xl">
                    <span className="text-lg font-black uppercase tracking-[0.25em] text-white">
                        {midiaAtual.categoria || "URGENTE"}
                    </span>
                </div>

            </div>

            <div className="absolute left-16 top-1/2 -translate-y-1/2 max-w-[1000px]">

                <h1 className="text-7xl font-black leading-[0.95] text-white drop-shadow-2xl">
                    {midiaAtual.titulo || "Comunicado Importante"}
                </h1>

                <p className="mt-8 text-3xl leading-relaxed text-white/90">
                    {midiaAtual.subtitulo || "Informações importantes para os associados."}
                </p>

            </div>

        </div>

    )

}

    // Renderização padrão: exibe imagem ou vídeo para templates 'cheio' ou outros não tratados
    return (
        <>

            {
                midiaAtual.tipo === "imagem" ? (

                    <img
                        src={midiaAtual.arquivo}
                        alt="Banner institucional"
                        onError={(e) => {
                            e.currentTarget.src = fallback
                        }}
                        className={`absolute top-0 left-0 w-full h-[calc(100vh-6.7rem)] object-cover ${possuiRotacao
                            ? `transition-opacity duration-[1600ms] ease-in-out ${visivel ? "opacity-100" : "opacity-0"
                            }`
                            : ""
                            }`}
                    />

                ) : (

                    /* Configurações de video */
                    <video
                        src={midiaAtual.arquivo}
                        autoPlay
                        muted
                        className={`absolute top-0 left-0 w-full h-[calc(100vh-6.7rem)] object-cover brightness-[0.96] contrast-[1.04] saturate-[1.02] ${possuiRotacao
                            ? `transition-opacity duration-[1600ms] ease-in-out ${visivel ? "opacity-100" : "opacity-0"
                            }`
                            : ""
                            }`}

                        onError={() => {
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

                )
            }

            {/* Overlay para melhorar a legibilidade do conteúdo 
            <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-black/5 to-black/20 pointer-events-none" />*/ }

        </>
    )
}