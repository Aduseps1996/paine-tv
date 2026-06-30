"use client"

import { useEffect, useMemo, useRef, useState } from "react"

import {
    collection,
    doc,
    getDoc,
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

    template?: "cheio" | "informativo" | "institucional" | "urgente" | "painel"
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
    const [agoraPainel, setAgoraPainel] = useState(new Date())
    const [audioYoutubeAtivo, setAudioYoutubeAtivo] = useState(false)
    const [midiasComErro, setMidiasComErro] = useState<string[]>([])
    const [temperaturaAtual, setTemperaturaAtual] = useState<number | null>(null)
    const [codigoClimaAtual, setCodigoClimaAtual] = useState<number | null>(null)
    const [erroClima, setErroClima] = useState(false)
    const [logo, setLogo] = useState("")
    const [mostrarLogoFaixaPainel, setMostrarLogoFaixaPainel] = useState(false)

    const timeoutAvancoRef = useRef<ReturnType<typeof setTimeout> | null>(null)
    const timeoutRecarregarVideoRef = useRef<ReturnType<typeof setTimeout> | null>(null)

    useEffect(() => {
        const intervalo = setInterval(() => {
            setAgoraPainel(new Date())
        }, 10000)

        return () => clearInterval(intervalo)
    }, [])

    useEffect(() => {
        async function buscarClima() {
            try {
                setErroClima(false)

                const resposta = await fetch(
                    "https://api.open-meteo.com/v1/forecast?latitude=-8.05&longitude=-34.9&current=temperature_2m,weather_code&timezone=America%2FRecife"
                )

                if (!resposta.ok) {
                    throw new Error("Erro ao buscar clima")
                }

                const dados = await resposta.json()

                setTemperaturaAtual(Math.round(dados.current.temperature_2m))
                setCodigoClimaAtual(dados.current.weather_code)
            } catch {
                setErroClima(true)
            }
        }

        buscarClima()

        const intervalo = setInterval(buscarClima, 30 * 60 * 1000)

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

    useEffect(() => {
        async function carregarConfiguracoes() {
            const documento = await getDoc(
                doc(db, "configuracoes", "geral")
            )

            if (documento.exists()) {
                const dados = documento.data()

                setLogo(dados.logo || "")
                setMostrarLogoFaixaPainel(dados.mostrarLogoFaixaPainel ?? false)
            }
        }

        carregarConfiguracoes()
    }, [])

    useEffect(() => {
        return () => {
            if (timeoutAvancoRef.current) {
                clearTimeout(timeoutAvancoRef.current)
            }

            if (timeoutRecarregarVideoRef.current) {
                clearTimeout(timeoutRecarregarVideoRef.current)
            }
        }
    }, [])

    function obterChaveMidia(midia: Midia) {
        return `${midia.id || "sem-id"}-${midia.arquivo || ""}-${midia.linkYoutubeExibicao || ""}`
    }

    function marcarMidiaComErro(midia: Midia | undefined) {
        if (!midia) return

        const chave = obterChaveMidia(midia)

        setMidiasComErro((listaAtual) => {
            if (listaAtual.includes(chave)) return listaAtual
            return [...listaAtual, chave]
        })
    }

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

        const ehMidiaYoutube =
            midia.tipo === "youtube" ||
            midia.tipoExibicaoProgramada === "youtube"

        if (ehMidiaYoutube) {
            const linkYoutube =
                midia.linkYoutubeExibicao ||
                midia.arquivo

            if (!linkYoutube || linkYoutube.trim() === "") {
                return false
            }

            if (!midia.exibicaoProgramada) {
                return false
            }

            return midiaEstaDentroDoHorario(midia)
        }

        if (!midia.arquivo || midia.arquivo.trim() === "") {
            return false
        }

        if (midia.exibicaoProgramada) {
            return midiaEstaDentroDoHorario(midia)
        }

        return true
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
        const listaValida = midiasBase.filter((midia) => {
            return midiaPodeSerExibida(midia)
        })

        const listaSemErro = listaValida.filter((midia) => {
            return !midiasComErro.includes(obterChaveMidia(midia))
        })

        const listaParaUso =
            listaSemErro.length > 0
                ? listaSemErro
                : listaValida

        const youtubeAtivo = listaParaUso.find((midia) => {
            return (
                midia.ativo === true &&
                midia.exibicaoProgramada === true &&
                (
                    midia.tipoExibicaoProgramada === "youtube" ||
                    midia.tipo === "youtube"
                ) &&
                Boolean(midia.linkYoutubeExibicao || midia.arquivo)
            )
        })

        if (youtubeAtivo) {
            return [youtubeAtivo]
        }

        return montarListaInteligente(
            listaParaUso.filter((midia) => midia.tipo !== "youtube")
        )
    }, [midiasBase, agoraPainel, midiasComErro])

    const assinaturaMidias = midias
        .map((midia) =>
            `${midia.id}-${midia.tipo}-${midia.arquivo}-${midia.linkYoutubeExibicao}-${midia.inicioExibicao}-${midia.fimExibicao}`
        )
        .join("|")

    const possuiRotacao = midias.length > 1

    const indiceSeguro =
        indiceAtual >= midias.length
            ? 0
            : indiceAtual

    const midiaAtual = midias[indiceSeguro]

    const ehYoutube =
        midiaAtual?.tipo === "youtube" ||
        midiaAtual?.tipoExibicaoProgramada === "youtube"

    useEffect(() => {
        if (!ehYoutube) {
            setAudioYoutubeAtivo(false)
        }
    }, [ehYoutube])

    useEffect(() => {
        setIndiceAtual(0)

        if (timeoutAvancoRef.current) {
            clearTimeout(timeoutAvancoRef.current)
            timeoutAvancoRef.current = null
        }

        if (timeoutRecarregarVideoRef.current) {
            clearTimeout(timeoutRecarregarVideoRef.current)
            timeoutRecarregarVideoRef.current = null
        }
    }, [assinaturaMidias])

    useEffect(() => {
        if (midiaAtual) {
            onMidiaAtualChange?.(midiaAtual)
        } else {
            onMidiaAtualChange?.(null)
        }
    }, [midiaAtual, onMidiaAtualChange])

    function avancarMidia() {
        if (midias.length <= 1) return

        if (timeoutAvancoRef.current) {
            clearTimeout(timeoutAvancoRef.current)
        }

        timeoutAvancoRef.current = setTimeout(() => {
            setIndiceAtual((valorAtual) => {
                const proximo = valorAtual + 1
                return proximo >= midias.length ? 0 : proximo
            })
        }, 150)
    }

    function tentarRecarregarVideo(video: HTMLVideoElement) {
        if (timeoutRecarregarVideoRef.current) {
            clearTimeout(timeoutRecarregarVideoRef.current)
        }

        timeoutRecarregarVideoRef.current = setTimeout(() => {
            try {
                video.load()

                setTimeout(() => {
                    video.play().catch(() => {
                        // Em TV Stick/Fully Kiosk, autoplay pode falhar momentaneamente.
                        // Não derruba a mídia única por causa disso.
                    })
                }, 500)
            } catch {
                // Não faz nada aqui para evitar fallback falso.
            }
        }, 800)
    }

    function lidarComErroVideo(video: HTMLVideoElement) {
        if (midias.length > 1) {
            marcarMidiaComErro(midiaAtual)
            avancarMidia()
            return
        }

        tentarRecarregarVideo(video)
    }

    function reiniciarOuAvancarVideo(video: HTMLVideoElement) {
        if (midias.length > 1) {
            avancarMidia()
            return
        }

        try {
            video.currentTime = 0
            video.play().catch(() => {
                tentarRecarregarVideo(video)
            })
        } catch {
            tentarRecarregarVideo(video)
        }
    }

    function lidarComErroImagem(imagem: HTMLImageElement) {
        if (midias.length > 1) {
            marcarMidiaComErro(midiaAtual)
            avancarMidia()
            return
        }

        if (imagem.src !== fallback) {
            imagem.src = fallback
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

    function obterIconeClima(codigo: number | null) {
        if (codigo === null) return "🌤️"

        if (codigo === 0) return "☀️"
        if ([1, 2, 3].includes(codigo)) return "🌤️"
        if ([45, 48].includes(codigo)) return "🌫️"
        if ([51, 53, 55, 56, 57].includes(codigo)) return "🌦️"
        if ([61, 63, 65, 66, 67, 80, 81, 82].includes(codigo)) return "🌧️"
        if ([95, 96, 99].includes(codigo)) return "⛈️"

        return "🌤️"
    }

    function obterDescricaoClima(codigo: number | null) {
        if (codigo === null) return "Tempo estável"

        if (codigo === 0) return "Ensolarado"
        if ([1, 2, 3].includes(codigo)) return "Parcialmente nublado"
        if ([45, 48].includes(codigo)) return "Neblina"
        if ([51, 53, 55, 56, 57].includes(codigo)) return "Garoa"
        if ([61, 63, 65, 66, 67].includes(codigo)) return "Chuva"
        if ([80, 81, 82].includes(codigo)) return "Pancadas de chuva"
        if ([95, 96, 99].includes(codigo)) return "Tempestade"

        return "Tempo estável"
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
    }, [midiaAtual?.id, midias.length, assinaturaMidias])

    if (midias.length === 0 || !midiaAtual) {
        return (
            <div className="absolute inset-0 bg-black">
                {fallback && (
                    <img
                        src={fallback}
                        alt="Imagem padrão"
                        className="absolute inset-0 h-full w-full object-cover"
                    />
                )}
            </div>
        )
    }

    const chaveMidiaAtual =
        `${midiaAtual.id || "sem-id"}-${midiaAtual.ativo}-${midiaAtual.tipo}-${midiaAtual.arquivo}-${midiaAtual.linkYoutubeExibicao || ""}-${midiaAtual.inicioExibicao || ""}-${midiaAtual.fimExibicao || ""}`

    const chaveYoutubeAtual =
        `${chaveMidiaAtual}-${audioYoutubeAtivo ? "audio-ligado" : "audio-mudo"}`

    const templateAtual = midiaAtual.template || "cheio"

    if (ehYoutube) {
        const youtubeUrl = obterYoutubeEmbedUrl(
            midiaAtual.linkYoutubeExibicao || midiaAtual.arquivo || "",
            audioYoutubeAtivo
        )

        if (!youtubeUrl) {
            return (
                <div className="absolute inset-0 bg-black">
                    {fallback && (
                        <img
                            src={fallback}
                            alt="Imagem padrão"
                            className="absolute inset-0 h-full w-full object-cover"
                        />
                    )}
                </div>
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

    const animacaoImagemInformativa = possuiRotacao
        ? "scale-[1.02] animate-[zoomBanner_22s_linear_infinite]"
        : ""

    const animacaoImagemInstitucional = possuiRotacao
        ? "scale-[1.02] animate-[zoomBanner_24s_linear_infinite]"
        : ""

    if (templateAtual === "painel") {
        const horaPainel = agoraPainel.toLocaleTimeString("pt-BR", {
            hour: "2-digit",
            minute: "2-digit"
        })

        const dataPainel = agoraPainel.toLocaleDateString("pt-BR", {
            weekday: "long",
            day: "2-digit",
            month: "long"
        })

        const textoFaixa =
            midiaAtual.mostrarTarja
                ? `${midiaAtual.tarjaEtiqueta || "ADUSEPS"} ${midiaAtual.tarjaTitulo || midiaAtual.titulo || ""} ${midiaAtual.tarjaSubtitulo || midiaAtual.subtitulo || ""}`
                : midiaAtual.rodape ||
                midiaAtual.titulo ||
                "ADUSEPS • Informação, acolhimento e defesa do associado"

        return (
            <div className="absolute inset-0 overflow-hidden bg-[#58c9f3]">
                <div className="absolute inset-0 bg-gradient-to-br from-[#7de2ff] via-[#4fc3ef] to-[#218bd6]" />

                <div className="relative z-10 grid h-[calc(100vh-clamp(78px,9vh,108px))] w-full grid-cols-[clamp(230px,23vw,390px)_minmax(0,1fr)] gap-0 p-0">
                    <aside className="relative flex h-full flex-col overflow-hidden rounded-none border-r border-white/15 bg-[#0d5cff]/55 p-5 text-white backdrop-blur-md">

                        <div className="absolute inset-0 bg-gradient-to-b from-[#7de2ff]/45 via-[#0d5cff]/35 to-[#063ea8]/75" />
                        <div className="absolute -left-16 top-10 h-48 w-48 rounded-full bg-white/20 blur-3xl" />
                        <div className="absolute bottom-20 right-[-70px] h-56 w-56 rounded-full bg-[#7de2ff]/25 blur-3xl" />
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.22),transparent_42%)]" />


                        <div className="absolute inset-0 bg-gradient-to-b from-white/25 via-white/10 to-[#0d5cff]/20" />

                        <div className="relative z-10 flex h-full flex-col pt-5">
                            <div className="text-center">
                                <p className="text-[clamp(0.65rem,1vw,1rem)] font-black uppercase tracking-[0.25em] text-white/75">
                                    Previsão do tempo
                                </p>

                                <div className="mt-4 text-[clamp(3.5rem,6vw,6.2rem)] leading-none drop-shadow-xl">
                                    {obterIconeClima(codigoClimaAtual)}
                                </div>

                                <div className="mt-4 flex items-end justify-center gap-2">
                                    <span className="text-[clamp(4.5rem,7vw,7rem)] font-black leading-none">
                                        {erroClima || temperaturaAtual === null ? "--" : temperaturaAtual}
                                    </span>
                                    <span className="mb-3 text-[clamp(1.8rem,2.6vw,3rem)] font-black">°C</span>
                                </div>

                                <p className="mt-4 text-[clamp(1.2rem,1.7vw,2rem)] font-black">
                                    Recife
                                </p>

                                <p className="mt-1 text-[clamp(0.95rem,1.35vw,1.45rem)] font-semibold text-white/85">
                                    {erroClima ? "Clima indisponível" : obterDescricaoClima(codigoClimaAtual)}
                                </p>
                            </div>

                            <div className="mt-auto grid gap-4">
                                <div className="rounded-[1.4rem] bg-black/15 p-4 text-center">
                                    <p className="text-[clamp(0.65rem,0.9vw,0.9rem)] font-black uppercase tracking-[0.20em] text-white/70">
                                        Data
                                    </p>
                                    <p className="mt-2 text-[clamp(1rem,1.55vw,1.75rem)] font-black capitalize leading-tight">
                                        {dataPainel}
                                    </p>
                                </div>

                                <div className="rounded-[1.4rem] bg-black/15 p-10 text-center">
                                    <p className="text-[clamp(0.65rem,0.9vw,0.9rem)] font-black uppercase tracking-[0.20em] text-white/70">
                                        Hora
                                    </p>
                                    <p className="mt-2 text-[clamp(2.4rem,4vw,4.2rem)] font-black leading-none">
                                        {horaPainel}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </aside>

                    <main
                        className="relative h-full min-w-0 overflow-hidden rounded-none border border-white/10 border-l-white/20 bg-[#0F172A]"
                        style={{
                            boxShadow:
                                "inset 0 1px 0 rgba(255,255,255,.10), 0 8px 30px rgba(0,0,0,.18)"
                        }}
                    >

                        <div className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-br from-white/10 via-transparent to-[#0d5cff]/15" />
                        {midiaAtual.tipo === "imagem" ? (
                            <img
                                key={chaveMidiaAtual}
                                src={midiaAtual.arquivo}
                                alt="Mídia principal"
                                onError={(e) => lidarComErroImagem(e.currentTarget)}
                                className={`h-full w-full object-contain relative z-0 ${animacaoImagemInformativa}`}
                            />
                        ) : (
                            <video
                                key={chaveMidiaAtual}
                                src={midiaAtual.arquivo}
                                autoPlay
                                muted
                                playsInline
                                preload="metadata"
                                className="h-full w-full object-contain relative z-0"
                                onError={(e) => lidarComErroVideo(e.currentTarget)}
                                onEnded={(e) => reiniciarOuAvancarVideo(e.currentTarget)}
                            />
                        )}
                    </main>
                </div>

                <div className="absolute bottom-0 left-0 right-0 z-20 grid h-[clamp(78px,9vh,108px)] grid-cols-[clamp(130px,15vw,210px)_minmax(0,1fr)_clamp(105px,12vw,170px)] items-center overflow-hidden bg-gradient-to-r from-[#063ea8] via-[#0d5cff] to-[#063ea8] px-0 text-white shadow-[0_-18px_60px_rgba(0,0,0,0.28)]">

                    <div className="min-w-0 h-full w-full truncate bg-white px-[clamp(0.65rem,1.4vw,1.25rem)] py-3 text-center text-[clamp(0.75rem,1.3vw,1.15rem)] font-black uppercase tracking-[0.10em] text-[#0d5cff] flex items-center justify-center">
                        {mostrarLogoFaixaPainel && logo ? (
                            <img
                                src={logo.startsWith("/") || logo.startsWith("http") ? logo : `/${logo}`}
                                alt="Logo"
                                className="max-h-full max-w-[70%] object-contain"
                            />
                        ) : (
                            <span className="truncate">
                                {midiaAtual.mostrarTarja
                                    ? midiaAtual.tarjaEtiqueta || "Informe"
                                    : midiaAtual.categoria || "ADUSEPS"}
                            </span>
                        )}
                    </div>

                    <div className="min-w-0 flex-1">
                        <p className="truncate text-[clamp(1.4rem,2.5vw,2.6rem)] font-black leading-tight pl-4">
                            {textoFaixa}
                        </p>
                    </div>

                    <div className="ml-8 text-right pr-4">
                        <p className="text-4xl font-black leading-none">
                            {horaPainel}
                        </p>
                        <p className="mt-1 text-sm font-bold uppercase tracking-[0.20em] text-white/75">
                            Recife
                        </p>
                    </div>
                </div>
            </div>
        )
    }

    if (templateAtual === "informativo") {
        return (
            <div className="absolute inset-0">
                {midiaAtual.tipo === "imagem" ? (
                    <img
                        key={chaveMidiaAtual}
                        src={midiaAtual.arquivo}
                        alt="Banner informativo"
                        onError={(e) => lidarComErroImagem(e.currentTarget)}
                        className={`${areaMidiaInformativa} ${animacaoImagemInformativa} brightness-[0.96] contrast-[1.04] saturate-[1.02]`}
                    />
                ) : (
                    <video
                        key={chaveMidiaAtual}
                        src={midiaAtual.arquivo}
                        autoPlay
                        muted
                        playsInline
                        preload="metadata"
                        className={`${areaMidiaInformativa} brightness-[0.96] contrast-[1.04] saturate-[1.02]`}
                        onError={(e) => lidarComErroVideo(e.currentTarget)}
                        onEnded={(e) => reiniciarOuAvancarVideo(e.currentTarget)}
                    />
                )}

                <div className="absolute top-10 right-10 z-10 w-[420px] overflow-hidden rounded-3xl border border-white/10 bg-[#342c7c]/75 shadow-2xl">
                    <div className="bg-[#34bcf8] px-6 py-4">
                        <h2 className="text-2xl font-black tracking-wide text-white">
                            {midiaAtual.categoria || "ADUSEPS"}
                        </h2>
                    </div>

                    <div className="p-6 text-white">
                        <p className="text-3xl font-bold leading-tight">
                            {midiaAtual.titulo || "Informação e compromisso com o associado."}
                        </p>

                        <div className="mt-6 h-px bg-white/10" />

                        <p className="mt-6 text-lg leading-relaxed text-white/80">
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
                        className={`${areaMidia} ${animacaoImagemInstitucional} brightness-[0.92] contrast-[1.04]`}
                    />
                ) : (
                    <video
                        key={chaveMidiaAtual}
                        src={midiaAtual.arquivo}
                        autoPlay
                        muted
                        playsInline
                        preload="metadata"
                        className={`${areaMidia} brightness-[0.92] contrast-[1.04]`}
                        onError={(e) => lidarComErroVideo(e.currentTarget)}
                        onEnded={(e) => reiniciarOuAvancarVideo(e.currentTarget)}
                    />
                )}

                <div className="absolute inset-0 bg-gradient-to-r from-[#071633]/85 via-[#071633]/45 to-transparent" />

                <div className="absolute left-[clamp(1rem,4vw,3.5rem)] top-1/2 w-[min(88vw,560px)] -translate-y-1/2">
                    <div className="rounded-[2rem] border border-white/10 bg-black/35 p-[clamp(1.25rem,3vw,2.5rem)] shadow-[0_25px_80px_rgba(0,0,0,0.45)]">
                        <div className="mb-6 inline-flex items-center rounded-full border border-[#34bcf8]/30 bg-[#34bcf8]/15 px-5 py-2">
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
                            <div className="h-1 w-16 rounded-full bg-[#34bcf8]" />

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
                        className={`${areaMidia} brightness-[0.45]`}
                    />
                ) : (
                    <video
                        key={chaveMidiaAtual}
                        src={midiaAtual.arquivo}
                        autoPlay
                        muted
                        playsInline
                        preload="metadata"
                        className={`${areaMidia} brightness-[0.45]`}
                        onError={(e) => lidarComErroVideo(e.currentTarget)}
                        onEnded={(e) => reiniciarOuAvancarVideo(e.currentTarget)}
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
                    className={areaMidia}
                />
            ) : (
                <video
                    key={chaveMidiaAtual}
                    src={midiaAtual.arquivo}
                    autoPlay
                    muted
                    playsInline
                    preload="metadata"
                    className={areaMidia}
                    onError={(e) => lidarComErroVideo(e.currentTarget)}
                    onEnded={(e) => reiniciarOuAvancarVideo(e.currentTarget)}
                />
            )}
        </>
    )
}
