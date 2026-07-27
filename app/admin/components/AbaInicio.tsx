import {
    ArrowRight,
    CircleCheck,
    ContactRound,
    Eye,
    ImageIcon,
    MessageSquareWarning,
    Newspaper,
    RefreshCw,
    Settings2
} from "lucide-react"

import type { AbaAdmin } from "@/types/painel"
import {
    AdminButton,
    AdminMetricCard,
    AdminPageHeader,
    AdminPanel
} from "./AdminUI"
import { usePainelDraftContext } from "../context/PainelDraftContext"

type Props = {
    navegarPara: (aba: AbaAdmin) => void
}

type Atalho = {
    titulo: string
    descricao: string
    acao: string
    aba: AbaAdmin
    icone: typeof ImageIcon
    classeIcone: string
}

const atalhos: Atalho[] = [
    {
        titulo: "Mídias",
        descricao: "Cadastre, programe e organize o conteúdo exibido na rotação.",
        acao: "Gerenciar mídias",
        aba: "midias",
        icone: ImageIcon,
        classeIcone: "bg-blue-50 text-[#0d6efd]"
    },
    {
        titulo: "Notícias",
        descricao: "Atualize as mensagens e categorias exibidas no rodapé da TV.",
        acao: "Gerenciar notícias",
        aba: "noticias",
        icone: Newspaper,
        classeIcone: "bg-cyan-50 text-cyan-700"
    },
    {
        titulo: "Comunicados",
        descricao: "Publique avisos em tela cheia, sobreposição ou nos dois formatos.",
        acao: "Gerenciar comunicados",
        aba: "comunicados",
        icone: MessageSquareWarning,
        classeIcone: "bg-amber-50 text-amber-700"
    },
    {
        titulo: "Configurações",
        descricao: "Ajuste identidade, clima, rodapé, logo e elementos gerais da TV.",
        acao: "Abrir configurações",
        aba: "configuracao-painel",
        icone: Settings2,
        classeIcone: "bg-violet-50 text-violet-700"
    }
]

export default function AbaInicio({ navegarPara }: Props) {
    const {
        draft,
        temAlteracoesPendentes,
        publicando
    } = usePainelDraftContext()

    const totalMidias = draft.midias.length
    const midiasAtivas = draft.midias.filter((midia) => midia.ativo).length
    const totalNoticias = draft.noticias.length
    const noticiasAtivas = draft.noticias.filter((noticia) => noticia.ativo).length
    const contatos = draft.configuracoes.contatos ?? []
    const contatosAtivos = contatos.filter((contato) => contato.ativo).length
    const contatosNoBanner = contatos.filter(
        (contato) => contato.ativo && contato.mostrarNoBanner
    ).length

    return (
        <div className="space-y-5">
            <AdminPageHeader
                titulo="Visão geral"
                descricao="Acompanhe o estado do painel e acesse rapidamente as áreas de administração."
                acoes={(
                    <AdminButton
                        onClick={() => navegarPara("previa-tv")}
                    >
                        <span className="flex items-center gap-2">
                            <Eye size={17} />
                            {publicando ? "Publicando..." : "Revisar e publicar"}
                        </span>
                    </AdminButton>
                )}
            />

            <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <AdminMetricCard
                    rotulo="Status da TV"
                    valor={temAlteracoesPendentes ? "Pendente" : "Sincronizada"}
                    detalhe={temAlteracoesPendentes
                        ? "Há alterações aguardando revisão"
                        : "O rascunho está igual à versão publicada"}
                    icone={temAlteracoesPendentes ? RefreshCw : CircleCheck}
                    destaque={temAlteracoesPendentes ? "ambar" : "verde"}
                />

                <AdminMetricCard
                    rotulo="Mídias"
                    valor={midiasAtivas}
                    detalhe={`${totalMidias} cadastradas no total`}
                    icone={ImageIcon}
                />

                <AdminMetricCard
                    rotulo="Notícias"
                    valor={noticiasAtivas}
                    detalhe={`${totalNoticias} cadastradas no rodapé`}
                    icone={Newspaper}
                />

                <AdminMetricCard
                    rotulo="Contatos"
                    valor={contatosAtivos}
                    detalhe={`${contatosNoBanner} visíveis no banner`}
                    icone={ContactRound}
                />
            </section>

            <AdminPanel
                className={`overflow-hidden ${
                    temAlteracoesPendentes
                        ? "border-amber-200 bg-amber-50/70"
                        : "border-emerald-200 bg-emerald-50/70"
                }`}
            >
                <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex min-w-0 items-start gap-3">
                        <span
                            className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-white shadow-sm ${
                                temAlteracoesPendentes
                                    ? "text-amber-700"
                                    : "text-emerald-700"
                            }`}
                        >
                            {temAlteracoesPendentes
                                ? <RefreshCw size={21} />
                                : <CircleCheck size={21} />}
                        </span>

                        <div>
                            <h2 className="font-extrabold text-slate-950">
                                {temAlteracoesPendentes
                                    ? "Existem alterações ainda não publicadas"
                                    : "Painel atualizado"}
                            </h2>
                            <p className="mt-1 text-sm leading-relaxed text-slate-600">
                                {temAlteracoesPendentes
                                    ? "Abra a Prévia da TV, compare o rascunho com a versão publicada e confirme a atualização."
                                    : "A versão em edição está sincronizada com o conteúdo exibido na TV."}
                            </p>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={() => navegarPara("previa-tv")}
                        className="flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 shadow-sm transition hover:border-[#0d6efd] hover:text-[#0d6efd]"
                    >
                        Abrir Prévia da TV
                        <ArrowRight size={17} />
                    </button>
                </div>
            </AdminPanel>

            <AdminPanel>
                <div className="border-b border-slate-200 px-5 py-4">
                    <h2 className="text-xl font-extrabold tracking-[-0.025em] text-slate-950">
                        Acesso rápido
                    </h2>
                    <p className="mt-1 text-sm text-slate-600">
                        Escolha a área que deseja atualizar.
                    </p>
                </div>

                <div className="grid gap-4 p-4 sm:p-5 md:grid-cols-2 xl:grid-cols-4">
                    {atalhos.map((atalho) => {
                        const Icone = atalho.icone

                        return (
                            <button
                                key={atalho.aba}
                                type="button"
                                onClick={() => navegarPara(atalho.aba)}
                                className="group flex min-h-[190px] flex-col rounded-xl border border-slate-200 bg-white p-5 text-left transition hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-[0_12px_30px_rgba(15,23,42,0.08)]"
                            >
                                <span className={`grid h-11 w-11 place-items-center rounded-xl ${atalho.classeIcone}`}>
                                    <Icone size={21} />
                                </span>

                                <h3 className="mt-4 text-base font-extrabold text-slate-950">
                                    {atalho.titulo}
                                </h3>
                                <p className="mt-1.5 flex-1 text-sm leading-relaxed text-slate-600">
                                    {atalho.descricao}
                                </p>

                                <span className="mt-4 flex items-center gap-2 text-sm font-bold text-[#0d6efd]">
                                    {atalho.acao}
                                    <ArrowRight
                                        size={16}
                                        className="transition-transform group-hover:translate-x-1"
                                    />
                                </span>
                            </button>
                        )
                    })}
                </div>
            </AdminPanel>

            <section className="grid gap-4 lg:grid-cols-3">
                <AdminPanel className="p-5">
                    <span className="text-xs font-bold uppercase tracking-[0.12em] text-slate-500">
                        Conteúdo ativo
                    </span>
                    <p className="mt-2 text-2xl font-extrabold tracking-tight text-slate-950">
                        {midiasAtivas + noticiasAtivas}
                    </p>
                    <p className="mt-1 text-sm text-slate-600">
                        Mídias e notícias habilitadas no rascunho.
                    </p>
                </AdminPanel>

                <AdminPanel className="p-5">
                    <span className="text-xs font-bold uppercase tracking-[0.12em] text-slate-500">
                        Biblioteca
                    </span>
                    <p className="mt-2 text-2xl font-extrabold tracking-tight text-slate-950">
                        {totalMidias + totalNoticias}
                    </p>
                    <p className="mt-1 text-sm text-slate-600">
                        Itens disponíveis para organizar e programar.
                    </p>
                </AdminPanel>

                <AdminPanel className="p-5">
                    <span className="text-xs font-bold uppercase tracking-[0.12em] text-slate-500">
                        Fluxo de publicação
                    </span>
                    <p className="mt-2 text-base font-extrabold text-slate-950">
                        Edite, revise e publique
                    </p>
                    <p className="mt-1 text-sm leading-relaxed text-slate-600">
                        A atualização final continua centralizada na Prévia da TV.
                    </p>
                </AdminPanel>
            </section>
        </div>
    )
}
