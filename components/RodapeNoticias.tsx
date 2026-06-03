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

    const [temperaturaAtual, setTemperaturaAtual] = useState<number | null>(null)
    const [codigoClimaAtual, setCodigoClimaAtual] = useState<number | null>(null)
    const [erroClima, setErroClima] = useState(false)

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

    const modeloTarjaFinal =
        midiaAtual?.modeloTarja || "telejornal"

    useEffect(() => {
        if (!mostrarTarjaFinal) {
            setFaseTarja("oculta")
            return
        }

        let ativo = true

        setFaseTarja("oculta")

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

                            setFaseTarja("oculta")

                            setTimeout(() => {
                                if (!ativo) return

                                iniciarCiclo()
                            }, tempoOcultaTarjaFinal * 1000)

                        }, tempoSaidaTarjaFinal * 1000)

                    }, tempoVisivelTarjaFinal * 1000)

                }, tempoEntradaTarjaFinal * 1000)

            }, 150)
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
                {mostrarTarjaFinal && modeloTarjaFinal === "telejornal" && (
                    <div
                        className={`relative mx-auto w-[94vw] transition-all ${faseTarja === "entrando" || faseTarja === "visivel"
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
                            <div className="bg-[#073bd9] px-6 py-1.5 shadow-xl">
                                <span className="text-xs font-black uppercase tracking-[0.18em] text-white">
                                    {etiquetaTarjaFinal}
                                </span>
                            </div>

                            <div className="h-0 w-0 border-y-[14px] border-l-[24px] border-y-transparent border-l-[#073bd9]" />
                        </div>

                        <div className="relative bg-white/95 shadow-[0_18px_50px_rgba(0,0,0,0.55)]">
                            <div className="absolute left-0 top-0 h-full w-10 bg-[#4a4a4a]" />

                            <div className="absolute right-0 top-0 h-full w-[220px] bg-[#073bd9]" />

                            <div className="absolute right-[190px] top-0 h-full w-20 skew-x-[-28deg] bg-white/95" />

                            <div className="relative z-10 flex items-center justify-between gap-4 px-10 py-3">
                                <div className="min-w-0 pl-6 pr-8">
                                    <h2
                                        className="truncate font-black uppercase leading-none text-[#071b42]"
                                        style={{
                                            fontSize: `${Math.max(tamanhoFonteSlogan + 6, 22)}px`
                                        }}
                                    >
                                        {tituloTarjaFinal}
                                    </h2>

                                    <p
                                        className="mt-1 truncate font-semibold text-[#071b42]/70"
                                        style={{
                                            fontSize: `${Math.max(tamanhoFonteSlogan - 3, 12)}px`
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

                {mostrarTarjaFinal && modeloTarjaFinal === "compacta" && (
                    <div
                        className={`relative mx-auto w-[92vw] transition-all ${faseTarja === "entrando" || faseTarja === "visivel"
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
                        <div className="rounded-2xl bg-black/75 backdrop-blur-md border border-white/10 px-8 py-3 shadow-2xl">

                            <div className="flex items-center gap-4">

                                <span className="text-[#34bcf8] font-black uppercase tracking-[0.18em] text-xs">
                                    {etiquetaTarjaFinal}
                                </span>

                                <div className="h-4 w-px bg-white/20" />

                                <span className="font-bold text-white text-xl truncate">
                                    {tituloTarjaFinal}
                                </span>

                            </div>

                            {subtituloTarjaFinal && (
                                <p className="mt-1 text-white/70 text-sm truncate">
                                    {subtituloTarjaFinal}
                                </p>
                            )}

                        </div>
                    </div>
                )}

                {mostrarTarjaFinal && modeloTarjaFinal === "live" && (
                    <div
                        className={`relative mx-auto w-[92vw] transition-all ${faseTarja === "entrando" || faseTarja === "visivel"
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
                        <div className="relative flex items-stretch overflow-hidden rounded-xl border border-white/10 shadow-[0_15px_40px_rgba(0,0,0,0.45)]">

                            {/* LIVE NEWS */}
                            <div className="relative z-20 flex w-[170px] shrink-0 flex-col items-center justify-center bg-gradient-to-br from-[#d53a3a] via-[#b61f1f] to-[#7f1111] px-5 py-3 text-white">

                                <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.18),transparent_55%)]" />

                                <span className="relative text-[clamp(1.1rem,2vw,1.8rem)] font-light leading-none tracking-[0.08em]">
                                    LIVE
                                </span>

                                <span className="relative mt-1 text-[clamp(0.75rem,1.3vw,1rem)] font-black uppercase tracking-[0.30em]">
                                    NEWS
                                </span>

                                {/* QR Code */}
                                {midiaAtual?.qrcode && midiaAtual.qrcode.trim() !== "" && (
                                    <img
                                        src={`https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=${encodeURIComponent(midiaAtual.qrcode)}`}
                                        alt="QR Code"
                                        className="relative mt-2 h-14 w-14 rounded-md bg-white p-1"
                                    />
                                )}

                            </div>

                            {/* CORTE DIAGONAL */}
                            <div className="relative z-10 -ml-5 w-16 shrink-0 skew-x-[-32deg] bg-gradient-to-b from-[#111827] to-[#374151]" />

                            {/* CONTEÚDO */}
                            <div className="relative -ml-8 flex min-w-0 flex-1 flex-col justify-center bg-gradient-to-b from-white to-[#eef2f6] px-10 py-2">

                                <div className="absolute left-0 top-0 h-full w-[6px] bg-[#111827]" />

                                <h2
                                    className="truncate font-black pl-4 uppercase leading-none text-[#0f172a]"
                                    style={{
                                        fontSize: `${Math.max(tamanhoFonteSlogan + 6, 22)}px`
                                    }}
                                >
                                    {tituloTarjaFinal}
                                </h2>

                                <div className="mt-2 flex items-center">
                                    <div className="h-[2px] w-10 bg-[#d53a3a]" />

                                    <div className="ml-3 rounded-md bg-[#dfe4ea] px-3 py-1">
                                        <p
                                            className="truncate font-semibold text-[#334155]"
                                            style={{
                                                fontSize: `${Math.max(tamanhoFonteSlogan - 4, 12)}px`
                                            }}
                                        >
                                            {subtituloTarjaFinal}
                                        </p>
                                    </div>
                                </div>

                            </div>

                            {/* HORA */}
                            <div className="relative flex w-[145px] shrink-0 items-center justify-center overflow-hidden bg-[#061f55]">

                                <div className="absolute inset-0 bg-gradient-to-br from-[#0d5cff] via-[#073bd9] to-[#03153d]" />

                                <div className="absolute left-0 top-0 h-full w-4 skew-x-[-18deg] bg-white/20" />

                                <div className="relative flex flex-col items-center leading-none">
                                    <span className="text-[10px] font-black uppercase tracking-[0.28em] text-white/70">
                                        AO VIVO
                                    </span>

                                    <span
                                        className="mt-1 font-black text-white tracking-wide drop-shadow"
                                        style={{
                                            fontSize: `${tamanhoFonteHora}px`
                                        }}
                                    >
                                        {hora}
                                    </span>
                                </div>

                            </div>

                        </div>
                    </div>
                )}

                {/* CLIMA */}
                {mostrarTarjaFinal && modeloTarjaFinal === "infobar" && (
    <div
        className={`relative mx-auto w-[94vw] transition-all ${
            faseTarja === "entrando" || faseTarja === "visivel"
                ? "translate-y-0 opacity-100 scale-100"
                : "translate-y-8 opacity-0 scale-[0.98]"
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
        <div className="relative overflow-hidden rounded-2xl border border-white/15 bg-[#061a3d]/90 shadow-[0_18px_60px_rgba(0,0,0,0.60)] backdrop-blur-xl">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(13,92,255,0.45),transparent_34%),linear-gradient(135deg,rgba(255,255,255,0.12),transparent_45%)]" />

            <div className="relative flex h-[76px] items-center">

                {/* HORA */}
                <div className="relative flex h-full w-[145px] shrink-0 flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-[#0d5cff] via-[#073bd9] to-[#03153d] text-white">
                    <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.22),transparent_55%)]" />
                    <div className="absolute -right-4 top-0 h-full w-10 skew-x-[-18deg] bg-white/15" />

                    <span className="relative text-[10px] font-black uppercase tracking-[0.30em] text-white/70">
                        Agora
                    </span>

                    <span
                        className="relative font-black leading-none drop-shadow"
                        style={{ fontSize: `${Math.max(tamanhoFonteHora + 2, 26)}px` }}
                    >
                        {hora}
                    </span>
                </div>

                {/* ETIQUETA */}
                <div className="relative flex h-full shrink-0 items-center overflow-hidden bg-gradient-to-br from-[#ff6b3d] via-[#f15434] to-[#b72718] px-5">
                    <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.25),transparent_55%)]" />

                    <span className="relative text-xs font-black uppercase tracking-[0.22em] text-white drop-shadow">
                        {etiquetaTarjaFinal}
                    </span>
                </div>

                {/* TEXTO */}
                <div className="relative flex min-w-0 flex-1 flex-col justify-center px-7">
                    <div className="absolute left-0 top-1/2 h-10 w-px -translate-y-1/2 bg-white/15" />

                    <h2
                        className="truncate font-black uppercase leading-none text-white drop-shadow"
                        style={{
                            fontSize: `${Math.max(tamanhoFonteSlogan + 5, 23)}px`
                        }}
                    >
                        {tituloTarjaFinal}
                    </h2>

                    {subtituloTarjaFinal && (
                        <p
                            className="mt-1 truncate font-semibold text-white/70"
                            style={{
                                fontSize: `${Math.max(tamanhoFonteSlogan - 4, 13)}px`
                            }}
                        >
                            {subtituloTarjaFinal}
                        </p>
                    )}
                </div>

                {/* CLIMA */}
                <div className="relative flex h-full w-[180px] shrink-0 flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-[#10264d] via-[#0b2a5c] to-[#061a3d] text-white">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(52,188,248,0.35),transparent_45%)]" />
                    <div className="absolute -left-4 top-0 h-full w-10 skew-x-[-18deg] bg-white/10" />

                    <span className="relative text-[10px] font-black uppercase tracking-[0.28em] text-white/65">
                        Recife
                    </span>

                    <span className="relative mt-1 text-2xl font-black leading-none drop-shadow">
                        {erroClima || temperaturaAtual === null
                            ? "--"
                            : `${obterIconeClima(codigoClimaAtual)} ${temperaturaAtual}°C`}
                    </span>
                </div>
            </div>

            <div className="relative h-1.5 overflow-hidden bg-[#061a3d]">
                <div className="absolute inset-y-0 left-0 w-1/2 bg-gradient-to-r from-[#073bd9] via-[#34bcf8] to-[#f15434]" />
                <div className="absolute inset-y-0 right-0 w-1/2 bg-gradient-to-r from-[#f15434] via-[#073bd9] to-[#34bcf8]" />
            </div>
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