"use client"

import { useRef, useState } from "react"
import {
    CircleCheck,
    ExternalLink,
    Expand,
    Eye,
    MonitorUp,
    RefreshCw
} from "lucide-react"

import PainelTV from "@/components/tv/PainelTV"
import {
    AdminButton,
    AdminMetricCard,
    AdminPageHeader,
    AdminPanel
} from "./AdminUI"
import { usePainelDraftContext } from "../context/PainelDraftContext"

type ModoPrevia = "rascunho" | "publicado"

export default function AbaPreviaTV() {
    const {
        draft,
        publicado,
        temAlteracoesPendentes,
        descartarAlteracoes,
        publicar,
        publicando
    } = usePainelDraftContext()

    const [modo, setModo] = useState<ModoPrevia>("rascunho")
    const areaPreviaRef = useRef<HTMLDivElement | null>(null)

    const conteudo = modo === "rascunho" ? draft : publicado
    const midiasAtivas = conteudo.midias.filter((midia) => midia.ativo).length
    const noticiasAtivas = conteudo.noticias.filter((noticia) => noticia.ativo).length
    const comunicadosAtivos = conteudo.comunicados.filter(
        (comunicado) => comunicado.ativo
    ).length

    async function abrirTelaCheia() {
        if (!areaPreviaRef.current) return

        try {
            await areaPreviaRef.current.requestFullscreen()
        } catch {
            alert("Não foi possível abrir a prévia em tela cheia neste navegador.")
        }
    }

    function abrirTVPublicada() {
        window.open("/", "_blank", "noopener,noreferrer")
    }

    return (
        <div className="space-y-5">
            <AdminPageHeader
                titulo="Prévia da TV"
                descricao="Compare o rascunho com a versão publicada e faça a conferência final antes de atualizar o painel."
                acoes={(
                    <>
                        <AdminButton
                            variante="secundario"
                            onClick={abrirTVPublicada}
                        >
                            <span className="flex items-center gap-2">
                                <ExternalLink size={17} />
                                Abrir TV publicada
                            </span>
                        </AdminButton>

                        <AdminButton
                            disabled={!temAlteracoesPendentes || publicando}
                            onClick={publicar}
                        >
                            {publicando ? "Publicando..." : "Publicar na TV"}
                        </AdminButton>
                    </>
                )}
            />

            <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
                <AdminMetricCard
                    rotulo="Situação"
                    valor={temAlteracoesPendentes ? "Pendente" : "Sincronizada"}
                    detalhe={temAlteracoesPendentes
                        ? "Existem mudanças ainda não publicadas"
                        : "Rascunho e TV estão iguais"}
                    icone={temAlteracoesPendentes ? RefreshCw : CircleCheck}
                    destaque={temAlteracoesPendentes ? "ambar" : "verde"}
                />

                <AdminMetricCard
                    rotulo="Visualizando"
                    valor={modo === "rascunho" ? "Rascunho" : "Publicada"}
                    detalhe={modo === "rascunho"
                        ? "Versão em preparação"
                        : "Última versão enviada à TV"}
                    icone={Eye}
                />

                <AdminMetricCard
                    rotulo="Mídias ativas"
                    valor={midiasAtivas}
                    detalhe={`${conteudo.midias.length} cadastradas nesta versão`}
                    icone={MonitorUp}
                />

                <AdminMetricCard
                    rotulo="Notícias ativas"
                    valor={noticiasAtivas}
                    detalhe={`${conteudo.noticias.length} cadastradas nesta versão`}
                    icone={RefreshCw}
                />

                <AdminMetricCard
                    rotulo="Comunicados ativos"
                    valor={comunicadosAtivos}
                    detalhe={`${conteudo.comunicados.length} cadastrados nesta versão`}
                    icone={RefreshCw}
                />
            </section>

            <AdminPanel>
                <div className="flex flex-col gap-4 border-b border-slate-200 px-5 py-4 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                        <h2 className="text-xl font-extrabold tracking-[-0.025em] text-slate-950">
                            Conferência final
                        </h2>
                        <p className="mt-1 text-sm text-slate-600">
                            A prévia reproduz mídias, notícias, comunicados e configurações da versão selecionada.
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                        <div className="flex rounded-lg border border-slate-200 bg-slate-100 p-1">
                            <button
                                type="button"
                                onClick={() => setModo("rascunho")}
                                className={`rounded-md px-3.5 py-2 text-sm font-bold transition ${
                                    modo === "rascunho"
                                        ? "bg-white text-[#0d6efd] shadow-sm"
                                        : "text-slate-600 hover:text-slate-950"
                                }`}
                            >
                                Rascunho
                            </button>
                            <button
                                type="button"
                                onClick={() => setModo("publicado")}
                                className={`rounded-md px-3.5 py-2 text-sm font-bold transition ${
                                    modo === "publicado"
                                        ? "bg-white text-[#0d6efd] shadow-sm"
                                        : "text-slate-600 hover:text-slate-950"
                                }`}
                            >
                                Publicada
                            </button>
                        </div>

                        <button
                            type="button"
                            onClick={abrirTelaCheia}
                            className="flex min-h-11 items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
                        >
                            <Expand size={17} />
                            Tela cheia
                        </button>
                    </div>
                </div>

                <div className="bg-slate-50 p-3 sm:p-6">
                    <div
                        ref={areaPreviaRef}
                        className="mx-auto max-w-[1280px] overflow-hidden rounded-[18px] border-[7px] border-slate-900 bg-black p-2 shadow-[0_22px_55px_rgba(15,23,42,0.22)] fullscreen:max-w-none fullscreen:rounded-none fullscreen:border-0 fullscreen:p-0"
                    >
                        <div className="relative aspect-video overflow-hidden rounded-lg bg-black fullscreen:h-screen fullscreen:rounded-none">
                            <div className="absolute inset-0">
                                <PainelTV
                                    key={modo}
                                    modoPreview
                                    previewConfiguracoes={conteudo.configuracoes}
                                    previewMidias={conteudo.midias}
                                    previewNoticias={conteudo.noticias}
                                    previewComunicados={conteudo.comunicados}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col gap-3 border-t border-slate-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                        <span className={`h-2.5 w-2.5 rounded-full ${
                            modo === "rascunho" ? "bg-amber-500" : "bg-emerald-500"
                        }`} />
                        {modo === "rascunho"
                            ? "Você está conferindo o conteúdo antes da publicação."
                            : "Você está conferindo a última versão publicada."}
                    </div>

                    {temAlteracoesPendentes && (
                        <button
                            type="button"
                            disabled={publicando}
                            onClick={descartarAlteracoes}
                            className="text-sm font-bold text-slate-600 hover:text-rose-600 disabled:opacity-45"
                        >
                            Descartar alterações do rascunho
                        </button>
                    )}
                </div>
            </AdminPanel>

            <AdminPanel className="border-blue-200 bg-blue-50/60 p-5">
                <div className="flex gap-3">
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white text-[#0d6efd] shadow-sm">
                        <Eye size={20} />
                    </span>
                    <div>
                        <h3 className="font-extrabold text-slate-950">
                            Antes de publicar
                        </h3>
                        <p className="mt-1 text-sm leading-relaxed text-slate-600">
                            Confira se a mídia abre corretamente, se o texto do rodapé está legível e se os elementos de clima, data, hora e logo estão na posição esperada.
                        </p>
                    </div>
                </div>
            </AdminPanel>
        </div>
    )
}
