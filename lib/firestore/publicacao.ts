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
    noticias
}: {
    configuracoes: ConfiguracoesPainel
    midias: Midia[]
    noticias: Noticia[]
}) {
    await salvarConfiguracoesPainel(configuracoes)
    await sincronizarMidias(midias)
    await sincronizarNoticias(noticias)
}