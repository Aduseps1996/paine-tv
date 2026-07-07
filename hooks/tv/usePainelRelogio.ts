"use client"

import { useEffect, useMemo, useState } from "react"

export function usePainelRelogio() {
    const [agora, setAgora] = useState(() => new Date())

    useEffect(() => {
        const relogio = setInterval(() => {
            setAgora(new Date())
        }, 30000)

        return () => clearInterval(relogio)
    }, [])

    const hora = useMemo(() => {
        return agora.toLocaleTimeString("pt-BR", {
            hour: "2-digit",
            minute: "2-digit"
        })
    }, [agora])

    const data = useMemo(() => {
        return agora.toLocaleDateString("pt-BR", {
            day: "2-digit",
            month: "long",
            year: "numeric"
        })
    }, [agora])

    return {
        hora,
        data
    }
}
