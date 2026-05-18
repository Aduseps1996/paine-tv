"use client"

import { useEffect, useState } from "react"

import {
    collection,
    query,
    orderBy,
    onSnapshot
} from "firebase/firestore"

import { db } from "../lib/firebase"

type Noticia = {
    id?: string
    texto: string
    ativo: boolean
    ordem: number
}

import { CalendarDays, Clock3 } from "lucide-react"

export default function RodapeNoticias({
    logo,
    slogan
}: {
    logo: string
    slogan: string
}) {

    const [noticias, setNoticias] = useState<Noticia[]>([])
    const [agora, setAgora] = useState(new Date())

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

            const lista = resultado.docs.map((doc) => ({
                id: doc.id,
                ...doc.data()
            })) as Noticia[]

            const listaAtiva = lista.filter(
                (noticia) => noticia.ativo === true
            )

            setNoticias(listaAtiva)

        })

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
        <div className="absolute bottom-0 left-0 w-full text-white z-20 overflow-hidden shadow-[0_-12px_35px_rgba(0,0,0,0.35)]">

            <div className="h-16 bg-[#0f2f70]  border-t-4 border-[#f15434] flex items-center px-8 gap-6">

                <div className="flex items-center gap-3">
                    <span className="text-[#34bcf8]  text-2xl">
                        <CalendarDays
                            size={22}
                            className="text-[#f15434]"
                        />
                    </span>

                    <span className="text-lg font-semibold">
                        {data}
                    </span>
                </div>

                <div className="h-8 w-px bg-white/25" />

                <div className="flex items-center gap-3">
                    <span className="text-[#34bcf8] text-2xl">
                        <Clock3
                            size={22}
                            className="text-[#f15434]"
                        />
                    </span>

                    <span className="text-2xl font-black">
                        {hora}
                    </span>
                </div>

                <div className="h-8 w-px bg-white/25" />

                <p className="text-lg font-medium text-white/90 tracking-wide flex-1">
                    {slogan}
                </p>

                <div className="h-8 w-px bg-white/25" />

                <img
                    src={logo || "/logos/logo.png"}
                    alt="Logo ADUSEPS"
                    className="h-11 w-auto object-contain drop-shadow-md"
                />

            </div>

            <div className="h-11 bg-[#2454a4] flex items-center overflow-hidden">

                <div className="whitespace-nowrap animate-[marquee_80s_linear_infinite] text-xl font-medium leading-none tracking-[0.12em] antialiased text-white">

                    {noticias.map((noticia, index) => (

                        <span
                            key={noticia.id}
                            className="inline-flex items-center"
                        >

                            <span className="mx-10">
                                {noticia.texto}
                            </span>

                            {index < noticias.length - 1 && (
                                <span className="text-[#f15434] text-2xl mx-6 opacity-90">
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