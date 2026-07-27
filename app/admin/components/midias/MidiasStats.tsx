import type { Midia } from "@/types/painel"
import { CalendarClock, CircleOff, Images, MonitorPlay } from "lucide-react"

import { AdminMetricCard } from "../AdminUI"

type Props = {
    midias: Midia[]
}

export default function MidiasStats({ midias }: Props) {
    const total = midias.length
    const ativas = midias.filter((m) => m.ativo).length
    const inativas = total - ativas
    const programadas = midias.filter((m) => m.exibicaoProgramada).length

    return (
        <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <AdminMetricCard rotulo="Total" valor={total} detalhe="na biblioteca" icone={Images} />
            <AdminMetricCard rotulo="Ativas" valor={ativas} detalhe="na rotação" icone={MonitorPlay} destaque="verde" />
            <AdminMetricCard rotulo="Programadas" valor={programadas} detalhe="com período definido" icone={CalendarClock} destaque="ambar" />
            <AdminMetricCard rotulo="Inativas" valor={inativas} detalhe="fora da exibição" icone={CircleOff} />
        </section>
    )
}
