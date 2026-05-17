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

    const midiaAtual = midias[indiceAtual]

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

            setIndiceAtual((valorAtual) => {

                const proximo = valorAtual + 1

                if (proximo >= midias.length) {
                    return 0
                }

                return proximo

            })

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
                        className="absolute inset-0 w-full h-full object-cover transition-all duration-1000"
                    />

                ) : (

                    <video
                        src={midiaAtual.arquivo}
                        autoPlay
                        muted
                        className="absolute inset-0 w-full h-full object-cover"

                        onError={() => {
                            setIndiceAtual((valorAtual) => {

                                const proximo = valorAtual + 1

                                if (proximo >= midias.length) {
                                    return 0
                                }

                                return proximo

                            })
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