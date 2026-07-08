"use client"

import { useEffect, useState } from "react"

import { doc, onSnapshot } from "firebase/firestore"

import { useNoticiasPainel } from "@/hooks/tv/useNoticiasPainel"
import { usePainelRelogio } from "@/hooks/tv/usePainelRelogio"
import { BarraNoticias } from "@/components/tv/rodape"
import RelogioRodape from "@/components/tv/rodape/RelogioRodape"
import TarjaTV from "@/components/tv/rodape/TarjaTV"
import { db } from "@/lib/firebase"
import type { ConfiguracoesPainel, Midia, Noticia } from "@/types/painel"

type RodapeNoticiasProps = {
    logo: string
    slogan: string
    midiaAtual?: Midia | null
    modoPreview?: boolean
    previewNoticias?: Noticia[]
    previewConfiguracoes?: ConfiguracoesPainel
}

function limitarValor(valor: unknown, minimo: number, maximo: number, padrao: number) {
    const numero = Number(valor)

    if (Number.isNaN(numero)) {
        return padrao
    }

    return Math.min(Math.max(numero, minimo), maximo)
}

export default function RodapeNoticias({
    logo,
    slogan,
    midiaAtual,
    modoPreview = false,
    previewNoticias,
    previewConfiguracoes
}: RodapeNoticiasProps) {
    const [tamanhoFonteRodape, setTamanhoFonteRodape] = useState(28)
    const [tamanhoFonteSlogan, setTamanhoFonteSlogan] = useState(18)
    const [tamanhoFonteHora, setTamanhoFonteHora] = useState(24)
    const [alturaBarraNoticias, setAlturaBarraNoticias] = useState(44)
    const [duracaoAnimacaoNoticias, setDuracaoAnimacaoNoticias] = useState(150)
    const [tamanhoLogoRodape, setTamanhoLogoRodape] = useState(44)
    const [tempoEntradaTarja, setTempoEntradaTarja] = useState(1)
    const [tempoVisivelTarja, setTempoVisivelTarja] = useState(8)
    const [tempoSaidaTarja, setTempoSaidaTarja] = useState(1)
    const [tempoOcultaTarja, setTempoOcultaTarja] = useState(10)
    const [tempoInicialTarja, setTempoInicialTarja] = useState(1)
    const [mostrarRodapeNoticias, setMostrarRodapeNoticias] = useState(true)
    const [temperaturaAtual, setTemperaturaAtual] = useState<number | null>(null)
    const [codigoClimaAtual, setCodigoClimaAtual] = useState<number | null>(null)
    const [erroClima, setErroClima] = useState(false)

    const { hora, data } = usePainelRelogio()
    const { noticiasVisiveis } = useNoticiasPainel({
        modoPreview,
        previewNoticias
    })

    useEffect(() => {
        if (modoPreview) return

        const unsubscribe = onSnapshot(
            doc(db, "configuracoes", "geral"),
            (documento) => {
                if (!documento.exists()) return

                const dados = documento.data()

                setTamanhoFonteRodape(limitarValor(dados.tamanhoFonteRodape, 12, 80, 28))
                setTamanhoFonteSlogan(limitarValor(dados.tamanhoFonteSlogan, 12, 60, 18))
                setTamanhoFonteHora(limitarValor(dados.tamanhoFonteHora, 12, 70, 24))
                setAlturaBarraNoticias(limitarValor(dados.alturaBarraNoticias, 30, 100, 44))
                setTamanhoLogoRodape(limitarValor(dados.tamanhoLogoRodape, 24, 100, 44))
                setDuracaoAnimacaoNoticias(limitarValor(dados.duracaoAnimacaoNoticias, 60, 300, 150))
                setMostrarRodapeNoticias(dados.mostrarRodapeNoticias ?? true)
                setTempoEntradaTarja(Number(dados.tempoEntradaTarja || 1))
                setTempoVisivelTarja(Number(dados.tempoVisivelTarja || 8))
                setTempoSaidaTarja(Number(dados.tempoSaidaTarja || 1))
                setTempoOcultaTarja(Number(dados.tempoOcultaTarja || 10))
                setTempoInicialTarja(Number(dados.tempoInicialTarja || 1))
            }
        )

        return () => unsubscribe()
    }, [modoPreview])

    useEffect(() => {
        async function buscarClima() {
            try {
                setErroClima(false)

                const resposta = await fetch(
                    "https://api.open-meteo.com/v1/forecast?latitude=-8.05&longitude=-34.9&current=temperature_2m,weather_code&timezone=America%2FRecife"
                )

                if (!resposta.ok) {
                    throw new Error("Erro ao buscar clima")
                }

                const dados = await resposta.json()

                setTemperaturaAtual(Math.round(dados.current.temperature_2m))
                setCodigoClimaAtual(dados.current.weather_code)
            } catch {
                setErroClima(true)
            }
        }

        buscarClima()
        const intervalo = setInterval(buscarClima, 30 * 60 * 1000)

        return () => clearInterval(intervalo)
    }, [])

    const dadosPreview = modoPreview ? previewConfiguracoes : undefined

    const tamanhoFonteRodapeFinal = dadosPreview?.tamanhoFonteRodape || tamanhoFonteRodape
    const tamanhoFonteSloganFinal = dadosPreview?.tamanhoFonteSlogan || tamanhoFonteSlogan
    const tamanhoFonteHoraFinal = dadosPreview?.tamanhoFonteHora || tamanhoFonteHora
    const alturaBarraNoticiasFinal = dadosPreview?.alturaBarraNoticias || alturaBarraNoticias
    const duracaoAnimacaoNoticiasFinal = dadosPreview?.duracaoAnimacaoNoticias || duracaoAnimacaoNoticias
    const tamanhoLogoRodapeFinal = dadosPreview?.tamanhoLogoRodape || tamanhoLogoRodape
    const tempoEntradaTarjaConfig = dadosPreview?.tempoEntradaTarja || tempoEntradaTarja
    const tempoVisivelTarjaConfig = dadosPreview?.tempoVisivelTarja || tempoVisivelTarja
    const tempoSaidaTarjaConfig = dadosPreview?.tempoSaidaTarja || tempoSaidaTarja
    const tempoOcultaTarjaConfig = dadosPreview?.tempoOcultaTarja || tempoOcultaTarja
    const tempoInicialTarjaConfig = dadosPreview?.tempoEntradaTarja || tempoInicialTarja
    const mostrarRodapeNoticiasFinal = dadosPreview?.mostrarRodapeNoticias ?? mostrarRodapeNoticias

    const mostrarTarjaFinal = Boolean(midiaAtual?.mostrarTarja) && Boolean(midiaAtual?.ativo)
    const modeloTarjaFinal = midiaAtual?.modeloTarja ?? "telejornal"

    const tempoEntradaTarjaFinal = Number(midiaAtual?.tempoEntradaTarja || tempoEntradaTarjaConfig)
    const tempoVisivelTarjaFinal = Number(midiaAtual?.tempoVisivelTarja || tempoVisivelTarjaConfig)
    const tempoSaidaTarjaFinal = Number(midiaAtual?.tempoSaidaTarja || tempoSaidaTarjaConfig)
    const tempoOcultaTarjaFinal = Number(midiaAtual?.tempoOcultaTarja || tempoOcultaTarjaConfig)
    const tempoInicialTarjaFinal = Number(midiaAtual?.tempoInicialTarja || tempoInicialTarjaConfig)

    return (
        <>
            <TarjaTV
                logo={logo}
                slogan={slogan}
                data={data}
                hora={hora}
                midiaAtual={midiaAtual}
                mostrarTarja={mostrarTarjaFinal}
                modeloTarja={modeloTarjaFinal}
                tamanhoFonteSlogan={tamanhoFonteSloganFinal}
                tamanhoFonteHora={tamanhoFonteHoraFinal}
                tamanhoLogoRodape={tamanhoLogoRodapeFinal}
                tempoEntradaTarja={tempoEntradaTarjaFinal}
                tempoVisivelTarja={tempoVisivelTarjaFinal}
                tempoSaidaTarja={tempoSaidaTarjaFinal}
                tempoOcultaTarja={tempoOcultaTarjaFinal}
                tempoInicialTarja={tempoInicialTarjaFinal}
                temperaturaAtual={temperaturaAtual}
                codigoClimaAtual={codigoClimaAtual}
                erroClima={erroClima}
                midiaId={midiaAtual?.id}
            />

            <RelogioRodape tamanhoFonteHora={tamanhoFonteHoraFinal} />

            <BarraNoticias
                mostrar={mostrarRodapeNoticiasFinal}
                noticias={noticiasVisiveis}
                tamanhoFonte={tamanhoFonteRodapeFinal}
                altura={alturaBarraNoticiasFinal}
                duracaoAnimacao={duracaoAnimacaoNoticiasFinal}
            />
        </>
    )
}
