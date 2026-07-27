import {
    collection,
    doc,
    serverTimestamp,
    writeBatch
} from "firebase/firestore"

import { db } from "@/lib/firebase"
import type {
    AvisoUrgente,
    ConfiguracoesPainel,
    Midia,
    Noticia
} from "@/types/painel"

import { listarMidias } from "./midias"
import { listarNoticias } from "./noticias"
import { listarComunicados } from "./comunicados"

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

export async function publicarPainel({
    configuracoes,
    midias,
    noticias,
    comunicados,
    publicadoPor
}: {
    configuracoes: ConfiguracoesPainel
    midias: Midia[]
    noticias: Noticia[]
    comunicados: AvisoUrgente[]
    publicadoPor?: string
}) {
    const [midiasPublicadas, noticiasPublicadas, comunicadosPublicados] =
        await Promise.all([
        listarMidias(),
        listarNoticias(),
        listarComunicados()
    ])

    const idsMidiasDraft = new Set(midias.map((midia) => midia.id))
    const idsNoticiasDraft = new Set(noticias.map((noticia) => noticia.id))
    const idsComunicadosDraft = new Set(
        comunicados.map((comunicado) => comunicado.id)
    )

    const midiasRemovidas = midiasPublicadas.filter(
        (midia) => !idsMidiasDraft.has(midia.id)
    )
    const noticiasRemovidas = noticiasPublicadas.filter(
        (noticia) => !idsNoticiasDraft.has(noticia.id)
    )
    const comunicadosRemovidos = comunicadosPublicados.filter(
        (comunicado) => !idsComunicadosDraft.has(comunicado.id)
    )

    const totalOperacoes =
        2 +
        midias.length +
        noticias.length +
        comunicados.length +
        midiasRemovidas.length +
        noticiasRemovidas.length +
        comunicadosRemovidos.length

    if (totalOperacoes > 500) {
        throw new Error(
            "A publicação ultrapassa o limite seguro de 500 alterações. Divida o conteúdo antes de publicar."
        )
    }

    const lote = writeBatch(db)

    lote.set(
        doc(db, "configuracoes", "geral"),
        removerCamposUndefined(configuracoes),
        { merge: true }
    )

    for (const midia of midias) {
        const { id, ...dados } = midia
        const jaExiste = midiasPublicadas.some((item) => item.id === id)

        lote.set(
            doc(db, "midias", id),
            removerCamposUndefined({
                ...dados,
                ...(!jaExiste ? { criadoEm: serverTimestamp() } : {})
            })
        )
    }

    for (const midia of midiasRemovidas) {
        lote.delete(doc(db, "midias", midia.id))
    }

    for (const noticia of noticias) {
        const { id, ...dados } = noticia
        const jaExiste = noticiasPublicadas.some((item) => item.id === id)

        lote.set(
            doc(db, "noticias", id),
            removerCamposUndefined({
                ...dados,
                ...(!jaExiste ? { criadoEm: serverTimestamp() } : {})
            })
        )
    }

    for (const noticia of noticiasRemovidas) {
        lote.delete(doc(db, "noticias", noticia.id))
    }

    for (const comunicado of comunicados) {
        const { id, ...dados } = comunicado
        const jaExiste = comunicadosPublicados.some((item) => item.id === id)

        lote.set(
            doc(db, "avisos_urgentes", id),
            removerCamposUndefined({
                ...dados,
                atualizadoEm: serverTimestamp(),
                ...(!jaExiste ? { criadoEm: serverTimestamp() } : {})
            })
        )
    }

    for (const comunicado of comunicadosRemovidos) {
        lote.delete(doc(db, "avisos_urgentes", comunicado.id))
    }

    lote.set(doc(collection(db, "logs_publicacao")), {
        tipo: "publicacao_painel",
        publicadoPor: publicadoPor || "",
        totalMidias: midias.length,
        totalMidiasAtivas: midias.filter((midia) => midia.ativo).length,
        totalNoticias: noticias.length,
        totalNoticiasAtivas: noticias.filter((noticia) => noticia.ativo).length,
        totalComunicados: comunicados.length,
        totalComunicadosAtivos: comunicados.filter(
            (comunicado) => comunicado.ativo
        ).length,
        publicadoEm: serverTimestamp()
    })

    await lote.commit()
}
