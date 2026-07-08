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
            <div className="absolute inset-0 overflow-hidden bg-black text-white">
                {fallback && (
                    <img
                        src={fallback}
                        alt="Imagem padrao"
                        className="absolute inset-0 h-full w-full object-cover opacity-45"
                    />
                )}

                <div className="absolute inset-0 bg-black/55" />

                <div className="relative z-10 flex h-full flex-col items-center justify-center px-8 text-center">
                    <div className="rounded-[34px] border border-white/10 bg-white/10 px-10 py-8 shadow-[0_30px_90px_rgba(0,0,0,0.55)] backdrop-blur-md">
                        <p className="text-xs font-black uppercase tracking-[0.35em] text-red-300">
                            Transmissão ao vivo
                        </p>

                        <h1 className="mt-4 text-4xl font-black uppercase tracking-tight text-white">
                            Indisponível no momento
                        </h1>

                        <p className="mt-3 max-w-xl text-lg font-semibold text-white/70">
                            A programação normal será retomada automaticamente.
                        </p>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div
            key={chaveMidiaAtual}
            className="absolute inset-0 overflow-hidden bg-black"
        >
            <iframe
                key={`${chaveMidiaAtual}-${audioAtivo ? "audio-ligado" : "audio-mudo"}`}
                src={youtubeUrl}
                title="Transmissao ao vivo"
                allow="autoplay; encrypted-media; picture-in-picture"
                allowFullScreen
                className="absolute inset-0 h-full w-full border-0 bg-black"
            />

            <div className="pointer-events-none absolute left-6 top-6 z-40 rounded-full border border-red-400/35 bg-red-600/90 px-5 py-2 shadow-2xl backdrop-blur-md">
                <p className="text-sm font-black uppercase tracking-[0.18em] text-white">
                    Ao vivo • ADUSEPS
                </p>
            </div>

            {!audioAtivo && (
                <button
                    type="button"
                    onClick={() => setAudioAtivo(true)}
                    className="absolute bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-full border border-white/15 bg-red-600/95 px-6 py-3 text-sm font-black uppercase tracking-[0.16em] text-white shadow-2xl transition hover:bg-red-700"
                >
                    Ativar áudio
                </button>
            )}
        </div>
    )
}