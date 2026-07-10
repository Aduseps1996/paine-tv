"use client"

import type { BannerTemplateProps } from "./utils"
import { useModoTelaPainel } from "@/hooks/tv/useModoTelaPainel"

export default function BannerSocial({
    midiaAtual,
    chaveMidiaAtual,
    possuiRotacao,
    onErroImagem,
    onErroVideo,
    onVideoEnded
}: BannerTemplateProps) {
    const categoria = midiaAtual.categoria || "ACOMPANHE"
    const titulo = midiaAtual.titulo || "Notícias, eventos e muito mais"
    const subtitulo =
        midiaAtual.subtitulo ||
        "Fique por dentro de tudo acompanhando nossos canais oficiais."
    const cta = midiaAtual.cta || "Siga nosso Instagram!"
    const rodape = midiaAtual.rodape || "Escaneie o QR Code e acesse agora"

    const animacaoImagem =
        possuiRotacao && midiaAtual.tipo === "imagem"
            ? "scale-[1.02] animate-[zoomBanner_24s_linear_infinite]"
            : ""

    const { modoCompacto } = useModoTelaPainel()

    if (modoCompacto) {
        return (
            <section className="absolute inset-0 overflow-hidden bg-[#06183d] text-white">
                <div className="absolute inset-0 bg-gradient-to-br from-[#0d9cff] via-[#064bb8] to-[#020617]" />
                <div className="absolute -left-24 top-[-90px] h-72 w-72 rounded-full bg-cyan-300/25 blur-3xl" />

                <div className="relative z-10 grid h-full grid-cols-[minmax(0,1fr)_285px] gap-4 px-6 py-5">
                    <div className="flex min-w-0 flex-col justify-center">
                        <div className="w-fit rounded-full bg-gradient-to-r from-cyan-300 to-cyan-500 px-4 py-1.5">
                            <p className="text-[10px] font-black uppercase tracking-[0.28em] text-white">
                                {categoria}
                            </p>
                        </div>

                        <h1 className="mt-4 max-w-[520px] text-[clamp(1.55rem,3.55vw,2.28rem)] font-black uppercase leading-[1.1] tracking-tight text-white line-clamp-5">
                            {titulo}
                        </h1>

                        <div className="mt-4 h-1.5 w-44 rounded-full bg-gradient-to-r from-cyan-300 to-transparent" />

                        <p className="mt-3 line-clamp-2 max-w-[440px] text-sm font-bold leading-snug text-white/84">
                            {subtitulo}
                        </p>

                        <div className="mt-5 flex items-center gap-4">
                            {midiaAtual.qrcode && midiaAtual.qrcode.trim() !== "" && (
                                <img
                                    src={`https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(
                                        midiaAtual.qrcode
                                    )}`}
                                    alt="QR Code"
                                    className="h-32 w-32 shrink-0 rounded-xl bg-white p-2 shadow-[0_18px_50px_rgba(0,0,0,0.42)]"
                                />
                            )}

                            <div className="min-w-0">
                                <p className="text-xl font-black uppercase leading-tight text-white">
                                    {cta}
                                </p>

                                <div className="mt-2 h-1 w-20 rounded-full bg-cyan-300" />

                                <p className="mt-3 line-clamp-2 max-w-[260px] text-sm font-semibold leading-snug text-white/78">
                                    {rodape}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="flex min-h-0 items-center justify-center px-5 py-5">
                        <div className="relative aspect-[9/16] w-[220px] max-w-full rounded-[2.1rem] border-[5px] border-white/80 bg-black shadow-[0_25px_80px_rgba(0,0,0,0.65)]">
                            <div className="absolute left-1/2 top-2 z-20 h-5 w-24 -translate-x-1/2 rounded-b-2xl bg-black" />
                            <div className="absolute left-1/2 top-4 z-30 h-1 w-10 -translate-x-1/2 rounded-full bg-white/25" />

                            <div className="absolute inset-[8px] overflow-hidden rounded-[1.9rem] bg-black">
                                {midiaAtual.tipo === "video" ? (
                                    <video
                                        key={chaveMidiaAtual}
                                        src={midiaAtual.arquivo}
                                        autoPlay
                                        muted
                                        loop={!possuiRotacao}
                                        playsInline
                                        preload="metadata"
                                        className="h-full w-full object-contain bg-black"
                                        onError={(e) => onErroVideo(e.currentTarget)}
                                        onEnded={(e) => onVideoEnded(e.currentTarget)}
                                    />
                                ) : (
                                    <img
                                        key={chaveMidiaAtual}
                                        src={midiaAtual.arquivo}
                                        alt="Mídia social"
                                        onError={(e) => onErroImagem(e.currentTarget)}
                                        className={`h-full w-full object-contain bg-black ${animacaoImagem}`}
                                    />
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        )
    }

    return (
        <section className="absolute inset-0 overflow-hidden bg-[#06183d] text-white">
            <div className="absolute inset-0 bg-gradient-to-br from-[#0d9cff] via-[#064bb8] to-[#020617]" />
            <div className="absolute -left-32 top-[-80px] h-[420px] w-[420px] rounded-full bg-cyan-300/25 blur-3xl" />

            <div className="relative z-10 grid h-full grid-cols-[minmax(0,1.15fr)_minmax(260px,0.85fr)] gap-6 px-[clamp(1.5rem,4vw,5rem)] py-[clamp(1.25rem,5vh,4rem)]">
                <div className="flex min-w-0 flex-col justify-center">
                    <div className="w-fit rounded-full bg-gradient-to-r from-cyan-300 to-cyan-500 px-7 py-3 shadow-[0_18px_50px_rgba(34,211,238,0.28)]">
                        <p className="text-[clamp(1rem,1.8vw,2rem)] font-black uppercase tracking-[0.35em] text-white">
                            {categoria}
                        </p>
                    </div>

                    <h1 className="mt-7 max-w-[760px] text-[clamp(2.35rem,4.15vw,4.45rem)] font-black uppercase leading-[1.07] tracking-tight text-white drop-shadow-[0_10px_30px_rgba(0,0,0,0.35)] line-clamp-5">
                        {titulo}
                    </h1>

                    <div className="mt-6 h-2 w-[min(360px,55%)] rounded-full bg-gradient-to-r from-cyan-300 to-transparent" />

                    <p className="mt-5 line-clamp-3 max-w-[620px] text-[clamp(1rem,1.55vw,1.55rem)] font-bold leading-snug text-white/86">
                        {subtitulo}
                    </p>

                    <div className="mt-8 flex items-center gap-8">
                        {midiaAtual.qrcode && midiaAtual.qrcode.trim() !== "" && (
                            <img
                                src={`https://api.qrserver.com/v1/create-qr-code/?size=260x260&data=${encodeURIComponent(
                                    midiaAtual.qrcode
                                )}`}
                                alt="QR Code"
                                className="h-[clamp(130px,14vw,230px)] w-[clamp(130px,14vw,230px)] shrink-0 rounded-2xl bg-white p-3 shadow-[0_24px_70px_rgba(0,0,0,0.42)]"
                            />
                        )}

                        <div className="min-w-0">
                            <p className="text-[clamp(1.25rem,2.2vw,2.5rem)] font-black uppercase leading-tight text-white">
                                {cta}
                            </p>

                            <div className="mt-4 h-1.5 w-28 rounded-full bg-cyan-300" />

                            <p className="mt-5 max-w-[420px] text-[clamp(1rem,1.5vw,1.55rem)] font-semibold leading-snug text-white/82">
                                {rodape}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="flex min-h-0 items-center justify-center px-[clamp(1.5rem,3vw,3rem)] py-[clamp(1.5rem,4vh,3rem)]">
                    <div className="relative aspect-[9/16] w-[min(25vw,360px)] max-w-full rounded-[3rem] border-[7px] border-white/85 bg-black shadow-[0_35px_120px_rgba(0,0,0,0.65)]">
                        <div className="absolute left-1/2 top-3 z-20 h-7 w-32 -translate-x-1/2 rounded-b-3xl bg-black" />
                        <div className="absolute left-1/2 top-5 z-30 h-1.5 w-14 -translate-x-1/2 rounded-full bg-white/25" />

                        <div className="absolute inset-[12px] overflow-hidden rounded-[2.45rem] bg-black">
                            {midiaAtual.tipo === "video" ? (
                                <video
                                    key={chaveMidiaAtual}
                                    src={midiaAtual.arquivo}
                                    autoPlay
                                    muted
                                    loop={!possuiRotacao}
                                    playsInline
                                    preload="metadata"
                                    className="h-full w-full object-contain bg-black"
                                    onError={(e) => onErroVideo(e.currentTarget)}
                                    onEnded={(e) => onVideoEnded(e.currentTarget)}
                                />
                            ) : (
                                <img
                                    key={chaveMidiaAtual}
                                    src={midiaAtual.arquivo}
                                    alt="Mídia social"
                                    onError={(e) => onErroImagem(e.currentTarget)}
                                    className={`h-full w-full object-contain bg-black ${animacaoImagem}`}
                                />
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
