"use client"

import type { BannerTemplateProps } from "./utils"

export default function BannerInstitucional({
    midiaAtual,
    chaveMidiaAtual,
    possuiRotacao,
    onErroImagem,
    onErroVideo,
    onVideoEnded
}: BannerTemplateProps) {
    const areaMidia =
        "absolute inset-x-0 top-0 bottom-[clamp(88px,10vh,132px)] h-auto w-full object-cover"
    const animacaoImagem = possuiRotacao
        ? "scale-[1.02] animate-[zoomBanner_24s_linear_infinite]"
        : ""

    return (
        <div className="absolute inset-0 overflow-hidden">
            {midiaAtual.tipo === "imagem" ? (
                <img
                    key={chaveMidiaAtual}
                    src={midiaAtual.arquivo}
                    alt="Banner institucional"
                    onError={(e) => onErroImagem(e.currentTarget)}
                    className={`${areaMidia} ${animacaoImagem} brightness-[0.92] contrast-[1.04]`}
                />
            ) : (
                <video
                    key={chaveMidiaAtual}
                    src={midiaAtual.arquivo}
                    autoPlay
                    muted
                    playsInline
                    preload="metadata"
                    className={`${areaMidia} brightness-[0.92] contrast-[1.04]`}
                    onError={(e) => onErroVideo(e.currentTarget)}
                    onEnded={(e) => onVideoEnded(e.currentTarget)}
                />
            )}

            <div className="absolute inset-0 bg-gradient-to-r from-[#071633]/85 via-[#071633]/45 to-transparent" />

            <div className="absolute left-[clamp(1rem,4vw,3.5rem)] top-1/2 w-[min(88vw,560px)] -translate-y-1/2">
                <div className="rounded-[2rem] border border-white/10 bg-black/35 p-[clamp(1.25rem,3vw,2.5rem)] shadow-[0_25px_80px_rgba(0,0,0,0.45)]">
                    <div className="mb-6 inline-flex items-center rounded-full border border-[#34bcf8]/30 bg-[#34bcf8]/15 px-5 py-2">
                        <span className="text-sm font-black uppercase tracking-[0.18em] text-[#34bcf8]">
                            {midiaAtual.categoria || "ADUSEPS"}
                        </span>
                    </div>

                    <h1 className="text-[clamp(2rem,4vw,3rem)] font-black leading-[1.05] text-white">
                        {midiaAtual.titulo || "Informacao e acolhimento ao associado"}
                    </h1>

                    <p className="mt-6 text-[clamp(1rem,1.8vw,1.25rem)] leading-relaxed text-white/80">
                        {midiaAtual.subtitulo || "Servicos institucionais, comunicados e conteudos importantes exibidos em tempo real para melhor atendimento."}
                    </p>

                    <div className="mt-10 flex items-center gap-4">
                        <div className="h-1 w-16 rounded-full bg-[#34bcf8]" />

                        <span className="text-sm font-bold uppercase tracking-[0.22em] text-white/60">
                            {midiaAtual.rodape || "Painel Institucional"}
                        </span>
                    </div>

                    {midiaAtual.qrcode && midiaAtual.qrcode.trim() !== "" && (
                        <div className="mt-8 flex items-center gap-5 rounded-2xl border border-white/10 bg-white/10 p-4">
                            <img
                                src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(midiaAtual.qrcode)}`}
                                alt="QR Code"
                                className="h-28 w-28 rounded-xl bg-white p-2"
                            />

                            <div>
                                <p className="text-sm font-bold uppercase tracking-[0.22em] text-white/55">
                                    Acesse pelo celular
                                </p>

                                <p className="mt-2 text-lg font-semibold text-white/85">
                                    {midiaAtual.cta || "Aponte a camera para o QR Code"}
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
