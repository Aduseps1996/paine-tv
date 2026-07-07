import type { ModeloTarja } from "@/types/painel"

type Props = {
    mostrarTarjaMidia: boolean
    setMostrarTarjaMidia: (valor: boolean) => void

    modeloTarjaMidia: ModeloTarja
    setModeloTarjaMidia: (valor: ModeloTarja) => void

    tarjaEtiquetaMidia: string
    setTarjaEtiquetaMidia: (valor: string) => void

    tarjaTituloMidia: string
    setTarjaTituloMidia: (valor: string) => void

    tarjaSubtituloMidia: string
    setTarjaSubtituloMidia: (valor: string) => void

    tarjaQrcodeMidia: string
    setTarjaQrcodeMidia: (valor: string) => void

    tempoEntradaTarjaMidia: number
    setTempoEntradaTarjaMidia: (valor: number) => void

    tempoVisivelTarjaMidia: number
    setTempoVisivelTarjaMidia: (valor: number) => void

    tempoSaidaTarjaMidia: number
    setTempoSaidaTarjaMidia: (valor: number) => void

    tempoOcultaTarjaMidia: number
    setTempoOcultaTarjaMidia: (valor: number) => void

    tempoInicialTarjaMidia: number
    setTempoInicialTarjaMidia: (valor: number) => void

    onSalvar: () => void
    onCancelar: () => void
}

export default function PainelTarja({
    mostrarTarjaMidia,
    setMostrarTarjaMidia,
    modeloTarjaMidia,
    setModeloTarjaMidia,
    tarjaEtiquetaMidia,
    setTarjaEtiquetaMidia,
    tarjaTituloMidia,
    setTarjaTituloMidia,
    tarjaSubtituloMidia,
    setTarjaSubtituloMidia,
    tarjaQrcodeMidia,
    setTarjaQrcodeMidia,
    tempoEntradaTarjaMidia,
    setTempoEntradaTarjaMidia,
    tempoVisivelTarjaMidia,
    setTempoVisivelTarjaMidia,
    tempoSaidaTarjaMidia,
    setTempoSaidaTarjaMidia,
    tempoOcultaTarjaMidia,
    setTempoOcultaTarjaMidia,
    tempoInicialTarjaMidia,
    setTempoInicialTarjaMidia,
    onSalvar,
    onCancelar
}: Props) {
    const usaEtiqueta =
        modeloTarjaMidia === "telejornal" ||
        modeloTarjaMidia === "compacta" ||
        modeloTarjaMidia === "live"

    const usaSubtitulo =
        modeloTarjaMidia === "telejornal" ||
        modeloTarjaMidia === "digital"

    const usaQrcode =
        modeloTarjaMidia === "telejornal" ||
        modeloTarjaMidia === "live" ||
        modeloTarjaMidia === "digital"

    const usaOculta =
        modeloTarjaMidia === "telejornal" ||
        modeloTarjaMidia === "infobar" ||
        modeloTarjaMidia === "digital"

    return (
        <div className="mt-5 rounded-[26px] border border-white/10 bg-white/[0.03] p-5">
            <div className="mb-5">
                <div className="inline-flex rounded-full border border-sky-400/25 bg-sky-500/10 px-3 py-1 text-[11px] font-black uppercase tracking-[0.28em] text-sky-300">
                    Tarja
                </div>

                <h3 className="mt-3 text-xl font-black">
                    Configurar tarja
                </h3>

                <p className="mt-2 text-sm leading-relaxed text-zinc-400">
                    Escolha o modelo da tarja primeiro. Os campos abaixo mudam conforme o modelo selecionado.
                </p>
            </div>

            <div className="space-y-4">
                <label className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-zinc-950/60 px-4 py-4">
                    <div>
                        <p className="font-bold text-white">
                            Mostrar tarja nesta mídia
                        </p>

                        <p className="mt-1 text-sm text-zinc-400">
                            A tarja só aparece na TV depois da publicação.
                        </p>
                    </div>

                    <input
                        type="checkbox"
                        checked={mostrarTarjaMidia}
                        onChange={(e) => setMostrarTarjaMidia(e.target.checked)}
                    />
                </label>

                <div>
                    <label className="mb-2 block text-sm font-bold text-zinc-300">
                        Modelo da tarja
                    </label>

                    <select
                        value={modeloTarjaMidia}
                        onChange={(e) =>
                            setModeloTarjaMidia(e.target.value as ModeloTarja)
                        }
                    >
                        <option value="telejornal">Telejornal</option>
                        <option value="compacta">Compacta</option>
                        <option value="live">Live News</option>
                        <option value="infobar">Barra Informativa</option>
                        <option value="digital">Digital Sign</option>
                    </select>
                </div>

                {usaEtiqueta && (
                    <div>
                        <label className="mb-2 block text-sm font-bold text-zinc-300">
                            Etiqueta
                        </label>

                        <input
                            type="text"
                            placeholder="Ex: ADUSEPS INFORMA"
                            value={tarjaEtiquetaMidia}
                            onChange={(e) => setTarjaEtiquetaMidia(e.target.value)}
                        />
                    </div>
                )}

                <div>
                    <label className="mb-2 block text-sm font-bold text-zinc-300">
                        {modeloTarjaMidia === "infobar"
                            ? "Texto da barra"
                            : "Título"}
                    </label>

                    <input
                        type="text"
                        placeholder={
                            modeloTarjaMidia === "infobar"
                                ? "Texto principal da barra"
                                : "Título da tarja"
                        }
                        value={tarjaTituloMidia}
                        onChange={(e) => setTarjaTituloMidia(e.target.value)}
                    />
                </div>

                {usaSubtitulo && (
                    <div>
                        <label className="mb-2 block text-sm font-bold text-zinc-300">
                            Subtítulo
                        </label>

                        <input
                            type="text"
                            placeholder="Subtítulo da tarja"
                            value={tarjaSubtituloMidia}
                            onChange={(e) => setTarjaSubtituloMidia(e.target.value)}
                        />
                    </div>
                )}

                {usaQrcode && (
                    <div>
                        <label className="mb-2 block text-sm font-bold text-zinc-300">
                            Link para QR Code
                        </label>

                        <input
                            type="text"
                            placeholder="https://..."
                            value={tarjaQrcodeMidia}
                            onChange={(e) => setTarjaQrcodeMidia(e.target.value)}
                        />
                    </div>
                )}

                <div className="rounded-2xl border border-white/10 bg-zinc-950/60 p-4">
                    <p className="text-sm font-black uppercase tracking-[0.22em] text-zinc-400">
                        Tempos
                    </p>

                    <div className="mt-4 grid gap-4 sm:grid-cols-2">
                        <div>
                            <label className="mb-2 block text-sm font-bold text-zinc-300">
                                Entrada (s)
                            </label>

                            <input
                                type="number"
                                min="0.2"
                                step="0.1"
                                value={tempoEntradaTarjaMidia}
                                onChange={(e) =>
                                    setTempoEntradaTarjaMidia(Number(e.target.value))
                                }
                            />
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-bold text-zinc-300">
                                Visível (s)
                            </label>

                            <input
                                type="number"
                                min="1"
                                step="0.5"
                                value={tempoVisivelTarjaMidia}
                                onChange={(e) =>
                                    setTempoVisivelTarjaMidia(Number(e.target.value))
                                }
                            />
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-bold text-zinc-300">
                                Saída (s)
                            </label>

                            <input
                                type="number"
                                min="0.2"
                                step="0.1"
                                value={tempoSaidaTarjaMidia}
                                onChange={(e) =>
                                    setTempoSaidaTarjaMidia(Number(e.target.value))
                                }
                            />
                        </div>

                        {usaOculta && (
                            <div>
                                <label className="mb-2 block text-sm font-bold text-zinc-300">
                                    Oculta (s)
                                </label>

                                <input
                                    type="number"
                                    min="0"
                                    step="1"
                                    value={tempoOcultaTarjaMidia}
                                    onChange={(e) =>
                                        setTempoOcultaTarjaMidia(Number(e.target.value))
                                    }
                                />
                            </div>
                        )}

                        <div>
                            <label className="mb-2 block text-sm font-bold text-zinc-300">
                                Primeira aparição (s)
                            </label>

                            <input
                                type="number"
                                min="0"
                                step="0.5"
                                value={tempoInicialTarjaMidia}
                                onChange={(e) =>
                                    setTempoInicialTarjaMidia(Number(e.target.value))
                                }
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-5 flex flex-wrap gap-3">
                <button
                    type="button"
                    onClick={onSalvar}
                    className="rounded-2xl border border-sky-300/20 bg-sky-500 px-5 py-3 text-sm font-black text-white shadow-[0_14px_35px_rgba(14,165,233,0.22)]"
                >
                    Salvar no rascunho
                </button>

                <button
                    type="button"
                    onClick={onCancelar}
                    className="rounded-2xl border border-zinc-700 bg-zinc-900/80 px-5 py-3 text-sm font-bold text-zinc-200"
                >
                    Fechar
                </button>
            </div>
        </div>
    )
}