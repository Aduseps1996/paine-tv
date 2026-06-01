"use client"

import { useEffect, useState } from "react"

import {
    collection,
    query,
    orderBy,
    onSnapshot,
    doc
} from "firebase/firestore"

import { db } from "../lib/firebase"

import { CalendarDays, Clock3 } from "lucide-react"

type Noticia = {
    id?: string
    texto: string
    ativo: boolean
    ordem: number
}

export default function RodapeNoticias({
    logo,
    slogan,
    midiaAtual
}: {
    logo: string
    slogan: string
    midiaAtual?: any
}) {
    const [noticias, setNoticias] = useState<Noticia[]>([])
    const [agora, setAgora] = useState(new Date())

    const [tamanhoFonteRodape, setTamanhoFonteRodape] = useState(28)
    const [tamanhoFonteSlogan, setTamanhoFonteSlogan] = useState(18)
    const [tamanhoFonteDataHora, setTamanhoFonteDataHora] = useState(18)
    const [tamanhoFonteHora, setTamanhoFonteHora] = useState(24)
    const [tamanhoIconeRodape, setTamanhoIconeRodape] = useState(22)
    const [alturaBarraSuperior, setAlturaBarraSuperior] = useState(64)
    const [alturaBarraNoticias, setAlturaBarraNoticias] = useState(44)
    const [tamanhoLogoRodape, setTamanhoLogoRodape] = useState(44)

    const [mostrarTarjaTv, setMostrarTarjaTv] = useState(true)
    const [tempoEntradaTarja, setTempoEntradaTarja] = useState(1)
    const [tempoVisivelTarja, setTempoVisivelTarja] = useState(8)
    const [tempoSaidaTarja, setTempoSaidaTarja] = useState(1)
    const [tempoOcultaTarja, setTempoOcultaTarja] = useState(10)

    const [faseTarja, setFaseTarja] = useState<
        "oculta" | "entrando" | "visivel" | "saindo"
    >("oculta")

    function limitarValor(valor: unknown, minimo: number, maximo: number, padrao: number) {
        const numero = Number(valor)

        if (Number.isNaN(numero)) {
            return padrao
        }

        return Math.min(Math.max(numero, minimo), maximo)
    }

    useEffect(() => {
        const relogio = setInterval(() => {
            setAgora(new Date())
        }, 1000)

        return () => clearInterval(relogio)
    }, [])

    useEffect(() => {
        const consulta = query(
            collection(db, "noticias"),
            orderBy("ordem", "asc")
        )

        const unsubscribe = onSnapshot(consulta, (resultado) => {
            const lista = resultado.docs.map((documento) => ({
                id: documento.id,
                ...documento.data()
            })) as Noticia[]

            const listaAtiva = lista.filter(
                (noticia) => noticia.ativo === true
            )

            setNoticias(listaAtiva)
        })

        return () => unsubscribe()
    }, [])

    useEffect(() => {
        const unsubscribe = onSnapshot(
            doc(db, "configuracoes", "geral"),
            (documento) => {
                if (!documento.exists()) return

                const dados = documento.data()

                setTamanhoFonteRodape(
                    limitarValor(dados.tamanhoFonteRodape, 12, 80, 28)
                )

                setTamanhoFonteSlogan(
                    limitarValor(dados.tamanhoFonteSlogan, 12, 60, 18)
                )

                setTamanhoFonteDataHora(
                    limitarValor(dados.tamanhoFonteDataHora, 12, 60, 18)
                )

                setTamanhoFonteHora(
                    limitarValor(dados.tamanhoFonteHora, 12, 70, 24)
                )

                setTamanhoIconeRodape(
                    limitarValor(dados.tamanhoIconeRodape, 14, 60, 22)
                )

                setAlturaBarraSuperior(
                    limitarValor(dados.alturaBarraSuperior, 40, 120, 64)
                )

                setAlturaBarraNoticias(
                    limitarValor(dados.alturaBarraNoticias, 30, 100, 44)
                )

                setTamanhoLogoRodape(
                    limitarValor(dados.tamanhoLogoRodape, 24, 100, 44)
                )

                setMostrarTarjaTv(dados.mostrarTarjaTv ?? true)
                setTempoEntradaTarja(Number(dados.tempoEntradaTarja || 1))
                setTempoVisivelTarja(Number(dados.tempoVisivelTarja || 8))
                setTempoSaidaTarja(Number(dados.tempoSaidaTarja || 1))
                setTempoOcultaTarja(
                    Number(dados.tempoOcultaTarja || 10)
                )
            }
        )

        return () => unsubscribe()
    }, [])

    const hora = agora.toLocaleTimeString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit"
    })

    const data = agora.toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "long",
        year: "numeric"
    })

    const mostrarTarjaFinal =
    midiaAtual?.mostrarTarja ?? mostrarTarjaTv

const etiquetaTarjaFinal =
    midiaAtual?.tarjaEtiqueta || "ADUSEPS INFORMA"

const tituloTarjaFinal =
    midiaAtual?.tarjaTitulo || slogan || "Informação e compromisso com o associado"

const subtituloTarjaFinal =
    midiaAtual?.tarjaSubtitulo || data

const tempoEntradaTarjaFinal =
    Number(midiaAtual?.tempoEntradaTarja || tempoEntradaTarja)

const tempoVisivelTarjaFinal =
    Number(midiaAtual?.tempoVisivelTarja || tempoVisivelTarja)

const tempoSaidaTarjaFinal =
    Number(midiaAtual?.tempoSaidaTarja || tempoSaidaTarja)

const tempoOcultaTarjaFinal =
    Number(
        midiaAtual?.tempoOcultaTarja ||
        tempoOcultaTarja
    )

    useEffect(() => {
    if (!mostrarTarjaFinal) {
        setFaseTarja("oculta")
        return
    }

    let ativo = true

    function iniciarCiclo() {
        if (!ativo) return

        setFaseTarja("oculta")

        setTimeout(() => {
            if (!ativo) return

            setFaseTarja("entrando")

            setTimeout(() => {
                if (!ativo) return

                setFaseTarja("visivel")

                setTimeout(() => {
                    if (!ativo) return

                    setFaseTarja("saindo")

                    setTimeout(() => {
                        if (!ativo) return

                        iniciarCiclo()
                    }, tempoSaidaTarjaFinal * 1000)

                }, tempoVisivelTarjaFinal * 1000)

            }, tempoEntradaTarjaFinal * 1000)

        }, tempoOcultaTarjaFinal * 1000)
    }

    iniciarCiclo()

    return () => {
        ativo = false
    }
}, [
    mostrarTarjaFinal,
    tempoEntradaTarjaFinal,
    tempoVisivelTarjaFinal,
    tempoSaidaTarjaFinal,
    tempoOcultaTarjaFinal,
    midiaAtual?.id
])

    return (
        <>
            {/* TARJA DE TV FLUTUANTE */}
            <div
                className="absolute left-0 right-0 z-30 pointer-events-none"
                /* Altura da tarja */
                style={{
                    bottom: `${alturaBarraNoticias + 35}px`
                }}
            >
                {mostrarTarjaFinal && (
                    <div
                        className={`relative mx-auto w-[94vw] transition-all ${
                            faseTarja === "entrando" || faseTarja === "visivel"
                                ? "translate-x-0 opacity-100"
                                : "-translate-x-[120%] opacity-0"
                        }`}
                        style={{
                           transitionDuration:
    faseTarja === "entrando"
        ? `${tempoEntradaTarjaFinal}s`
        : faseTarja === "saindo"
        ? `${tempoSaidaTarjaFinal}s`
        : "0s"
                        }}
                    >

                        <div className="absolute -top-7 left-0 z-40 flex items-center">
                            <div className="bg-[#073bd9] px-8 py-2 shadow-xl">
                                <span className="text-sm font-black uppercase tracking-[0.22em] text-white">
                                    {etiquetaTarjaFinal}
                                </span>
                            </div>

                            <div className="h-0 w-0 border-y-[19px] border-l-[34px] border-y-transparent border-l-[#073bd9]" />
                        </div>

                        <div className="relative bg-white/95 shadow-[0_18px_50px_rgba(0,0,0,0.55)]">
                            <div className="absolute left-0 top-0 h-full w-10 bg-[#4a4a4a]" />

                            <div className="absolute right-0 top-0 h-full w-[220px] bg-[#073bd9]" />

                            <div className="absolute right-[190px] top-0 h-full w-20 skew-x-[-28deg] bg-white/95" />

                            <div className="relative z-10 flex items-center justify-between gap-4 px-14 py-5">
                                <div className="min-w-0 pr-8">
                                    <h2
                                        className="truncate font-black uppercase leading-none text-[#071b42]"
                                        style={{
                                            fontSize: `${Math.max(tamanhoFonteSlogan + 10, 28)}px`
                                        }}
                                    >
                                        {tituloTarjaFinal}
                                    </h2>

                                    <p
                                        className="mt-1 truncate font-semibold text-[#071b42]/70"
                                        style={{
                                            fontSize: `${Math.max(tamanhoFonteSlogan - 2, 14)}px`
                                        }}
                                    >
                                        {subtituloTarjaFinal}
                                    </p>
                                </div>

                                <div className="relative z-20 flex shrink-0 items-center gap-3">
                                    {logo.trim() !== "" && (
                                        <div className="rounded-md bg-white px-2 py-1 shadow-md">
                                            <img
                                                src={logo}
                                                alt="Logo ADUSEPS"
                                                className="w-auto object-contain"
                                                style={{ height: `${tamanhoLogoRodape}px` }}
                                            />
                                        </div>
                                    )}

                                    <div className="min-w-[90px] text-center">
                                        <span
                                            className="font-black text-white"
                                            style={{
                                                fontSize: `${tamanhoFonteHora}px`
                                            }}
                                        >
                                            {hora}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="h-1.5 bg-[#073bd9]" />
                        </div>
                    </div>
                )}
            </div>

            {/* RODAPÉ DE NOTÍCIAS FIXO */}
            <div
                className="absolute bottom-0 left-0 w-full text-white z-20 overflow-hidden border-t border-white/10 shadow-[0_-18px_45px_rgba(0,0,0,0.45)]"
            >
                <div
                    className="bg-[#183b78]/95 flex items-center overflow-hidden px-[clamp(0.5rem,1.5vw,1.5rem)]"
                    style={{ height: `${alturaBarraNoticias}px` }}
                >
                    <div
                        className="whitespace-nowrap animate-[marquee_65s_linear_infinite] font-medium leading-none tracking-[0.06em] antialiased text-white"
                        style={{ fontSize: `${tamanhoFonteRodape}px` }}
                    >
                        {noticias.map((noticia, index) => (
                            <span
                                key={noticia.id}
                                className="inline-flex items-center"
                            >
                                <span className="mx-[clamp(1rem,3vw,2rem)]">
                                    {noticia.texto}
                                </span>

                                {index < noticias.length - 1 && (
                                    <span
                                        className="text-[#f15434] mx-[clamp(0.75rem,2vw,1.5rem)] opacity-90"
                                        style={{ fontSize: `${tamanhoFonteRodape}px` }}
                                    >
                                        •
                                    </span>
                                )}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
        </>
    )
}