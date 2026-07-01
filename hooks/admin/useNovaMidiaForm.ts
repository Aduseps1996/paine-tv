"use client"

import { useState } from "react"

import { criarMidia } from "@/lib/firestore/midias"
import type { ModeloTarja, ModoExibicaoMidia, TemplateMidia, TipoMidia } from "@/types/painel"

type UseNovaMidiaFormParams = {
    totalMidias: number
    carregarMidias: () => void
}

export function useNovaMidiaForm({
    totalMidias,
    carregarMidias
}: UseNovaMidiaFormParams) {
    const [arquivo, setArquivo] = useState("")
    const [tipo, setTipo] = useState<TipoMidia>("imagem")
    const [template, setTemplate] = useState<TemplateMidia>("cheio")
    const [modoExibicao, setModoExibicao] =
        useState<ModoExibicaoMidia>("cover")

    const [tituloMidia, setTituloMidia] = useState("")
    const [subtituloMidia, setSubtituloMidia] = useState("")
    const [rodapeMidia, setRodapeMidia] = useState("")
    const [qrcodeMidia, setQrcodeMidia] = useState("")
    const [categoriaMidia, setCategoriaMidia] = useState("")
    const [ctaMidia, setCtaMidia] = useState("")

    const [mostrarTarjaMidia, setMostrarTarjaMidia] = useState(false)
    const [tarjaEtiquetaMidia, setTarjaEtiquetaMidia] = useState("ADUSEPS INFORMA")
    const [tarjaTituloMidia, setTarjaTituloMidia] = useState("")
    const [tarjaSubtituloMidia, setTarjaSubtituloMidia] = useState("")
    const [tempoEntradaTarjaMidia, setTempoEntradaTarjaMidia] = useState(1)
    const [tempoVisivelTarjaMidia, setTempoVisivelTarjaMidia] = useState(8)
    const [tempoSaidaTarjaMidia, setTempoSaidaTarjaMidia] = useState(1)
    const [tempoOcultaTarjaMidia, setTempoOcultaTarjaMidia] = useState(10)
    const [tempoInicialTarjaMidia, setTempoInicialTarjaMidia] = useState(1)
    const [modeloTarjaMidia, setModeloTarjaMidia] =
        useState<ModeloTarja>("telejornal")
    const [tarjaQrcodeMidia, setTarjaQrcodeMidia] = useState("")

    const [programarExibicaoNovaMidia, setProgramarExibicaoNovaMidia] = useState(false)
    const [inicioExibicaoNovaMidia, setInicioExibicaoNovaMidia] = useState("")
    const [fimExibicaoNovaMidia, setFimExibicaoNovaMidia] = useState("")

    function validarPeriodoExibicao(mensagemPeriodo: string, mensagemOrdem: string) {
        if (!inicioExibicaoNovaMidia || !fimExibicaoNovaMidia) {
            alert(mensagemPeriodo)
            return false
        }

        const inicio = new Date(inicioExibicaoNovaMidia)
        const fim = new Date(fimExibicaoNovaMidia)

        if (fim <= inicio) {
            alert(mensagemOrdem)
            return false
        }

        return true
    }

    function limparFormulario() {
        setArquivo("")
        setTipo("imagem")
        setTemplate("cheio")
        setModoExibicao("cover")

        setTituloMidia("")
        setSubtituloMidia("")
        setRodapeMidia("")
        setQrcodeMidia("")
        setCtaMidia("")
        setCategoriaMidia("")

        setMostrarTarjaMidia(false)
        setTarjaEtiquetaMidia("ADUSEPS INFORMA")
        setTarjaTituloMidia("")
        setTarjaSubtituloMidia("")
        setTempoEntradaTarjaMidia(1)
        setTempoVisivelTarjaMidia(8)
        setTempoSaidaTarjaMidia(1)
        setTempoInicialTarjaMidia(1)
        setTempoOcultaTarjaMidia(10)
        setModeloTarjaMidia("telejornal")
        setTarjaQrcodeMidia("")

        setProgramarExibicaoNovaMidia(false)
        setInicioExibicaoNovaMidia("")
        setFimExibicaoNovaMidia("")
    }

    async function adicionarMidia() {
        if (arquivo.trim() === "") return

        if (tipo === "youtube") {
            const periodoValido = validarPeriodoExibicao(
                "Informe a data/hora de início e fim da transmissão.",
                "O fim da transmissão deve ser maior que o início."
            )

            if (!periodoValido) return
        }

        if (tipo !== "youtube" && programarExibicaoNovaMidia) {
            const periodoValido = validarPeriodoExibicao(
                "Informe a data/hora de início e fim da exibição.",
                "O fim da exibição deve ser maior que o início."
            )

            if (!periodoValido) return
        }

        await criarMidia({
            tipo,
            arquivo: arquivo.trim(),
            ativo: true,
            ordem: totalMidias + 1,
            duracao: 8,
            template,
            modoExibicao,
            titulo: tituloMidia.trim(),
            subtitulo: subtituloMidia.trim(),
            rodape: rodapeMidia.trim(),
            qrcode: qrcodeMidia.trim(),
            categoria: categoriaMidia.trim(),
            cta: ctaMidia.trim(),
            tarjaEtiqueta: tarjaEtiquetaMidia.trim(),
            tarjaTitulo: tarjaTituloMidia.trim(),
            tarjaSubtitulo: tarjaSubtituloMidia.trim(),
            tempoEntradaTarja: tempoEntradaTarjaMidia,
            tempoVisivelTarja: tempoVisivelTarjaMidia,
            tempoSaidaTarja: tempoSaidaTarjaMidia,
            tempoOcultaTarja: tempoOcultaTarjaMidia,
            tempoInicialTarja: tempoInicialTarjaMidia,
            modeloTarja: modeloTarjaMidia,
            exibicaoProgramada: tipo === "youtube" ? true : programarExibicaoNovaMidia,
            tipoExibicaoProgramada: tipo === "youtube" ? "youtube" : "midia",
            inicioExibicao: inicioExibicaoNovaMidia,
            fimExibicao: fimExibicaoNovaMidia,
            linkYoutubeExibicao: tipo === "youtube" ? arquivo.trim() : "",
            mostrarTarja: mostrarTarjaMidia,
            pesoExibicao: 1
        })

        limparFormulario()
        carregarMidias()
    }

    return {
        arquivo,
        tipo,
        template,
        modoExibicao,
        tituloMidia,
        subtituloMidia,
        rodapeMidia,
        qrcodeMidia,
        categoriaMidia,
        ctaMidia,
        mostrarTarjaMidia,
        tarjaEtiquetaMidia,
        tarjaTituloMidia,
        tarjaSubtituloMidia,
        tempoEntradaTarjaMidia,
        tempoVisivelTarjaMidia,
        tempoSaidaTarjaMidia,
        tempoOcultaTarjaMidia,
        tempoInicialTarjaMidia,
        modeloTarjaMidia,
        tarjaQrcodeMidia,
        programarExibicaoNovaMidia,
        inicioExibicaoNovaMidia,
        fimExibicaoNovaMidia,
        setArquivo,
        setTipo,
        setTemplate,
        setModoExibicao,
        setTituloMidia,
        setSubtituloMidia,
        setRodapeMidia,
        setQrcodeMidia,
        setCategoriaMidia,
        setCtaMidia,
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
        setTarjaQrcodeMidia,
        setProgramarExibicaoNovaMidia,
        setInicioExibicaoNovaMidia,
        setFimExibicaoNovaMidia,
        adicionarMidia
    }
}
