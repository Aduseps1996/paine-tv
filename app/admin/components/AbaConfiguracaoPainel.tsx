type Props = {
    nomePainel: string
    subtitulo: string
    logo: string
    slogan: string

    mostrarTarjaTv: boolean
    tempoEntradaTarja: number
    tempoVisivelTarja: number
    tempoSaidaTarja: number
    tempoOcultaTarja: number

    setNomePainel: (valor: string) => void
    setSubtitulo: (valor: string) => void
    setLogo: (valor: string) => void
    setSlogan: (valor: string) => void

    setMostrarTarjaTv: (valor: boolean) => void
    setTempoEntradaTarja: (valor: number) => void
    setTempoVisivelTarja: (valor: number) => void
    setTempoSaidaTarja: (valor: number) => void
    setTempoOcultaTarja: (valor: number) => void
    

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
    tempoOcultaTarja,
    setTempoOcultaTarja,
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