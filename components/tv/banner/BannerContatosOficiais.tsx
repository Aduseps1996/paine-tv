import {
    Globe2,
    MessageCircleMore,
    Phone,
    ShieldCheck,
    PhoneCall
} from "lucide-react"

import type { ConfiguracoesPainel, Midia } from "@/types/painel"
import { normalizarContatos } from "@/utils/contatosPainel"

type Props = {
    midiaAtual: Midia
    configuracoes: ConfiguracoesPainel
}

const CONTEUDO_PADRAO = {
    titulo: "Fale com a ADUSEPS",
    subtitulo: "Nossos canais oficiais estão à disposição dos associados.",
    rodape:
        "Salve os contatos oficiais e fale diretamente com o setor que você precisa."
}

function IconeContato({ tipo }: { tipo: "telefone" | "whatsapp" | "site" }) {
    if (tipo === "whatsapp") {
        return <MessageCircleMore className="h-[5.4vh] w-[5.4vh]" strokeWidth={2.15} />
    }

    if (tipo === "site") {
        return <Globe2 className="h-[5.4vh] w-[5.4vh]" strokeWidth={2.05} />
    }

    return <Phone className="h-[5.4vh] w-[5.4vh]" strokeWidth={2.05} />
}

function IconeValor({ tipo }: { tipo: "telefone" | "whatsapp" | "site" }) {
    if (tipo === "whatsapp") {
        return <MessageCircleMore className="h-[3.4vh] w-[3.4vh]" strokeWidth={2.5} />
    }

    if (tipo === "site") {
        return <Globe2 className="h-[3.4vh] w-[3.4vh]" strokeWidth={2.35} />
    }

    return <PhoneCall className="h-[3.4vh] w-[3.4vh]" strokeWidth={2.35} />
}

function rotuloTipo(tipo: "telefone" | "whatsapp" | "site") {
    if (tipo === "whatsapp") return "WhatsApp"
    if (tipo === "site") return "Site"
    return "Telefone"
}

export default function BannerContatosOficiais({
    midiaAtual,
    configuracoes
}: Props) {
    const conteudo = {
        ...CONTEUDO_PADRAO,
        ...(midiaAtual.contatosOficiais || {})
    }

    const contatos = normalizarContatos(configuracoes.contatos)
        .filter(
            (contato) =>
                contato.ativo &&
                contato.mostrarNoBanner &&
                contato.valores.length > 0
        )
        .slice(0, 6)

    const quantidade = contatos.length
    const colunas =
        quantidade === 1
            ? "grid-cols-1"
            : quantidade === 3 || quantidade > 4
                ? "grid-cols-3"
                : "grid-cols-2"

    const larguraGrade =
        quantidade === 1 ? "max-w-[54vw]" : "max-w-none"
    const gradeCompacta = quantidade === 3 || quantidade > 4

    return (
        <section className="absolute inset-0 isolate overflow-hidden bg-[#03143d] text-white">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_42%,#0b3977_0%,#061f4f_45%,#020f32_100%)]" />
            <div className="absolute inset-y-0 left-0 w-[18vw] bg-[radial-gradient(circle_at_0%_45%,rgba(10,118,222,0.28),transparent_68%)]" />
            <div className="absolute inset-y-0 right-0 w-[18vw] bg-[radial-gradient(circle_at_100%_55%,rgba(10,118,222,0.25),transparent_68%)]" />
            <div className="absolute left-0 top-[9vh] h-[17vh] w-[14vw] opacity-25 [background-image:radial-gradient(circle,rgba(53,190,255,0.8)_1.2px,transparent_1.2px)] [background-size:1.25vw_1.25vw]" />
            <div className="absolute bottom-[9vh] right-0 h-[17vh] w-[14vw] opacity-25 [background-image:radial-gradient(circle,rgba(53,190,255,0.8)_1.2px,transparent_1.2px)] [background-size:1.25vw_1.25vw]" />

            <header className="relative z-10 mx-auto flex max-w-[82vw] flex-col items-center pt-[5.8vh] text-center">
                <div className="flex items-center gap-[1.35vw] text-cyan-200">
                    <span className="h-px w-[3vw] bg-cyan-300/85" />
                    <ShieldCheck className="h-[4.5vh] w-[4.5vh]" strokeWidth={2.2} />
                    <p className="text-[clamp(0.72rem,1.05vw,1.35rem)] font-extrabold uppercase tracking-[0.25em] text-white/95">
                        Canais oficiais ADUSEPS
                    </p>
                    <span className="h-px w-[3vw] bg-cyan-300/85" />
                </div>

                <h1 className="mt-[1.8vh] text-[clamp(2.5rem,4.2vw,5.7rem)] font-black leading-[0.98] tracking-[-0.045em]">
                    {conteudo.titulo}
                </h1>

                <p className="mt-[1.6vh] flex items-center gap-[0.65vw] text-[clamp(0.9rem,1.25vw,1.65rem)] font-medium leading-[1.3] text-blue-50/90">
                    <ShieldCheck className="h-[2.7vh] w-[2.7vh] text-cyan-300" strokeWidth={2.4} />
                    {conteudo.subtitulo}
                </p>
            </header>

            {contatos.length > 0 ? (
                <div
                    className={`relative z-10 mx-auto mt-[5.2vh] grid w-[90vw] ${larguraGrade} ${colunas} gap-x-[1.35vw] gap-y-[2.8vh]`}
                >
                    {contatos.map((contato) => (
                        <article
                            key={contato.id}
                            className={`relative grid min-w-0 overflow-hidden rounded-[1.15vw] border bg-[#031b49]/88 shadow-[0_1.5vh_3.5vh_rgba(0,8,35,0.36)] backdrop-blur-sm ${
                                gradeCompacta
                                    ? "min-h-[17vh] grid-cols-[47%_53%]"
                                    : "min-h-[21vh] grid-cols-[52%_48%]"
                            } ${
                                contato.tipo === "whatsapp"
                                    ? "border-emerald-400/90"
                                    : "border-cyan-300/90"
                            }`}
                        >
                            <div className={`flex min-w-0 items-center ${gradeCompacta ? "gap-[0.8vw] px-[1vw]" : "gap-[1.4vw] px-[1.8vw]"} py-[2vh]`}>
                                <span
                                    className={`flex shrink-0 items-center justify-center rounded-full border-2 ${
                                        gradeCompacta
                                            ? "h-[7.2vh] w-[7.2vh]"
                                            : "h-[10.5vh] w-[10.5vh]"
                                    } ${
                                        contato.tipo === "whatsapp"
                                            ? "border-emerald-400 bg-emerald-400/10 text-emerald-300 shadow-[0_0_2.4vh_rgba(52,211,153,0.12)]"
                                            : contato.tipo === "site"
                                                ? "border-cyan-300 bg-cyan-300/10 text-cyan-200 shadow-[0_0_2.4vh_rgba(34,211,238,0.12)]"
                                                : "border-sky-300 bg-sky-300/10 text-sky-200 shadow-[0_0_2.4vh_rgba(56,189,248,0.12)]"
                                    }`}
                                >
                                    <IconeContato tipo={contato.tipo} />
                                </span>

                                <div className="min-w-0">
                                    <h2 className={`max-w-full whitespace-normal break-words font-black leading-[1.05] tracking-[-0.035em] text-white ${
                                        gradeCompacta
                                            ? "text-[clamp(0.9rem,1.2vw,1.55rem)]"
                                            : "text-[clamp(1.2rem,1.75vw,2.35rem)]"
                                    }`}>
                                        {contato.titulo}
                                    </h2>

                                    <span
                                        className={`mt-[1vh] inline-flex items-center gap-[0.45vw] rounded-full border px-[0.75vw] py-[0.38vh] text-[clamp(0.52rem,0.62vw,0.82rem)] font-extrabold uppercase tracking-[0.13em] ${
                                            contato.tipo === "whatsapp"
                                                ? "border-emerald-400 text-emerald-300"
                                                : "border-cyan-300 text-cyan-200"
                                        }`}
                                    >
                                        <IconeValor tipo={contato.tipo} />
                                        {rotuloTipo(contato.tipo)}
                                    </span>
                                </div>
                            </div>

                            <div
                                className={`relative flex min-w-0 flex-col justify-center border-l px-[1.5vw] py-[2vh] ${
                                    contato.tipo === "whatsapp"
                                        ? "border-emerald-400/75"
                                        : "border-cyan-300/75"
                                }`}
                            >
                                <div className="space-y-[1vh]">
                                    {contato.valores.map((valor) => (
                                        <div
                                            key={valor}
                                            className={`flex min-w-0 items-center ${
                                                gradeCompacta ? "gap-[0.55vw]" : "gap-[0.8vw]"
                                            } ${
                                                contato.tipo === "whatsapp"
                                                    ? "text-emerald-300"
                                                    : "text-cyan-200"
                                            }`}
                                        >
                                            <span className="shrink-0">
                                                <IconeValor tipo={contato.tipo} />
                                            </span>
                                            <p
                                                className={`min-w-0 whitespace-nowrap font-black leading-none tracking-[-0.04em] text-white ${
                                                    gradeCompacta
                                                        ? "text-[clamp(0.9rem,1.18vw,1.55rem)]"
                                                        : contato.valores.length > 1
                                                            ? "text-[clamp(1rem,1.45vw,1.9rem)]"
                                                            : "text-[clamp(1.2rem,1.7vw,2.25rem)]"
                                                }`}
                                            >
                                                {valor}
                                            </p>
                                        </div>
                                    ))}
                                </div>

                                {contato.observacao && (
                                    <p className={`mt-[1.2vh] truncate font-medium text-blue-50/75 ${
                                        gradeCompacta
                                            ? "text-[clamp(0.52rem,0.58vw,0.75rem)]"
                                            : "text-[clamp(0.62rem,0.72vw,0.95rem)]"
                                    }`}>
                                        {contato.observacao}
                                    </p>
                                )}
                            </div>
                        </article>
                    ))}
                </div>
            ) : (
                <div className="relative z-10 mx-[5vw] mt-[6vh] rounded-[1.3vw] border border-cyan-100/20 bg-[#061d4d]/80 p-[3vw] text-center text-[2vw] font-bold">
                    Cadastre e ative os contatos no administrador.
                </div>
            )}

            <footer className="absolute bottom-[3.2vh] left-1/2 z-10 flex -translate-x-1/2 items-center gap-[1.5vw] whitespace-nowrap">
                <span className="h-px w-[7vw] bg-cyan-300/80" />
                <ShieldCheck className="h-[3.8vh] w-[3.8vh] text-cyan-300" strokeWidth={2.3} />
                <p className="text-[clamp(0.82rem,1.1vw,1.5rem)] font-medium text-white/90">
                    {conteudo.rodape}
                </p>
                <span className="h-px w-[7vw] bg-cyan-300/80" />
            </footer>
        </section>
    )
}
