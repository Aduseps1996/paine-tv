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
import type { Noticia, NovaNoticia } from "@/types/painel"

const colecaoNoticias = "noticias"

export async function listarNoticias() {
    const consulta = query(
        collection(db, colecaoNoticias),
        orderBy("ordem", "asc")
    )

    const resultado = await getDocs(consulta)

    return resultado.docs.map((documento) => ({
        id: documento.id,
        ...documento.data()
    })) as Noticia[]
}

export async function criarNoticia(noticia: NovaNoticia) {
    await addDoc(collection(db, colecaoNoticias), {
        ...noticia,
        criadoEm: serverTimestamp()
    })
}

export async function removerNoticiaPorId(id: string) {
    await deleteDoc(doc(db, colecaoNoticias, id))
}

export async function atualizarNoticia(id: string, dados: Partial<Noticia>) {
    await updateDoc(doc(db, colecaoNoticias, id), dados)
}
