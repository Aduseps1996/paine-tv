import type { ConfiguracoesPainel, Midia } from "@/types/painel"

export type PrevisaoDia = {
    data: string
    codigoClima: number
    maxima: number
    minima: number
}

export type ClimaPainel = {
    temperaturaAtual: number | null
    codigoClimaAtual: number | null
    sensacaoTermicaAtual: number | null
    umidadeAtual: number | null
    ventoAtual: number | null
    temperaturaMaximaHoje: number | null
    temperaturaMinimaHoje: number | null
    previsaoProximosDias: PrevisaoDia[]
    erroClima: boolean
    cidade: string
    icone: (codigo: number | null) => string
    descricao: (codigo: number | null) => string
}

export type ConfiguracoesBanner = ConfiguracoesPainel & {
    mostrarLogoFaixaPainel: boolean
    mostrarTemperaturaPainel: boolean
    mostrarDescricaoClimaPainel: boolean
    mostrarCidadePainel: boolean
    mostrarDataPainel: boolean
    mostrarHoraPainel: boolean
    cidadeClimaPainel: string
    latitudeClimaPainel: number
    longitudeClimaPainel: number
    timezoneClimaPainel: string
}

export type BannerTemplateProps = {
    midiaAtual: Midia
    fallback: string
    chaveMidiaAtual: string
    possuiRotacao: boolean
    onErroMidia: (midia: Midia) => void
    onErroImagem: (imagem: HTMLImageElement) => void
    onErroVideo: (video: HTMLVideoElement) => void
    onVideoEnded: (video: HTMLVideoElement) => void
}

export function normalizarConfiguracoesBanner(
    configuracoes?: ConfiguracoesPainel
): ConfiguracoesBanner {
    return {
        ...(configuracoes || {}),
        logo: configuracoes?.logo || "",
        mostrarLogoFaixaPainel: configuracoes?.mostrarLogoFaixaPainel ?? false,
        mostrarTemperaturaPainel: configuracoes?.mostrarTemperaturaPainel ?? true,
        mostrarDescricaoClimaPainel:
            configuracoes?.mostrarDescricaoClimaPainel ?? true,
        mostrarCidadePainel: configuracoes?.mostrarCidadePainel ?? true,
        mostrarDataPainel: configuracoes?.mostrarDataPainel ?? true,
        mostrarHoraPainel: configuracoes?.mostrarHoraPainel ?? true,
        cidadeClimaPainel: configuracoes?.cidadeClimaPainel || "Recife",
        latitudeClimaPainel: Number(configuracoes?.latitudeClimaPainel ?? -8.05),
        longitudeClimaPainel: Number(configuracoes?.longitudeClimaPainel ?? -34.9),
        timezoneClimaPainel:
            configuracoes?.timezoneClimaPainel || "America/Recife"
    }
}

export function formatarNumeroClima(valor: unknown) {
    const numero = Number(valor)

    if (!Number.isFinite(numero)) return null

    return Math.round(numero)
}

export function obterChaveMidia(midia: Midia) {
    return `${midia.id || "sem-id"}-${midia.arquivo || ""}-${midia.linkYoutubeExibicao || ""}`
}

export function obterAssinaturaMidia(midia: Midia) {
    return [
        obterChaveMidia(midia),
        midia.ativo,
        midia.ordem,
        midia.tipo,
        midia.tipoExibicaoProgramada,
        midia.duracao,
        midia.pesoExibicao,
        midia.exibicaoProgramada,
        midia.inicioExibicao,
        midia.fimExibicao
    ].join(":")
}

export function midiaEhYoutube(midia?: Midia | null) {
    return (
        midia?.tipo === "youtube" ||
        midia?.tipoExibicaoProgramada === "youtube"
    )
}

export function formatarDiaCurto(data: string) {
    const [ano, mes, dia] = data.split("-").map(Number)
    const dataLocal = new Date(ano, mes - 1, dia, 12, 0, 0)

    return dataLocal
        .toLocaleDateString("pt-BR", { weekday: "short" })
        .replace(".", "")
        .toUpperCase()
}

export function obterIconeClima(codigo: number | null) {
    if (codigo === null) return "☁"

    if (codigo === 0) return "☀"
    if ([1, 2, 3].includes(codigo)) return "☁"
    if ([45, 48].includes(codigo)) return "≋"
    if ([51, 53, 55, 56, 57].includes(codigo)) return "☂"
    if ([61, 63, 65, 66, 67, 80, 81, 82].includes(codigo)) return "☔"
    if ([95, 96, 99].includes(codigo)) return "⚡"

    return "☁"
}

export function obterDescricaoClima(codigo: number | null) {
    if (codigo === null) return "Tempo estavel"

    if (codigo === 0) return "Ensolarado"
    if ([1, 2, 3].includes(codigo)) return "Parcialmente nublado"
    if ([45, 48].includes(codigo)) return "Neblina"
    if ([51, 53, 55, 56, 57].includes(codigo)) return "Garoa"
    if ([61, 63, 65, 66, 67].includes(codigo)) return "Chuva"
    if ([80, 81, 82].includes(codigo)) return "Pancadas de chuva"
    if ([95, 96, 99].includes(codigo)) return "Tempestade"

    return "Tempo estavel"
}

export function montarListaInteligente(lista: Midia[]) {
    const fila = lista.map((midia) => ({
        midia,
        peso: Math.max(1, Number(midia.pesoExibicao || 1)),
        usados: 0
    }))

    const total = fila.reduce((soma, item) => soma + item.peso, 0)
    const resultado: Midia[] = []

    while (resultado.length < total) {
        const ultimoId = resultado[resultado.length - 1]?.id

        const candidatos = fila
            .filter((item) => item.usados < item.peso)
            .filter((item) => item.midia.id !== ultimoId)
            .sort((a, b) => {
                const restanteA = a.peso - a.usados
                const restanteB = b.peso - b.usados

                return restanteB - restanteA
            })

        const escolhido =
            candidatos[0] ||
            fila.find((item) => item.usados < item.peso)

        if (!escolhido) break

        resultado.push(escolhido.midia)
        escolhido.usados++
    }

    return resultado
}
