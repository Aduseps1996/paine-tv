import {
    addDoc,
    collection,
    deleteDoc,
    doc,
    getDocs,
    serverTimestamp,
    updateDoc
} from "firebase/firestore"

import { db } from "@/lib/firebase"
import type { AvisoUrgente, NovoAvisoUrgente } from "@/types/painel"

const colecaoComunicados = "avisos_urgentes"

function semUndefined<T extends Record<string, unknown>>(dados: T) {
    return Object.fromEntries(
        Object.entries(dados).filter(([, valor]) => valor !== undefined)
    )
}

function dataEmMilissegundos(valor: unknown) {
    if (
        valor &&
        typeof valor === "object" &&
        "toMillis" in valor &&
        typeof valor.toMillis === "function"
    ) {
        return valor.toMillis()
    }

    return 0
}

export async function listarComunicados() {
    const resultado = await getDocs(collection(db, colecaoComunicados))

    return resultado.docs
        .map((documento) => ({
            id: documento.id,
            ...documento.data()
        })) as AvisoUrgente[]
}

export async function criarComunicado(comunicado: NovoAvisoUrgente) {
    const referencia = await addDoc(collection(db, colecaoComunicados), {
        ...semUndefined(comunicado),
        criadoEm: serverTimestamp(),
        atualizadoEm: serverTimestamp()
    })

    return referencia.id
}

export async function atualizarComunicado(
    id: string,
    comunicado: Partial<NovoAvisoUrgente>
) {
    await updateDoc(doc(db, colecaoComunicados, id), {
        ...semUndefined(comunicado),
        atualizadoEm: serverTimestamp()
    })
}

export async function excluirComunicado(id: string) {
    await deleteDoc(doc(db, colecaoComunicados, id))
}

export function ordenarComunicados(lista: AvisoUrgente[]) {
    return [...lista].sort((a, b) => {
        const prioridade = {
            urgente: 0,
            atencao: 1,
            normal: 2
        }

        const diferencaPrioridade =
            prioridade[a.categoria || "normal"] -
            prioridade[b.categoria || "normal"]

        if (diferencaPrioridade !== 0) return diferencaPrioridade

        return (
            dataEmMilissegundos(b.atualizadoEm || b.criadoEm) -
            dataEmMilissegundos(a.atualizadoEm || a.criadoEm)
        )
    })
}
