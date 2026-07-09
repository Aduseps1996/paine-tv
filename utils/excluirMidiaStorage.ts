import { deleteObject, ref } from "firebase/storage"
import { storage } from "@/lib/firebase"

export async function excluirMidiaStorage(storagePath?: string) {
    if (!storagePath) return

    try {
        const referencia = ref(storage, storagePath)
        await deleteObject(referencia)
    } catch (erro) {
        console.error("Erro ao excluir do Storage:", erro)
    }
}