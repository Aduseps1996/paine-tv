import { deleteObject, ref } from "firebase/storage"
import { storage } from "@/lib/firebase"
import type { Midia } from "@/types/painel"

export async function excluirMidiaStorage(storagePath?: string) {
    if (!storagePath) return

    try {
        const referencia = ref(storage, storagePath)
        await deleteObject(referencia)
    } catch (erro) {
        // Um arquivo já removido não deve invalidar uma publicação concluída.
        const codigo =
            typeof erro === "object" && erro !== null && "code" in erro
                ? String(erro.code)
                : ""

        if (codigo !== "storage/object-not-found") {
            throw erro
        }
    }
}

export async function excluirArquivosMidiaStorage(
    midia: Pick<
        Midia,
        "storagePath" | "thumbnailStoragePath" | "personalizacaoVisual"
    >
) {
    const caminhos = [
        midia.storagePath,
        midia.thumbnailStoragePath,
        midia.personalizacaoVisual?.fundoStoragePath
    ].filter((caminho): caminho is string => Boolean(caminho))

    await Promise.all(caminhos.map(excluirMidiaStorage))
}
