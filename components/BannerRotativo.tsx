"use client"

import { useEffect, useMemo, useRef, useState } from "react"

import {
    collection,
    onSnapshot,
    query,
    orderBy
} from "firebase/firestore"

import { db } from "../lib/firebase"

type Midia = {
    id?: string
    tipo: "imagem" | "video" | "youtube"
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

    mostrarTarja?: boolean
    tarjaEtiqueta?: string
    tarjaTitulo?: string
    tarjaSubtitulo?: string
    tempoEntradaTarja?: number
    tempoVisivelTarja?: number
    tempoSaidaTarja?: number
    tempoOcultaTarja?: number
    tempoInicialTarja?: number
    modeloTarja?: "telejornal" | "compacta" | "live" | "infobar" | "digital"
}

export default function BannerRotativo({
    fallback,
    onMidiaAtualChange
}: {
    fallback: string
    onMidiaAtualChange?: (midia: any) => void
}) {
    const [midiasBase, setMidiasBase] = useState<Midia[]>([])
    const [indiceAtual, setIndiceAtual] = useState(0)
    const [visivel, setVisivel] = useState(true)
    const [erroMidia, setErroMidia] = useState(false)
    const [agoraPainel, setAgoraPainel] = useState(new Date())
    const [audioYoutubeAtivo, setAudioYoutubeAtivo] = useState(false)


    const timeoutAvancoRef = useRef<ReturnType<typeof setTimeout> | null>(null)
    const timeoutVideoRef = useRef<ReturnType<typeof setTimeout> | null>(null)
    const videoMonitoradoRef = useRef<HTMLVideoElement | null>(null)
    const ultimoTempoVideoRef = useRef(0)

    useEffect(() => {
        const intervalo = setInterval(() => {
            setAgoraPainel(new Date())
        }, 10000)

        return () => clearInterval(intervalo)
    }, [])

    useEffect(() => {
        const consulta = query(
            collection(db, "midias"),
            orderBy("ordem", "asc")
        )

        const unsubscribe = onSnapshot(consulta, (resultado) => {
            const lista = resultado.docs.map((documento) => ({
                id: documento.id,
                ...documento.data()
            })) as Midia[]

            setMidiasBase(lista)
        })

        return () => unsubscribe()
    }, [])

    function midiaEstaDentroDoHorario(midia: Midia) {
        if (!midia.exibicaoProgramada) return true

        if (!midia.inicioExibicao || !midia.fimExibicao) {
            return false
        }

        const inicio = new Date(midia.inicioExibicao)
        const fim = new Date(midia.fimExibicao)

        if (Number.isNaN(inicio.getTime()) || Number.isNaN(fim.getTime())) {
            return false
        }

        return agoraPainel >= inicio && agoraPainel <= fim
    }

    function midiaPodeSerExibida(midia: Midia) {
        if (!midia.ativo) return false

        if (midia.tipo === "youtube") {
            if (!midia.linkYoutubeExibicao && !midia.arquivo) {
                return false
            }

            if (!midia.exibicaoProgramada) {
                return false
            }

            return midiaEstaDentroDoHorario(midia)
        }

        if (
            midia.tipoExibicaoProgramada === "youtube" &&
            !midia.linkYoutubeExibicao
        ) {
            return false
        }

        return midiaEstaDentroDoHorario(midia)
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

    const midias = useMemo(() => {
        const listaAtiva = midiasBase.filter((midia) => {
            return midiaPodeSerExibida(midia)
        })

        const youtubeAtivo = listaAtiva.find((midia) => {
    return (
        midia.ativo === true &&
        midia.exibicaoProgramada === true &&
        (
            midia.tipoExibicaoProgramada === "youtube" ||
            midia.tipo === "youtube"
        ) &&
        (midia.linkYoutubeExibicao || midia.tipo === "youtube")
    )
})

        if (youtubeAtivo) {
            return [youtubeAtivo]
        }

        return montarListaInteligente(
            listaAtiva.filter((midia) => midia.tipo !== "youtube")
        )
    }, [midiasBase, agoraPainel])

    const assinaturaMidias = midias
        .map((midia) => `${midia.id}-${midia.tipo}-${midia.arquivo}-${midia.linkYoutubeExibicao}`)
        .join("|")

    const possuiRotacao = midias.length > 1
    const midiaAtual = midias[indiceAtual] ?? midias[0]

    const ehYoutube =
        midiaAtual?.tipo === "youtube" ||
        midiaAtual?.tipoExibicaoProgramada === "youtube"

    useEffect(() => {
        if (!ehYoutube) {
            setAudioYoutubeAtivo(false)
        }
    }, [ehYoutube])

    useEffect(() => {
        setErroMidia(false)
        setVisivel(true)

        if (midias.length === 0) {
            setIndiceAtual(0)
            return
        }

        if (indiceAtual >= midias.length) {
            setIndiceAtual(0)
        }
    }, [assinaturaMidias, midias.length, indiceAtual])

    useEffect(() => {
        setErroMidia(false)
        setVisivel(false)

        const tempo = setTimeout(() => {
            setVisivel(true)
        }, 80)

        return () => clearTimeout(tempo)
    }, [indiceAtual, assinaturaMidias])

    useEffect(() => {
        if (midiaAtual) {
            onMidiaAtualChange?.(midiaAtual)
        } else {
            onMidiaAtualChange?.(null)
        }
    }, [midiaAtual, onMidiaAtualChange])

    useEffect(() => {
        const intervalo = setInterval(() => {
            const video = videoMonitoradoRef.current

            if (!video) return
            if (video.ended) return
            if (video.paused) return
            if (ehYoutube) return

            const tempoAtual = video.currentTime
            const travado =
                Math.abs(tempoAtual - ultimoTempoVideoRef.current) < 0.1

            ultimoTempoVideoRef.current = tempoAtual

            if (travado && video.readyState >= 2) {
                protegerVideo(video)
            }
        }, 15000)

        return () => clearInterval(intervalo)
    }, [ehYoutube, midias.length, midiaAtual?.id])


    useEffect(() => {
        const intervalo = setInterval(() => {
            if (midias.length === 0) {
                setIndiceAtual(0)
                setErroMidia(false)
                return
            }

            if (indiceAtual >= midias.length) {
                setIndiceAtual(0)
                setErroMidia(false)
            }
        }, 60000)

        return () => clearInterval(intervalo)
    }, [midias.length, indiceAtual])

    function avancarMidia() {
        if (midias.length <= 1) return

        if (timeoutAvancoRef.current) {
            clearTimeout(timeoutAvancoRef.current)
        }

        setVisivel(false)

        timeoutAvancoRef.current = setTimeout(() => {
            setIndiceAtual((valorAtual) => {
                const proximo = valorAtual + 1
                return proximo >= midias.length ? 0 : proximo
            })
        }, 250)
    }

    useEffect(() => {
        return () => {
            if (timeoutAvancoRef.current) {
                clearTimeout(timeoutAvancoRef.current)
            }

            if (timeoutVideoRef.current) {
                clearTimeout(timeoutVideoRef.current)
            }
        }
    }, [])


    /* Funções para manipular vídeos */
    function protegerVideo(video: HTMLVideoElement) {
        if (midias.length <= 1) {
            video.currentTime = 0

            video.play().catch(() => {
                setErroMidia(true)
            })

            return
        }

        avancarMidia()
    }

    function reiniciarOuAvancarVideo(video: HTMLVideoElement) {
        if (midias.length <= 1) {
            video.currentTime = 0

            video.play().catch(() => {
                setErroMidia(true)
            })

            return
        }

        avancarMidia()
    }

    function lidarComErroImagem(
        imagem: HTMLImageElement
    ) {
        if (midias.length <= 1) {
            imagem.src = fallback
            return
        }

        avancarMidia()
    }

    function lidarComVideoEsperando(video: HTMLVideoElement) {
        if (timeoutVideoRef.current) {
            clearTimeout(timeoutVideoRef.current)
        }

        timeoutVideoRef.current = setTimeout(() => {
            if (
                video.readyState < 3 &&
                !video.ended
            ) {
                protegerVideo(video)
            }
        }, 5000)
    }

    function registrarVideoMonitorado(video: HTMLVideoElement | null) {
        videoMonitoradoRef.current = video

        if (video) {
            ultimoTempoVideoRef.current = video.currentTime
        }
    }

    function obterYoutubeEmbedUrl(link: string, audioAtivo: boolean) {
        if (!link) return ""

        let videoId = ""

        if (link.includes("watch?v=")) {
            videoId = link.split("watch?v=")[1].split("&")[0]
        }

        if (link.includes("youtu.be/")) {
            videoId = link.split("youtu.be/")[1].split("?")[0]
        }

        if (link.includes("/live/")) {
            videoId = link.split("/live/")[1].split("?")[0]
        }

        if (link.includes("/embed/")) {
            videoId = link.split("/embed/")[1].split("?")[0]
        }

        if (!videoId) return ""

        return `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=${audioAtivo ? "0" : "1"}&playsinline=1&rel=0&enablejsapi=1`
    }

    useEffect(() => {
        if (!midiaAtual) return
        if (midias.length <= 1) return
        if (midiaAtual.tipo !== "imagem") return

        const duracaoSegura = Math.max(1, Number(midiaAtual.duracao || 8))

        const intervaloBanner = setInterval(() => {
            avancarMidia()
        }, duracaoSegura * 1000)

        return () => clearInterval(intervaloBanner)
    }, [midiaAtual, midias.length])

    if (midias.length === 0 || !midiaAtual || erroMidia) {
        return (
            <div className="absolute inset-0 bg-black">
                {fallback && (
                    <img
                        src={fallback}
                        alt="Imagem padrão"
                        className="absolute inset-0 w-full h-full object-cover"
                    />
                )}
            </div>
        )
    }


    const chaveMidiaAtual = `${midiaAtual.id || "sem-id"}-${midiaAtual.ativo}-${midiaAtual.tipo}-${midiaAtual.arquivo}-${midiaAtual.linkYoutubeExibicao || ""}-${midiaAtual.inicioExibicao || ""}-${midiaAtual.fimExibicao || ""}`

    const chaveYoutubeAtual = `${chaveMidiaAtual}-${audioYoutubeAtivo ? "audio-ligado" : "audio-mudo"}`

    const templateAtual = midiaAtual.template || "cheio"

    if (ehYoutube) {
        const youtubeUrl = obterYoutubeEmbedUrl(
            midiaAtual.linkYoutubeExibicao || midiaAtual.arquivo || "",
            audioYoutubeAtivo
        )

        if (!youtubeUrl) {
            return (
                <img
                    src={fallback}
                    alt="Imagem padrão"
                    className="absolute inset-0 w-full h-full object-cover"
                />
            )
        }

        return (
            <div
                key={chaveMidiaAtual}
                className="absolute inset-x-0 top-0 bottom-[clamp(88px,10vh,132px)] bg-black"
            >
                <iframe
                    key={chaveYoutubeAtual}
                    src={youtubeUrl}
                    title="Transmissão ao vivo"
                    allow="autoplay; encrypted-media; picture-in-picture"
                    allowFullScreen
                    className="absolute inset-0 h-full w-full border-0 bg-black"
                />

                {!audioYoutubeAtivo && (
                    <button
                        onClick={() => setAudioYoutubeAtivo(true)}
                        className="absolute bottom-8 left-1/2 z-50 -translate-x-1/2 rounded-full bg-red-600 px-8 py-4 text-lg font-black text-white shadow-2xl transition hover:bg-red-700"
                    >
                        🔊 Ativar áudio da transmissão
                    </button>
                )}
            </div>
        )
    }

    const areaMidia =
        "absolute inset-x-0 top-0 bottom-[clamp(88px,10vh,132px)] h-auto w-full object-cover"

    const areaMidiaInformativa =
        "absolute top-0 left-0 w-full h-[calc(100vh-6.5rem)] object-cover"

    const transicaoMidia = possuiRotacao
        ? `transition-opacity duration-300 ease-in-out ${visivel ? "opacity-100" : "opacity-0"}`
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
                        key={chaveMidiaAtual}
                        src={midiaAtual.arquivo}
                        alt="Banner institucional"
                        onError={(e) => lidarComErroImagem(e.currentTarget)}
                        className={`${areaMidiaInformativa} ${animacaoImagemInformativa} brightness-[0.96] contrast-[1.04] saturate-[1.02] ${transicaoMidia}`}
                    />
                ) : (
                    <video
                        ref={registrarVideoMonitorado}
                        key={chaveMidiaAtual}
                        src={midiaAtual.arquivo}
                        autoPlay
                        muted
                        playsInline
                        preload="auto"
                        className={`${areaMidiaInformativa} brightness-[0.96] contrast-[1.04] saturate-[1.02] ${transicaoMidia}`}
                        onError={(e) => protegerVideo(e.currentTarget)}
                        onStalled={(e) => protegerVideo(e.currentTarget)}
                        onAbort={(e) => protegerVideo(e.currentTarget)}
                        onWaiting={(e) => lidarComVideoEsperando(e.currentTarget)}
                        onEnded={(e) => {
    if (timeoutVideoRef.current) {
        clearTimeout(timeoutVideoRef.current)
        timeoutVideoRef.current = null
    }

    reiniciarOuAvancarVideo(e.currentTarget)
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
                        key={chaveMidiaAtual}
                        src={midiaAtual.arquivo}
                        alt="Banner institucional"
                        onError={(e) => lidarComErroImagem(e.currentTarget)}
                        className={`${areaMidia} ${animacaoImagemInstitucional} brightness-[0.92] contrast-[1.04] ${transicaoMidia}`}
                    />
                ) : (
                    <video
                        ref={registrarVideoMonitorado}
                        key={chaveMidiaAtual}
                        src={midiaAtual.arquivo}
                        autoPlay
                        muted
                        playsInline
                        preload="auto"
                        className={`${areaMidia} brightness-[0.92] contrast-[1.04] ${transicaoMidia}`}
                        onError={(e) => protegerVideo(e.currentTarget)}
                        onStalled={(e) => protegerVideo(e.currentTarget)}
                        onAbort={(e) => protegerVideo(e.currentTarget)}
                        onWaiting={(e) => lidarComVideoEsperando(e.currentTarget)}
                        onEnded={(e) => {
    if (timeoutVideoRef.current) {
        clearTimeout(timeoutVideoRef.current)
        timeoutVideoRef.current = null
    }

    reiniciarOuAvancarVideo(e.currentTarget)
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
                        key={chaveMidiaAtual}
                        src={midiaAtual.arquivo}
                        alt="Banner urgente"
                        onError={(e) => lidarComErroImagem(e.currentTarget)}
                        className={`${areaMidia} brightness-[0.45] ${transicaoMidia}`}
                    />
                ) : (
                    <video
                        ref={registrarVideoMonitorado}
                        key={chaveMidiaAtual}
                        src={midiaAtual.arquivo}
                        autoPlay
                        muted
                        playsInline
                        preload="auto"
                        className={`${areaMidia} brightness-[0.45] ${transicaoMidia}`}
                        onError={(e) => protegerVideo(e.currentTarget)}
                        onStalled={(e) => protegerVideo(e.currentTarget)}
                        onAbort={(e) => protegerVideo(e.currentTarget)}
                        onWaiting={(e) => lidarComVideoEsperando(e.currentTarget)}
                        onEnded={(e) => {
    if (timeoutVideoRef.current) {
        clearTimeout(timeoutVideoRef.current)
        timeoutVideoRef.current = null
    }

    reiniciarOuAvancarVideo(e.currentTarget)
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
                    key={chaveMidiaAtual}
                    src={midiaAtual.arquivo}
                    alt="Banner"
                    onError={(e) => lidarComErroImagem(e.currentTarget)}
                    className={`${areaMidia} ${transicaoMidia}`}
                />
            ) : (
                <video
                    ref={registrarVideoMonitorado}
                    key={chaveMidiaAtual}
                    src={midiaAtual.arquivo}
                    autoPlay
                    muted
                    playsInline
                    preload="auto"
                    className={`${areaMidia} ${transicaoMidia}`}
                    onError={(e) => protegerVideo(e.currentTarget)}
                    onStalled={(e) => protegerVideo(e.currentTarget)}
                    onAbort={(e) => protegerVideo(e.currentTarget)}
                    onWaiting={(e) => lidarComVideoEsperando(e.currentTarget)}
                    onEnded={(e) => {
    if (timeoutVideoRef.current) {
        clearTimeout(timeoutVideoRef.current)
        timeoutVideoRef.current = null
    }

    reiniciarOuAvancarVideo(e.currentTarget)
}}
                />
            )}
        </>
    )
}