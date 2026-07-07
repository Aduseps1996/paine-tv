"use client"

import type { Noticia } from "@/types/painel"

type BarraNoticiasProps = {
    mostrar: boolean
    noticias: Noticia[]
    tamanhoFonte: number
    altura: number
    duracaoAnimacao: number
}

export default function BarraNoticias({
    mostrar,
    noticias,
    tamanhoFonte,
    altura,
    duracaoAnimacao
}: BarraNoticiasProps) {
    if (!mostrar || noticias.length === 0) {
        return null
    }

    return (
        <div className="absolute bottom-0 left-0 z-20 w-full overflow-hidden border-t border-white/10 text-white shadow-[0_-18px_45px_rgba(0,0,0,0.45)]">
            <div
                className="flex items-center overflow-hidden bg-[#183b78]/95 px-[clamp(0.5rem,1.5vw,1.5rem)]"
                style={{ height: `${altura}px` }}
            >
                <div
                    className="whitespace-nowrap animate-[marquee_linear_infinite] font-bold leading-none tracking-normal text-white will-change-transform [transform:translate3d(0,0,0)]"
                    style={{
                        fontSize: `${tamanhoFonte}px`,
                        animationDuration: `${duracaoAnimacao}s`
                    }}
                >
                    {noticias.map((noticia, index) => (
                        <span key={noticia.id} className="inline-flex items-center">
                            <span className="mx-[clamp(1rem,3vw,2rem)]">{noticia.texto}</span>

                            {index < noticias.length - 1 && (
                                <span
                                    className="mx-[clamp(0.75rem,2vw,1.5rem)] text-[#f15434] opacity-90"
                                    style={{ fontSize: `${tamanhoFonte}px` }}
                                >
                                    •
                                </span>
                            )}
                        </span>
                    ))}
                </div>
            </div>
        </div>
    )
}
