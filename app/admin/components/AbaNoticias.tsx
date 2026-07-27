"use client"

import { useMemo, useState } from "react"
import {
    ArrowDown,
    ArrowUp,
    CalendarClock,
    CheckCircle2,
    CircleOff,
    Clock3,
    Eye,
    FileText,
    Filter,
    Megaphone,
    Newspaper,
    Pencil,
    Plus,
    Search,
    Trash2,
    X
} from "lucide-react"

import type { CategoriaNoticia, Noticia } from "@/types/painel"
import { usePainelDraftContext } from "../context/PainelDraftContext"
import {
    AdminButton,
    AdminMetricCard,
    AdminPageHeader,
    AdminPanel
} from "./AdminUI"

type FiltroStatus = "todas" | "ativas" | "inativas" | "programadas"

type FormularioNoticia = {
    texto: string
    categoria: CategoriaNoticia
    programada: boolean
    inicioExibicao: string
    fimExibicao: string
}

const formularioInicial: FormularioNoticia = {
    texto: "",
    categoria: "normal",
    programada: false,
    inicioExibicao: "",
    fimExibicao: ""
}

const categorias: Array<{
    id: CategoriaNoticia
    nome: string
    descricao: string
    classe: string
}> = [
    {
        id: "normal",
        nome: "Normal",
        descricao: "Informação geral",
        classe: "border-blue-200 bg-blue-50 text-blue-700"
    },
    {
        id: "institucional",
        nome: "Institucional",
        descricao: "Aviso da associação",
        classe: "border-violet-200 bg-violet-50 text-violet-700"
    },
    {
        id: "live",
        nome: "Ao vivo",
        descricao: "Transmissão ou evento",
        classe: "border-emerald-200 bg-emerald-50 text-emerald-700"
    },
    {
        id: "urgente",
        nome: "Urgente",
        descricao: "Mensagem prioritária",
        classe: "border-red-200 bg-red-50 text-red-700"
    }
]

function obterCategoria(categoria?: CategoriaNoticia) {
    return categorias.find((item) => item.id === categoria) || categorias[0]
}

function EtiquetaCategoriaPreview({
    categoria
}: {
    categoria: CategoriaNoticia
}) {
    if (categoria === "normal") {
        return null
    }

    if (categoria === "institucional") {
        return (
            <span className="mr-2 inline-flex shrink-0 items-center rounded bg-white px-2 py-1 text-[8px] font-black uppercase tracking-wider text-[#183b78]">
                ADUSEPS informa
            </span>
        )
    }

    if (categoria === "live") {
        return (
            <span className="mr-2 inline-flex shrink-0 items-center gap-1 rounded bg-red-600 px-2 py-1 text-[8px] font-black uppercase tracking-wider text-white">
                <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
                Ao vivo
            </span>
        )
    }

    return (
        <span className="mr-2 inline-flex shrink-0 items-center rounded bg-red-700 px-2 py-1 text-[8px] font-black uppercase tracking-wider text-white">
            Urgente
        </span>
    )
}

function obterStatus(noticia: Noticia) {
    if (!noticia.ativo) {
        return {
            texto: "Inativa",
            classe: "border-slate-200 bg-slate-100 text-slate-600"
        }
    }

    if (!noticia.programada) {
        return {
            texto: "Em exibição",
            classe: "border-emerald-200 bg-emerald-50 text-emerald-700"
        }
    }

    if (!noticia.inicioExibicao || !noticia.fimExibicao) {
        return {
            texto: "Programação incompleta",
            classe: "border-amber-200 bg-amber-50 text-amber-800"
        }
    }

    const agora = new Date()
    const inicio = new Date(noticia.inicioExibicao)
    const fim = new Date(noticia.fimExibicao)

    if (Number.isNaN(inicio.getTime()) || Number.isNaN(fim.getTime())) {
        return {
            texto: "Data inválida",
            classe: "border-red-200 bg-red-50 text-red-700"
        }
    }

    if (agora < inicio) {
        return {
            texto: "Agendada",
            classe: "border-blue-200 bg-blue-50 text-blue-700"
        }
    }

    if (agora > fim) {
        return {
            texto: "Encerrada",
            classe: "border-slate-200 bg-slate-100 text-slate-600"
        }
    }

    return {
        texto: "Em exibição",
        classe: "border-emerald-200 bg-emerald-50 text-emerald-700"
    }
}

function formatarData(valor?: string) {
    if (!valor) return "Não definida"

    const data = new Date(valor)
    if (Number.isNaN(data.getTime())) return "Data inválida"

    return new Intl.DateTimeFormat("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
    }).format(data)
}

export default function AbaNoticias() {
    const { draft, atualizarNoticiasDraft } = usePainelDraftContext()
    const noticias = draft.noticias

    const [busca, setBusca] = useState("")
    const [filtroStatus, setFiltroStatus] = useState<FiltroStatus>("todas")
    const [filtroCategoria, setFiltroCategoria] =
        useState<"todas" | CategoriaNoticia>("todas")
    const [formularioAberto, setFormularioAberto] = useState(false)
    const [idEdicao, setIdEdicao] = useState<string | null>(null)
    const [formulario, setFormulario] =
        useState<FormularioNoticia>(formularioInicial)
    const [erroFormulario, setErroFormulario] = useState("")

    const noticiasAtivas = noticias.filter((noticia) => noticia.ativo).length
    const noticiasInativas = noticias.length - noticiasAtivas
    const noticiasProgramadas = noticias.filter(
        (noticia) => noticia.programada
    ).length

    const noticiasFiltradas = useMemo(() => {
        const termo = busca.trim().toLowerCase()

        return [...noticias]
            .sort((a, b) => a.ordem - b.ordem)
            .filter((noticia) => {
                const correspondeBusca =
                    !termo ||
                    `${noticia.texto} ${noticia.categoria || "normal"}`
                        .toLowerCase()
                        .includes(termo)

                const correspondeStatus =
                    filtroStatus === "todas" ||
                    (filtroStatus === "ativas" && noticia.ativo) ||
                    (filtroStatus === "inativas" && !noticia.ativo) ||
                    (filtroStatus === "programadas" && noticia.programada)

                const correspondeCategoria =
                    filtroCategoria === "todas" ||
                    (noticia.categoria || "normal") === filtroCategoria

                return (
                    correspondeBusca &&
                    correspondeStatus &&
                    correspondeCategoria
                )
            })
    }, [busca, filtroCategoria, filtroStatus, noticias])

    function atualizarNoticia(id: string, dados: Partial<Noticia>) {
        atualizarNoticiasDraft(
            noticias.map((noticia) =>
                noticia.id === id ? { ...noticia, ...dados } : noticia
            )
        )
    }

    function abrirNovaNoticia() {
        setIdEdicao(null)
        setFormulario(formularioInicial)
        setErroFormulario("")
        setFormularioAberto(true)
    }

    function abrirEdicao(noticia: Noticia) {
        setIdEdicao(noticia.id)
        setFormulario({
            texto: noticia.texto,
            categoria: noticia.categoria || "normal",
            programada: noticia.programada ?? false,
            inicioExibicao: noticia.inicioExibicao || "",
            fimExibicao: noticia.fimExibicao || ""
        })
        setErroFormulario("")
        setFormularioAberto(true)
    }

    function fecharFormulario() {
        setFormularioAberto(false)
        setIdEdicao(null)
        setFormulario(formularioInicial)
        setErroFormulario("")
    }

    function salvarNoticia() {
        const texto = formulario.texto.trim()

        if (!texto) {
            setErroFormulario("Digite a mensagem que será exibida no rodapé.")
            return
        }

        if (formulario.programada) {
            if (!formulario.inicioExibicao || !formulario.fimExibicao) {
                setErroFormulario(
                    "Preencha o início e o encerramento da programação."
                )
                return
            }

            const inicio = new Date(formulario.inicioExibicao)
            const fim = new Date(formulario.fimExibicao)

            if (
                Number.isNaN(inicio.getTime()) ||
                Number.isNaN(fim.getTime()) ||
                fim <= inicio
            ) {
                setErroFormulario(
                    "O encerramento precisa ser posterior ao início."
                )
                return
            }
        }

        if (idEdicao) {
            atualizarNoticiasDraft(
                noticias.map((noticia) =>
                    noticia.id === idEdicao
                        ? {
                              ...noticia,
                              texto,
                              categoria: formulario.categoria,
                              programada: formulario.programada,
                              inicioExibicao: formulario.programada
                                  ? formulario.inicioExibicao
                                  : "",
                              fimExibicao: formulario.programada
                                  ? formulario.fimExibicao
                                  : ""
                          }
                        : noticia
                )
            )
        } else {
            atualizarNoticiasDraft([
                ...noticias,
                {
                    id: `draft-${Date.now()}`,
                    texto,
                    ativo: true,
                    ordem: noticias.length + 1,
                    categoria: formulario.categoria,
                    programada: formulario.programada,
                    inicioExibicao: formulario.programada
                        ? formulario.inicioExibicao
                        : "",
                    fimExibicao: formulario.programada
                        ? formulario.fimExibicao
                        : ""
                }
            ])
        }

        fecharFormulario()
    }

    function moverNoticia(id: string, direcao: -1 | 1) {
        const ordenadas = [...noticias].sort((a, b) => a.ordem - b.ordem)
        const indiceAtual = ordenadas.findIndex((noticia) => noticia.id === id)
        const novoIndice = indiceAtual + direcao

        if (
            indiceAtual < 0 ||
            novoIndice < 0 ||
            novoIndice >= ordenadas.length
        ) {
            return
        }

        const [movida] = ordenadas.splice(indiceAtual, 1)
        ordenadas.splice(novoIndice, 0, movida)

        atualizarNoticiasDraft(
            ordenadas.map((noticia, index) => ({
                ...noticia,
                ordem: index + 1
            }))
        )
    }

    function removerNoticia(noticia: Noticia) {
        if (!confirm(`Excluir a notícia "${noticia.texto}"?`)) return

        atualizarNoticiasDraft(
            noticias
                .filter((item) => item.id !== noticia.id)
                .sort((a, b) => a.ordem - b.ordem)
                .map((item, index) => ({ ...item, ordem: index + 1 }))
        )
    }

    return (
        <div className="space-y-6">
            <AdminPageHeader
                titulo="Notícias"
                descricao="Organize as mensagens que passam no rodapé da TV. As alterações permanecem no rascunho até a publicação."
                acoes={
                    <AdminButton onClick={abrirNovaNoticia}>
                        <span className="flex items-center gap-2">
                            <Plus size={18} />
                            Nova notícia
                        </span>
                    </AdminButton>
                }
            />

            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                <AdminMetricCard
                    rotulo="Total"
                    valor={noticias.length}
                    detalhe="notícias no rascunho"
                    icone={Newspaper}
                />
                <AdminMetricCard
                    rotulo="Ativas"
                    valor={noticiasAtivas}
                    detalhe="disponíveis no rodapé"
                    icone={CheckCircle2}
                    destaque="verde"
                />
                <AdminMetricCard
                    rotulo="Inativas"
                    valor={noticiasInativas}
                    detalhe="temporariamente ocultas"
                    icone={CircleOff}
                />
                <AdminMetricCard
                    rotulo="Programadas"
                    valor={noticiasProgramadas}
                    detalhe="com período definido"
                    icone={CalendarClock}
                    destaque="ambar"
                />
            </div>

            <AdminPanel>
                <div className="border-b border-slate-200 px-5 py-5 sm:px-6">
                    <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
                        <div>
                            <h2 className="text-xl font-extrabold text-slate-950">
                                Biblioteca de notícias
                            </h2>
                            <p className="mt-1 text-sm text-slate-500">
                                {noticiasFiltradas.length} de {noticias.length}{" "}
                                notícia(s) encontrada(s).
                            </p>
                        </div>

                        <div className="relative w-full xl:max-w-md">
                            <Search
                                size={18}
                                className="pointer-events-none absolute left-3.5 top-1/2 z-10 -translate-y-1/2 text-slate-400"
                            />
                            <input
                                type="search"
                                value={busca}
                                onChange={(evento) =>
                                    setBusca(evento.target.value)
                                }
                                placeholder="Pesquisar notícia..."
                                className="pl-10!"
                            />
                        </div>
                    </div>

                    <div className="mt-4 flex flex-col gap-3 lg:flex-row lg:items-center">
                        <div className="flex items-center gap-2 text-sm font-bold text-slate-600">
                            <Filter size={17} />
                            Filtros
                        </div>

                        <div className="flex flex-wrap gap-2">
                            {(
                                [
                                    ["todas", "Todas"],
                                    ["ativas", "Ativas"],
                                    ["inativas", "Inativas"],
                                    ["programadas", "Programadas"]
                                ] as Array<[FiltroStatus, string]>
                            ).map(([id, nome]) => (
                                <button
                                    type="button"
                                    key={id}
                                    onClick={() => setFiltroStatus(id)}
                                    className={`rounded-lg px-3.5 py-2 text-sm font-bold ${
                                        filtroStatus === id
                                            ? "border-[#0d6efd] bg-blue-50 text-[#0d6efd]"
                                            : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                                    }`}
                                >
                                    {nome}
                                </button>
                            ))}
                        </div>

                        <span className="hidden h-7 w-px bg-slate-200 lg:block" />

                        <select
                            value={filtroCategoria}
                            onChange={(evento) =>
                                setFiltroCategoria(
                                    evento.target.value as
                                        | "todas"
                                        | CategoriaNoticia
                                )
                            }
                            className="lg:max-w-[210px]"
                        >
                            <option value="todas">Todas as categorias</option>
                            {categorias.map((categoria) => (
                                <option
                                    key={categoria.id}
                                    value={categoria.id}
                                >
                                    {categoria.nome}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {noticiasFiltradas.length === 0 ? (
                    <div className="grid min-h-72 place-items-center px-6 py-12 text-center">
                        <div>
                            <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-slate-100 text-slate-400">
                                <Newspaper size={26} />
                            </span>
                            <h3 className="mt-4 text-lg font-extrabold text-slate-900">
                                Nenhuma notícia encontrada
                            </h3>
                            <p className="mt-1 text-sm text-slate-500">
                                Ajuste os filtros ou cadastre uma nova notícia.
                            </p>
                        </div>
                    </div>
                ) : (
                    <div className="divide-y divide-slate-200">
                        {noticiasFiltradas.map((noticia) => {
                            const status = obterStatus(noticia)
                            const categoria = obterCategoria(
                                noticia.categoria
                            )
                            const indiceReal = [...noticias]
                                .sort((a, b) => a.ordem - b.ordem)
                                .findIndex((item) => item.id === noticia.id)

                            return (
                                <article
                                    key={noticia.id}
                                    className="px-5 py-5 transition hover:bg-slate-50/70 sm:px-6"
                                >
                                    <div className="flex flex-col gap-4 xl:flex-row xl:items-center">
                                        <div className="flex min-w-0 flex-1 gap-4">
                                            <div className="flex shrink-0 flex-col items-center gap-1">
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        moverNoticia(
                                                            noticia.id,
                                                            -1
                                                        )
                                                    }
                                                    disabled={indiceReal === 0}
                                                    className="grid h-8 w-8 place-items-center rounded-md border-slate-200 bg-white text-slate-500 disabled:cursor-not-allowed disabled:opacity-30"
                                                    aria-label="Mover notícia para cima"
                                                >
                                                    <ArrowUp size={16} />
                                                </button>
                                                <span className="min-w-8 text-center text-sm font-extrabold text-slate-700">
                                                    {noticia.ordem}
                                                </span>
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        moverNoticia(
                                                            noticia.id,
                                                            1
                                                        )
                                                    }
                                                    disabled={
                                                        indiceReal ===
                                                        noticias.length - 1
                                                    }
                                                    className="grid h-8 w-8 place-items-center rounded-md border-slate-200 bg-white text-slate-500 disabled:cursor-not-allowed disabled:opacity-30"
                                                    aria-label="Mover notícia para baixo"
                                                >
                                                    <ArrowDown size={16} />
                                                </button>
                                            </div>

                                            <div className="min-w-0 flex-1">
                                                <div className="flex flex-wrap items-center gap-2">
                                                    <span
                                                        className={`rounded-full border px-2.5 py-1 text-xs font-bold ${status.classe}`}
                                                    >
                                                        {status.texto}
                                                    </span>
                                                    <span
                                                        className={`rounded-full border px-2.5 py-1 text-xs font-bold ${categoria.classe}`}
                                                    >
                                                        {categoria.nome}
                                                    </span>
                                                </div>

                                                <p className="mt-3 text-base font-semibold leading-relaxed text-slate-900">
                                                    {noticia.texto}
                                                </p>

                                                {noticia.programada && (
                                                    <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs font-medium text-slate-500">
                                                        <span className="flex items-center gap-1.5">
                                                            <Clock3 size={14} />
                                                            Início:{" "}
                                                            {formatarData(
                                                                noticia.inicioExibicao
                                                            )}
                                                        </span>
                                                        <span>
                                                            Fim:{" "}
                                                            {formatarData(
                                                                noticia.fimExibicao
                                                            )}
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <div className="flex flex-wrap items-center gap-2 xl:justify-end">
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    atualizarNoticia(
                                                        noticia.id,
                                                        {
                                                            ativo: !noticia.ativo
                                                        }
                                                    )
                                                }
                                                className={`rounded-lg px-3.5 py-2 text-sm font-bold ${
                                                    noticia.ativo
                                                        ? "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                                                        : "border-emerald-200 bg-emerald-50 text-emerald-700"
                                                }`}
                                            >
                                                {noticia.ativo
                                                    ? "Desativar"
                                                    : "Ativar"}
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    abrirEdicao(noticia)
                                                }
                                                className="flex items-center gap-2 rounded-lg border-slate-200 bg-white px-3.5 py-2 text-sm font-bold text-slate-700 hover:bg-slate-50"
                                            >
                                                <Pencil size={16} />
                                                Editar
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    removerNoticia(noticia)
                                                }
                                                className="grid h-10 w-10 place-items-center rounded-lg border-red-200 bg-white text-red-600 hover:bg-red-50"
                                                aria-label="Excluir notícia"
                                            >
                                                <Trash2 size={17} />
                                            </button>
                                        </div>
                                    </div>
                                </article>
                            )
                        })}
                    </div>
                )}
            </AdminPanel>

            {formularioAberto && (
                <div
                    className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/55 p-3 backdrop-blur-[2px] sm:p-6"
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="titulo-formulario-noticia"
                >
                    <div className="mx-auto my-3 w-full max-w-6xl overflow-hidden rounded-2xl border border-slate-200 bg-[#f4f7fb] shadow-2xl sm:my-8">
                        <header className="flex items-start justify-between gap-4 border-b border-slate-200 bg-white px-5 py-5 sm:px-7">
                            <div>
                                <span className="text-xs font-bold uppercase tracking-[0.12em] text-[#0d6efd]">
                                    {idEdicao
                                        ? "Editar notícia"
                                        : "Nova notícia"}
                                </span>
                                <h2
                                    id="titulo-formulario-noticia"
                                    className="mt-1 text-2xl font-extrabold text-slate-950"
                                >
                                    Conteúdo do rodapé
                                </h2>
                                <p className="mt-1 text-sm text-slate-500">
                                    Configure a mensagem e confira a prévia
                                    antes de salvar.
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={fecharFormulario}
                                className="grid h-10 w-10 shrink-0 place-items-center rounded-lg border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                                aria-label="Fechar formulário"
                            >
                                <X size={20} />
                            </button>
                        </header>

                        <div className="grid gap-6 p-5 sm:p-7 lg:grid-cols-[minmax(0,1.05fr)_minmax(340px,0.95fr)]">
                            <div className="space-y-5">
                                <AdminPanel className="p-5 sm:p-6">
                                    <div className="flex items-center gap-3">
                                        <span className="grid h-10 w-10 place-items-center rounded-lg bg-blue-50 text-[#0d6efd]">
                                            <FileText size={20} />
                                        </span>
                                        <div>
                                            <h3 className="font-extrabold text-slate-950">
                                                Mensagem
                                            </h3>
                                            <p className="text-sm text-slate-500">
                                                Texto que passará no letreiro.
                                            </p>
                                        </div>
                                    </div>

                                    <label className="mt-5 block text-sm font-bold text-slate-700">
                                        Texto da notícia
                                    </label>
                                    <textarea
                                        value={formulario.texto}
                                        onChange={(evento) => {
                                            setFormulario((atual) => ({
                                                ...atual,
                                                texto: evento.target.value
                                            }))
                                            setErroFormulario("")
                                        }}
                                        placeholder="Ex.: Atendimento jurídico funcionará normalmente nesta sexta-feira."
                                        className="mt-2 min-h-32 resize-y"
                                        autoFocus
                                    />
                                    <p className="mt-2 text-right text-xs font-medium text-slate-400">
                                        {formulario.texto.length} caracteres
                                    </p>
                                </AdminPanel>

                                <AdminPanel className="p-5 sm:p-6">
                                    <div className="flex items-center gap-3">
                                        <span className="grid h-10 w-10 place-items-center rounded-lg bg-violet-50 text-violet-700">
                                            <Megaphone size={20} />
                                        </span>
                                        <div>
                                            <h3 className="font-extrabold text-slate-950">
                                                Categoria
                                            </h3>
                                            <p className="text-sm text-slate-500">
                                                Identifique o tipo da mensagem.
                                            </p>
                                        </div>
                                    </div>

                                    <div className="mt-5 grid gap-3 sm:grid-cols-2">
                                        {categorias.map((categoria) => (
                                            <button
                                                type="button"
                                                key={categoria.id}
                                                onClick={() =>
                                                    setFormulario((atual) => ({
                                                        ...atual,
                                                        categoria:
                                                            categoria.id
                                                    }))
                                                }
                                                className={`rounded-xl p-4 text-left ${
                                                    formulario.categoria ===
                                                    categoria.id
                                                        ? `${categoria.classe} ring-2 ring-current/15`
                                                        : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                                                }`}
                                            >
                                                <strong className="block text-sm">
                                                    {categoria.nome}
                                                </strong>
                                                <span className="mt-1 block text-xs opacity-75">
                                                    {categoria.descricao}
                                                </span>
                                            </button>
                                        ))}
                                    </div>
                                </AdminPanel>

                                <AdminPanel className="p-5 sm:p-6">
                                    <label className="flex cursor-pointer items-center justify-between gap-4">
                                        <div className="flex items-center gap-3">
                                            <span className="grid h-10 w-10 place-items-center rounded-lg bg-amber-50 text-amber-700">
                                                <CalendarClock size={20} />
                                            </span>
                                            <div>
                                                <strong className="block text-slate-950">
                                                    Programar exibição
                                                </strong>
                                                <span className="text-sm text-slate-500">
                                                    Define quando a notícia entra
                                                    e sai do rodapé.
                                                </span>
                                            </div>
                                        </div>
                                        <input
                                            type="checkbox"
                                            checked={formulario.programada}
                                            onChange={(evento) =>
                                                setFormulario((atual) => ({
                                                    ...atual,
                                                    programada:
                                                        evento.target.checked
                                                }))
                                            }
                                            className="h-5 w-5 shrink-0"
                                        />
                                    </label>

                                    {formulario.programada && (
                                        <div className="mt-5 grid gap-4 border-t border-slate-200 pt-5 sm:grid-cols-2">
                                            <label className="text-sm font-bold text-slate-700">
                                                Início
                                                <input
                                                    type="datetime-local"
                                                    value={
                                                        formulario.inicioExibicao
                                                    }
                                                    onChange={(evento) =>
                                                        setFormulario(
                                                            (atual) => ({
                                                                ...atual,
                                                                inicioExibicao:
                                                                    evento
                                                                        .target
                                                                        .value
                                                            })
                                                        )
                                                    }
                                                    className="mt-2"
                                                />
                                            </label>
                                            <label className="text-sm font-bold text-slate-700">
                                                Encerramento
                                                <input
                                                    type="datetime-local"
                                                    value={
                                                        formulario.fimExibicao
                                                    }
                                                    onChange={(evento) =>
                                                        setFormulario(
                                                            (atual) => ({
                                                                ...atual,
                                                                fimExibicao:
                                                                    evento
                                                                        .target
                                                                        .value
                                                            })
                                                        )
                                                    }
                                                    className="mt-2"
                                                />
                                            </label>
                                        </div>
                                    )}
                                </AdminPanel>
                            </div>

                            <div className="space-y-5 lg:sticky lg:top-5 lg:self-start">
                                <AdminPanel className="overflow-hidden">
                                    <div className="flex items-center gap-3 border-b border-slate-200 px-5 py-4">
                                        <Eye
                                            size={19}
                                            className="text-[#0d6efd]"
                                        />
                                        <div>
                                            <h3 className="font-extrabold text-slate-950">
                                                Prévia do rodapé
                                            </h3>
                                            <p className="text-xs text-slate-500">
                                                Simulação da mensagem na TV.
                                            </p>
                                        </div>
                                    </div>

                                    <div className="bg-[linear-gradient(135deg,#0b2855,#0f4d8f)] p-5 sm:p-7">
                                        <div className="aspect-video overflow-hidden rounded-xl border border-white/15 bg-[radial-gradient(circle_at_70%_30%,rgba(56,189,248,0.22),transparent_38%),#0c3367] shadow-inner">
                                            <div className="flex h-full flex-col justify-between">
                                                <div className="p-5">
                                                    <span className="rounded-md bg-white/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.15em] text-blue-100">
                                                        ADUSEPS • Painel TV
                                                    </span>
                                                </div>
                                                <div className="border-t border-white/15 bg-[#082d63] py-3 shadow-[0_-8px_25px_rgba(0,0,0,0.18)]">
                                                    <div className="flex items-center whitespace-nowrap text-sm font-bold text-white">
                                                        <span className="mx-5 text-[#f15434]">
                                                            •
                                                        </span>
                                                        <EtiquetaCategoriaPreview
                                                            categoria={
                                                                formulario.categoria
                                                            }
                                                        />
                                                        <span className="max-w-full overflow-hidden text-ellipsis">
                                                            {formulario.texto.trim() ||
                                                                "Digite uma notícia para visualizar no rodapé"}
                                                        </span>
                                                        <span className="mx-5 text-[#f15434]">
                                                            •
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="mt-4 flex flex-wrap items-center gap-2">
                                            <span className="rounded-full border border-white/15 bg-white/10 px-2.5 py-1 text-xs font-bold text-white">
                                                {
                                                    obterCategoria(
                                                        formulario.categoria
                                                    ).nome
                                                }
                                            </span>
                                            <span className="rounded-full border border-white/15 bg-white/10 px-2.5 py-1 text-xs font-bold text-blue-100">
                                                {formulario.programada
                                                    ? "Exibição programada"
                                                    : "Exibição contínua"}
                                            </span>
                                        </div>
                                    </div>
                                </AdminPanel>

                                <div className="rounded-xl border border-blue-200 bg-blue-50 p-4 text-sm leading-relaxed text-blue-800">
                                    Salvar altera somente o rascunho. Para a
                                    notícia aparecer na TV, publique as
                                    alterações na aba Prévia da TV.
                                </div>

                                {erroFormulario && (
                                    <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700">
                                        {erroFormulario}
                                    </div>
                                )}

                                <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                                    <AdminButton
                                        variante="secundario"
                                        onClick={fecharFormulario}
                                    >
                                        Cancelar
                                    </AdminButton>
                                    <AdminButton onClick={salvarNoticia}>
                                        {idEdicao
                                            ? "Salvar alterações"
                                            : "Adicionar ao rascunho"}
                                    </AdminButton>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
