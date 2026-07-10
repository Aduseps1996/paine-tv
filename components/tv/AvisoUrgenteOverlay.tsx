"use client"

import type { AvisoUrgente } from "@/types/painel"

type Props = {
    aviso: AvisoUrgente | null
}

export default function AvisoUrgenteOverlay({ aviso }: Props) {
    if (!aviso) return null

    const urgente = aviso.categoria === "urgente"

    return (
        <div className="pointer-events-none absolute inset-x-0 top-0 z-[80] flex justify-center px-5 pt-5">
            <div
                className={`w-full max-w-[1180px] overflow-hidden rounded-[26px] border shadow-[0_28px_90px_rgba(0,0,0,0.6)] backdrop-blur-md animate-[entradaMidia_280ms_ease-out] ${
                    urgente
                        ? "border-red-300/35 bg-red-600/92"
                        : "border-sky-300/30 bg-[#063ea8]/92"
                }`}
            >
                <div className="flex items-center gap-4 px-6 py-4">
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/18 text-3xl">
                        {urgente ? "!" : "i"}
                    </div>

                    <div className="min-w-0">
                        <p className="text-xs font-black uppercase tracking-[0.28em] text-white/75">
                            {urgente ? "Aviso urgente" : "Comunicado"}
                        </p>

                        <h2 className="mt-1 truncate text-[clamp(1.4rem,3vw,2.8rem)] font-black uppercase leading-none text-white">
                            {aviso.titulo}
                        </h2>

                        {aviso.mensagem && (
                            <p className="mt-2 line-clamp-2 text-[clamp(0.95rem,1.7vw,1.45rem)] font-bold leading-tight text-white/88">
                                {aviso.mensagem}
                            </p>
                        )}
                    </div>
                </div>

                <div className="h-1.5 bg-white/65" />
            </div>
        </div>
    )
}
