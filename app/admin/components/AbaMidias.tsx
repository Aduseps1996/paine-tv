import { doc, updateDoc } from "firebase/firestore"
import { useState, useEffect } from "react"

type Props = {
    midias: any[]
    arquivo: string
    tipo: "imagem" | "video" | "youtube"
    template: "cheio" | "informativo" | "institucional" | "urgente"

    tituloMidia: string
    subtituloMidia: string
    rodapeMidia: string
    qrcodeMidia: string
    categoriaMidia: string
    ctaMidia: string

    programarExibicaoNovaMidia: boolean
    setProgramarExibicaoNovaMidia: (valor: boolean) => void
    inicioExibicaoNovaMidia: string
    setInicioExibicaoNovaMidia: (valor: string) => void
    fimExibicaoNovaMidia: string
    setFimExibicaoNovaMidia: (valor: string) => void

    mostrarTarjaMidia: boolean
    tarjaEtiquetaMidia: string
    tarjaTituloMidia: string
    tarjaSubtituloMidia: string
    tempoEntradaTarjaMidia: number
    tempoVisivelTarjaMidia: number
    tempoSaidaTarjaMidia: number
    tempoOcultaTarjaMidia: number
    tempoInicialTarjaMidia: number
    tarjaQrcodeMidia: string
    setTarjaQrcodeMidia: (valor: string) => void

    setArquivo: (valor: string) => void
    setTipo: (valor: "imagem" | "video" | "youtube") => void
    setTemplate: (
        valor: "cheio" | "informativo" | "institucional" | "urgente"
    ) => void

    modeloTarjaMidia: "telejornal" | "compacta" | "live" | "infobar" | "digital"
    setModeloTarjaMidia: (
        valor: "telejornal" | "compacta" | "live" | "infobar" | "digital"
    ) => void

    setTituloMidia: (valor: string) => void
    setSubtituloMidia: (valor: string) => void
    setRodapeMidia: (valor: string) => void
    setQrcodeMidia: (valor: string) => void
    setCategoriaMidia: (valor: string) => void
    setCtaMidia: (valor: string) => void

    adicionarMidia: () => void
    removerMidia: (id: string) => void
    alternarMidia: (id: string, ativo: boolean) => void
    carregarMidias: () => void

    setMostrarTarjaMidia: (valor: boolean) => void
    setTarjaEtiquetaMidia: (valor: string) => void
    setTarjaTituloMidia: (valor: string) => void
    setTarjaSubtituloMidia: (valor: string) => void
    setTempoEntradaTarjaMidia: (valor: number) => void
    setTempoVisivelTarjaMidia: (valor: number) => void
    setTempoSaidaTarjaMidia: (valor: number) => void
    setTempoOcultaTarjaMidia: (valor: number) => void
    setTempoInicialTarjaMidia: (valor: number) => void

    db: any
}

/* Desestruturação */
export default function AbaMidias({
    midias,
    arquivo,
    tipo,
    template,
    tituloMidia,
    subtituloMidia,
    rodapeMidia,
    qrcodeMidia,
    categoriaMidia,
    ctaMidia,

    programarExibicaoNovaMidia,
    setProgramarExibicaoNovaMidia,
    inicioExibicaoNovaMidia,
    setInicioExibicaoNovaMidia,
    fimExibicaoNovaMidia,
    setFimExibicaoNovaMidia,

    setArquivo,
    setTipo,
    setTemplate,
    setTituloMidia,
    setSubtituloMidia,
    setRodapeMidia,
    setQrcodeMidia,
    setCategoriaMidia,
    setCtaMidia,
    adicionarMidia,
    removerMidia,
    alternarMidia,
    carregarMidias,

    mostrarTarjaMidia,
    tarjaEtiquetaMidia,
    tarjaTituloMidia,
    tarjaSubtituloMidia,
    tempoEntradaTarjaMidia,
    tempoVisivelTarjaMidia,
    tempoSaidaTarjaMidia,
    tempoOcultaTarjaMidia,

    setMostrarTarjaMidia,
    setTarjaEtiquetaMidia,
    setTarjaTituloMidia,
    setTarjaSubtituloMidia,
    setTempoEntradaTarjaMidia,
    setTempoVisivelTarjaMidia,
    setTempoSaidaTarjaMidia,
    setTempoOcultaTarjaMidia,
    tempoInicialTarjaMidia,
    setTempoInicialTarjaMidia,
    modeloTarjaMidia,
    setModeloTarjaMidia,
    tarjaQrcodeMidia,
    setTarjaQrcodeMidia,

    db
}: Props) {
    const [modalTarjaAberto, setModalTarjaAberto] = useState(false)
    const [midiaEditando, setMidiaEditando] = useState<string | null>(null)
    const [modalExibicaoAberto, setModalExibicaoAberto] = useState(false)
    const [midiaExibicaoEditando, setMidiaExibicaoEditando] = useState<string | null>(null)

    const [exibicaoProgramada, setExibicaoProgramada] = useState(false)
    const [tipoExibicaoProgramada, setTipoExibicaoProgramada] = useState<"midia" | "youtube">("midia")
    const [inicioExibicao, setInicioExibicao] = useState("")
    const [fimExibicao, setFimExibicao] = useState("")
    const [linkYoutubeExibicao, setLinkYoutubeExibicao] = useState("")

    useEffect(() => {
        if (!midiaEditando) return

        const m = midias.find((x) => x.id === midiaEditando)

        if (!m) return

        setMostrarTarjaMidia(m.mostrarTarja ?? false)
        setTarjaEtiquetaMidia(m.tarjaEtiqueta || "ADUSEPS INFORMA")
        setTarjaTituloMidia(m.tarjaTitulo || "")
        setTarjaSubtituloMidia(m.tarjaSubtitulo || "")
        setTempoEntradaTarjaMidia(Number(m.tempoEntradaTarja || 1))
        setTempoVisivelTarjaMidia(Number(m.tempoVisivelTarja || 8))
        setTempoSaidaTarjaMidia(Number(m.tempoSaidaTarja || 1))
        setTempoOcultaTarjaMidia(Number(m.tempoOcultaTarja || 10))
        setTempoInicialTarjaMidia(Number(m.tempoInicialTarja || 1))
        setModeloTarjaMidia(m.modeloTarja || "telejornal")
        setTarjaQrcodeMidia(m.qrcode || "")
    }, [midiaEditando, midias])

    function abrirModalExibicao(midia: any) {
        setMidiaExibicaoEditando(midia.id)

        setExibicaoProgramada(midia.exibicaoProgramada ?? false)
        setTipoExibicaoProgramada(midia.tipoExibicaoProgramada || "midia")
        setInicioExibicao(midia.inicioExibicao || "")
        setFimExibicao(midia.fimExibicao || "")
        setLinkYoutubeExibicao(midia.linkYoutubeExibicao || "")

        setModalExibicaoAberto(true)
    }

    return (
        <div className="space-y-3 sm:space-y-6">
            <div>
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-black">
                    Mídias do painel
                </h1>

                <p className="mt-2 text-zinc-400">
                    Gerencie banners, vídeos, campanhas e templates institucionais.
                </p>
            </div>

            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
                <h2 className="text-2xl font-bold mb-2">
                    Nova mídia
                </h2>

                <p className="text-zinc-400 mb-6">
                    Adicione banners, vídeos e campanhas para exibição no painel.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <input
                        type="text"
                        placeholder={
                            tipo === "youtube"
                                ? "Link do YouTube / live"
                                : "URL da imagem ou vídeo"
                        }
                        className="bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 outline-none"
                        value={arquivo}
                        onChange={(e) => setArquivo(e.target.value)}
                    />

                    <select
                        value={tipo}
                        onChange={(e) =>
                            setTipo(e.target.value as "imagem" | "video" | "youtube")
                        }
                        className="bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 outline-none"
                    >
                        <option value="imagem">imagem</option>
                        <option value="video">video</option>
                        <option value="youtube">youtube / live</option>
                    </select>

                    {tipo !== "youtube" && (
                        <select
                            value={template}
                            onChange={(e) =>
                                setTemplate(
                                    e.target.value as
                                    | "cheio"
                                    | "informativo"
                                    | "institucional"
                                    | "urgente"
                                )
                            }
                            className="bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 outline-none"
                        >
                            <option value="cheio">Banner cheio</option>
                            <option value="informativo">Informativo</option>
                            <option value="institucional">Institucional</option>
                            <option value="urgente">Urgente</option>
                        </select>
                    )}

                    <div className="sm:col-span-2 rounded-2xl border border-zinc-700 bg-zinc-800/70 p-4 space-y-4">
                        <label className="flex items-center gap-3">
                            <input
                                type="checkbox"
                                checked={tipo === "youtube" ? true : programarExibicaoNovaMidia}
                                disabled={tipo === "youtube"}
                                onChange={(e) => setProgramarExibicaoNovaMidia(e.target.checked)}
                            />

                            <span className="font-bold">
                                {tipo === "youtube"
                                    ? "YouTube / Live exige programação"
                                    : "Programar exibição desta mídia"}
                            </span>
                        </label>

                        {(programarExibicaoNovaMidia || tipo === "youtube") && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm text-zinc-300 mb-2 block">
                                        Início da exibição
                                    </label>

                                    <input
                                        type="datetime-local"
                                        value={inicioExibicaoNovaMidia}
                                        onChange={(e) => setInicioExibicaoNovaMidia(e.target.value)}
                                        className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 outline-none"
                                    />
                                </div>

                                <div>
                                    <label className="text-sm text-zinc-300 mb-2 block">
                                        Fim da exibição
                                    </label>

                                    <input
                                        type="datetime-local"
                                        value={fimExibicaoNovaMidia}
                                        onChange={(e) => setFimExibicaoNovaMidia(e.target.value)}
                                        className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 outline-none"
                                    />
                                </div>
                            </div>
                        )}
                    </div>


                    <button
                        onClick={adicionarMidia}
                        className="bg-blue-600 hover:bg-blue-700 transition rounded-lg font-bold text-sm py-2"
                    >
                        Adicionar mídia
                    </button>

                    {(template === "institucional" || template === "urgente") && (
                        <div className="md:col-span-4 mt-2 grid grid-cols-1 gap-4">
                            <input
                                type="text"
                                placeholder="Categoria do banner. Ex: COMUNICADO, EVENTO, CAMPANHA"
                                value={categoriaMidia}
                                onChange={(e) => setCategoriaMidia(e.target.value)}
                                className="bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 outline-none"
                            />

                            <input
                                type="text"
                                placeholder="Título institucional"
                                value={tituloMidia}
                                onChange={(e) => setTituloMidia(e.target.value)}
                                className="bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 outline-none"
                            />

                            <textarea
                                placeholder="Subtítulo institucional"
                                value={subtituloMidia}
                                onChange={(e) => setSubtituloMidia(e.target.value)}
                                className="bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 outline-none resize-none min-h-30"
                            />

                            <input
                                type="text"
                                placeholder="Texto inferior"
                                value={rodapeMidia}
                                onChange={(e) => setRodapeMidia(e.target.value)}
                                className="bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 outline-none"
                            />

                            <input
                                type="text"
                                placeholder="Chamada para ação. Ex: Aponte a câmera, Saiba mais, Participe"
                                value={ctaMidia}
                                onChange={(e) => setCtaMidia(e.target.value)}
                                className="bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 outline-none"
                            />

                            <input
                                type="text"
                                placeholder="Link para QR Code"
                                value={qrcodeMidia}
                                onChange={(e) => setQrcodeMidia(e.target.value)}
                                className="bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 outline-none"
                            />
                        </div>
                    )}
                </div>
            </div>

            <section className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h2 className="text-2xl font-bold">
                            Mídias cadastradas
                        </h2>

                        <p className="text-zinc-400 mt-1">
                            Controle banners, vídeos e campanhas exibidas no painel.
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 items-stretch">
                    {midias.map((midia) => (
                        <div
                            key={midia.id}
                            className="flex h-full flex-col rounded-2xl border border-zinc-700 bg-zinc-800/80 p-5 shadow-lg"
                        >
                            <div className="flex items-center gap-2 mb-3 flex-wrap">
                                <div
                                    className={`w-3 h-3 rounded-full ${midia.ativo ? "bg-green-500" : "bg-red-500"
                                        }`}
                                />

                                <span
                                    className={`rounded-full px-3 py-1 text-xs font-bold ${midia.ativo
                                        ? "bg-green-500/15 text-green-400"
                                        : "bg-red-500/15 text-red-400"
                                        }`}
                                >
                                    {midia.ativo ? "Ativo" : "Inativo"}
                                </span>

                                {midia.exibicaoProgramada ? (
                                    <span className="rounded-full px-3 py-1 text-xs font-bold bg-blue-500/15 text-blue-400">
                                        Programada
                                    </span>
                                ) : (
                                    <span className="rounded-full px-3 py-1 text-xs font-bold bg-zinc-700 text-zinc-300">
                                        Contínua
                                    </span>
                                )}
                            </div>

                            <p className="font-bold">
                                {midia.tipo.toUpperCase()}
                            </p>

                            <p className="text-zinc-400 text-sm break-all">
                                {midia.arquivo}
                            </p>

                            <div className="mt-3 overflow-hidden rounded-[1.8rem] border border-zinc-700 bg-black">
                                <div className="relative aspect-video bg-black">
                                    {midia.tipo === "imagem" ? (
                                        <img
                                            src={midia.arquivo}
                                            alt="Prévia da mídia"
                                            className="absolute inset-0 w-full h-full object-contain bg-black"
                                        />
                                    ) : (
                                        <video
                                            src={midia.arquivo}
                                            controls
                                            muted
                                            className="absolute inset-0 w-full h-full object-contain bg-black"
                                        />
                                    )}
                                </div>
                            </div>

                            <p className="text-zinc-500 text-xs mt-2">
                                Ordem: {midia.ordem} | Duração: {midia.duracao}s
                            </p>

                            {midia.tipo === "imagem" && (
                                <div className="mt-3 flex flex-wrap items-center gap-2">
                                    <span className="text-sm text-zinc-400">
                                        Duração:
                                    </span>

                                    <input
                                        type="number"
                                        min="1"
                                        value={midia.duracao}
                                        onChange={(e) => {
                                            if (!midia.id) return

                                            updateDoc(doc(db, "midias", midia.id), {
                                                duracao: Number(e.target.value)
                                            })

                                            carregarMidias()
                                        }}
                                        className="w-24 bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-sm"
                                    />

                                    <span className="text-sm text-zinc-400">
                                        segundos
                                    </span>
                                </div>
                            )}

                            <div className="mt-3 flex flex-wrap items-center gap-2">
                                <span className="text-sm text-zinc-400">
                                    Ordem:
                                </span>

                                <input
                                    type="number"
                                    min="1"
                                    value={midia.ordem}
                                    onChange={(e) => {
                                        if (!midia.id) return

                                        updateDoc(doc(db, "midias", midia.id), {
                                            ordem: Number(e.target.value)
                                        })

                                        carregarMidias()
                                    }}
                                    className="w-24 bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-sm"
                                />
                            </div>

                            <div className="mt-3 flex flex-wrap items-center gap-2">
                                <span className="text-sm text-zinc-400">
                                    Repetição:
                                </span>

                                <input
                                    type="number"
                                    min="1"
                                    max="10"
                                    value={midia.pesoExibicao || 1}
                                    onChange={(e) => {
                                        if (!midia.id) return

                                        updateDoc(doc(db, "midias", midia.id), {
                                            pesoExibicao: Number(e.target.value)
                                        })

                                        carregarMidias()
                                    }}
                                    className="w-24 bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-sm"
                                />

                                <span className="text-sm text-zinc-400">
                                    vezes
                                </span>
                            </div>

                            <div className="mt-4 flex flex-wrap gap-3">
                                <button
                                    onClick={() =>
                                        midia.id && alternarMidia(midia.id, midia.ativo)
                                    }
                                    className={`rounded-lg px-4 py-2 text-sm font-bold transition ${midia.ativo
                                        ? "bg-yellow-600 hover:bg-yellow-700"
                                        : "bg-green-600 hover:bg-green-700"
                                        }`}
                                >
                                    {midia.ativo ? "Desativar" : "Ativar"}
                                </button>

                                <button
                                    onClick={() => abrirModalExibicao(midia)}
                                    className="rounded-lg bg-sky-600 px-4 py-2 text-sm font-bold transition hover:bg-sky-700"
                                >
                                    Exibição de mídia
                                </button>


                                <button
                                    onClick={() => {
                                        setMidiaEditando(midia.id)
                                        setModalTarjaAberto(true)
                                    }}
                                    className="rounded-lg bg-purple-600 px-4 py-2 text-sm font-bold transition hover:bg-purple-700"
                                >
                                    Adicionar tarja
                                </button>


                                <button
                                    onClick={() => midia.id && removerMidia(midia.id)}
                                    className="rounded-lg bg-red-600 px-4 py-2 text-sm font-bold transition hover:bg-red-700"
                                >
                                    Excluir
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Modal Tarja */}
            {modalTarjaAberto && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
                    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 sm:p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <h2 className="text-2xl font-bold mb-6">
                            Configurar tarja do vídeo
                        </h2>

                        <div className="space-y-4">
                            <label className="flex items-center gap-3 rounded-xl border border-zinc-700 bg-zinc-800 px-4 py-3">
                                <input
                                    type="checkbox"
                                    checked={mostrarTarjaMidia}
                                    onChange={(e) => setMostrarTarjaMidia(e.target.checked)}
                                />
                                <span>Mostrar tarja neste vídeo</span>
                            </label>

                            <div>
                                <label className="text-sm font-medium text-zinc-300 mb-2 block">
                                    Etiqueta
                                </label>
                                <input
                                    type="text"
                                    placeholder="Ex: ADUSEPS INFORMA"
                                    value={tarjaEtiquetaMidia}
                                    onChange={(e) => setTarjaEtiquetaMidia(e.target.value)}
                                    className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 outline-none"
                                />
                            </div>

                            <div>
                                <label className="text-sm font-medium text-zinc-300 mb-2 block">
                                    Título
                                </label>
                                <input
                                    type="text"
                                    placeholder="Título da tarja"
                                    value={tarjaTituloMidia}
                                    onChange={(e) => setTarjaTituloMidia(e.target.value)}
                                    className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 outline-none"
                                />
                            </div>

                            <div>
                                <label className="text-sm font-medium text-zinc-300 mb-2 block">
                                    Subtítulo
                                </label>
                                <input
                                    type="text"
                                    placeholder="Subtítulo da tarja"
                                    value={tarjaSubtituloMidia}
                                    onChange={(e) => setTarjaSubtituloMidia(e.target.value)}
                                    className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 outline-none"
                                />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm font-medium text-zinc-300 mb-2 block">
                                        Tempo de entrada (s)
                                    </label>
                                    <input
                                        type="number"
                                        min="0.2"
                                        step="0.1"
                                        value={tempoEntradaTarjaMidia}
                                        onChange={(e) => setTempoEntradaTarjaMidia(Number(e.target.value))}
                                        className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 outline-none"
                                    />
                                </div>

                                <div>
                                    <label className="text-sm font-medium text-zinc-300 mb-2 block">
                                        Tempo visível (s)
                                    </label>
                                    <input
                                        type="number"
                                        min="1"
                                        step="0.5"
                                        value={tempoVisivelTarjaMidia}
                                        onChange={(e) => setTempoVisivelTarjaMidia(Number(e.target.value))}
                                        className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 outline-none"
                                    />
                                </div>

                                <div>
                                    <label className="text-sm font-medium text-zinc-300 mb-2 block">
                                        Tempo de saída (s)
                                    </label>
                                    <input
                                        type="number"
                                        min="0.2"
                                        step="0.1"
                                        value={tempoSaidaTarjaMidia}
                                        onChange={(e) => setTempoSaidaTarjaMidia(Number(e.target.value))}
                                        className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 outline-none"
                                    />
                                </div>

                                <div>
                                    <label className="text-sm font-medium text-zinc-300 mb-2 block">
                                        Tempo oculto (s)
                                    </label>
                                    <input
                                        type="number"
                                        min="0"
                                        step="1"
                                        value={tempoOcultaTarjaMidia}
                                        onChange={(e) => setTempoOcultaTarjaMidia(Number(e.target.value))}
                                        className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 outline-none"
                                    />
                                </div>

                                <div>
                                    <label className="text-sm font-medium text-zinc-300 mb-2 block">
                                        Tempo para primeira aparição (s)
                                    </label>
                                    <input
                                        type="number"
                                        min="0"
                                        step="0.5"
                                        value={tempoInicialTarjaMidia}
                                        onChange={(e) => setTempoInicialTarjaMidia(Number(e.target.value))}
                                        className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 outline-none"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="text-sm font-medium text-zinc-300 mb-2 block">
                                    Modelo da tarja
                                </label>
                                <select
                                    value={modeloTarjaMidia}
                                    onChange={(e) =>
                                        setModeloTarjaMidia(
                                            e.target.value as "telejornal" | "compacta" | "live" | "infobar" | "digital"
                                        )
                                    }
                                    className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 outline-none"
                                >
                                    <option value="telejornal">Tarja telejornal</option>
                                    <option value="compacta">Tarja compacta</option>
                                    <option value="live">Tarja Live News</option>
                                    <option value="infobar">Barra Informativa</option>
                                    <option value="digital">Banner Digital Sign</option>
                                </select>
                            </div>
                            <div className="mt-4">
                                <label className="text-sm font-medium text-zinc-300 mb-2 block">
                                    Link para QR Code
                                </label>
                                <input
                                    type="text"
                                    placeholder="Link para QR Code"
                                    value={tarjaQrcodeMidia}
                                    onChange={(e) => setTarjaQrcodeMidia(e.target.value)}
                                    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base outline-none"
                                />
                            </div>
                        </div>

                        <div className="mt-8 flex gap-3">
                            <button
                                onClick={() => {
                                    if (midiaEditando) {
                                        updateDoc(doc(db, "midias", midiaEditando), {
                                            mostrarTarja: mostrarTarjaMidia,
                                            tarjaEtiqueta: tarjaEtiquetaMidia,
                                            tarjaTitulo: tarjaTituloMidia,
                                            tarjaSubtitulo: tarjaSubtituloMidia,
                                            tempoEntradaTarja: tempoEntradaTarjaMidia,
                                            tempoVisivelTarja: tempoVisivelTarjaMidia,
                                            tempoSaidaTarja: tempoSaidaTarjaMidia,
                                            tempoOcultaTarja: tempoOcultaTarjaMidia,
                                            modeloTarja: modeloTarjaMidia,
                                            qrcode: tarjaQrcodeMidia
                                        })
                                        carregarMidias()
                                    }
                                    setModalTarjaAberto(false)
                                    setMidiaEditando(null)
                                }}
                                className="flex-1 bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-xl font-bold transition"
                            >
                                Salvar tarja
                            </button>

                            <button
                                onClick={() => {
                                    setModalTarjaAberto(false)
                                    setMidiaEditando(null)
                                }}
                                className="flex-1 bg-zinc-800 hover:bg-zinc-700 px-6 py-3 rounded-xl font-bold transition"
                            >
                                Cancelar
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal Exibição de Mídia */}
            {modalExibicaoAberto && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
                    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 sm:p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <h2 className="text-2xl font-bold mb-2">
                            Exibição de mídia
                        </h2>

                        <p className="text-zinc-400 mb-6">
                            Configure quando esta mídia ou transmissão será exibida no painel.
                        </p>

                        <div className="space-y-4">
                            <label className="flex items-center gap-3 rounded-xl border border-zinc-700 bg-zinc-800 px-4 py-3">
                                <input
                                    type="checkbox"
                                    checked={exibicaoProgramada}
                                    onChange={(e) => setExibicaoProgramada(e.target.checked)}
                                />

                                <span>Usar exibição programada</span>
                            </label>

                            <div>
                                <label className="text-sm font-medium text-zinc-300 mb-2 block">
                                    Tipo de exibição
                                </label>

                                <select
                                    value={tipoExibicaoProgramada}
                                    onChange={(e) => {
                                        const valor = e.target.value as "midia" | "youtube"

                                        setTipoExibicaoProgramada(valor)

                                        if (valor === "midia") {
                                            setLinkYoutubeExibicao("")
                                        }
                                    }}
                                    className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 outline-none"
                                >
                                    <option value="midia">Mídia cadastrada</option>
                                    <option value="youtube">YouTube</option>
                                </select>
                            </div>

                            {tipoExibicaoProgramada === "youtube" && (
                                <div>
                                    <label className="text-sm font-medium text-zinc-300 mb-2 block">
                                        Link do YouTube
                                    </label>

                                    <input
                                        type="text"
                                        placeholder="Cole aqui o link da live ou vídeo do YouTube"
                                        value={linkYoutubeExibicao}
                                        onChange={(e) => setLinkYoutubeExibicao(e.target.value)}
                                        className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 outline-none"
                                    />
                                </div>
                            )}

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm font-medium text-zinc-300 mb-2 block">
                                        Início da exibição
                                    </label>

                                    <input
                                        type="datetime-local"
                                        value={inicioExibicao}
                                        onChange={(e) => setInicioExibicao(e.target.value)}
                                        className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 outline-none"
                                    />
                                </div>

                                <div>
                                    <label className="text-sm font-medium text-zinc-300 mb-2 block">
                                        Fim da exibição
                                    </label>

                                    <input
                                        type="datetime-local"
                                        value={fimExibicao}
                                        onChange={(e) => setFimExibicao(e.target.value)}
                                        className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 outline-none"
                                    />
                                </div>
                            </div>

                            <div className="rounded-xl border border-zinc-700 bg-zinc-800/70 p-4 text-sm text-zinc-300">
                                <p className="font-bold text-white mb-1">
                                    Como funciona:
                                </p>

                                <p>
                                    Se estiver programado, esta mídia só será exibida dentro do período escolhido.
                                    Fora do horário, o painel volta para as outras mídias ativas.
                                </p>
                            </div>
                        </div>

                        <div className="mt-8 flex gap-3">
                            <button
                                onClick={async () => {
                                    if (!midiaExibicaoEditando) return

                                    await updateDoc(doc(db, "midias", midiaExibicaoEditando), {
                                        exibicaoProgramada,
                                        tipoExibicaoProgramada,
                                        inicioExibicao,
                                        fimExibicao,
                                        linkYoutubeExibicao: tipoExibicaoProgramada === "youtube"
                                            ? linkYoutubeExibicao
                                            : ""
                                    })

                                    carregarMidias()

                                    setModalExibicaoAberto(false)
                                    setMidiaExibicaoEditando(null)
                                }}
                                className="flex-1 bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-xl font-bold transition"
                            >
                                Salvar exibição
                            </button>

                            <button
                                onClick={() => {
                                    setModalExibicaoAberto(false)
                                    setMidiaExibicaoEditando(null)
                                }}
                                className="flex-1 bg-zinc-800 hover:bg-zinc-700 px-6 py-3 rounded-xl font-bold transition"
                            >
                                Cancelar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}