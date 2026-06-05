"use client"

import { useEffect, useState } from "react"

import {
    collection,
    onSnapshot,
    query,
    orderBy
} from "firebase/firestore"

import { db } from "../lib/firebase"

type Midia = {
    id?: string
    tipo: "imagem" | "video"
    arquivo: string
    ativo: boolean
    ordem: number
    duracao: number

    pesoExibicao?: number

    template?: "cheio" | "informativo" | "institucional" | "urgente"
    titulo?: string
    subtitulo?: string
    rodape?: string
    qrcode?: string
    categoria?: string
    cta?: string

    exibicaoProgramada?: boolean
    tipoExibicaoProgramada?: "midia" | "youtube"
    inicioExibicao?: string
    fimExibicao?: string
    linkYoutubeExibicao?: string
}

export default function BannerRotativo({
    fallback,
    onMidiaAtualChange
}: {
    fallback: string
    onMidiaAtualChange?: (midia: any) => void
}) {
    const [midias, setMidias] = useState<Midia[]>([])
    const [indiceAtual, setIndiceAtual] = useState(0)
    const [visivel, setVisivel] = useState(true)
    const [erroMidia, setErroMidia] = useState(false)

    const possuiRotacao = midias.length > 1
    const midiaAtual = midias[indiceAtual]
    const [agoraPainel, setAgoraPainel] = useState(new Date())

    useEffect(() => {
        const intervalo = setInterval(() => {
            setAgoraPainel(new Date())
        }, 30000)

        return () => clearInterval(intervalo)
    }, [])

    useEffect(() => {
        if (midiaAtual) {
            onMidiaAtualChange?.(midiaAtual)
        }
    }, [midiaAtual, onMidiaAtualChange])

    useEffect(() => {
        setErroMidia(false)
        setVisivel(false)

        const tempo = setTimeout(() => {
            setVisivel(true)
        }, 80)

        return () => clearTimeout(tempo)
    }, [indiceAtual])

    function avancarMidia() {
        if (midias.length <= 1) return

        setVisivel(false)

        setTimeout(() => {
            setIndiceAtual((valorAtual) => {
                const proximo = valorAtual + 1
                return proximo >= midias.length ? 0 : proximo
            })
        }, 250)
    }

    function midiaPodeSerExibida(midia: Midia) {
        if (!midia.ativo) {
            return false
        }

        if (!midia.exibicaoProgramada) {
            return true
        }

        if (!midia.inicioExibicao || !midia.fimExibicao) {
            return true
        }

        const agora = agoraPainel
        const inicio = new Date(midia.inicioExibicao)
        const fim = new Date(midia.fimExibicao)

        if (Number.isNaN(inicio.getTime()) || Number.isNaN(fim.getTime())) {
            return true
        }

        return agora >= inicio && agora <= fim
    }

    function montarListaInteligente(lista: Midia[]) {
    const fila = lista.map((midia) => ({
        midia,
        peso: Math.max(1, Number(midia.pesoExibicao || 1)),
        usados: 0
    }))

    const total = fila.reduce((soma, item) => soma + item.peso, 0)
    const resultado: Midia[] = []

    while (resultado.length < total) {
        const ultimoId = resultado[resultado.length - 1]?.id

        const candidatos = fila
            .filter((item) => item.usados < item.peso)
            .filter((item) => item.midia.id !== ultimoId)
            .sort((a, b) => {
                const restanteA = a.peso - a.usados
                const restanteB = b.peso - b.usados

                return restanteB - restanteA
            })

        const escolhido =
            candidatos[0] ||
            fila.find((item) => item.usados < item.peso)

        if (!escolhido) break

        resultado.push(escolhido.midia)
        escolhido.usados++
    }

    return resultado
}

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

            const listaAtiva = lista.filter((midia) => midiaPodeSerExibida(midia))

            const listaComPeso = montarListaInteligente(listaAtiva)

            setMidias(listaComPeso)

            setIndiceAtual((indiceAtual) => {
                if (indiceAtual >= listaComPeso.length) {
                    return 0
                }

                return indiceAtual
            })
        })

        return () => unsubscribe()
    }, [agoraPainel])

    useEffect(() => {
        if (!midiaAtual) return
        if (midias.length <= 1) return
        if (midiaAtual.tipo !== "imagem") return

        const intervaloBanner = setInterval(() => {
            avancarMidia()
        }, midiaAtual.duracao * 1000)

        return () => clearInterval(intervaloBanner)
    }, [midiaAtual, midias.length])

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

    const areaMidia =
        "absolute inset-x-0 top-0 bottom-[clamp(88px,10vh,132px)] h-auto w-full object-cover"

    const areaMidiaInformativa =
        "absolute top-0 left-0 w-full h-[calc(100vh-6.5rem)] object-cover"

    const transicaoMidia = possuiRotacao
        ? `transition-opacity duration-300 ease-in-out ${visivel ? "opacity-100" : "opacity-0"
        }`
        : ""

    const animacaoImagemInformativa = possuiRotacao
        ? "scale-[1.02] animate-[zoomBanner_22s_linear_infinite]"
        : ""

    const animacaoImagemInstitucional = possuiRotacao
        ? "scale-[1.02] animate-[zoomBanner_24s_linear_infinite]"
        : ""

    if (templateAtual === "informativo") {
        return (
            <div className="absolute inset-0">
                {midiaAtual.tipo === "imagem" ? (
                    <img
                        key={midiaAtual.id || midiaAtual.arquivo}
                        src={midiaAtual.arquivo}
                        alt="Banner institucional"
                        onError={(e) => {
                            e.currentTarget.src = fallback
                        }}
                        className={`${areaMidiaInformativa} ${animacaoImagemInformativa} brightness-[0.96] contrast-[1.04] saturate-[1.02] ${transicaoMidia}`}
                    />
                ) : (
                    <video
                        key={midiaAtual.id || midiaAtual.arquivo}
                        src={midiaAtual.arquivo}
                        autoPlay
                        muted
                        playsInline
                        preload="auto"
                        className={`${areaMidiaInformativa} brightness-[0.96] contrast-[1.04] saturate-[1.02] ${transicaoMidia}`}
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

                <div className="absolute top-10 right-10 w-[420px] rounded-3xl overflow-hidden bg-[#342c7c]/75 border border-white/10 shadow-2xl z-10">
                    <div className="bg-[#34bcf8] px-6 py-4">
                        <h2 className="text-2xl font-black text-white tracking-wide">
                            {midiaAtual.categoria || "ADUSEPS"}
                        </h2>
                    </div>

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

    if (templateAtual === "institucional") {
        return (
            <div className="absolute inset-0 overflow-hidden">
                {midiaAtual.tipo === "imagem" ? (
                    <img
                        key={midiaAtual.id || midiaAtual.arquivo}
                        src={midiaAtual.arquivo}
                        alt="Banner institucional"
                        onError={(e) => {
                            e.currentTarget.src = fallback
                        }}
                        className={`${areaMidia} ${animacaoImagemInstitucional} brightness-[0.92] contrast-[1.04] ${transicaoMidia}`}
                    />
                ) : (
                    <video
                        key={midiaAtual.id || midiaAtual.arquivo}
                        src={midiaAtual.arquivo}
                        autoPlay
                        muted
                        playsInline
                        preload="auto"
                        className={`${areaMidia} brightness-[0.92] contrast-[1.04] ${transicaoMidia}`}
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

                <div className="absolute inset-0 bg-gradient-to-r from-[#071633]/85 via-[#071633]/45 to-transparent" />

                <div className="absolute left-[clamp(1rem,4vw,3.5rem)] top-1/2 w-[min(88vw,560px)] -translate-y-1/2">
                    <div className="rounded-[2rem] border border-white/10 bg-black/35 p-[clamp(1.25rem,3vw,2.5rem)] shadow-[0_25px_80px_rgba(0,0,0,0.45)]">
                        <div className="inline-flex items-center rounded-full bg-[#34bcf8]/15 border border-[#34bcf8]/30 px-5 py-2 mb-6">
                            <span className="text-sm font-black uppercase tracking-[0.18em] text-[#34bcf8]">
                                {midiaAtual.categoria || "ADUSEPS"}
                            </span>
                        </div>

                        <h1 className="text-[clamp(2rem,4vw,3rem)] font-black leading-[1.05] text-white">
                            {midiaAtual.titulo || "Informação e acolhimento ao associado"}
                        </h1>

                        <p className="mt-6 text-[clamp(1rem,1.8vw,1.25rem)] leading-relaxed text-white/80">
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
                {midiaAtual.tipo === "imagem" ? (
                    <img
                        key={midiaAtual.id || midiaAtual.arquivo}
                        src={midiaAtual.arquivo}
                        alt="Banner urgente"
                        onError={(e) => {
                            e.currentTarget.src = fallback
                        }}
                        className={`${areaMidia} brightness-[0.45] ${transicaoMidia}`}
                    />
                ) : (
                    <video
                        key={midiaAtual.id || midiaAtual.arquivo}
                        src={midiaAtual.arquivo}
                        autoPlay
                        muted
                        playsInline
                        preload="auto"
                        className={`${areaMidia} brightness-[0.45] ${transicaoMidia}`}
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

                <div className="absolute inset-0 bg-gradient-to-r from-[#3b0000]/90 via-[#220000]/75 to-black/50" />

                <div className="absolute left-[clamp(1rem,4vw,4rem)] top-[clamp(1rem,6vh,4rem)]">
                    <div className="inline-flex items-center rounded-full bg-red-600 px-6 py-3 shadow-2xl">
                        <span className="text-lg font-black uppercase tracking-[0.25em] text-white">
                            {midiaAtual.categoria || "URGENTE"}
                        </span>
                    </div>
                </div>

                <div className="absolute left-[clamp(1rem,4vw,4rem)] top-1/2 max-w-[min(90vw,1000px)] -translate-y-1/2">
                    <h1 className="text-[clamp(2.5rem,7vw,5rem)] font-black leading-[0.95] text-white drop-shadow-2xl">
                        {midiaAtual.titulo || "Comunicado Importante"}
                    </h1>

                    <p className="mt-8 text-[clamp(1.25rem,3vw,2rem)] leading-relaxed text-white/90">
                        {midiaAtual.subtitulo || "Informações importantes para os associados."}
                    </p>

                    {midiaAtual.rodape && midiaAtual.rodape.trim() !== "" && (
                        <p className="mt-8 text-xl font-bold uppercase tracking-[0.20em] text-white/65">
                            {midiaAtual.rodape}
                        </p>
                    )}
                </div>
            </div>
        )
    }

    return (
        <>
            {midiaAtual.tipo === "imagem" ? (
                <img
                    key={midiaAtual.id || midiaAtual.arquivo}
                    src={midiaAtual.arquivo}
                    alt="Banner"
                    onError={(e) => {
                        e.currentTarget.src = fallback
                    }}
                    className={`${areaMidia} ${transicaoMidia}`}
                />
            ) : (
                <video
                    key={midiaAtual.id || midiaAtual.arquivo}
                    src={midiaAtual.arquivo}
                    autoPlay
                    muted
                    playsInline
                    preload="auto"
                    className={`${areaMidia} ${transicaoMidia}`}
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
        </>
    )
}
