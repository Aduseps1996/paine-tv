"use client"

import { useEffect, useMemo, useState } from "react"
import { collection, onSnapshot } from "firebase/firestore"

import { db } from "@/lib/firebase"
import { ordenarComunicados } from "@/lib/firestore/comunicados"
import type { AvisoUrgente } from "@/types/painel"

export function useComunicadosAtivos(
    usarPreview = false,
    comunicadosPreview: AvisoUrgente[] = []
) {
    const [comunicados, setComunicados] = useState<AvisoUrgente[]>([])
    const [agora, setAgora] = useState<Date | null>(null)

    useEffect(() => {
        if (usarPreview) {
            return
        }

        const unsubscribe = onSnapshot(
            collection(db, "avisos_urgentes"),
            (snapshot) => {
                const lista = snapshot.docs.map((documento) => ({
                    id: documento.id,
                    ...documento.data()
                })) as AvisoUrgente[]

                setComunicados(ordenarComunicados(lista))
            },
            () => setComunicados([])
        )

        return () => unsubscribe()
    }, [usarPreview])

    useEffect(() => {
        const atualizar = () => setAgora(new Date())
        atualizar()

        const intervalo = window.setInterval(atualizar, 10000)
        return () => window.clearInterval(intervalo)
    }, [])

    return useMemo(() => {
        if (!agora) return []

        const origem = usarPreview ? comunicadosPreview : comunicados

        return origem.filter((comunicado) => {
            if (!comunicado.ativo) return false

            if (comunicado.inicioExibicao) {
                const inicio = new Date(comunicado.inicioExibicao)

                if (
                    !Number.isNaN(inicio.getTime()) &&
                    agora < inicio
                ) {
                    return false
                }
            }

            if (comunicado.fimExibicao) {
                const fim = new Date(comunicado.fimExibicao)

                if (
                    !Number.isNaN(fim.getTime()) &&
                    agora > fim
                ) {
                    return false
                }
            }

            return true
        })
    }, [agora, comunicados, comunicadosPreview, usarPreview])
}
