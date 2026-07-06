import type { Noticia, NovaNoticia } from "@/types/painel"

import {
    listarNoticias,
    criarNoticia,
    atualizarNoticia,
    removerNoticiaPorId
} from "./noticias"

function ehNoticiaDraft(id: string) {
    return id.startsWith("draft-")
}

export async function sincronizarNoticias(noticiasDraft: Noticia[]) {
    const noticiasPublicadas = await listarNoticias()

    for (const noticia of noticiasDraft) {
        if (ehNoticiaDraft(noticia.id)) {
            const { id, ...novaNoticia } = noticia

            await criarNoticia(novaNoticia as NovaNoticia)
            continue
        }

        await atualizarNoticia(noticia.id, noticia)
    }

    for (const noticiaPublicada of noticiasPublicadas) {
        const continuaNoDraft = noticiasDraft.some(
            (noticia) => noticia.id === noticiaPublicada.id
        )

        if (!continuaNoDraft) {
            await removerNoticiaPorId(noticiaPublicada.id)
        }
    }
}