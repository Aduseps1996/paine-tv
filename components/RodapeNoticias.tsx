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
    slogan
}: {
    logo: string
    slogan: string
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

    return (
        <div className="absolute bottom-0 left-0 w-full text-white z-20 overflow-hidden border-t border-white/10 backdrop-blur-sm shadow-[0_-18px_45px_rgba(0,0,0,0.45)]">
            <div
                className="bg-[#0b2557]/95 border-t-4 border-[#f15434] flex items-center px-8 gap-6"
                style={{ height: `${alturaBarraSuperior}px` }}
            >
                <div className="flex items-center gap-3">
                    <CalendarDays
                        size={tamanhoIconeRodape}
                        className="text-[#f15434]"
                    />

                    <span
                        className="font-semibold"
                        style={{ fontSize: `${tamanhoFonteDataHora}px` }}
                    >
                        {data}
                    </span>
                </div>

                <div className="h-8 w-px bg-white/25" />

                <div className="flex items-center gap-3">
                    <Clock3
                        size={tamanhoIconeRodape}
                        className="text-[#f15434]"
                    />

                    <span
                        className="font-black"
                        style={{ fontSize: `${tamanhoFonteHora}px` }}
                    >
                        {hora}
                    </span>
                </div>

                <div className="h-8 w-px bg-white/25" />

                <p
                    className="font-medium text-white/90 tracking-wide flex-1"
                    style={{ fontSize: `${tamanhoFonteSlogan}px` }}
                >
                    {slogan}
                </p>

                <div className="h-8 w-px bg-white/25" />

                {logo.trim() !== "" && (
                    <img
                        src={logo}
                        alt="Logo ADUSEPS"
                        className="w-auto object-contain drop-shadow-md"
                        style={{ height: `${tamanhoLogoRodape}px` }}
                    />
                )}

            </div>

            <div
                className="bg-[#183b78]/95 flex items-center overflow-hidden"
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
                            <span className="mx-8">
                                {noticia.texto}
                            </span>

                            {index < noticias.length - 1 && (
                                <span
                                    className="text-[#f15434] mx-6 opacity-90"
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
    )
}