import { addDoc, collection, serverTimestamp } from "firebase/firestore"

import { db } from "@/lib/firebase"
import type {
    ConfiguracoesPainel,
    Midia,
    Noticia
} from "@/types/painel"

import { salvarConfiguracoesPainel } from "./configuracoes"
import { sincronizarMidias } from "./sincronizarMidias"
import { sincronizarNoticias } from "./sincronizarNoticias"

export async function publicarPainel({
    configuracoes,
    midias,
    noticias,
    publicadoPor
}: {
    configuracoes: ConfiguracoesPainel
    midias: Midia[]
    noticias: Noticia[]
    publicadoPor?: string
}) {
    await salvarConfiguracoesPainel(configuracoes)
    await sincronizarMidias(midias)
    await sincronizarNoticias(noticias)

    await addDoc(collection(db, "logs_publicacao"), {
        tipo: "publicacao_painel",
        publicadoPor: publicadoPor || "",
        totalMidias: midias.length,
        totalMidiasAtivas: midias.filter((midia) => midia.ativo).length,
        totalNoticias: noticias.length,
        totalNoticiasAtivas: noticias.filter((noticia) => noticia.ativo).length,
        publicadoEm: serverTimestamp()
    })
}