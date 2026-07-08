import { useState } from "react"

import type {
    Midia,
    ModeloTarja,
    ModoExibicaoMidia,
    TemplateMidia,
    TipoMidia
} from "@/types/painel"

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

    const ehYoutube = tipo === "youtube"

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

    function salvarNoRascunho() {
        if (!arquivo.trim()) {
            alert("Informe o arquivo/link da mídia.")
            return
        }

        if (ehYoutube && (!inicioExibicao || !fimExibicao)) {
            alert("YouTube/Live precisa de início e fim de exibição.")
            return
        }

        const novaMidia: Midia = {
            id: `draft-${Date.now()}`,
            tipo,
            arquivo: arquivo.trim(),
            ativo: true,
            ordem: midias.length + 1,
            duracao: 8,
            pesoExibicao: 1,
            template: ehYoutube ? "cheio" : template,
            modoExibicao,
            titulo: titulo.trim(),
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
            tempoInicialTarja
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
                                <input
                                    type="text"
                                    placeholder={ehYoutube ? "Link do YouTube / Live" : "URL da imagem ou vídeo"}
                                    value={arquivo}
                                    onChange={(e) => setArquivo(e.target.value)}
                                    className="sm:col-span-2"
                                />

                                <select
                                    value={tipo}
                                    onChange={(e) => {
                                        const novoTipo = e.target.value as TipoMidia
                                        setTipo(novoTipo)

                                        if (novoTipo === "youtube") {
                                            setTemplate("cheio")
                                            setProgramarExibicao(true)
                                        }
                                    }}
                                >
                                    <option value="imagem">Imagem</option>
                                    <option value="video">Vídeo</option>
                                    <option value="youtube">YouTube / Live</option>
                                </select>

                                {!ehYoutube && (
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

                        {!ehYoutube && (
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
                                <p className="mt-1 font-black">{ehYoutube ? "YouTube / Live" : template}</p>
                            </div>

                            <div className="rounded-2xl border border-white/10 bg-zinc-950/60 p-4">
                                <p className="text-zinc-500">Exibição</p>
                                <p className="mt-1 font-black">{ehYoutube || programarExibicao ? "Programada" : "Contínua"}</p>
                            </div>

                            <div className="rounded-2xl border border-white/10 bg-zinc-950/60 p-4">
                                <p className="text-zinc-500">Tarja</p>
                                <p className="mt-1 font-black">{mostrarTarja ? modeloTarja : "Sem tarja"}</p>
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
