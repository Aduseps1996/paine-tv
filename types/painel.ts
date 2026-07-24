export type TipoMidia = "imagem" | "video" | "youtube" | "dinamica"

export type TemplateMidia =
    | "cheio"
    | "institucional"
    | "painel"
    | "escala-juridica"
    | "social"
    | "plantao-juridico"
    | "contatos-oficiais"


export type ModoExibicaoMidia = "cover" | "contain"

export type TipoExibicaoProgramada = "midia" | "youtube"

export type ModoProgramacaoMidia = "periodo" | "uma_vez" | "intervalo"

export type ModeloTarja =
    | "telejornal"
    | "compacta"
    | "live"
    | "infobar"
    | "digital"

export type DadosPlantao = {
    titulo: string
    chamadaPadrao: string
    descricaoPadrao: string
    contatoId?: string
    whatsapp?: string
    rodape: string
    avisoEspecialAtivo?: boolean
    ocasiaoEspecial?: string
    chamadaEspecial?: string
    descricaoEspecial?: string
    inicioAvisoEspecial?: string
    fimAvisoEspecial?: string
}

export type TipoContatoPainel = "telefone" | "whatsapp" | "site"

export type ContatoPainel = {
    id: string
    titulo: string
    tipo: TipoContatoPainel
    valores: string[]
    observacao?: string
    ativo: boolean
    mostrarNoBanner: boolean
    ordem: number
}

export type DadosContatosOficiais = {
    titulo: string
    subtitulo: string
    rodape: string
}

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
    modoProgramacao?: ModoProgramacaoMidia
    intervaloExibicaoMinutos?: number
    prioridadeProgramacao?: number
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
    plantao?: DadosPlantao
    contatosOficiais?: DadosContatosOficiais

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

export type AvisoUrgente = {
    id: string
    ativo: boolean
    titulo: string
    mensagem: string
    categoria?: "normal" | "urgente" | "atencao"
    inicioExibicao?: string
    fimExibicao?: string
}

export type ModoLogo = "transparente" | "fundo" | "card"

export type TamanhoLogoPainel = "pequeno" | "medio" | "grande"

export type AbaAdmin =
    | "inicio"
    | "midias"
    | "noticias"
    | "contatos"
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
    contatos?: ContatoPainel[]
}
