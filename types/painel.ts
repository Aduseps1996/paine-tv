export type TipoMidia = "imagem" | "video" | "youtube"

export type TemplateMidia =
    | "cheio"
    | "institucional"
    | "painel"
    | "escala-juridica"
    | "social"


export type ModoExibicaoMidia = "cover" | "contain"

export type TipoExibicaoProgramada = "midia" | "youtube"

export type ModeloTarja =
    | "telejornal"
    | "compacta"
    | "live"
    | "infobar"
    | "digital"

export type Midia = {
    id: string
    tipo: TipoMidia
    arquivo: string
    ativo: boolean
    ordem: number
    duracao: number
    pesoExibicao?: number
    template?: TemplateMidia
    modoExibicao?: ModoExibicaoMidia
    titulo?: string
    subtitulo?: string
    rodape?: string
    qrcode?: string
    categoria?: string
    cta?: string
    exibicaoProgramada?: boolean
    tipoExibicaoProgramada?: TipoExibicaoProgramada
    inicioExibicao?: string
    fimExibicao?: string
    linkYoutubeExibicao?: string
    mostrarTarja?: boolean
    tarjaEtiqueta?: string
    tarjaTitulo?: string
    tarjaSubtitulo?: string
    tempoEntradaTarja?: number
    tempoVisivelTarja?: number
    tempoSaidaTarja?: number
    tempoOcultaTarja?: number
    tempoInicialTarja?: number
    modeloTarja?: ModeloTarja
    thumbnailUrl?: string
    thumbnailStoragePath?: string
    duracaoVideo?: number
    larguraVideo?: number
    alturaVideo?: number
    orientacaoVideo?: "vertical" | "horizontal" | "quadrado"

    // Controle do arquivo
    versao?: number
    atualizadoEm?: string
    tamanhoBytes?: number
    mimeType?: string
    storagePath?: string
    hashArquivo?: string
}

export type NovaMidia = Omit<Midia, "id">

export type CategoriaNoticia =
    | "normal"
    | "live"
    | "urgente"
    | "institucional"

export type Noticia = {
    id: string
    texto: string
    ativo: boolean
    ordem: number
    programada?: boolean
    inicioExibicao?: string
    fimExibicao?: string
    categoria?: CategoriaNoticia
}

export type NovaNoticia = Omit<Noticia, "id">

export type ModoLogo = "transparente" | "fundo" | "card"

export type TamanhoLogoPainel = "pequeno" | "medio" | "grande"

export type AbaAdmin =
    | "inicio"
    | "midias"
    | "noticias"
    | "configuracao-painel"
    | "configuracao-tipografia"

export type StatusVisual = {
    texto: string
    classe: string
}

export type ConfiguracoesPainel = {
    nomePainel?: string
    subtitulo?: string
    logo?: string
    slogan?: string
    modoLogo?: ModoLogo
    tamanhoLogoPainel?: TamanhoLogoPainel
    fallback?: string
    mostrarTarjaTv?: boolean
    mostrarLogoFaixaPainel?: boolean
    mostrarRodapeNoticias?: boolean
    mostrarTemperaturaPainel?: boolean
    mostrarDescricaoClimaPainel?: boolean
    mostrarCidadePainel?: boolean
    mostrarDataPainel?: boolean
    mostrarHoraPainel?: boolean
    mostrarEscalaJuridicaTv?: boolean
    duracaoEscalaJuridicaTv?: number
    cidadeClimaPainel?: string
    latitudeClimaPainel?: number
    longitudeClimaPainel?: number
    timezoneClimaPainel?: string
    tempoEntradaTarja?: number
    tempoVisivelTarja?: number
    tempoSaidaTarja?: number
    tempoOcultaTarja?: number
    tamanhoFonteRodape?: number
    tamanhoFonteSlogan?: number
    tamanhoFonteDataHora?: number
    tamanhoFonteHora?: number
    tamanhoIconeRodape?: number
    alturaBarraSuperior?: number
    alturaBarraNoticias?: number
    tamanhoLogoRodape?: number
    duracaoAnimacaoNoticias?: number
}