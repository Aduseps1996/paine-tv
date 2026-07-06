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

export default function PainelClimaSidebar({
    clima,
    configuracoes
}: Props) {
    return (
        <aside className="relative flex h-full min-h-0 flex-col overflow-hidden rounded-none border-r border-white/15 bg-[#0d5cff]/55 px-[clamp(0.9rem,1.4vw,1.4rem)] py-[clamp(0.75rem,1.2vh,1.2rem)] text-white backdrop-blur-md">
            <div className="absolute inset-0 bg-gradient-to-b from-[#7de2ff]/45 via-[#0d5cff]/35 to-[#063ea8]/75" />
            <div className="absolute -left-16 top-10 h-48 w-48 rounded-full bg-white/20 blur-3xl" />
            <div className="absolute bottom-20 right-[-70px] h-56 w-56 rounded-full bg-[#7de2ff]/25 blur-3xl" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.22),transparent_42%)]" />
            <div className="absolute inset-0 bg-gradient-to-b from-white/25 via-white/10 to-[#0d5cff]/20" />

            <div className="relative z-10 flex h-full min-h-0 flex-col justify-between gap-[clamp(0.35rem,0.9vh,0.8rem)]">
                <div className="min-h-0 text-center">
                    <p className="text-[clamp(0.58rem,0.9vw,0.9rem)] font-black uppercase tracking-[0.2em] text-white/75">
                        Previsao do tempo
                    </p>

                    <div className="mt-[clamp(0.3rem,0.8vh,0.7rem)] text-[clamp(2.6rem,4.6vw,5rem)] leading-none drop-shadow-xl">
                        {clima.icone(clima.codigoClimaAtual)}
                    </div>

                    {configuracoes.mostrarTemperaturaPainel && (
                        <div className="mt-[clamp(0.25rem,0.65vh,0.55rem)] flex items-end justify-center gap-2">
                            <span className="text-[clamp(3rem,5.4vw,5.8rem)] font-black leading-none">
                                {clima.erroClima || clima.temperaturaAtual === null
                                    ? "--"
                                    : clima.temperaturaAtual}
                            </span>
                            <span className="mb-2 text-[clamp(1.2rem,2vw,2.2rem)] font-black">°C</span>
                        </div>
                    )}

                    {configuracoes.mostrarDescricaoClimaPainel && (
                        <p className="mt-[clamp(0.2rem,0.45vh,0.45rem)] text-[clamp(0.82rem,1.15vw,1.22rem)] font-semibold leading-tight text-white/85">
                            {clima.erroClima
                                ? "Clima indisponivel"
                                : clima.descricao(clima.codigoClimaAtual)}
                        </p>
                    )}

                    {configuracoes.mostrarCidadePainel && (
                        <p className="mt-[clamp(0.25rem,0.6vh,0.55rem)] truncate text-[clamp(0.95rem,1.4vw,1.55rem)] font-black">
                            {clima.cidade || "--"}
                        </p>
                    )}
                </div>

                <div className="grid min-h-0 gap-[clamp(0.25rem,0.55vh,0.5rem)] text-[clamp(0.68rem,0.9vw,0.9rem)] font-bold">
                    <div className="grid grid-cols-2 gap-2 rounded-lg bg-white/[0.12] px-2.5 py-[clamp(0.3rem,0.6vh,0.55rem)]">
                        <p className="whitespace-nowrap">
                            Max {clima.erroClima || clima.temperaturaMaximaHoje === null ? "--" : clima.temperaturaMaximaHoje}°
                        </p>
                        <p className="whitespace-nowrap">
                            Min {clima.erroClima || clima.temperaturaMinimaHoje === null ? "--" : clima.temperaturaMinimaHoje}°
                        </p>
                    </div>

                    <div className="whitespace-nowrap rounded-lg bg-white/[0.12] px-2.5 py-[clamp(0.28rem,0.55vh,0.5rem)]">
                        Sensacao {clima.erroClima || clima.sensacaoTermicaAtual === null ? "--" : clima.sensacaoTermicaAtual}°
                    </div>

                    <div className="grid grid-cols-2 gap-2 rounded-lg bg-white/[0.12] px-2.5 py-[clamp(0.3rem,0.6vh,0.55rem)]">
                        <p className="whitespace-nowrap">
                            Umid. {clima.erroClima || clima.umidadeAtual === null ? "--" : `${clima.umidadeAtual}%`}
                        </p>
                        <p className="whitespace-nowrap">
                            Vento {clima.erroClima || clima.ventoAtual === null ? "--" : `${clima.ventoAtual} km/h`}
                        </p>
                    </div>

                    <div className="rounded-lg bg-black/15 px-2.5 py-[clamp(0.35rem,0.7vh,0.6rem)]">
                        <p className="mb-[clamp(0.22rem,0.45vh,0.4rem)] text-[clamp(0.56rem,0.75vw,0.7rem)] font-black uppercase tracking-[0.16em] text-white/70">
                            Proximos dias
                        </p>
                        <div className="grid grid-cols-3 gap-2">
                            {clima.previsaoProximosDias.length > 0 ? (
                                clima.previsaoProximosDias.map((dia) => (
                                    <div key={dia.data} className="min-w-0 rounded-md bg-white/10 px-1.5 py-[clamp(0.25rem,0.55vh,0.45rem)] text-center">
                                        <p className="text-[clamp(0.56rem,0.72vw,0.68rem)] font-black text-white/70">
                                            {formatarDiaCurto(dia.data)}
                                        </p>
                                        <p className="text-[clamp(0.95rem,1.35vw,1.45rem)] leading-tight">
                                            {clima.icone(dia.codigoClima)}
                                        </p>
                                        <p className="whitespace-nowrap text-[clamp(0.62rem,0.84vw,0.78rem)] font-black">
                                            {dia.maxima}/{dia.minima}°
                                        </p>
                                    </div>
                                ))
                            ) : (
                                [1, 2, 3].map((indice) => (
                                    <div key={indice} className="rounded-md bg-white/10 px-1.5 py-[clamp(0.25rem,0.55vh,0.45rem)] text-center">
                                        <p className="text-[clamp(0.56rem,0.72vw,0.68rem)] font-black text-white/70">--</p>
                                        <p className="text-[clamp(0.95rem,1.35vw,1.45rem)] leading-tight">--</p>
                                        <p className="whitespace-nowrap text-[clamp(0.62rem,0.84vw,0.78rem)] font-black">--/--°</p>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </aside>
    )
}
