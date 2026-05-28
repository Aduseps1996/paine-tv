type Props = {
    tamanhoFonteRodape: number
    tamanhoFonteSlogan: number
    tamanhoFonteDataHora: number
    tamanhoFonteHora: number
    tamanhoIconeRodape: number
    tamanhoLogoRodape: number
    alturaBarraSuperior: number
    alturaBarraNoticias: number

    setTamanhoFonteRodape: (valor: number) => void
    setTamanhoFonteSlogan: (valor: number) => void
    setTamanhoFonteDataHora: (valor: number) => void
    setTamanhoFonteHora: (valor: number) => void
    setTamanhoIconeRodape: (valor: number) => void
    setTamanhoLogoRodape: (valor: number) => void
    setAlturaBarraSuperior: (valor: number) => void
    setAlturaBarraNoticias: (valor: number) => void

    salvarConfiguracoes: () => void
}

export default function AbaConfiguracaoTipografia({
    tamanhoFonteRodape,
    tamanhoFonteSlogan,
    tamanhoFonteDataHora,
    tamanhoFonteHora,
    tamanhoIconeRodape,
    tamanhoLogoRodape,
    alturaBarraSuperior,
    alturaBarraNoticias,

    setTamanhoFonteRodape,
    setTamanhoFonteSlogan,
    setTamanhoIconeRodape,
    setTamanhoFonteDataHora,
    setTamanhoFonteHora,
    setTamanhoLogoRodape,
    setAlturaBarraSuperior,
    setAlturaBarraNoticias,

    salvarConfiguracoes
}: Props) {

    return (

        <div className="space-y-6">

            <div>
                <h1 className="text-4xl font-black">
                    Tipografia e medidas
                </h1>

                <p className="mt-2 text-zinc-400">
                    Ajuste tamanhos, alturas e proporções do painel.
                </p>
            </div>

            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">

                <h2 className="text-2xl font-bold mb-6">
                    Configurações visuais
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-zinc-300">
                            Fonte das notícias
                        </label>

                        <input
                            type="number"
                            value={tamanhoFonteRodape}
                            onChange={(e) =>
                                setTamanhoFonteRodape(Number(e.target.value))
                            }
                            className="bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 w-full outline-none"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-zinc-300">
                            Fonte do slogan
                        </label>

                        <input
                            type="number"
                            placeholder="Fonte slogan"
                            value={tamanhoFonteSlogan}
                            onChange={(e) =>
                                setTamanhoFonteSlogan(Number(e.target.value))
                            }
                            className="bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 w-full outline-none"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-zinc-300">
                            Tamanho ícones rodapé
                        </label>

                        <input
                            type="number"
                            placeholder="Tamanho ícones"
                            value={tamanhoIconeRodape}
                            onChange={(e) =>
                                setTamanhoIconeRodape(Number(e.target.value))
                            }
                            className="bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 w-full outline-none"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-zinc-300">
                            Fonte da data e hora
                        </label>

                        <input
                            type="number"
                            placeholder="Fonte data"
                            value={tamanhoFonteDataHora}
                            onChange={(e) =>
                                setTamanhoFonteDataHora(Number(e.target.value))
                            }
                            className="bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 w-full outline-none"
                        />
                    </div>
                    
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-zinc-300">
                            Fonte da hora
                        </label>

                        <input
                            type="number"
                            placeholder="Fonte hora"
                            value={tamanhoFonteHora}
                            onChange={(e) =>
                                setTamanhoFonteHora(Number(e.target.value))
                            }
                            className="bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 w-full outline-none"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-zinc-300">
                            Tamanho logo rodapé
                        </label>

                        <input
                            type="number"
                            placeholder="Tamanho logo rodapé"
                            value={tamanhoLogoRodape}
                            onChange={(e) =>
                                setTamanhoLogoRodape(Number(e.target.value))
                            }
                            className="bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 w-full outline-none"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-zinc-300">
                            Altura barra superior
                        </label>

                        <input
                            type="number"
                            placeholder="Altura barra superior"
                            value={alturaBarraSuperior}
                            onChange={(e) =>
                                setAlturaBarraSuperior(Number(e.target.value))
                            }
                            className="bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 w-full outline-none"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-zinc-300">
                            Altura barra notícias
                        </label>

                        <input
                            type="number"
                            placeholder="Altura barra notícias"
                            value={alturaBarraNoticias}
                            onChange={(e) =>
                                setAlturaBarraNoticias(Number(e.target.value))
                            }
                            className="bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 w-full outline-none"
                        />
                    </div>

                </div>

                <button
                    onClick={salvarConfiguracoes}
                    className="mt-6 bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-xl font-bold"
                >
                    Salvar tipografia
                </button>

            </div>

        </div>

    )

}