"use client"

import { useCallback, useState } from "react"

import {
    buscarConfiguracoesPainel,
    salvarConfiguracoesPainel
} from "@/lib/firestore/configuracoes"
import type { ModoLogo, TamanhoLogoPainel } from "@/types/painel"
import { limitarValor } from "@/utils/numero"

export function useAdminConfiguracoesPainel() {
    const [nomePainel, setNomePainel] = useState("")
    const [subtitulo, setSubtitulo] = useState("")
    const [logo, setLogo] = useState("")
    const [modoLogo, setModoLogo] = useState<ModoLogo>("fundo")
    const [tamanhoLogoPainel, setTamanhoLogoPainel] =
        useState<TamanhoLogoPainel>("medio")
    const [slogan, setSlogan] = useState("")

    const [tamanhoFonteRodape, setTamanhoFonteRodape] = useState(28)
    const [tamanhoFonteSlogan, setTamanhoFonteSlogan] = useState(18)
    const [tamanhoFonteDataHora, setTamanhoFonteDataHora] = useState(18)
    const [tamanhoFonteHora, setTamanhoFonteHora] = useState(24)
    const [tamanhoIconeRodape, setTamanhoIconeRodape] = useState(22)
    const [alturaBarraSuperior, setAlturaBarraSuperior] = useState(64)
    const [alturaBarraNoticias, setAlturaBarraNoticias] = useState(44)
    const [tamanhoLogoRodape, setTamanhoLogoRodape] = useState(44)
    const [tempoOcultaTarja, setTempoOcultaTarja] = useState(10)

    const [mostrarTarjaTv, setMostrarTarjaTv] = useState(true)
    const [mostrarLogoFaixaPainel, setMostrarLogoFaixaPainel] = useState(false)
    const [mostrarRodapeNoticias, setMostrarRodapeNoticias] = useState(true)

    const [tempoEntradaTarja, setTempoEntradaTarja] = useState(1)
    const [tempoVisivelTarja, setTempoVisivelTarja] = useState(8)
    const [tempoSaidaTarja, setTempoSaidaTarja] = useState(1)
    const [duracaoAnimacaoNoticias, setDuracaoAnimacaoNoticias] = useState(150)

    const [mostrarTemperaturaPainel, setMostrarTemperaturaPainel] = useState(true)
    const [mostrarDescricaoClimaPainel, setMostrarDescricaoClimaPainel] = useState(true)
    const [mostrarCidadePainel, setMostrarCidadePainel] = useState(true)
    const [mostrarDataPainel, setMostrarDataPainel] = useState(true)
    const [mostrarHoraPainel, setMostrarHoraPainel] = useState(true)
    const [cidadeClimaPainel, setCidadeClimaPainel] = useState("Recife")

    const [latitudeClimaPainel, setLatitudeClimaPainel] = useState(-8.05)
    const [longitudeClimaPainel, setLongitudeClimaPainel] = useState(-34.9)
    const [timezoneClimaPainel, setTimezoneClimaPainel] = useState("America/Recife")

    const carregarConfiguracoes = useCallback(async () => {
        const dados = await buscarConfiguracoesPainel()

        if (!dados) return

        setNomePainel(dados.nomePainel || "")
        setSubtitulo(dados.subtitulo || "")
        setLogo(dados.logo || "")
        setModoLogo(dados.modoLogo || "fundo")
        setTamanhoLogoPainel(dados.tamanhoLogoPainel || "medio")
        setSlogan(dados.slogan || "")

        setMostrarTarjaTv(dados.mostrarTarjaTv ?? true)
        setMostrarLogoFaixaPainel(dados.mostrarLogoFaixaPainel ?? false)
        setMostrarRodapeNoticias(dados.mostrarRodapeNoticias ?? true)

        setTempoEntradaTarja(Number(dados.tempoEntradaTarja || 1))
        setTempoVisivelTarja(Number(dados.tempoVisivelTarja || 8))
        setTempoSaidaTarja(Number(dados.tempoSaidaTarja || 1))
        setTempoOcultaTarja(Number(dados.tempoOcultaTarja || 10))

        setMostrarTemperaturaPainel(dados.mostrarTemperaturaPainel ?? true)
        setMostrarDescricaoClimaPainel(dados.mostrarDescricaoClimaPainel ?? true)
        setMostrarCidadePainel(dados.mostrarCidadePainel ?? true)
        setMostrarDataPainel(dados.mostrarDataPainel ?? true)
        setMostrarHoraPainel(dados.mostrarHoraPainel ?? true)
        setCidadeClimaPainel(dados.cidadeClimaPainel || "Recife")

        setLatitudeClimaPainel(Number(dados.latitudeClimaPainel ?? -8.05))
        setLongitudeClimaPainel(Number(dados.longitudeClimaPainel ?? -34.9))
        setTimezoneClimaPainel(dados.timezoneClimaPainel || "America/Recife")

        setTamanhoFonteRodape(
            limitarValor(Number(dados.tamanhoFonteRodape || 28), 12, 80, 28)
        )
        setTamanhoFonteSlogan(
            limitarValor(Number(dados.tamanhoFonteSlogan || 18), 12, 80, 18)
        )
        setTamanhoFonteDataHora(
            limitarValor(Number(dados.tamanhoFonteDataHora || 18), 12, 80, 18)
        )
        setTamanhoFonteHora(
            limitarValor(Number(dados.tamanhoFonteHora || 24), 12, 80, 24)
        )
        setTamanhoIconeRodape(
            limitarValor(Number(dados.tamanhoIconeRodape || 22), 12, 80, 22)
        )
        setAlturaBarraSuperior(
            limitarValor(Number(dados.alturaBarraSuperior || 64), 40, 120, 64)
        )
        setAlturaBarraNoticias(
            limitarValor(Number(dados.alturaBarraNoticias || 44), 30, 100, 44)
        )
        setTamanhoLogoRodape(
            limitarValor(Number(dados.tamanhoLogoRodape || 44), 20, 100, 44)
        )
        setDuracaoAnimacaoNoticias(
            limitarValor(Number(dados.duracaoAnimacaoNoticias || 150), 60, 300, 150)
        )
    }, [])

    async function salvarConfiguracoes() {
        const configuracoes = {
            nomePainel,
            subtitulo,
            logo,
            slogan,
            modoLogo,
            tamanhoLogoPainel,
            mostrarTarjaTv,
            mostrarLogoFaixaPainel,
            mostrarRodapeNoticias,
            mostrarTemperaturaPainel,
            mostrarDescricaoClimaPainel,
            mostrarCidadePainel,
            mostrarDataPainel,
            mostrarHoraPainel,
            cidadeClimaPainel,
            latitudeClimaPainel,
            longitudeClimaPainel,
            timezoneClimaPainel,
            tempoEntradaTarja,
            tempoVisivelTarja,
            tempoSaidaTarja,
            tempoOcultaTarja,
            tamanhoFonteRodape: limitarValor(tamanhoFonteRodape, 12, 80, 28),
            tamanhoFonteSlogan: limitarValor(tamanhoFonteSlogan, 12, 80, 18),
            tamanhoFonteDataHora: limitarValor(tamanhoFonteDataHora, 12, 80, 18),
            tamanhoFonteHora: limitarValor(tamanhoFonteHora, 12, 80, 24),
            tamanhoIconeRodape: limitarValor(tamanhoIconeRodape, 12, 80, 22),
            alturaBarraSuperior: limitarValor(alturaBarraSuperior, 40, 120, 64),
            alturaBarraNoticias: limitarValor(alturaBarraNoticias, 30, 100, 44),
            tamanhoLogoRodape: limitarValor(tamanhoLogoRodape, 20, 100, 44),
            duracaoAnimacaoNoticias: limitarValor(duracaoAnimacaoNoticias, 60, 300, 150)
        }

        await salvarConfiguracoesPainel(configuracoes)

        setTamanhoFonteRodape(configuracoes.tamanhoFonteRodape)
        setTamanhoFonteSlogan(configuracoes.tamanhoFonteSlogan)
        setTamanhoFonteDataHora(configuracoes.tamanhoFonteDataHora)
        setTamanhoFonteHora(configuracoes.tamanhoFonteHora)
        setTamanhoIconeRodape(configuracoes.tamanhoIconeRodape)
        setAlturaBarraSuperior(configuracoes.alturaBarraSuperior)
        setAlturaBarraNoticias(configuracoes.alturaBarraNoticias)
        setDuracaoAnimacaoNoticias(configuracoes.duracaoAnimacaoNoticias)
        setTamanhoLogoRodape(configuracoes.tamanhoLogoRodape)

        alert("Configurações salvas!")
    }

    return {
        nomePainel,
        subtitulo,
        logo,
        modoLogo,
        tamanhoLogoPainel,
        slogan,
        tamanhoFonteRodape,
        tamanhoFonteSlogan,
        tamanhoFonteDataHora,
        tamanhoFonteHora,
        tamanhoIconeRodape,
        alturaBarraSuperior,
        alturaBarraNoticias,
        tamanhoLogoRodape,
        tempoOcultaTarja,
        mostrarTarjaTv,
        mostrarLogoFaixaPainel,
        mostrarRodapeNoticias,
        tempoEntradaTarja,
        tempoVisivelTarja,
        tempoSaidaTarja,
        duracaoAnimacaoNoticias,
        mostrarTemperaturaPainel,
        mostrarDescricaoClimaPainel,
        mostrarCidadePainel,
        mostrarDataPainel,
        mostrarHoraPainel,
        cidadeClimaPainel,
        latitudeClimaPainel,
        longitudeClimaPainel,
        timezoneClimaPainel,
        setNomePainel,
        setSubtitulo,
        setLogo,
        setModoLogo,
        setTamanhoLogoPainel,
        setSlogan,
        setTamanhoFonteRodape,
        setTamanhoFonteSlogan,
        setTamanhoFonteDataHora,
        setTamanhoFonteHora,
        setAlturaBarraNoticias,
        setAlturaBarraSuperior,
        setTamanhoIconeRodape,
        setTamanhoLogoRodape,
        setTempoOcultaTarja,
        setMostrarLogoFaixaPainel,
        setMostrarRodapeNoticias,
        setTempoEntradaTarja,
        setTempoVisivelTarja,
        setTempoSaidaTarja,
        setDuracaoAnimacaoNoticias,
        setMostrarTemperaturaPainel,
        setMostrarDescricaoClimaPainel,
        setMostrarCidadePainel,
        setMostrarDataPainel,
        setMostrarHoraPainel,
        setCidadeClimaPainel,
        setLatitudeClimaPainel,
        setLongitudeClimaPainel,
        setTimezoneClimaPainel,
        carregarConfiguracoes,
        salvarConfiguracoes
    }
}
