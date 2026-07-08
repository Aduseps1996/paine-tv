"use client"

import { useEffect, useState } from "react"

export function useModoTelaPainel() {
    const [tela, setTela] = useState({
        largura: 1920,
        altura: 1080
    })

    useEffect(() => {
        function atualizarTela() {
            setTela({
                largura: window.innerWidth,
                altura: window.innerHeight
            })
        }

        atualizarTela()
        window.addEventListener("resize", atualizarTela)

        return () => window.removeEventListener("resize", atualizarTela)
    }, [])

    const modoCompacto = tela.largura < 1200 || tela.altura < 700

    return {
        ...tela,
        modoCompacto
    }
}