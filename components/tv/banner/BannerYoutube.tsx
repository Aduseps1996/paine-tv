"use client"

import { useYoutubeEmbed } from "@/hooks/tv/useYoutubeEmbed"
import type { Midia } from "@/types/painel"

type Props = {
    midiaAtual: Midia
    fallback: string
    chaveMidiaAtual: string
}

export default function BannerYoutube({
    midiaAtual,
    fallback,
    chaveMidiaAtual
}: Props) {
    const { audioAtivo, setAudioAtivo, youtubeUrl } = useYoutubeEmbed(
        midiaAtual.linkYoutubeExibicao || midiaAtual.arquivo || "",
        true
    )

    if (!youtubeUrl) {
        return (
            <div className="absolute inset-0 bg-black">
                {fallback && (
                    <img
                        src={fallback}
                        alt="Imagem padrao"
                        className="absolute inset-0 h-full w-full object-cover"
                    />
                )}
            </div>
        )
    }

    return (
        <div
            key={chaveMidiaAtual}
            className="absolute inset-x-0 top-0 bottom-[clamp(88px,10vh,132px)] bg-black"
        >
            <iframe
                key={`${chaveMidiaAtual}-${audioAtivo ? "audio-ligado" : "audio-mudo"}`}
                src={youtubeUrl}
                title="Transmissao ao vivo"
                allow="autoplay; encrypted-media; picture-in-picture"
                allowFullScreen
                className="absolute inset-0 h-full w-full border-0 bg-black"
            />

            {!audioAtivo && (
                <button
                    type="button"
                    onClick={() => setAudioAtivo(true)}
                    className="absolute bottom-8 left-1/2 z-50 -translate-x-1/2 rounded-full bg-red-600 px-8 py-4 text-lg font-black text-white shadow-2xl transition hover:bg-red-700"
                >
                    Ativar audio da transmissao
                </button>
            )}
        </div>
    )
}
