import {
    addDoc,
    collection,
    deleteDoc,
    doc,
    getDocs,
    orderBy,
    query,
    serverTimestamp,
    updateDoc
} from "firebase/firestore"

import { db } from "@/lib/firebase"
import type { Midia, NovaMidia } from "@/types/painel"

const colecaoMidias = "midias"

export async function listarMidias() {
    const consulta = query(
        collection(db, colecaoMidias),
        orderBy("ordem", "asc")
    )

    const resultado = await getDocs(consulta)

    return resultado.docs.map((documento) => ({
        id: documento.id,
        ...documento.data()
    })) as Midia[]
}

export async function criarMidia(midia: NovaMidia) {
    await addDoc(collection(db, colecaoMidias), {
        ...midia,
        criadoEm: serverTimestamp()
    })
}

export async function removerMidiaPorId(id: string) {
    await deleteDoc(doc(db, colecaoMidias, id))
}

export async function atualizarMidia(id: string, dados: Partial<Midia>) {
    await updateDoc(doc(db, colecaoMidias, id), dados)
}
