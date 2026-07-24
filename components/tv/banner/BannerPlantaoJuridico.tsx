import {
    CalendarDays,
    Clock3,
    MessageCircleMore,
    ShieldCheck
} from "lucide-react"

import type {
    ConfiguracoesPainel,
    DadosPlantao,
    Midia
} from "@/types/painel"
import {
    CONTATO_PLANTAO_ID,
    obterValorContato
} from "@/utils/contatosPainel"

type Props = {
    midiaAtual: Midia
    agoraPainel: Date | null
    configuracoes: ConfiguracoesPainel
}

const CONTEUDO_PADRAO: DadosPlantao = {
    titulo: "Plantão Judicial",
    chamadaPadrao: "Urgências não esperam até segunda-feira.",
    descricaoPadrao:
        "Atuação em situações urgentes relacionadas ao direito à saúde durante finais de semana e feriados.",
    contatoId: CONTATO_PLANTAO_ID,
    whatsapp: "(81) 99838-2275",
    rodape:
        "Nosso compromisso é com a justiça social e a defesa da dignidade humana."
}

function avisoEspecialEstaAtivo(
    plantao: DadosPlantao,
    agoraPainel: Date | null
) {
    if (!plantao.avisoEspecialAtivo || !agoraPainel) return false
    if (!plantao.inicioAvisoEspecial || !plantao.fimAvisoEspecial) return false

    const inicio = new Date(plantao.inicioAvisoEspecial)
    const fim = new Date(plantao.fimAvisoEspecial)

    if (Number.isNaN(inicio.getTime()) || Number.isNaN(fim.getTime())) {
        return false
    }

    return agoraPainel >= inicio && agoraPainel <= fim
}

export default function BannerPlantaoJuridico({
    midiaAtual,
    agoraPainel,
    configuracoes
}: Props) {
    const plantao = {
        ...CONTEUDO_PADRAO,
        ...(midiaAtual.plantao || {})
    }

    const usarAvisoEspecial = avisoEspecialEstaAtivo(
        plantao,
        agoraPainel
    )

    const chamada =
        usarAvisoEspecial && plantao.chamadaEspecial
            ? plantao.chamadaEspecial
            : plantao.chamadaPadrao

    const descricao =
        usarAvisoEspecial && plantao.descricaoEspecial
            ? plantao.descricaoEspecial
            : plantao.descricaoPadrao

    const whatsapp = obterValorContato(
        configuracoes,
        plantao.contatoId || CONTATO_PLANTAO_ID,
        plantao.whatsapp || "(81) 99838-2275"
    )

    return (
        <section className="absolute inset-0 isolate overflow-hidden bg-[#061c4f] text-white">
            <div className="absolute inset-0 bg-[linear-gradient(118deg,#061944_0%,#073c85_54%,#0a88bf_100%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_82%_18%,rgba(117,225,255,0.34),transparent_30%),radial-gradient(circle_at_38%_100%,rgba(28,148,255,0.28),transparent_42%)]" />
            <div className="absolute -right-[12vw] -top-[24vw] h-[61vw] w-[61vw] rounded-full border-[5vw] border-white/[0.045]" />
            <div className="absolute -bottom-[37vw] left-[19vw] h-[70vw] w-[70vw] rounded-full border-[7vw] border-cyan-200/[0.045]" />
            <div className="absolute inset-0 opacity-[0.08] [background-image:linear-gradient(rgba(255,255,255,0.25)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.25)_1px,transparent_1px)] [background-size:5vw_5vw]" />

            <header className="absolute left-[5vw] right-[5vw] top-[5.5vh] z-10 flex items-center justify-between border-b border-white/20 pb-[2.2vh]">
                <div className="flex items-center gap-[1vw]">
                    <span className="flex h-[4.8vh] w-[4.8vh] items-center justify-center rounded-[1.2vh] bg-cyan-300 text-[#06356f]">
                        <ShieldCheck
                            aria-hidden="true"
                            strokeWidth={2.6}
                            className="h-[3vh] w-[3vh]"
                        />
                    </span>
                    <p className="text-[clamp(0.75rem,1.05vw,1.45rem)] font-black uppercase tracking-[0.22em] text-cyan-100">
                        Atendimento ADUSEPS
                    </p>
                </div>

                <div className="flex items-center gap-[0.8vw] text-cyan-50/90">
                    <CalendarDays
                        aria-hidden="true"
                        strokeWidth={2.1}
                        className="h-[2.8vh] w-[2.8vh]"
                    />
                    <p className="text-[clamp(0.72rem,0.95vw,1.3rem)] font-bold uppercase tracking-[0.12em]">
                        {usarAvisoEspecial && plantao.ocasiaoEspecial
                            ? plantao.ocasiaoEspecial
                            : "Finais de semana e feriados"}
                    </p>
                </div>
            </header>

            <div className="relative grid h-full grid-cols-[63%_37%] px-[5vw] pb-[17vh] pt-[15vh]">
                <main className="flex min-w-0 flex-col justify-center pr-[5vw]">
                    <div className="mb-[2.2vh] flex items-center gap-[1vw]">
                        <span className="h-[0.45vh] w-[4vw] rounded-full bg-cyan-300" />
                        <p className="text-[clamp(0.78rem,1vw,1.4rem)] font-extrabold uppercase tracking-[0.2em] text-cyan-200">
                            Serviço de plantão
                        </p>
                    </div>

                    <h1 className="max-w-[56vw] text-[clamp(2.6rem,4.7vw,6.4rem)] font-black leading-[0.98] tracking-[-0.05em] text-white">
                        {chamada}
                    </h1>

                    <p className="mt-[3vh] max-w-[53vw] text-[clamp(1.05rem,1.65vw,2.35rem)] font-medium leading-[1.32] text-blue-50/95">
                        {descricao}
                    </p>
                </main>

                <aside className="flex min-w-0 items-center justify-end">
                    <div className="relative w-full overflow-hidden rounded-[2.6vw] border border-white/40 bg-white/[0.94] px-[3vw] py-[5vh] text-[#072d68] shadow-[0_3vh_8vh_rgba(0,25,74,0.28)]">
                        <div className="absolute right-[-4vw] top-[-4vw] h-[13vw] w-[13vw] rounded-full bg-cyan-300/25" />
                        <div className="absolute bottom-[-5vw] left-[-5vw] h-[12vw] w-[12vw] rounded-full border-[2vw] border-blue-500/[0.08]" />

                        <div className="relative flex items-start justify-between gap-[2vw]">
                            <div>
                                <p className="text-[clamp(0.72rem,0.9vw,1.25rem)] font-black uppercase tracking-[0.18em] text-[#1284ad]">
                                    Atendimento
                                </p>
                                <h2 className="mt-[1vh] text-[clamp(1.9rem,3.1vw,4.2rem)] font-black leading-[0.95] tracking-[-0.05em]">
                                    {plantao.titulo}
                                </h2>
                            </div>

                            <span className="flex h-[7.5vh] w-[7.5vh] shrink-0 items-center justify-center rounded-full bg-[#0b4b98] text-white shadow-[0_1.2vh_2.8vh_rgba(7,56,126,0.24)]">
                                <Clock3
                                    aria-hidden="true"
                                    strokeWidth={2.1}
                                    className="h-[4.2vh] w-[4.2vh]"
                                />
                            </span>
                        </div>

                        <div className="relative my-[3.5vh] h-px bg-[#0b4b98]/20" />

                        <div className="relative flex items-center gap-[1.3vw]">
                            <span className="flex h-[6.8vh] w-[6.8vh] shrink-0 items-center justify-center rounded-[1.4vh] bg-[#dff8e5] text-[#159447]">
                                <MessageCircleMore
                                    aria-hidden="true"
                                    strokeWidth={2.4}
                                    className="h-[4.2vh] w-[4.2vh]"
                                />
                            </span>
                            <div className="min-w-0">
                                <p className="text-[clamp(0.7rem,0.88vw,1.2rem)] font-black uppercase tracking-[0.12em] text-[#187d47]">
                                    WhatsApp do plantão
                                </p>
                                <p className="mt-[0.5vh] whitespace-nowrap text-[clamp(1.15rem,1.8vw,2.5rem)] font-black tracking-[-0.03em] text-[#082e66]">
                                    {whatsapp}
                                </p>
                            </div>
                        </div>
                    </div>
                </aside>
            </div>

            <footer className="absolute bottom-0 left-0 right-0 z-10 flex min-h-[12vh] items-center border-t border-white/15 bg-[#04163d]/88 px-[5vw] backdrop-blur-md">
                <span className="mr-[1.4vw] h-[5.6vh] w-[0.35vw] rounded-full bg-cyan-300" />
                <p className="max-w-[88vw] text-[clamp(0.95rem,1.35vw,1.9rem)] font-semibold leading-snug tracking-[0.01em] text-white/95">
                    {plantao.rodape}
                </p>
            </footer>
        </section>
    )
}
