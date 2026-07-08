"use client"

import { CalendarDays, Scale } from "lucide-react"

import { useEscalaJuridicaPainel } from "@/hooks/tv/useEscalaJuridicaPainel"
import type { ClimaPainel, ConfiguracoesBanner } from "./utils"

type Props = {
    configuracoes: ConfiguracoesBanner
    clima: ClimaPainel
}

function ListaNomes({ nomes }: { nomes: string[] }) {
    if (nomes.length === 0) {
        return (
            <p className="text-xl font-black text-white/35">
                —
            </p>
        )
    }

    return (
        <div className="space-y-2 2xl:space-y-3">
            {nomes.slice(0, 4).map((nome) => (
                <div
                    key={nome}
                    className="rounded-xl border border-white/15 bg-white/10 px-4 py-2 shadow-[0_14px_35px_rgba(0,0,0,0.18)] backdrop-blur-sm 2xl:rounded-2xl 2xl:px-5 2xl:py-3"
                >
                    <p className="truncate text-[clamp(1rem,1.2vw,1.35rem)] font-black uppercase tracking-tight text-white">
                        {nome}
                    </p>
                </div>
            ))}
        </div>
    )
}

function CardTurno({
    titulo,
    horario,
    nomes,
    destaque
}: {
    titulo: string
    horario: string
    nomes: string[]
    destaque?: boolean
}) {
    return (
        <div
            className={`rounded-2xl border p-3 shadow-[0_16px_40px_rgba(0,0,0,0.22)] backdrop-blur-md ${
                destaque
                    ? "border-sky-300/35 bg-sky-400/20"
                    : "border-white/15 bg-white/10"
            }`}
        >
            <div className="mb-4 flex items-center justify-between gap-4 2xl:mb-5">
                <div>
                    <p className="text-[clamp(0.65rem,0.8vw,0.85rem)] font-black uppercase tracking-[0.24em] text-sky-100/80">
                        {titulo}
                    </p>

                    <h3 className="mt-1 text-[clamp(1.35rem,1.8vw,2rem)] font-black uppercase leading-none text-white">
                        {horario}
                    </h3>
                </div>

            </div>

            <ListaNomes nomes={nomes} />
        </div>
    )
}

export default function EscalaJuridicaPainel({
    configuracoes,
    clima
}: Props) {
    const escala = useEscalaJuridicaPainel()
    const agora = new Date()

    const hora = agora.toLocaleTimeString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit"
    })

    const data = agora.toLocaleDateString("pt-BR", {
        weekday: "long",
        day: "2-digit",
        month: "long"
    })

    const temperatura =
        clima.erroClima || clima.temperaturaAtual === null
            ? "--"
            : `${clima.temperaturaAtual}°`

    return (
        <section className="absolute inset-0 overflow-hidden bg-[#06183d] text-white">
            <div className="absolute inset-0 bg-gradient-to-br from-[#0d5cff] via-[#063ea8] to-[#020617]" />
            <div className="absolute -left-32 top-10 h-80 w-80 rounded-full bg-sky-300/25 blur-3xl" />
            <div className="absolute right-[-120px] top-[-80px] h-96 w-96 rounded-full bg-white/15 blur-3xl" />
            <div className="absolute bottom-[-140px] left-1/3 h-96 w-96 rounded-full bg-blue-950/70 blur-3xl" />

            <div className="relative z-10 flex h-full flex-col p-3">
                <header className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div className="flex min-w-0 items-center gap-4">
                        {configuracoes.logo && (
                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white p-1.5 shadow-xl">
                                <img
                                    src={configuracoes.logo}
                                    alt="Logo"
                                    className="max-h-full max-w-full object-contain"
                                />
                            </div>
                        )}

                        <div className="min-w-0">
                            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-[clamp(0.65rem,0.75vw,0.85rem)] font-black uppercase tracking-[0.22em] text-sky-100 backdrop-blur-sm">
                                <Scale className="h-4 w-4" />
                                Atendimento jurídico presencial
                            </div>

                            <h1 className="mt-2 text-[clamp(1.7rem,2.4vw,2.6rem)] font-black uppercase leading-none tracking-tight text-white drop-shadow-2xl">
                                Escala de atendimento
                            </h1>

                            <p className="mt-2 text-[clamp(1rem,1.3vw,1.45rem)] font-bold text-white/75">
                                {escala.semanaTexto || "Semana atual"}
                                <p className="mt-1 text-sm font-bold text-yellow-300">
                                    DEBUG: manhã {escala.manhaHoje.length} | tarde {escala.tardeHoje.length}
                                </p>
                            </p>
                        </div>
                    </div>

                    <div className="rounded-2xl border border-white/15 bg-black/25 px-4 py-3 text-right shadow-xl backdrop-blur-md">
                        <p className="text-[clamp(1.3rem,1.8vw,2rem)] font-black leading-none">
                            {hora}
                        </p>

                        <p className="mt-2 max-w-[320px] text-xs font-bold uppercase tracking-[0.16em] text-white/70 2xl:text-sm">
                            {data}
                        </p>

                        <div className="mt-3 flex items-center justify-end gap-2 text-lg font-black text-sky-100">
                            <span>{temperatura}</span>
                            <span className="text-sm uppercase tracking-[0.2em] text-white/55">
                                {clima.cidade}
                            </span>
                        </div>
                    </div>
                </header>

                <main className="mt-4 grid min-h-0 flex-1 grid-cols-1 gap-4 lg:grid-cols-[1.15fr_0.85fr] 2xl:gap-5">
                    <div className="grid gap-4 lg:grid-rows-2 2xl:gap-5">
                        <CardTurno
                            titulo={`Hoje • ${escala.nomeDiaAtual}`}
                            horario="Manhã • 08h às 12h"
                            nomes={escala.manhaHoje}
                            destaque
                        />

                        <CardTurno
                            titulo={`Hoje • ${escala.nomeDiaAtual}`}
                            horario="Tarde • 13h às 17h"
                            nomes={escala.tardeHoje}
                        />
                    </div>

                    <aside className="flex min-h-0 flex-col rounded-[22px] border border-white/15 bg-white/10 p-4 shadow-[0_24px_70px_rgba(0,0,0,0.28)] backdrop-blur-md 2xl:rounded-[28px] 2xl:p-5">
                        <div className="flex items-center gap-3">
                            <div className="rounded-xl bg-white/15 p-3">
                                <CalendarDays className="h-6 w-6 text-white 2xl:h-7 2xl:w-7" />
                            </div>

                            <div>
                                <p className="text-xs font-black uppercase tracking-[0.22em] text-sky-100/75">
                                    Resumo semanal
                                </p>

                                <h2 className="text-2xl font-black uppercase text-white">
                                    Atendimento
                                </h2>
                            </div>
                        </div>

                        <div className="mt-4 min-h-0 flex-1 space-y-2 overflow-hidden">
                            {escala.semana.map((dia) => (
                                <div
                                    key={dia.id}
                                    className={`rounded-xl border px-3 py-2 ${
                                        dia.atual
                                            ? "border-sky-300/45 bg-sky-400/20"
                                            : "border-white/10 bg-black/18"
                                    }`}
                                >
                                    <p className="text-sm font-black uppercase tracking-[0.16em] text-white">
                                        {dia.nome}
                                    </p>

                                    <div className="mt-1.5 grid grid-cols-2 gap-3 text-xs 2xl:text-sm">
                                        <div>
                                            <p className="font-black uppercase text-sky-100/70">
                                                Manhã
                                            </p>
                                            <p className="mt-1 line-clamp-2 font-bold text-white/90">
                                                {dia.manha.length > 0
                                                    ? dia.manha.join(", ")
                                                    : "—"}
                                            </p>
                                        </div>

                                        <div>
                                            <p className="font-black uppercase text-sky-100/70">
                                                Tarde
                                            </p>
                                            <p className="mt-1 line-clamp-2 font-bold text-white/90">
                                                {dia.tarde.length > 0
                                                    ? dia.tarde.join(", ")
                                                    : "—"}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <footer className="mt-4 rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-center">
                            <p className="text-xs font-bold uppercase tracking-[0.12em] text-white/65">
                                Escala sujeita a alterações conforme necessidade do setor jurídico.
                            </p>
                        </footer>
                    </aside>
                </main>
            </div>
        </section>
    )
}
