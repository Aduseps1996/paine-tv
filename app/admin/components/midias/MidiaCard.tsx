import {
    Clock3,
    ContactRound,
    Gavel,
    MessageCircleMore,
    Phone
} from "lucide-react"

import type { Midia } from "@/types/painel"

import {
    obterCorProgramacao,
    obterCorStatus,
    obterNomeTemplate,
    obterTextoProgramacao,
    obterTextoStatus,
    obterTituloMidia
} from "./helpers"

type Props = {
    midia: Midia
    onAlternar: (midia: Midia) => void
    onExcluir: (midia: Midia) => void
    onAlterarOrdem: (id: string, ordem: number) => void
    onAtualizar: (id: string, dados: Partial<Midia>) => void
    exibirExibicao: boolean
    exibirTarja: boolean
    exibirPlantao: boolean
    onToggleExibicao: (midia: Midia) => void
    onToggleTarja: (midia: Midia) => void
    onTogglePlantao: (midia: Midia) => void
    children?: React.ReactNode
}

export default function MidiaCard({
    midia,
    onAlternar,
    onExcluir,
    onAlterarOrdem,
    onAtualizar,
    exibirExibicao,
    exibirTarja,
    exibirPlantao,
    onToggleExibicao,
    onToggleTarja,
    onTogglePlantao,
    children
}: Props) {
    const titulo = obterTituloMidia(midia)
    const orientacaoVideoLabel = midia.orientacaoVideo
        ? {
            horizontal: "Horizontal",
            vertical: "Vertical",
            quadrado: "Quadrado"
        }[midia.orientacaoVideo]
        : null

    return (
        <article className="overflow-hidden rounded-[30px] border border-white/10 bg-zinc-900/85 shadow-[0_24px_70px_rgba(0,0,0,0.28)]">
            <div className="relative aspect-video overflow-hidden bg-black">

                {midia.tipo === "imagem" && (
                    <img
                        src={midia.arquivo}
                        alt={titulo}
                        className="absolute inset-0 h-full w-full object-cover"
                    />
                )}

                {midia.tipo === "video" && (
                    <>
                        {midia.thumbnailUrl ? (
                            <img
                                src={midia.thumbnailUrl}
                                alt={titulo}
                                className="absolute inset-0 h-full w-full object-cover"
                            />
                        ) : (
                            <video
                                src={midia.arquivo}
                                muted
                                controls
                                className="absolute inset-0 h-full w-full object-contain"
                            />
                        )}

                        {midia.thumbnailUrl && (
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-black/70 backdrop-blur-sm transition-transform duration-200 hover:scale-110">
                                    <svg
                                        viewBox="0 0 24 24"
                                        fill="white"
                                        className="ml-1 h-7 w-7"
                                    >
                                        <path d="M8 5v14l11-7z" />
                                    </svg>
                                </div>
                            </div>
                        )}
                    </>
                )}

                {midia.tipo === "youtube" && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black px-6 text-center">
                        <div className="rounded-full border border-red-400/25 bg-red-500/10 px-4 py-2 text-sm font-black text-red-300">
                            YouTube / Live
                        </div>

                        <p className="mt-4 max-w-full break-all text-xs text-zinc-500">
                            {midia.linkYoutubeExibicao || midia.arquivo}
                        </p>
                    </div>
                )}

                {midia.template === "plantao-juridico" && (
                    <div className="absolute inset-0 grid grid-cols-[34%_42%_24%] overflow-hidden bg-[radial-gradient(circle_at_88%_12%,#78eaff_0%,transparent_28%),linear-gradient(120deg,#06146d_0%,#073da9_50%,#00a8e0_100%)]">
                        <div className="flex flex-col justify-center border-r border-cyan-300/70 px-5">
                            <Clock3 className="h-9 w-9 text-white" strokeWidth={1.8} />
                            <p className="mt-2 text-xl font-black leading-none text-white">
                                Plantão
                            </p>
                            <p className="text-lg font-black uppercase text-cyan-300">
                                Judicial
                            </p>
                            <div className="mt-3 flex items-center gap-2 text-[10px] font-bold text-white">
                                <MessageCircleMore className="h-5 w-5 text-green-400" />
                                {midia.plantao?.whatsapp || "(81) 99838-2275"}
                            </div>
                        </div>

                        <div className="flex items-center px-5">
                            <p className="line-clamp-3 text-lg font-black leading-tight text-white">
                                {midia.plantao?.chamadaPadrao ||
                                    "Urgências não esperam até segunda-feira."}
                            </p>
                        </div>

                        <div className="flex items-center justify-center">
                            <Gavel className="h-20 w-20 rotate-[28deg] text-amber-950 drop-shadow-xl" strokeWidth={1.5} />
                        </div>
                    </div>
                )}

                {midia.template === "contatos-oficiais" && (
                    <div className="absolute inset-0 overflow-hidden bg-[linear-gradient(120deg,#06143c_0%,#064696_60%,#05a4ca_100%)] p-6">
                        <div className="flex items-center gap-2 text-cyan-200">
                            <ContactRound className="h-5 w-5" />
                            <p className="text-[10px] font-black uppercase tracking-[0.2em]">
                                Canais oficiais ADUSEPS
                            </p>
                        </div>
                        <h3 className="mt-4 text-2xl font-black leading-none text-white">
                            {midia.contatosOficiais?.titulo || "Fale com a ADUSEPS"}
                        </h3>
                        <div className="mt-5 grid grid-cols-4 gap-2">
                            {["Recepção", "Plantão", "Social", "Jurídico"].map(
                                (titulo, indice) => (
                                    <div
                                        key={titulo}
                                        className="rounded-xl bg-white/95 p-3 text-[#082e68]"
                                    >
                                        {indice === 0 ? (
                                            <Phone className="h-4 w-4 text-sky-600" />
                                        ) : (
                                            <MessageCircleMore className="h-4 w-4 text-emerald-600" />
                                        )}
                                        <p className="mt-2 text-[9px] font-black">
                                            {titulo}
                                        </p>
                                    </div>
                                )
                            )}
                        </div>
                    </div>
                )}

                <div className="absolute left-4 top-4 flex flex-wrap gap-2">
                    <span className={`rounded-full border px-3 py-1 text-xs font-black ${obterCorStatus(midia.ativo)}`}>
                        {obterTextoStatus(midia.ativo)}
                    </span>

                    <span className={`rounded-full border px-3 py-1 text-xs font-black ${obterCorProgramacao(midia.exibicaoProgramada)}`}>
                        {obterTextoProgramacao(midia)}
                    </span>
                </div>
            </div>

            <div className="p-5">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                        <h3 className="text-xl font-black leading-tight">
                            {titulo}
                        </h3>

                        {midia.template !== "plantao-juridico" &&
                            midia.template !== "contatos-oficiais" && (
                            <p className="mt-2 max-w-xl break-all text-sm text-zinc-500">
                                {midia.arquivo}
                            </p>
                        )}

                        {midia.tipo === "video" && (
                            <div className="mt-3 flex flex-wrap gap-2 text-xs font-bold text-zinc-300">
                                {midia.duracaoVideo && (
                                    <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1">
                                        Duração: {Math.floor(midia.duracaoVideo / 60)}:
                                        {String(midia.duracaoVideo % 60).padStart(2, "0")}
                                    </span>
                                )}

                                {midia.larguraVideo && midia.alturaVideo && (
                                    <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1">
                                        {midia.larguraVideo} × {midia.alturaVideo}
                                    </span>
                                )}

                                {midia.orientacaoVideo && (
                                    <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1">
                                        {orientacaoVideoLabel}
                                    </span>
                                )}

                                {midia.tamanhoBytes && (
                                    <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1">
                                        {(midia.tamanhoBytes / 1024 / 1024).toFixed(2)} MB
                                    </span>
                                )}
                            </div>
                        )}
                    </div>

                    <span className="w-fit rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs font-black text-zinc-300">
                        {obterNomeTemplate(midia.template)}
                    </span>
                </div>

                <div className="mt-5 grid grid-cols-3 gap-3">
                    <div className="rounded-2xl border border-white/10 bg-zinc-950/60 p-3">
                        <p className="text-[10px] font-black uppercase tracking-[0.22em] text-zinc-500">
                            Ordem
                        </p>

                        <input
                            type="number"
                            min="1"
                            value={midia.ordem}
                            onChange={(e) => onAlterarOrdem(midia.id, Number(e.target.value))}
                            className="mt-2 w-full bg-transparent text-sm font-black text-white outline-none"
                        />
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-zinc-950/60 p-3">
                        <p className="text-[10px] font-black uppercase tracking-[0.22em] text-zinc-500">
                            Duração
                        </p>

                        {midia.tipo === "imagem" || midia.tipo === "dinamica" ? (
                            <input
                                type="number"
                                min="1"
                                value={midia.duracao}
                                onChange={(e) =>
                                    onAtualizar(midia.id, {
                                        duracao: Number(e.target.value)
                                    })
                                }
                                className="mt-2 w-full bg-transparent text-sm font-black text-white outline-none"
                            />
                        ) : (
                            <p className="mt-2 text-sm font-black text-zinc-300">
                                Até o fim
                            </p>
                        )}
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-zinc-950/60 p-3">
                        <p className="text-[10px] font-black uppercase tracking-[0.22em] text-zinc-500">
                            Repetição
                        </p>

                        <input
                            type="number"
                            min="1"
                            max="10"
                            value={midia.pesoExibicao || 1}
                            onChange={(e) =>
                                onAtualizar(midia.id, {
                                    pesoExibicao: Number(e.target.value)
                                })
                            }
                            className="mt-2 w-full bg-transparent text-sm font-black text-white outline-none"
                        />
                    </div>
                </div>

                <div className="mt-5 flex flex-wrap gap-3">
                    <button
                        type="button"
                        onClick={() => onAlternar(midia)}
                        className="rounded-2xl border border-zinc-700 bg-zinc-950/70 px-4 py-3 text-sm font-black text-zinc-200"
                    >
                        {midia.ativo ? "Desativar" : "Ativar"}
                    </button>

                    <button
                        type="button"
                        onClick={() => onToggleExibicao(midia)}
                        className={`rounded-2xl px-4 py-3 text-sm font-black ${exibirExibicao
                            ? "border border-sky-300/30 bg-sky-500 text-white"
                            : "border border-white/10 bg-white/[0.04] text-zinc-200"
                            }`}
                    >
                        Configurar exibição
                    </button>

                    {midia.template === "plantao-juridico" ||
                    midia.template === "contatos-oficiais" ? (
                        <button
                            type="button"
                            onClick={() => onTogglePlantao(midia)}
                            className={`rounded-2xl px-4 py-3 text-sm font-black ${exibirPlantao
                                ? "border border-cyan-300/30 bg-cyan-500 text-white"
                                : "border border-white/10 bg-white/[0.04] text-zinc-200"
                                }`}
                        >
                            Editar conteúdo
                        </button>
                    ) : (
                        <button
                            type="button"
                            onClick={() => onToggleTarja(midia)}
                            className={`rounded-2xl px-4 py-3 text-sm font-black ${exibirTarja
                                ? "border border-sky-300/30 bg-sky-500 text-white"
                                : "border border-white/10 bg-white/[0.04] text-zinc-200"
                                }`}
                        >
                            Tarja
                        </button>
                    )}

                    <button
                        type="button"
                        onClick={() => onExcluir(midia)}
                        className="rounded-2xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm font-black text-red-300"
                    >
                        Excluir
                    </button>
                </div>

                {children}
            </div>
        </article>
    )
}
