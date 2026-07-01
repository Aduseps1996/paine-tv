import { doc, getDoc, setDoc } from "firebase/firestore"

import { db } from "@/lib/firebase"
import type { ConfiguracoesPainel } from "@/types/painel"

const caminhoConfiguracoes = ["configuracoes", "geral"] as const

export async function buscarConfiguracoesPainel() {
    const documento = await getDoc(doc(db, ...caminhoConfiguracoes))

    if (!documento.exists()) {
        return null
    }

    return documento.data() as ConfiguracoesPainel
}

export async function salvarConfiguracoesPainel(
    configuracoes: ConfiguracoesPainel
) {
    await setDoc(
        doc(db, ...caminhoConfiguracoes),
        configuracoes,
        { merge: true }
    )
}
