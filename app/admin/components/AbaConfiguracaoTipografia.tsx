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

type ControleNumeroProps = {
    titulo: string
    descricao: string
    valor: number
    minimo: number
    maximo: number
    sufixo: string
    onChange: (valor: number) => void
}

function ControleNumero({
    titulo,
    descricao,
    valor,
    minimo,
    maximo,
    sufixo,
    onChange
}: ControleNumeroProps) {
    return (
        <div className="rounded-[26px] border border-white/10 bg-white/[0.03] p-5">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                    <h3 className="text-xl font-black">
                        {titulo}
                    </h3>

                    <p className="mt-2 text-sm text-zinc-400">
                        {descricao}
                    </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-zinc-950/60 px-4 py-3 text-right">
                    <p className="text-2xl font-black">
                        {valor}
                    </p>

                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-zinc-500">
                        {sufixo}
                    </p>
                </div>
            </div>

            <div className="mt-5">
                <input
                    type="range"
                    min={minimo}
                    max={maximo}
                    value={valor}
                    onChange={(e) => onChange(Number(e.target.value))}
                    className="w-full"
                />

                <div className="mt-2 flex justify-between text-xs font-bold text-zinc-500">
                    <span>{minimo}</span>
                    <span>{maximo}</span>
                </div>
            </div>

            <input
                type="number"
                min={minimo}
                max={maximo}
                value={valor}
                onChange={(e) => onChange(Number(e.target.value))}
                className="mt-4"
            />
        </div>
    )
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
    const velocidadeTexto =
        duracaoAnimacaoNoticias >= 170
            ? "Lenta"
            : duracaoAnimacaoNoticias <= 130
                ? "Rápida"
                : "Normal"

    function classeOpcao(ativa: boolean) {
        return ativa
            ? "border-sky-400/40 bg-sky-500/15 text-white shadow-[0_14px_35px_rgba(14,165,233,0.16)]"
            : "border-white/10 bg-zinc-950/60 text-zinc-300"
    }

    return (
        <div className="space-y-8">
            <section className="rounded-[28px] border border-white/10 bg-gradient-to-br from-white/[0.06] to-white/[0.02] p-5 shadow-[0_20px_60px_rgba(0,0,0,0.22)] sm:p-7">
                <div>
                    <div className="inline-flex rounded-full border border-sky-400/25 bg-sky-500/10 px-3 py-1 text-[11px] font-black uppercase tracking-[0.32em] text-sky-300">
                        Estilo visual
                    </div>

                    <h1 className="mt-4 text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl">
                        Tipografia e medidas
                    </h1>

                    <p className="mt-3 max-w-3xl text-sm leading-relaxed text-zinc-400 sm:text-base">
                        Ajuste fontes, altura do rodapé e velocidade das notícias exibidas na TV.
                    </p>
                </div>
            </section>

            <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                {[
                    {
                        label: "Fonte notícias",
                        value: `${tamanhoFonteRodape}px`,
                        desc: "tamanho do letreiro"
                    },
                    {
                        label: "Fonte slogan",
                        value: `${tamanhoFonteSlogan}px`,
                        desc: "texto institucional"
                    },
                    {
                        label: "Fonte hora",
                        value: `${tamanhoFonteHora}px`,
                        desc: "relógio do painel"
                    },
                    {
                        label: "Rodapé",
                        value: `${alturaBarraNoticias}px`,
                        desc: "altura da barra"
                    }
                ].map((card) => (
                    <div
                        key={card.label}
                        className="rounded-[26px] border border-white/10 bg-zinc-900/80 p-5 shadow-[0_16px_40px_rgba(0,0,0,0.18)]"
                    >
                        <p className="text-xs font-black uppercase tracking-[0.25em] text-zinc-500">
                            {card.label}
                        </p>

                        <div className="mt-4 text-4xl font-black">
                            {card.value}
                        </div>

                        <p className="mt-3 text-sm text-zinc-400">
                            {card.desc}
                        </p>
                    </div>
                ))}
            </section>

            <section className="rounded-[34px] border border-white/10 bg-zinc-900/85 p-5 shadow-[0_24px_70px_rgba(0,0,0,0.32)] backdrop-blur-sm sm:p-7">
                <h2 className="text-2xl font-black sm:text-3xl">
                    Fontes
                </h2>

                <p className="mt-2 text-sm text-zinc-400">
                    Controle o tamanho dos principais textos exibidos na TV.
                </p>

                <div className="mt-6 grid gap-5 xl:grid-cols-3">
                    <ControleNumero
                        titulo="Fonte das notícias"
                        descricao="Tamanho do texto que corre no rodapé."
                        valor={tamanhoFonteRodape}
                        minimo={12}
                        maximo={80}
                        sufixo="px"
                        onChange={setTamanhoFonteRodape}
                    />

                    <ControleNumero
                        titulo="Fonte da tarja / slogan"
                        descricao="Tamanho do texto institucional e chamadas."
                        valor={tamanhoFonteSlogan}
                        minimo={12}
                        maximo={60}
                        sufixo="px"
                        onChange={setTamanhoFonteSlogan}
                    />

                    <ControleNumero
                        titulo="Fonte da hora"
                        descricao="Tamanho do relógio exibido no painel."
                        valor={tamanhoFonteHora}
                        minimo={12}
                        maximo={70}
                        sufixo="px"
                        onChange={setTamanhoFonteHora}
                    />
                </div>
            </section>

            <section className="rounded-[34px] border border-white/10 bg-zinc-900/85 p-5 shadow-[0_24px_70px_rgba(0,0,0,0.32)] backdrop-blur-sm sm:p-7">
                <h2 className="text-2xl font-black sm:text-3xl">
                    Rodapé de notícias
                </h2>

                <p className="mt-2 text-sm text-zinc-400">
                    Defina a altura da barra e a velocidade de passagem das mensagens.
                </p>

                <div className="mt-6 grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(320px,0.8fr)]">
                    <ControleNumero
                        titulo="Altura da barra"
                        descricao="Altura visual do rodapé de notícias."
                        valor={alturaBarraNoticias}
                        minimo={30}
                        maximo={100}
                        sufixo="px"
                        onChange={setAlturaBarraNoticias}
                    />

                    <div className="rounded-[26px] border border-white/10 bg-white/[0.03] p-5">
                        <h3 className="text-xl font-black">
                            Velocidade das notícias
                        </h3>

                        <p className="mt-2 text-sm text-zinc-400">
                            Quanto maior o número, mais devagar as notícias passam.
                        </p>

                        <div className="mt-5 grid gap-3">
                            <button
                                type="button"
                                onClick={() => setDuracaoAnimacaoNoticias(180)}
                                className={`rounded-2xl border px-4 py-4 text-sm font-black ${classeOpcao(duracaoAnimacaoNoticias === 180)}`}
                            >
                                Lenta
                            </button>

                            <button
                                type="button"
                                onClick={() => setDuracaoAnimacaoNoticias(150)}
                                className={`rounded-2xl border px-4 py-4 text-sm font-black ${classeOpcao(duracaoAnimacaoNoticias === 150)}`}
                            >
                                Normal
                            </button>

                            <button
                                type="button"
                                onClick={() => setDuracaoAnimacaoNoticias(120)}
                                className={`rounded-2xl border px-4 py-4 text-sm font-black ${classeOpcao(duracaoAnimacaoNoticias === 120)}`}
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
                            className="mt-4"
                        />

                        <div className="mt-4 rounded-2xl border border-white/10 bg-zinc-950/60 p-4">
                            <p className="text-xs font-black uppercase tracking-[0.22em] text-zinc-500">
                                Velocidade atual
                            </p>

                            <p className="mt-2 text-2xl font-black">
                                {velocidadeTexto}
                            </p>

                            <p className="mt-1 text-sm text-zinc-400">
                                {duracaoAnimacaoNoticias}s de animação
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="rounded-[34px] border border-white/10 bg-zinc-900/85 p-5 shadow-[0_24px_70px_rgba(0,0,0,0.32)] backdrop-blur-sm sm:p-7">
                <div className="mb-6">
                    <h2 className="text-2xl font-black sm:text-3xl">
                        Prévia visual
                    </h2>

                    <p className="mt-2 text-sm text-zinc-400">
                        Simulação rápida do rodapé com os tamanhos configurados.
                    </p>
                </div>

                <div className="overflow-hidden rounded-[26px] border border-white/10 bg-[#071633] p-5">
                    <div className="mb-4 flex items-center justify-between gap-4">
                        <div>
                            <p
                                className="font-black text-white"
                                style={{
                                    fontSize: `${tamanhoFonteSlogan}px`
                                }}
                            >
                                ADUSEPS
                            </p>

                            <p className="text-sm text-white/55">
                                Painel Institucional
                            </p>
                        </div>

                        <div
                            className="font-black text-white"
                            style={{
                                fontSize: `${tamanhoFonteHora}px`
                            }}
                        >
                            12:48
                        </div>
                    </div>

                    <div
                        className="overflow-hidden rounded-2xl bg-[#183b78] px-4"
                        style={{
                            height: `${alturaBarraNoticias}px`
                        }}
                    >
                        <div
                            className="flex h-full items-center whitespace-nowrap font-bold text-white"
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
            </section>

            <section className="rounded-[26px] border border-amber-400/20 bg-amber-500/10 p-5">
                <p className="font-black text-amber-200">
                    Alterações salvas no rascunho
                </p>

                <p className="mt-2 text-sm text-amber-100/80">
                    Para enviar essas configurações para a TV, volte para a página Início e clique em Publicar na TV.
                </p>
            </section>

            <button
                onClick={salvarConfiguracoes}
                className="rounded-2xl border border-sky-300/20 bg-sky-500 px-6 py-4 text-sm font-black text-white shadow-[0_14px_35px_rgba(14,165,233,0.22)]"
            >
                Salvar tipografia
            </button>
        </div>
    )
}
