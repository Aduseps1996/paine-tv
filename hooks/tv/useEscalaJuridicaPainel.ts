"use client"

import { useEffect, useMemo, useState } from "react"
import { doc, onSnapshot } from "firebase/firestore"

import { db } from "@/lib/firebase"

type Turno = "manha" | "tarde"
type DiaSemana = "segunda" | "terca" | "quarta" | "quinta" | "sexta"

type Atividade = "atendimento"

type EscalaOperacional = Record<
    DiaSemana,
    Record<Turno, Partial<Record<Atividade, string[]>>>
>

type EscalaDocumento = {
    semana?: string
    escalaSemana?: EscalaOperacional
}

const diasSemana: DiaSemana[] = [
    "segunda",
    "terca",
    "quarta",
    "quinta",
    "sexta"
]

const nomesDias: Record<DiaSemana, string> = {
    segunda: "Segunda",
    terca: "Terça",
    quarta: "Quarta",
    quinta: "Quinta",
    sexta: "Sexta"
}

function obterDiaAtual(): DiaSemana {
    const dia = new Date().getDay()

    if (dia === 1) return "segunda"
    if (dia === 2) return "terca"
    if (dia === 3) return "quarta"
    if (dia === 4) return "quinta"
    if (dia === 5) return "sexta"

    return "segunda"
}

function obterProximoDiaUtil(diaAtual: DiaSemana): DiaSemana {
    const indexAtual = diasSemana.indexOf(diaAtual)
    const proximoIndex = indexAtual >= diasSemana.length - 1 ? 0 : indexAtual + 1

    return diasSemana[proximoIndex]
}

function limparLista(lista?: string[]) {
    if (!Array.isArray(lista)) return []

    return lista
        .map((item) => String(item || "").trim())
        .filter(Boolean)
}

export function useEscalaJuridicaPainel() {
    const [dados, setDados] = useState<EscalaDocumento | null>(null)
    const [carregando, setCarregando] = useState(true)

    useEffect(() => {
        const unsubscribe = onSnapshot(
            doc(db, "escalas_semanais", "semana_atual"),
            (documento) => {
                if (!documento.exists()) {
                    setDados(null)
                    setCarregando(false)
                    return
                }

                const dadosFirebase = documento.data() as EscalaDocumento

                console.log("ESCALA JURIDICA TV:", dadosFirebase)

                setDados(dadosFirebase)
                setCarregando(false)
            },
            () => {
                setDados(null)
                setCarregando(false)
            }
        )

        return () => unsubscribe()
    }, [])

    return useMemo(() => {
        const diaAtual = obterDiaAtual()
        const proximoDia = obterProximoDiaUtil(diaAtual)

        const escalaSemana = dados?.escalaSemana

        const manhaHoje = limparLista(
            escalaSemana?.[diaAtual]?.manha?.atendimento
        )

        const tardeHoje = limparLista(
            escalaSemana?.[diaAtual]?.tarde?.atendimento
        )

        const manhaProximoDia = limparLista(
            escalaSemana?.[proximoDia]?.manha?.atendimento
        )

        const tardeProximoDia = limparLista(
            escalaSemana?.[proximoDia]?.tarde?.atendimento
        )

        const semana = diasSemana.map((dia) => ({
            id: dia,
            nome: nomesDias[dia],
            atual: dia === diaAtual,
            manha: limparLista(escalaSemana?.[dia]?.manha?.atendimento),
            tarde: limparLista(escalaSemana?.[dia]?.tarde?.atendimento)
        }))

        return {
            carregando,
            semanaTexto: dados?.semana || "",
            diaAtual,
            nomeDiaAtual: nomesDias[diaAtual],
            proximoDia,
            nomeProximoDia: nomesDias[proximoDia],
            manhaHoje,
            tardeHoje,
            manhaProximoDia,
            tardeProximoDia,
            semana,
            possuiDados:
                manhaHoje.length > 0 ||
                tardeHoje.length > 0 ||
                semana.some((dia) => dia.manha.length > 0 || dia.tarde.length > 0)
        }
    }, [dados, carregando])
}