import {
    Clock3,
    ContactRound,
    Gavel,
    GripVertical,
    MessageCircleMore,
    MoreHorizontal,
    Pencil,
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
    onEditar: (midia: Midia) => void
    onAlternar: (midia: Midia) => void
    onExcluir: (midia: Midia) => void
}

export default function MidiaCard({
    midia,
    onEditar,
    onAlternar,
    onExcluir
}: Props) {
    const titulo = obterTituloMidia(midia)
    return (
        <article className="admin-media-card h-full overflow-hidden rounded-lg border border-slate-200 bg-white shadow-[0_4px_14px_rgba(15,23,42,0.05)] transition hover:-translate-y-0.5 hover:shadow-[0_10px_24px_rgba(15,23,42,0.1)]">
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

                <div className="absolute inset-x-3 top-3 flex items-start justify-between gap-2">
                    <span className="rounded border border-white/80 bg-white/95 px-2 py-1 text-[10px] font-black uppercase tracking-wide text-[#0d6efd] shadow-sm">
                        {midia.tipo === "dinamica" ? "Dinâmica" : midia.tipo}
                    </span>

                    <div className="flex flex-col items-end gap-1">
                        <span className={`rounded border px-2 py-1 text-[10px] font-black uppercase ${obterCorStatus(midia.ativo)}`}>
                            {obterTextoStatus(midia.ativo)}
                        </span>

                        {midia.exibicaoProgramada && (
                            <span className={`rounded border px-2 py-1 text-[10px] font-black uppercase ${obterCorProgramacao(true)}`}>
                                {obterTextoProgramacao(midia)}
                            </span>
                        )}
                    </div>
                </div>
            </div>

            <div className="text-slate-950">
                <div className="px-3.5 py-3">
                    <h3 className="truncate text-[15px] font-extrabold leading-tight">
                        {titulo}
                    </h3>
                    <p className="mt-1 text-xs text-slate-500">
                        {midia.tipo === "imagem" || midia.tipo === "dinamica"
                            ? `${midia.duracao}s`
                            : "Até o fim"}
                        {" · "}Ordem {String(midia.ordem).padStart(2, "0")}
                        {" · "}{obterNomeTemplate(midia.template)}
                    </p>
                    {midia.exibicaoProgramada && (
                        <p className="mt-1 truncate text-[11px] font-semibold text-amber-600">
                            {obterTextoProgramacao(midia)}
                        </p>
                    )}
                </div>

                <div className="flex min-h-12 items-center gap-2 border-t border-slate-100 px-3">
                    <GripVertical
                        size={18}
                        className="cursor-grab text-slate-400"
                        aria-label="Arrastar para reordenar"
                    />

                    <button
                        type="button"
                        onClick={() => onAlternar(midia)}
                        className={`relative h-6 w-11 rounded-full transition ${
                            midia.ativo ? "bg-[#0d6efd]" : "bg-slate-300"
                        }`}
                        aria-label={midia.ativo ? "Desativar mídia" : "Ativar mídia"}
                    >
                        <span className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow transition ${
                            midia.ativo ? "left-6" : "left-1"
                        }`} />
                    </button>

                    <button
                        type="button"
                        onClick={() => onEditar(midia)}
                        className="ml-auto inline-flex items-center gap-1.5 rounded-md px-2.5 py-2 text-xs font-bold text-[#0d6efd] hover:bg-blue-50"
                    >
                        <Pencil size={14} />
                        Editar
                    </button>

                    <details className="relative">
                        <summary className="flex h-8 w-9 cursor-pointer list-none items-center justify-center rounded-md border border-slate-200 text-slate-600 hover:bg-slate-50">
                            <MoreHorizontal size={17} />
                        </summary>
                        <div className="absolute bottom-10 right-0 z-10 w-36 rounded-lg border border-slate-200 bg-white p-1.5 shadow-xl">
                            <button
                                type="button"
                                onClick={() => onExcluir(midia)}
                                className="w-full rounded-md px-3 py-2 text-left text-xs font-bold text-red-700 hover:bg-red-50"
                            >
                                Excluir mídia
                            </button>
                        </div>
                    </details>
                </div>
            </div>
        </article>
    )
}
