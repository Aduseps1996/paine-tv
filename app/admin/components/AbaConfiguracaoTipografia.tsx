"use client"

import { Eye, Gauge, Ruler, Type } from "lucide-react"

import type { AbaAdmin, ConfiguracoesPainel } from "@/types/painel"
import { usePainelDraftContext } from "../context/PainelDraftContext"

type Props = {
    navegarPara: (aba: AbaAdmin) => void
}

function Controle({
    titulo,
    descricao,
    valor,
    minimo,
    maximo,
    sufixo,
    onChange
}: {
    titulo: string
    descricao: string
    valor: number
    minimo: number
    maximo: number
    sufixo: string
    onChange: (valor: number) => void
}) {
    return (
        <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4">
            <div className="flex items-start justify-between gap-3">
                <div>
                    <h3 className="text-sm font-extrabold text-slate-900">{titulo}</h3>
                    <p className="mt-1 text-xs leading-relaxed text-slate-500">{descricao}</p>
                </div>
                <span className="shrink-0 rounded-lg border border-blue-100 bg-blue-50 px-3 py-2 text-sm font-extrabold text-blue-700">
                    {valor}{sufixo}
                </span>
            </div>
            <input
                type="range"
                min={minimo}
                max={maximo}
                value={valor}
                onChange={(event) => onChange(Number(event.target.value))}
                className="mt-5 w-full accent-[#0d6efd]"
            />
            <div className="mt-2 flex justify-between text-[11px] font-bold text-slate-400">
                <span>{minimo}{sufixo}</span>
                <span>{maximo}{sufixo}</span>
            </div>
        </div>
    )
}

export default function AbaConfiguracaoTipografia({ navegarPara }: Props) {
    const { draft, atualizarConfiguracoesDraft } = usePainelDraftContext()
    const configuracoes = draft.configuracoes
    const tamanhoFonteRodape = Number(configuracoes.tamanhoFonteRodape || 28)
    const tamanhoFonteSlogan = Number(configuracoes.tamanhoFonteSlogan || 18)
    const tamanhoFonteHora = Number(configuracoes.tamanhoFonteHora || 24)
    const alturaBarraNoticias = Number(configuracoes.alturaBarraNoticias || 44)
    const duracaoAnimacaoNoticias = Number(
        configuracoes.duracaoAnimacaoNoticias || 150
    )

    function atualizar(
        campo: keyof ConfiguracoesPainel,
        valor: number
    ) {
        atualizarConfiguracoesDraft({ [campo]: valor })
    }

    const velocidade =
        duracaoAnimacaoNoticias >= 170
            ? "Lenta"
            : duracaoAnimacaoNoticias <= 130
                ? "Rápida"
                : "Normal"

    return (
        <div className="space-y-6">
            <header className="flex flex-col gap-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6 lg:flex-row lg:items-center lg:justify-between">
                <div>
                    <div className="mb-2 flex items-center gap-2 text-xs font-extrabold uppercase tracking-[0.18em] text-[#0d6efd]">
                        <Type size={15} />
                        Leitura na televisão
                    </div>
                    <h1 className="text-2xl font-extrabold tracking-tight text-slate-950 sm:text-3xl">
                        Tipografia e medidas
                    </h1>
                    <p className="mt-2 text-sm text-slate-500">
                        Ajuste fontes, altura do rodapé e velocidade das notícias com prévia em tempo real.
                    </p>
                </div>
                <button
                    type="button"
                    onClick={() => navegarPara("previa-tv")}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#0d6efd] px-5 py-3 text-sm font-extrabold text-white shadow-sm transition hover:bg-[#075fd4]"
                >
                    <Eye size={18} />
                    Revisar na Prévia
                </button>
            </header>

            <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                {[
                    ["Notícias", `${tamanhoFonteRodape}px`, "texto do rodapé"],
                    ["Slogan", `${tamanhoFonteSlogan}px`, "texto institucional"],
                    ["Hora", `${tamanhoFonteHora}px`, "relógio da TV"],
                    ["Barra", `${alturaBarraNoticias}px`, "altura do rodapé"]
                ].map(([label, value, detail]) => (
                    <div key={label} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                        <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-400">{label}</p>
                        <p className="mt-2 text-2xl font-extrabold text-slate-950">{value}</p>
                        <p className="mt-1 text-xs text-slate-500">{detail}</p>
                    </div>
                ))}
            </section>

            <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_430px]">
                <div className="space-y-6">
                    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                        <div className="flex items-start gap-3">
                            <span className="grid h-10 w-10 place-items-center rounded-xl bg-blue-50 text-[#0d6efd]">
                                <Type size={20} />
                            </span>
                            <div>
                                <h2 className="text-lg font-extrabold text-slate-950">Tamanho dos textos</h2>
                                <p className="mt-1 text-sm text-slate-500">Use os controles e confira o resultado na prévia.</p>
                            </div>
                        </div>
                        <div className="mt-6 grid gap-4 lg:grid-cols-2">
                            <Controle titulo="Fonte das notícias" descricao="Texto que corre no rodapé." valor={tamanhoFonteRodape} minimo={12} maximo={80} sufixo="px" onChange={(valor) => atualizar("tamanhoFonteRodape", valor)} />
                            <Controle titulo="Fonte do slogan" descricao="Texto institucional da faixa." valor={tamanhoFonteSlogan} minimo={12} maximo={60} sufixo="px" onChange={(valor) => atualizar("tamanhoFonteSlogan", valor)} />
                            <Controle titulo="Fonte da hora" descricao="Relógio exibido no painel." valor={tamanhoFonteHora} minimo={12} maximo={70} sufixo="px" onChange={(valor) => atualizar("tamanhoFonteHora", valor)} />
                            <Controle titulo="Altura da barra" descricao="Altura total do rodapé." valor={alturaBarraNoticias} minimo={30} maximo={100} sufixo="px" onChange={(valor) => atualizar("alturaBarraNoticias", valor)} />
                        </div>
                    </section>

                    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                        <div className="flex items-start gap-3">
                            <span className="grid h-10 w-10 place-items-center rounded-xl bg-blue-50 text-[#0d6efd]">
                                <Gauge size={20} />
                            </span>
                            <div>
                                <h2 className="text-lg font-extrabold text-slate-950">Velocidade das notícias</h2>
                                <p className="mt-1 text-sm text-slate-500">Quanto maior a duração, mais devagar o texto passa.</p>
                            </div>
                        </div>
                        <div className="mt-6 grid gap-3 sm:grid-cols-3">
                            {[
                                ["Lenta", 180],
                                ["Normal", 150],
                                ["Rápida", 120]
                            ].map(([label, value]) => (
                                <button
                                    key={label}
                                    type="button"
                                    onClick={() => atualizar("duracaoAnimacaoNoticias", Number(value))}
                                    className={`rounded-xl border px-4 py-3 text-sm font-extrabold transition ${
                                        duracaoAnimacaoNoticias === value
                                            ? "border-blue-500 bg-blue-50 text-blue-700 ring-2 ring-blue-500/10"
                                            : "border-slate-200 bg-white text-slate-600 hover:border-blue-200"
                                    }`}
                                >
                                    {label}
                                </button>
                            ))}
                        </div>
                        <Controle titulo={`Ajuste fino — ${velocidade}`} descricao="Duração completa da animação." valor={duracaoAnimacaoNoticias} minimo={60} maximo={300} sufixo="s" onChange={(valor) => atualizar("duracaoAnimacaoNoticias", valor)} />
                    </section>
                </div>

                <aside className="xl:sticky xl:top-[100px] xl:self-start">
                    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
                            <div>
                                <p className="text-sm font-extrabold text-slate-900">Prévia visual</p>
                                <p className="text-xs text-slate-500">Simulação da TV</p>
                            </div>
                            <Ruler size={19} className="text-blue-600" />
                        </div>
                        <div className="aspect-video bg-[linear-gradient(145deg,#073f91_0%,#061c3f_100%)] p-5 text-white">
                            <div className="flex items-start justify-between gap-4">
                                <div>
                                    <p style={{ fontSize: `${tamanhoFonteSlogan}px` }} className="font-extrabold leading-none">ADUSEPS</p>
                                    <p className="mt-1 text-xs text-blue-100">Painel Institucional</p>
                                </div>
                                <p style={{ fontSize: `${tamanhoFonteHora}px` }} className="font-extrabold leading-none">12:48</p>
                            </div>
                            <div className="mt-8 grid h-20 place-items-center rounded-lg bg-white/10 text-xs font-bold text-white/45">
                                Área da mídia
                            </div>
                        </div>
                        <div
                            className="flex items-center overflow-hidden bg-[#0a57b7] px-4 text-white"
                            style={{ height: `${alturaBarraNoticias}px` }}
                        >
                            <p
                                className="whitespace-nowrap font-bold"
                                style={{ fontSize: `${tamanhoFonteRodape}px` }}
                            >
                                ADUSEPS — Informação e compromisso com o associado
                            </p>
                        </div>
                        <div className="flex items-center justify-between border-t border-slate-200 px-5 py-4 text-xs">
                            <span className="font-bold text-slate-500">Velocidade atual</span>
                            <strong className="text-slate-900">{velocidade} · {duracaoAnimacaoNoticias}s</strong>
                        </div>
                    </div>
                </aside>
            </div>

            <div className="flex justify-end">
                <button
                    type="button"
                    onClick={() => navegarPara("previa-tv")}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#0d6efd] px-5 py-3 text-sm font-extrabold text-white shadow-sm transition hover:bg-[#075fd4]"
                >
                    <Eye size={18} />
                    Revisar na Prévia
                </button>
            </div>
        </div>
    )
}
