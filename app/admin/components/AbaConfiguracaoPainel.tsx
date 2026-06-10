type ModoLogo = "transparente" | "fundo" | "card"
type TamanhoLogo = "pequeno" | "medio" | "grande"

type Props = {
    nomePainel: string
    subtitulo: string
    logo: string
    slogan: string

    modoLogo: ModoLogo
    tamanhoLogoPainel: TamanhoLogo

    tempoEntradaTarja: number
    tempoVisivelTarja: number
    tempoSaidaTarja: number
    tempoOcultaTarja: number

    setNomePainel: (valor: string) => void
    setSubtitulo: (valor: string) => void
    setLogo: (valor: string) => void
    setSlogan: (valor: string) => void

    setModoLogo: (valor: ModoLogo) => void
    setTamanhoLogoPainel: (valor: TamanhoLogo) => void

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

    modoLogo,
    tamanhoLogoPainel,

    tempoEntradaTarja,
    tempoVisivelTarja,
    tempoSaidaTarja,
    tempoOcultaTarja,

    setNomePainel,
    setSubtitulo,
    setLogo,
    setSlogan,

    setModoLogo,
    setTamanhoLogoPainel,

    setTempoEntradaTarja,
    setTempoVisivelTarja,
    setTempoSaidaTarja,
    setTempoOcultaTarja,

    salvarConfiguracoes
}: Props) {
    const alturaLogoPreview =
        tamanhoLogoPainel === "pequeno"
            ? "h-10"
            : tamanhoLogoPainel === "grande"
                ? "h-20"
                : "h-14"

    const classeLogoPreview =
        modoLogo === "transparente"
            ? "bg-transparent p-0"
            : modoLogo === "card"
                ? "bg-white/10 border border-white/15 p-3 rounded-2xl"
                : "bg-white p-3 rounded-2xl"

    return (
        <div className="space-y-4 sm:space-y-6">
            <div>
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-black">
                    Configuração do painel
                </h1>

                <p className="mt-2 text-zinc-400">
                    Configure separadamente topo, logo, rodapé e tarjas da TV.
                </p>
            </div>

            {/* TOPO */}
            <section className="rounded-2xl border border-zinc-800 bg-zinc-900 p-4 sm:p-6">
                <h2 className="text-xl sm:text-2xl font-bold">
                    Topo da TV
                </h2>

                <p className="mt-1 mb-5 text-sm text-zinc-400">
                    Informações principais exibidas na parte superior do painel.
                </p>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                        <label className="mb-2 block text-sm font-bold text-zinc-300">
                            Nome do painel
                        </label>

                        <input
                            type="text"
                            value={nomePainel}
                            onChange={(e) => setNomePainel(e.target.value)}
                            className="w-full rounded-xl border border-zinc-700 bg-zinc-800 px-4 py-3 outline-none"
                            placeholder="Ex: ADUSEPS"
                        />
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-bold text-zinc-300">
                            Subtítulo
                        </label>

                        <input
                            type="text"
                            value={subtitulo}
                            onChange={(e) => setSubtitulo(e.target.value)}
                            className="w-full rounded-xl border border-zinc-700 bg-zinc-800 px-4 py-3 outline-none"
                            placeholder="Ex: Painel Institucional"
                        />
                    </div>
                </div>
            </section>

            {/* LOGO */}
            <section className="rounded-2xl border border-zinc-800 bg-zinc-900 p-4 sm:p-6">
                <h2 className="text-xl sm:text-2xl font-bold">
                    Logo
                </h2>

                <p className="mt-1 mb-5 text-sm text-zinc-400">
                    Controle como a logo será exibida no painel.
                </p>

                <div className="space-y-5">
                    <div>
                        <label className="mb-2 block text-sm font-bold text-zinc-300">
                            URL ou caminho da logo
                        </label>

                        <input
                            type="text"
                            value={logo}
                            onChange={(e) => setLogo(e.target.value)}
                            className="w-full rounded-xl border border-zinc-700 bg-zinc-800 px-4 py-3 outline-none"
                            placeholder="https://... ou /logo.png"
                        />
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-bold text-zinc-300">
                            Modo da logo
                        </label>

                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                            <button
                                type="button"
                                onClick={() => setModoLogo("transparente")}
                                className={`rounded-xl px-4 py-3 font-bold transition ${
                                    modoLogo === "transparente"
                                        ? "bg-blue-600 text-white"
                                        : "border border-zinc-700 bg-zinc-800 text-white"
                                }`}
                            >
                                Sem fundo
                            </button>

                            <button
                                type="button"
                                onClick={() => setModoLogo("fundo")}
                                className={`rounded-xl px-4 py-3 font-bold transition ${
                                    modoLogo === "fundo"
                                        ? "bg-blue-600 text-white"
                                        : "border border-zinc-700 bg-zinc-800 text-white"
                                }`}
                            >
                                Fundo branco
                            </button>

                            <button
                                type="button"
                                onClick={() => setModoLogo("card")}
                                className={`rounded-xl px-4 py-3 font-bold transition ${
                                    modoLogo === "card"
                                        ? "bg-blue-600 text-white"
                                        : "border border-zinc-700 bg-zinc-800 text-white"
                                }`}
                            >
                                Card discreto
                            </button>
                        </div>
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-bold text-zinc-300">
                            Tamanho da logo
                        </label>

                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                            <button
                                type="button"
                                onClick={() => setTamanhoLogoPainel("pequeno")}
                                className={`rounded-xl px-4 py-3 font-bold transition ${
                                    tamanhoLogoPainel === "pequeno"
                                        ? "bg-blue-600 text-white"
                                        : "border border-zinc-700 bg-zinc-800 text-white"
                                }`}
                            >
                                Pequena
                            </button>

                            <button
                                type="button"
                                onClick={() => setTamanhoLogoPainel("medio")}
                                className={`rounded-xl px-4 py-3 font-bold transition ${
                                    tamanhoLogoPainel === "medio"
                                        ? "bg-blue-600 text-white"
                                        : "border border-zinc-700 bg-zinc-800 text-white"
                                }`}
                            >
                                Média
                            </button>

                            <button
                                type="button"
                                onClick={() => setTamanhoLogoPainel("grande")}
                                className={`rounded-xl px-4 py-3 font-bold transition ${
                                    tamanhoLogoPainel === "grande"
                                        ? "bg-blue-600 text-white"
                                        : "border border-zinc-700 bg-zinc-800 text-white"
                                }`}
                            >
                                Grande
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* RODAPÉ */}
            <section className="rounded-2xl border border-zinc-800 bg-zinc-900 p-4 sm:p-6">
                <h2 className="text-xl sm:text-2xl font-bold">
                    Rodapé
                </h2>

                <p className="mt-1 mb-5 text-sm text-zinc-400">
                    Texto institucional fixo usado como slogan do painel.
                </p>

                <div>
                    <label className="mb-2 block text-sm font-bold text-zinc-300">
                        Slogan do rodapé
                    </label>

                    <input
                        type="text"
                        value={slogan}
                        onChange={(e) => setSlogan(e.target.value)}
                        className="w-full rounded-xl border border-zinc-700 bg-zinc-800 px-4 py-3 outline-none"
                        placeholder="Ex: Informação e compromisso com o associado"
                    />
                </div>
            </section>

            {/* TARJA */}
            <section className="rounded-2xl border border-zinc-800 bg-zinc-900 p-4 sm:p-6">
                <h2 className="text-xl sm:text-2xl font-bold">
                    Padrão das tarjas
                </h2>

                <p className="mt-1 mb-5 text-sm text-zinc-400">
                    Esses tempos serão usados automaticamente pelas mídias que possuírem tarja ativa e não tiverem tempos próprios configurados.
                </p>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                        <label className="mb-2 block text-sm font-bold text-zinc-300">
                            Tempo de entrada
                        </label>

                        <input
                            type="number"
                            min={0}
                            value={tempoEntradaTarja}
                            onChange={(e) => setTempoEntradaTarja(Number(e.target.value))}
                            className="w-full rounded-xl border border-zinc-700 bg-zinc-800 px-4 py-3 outline-none"
                        />
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-bold text-zinc-300">
                            Tempo visível
                        </label>

                        <input
                            type="number"
                            min={1}
                            value={tempoVisivelTarja}
                            onChange={(e) => setTempoVisivelTarja(Number(e.target.value))}
                            className="w-full rounded-xl border border-zinc-700 bg-zinc-800 px-4 py-3 outline-none"
                        />
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-bold text-zinc-300">
                            Tempo de saída
                        </label>

                        <input
                            type="number"
                            min={0}
                            value={tempoSaidaTarja}
                            onChange={(e) => setTempoSaidaTarja(Number(e.target.value))}
                            className="w-full rounded-xl border border-zinc-700 bg-zinc-800 px-4 py-3 outline-none"
                        />
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-bold text-zinc-300">
                            Tempo oculta
                        </label>

                        <input
                            type="number"
                            min={0}
                            value={tempoOcultaTarja}
                            onChange={(e) => setTempoOcultaTarja(Number(e.target.value))}
                            className="w-full rounded-xl border border-zinc-700 bg-zinc-800 px-4 py-3 outline-none"
                        />
                    </div>
                </div>
            </section>

            {/* PRÉVIA */}
            <section className="rounded-2xl border border-zinc-800 bg-zinc-900 p-4 sm:p-6">
                <h2 className="text-xl sm:text-2xl font-bold">
                    Prévia rápida
                </h2>

                <div className="mt-5 overflow-hidden rounded-2xl border border-white/10 bg-[#071633] p-5">
                    <div className="flex items-center gap-4">
                        {logo.trim() !== "" && (
                            <div className={classeLogoPreview}>
                                <img
                                    src={logo}
                                    alt="Prévia da logo"
                                    className={`${alturaLogoPreview} w-auto object-contain`}
                                />
                            </div>
                        )}

                        <div className="min-w-0">
                            <h3 className="truncate text-2xl font-black text-white">
                                {nomePainel || "Nome do painel"}
                            </h3>

                            <p className="truncate text-sm font-semibold text-white/65">
                                {subtitulo || "Subtítulo do painel"}
                            </p>
                        </div>
                    </div>

                    <div className="mt-5 rounded-xl bg-[#183b78] px-4 py-3">
                        <p className="truncate font-bold text-white">
                            {slogan || "Slogan do rodapé"}
                        </p>
                    </div>
                </div>
            </section>

            <button
                onClick={salvarConfiguracoes}
                className="w-full rounded-xl bg-blue-600 px-6 py-4 font-bold transition hover:bg-blue-700 sm:w-auto"
            >
                Salvar configurações do painel
            </button>
        </div>
    )
}