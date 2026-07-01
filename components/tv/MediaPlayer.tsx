"use client"

import { useEffect, useState } from "react"
import type { ModoExibicaoMidia } from "@/types/painel"

type TipoMidiaRender = "imagem" | "video"

type MidiaRender = {
  tipo: TipoMidiaRender
  src: string
}

type MediaPlayerProps = {
  tipo: TipoMidiaRender
  src: string
  alt?: string
  className?: string
  fallback?: string
  modoExibicao?: ModoExibicaoMidia
  onErro?: () => void
  onVideoEnded?: (video: HTMLVideoElement) => void
}

export default function MediaPlayer({
  tipo,
  src,
  alt = "Mídia",
  className = "",
  fallback = "",
  modoExibicao = "cover",
  onErro,
  onVideoEnded
}: MediaPlayerProps) {
  const [midiaAtual, setMidiaAtual] = useState<MidiaRender>({ tipo, src })
  const [proximaMidia, setProximaMidia] = useState<MidiaRender | null>(null)
  const [mostrarProxima, setMostrarProxima] = useState(false)

  const classeModoExibicao =
    modoExibicao === "contain" ? "object-contain" : "object-cover"

  useEffect(() => {
    if (!src || src === midiaAtual.src) return

    const timeout = window.setTimeout(() => {
      setProximaMidia({ tipo, src })
      setMostrarProxima(false)
    }, 0)

    return () => window.clearTimeout(timeout)
  }, [src, tipo, midiaAtual.src])

  function finalizarTroca() {
    if (!proximaMidia) return

    setMostrarProxima(true)

    window.setTimeout(() => {
      setMidiaAtual(proximaMidia)
      setProximaMidia(null)
      setMostrarProxima(false)
    }, 700)
  }

  function renderizarMidia(
    midia: MidiaRender,
    camada: "atual" | "proxima"
  ) {
    const ehAtual = camada === "atual"

    const opacidade = ehAtual
      ? mostrarProxima
        ? "opacity-0"
        : "opacity-100"
      : mostrarProxima
        ? "opacity-100"
        : "opacity-0"

    const classeFinal = `absolute inset-0 h-full w-full ${classeModoExibicao} transition-opacity duration-700 ${opacidade} ${className}`

    if (midia.tipo === "imagem") {
      return (
        <img
          src={midia.src}
          alt={alt}
          loading="eager"
          className={classeFinal}
          onLoad={() => {
            if (!ehAtual) finalizarTroca()
          }}
          onError={(e) => {
            if (fallback && e.currentTarget.src !== fallback) {
              e.currentTarget.src = fallback
              return
            }

            onErro?.()
          }}
        />
      )
    }

    return (
      <video
        src={midia.src}
        autoPlay={ehAtual || mostrarProxima}
        muted
        playsInline
        preload="auto"
        className={classeFinal}
        onCanPlay={() => {
          if (!ehAtual) finalizarTroca()
        }}
        onError={() => onErro?.()}
        onEnded={(e) => {
          if (ehAtual) {
            onVideoEnded?.(e.currentTarget)
          }
        }}
      />
    )
  }

  return (
    <div className="relative h-full w-full overflow-hidden bg-[#0F172A]">
      {renderizarMidia(midiaAtual, "atual")}
      {proximaMidia && renderizarMidia(proximaMidia, "proxima")}
    </div>
  )
}
