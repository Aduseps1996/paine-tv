import { useState } from "react"
import { ContactRound } from "lucide-react"

import type { DadosContatosOficiais, Midia } from "@/types/painel"

type Props = {
    midia: Midia
    onSalvar: (dados: DadosContatosOficiais) => void
    onCancelar: () => void
}

const PADRAO: DadosContatosOficiais = {
    titulo: "Fale com a ADUSEPS",
    subtitulo: "Nossos canais oficiais estão à disposição dos associados.",
    rodape:
        "Salve os contatos oficiais e fale diretamente com o setor que você precisa."
}

export default function PainelContatosOficiais({
    midia,
    onSalvar,
    onCancelar
}: Props) {
    const inicial = {
        ...PADRAO,
        ...(midia.contatosOficiais || {})
    }

    const [titulo, setTitulo] = useState(inicial.titulo)
    const [subtitulo, setSubtitulo] = useState(inicial.subtitulo)
    const [rodape, setRodape] = useState(inicial.rodape)

    function salvar() {
        if (!titulo.trim() || !subtitulo.trim() || !rodape.trim()) {
            alert("Preencha os textos do banner de Contatos Oficiais.")
            return
        }

        onSalvar({
            titulo: titulo.trim(),
            subtitulo: subtitulo.trim(),
            rodape: rodape.trim()
        })
    }

    return (
        <div className="mt-5 rounded-[24px] border border-sky-400/20 bg-sky-500/[0.05] p-5">
            <h4 className="text-lg font-black text-white">
                Textos gerais do banner
            </h4>
            <p className="mt-2 text-sm leading-relaxed text-zinc-400">
                Aqui ficam apenas os textos gerais. Os setores, números, observações e a ordem dos cards são editados na aba Contatos.
            </p>

            <div className="mt-4 flex items-start gap-3 rounded-2xl border border-cyan-400/20 bg-cyan-500/[0.07] p-4">
                <ContactRound className="mt-0.5 h-5 w-5 shrink-0 text-cyan-300" />
                <p className="text-sm leading-relaxed text-cyan-100">
                    Ao alterar um número na aba Contatos, a mudança vale para todos os banners que utilizam aquele contato, inclusive o Plantão Judicial.
                </p>
            </div>

            <div className="mt-5 grid gap-4">
                <label className="text-sm font-bold text-zinc-300">
                    Título principal
                    <input
                        className="mt-2"
                        value={titulo}
                        onChange={(e) => setTitulo(e.target.value)}
                        placeholder="Fale com a ADUSEPS"
                    />
                </label>
                <label className="text-sm font-bold text-zinc-300">
                    Texto de apoio
                    <textarea
                        value={subtitulo}
                        onChange={(e) => setSubtitulo(e.target.value)}
                        className="mt-2 min-h-20 resize-none"
                        placeholder="Nossos canais oficiais..."
                    />
                </label>
                <label className="text-sm font-bold text-zinc-300">
                    Mensagem inferior
                    <textarea
                        value={rodape}
                        onChange={(e) => setRodape(e.target.value)}
                        className="mt-2 min-h-20 resize-none"
                        placeholder="Mensagem exibida no rodapé"
                    />
                </label>
            </div>

            <div className="mt-5 flex flex-wrap gap-3">
                <button
                    type="button"
                    onClick={salvar}
                    className="rounded-2xl bg-sky-500 px-5 py-3 text-sm font-black text-white"
                >
                    Salvar textos
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
