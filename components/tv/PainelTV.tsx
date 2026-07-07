"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import Chamada from "@/components/Chamada"
import BannerRotativo from "@/components/tv/banner/BannerRotativo"
import RodapeNoticias from "@/components/tv/rodape/RodapeNoticias"
import Image from "next/image"

import {
  doc,
  onSnapshot,
  updateDoc
} from "firebase/firestore"

import { db } from "@/lib/firebase"
import { useOnlineStatus } from "@/hooks/useOnlineStatus"


import type { ConfiguracoesPainel, Midia, Noticia } from "@/types/painel"

type Props = {
  modoPreview?: boolean
  previewConfiguracoes?: ConfiguracoesPainel
  previewMidias?: Midia[]
  previewNoticias?: Noticia[]
}

export default function PainelTV({
  modoPreview = false,
  previewConfiguracoes,
  previewMidias,
  previewNoticias
}: Props) {

  const [mostrarChamada, setMostrarChamada] = useState(false)
  const [nomeAtual, setNomeAtual] = useState("Maria Silva")
  const [matriculaAtual, setMatriculaAtual] = useState("Matrícula 1548")
  const [guicheAtual, setGuicheAtual] = useState("Guichê 2")
  const ultimaChamadaIdRef = useRef("")
  const ultimaRepeticaoIdRef = useRef<number | null>(null)
  const painelIniciadoEm = useRef(Date.now())
  const [nomePainel, setNomePainel] = useState("ADUSEPS")
  const [subtitulo, setSubtitulo] = useState("Painel Institucional")
  const [logo, setLogo] = useState("")
  const [modoLogo, setModoLogo] =
    useState<"transparente" | "fundo" | "card">("fundo")

  const [tamanhoLogoPainel, setTamanhoLogoPainel] =
    useState<"pequeno" | "medio" | "grande">("medio")

  const [slogan, setSlogan] = useState("Informação, acolhimento e compromisso com o associado.")
  const [fallback, setFallback] = useState("/fallbacks/offline.jpg")
  const online = useOnlineStatus()

  const [midiaAtualTv, setMidiaAtualTv] = useState<Midia | null>(null)

  const tocarSomChamada = useCallback(() => {
    try {
      const audio = new Audio("/sons/chamada.mp3")

      audio.volume = 0.7

      audio.play().catch(() => { })
    } catch { }
  }, [])

  const [montado, setMontado] = useState(false)

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setMontado(true)
    }, 0)

    return () => window.clearTimeout(timeout)
  }, [])


  /*  
    STATE PARA TESTAR O FULLSCREEN APENAS EM DESENVOLVIMENTO, APAGAR QUANDO FOR PARA PRODUÇÃO
    const [fullscreenAtivado, setFullscreenAtivado] = useState(false)
  */
  useEffect(() => {
    if (modoPreview) return

    const unsubscribe = onSnapshot(
      doc(db, "configuracoes", "geral"),
      (documento) => {

        if (documento.exists()) {

          const dados = documento.data()

          setNomePainel(dados.nomePainel)
          setSubtitulo(dados.subtitulo)
          setLogo(dados.logo || "")
          setModoLogo(dados.modoLogo || "fundo")
          setTamanhoLogoPainel(dados.tamanhoLogoPainel || "medio")

          setFallback(
            dados.fallback || "/fallbacks/offline.jpg"
          )

          setSlogan(dados.slogan || "")

        }

      }
    )

    return () => unsubscribe()

  }, [modoPreview])

  useEffect(() => {
    if (modoPreview) return

    const unsubscribe = onSnapshot(
      doc(db, "painel_chamadas", "atual"),
      (documento) => {

        if (!documento.exists()) return

        const dados = documento.data()

        if (!dados || dados.ativo !== true) return

        const criadoEmMs =
          dados.criado_em_ms ||
          dados.criado_em?.toMillis?.()

        if (!criadoEmMs) {
          return
        }

        if (criadoEmMs < painelIniciadoEm.current) {
          updateDoc(doc(db, "painel_chamadas", "atual"), {
            ativo: false
          })

          return
        }

        const novaRepeticaoId = Number(dados.repeticao_id || 0)

        const mesmaChamada =
          dados.atendimento_id === ultimaChamadaIdRef.current

        const mesmaRepeticao =
          novaRepeticaoId === ultimaRepeticaoIdRef.current

        if (mesmaChamada && mesmaRepeticao) {
          return
        }

        ultimaChamadaIdRef.current = dados.atendimento_id
        ultimaRepeticaoIdRef.current = novaRepeticaoId

        setNomeAtual(
          (dados.nome || "SEM NOME").toUpperCase()
        )

        setMatriculaAtual(
          dados.matricula
            ? `Matrícula ${dados.matricula}`
            : "Sem matrícula"
        )

        setGuicheAtual(
          dados.profissional
            ? `Atendimento: ${dados.profissional}`
            : "Atendimento"
        )

        setMostrarChamada(true)
        tocarSomChamada()

        setTimeout(async () => {

          setMostrarChamada(false)

          await updateDoc(
            doc(db, "painel_chamadas", "atual"),
            {
              ativo: false
            }
          )
          /* Controle de tempo de chamada */
        }, 15000)

      }
    )

    return () => unsubscribe()

  }, [modoPreview])

  const logoFinal = modoPreview ? previewConfiguracoes?.logo || "" : logo
  const nomePainelFinal = modoPreview ? previewConfiguracoes?.nomePainel || "" : nomePainel
  const subtituloFinal = modoPreview ? previewConfiguracoes?.subtitulo || "" : subtitulo
  const modoLogoFinal = modoPreview ? previewConfiguracoes?.modoLogo || "fundo" : modoLogo
  const tamanhoLogoPainelFinal = modoPreview ? previewConfiguracoes?.tamanhoLogoPainel || "medio" : tamanhoLogoPainel
  const sloganFinal = modoPreview ? previewConfiguracoes?.slogan || "" : slogan
  const fallbackFinal = modoPreview ? previewConfiguracoes?.fallback || fallback : fallback

  const tamanhoLogoClasse =
    tamanhoLogoPainelFinal === "pequeno"
      ? "h-[clamp(2rem,4vw,2.75rem)] w-[clamp(2rem,4vw,2.75rem)]"
      : tamanhoLogoPainelFinal === "grande"
        ? "h-[clamp(3.5rem,7vw,5rem)] w-[clamp(3.5rem,7vw,5rem)]"
        : "h-[clamp(2.75rem,5vw,3.75rem)] w-[clamp(2.75rem,5vw,3.75rem)]"

  const modoLogoClasse =
    modoLogoFinal === "transparente"
      ? "bg-transparent p-0 shadow-none"
      : modoLogoFinal === "card"
        ? "bg-black/25 border border-white/15 p-2 shadow-md backdrop-blur-sm"
        : "bg-white/95 p-2 shadow-md"

  const midiaAtualEhPainelInformativo = midiaAtualTv?.template === "painel"

  return (
    <main
      className={`text-white relative overflow-hidden ${modoPreview ? "h-full w-full" : "w-screen h-screen"
        }`}
    >

      <BannerRotativo
        fallback={fallbackFinal}
        onMidiaAtualChange={setMidiaAtualTv}
        modoPreview={modoPreview}
        previewMidias={previewMidias}
        previewConfiguracoes={previewConfiguracoes}
      />

      <div className="absolute top-0 left-0 w-full h-36 bg-gradient-to-b from-black/75 via-black/35 to-transparent z-10" />

      {/* Overlay para melhorar a legibilidade do conteúdo */}
      <div className="absolute inset-0 bg-black/5 z-[1]" />

      <div className="absolute inset-0 z-[1]" />

      {(
        logoFinal.trim() !== "" ||
        nomePainelFinal.trim() !== "" ||
        subtituloFinal.trim() !== ""
      ) && (

          <div className="absolute top-[clamp(0.75rem,2vh,1.5rem)] left-[clamp(0.75rem,2vw,2rem)] z-10 flex items-center gap-[clamp(0.5rem,1.5vw,1rem)]">

            {logoFinal.trim() !== "" && (
              <div
                className={`flex ${tamanhoLogoClasse} items-center justify-center rounded-xl ${modoLogoClasse}`}
              >
                <Image
                  src={logoFinal.startsWith("/") || logoFinal.startsWith("http") ? logoFinal : `/${logoFinal}`}
                  alt="Logo ADUSEPS"
                  width={120}
                  height={120}
                  priority
                  className="max-h-full max-w-full object-contain"
                />
              </div>
            )}

            {(nomePainelFinal.trim() !== "" || subtituloFinal.trim() !== "") && (
              <div className="flex flex-col">

                {nomePainelFinal.trim() !== "" && (
                  <h1 className="text-[clamp(1.2rem,2.5vw,2rem)] font-black tracking-[0.06em] leading-none text-white drop-shadow-sm">
                    {nomePainelFinal}
                  </h1>
                )}

                {subtituloFinal.trim() !== "" && (
                  <span className="mt-2 text-[clamp(0.65rem,1vw,0.9rem)] font-medium text-white/75 tracking-[0.18em] uppercase">
                    {subtituloFinal}
                  </span>
                )}

              </div>
            )}

          </div>

        )}

      {!modoPreview && (
        <Chamada
          mostrar={mostrarChamada}
          nome={nomeAtual}
          matricula={matriculaAtual}
          guiche={guicheAtual}
        />
      )}

      {!modoPreview && montado && !online && (
        <div className="absolute top-6 right-8 z-50 rounded-xl border border-white/10 bg-black/45 px-4 py-3 text-sm font-bold text-white/90 shadow-2xl backdrop-blur-sm">
          Sem conexão
        </div>
      )}

      {!midiaAtualEhPainelInformativo && (
        <RodapeNoticias
          logo={logoFinal}
          slogan={sloganFinal}
          midiaAtual={midiaAtualTv}
          modoPreview={modoPreview}
          previewNoticias={previewNoticias}
          previewConfiguracoes={previewConfiguracoes}
        />
      )}

    </main>
  )
}
