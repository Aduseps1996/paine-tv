"use client"

import type { BannerTemplateProps } from "./utils"

export default function BannerCheio({
    midiaAtual,
    chaveMidiaAtual,
    onErroImagem,
    onErroVideo,
    onVideoEnded
}: BannerTemplateProps) {
    const areaMidia =
        "absolute inset-0 h-full w-full object-cover"

    return (
        <>
            {midiaAtual.tipo === "imagem" ? (
                <img
                    key={chaveMidiaAtual}
                    src={midiaAtual.arquivo}
                    alt="Banner"
                    onError={(e) => onErroImagem(e.currentTarget)}
                    className={areaMidia}
                />
            ) : (
                <video
                    key={chaveMidiaAtual}
                    src={midiaAtual.arquivo}
                    autoPlay
                    muted
                    playsInline
                    preload="metadata"
                    className={areaMidia}
                    onError={(e) => onErroVideo(e.currentTarget)}
                    onEnded={(e) => onVideoEnded(e.currentTarget)}
                />
            )}
        </>
    )
}