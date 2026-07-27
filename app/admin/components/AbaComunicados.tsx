"use client"

import { useMemo, useState } from "react"
import {
    AlertTriangle,
    CalendarClock,
    CheckCircle2,
    Clock3,
    Info,
    Layers3,
    MessageSquareWarning,
    MonitorPlay,
    Pencil,
    Plus,
    Save,
    Trash2,
    X
} from "lucide-react"

import type { AvisoUrgente, NovoAvisoUrgente } from "@/types/painel"
import {
    AdminButton,
    AdminPageHeader,
    AdminPanel
} from "./AdminUI"
import { usePainelDraftContext } from "../context/PainelDraftContext"

type FormularioComunicado = NovoAvisoUrgente

const formularioInicial: FormularioComunicado = {
    ativo: false,
    titulo: "",
    mensagem: "",
    categoria: "normal",
    inicioExibicao: "",
    fimExibicao: "",
    exibirRotacao: true,
    intervaloRotacaoMidias: 5,
    duracaoTela: 12,
    exibirSobreposicao: true,
    intervaloSobreposicaoMinutos: 10,
    duracaoSobreposicaoSegundos: 12
}

const estilosNivel = {
    normal: {
        nome: "Informação",
        icone: Info,
        botao: "border-blue-300 bg-blue-50 text-blue-700",
        selo: "bg-blue-50 text-blue-700"
    },
    atencao: {
        nome: "Atenção",
        icone: AlertTriangle,
        botao: "border-amber-300 bg-amber-50 text-amber-800",
        selo: "bg-amber-50 text-amber-800"
    },
    urgente: {
        nome: "Urgente",
        icone: MessageSquareWarning,
        botao: "border-red-300 bg-red-50 text-red-700",
        selo: "bg-red-50 text-red-700"
    }
} as const

function numeroSeguro(valor: string, minimo: number, padrao: number) {
    const numero = Number(valor)
    return Number.isFinite(numero) ? Math.max(minimo, numero) : padrao
}

function normalizarFormulario(comunicado: AvisoUrgente): FormularioComunicado {
    return {
        ativo: comunicado.ativo ?? false,
        titulo: comunicado.titulo || "",
        mensagem: comunicado.mensagem || "",
        categoria: comunicado.categoria || "normal",
        inicioExibicao: comunicado.inicioExibicao || "",
        fimExibicao: comunicado.fimExibicao || "",
        exibirRotacao: comunicado.exibirRotacao ?? false,
        intervaloRotacaoMidias:
            Math.max(1, Number(comunicado.intervaloRotacaoMidias || 5)),
        duracaoTela: Math.max(5, Number(comunicado.duracaoTela || 12)),
        exibirSobreposicao: comunicado.exibirSobreposicao ?? true,
        intervaloSobreposicaoMinutos:
            Math.max(
                1,
                Number(comunicado.intervaloSobreposicaoMinutos || 10)
            ),
        duracaoSobreposicaoSegundos:
            Math.max(
                5,
                Number(comunicado.duracaoSobreposicaoSegundos || 12)
            )
    }
}

function dataValida(comunicado: AvisoUrgente) {
    const agora = new Date()

    if (comunicado.inicioExibicao) {
        const inicio = new Date(comunicado.inicioExibicao)
        if (!Number.isNaN(inicio.getTime()) && agora < inicio) return "Agendado"
    }

    if (comunicado.fimExibicao) {
        const fim = new Date(comunicado.fimExibicao)
        if (!Number.isNaN(fim.getTime()) && agora > fim) return "Encerrado"
    }

    return comunicado.ativo ? "Ativo" : "Inativo"
}

export default function AbaComunicados() {
    const { draft, atualizarComunicadosDraft } = usePainelDraftContext()
    const comunicados = draft.comunicados
    const [formulario, setFormulario] =
        useState<FormularioComunicado>(formularioInicial)
    const [idEdicao, setIdEdicao] = useState<string | null>(null)
    const [mensagemStatus, setMensagemStatus] = useState("")

    const nivelAtual = estilosNivel[formulario.categoria || "normal"]
    const NivelIcone = nivelAtual.icone

    const totais = useMemo(() => ({
        publicados: comunicados.filter((item) => item.ativo).length,
        rotacao: comunicados.filter(
            (item) => item.ativo && item.exibirRotacao
        ).length,
        sobreposicao: comunicados.filter(
            (item) => item.ativo && (item.exibirSobreposicao ?? true)
        ).length
    }), [comunicados])

    function atualizar(
        campo: keyof FormularioComunicado,
        valor: FormularioComunicado[keyof FormularioComunicado]
    ) {
        setFormulario((atual) => ({ ...atual, [campo]: valor }))
        setMensagemStatus("")
    }

    function novo() {
        setIdEdicao(null)
        setFormulario(formularioInicial)
        setMensagemStatus("")
        window.scrollTo({ top: 0, behavior: "smooth" })
    }

    function editar(comunicado: AvisoUrgente) {
        setIdEdicao(comunicado.id)
        setFormulario(normalizarFormulario(comunicado))
        setMensagemStatus("")
        window.scrollTo({ top: 0, behavior: "smooth" })
    }

    function validar() {
        if (!formulario.titulo.trim()) {
            setMensagemStatus("Digite o título do comunicado.")
            return false
        }

        if (!formulario.mensagem.trim()) {
            setMensagemStatus("Digite a mensagem do comunicado.")
            return false
        }

        if (!formulario.exibirRotacao && !formulario.exibirSobreposicao) {
            setMensagemStatus(
                "Escolha rotação, sobreposição ou as duas formas de exibição."
            )
            return false
        }

        if (formulario.inicioExibicao && formulario.fimExibicao) {
            const inicio = new Date(formulario.inicioExibicao)
            const fim = new Date(formulario.fimExibicao)

            if (fim <= inicio) {
                setMensagemStatus(
                    "O encerramento precisa ser posterior ao início."
                )
                return false
            }
        }

        return true
    }

    function salvar(ativo: boolean) {
        if (!validar()) return

        setMensagemStatus("")

        const dados: FormularioComunicado = {
            ...formulario,
            ativo,
            titulo: formulario.titulo.trim(),
            mensagem: formulario.mensagem.trim(),
            inicioExibicao: formulario.inicioExibicao || "",
            fimExibicao: formulario.fimExibicao || ""
        }

        const comunicado: AvisoUrgente = {
            id: idEdicao || `draft-comunicado-${Date.now()}`,
            ...dados
        }

        atualizarComunicadosDraft(
            idEdicao
                ? comunicados.map((item) =>
                    item.id === idEdicao ? comunicado : item
                )
                : [...comunicados, comunicado]
        )

        setMensagemStatus(
            ativo
                ? "Comunicado ativo salvo no rascunho."
                : "Comunicado inativo salvo no rascunho."
        )
        setIdEdicao(null)
        setFormulario(formularioInicial)
    }

    function alternar(comunicado: AvisoUrgente) {
        atualizarComunicadosDraft(
            comunicados.map((item) =>
                item.id === comunicado.id
                    ? { ...item, ativo: !item.ativo }
                    : item
            )
        )
    }

    function remover(comunicado: AvisoUrgente) {
        if (!confirm(`Excluir o comunicado "${comunicado.titulo}"?`)) return

        atualizarComunicadosDraft(
            comunicados.filter((item) => item.id !== comunicado.id)
        )
        if (idEdicao === comunicado.id) novo()
        setMensagemStatus("Comunicado removido do rascunho.")
    }

    return (
        <div className="space-y-6">
            <AdminPageHeader
                titulo="Comunicados"
                descricao="Prepare avisos para a rotação ou sobreposição. As alterações entram na TV junto com a publicação geral do painel."
                acoes={
                    <AdminButton variante="secundario" onClick={novo}>
                        <span className="flex items-center gap-2">
                            <Plus size={17} />
                            Novo comunicado
                        </span>
                    </AdminButton>
                }
            />

            <div className="grid gap-3 sm:grid-cols-3">
                {[
                    {
                        rotulo: "Ativos no rascunho",
                        valor: totais.publicados,
                        icone: CheckCircle2,
                        cor: "text-emerald-600 bg-emerald-50"
                    },
                    {
                        rotulo: "Na rotação",
                        valor: totais.rotacao,
                        icone: MonitorPlay,
                        cor: "text-blue-700 bg-blue-50"
                    },
                    {
                        rotulo: "Sobreposições",
                        valor: totais.sobreposicao,
                        icone: Layers3,
                        cor: "text-violet-700 bg-violet-50"
                    }
                ].map((item) => {
                    const Icone = item.icone

                    return (
                        <AdminPanel key={item.rotulo} className="p-4">
                            <div className="flex items-center gap-3">
                                <span className={`grid h-10 w-10 place-items-center rounded-lg ${item.cor}`}>
                                    <Icone size={20} />
                                </span>
                                <div>
                                    <strong className="block text-2xl font-extrabold text-slate-950">
                                        {item.valor}
                                    </strong>
                                    <span className="text-xs font-bold uppercase tracking-[0.09em] text-slate-500">
                                        {item.rotulo}
                                    </span>
                                </div>
                            </div>
                        </AdminPanel>
                    )
                })}
            </div>

            <div className="grid gap-6 xl:grid-cols-[minmax(0,1.3fr)_minmax(360px,0.7fr)]">
                <div className="space-y-6">
                    <AdminPanel>
                        <div className="border-b border-slate-200 px-5 py-4 sm:px-6">
                            <div className="flex items-center gap-3">
                                <span className="grid h-10 w-10 place-items-center rounded-lg bg-blue-50 text-[#0d6efd]">
                                    <MessageSquareWarning size={20} />
                                </span>
                                <div>
                                    <h2 className="text-lg font-extrabold text-slate-950">
                                        {idEdicao
                                            ? "Editar comunicado"
                                            : "Novo comunicado"}
                                    </h2>
                                    <p className="text-sm text-slate-500">
                                        Conteúdo e nível de prioridade
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-5 p-5 sm:p-6">
                            <label className="block text-sm font-bold text-slate-700">
                                Título
                                <input
                                    value={formulario.titulo}
                                    onChange={(e) =>
                                        atualizar("titulo", e.target.value)
                                    }
                                    maxLength={80}
                                    placeholder="Ex.: Atendimento suspenso"
                                    className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-3.5 py-3 text-sm text-slate-950 outline-none transition focus:border-[#0d6efd] focus:ring-4 focus:ring-blue-100"
                                />
                            </label>

                            <label className="block text-sm font-bold text-slate-700">
                                Mensagem
                                <textarea
                                    value={formulario.mensagem}
                                    onChange={(e) =>
                                        atualizar("mensagem", e.target.value)
                                    }
                                    maxLength={280}
                                    rows={4}
                                    placeholder="Escreva a orientação que será exibida na TV."
                                    className="mt-2 w-full resize-y rounded-lg border border-slate-300 bg-white px-3.5 py-3 text-sm leading-relaxed text-slate-950 outline-none transition focus:border-[#0d6efd] focus:ring-4 focus:ring-blue-100"
                                />
                                <span className="mt-1.5 block text-right text-xs font-medium text-slate-400">
                                    {formulario.mensagem.length}/280
                                </span>
                            </label>

                            <div>
                                <p className="text-sm font-bold text-slate-700">
                                    Nível
                                </p>
                                <div className="mt-2 grid gap-2 sm:grid-cols-3">
                                    {(
                                        ["normal", "atencao", "urgente"] as const
                                    ).map((nivel) => {
                                        const item = estilosNivel[nivel]
                                        const Icone = item.icone
                                        const ativo =
                                            formulario.categoria === nivel

                                        return (
                                            <button
                                                type="button"
                                                key={nivel}
                                                onClick={() =>
                                                    atualizar("categoria", nivel)
                                                }
                                                className={`flex min-h-12 items-center justify-center gap-2 rounded-lg border px-3 py-2.5 text-sm font-bold transition ${
                                                    ativo
                                                        ? item.botao
                                                        : "border-slate-300 bg-white text-slate-600 hover:bg-slate-50"
                                                }`}
                                            >
                                                <Icone size={17} />
                                                {item.nome}
                                            </button>
                                        )
                                    })}
                                </div>
                            </div>
                        </div>
                    </AdminPanel>

                    <AdminPanel>
                        <div className="border-b border-slate-200 px-5 py-4 sm:px-6">
                            <div className="flex items-center gap-3">
                                <span className="grid h-10 w-10 place-items-center rounded-lg bg-slate-100 text-slate-700">
                                    <CalendarClock size={20} />
                                </span>
                                <div>
                                    <h2 className="text-lg font-extrabold text-slate-950">
                                        Validade
                                    </h2>
                                    <p className="text-sm text-slate-500">
                                        O aviso sai do ar automaticamente
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="grid gap-4 p-5 sm:grid-cols-2 sm:p-6">
                            <label className="text-sm font-bold text-slate-700">
                                Início
                                <input
                                    type="datetime-local"
                                    value={formulario.inicioExibicao}
                                    onChange={(e) =>
                                        atualizar(
                                            "inicioExibicao",
                                            e.target.value
                                        )
                                    }
                                    className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-3.5 py-3 text-sm text-slate-950 outline-none focus:border-[#0d6efd] focus:ring-4 focus:ring-blue-100"
                                />
                            </label>

                            <label className="text-sm font-bold text-slate-700">
                                Encerramento
                                <input
                                    type="datetime-local"
                                    value={formulario.fimExibicao}
                                    onChange={(e) =>
                                        atualizar(
                                            "fimExibicao",
                                            e.target.value
                                        )
                                    }
                                    className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-3.5 py-3 text-sm text-slate-950 outline-none focus:border-[#0d6efd] focus:ring-4 focus:ring-blue-100"
                                />
                                <span className="mt-1.5 block text-xs font-medium text-slate-400">
                                    Deixe vazio para não definir uma data final.
                                </span>
                            </label>
                        </div>
                    </AdminPanel>

                    <div className="grid gap-6 lg:grid-cols-2">
                        <AdminPanel className={formulario.exibirRotacao ? "ring-2 ring-blue-100" : ""}>
                            <div className="flex items-start justify-between gap-4 border-b border-slate-200 p-5">
                                <div className="flex gap-3">
                                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-blue-50 text-[#0d6efd]">
                                        <MonitorPlay size={20} />
                                    </span>
                                    <div>
                                        <h2 className="font-extrabold text-slate-950">
                                            Tela na rotação
                                        </h2>
                                        <p className="mt-1 text-xs leading-relaxed text-slate-500">
                                            Entra como uma mídia completa.
                                        </p>
                                    </div>
                                </div>

                                <button
                                    type="button"
                                    aria-label="Ativar tela na rotação"
                                    onClick={() =>
                                        atualizar(
                                            "exibirRotacao",
                                            !formulario.exibirRotacao
                                        )
                                    }
                                    className={`relative h-7 w-12 shrink-0 rounded-full transition ${
                                        formulario.exibirRotacao
                                            ? "bg-[#0d6efd]"
                                            : "bg-slate-300"
                                    }`}
                                >
                                    <span
                                        className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow transition ${
                                            formulario.exibirRotacao
                                                ? "left-6"
                                                : "left-1"
                                        }`}
                                    />
                                </button>
                            </div>

                            <div className={`space-y-4 p-5 ${!formulario.exibirRotacao ? "opacity-45" : ""}`}>
                                <label className="block text-sm font-bold text-slate-700">
                                    Repetir a cada
                                    <div className="mt-2 flex items-center gap-2">
                                        <input
                                            type="number"
                                            min={1}
                                            disabled={!formulario.exibirRotacao}
                                            value={formulario.intervaloRotacaoMidias}
                                            onChange={(e) =>
                                                atualizar(
                                                    "intervaloRotacaoMidias",
                                                    numeroSeguro(
                                                        e.target.value,
                                                        1,
                                                        5
                                                    )
                                                )
                                            }
                                            className="w-24 rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-[#0d6efd]"
                                        />
                                        <span className="text-sm font-medium text-slate-500">
                                            mídias
                                        </span>
                                    </div>
                                </label>

                                <label className="block text-sm font-bold text-slate-700">
                                    Duração da tela
                                    <div className="mt-2 flex items-center gap-2">
                                        <input
                                            type="number"
                                            min={5}
                                            disabled={!formulario.exibirRotacao}
                                            value={formulario.duracaoTela}
                                            onChange={(e) =>
                                                atualizar(
                                                    "duracaoTela",
                                                    numeroSeguro(
                                                        e.target.value,
                                                        5,
                                                        12
                                                    )
                                                )
                                            }
                                            className="w-24 rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-[#0d6efd]"
                                        />
                                        <span className="text-sm font-medium text-slate-500">
                                            segundos
                                        </span>
                                    </div>
                                </label>
                            </div>
                        </AdminPanel>

                        <AdminPanel className={formulario.exibirSobreposicao ? "ring-2 ring-violet-100" : ""}>
                            <div className="flex items-start justify-between gap-4 border-b border-slate-200 p-5">
                                <div className="flex gap-3">
                                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-violet-50 text-violet-700">
                                        <Layers3 size={20} />
                                    </span>
                                    <div>
                                        <h2 className="font-extrabold text-slate-950">
                                            Sobreposição global
                                        </h2>
                                        <p className="mt-1 text-xs leading-relaxed text-slate-500">
                                            Aparece sobre a mídia atual.
                                        </p>
                                    </div>
                                </div>

                                <button
                                    type="button"
                                    aria-label="Ativar sobreposição"
                                    onClick={() =>
                                        atualizar(
                                            "exibirSobreposicao",
                                            !formulario.exibirSobreposicao
                                        )
                                    }
                                    className={`relative h-7 w-12 shrink-0 rounded-full transition ${
                                        formulario.exibirSobreposicao
                                            ? "bg-violet-600"
                                            : "bg-slate-300"
                                    }`}
                                >
                                    <span
                                        className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow transition ${
                                            formulario.exibirSobreposicao
                                                ? "left-6"
                                                : "left-1"
                                        }`}
                                    />
                                </button>
                            </div>

                            <div className={`space-y-4 p-5 ${!formulario.exibirSobreposicao ? "opacity-45" : ""}`}>
                                <label className="block text-sm font-bold text-slate-700">
                                    Repetir a cada
                                    <div className="mt-2 flex items-center gap-2">
                                        <input
                                            type="number"
                                            min={1}
                                            disabled={!formulario.exibirSobreposicao}
                                            value={formulario.intervaloSobreposicaoMinutos}
                                            onChange={(e) =>
                                                atualizar(
                                                    "intervaloSobreposicaoMinutos",
                                                    numeroSeguro(
                                                        e.target.value,
                                                        1,
                                                        10
                                                    )
                                                )
                                            }
                                            className="w-24 rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-violet-500"
                                        />
                                        <span className="text-sm font-medium text-slate-500">
                                            minutos
                                        </span>
                                    </div>
                                </label>

                                <label className="block text-sm font-bold text-slate-700">
                                    Permanecer visível
                                    <div className="mt-2 flex items-center gap-2">
                                        <input
                                            type="number"
                                            min={5}
                                            disabled={!formulario.exibirSobreposicao}
                                            value={formulario.duracaoSobreposicaoSegundos}
                                            onChange={(e) =>
                                                atualizar(
                                                    "duracaoSobreposicaoSegundos",
                                                    numeroSeguro(
                                                        e.target.value,
                                                        5,
                                                        12
                                                    )
                                                )
                                            }
                                            className="w-24 rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-violet-500"
                                        />
                                        <span className="text-sm font-medium text-slate-500">
                                            segundos
                                        </span>
                                    </div>
                                </label>
                            </div>
                        </AdminPanel>
                    </div>

                    {mensagemStatus && (
                        <div className="rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-sm font-bold text-blue-800">
                            {mensagemStatus}
                        </div>
                    )}

                    <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                        {idEdicao && (
                            <AdminButton variante="secundario" onClick={novo}>
                                <span className="flex items-center gap-2">
                                    <X size={17} />
                                    Cancelar
                                </span>
                            </AdminButton>
                        )}

                        <AdminButton
                            variante="secundario"
                            onClick={() => salvar(false)}
                        >
                            <span className="flex items-center gap-2">
                                <Save size={17} />
                                Salvar rascunho
                            </span>
                        </AdminButton>

                        <AdminButton
                            onClick={() => salvar(true)}
                        >
                            <span className="flex items-center gap-2">
                                <MonitorPlay size={17} />
                                Salvar ativo no rascunho
                            </span>
                        </AdminButton>
                    </div>
                </div>

                <aside className="space-y-6 xl:sticky xl:top-[100px] xl:self-start">
                    <AdminPanel className="overflow-hidden">
                        <div className="border-b border-slate-200 px-5 py-4">
                            <h2 className="font-extrabold text-slate-950">
                                Prévia da tela completa
                            </h2>
                            <p className="mt-1 text-xs text-slate-500">
                                Simulação da exibição na TV
                            </p>
                        </div>

                        <div className="bg-slate-100 p-4">
                            <div
                                className={`relative aspect-video overflow-hidden rounded-lg ${
                                    formulario.categoria === "urgente"
                                        ? "bg-[radial-gradient(circle_at_80%_20%,rgba(248,113,113,0.3),transparent_35%),linear-gradient(135deg,#7f1d1d,#b91c1c)]"
                                        : formulario.categoria === "atencao"
                                            ? "bg-[radial-gradient(circle_at_80%_20%,rgba(251,191,36,0.3),transparent_35%),linear-gradient(135deg,#78350f,#b45309)]"
                                            : "bg-[radial-gradient(circle_at_80%_20%,rgba(56,189,248,0.3),transparent_35%),linear-gradient(135deg,#062b68,#0755b8)]"
                                }`}
                            >
                                <div className="absolute inset-0 flex flex-col justify-center px-[8%] text-white">
                                    <span className="mb-3 flex w-fit items-center gap-1.5 rounded-full bg-white/15 px-2.5 py-1 text-[8px] font-extrabold uppercase tracking-[0.15em]">
                                        <NivelIcone size={10} />
                                        {nivelAtual.nome}
                                    </span>
                                    <strong className="max-w-[88%] text-[clamp(14px,2vw,28px)] font-black leading-[0.95] tracking-[-0.04em]">
                                        {formulario.titulo ||
                                            "Título do comunicado"}
                                    </strong>
                                    <p className="mt-3 max-w-[86%] text-[clamp(8px,1vw,14px)] font-medium leading-snug text-white/85">
                                        {formulario.mensagem ||
                                            "A mensagem aparecerá aqui para leitura na televisão."}
                                    </p>
                                </div>
                                <div className="absolute bottom-0 left-0 h-1.5 w-full bg-white/75" />
                            </div>
                        </div>
                    </AdminPanel>

                    <AdminPanel className="overflow-hidden">
                        <div className="border-b border-slate-200 px-5 py-4">
                            <h2 className="font-extrabold text-slate-950">
                                Prévia da sobreposição
                            </h2>
                        </div>

                        <div className="relative aspect-video overflow-hidden bg-[linear-gradient(135deg,#cbd5e1,#94a3b8)] p-3">
                            <div className="absolute inset-0 grid grid-cols-3 gap-2 p-4 opacity-40">
                                <div className="rounded bg-white" />
                                <div className="rounded bg-white" />
                                <div className="rounded bg-white" />
                            </div>
                            <div
                                className={`relative flex gap-2 rounded-lg border border-white/20 p-3 text-white shadow-xl ${
                                    formulario.categoria === "urgente"
                                        ? "bg-red-600/95"
                                        : formulario.categoria === "atencao"
                                            ? "bg-amber-600/95"
                                            : "bg-[#0755b8]/95"
                                }`}
                            >
                                <span className="grid h-7 w-7 shrink-0 place-items-center rounded-md bg-white/15">
                                    <NivelIcone size={14} />
                                </span>
                                <div className="min-w-0">
                                    <strong className="block truncate text-[10px] font-black uppercase">
                                        {formulario.titulo ||
                                            "Título do comunicado"}
                                    </strong>
                                    <p className="mt-1 line-clamp-2 text-[8px] font-medium text-white/85">
                                        {formulario.mensagem ||
                                            "A mensagem aparecerá sobre a mídia atual."}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </AdminPanel>
                </aside>
            </div>

            <AdminPanel>
                <div className="flex flex-col gap-3 border-b border-slate-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                    <div>
                        <h2 className="text-lg font-extrabold text-slate-950">
                            Comunicados cadastrados
                        </h2>
                        <p className="text-sm text-slate-500">
                            Ative, edite ou retire avisos antes da publicação geral.
                        </p>
                    </div>
                    <span className="text-xs font-bold uppercase tracking-[0.1em] text-slate-400">
                        {comunicados.length} registro(s)
                    </span>
                </div>

                <div className="divide-y divide-slate-200">
                    {comunicados.length === 0 && (
                        <div className="p-8 text-center">
                            <MessageSquareWarning
                                size={32}
                                className="mx-auto text-slate-300"
                            />
                            <p className="mt-3 font-bold text-slate-700">
                                Nenhum comunicado cadastrado
                            </p>
                            <p className="mt-1 text-sm text-slate-500">
                                Use o formulário acima para criar o primeiro.
                            </p>
                        </div>
                    )}

                    {comunicados.map((comunicado) => {
                        const nivel =
                            estilosNivel[comunicado.categoria || "normal"]
                        const Icone = nivel.icone
                        const status = dataValida(comunicado)

                        return (
                            <article
                                key={comunicado.id}
                                className="flex flex-col gap-4 p-5 sm:p-6 lg:flex-row lg:items-center"
                            >
                                <span className={`grid h-11 w-11 shrink-0 place-items-center rounded-lg ${nivel.selo}`}>
                                    <Icone size={21} />
                                </span>

                                <div className="min-w-0 flex-1">
                                    <div className="flex flex-wrap items-center gap-2">
                                        <h3 className="font-extrabold text-slate-950">
                                            {comunicado.titulo}
                                        </h3>
                                        <span className={`rounded-full px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-[0.08em] ${nivel.selo}`}>
                                            {nivel.nome}
                                        </span>
                                        <span className={`rounded-full px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-[0.08em] ${
                                            status === "Ativo"
                                                ? "bg-emerald-50 text-emerald-700"
                                                : status === "Agendado"
                                                    ? "bg-blue-50 text-blue-700"
                                                    : "bg-slate-100 text-slate-600"
                                        }`}>
                                            {status}
                                        </span>
                                    </div>
                                    <p className="mt-1 line-clamp-2 text-sm leading-relaxed text-slate-600">
                                        {comunicado.mensagem}
                                    </p>
                                    <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs font-medium text-slate-500">
                                        {comunicado.exibirRotacao && (
                                            <span className="flex items-center gap-1.5">
                                                <MonitorPlay size={13} />
                                                A cada{" "}
                                                {comunicado.intervaloRotacaoMidias || 5} mídias
                                            </span>
                                        )}
                                        {(comunicado.exibirSobreposicao ?? true) && (
                                            <span className="flex items-center gap-1.5">
                                                <Clock3 size={13} />
                                                A cada{" "}
                                                {comunicado.intervaloSobreposicaoMinutos || 10} min
                                            </span>
                                        )}
                                    </div>
                                </div>

                                <div className="flex flex-wrap gap-2">
                                    <button
                                        type="button"
                                        onClick={() => alternar(comunicado)}
                                        className={`rounded-lg border px-3 py-2 text-xs font-extrabold ${
                                            comunicado.ativo
                                                ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                                                : "border-slate-300 bg-white text-slate-600"
                                        }`}
                                    >
                                        {comunicado.ativo ? "Ativo" : "Inativo"}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => editar(comunicado)}
                                        className="rounded-lg border border-slate-300 bg-white p-2.5 text-slate-600 hover:bg-slate-50"
                                        title="Editar"
                                    >
                                        <Pencil size={16} />
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => remover(comunicado)}
                                        className="rounded-lg border border-red-200 bg-red-50 p-2.5 text-red-600 hover:bg-red-100"
                                        title="Excluir"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </article>
                        )
                    })}
                </div>
            </AdminPanel>
        </div>
    )
}
