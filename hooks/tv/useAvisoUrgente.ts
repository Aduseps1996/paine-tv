"use client"

import { useEffect, useMemo, useState } from "react"
import { collection, onSnapshot, orderBy, query } from "firebase/firestore"

import { db } from "@/lib/firebase"
import type { AvisoUrgente } from "@/types/painel"

export function useAvisoUrgente() {
    const [avisos, setAvisos] = useState<AvisoUrgente[]>([])
    const [agora, setAgora] = useState<Date | null>(null)

    useEffect(() => {
        const consulta = query(
            collection(db, "avisos_urgentes"),
            orderBy("titulo", "asc")
        )

        const unsubscribe = onSnapshot(
            consulta,
            (snapshot) => {
                const lista = snapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data()
                })) as AvisoUrgente[]

                setAvisos(lista)
            },
            () => {
                setAvisos([])
            }
        )

        return () => unsubscribe()
    }, [])

    useEffect(() => {
        const atualizar = () => setAgora(new Date())
        atualizar()

        const intervalo = setInterval(atualizar, 10000)

        return () => clearInterval(intervalo)
    }, [])

    return useMemo(() => {
        if (!agora) return null

        return (
            avisos.find((aviso) => {
                if (!aviso.ativo) return false

                if (aviso.inicioExibicao && aviso.fimExibicao) {
                    const inicio = new Date(aviso.inicioExibicao)
                    const fim = new Date(aviso.fimExibicao)

                    if (Number.isNaN(inicio.getTime()) || Number.isNaN(fim.getTime())) {
                        return false
                    }

                    return agora >= inicio && agora <= fim
                }

                return true
            }) || null
        )
    }, [agora, avisos])
}
