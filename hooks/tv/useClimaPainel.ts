"use client"

import { useEffect, useState } from "react"

import {
    formatarNumeroClima,
    normalizarConfiguracoesBanner,
    obterDescricaoClima,
    obterIconeClima,
    type ClimaPainel
} from "@/components/tv/banner/utils"
import type { ConfiguracoesPainel } from "@/types/painel"

export function useClimaPainel(configuracoes?: ConfiguracoesPainel): ClimaPainel {
    const config = normalizarConfiguracoesBanner(configuracoes)

    const [temperaturaAtual, setTemperaturaAtual] = useState<number | null>(null)
    const [codigoClimaAtual, setCodigoClimaAtual] = useState<number | null>(null)
    const [sensacaoTermicaAtual, setSensacaoTermicaAtual] =
        useState<number | null>(null)
    const [umidadeAtual, setUmidadeAtual] = useState<number | null>(null)
    const [ventoAtual, setVentoAtual] = useState<number | null>(null)
    const [temperaturaMaximaHoje, setTemperaturaMaximaHoje] =
        useState<number | null>(null)
    const [temperaturaMinimaHoje, setTemperaturaMinimaHoje] =
        useState<number | null>(null)
    const [previsaoProximosDias, setPrevisaoProximosDias] =
        useState<ClimaPainel["previsaoProximosDias"]>([])
    const [erroClima, setErroClima] = useState(false)

    useEffect(() => {
        async function buscarClima() {
            try {
                setErroClima(false)

                const resposta = await fetch(
                    `https://api.open-meteo.com/v1/forecast?latitude=${config.latitudeClimaPainel}&longitude=${config.longitudeClimaPainel}&current=temperature_2m,apparent_temperature,relative_humidity_2m,wind_speed_10m,weather_code&daily=temperature_2m_max,temperature_2m_min,weather_code&forecast_days=4&timezone=${encodeURIComponent(config.timezoneClimaPainel)}`
                )

                if (!resposta.ok) {
                    throw new Error("Erro ao buscar clima")
                }

                const dados = await resposta.json()
                const current = dados.current || {}
                const daily = dados.daily || {}

                setTemperaturaAtual(formatarNumeroClima(current.temperature_2m))
                setCodigoClimaAtual(formatarNumeroClima(current.weather_code))
                setSensacaoTermicaAtual(
                    formatarNumeroClima(current.apparent_temperature)
                )
                setUmidadeAtual(formatarNumeroClima(current.relative_humidity_2m))
                setVentoAtual(formatarNumeroClima(current.wind_speed_10m))
                setTemperaturaMaximaHoje(
                    formatarNumeroClima(daily.temperature_2m_max?.[0])
                )
                setTemperaturaMinimaHoje(
                    formatarNumeroClima(daily.temperature_2m_min?.[0])
                )
                setPrevisaoProximosDias(
                    [1, 2, 3]
                        .map((indice) => {
                            const data = daily.time?.[indice]
                            const codigoClima = formatarNumeroClima(
                                daily.weather_code?.[indice]
                            )
                            const maxima = formatarNumeroClima(
                                daily.temperature_2m_max?.[indice]
                            )
                            const minima = formatarNumeroClima(
                                daily.temperature_2m_min?.[indice]
                            )

                            if (
                                !data ||
                                codigoClima === null ||
                                maxima === null ||
                                minima === null
                            ) {
                                return null
                            }

                            return {
                                data,
                                codigoClima,
                                maxima,
                                minima
                            }
                        })
                        .filter((dia): dia is ClimaPainel["previsaoProximosDias"][number] =>
                            dia !== null
                        )
                )
            } catch {
                setErroClima(true)
                setPrevisaoProximosDias([])
            }
        }

        buscarClima()

        const intervalo = setInterval(buscarClima, 30 * 60 * 1000)

        return () => clearInterval(intervalo)
    }, [
        config.latitudeClimaPainel,
        config.longitudeClimaPainel,
        config.timezoneClimaPainel
    ])

    return {
        temperaturaAtual,
        codigoClimaAtual,
        sensacaoTermicaAtual,
        umidadeAtual,
        ventoAtual,
        temperaturaMaximaHoje,
        temperaturaMinimaHoje,
        previsaoProximosDias,
        erroClima,
        cidade: config.cidadeClimaPainel,
        icone: obterIconeClima,
        descricao: obterDescricaoClima
    }
}
