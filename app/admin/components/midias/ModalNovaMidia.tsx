import { useState } from "react"

import type {
    Midia,
    ModeloTarja,
    ModoExibicaoMidia,
    TemplateMidia,
    TipoMidia
} from "@/types/painel"
import { gerarMetadadosVideo } from "@/utils/videoMidia"
import { uploadMidiaParaStorage } from "@/utils/uploadMidia"
import { CONTATO_PLANTAO_ID } from "@/utils/contatosPainel"

type Props = {
    midias: Midia[]
    atualizarMidiasDraft: (midias: Midia[]) => void
    onFechar: () => void
}

export default function ModalNovaMidia({
    midias,
    atualizarMidiasDraft,
    onFechar
}: Props) {
    const [arquivo, setArquivo] = useState("")
    const [tipo, setTipo] = useState<TipoMidia>("imagem")
    const [template, setTemplate] = useState<TemplateMidia>("cheio")
    const [modoExibicao, setModoExibicao] = useState<ModoExibicaoMidia>("cover")
    const [arquivoLocalNome, setArquivoLocalNome] = useState("")
    const [arquivoLocalTamanho, setArquivoLocalTamanho] = useState<number | null>(null)
    const [uploadProgresso, setUploadProgresso] = useState(0)
    const [enviandoUpload, setEnviandoUpload] = useState(false)
    const [uploadConcluido, setUploadConcluido] = useState(false)
    const [storagePath, setStoragePath] = useState("")
    const [mimeType, setMimeType] = useState("")
    const [tamanhoBytes, setTamanhoBytes] = useState<number | null>(null)
    const [tamanhoOriginalBytes, setTamanhoOriginalBytes] = useState<number | null>(null)
    const [tamanhoOtimizadoBytes, setTamanhoOtimizadoBytes] = useState<number | null>(null)
    const [foiOtimizado, setFoiOtimizado] = useState(false)

    const [thumbnailUrl, setThumbnailUrl] = useState("")
    const [thumbnailStoragePath, setThumbnailStoragePath] = useState("")
    const [duracaoVideo, setDuracaoVideo] = useState<number | undefined>()
    const [larguraVideo, setLarguraVideo] = useState<number | undefined>()
    const [alturaVideo, setAlturaVideo] = useState<number | undefined>()
    const [orientacaoVideo, setOrientacaoVideo] = useState<"vertical" | "horizontal" | "quadrado" | undefined>()

    const [titulo, setTitulo] = useState("")
    const [subtitulo, setSubtitulo] = useState("")
    const [rodape, setRodape] = useState("")
    const [categoria, setCategoria] = useState("")
    const [cta, setCta] = useState("")
    const [qrcode, setQrcode] = useState("")

    const [programarExibicao, setProgramarExibicao] = useState(false)
    const [inicioExibicao, setInicioExibicao] = useState("")
    const [fimExibicao, setFimExibicao] = useState("")

    const [mostrarTarja, setMostrarTarja] = useState(false)
    const [modeloTarja, setModeloTarja] = useState<ModeloTarja>("telejornal")
    const [tarjaEtiqueta, setTarjaEtiqueta] = useState("")
    const [tarjaTitulo, setTarjaTitulo] = useState("")
    const [tarjaSubtitulo, setTarjaSubtitulo] = useState("")
    const [tarjaQrcode, setTarjaQrcode] = useState("")

    const [tempoEntradaTarja, setTempoEntradaTarja] = useState(1)
    const [tempoVisivelTarja, setTempoVisivelTarja] = useState(8)
    const [tempoSaidaTarja, setTempoSaidaTarja] = useState(1)
    const [tempoOcultaTarja, setTempoOcultaTarja] = useState(10)
    const [tempoInicialTarja, setTempoInicialTarja] = useState(0)

    const [tituloPlantao, setTituloPlantao] = useState("Plantão Judicial")
    const [chamadaPadraoPlantao, setChamadaPadraoPlantao] =
        useState("Urgências não esperam até segunda-feira.")
    const [descricaoPadraoPlantao, setDescricaoPadraoPlantao] = useState(
        "Atuação em situações urgentes relacionadas ao direito à saúde durante finais de semana e feriados."
    )
    const [rodapePlantao, setRodapePlantao] = useState(
        "Nosso compromisso é com a justiça social e a defesa da dignidade humana."
    )
    const [avisoEspecialAtivo, setAvisoEspecialAtivo] = useState(false)
    const [ocasiaoEspecial, setOcasiaoEspecial] = useState("")
    const [chamadaEspecial, setChamadaEspecial] = useState("")
    const [descricaoEspecial, setDescricaoEspecial] = useState("")
    const [inicioAvisoEspecial, setInicioAvisoEspecial] = useState("")
    const [fimAvisoEspecial, setFimAvisoEspecial] = useState("")

    const [tituloContatos, setTituloContatos] =
        useState("Fale com a ADUSEPS")
    const [subtituloContatos, setSubtituloContatos] = useState(
        "Nossos canais oficiais estão à disposição dos associados."
    )
    const [rodapeContatos, setRodapeContatos] = useState(
        "Salve os contatos oficiais e fale diretamente com o setor que você precisa."
    )

    const ehYoutube = tipo === "youtube"
    const ehPlantao =
        tipo === "dinamica" &&
        template === "plantao-juridico"
    const ehContatos =
        tipo === "dinamica" &&
        template === "contatos-oficiais"
    const ehDinamica = ehPlantao || ehContatos

    const usaEtiqueta =
        modeloTarja === "telejornal" ||
        modeloTarja === "compacta" ||
        modeloTarja === "live"

    const usaSubtitulo =
        modeloTarja === "telejornal" ||
        modeloTarja === "digital"

    const usaQrcode =
        modeloTarja === "telejornal" ||
        modeloTarja === "live" ||
        modeloTarja === "digital"

    function formatarMB(bytes: number | null) {
        if (bytes === null) return "--"
        return `${(bytes / 1024 / 1024).toFixed(2)} MB`
    }

    async function selecionarArquivoLocal(file: File | null) {
        if (!file) return

        if (tipo === "youtube" || tipo === "dinamica") {
            alert("Upload local não é usado para YouTube/Live.")
            return
        }

        try {
            setEnviandoUpload(true)
            setUploadConcluido(false)
            setUploadProgresso(0)
            setTamanhoOriginalBytes(null)
            setTamanhoOtimizadoBytes(null)
            setFoiOtimizado(false)
            setArquivoLocalNome(file.name)
            setArquivoLocalTamanho(file.size)

            if (tipo === "video" && file.size > 30 * 1024 * 1024) {
                const continuar = confirm(
                    "Este vídeo está acima de 30 MB. Ele ainda pode ser enviado se tiver até 80 MB, mas pode consumir mais internet na TV. Deseja continuar?"
                )

                if (!continuar) {
                    setEnviandoUpload(false)
                    return
                }
            }

            const resultado = await uploadMidiaParaStorage(file, tipo, setUploadProgresso)

            setArquivo(resultado.url)
            setStoragePath(resultado.storagePath)
            setMimeType(resultado.mimeType)
            setTamanhoBytes(resultado.tamanhoBytes)
            setTamanhoOriginalBytes(resultado.tamanhoOriginalBytes)
            setTamanhoOtimizadoBytes(resultado.tamanhoOtimizadoBytes)
            setFoiOtimizado(resultado.foiOtimizado)
            setUploadConcluido(true)

            if (tipo === "video") {
                const metadados = await gerarMetadadosVideo(file)

                const thumb = await uploadMidiaParaStorage(
                    metadados.thumbnailFile,
                    "imagem"
                )

                setThumbnailUrl(thumb.url)
                setThumbnailStoragePath(thumb.storagePath)
                setDuracaoVideo(metadados.duracaoVideo)
                setLarguraVideo(metadados.larguraVideo)
                setAlturaVideo(metadados.alturaVideo)
                setOrientacaoVideo(metadados.orientacaoVideo)
            }
        } catch (erro) {
            console.error(erro)
            alert(erro instanceof Error ? erro.message : "Erro ao enviar arquivo.")
        } finally {
            setEnviandoUpload(false)
        }
    }

    function salvarNoRascunho() {
        if (
            ehPlantao &&
            midias.some((midia) => midia.template === "plantao-juridico")
        ) {
            alert(
                "O Plantão Judicial já está cadastrado. Use o botão Editar conteúdo no card existente."
            )
            return
        }

        if (
            ehContatos &&
            midias.some((midia) => midia.template === "contatos-oficiais")
        ) {
            alert(
                "O banner de Contatos Oficiais já está cadastrado. Edite o card existente."
            )
            return
        }

        if (!ehDinamica && !arquivo.trim()) {
            alert("Informe o arquivo/link da mídia.")
            return
        }

        if (
            ehPlantao &&
            (
                !tituloPlantao.trim() ||
                !chamadaPadraoPlantao.trim() ||
                !descricaoPadraoPlantao.trim()
            )
        ) {
            alert("Preencha os campos principais do Plantão Judicial.")
            return
        }

        if (
            ehContatos &&
            (
                !tituloContatos.trim() ||
                !subtituloContatos.trim() ||
                !rodapeContatos.trim()
            )
        ) {
            alert("Preencha os textos do banner de Contatos Oficiais.")
            return
        }

        if (ehPlantao && avisoEspecialAtivo) {
            if (
                !ocasiaoEspecial.trim() ||
                !chamadaEspecial.trim() ||
                !descricaoEspecial.trim() ||
                !inicioAvisoEspecial ||
                !fimAvisoEspecial
            ) {
                alert("Preencha todo o aviso especial e o período de exibição.")
                return
            }

            if (new Date(fimAvisoEspecial) <= new Date(inicioAvisoEspecial)) {
                alert("O fim do aviso especial precisa ser maior que o início.")
                return
            }
        }

        if (ehYoutube && (!inicioExibicao || !fimExibicao)) {
            alert("YouTube/Live precisa de início e fim de exibição.")
            return
        }

        const novaMidia: Midia = {
            id: `draft-${Date.now()}`,
            tipo,
            arquivo: ehDinamica ? "" : arquivo.trim(),
            storagePath: storagePath || "",
            mimeType: mimeType || "",
            ...(tamanhoBytes !== null ? { tamanhoBytes } : {}),
            versao: 1,
            atualizadoEm: new Date().toISOString(),
            ativo: true,
            ordem: midias.length + 1,
            duracao: 8,
            pesoExibicao: 1,
            template: ehYoutube ? "cheio" : template,
            modoExibicao,
            titulo: ehPlantao
                ? tituloPlantao.trim()
                : ehContatos
                    ? tituloContatos.trim()
                    : titulo.trim(),
            subtitulo: subtitulo.trim(),
            rodape: rodape.trim(),
            categoria: categoria.trim(),
            cta:
                template === "institucional" || template === "social"
                    ? cta.trim()
                    : "",
            qrcode:
                template === "institucional" || template === "social"
                    ? qrcode.trim()
                    : tarjaQrcode.trim(),
            exibicaoProgramada: ehYoutube ? true : programarExibicao,
            tipoExibicaoProgramada: ehYoutube ? "youtube" : "midia",
            inicioExibicao,
            fimExibicao,
            linkYoutubeExibicao: ehYoutube ? arquivo.trim() : "",
            mostrarTarja,
            modeloTarja,
            tarjaEtiqueta: tarjaEtiqueta.trim(),
            tarjaTitulo: tarjaTitulo.trim(),
            tarjaSubtitulo: tarjaSubtitulo.trim(),
            tempoEntradaTarja,
            tempoVisivelTarja,
            tempoSaidaTarja,
            tempoOcultaTarja,
            tempoInicialTarja,
            thumbnailUrl,
            thumbnailStoragePath,
            duracaoVideo,
            larguraVideo,
            alturaVideo,
            orientacaoVideo,
            plantao: ehPlantao
                ? {
                    titulo: tituloPlantao.trim(),
                    chamadaPadrao: chamadaPadraoPlantao.trim(),
                    descricaoPadrao: descricaoPadraoPlantao.trim(),
                    contatoId: CONTATO_PLANTAO_ID,
                    rodape: rodapePlantao.trim(),
                    avisoEspecialAtivo,
                    ocasiaoEspecial: ocasiaoEspecial.trim(),
                    chamadaEspecial: chamadaEspecial.trim(),
                    descricaoEspecial: descricaoEspecial.trim(),
                    inicioAvisoEspecial,
                    fimAvisoEspecial
                }
                : undefined,
            contatosOficiais: ehContatos
                ? {
                    titulo: tituloContatos.trim(),
                    subtitulo: subtituloContatos.trim(),
                    rodape: rodapeContatos.trim()
                }
                : undefined
        }

        atualizarMidiasDraft([...midias, novaMidia])
        onFechar()
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
            <div className="max-h-[92vh] w-full max-w-5xl overflow-y-auto rounded-[34px] border border-white/10 bg-zinc-950 p-6 shadow-2xl sm:p-8">
                <div className="mb-7 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div>
                        <div className="inline-flex rounded-full border border-sky-400/25 bg-sky-500/10 px-3 py-1 text-[11px] font-black uppercase tracking-[0.32em] text-sky-300">
                            Nova mídia
                        </div>

                        <h2 className="mt-4 text-3xl font-black tracking-tight sm:text-4xl">
                            Salvar mídia no rascunho
                        </h2>

                        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-zinc-400 sm:text-base">
                            Configure o conteúdo conforme o tipo e o template. A TV só será alterada depois da publicação.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={onFechar}
                        className="w-fit rounded-2xl border border-zinc-700 bg-zinc-900/80 px-5 py-3 text-sm font-bold text-zinc-200"
                    >
                        Fechar
                    </button>
                </div>

                <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
                    <div className="space-y-5">
                        <section className="rounded-[26px] border border-white/10 bg-white/[0.03] p-5">
                            <h3 className="text-xl font-black">Geral</h3>

                            <p className="mt-2 text-sm text-zinc-400">
                                Informe o arquivo, o tipo e o template da mídia.
                            </p>

                            <div className="mt-5 grid gap-4 sm:grid-cols-2">
                                {!ehYoutube && !ehDinamica && (
                                    <div className="sm:col-span-2 rounded-2xl border border-white/10 bg-zinc-950/60 p-4">
                                        <p className="text-sm font-black text-white">
                                            Arquivo local
                                        </p>

                                        <p className="mt-1 text-xs text-zinc-400">
                                            Envie imagem ou vídeo direto para o Firebase Storage.
                                        </p>

                                        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
                                            <label className="w-fit cursor-pointer rounded-xl border border-sky-400/30 bg-sky-500/15 px-4 py-3 text-sm font-black text-sky-200 transition hover:bg-sky-500/25">
                                                Selecionar arquivo
                                                <input
                                                    type="file"
                                                    accept={tipo === "video" ? "video/mp4" : "image/jpeg,image/png,image/webp"}
                                                    className="hidden"
                                                    disabled={enviandoUpload}
                                                    onChange={(e) => selecionarArquivoLocal(e.target.files?.[0] || null)}
                                                />
                                            </label>

                                            {arquivoLocalNome && (
                                                <div className="min-w-0 text-sm">
                                                    <p className="truncate font-bold text-white">
                                                        {arquivoLocalNome}
                                                    </p>

                                                    {arquivoLocalTamanho !== null && (
                                                        <p className="text-xs text-zinc-400">
                                                            {formatarMB(arquivoLocalTamanho)}
                                                        </p>
                                                    )}
                                                </div>
                                            )}
                                        </div>

                                        {tipo === "video" && arquivoLocalTamanho !== null && (
                                            <div className="mt-3 rounded-xl border border-amber-400/25 bg-amber-500/10 p-3 text-xs text-amber-100">
                                                <p className="font-black uppercase tracking-[0.16em]">
                                                    Atenção ao tamanho do vídeo
                                                </p>

                                                <p className="mt-2">
                                                    Vídeo selecionado: {formatarMB(arquivoLocalTamanho)}
                                                </p>

                                                <p>
                                                    Recomendado: até 30 MB
                                                </p>

                                                <p>
                                                    Limite máximo: 80 MB
                                                </p>
                                            </div>
                                        )}

                                        {tipo === "video" && duracaoVideo && larguraVideo && alturaVideo && (
                                            <div className="mt-3 rounded-xl border border-sky-400/20 bg-sky-500/10 p-3 text-xs text-sky-100">
                                                <p className="font-black uppercase tracking-[0.16em]">
                                                    Informações do vídeo
                                                </p>

                                                <p className="mt-2">
                                                    Duração: {Math.floor(duracaoVideo / 60)}:{String(Math.round(duracaoVideo % 60)).padStart(2, "0")}
                                                </p>

                                                <p>
                                                    Resolução: {larguraVideo} × {alturaVideo}
                                                </p>

                                                <p>
                                                    Orientação: {orientacaoVideo}
                                                </p>

                                                {thumbnailUrl && (
                                                    <img
                                                        src={thumbnailUrl}
                                                        alt="Thumbnail do vídeo"
                                                        className="mt-3 aspect-video w-full rounded-lg object-cover"
                                                    />
                                                )}
                                            </div>
                                        )}

                                        {(enviandoUpload || uploadConcluido) && (
                                            <div className="mt-4">
                                                <div className="h-2 overflow-hidden rounded-full bg-white/10">
                                                    <div
                                                        className="h-full rounded-full bg-sky-400 transition-all"
                                                        style={{ width: `${uploadProgresso}%` }}
                                                    />
                                                </div>

                                                <p className="mt-2 text-xs font-bold text-zinc-300">
                                                    {uploadConcluido
                                                        ? "Upload concluído."
                                                        : `Enviando... ${uploadProgresso}%`}
                                                </p>

                                                {uploadConcluido && tamanhoOriginalBytes !== null && tamanhoOtimizadoBytes !== null && (
                                                    <div className="mt-3 rounded-xl border border-emerald-400/20 bg-emerald-500/10 p-3 text-xs text-emerald-100">
                                                        <p className="font-black uppercase tracking-[0.16em]">
                                                            Otimização
                                                        </p>

                                                        <p className="mt-2">
                                                            Original: {(tamanhoOriginalBytes / 1024 / 1024).toFixed(2)} MB
                                                        </p>

                                                        <p>
                                                            Final: {(tamanhoOtimizadoBytes / 1024 / 1024).toFixed(2)} MB
                                                        </p>

                                                        <p className="mt-1 font-bold">
                                                            {foiOtimizado
                                                                ? `Economia: ${Math.max(
                                                                    0,
                                                                    Math.round(
                                                                        100 - (tamanhoOtimizadoBytes / tamanhoOriginalBytes) * 100
                                                                    )
                                                                )}%`
                                                                : "Arquivo mantido no tamanho original."}
                                                        </p>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                )}

                                {!ehDinamica && (
                                    <input
                                        type="text"
                                        placeholder={ehYoutube ? "Link do YouTube / Live" : "URL externa ou arquivo enviado automaticamente"}
                                        value={arquivo}
                                        onChange={(e) => setArquivo(e.target.value)}
                                        className="sm:col-span-2"
                                    />
                                )}

                                <select
                                    value={tipo}
                                    onChange={(e) => {
                                        const novoTipo = e.target.value as TipoMidia
                                        setTipo(novoTipo)

                                        if (novoTipo === "youtube") {
                                            setTemplate("cheio")
                                            setProgramarExibicao(true)
                                        }

                                        if (novoTipo === "dinamica") {
                                            setTemplate("plantao-juridico")
                                            setArquivo("")
                                            setMostrarTarja(false)
                                        }

                                        if (
                                            novoTipo !== "dinamica" &&
                                            (
                                                template === "plantao-juridico" ||
                                                template === "contatos-oficiais"
                                            )
                                        ) {
                                            setTemplate("cheio")
                                        }
                                    }}
                                >
                                    <option value="imagem">Imagem</option>
                                    <option value="video">Vídeo</option>
                                    <option value="youtube">YouTube / Live</option>
                                    <option value="dinamica">Conteúdo dinâmico</option>
                                </select>

                                {!ehYoutube && tipo !== "dinamica" && (
                                    <select
                                        value={template}
                                        onChange={(e) => setTemplate(e.target.value as TemplateMidia)}
                                    >
                                        <option value="cheio">Banner Cheio</option>
                                        <option value="institucional">Institucional</option>
                                        <option value="painel">Painel Informativo</option>
                                        <option value="social">Redes Sociais</option>
                                    </select>
                                )}

                                {tipo === "dinamica" && (
                                    <select
                                        value={template}
                                        onChange={(e) => setTemplate(e.target.value as TemplateMidia)}
                                    >
                                        <option value="plantao-juridico">Plantão Judicial</option>
                                        <option value="contatos-oficiais">Contatos Oficiais</option>
                                    </select>
                                )}
                            </div>
                        </section>

                        {!ehYoutube && template === "cheio" && (
                            <section className="rounded-[26px] border border-white/10 bg-white/[0.03] p-5">
                                <h3 className="text-xl font-black">Banner Cheio</h3>

                                <p className="mt-2 text-sm text-zinc-400">
                                    Exibe imagem ou vídeo em tela cheia. Ideal para artes prontas em 16:9.
                                </p>

                                <div className="mt-5">
                                    <label className="mb-2 block text-sm font-bold text-zinc-300">
                                        Modo de exibição
                                    </label>

                                    <select
                                        value={modoExibicao}
                                        onChange={(e) =>
                                            setModoExibicao(e.target.value as ModoExibicaoMidia)
                                        }
                                    >
                                        <option value="cover">Preencher tela</option>
                                        <option value="contain">Mostrar inteira</option>
                                    </select>
                                </div>
                            </section>
                        )}

                        {!ehYoutube && template === "institucional" && (
                            <section className="rounded-[26px] border border-white/10 bg-white/[0.03] p-5">
                                <h3 className="text-xl font-black">Institucional</h3>

                                <p className="mt-2 text-sm text-zinc-400">
                                    Use este modelo para campanhas com título, CTA e QR Code.
                                </p>

                                <div className="mt-5 grid gap-4">
                                    <input value={categoria} onChange={(e) => setCategoria(e.target.value)} placeholder="Categoria. Ex: CAMPANHA" />
                                    <input value={titulo} onChange={(e) => setTitulo(e.target.value)} placeholder="Título institucional" />
                                    <textarea value={subtitulo} onChange={(e) => setSubtitulo(e.target.value)} placeholder="Subtítulo institucional" className="min-h-28 resize-none" />
                                    <input value={rodape} onChange={(e) => setRodape(e.target.value)} placeholder="Texto inferior" />
                                    <input value={cta} onChange={(e) => setCta(e.target.value)} placeholder="Chamada para ação" />
                                    <input value={qrcode} onChange={(e) => setQrcode(e.target.value)} placeholder="Link para QR Code" />
                                </div>
                            </section>
                        )}

                        {!ehYoutube && template === "painel" && (
                            <section className="rounded-[26px] border border-white/10 bg-white/[0.03] p-5">
                                <h3 className="text-xl font-black">Painel Informativo</h3>

                                <p className="mt-2 text-sm text-zinc-400">
                                    Usa mídia principal, clima lateral e faixa inferior. QR Code e CTA não aparecem neste template.
                                </p>

                                <div className="mt-5 grid gap-4">
                                    <input value={categoria} onChange={(e) => setCategoria(e.target.value)} placeholder="Categoria exibida na faixa" />
                                    <input value={titulo} onChange={(e) => setTitulo(e.target.value)} placeholder="Texto principal da faixa inferior" />
                                    <textarea value={subtitulo} onChange={(e) => setSubtitulo(e.target.value)} placeholder="Texto complementar" className="min-h-24 resize-none" />
                                    <input value={rodape} onChange={(e) => setRodape(e.target.value)} placeholder="Rodapé / chamada curta" />
                                </div>
                            </section>
                        )}

                        {!ehYoutube && template === "social" && (
                            <section className="rounded-[26px] border border-white/10 bg-white/[0.03] p-5">
                                <h3 className="text-xl font-black">
                                    Redes Sociais
                                </h3>

                                <p className="mt-2 text-sm text-zinc-400">
                                    Template ideal para Instagram, Facebook, TikTok, YouTube ou Site.
                                    Exibe QR Code, chamada para ação e mídia vertical.
                                </p>

                                <div className="mt-5 grid gap-4">
                                    <input
                                        value={categoria}
                                        onChange={(e) => setCategoria(e.target.value)}
                                        placeholder="Categoria (Ex: ACOMPANHE)"
                                    />

                                    <input
                                        value={titulo}
                                        onChange={(e) => setTitulo(e.target.value)}
                                        placeholder="Título principal"
                                    />

                                    <textarea
                                        value={subtitulo}
                                        onChange={(e) => setSubtitulo(e.target.value)}
                                        className="min-h-28 resize-none"
                                        placeholder="Descrição"
                                    />

                                    <input
                                        value={cta}
                                        onChange={(e) => setCta(e.target.value)}
                                        placeholder="Chamada para ação"
                                    />

                                    <input
                                        value={rodape}
                                        onChange={(e) => setRodape(e.target.value)}
                                        placeholder="Texto inferior"
                                    />

                                    <input
                                        value={qrcode}
                                        onChange={(e) => setQrcode(e.target.value)}
                                        placeholder="Link do QR Code"
                                    />
                                </div>
                            </section>
                        )}

                        {ehPlantao && (
                            <section className="rounded-[26px] border border-cyan-400/20 bg-cyan-500/[0.06] p-5">
                                <h3 className="text-xl font-black">
                                    Plantão Judicial
                                </h3>

                                <p className="mt-2 text-sm text-zinc-400">
                                    Este conteúdo fica salvo e pode ser ativado ou desativado na biblioteca sem enviar uma nova imagem.
                                </p>

                                <div className="mt-5 grid gap-4">
                                    <input
                                        value={tituloPlantao}
                                        onChange={(e) => setTituloPlantao(e.target.value)}
                                        placeholder="Título. Ex: Plantão Judicial"
                                    />

                                    <input
                                        value={chamadaPadraoPlantao}
                                        onChange={(e) => setChamadaPadraoPlantao(e.target.value)}
                                        placeholder="Chamada padrão"
                                    />

                                    <textarea
                                        value={descricaoPadraoPlantao}
                                        onChange={(e) => setDescricaoPadraoPlantao(e.target.value)}
                                        className="min-h-28 resize-none"
                                        placeholder="Descrição padrão"
                                    />

                                    <div className="rounded-2xl border border-emerald-400/20 bg-emerald-500/[0.06] p-4 text-sm text-emerald-200">
                                        O WhatsApp vem do cadastro central em <strong>Contatos → Plantão Judicial</strong>.
                                    </div>

                                    <textarea
                                        value={rodapePlantao}
                                        onChange={(e) => setRodapePlantao(e.target.value)}
                                        className="min-h-20 resize-none"
                                        placeholder="Mensagem inferior"
                                    />
                                </div>

                                <div className="mt-6 border-t border-white/10 pt-5">
                                    <label className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-zinc-950/60 px-4 py-4">
                                        <span>
                                            <span className="block font-bold">
                                                Usar aviso especial temporário
                                            </span>
                                            <span className="mt-1 block text-xs text-zinc-500">
                                                No fim do período, o banner volta sozinho à mensagem padrão.
                                            </span>
                                        </span>

                                        <input
                                            type="checkbox"
                                            checked={avisoEspecialAtivo}
                                            onChange={(e) => setAvisoEspecialAtivo(e.target.checked)}
                                        />
                                    </label>

                                    {avisoEspecialAtivo && (
                                        <div className="mt-4 grid gap-4">
                                            <input
                                                value={ocasiaoEspecial}
                                                onChange={(e) => setOcasiaoEspecial(e.target.value)}
                                                placeholder="Ocasião. Ex: Feriado de 7 de Setembro"
                                            />

                                            <input
                                                value={chamadaEspecial}
                                                onChange={(e) => setChamadaEspecial(e.target.value)}
                                                placeholder="Chamada especial"
                                            />

                                            <textarea
                                                value={descricaoEspecial}
                                                onChange={(e) => setDescricaoEspecial(e.target.value)}
                                                className="min-h-24 resize-none"
                                                placeholder="Descrição especial"
                                            />

                                            <div className="grid gap-4 sm:grid-cols-2">
                                                <label className="text-sm font-bold text-zinc-300">
                                                    Início do aviso
                                                    <input
                                                        type="datetime-local"
                                                        value={inicioAvisoEspecial}
                                                        onChange={(e) => setInicioAvisoEspecial(e.target.value)}
                                                        className="mt-2"
                                                    />
                                                </label>

                                                <label className="text-sm font-bold text-zinc-300">
                                                    Fim do aviso
                                                    <input
                                                        type="datetime-local"
                                                        value={fimAvisoEspecial}
                                                        onChange={(e) => setFimAvisoEspecial(e.target.value)}
                                                        className="mt-2"
                                                    />
                                                </label>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </section>
                        )}

                        {ehContatos && (
                            <section className="rounded-[26px] border border-sky-400/20 bg-sky-500/[0.06] p-5">
                                <h3 className="text-xl font-black">
                                    Contatos Oficiais
                                </h3>

                                <p className="mt-2 text-sm text-zinc-400">
                                    O banner usa automaticamente os setores marcados como “No banner” na aba Contatos.
                                </p>

                                <div className="mt-5 grid gap-4">
                                    <input
                                        value={tituloContatos}
                                        onChange={(e) => setTituloContatos(e.target.value)}
                                        placeholder="Título principal"
                                    />
                                    <textarea
                                        value={subtituloContatos}
                                        onChange={(e) => setSubtituloContatos(e.target.value)}
                                        className="min-h-20 resize-none"
                                        placeholder="Texto de apoio"
                                    />
                                    <textarea
                                        value={rodapeContatos}
                                        onChange={(e) => setRodapeContatos(e.target.value)}
                                        className="min-h-20 resize-none"
                                        placeholder="Mensagem inferior"
                                    />
                                </div>
                            </section>
                        )}

                        <section className="rounded-[26px] border border-white/10 bg-white/[0.03] p-5">
                            <h3 className="text-xl font-black">Exibição</h3>

                            <div className="mt-5 space-y-4">
                                {!ehYoutube && (
                                    <label className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-zinc-950/60 px-4 py-4">
                                        <span className="font-bold">Programar exibição</span>

                                        <input
                                            type="checkbox"
                                            checked={programarExibicao}
                                            onChange={(e) => setProgramarExibicao(e.target.checked)}
                                        />
                                    </label>
                                )}

                                {(programarExibicao || ehYoutube) && (
                                    <div className="grid gap-4 sm:grid-cols-2">
                                        <input type="datetime-local" value={inicioExibicao} onChange={(e) => setInicioExibicao(e.target.value)} />
                                        <input type="datetime-local" value={fimExibicao} onChange={(e) => setFimExibicao(e.target.value)} />
                                    </div>
                                )}
                            </div>
                        </section>

                        {!ehYoutube && !ehDinamica && (
                            <section className="rounded-[26px] border border-white/10 bg-white/[0.03] p-5">
                                <h3 className="text-xl font-black">Tarja</h3>

                                <p className="mt-2 text-sm text-zinc-400">
                                    Escolha o modelo da tarja primeiro. Os campos mudam conforme a escolha.
                                </p>

                                <div className="mt-5 space-y-4">
                                    <label className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-zinc-950/60 px-4 py-4">
                                        <span className="font-bold">Mostrar tarja nesta mídia</span>

                                        <input
                                            type="checkbox"
                                            checked={mostrarTarja}
                                            onChange={(e) => setMostrarTarja(e.target.checked)}
                                        />
                                    </label>

                                    {mostrarTarja && (
                                        <>
                                            <select
                                                value={modeloTarja}
                                                onChange={(e) => setModeloTarja(e.target.value as ModeloTarja)}
                                            >
                                                <option value="telejornal">Telejornal</option>
                                                <option value="compacta">Compacta</option>
                                                <option value="live">Live News</option>
                                                <option value="infobar">Barra Informativa</option>
                                                <option value="digital">Digital Sign</option>
                                            </select>

                                            {usaEtiqueta && (
                                                <input value={tarjaEtiqueta} onChange={(e) => setTarjaEtiqueta(e.target.value)} placeholder="Etiqueta" />
                                            )}

                                            <input value={tarjaTitulo} onChange={(e) => setTarjaTitulo(e.target.value)} placeholder={modeloTarja === "infobar" ? "Texto da barra" : "Título da tarja"} />

                                            {usaSubtitulo && (
                                                <input value={tarjaSubtitulo} onChange={(e) => setTarjaSubtitulo(e.target.value)} placeholder="Subtítulo da tarja" />
                                            )}

                                            {usaQrcode && (
                                                <input value={tarjaQrcode} onChange={(e) => setTarjaQrcode(e.target.value)} placeholder="Link para QR Code" />
                                            )}
                                        </>
                                    )}
                                </div>
                            </section>
                        )}
                    </div>

                    <aside className="h-fit rounded-[26px] border border-white/10 bg-zinc-900/85 p-5">
                        <h3 className="text-xl font-black">Resumo</h3>

                        <p className="mt-2 text-sm text-zinc-400">
                            Confira antes de salvar.
                        </p>

                        <div className="mt-5 space-y-3 text-sm">
                            <div className="rounded-2xl border border-white/10 bg-zinc-950/60 p-4">
                                <p className="text-zinc-500">Tipo</p>
                                <p className="mt-1 font-black">{tipo.toUpperCase()}</p>
                            </div>

                            <div className="rounded-2xl border border-white/10 bg-zinc-950/60 p-4">
                                <p className="text-zinc-500">Template</p>
                                <p className="mt-1 font-black">
                                    {ehYoutube
                                        ? "YouTube / Live"
                                        : ehPlantao
                                            ? "Plantão Judicial"
                                            : ehContatos
                                                ? "Contatos Oficiais"
                                            : template}
                                </p>
                            </div>

                            <div className="rounded-2xl border border-white/10 bg-zinc-950/60 p-4">
                                <p className="text-zinc-500">Exibição</p>
                                <p className="mt-1 font-black">{ehYoutube || programarExibicao ? "Programada" : "Contínua"}</p>
                            </div>

                            <div className="rounded-2xl border border-white/10 bg-zinc-950/60 p-4">
                                <p className="text-zinc-500">Tarja</p>
                                <p className="mt-1 font-black">
                                    {ehDinamica
                                        ? "Não se aplica"
                                        : mostrarTarja
                                            ? modeloTarja
                                            : "Sem tarja"}
                                </p>
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={salvarNoRascunho}
                            className="mt-6 w-full rounded-2xl border border-sky-300/20 bg-sky-500 px-5 py-4 text-sm font-black text-white shadow-[0_14px_35px_rgba(14,165,233,0.22)]"
                        >
                            Salvar no rascunho
                        </button>
                    </aside>
                </div>
            </div>
        </div>
    )
}
