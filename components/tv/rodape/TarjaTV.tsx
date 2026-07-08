"use client"

import { useTarjaPainel } from "@/hooks/tv/useTarjaPainel"
import { Compacta, Digital, Infobar, Live, Telejornal } from "@/components/tv/rodape/tarjas"
import type { Midia, ModeloTarja } from "@/types/painel"

type TarjaTVProps = {
    logo: string
    slogan: string
    data: string
    hora: string
    midiaAtual?: Midia | null
    mostrarTarja: boolean
    modeloTarja: ModeloTarja
    tamanhoFonteSlogan: number
    tamanhoFonteHora: number
    tamanhoLogoRodape: number
    tempoEntradaTarja: number
    tempoVisivelTarja: number
    tempoSaidaTarja: number
    tempoOcultaTarja: number
    tempoInicialTarja: number
    temperaturaAtual: number | null
    codigoClimaAtual: number | null
    erroClima: boolean
    midiaId?: string
}

export default function TarjaTV({
    logo,
    slogan,
    data,
    hora,
    midiaAtual,
    mostrarTarja,
    modeloTarja,
    tamanhoFonteSlogan,
    tamanhoFonteHora,
    tamanhoLogoRodape,
    tempoEntradaTarja,
    tempoVisivelTarja,
    tempoSaidaTarja,
    tempoOcultaTarja,
    tempoInicialTarja,
    temperaturaAtual,
    codigoClimaAtual,
    erroClima,
    midiaId
}: TarjaTVProps) {
    const { faseTarja, mostrarQrTelejornal } = useTarjaPainel({
        mostrarTarja,
        modeloTarja,
        tempoEntradaTarja,
        tempoVisivelTarja,
        tempoSaidaTarja,
        tempoOcultaTarja,
        tempoInicialTarja,
        midiaId
    })

    const etiquetaTarjaFinal = midiaAtual?.tarjaEtiqueta || "ADUSEPS INFORMA"
    const tituloTarjaFinal = midiaAtual?.tarjaTitulo || slogan || "Informação e compromisso com o associado"
    const subtituloTarjaFinal = midiaAtual?.tarjaSubtitulo || data

    if (!mostrarTarja || !modeloTarja) {
        return null
    }

    const propsComuns = {
        tituloTarja: tituloTarjaFinal,
        subtituloTarja: subtituloTarjaFinal,
        etiquetaTarja: etiquetaTarjaFinal,
        hora,
        temperaturaAtual,
        codigoClimaAtual,
        erroClima,
        tamanhoFonteSlogan,
        tamanhoFonteHora,
        faseTarja,
        tempoEntradaTarja,
        tempoSaidaTarja
    }

    return (
        <div className="absolute left-0 right-0 z-30 pointer-events-none" style={{ bottom: "95px" }}>
            {modeloTarja === "telejornal" && (
                <Telejornal
                    {...propsComuns}
                    logo={logo}
                    tamanhoLogoRodape={tamanhoLogoRodape}
                    mostrarQrTelejornal={mostrarQrTelejornal}
                    qrcode={midiaAtual?.qrcode}
                    slogan={slogan}
                />
            )}

            {modeloTarja === "compacta" && <Compacta {...propsComuns} />}
            {modeloTarja === "live" && <Live {...propsComuns} />}
            {modeloTarja === "infobar" && <Infobar {...propsComuns} />}
            {modeloTarja === "digital" && (
                <Digital
                    {...propsComuns}
                    logo={logo}
                    qrcode={midiaAtual?.qrcode}
                />
            )}
        </div>
    )
}
