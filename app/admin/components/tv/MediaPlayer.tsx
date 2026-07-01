"use client"

type MediaPlayerProps = {
  tipo: "imagem" | "video"
  src: string
  alt?: string
  className?: string
  fallback?: string
  onErro?: () => void
  onVideoEnded?: (video: HTMLVideoElement) => void
}

export default function MediaPlayer({
  tipo,
  src,
  alt = "Mídia",
  className = "",
  fallback = "",
  onErro,
  onVideoEnded
}: MediaPlayerProps) {
  if (tipo === "imagem") {
    return (
      <img
        src={src}
        alt={alt}
        loading="eager"
        onError={(e) => {
          if (fallback && e.currentTarget.src !== fallback) {
            e.currentTarget.src = fallback
          }

          onErro?.()
        }}
        className={`h-full w-full object-contain opacity-0 transition-opacity duration-700 ${className}`}
        onLoad={(e) => {
          e.currentTarget.classList.remove("opacity-0")
          e.currentTarget.classList.add("opacity-100")
        }}
      />
    )
  }

  return (
    <video
      src={src}
      autoPlay
      muted
      playsInline
      preload="auto"
      onError={() => onErro?.()}
      onCanPlay={(e) => {
        e.currentTarget.classList.remove("opacity-0")
        e.currentTarget.classList.add("opacity-100")
      }}
      onEnded={(e) => onVideoEnded?.(e.currentTarget)}
      className={`h-full w-full object-contain opacity-0 transition-opacity duration-700 ${className}`}
    />
  )
}