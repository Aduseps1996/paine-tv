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

export default function RodapeNoticias() {

    const [noticias, setNoticias] = useState<Noticia[]>([])

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

    return (
        <div className="absolute bottom-0 left-0 w-full bg-zinc-950 text-white z-20 overflow-hidden h-20 flex items-center border-t-4 border-blue-600">

            <div className="whitespace-nowrap animate-[marquee_35s_linear_infinite] text-3xl font-bold leading-none">

                {noticias.map((noticia) => (

                    <span
                        key={noticia.id}
                        className="mx-16 inline-block"
                    >
                        {noticia.texto}
                    </span>

                ))}

            </div>

        </div>
    )
}