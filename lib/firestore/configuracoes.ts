import { doc, getDoc, setDoc } from "firebase/firestore"

import { db } from "@/lib/firebase"
import type { ConfiguracoesPainel } from "@/types/painel"

const caminhoConfiguracoes = ["configuracoes", "geral"] as const

function removerCamposUndefined<T>(valor: T): T {
    if (Array.isArray(valor)) {
        return valor.map(removerCamposUndefined) as T
    }

    if (
        valor !== null &&
        typeof valor === "object" &&
        Object.getPrototypeOf(valor) === Object.prototype
    ) {
        return Object.fromEntries(
            Object.entries(valor)
                .filter(([, conteudo]) => conteudo !== undefined)
                .map(([chave, conteudo]) => [
                    chave,
                    removerCamposUndefined(conteudo)
                ])
        ) as T
    }

    return valor
}

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
        removerCamposUndefined(configuracoes),
        { merge: true }
    )
}
