"use client"

import { useEffect, useState } from "react"

import type { Midia, ModeloTarja, ModoExibicaoMidia } from "@/types/painel"

type UseAbaMidiasModaisParams = {
    midias: Midia[]
    setModoExibicao: (valor: ModoExibicaoMidia) => void
    setMostrarTarjaMidia: (valor: boolean) => void
    setTarjaEtiquetaMidia: (valor: string) => void
    setTarjaTituloMidia: (valor: string) => void
    setTarjaSubtituloMidia: (valor: string) => void
    setTempoEntradaTarjaMidia: (valor: number) => void
    setTempoVisivelTarjaMidia: (valor: number) => void
    setTempoSaidaTarjaMidia: (valor: number) => void
    setTempoOcultaTarjaMidia: (valor: number) => void
    setTempoInicialTarjaMidia: (valor: number) => void
    setModeloTarjaMidia: (valor: ModeloTarja) => void
    setTarjaQrcodeMidia: (valor: string) => void
}

export function useAbaMidiasModais({
    midias,
    setModoExibicao,
    setMostrarTarjaMidia,
    setTarjaEtiquetaMidia,
    setTarjaTituloMidia,
    setTarjaSubtituloMidia,
    setTempoEntradaTarjaMidia,
    setTempoVisivelTarjaMidia,
    setTempoSaidaTarjaMidia,
    setTempoOcultaTarjaMidia,
    setTempoInicialTarjaMidia,
    setModeloTarjaMidia,
    setTarjaQrcodeMidia
}: UseAbaMidiasModaisParams) {
    const [modalTarjaAberto, setModalTarjaAberto] = useState(false)
    const [midiaEditando, setMidiaEditando] = useState<string | null>(null)
    const [modalExibicaoAberto, setModalExibicaoAberto] = useState(false)
    const [midiaExibicaoEditando, setMidiaExibicaoEditando] = useState<string | null>(null)

    const [exibicaoProgramada, setExibicaoProgramada] = useState(false)
    const [inicioExibicao, setInicioExibicao] = useState("")
    const [fimExibicao, setFimExibicao] = useState("")
    const [linkYoutubeExibicao, setLinkYoutubeExibicao] = useState("")
    useEffect(() => {
        if (!midiaEditando) return

        const midia = midias.find((item) => item.id === midiaEditando)

        if (!midia) return

        const timeout = window.setTimeout(() => {
            setMostrarTarjaMidia(midia.mostrarTarja ?? false)
            setTarjaEtiquetaMidia(midia.tarjaEtiqueta || "ADUSEPS INFORMA")
            setTarjaTituloMidia(midia.tarjaTitulo || "")
            setTarjaSubtituloMidia(midia.tarjaSubtitulo || "")
            setTempoEntradaTarjaMidia(Number(midia.tempoEntradaTarja || 1))
            setTempoVisivelTarjaMidia(Number(midia.tempoVisivelTarja || 8))
            setTempoSaidaTarjaMidia(Number(midia.tempoSaidaTarja || 1))
            setTempoOcultaTarjaMidia(Number(midia.tempoOcultaTarja || 10))
            setTempoInicialTarjaMidia(Number(midia.tempoInicialTarja || 1))
            setModeloTarjaMidia(midia.modeloTarja || "telejornal")
            setTarjaQrcodeMidia(midia.qrcode || "")
            setModoExibicao(midia.modoExibicao ?? "cover")
        }, 0)

        return () => window.clearTimeout(timeout)
    }, [
        midiaEditando,
        midias,
        setModeloTarjaMidia,
        setModoExibicao,
        setMostrarTarjaMidia,
        setTarjaEtiquetaMidia,
        setTarjaQrcodeMidia,
        setTarjaSubtituloMidia,
        setTarjaTituloMidia,
        setTempoEntradaTarjaMidia,
        setTempoInicialTarjaMidia,
        setTempoOcultaTarjaMidia,
        setTempoSaidaTarjaMidia,
        setTempoVisivelTarjaMidia
    ])

    function abrirModalExibicao(midia: Midia) {
        setMidiaExibicaoEditando(midia.id)
        setExibicaoProgramada(midia.exibicaoProgramada ?? false)
        setInicioExibicao(midia.inicioExibicao || "")
        setFimExibicao(midia.fimExibicao || "")
        setLinkYoutubeExibicao(midia.linkYoutubeExibicao || midia.arquivo || "")
        setModalExibicaoAberto(true)
    }

    return {
        modalTarjaAberto,
        setModalTarjaAberto,
        midiaEditando,
        setMidiaEditando,
        modalExibicaoAberto,
        setModalExibicaoAberto,
        midiaExibicaoEditando,
        setMidiaExibicaoEditando,
        exibicaoProgramada,
        setExibicaoProgramada,
        inicioExibicao,
        setInicioExibicao,
        fimExibicao,
        setFimExibicao,
        linkYoutubeExibicao,
        setLinkYoutubeExibicao,
        abrirModalExibicao
    }
}
