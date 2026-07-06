"use client"

import { useEffect, useState } from "react"

export function obterYoutubeEmbedUrl(link: string, audioAtivo: boolean) {
    if (!link) return ""

    let videoId = ""

    if (link.includes("watch?v=")) {
        videoId = link.split("watch?v=")[1].split("&")[0]
    }

    if (link.includes("youtu.be/")) {
        videoId = link.split("youtu.be/")[1].split("?")[0]
    }

    if (link.includes("/live/")) {
        videoId = link.split("/live/")[1].split("?")[0]
    }

    if (link.includes("/embed/")) {
        videoId = link.split("/embed/")[1].split("?")[0]
    }

    if (!videoId) return ""

    return `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=${audioAtivo ? "0" : "1"}&playsinline=1&rel=0&enablejsapi=1`
}

export function useYoutubeEmbed(link: string, ativo: boolean) {
    const [audioAtivo, setAudioAtivo] = useState(false)

    useEffect(() => {
        if (!ativo) {
            const timeout = window.setTimeout(() => setAudioAtivo(false), 0)
            return () => window.clearTimeout(timeout)
        }
    }, [ativo])

    return {
        audioAtivo,
        setAudioAtivo,
        youtubeUrl: obterYoutubeEmbedUrl(link, audioAtivo)
    }
}
