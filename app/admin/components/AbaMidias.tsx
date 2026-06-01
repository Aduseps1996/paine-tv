import { doc, updateDoc } from "firebase/firestore"

type Props = {
    midias: any[]
    arquivo: string
    tipo: "imagem" | "video"
    template: "cheio" | "informativo" | "institucional" | "urgente"

    tituloMidia: string
    subtituloMidia: string
    rodapeMidia: string
    qrcodeMidia: string
    categoriaMidia: string
    ctaMidia: string

    mostrarTarjaMidia: boolean
    tarjaEtiquetaMidia: string
    tarjaTituloMidia: string
    tarjaSubtituloMidia: string
    tempoEntradaTarjaMidia: number
    tempoVisivelTarjaMidia: number
    tempoSaidaTarjaMidia: number

    setArquivo: (valor: string) => void
    setTipo: (valor: "imagem" | "video") => void
    setTemplate: (valor: "cheio" | "informativo" | "institucional" | "urgente") => void

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

    db: any
}

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

    setMostrarTarjaMidia,
    setTarjaEtiquetaMidia,
    setTarjaTituloMidia,
    setTarjaSubtituloMidia,
    setTempoEntradaTarjaMidia,
    setTempoVisivelTarjaMidia,
    setTempoSaidaTarjaMidia,

    db
}: Props) {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-4xl font-black">
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

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <input
                        type="text"
                        placeholder="URL da imagem ou vídeo"
                        className="bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 outline-none"
                        value={arquivo}
                        onChange={(e) => setArquivo(e.target.value)}
                    />

                    <select
                        value={tipo}
                        onChange={(e) =>
                            setTipo(e.target.value as "imagem" | "video")
                        }
                        className="bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 outline-none"
                    >
                        <option value="imagem">imagem</option>
                        <option value="video">video</option>
                    </select>

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

  

                    <button
                        onClick={adicionarMidia}
                        className="bg-blue-600 hover:bg-blue-700 transition rounded-xl font-bold"
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
                                className="bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 outline-none resize-none min-h-[120px]"
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

            <div className="mt-6 border-t border-zinc-800 pt-6">
    <h3 className="text-xl font-bold mb-4">
        Tarja da TV
    </h3>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        <label className="flex items-center gap-3 rounded-xl border border-zinc-700 bg-zinc-800 px-4 py-3">
            <input
                type="checkbox"
                checked={mostrarTarjaMidia}
                onChange={(e) => setMostrarTarjaMidia(e.target.checked)}
            />

            <span>Mostrar tarja neste banner</span>
        </label>

        <input
            type="text"
            placeholder="Etiqueta da tarja"
            value={tarjaEtiquetaMidia}
            onChange={(e) => setTarjaEtiquetaMidia(e.target.value)}
            className="bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 outline-none"
        />

        <input
            type="text"
            placeholder="Título da tarja"
            value={tarjaTituloMidia}
            onChange={(e) => setTarjaTituloMidia(e.target.value)}
            className="bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 outline-none"
        />

        <input
            type="text"
            placeholder="Subtítulo da tarja"
            value={tarjaSubtituloMidia}
            onChange={(e) => setTarjaSubtituloMidia(e.target.value)}
            className="bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 outline-none"
        />

        <input
            type="number"
            placeholder="Tempo entrada (s)"
            value={tempoEntradaTarjaMidia}
            onChange={(e) =>
                setTempoEntradaTarjaMidia(Number(e.target.value))
            }
            className="bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 outline-none"
        />

        <input
            type="number"
            placeholder="Tempo visível (s)"
            value={tempoVisivelTarjaMidia}
            onChange={(e) =>
                setTempoVisivelTarjaMidia(Number(e.target.value))
            }
            className="bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 outline-none"
        />

        <input
            type="number"
            placeholder="Tempo saída (s)"
            value={tempoSaidaTarjaMidia}
            onChange={(e) =>
                setTempoSaidaTarjaMidia(Number(e.target.value))
            }
            className="bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 outline-none"
        />

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

                <div className="space-y-4">
                    {midias.map((midia) => (
                        <div
                            key={midia.id}
                            className="rounded-2xl border border-zinc-700 bg-zinc-800/80 p-5 shadow-lg"
                        >
                            <div className="flex items-center gap-2 mb-3">
                                <div
                                    className={`w-3 h-3 rounded-full ${
                                        midia.ativo ? "bg-green-500" : "bg-red-500"
                                    }`}
                                />

                                <span
                                    className={`rounded-full px-3 py-1 text-xs font-bold ${
                                        midia.ativo
                                            ? "bg-green-500/15 text-green-400"
                                            : "bg-red-500/15 text-red-400"
                                    }`}
                                >
                                    {midia.ativo ? "Ativo" : "Inativo"}
                                </span>
                            </div>

                            <p className="font-bold">
                                {midia.tipo.toUpperCase()}
                            </p>

                            <p className="text-zinc-400 text-sm break-all">
                                {midia.arquivo}
                            </p>

                            <div className="mt-3 overflow-hidden rounded-2xl border border-zinc-700 bg-black">
                                {midia.tipo === "imagem" ? (
                                    <img
                                        src={midia.arquivo}
                                        alt="Prévia da mídia"
                                        className="h-48 w-full object-cover transition duration-500 hover:scale-105"
                                    />
                                ) : (
                                    <video
                                        src={midia.arquivo}
                                        controls
                                        muted
                                        className="h-48 w-full object-cover"
                                    />
                                )}
                            </div>

                            <p className="text-zinc-500 text-xs mt-2">
                                Ordem: {midia.ordem} | Duração: {midia.duracao}s
                            </p>

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

                            <div className="mt-4 flex flex-wrap gap-3">
                                <button
                                    onClick={() =>
                                        midia.id && alternarMidia(midia.id, midia.ativo)
                                    }
                                    className={`rounded-lg px-4 py-2 text-sm font-bold transition ${
                                        midia.ativo
                                            ? "bg-yellow-600 hover:bg-yellow-700"
                                            : "bg-green-600 hover:bg-green-700"
                                    }`}
                                >
                                    {midia.ativo ? "Desativar" : "Ativar"}
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
        </div>
    )
}