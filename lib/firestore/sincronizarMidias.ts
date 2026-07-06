import type { Midia, NovaMidia } from "@/types/painel"

import {
    listarMidias,
    criarMidia,
    atualizarMidia,
    removerMidiaPorId
} from "./midias"

function ehMidiaDraft(id: string) {
    return id.startsWith("draft-")
}

export async function sincronizarMidias(midiasDraft: Midia[]) {
    const midiasPublicadas = await listarMidias()

    for (const midia of midiasDraft) {
        if (ehMidiaDraft(midia.id)) {
            const { id, ...novaMidia } = midia

            await criarMidia(novaMidia as NovaMidia)
            continue
        }

        await atualizarMidia(midia.id, midia)
    }

    for (const midiaPublicada of midiasPublicadas) {
        const continuaNoDraft = midiasDraft.some(
            (midia) => midia.id === midiaPublicada.id
        )

        if (!continuaNoDraft) {
            await removerMidiaPorId(midiaPublicada.id)
        }
    }
}