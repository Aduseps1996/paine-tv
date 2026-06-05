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

    const [mostrarQrTelejornal, setMostrarQrTelejornal] = useState(false)

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
        }, 30000)

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
        Boolean(midiaAtual?.mostrarTarja) &&
        Boolean(midiaAtual?.ativo)

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
        midiaAtual?.modeloTarja ?? "telejornal"

    useEffect(() => {
        if (
            !mostrarTarjaFinal ||
            modeloTarjaFinal !== "telejornal"
        ) {
            setMostrarQrTelejornal(false)
            return
        }

        setMostrarQrTelejornal(false)

        const timer = setTimeout(() => {
            setMostrarQrTelejornal(true)
        }, 5000)

        return () => clearTimeout(timer)

    }, [mostrarTarjaFinal, modeloTarjaFinal, midiaAtual?.id])

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
                        {/* Etiqueta superior */}
                        <div className="absolute -top-6 left-8 z-40">

    {/* QR por trás */}
<div
    className={`absolute left-4 bottom-full z-0 transition-all duration-1000 ${
        mostrarQrTelejornal
            ? "translate-y-0 opacity-100"
            : "translate-y-full opacity-0"
    }`}
>
    {midiaAtual?.qrcode && (
        <div className="rounded-xl bg-white p-2 shadow-xl">
            <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=130x130&data=${encodeURIComponent(
                    midiaAtual.qrcode
                )}`}
                alt="QR Code"
                className="h-32 w-32"
            />
        </div>
    )}
</div>

    {/* Faixa azul */}
    <div className="relative z-20 rounded-t-md bg-[#073bd9] px-5 py-1.5 shadow-xl">
        <span className="text-xs font-black uppercase tracking-[0.22em] text-white">
            {mostrarQrTelejornal
                ? "VEJA MAIS NO NOSSO INSTAGRAM"
                : etiquetaTarjaFinal}
        </span>
    </div>

</div>

                        {/* Tarja principal */}
                        <div className="relative overflow-hidden rounded-xl border border-white/25 bg-white/95 shadow-[0_22px_70px_rgba(0,0,0,0.55)] backdrop-blur-md">

                            {/* detalhe azul no fundo */}
                            <div className="absolute inset-y-0 right-0 w-[300px] bg-gradient-to-l from-[#073bd9] to-[#0d5cff]" />

                            {/* corte diagonal */}
                            <div className="absolute right-[235px] top-0 h-full w-24 skew-x-[-24deg] bg-white/95" />

                            {/* brilho sutil */}
                            <div className="absolute inset-0 bg-gradient-to-r from-white/30 via-transparent to-white/10" />

                            {/* barra lateral */}
                            <div className="absolute left-0 top-0 h-full w-2 bg-[#073bd9]" />

                            <div className="relative z-10 flex items-center justify-between gap-6 px-9 py-4">

                                {/* Texto */}
                                <div className="min-w-0 flex-1 pl-4 pr-6">
                                    <h2
                                        className="truncate font-black uppercase leading-none tracking-tight text-[#071b42]"
                                        style={{
                                            fontSize: `${Math.max(tamanhoFonteSlogan + 8, 26)}px`
                                        }}
                                    >
                                        {tituloTarjaFinal}
                                    </h2>

                                    <p
                                        className="mt-2 truncate font-semibold text-[#334155]"
                                        style={{
                                            fontSize: `${Math.max(tamanhoFonteSlogan - 2, 14)}px`
                                        }}
                                    >
                                        {subtituloTarjaFinal}
                                    </p>
                                </div>

                                {/* Logo + hora */}
                                <div className="relative z-20 flex shrink-0 items-center gap-4">
                                    {logo.trim() !== "" && (
                                        <div className="rounded-lg bg-white px-3 py-2 shadow-lg ring-1 ring-black/10">
                                            <img
                                                src={logo}
                                                alt="Logo ADUSEPS"
                                                className="w-auto object-contain"
                                                style={{ height: `${tamanhoLogoRodape}px` }}
                                            />
                                        </div>
                                    )}

                                    <div className="min-w-[105px] rounded-lg bg-white/15 px-3 py-2 text-center shadow-inner backdrop-blur">
                                        <span
                                            className="font-black tracking-tight text-white drop-shadow"
                                            style={{
                                                fontSize: `${tamanhoFonteHora}px`
                                            }}
                                        >
                                            {hora}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* linha inferior */}
                            <div className="h-1.5 bg-gradient-to-r from-[#073bd9] via-[#0d5cff] to-[#073bd9]" />
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
                        className={`relative mx-auto w-[94vw] transition-all ${faseTarja === "entrando" || faseTarja === "visivel"
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


                {/* CLIMA DIGITAL SIGN */}
                {mostrarTarjaFinal && modeloTarjaFinal === "digital" && (
                    <div
                        className={`fixed left-0 top-0 z-40 h-[100dvh] w-[min(50vw,900px)] transition-all ${faseTarja === "entrando" || faseTarja === "visivel"
                            ? "translate-x-0 opacity-100"
                            : "-translate-x-full opacity-0"
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
                        <div className="relative h-full w-full overflow-hidden bg-[#020b1d]/95 shadow-[30px_0_90px_rgba(0,0,0,0.75)] backdrop-blur-xl">
                            {/* FUNDO MODERNO */}
                            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(13,92,255,0.55),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(255,75,35,0.35),transparent_32%),linear-gradient(135deg,rgba(255,255,255,0.10),transparent_45%)]" />
                            <div className="absolute inset-0 opacity-25 bg-[linear-gradient(120deg,transparent_0%,rgba(255,255,255,0.10)_50%,transparent_100%)]" />
                            <div className="absolute right-0 top-0 h-full w-[3px] bg-gradient-to-b from-[#073bd9] via-[#34bcf8] to-[#f15434] shadow-[0_0_35px_rgba(52,188,248,0.9)]" />

                            <div
                                className="relative flex h-full flex-col text-white"
                                style={{
                                    paddingLeft: "clamp(20px,2.8vw,56px)",
                                    paddingRight: "clamp(20px,2.8vw,56px)",
                                    paddingTop: "clamp(12px,2vh,24px)",
                                    paddingBottom: "clamp(16px,4vh,64px)"
                                }}
                            >
                                {/* LOGO */}
                                <div className="flex items-center justify-between">
                                    {logo.trim() !== "" && (
                                        <img
                                            src={logo}
                                            alt="Logo ADUSEPS"
                                            className="h-[clamp(38px,5vh,64px)] w-auto object-contain"
                                        />
                                    )}
                                </div>

                                {/* CONTEÚDO PRINCIPAL */}
                                <div className="mt-[clamp(10px,2vh,24px)] text-center">
                                    <div className="mb-[clamp(14px,3vh,28px)] inline-flex rounded-md bg-gradient-to-r from-[#bb2c63] to-[#f15434] px-[clamp(14px,2vw,24px)] py-[clamp(6px,1vh,8px)] shadow-lg">
                                        <span className="text-[clamp(10px,0.85vw,14px)] font-black uppercase tracking-[0.25em] text-white">
                                            {etiquetaTarjaFinal}
                                        </span>
                                    </div>

                                    <h2
                                        className="font-black uppercase leading-[0.92] tracking-wide text-white drop-shadow-[0_8px_20px_rgba(0,0,0,0.55)]"
                                        style={{
                                            fontSize: "clamp(32px,3.2vw,68px)"
                                        }}
                                    >
                                        {tituloTarjaFinal}
                                    </h2>

                                    <div className="mx-auto mt-[clamp(12px,2vh,20px)] h-[2px] w-[70%] bg-gradient-to-r from-transparent via-[#0d5cff] to-transparent" />

                                    {subtituloTarjaFinal && (
                                        <p
                                            className="mx-auto mt-[clamp(12px,2.5vh,24px)] max-w-[620px] font-medium leading-tight text-white/82"
                                            style={{
                                                fontSize: "clamp(17px,1.55vw,30px)"
                                            }}
                                        >
                                            {subtituloTarjaFinal}
                                        </p>
                                    )}
                                </div>

                                {/* QR CODE + FRASE */}
                                <div className="mt-auto flex flex-col items-center justify-center pt-[clamp(16px,3vh,32px)] pb-[clamp(4px,1vh,8px)]">
                                    {midiaAtual?.qrcode && midiaAtual.qrcode.trim() !== "" ? (
                                        <div className="relative rounded-[clamp(1rem,2vw,1.7rem)] bg-white p-[clamp(8px,1.2vw,16px)] shadow-[0_0_35px_rgba(13,92,255,0.75)]">
                                            <div className="absolute -inset-2 rounded-[2rem] border border-[#34bcf8]/60" />

                                            <img
                                                src={`https://api.qrserver.com/v1/create-qr-code/?size=260x260&data=${encodeURIComponent(midiaAtual.qrcode)}`}
                                                alt="QR Code"
                                                className="relative h-[min(20vw,26vh,224px)] w-[min(20vw,26vh,224px)]"
                                            />
                                        </div>
                                    ) : (
                                        <div className="flex h-[min(20vw,26vh,224px)] w-[min(20vw,26vh,224px)] items-center justify-center rounded-[clamp(1rem,2vw,1.7rem)] border border-white/15 bg-white/10 text-center shadow-[0_0_35px_rgba(13,92,255,0.35)]">
                                            <span className="px-6 text-[clamp(10px,0.9vw,14px)] font-black uppercase tracking-[0.20em] text-white/45">
                                                QR Code opcional
                                            </span>
                                        </div>
                                    )}

                                    <div className="mt-[clamp(12px,2vh,20px)] flex items-center gap-[clamp(8px,1vw,12px)]">
                                        <span className="text-[clamp(26px,2.5vw,40px)]">📷</span>

                                        <div className="text-left">
                                            <p className="text-[clamp(10px,0.9vw,14px)] font-black uppercase tracking-[0.16em] text-white">
                                                Nos siga no Instagram
                                            </p>

                                            <p className="text-[clamp(16px,1.5vw,24px)] font-black text-[#f15434]">
                                                @aduseps
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* RODAPÉ: HORA ESQUERDA / CLIMA DIREITA */}
                                <div className="rounded-2xl border border-white/15 bg-white/8 px-[clamp(14px,2vw,24px)] py-[clamp(10px,1.6vh,16px)] shadow-[0_0_30px_rgba(13,92,255,0.25)] backdrop-blur-md">
                                    <div className="flex items-center justify-between gap-[clamp(10px,1.5vw,24px)]">
                                        <div className="flex items-center gap-[clamp(8px,1.2vw,16px)]">
                                            <div className="flex h-[clamp(40px,5vh,56px)] w-[clamp(40px,5vh,56px)] items-center justify-center rounded-xl border border-[#0d5cff]/60 text-[clamp(24px,2.4vw,36px)] text-[#0d5cff]">
                                                🕘
                                            </div>

                                            <div>
                                                <span
                                                    className="block font-black leading-none text-white"
                                                    style={{
                                                        fontSize: "clamp(28px,2.8vw,52px)"
                                                    }}
                                                >
                                                    {hora}
                                                </span>

                                                <span className="text-[clamp(9px,0.8vw,14px)] font-black uppercase tracking-[0.12em] text-[#2b8cff]">
                                                    Horário atual
                                                </span>
                                            </div>
                                        </div>

                                        <div className="h-[clamp(36px,5vh,56px)] w-px bg-white/25" />

                                        <div className="flex items-center gap-4 text-right">
                                            <div>
                                                <span className="block text-[clamp(24px,2.4vw,42px)] font-black leading-none text-white">
                                                    {erroClima || temperaturaAtual === null
                                                        ? "--"
                                                        : `${obterIconeClima(codigoClimaAtual)} ${temperaturaAtual}°C`}
                                                </span>

                                                <span className="text-[clamp(9px,0.8vw,14px)] font-black uppercase tracking-[0.12em] text-[#2b8cff]">
                                                    Recife / PE
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="absolute bottom-0 left-0 h-1.5 w-full bg-gradient-to-r from-[#073bd9] via-[#bb2c63] to-[#f15434]" />
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