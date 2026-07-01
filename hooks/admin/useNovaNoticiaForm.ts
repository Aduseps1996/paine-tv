"use client"

import { useState } from "react"

import { criarNoticia } from "@/lib/firestore/noticias"
import type { CategoriaNoticia } from "@/types/painel"

type UseNovaNoticiaFormParams = {
    totalNoticias: number
    carregarNoticias: () => void
}

export function useNovaNoticiaForm({
    totalNoticias,
    carregarNoticias
}: UseNovaNoticiaFormParams) {
    const [novaNoticia, setNovaNoticia] = useState("")
    const [noticiaProgramada, setNoticiaProgramada] = useState(false)
    const [inicioNoticia, setInicioNoticia] = useState("")
    const [fimNoticia, setFimNoticia] = useState("")
    const [categoriaNoticia, setCategoriaNoticia] =
        useState<CategoriaNoticia>("normal")

    function limparFormulario() {
        setNovaNoticia("")
        setNoticiaProgramada(false)
        setInicioNoticia("")
        setFimNoticia("")
        setCategoriaNoticia("normal")
    }

    function validarPeriodo() {
        if (!inicioNoticia || !fimNoticia) {
            alert("Informe o início e o fim da notícia programada.")
            return false
        }

        const inicio = new Date(inicioNoticia)
        const fim = new Date(fimNoticia)

        if (Number.isNaN(inicio.getTime()) || Number.isNaN(fim.getTime())) {
            alert("Data/hora inválida.")
            return false
        }

        if (fim <= inicio) {
            alert("O fim da notícia precisa ser maior que o início.")
            return false
        }

        return true
    }

    async function adicionarNoticia() {
        if (novaNoticia.trim() === "") return

        if (noticiaProgramada && !validarPeriodo()) {
            return
        }

        await criarNoticia({
            texto: novaNoticia.trim(),
            ativo: true,
            ordem: totalNoticias + 1,
            programada: noticiaProgramada,
            inicioExibicao: noticiaProgramada ? inicioNoticia : "",
            fimExibicao: noticiaProgramada ? fimNoticia : "",
            categoria: categoriaNoticia
        })

        limparFormulario()
        carregarNoticias()
    }

    return {
        novaNoticia,
        setNovaNoticia,
        adicionarNoticia,
        noticiaProgramada,
        setNoticiaProgramada,
        inicioNoticia,
        setInicioNoticia,
        fimNoticia,
        setFimNoticia,
        categoriaNoticia,
        setCategoriaNoticia
    }
}
