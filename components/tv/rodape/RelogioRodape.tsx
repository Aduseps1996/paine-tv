
"use client"

export default function RelogioRodape() {
    return null
}


/* "use client"

import { usePainelRelogio } from "@/hooks/tv/usePainelRelogio"

type RelogioRodapeProps = {
    tamanhoFonteHora?: number
    className?: string
}

export default function RelogioRodape({
    tamanhoFonteHora = 24,
    className = ""
}: RelogioRodapeProps) {
    const { hora, data } = usePainelRelogio()

    return (
        <div className={`absolute right-8 top-6 z-30 ${className}`}>
            <div className="rounded-2xl border border-white/10 bg-black/40 px-5 py-3 text-right text-white shadow-2xl backdrop-blur-sm">
                <div
                    className="font-black leading-none tracking-tight"
                    style={{ fontSize: `${tamanhoFonteHora}px` }}
                >
                    {hora}
                </div>
                <div className="mt-1 text-sm uppercase tracking-[0.2em] text-white/70">
                    {data}
                </div>
            </div>
        </div>
    )
}
 */