type Props = {
    nomePainel: string
    subtitulo: string
    logo: string
    slogan: string

    mostrarTarjaTv: boolean
    tempoEntradaTarja: number
    tempoVisivelTarja: number
    tempoSaidaTarja: number

    setNomePainel: (valor: string) => void
    setSubtitulo: (valor: string) => void
    setLogo: (valor: string) => void
    setSlogan: (valor: string) => void

    setMostrarTarjaTv: (valor: boolean) => void
    setTempoEntradaTarja: (valor: number) => void
    setTempoVisivelTarja: (valor: number) => void
    setTempoSaidaTarja: (valor: number) => void

    salvarConfiguracoes: () => void
}

export default function AbaConfiguracaoPainel({
    nomePainel,
    subtitulo,
    logo,
    slogan,
    setNomePainel,
    setSubtitulo,
    setLogo,
    setSlogan,


    mostrarTarjaTv,
    tempoEntradaTarja,
    tempoVisivelTarja,
    tempoSaidaTarja,
    setMostrarTarjaTv,
    setTempoEntradaTarja,
    setTempoVisivelTarja,
    setTempoSaidaTarja,
    salvarConfiguracoes
}: Props) {

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-4xl font-black">
                    Configuração do painel
                </h1>

                <p className="mt-2 text-zinc-400">
                    Defina os textos principais, logo e slogan exibidos na TV.
                </p>
            </div>

            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
                <h2 className="text-2xl font-bold mb-4">
                    Identidade do painel
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                        type="text"
                        placeholder="Nome do painel"
                        value={nomePainel}
                        onChange={(e) => setNomePainel(e.target.value)}
                        className="bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 outline-none"
                    />

                    <input
                        type="text"
                        placeholder="Subtítulo"
                        value={subtitulo}
                        onChange={(e) => setSubtitulo(e.target.value)}
                        className="bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 outline-none"
                    />

                    <input
                        type="text"
                        placeholder="Caminho da logo"
                        value={logo}
                        onChange={(e) => setLogo(e.target.value)}
                        className="bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 outline-none"
                    />

                    <input
                        type="text"
                        placeholder="Slogan do rodapé"
                        value={slogan}
                        onChange={(e) => setSlogan(e.target.value)}
                        className="bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 outline-none"
                    />
                </div>

                <div className="mt-6 border-t border-zinc-800 pt-6">
    <h3 className="text-xl font-bold mb-2">
        Tarja estilo TV
    </h3>

    <p className="text-zinc-400 mb-4">
        Controle o comportamento da tarja superior exibida acima das notícias.
    </p>

    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <label className="flex items-center gap-3 rounded-xl border border-zinc-700 bg-zinc-800 px-4 py-3">
            <input
                type="checkbox"
                checked={mostrarTarjaTv}
                onChange={(e) => setMostrarTarjaTv(e.target.checked)}
            />

            <span className="font-medium">
                Mostrar tarja
            </span>
        </label>

        <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-zinc-300">
                Tempo de entrada
            </label>

            <input
                type="number"
                min="0.2"
                step="0.1"
                value={tempoEntradaTarja}
                onChange={(e) => setTempoEntradaTarja(Number(e.target.value))}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 outline-none"
            />
        </div>

        <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-zinc-300">
                Tempo visível
            </label>

            <input
                type="number"
                min="1"
                step="0.5"
                value={tempoVisivelTarja}
                onChange={(e) => setTempoVisivelTarja(Number(e.target.value))}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 outline-none"
            />
        </div>

        <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-zinc-300">
                Tempo de saída
            </label>

            <input
                type="number"
                min="0.2"
                step="0.1"
                value={tempoSaidaTarja}
                onChange={(e) => setTempoSaidaTarja(Number(e.target.value))}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 outline-none"
            />
        </div>
    </div>
</div>

                <button
                    onClick={salvarConfiguracoes}
                    className="mt-6 bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-xl font-bold"
                >
                    Salvar configurações
                </button>
            </div>
        </div>
    )
}