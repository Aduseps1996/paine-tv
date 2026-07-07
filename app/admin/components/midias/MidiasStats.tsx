import type { Midia } from "@/types/painel"

type Props = {
    midias: Midia[]
}

export default function MidiasStats({ midias }: Props) {
    const total = midias.length
    const ativas = midias.filter((m) => m.ativo).length
    const inativas = total - ativas
    const programadas = midias.filter((m) => m.exibicaoProgramada).length

    const cards = [
        { label: "Total", value: total, desc: "mídias no rascunho" },
        { label: "Ativas", value: ativas, desc: "em exibição" },
        { label: "Inativas", value: inativas, desc: "fora da rotação" },
        { label: "Programadas", value: programadas, desc: "com período definido" }
    ]

    return (
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {cards.map((card) => (
                <div
                    key={card.label}
                    className="rounded-[26px] border border-white/10 bg-zinc-900/80 p-5 shadow-[0_16px_40px_rgba(0,0,0,0.18)]"
                >
                    <p className="text-xs font-black uppercase tracking-[0.25em] text-zinc-500">
                        {card.label}
                    </p>

                    <div className="mt-4 flex items-end gap-2">
                        <span className="text-5xl font-black">
                            {card.value}
                        </span>
                    </div>

                    <p className="mt-3 text-sm text-zinc-400">
                        {card.desc}
                    </p>
                </div>
            ))}
        </section>
    )
}