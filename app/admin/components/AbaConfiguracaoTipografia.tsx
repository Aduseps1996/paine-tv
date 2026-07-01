type Props = {
    tamanhoFonteRodape: number
    tamanhoFonteSlogan: number
    tamanhoFonteHora: number
    alturaBarraNoticias: number
    duracaoAnimacaoNoticias: number

    setTamanhoFonteRodape: (valor: number) => void
    setTamanhoFonteSlogan: (valor: number) => void
    setTamanhoFonteHora: (valor: number) => void
    setAlturaBarraNoticias: (valor: number) => void
    setDuracaoAnimacaoNoticias: (valor: number) => void

    salvarConfiguracoes: () => void
}

export default function AbaConfiguracaoTipografia({
    tamanhoFonteRodape,
    tamanhoFonteSlogan,
    tamanhoFonteHora,
    alturaBarraNoticias,
    duracaoAnimacaoNoticias,

    setTamanhoFonteRodape,
    setTamanhoFonteSlogan,
    setTamanhoFonteHora,
    setAlturaBarraNoticias,
    setDuracaoAnimacaoNoticias,

    salvarConfiguracoes
}: Props) {
    return (
        <div className="space-y-4 sm:space-y-6">
            <div className="rounded-[24px] border border-white/10 bg-white/[0.03] p-4 shadow-[0_16px_40px_rgba(0,0,0,0.18)] sm:p-6">
                <div className="inline-flex rounded-full border border-sky-400/25 bg-sky-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.3em] text-sky-300">
                    Estilo
                </div>
                <h1 className="mt-3 text-2xl sm:text-3xl md:text-4xl font-black tracking-tight">
                    Tipografia e medidas
                </h1>

                <p className="mt-2 max-w-2xl text-sm text-zinc-400 sm:text-base">
                    Ajuste o tamanho dos textos, altura do rodapé e velocidade das notícias.
                </p>
            </div>

            <div className="rounded-[28px] border border-white/10 bg-zinc-900/80 p-5 shadow-[0_20px_50px_rgba(0,0,0,0.24)] backdrop-blur-sm sm:p-6">
                <h2 className="mb-6 text-xl sm:text-2xl font-bold">
                    Configurações do rodapé
                </h2>

                <div className="grid grid-cols-1 gap-5">
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-zinc-300">
                            Fonte das notícias
                        </label>

                        <input
                            type="range"
                            min={12}
                            max={80}
                            value={tamanhoFonteRodape}
                            onChange={(e) =>
                                setTamanhoFonteRodape(Number(e.target.value))
                            }
                            className="w-full"
                        />

                        <input
                            type="number"
                            min={12}
                            max={80}
                            value={tamanhoFonteRodape}
                            onChange={(e) =>
                                setTamanhoFonteRodape(Number(e.target.value))
                            }
                            className="w-full rounded-xl border border-zinc-700 bg-zinc-800 px-4 py-3 outline-none"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-bold text-zinc-300">
                            Altura da barra de notícias
                        </label>

                        <input
                            type="range"
                            min={30}
                            max={100}
                            value={alturaBarraNoticias}
                            onChange={(e) =>
                                setAlturaBarraNoticias(Number(e.target.value))
                            }
                            className="w-full"
                        />

                        <input
                            type="number"
                            min={30}
                            max={100}
                            value={alturaBarraNoticias}
                            onChange={(e) =>
                                setAlturaBarraNoticias(Number(e.target.value))
                            }
                            className="w-full rounded-xl border border-zinc-700 bg-zinc-800 px-4 py-3 outline-none"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-bold text-zinc-300">
                            Fonte da tarja / slogan
                        </label>

                        <input
                            type="range"
                            min={12}
                            max={60}
                            value={tamanhoFonteSlogan}
                            onChange={(e) =>
                                setTamanhoFonteSlogan(Number(e.target.value))
                            }
                            className="w-full"
                        />

                        <input
                            type="number"
                            min={12}
                            max={60}
                            value={tamanhoFonteSlogan}
                            onChange={(e) =>
                                setTamanhoFonteSlogan(Number(e.target.value))
                            }
                            className="w-full rounded-xl border border-zinc-700 bg-zinc-800 px-4 py-3 outline-none"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-bold text-zinc-300">
                            Fonte da hora
                        </label>

                        <input
                            type="range"
                            min={12}
                            max={70}
                            value={tamanhoFonteHora}
                            onChange={(e) =>
                                setTamanhoFonteHora(Number(e.target.value))
                            }
                            className="w-full"
                        />

                        <input
                            type="number"
                            min={12}
                            max={70}
                            value={tamanhoFonteHora}
                            onChange={(e) =>
                                setTamanhoFonteHora(Number(e.target.value))
                            }
                            className="w-full rounded-xl border border-zinc-700 bg-zinc-800 px-4 py-3 outline-none"
                        />
                    </div>

                    <div className="space-y-3 rounded-2xl border border-zinc-800 bg-zinc-950 p-4">
                        <label className="text-sm font-bold text-zinc-300">
                            Velocidade das notícias
                        </label>

                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                            <button
                                type="button"
                                onClick={() => setDuracaoAnimacaoNoticias(180)}
                                className={`rounded-xl px-4 py-3 font-bold transition ${
                                    duracaoAnimacaoNoticias === 180
                                        ? "bg-blue-600 text-white"
                                        : "border border-zinc-700 bg-zinc-800 text-white"
                                }`}
                            >
                                Lenta
                            </button>

                            <button
                                type="button"
                                onClick={() => setDuracaoAnimacaoNoticias(150)}
                                className={`rounded-xl px-4 py-3 font-bold transition ${
                                    duracaoAnimacaoNoticias === 150
                                        ? "bg-blue-600 text-white"
                                        : "border border-zinc-700 bg-zinc-800 text-white"
                                }`}
                            >
                                Normal
                            </button>

                            <button
                                type="button"
                                onClick={() => setDuracaoAnimacaoNoticias(120)}
                                className={`rounded-xl px-4 py-3 font-bold transition ${
                                    duracaoAnimacaoNoticias === 120
                                        ? "bg-blue-600 text-white"
                                        : "border border-zinc-700 bg-zinc-800 text-white"
                                }`}
                            >
                                Rápida
                            </button>
                        </div>

                        <input
                            type="number"
                            min={60}
                            max={300}
                            value={duracaoAnimacaoNoticias}
                            onChange={(e) =>
                                setDuracaoAnimacaoNoticias(Number(e.target.value))
                            }
                            className="w-full rounded-xl border border-zinc-700 bg-zinc-800 px-4 py-3 outline-none"
                        />

                        <p className="text-xs text-zinc-500">
                            Quanto maior o número, mais devagar as notícias passam.
                        </p>
                    </div>

                    <div className="overflow-hidden rounded-2xl border border-zinc-700 bg-[#183b78]/95 py-4">
                        <div
                            className="whitespace-nowrap font-bold text-white"
                            style={{
                                fontSize: `${tamanhoFonteRodape}px`
                            }}
                        >
                            <span className="mx-8">
                                Prévia do rodapé de notícias da ADUSEPS
                            </span>

                            <span className="mx-6 text-[#f15434]">•</span>

                            <span className="mx-8">
                                Velocidade: {duracaoAnimacaoNoticias}s
                            </span>
                        </div>
                    </div>
                </div>

                <button
                    onClick={salvarConfiguracoes}
                    className="mt-6 w-full rounded-2xl bg-gradient-to-r from-sky-500 to-blue-600 px-6 py-4 font-semibold text-white shadow-lg shadow-sky-500/20 transition hover:brightness-110 sm:w-auto"
                >
                    Salvar tipografia
                </button>
            </div>
        </div>
    )
}