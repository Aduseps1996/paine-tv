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
}

    export default function BannerRotativo({
        fallback
    }: {
        fallback: string
    }) {

    const [midias, setMidias] = useState<Midia[]>([])
    const [indiceAtual, setIndiceAtual] = useState(0)
    const [visivel, setVisivel] = useState(true)

    const midiaAtual = midias[indiceAtual]

    function avancarMidia() {
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

            setIndiceAtual((indiceAtual) => {
                if (indiceAtual >= listaAtiva.length) {
                    return 0
                }

                return indiceAtual
            })

        })

        return () => unsubscribe()

    }, [])

    useEffect(() => {

        if (!midiaAtual) return

        if (midiaAtual.tipo !== "imagem") return

        const intervaloBanner = setInterval(() => {

            avancarMidia()

        }, midiaAtual.duracao * 1000)

        return () => clearInterval(intervaloBanner)

    }, [midiaAtual, midias.length])

    if (midias.length === 0 || !midiaAtual) {
        return (
            <img
                src={fallback}
                alt="Imagem padrão"
                className="absolute inset-0 w-full h-full object-cover"
            />
        )
    }

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
                        className={`absolute top-0 left-0 w-full h-[calc(100vh-6.7rem)] object-cover transition-opacity duration-[1600ms] ease-in-out ${
                            visivel ? "opacity-100" : "opacity-0"
                        }`}
                    />

                ) : (

                    <video
                        src={midiaAtual.arquivo}
                        autoPlay
                        muted
                        className={`absolute top-0 left-0 w-full h-[calc(100vh-6.7rem)] object-cover transition-opacity duration-[1600ms] ease-in-out ${
                            visivel ? "opacity-100" : "opacity-0"
                        }`}

                        onError={() => {
                            avancarMidia()
                        }}
                        onEnded={() => {

                            setIndiceAtual((valorAtual) => {

                                const proximo = valorAtual + 1

                                if (proximo >= midias.length) {
                                    return 0
                                }

                                return proximo

                            })

                        }}
                    />

                )
            }
        </>
    )
}