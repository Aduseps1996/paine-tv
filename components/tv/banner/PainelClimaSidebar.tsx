"use client"

import {
    formatarDiaCurto,
    type ClimaPainel,
    type ConfiguracoesBanner
} from "./utils"

type Props = {
    clima: ClimaPainel
    configuracoes: ConfiguracoesBanner
}

function valorClima(
    erro: boolean,
    valor: number | null,
    sufixo = ""
) {
    if (erro || valor === null) return "--"
    return `${valor}${sufixo}`
}

export default function PainelClimaSidebar({
    clima,
    configuracoes
}: Props) {
    const erro = Boolean(clima.erroClima)

    return (
        <aside className="relative h-full min-h-0 overflow-hidden border-r border-white/15 bg-[#0d5cff]/60 text-white backdrop-blur-md">
            <div className="absolute inset-0 bg-gradient-to-b from-[#78ddff]/35 via-[#0d5cff]/35 to-[#063ea8]/80" />
            <div className="absolute -left-20 top-10 h-56 w-56 rounded-full bg-white/20 blur-3xl" />
            <div className="absolute bottom-16 right-[-90px] h-64 w-64 rounded-full bg-[#7de2ff]/20 blur-3xl" />

            <div className="relative z-10 grid h-full min-h-0 grid-rows-[auto_auto_auto_auto_minmax(0,1fr)] gap-2 overflow-hidden px-3 py-3">
                <header className="shrink-0 text-center">
                    <p className="text-[clamp(0.56rem,0.7vw,0.76rem)] font-black uppercase tracking-[0.2em] text-white/70">
                        Previsão do tempo
                    </p>

                    {configuracoes.mostrarCidadePainel && (
                        <h2 className="mt-1 truncate text-[clamp(1rem,1.35vw,1.55rem)] font-black leading-tight">
                            {clima.cidade || "--"}
                        </h2>
                    )}
                </header>

                <section className="shrink-0 rounded-[24px] border border-white/15 bg-white/[0.13] px-4 py-[clamp(0.75rem,1.35vh,1.2rem)] text-center shadow-[inset_0_1px_0_rgba(255,255,255,0.16)]">
                    <div className="text-[clamp(2.8rem,4.2vw,4.9rem)] leading-none drop-shadow-xl">
                        {clima.icone(clima.codigoClimaAtual)}
                    </div>

                    {configuracoes.mostrarTemperaturaPainel && (
                        <div className="mt-1 flex items-end justify-center gap-2">
                            <span className="text-[clamp(3rem,4.8vw,5.2rem)] font-black leading-none">
                                {erro || clima.temperaturaAtual === null
                                    ? "--"
                                    : clima.temperaturaAtual}
                            </span>

                            <span className="mb-1.5 text-[clamp(1.15rem,1.75vw,1.9rem)] font-black">
                                °C
                            </span>
                        </div>
                    )}

                    {configuracoes.mostrarDescricaoClimaPainel && (
                        <p className="mt-1 text-[clamp(0.78rem,1vw,1.05rem)] font-bold leading-tight text-white/85">
                            {erro
                                ? "Clima indisponível"
                                : clima.descricao(clima.codigoClimaAtual)}
                        </p>
                    )}
                </section>

                <section className="grid shrink-0 grid-cols-2 gap-2">
                    <div className="rounded-2xl border border-white/10 bg-white/[0.12] px-3.5 py-2.5">
                        <p className="text-[clamp(0.5rem,0.64vw,0.66rem)] font-black uppercase tracking-[0.16em] text-white/60">
                            Máxima
                        </p>
                        <p className="mt-1 text-[clamp(0.95rem,1.25vw,1.35rem)] font-black">
                            {valorClima(erro, clima.temperaturaMaximaHoje, "°")}
                        </p>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-white/[0.12] px-3.5 py-2.5">
                        <p className="text-[clamp(0.5rem,0.64vw,0.66rem)] font-black uppercase tracking-[0.16em] text-white/60">
                            Mínima
                        </p>
                        <p className="mt-1 text-[clamp(0.95rem,1.25vw,1.35rem)] font-black">
                            {valorClima(erro, clima.temperaturaMinimaHoje, "°")}
                        </p>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-white/[0.12] px-3.5 py-2.5">
                        <p className="text-[clamp(0.5rem,0.64vw,0.66rem)] font-black uppercase tracking-[0.16em] text-white/60">
                            Sensação
                        </p>
                        <p className="mt-1 text-[clamp(0.95rem,1.25vw,1.35rem)] font-black">
                            {valorClima(erro, clima.sensacaoTermicaAtual, "°")}
                        </p>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-white/[0.12] px-3.5 py-2.5">
                        <p className="text-[clamp(0.5rem,0.64vw,0.66rem)] font-black uppercase tracking-[0.16em] text-white/60">
                            Umidade
                        </p>
                        <p className="mt-1 text-[clamp(0.95rem,1.25vw,1.35rem)] font-black">
                            {valorClima(erro, clima.umidadeAtual, "%")}
                        </p>
                    </div>
                </section>

                <section className="shrink-0 rounded-2xl border border-white/10 bg-white/[0.12] px-3.5 py-2.5">
                    <div className="flex items-center justify-between gap-3">
                        <p className="text-[clamp(0.5rem,0.64vw,0.66rem)] font-black uppercase tracking-[0.16em] text-white/60">
                            Vento
                        </p>

                        <p className="text-[clamp(0.95rem,1.2vw,1.3rem)] font-black">
                            {valorClima(erro, clima.ventoAtual, " km/h")}
                        </p>
                    </div>
                </section>

                <section className="min-h-0 overflow-hidden rounded-[18px] border border-white/10 bg-black/15 p-2">
                    <p className="mb-2 text-[clamp(0.52rem,0.68vw,0.68rem)] font-black uppercase tracking-[0.16em] text-white/65">
                        Próximos dias
                    </p>

                    <div className="grid grid-cols-3 gap-1.5">
                        {(clima.previsaoProximosDias.length > 0
                            ? clima.previsaoProximosDias
                            : []
                        ).map((dia) => (
                            <div
                                key={dia.data}
                                className="rounded-lg border border-white/10 bg-white/[0.11] px-1 py-1.5 text-center"
                            >
                                <p className="text-[clamp(0.58rem,0.72vw,0.68rem)] font-black uppercase text-white/65">
                                    {formatarDiaCurto(dia.data)}
                                </p>

                                <p className="mt-1 text-[clamp(1.05rem,1.45vw,1.55rem)] leading-none">
                                    {clima.icone(dia.codigoClima)}
                                </p>

                                <p className="mt-2 whitespace-nowrap text-[clamp(0.68rem,0.9vw,0.82rem)] font-black">
                                    {dia.maxima}/{dia.minima}°
                                </p>
                            </div>
                        ))}

                        {clima.previsaoProximosDias.length === 0 &&
                            [1, 2, 3].map((indice) => (
                                <div
                                    key={indice}
                                    className="rounded-lg border border-white/10 bg-white/[0.11] px-1 py-1.5 text-center"
                                >
                                    <p className="text-[clamp(0.58rem,0.72vw,0.68rem)] font-black text-white/65">
                                        --
                                    </p>

                                    <p className="mt-1 text-[clamp(1.05rem,1.45vw,1.55rem)] leading-none">
                                        --
                                    </p>

                                    <p className="mt-2 whitespace-nowrap text-[clamp(0.68rem,0.9vw,0.82rem)] font-black">
                                        --/--°
                                    </p>
                                </div>
                            ))}
                    </div>
                </section>
            </div>
        </aside>
    )
}
