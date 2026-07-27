"use client"

import { useMemo, useState } from "react"
import {
    ArrowDown,
    ArrowUp,
    CheckCircle2,
    CircleOff,
    Eye,
    EyeOff,
    Filter,
    Globe2,
    MessageCircleMore,
    Pencil,
    Phone,
    Plus,
    Search,
    Trash2,
    X
} from "lucide-react"

import type { ContatoPainel } from "@/types/painel"
import { normalizarContatos } from "@/utils/contatosPainel"
import { usePainelDraftContext } from "../context/PainelDraftContext"
import {
    AdminButton,
    AdminMetricCard,
    AdminPageHeader,
    AdminPanel
} from "./AdminUI"

type FiltroStatus = "todos" | "ativos" | "inativos" | "no-banner"
type FiltroTipo = "todos" | ContatoPainel["tipo"]

type FormularioContato = {
    titulo: string
    tipo: ContatoPainel["tipo"]
    valores: string[]
    observacao: string
    ativo: boolean
    mostrarNoBanner: boolean
}

const formularioInicial: FormularioContato = {
    titulo: "",
    tipo: "telefone",
    valores: [""],
    observacao: "",
    ativo: true,
    mostrarNoBanner: true
}

const tiposContato: Array<{
    id: ContatoPainel["tipo"]
    nome: string
    descricao: string
}> = [
    {
        id: "telefone",
        nome: "Telefone",
        descricao: "Linha fixa ou celular"
    },
    {
        id: "whatsapp",
        nome: "WhatsApp",
        descricao: "Atendimento por mensagem"
    },
    {
        id: "site",
        nome: "Site",
        descricao: "Endereço eletrônico"
    }
]

function IconeContato({
    tipo,
    tamanho = 20
}: {
    tipo: ContatoPainel["tipo"]
    tamanho?: number
}) {
    if (tipo === "whatsapp") {
        return <MessageCircleMore size={tamanho} />
    }

    if (tipo === "site") {
        return <Globe2 size={tamanho} />
    }

    return <Phone size={tamanho} />
}

function nomeTipo(tipo: ContatoPainel["tipo"]) {
    return tiposContato.find((item) => item.id === tipo)?.nome || "Telefone"
}

function placeholderValor(tipo: ContatoPainel["tipo"]) {
    return tipo === "site" ? "www.exemplo.com.br" : "(81) 00000-0000"
}

export default function AbaContatos() {
    const { draft, atualizarConfiguracoesDraft } = usePainelDraftContext()
    const contatos =
        Array.isArray(draft.configuracoes.contatos) &&
        draft.configuracoes.contatos.length > 0
            ? [...draft.configuracoes.contatos].sort(
                  (a, b) => Number(a.ordem || 0) - Number(b.ordem || 0)
              )
            : normalizarContatos(draft.configuracoes.contatos)

    const [busca, setBusca] = useState("")
    const [filtroStatus, setFiltroStatus] =
        useState<FiltroStatus>("todos")
    const [filtroTipo, setFiltroTipo] = useState<FiltroTipo>("todos")
    const [formularioAberto, setFormularioAberto] = useState(false)
    const [idEdicao, setIdEdicao] = useState<string | null>(null)
    const [formulario, setFormulario] =
        useState<FormularioContato>(formularioInicial)
    const [erroFormulario, setErroFormulario] = useState("")

    const ativos = contatos.filter((contato) => contato.ativo).length
    const inativos = contatos.length - ativos
    const visiveisNoBanner = contatos.filter(
        (contato) => contato.ativo && contato.mostrarNoBanner
    ).length

    const contatosFiltrados = useMemo(() => {
        const termo = busca.trim().toLowerCase()

        return contatos.filter((contato) => {
            const texto = [
                contato.titulo,
                contato.tipo,
                contato.observacao,
                ...contato.valores
            ]
                .join(" ")
                .toLowerCase()

            const correspondeBusca = !termo || texto.includes(termo)
            const correspondeStatus =
                filtroStatus === "todos" ||
                (filtroStatus === "ativos" && contato.ativo) ||
                (filtroStatus === "inativos" && !contato.ativo) ||
                (filtroStatus === "no-banner" &&
                    contato.ativo &&
                    contato.mostrarNoBanner)
            const correspondeTipo =
                filtroTipo === "todos" || contato.tipo === filtroTipo

            return (
                correspondeBusca &&
                correspondeStatus &&
                correspondeTipo
            )
        })
    }, [busca, contatos, filtroStatus, filtroTipo])

    function salvarLista(lista: ContatoPainel[]) {
        atualizarConfiguracoesDraft({
            contatos: lista.map((contato, indice) => ({
                ...contato,
                ordem: indice + 1
            }))
        })
    }

    function atualizarContato(id: string, dados: Partial<ContatoPainel>) {
        salvarLista(
            contatos.map((contato) =>
                contato.id === id ? { ...contato, ...dados } : contato
            )
        )
    }

    function abrirNovoContato() {
        setIdEdicao(null)
        setFormulario(formularioInicial)
        setErroFormulario("")
        setFormularioAberto(true)
    }

    function abrirEdicao(contato: ContatoPainel) {
        setIdEdicao(contato.id)
        setFormulario({
            titulo: contato.titulo,
            tipo: contato.tipo,
            valores:
                contato.valores.length > 0 ? [...contato.valores] : [""],
            observacao: contato.observacao || "",
            ativo: contato.ativo,
            mostrarNoBanner: contato.mostrarNoBanner
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

    function atualizarValorFormulario(indice: number, valor: string) {
        setFormulario((atual) => ({
            ...atual,
            valores: atual.valores.map((item, posicao) =>
                posicao === indice ? valor : item
            )
        }))
        setErroFormulario("")
    }

    function adicionarValorFormulario() {
        setFormulario((atual) => ({
            ...atual,
            valores: [...atual.valores, ""]
        }))
    }

    function removerValorFormulario(indice: number) {
        setFormulario((atual) => ({
            ...atual,
            valores: atual.valores.filter(
                (_, posicao) => posicao !== indice
            )
        }))
    }

    function salvarContato() {
        const titulo = formulario.titulo.trim()
        const valores = formulario.valores
            .map((valor) => valor.trim())
            .filter(Boolean)

        if (!titulo) {
            setErroFormulario("Digite o nome do setor ou serviço.")
            return
        }

        if (valores.length === 0) {
            setErroFormulario(
                formulario.tipo === "site"
                    ? "Digite o endereço do site."
                    : "Digite pelo menos um número de contato."
            )
            return
        }

        const dados: Omit<ContatoPainel, "id" | "ordem"> = {
            titulo,
            tipo: formulario.tipo,
            valores,
            observacao: formulario.observacao.trim(),
            ativo: formulario.ativo,
            mostrarNoBanner: formulario.mostrarNoBanner
        }

        if (idEdicao) {
            salvarLista(
                contatos.map((contato) =>
                    contato.id === idEdicao
                        ? { ...contato, ...dados }
                        : contato
                )
            )
        } else {
            salvarLista([
                ...contatos,
                {
                    id: `contato-${Date.now()}`,
                    ordem: contatos.length + 1,
                    ...dados
                }
            ])
        }

        fecharFormulario()
    }

    function mover(id: string, direcao: -1 | 1) {
        const indice = contatos.findIndex((contato) => contato.id === id)
        const destino = indice + direcao

        if (indice < 0 || destino < 0 || destino >= contatos.length) return

        const lista = [...contatos]
        const [movido] = lista.splice(indice, 1)
        lista.splice(destino, 0, movido)
        salvarLista(lista)
    }

    function excluir(contato: ContatoPainel) {
        if (!confirm(`Excluir o contato "${contato.titulo}"?`)) return
        salvarLista(contatos.filter((item) => item.id !== contato.id))
    }

    return (
        <div className="space-y-6">
            <AdminPageHeader
                titulo="Contatos"
                descricao="Cadastre uma única vez os números oficiais usados no banner de contatos, no Plantão Judicial e em outros conteúdos do painel."
                acoes={
                    <AdminButton onClick={abrirNovoContato}>
                        <span className="flex items-center gap-2">
                            <Plus size={18} />
                            Novo contato
                        </span>
                    </AdminButton>
                }
            />

            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                <AdminMetricCard
                    rotulo="Total"
                    valor={contatos.length}
                    detalhe="contatos cadastrados"
                    icone={Phone}
                />
                <AdminMetricCard
                    rotulo="Ativos"
                    valor={ativos}
                    detalhe="disponíveis para uso"
                    icone={CheckCircle2}
                    destaque="verde"
                />
                <AdminMetricCard
                    rotulo="No banner"
                    valor={visiveisNoBanner}
                    detalhe="visíveis na tela de contatos"
                    icone={Eye}
                    destaque="ambar"
                />
                <AdminMetricCard
                    rotulo="Inativos"
                    valor={inativos}
                    detalhe="temporariamente ocultos"
                    icone={CircleOff}
                />
            </div>

            <AdminPanel>
                <div className="border-b border-slate-200 px-5 py-5 sm:px-6">
                    <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
                        <div>
                            <h2 className="text-xl font-extrabold text-slate-950">
                                Cadastro central
                            </h2>
                            <p className="mt-1 text-sm text-slate-500">
                                {contatosFiltrados.length} de {contatos.length}{" "}
                                contato(s) encontrado(s).
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
                                placeholder="Pesquisar setor, número ou site..."
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
                                    ["todos", "Todos"],
                                    ["ativos", "Ativos"],
                                    ["inativos", "Inativos"],
                                    ["no-banner", "No banner"]
                                ] as Array<[FiltroStatus, string]>
                            ).map(([id, nome]) => (
                                <button
                                    type="button"
                                    key={id}
                                    onClick={() => setFiltroStatus(id)}
                                    className={`rounded-lg border px-3.5 py-2 text-sm font-bold ${
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
                            value={filtroTipo}
                            onChange={(evento) =>
                                setFiltroTipo(
                                    evento.target.value as FiltroTipo
                                )
                            }
                            className="lg:max-w-[210px]"
                        >
                            <option value="todos">Todos os tipos</option>
                            {tiposContato.map((tipo) => (
                                <option key={tipo.id} value={tipo.id}>
                                    {tipo.nome}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {contatosFiltrados.length === 0 ? (
                    <div className="grid min-h-72 place-items-center px-6 py-12 text-center">
                        <div>
                            <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-slate-100 text-slate-400">
                                <Phone size={26} />
                            </span>
                            <h3 className="mt-4 text-lg font-extrabold text-slate-900">
                                Nenhum contato encontrado
                            </h3>
                            <p className="mt-1 text-sm text-slate-500">
                                Ajuste os filtros ou cadastre um novo contato.
                            </p>
                        </div>
                    </div>
                ) : (
                    <div className="divide-y divide-slate-200">
                        {contatosFiltrados.map((contato) => {
                            const indiceReal = contatos.findIndex(
                                (item) => item.id === contato.id
                            )

                            return (
                                <article
                                    key={contato.id}
                                    className="px-5 py-5 transition hover:bg-slate-50/70 sm:px-6"
                                >
                                    <div className="flex flex-col gap-4 xl:flex-row xl:items-center">
                                        <div className="flex min-w-0 flex-1 gap-4">
                                            <div className="flex shrink-0 flex-col items-center gap-1">
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        mover(contato.id, -1)
                                                    }
                                                    disabled={indiceReal === 0}
                                                    className="grid h-8 w-8 place-items-center rounded-md border border-slate-200 bg-white text-slate-500 disabled:cursor-not-allowed disabled:opacity-30"
                                                    aria-label="Mover contato para cima"
                                                >
                                                    <ArrowUp size={16} />
                                                </button>
                                                <span className="min-w-8 text-center text-sm font-extrabold text-slate-700">
                                                    {contato.ordem}
                                                </span>
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        mover(contato.id, 1)
                                                    }
                                                    disabled={
                                                        indiceReal ===
                                                        contatos.length - 1
                                                    }
                                                    className="grid h-8 w-8 place-items-center rounded-md border border-slate-200 bg-white text-slate-500 disabled:cursor-not-allowed disabled:opacity-30"
                                                    aria-label="Mover contato para baixo"
                                                >
                                                    <ArrowDown size={16} />
                                                </button>
                                            </div>

                                            <span
                                                className={`grid h-12 w-12 shrink-0 place-items-center rounded-xl ${
                                                    contato.tipo === "whatsapp"
                                                        ? "bg-emerald-50 text-emerald-700"
                                                        : contato.tipo === "site"
                                                          ? "bg-violet-50 text-violet-700"
                                                          : "bg-blue-50 text-[#0d6efd]"
                                                }`}
                                            >
                                                <IconeContato
                                                    tipo={contato.tipo}
                                                    tamanho={22}
                                                />
                                            </span>

                                            <div className="min-w-0 flex-1">
                                                <div className="flex flex-wrap items-center gap-2">
                                                    <h3 className="text-base font-extrabold text-slate-950">
                                                        {contato.titulo}
                                                    </h3>
                                                    <span className="rounded-full border border-slate-200 bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-600">
                                                        {nomeTipo(contato.tipo)}
                                                    </span>
                                                    <span
                                                        className={`rounded-full border px-2.5 py-1 text-xs font-bold ${
                                                            contato.ativo
                                                                ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                                                                : "border-slate-200 bg-slate-100 text-slate-500"
                                                        }`}
                                                    >
                                                        {contato.ativo
                                                            ? "Ativo"
                                                            : "Inativo"}
                                                    </span>
                                                    {contato.mostrarNoBanner && (
                                                        <span className="rounded-full border border-blue-200 bg-blue-50 px-2.5 py-1 text-xs font-bold text-blue-700">
                                                            No banner
                                                        </span>
                                                    )}
                                                </div>

                                                <p className="mt-2 break-words text-sm font-semibold text-slate-800">
                                                    {contato.valores.join(" · ")}
                                                </p>

                                                {contato.observacao && (
                                                    <p className="mt-1 text-sm text-slate-500">
                                                        {contato.observacao}
                                                    </p>
                                                )}
                                            </div>
                                        </div>

                                        <div className="flex flex-wrap items-center gap-2 xl:justify-end">
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    atualizarContato(
                                                        contato.id,
                                                        {
                                                            mostrarNoBanner:
                                                                !contato.mostrarNoBanner
                                                        }
                                                    )
                                                }
                                                className={`flex items-center gap-2 rounded-lg border px-3.5 py-2 text-sm font-bold ${
                                                    contato.mostrarNoBanner
                                                        ? "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                                                        : "border-blue-200 bg-blue-50 text-blue-700"
                                                }`}
                                            >
                                                {contato.mostrarNoBanner ? (
                                                    <EyeOff size={16} />
                                                ) : (
                                                    <Eye size={16} />
                                                )}
                                                {contato.mostrarNoBanner
                                                    ? "Ocultar do banner"
                                                    : "Mostrar no banner"}
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    atualizarContato(
                                                        contato.id,
                                                        {
                                                            ativo: !contato.ativo
                                                        }
                                                    )
                                                }
                                                className={`rounded-lg border px-3.5 py-2 text-sm font-bold ${
                                                    contato.ativo
                                                        ? "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                                                        : "border-emerald-200 bg-emerald-50 text-emerald-700"
                                                }`}
                                            >
                                                {contato.ativo
                                                    ? "Desativar"
                                                    : "Ativar"}
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    abrirEdicao(contato)
                                                }
                                                className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-sm font-bold text-slate-700 hover:bg-slate-50"
                                            >
                                                <Pencil size={16} />
                                                Editar
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    excluir(contato)
                                                }
                                                className="grid h-10 w-10 place-items-center rounded-lg border border-red-200 bg-white text-red-600 hover:bg-red-50"
                                                aria-label="Excluir contato"
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

            <p className="text-center text-sm text-slate-500">
                As alterações ficam no rascunho. Revise e publique pela aba
                Prévia da TV.
            </p>

            {formularioAberto && (
                <div
                    className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/55 p-3 backdrop-blur-[2px] sm:p-6"
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="titulo-formulario-contato"
                >
                    <div className="mx-auto my-3 w-full max-w-6xl overflow-hidden rounded-2xl border border-slate-200 bg-[#f4f7fb] shadow-2xl sm:my-8">
                        <header className="flex items-start justify-between gap-4 border-b border-slate-200 bg-white px-5 py-5 sm:px-7">
                            <div>
                                <span className="text-xs font-bold uppercase tracking-[0.12em] text-[#0d6efd]">
                                    {idEdicao
                                        ? "Editar contato"
                                        : "Novo contato"}
                                </span>
                                <h2
                                    id="titulo-formulario-contato"
                                    className="mt-1 text-2xl font-extrabold text-slate-950"
                                >
                                    Dados oficiais
                                </h2>
                                <p className="mt-1 text-sm text-slate-500">
                                    Cadastre o dado uma vez para reutilizá-lo
                                    em todo o painel.
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={fecharFormulario}
                                className="grid h-10 w-10 shrink-0 place-items-center rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
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
                                            <Phone size={20} />
                                        </span>
                                        <div>
                                            <h3 className="font-extrabold text-slate-950">
                                                Identificação
                                            </h3>
                                            <p className="text-sm text-slate-500">
                                                Nome e canal de atendimento.
                                            </p>
                                        </div>
                                    </div>

                                    <label className="mt-5 block text-sm font-bold text-slate-700">
                                        Nome do setor ou serviço
                                    </label>
                                    <input
                                        value={formulario.titulo}
                                        onChange={(evento) => {
                                            setFormulario((atual) => ({
                                                ...atual,
                                                titulo: evento.target.value
                                            }))
                                            setErroFormulario("")
                                        }}
                                        placeholder="Ex.: Atendimento jurídico"
                                        className="mt-2"
                                        autoFocus
                                    />

                                    <div className="mt-5 grid gap-3 sm:grid-cols-3">
                                        {tiposContato.map((tipo) => (
                                            <button
                                                type="button"
                                                key={tipo.id}
                                                onClick={() =>
                                                    setFormulario(
                                                        (atual) => ({
                                                            ...atual,
                                                            tipo: tipo.id
                                                        })
                                                    )
                                                }
                                                className={`rounded-xl border p-4 text-left transition ${
                                                    formulario.tipo === tipo.id
                                                        ? "border-[#0d6efd] bg-blue-50 ring-2 ring-blue-100"
                                                        : "border-slate-200 bg-white hover:border-slate-300"
                                                }`}
                                            >
                                                <span
                                                    className={`grid h-9 w-9 place-items-center rounded-lg ${
                                                        formulario.tipo ===
                                                        tipo.id
                                                            ? "bg-[#0d6efd] text-white"
                                                            : "bg-slate-100 text-slate-600"
                                                    }`}
                                                >
                                                    <IconeContato
                                                        tipo={tipo.id}
                                                        tamanho={18}
                                                    />
                                                </span>
                                                <span className="mt-3 block text-sm font-extrabold text-slate-950">
                                                    {tipo.nome}
                                                </span>
                                                <span className="mt-1 block text-xs text-slate-500">
                                                    {tipo.descricao}
                                                </span>
                                            </button>
                                        ))}
                                    </div>
                                </AdminPanel>

                                <AdminPanel className="p-5 sm:p-6">
                                    <div className="flex items-center justify-between gap-3">
                                        <div>
                                            <h3 className="font-extrabold text-slate-950">
                                                {formulario.tipo === "site"
                                                    ? "Endereço"
                                                    : "Números"}
                                            </h3>
                                            <p className="text-sm text-slate-500">
                                                Adicione um ou mais dados para
                                                este setor.
                                            </p>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={
                                                adicionarValorFormulario
                                            }
                                            className="flex items-center gap-2 rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 text-xs font-bold text-blue-700"
                                        >
                                            <Plus size={15} />
                                            Adicionar
                                        </button>
                                    </div>

                                    <div className="mt-5 grid gap-3">
                                        {formulario.valores.map(
                                            (valor, indice) => (
                                                <div
                                                    key={indice}
                                                    className="flex gap-2"
                                                >
                                                    <input
                                                        value={valor}
                                                        onChange={(evento) =>
                                                            atualizarValorFormulario(
                                                                indice,
                                                                evento.target
                                                                    .value
                                                            )
                                                        }
                                                        placeholder={placeholderValor(
                                                            formulario.tipo
                                                        )}
                                                    />
                                                    {formulario.valores
                                                        .length > 1 && (
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                removerValorFormulario(
                                                                    indice
                                                                )
                                                            }
                                                            className="grid w-11 shrink-0 place-items-center rounded-lg border border-red-200 bg-white text-red-600 hover:bg-red-50"
                                                            aria-label="Remover número"
                                                        >
                                                            <Trash2
                                                                size={17}
                                                            />
                                                        </button>
                                                    )}
                                                </div>
                                            )
                                        )}
                                    </div>

                                    <label className="mt-5 block text-sm font-bold text-slate-700">
                                        Observação
                                    </label>
                                    <textarea
                                        value={formulario.observacao}
                                        onChange={(evento) =>
                                            setFormulario((atual) => ({
                                                ...atual,
                                                observacao:
                                                    evento.target.value
                                            }))
                                        }
                                        placeholder="Ex.: Sábados, domingos e feriados"
                                        className="mt-2 min-h-24 resize-y"
                                    />
                                </AdminPanel>

                                <AdminPanel className="p-5 sm:p-6">
                                    <h3 className="font-extrabold text-slate-950">
                                        Disponibilidade
                                    </h3>
                                    <p className="mt-1 text-sm text-slate-500">
                                        Controle onde o contato poderá ser
                                        usado.
                                    </p>

                                    <div className="mt-5 grid gap-3 sm:grid-cols-2">
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setFormulario((atual) => ({
                                                    ...atual,
                                                    ativo: !atual.ativo
                                                }))
                                            }
                                            className={`rounded-xl border p-4 text-left ${
                                                formulario.ativo
                                                    ? "border-emerald-200 bg-emerald-50"
                                                    : "border-slate-200 bg-white"
                                            }`}
                                        >
                                            <span className="flex items-center gap-2 font-extrabold text-slate-950">
                                                {formulario.ativo ? (
                                                    <CheckCircle2
                                                        size={18}
                                                        className="text-emerald-600"
                                                    />
                                                ) : (
                                                    <CircleOff
                                                        size={18}
                                                        className="text-slate-500"
                                                    />
                                                )}
                                                Contato ativo
                                            </span>
                                            <span className="mt-1 block text-xs text-slate-500">
                                                Pode ser usado pelos conteúdos
                                                do painel.
                                            </span>
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() =>
                                                setFormulario((atual) => ({
                                                    ...atual,
                                                    mostrarNoBanner:
                                                        !atual.mostrarNoBanner
                                                }))
                                            }
                                            className={`rounded-xl border p-4 text-left ${
                                                formulario.mostrarNoBanner
                                                    ? "border-blue-200 bg-blue-50"
                                                    : "border-slate-200 bg-white"
                                            }`}
                                        >
                                            <span className="flex items-center gap-2 font-extrabold text-slate-950">
                                                {formulario.mostrarNoBanner ? (
                                                    <Eye
                                                        size={18}
                                                        className="text-blue-600"
                                                    />
                                                ) : (
                                                    <EyeOff
                                                        size={18}
                                                        className="text-slate-500"
                                                    />
                                                )}
                                                Exibir no banner
                                            </span>
                                            <span className="mt-1 block text-xs text-slate-500">
                                                Aparece na tela de Contatos
                                                Oficiais.
                                            </span>
                                        </button>
                                    </div>
                                </AdminPanel>
                            </div>

                            <div className="lg:sticky lg:top-6 lg:self-start">
                                <AdminPanel className="overflow-hidden">
                                    <div className="border-b border-slate-200 px-5 py-4">
                                        <p className="text-xs font-bold uppercase tracking-[0.12em] text-slate-500">
                                            Prévia do card
                                        </p>
                                    </div>

                                    <div className="bg-[linear-gradient(145deg,#0b3d91_0%,#0d6efd_58%,#42b5f5_100%)] p-5 sm:p-7">
                                        <div className="rounded-2xl border border-white/25 bg-white/12 p-5 text-white shadow-xl backdrop-blur-md">
                                            <div className="flex items-start gap-4">
                                                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-white text-[#0d6efd]">
                                                    <IconeContato
                                                        tipo={formulario.tipo}
                                                        tamanho={23}
                                                    />
                                                </span>
                                                <div className="min-w-0">
                                                    <p className="text-xs font-bold uppercase tracking-[0.16em] text-blue-100">
                                                        {nomeTipo(
                                                            formulario.tipo
                                                        )}
                                                    </p>
                                                    <h3 className="mt-1 text-xl font-black">
                                                        {formulario.titulo ||
                                                            "Nome do setor"}
                                                    </h3>
                                                </div>
                                            </div>

                                            <div className="mt-6 space-y-2">
                                                {formulario.valores.some(
                                                    (valor) => valor.trim()
                                                ) ? (
                                                    formulario.valores
                                                        .filter((valor) =>
                                                            valor.trim()
                                                        )
                                                        .map(
                                                            (
                                                                valor,
                                                                indice
                                                            ) => (
                                                                <p
                                                                    key={
                                                                        indice
                                                                    }
                                                                    className="break-words text-lg font-extrabold"
                                                                >
                                                                    {valor}
                                                                </p>
                                                            )
                                                        )
                                                ) : (
                                                    <p className="text-lg font-extrabold text-blue-100">
                                                        {placeholderValor(
                                                            formulario.tipo
                                                        )}
                                                    </p>
                                                )}
                                            </div>

                                            {formulario.observacao && (
                                                <p className="mt-5 border-t border-white/20 pt-4 text-sm text-blue-50">
                                                    {formulario.observacao}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="space-y-3 bg-white p-5">
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-slate-500">
                                                Status
                                            </span>
                                            <span
                                                className={`font-bold ${
                                                    formulario.ativo
                                                        ? "text-emerald-700"
                                                        : "text-slate-500"
                                                }`}
                                            >
                                                {formulario.ativo
                                                    ? "Ativo"
                                                    : "Inativo"}
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-slate-500">
                                                Banner
                                            </span>
                                            <span className="font-bold text-slate-700">
                                                {formulario.mostrarNoBanner
                                                    ? "Visível"
                                                    : "Oculto"}
                                            </span>
                                        </div>
                                    </div>
                                </AdminPanel>
                            </div>
                        </div>

                        <footer className="flex flex-col-reverse gap-3 border-t border-slate-200 bg-white px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-7">
                            <p className="text-xs text-slate-500">
                                Salvar altera o rascunho. Revise e publique pela
                                aba Prévia da TV.
                            </p>
                            <div className="flex gap-2">
                                <AdminButton
                                    variante="secundario"
                                    onClick={fecharFormulario}
                                >
                                    Cancelar
                                </AdminButton>
                                <AdminButton onClick={salvarContato}>
                                    {idEdicao
                                        ? "Salvar alterações"
                                        : "Adicionar contato"}
                                </AdminButton>
                            </div>
                        </footer>

                        {erroFormulario && (
                            <div className="border-t border-red-200 bg-red-50 px-5 py-3 text-sm font-bold text-red-700 sm:px-7">
                                {erroFormulario}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}
