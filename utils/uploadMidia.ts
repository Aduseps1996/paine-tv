import {
    getDownloadURL,
    ref,
    uploadBytesResumable
} from "firebase/storage"

import { storage } from "@/lib/firebase"
import type { TipoMidia } from "@/types/painel"

const LIMITE_IMAGEM_BYTES = 5 * 1024 * 1024
const LIMITE_VIDEO_BYTES = 80 * 1024 * 1024

const TIPOS_IMAGEM = ["image/jpeg", "image/png", "image/webp"]
const TIPOS_VIDEO = ["video/mp4"]

type ResultadoUploadMidia = {
    url: string
    storagePath: string
    tamanhoBytes: number
    mimeType: string
    nomeArquivo: string
    tamanhoOriginalBytes: number
    tamanhoOtimizadoBytes: number
    foiOtimizado: boolean
}

function limparNomeArquivo(nome: string) {
    return nome
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-zA-Z0-9.\-_]/g, "-")
        .replace(/-+/g, "-")
        .toLowerCase()
}

function validarArquivoMidia(file: File, tipo: TipoMidia) {
    if (tipo === "imagem") {
        if (!TIPOS_IMAGEM.includes(file.type)) {
            throw new Error("Formato de imagem inválido. Use JPG, PNG ou WebP.")
        }

        if (file.size > LIMITE_IMAGEM_BYTES) {
            throw new Error("Imagem muito grande. Limite: 5 MB.")
        }
    }

    if (tipo === "video") {
        if (!TIPOS_VIDEO.includes(file.type)) {
            throw new Error("Formato de vídeo inválido. Use MP4.")
        }

        if (file.size > LIMITE_VIDEO_BYTES) {
            throw new Error("Vídeo muito grande. Limite: 80 MB.")
        }
    }
}

async function otimizarImagem(file: File): Promise<File> {
    if (!file.type.startsWith("image/")) {
        return file
    }

    if (file.type === "image/webp" && file.size <= LIMITE_IMAGEM_BYTES) {
        return file
    }

    const imagem = document.createElement("img")
    const urlTemporaria = URL.createObjectURL(file)

    await new Promise<void>((resolve, reject) => {
        imagem.onload = () => resolve()
        imagem.onerror = () => reject(new Error("Não foi possível ler a imagem."))
        imagem.src = urlTemporaria
    })

    const larguraMaxima = 1920
    const escala = Math.min(1, larguraMaxima / imagem.width)

    const largura = Math.round(imagem.width * escala)
    const altura = Math.round(imagem.height * escala)

    const canvas = document.createElement("canvas")
    canvas.width = largura
    canvas.height = altura

    const contexto = canvas.getContext("2d")

    if (!contexto) {
        URL.revokeObjectURL(urlTemporaria)
        return file
    }

    contexto.drawImage(imagem, 0, 0, largura, altura)

    const blob = await new Promise<Blob | null>((resolve) => {
        canvas.toBlob(resolve, "image/webp", 0.82)
    })

    URL.revokeObjectURL(urlTemporaria)

    if (!blob) return file

    const nomeSemExtensao = file.name.replace(/\.[^/.]+$/, "")
    const nomeWebp = `${nomeSemExtensao}.webp`

    return new File([blob], nomeWebp, {
        type: "image/webp",
        lastModified: Date.now()
    })
}

export async function uploadMidiaParaStorage(
    file: File,
    tipo: TipoMidia,
    onProgresso?: (porcentagem: number) => void
): Promise<ResultadoUploadMidia> {
    const arquivoFinal =
        tipo === "imagem"
            ? await otimizarImagem(file)
            : file

    validarArquivoMidia(arquivoFinal, tipo)

    const pasta = tipo === "video" ? "videos" : "imagens"
    const nomeLimpo = limparNomeArquivo(arquivoFinal.name)
    const nomeArquivo = `${Date.now()}-${nomeLimpo}`
    const storagePath = `midias/${pasta}/${nomeArquivo}`

    const referencia = ref(storage, storagePath)
    const tarefa = uploadBytesResumable(referencia, arquivoFinal, {
        contentType: arquivoFinal.type
    })

    return new Promise((resolve, reject) => {
        tarefa.on(
            "state_changed",
            (snapshot) => {
                const porcentagem = Math.round(
                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                )

                onProgresso?.(porcentagem)
            },
            (erro) => {
                reject(erro)
            },
            async () => {
                const url = await getDownloadURL(tarefa.snapshot.ref)

                resolve({
                    url,
                    storagePath,
                    tamanhoBytes: arquivoFinal.size,
                    mimeType: arquivoFinal.type,
                    nomeArquivo,
                    tamanhoOriginalBytes: file.size,
                    tamanhoOtimizadoBytes: arquivoFinal.size,
                    foiOtimizado: arquivoFinal.size !== file.size || arquivoFinal.type !== file.type
                })
            }
        )
    })
}