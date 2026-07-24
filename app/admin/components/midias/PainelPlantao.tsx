import { useState } from "react"

import type { DadosPlantao, Midia } from "@/types/painel"
import { CONTATO_PLANTAO_ID } from "@/utils/contatosPainel"

type Props = {
    midia: Midia
    onSalvar: (dados: DadosPlantao) => void
    onCancelar: () => void
}

const PADRAO: DadosPlantao = {
    titulo: "Plantão Judicial",
    chamadaPadrao: "Urgências não esperam até segunda-feira.",
    descricaoPadrao:
        "Atuação em situações urgentes relacionadas ao direito à saúde durante finais de semana e feriados.",
    contatoId: CONTATO_PLANTAO_ID,
    rodape:
        "Nosso compromisso é com a justiça social e a defesa da dignidade humana.",
    avisoEspecialAtivo: false,
    ocasiaoEspecial: "",
    chamadaEspecial: "",
    descricaoEspecial: "",
    inicioAvisoEspecial: "",
    fimAvisoEspecial: ""
}

export default function PainelPlantao({
    midia,
    onSalvar,
    onCancelar
}: Props) {
    const dadosIniciais = {
        ...PADRAO,
        ...(midia.plantao || {})
    }

    const [titulo, setTitulo] = useState(dadosIniciais.titulo)
    const [chamadaPadrao, setChamadaPadrao] =
        useState(dadosIniciais.chamadaPadrao)
    const [descricaoPadrao, setDescricaoPadrao] =
        useState(dadosIniciais.descricaoPadrao)
    const [rodape, setRodape] = useState(dadosIniciais.rodape)
    const [avisoEspecialAtivo, setAvisoEspecialAtivo] =
        useState(Boolean(dadosIniciais.avisoEspecialAtivo))
    const [ocasiaoEspecial, setOcasiaoEspecial] =
        useState(dadosIniciais.ocasiaoEspecial || "")
    const [chamadaEspecial, setChamadaEspecial] =
        useState(dadosIniciais.chamadaEspecial || "")
    const [descricaoEspecial, setDescricaoEspecial] =
        useState(dadosIniciais.descricaoEspecial || "")
    const [inicioAvisoEspecial, setInicioAvisoEspecial] =
        useState(dadosIniciais.inicioAvisoEspecial || "")
    const [fimAvisoEspecial, setFimAvisoEspecial] =
        useState(dadosIniciais.fimAvisoEspecial || "")

    function salvar() {
        if (
            !titulo.trim() ||
            !chamadaPadrao.trim() ||
            !descricaoPadrao.trim()
        ) {
            alert("Preencha os campos principais do Plantão Judicial.")
            return
        }

        if (avisoEspecialAtivo) {
            if (
                !ocasiaoEspecial.trim() ||
                !chamadaEspecial.trim() ||
                !descricaoEspecial.trim() ||
                !inicioAvisoEspecial ||
                !fimAvisoEspecial
            ) {
                alert("Preencha todo o aviso especial e o período de exibição.")
                return
            }

            if (new Date(fimAvisoEspecial) <= new Date(inicioAvisoEspecial)) {
                alert("O fim do aviso especial precisa ser maior que o início.")
                return
            }
        }

        onSalvar({
            titulo: titulo.trim(),
            chamadaPadrao: chamadaPadrao.trim(),
            descricaoPadrao: descricaoPadrao.trim(),
            contatoId: dadosIniciais.contatoId || CONTATO_PLANTAO_ID,
            rodape: rodape.trim(),
            avisoEspecialAtivo,
            ocasiaoEspecial: ocasiaoEspecial.trim(),
            chamadaEspecial: chamadaEspecial.trim(),
            descricaoEspecial: descricaoEspecial.trim(),
            inicioAvisoEspecial,
            fimAvisoEspecial
        })
    }

    return (
        <div className="mt-5 rounded-[24px] border border-cyan-400/20 bg-cyan-500/[0.05] p-5">
            <div>
                <h4 className="text-lg font-black text-white">
                    Editar conteúdo do plantão
                </h4>
                <p className="mt-2 text-sm text-zinc-400">
                    A mensagem padrão permanece salva. O aviso especial assume durante o período definido e depois sai sozinho.
                </p>
            </div>

            <div className="mt-5 grid gap-4">
                <input
                    value={titulo}
                    onChange={(e) => setTitulo(e.target.value)}
                    placeholder="Título"
                />
                <input
                    value={chamadaPadrao}
                    onChange={(e) => setChamadaPadrao(e.target.value)}
                    placeholder="Chamada padrão"
                />
                <textarea
                    value={descricaoPadrao}
                    onChange={(e) => setDescricaoPadrao(e.target.value)}
                    className="min-h-24 resize-none"
                    placeholder="Descrição padrão"
                />
                <div className="rounded-2xl border border-emerald-400/20 bg-emerald-500/[0.06] p-4 text-sm leading-relaxed text-emerald-200">
                    O WhatsApp deste banner é o contato <strong>Plantão Judicial</strong> da aba Contatos. Alterando lá, o número muda em todos os banners.
                </div>
                <textarea
                    value={rodape}
                    onChange={(e) => setRodape(e.target.value)}
                    className="min-h-20 resize-none"
                    placeholder="Mensagem inferior"
                />
            </div>

            <div className="mt-5 border-t border-white/10 pt-5">
                <label className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-zinc-950/60 px-4 py-4">
                    <span>
                        <span className="block font-bold text-white">
                            Aviso especial temporário
                        </span>
                        <span className="mt-1 block text-xs text-zinc-500">
                            Para feriado, recesso ou outra ocasião específica.
                        </span>
                    </span>
                    <input
                        type="checkbox"
                        checked={avisoEspecialAtivo}
                        onChange={(e) => setAvisoEspecialAtivo(e.target.checked)}
                    />
                </label>

                {avisoEspecialAtivo && (
                    <div className="mt-4 grid gap-4">
                        <input
                            value={ocasiaoEspecial}
                            onChange={(e) => setOcasiaoEspecial(e.target.value)}
                            placeholder="Ocasião especial"
                        />
                        <input
                            value={chamadaEspecial}
                            onChange={(e) => setChamadaEspecial(e.target.value)}
                            placeholder="Chamada especial"
                        />
                        <textarea
                            value={descricaoEspecial}
                            onChange={(e) => setDescricaoEspecial(e.target.value)}
                            className="min-h-24 resize-none"
                            placeholder="Descrição especial"
                        />
                        <div className="grid gap-4 sm:grid-cols-2">
                            <label className="text-sm font-bold text-zinc-300">
                                Início do aviso
                                <input
                                    type="datetime-local"
                                    value={inicioAvisoEspecial}
                                    onChange={(e) => setInicioAvisoEspecial(e.target.value)}
                                    className="mt-2"
                                />
                            </label>
                            <label className="text-sm font-bold text-zinc-300">
                                Fim do aviso
                                <input
                                    type="datetime-local"
                                    value={fimAvisoEspecial}
                                    onChange={(e) => setFimAvisoEspecial(e.target.value)}
                                    className="mt-2"
                                />
                            </label>
                        </div>
                    </div>
                )}
            </div>

            <div className="mt-5 flex flex-wrap gap-3">
                <button
                    type="button"
                    onClick={salvar}
                    className="rounded-2xl bg-sky-500 px-5 py-3 text-sm font-black text-white"
                >
                    Salvar conteúdo
                </button>
                <button
                    type="button"
                    onClick={onCancelar}
                    className="rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-3 text-sm font-black text-zinc-300"
                >
                    Cancelar
                </button>
            </div>
        </div>
    )
}
