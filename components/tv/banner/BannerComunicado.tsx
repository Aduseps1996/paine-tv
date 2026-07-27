"use client"

import {
    AlertTriangle,
    Info,
    MessageSquareWarning
} from "lucide-react"

import type {
    AvisoUrgente,
    PersonalizacaoVisualBanner
} from "@/types/painel"
import FundoBannerPersonalizado from "./FundoBannerPersonalizado"

type Props = {
    comunicado: AvisoUrgente
    personalizacao: PersonalizacaoVisualBanner
}

const aparencias = {
    normal: {
        rotulo: "Comunicado",
        icone: Info,
        fundo: "bg-[radial-gradient(circle_at_82%_18%,rgba(56,189,248,0.38),transparent_33%),radial-gradient(circle_at_10%_90%,rgba(37,99,235,0.3),transparent_38%),linear-gradient(135deg,#041d4c_0%,#063f91_48%,#0873d1_100%)]",
        destaque: "bg-sky-400",
        borda: "border-sky-300/30"
    },
    atencao: {
        rotulo: "Atenção",
        icone: AlertTriangle,
        fundo: "bg-[radial-gradient(circle_at_82%_18%,rgba(251,191,36,0.35),transparent_33%),radial-gradient(circle_at_10%_90%,rgba(245,158,11,0.25),transparent_38%),linear-gradient(135deg,#451a03_0%,#92400e_48%,#d97706_100%)]",
        destaque: "bg-amber-300",
        borda: "border-amber-200/30"
    },
    urgente: {
        rotulo: "Aviso urgente",
        icone: MessageSquareWarning,
        fundo: "bg-[radial-gradient(circle_at_82%_18%,rgba(248,113,113,0.36),transparent_33%),radial-gradient(circle_at_10%_90%,rgba(220,38,38,0.28),transparent_38%),linear-gradient(135deg,#450a0a_0%,#991b1b_48%,#dc2626_100%)]",
        destaque: "bg-red-300",
        borda: "border-red-200/30"
    }
} as const

export default function BannerComunicado({
    comunicado,
    personalizacao
}: Props) {
    const aparencia = aparencias[comunicado.categoria || "normal"]
    const Icone = aparencia.icone

    return (
        <section className={`absolute inset-0 overflow-hidden text-white ${aparencia.fundo}`}>
            <FundoBannerPersonalizado personalizacao={personalizacao} />
            <div className="absolute -right-[8vw] -top-[14vw] h-[38vw] w-[38vw] rounded-full border border-white/10" />
            <div className="absolute -right-[2vw] -top-[8vw] h-[26vw] w-[26vw] rounded-full border border-white/10" />
            <div className="absolute bottom-[-18vw] left-[-12vw] h-[38vw] w-[38vw] rounded-full bg-white/[0.05] blur-2xl" />

            <div className="relative z-[2] flex h-full items-center px-[clamp(3rem,8vw,10rem)] pb-[clamp(3rem,8vh,7rem)] pt-[clamp(6rem,15vh,11rem)]">
                <div className="w-full max-w-[1450px]">
                    <div
                        className={`inline-flex items-center gap-3 rounded-full border bg-white/10 px-5 py-2.5 backdrop-blur-md ${aparencia.borda}`}
                        style={{
                            borderColor: personalizacao.corDestaque,
                            color: personalizacao.corDestaque
                        }}
                    >
                        <Icone className="h-[clamp(1rem,1.6vw,1.6rem)] w-[clamp(1rem,1.6vw,1.6rem)]" />
                        <span className="text-[clamp(0.7rem,1.15vw,1.1rem)] font-black uppercase tracking-[0.22em]">
                            {aparencia.rotulo}
                        </span>
                    </div>

                    <h2
                        className="mt-[clamp(1.5rem,4vh,3.5rem)] max-w-[1350px] text-[clamp(3rem,7.2vw,8.5rem)] font-black leading-[0.9] tracking-[-0.055em] text-white"
                        style={{ color: personalizacao.corTitulo }}
                    >
                        {comunicado.titulo}
                    </h2>

                    <div
                        className={`mt-[clamp(1.4rem,3vh,2.5rem)] h-1.5 w-[clamp(5rem,9vw,9rem)] rounded-full ${aparencia.destaque}`}
                        style={{ backgroundColor: personalizacao.corDestaque }}
                    />

                    <p
                        className="mt-[clamp(1.4rem,3.5vh,3rem)] max-w-[1280px] text-[clamp(1.3rem,2.45vw,2.8rem)] font-semibold leading-[1.2] text-white/88"
                        style={{ color: personalizacao.corTexto }}
                    >
                        {comunicado.mensagem}
                    </p>
                </div>
            </div>

            <div
                className={`absolute inset-x-0 bottom-0 h-[clamp(0.45rem,1vh,0.8rem)] ${aparencia.destaque}`}
                style={{ backgroundColor: personalizacao.corDestaque }}
            />
        </section>
    )
}
