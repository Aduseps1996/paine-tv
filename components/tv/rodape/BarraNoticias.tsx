"use client"

import type { CategoriaNoticia, Noticia } from "@/types/painel"

type BarraNoticiasProps = {
    mostrar: boolean
    noticias: Noticia[]
    tamanhoFonte: number
    altura: number
    duracaoAnimacao: number
}

function EtiquetaCategoria({
    categoria
}: {
    categoria?: CategoriaNoticia
}) {
    if (!categoria || categoria === "normal") {
        return null
    }

    if (categoria === "institucional") {
        return (
            <span className="mr-[clamp(0.65rem,1.4vw,1.1rem)] inline-flex shrink-0 items-center rounded-[0.28em] bg-white px-[0.7em] py-[0.34em] text-[0.55em] font-black uppercase tracking-[0.09em] text-[#183b78] shadow-sm">
                ADUSEPS informa
            </span>
        )
    }

    if (categoria === "live") {
        return (
            <span className="mr-[clamp(0.65rem,1.4vw,1.1rem)] inline-flex shrink-0 items-center gap-[0.42em] rounded-[0.28em] bg-[#dc2626] px-[0.7em] py-[0.34em] text-[0.55em] font-black uppercase tracking-[0.09em] text-white shadow-sm">
                <span className="h-[0.48em] w-[0.48em] rounded-full bg-white animate-pulse" />
                Ao vivo
            </span>
        )
    }

    return (
        <span className="mr-[clamp(0.65rem,1.4vw,1.1rem)] inline-flex shrink-0 items-center rounded-[0.28em] bg-[#b91c1c] px-[0.7em] py-[0.34em] text-[0.55em] font-black uppercase tracking-[0.09em] text-white shadow-sm">
            Urgente
        </span>
    )
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
                            <span className="mx-[clamp(1rem,3vw,2rem)] inline-flex items-center">
                                <EtiquetaCategoria categoria={noticia.categoria} />
                                <span>{noticia.texto}</span>
                            </span>

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
