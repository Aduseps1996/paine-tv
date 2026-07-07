"use client"

import type { Midia } from "@/types/painel"

type Props = {
  midia: Midia
  fallback: string
  possuiRotacao: boolean
  onErroMidia: (midia: Midia) => void
  onVideoEnded: (video: HTMLVideoElement) => void
}

export default function MediaPlayer({
  midia,
  fallback,
  possuiRotacao,
  onErroMidia,
  onVideoEnded
}: Props) {
  const classeObjeto =
    midia.modoExibicao === "cover" ? "object-cover" : "object-contain"

  const animacaoImagem =
    possuiRotacao && midia.tipo === "imagem"
      ? "scale-[1.02] animate-[zoomBanner_22s_linear_infinite]"
      : ""

  if (midia.tipo === "video") {
    return (
      <video
        src={midia.arquivo}
        className={`h-full w-full ${classeObjeto}`}
        autoPlay
        muted
        playsInline
        preload="auto"
        onError={() => onErroMidia(midia)}
        onEnded={(e) => onVideoEnded(e.currentTarget)}
      />
    )
  }

  return (
    <img
      src={midia.arquivo}
      className={`h-full w-full ${classeObjeto} ${animacaoImagem}`}
      alt=""
      onError={(e) => {
        if (fallback && e.currentTarget.src !== fallback) {
          e.currentTarget.src = fallback
          return
        }

        onErroMidia(midia)
      }}
    />
  )
}
