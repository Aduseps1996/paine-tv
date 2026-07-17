"use client"

import { useEffect, useRef } from "react"

type Props = {
  mostrar: boolean
  nome: string
  matricula: string
  guiche: string
}

declare global {
  interface Window {
    fully?: {
      textToSpeech: (
        texto: string,
        idioma?: string,
        engine?: string,
        queue?: boolean
      ) => void
      stopTextToSpeech?: () => void
    }
  }
}

export default function Chamada({
  mostrar,
  nome,
  matricula,
  guiche
}: Props) {
  const ultimaChamadaFaladaRef = useRef("")
  const timeoutFalaRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const falaAtualRef = useRef<SpeechSynthesisUtterance | null>(null)

  useEffect(() => {
    if (!mostrar) {
      ultimaChamadaFaladaRef.current = ""

      if (timeoutFalaRef.current) {
        clearTimeout(timeoutFalaRef.current)
        timeoutFalaRef.current = null
      }

      if ("speechSynthesis" in window) {
        if (falaAtualRef.current) {
          falaAtualRef.current.onerror = null
          falaAtualRef.current.onend = null
          falaAtualRef.current = null
        }

        if (
          window.speechSynthesis.speaking ||
          window.speechSynthesis.pending
        ) {
          window.speechSynthesis.cancel()
        }
      }

      return
    }

    const possuiVozDoFully = Boolean(window.fully?.textToSpeech)
    const possuiVozDoNavegador = "speechSynthesis" in window

    if (!possuiVozDoFully && !possuiVozDoNavegador) {
      console.warn("Síntese de voz não suportada neste dispositivo.")
      return
    }

    const assinaturaChamada = `${matricula}-${nome}-${guiche}`

    if (ultimaChamadaFaladaRef.current === assinaturaChamada) {
      return
    }

    const matriculaFalavel = matricula
      .trim()
      .split("")
      .filter((caractere) => caractere !== " ")
      .join(" ")

    timeoutFalaRef.current = setTimeout(() => {
      ultimaChamadaFaladaRef.current = assinaturaChamada

      const texto = [
        "Atenção.",
        `Matrícula ${matriculaFalavel}.`,
        nome ? `${nome}.` : "",
        guiche ? `Dirija-se ao ${guiche}.` : ""
      ]
        .filter(Boolean)
        .join(" ")

      // Fully Kiosk no stick
      if (window.fully?.textToSpeech) {
        window.fully.stopTextToSpeech?.()
        window.fully.textToSpeech(texto, "pt_BR")
        return
      }

      // Chrome e outros navegadores
      if ("speechSynthesis" in window) {
        if (falaAtualRef.current) {
          falaAtualRef.current.onerror = null
          falaAtualRef.current.onend = null
          falaAtualRef.current = null
        }

        if (
          window.speechSynthesis.speaking ||
          window.speechSynthesis.pending
        ) {
          window.speechSynthesis.cancel()
        }

        const fala = new SpeechSynthesisUtterance(texto)

        fala.lang = "pt-BR"
        fala.rate = 0.88
        fala.pitch = 1
        fala.volume = 1

        const vozes = window.speechSynthesis.getVoices()

        const vozPortugues =
          vozes.find((voz) => voz.lang.toLowerCase() === "pt-br") ||
          vozes.find((voz) => voz.lang.toLowerCase().startsWith("pt"))

        if (vozPortugues) {
          fala.voice = vozPortugues
        }

        falaAtualRef.current = fala

        fala.onend = () => {
          if (falaAtualRef.current === fala) {
            falaAtualRef.current = null
          }
        }

        fala.onerror = (evento) => {
          if (falaAtualRef.current === fala) {
            falaAtualRef.current = null
          }

          // cancel() gera esses eventos durante trocas de chamada e desmontagem.
          if (evento.error === "canceled" || evento.error === "interrupted") {
            return
          }

          // A voz é opcional; uma falha nela não deve abrir o overlay de erro do Next.
          console.warn(
            `Não foi possível reproduzir a chamada por voz: ${evento.error}`
          )
        }

        window.speechSynthesis.speak(fala)
      }
    }, 900)

    return () => {
      if (timeoutFalaRef.current) {
        clearTimeout(timeoutFalaRef.current)
        timeoutFalaRef.current = null
      }
    }
  }, [mostrar, nome, matricula, guiche])

  useEffect(() => {
    return () => {
      if (timeoutFalaRef.current) {
        clearTimeout(timeoutFalaRef.current)
      }

      if ("speechSynthesis" in window) {
        if (falaAtualRef.current) {
          falaAtualRef.current.onerror = null
          falaAtualRef.current.onend = null
          falaAtualRef.current = null
        }

        if (
          window.speechSynthesis.speaking ||
          window.speechSynthesis.pending
        ) {
          window.speechSynthesis.cancel()
        }
      }
    }
  }, [])

  if (!mostrar) return null

  return (
    <div className="pointer-events-none fixed inset-0 z-50 flex h-dvh w-screen items-center justify-center overflow-hidden p-[clamp(12px,2vh,24px)] animate-[fadeIn_300ms_ease-out]">
      {/* Fundo */}
      <div className="absolute inset-0 bg-black/65 backdrop-blur-[3px]" />

      <div className="absolute left-1/2 top-1/2 h-[min(72vh,620px)] w-[min(72vh,620px)] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#34bcf8]/20 blur-3xl" />

      {/* Cartão da chamada */}
      <div className="relative flex max-h-full w-[min(90vw,860px)] flex-col overflow-hidden rounded-[clamp(20px,3vh,34px)] border border-white/15 bg-[#051630]/96 shadow-[0_30px_100px_rgba(0,0,0,0.78)] animate-[cardEntrada_650ms_cubic-bezier(0.22,1,0.36,1)]">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-black/25" />

        {/* Cabeçalho */}
        <header className="relative shrink-0 border-b border-white/10 bg-white/8 px-[clamp(18px,3vw,32px)] py-[clamp(10px,1.8vh,20px)] text-center backdrop-blur-md">
          <h2 className="text-[clamp(1.45rem,4vh,2.25rem)] font-black uppercase leading-none tracking-wide text-white">
            Chamando agora
          </h2>

          <p className="mt-[clamp(5px,1vh,8px)] text-[clamp(0.58rem,1.5vh,0.75rem)] font-black uppercase tracking-[0.32em] text-[#34bcf8]">
            Atendimento ADUSEPS
          </p>
        </header>

        {/* Conteúdo */}
        <main className="relative flex min-h-0 flex-1 flex-col justify-center px-[clamp(18px,3vw,32px)] py-[clamp(12px,2.2vh,26px)] text-center">
          {/* Matrícula */}
          <section className="shrink-0 rounded-[clamp(18px,3vh,30px)] border border-[#34bcf8]/35 bg-[#0b7fc4]/18 px-[clamp(14px,2vw,24px)] py-[clamp(10px,2vh,20px)] shadow-[0_16px_50px_rgba(52,188,248,0.2)]">
            <p className="mb-[clamp(4px,0.8vh,8px)] text-[clamp(0.65rem,1.7vh,0.875rem)] font-black uppercase tracking-[0.3em] text-[#9be7ff]">
              Matrícula
            </p>

            <h1 className="animate-[pulse_2s_ease-in-out_infinite] text-[clamp(3rem,15vh,7.5rem)] font-black leading-[0.88] tracking-tight text-white drop-shadow-[0_10px_28px_rgba(0,0,0,0.45)]">
              {matricula}
            </h1>
          </section>

          {/* Nome */}
          <section className="mt-[clamp(10px,2vh,24px)] shrink-0">
            <p className="mb-[clamp(3px,0.7vh,7px)] text-[clamp(0.58rem,1.4vh,0.75rem)] font-black uppercase tracking-[0.3em] text-white/45">
              Associado
            </p>

            <h3 className="mx-auto line-clamp-2 max-w-[760px] break-words text-[clamp(1.25rem,5.2vh,3rem)] font-black leading-[1.05] text-white">
              {nome}
            </h3>
          </section>

          <div className="mx-auto my-[clamp(8px,1.7vh,20px)] h-[2px] w-[min(70%,520px)] shrink-0 bg-gradient-to-r from-transparent via-[#34bcf8] to-transparent" />

          {/* Guichê */}
          <section className="shrink-0 rounded-[clamp(16px,2.5vh,24px)] border border-white/10 bg-white/10 px-[clamp(14px,2vw,24px)] py-[clamp(9px,1.7vh,18px)] backdrop-blur-sm">
            <p className="mb-[clamp(3px,0.7vh,7px)] text-[clamp(0.58rem,1.4vh,0.75rem)] font-black uppercase tracking-[0.28em] text-white/45">
              Dirija-se ao
            </p>

            <p className="break-words text-[clamp(1.2rem,4.5vh,2.5rem)] font-black uppercase leading-tight text-[#dff8ff]">
              {guiche}
            </p>
          </section>
        </main>

        <footer className="relative h-[clamp(5px,1vh,8px)] shrink-0 bg-gradient-to-r from-[#34bcf8] via-white/80 to-[#34bcf8]" />
      </div>
    </div>
  )
}
