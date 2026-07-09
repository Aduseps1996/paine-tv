export type MetadadosVideo = {
    duracaoVideo: number
    larguraVideo: number
    alturaVideo: number
    orientacaoVideo: "vertical" | "horizontal" | "quadrado"
    thumbnailFile: File
}

export function gerarMetadadosVideo(file: File): Promise<MetadadosVideo> {
    return new Promise((resolve, reject) => {
        const video = document.createElement("video")
        const url = URL.createObjectURL(file)

        video.preload = "metadata"
        video.muted = true
        video.playsInline = true
        video.src = url

        video.onloadedmetadata = () => {
            video.currentTime = Math.min(1, video.duration / 2)
        }

        video.onseeked = () => {
            const canvas = document.createElement("canvas")
            canvas.width = video.videoWidth
            canvas.height = video.videoHeight

            const ctx = canvas.getContext("2d")
            if (!ctx) {
                URL.revokeObjectURL(url)
                reject(new Error("Não foi possível gerar thumbnail."))
                return
            }

            ctx.drawImage(video, 0, 0, canvas.width, canvas.height)

            canvas.toBlob(
                (blob) => {
                    URL.revokeObjectURL(url)

                    if (!blob) {
                        reject(new Error("Não foi possível gerar thumbnail."))
                        return
                    }

                    const largura = video.videoWidth
                    const altura = video.videoHeight

                    const orientacaoVideo =
                        largura > altura
                            ? "horizontal"
                            : altura > largura
                                ? "vertical"
                                : "quadrado"

                    resolve({
                        duracaoVideo: Math.round(video.duration),
                        larguraVideo: largura,
                        alturaVideo: altura,
                        orientacaoVideo,
                        thumbnailFile: new File(
                            [blob],
                            `${file.name.replace(/\.[^/.]+$/, "")}-thumb.webp`,
                            { type: "image/webp" }
                        )
                    })
                },
                "image/webp",
                0.82
            )
        }

        video.onerror = () => {
            URL.revokeObjectURL(url)
            reject(new Error("Não foi possível ler o vídeo."))
        }
    })
}