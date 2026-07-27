"use client"

import {
    AlertTriangle,
    Info,
    MessageSquareWarning
} from "lucide-react"

import type { AvisoUrgente } from "@/types/painel"

type Props = {
    aviso: AvisoUrgente | null
}

export default function AvisoUrgenteOverlay({ aviso }: Props) {
    if (!aviso) return null

    const aparencias = {
        normal: {
            rotulo: "Comunicado",
            icone: Info,
            fundo: "border-sky-300/35 bg-[#0755b8]/95",
            barra: "bg-sky-300"
        },
        atencao: {
            rotulo: "Atenção",
            icone: AlertTriangle,
            fundo: "border-amber-200/35 bg-amber-600/95",
            barra: "bg-amber-200"
        },
        urgente: {
            rotulo: "Aviso urgente",
            icone: MessageSquareWarning,
            fundo: "border-red-200/35 bg-red-600/95",
            barra: "bg-red-200"
        }
    } as const

    const aparencia = aparencias[aviso.categoria || "normal"]
    const Icone = aparencia.icone

    return (
        <div className="pointer-events-none absolute inset-x-0 top-0 z-[80] flex justify-center px-[clamp(1rem,3vw,3rem)] pt-[clamp(1rem,3vh,2.5rem)]">
            <div
                className={`w-full max-w-[1380px] overflow-hidden rounded-[clamp(1rem,2vw,1.65rem)] border shadow-[0_28px_90px_rgba(0,0,0,0.55)] backdrop-blur-lg animate-[entradaMidia_280ms_ease-out] ${aparencia.fundo}`}
            >
                <div className="flex items-center gap-[clamp(0.8rem,2vw,1.5rem)] px-[clamp(1rem,2.5vw,2.2rem)] py-[clamp(0.85rem,2vh,1.5rem)]">
                    <div className="flex h-[clamp(3rem,5.2vw,5rem)] w-[clamp(3rem,5.2vw,5rem)] shrink-0 items-center justify-center rounded-[clamp(0.75rem,1.5vw,1.25rem)] bg-white/15">
                        <Icone className="h-[clamp(1.4rem,2.5vw,2.5rem)] w-[clamp(1.4rem,2.5vw,2.5rem)]" />
                    </div>

                    <div className="min-w-0">
                        <p className="text-[clamp(0.6rem,0.9vw,0.85rem)] font-black uppercase tracking-[0.24em] text-white/75">
                            {aparencia.rotulo}
                        </p>

                        <h2 className="mt-1 text-[clamp(1.3rem,2.6vw,2.8rem)] font-black leading-none tracking-[-0.035em] text-white">
                            {aviso.titulo}
                        </h2>

                        {aviso.mensagem && (
                            <p className="mt-2 line-clamp-2 text-[clamp(0.85rem,1.45vw,1.35rem)] font-semibold leading-tight text-white/88">
                                {aviso.mensagem}
                            </p>
                        )}
                    </div>
                </div>

                <div className={`h-[clamp(0.3rem,0.7vh,0.55rem)] ${aparencia.barra}`} />
            </div>
        </div>
    )
}
