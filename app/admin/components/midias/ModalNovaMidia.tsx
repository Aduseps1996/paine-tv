import { useState } from "react"
import {
    Code2,
    ImageIcon,
    MonitorPlay,
    PlayCircle,
    UploadCloud
} from "lucide-react"

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
    midiaEditando?: Midia | null
}

export default function ModalNovaMidia({
    midias,
    atualizarMidiasDraft,
    onFechar,
    midiaEditando = null
}: Props) {
    const [arquivo, setArquivo] = useState(midiaEditando?.arquivo || "")
    const [tipo, setTipo] = useState<TipoMidia>(midiaEditando?.tipo || "imagem")
    const [template, setTemplate] = useState<TemplateMidia>(midiaEditando?.template || "cheio")
    const [modoExibicao, setModoExibicao] = useState<ModoExibicaoMidia>(midiaEditando?.modoExibicao || "cover")
    const [arquivoLocalNome, setArquivoLocalNome] = useState("")
    const [arquivoLocalTamanho, setArquivoLocalTamanho] = useState<number | null>(null)
    const [uploadProgresso, setUploadProgresso] = useState(0)
    const [enviandoUpload, setEnviandoUpload] = useState(false)
    const [uploadConcluido, setUploadConcluido] = useState(false)
    const [storagePath, setStoragePath] = useState(midiaEditando?.storagePath || "")
    const [mimeType, setMimeType] = useState(midiaEditando?.mimeType || "")
    const [tamanhoBytes, setTamanhoBytes] = useState<number | null>(midiaEditando?.tamanhoBytes ?? null)
    const [tamanhoOriginalBytes, setTamanhoOriginalBytes] = useState<number | null>(null)
    const [tamanhoOtimizadoBytes, setTamanhoOtimizadoBytes] = useState<number | null>(null)
    const [foiOtimizado, setFoiOtimizado] = useState(false)

    const [thumbnailUrl, setThumbnailUrl] = useState(midiaEditando?.thumbnailUrl || "")
    const [thumbnailStoragePath, setThumbnailStoragePath] = useState(midiaEditando?.thumbnailStoragePath || "")
    const [duracaoVideo, setDuracaoVideo] = useState<number | undefined>(midiaEditando?.duracaoVideo)
    const [larguraVideo, setLarguraVideo] = useState<number | undefined>(midiaEditando?.larguraVideo)
    const [alturaVideo, setAlturaVideo] = useState<number | undefined>(midiaEditando?.alturaVideo)
    const [orientacaoVideo, setOrientacaoVideo] = useState<"vertical" | "horizontal" | "quadrado" | undefined>(midiaEditando?.orientacaoVideo)

    const [titulo, setTitulo] = useState(midiaEditando?.titulo || "")
    const [subtitulo, setSubtitulo] = useState(midiaEditando?.subtitulo || "")
    const [rodape, setRodape] = useState(midiaEditando?.rodape || "")
    const [categoria, setCategoria] = useState(midiaEditando?.categoria || "")
    const [cta, setCta] = useState(midiaEditando?.cta || "")
    const [qrcode, setQrcode] = useState(midiaEditando?.qrcode || "")

    const [programarExibicao, setProgramarExibicao] = useState(midiaEditando?.exibicaoProgramada ?? false)
    const [inicioExibicao, setInicioExibicao] = useState(midiaEditando?.inicioExibicao || "")
    const [fimExibicao, setFimExibicao] = useState(midiaEditando?.fimExibicao || "")
    const [ativo, setAtivo] = useState(midiaEditando?.ativo ?? true)
    const [ordem, setOrdem] = useState(midiaEditando?.ordem || midias.length + 1)
    const [duracao, setDuracao] = useState(midiaEditando?.duracao || 8)
    const [pesoExibicao, setPesoExibicao] = useState(midiaEditando?.pesoExibicao || 1)
    const [modoProgramacao, setModoProgramacao] =
        useState<NonNullable<Midia["modoProgramacao"]>>(midiaEditando?.modoProgramacao || "periodo")
    const [intervaloExibicaoMinutos, setIntervaloExibicaoMinutos] =
        useState(midiaEditando?.intervaloExibicaoMinutos || 20)
    const [prioridadeProgramacao, setPrioridadeProgramacao] =
        useState(midiaEditando?.prioridadeProgramacao || 3)

    const [mostrarTarja, setMostrarTarja] = useState(midiaEditando?.mostrarTarja ?? false)
    const [modeloTarja, setModeloTarja] = useState<ModeloTarja>(midiaEditando?.modeloTarja || "telejornal")
    const [tarjaEtiqueta, setTarjaEtiqueta] = useState(midiaEditando?.tarjaEtiqueta || "")
    const [tarjaTitulo, setTarjaTitulo] = useState(midiaEditando?.tarjaTitulo || "")
    const [tarjaSubtitulo, setTarjaSubtitulo] = useState(midiaEditando?.tarjaSubtitulo || "")
    const [tarjaQrcode, setTarjaQrcode] = useState(midiaEditando?.qrcode || "")

    const [tempoEntradaTarja, setTempoEntradaTarja] = useState(midiaEditando?.tempoEntradaTarja || 1)
    const [tempoVisivelTarja, setTempoVisivelTarja] = useState(midiaEditando?.tempoVisivelTarja || 8)
    const [tempoSaidaTarja, setTempoSaidaTarja] = useState(midiaEditando?.tempoSaidaTarja || 1)
    const [tempoOcultaTarja, setTempoOcultaTarja] = useState(midiaEditando?.tempoOcultaTarja || 10)
    const [tempoInicialTarja, setTempoInicialTarja] = useState(midiaEditando?.tempoInicialTarja || 0)

    const [tituloPlantao, setTituloPlantao] = useState(midiaEditando?.plantao?.titulo || "Plantão Judicial")
    const [chamadaPadraoPlantao, setChamadaPadraoPlantao] =
        useState(midiaEditando?.plantao?.chamadaPadrao || "Urgências não esperam até segunda-feira.")
    const [descricaoPadraoPlantao, setDescricaoPadraoPlantao] = useState(
        midiaEditando?.plantao?.descricaoPadrao ||
        "Atuação em situações urgentes relacionadas ao direito à saúde durante finais de semana e feriados."
    )
    const [rodapePlantao, setRodapePlantao] = useState(
        midiaEditando?.plantao?.rodape ||
        "Nosso compromisso é com a justiça social e a defesa da dignidade humana."
    )
    const [avisoEspecialAtivo, setAvisoEspecialAtivo] = useState(midiaEditando?.plantao?.avisoEspecialAtivo ?? false)
    const [ocasiaoEspecial, setOcasiaoEspecial] = useState(midiaEditando?.plantao?.ocasiaoEspecial || "")
    const [chamadaEspecial, setChamadaEspecial] = useState(midiaEditando?.plantao?.chamadaEspecial || "")
    const [descricaoEspecial, setDescricaoEspecial] = useState(midiaEditando?.plantao?.descricaoEspecial || "")
    const [inicioAvisoEspecial, setInicioAvisoEspecial] = useState(midiaEditando?.plantao?.inicioAvisoEspecial || "")
    const [fimAvisoEspecial, setFimAvisoEspecial] = useState(midiaEditando?.plantao?.fimAvisoEspecial || "")

    const [tituloContatos, setTituloContatos] =
        useState(midiaEditando?.contatosOficiais?.titulo || "Fale com a ADUSEPS")
    const [subtituloContatos, setSubtituloContatos] = useState(
        midiaEditando?.contatosOficiais?.subtitulo ||
        "Nossos canais oficiais estão à disposição dos associados."
    )
    const [rodapeContatos, setRodapeContatos] = useState(
        midiaEditando?.contatosOficiais?.rodape ||
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
            midias.some((midia) =>
                midia.template === "plantao-juridico" &&
                midia.id !== midiaEditando?.id
            )
        ) {
            alert(
                "O Plantão Judicial já está cadastrado. Use o botão Editar conteúdo no card existente."
            )
            return
        }

        if (
            ehContatos &&
            midias.some((midia) =>
                midia.template === "contatos-oficiais" &&
                midia.id !== midiaEditando?.id
            )
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
            ...midiaEditando,
            id: midiaEditando?.id || `draft-${Date.now()}`,
            tipo,
            arquivo: ehDinamica ? "" : arquivo.trim(),
            storagePath: storagePath || "",
            mimeType: mimeType || "",
            ...(tamanhoBytes !== null ? { tamanhoBytes } : {}),
            versao: midiaEditando?.versao || 1,
            atualizadoEm: new Date().toISOString(),
            ativo,
            ordem,
            duracao,
            pesoExibicao,
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
            modoProgramacao,
            intervaloExibicaoMinutos,
            prioridadeProgramacao,
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

        atualizarMidiasDraft(
            midiaEditando
                ? midias.map((midia) =>
                    midia.id === midiaEditando.id ? novaMidia : midia
                )
                : [...midias, novaMidia]
        )
        onFechar()
    }

    function alterarTipo(novoTipo: TipoMidia) {
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
    }

    return (
        <div className="admin-media-modal min-h-full text-slate-950">
            <div className="w-full">
                <div className="mb-6 flex flex-col gap-4 border-b border-slate-200 pb-5 lg:flex-row lg:items-start lg:justify-between">
                    <div>
                        <div className="text-sm font-semibold text-slate-500">
                            <button type="button" onClick={onFechar} className="text-[#0d6efd] hover:underline">
                                Mídias
                            </button>
                            <span className="mx-2">/</span>
                            {midiaEditando ? "Editar mídia" : "Nova mídia"}
                        </div>

                        <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-950 sm:text-[40px]">
                            {midiaEditando ? "Editar mídia" : "Nova mídia"}
                        </h2>

                        <p className="mt-1 max-w-2xl text-sm leading-relaxed text-slate-600 sm:text-base">
                            {midiaEditando
                                ? "Atualize o conteúdo e as regras de exibição."
                                : "Adicione um conteúdo à programação da TV."}
                        </p>
                    </div>

                    <div className="flex flex-wrap gap-3">
                        <button
                            type="button"
                            onClick={onFechar}
                            className="rounded-lg border border-[#0d6efd] bg-white px-5 py-3 text-sm font-bold text-[#0d6efd] hover:bg-blue-50"
                        >
                            Cancelar
                        </button>
                        <button
                            type="button"
                            onClick={salvarNoRascunho}
                            className="rounded-lg border border-[#0d6efd] bg-[#0d6efd] px-5 py-3 text-sm font-bold text-white shadow-[0_8px_18px_rgba(13,110,253,0.2)] hover:bg-[#0b5ed7]"
                        >
                            {midiaEditando ? "Salvar alterações" : "Salvar mídia"}
                        </button>
                    </div>
                </div>

                <div className="grid items-start gap-6 xl:grid-cols-[minmax(330px,0.82fr)_minmax(0,1.45fr)]">
                    <div className="order-2 space-y-5 xl:col-start-2 xl:row-start-1">
                        <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-[0_6px_20px_rgba(15,23,42,0.04)]">
                            <h3 className="text-xl font-black">1. Tipo de conteúdo</h3>

                            <p className="mt-1 text-sm text-slate-500">
                                Escolha o formato que será adicionado à programação.
                            </p>

                            <div className="mt-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
                                {([
                                    ["imagem", "Imagem", ImageIcon],
                                    ["video", "Vídeo", PlayCircle],
                                    ["youtube", "YouTube", MonitorPlay],
                                    ["dinamica", "Conteúdo dinâmico", Code2]
                                ] as const).map(([valor, rotulo, Icone]) => (
                                    <button
                                        key={valor}
                                        type="button"
                                        onClick={() => alterarTipo(valor)}
                                        className={`flex min-h-20 items-center justify-center gap-2 rounded-lg border px-3 text-sm font-bold transition ${
                                            tipo === valor
                                                ? "border-[#0d6efd] bg-blue-50 text-[#0d6efd] ring-1 ring-[#0d6efd]"
                                                : "border-slate-200 bg-white text-slate-700 hover:border-blue-300 hover:bg-blue-50/40"
                                        }`}
                                    >
                                        <Icone size={22} />
                                        {rotulo}
                                    </button>
                                ))}
                            </div>

                            <h3 className="mt-7 border-t border-slate-200 pt-5 text-xl font-black">
                                2. Conteúdo
                            </h3>

                            <div className="mt-5 grid gap-4 sm:grid-cols-2">
                                {!ehYoutube && !ehDinamica && (
                                    <div className="sm:col-span-2 rounded-lg border border-dashed border-[#0d6efd] bg-blue-50/40 p-4">
                                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                                            <UploadCloud className="h-8 w-8 shrink-0 text-[#0d6efd]" />
                                            <div className="min-w-0 flex-1">
                                                <p className="text-sm font-black text-slate-800">
                                                    Arraste o arquivo aqui ou clique para selecionar
                                                </p>

                                                <p className="mt-1 text-xs text-slate-500">
                                                    PNG, JPG, WEBP ou MP4
                                                </p>
                                            </div>

                                            <label className="w-fit cursor-pointer rounded-lg border border-[#0d6efd] bg-white px-4 py-2.5 text-sm font-black text-[#0d6efd] transition hover:bg-blue-50">
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
                                                    <p className="truncate font-bold text-slate-800">
                                                        {arquivoLocalNome}
                                                    </p>

                                                    {arquivoLocalTamanho !== null && (
                                                        <p className="text-xs text-slate-500">
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

                                                <p className="mt-2 text-xs font-bold text-slate-600">
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
                                    onChange={(e) => alterarTipo(e.target.value as TipoMidia)}
                                    className="hidden"
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
                            <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-[0_6px_20px_rgba(15,23,42,0.04)]">
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
                            <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-[0_6px_20px_rgba(15,23,42,0.04)]">
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
                            <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-[0_6px_20px_rgba(15,23,42,0.04)]">
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
                            <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-[0_6px_20px_rgba(15,23,42,0.04)]">
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
                            <section className="rounded-xl border border-cyan-200 bg-cyan-50/60 p-5 shadow-[0_6px_20px_rgba(15,23,42,0.04)]">
                                <h3 className="text-xl font-black">
                                    Plantão Judicial
                                </h3>

                                <p className="mt-2 text-sm text-slate-500">
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

                                <div className="mt-6 border-t border-slate-200 pt-5">
                                    <label className="flex items-center justify-between gap-4 rounded-lg border border-slate-200 bg-slate-50 px-4 py-4">
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
                            <section className="rounded-xl border border-blue-200 bg-blue-50/60 p-5 shadow-[0_6px_20px_rgba(15,23,42,0.04)]">
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

                        <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-[0_6px_20px_rgba(15,23,42,0.04)]">
                            <h3 className="text-xl font-black">3. Exibição</h3>

                            <div className="mt-5 space-y-4">
                                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                                    <label className="text-sm font-bold text-slate-700">
                                        Status
                                        <select
                                            value={ativo ? "ativa" : "inativa"}
                                            onChange={(e) => setAtivo(e.target.value === "ativa")}
                                            className="mt-2"
                                        >
                                            <option value="ativa">Ativa</option>
                                            <option value="inativa">Inativa</option>
                                        </select>
                                    </label>

                                    <label className="text-sm font-bold text-slate-700">
                                        Ordem
                                        <input
                                            type="number"
                                            min="1"
                                            value={ordem}
                                            onChange={(e) => setOrdem(Number(e.target.value))}
                                            className="mt-2"
                                        />
                                    </label>

                                    <label className="text-sm font-bold text-slate-700">
                                        Duração
                                        <input
                                            type="number"
                                            min="1"
                                            value={duracao}
                                            onChange={(e) => setDuracao(Number(e.target.value))}
                                            disabled={tipo === "video" || tipo === "youtube"}
                                            className="mt-2"
                                        />
                                    </label>

                                    <label className="text-sm font-bold text-slate-700">
                                        Repetição
                                        <input
                                            type="number"
                                            min="1"
                                            max="10"
                                            value={pesoExibicao}
                                            onChange={(e) => setPesoExibicao(Number(e.target.value))}
                                            className="mt-2"
                                        />
                                    </label>
                                </div>

                                {!ehYoutube && (
                                    <label className="flex items-center justify-between gap-4 rounded-lg border border-slate-200 bg-slate-50 px-4 py-4">
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
                                        <label className="text-sm font-bold text-slate-700">
                                            Início
                                            <input className="mt-2" type="datetime-local" value={inicioExibicao} onChange={(e) => setInicioExibicao(e.target.value)} />
                                        </label>
                                        <label className="text-sm font-bold text-slate-700">
                                            Encerramento
                                            <input className="mt-2" type="datetime-local" value={fimExibicao} onChange={(e) => setFimExibicao(e.target.value)} />
                                        </label>

                                        <label className="text-sm font-bold text-slate-700">
                                            Modo da programação
                                            <select
                                                className="mt-2"
                                                value={modoProgramacao}
                                                onChange={(e) => setModoProgramacao(e.target.value as NonNullable<Midia["modoProgramacao"]>)}
                                            >
                                                <option value="periodo">Período contínuo</option>
                                                <option value="intervalo">Por intervalo</option>
                                            </select>
                                        </label>

                                        <label className="text-sm font-bold text-slate-700">
                                            Prioridade
                                            <input
                                                className="mt-2"
                                                type="number"
                                                min="1"
                                                max="10"
                                                value={prioridadeProgramacao}
                                                onChange={(e) => setPrioridadeProgramacao(Number(e.target.value))}
                                            />
                                        </label>

                                        {modoProgramacao === "intervalo" && (
                                            <label className="text-sm font-bold text-slate-700 sm:col-span-2">
                                                Intervalo entre exibições (minutos)
                                                <input
                                                    className="mt-2"
                                                    type="number"
                                                    min="1"
                                                    value={intervaloExibicaoMinutos}
                                                    onChange={(e) => setIntervaloExibicaoMinutos(Number(e.target.value))}
                                                />
                                            </label>
                                        )}
                                    </div>
                                )}
                            </div>
                        </section>

                        {!ehYoutube && !ehDinamica && (
                            <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-[0_6px_20px_rgba(15,23,42,0.04)]">
                                <h3 className="text-xl font-black">Tarja</h3>

                                <p className="mt-2 text-sm text-zinc-400">
                                    Escolha o modelo da tarja primeiro. Os campos mudam conforme a escolha.
                                </p>

                                <div className="mt-5 space-y-4">
                                    <label className="flex items-center justify-between gap-4 rounded-lg border border-slate-200 bg-slate-50 px-4 py-4">
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

                                            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
                                                <label className="text-xs font-bold text-slate-600">
                                                    Entrada (s)
                                                    <input className="mt-2" type="number" min="0" step="0.1" value={tempoEntradaTarja} onChange={(e) => setTempoEntradaTarja(Number(e.target.value))} />
                                                </label>
                                                <label className="text-xs font-bold text-slate-600">
                                                    Visível (s)
                                                    <input className="mt-2" type="number" min="1" value={tempoVisivelTarja} onChange={(e) => setTempoVisivelTarja(Number(e.target.value))} />
                                                </label>
                                                <label className="text-xs font-bold text-slate-600">
                                                    Saída (s)
                                                    <input className="mt-2" type="number" min="0" step="0.1" value={tempoSaidaTarja} onChange={(e) => setTempoSaidaTarja(Number(e.target.value))} />
                                                </label>
                                                <label className="text-xs font-bold text-slate-600">
                                                    Oculta (s)
                                                    <input className="mt-2" type="number" min="0" value={tempoOcultaTarja} onChange={(e) => setTempoOcultaTarja(Number(e.target.value))} />
                                                </label>
                                                <label className="text-xs font-bold text-slate-600">
                                                    Atraso (s)
                                                    <input className="mt-2" type="number" min="0" value={tempoInicialTarja} onChange={(e) => setTempoInicialTarja(Number(e.target.value))} />
                                                </label>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </section>
                        )}
                    </div>

                    <aside className="order-1 h-fit rounded-xl border border-slate-200 bg-white p-5 shadow-[0_6px_20px_rgba(15,23,42,0.05)] xl:sticky xl:top-6 xl:col-start-1 xl:row-start-1">
                        <h3 className="mb-4 text-lg font-black text-slate-900">
                            Prévia da mídia
                        </h3>

                        <div className="mb-5 overflow-hidden rounded-xl border border-slate-200 bg-slate-950 shadow-sm">
                            <div className="relative aspect-video">
                                {tipo === "imagem" && arquivo && (
                                    <img
                                        src={arquivo}
                                        alt="Prévia da mídia"
                                        className="absolute inset-0 h-full w-full object-cover"
                                    />
                                )}

                                {tipo === "video" && (thumbnailUrl || arquivo) && (
                                    thumbnailUrl ? (
                                        <img
                                            src={thumbnailUrl}
                                            alt="Prévia do vídeo"
                                            className="absolute inset-0 h-full w-full object-cover"
                                        />
                                    ) : (
                                        <video
                                            src={arquivo}
                                            muted
                                            className="absolute inset-0 h-full w-full object-contain"
                                        />
                                    )
                                )}

                                {tipo === "youtube" && (
                                    <div className="absolute inset-0 grid place-items-center bg-slate-950 p-6 text-center text-white">
                                        <div>
                                            <p className="text-lg font-black">YouTube / Live</p>
                                            <p className="mt-2 line-clamp-2 break-all text-xs text-slate-400">
                                                {arquivo || "Informe o link da transmissão"}
                                            </p>
                                        </div>
                                    </div>
                                )}

                                {ehPlantao && (
                                    <div className="absolute inset-0 flex items-center bg-[linear-gradient(120deg,#06146d_0%,#073da9_58%,#00a8e0_100%)] p-6 text-white">
                                        <div>
                                            <p className="text-2xl font-black">{tituloPlantao}</p>
                                            <p className="mt-3 max-w-sm text-sm font-bold text-cyan-100">
                                                {chamadaPadraoPlantao}
                                            </p>
                                        </div>
                                    </div>
                                )}

                                {ehContatos && (
                                    <div className="absolute inset-0 flex items-center bg-[linear-gradient(120deg,#06143c_0%,#064696_60%,#05a4ca_100%)] p-6 text-white">
                                        <div>
                                            <p className="text-2xl font-black">{tituloContatos}</p>
                                            <p className="mt-3 max-w-sm text-sm text-cyan-100">
                                                {subtituloContatos}
                                            </p>
                                        </div>
                                    </div>
                                )}

                                {!arquivo && !ehDinamica && tipo !== "youtube" && (
                                    <div className="absolute inset-0 grid place-items-center bg-slate-100 p-6 text-center">
                                        <div>
                                            <p className="font-black text-slate-700">Prévia da mídia</p>
                                            <p className="mt-1 text-xs text-slate-500">
                                                Selecione um arquivo para visualizar.
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        <h3 className="text-base font-black">Resumo</h3>

                        <p className="mt-2 text-sm text-zinc-400">
                            Confira antes de salvar.
                        </p>

                        <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                            <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                                <p className="text-xs text-slate-500">Tipo</p>
                                <p className="mt-1 truncate font-black">{tipo.toUpperCase()}</p>
                            </div>

                            <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                                <p className="text-xs text-slate-500">Template</p>
                                <p className="mt-1 truncate font-black">
                                    {ehYoutube
                                        ? "YouTube / Live"
                                        : ehPlantao
                                            ? "Plantão Judicial"
                                            : ehContatos
                                                ? "Contatos Oficiais"
                                            : template}
                                </p>
                            </div>

                            <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                                <p className="text-xs text-slate-500">Exibição</p>
                                <p className="mt-1 font-black">{ehYoutube || programarExibicao ? "Programada" : "Contínua"}</p>
                            </div>

                            <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                                <p className="text-xs text-slate-500">Tarja</p>
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
                            className="mt-6 w-full rounded-lg border border-[#0d6efd] bg-[#0d6efd] px-5 py-3.5 text-sm font-black text-white shadow-[0_10px_25px_rgba(13,110,253,0.2)] hover:bg-[#0b5ed7]"
                        >
                            {midiaEditando ? "Salvar alterações" : "Salvar no rascunho"}
                        </button>
                    </aside>
                </div>
            </div>
        </div>
    )
}
